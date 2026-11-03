# ASEAN Explorer — Frontend (React + Vite)

## Setup

```
npm install
cp .env.example .env   # points VITE_API_URL at the backend, defaults to localhost:4000
npm start
```

Dev server runs at `http://localhost:3000` and expects the Prolog backend
(`backend/prolog/server.pl`) running at `http://localhost:4000` — see the root
[`README.md`](../README.md) to run both together.

## Layout

Feature-based — see [`docs/02-asean-explorer-architecture.md`](../docs/02-asean-explorer-architecture.md)
§3 for the full breakdown. Short version:

- `src/app/` — app shell: routing (`App.jsx`, `routes.jsx`). `src/index.jsx` is the
  actual entry point, loaded by the root `index.html`.
- `src/features/<feature>/` — one folder per game feature: its own `components/`,
  its page (`*.page.jsx`), and its own `*Api.js` calling the backend. This is what
  each person on the team (docs/03) owns.
- `src/shared/` — the one "by type" folder left, deliberately: `api/httpClient.js`
  (the fetch wrapper every feature's `*Api.js` builds on), reusable `components/`
  (buttons, cards, mascot, layout), `state/GameContext.jsx` (cross-feature score
  state), `styles/`, `hooks/`, `utils/`.

Styling is Tailwind CSS + Framer Motion, not Bootstrap — see
[`docs/02-asean-explorer-architecture.md`](../docs/02-asean-explorer-architecture.md) §1 for why.

## Build and deploy

Use Node.js 20.19+ or 22.12+ (Node 24 is supported). Run `npm run build` to produce `dist/`, and `npm run preview` to inspect the production build locally.

For Vercel, use root directory `frontend`, framework preset **Vite**, build command `npm run build`, and output directory `dist`. Set `VITE_API_URL` to your public HTTPS Prolog API URL before building. The API must be hosted separately; omitting the variable defaults to localhost:4000. Client environment variables are public and must not contain secrets. `vercel.json` handles direct navigation to React Router pages.

The development server uses port 3000. Vite replaces Create React App; `react-scripts`, CRA test/eject commands, and `REACT_APP_API_URL` are no longer used. No frontend test suite is configured.
