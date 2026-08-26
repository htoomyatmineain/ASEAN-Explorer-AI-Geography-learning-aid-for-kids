# Plan: Fix the Prolog backend so it actually returns real data

Saved as a reference doc so this can be picked up later — not yet
implemented. See `INTEGRATION_NOTES.md` for how the backend got into its
current state; this is the plan to finish it.

## Context

The React frontend is fully built and already calls a specific set of
backend routes (`GET /country/:name`, `POST /guess`, `POST /neighbor_check`,
`POST /capital_match`, `GET /explain/neighbor`, `GET /explain/membership`,
`POST /score`, `GET /recommend`, `GET /scores`). The Prolog backend that's
supposed to answer those calls has regressed: a teammate reorganized it from
the feature-folder layout (built earlier in this project) back into a flat
layout (`kb.pl` loads `core.pl`, `facts.pl`, `rules.pl`, `session.pl`
directly; `server.pl` defines every route handler itself). That reorg is a
reasonable structural choice on its own, but it left `rules.pl` and
`session.pl` as empty placeholder comments — so today almost every route
either 503s (`/country`, because `country_info/2` doesn't exist) or 501s
(`/guess`, `/neighbor_check` are hardcoded stubs), and four routes
(`/capital_match`, `/explain/*`, `/score`, `/recommend`, `/scores`) don't
exist in `server.pl` at all.

The actual working Prolog logic for six of the seven game features already
exists — it's just sitting unused in `backend/prolog/features/*/`, orphaned
by the reorg. This isn't a rewrite: it's porting that already-correct logic
into the files the flat layout actually loads, filling in the routes that
are missing from `server.pl`, deleting the now-dead `features/` folder, and
correcting the two docs / the backend README that still describe the
abandoned feature-folder layout. `docs/01` (the KB doc) already matches the
flat layout as-is and needs no changes. Journey Mode stays out of scope — it
was never built on either the frontend or backend side.

Decision already made: **keep the flat layout going forward** (not revert to
feature folders).

## Approach

### 1. `backend/prolog/rules.pl` — port 5 features' worth of rules

Replace the placeholder with the merged content of these orphaned files
(verbatim logic, just consolidated into one file with a banner comment per
feature referencing the matching `docs/01` §4.x section instead of "owned by
Person N"):

- `features/explore_map/rules.pl` → `country_info/2`
- `features/guess_game/rules.pl` → `matches_clue/2`, `guess_country/2`
- `features/neighbor_game/rules.pl` → `find_non_neighbors/3`, `is_real_neighbor/2`
- `features/capital_match/rules.pl` → `check_capital_match/3` (keep the cut + its explanatory comment)
- `features/explain_mode/rules.pl` → `explain_neighbor/3`, `explain_membership/2`

No predicate-name collisions, no reordering needed — everything these call
(`capital/2`, `currency/2`, `flag_emoji/2`, `subregion/2`, `famous_for/2`,
`language/2`, `asean_country/1`, `neighbor/2`) already lives in `facts.pl`/
`core.pl`, both loaded before `rules.pl` in `kb.pl`.

### 2. `backend/prolog/session.pl` — port dashboard's session file

Port `features/dashboard/session.pl` verbatim: `:- dynamic student_score/2.`,
`activity_for/2`, `set_score/2`, `weakest_topic/1`, `recommend_activity/1`,
`needs_practice/1`. Self-contained, no dependency concerns.

### 3. `backend/prolog/server.pl` — fill in the missing routes

- Add two missing `use_module` lines: `library(http/http_parameters)` (needed
  by the explain routes' query-param reading) and `library(yall)` (needed by
  `neighbor_check`'s `maplist([S,A]>>atom_string(A,S), ...)` lambda).
- Replace the two hardcoded 501 stubs (`guess_handler/1`,
  `neighbor_check_handler/1`) with real handlers that parse the JSON body and
  call `guess_country/2` / `find_non_neighbors/3`, matching the shapes already
  built into `frontend/src/features/guess-game/guessGameApi.js` and
  `neighbor-game/neighborGameApi.js` exactly. Port the `parse_clues/2` helper
  from `features/guess_game/routes.pl` alongside `guess_handler/1` (it's
  request-parsing, not domain reasoning, so it belongs in `server.pl`).
- Add the missing handlers, ported from their `features/*/routes.pl`
  counterparts, matching the live frontend `*Api.js` call sites exactly:
  - `POST /capital_match` → `handle_capital_match/1`
  - `GET /explain/neighbor`, `GET /explain/membership` → `handle_explain_neighbor/1`, `handle_explain_membership/1`
  - `POST /score`, `GET /recommend`, `GET /scores` → `handle_set_score/1`, `handle_recommend/1`, `handle_all_scores/1`
- Keep the existing per-handler `cors_enable` convention (redundant with the
  global `set_setting(http:cors,[*])`, but that's the established house style
  — keep it consistent rather than "fixing" it).
- Small cleanup: `handle_country/2`'s `catch(..., existence_error(procedure,_), ...503...)`
  wrapper becomes dead code once `country_info/2` reliably exists — safe to
  remove so a real 404 is what a caller sees instead of an unreachable catch.
- Do **not** add `:- initialization(start_server).` — `start_server` stays
  manual on purpose, because `run_tests.pl`/`test_script.pl`/`test_error.pl`
  all load `kb.pl` directly and would break/hang if `server.pl` auto-started
  an HTTP server as a load-time side effect.

### 4. Delete `backend/prolog/features/`

All 14 files across 7 subfolders, once their content is ported above.
Nothing loads this folder anymore; leaving it would be dead code that
misleads a future reader into thinking it's still live. `journey_mode/`'s two
files contained no real logic (a design-note comment + a hardcoded 501) —
nothing lost by deleting them too.

### 5. `backend/README.md`

Replace the feature-folder layout description with the flat one (`facts.pl`
+ `core.pl` shared, `rules.pl` all game-feature reasoning, `session.pl`
dynamic score state, `kb.pl` single load point, `server.pl` HTTP server +
every handler). Fix a pre-existing gap while touching this file: the "Run
it" section never mentions that `swipl backend/prolog/server.pl` loads but
does **not** start listening — add the `start_server.` step (or mention
`start.sh` as the scripted alternative).

### 6. `docs/02-asean-explorer-architecture.md` — targeted fix, not a rewrite

Three spots only:
- §2.2's `server.pl` code sample (currently shows `:- [features/x/routes].`
  per feature + auto-`initialization`) → replace with a description of the
  flat `server.pl` (one file, all handlers, manual `start_server`).
- The `explore_map/routes.pl` / `guess_game/routes.pl` code blocks right
  after it → drop or replace with the flat-file description.
- §3's folder-structure tree → replace the `backend/prolog/` subtree with the
  flat one; no `features/` on the backend side. **The frontend
  `features/<name>/` tree in the same section is correct and stays
  untouched.**

Everything else in `docs/02` (React-vs-Bootstrap, §2.1 diagram, §2.3 Node
bridge, §2.4 frontend API pattern, §2.5 session/DB notes, §4 dev flow, §5
summary) is frontend-only or layout-agnostic — leave as-is.

### 7. `docs/03-asean-explorer-team-workflow.md` — one targeted fix

The Persons 2–5 ownership table currently maps each person to their own
`backend/prolog/features/<feature>/` folder — no longer true. Change their
"files they mainly touch" to describe *sections within* the shared
`rules.pl` and shared `server.pl` instead of a folder they alone own. Also
fix the paragraph right below the table, which currently argues per-feature
folders eliminate merge-conflict risk in a shared `rules.pl` — that risk is
back now that `rules.pl`/`server.pl` are shared files again, so the
paragraph needs to say so instead of claiming the opposite. Branching model,
PR process, weekly rhythm, `.gitignore` guidance, and the frontend side of
the ownership table are all unaffected — leave as-is.

`docs/01-asean-explorer-prolog-kb.md` needs no changes — it already
describes the flat layout in its §6 file-layout table.

## Critical files

- `backend/prolog/rules.pl` (rewrite)
- `backend/prolog/session.pl` (rewrite)
- `backend/prolog/server.pl` (edit: add imports, replace 2 stub handlers, add 6 new handlers)
- `backend/prolog/features/` (delete entirely, 7 subfolders / 14 files)
- `backend/README.md` (edit)
- `docs/02-asean-explorer-architecture.md` (targeted edits, 3 spots)
- `docs/03-asean-explorer-team-workflow.md` (targeted edit, ownership table + one paragraph)

## Verification

SWI-Prolog needs to be run on your own machine to verify this (it wasn't
available in the environment this plan was drafted in).

1. **KB loads cleanly**: `cd backend/prolog && swipl kb.pl` — clean `?-`
   prompt, no `existence_error` warnings. Spot-check at the prompt:
   `country_info(thailand, C).`, `guess_country([capital(bangkok)], X).`,
   `check_capital_match(vietnam, hanoi, R).` — each should succeed.
2. **Existing test scripts still pass**: `swipl run_tests.pl` (compare
   `output.txt` — should be unchanged, it only exercises `core.pl`/`facts.pl`)
   and `swipl test_script.pl`. `swipl test_error.pl`'s behavior *should*
   change — `country_info(test,test)` now fails cleanly instead of throwing
   `existence_error`, since `test` isn't a real country but `country_info/2`
   now exists. That's expected, not a bug — flagging so it isn't mistaken for
   one mid-verification.
3. **Start the server and hit every route**: `swipl backend/prolog/server.pl`
   then `start_server.` (or `bash backend/prolog/start.sh` for a scripted
   60s smoke test), then from another terminal, curl each route:

   ```
   curl http://localhost:4000/country/thailand
   curl http://localhost:4000/country/not_a_real_country      # expect 404

   curl -X POST http://localhost:4000/guess -H "Content-Type: application/json" \
     -d '{"clues":[{"type":"capital","value":"bangkok"}]}'

   curl -X POST http://localhost:4000/neighbor_check -H "Content-Type: application/json" \
     -d '{"country":"myanmar","candidates":["china","thailand","vietnam"]}'

   curl -X POST http://localhost:4000/capital_match -H "Content-Type: application/json" \
     -d '{"country":"vietnam","guessed_city":"hanoi"}'

   curl "http://localhost:4000/explain/neighbor?a=myanmar&b=thailand"
   curl "http://localhost:4000/explain/membership?country=singapore"

   curl -X POST http://localhost:4000/score -H "Content-Type: application/json" \
     -d '{"topic":"neighboring_countries","score":40}'
   curl http://localhost:4000/recommend
   curl http://localhost:4000/scores
   ```

   All should return 200 with real JSON, not 501/503. Try `/scores` and
   `/recommend` only after at least one `POST /score` (in-memory state,
   resets each server run — a known, documented gap, not something this fix
   addresses).
4. **Full-stack check**: with the backend running on `:4000`, `npm run dev`
   the frontend and click through Explore Map, Guess the Country, Who Is My
   Neighbor, Match the Capitals, and Dashboard — each should now show real
   data instead of erroring.
