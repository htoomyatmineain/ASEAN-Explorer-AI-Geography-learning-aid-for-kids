# ASEAN Explorer — System Features & Sub-Features

This document lists what the app *does*, from the player's point of view — separate from
the technical docs (Prolog KB, architecture, team workflow), which cover how each
feature is built. Use this one for pitches, presentations, or scoping what's "in" for
version 1.

---

## 1. Interactive Map Learning

The entry point of the app — a big, illustrated ASEAN map the child taps and explores
freely, no quiz pressure.

- Clickable map with a pin/marker for each of the 10 ASEAN countries
- Tapping a country opens an animated country card: flag, capital, currency, main
  language(s), region
- Landmark & fun-fact gallery per country (Angkor Wat, Petronas Towers, elephants, Ha
  Long Bay, etc.)
- Visual grouping of countries by subregion — mainland Southeast Asia vs. maritime/island
  Southeast Asia
- Flip-style flag cards (colors + emoji as placeholders until final art is ready)

*Built on:* `country_info/2` and the facts in KB doc §3 · React `Map/` and
`CountryCard/` components.

---

## 2. Travel Through Each Country & Level Up (Journey Mode)

The main progression loop that ties the smaller games together into one adventure,
instead of five disconnected mini-games.

- A visible "journey path" across all 10 ASEAN countries, like stops on a game board
- Each country is a checkpoint that must be cleared before the next one unlocks
- Each checkpoint mixes in the smaller games as mini-challenges for that country:
  - a Guess-the-Country clue round
  - a Neighbor challenge
  - a Capital-matching round
- Stars, XP, or badges awarded per country cleared
- A visible level/rank that goes up as more countries are completed
- Difficulty increases at higher levels (fewer clues given, trickier distractor options)
- A "map of progress" showing which countries are done, current, and locked

*Status:* this is a new feature — not yet in the Prolog KB. It will need a few new
predicates once built: `level/2` (child's current level), `unlocked_country/2` (which
countries are available to play), and `checkpoint_passed/2` (which country-checkpoints
are cleared). These aren't built yet; flagging so nobody assumes they already exist. Say
the word and I'll add them to the KB doc with rules + example queries, same as the
other features.

---

## 3. Guess the Country (AI Reasoning Game)

The clearest "this is AI, not just a quiz" moment in the app.

- The system gives the child a set of clues (capital city, a landmark, a bordering
  country, currency, language)
- The Prolog engine reasons out which single country satisfies *all* the clues at once
  — the same deduction a child does mentally when narrowing down a guess
- Works standalone or as a Journey Mode checkpoint

*Built on:* `matches_clue/2` + `guess_country/2` (KB doc §4.3) · `GuessGame/` component.

---

## 4. Who Is My Neighbor

Turns geographic relationships into a game instead of a memorization drill.

- Shows a set of candidate countries around a selected country
- Child identifies which ones are real neighbors, or spots the one that is *not* a
  neighbor
- Map highlights the correct neighbors after the child answers

*Built on:* `find_non_neighbors/3` (KB doc §4.4) · `NeighborGame/` component.

---

## 5. Match the Capitals

A simple, fast-paced pairing game — good for younger kids or as a warm-up round.

- Country cards on one side, capital-city cards on the other
- Child drags/taps to pair them up
- Instant correct/incorrect feedback per pair

*Built on:* `check_capital_match/3` (KB doc §4.5) · `CapitalMatchGame/` component.

---

## 6. Why Is This the Answer? (Explain Mode)

What makes the app feel like an AI tutor instead of a scored quiz app.

- After any answer (right or wrong), the child can tap "Why?"
- The system responds with a plain-language reason built from the same facts that
  produced the answer — e.g., *"Yes, Myanmar and Thailand are neighbors because they
  share a border."*
- Available across every other feature, not a separate screen — it's an explanation
  layer on top of the other games

*Built on:* `explain_neighbor/3`, `explain_membership/2` (KB doc §4.6) ·
`ExplainBubble/` component.

---

## 7. Personal Progress

Turns the app from a one-size-fits-all quiz into something that adapts to each child.

- Score tracking per topic: countries & capitals, neighboring countries, ASEAN
  membership, flags & currencies
- Automatic detection of the child's weakest topic
- A recommended "next activity" pointing at whichever mini-game practices that weak spot
- Dashboard view: badges/stars earned, countries completed in Journey Mode, current
  level, topic-by-topic score breakdown

*Built on:* `student_score/2`, `weakest_topic/1`, `recommend_activity/1` (KB doc §4.7) ·
`ScoreDashboard/` component.

---

## Feature Summary Table

| # | Feature | Core game loop | Prolog logic | React component |
|---|---|---|---|---|
| 1 | Interactive Map Learning | Explore freely, no scoring | `country_info/2` | `Map/`, `CountryCard/` |
| 2 | Journey Mode (Travel & Level Up) | Clear country checkpoints to unlock the next | *new — not yet built* | `JourneyMap/` *(new)* |
| 3 | Guess the Country | Deduce the country from clues | `guess_country/2` | `GuessGame/` |
| 4 | Who Is My Neighbor | Spot real neighbors / the odd one out | `find_non_neighbors/3` | `NeighborGame/` |
| 5 | Match the Capitals | Pair countries with capitals | `check_capital_match/3` | `CapitalMatchGame/` |
| 6 | Why Is This the Answer | Get a plain-language explanation | `explain_neighbor/3` | `ExplainBubble/` |
| 7 | Personal Progress | Track scores, get recommendations | `recommend_activity/1` | `ScoreDashboard/` |

---

## What's Still Open

- Journey Mode's Prolog logic (`level/2`, `unlocked_country/2`, `checkpoint_passed/2`)
  and the unlock/level-up rules that connect it to the other four games
- Deciding whether Journey Mode replaces standalone play of features 3–5, or sits
  alongside it as an optional mode
- Reward/badge art and the specific XP thresholds for leveling up
