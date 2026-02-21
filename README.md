# RecipeBook

A simple full-stack app for saving and managing your own recipes. Register, log in, then add, edit, and delete recipes. Includes search, filters (meal type, time, ingredients), and light/dark theme.

## Stack

- **Frontend:** React 19, Vite, React Router, Tailwind CSS, React Toastify
- **Backend:** Node.js, Express, JWT auth, bcrypt, file-based storage (JSON)

## Run locally

1. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

2. **Optional: production auth**
   For production (or to use your own secret), create `server/.env`:
   ```bash
   cp server/.env.example server/.env
   ```
   Edit `server/.env` and set a strong `JWT_SECRET`. If you skip this, the server uses a dev default (development only).

3. **Start dev (frontend + backend)**
   ```bash
   npm run dev
   ```
   - App: [http://localhost:3000](http://localhost:3000)  
   - API: [http://localhost:5000](http://localhost:5000) (proxied via `/api`)

4. **Build for production**
   ```bash
   npm run build
   ```
   Serve the `dist` folder with any static host. Run the server separately with `NODE_ENV=production` and `JWT_SECRET` set in the environment.

## Deploy and link from your portfolio

The app is set up so **one service** serves both the React app and the API. That makes it easy to deploy and share a single URL (e.g. for a portfolio project link).

### Deploy (e.g. Render)

1. **Push your repo** to GitHub (or connect it to Render another way).

2. **Create a Web Service** on [Render](https://render.com) (or similar: Railway, Fly.io, etc.):
   - Connect the RecipeBook repo.
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
   - **Environment:**
     - `NODE_ENV` = `production`
     - `JWT_SECRET` = a long random string (generate one and keep it secret)

3. After deploy, you get a URL like `https://recipebook-xxxx.onrender.com`. That’s the live app; no extra config is needed because the same server serves the UI and the API.

### Add it to your portfolio

- **Link:** Add a project card or list item that links to your deployed URL (e.g. “RecipeBook – full-stack recipe app” → `https://your-app.onrender.com`).
- **Optional:** Use a subdomain or custom domain on your portfolio (e.g. `recipes.yourportfolio.com`) if your host supports it and point it at the same deployed URL.

No frontend changes are required: the app uses `/api` for requests, and in production the server handles both `/api/*` and the static React build from one origin.

## Test / demo

- **Register** a new account or use an existing one.
- Seed recipes are assigned to user id `1`. If you are the first user (id 1), you’ll see them under “My Recipes” and on the home page after logging in.
- From **My Recipes** you can search, filter, open a recipe, and add, edit, or delete your own.

## Project layout

- `src/` – React app (pages, components, contexts, utils)
- `server/` – Express API (`index.js`), `recipes.json`, `users.json`
- `vite.config.js` – dev server proxy: `/api` → `http://localhost:5000`

## License

Private / use as you like.
