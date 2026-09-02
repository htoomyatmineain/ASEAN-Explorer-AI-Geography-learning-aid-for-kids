# ASEAN Explorer — Current State Audit & Fix Plan

Audited 2026-09-02 against branch `feature/learning-map-replacement`. This
walks both `backend/prolog/` and `frontend/src/` file by file and separates
what's actually live from what's dead, broken, or still unbuilt, then gives a
prioritized plan to close the gaps. SWI-Prolog is not installed in the
environment this audit was written in, so backend claims are based on
reading the `.pl` files (predicate names/arities all line up across
`kb.pl` → `server.pl` → each `features/*/rules.pl`/`routes.pl`), not on
actually running `swipl` — re-run the Verification section below on a
machine with SWI-Prolog before trusting the backend is 100% live.

---

## 1. What's actually working

**Backend**
- `facts.pl` + `core.pl` — full static data for the 10 ASEAN countries (+ 5
  non-member neighbors) and the shared reasoning (`neighbor/2`,
  `asean_country/1`, `same_subregion/2`, `is_landlocked/1`). Previously
  verified via `run_tests.pl`/`test_script.pl` (see `INTEGRATION_NOTES.md`).
- `kb.pl` loads `core, facts, rules` plus every feature's `rules.pl`
  (`guess_game`, `neighbor_game`, `capital_match`, `explain_mode`,
  `journey_mode` placeholder) plus `features/dashboard/session.pl`.
