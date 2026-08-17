# ASEAN Explorer — Prolog Knowledge Base (v2, with explanations)

This is the reasoning "brain" of ASEAN Explorer. Everything the app tells a child — a
country's capital, whether two countries are neighbors, whether a guess is correct, what
to practice next — comes from querying this knowledge base rather than from text
hard-coded in the frontend.

This version adds a plain-language explanation above every block, and a progress
checklist at the end, so anyone on the team (including non-Prolog people) can see what
exists and how much is left to build.

> How to use this file: copy each `prolog` code block into the matching `.pl` file
> (see §7 "File Layout" and the architecture doc for exact filenames), then load
> everything with `?- [kb].` in SWI-Prolog.

---

## 1. The Big Picture

```
ASEAN Knowledge → Prolog Facts → Prolog Rules → AI Reasoning → Interactive Learning
```

Three layers, and why they're kept separate:

- **Facts** (§3) are just data — "Thailand's capital is Bangkok." No logic, nothing to
  compute. This is what changes most often (adding a country, fixing a typo).
- **Rules** (§4) are logic that *derives* new facts from old ones — "two countries are
  neighbors if one borders the other, in either direction." This is what makes the app
  feel intelligent instead of being a lookup table.
- **Queries** (§6) are what the frontend actually asks. Each one maps to a real button
  or screen in the app, so this file doubles as an API contract between the Prolog side
  and the React side.

Keeping facts and rules in separate `.pl` files means a teammate can add ten new
countries without ever touching the reasoning logic, and vice versa.

---

## 2. Predicate Schema Reference

Read this table like a dictionary — whenever a code block below uses a predicate you
don't recognize, look it up here.

| Predicate | Arity | Meaning | Example |
|---|---|---|---|
| `country/1` | 1 | Something is a recognized country in the KB (ASEAN or neighboring) | `country(thailand).` |
| `member_of/2` | 2 | Country is a member of a bloc | `member_of(thailand, asean).` |
| `capital/2` | 2 | Country → capital city | `capital(thailand, bangkok).` |
| `currency/2` | 2 | Country → currency | `currency(thailand, baht).` |
| `language/2` | 2 | Country → an official/main language (multiple facts allowed) | `language(singapore, english).` |
| `flag_emoji/2` | 2 | Country → flag emoji | `flag_emoji(thailand, '🇹🇭').` |
| `flag_colors/2` | 2 | Country → list of main flag colors | `flag_colors(thailand, [red, white, blue]).` |
| `coordinates/3` | 3 | Country → approx. capital latitude/longitude (for the map pin) | `coordinates(thailand, 13.7563, 100.5018).` |
| `subregion/2` | 2 | Country → `mainland` or `maritime` Southeast Asia | `subregion(thailand, mainland).` |
| `famous_for/2` | 2 | Country → a notable landmark/animal/feature (multiple facts allowed) | `famous_for(thailand, elephants).` |
| `borders/2` | 2 | Raw, one-directional land-border fact | `borders(myanmar, thailand).` |
| `landlocked/1` | 1 | Country has no coastline | `landlocked(laos).` |
| `no_land_neighbors/1` | 1 | Country has no land borders at all | `no_land_neighbors(philippines).` |
| `asean_founded/1` | 1 | Year ASEAN was founded | `asean_founded(1967).` |
| `asean_motto/1` | 1 | ASEAN's motto | `asean_motto('One Vision, One Identity, One Community').` |
| `student_score/2` *(dynamic — changes at runtime)* | 2 | Topic → child's current quiz score (0–100) | `student_score(neighboring_countries, 40).` |

**Derived predicates** (rule-only — never stored as facts, always computed on the fly):
`asean_country/1`, `capital_of/2`, `currency_of/2`, `neighbor/2`, `neighbors_of/2`,
`asean_neighbors_of/2`, `same_subregion/2`, `is_landlocked/1`, `country_info/2`,
`matches_clue/2`, `guess_country/2`, `find_non_neighbors/3`, `check_capital_match/3`,
`explain_neighbor/3`, `weakest_topic/1`, `recommend_activity/1`.

*Why the split matters:* facts are things you can be wrong about and need to correct by
hand (e.g., a capital city). Derived predicates can never be "wrong" on their own — if
`neighbor/2` gives a bad answer, the bug is in the `borders/2` facts feeding it, not in
the rule itself. This makes debugging much faster once the team grows.

