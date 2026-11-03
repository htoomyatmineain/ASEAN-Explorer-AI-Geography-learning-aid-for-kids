# Guess the Country — Facts & Rules Reference

Companion to [`05-learning-mode-facts-and-rules.md`](05-learning-mode-facts-and-rules.md), scoped to **Guess the Country** (frontend folder `features/guess-game`, routed at `/guess`). The child reads three clues about a mystery country, picks a guess from all 10 ASEAN countries, and the backend confirms the real answer — this is Feature 3 in `backend/prolog/features/guess_game/`.

## 1. Where the logic lives

| File | Role |
|---|---|
| `backend/prolog/facts.pl` | Static ASEAN data the clues are checked against |
| `backend/prolog/core.pl` | Shared reasoning; supplies `asean_country/1` and `neighbor/2` |
| `backend/prolog/features/guess_game/rules.pl` | `matches_clue/2` and `guess_country/2` |
| `backend/prolog/features/guess_game/routes.pl` | HTTP route `POST /guess`, turns JSON clues into Prolog terms |

Frontend chain: `GuessCountry.page.jsx` → `GuessGame.jsx` → `guessGameApi.js#guessCountry` → `POST http://localhost:4000/guess`. The clues themselves come from a fixed set of 10 pre-written rounds in `challengeRounds.js` (`CHALLENGE_ROUNDS`); the guessable-country list (`GUESSABLE_COUNTRIES`) is hardcoded to the 10 ASEAN members.

## 2. The rules

```prolog
% backend/prolog/features/guess_game/rules.pl

% A clue is one of: capital(City), member_of(asean), famous_for(Thing),
% borders(OtherCountry), language(Lang), currency(Cur), subregion(Region)
matches_clue(Country, capital(City))      :- capital(Country, City).
matches_clue(Country, member_of(asean))   :- asean_country(Country).
matches_clue(Country, famous_for(Thing))  :- famous_for(Country, Thing).
matches_clue(Country, borders(Other))     :- neighbor(Country, Other).
matches_clue(Country, language(Lang))     :- language(Country, Lang).
matches_clue(Country, currency(Cur))      :- currency(Country, Cur).
matches_clue(Country, subregion(Region))  :- subregion(Country, Region).

% guess_country(+Clues, -Country) finds the country consistent with EVERY clue
% An empty clue list is rejected rather than matching the first country/1 result.
guess_country(Clues, _Country) :-
    Clues == [],
    !,
    fail.
guess_country(Clues, Country) :-
    country(Country),
    forall(member(Clue, Clues), matches_clue(Country, Clue)).
```

**How it evaluates**, e.g. round 1's clues `[capital(bangkok), famous_for(elephants), borders(myanmar)]`:

1. `guess_country/2`'s first clause only fires when `Clues == []` — here the list has 3 entries, so it fails and Prolog falls through to the second clause.
2. `country(Country)` backtracks through `facts.pl`'s 15 `country/1` facts in file order: `brunei, cambodia, indonesia, laos, malaysia, myanmar, philippines, singapore, thailand, vietnam, china, india, bangladesh, papua_new_guinea, timor_leste`.
3. For each candidate, `forall(member(Clue, Clues), matches_clue(Country, Clue))` must hold for **all three** clues simultaneously:
   - `brunei`: `capital(brunei, bandar_seri_begawan)` ≠ `bangkok` → `matches_clue` fails → `forall` fails → try next country.
   - `cambodia`, `indonesia`, `laos`, `malaysia`: same story, capital doesn't match `bangkok`.
   - `myanmar`: `famous_for(myanmar, elephants)` is true and `neighbor(myanmar, myanmar)`... no — the border clue is checked against `myanmar` itself (`borders(myanmar)`), and `neighbor(myanmar, myanmar)` has no fact, so this clue fails too — myanmar is ruled out *before* its capital is even checked, since `forall` can fail on any clue.
   - `thailand`: `capital(thailand, bangkok)` ✓, `famous_for(thailand, elephants)` ✓, `neighbor(thailand, myanmar)` — `neighbor/2`'s second clause (`neighbor(A,B) :- borders(B,A)`) matches `borders(myanmar, thailand)` ✓. All three clues hold → `forall` succeeds.
4. `guess_country` returns `Country = thailand`.

This is why the `famous_for: elephants` clue *alone* is ambiguous (both Myanmar and Thailand are `famous_for(_, elephants)` in `facts.pl`) — `challengeRounds.js` explicitly pairs it with `capital: bangkok` to pin down Thailand, per its own comment. `guess_country/2` never checks for a *unique* match itself; it just returns the first `country/1` that satisfies every clue via backtracking order, so uniqueness is guaranteed only by hand-curating each round's clues, not by the Prolog logic.

## 3. Facts consumed (all from `facts.pl`, via `core.pl` for two clue types)

| Predicate | Clue type | Count | Example |
|---|---|---|---|
| `capital/2` | `capital` | 10 | `capital(thailand, bangkok).` |
| `member_of/2` (via `asean_country/1`) | `member_of` | 10 | `member_of(thailand, asean).` |
| `famous_for/2` | `famous_for` | 24 (multi-valued) | `famous_for(thailand, elephants).` |
| `borders/2` (via `neighbor/2`) | `borders` | 18 (symmetric) | `borders(myanmar, thailand).` |
| `language/2` | `language` | 14 (multi-valued for Philippines, Singapore) | `language(thailand, thai).` |
| `currency/2` | `currency` | 10 | `currency(thailand, baht).` |
| `subregion/2` | `subregion` | 10 | `subregion(thailand, mainland).` |