- `server.pl` wires 9 real routes + 1 intentional placeholder:
  `GET /country/:name`, `POST /guess`, `POST /neighbor_check`,
  `POST /capital_match`, `GET /explain/neighbor`, `GET /explain/membership`,
  `POST /score`, `GET /recommend`, `GET /scores`, and `GET /journey/status`
  (501 by design — Journey Mode isn't built).
- `backend/README.md` correctly describes this feature-folder layout as it
  actually exists today.

**Frontend**
- The live entry point is `index.jsx` → `src/app/App.jsx` → `src/app/routes.jsx`
  — one consistent, feature-based router (`src/features/<name>/`).
- Home/intro page (press-start prompt, loading bar, background art) works
  and is recently redone (per git log).
- Learning feature (`features/learning/`) — real GeoJSON map via
  `react-simple-maps`, click a country → `CountryDetailPanel` calls
  `GET /country/:name` and renders the result. Asset
  (`asean-countries-50m.json`) present, package installed.
- Guess the Country, Who Is My Neighbor, Match the Capitals — each has a
  live implementation (in `features/<name>/components/`) wired into its page,
  and each calls the matching real Prolog route with the correct
  request/response shape.
- Dashboard — `ScoreDashboard` correctly calls `GET /scores` and
  `GET /recommend`.

---

## 2. What's broken

1. **The main navigation is a dead end.** `Layout`'s nav only links to
   `/explore`, `/card-selection`, `/dashboard`, `/settings`. The "Start"
   button on `CardSelectionPage` ([CardSelection.page.jsx](frontend/src/features/card-selection/CardSelection.page.jsx))
   has no `onClick` at all. Result: there is **no in-app path** from Home
   into Guess the Country, Who Is My Neighbor, Match the Capitals, or
   Journey Mode — those routes only work if you type the URL directly.

2. **The scoring loop never fires.** None of the three live game components
   ([GuessGame.jsx](frontend/src/features/guess-game/components/GuessGame.jsx),
   [NeighborGame.jsx](frontend/src/features/neighbor-game/components/NeighborGame.jsx),
   [CapitalMatchGame.jsx](frontend/src/features/capital-match/components/CapitalMatchGame.jsx))
   call `useGame().setTopicScore(...)` or `POST /score` after a result comes
   back. So Dashboard's `/recommend` and `/scores` will always come back
   empty no matter how much is played — Feature 7 (Personal Progress) is
   wired end-to-end but nothing feeds it.

3. **Explain Mode is built but never used.**
   [ExplainBubble.jsx](frontend/src/features/explain-mode/components/ExplainBubble.jsx)
   isn't imported anywhere in the app. Feature 6 ("Why is this the
   answer?") exists as dead code instead of being surfaced inside the other
   game screens as docs/04 describes.

4. **Duplicate `GameContext`s with incompatible shapes, one still wired to
   dead code:**
   - Live: `frontend/src/shared/state/GameContext.jsx` — exposes
     `{ scores, setTopicScore }`, used by `app/App.jsx`.
   - Dead: `frontend/src/state/GameContext.jsx` — exposes
     `{ scores, updateScore, selectedCountry, ... }`.
   - Two unused files —
     [features/neighbor-game/NeighborGame.jsx](frontend/src/features/neighbor-game/NeighborGame.jsx)
     and
     [features/capital-match/CapitalMatchGame.jsx](frontend/src/features/capital-match/CapitalMatchGame.jsx)
     (note: **not** in their `components/` subfolder — these are richer,
     fully self-contained client-side versions with their own hardcoded
     neighbor/capital maps, i.e. they never call the Prolog backend at all)
     — still import the *dead* `state/GameContext`. If anyone rewires
     `NeighborQuiz.page.jsx`/`CapitalMatch.page.jsx` to point at these
     (plausible — they look more finished), the context breaks silently.

5. **Dead files left over from the type-based → feature-based migration:**
   - `frontend/src/App.jsx` (old router; `index.jsx` uses `src/app/App.jsx`)
   - `frontend/src/pages/*.jsx` (`Home`, `ExploreASEAN`, `GuessCountry`,
     `NeighborQuiz`, `CapitalMatch`, `Dashboard` — 6 files, all superseded
     by `src/features/*/*.page.jsx`)
   - `frontend/src/state/GameContext.jsx` (see #4)
   - The two feature-root game files from #4
   None of these are imported by the live route tree — confirmed via
   grep — but they make the folder confusing to anyone who doesn't already
   know which copy is real.

6. **Missing dependency.** The two dead feature-root game files (`#4`)
   `import 'flag-icons/css/flag-icons.min.css'`, but `flag-icons` is in
   neither `package.json` nor `node_modules`. Harmless today since they're
   unused; would break the dev server the moment either file is imported.

7. **`docs/PROLOG_BACKEND_FIX_PLAN.md` and `docs/INTEGRATION_NOTES.md` are
   stale.** Both describe an earlier backend state (`rules.pl`/`session.pl`
   as empty placeholders, `/country` 503ing, `/guess`/`/neighbor_check`
   hardcoded 501s, `features/` "orphaned"). That's no longer true — someone
   already fixed the backend by wiring `features/` back in directly through
   `kb.pl`/`server.pl`, a different (and reasonable) path than the flat-file
   merge `PROLOG_BACKEND_FIX_PLAN.md` prescribes. **Following that doc's
   steps today would be actively wrong** — e.g. it tells you to delete
   `backend/prolog/features/`, which is very much in use. Two items buried
   in it are still real and still worth doing (folded into the plan below):
   the README gap in #8, and the in-memory-scores gap in §3.

8. **`backend/README.md`'s "Run it" section is incomplete.** `swipl
   backend/prolog/server.pl` only loads the file and drops to a `?-`
   prompt — you still have to type `start_server.` yourself (or use
   `start.sh`) before the API is actually listening on `:4000`. As written,
   someone following the README literally would think the server is up
   when it isn't.

---

## 3. Leftover / explicitly not-yet-built features

These match the project's own docs (`docs/04` "What's Still Open",
`INTEGRATION_NOTES.md` §6) and are still accurate:

- **Journey Mode reasoning** — `level/2`, `unlocked_country/2`,
  `checkpoint_passed/2` don't exist; `/journey/status` is a 501 stub;
  `ProgressMap.jsx` is a "coming soon" placeholder.
- **Persistent per-child scores** — `student_score/2` is `:- dynamic` and
  in-memory only, resets on every server restart. `backend/db/` is empty
  (just `.gitkeep`) — the SQLite plan in docs/02 §2.5 was never built.
- **`CardSelectionPage`** — literal placeholder, no real game-picker grid
  (and its one button doesn't even navigate — see §2.1).
- **`SettingsPage`** — literal placeholder, just a heading.
- **`population/2`, `area_km2/2`, `national_animal/2`** facts — explicitly
  deferred, still absent from `facts.pl`.
- **Landmark/fun-fact gallery, flip-style flag cards** (docs/04 §1) — the
  Learning feature currently only shows flag emoji + a list of fact pills,
  not the gallery/flip-card UI the feature doc describes.
- **Mascot art** — `Mascot.jsx` is a placeholder emoji owl.
- **Game depth** — Guess/Neighbor/Capital-Match each run exactly one
  hardcoded round with no retry/variety loop (this is a product gap, not a
  bug — flagging since it affects how "finished" the app feels).

---

## 4. Fix plan

### Decision needed before P2/P4 below
`features/neighbor-game/NeighborGame.jsx` and
`features/capital-match/CapitalMatchGame.jsx` (the dead feature-root files)
are visually more finished than the live `components/` versions, but they
never call the Prolog backend — they'd have to be rewritten to call
`neighborGameApi`/`capitalMatchApi` instead of their own hardcoded maps to
be worth keeping. Pick one:
- **(A) Delete them** and keep the live thin backend-driven versions as-is
  (fastest, keeps "real AI reasoning" intact, loses the nicer visuals).
- **(B) Merge their UI into the live versions**, wiring the real API calls
  in, then delete the leftover client-side-only file (more work, best of
  both).

The plan below assumes (A) for effort estimates; swap in (B) for the
cleanup step if you'd rather keep the richer visuals.

### Priority 1 — Fix the broken primary user flow
1. Give `CardSelectionPage` a real `onClick`/navigation (at minimum,
   `useNavigate()` to one game; ideally build the actual card-grid picker
   linking to `/guess`, `/neighbors`, `/capitals`, `/journey`).
2. Make sure every route in `routes.jsx` is reachable without typing a URL
   (either from the card-selection grid, or add them to `Layout`'s nav).

### Priority 2 — Close the scoring loop (blocks Feature 7 entirely)
3. In each live game component, call `useGame().setTopicScore(topic, score)`
   and `POST /score` (via `dashboardApi.setTopicScore`) after a result comes
   back. Topic keys come from `dashboard/session.pl`'s `activity_for/2`,
   reversed:
   - `GuessGame.jsx` → `flags_and_currencies`
   - `NeighborGame.jsx` (components/) → `neighboring_countries`
   - `CapitalMatchGame.jsx` (components/) → `countries_and_capitals`
   - Learning feature (once it's scored) → `asean_membership`

### Priority 3 — Wire up Explain Mode
4. Drop `<ExplainBubble getExplanation={...} />` into at least the Neighbor
   and Capital-Match results (call `explainNeighbor`/`explainMembership`
   from `explainModeApi.js`) so Feature 6 stops being orphaned.

### Priority 4 — Delete dead code (safe — none of it is imported today)
5. Delete: `frontend/src/App.jsx`, `frontend/src/pages/` (6 files),
   `frontend/src/state/GameContext.jsx`, and — per the decision above —
   either delete or merge-then-delete
   `features/neighbor-game/NeighborGame.jsx` and
   `features/capital-match/CapitalMatchGame.jsx`.
6. If option (B) was chosen instead, add `flag-icons` to `package.json`
   before merging that UI in; if (A), no dependency change needed.

### Priority 5 — Fix the docs
7. Add a "superseded — see CURRENT_STATE_AUDIT_AND_FIX_PLAN.md" banner (or
   move to `docs/archive/`) on `docs/PROLOG_BACKEND_FIX_PLAN.md` and
   `docs/INTEGRATION_NOTES.md` so nobody follows their now-wrong steps.
8. Fix `backend/README.md`'s "Run it" section to mention the
   `start_server.` step (or point at `start.sh`).

### Priority 6 — Verify the backend end-to-end (needs local SWI-Prolog)
9. `cd backend/prolog && swipl kb.pl` — clean load, no `existence_error`.
10. `swipl run_tests.pl` and `swipl test_script.pl` — compare against
    `output.txt`/expected output.
11. `swipl server.pl` then `start_server.` (or `bash start.sh`), then curl
    every route listed in §1 above — all should return real 200 JSON.
12. Full click-through with the frontend once Priority 1 lands.

### Priority 6 (backlog, not blocking)
- Build out real `CardSelectionPage`/`SettingsPage` UI.
- Implement Journey Mode's reasoning + `ProgressMap` UI.
- Add SQLite persistence per docs/02 §2.5 so scores survive a restart.
- Add `population/2`, `area_km2/2`, `national_animal/2` facts + the
  landmark gallery / flip flag cards from docs/04 §1.
- Add round variety/retry to Guess/Neighbor/Capital-Match instead of one
  fixed round each.

---

## 5. Suggested order of work

P1 (nav) and P2 (scoring) are the two fixes that make the app actually
playable end-to-end and should land first. P3 (Explain Mode) and P4
(cleanup) are independent of each other and of P1/P2 — safe to do anytime,
in either order. P5 (docs) can happen alongside P4. P6 (verification)
should be re-run after P1–P3 land, on a machine with SWI-Prolog installed.