---

## 3. Facts

### 3.1 Countries & ASEAN Membership

The 10 ASEAN members, plus five outside countries (China, India, Bangladesh, Papua New
Guinea, Timor-Leste) that are **not** ASEAN members but physically border one — they're
included only so the neighbor-finding logic in §4 has the full picture. Without them,
asking "who borders Myanmar?" would silently omit China, India, and Bangladesh.

```prolog
% The 10 ASEAN member states
country(brunei).
country(cambodia).
country(indonesia).
country(laos).
country(malaysia).
country(myanmar).
country(philippines).
country(singapore).
country(thailand).
country(vietnam).

% Non-ASEAN countries needed only so border/neighbor reasoning is complete
country(china).
country(india).
country(bangladesh).
country(papua_new_guinea).
country(timor_leste).

member_of(brunei,      asean).
member_of(cambodia,    asean).
member_of(indonesia,   asean).
member_of(laos,        asean).
member_of(malaysia,    asean).
member_of(myanmar,     asean).
member_of(philippines, asean).
member_of(singapore,   asean).
member_of(thailand,    asean).
member_of(vietnam,     asean).

asean_founded(1967).
asean_motto('One Vision, One Identity, One Community').
```

*Note:* China, India, Bangladesh, Papua New Guinea, and Timor-Leste deliberately have
**no** `member_of(_, asean)` fact. Prolog uses the "closed world assumption" — if a fact
isn't stated, it's treated as false. So `asean_country(china)` will correctly fail
without you having to write `not_member_of(china, asean).` anywhere.

### 3.2 Capitals

```prolog
capital(brunei,      bandar_seri_begawan).
capital(cambodia,    phnom_penh).
capital(indonesia,   jakarta).
capital(laos,        vientiane).
capital(malaysia,    kuala_lumpur).
capital(myanmar,     naypyidaw).
capital(philippines, manila).
capital(singapore,   singapore_city).
capital(thailand,    bangkok).
capital(vietnam,     hanoi).
```

### 3.3 Currencies

```prolog
currency(brunei,      brunei_dollar).
currency(cambodia,    riel).
currency(indonesia,   rupiah).
currency(laos,        kip).
currency(malaysia,    ringgit).
currency(myanmar,     kyat).
currency(philippines, philippine_peso).
currency(singapore,   singapore_dollar).
currency(thailand,    baht).
currency(vietnam,     dong).
```

### 3.4 Languages

Some countries have more than one official/main language, so this predicate is written
**one fact per language** rather than cramming a list into one fact. That's a
deliberate style choice: `language(singapore, english).`, `language(singapore, malay).`
etc. is easier to query ("find every country where Malay is spoken") than digging
through lists would be.

```prolog
language(brunei,      malay).
language(cambodia,    khmer).
language(indonesia,   indonesian).
language(laos,        lao).
language(malaysia,    malay).
language(myanmar,     burmese).
language(philippines, filipino).
language(philippines, english).
language(singapore,   english).
language(singapore,   malay).
language(singapore,   mandarin).
language(singapore,   tamil).
language(thailand,    thai).
language(vietnam,     vietnamese).
```

### 3.5 Flags

Two facts per country: an emoji (quick to render anywhere, including inside a Prolog
`format/2` string) and a color list (useful if the illustrator wants to auto-generate a
placeholder badge before the final flag art is ready).

```prolog
flag_emoji(brunei,      '🇧🇳').
flag_emoji(cambodia,    '🇰🇭').
flag_emoji(indonesia,   '🇮🇩').
flag_emoji(laos,        '🇱🇦').
flag_emoji(malaysia,    '🇲🇾').
flag_emoji(myanmar,     '🇲🇲').
flag_emoji(philippines, '🇵🇭').
flag_emoji(singapore,   '🇸🇬').
flag_emoji(thailand,    '🇹🇭').
flag_emoji(vietnam,     '🇻🇳').

flag_colors(brunei,      [yellow, white, black, red]).
flag_colors(cambodia,    [blue, red, white]).
flag_colors(indonesia,   [red, white]).
flag_colors(laos,        [red, blue, white]).
flag_colors(malaysia,    [red, white, blue, yellow]).
flag_colors(myanmar,     [yellow, green, red, white]).
flag_colors(philippines, [blue, red, white, yellow]).
flag_colors(singapore,   [red, white]).
flag_colors(thailand,    [red, white, blue]).
flag_colors(vietnam,     [red, yellow]).
```

