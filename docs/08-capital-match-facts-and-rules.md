# Match the Capitals — Facts & Rules Reference

Companion to [`05-learning-mode-facts-and-rules.md`](05-learning-mode-facts-and-rules.md), scoped to **Match the Capitals** (frontend folder `features/capital-match`, routed at `/capitals`). The child taps a country, then taps the capital they think belongs to it, and the backend grades each pair one at a time. This is Feature 5 in `backend/prolog/features/capital_match/`.

## 1. Where the logic lives

| File | Role |
|---|---|
| `backend/prolog/facts.pl` | `capital/2` — the answer key for every pair |
| `backend/prolog/features/capital_match/rules.pl` | `check_capital_match/3` |
| `backend/prolog/features/capital_match/routes.pl` | HTTP route `POST /capital_match` |

Frontend chain: `CapitalMatchPage.jsx` → `CapitalMatchGame.jsx` → `capitalMatchApi.js#checkCapitalMatch` → `POST http://localhost:4000/capital_match`. The board (all 10 country/capital pairs) is hardcoded in `CapitalMatchGame.jsx`'s `ALL_PAIRS` array, with the capitals column reshuffled every game.

## 2. The rule

```prolog
% backend/prolog/features/capital_match/rules.pl

% check_capital_match(+Country, +GuessedCity, -Result) grades a drag-and-drop
% or tap-to-match answer.
% The cut (!) after the first clause stops Prolog from also trying the second
% clause on backtracking, which would otherwise hand the frontend "incorrect"
% right after already returning "correct".
check_capital_match(Country, GuessedCity, correct) :-
    capital(Country, GuessedCity), !.
check_capital_match(_Country, _GuessedCity, incorrect).
```

**How it evaluates**, two examples:

