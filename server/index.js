const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const recipes = require('./recipes.json');
const usersData = require('./users.json');

let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
   if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set in production');
   }
   JWT_SECRET = 'dev-secret-change-in-production';
}
const usersPath = path.join(__dirname, 'users.json');

const app = express();
const apiRouter = express.Router();

app.use(cors());
app.use(express.json());

// Helper: read users from file (to get latest after changes)
const readUsers = () => {
   const raw = fs.readFileSync(usersPath, 'utf8');
   return JSON.parse(raw);
};

// Helper: write users to file
const writeUsers = data => {
   fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));
};

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

   const data = readUsers();
   const exists = data.users.some(u => u.username.toLowerCase() === username.toLowerCase());
   if (exists) {
      return res.status(400).json({ error: 'Username already taken' });
   }

   const hash = await bcrypt.hash(password, 10);
   const user = {
      id: data.nextUserId++,
      username: username.trim(),
      passwordHash: hash,
   };
   data.users.push(user);
   writeUsers(data);

   const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
   );

   res.status(201).json({
      token,
      user: { id: user.id, username: user.username },
   });
});

// POST /auth/login - Login user
apiRouter.post('/auth/login', async (req, res) => {
   const { username, password } = req.body;
   if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
   }

   const data = readUsers();
   const user = data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
   if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
   }

   const valid = await bcrypt.compare(password, user.passwordHash);
   if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password' });
   }

   const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
   );

   res.json({
      token,
      user: { id: user.id, username: user.username },
   });
});

// All recipe routes below require authentication
apiRouter.get('/recipes', authMiddleware, (req, res) => {
   const userId = req.user.id;
   let userRecipes = recipes.recipes.filter(r => (r.userId ?? null) === userId);
   const limit = parseInt(req.query._limit, 10);
   if (!Number.isNaN(limit) && limit > 0) {
      userRecipes = userRecipes.slice(0, limit);
   }
   res.json(userRecipes);
});

apiRouter.get('/recipes/:id', authMiddleware, (req, res) => {
   const { id } = req.params;
   const userId = req.user.id;
   const recipe = recipes.recipes.find(r => r.id.toString() === id);

   if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
   }
   if ((recipe.userId ?? null) !== userId) {
      return res.status(403).json({ error: 'Not authorized to view this recipe' });
   }

   res.json(recipe);
});

// POST - Add new recipe (requires auth)
apiRouter.post('/recipes', authMiddleware, (req, res) => {
   const userId = req.user.id;
   const newRecipe = req.body;

   const maxId = recipes.recipes.reduce((max, r) => Math.max(max, r.id || 0), 0);
   const recipe = {
      ...newRecipe,
      id: maxId + 1,
      userId,
   };

   recipes.recipes.push(recipe);
   fs.writeFileSync(
      path.join(__dirname, 'recipes.json'),
      JSON.stringify(recipes, null, 2)
   );

   res.status(201).json(recipe);
});

// DELETE a recipe by id
apiRouter.delete('/recipes/:id', authMiddleware, (req, res) => {
   const { id } = req.params;
   const userId = req.user.id;

   const index = recipes.recipes.findIndex(r => r.id.toString() === id);

   if (index === -1) {
      return res.status(404).json({ error: 'Recipe not found' });
   }

   const recipe = recipes.recipes[index];
   if ((recipe.userId ?? null) !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this recipe' });
   }

   const deletedRecipe = recipes.recipes.splice(index, 1);
   fs.writeFileSync(
      path.join(__dirname, 'recipes.json'),
      JSON.stringify(recipes, null, 2)
   );

   res.json({
      message: 'Recipe deleted successfully',
      recipe: deletedRecipe[0],
   });
});

// PUT (update) a recipe by id
apiRouter.put('/recipes/:id', authMiddleware, (req, res) => {
   const { id } = req.params;
   const userId = req.user.id;
   const updates = req.body;

   const index = recipes.recipes.findIndex(r => r.id.toString() === id);

   if (index === -1) {
      return res.status(404).json({ error: 'Recipe not found' });
   }

   const recipe = recipes.recipes[index];
   if ((recipe.userId ?? null) !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this recipe' });
   }

   recipes.recipes[index] = {
      ...recipe,
      ...updates,
      id: parseInt(id, 10),
      userId,
   };

   fs.writeFileSync(
      path.join(__dirname, 'recipes.json'),
      JSON.stringify(recipes, null, 2)
   );

   res.json(recipes.recipes[index]);
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