### 3.6 Map Coordinates

Latitude/longitude of each capital city, for placing a pin on the interactive map.
These are approximate — precise enough for a kids' map at country scale, not for GPS
navigation.

```prolog
coordinates(brunei,       4.9031, 114.9398).
coordinates(cambodia,    11.5564, 104.9282).
coordinates(indonesia,   -6.2088, 106.8456).
coordinates(laos,        17.9757, 102.6331).
coordinates(malaysia,     3.1390, 101.6869).
coordinates(myanmar,     19.7633,  96.0785).
coordinates(philippines, 14.5995, 120.9842).
coordinates(singapore,    1.3521, 103.8198).
coordinates(thailand,    13.7563, 100.5018).
coordinates(vietnam,     21.0285, 105.8542).
```

### 3.7 Subregion (mainland vs. maritime Southeast Asia)

A simple two-way split used for "which part of Southeast Asia" questions and for
grouping countries visually on the map (e.g., color the mainland cluster differently
from the island cluster).

```prolog
subregion(myanmar,     mainland).
subregion(thailand,    mainland).
subregion(laos,        mainland).
subregion(cambodia,    mainland).
subregion(vietnam,     mainland).

subregion(brunei,      maritime).
subregion(indonesia,   maritime).
subregion(malaysia,    maritime).
subregion(philippines, maritime).
subregion(singapore,   maritime).
```

### 3.8 Famous Landmarks / Animals / Highlights

Deliberately **multiple facts per country**, not a list, for the same reason as
languages — it lets the "Guess the Country" game (§4.3) check one clue at a time using
plain pattern matching instead of list-membership logic.

```prolog
famous_for(brunei,      sultan_omar_ali_saifuddien_mosque).
famous_for(brunei,      kampong_ayer).

famous_for(cambodia,    angkor_wat).
famous_for(cambodia,    tonle_sap_lake).

famous_for(indonesia,   borobudur_temple).
famous_for(indonesia,   komodo_dragons).
famous_for(indonesia,   bali_beaches).

famous_for(laos,        luang_prabang_temples).
famous_for(laos,        mekong_river).

famous_for(malaysia,    petronas_towers).
famous_for(malaysia,    orangutans).

famous_for(myanmar,     elephants).
famous_for(myanmar,     shwedagon_pagoda).
famous_for(myanmar,     bagan_temples).

famous_for(philippines, chocolate_hills).
famous_for(philippines, palawan_islands).

famous_for(singapore,   merlion).
famous_for(singapore,   marina_bay_sands).
famous_for(singapore,   gardens_by_the_bay).

famous_for(thailand,    elephants).
famous_for(thailand,    grand_palace).

famous_for(vietnam,     ha_long_bay).
famous_for(vietnam,     hoi_an_lanterns).
```

### 3.9 Borders

This is the part that trips people up, so it's worth explaining carefully. Each border
is written **only once**, from one country's perspective:

```prolog
borders(myanmar, thailand).
```

This does **not** mean "Myanmar borders Thailand but Thailand doesn't border Myanmar" —
it means "this fact happens to be written with Myanmar first." Writing it twice
(`borders(myanmar, thailand).` and `borders(thailand, myanmar).`) would work but doubles
the data to maintain and risks the two copies drifting out of sync if someone edits one
and forgets the other. Instead, §4.1 defines a `neighbor/2` **rule** that reads
`borders/2` in both directions, so the KB only has to state each real-world border once.

```prolog
% Mainland Southeast Asia
borders(myanmar,  thailand).
borders(myanmar,  laos).
borders(myanmar,  china).          % non-ASEAN
borders(myanmar,  india).          % non-ASEAN
borders(myanmar,  bangladesh).     % non-ASEAN
borders(thailand, laos).
borders(thailand, cambodia).
borders(thailand, malaysia).
borders(laos,     cambodia).
borders(laos,     vietnam).
borders(laos,     china).          % non-ASEAN
borders(cambodia, vietnam).
borders(vietnam,  china).          % non-ASEAN

% Maritime Southeast Asia
borders(malaysia,  indonesia).
borders(malaysia,  brunei).
borders(malaysia,  singapore).     % joined by the Johor–Singapore Causeway, not a natural land border
borders(indonesia, papua_new_guinea). % non-ASEAN
borders(indonesia, timor_leste).      % non-ASEAN
```

