# Integration Notes (Core & Integration Handoff)

This document is the handoff for the "Core & Integration" scope of the ASEAN Explorer project. It outlines exactly what has been built, verified, and what you need to implement next.

## 1. What's Done and Verified
- **`backend/prolog/core.pl`**: Shared reasoning rules (`neighbor/2`, `asean_country/1`, etc.). Tested via sanity queries (see verified output proof below).
- **`backend/prolog/facts.pl`**: Static definitions of the full 15 countries' data from KB doc §3.1–3.10. Tested via fact count query (`15` results).
- **`backend/prolog/kb.pl`**: Single load point (`:- [core, facts, rules, session].`). Tested by successfully executing `swipl -g "[kb], halt." -t "halt(1)"` without errors.
- **`backend/prolog/server.pl`**: HTTP server implementation exposing port 4000 and the `/country/:name` route. Tested via `curl` returning a properly handled 503 JSON payload as designed while `rules.pl` is missing.
- **`frontend/src/App.jsx`**: React routing shell configured with paths for all 6 feature components (`Home`, `ExploreASEAN`, `GuessCountry`, `NeighborQuiz`, `CapitalMatch`, `Dashboard`).
- **`frontend/src/state/GameContext.jsx`**: Shared score/progress state React Context utilizing exact backend topic keys.

**Verified Query Proofs:**
```prolog
?- asean_country(thailand).
true.

?- asean_country(china).
false.

?- capital(vietnam, C).
C = hanoi.

?- findall(X, neighbor(myanmar, X), Neighbors).
Neighbors = [thailand, laos, china, india, bangladesh].

?- is_landlocked(laos).
true.

?- same_subregion(thailand, vietnam).
true.

?- same_subregion(thailand, singapore).
false.

?- findall(C, country(C), Cs), length(Cs, N).
N = 15.
```

## 2. How to Run My Part
**Prerequisite (CRITICAL):** Ensure `swipl` is properly exposed on your `PATH`. If your installation is aliased in `.bashrc` (e.g., via Flatpak), you must configure it so non-interactive shells and scripts can invoke it directly without "command not found" errors.

**Loading the KB Standalone:**
To load the KB and test your predicates interactively:
```bash
cd backend/prolog
swipl -g "[kb]."
```

**Starting the Server:**
You can start the server manually or using the provided helper script:
```bash
cd backend/prolog
./start.sh
```
*(Note: `./start.sh` launches `swipl -q -f server.pl -g "start_server, sleep(60), halt."` in the background for quick testing. For continuous local development, you can simply run `swipl -f server.pl -g "start_server."` and keep the terminal alive).*

## 3. What Each Teammate Needs to Build, Precisely
Placeholder stub files already exist for `backend/prolog/rules.pl` and `backend/prolog/session.pl`. These currently just contain header comments so that `kb.pl` loads cleanly. **Do not create new files; overwrite these existing stubs with your actual logic.**

**For `rules.pl` (Persons 2, 3, 4):**
Expected exact predicate signatures:
- `country_info/2`
- `matches_clue/2`
- `guess_country/2`
- `find_non_neighbors/3`
- `check_capital_match/3`
- `explain_neighbor/3`

**For `session.pl` (Person 5):**
Expected exact predicate signatures:
- `student_score/2` (must be `:- dynamic`)
- `set_score/2`
- `weakest_topic/1`
- `recommend_activity/1`
- `needs_practice/1`

## 4. API Contract (for frontend teammates)
The `server.pl` backend currently exposes port `4000` with the following routes. 

### `GET /country/:name`
- **Success (When `rules.pl` defines `country_info/2`):**
  ```json
  {
    "country": "thailand",
    "capital": "bangkok",
    "currency": "baht",
    "flag": "🇹🇭",
    "region": "mainland",
    "asean_member": true,
    "famous_for": [...]
  }
  ```
- **Error 404 (Country not found):**
  ```json
  {
    "error": "Country not found"
  }
  ```
- **Error 503 (Current state; `country_info/2` is undefined/missing):**
  ```json
  {
    "error": "Backend logic not yet available"
  }
  ```
  *(Frontend code MUST handle this 503 gracefully rather than treating it as a crash).*

### `GET /guess`
- **Status 501:** `{"error": "Not implemented"}` (Placeholder stub)

### `GET /neighbor_check`
- **Status 501:** `{"error": "Not implemented"}` (Placeholder stub)

## 5. GameContext Contract (for frontend teammates)
The `GameContext.jsx` state utilizes an exact vocabulary for the `scores` object keys to bridge frontend progress with backend recommendations. 

**Exact Score State Shape:**
```javascript
const [scores, setScores] = useState({
  countries_and_capitals: 0,
  neighboring_countries: 0,
  asean_membership: 0,
  flags_and_currencies: 0,
});
```
**CRITICAL:** These four specific topic keys (`countries_and_capitals`, `neighboring_countries`, `asean_membership`, `flags_and_currencies`) **must match the backend's `activity_for/2` vocabulary perfectly**. If altered, the Dashboard component's `recommend_activity` calculation will silently fail to map.

## 6. Known Gaps / Not Yet Built
Do not assume the following predicates or facts exist yet, as they were explicitly excluded from this core sprint:
- **Facts (Not started yet):** `population/2`, `area_km2/2`, `national_animal/2`
- **Journey Mode (Unbuilt):** `level/2`, `unlocked_country/2`, `checkpoint_passed/2`
