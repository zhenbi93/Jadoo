# Jadoo

The local development setup uses Node.js 24 and npm workspaces.

- `apps/web` uses React, Vite, React Router, Zustand, and Tailwind CSS.
- `apps/api` uses Express, TypeScript, and Zod and exposes a JSON health check.

## Getting started

```sh
nvm use
npm ci
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173). The home page shows the static My trips dashboard. The [status page](http://127.0.0.1:5173/status) requests `/api/health` through Vite's proxy to verify that the frontend can reach the backend. You can also visit the [Express health endpoint](http://127.0.0.1:3001/api/health) directly.

The API listens on port `3001` by default. To change it, run `npm run setup`, edit `apps/api/.env`, and restart the dev servers. Run `npm run build` to build both apps.

## Destination data

The trip form uses a local snapshot of [GeoNames](https://www.geonames.org/export) data under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The data is filtered to the `cities500` list and grouped by country and first-level administrative division. Places without a matching division appear under “No province / region listed.”

To rebuild the country and city lists, download `countryInfo.txt`, `admin1CodesASCII.txt`, and `cities500.zip` from the [GeoNames export directory](https://download.geonames.org/export/dump/) into one folder and run `python3 scripts/prepare-trip-locations.py /path/to/downloads`.
