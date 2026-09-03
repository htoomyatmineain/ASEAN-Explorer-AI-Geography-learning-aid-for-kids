# Make the Progress page actually work

## Context

The main menu's "Progress" button already routes to a real `Dashboard.page.jsx`, which renders an animated per-topic score bar for each scored topic plus a "recommended activity" card — and the backend behind it (`POST /score`, `GET /scores`, `GET /recommend`, backed by the Prolog predicate `student_score/2` in `backend/prolog/features/dashboard/session.pl`) is genuinely implemented, not a stub.

The problem: **nothing ever calls it.** None of the three playable games (Guess the Country, Neighbor Quiz, Capital Match) report a result anywhere — not to the backend, not even to the existing (but currently unused-by-Dashboard) `GameContext`. So today Progress always renders empty, no matter how much is played. This gap is already independently documented in `docs/CURRENT_STATE_AUDIT_AND_FIX_PLAN.md`, which specifies the exact topic-key mapping to use (matching `session.pl`'s `activity_for/2`):

- Guess the Country → `flags_and_currencies`
- Neighbor Quiz → `neighboring_countries`
- Capital Match → `countries_and_capitals`
- (`asean_membership` is reserved for the Learning feature, which is explicitly out of scope here — see Non-goals.)

This plan wires those three games up so Progress reflects real gameplay. Scope was deliberately kept to "fix the wiring" — no new backend features, no persistence, no redesigned game UIs.

Two real design calls came out of reading the actual game components (confirmed via `Read`, not assumed):

- **Guess the Country** and **Neighbor Quiz** have no player-submitted answer to grade in their current UI — both are "reveal" demos (click a button, backend shows/highlights the correct answer; there's no wrong path). Decision: record a fixed **completion score of 100** when the reveal/check succeeds. This tracks "topic was practiced," not accuracy — there's no accuracy signal to have here without a UI redesign, which is out of scope.
- **Capital Match** has a real 3-pair round with genuine correct/incorrect grading per pair, but the backend's `set_score/2` does `retractall` + `assertz` — it **overwrites**, it doesn't average. Decision: track `correct`/`attempted` counts in local component state through the round, and report the **running percentage** after each drop, so the topic's score reflects overall round performance rather than just whichever pair was dropped last.

## Non-goals (explicitly out of scope for this pass)

- Persistence — `student_score/2` stays in-memory only; still resets on backend restart. (User confirmed: separate follow-up.)
- Badges/stars, Journey Mode level/countries-completed — Journey Mode itself isn't built (`ProgressMap.jsx` is a placeholder, `/journey/status` is a 501 stub) — not touched.
- Wiring the Learning feature into `asean_membership` — the audit doc marks this "once it's scored," a separate change; not part of this pass.
- Any change to `Dashboard.page.jsx` / `ScoreDashboard.jsx` / `TopicScoreBar.jsx` / `RecommendedActivityCard.jsx` — this existing UI already does the right thing once real data exists; it does not need modification.
- Any change to `backend/prolog/features/dashboard/` — `set_score/2`, `POST /score`, `GET /scores`, `GET /recommend` all already work correctly; no backend changes needed.

## Implementation

For each of the three live game components, after a result comes back, call both:
- `useGame().setTopicScore(topic, score)` — from `frontend/src/shared/state/GameContext.jsx` (already imported/wrapped around the whole app in `App.jsx` via `GameProvider`, just not consumed by these components yet)
- `dashboardApi.setTopicScore(topic, score)` — from `frontend/src/features/dashboard/dashboardApi.js` (already defined, just never called; it POSTs to `/score`, which is what actually updates `student_score/2` server-side and makes Progress populate)

**⚠️ File landmine, confirmed during exploration:** each game feature folder has TWO similarly-named components. Only the ones under `components/` are live (imported by the route-level `*.page.jsx` files). The feature-root-level ones (`frontend/src/features/neighbor-game/NeighborGame.jsx` and `frontend/src/features/capital-match/CapitalMatchGame.jsx`) are dead duplicates from an old migration, not used by any route — **do not touch them.**

### 1. `frontend/src/features/guess-game/components/GuessGame.jsx`

In `handleGuess`, after `setResult(response)`, if `response.answer` is present (success path, not the "no country matches" error path): call `setTopicScore('flags_and_currencies', 100)` (both the context and dashboard API calls).

### 2. `frontend/src/features/neighbor-game/components/NeighborGame.jsx`

In `handleCheck`, after `setNonNeighbors(response.non_neighbors)`, if `response.non_neighbors` is present: call `setTopicScore('neighboring_countries', 100)`.

### 3. `frontend/src/features/capital-match/components/CapitalMatchGame.jsx`

Add local state to track the round, e.g. `const [stats, setStats] = useState({ correct: 0, attempted: 0 })`. In `handleDrop`, after getting `response.result`, update `stats` (increment `attempted` always, increment `correct` if `response.result === 'correct'`), compute `Math.round((newCorrect / newAttempted) * 100)`, and call `setTopicScore('countries_and_capitals', percentage)` with the freshly computed values (not the pre-update state, to avoid an off-by-one-render lag).

### Shared pattern in all three

```jsx
import { useGame } from '../../../shared/state/GameContext';
import { setTopicScore as postTopicScore } from '../../dashboard/dashboardApi';
// ...
const { setTopicScore } = useGame();
// after a qualifying result:
setTopicScore(TOPIC_KEY, score);
postTopicScore(TOPIC_KEY, score);
```
(Local `useGame()`'s `setTopicScore` and the imported API function share a name — alias the import, e.g. `setTopicScore as postTopicScore`, to avoid shadowing.) `postTopicScore` returns a promise (fire-and-forget is fine here, matching how these components already call other API functions without awaiting error handling beyond what exists).

## Verification

1. Start both servers per the now-established commands (`npm run dev` in `frontend/`; `swipl -q -f server.pl -g "start_server"` in `backend/prolog/`, from a terminal with `swipl` on PATH or its full path).
2. Play each game once from the main menu (Practice → Guess the Country / Neighbor Quiz / Capital Match), producing a result each time.
3. Navigate to Progress (`/dashboard`) and confirm:
   - A score bar appears for each of the three topics played (they won't appear before being played at least once — `GET /scores` only returns topics with a recorded `student_score/2` fact, which is existing, correct behavior).
   - Capital Match's bar reflects the round's running percentage, not just the last drop (test by getting 2/3 correct in a round and confirming ~67%, not 0 or 100).
   - The "recommended activity" card shows the weakest of the topics played, matching `activity_for/2`'s mapping in `session.pl`.
4. Confirm no console errors from the added `useGame()` calls (i.e., each component is genuinely inside `<GameProvider>` — it is, via `App.jsx`, but worth a sanity check after wiring).
