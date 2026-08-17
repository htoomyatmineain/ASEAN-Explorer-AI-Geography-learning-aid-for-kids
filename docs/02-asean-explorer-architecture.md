# ASEAN Explorer — Frontend Choice, Folder Structure & Prolog Connection

## 1. React or Bootstrap? (They're not actually competing choices)

Short answer: **use React. Don't rely on Bootstrap for the look.**

The reason this question feels like an either/or is that the two tools solve different
problems, and it's worth being precise about that before picking:

| | What it actually is | What it's good at |
|---|---|---|
| **React** | A JavaScript library for building the *app itself* — screens, components, state (score, current game, which country is selected), routing between the map/quiz/dashboard | Interactivity: click a country → card animates in; answer a quiz → score updates instantly; drag a capital onto a country. This is the actual "game engine" part of your app. |
| **Bootstrap** | A CSS component library — pre-made buttons, cards, navbars, grids | Getting a clean, professional, *business-looking* website up fast. It is explicitly **not** designed for playful, cartoonish, animated interfaces — its whole design language is neutral and corporate. |

So the real choice isn't "React vs. Bootstrap," it's **"React vs. plain HTML/CSS/JS,"**
and for a stateful, game-like, kid-facing app, React wins clearly:

- The app has real state to manage (current score, which country is selected, quiz
  progress, which topic is weakest) — React's component model is built for exactly this.
- You'll reuse the same building blocks constantly (a country card, a flag badge, a
  quiz question, a "why?" speech bubble) — React components are the natural fit.
- Every game feature in your brief (guess-the-country, drag-to-match, neighbor
  highlighting) needs to re-render parts of the screen instantly based on Prolog's
  answer — React handles that re-rendering for you.

**For styling** (the "cartoon 2D, game-like" look you want), skip Bootstrap and use one
of these instead, inside your React app:

- **Tailwind CSS** — utility classes, very fast to build custom playful designs with,
  huge community, easiest to make "not look like every other Bootstrap site."
  *(Recommended default — good balance of speed and creative control.)*
- **Framer Motion** — a React animation library, layer this on top of Tailwind for the
  bouncy/springy animations that make an interface feel like a game (cards popping in,
  characters wiggling, confetti on a correct answer).
- **CSS Modules / styled-components** — if the team prefers writing plain CSS per
  component instead of utility classes. Either works fine with the folder structure below.

You can still use **Bootstrap's grid system alone** if someone on the team is faster
with it for layout — that's fine, grids are neutral. Just don't lean on Bootstrap's
default buttons/cards/navbar components, or the app will visually fight against the
"cartoon game" feel you're going for.

*Optional, later:* if you want fully game-like elements (draggable sprites, physics,
particle effects) beyond what CSS animations can comfortably do, a canvas library like
**Pixi.js** or a mini game engine like **Phaser** can be dropped into a single React
component for just that screen (e.g., the map). Not needed to start — mention it here so
the team knows the option exists if v1 CSS animations feel limited.

---

## 2. How Prolog and the Frontend Work Together

### 2.1 The big picture

React never talks to Prolog directly — browsers can't run Prolog. Instead, Prolog runs
as its own small **backend server**, and React talks to it the same way it would talk
to any web API: over HTTP, exchanging JSON.

```
┌─────────────────────┐        HTTP request (JSON)        ┌──────────────────────────┐
│   React Frontend     │ ─────────────────────────────────▶│   Prolog Backend Server   │
│  (runs in browser)   │                                    │   (SWI-Prolog + facts.pl  │
│                       │ ◀───────────────────────────────── │    + rules.pl)            │
│  child taps Thailand  │        HTTP response (JSON)        │  runs country_info/2      │
└─────────────────────┘                                    └──────────────────────────┘
```

Concretely, for the "Explore ASEAN" feature:

1. Child taps Thailand on the map (a React `<CountryPin>` component).
2. React's click handler calls `fetch('/api/country/thailand')`.
3. The Prolog server receives that HTTP request, runs `country_info(thailand, Card)`
   against the knowledge base, and converts the result to JSON.
4. React receives the JSON, stores it in state, and renders the `<CountryCard>`
   component with an animation.

The same pattern repeats for every feature — a React event triggers a `fetch` call, a
Prolog query runs, JSON comes back, a component re-renders. **Prolog never renders
anything and never knows about pixels, colors, or animations — it only answers
questions.** That separation is exactly what keeps the reasoning layer (this is your
"AI" component) testable and independent from how the UI happens to look.

### 2.2 Recommended setup: SWI-Prolog's own HTTP server (simplest)