- `check_capital_match(vietnam, hanoi, Result)`: the first clause's body, `capital(vietnam, hanoi)`, matches the fact `capital(vietnam, hanoi).` in `facts.pl` exactly → succeeds → the `!` commits to this clause, discarding the choice point that would otherwise let Prolog backtrack into the second clause → `Result = correct`.
- `check_capital_match(vietnam, bangkok, Result)`: `capital(vietnam, bangkok)` has no matching fact (Vietnam's capital is `hanoi`, not `bangkok`) → the first clause's body fails, so the clause fails *before* reaching its own cut → Prolog falls through to the second, catch-all clause, which always succeeds → `Result = incorrect`.

Without the cut, a *correct* match would still succeed on the first clause, but a subsequent request for `guess_country`-style backtracking (e.g. `findall(R, check_capital_match(vietnam, hanoi, R), Rs)`) would yield `Rs = [correct, incorrect]` — both clauses firing. The cut is what makes each call deterministic: exactly one `Result` per call, which is what `reply_json_dict/1` in `routes.pl` needs.

## 3. Facts consumed

| Predicate | Count | Example |
|---|---|---|
| `capital/2` | 10 | `capital(vietnam, hanoi).` |

The same 10 facts Learning Mode's `country_info/2` and Guess the Country's `capital` clue both read — Match the Capitals is the only feature of the three practice games that queries just one predicate.

## 4. What the HTTP layer returns

```prolog
% backend/prolog/features/capital_match/routes.pl
:- http_handler(root(capital_match), handle_capital_match, []).

handle_capital_match(Request) :-
    cors_enable,
    http_read_json_dict(Request, Body),
    atom_string(Country, Body.get(country)),
    atom_string(GuessedCity, Body.get(guessed_city)),
    check_capital_match(Country, GuessedCity, Result),
    reply_json_dict(_{ country: Country, guessed_city: GuessedCity, result: Result }).
```

Example request/response:
```
POST /capital_match
{"country":"vietnam","guessed_city":"hanoi"}

200 OK
{"country":"vietnam","guessed_city":"hanoi","result":"correct"}
```
```
POST /capital_match
{"country":"vietnam","guessed_city":"bangkok"}

200 OK
{"country":"vietnam","guessed_city":"bangkok","result":"incorrect"}
```

Unlike Guess the Country and Who Is My Neighbor, `handle_capital_match/1` never returns a non-2xx status for a "no match" case — `check_capital_match/3`'s catch-all second clause guarantees `Result` is always bound, so every well-formed request gets a `200` with either `correct` or `incorrect`.

## 5. How the frontend uses it (with example)

`CapitalMatchGame.jsx` grades every single tap through the backend, one pair at a time, and never assumes correctness itself:

```js
// frontend/src/features/capital-match/components/CapitalMatchGame.jsx
const response = await checkCapitalMatch(selectedCountry, capital);
setFeedback({ country: selectedCountry, capital, result: response.result, key: Date.now() });
if (response.result === 'correct') {
  setMatched((current) => ({ ...current, [selectedCountry]: capital }));
}
```

Walkthrough:
1. The board shows all 10 country cards (step 1) and all 10 capital cards in shuffled order (step 2).
2. The child taps **Vietnam** (`selectedCountry = 'vietnam'`), then taps **Hanoi**.
3. `handleDrop('hanoi')` calls `checkCapitalMatch('vietnam', 'hanoi')`, which `POST`s to `/capital_match` exactly as in §4, and gets back `{"result":"correct"}`.
4. Vietnam moves into `matched` (`{ vietnam: 'hanoi' }`), its capital card is marked matched and removed from play, the progress dots fill one more slot, and the Progress topic `countries_and_capitals` is updated with the running percentage `correct / attempted` (not a flat 100/50 like the other two games — see §6).
5. If the child had instead tapped **Bangkok** for Vietnam, the backend would answer `{"result":"incorrect"}`; `matched` stays untouched (Vietnam is never locked in on a wrong guess), the UI shakes and shows "bangkok is not the capital of vietnam — try again!", and the child can immediately retry the same country.
6. The round ends when `matched` has all 10 entries (`allMatched`), at which point the "Play again" button reshuffles the capitals column and resets `matched`, `stats`, and the score tracker.

## 6. Coverage assessment

| Observation | Detail |
|---|---|
| Scoring differs from the other two practice games | Guess the Country and Who Is My Neighbor report a flat `100` (correct) or `50` (wrong) per question. Capital Match instead tracks a running `{ correct, attempted }` tally client-side and reports `Math.round(correct / attempted * 100)` after every single drop — a wrong guess here genuinely can pull the score toward `0`, unlike the 50-point floor elsewhere. |
| No "unknown country" signal | If `country` isn't a real key in `facts.pl` (e.g. a typo, or a non-ASEAN country with no `capital/2` fact), `capital(Country, GuessedCity)` simply fails for every `GuessedCity`, and `check_capital_match/3` falls through to `incorrect` — the same response as a real country with the wrong capital. The HTTP layer has no way to distinguish "wrong guess" from "not a real country" (in practice unreachable: `ALL_PAIRS` in `CapitalMatchGame.jsx` only ever sends the 10 real ASEAN country atoms). |
| Board duplicates `facts.pl` by hand | Like `countryCodes.js` in Learning Mode, `ALL_PAIRS` hardcodes all 10 country→capital pairs in the frontend instead of fetching them from a "list all capitals" endpoint — if `facts.pl`'s `capital/2` facts ever changed, the two lists could silently drift apart. |

## 7. Summary

Match the Capitals is the most deterministic of the three practice games: one two-clause rule, one fact predicate, one cut. `check_capital_match/3` grades a single country/capital pair per call and always returns a bound result — `correct` if `capital/2` holds, `incorrect` otherwise — so the HTTP layer never needs a 404 branch the way Guess the Country and Who Is My Neighbor do. The frontend leans on this determinism to grade every tap independently, in any order, without ever needing the backend to know about the other 9 pairs on the board.
