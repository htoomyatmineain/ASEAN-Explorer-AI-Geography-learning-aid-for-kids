# ASEAN Explorer

A cartoon, game-like app that teaches kids about the 10 ASEAN countries, backed by
a Prolog reasoning engine instead of hard-coded quiz answers.

## Run both halves

```
# Terminal 1 — backend (SWI-Prolog)
swipl -s backend/prolog/server.pl -g start_server        # → http://localhost:4000

# Terminal 2 — frontend (React + Vite)
cd frontend
npm install
cp .env.example .env
npm start                             # → http://localhost:3000
```

## Structure

Feature-based on both sides of the stack — `backend/prolog/features/<feature>/`
and `frontend/src/features/<feature>/` each hold one game feature's whole
vertical slice (rules + route on the backend; components + page + API calls on
the frontend). Details, diagrams, and the reasoning behind it are in `docs/`:

- [`docs/01-asean-explorer-prolog-kb.md`](docs/01-asean-explorer-prolog-kb.md) — the Prolog knowledge base: facts, rules, worked queries.
- [`docs/02-asean-explorer-architecture.md`](docs/02-asean-explorer-architecture.md) — frontend choice, folder structure, how React and Prolog talk to each other.
- [`docs/03-asean-explorer-team-workflow.md`](docs/03-asean-explorer-team-workflow.md) — splitting work across a 5-person team, Git workflow.
- [`docs/04-asean-explorer-features.md`](docs/04-asean-explorer-features.md) — what the app does, feature by feature.

## Frontend deployment

The frontend uses Vite. On Vercel choose root directory `frontend`, preset **Vite**, build command `npm run build`, and output directory `dist`. Set `VITE_API_URL` to the separately hosted HTTPS backend URL. See [frontend setup](frontend/README.md) for Node requirements and local preview commands.