SWI-Prolog has a built-in library for exposing predicates as JSON HTTP endpoints —
`library(http/http_json)`. This means you do **not** need Node.js/Express as a
middle layer just to serve requests; Prolog can be the whole backend.

```prolog
% backend/prolog/server.pl
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_cors)).   % allow the React dev server to call this API

:- [kb].   % loads facts.pl, core.pl, and every feature's rules.pl (see §3)

% Each feature owns its own route file — server.pl just loads them.
% This is the file Person 1 (Core & Integration Lead, doc 3) maintains; adding a
% feature means adding one line here, not editing someone else's routes.
:- [features/explore_map/routes].
:- [features/journey_mode/routes].
:- [features/guess_game/routes].
:- [features/neighbor_game/routes].
:- [features/capital_match/routes].
:- [features/explain_mode/routes].
:- [features/dashboard/routes].

:- initialization(http_server([port(4000)])).
```

```prolog
% backend/prolog/features/explore_map/routes.pl
:- http_handler(root(country/Name), handle_country(Name), []).

handle_country(NameAtom, _Request) :-
    atom_string(NameAtom, NameStr),
    atom_string(Country, NameStr),
    ( country_info(Country, card(Country, Capital, Currency, Flag, Region, IsMember, Facts)) ->
        reply_json_dict(_{ country: Country, capital: Capital, currency: Currency,
                            flag: Flag, region: Region, asean_member: IsMember,
                            famous_for: Facts })
    ; reply_json_dict(_{ error: "country not found" }, [status(404)])
    ).
```

```prolog
% backend/prolog/features/guess_game/routes.pl
:- http_handler(root(guess), handle_guess, [method(post)]).

handle_guess(Request) :-
    http_read_json_dict(Request, Body),
    Clues = Body.get(clues),           % list of clue objects sent by React
    parse_clues(Clues, ParsedClues),   % convert JSON clues into Prolog terms
    ( guess_country(ParsedClues, Country) ->
        reply_json_dict(_{ answer: Country })
    ; reply_json_dict(_{ error: "no country matches those clues" }, [status(404)])
    ).
```

Run it with `swipl backend/prolog/server.pl` and the API is live on
`http://localhost:4000`. This is the **recommended path to start with** — one language
for the reasoning layer, one process to run, minimal glue code. Splitting `routes.pl`
per feature (§3) means the file above stays a one-line-per-feature index instead of
growing into one giant shared file every route lives in.

### 2.3 Alternative: Node/Express in front of Prolog

If the team later wants things Node does well out of the box — user accounts, a proper
database, file uploads for custom avatars — you can put a small Express server in front
and have it call out to `swipl` for just the reasoning part, using a child process:

```js
// backend/node/prologBridge.js
const { execFile } = require('child_process');

function runQuery(goal) {
  return new Promise((resolve, reject) => {
    execFile('swipl', ['-q', '-g', goal, '-t', 'halt', 'backend/prolog/kb.pl'],
      (err, stdout) => err ? reject(err) : resolve(stdout.trim()));
  });
}
```

This adds a second language and process to coordinate, so it's more setup than §2.2.
**Only reach for this if you have a concrete reason** (e.g., a real user-accounts
database) — otherwise it's extra complexity the project doesn't need yet.

### 2.4 On the React side

A single small module centralizes every call to the backend, so components never
construct URLs themselves:

```js
// frontend/src/shared/api/httpClient.js
export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function apiFetch(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) throw new Error(`Request to ${path} failed`);
  return res.json();
}
```

```js
// frontend/src/features/explore-map/exploreMapApi.js
import { apiFetch } from '../../shared/api/httpClient';

export function getCountryInfo(countryName) {
  return apiFetch(`/country/${countryName}`);
}
```

```js
// frontend/src/features/guess-game/guessGameApi.js
import { apiFetch } from '../../shared/api/httpClient';

export function guessCountry(clues) {
  return apiFetch('/guess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clues }),
  });
}
```

Every feature gets its own thin `*Api.js` file like these two, all built on the one
shared `httpClient.js` — that's the piece that's genuinely shared, so it's the one
thing that still lives outside a feature folder.

```jsx
// frontend/src/features/explore-map/components/CountryCard.jsx
import { useEffect, useState } from 'react';
import { getCountryInfo } from '../exploreMapApi';

function CountryCard({ countryName }) {
  const [card, setCard] = useState(null);

  useEffect(() => {
    getCountryInfo(countryName).then(setCard);
  }, [countryName]);

  if (!card) return null;
  return (
    <div className="country-card">
      <span className="flag">{card.flag}</span>
      <h2>{card.country}</h2>
      <p>Capital: {card.capital}</p>
      <p>Currency: {card.currency}</p>
    </div>
  );
}
```

