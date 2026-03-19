const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
   if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set in production');
   }
   JWT_SECRET = 'dev-secret-change-in-production';
}

// ---------- Postgres connection (Supabase) ----------
const pool = new Pool({
   connectionString: process.env.DATABASE_URL,
   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const app = express();
const apiRouter = express.Router();

app.use(cors());
app.use(express.json());

// Auth middleware: verify JWT and attach user to req
const authMiddleware = (req, res, next) => {
   const authHeader = req.headers.authorization;
   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
   }
   const token = authHeader.split(' ')[1];
   try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
   } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
   }
};

// ---------- API routes (mounted at /api so frontend can use /api/... in dev and production) ----------
// POST /auth/register - Create new user
apiRouter.post('/auth/register', async (req, res) => {
   const { username, password } = req.body;
   if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
   }
   if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
   }

   try {
      const client = await pool.connect();
      try {
         const existing = await client.query(
            'SELECT id FROM users WHERE LOWER(username) = LOWER($1)',
            [username],
         );
         if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Username already taken' });
         }

         const hash = await bcrypt.hash(password, 10);
         const insertResult = await client.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
            [username.trim(), hash],
         );
         const user = insertResult.rows[0];

         const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' },
         );

         return res.status(201).json({
            token,
            user,
         });
      } finally {
         client.release();
      }
   } catch (err) {
      console.error('Register error', err);
      return res.status(500).json({ error: 'Internal server error' });
   }
});

// POST /auth/login - Login user
apiRouter.post('/auth/login', async (req, res) => {
   const { username, password } = req.body;
   if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
   }

   try {
      const client = await pool.connect();
      try {
         const result = await client.query(
            'SELECT id, username, password_hash FROM users WHERE LOWER(username) = LOWER($1)',
            [username],
         );
         if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
         }
         const user = result.rows[0];

         const valid = await bcrypt.compare(password, user.password_hash);
         if (!valid) {
            return res.status(401).json({ error: 'Invalid username or password' });
         }

         const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' },
         );

         return res.json({
            token,
            user: { id: user.id, username: user.username },
         });
      } finally {
         client.release();
      }
   } catch (err) {
      console.error('Login error', err);
      return res.status(500).json({ error: 'Internal server error' });
   }
});

// Helper to convert DB row to the shape the frontend expects
const mapRecipeRowToApi = row => {
   const imageUrl = row.image_url || null;
   return {
      id: row.id,
      title: row.title,
      type: row.type,
      time: row.time,
      quantity: row.quantity ?? null,
      description: row.description,
      instructions: row.instructions,
      imgUrl: imageUrl,
      imageUrl,
      creator: {
         name: row.creator_name || 'Unknown',
         ingredients: row.ingredients,
      },
      ingredients: row.ingredients,
      userId: row.user_id,
   };
};

// All recipe routes below require authentication
apiRouter.get('/recipes', authMiddleware, async (req, res) => {
   const userId = req.user.id;
   const limit = parseInt(req.query._limit, 10);

   try {
      const client = await pool.connect();
      try {
         const params = [userId];
         let sql =
            'SELECT id, user_id, title, type, time, quantity, image_url, description, ingredients, instructions, created_at, updated_at, NULL::text AS creator_name FROM recipes WHERE user_id = $1 ORDER BY created_at DESC';
         if (!Number.isNaN(limit) && limit > 0) {
            sql += ' LIMIT $2';
            params.push(limit);
         }
         const result = await client.query(sql, params);
         return res.json(result.rows.map(mapRecipeRowToApi));
      } finally {
         client.release();
      }
   } catch (err) {
      console.error('List recipes error', err);
      return res.status(500).json({ error: 'Internal server error' });
   }
});

apiRouter.get('/recipes/:id', authMiddleware, async (req, res) => {
   const { id } = req.params;
   const userId = req.user.id;

   try {
      const client = await pool.connect();
      try {
         const result = await client.query(
            'SELECT id, user_id, title, type, time, quantity, image_url, description, ingredients, instructions, created_at, updated_at, NULL::text AS creator_name FROM recipes WHERE id = $1 AND user_id = $2',
            [id, userId],
         );
         if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
         }
         return res.json(mapRecipeRowToApi(result.rows[0]));
      } finally {
         client.release();
      }
   } catch (err) {
      console.error('Get recipe error', err);
      return res.status(500).json({ error: 'Internal server error' });
   }
});

// POST - Add new recipe (requires auth)
apiRouter.post('/recipes', authMiddleware, async (req, res) => {
   const userId = req.user.id;
   const body = req.body || {};

   const imageUrl = body.imgUrl || body.imageUrl || null;
   const ingredients = body.ingredients || body.creator?.ingredients || '';
   const quantity = body.quantity || null;

   try {
      const client = await pool.connect();
      try {
         const insertResult = await client.query(
            `INSERT INTO recipes
               (user_id, title, type, time, quantity, image_url, description, ingredients, instructions)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id, user_id, title, type, time, quantity, image_url, description, ingredients, instructions, created_at, updated_at, NULL::text AS creator_name`,
            [
               userId,
               body.title,
               body.type,
               body.time,
               quantity,
               imageUrl,
               body.description,
               ingredients,
               body.instructions,
            ],
         );
         const row = insertResult.rows[0];
         return res.status(201).json(mapRecipeRowToApi(row));
      } finally {
         client.release();
      }
   } catch (err) {
      console.error('Create recipe error', err);
      return res.status(500).json({ error: 'Internal server error' });
   }
});

// DELETE a recipe by id
apiRouter.delete('/recipes/:id', authMiddleware, async (req, res) => {
   const { id } = req.params;
   const userId = req.user.id;

   try {
      const client = await pool.connect();
      try {
         const result = await client.query(
            'DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId],
         );
         if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
         }
         return res.json({ message: 'Recipe deleted successfully' });
      } finally {
         client.release();
      }
   } catch (err) {
      console.error('Delete recipe error', err);
      return res.status(500).json({ error: 'Internal server error' });
   }
});

// PUT (update) a recipe by id
apiRouter.put('/recipes/:id', authMiddleware, async (req, res) => {
   const { id } = req.params;
   const userId = req.user.id;
   const body = req.body || {};

   const imageUrl = body.imgUrl || body.imageUrl || null;
   const ingredients = body.ingredients || body.creator?.ingredients || '';
   const quantity = body.quantity || null;

   try {
      const client = await pool.connect();
      try {
         const result = await client.query(
            `UPDATE recipes
               SET title = $1,
                   type = $2,
                   time = $3,
                   quantity = $4,
                   image_url = $5,
                   description = $6,
                   ingredients = $7,
                   instructions = $8,
                   updated_at = NOW()
             WHERE id = $9 AND user_id = $10
             RETURNING id, user_id, title, type, time, quantity, image_url, description, ingredients, instructions, created_at, updated_at, NULL::text AS creator_name`,
            [
               body.title,
               body.type,
               body.time,
               quantity,
               imageUrl,
               body.description,
               ingredients,
               body.instructions,
               id,
               userId,
            ],
         );

         if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
         }

         return res.json(mapRecipeRowToApi(result.rows[0]));
      } finally {
         client.release();
      }
   } catch (err) {
      console.error('Update recipe error', err);
      return res.status(500).json({ error: 'Internal server error' });
   }
});

app.use('/api', apiRouter);

// Production: serve built React app from same origin so /api works without CORS/config
app.get('/', (req, res) => {
   res.send('Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server listening on port ${PORT}`);
});