### 3.10 Special Facts

```prolog
landlocked(laos).               % Laos is the only landlocked ASEAN country
no_land_neighbors(philippines). % An archipelago — no land borders at all
no_land_neighbors(singapore).   % Island city-state; the causeway to Malaysia is a bridge, not a natural border
```

---

## 4. Rules (Reasoning Layer)

### 4.1 Core reasoning

`neighbor/2` is the single most important rule in the whole KB — almost every game
feature depends on it. It's written as **two clauses** so a query works no matter which
country you ask about first:

```prolog
% Is Country an ASEAN member?
asean_country(Country) :-
    member_of(Country, asean).

capital_of(Country, City) :-
    capital(Country, City).

currency_of(Country, Currency) :-
    currency(Country, Currency).

% Borders are stored once; neighbor/2 makes the relationship symmetric.
% Clause 1 handles "Myanmar borders Thailand" being asked as neighbor(myanmar, X).
% Clause 2 handles the same fact being asked as neighbor(thailand, X).
neighbor(A, B) :- borders(A, B).
neighbor(A, B) :- borders(B, A).

neighbors_of(Country, Neighbors) :-
    findall(N, neighbor(Country, N), Neighbors).

% Only the neighbors that are also ASEAN members (filters out China, India, etc.)
asean_neighbors_of(Country, Neighbors) :-
    findall(N, (neighbor(Country, N), asean_country(N)), Neighbors).

same_subregion(A, B) :-
    subregion(A, Region),
    subregion(B, Region),
    A \== B.

is_landlocked(Country) :-
    landlocked(Country).
```

`findall/3` is used repeatedly here — it means "collect every answer Prolog can find
for this question into a list," which is exactly what a UI needs (a list of neighbor
countries to highlight on the map, not just one).

### 4.2 Feature 1 — "Explore ASEAN" (map click → country card)

One query builds the entire card the child sees when they tap a country — capital,
currency, flag, region, ASEAN status, and fun facts, all in one round trip instead of
five separate requests.

```prolog
% country_info(+Country, -Card) builds the full pop-up card shown when a
% child taps a country on the interactive map.
country_info(Country, card(Country, Capital, Currency, FlagEmoji, Region, IsMember, Facts)) :-
    capital(Country, Capital),
    currency(Country, Currency),
    flag_emoji(Country, FlagEmoji),
    subregion(Country, Region),
    ( asean_country(Country) -> IsMember = yes ; IsMember = no ),
    findall(F, famous_for(Country, F), Facts).
```

### 4.3 Feature 2 — "Guess the Country" (clue-based reasoning)

This is the clearest demonstration of Prolog actually *reasoning* rather than just
storing data: the frontend sends a list of clues, and Prolog finds whichever country
satisfies **all of them at once** — the same kind of constraint-solving a child does in
their head when narrowing down a guess.

```prolog
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
guess_country(Clues, Country) :-
    country(Country),
    forall(member(Clue, Clues), matches_clue(Country, Clue)).
```

`forall(member(Clue, Clues), matches_clue(Country, Clue))` reads as "for every clue in
the list, that clue must match this country" — if even one clue fails, Prolog backtracks
and tries a different country. This is why the earlier example (elephants + Bangkok)
correctly lands on Thailand and not Myanmar, even though both are "famous for elephants."

### 4.4 Feature 3 — "Who Is My Neighbor?" (odd-one-out)

```prolog
% find_non_neighbors(+Country, +Candidates, -NonNeighbors) picks out the
% candidate(s) that do NOT actually border Country — this is the
% "which one is NOT a neighbor?" answer key.
find_non_neighbors(Country, Candidates, NonNeighbors) :-
    findall(X, (member(X, Candidates), \+ neighbor(Country, X)), NonNeighbors).

% is_real_neighbor(+Country, +Candidate) — simple yes/no check for a single option
is_real_neighbor(Country, Candidate) :-
    neighbor(Country, Candidate).
```

