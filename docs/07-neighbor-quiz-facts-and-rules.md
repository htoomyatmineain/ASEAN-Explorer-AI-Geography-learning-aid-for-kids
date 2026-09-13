# Who Is My Neighbor? — Facts & Rules Reference

Companion to [`05-learning-mode-facts-and-rules.md`](05-learning-mode-facts-and-rules.md), scoped to **Who Is My Neighbor?** (frontend folder `features/neighbor-game`, routed at `/neighbors`). The child is shown a country and a handful of candidate countries, and must tap the one that does **NOT** border it. This is Feature 4 in `backend/prolog/features/neighbor_game/`.

## 1. Where the logic lives

| File | Role |
|---|---|
| `backend/prolog/facts.pl` | `borders/2` — the raw, one-direction-only border data |
| `backend/prolog/core.pl` | `neighbor/2` — makes `borders/2` symmetric |
| `backend/prolog/features/neighbor_game/rules.pl` | `find_non_neighbors/3` (used) and `is_real_neighbor/2` (defined, unused) |
| `backend/prolog/features/neighbor_game/routes.pl` | HTTP route `POST /neighbor_check` |

Frontend chain: `NeighborQuiz.page.jsx` → `NeighborGame.jsx` → `neighborGameApi.js#checkNeighbors` → `POST http://localhost:4000/neighbor_check`. The 10 rounds (one per ASEAN country) and each round's candidate list are hardcoded in `NeighborGame.jsx`'s `ROUNDS` array.

## 2. The rules

```prolog
% backend/prolog/core.pl
% Borders are stored once in facts.pl; neighbor/2 makes the relationship symmetric.
neighbor(A, B) :- borders(A, B).
neighbor(A, B) :- borders(B, A).
```

```prolog
% backend/prolog/features/neighbor_game/rules.pl

% find_non_neighbors(+Country, +Candidates, -NonNeighbors) picks out the
% candidate(s) that do NOT actually border Country — this is the
% "which one is NOT a neighbor?" answer key.
find_non_neighbors(Country, Candidates, NonNeighbors) :-
    findall(X, (member(X, Candidates), \+ neighbor(Country, X)), NonNeighbors).

% is_real_neighbor(+Country, +Candidate) — simple yes/no check for a single option
is_real_neighbor(Country, Candidate) :-
    neighbor(Country, Candidate).
```

**How it evaluates**, e.g. `find_non_neighbors(myanmar, [china, india, bangladesh, thailand, laos, vietnam], NonNeighbors)`:

1. `findall/3` walks the 6-item `Candidates` list and keeps only those where `\+ neighbor(myanmar, X)` succeeds (i.e. Myanmar does *not* border X).
2. `china`: `borders(myanmar, china)` is a fact → `neighbor(myanmar, china)` succeeds → `\+` fails → **excluded**.
3. `india`, `bangladesh`, `thailand`, `laos`: each has a matching `borders(myanmar, _)` fact → all **excluded** the same way.
4. `vietnam`: no `borders(myanmar, vietnam)` or `borders(vietnam, myanmar)` fact exists anywhere in `facts.pl` → `neighbor(myanmar, vietnam)` fails → `\+` succeeds → **included**.
5. Result: `NonNeighbors = [vietnam]` — the one candidate that isn't actually next to Myanmar, i.e. the correct "odd one out" answer.

`is_real_neighbor/2` is a one-line convenience wrapper around `neighbor/2` for checking a single candidate — it's defined but never called from `routes.pl` or anywhere else in the codebase; `find_non_neighbors/3` is the only predicate the HTTP layer actually uses.

## 3. Facts consumed

| Predicate | Count | Example |
|---|---|---|
| `borders/2` (via `neighbor/2`, both directions) | 18 facts, made bidirectional by `core.pl` | `borders(myanmar, thailand).` → also answers `neighbor(thailand, myanmar)` |

No other fact predicate is touched — this feature is the thinnest of the three practice games in terms of KB surface area.

## 4. What the HTTP layer returns

```prolog
% backend/prolog/features/neighbor_game/routes.pl
:- http_handler(root(neighbor_check), handle_neighbor_check, []).

handle_neighbor_check(Request) :-
    cors_enable,
    http_read_json_dict(Request, Body),
    atom_string(Country, Body.get(country)),
    maplist([S,A]>>atom_string(A,S), Body.get(candidates), Candidates),
    find_non_neighbors(Country, Candidates, NonNeighbors),
    reply_json_dict(_{ country: Country, non_neighbors: NonNeighbors }).
```

