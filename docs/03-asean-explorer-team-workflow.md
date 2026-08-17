# ASEAN Explorer — Splitting Work Across 5 People (and Using Git)

## 1. Do you need Git? Yes — non-negotiable for a 5-person project.

Without version control, five people editing files and passing them around (over chat,
USB, cloud drive) will overwrite each other's work almost immediately, and there is no
way to recover an earlier version once that happens. Git solves three problems at once:

- **Nobody overwrites anybody's work** — everyone edits their own copy (branch), and
  changes are merged deliberately, not by accident.
- **You can always go back** — every saved state (commit) is recoverable. If a change
  breaks something, you can see exactly what changed and undo it.
- **You can see who did what** — useful for a group project where individual
  contribution needs to be visible.

Use **GitHub** (or GitLab) as the shared home for the repository, since both give you
issue tracking and pull requests alongside plain Git — useful for a student team, not
just larger companies.

---

## 2. How to split the work: by feature, not by layer

There are two common ways to divide a project like this:

- **By layer** — one person does "all the backend," another does "all the CSS," etc.
  This sounds tidy but in practice creates a bottleneck: frontend people sit idle
  waiting for backend people to finish, and everyone is constantly editing the same
  shared files.
- **By feature (vertical slice)** — each person owns one complete feature end-to-end:
  their own Prolog rule(s), their own API route, their own React component. This is
  what's recommended here, because **your project brief already describes exactly five
  features**, which maps onto five people with almost no extra planning:

| Person | Owns | Files they mainly touch |
|---|---|---|
| **1 — Core & Integration Lead** | Shared facts.pl, server setup, React app shell/routing, final merges | `backend/prolog/facts.pl`, `backend/prolog/core.pl`, `backend/prolog/kb.pl`, `backend/prolog/server.pl`, `frontend/src/app/App.jsx`, `frontend/src/shared/state/GameContext.jsx` |
| **2 — Explore ASEAN** | The interactive map + country card feature | `backend/prolog/features/explore_map/` (`rules.pl` + `routes.pl`), `frontend/src/features/explore-map/` |
| **3 — Guess the Country** | Clue-based reasoning game | `backend/prolog/features/guess_game/` (`rules.pl` + `routes.pl`), `frontend/src/features/guess-game/` |
| **4 — Who Is My Neighbor + Match the Capitals** | Two related quiz-style games | `backend/prolog/features/neighbor_game/`, `backend/prolog/features/capital_match/`, `frontend/src/features/neighbor-game/`, `frontend/src/features/capital-match/` |
| **5 — Why-Explanations + Personalized Dashboard** | "Why?" reasoning + adaptive learning | `backend/prolog/features/explain_mode/`, `backend/prolog/features/dashboard/` (§4.7 of the KB doc lives in its `session.pl`), `frontend/src/features/explain-mode/`, `frontend/src/features/dashboard/` |

Why this split works well specifically for this project:

- Each person can demo a **complete, working feature** on their own — good for
  presentations/grading, since no one's work is "half a backend with no visible result."
- Almost no two people need to edit the same file, because each feature now has its
  **own folder on both sides of the stack** — its own `rules.pl` + `routes.pl` on the
  backend, its own components + page + API module on the frontend. Nobody needs to
  carve out a section of a shared file anymore (see note below on how this replaced the
  old shared-`rules.pl` setup).
- It matches the structure of both other documents exactly — the KB doc's §4.2–4.7 and
  the architecture doc's feature folders (§3) are already organized this way on purpose.

**Why there's no more shared-file caution:** an earlier version of this layout put
everyone's rules in one shared `backend/prolog/rules.pl`, which meant either careful
per-person comment sections or a manual split into `rules_explore.pl`,
`rules_guess.pl`, etc. The architecture doc's current structure (§3) does that split by
default — each feature gets its own `rules.pl` and `routes.pl` under
`backend/prolog/features/<feature>/` from the start, loaded by `kb.pl`/`server.pl`. So
the shared-file risk is already designed away; the only files genuinely shared across
people are `facts.pl`, `core.pl`, `kb.pl`, and `server.pl`, all owned by Person 1.

---

## 3. Git Workflow

### 3.1 Branching

```
main                    ← always working, always demo-able
  └─ dev                ← integration branch, where features come together first
       ├─ feature/explore-asean       (Person 2)
       ├─ feature/guess-country       (Person 3)
       ├─ feature/neighbor-capital    (Person 4)
       ├─ feature/explain-dashboard   (Person 5)
       └─ feature/core-shell          (Person 1)
```

- Nobody commits directly to `main`. `main` only receives merges from `dev` once things
  are tested and working — this is what you'd demo or submit.
- Each person works on their own `feature/...` branch, committing freely.
- When a feature is ready, open a **Pull Request (PR)** into `dev`, not straight into `main`.

### 3.2 Pull requests, even in a small team

It might feel like overhead for a 5-person student project, but PRs are what let the
Integration Lead (Person 1) actually see what changed before it's merged, instead of
finding out something broke after the fact. Keep it lightweight:

1. Open a PR from your `feature/...` branch into `dev`.
2. Write 2–3 sentences: what feature this adds, how to test it.
3. One other teammate (doesn't have to be Person 1 every time) reads the diff and clicks
   "approve" or leaves a comment.
4. Merge into `dev`.

### 3.3 Integration cadence

Don't let `dev` sit unmerged for weeks — features will drift apart and the final merge
becomes painful. A simple cadence that works for a student timeline:

- Commit to your feature branch continuously (small commits, working state).
- Open a PR into `dev` at least **once a week**, even if the feature isn't fully done —
  partial, working progress is easier to merge than a giant change at the deadline.
- Merge `dev` into `main` whenever `dev` is in a state you'd be OK demoing.

### 3.4 Practical git hygiene

- **`.gitignore`** at the repo root — at minimum:
  ```
  node_modules/
  .env
  *.sqlite
  .DS_Store
  ```
  (`node_modules` is huge and regenerable from `package.json`; `.env` may hold local
  config that differs per machine; the sqlite file is runtime data, not source.)
- **Commit messages**: short present-tense description, e.g. `Add guess_country rule
  and clue matching`, `Fix neighbor game distractor list`. Doesn't need to be formal,
  just needs to say what changed.
- **Small, frequent commits** beat one giant commit at the end — easier to review,
  easier to undo just the broken part if something goes wrong.
- **Pull before you push** (`git pull origin dev` before starting new work) so you're
  never working from a stale copy.

### 3.5 Suggested tracking

Use **GitHub Issues** (free, built into the same repo) with one issue per feature
checklist item — e.g. "Guess the Country: clue matching for famous_for," "Guess the
Country: frontend clue-selector UI." A **GitHub Project board** (To Do / In Progress /
Done, drag-and-drop) gives the whole team a shared view of where things stand without
needing a separate tool.

---

## 4. Weekly rhythm (suggested)

1. **Short sync** (15 min, can be a chat thread) — what did I finish, what am I doing
   next, am I blocked on anyone?
2. Everyone pushes their feature branch and opens/updates their PR.
3. Person 1 (or whoever's turn) merges approved PRs into `dev`, resolves any conflicts.
4. Quick group test of `dev` — does the app still run end-to-end, do the 5 features
   still work together (shared score dashboard reading data from all 4 games, shared
   map/routing)?
5. Merge `dev` → `main` if stable.

This keeps integration continuous instead of one high-risk merge at the deadline, which
is the single biggest cause of last-minute breakage in team projects like this.