`country/1`'s 5 non-ASEAN entries (china, india, bangladesh, papua_new_guinea, timor_leste) have no `capital/2`, `currency/2`, `famous_for/2`, `language/2`, or `subregion/2` facts, so they can only ever satisfy a `borders` clue — a clue set built only from `borders` could theoretically resolve to one of them (see §5).

## 4. What the HTTP layer returns

```prolog
% backend/prolog/features/guess_game/routes.pl
:- http_handler(root(guess), handle_guess, []).

handle_guess(Request) :-
    cors_enable,
    http_read_json_dict(Request, Body),
    Clues = Body.get(clues),
    parse_clues(Clues, ParsedClues),
    ( guess_country(ParsedClues, Country) ->
        reply_json_dict(_{ answer: Country })
    ; reply_json_dict(_{ error: "no country matches those clues" }, [status(404)])
    ).
```

`parse_clues/2` turns each `{"type": T, "value": V}` dict the frontend sends into a Prolog compound term via `=..` (univ), e.g. `{"type": "capital", "value": "bangkok"}` → `capital(bangkok)`.

Example request/response:
```
POST /guess
{"clues":[{"type":"capital","value":"bangkok"},{"type":"famous_for","value":"elephants"},{"type":"borders","value":"myanmar"}]}

200 OK
{"answer":"thailand"}
```

A clue set that matches nothing (e.g. `capital: bangkok` + `borders: vietnam`, which no country satisfies) gets a 404:
```
404 Not Found
{"error":"no country matches those clues"}
```

## 5. How the frontend uses it (with example)

`GuessGame.jsx` never decides correctness itself — it always defers to the backend:

```js
// frontend/src/features/guess-game/components/GuessGame.jsx
const response = await guessCountry(clues);          // POST /guess with this round's clues
const correct = response.answer === guess;            // guess = the child's tapped country
setResult({ correct, answer: response.answer });
```

Walkthrough for round 1 (`CHALLENGE_ROUNDS[0]`):
1. `ClueCard`s render the three clues read-only: 🏛️ Capital city → Bangkok, 🐘 Famous for → Elephants, 🗺️ Next to → Myanmar.
2. The child taps a flag in the `GUESSABLE_COUNTRIES` grid, e.g. **Vietnam** (`guess = 'vietnam'`).
3. Pressing "✅ Check my guess" calls `guessCountry(clues)`, which `POST`s the same three clue objects the KB walkthrough in §2 used.
4. The backend returns `{"answer":"thailand"}`.
5. Since `'thailand' !== 'vietnam'`, `result = { correct: false, answer: 'thailand' }` — the UI shows "Not quite! You guessed vietnam, but it was actually thailand," marks Thailand's card with a green ✓ and Vietnam's with a red ✗, and reports a Progress score of 50 for the `flags_and_currencies` topic (a correct guess reports 100 — see `frontend/src/features/dashboard/dashboardApi.js`).

## 6. Coverage assessment

| Observation | Detail |
|---|---|
| No uniqueness check | `guess_country/2` returns the *first* matching country in `country/1`'s file order; nothing in Prolog guarantees a clue set has only one answer. Correctness of all 10 preset rounds relies entirely on the human-verified comment at the top of `challengeRounds.js`, not on any backend guarantee. |
| `currency` and `language` clues are dead in practice | `matches_clue/2` supports all 7 clue types and the frontend's `clueOptions.js` has full picker data (`CLUE_VALUES`, `CLUE_LABEL_BY_TYPE`, icons) for `currency` and `language` too — but none of the 10 rounds in `challengeRounds.js` actually use them. A fully wired capability that's never exercised. |
| Non-ASEAN answers are possible but unreachable in the UI | `country/1` includes 5 non-ASEAN countries reachable only via `borders` clues. `GUESSABLE_COUNTRIES` only offers the 10 ASEAN flags to tap, so even if a clue set resolved to e.g. `china`, the child has no way to select it as their guess — confirmed by `COUNTRY_CARD_IMAGE`'s own comment about this "theoretical" case. |
| Empty-clue guard | The `Clues == []` cut+fail clause exists so an accidental empty clue list doesn't fall through to `country(Country), forall([], _)`, which would trivially succeed and return the very first `country/1` fact (`brunei`) regardless of intent. |

## 7. Summary

Guess the Country layers one query predicate (`guess_country/2`) over a dispatch predicate (`matches_clue/2`) that fans out across 7 fact predicates spanning `facts.pl` and `core.pl`'s derived `neighbor/2`/`asean_country/1`. Given a list of clue terms, it returns the first country satisfying all of them via a plain `country(Country), forall(...)` backtracking search — no scoring, ranking, or ambiguity detection beyond "first match wins." The frontend supplies exactly 3 hand-picked, pre-verified-unique clues per round and always treats the backend's answer as ground truth.