Every game screen follows this same pattern: call a function from that feature's
`*Api.js`, put the JSON in state, render it. Once the pattern is set up once, adding
new features is mostly copy-paste-adjust into a new `features/<name>/` folder.

### 2.5 Personalized learning & session data

`student_score/2` (§4.7 of the KB doc) is per-child and changes constantly, so it
shouldn't live as static facts loaded at server start. The clean way to handle it:

1. Store scores in a small database (SQLite is enough for a school project) keyed by
   a child/session ID.
2. On each score update, the backend does `set_score(Topic, Score)` in Prolog *and*
   writes the same value to the database.
3. When a session resumes, load that child's rows back into `student_score/2` via
   `assertz` before answering `recommend_activity/1`.

This keeps Prolog doing what it's good at (reasoning about "what's weakest, what to
recommend next") while a normal database handles "remember this across visits," which
Prolog itself isn't built for.

---

## 3. Folder Structure

This is organized **feature-based, not type-based**. The old layout grouped files by
*kind* (all components together, all pages together, all rules together) which means
building one game touches four different top-level folders. The layout below groups
files by *feature* instead — everything "Guess the Country" needs (its Prolog rules,
its HTTP route, its React components, its page) lives under one folder, on both sides
of the stack. This is also exactly what makes the 5-person split in doc 3 clean: each
person's feature is one folder, not four scattered ones.

```
asean-explorer/
├── backend/
│   ├── prolog/
│   │   ├── facts.pl                    # §3 of the KB doc — all static country data (shared)
│   │   ├── core.pl                     # §4.1 of the KB doc — shared reasoning: neighbor/2, asean_country/1, etc.
│   │   ├── kb.pl                       # single load point — loads facts, core, then every feature below
│   │   ├── server.pl                   # starts the HTTP server, wires each feature's routes.pl
│   │   └── features/
│   │       ├── explore_map/
│   │       │   ├── rules.pl            # §4.2 of the KB doc — country_info/2
│   │       │   └── routes.pl           # GET /country/:name
│   │       ├── journey_mode/
│   │       │   ├── rules.pl            # level/2, unlocked_country/2, checkpoint_passed/2 — not yet built (doc 4 §2)
│   │       │   └── routes.pl
│   │       ├── guess_game/
│   │       │   ├── rules.pl            # §4.3 of the KB doc — matches_clue/2, guess_country/2
│   │       │   └── routes.pl           # POST /guess
│   │       ├── neighbor_game/
│   │       │   ├── rules.pl            # §4.4 of the KB doc — find_non_neighbors/3
│   │       │   └── routes.pl           # POST /neighbor_check
│   │       ├── capital_match/
│   │       │   ├── rules.pl            # §4.5 of the KB doc — check_capital_match/3
│   │       │   └── routes.pl           # POST /capital_match
│   │       ├── explain_mode/
│   │       │   ├── rules.pl            # §4.6 of the KB doc — explain_neighbor/3, explain_membership/2
│   │       │   └── routes.pl           # GET /explain/neighbor, GET /explain/membership
│   │       └── dashboard/
│   │           ├── session.pl          # §4.7 of the KB doc — dynamic student_score/2 + recommendation rules
│   │           └── routes.pl           # POST /score, GET /recommend
│   ├── db/
│   │   └── scores.sqlite               # persisted per-child scores (see §2.5)
│   └── README.md                       # how to run: swipl backend/prolog/server.pl
│
├── frontend/
│   ├── public/
│   │   └── assets/
│   │       ├── flags/        # flag illustrations
│   │       ├── characters/   # cartoon mascot art (guide, narrator, etc.)
│   │       ├── map/          # ASEAN map artwork/SVG
│   │       └── sounds/       # correct/incorrect/click sound effects
│   ├── src/
│   │   ├── index.jsx                   # React entry point (CRA requires this exact path)
│   │   ├── app/
│   │   │   ├── App.jsx                 # routes between feature pages
│   │   │   └── routes.jsx              # route table, one entry per feature page
│   │   ├── features/
│   │   │   ├── home/
│   │   │   │   └── Home.page.jsx
│   │   │   ├── explore-map/            # Feature 1 — Interactive Map Learning
│   │   │   │   ├── components/         # Map, CountryPin, CountryCard, FlagCard, LandmarkGallery
│   │   │   │   ├── ExploreASEAN.page.jsx
│   │   │   │   └── exploreMapApi.js
│   │   │   ├── journey-mode/           # Feature 2 — Travel & Level Up (not yet built, see doc 4 §2)
│   │   │   │   ├── components/         # JourneyPath, Checkpoint, ProgressMap
│   │   │   │   ├── Journey.page.jsx
│   │   │   │   └── journeyApi.js
│   │   │   ├── guess-game/             # Feature 3 — Guess the Country
│   │   │   │   ├── components/         # GuessGame, ClueCard
│   │   │   │   ├── GuessCountry.page.jsx
│   │   │   │   └── guessGameApi.js
│   │   │   ├── neighbor-game/          # Feature 4 — Who Is My Neighbor
│   │   │   │   ├── components/         # NeighborGame, NeighborMapHighlight
│   │   │   │   ├── NeighborQuiz.page.jsx
│   │   │   │   └── neighborGameApi.js
│   │   │   ├── capital-match/          # Feature 5 — Match the Capitals
│   │   │   │   ├── components/         # CapitalMatchGame, CountryDragCard, CapitalDropTarget
│   │   │   │   ├── CapitalMatch.page.jsx
│   │   │   │   └── capitalMatchApi.js
│   │   │   ├── explain-mode/           # Feature 6 — Why Is This the Answer? (used inside other features)
│   │   │   │   ├── components/         # ExplainBubble
│   │   │   │   └── explainModeApi.js
│   │   │   └── dashboard/              # Feature 7 — Personal Progress
│   │   │       ├── components/         # ScoreDashboard, TopicScoreBar, RecommendedActivityCard
│   │   │       ├── Dashboard.page.jsx
│   │   │       └── dashboardApi.js
│   │   ├── shared/                     # the only "by type" folder left, and deliberately so —
│   │   │   │                           # this is stuff every feature reuses, not any one feature's own code
│   │   │   ├── api/
│   │   │   │   └── httpClient.js       # BASE_URL + fetch wrapper every feature's *Api.js builds on (§2.4)
│   │   │   ├── components/             # Button/, Card/, Mascot/, Layout/ — reused everywhere
│   │   │   ├── state/
│   │   │   │   └── GameContext.jsx     # React Context (or Zustand store) for score/progress
│   │   │   ├── hooks/
│   │   │   ├── styles/
│   │   │   │   └── theme.css           # shared colors/fonts for the cartoon look
│   │   │   └── utils/
│   │   └── index.css                   # Tailwind directives + theme import
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── README.md                       # how to run: npm install && npm start
│
├── docs/
│   ├── 01-asean-explorer-prolog-kb.md
│   ├── 02-asean-explorer-architecture.md   # this file
│   ├── 03-asean-explorer-team-workflow.md
│   └── 04-asean-explorer-features.md
│
├── .gitignore
└── README.md                         # project overview + how to run both halves together
```

