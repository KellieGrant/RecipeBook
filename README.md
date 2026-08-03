# RecipeBook

A responsive recipe manager for collecting, organizing, and cooking from your favorite recipes. RecipeBook combines a focused desktop workspace with a mobile-friendly experience and supports both browser-local persistence and optional Supabase-backed accounts.

## Features

- Create, edit, and delete recipes with ingredients, instructions, cook time, servings, and an image
- Search recipes by name and browse by category
- Save favorites for quick access
- Create custom categories and select multiple recipes for bulk deletion
- Personalize the interface with dark mode, compact cards, and image visibility settings
- Use the app across desktop and mobile layouts
- Keep data in the browser by default or configure Supabase authentication and cloud persistence

## Tech stack

| Area | Technology |
| --- | --- |
| UI | React 19 |
| Build tooling | Vite 8 |
| Styling | CSS |
| Authentication and data | Supabase (optional) |
| Local persistence | Web Storage API |
| Code quality | ESLint |

## Getting started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm

### Installation

```bash
git clone <repository-url>
cd RecipeBook
npm install
cp .env.example .env.local
npm run dev
```

Open the local URL shown by Vite, typically `http://localhost:5173`.

Supabase credentials are optional. If they are omitted, RecipeBook runs in local mode and stores account and recipe data in the browser.

## Configuration

RecipeBook reads the following client-side environment variables:

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | No | URL of the Supabase project |
| `VITE_SUPABASE_ANON_KEY` | No | Public anonymous key for the Supabase project |

Add values to `.env.local` when cloud persistence is required:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Only use Supabase's public anonymous key in the client. Never add a service-role key or other server secret to a `VITE_` variable. Local environment files are excluded from version control.

### Supabase setup

1. Create a Supabase project.
2. Run [`docs/supabase-schema.sql`](docs/supabase-schema.sql) in the Supabase SQL editor.
3. Enable the desired email authentication flow in the Supabase dashboard.
4. Add the project URL and anonymous key to `.env.local`.
5. Restart the development server after changing environment variables.

The supplied schema enables row-level security so authenticated users can access only their own application data. Review and test database policies before using the app in production.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload |
| `npm run build` | Create a production build in `dist/` and prepare the hosting adapter |
| `npm run lint` | Run ESLint across the project |
| `npm run preview` | Preview the production build locally |

## Project structure

```text
RecipeBook/
├── docs/                 # Database schema and project documentation
├── public/               # Static assets
├── scripts/              # Build and hosting preparation scripts
├── src/
│   ├── assets/           # Bundled images and artwork
│   ├── components/       # Shared navigation and recipe UI
│   ├── data/             # Starter recipes and default settings
│   ├── lib/              # External service clients
│   ├── pages/            # Authentication, category, editor, and settings views
│   ├── services/         # Local and Supabase persistence adapters
│   ├── utils/            # Browser storage helpers
│   ├── App.jsx           # Application state and page orchestration
│   └── main.jsx          # React entry point
├── .env.example          # Environment variable template
├── package.json          # Dependencies and npm scripts
└── vite.config.js        # Vite configuration
```

## Data and persistence

Without Supabase configuration, the app derives a local account from the sign-in email and persists data in `localStorage`. This mode is convenient for development and personal use on a single browser, but it is not a substitute for production authentication and does not synchronize across devices.

When Supabase is configured, email and password authentication is handled by Supabase. Recipe data is cached locally for a responsive experience and synchronized through the backend service layer.

To clear development data, use the reset option in **Settings** or clear the site's storage in the browser. Resetting data cannot be undone.

## Production build

Create and verify an optimized build before deployment:

```bash
npm run lint
npm run build
npm run preview
```

The generated `dist/` directory contains the deployable application and hosting metadata. Configure the same environment variables in the target hosting platform when Supabase is enabled.

## Contributing

1. Create a branch for the change.
2. Keep changes focused and follow the existing component and styling conventions.
3. Run `npm run lint` and `npm run build`.
4. Open a pull request that explains the change and includes screenshots for visual updates.

## Security

Do not commit credentials or `.env.local`. Report security concerns privately to the project maintainer rather than opening a public issue.
