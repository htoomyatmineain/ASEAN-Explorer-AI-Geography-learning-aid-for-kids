# Learning Mode — Facts & Rules Reference

Companion to [`01-asean-explorer-prolog-kb.md`](01-asean-explorer-prolog-kb.md), scoped to a single feature: **Learning Mode** (frontend folder `features/learning`, routed at `/explore`, page title "Learn About ASEAN Countries!"). This is the "tap a country on the map, see a fact card" feature — distinct from Guess the Country, Who Is My Neighbor, Match the Capitals, Explain Mode, Journey Mode, and Dashboard, which each own their own `rules.pl`/`routes.pl` under `backend/prolog/features/`.

## 1. Where the logic lives

| File | Role |
|---|---|
| `backend/prolog/facts.pl` | Static ASEAN data (the facts Learning Mode reads) |
| `backend/prolog/core.pl` | Shared reasoning; supplies `asean_country/1` |
| `backend/prolog/rules.pl` | The one Learning-Mode rule, `country_info/2` |
| `backend/prolog/server.pl` | HTTP route `GET /country/:name`, calls `country_info/2`, hand-builds JSON |

Frontend chain: `Learning.page.jsx` → click on `AseanMap.jsx` → `CountryDetailPanel.jsx` → `learningApi.js#getCountryInfo` → `GET http://localhost:4000/country/:name`.

## 2. The rule

```prolog
% backend/prolog/rules.pl
country_info(Country, card(Country, Capital, Currency, FlagEmoji, Region, IsMember, MemberSince, Facts, Animals, Foods)) :-
    capital(Country, Capital),
    currency(Country, Currency),
    flag_emoji(Country, FlagEmoji),
    subregion(Country, Region),
    ( asean_country(Country) -> IsMember = yes ; IsMember = no ),
    ( asean_member_since(Country, Year) -> MemberSince = Year ; MemberSince = null ),
    findall(F, famous_for(Country, F), Facts),
    findall(A, national_animal(Country, A), Animals),
    findall(Fd, famous_food(Country, Fd), Foods).
```

Plus its one dependency in `core.pl`:

```prolog
asean_country(Country) :- member_of(Country, asean).
```

**How it evaluates**, e.g. `country_info(vietnam, Card)`:
1. `capital(vietnam, Capital)` unifies `Capital = hanoi`.
2. `currency(vietnam, Currency)` unifies `Currency = dong`.
3. `flag_emoji(vietnam, FlagEmoji)` unifies `FlagEmoji = '🇻🇳'`.
4. `subregion(vietnam, Region)` unifies `Region = mainland`.
5. `asean_country(vietnam)` succeeds (Vietnam is in `member_of/2`) → `IsMember = yes`.
6. `asean_member_since(vietnam, Year)` succeeds → `MemberSince = 1995`.
7. `findall(F, famous_for(vietnam, F), Facts)` collects **all** matching facts → `Facts = [ha_long_bay, hoi_an_lanterns]`.
8. `findall(A, national_animal(vietnam, A), Animals)` → `Animals = [water_buffalo]`.
9. `findall(Fd, famous_food(vietnam, Fd), Foods)` → `Foods = [pho]`.
10. Steps 1–4 and 7–9 are goals in one conjunction (`,`) and must all succeed — if any one fails (e.g. a country missing a `subregion/2` entry), the whole predicate fails and no card is produced. Steps 5 and 6 are if-then-elses, so they always succeed with either a real value or a fallback (`no` / `null`) — they can never fail the whole query.

This is a straight **conjunctive query with two if-then-elses and three `findall`s** — no recursion, no alternate clauses, no backtracking behavior beyond what `findall` does internally.

## 3. Facts consumed (all from `facts.pl`)

| Predicate | Arity | Count | Example |
|---|---|---|---|
| `capital/2` | 2 | 10 | `capital(vietnam, hanoi).` |
| `currency/2` | 2 | 10 | `currency(vietnam, dong).` |
| `flag_emoji/2` | 2 | 10 | `flag_emoji(vietnam, '🇻🇳').` |
| `subregion/2` | 2 | 10 | `subregion(vietnam, mainland).` |
| `member_of/2` | 2 | 10 | `member_of(vietnam, asean).` |
| `asean_member_since/2` | 2 | 10 | `asean_member_since(vietnam, 1995).` |
| `famous_for/2` | 2 | 24 (multi-valued) | `famous_for(vietnam, ha_long_bay).` |
| `national_animal/2` | 2 | 10 | `national_animal(vietnam, water_buffalo).` |
| `famous_food/2` | 2 | 11 (multi-valued; Indonesia has 2) | `famous_food(vietnam, pho).` |

`country/1` and the 5 non-ASEAN `country/1` facts (china, india, bangladesh, papua_new_guinea, timor_leste) exist for other features' border/neighbor reasoning; they are never targets of `country_info/2` in practice since only the 10 ASEAN countries are clickable on the map.

## 4. What the HTTP layer returns

