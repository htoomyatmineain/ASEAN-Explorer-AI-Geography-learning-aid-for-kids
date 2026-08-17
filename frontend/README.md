# ASEAN Explorer — Frontend (React)

## Setup

```
npm install
cp .env.example .env   # points REACT_APP_API_URL at the backend, defaults to localhost:4000
npm start
```

Dev server runs at `http://localhost:3000` and expects the Prolog backend
(`backend/prolog/server.pl`) running at `http://localhost:4000` — see the root
[`README.md`](../README.md) to run both together.

## Layout

Feature-based — see [`docs/02-asean-explorer-architecture.md`](../docs/02-asean-explorer-architecture.md)
§3 for the full breakdown. Short version:

- `src/app/` — app shell: routing (`App.jsx`, `routes.jsx`). `src/index.jsx` is the
  actual entry point (kept at `src/` root because Create React App requires that
  exact path).
- `src/features/<feature>/` — one folder per game feature: its own `components/`,
  its page (`*.page.jsx`), and its own `*Api.js` calling the backend. This is what
  each person on the team (docs/03) owns.
- `src/shared/` — the one "by type" folder left, deliberately: `api/httpClient.js`
  (the fetch wrapper every feature's `*Api.js` builds on), reusable `components/`
  (buttons, cards, mascot, layout), `state/GameContext.jsx` (cross-feature score
  state), `styles/`, `hooks/`, `utils/`.

Styling is Tailwind CSS + Framer Motion, not Bootstrap — see
[`docs/02-asean-explorer-architecture.md`](../docs/02-asean-explorer-architecture.md) §1 for why.