Example request/response:
```
POST /neighbor_check
{"country":"myanmar","candidates":["china","india","bangladesh","thailand","laos","vietnam"]}

200 OK
{"country":"myanmar","non_neighbors":["vietnam"]}
```

`non_neighbors` is always a **list** (via `findall`), not a single value — a candidate set could in principle contain more than one non-neighbor. The Philippines round is exactly that case: `facts.pl` has no `borders/2` fact involving `philippines` at all (it's an archipelago), so *every* candidate comes back as a non-neighbor:
```
POST /neighbor_check
{"country":"philippines","candidates":["indonesia","malaysia","vietnam","thailand"]}

200 OK
{"country":"philippines","non_neighbors":["indonesia","malaysia","vietnam","thailand"]}
```

## 5. How the frontend uses it (with example)

`NeighborGame.jsx` never computes the answer key client-side — it only compares the child's tap against what the backend returns:

```js
// frontend/src/features/neighbor-game/components/NeighborGame.jsx
const response = await checkNeighbors(round.country, round.candidates);
setNonNeighbors(response.non_neighbors);
const correct = status === 'done' && nonNeighbors?.includes(pick);
```

Walkthrough for round 1 (`{ country: 'myanmar', candidates: ['china', 'india', 'bangladesh', 'thailand', 'laos', 'vietnam'] }`):
1. The question reads "Which of these does **NOT** border myanmar?" with all 6 candidates tappable via `NeighborMapHighlight`.
2. The child taps **thailand** (`pick = 'thailand'`) — a real neighbor, i.e. the wrong answer — and presses "🧭 Check my answer."
3. `checkNeighbors('myanmar', [...])` `POST`s to `/neighbor_check`, matching the KB walkthrough in §2, and gets back `{"non_neighbors":["vietnam"]}`.
4. `nonNeighbors.includes('thailand')` is `false` → `correct = false`. The UI shakes and shows "Not quite — thailand does border myanmar. The green ones are its neighbors; the red one is the odd one out!" and reports a Progress score of 50 for the `neighboring_countries` topic (a correct pick reports 100).
5. On the Philippines round, `non_neighbors` comes back equal in length to `candidates` (`allNonNeighbors = nonNeighbors.length === round.candidates.length`), so *any* tap is correct — the success message specifically calls this out: "none of these do — it's an island nation!"

## 6. Coverage assessment

| Observation | Detail |
|---|---|
| `is_real_neighbor/2` is dead code | Defined in `rules.pl`, matches the KB doc's design (§4.4), but no route or other predicate ever calls it — `find_non_neighbors/3` alone answers every request the frontend makes. |
| `no_land_neighbors/1` is dead data | `facts.pl` declares `no_land_neighbors(philippines).` and `no_land_neighbors(singapore).`, but no rule anywhere queries it. The Philippines "everything is a non-neighbor" behavior in §5 falls out naturally from `borders/2` simply having no Philippines entries — it doesn't depend on this fact at all. Singapore, despite also being flagged `no_land_neighbors`, still has `borders(malaysia, singapore)` in the KB (the causeway), so `neighbor/2` treats Malaysia as a genuine neighbor of Singapore in-game — the `no_land_neighbors` fact and the actual `borders/2` graph slightly disagree, and only the latter is ever executed. |
| No minimum-candidate guarantee | `find_non_neighbors/3` works on any-length candidate list without requiring at least one real neighbor or exactly one non-neighbor — the "exactly one odd one out" design (documented in `NeighborGame.jsx`'s own comment) is a property of the hand-picked `ROUNDS` data, not something the Prolog rule enforces. |
| Score floor on a wrong answer | Like Guess the Country, a wrong pick still reports a Progress score of 50 rather than 0 — partial credit is a frontend policy, not a backend concept (`check_capital_match/3` in Capital Match has no such floor). |

## 7. Summary

Who Is My Neighbor? is the simplest of the three practice games: one `findall`-based rule (`find_non_neighbors/3`) built directly on `core.pl`'s bidirectional `neighbor/2`, itself a two-clause symmetric closure over the 18 one-directional `borders/2` facts in `facts.pl`. Given a country and a list of candidates, it returns exactly the candidates that are *not* real neighbors — the frontend hands it a hand-curated candidate list per round (real neighbors plus one odd one out, or an all-non-neighbor set for the archipelago cases) and trusts the returned list completely for grading.