```prolog
% backend/prolog/server.pl
:- http_handler(root(country/Name), handle_country(Name), []).

handle_country(NameAtom, _Request) :-
    cors_enable,
    ( country_info(NameAtom, card(NameAtom, Capital, Currency, Flag, Region, IsMember, MemberSince, Facts, Animals, Foods)) ->
        json_unicode_escape(Flag, FlagEscaped),
        maplist(json_quote_atom, Facts, QuotedFacts),
        atomic_list_concat(QuotedFacts, ',', FactsJoined),
        maplist(json_quote_atom, Animals, QuotedAnimals),
        atomic_list_concat(QuotedAnimals, ',', AnimalsJoined),
        maplist(json_quote_atom, Foods, QuotedFoods),
        atomic_list_concat(QuotedFoods, ',', FoodsJoined),
        format('Content-type: application/json~n~n'),
        format(
            '{"country":"~w","capital":"~w","currency":"~w","flag":"~w","region":"~w","asean_member":"~w","member_since":~w,"famous_for":[~w],"animals":[~w],"foods":[~w]}',
            [NameAtom, Capital, Currency, FlagEscaped, Region, IsMember, MemberSince, FactsJoined, AnimalsJoined, FoodsJoined]
        )
    ; reply_json_dict(_{ error: "Country not found" }, [status(404)])
    ).
```

Example live response (`GET /country/vietnam`):
```json
{"country":"vietnam","capital":"hanoi","currency":"dong","flag":"🇻🇳","region":"mainland","asean_member":"yes","member_since":1995,"famous_for":["ha_long_bay","hoi_an_lanterns"],"animals":["water_buffalo"],"foods":["pho"]}
```

JSON is hand-built (not `reply_json_dict`) to work around a documented SWI-Prolog-on-Windows bug where astral Unicode characters (flag emoji) get corrupted through `thread_httpd`'s socket stream — `json_unicode_escape/2` encodes the flag as a surrogate pair first.

`CountryDetailPanel.jsx` renders `flag`, `country`, `capital`, `currency`, `region`, `member_since` (as "ASEAN Member since {year}"), `animals` (as "National Animal"), `famous_for`, and `foods`. `asean_member` itself still isn't directly rendered as text — it only gates whether the "ASEAN Member" badge shows at all.

## 5. Coverage assessment — does the Prolog cover all of Learning Mode?

**Syntax/logic:** sound. Every clause is well-formed, every variable in `country_info/2`'s body is bound before use, no singleton-variable risk, no missing base cases (it's non-recursive).

**Completeness relative to intent:** mostly there. `national_animal/2`, `famous_food/2`, and `asean_member_since/2` (all in `facts.pl` §3.9–3.10) are fully wired into `country_info/2` and rendered in the UI — these are not gaps. Remaining gaps:

| Gap | Detail |
|---|---|
| `language/2` unused in Learning Mode | Facts exist and are correct (used elsewhere by `guess_game`), but `country_info/2`'s card term has no language slot. A kids' geography app omitting the language a country speaks is a plausible content gap. |
| `flag_colors/2` dead | 10 facts declared, never queried by any rule anywhere in the codebase. Per KB doc §3.5, intended for a placeholder flag badge — never wired up. |
| `coordinates/3` dead & duplicated | 10 facts declared, never queried in Prolog. The frontend map instead uses topojson geometry for positioning — two disconnected sources of "where is this country" that could disagree. |
| `asean_founded/1`, `asean_motto/1` dead | Single facts, never queried, never fetched by frontend. |
| No "list all countries" route | KB doc §5.7 shows `findall(C, asean_country(C), AllCountries)` as a useful query, but no route exposes it. Frontend hardcodes the 10-country list in `countryCodes.js` instead of deriving it from Prolog — can silently drift if `facts.pl` membership changes. |
| All-or-nothing card | `country_info/2`'s non-optional goals (capital/currency/flag/subregion/famous_for/animals/foods) are one conjunction; a missing fact for any of them fails the whole predicate (→ 404) rather than returning a partial card. |
| Facts still documented but never written | KB doc §7's older list (`population/2`, `area_km2/2`, `national_flower/2`, `neighbor_count/2`, `translate/3`) still don't exist in `facts.pl` — unlike `national_animal/2`, which has since been added. |
| No tests for this predicate | `run_tests.pl`/`test_script.pl` test `neighbor/2`, `is_landlocked/1`, `same_subregion/2` — nothing exercises `country_info/2` or `handle_country/2`. |

## 6. Summary

Learning Mode's Prolog logic is a single, correct rule (`country_info/2`) over nine fact predicates. It surfaces capital, currency, flag, region/subregion, ASEAN membership (plus the year joined), a national animal, a list of famous landmarks, and a list of famous foods per country — a good deal more than a first pass at `rules.pl` might suggest. It still isn't the *entire* knowledge base: `language`, `flag_colors`, `coordinates`, `asean_founded`, and `asean_motto` sit in `facts.pl` unused by any rule, and a few facts from the original design doc (`population`, `area_km2`, `national_flower`) were never added at all. Extending Learning Mode further is mostly a matter of widening `country_info/2`'s card term and, where needed, adding new facts to `facts.pl`.