**Design note:** if you present Myanmar's options as China, India, Bangladesh, Thailand,
Laos — that happens to be Myanmar's exact five real neighbors, so there's no correct
"odd one out" in that specific set. Always include at least one genuine non-neighbor
(e.g., Vietnam) in the candidate list, or `find_non_neighbors/3` will correctly return
an empty list and the game will have no valid answer.

### 4.5 Feature 4 — "Match the Capitals" (answer checking)

```prolog
% check_capital_match(+Country, +GuessedCity, -Result) grades a drag-and-drop
% or tap-to-match answer.
check_capital_match(Country, GuessedCity, correct) :-
    capital(Country, GuessedCity), !.
check_capital_match(_Country, _GuessedCity, incorrect).
```

The `!` (cut) after the first clause means "if this matched, stop looking for other
ways to answer" — without it, Prolog could try to satisfy the second clause too on
backtracking and hand the frontend `incorrect` right after already giving `correct`.

### 4.6 Feature 5 — "Why Is This the Answer?" (explanations)

This is what separates ASEAN Explorer from a plain quiz app: instead of yes/no, the
system explains *why*, built from the same facts the answer came from.

```prolog
% explain_neighbor(+A, +B, -Explanation) gives a plain-language reason,
% not just yes/no — this is what makes the app feel like real AI reasoning.
explain_neighbor(A, B, Explanation) :-
    neighbor(A, B), !,
    format(atom(Explanation),
           'Yes. ~w and ~w are neighboring countries because they share a border.',
           [A, B]).
explain_neighbor(A, B, Explanation) :-
    format(atom(Explanation),
           'No. ~w and ~w do not share a border, so they are not neighboring countries.',
           [A, B]).

% explain_membership(+Country, -Explanation)
explain_membership(Country, Explanation) :-
    asean_country(Country), !,
    format(atom(Explanation), '~w is a member of ASEAN.', [Country]).
explain_membership(Country, Explanation) :-
    format(atom(Explanation), '~w is not a member of ASEAN.', [Country]).
```

### 4.7 Personalized Learning

Unlike everything above, `student_score/2` isn't a fixed fact — it changes every time a
child finishes a quiz round, so it's declared `dynamic` and updated with
`assertz`/`retractall` instead of being written by hand in a `.pl` file.

```prolog
:- dynamic student_score/2.

% Each topic maps to the mini-game that best practices it
activity_for(countries_and_capitals,  match_the_capitals_game).
activity_for(neighboring_countries,   who_is_my_neighbor_game).
activity_for(asean_membership,        explore_asean_game).
activity_for(flags_and_currencies,    guess_the_country_game).

% set_score(+Topic, +Score) — call after each quiz round to update the profile
set_score(Topic, Score) :-
    retractall(student_score(Topic, _)),
    assertz(student_score(Topic, Score)).

% weakest_topic(-Topic) — the topic with the lowest recorded score
weakest_topic(Topic) :-
    findall(Score-T, student_score(T, Score), Pairs),
    sort(Pairs, [_-Topic|_]).   % sort/2 orders by Score first (standard order of terms)

% recommend_activity(-Activity) — what the child should try next
recommend_activity(Activity) :-
    weakest_topic(Topic),
    activity_for(Topic, Activity).

% needs_practice(-Topic) — any topic scoring below 60%
needs_practice(Topic) :-
    student_score(Topic, Score),
    Score < 60.
```

> Because this data is per-child and changes constantly, it should **not** live in the
> same `.pl` files as facts/rules. See the architecture doc for where it's meant to live
> (a small database, keyed by child/session, that gets loaded into `student_score/2` at
> the start of each session).

---

## 5. Example Queries & Expected Results

### 5.1 Explore ASEAN — tap Thailand on the map

```prolog
?- country_info(thailand, Card).
Card = card(thailand, bangkok, baht, '🇹🇭', mainland, yes,
            [elephants, grand_palace]).
```

### 5.2 Guess the Country — clue set from the brief

```prolog
?- guess_country([member_of(asean), capital(bangkok),
                   famous_for(elephants), borders(myanmar)], Country).
Country = thailand.
```

### 5.3 Who Is My Neighbor — Myanmar, with a genuine distractor

```prolog
?- find_non_neighbors(myanmar,
       [china, india, bangladesh, thailand, laos, vietnam], NotNeighbors).
NotNeighbors = [vietnam].

?- neighbors_of(myanmar, Neighbors).
Neighbors = [thailand, laos, china, india, bangladesh].
```

