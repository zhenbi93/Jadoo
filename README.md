# Travel Notebook

The local development setup uses Node.js 24 and npm workspaces.

- `apps/web` uses React, Vite, React Router, Zustand, and Tailwind CSS.
- `apps/api` uses Express, TypeScript, and Zod and exposes a JSON health check.

## Getting started

```sh
nvm use
npm ci
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173). The page requests `/api/health` through Vite's proxy to verify that the frontend can reach the backend. You can also visit the [Express health endpoint](http://127.0.0.1:3001/api/health) directly.

The API listens on port `3001` by default. To change it, run `npm run setup`, edit `apps/api/.env`, and restart the dev servers. Run `npm run build` to build both apps.
