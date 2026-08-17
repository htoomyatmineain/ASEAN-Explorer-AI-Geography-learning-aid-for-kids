# ASEAN Explorer — Backend (SWI-Prolog)

The reasoning layer, served as a JSON HTTP API. No Node.js required — see
[`docs/02-asean-explorer-architecture.md`](../docs/02-asean-explorer-architecture.md)
§2 for why.

## Run it

```
swipl backend/prolog/server.pl
```

API is then live at `http://localhost:4000`.

## Layout

Feature-based — see [`docs/02-asean-explorer-architecture.md`](../docs/02-asean-explorer-architecture.md)
§3 for the full breakdown. Short version:

- `facts.pl`, `core.pl` — shared static data + shared reasoning, used by every feature.
- `kb.pl` — loads `facts.pl`, `core.pl`, then every feature's `rules.pl`.
- `server.pl` — starts the HTTP server, loads every feature's `routes.pl`.
- `features/<feature>/rules.pl` + `routes.pl` — one folder per game feature. This is
  what each person on the team (docs/03) owns.

## Reference

The full predicate reference, worked example queries, and progress tracker live in
[`docs/01-asean-explorer-prolog-kb.md`](../docs/01-asean-explorer-prolog-kb.md).