**Why this split matters for a 5-person team:** `backend/` and `frontend/` almost never
touch the same file, so backend and frontend work can happen in parallel without merge
conflicts. Within each side, every feature is now **one folder that owns its whole
vertical slice** — `guess_game/` on the backend has both `rules.pl` and `routes.pl`,
`guess-game/` on the frontend has its components, its page, and its API calls. Two
people can build `guess-game/` and `neighbor-game/` at the same time and never edit
each other's files, on either side of the stack. Only genuinely cross-feature code
(shared facts/reasoning on the backend, shared buttons/layout/state on the frontend)
lives outside a feature folder. (Full team split is in doc 3.)

---

## 4. Local Development Flow

1. **Backend:** `swipl backend/prolog/server.pl` → API live at `localhost:4000`.
2. **Frontend:** `cd frontend && npm start` → React dev server at `localhost:3000`,
   configured (via `.env` → `REACT_APP_API_URL=http://localhost:4000`) to call the
   backend above.
3. Anyone on the frontend team who doesn't want to install SWI-Prolog locally can point
   their `.env` at a shared backend URL (one teammate runs it, or it's deployed
   somewhere reachable) instead of running it themselves.
4. CORS: the `library(http/http_cors)` line in `server.pl` is what allows
   `localhost:3000` to call `localhost:4000` during development — without it the browser
   blocks the requests.

---

## 5. Summary

- **React**, not Bootstrap, for the app itself — Bootstrap can supply a grid if wanted,
  but the cartoon/game look should come from Tailwind + Framer Motion (or plain custom
  CSS), not Bootstrap's default components.
- **Prolog runs as its own small HTTP server** (SWI-Prolog's built-in `http` libraries),
  answering JSON questions from React over `fetch`. No Node bridge needed unless the
  project later needs a full database/auth layer.
- **`backend/` and `frontend/` are fully separate folders**, and inside `frontend`, each
  game feature gets its own component folder — this is what makes parallel work by
  several people possible without constant merge conflicts (details in doc 3).