### 5.4 Match the Capitals

```prolog
?- check_capital_match(vietnam, hanoi, Result).
Result = correct.

?- check_capital_match(vietnam, manila, Result).
Result = incorrect.
```

### 5.5 Why Is This the Answer?

```prolog
?- explain_neighbor(myanmar, thailand, Explanation).
Explanation = 'Yes. myanmar and thailand are neighboring countries because they share a border.'.

?- explain_neighbor(myanmar, vietnam, Explanation).
Explanation = 'No. myanmar and vietnam do not share a border, so they are not neighboring countries.'.
```

### 5.6 Personalized Learning

```prolog
?- set_score(countries_and_capitals, 90),
   set_score(neighboring_countries, 40),
   set_score(asean_membership, 80).

?- weakest_topic(Topic).
Topic = neighboring_countries.

?- recommend_activity(Activity).
Activity = who_is_my_neighbor_game.

?- findall(T, needs_practice(T), WeakTopics).
WeakTopics = [neighboring_countries].
```

### 5.7 A few more useful ones

```prolog
% All ASEAN countries, for populating the map/list view
?- findall(C, asean_country(C), AllCountries).

% Only the ASEAN neighbors of Indonesia (filters out Papua New Guinea, Timor-Leste)
?- asean_neighbors_of(indonesia, X).
X = [malaysia].

% Is Laos landlocked? (used for a "which ASEAN country has no coastline?" quiz)
?- is_landlocked(laos).
true.

% Two countries in the same part of Southeast Asia?
?- same_subregion(thailand, vietnam).
true.
?- same_subregion(thailand, singapore).
false.
```

---

## 6. File Layout for These Code Blocks

Keep facts and rules physically separate — the "why" is explained in §1 and in the
architecture doc, this is just the concrete mapping:

| This file's section | Goes into |
|---|---|
| §3.1 – §3.10 | `backend/prolog/facts.pl` |
| §4.1 – §4.6 | `backend/prolog/rules.pl` |
| §4.7 (dynamic, per-session) | `backend/prolog/session.pl` (loaded fresh per child/session) |
| — | `backend/prolog/kb.pl` just does `:- [facts, rules].` to load both |

---

## 7. Progress Tracker — How Far We've Gotten

Use this as a running checklist. Check items off as they're implemented and tested
against real queries (not just "written," but confirmed to return the right answer).

### Done (this document)

- [x] All 10 ASEAN countries: capital, currency, language(s), flag, coordinates, subregion
- [x] Non-ASEAN neighbor countries for complete border reasoning
- [x] Land borders for all 10 countries, verified against real-world geography
- [x] Famous landmarks/animals (2–3 per country)
- [x] Core reasoning rules: `asean_country/1`, `neighbor/2`, `neighbors_of/2`, `same_subregion/2`
- [x] Rules for all 5 game features described in the project brief
- [x] Personalized-learning scoring + recommendation rules
- [x] Worked example queries for every feature

### Not started yet (known gaps)

- [ ] `population/2`, `area_km2/2` — needed for "biggest/smallest country" comparison games
- [ ] `national_animal/2`, `national_flower/2` — more clue types for Guess the Country
- [ ] `neighbor_count/2` — derived stat for a "most neighbors" leaderboard question
- [ ] `translate/3` (Country, English, LocalLanguageLabel) — only needed if the UI will show non-English labels
- [ ] `difficulty/2` per topic, combined with `student_score/2`, for adaptive question generation
- [ ] A real persistence layer for `student_score/2` (currently in-memory only — see architecture doc §4)
- [ ] Automated tests that run every query in §5 and check the result, so future edits to facts.pl can't silently break a game feature
- [ ] Content review pass by someone who can double-check geography facts against a second source (capitals, borders, currencies do change occasionally — e.g., Indonesia's capital is officially relocating to Nusantara over the coming years, and this KB currently reflects Jakarta as current capital)

### How to extend this KB safely

1. New country data → add to `facts.pl` only, following the existing predicate patterns above.
2. New reasoning (a new game idea) → add to `rules.pl`, and add a worked example to §5 of this doc.
3. Whatever you add, add a matching row to §5 with the exact query and expected answer —
   that pairing is what the frontend team (and future you) will test against.
