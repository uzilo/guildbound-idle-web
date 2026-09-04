# AGENTS.md — Permanent Instructions for AI Coding Agents

This repository is developed primarily by AI coding agents. Read this file
fully before changing any code. It is the contract that keeps the codebase
coherent across hundreds of agent sessions.

## Project

Guildbound is a **mobile-first idle guild management RPG for the web**. The
player recruits adventurers, develops and equips them, sends teams on timed
expeditions, and collects rewards — with progression that continues while
away (idle/offline). It is an original web game: never port, decompile, or
depend on any existing game's code or assets.

## The one rule that outranks everything

**GAME CORE ≠ UI.** The gameplay engine (`@guildbound/game-core`,
`@guildbound/game-simulation`) must run without React, without the DOM, and
without any browser API — plain Node must suffice. Never couple domain logic
to rendering, persistence, or network code.

## Package map

| Package | Role | May depend on | Must never depend on |
| --- | --- | --- | --- |
| `packages/game-core` | Authoritative engine: entities, state, rules, commands, systems, economy, progression | `@guildbound/shared` | React, DOM, browser APIs, IndexedDB, network |
| `packages/game-data` | Static content definitions (classes, items, enemies, …), pure data | `@guildbound/shared` | React, DOM, game-core |
| `packages/game-simulation` | Combat/idle/expedition simulation over core + data | core, data, shared | React, DOM, browser APIs |
| `packages/shared` | Genuinely shared primitives only (types, Result, time) | — | everything else |
| `apps/web` | React UI shell; renders state, dispatches commands | core, data, simulation, shared | — |

Dependency direction is enforced by `pnpm check:boundaries` — run it after
changing any `package.json`. Do not add new dependency edges without updating
`tools/check-boundaries.mjs` and `docs/ARCHITECTURE.md`, and record the
reason in `docs/DECISIONS.md`.

## Architecture rules

- **Game core must not depend on React** or any UI framework.
- **UI must not directly mutate game state.** The UI dispatches commands;
  systems perform state transitions. No `state.gold += 5` in components, ever.
- **Static content must remain data-driven.** No `if (classId === "knight")`
  in gameplay logic when data can express the behavior. New content must not
  require rewriting core systems.
- **Avoid circular dependencies** — between packages and between modules.
- **Prefer deterministic systems.** Same state + same seed + same timestamps
  ⇒ same outcome.
- **Keep domain logic in game-core.** The web app is a view layer.
- **Browser-specific functionality** (IndexedDB, audio, DOM) belongs outside
  game-core — in `apps/web` or a future persistence package.
- **Persistence is outside the domain layer.** game-core never imports Dexie
  or touches storage. It produces/consumes plain serializable state.
- **Idle simulation is timestamp-based.** The authoritative model is
  `simulateUntil(state, now)` (see `docs/IDLE_SIMULATION.md`). A `setInterval`
  loop may drive presentation only, never game truth.

## Randomness

Never scatter `Math.random()` through gameplay. Import the `RNG` interface
from game-core and take an instance as a parameter (live play: `RandomRNG`;
tests/simulations: `SeededRNG`). Deterministic tests and reproducible
simulations depend on this.

## State transitions

Prefer explicit transitions over arbitrary mutation:

```
command → game system → (Result<NewState | Events, Error>)
```

Validate in commands, return explicit results (`@guildbound/shared` has a
`Result` type), and keep transitions testable in isolation.

## Testing

- Every major gameplay mechanic gets tests in the package that owns it.
- Use `SeededRNG` wherever randomness is involved — tests must be
  deterministic.
- Prioritize game-core correctness over UI snapshot testing.
- Strategy details: `docs/TESTING.md`.

## Code quality

- Prefer simple, readable implementations over abstraction.
- No premature optimization. No speculative generality ("we might need…").
- Avoid: microservices, ECS-unless-needed, event buses, DI frameworks, deep
  class hierarchies, heavy patterns.
- The codebase must stay understandable to a small team and to future agents.

## AI coding workflow

**Before implementing a feature:**

1. Read `AGENTS.md` (this file).
2. Read the relevant docs in `docs/` (start with `ARCHITECTURE.md`,
   `ROADMAP.md`, and the doc for the affected system).
3. Inspect the current implementation — search before writing; never create
   a duplicate system because you missed an existing one.
4. Identify affected packages and systems.
5. Make the smallest coherent change. Reuse existing abstractions.

**After changing code:**

1. Add or update tests for the changed behavior.
2. Run `pnpm verify` (build + typecheck + boundary check + tests) or the
   narrowest relevant subset.
3. Inspect `git diff` for accidental or unrelated changes.
4. Update documentation if the architecture changed materially, and record
   architectural decisions in `docs/DECISIONS.md`.
5. Never modify unrelated code "while you're in there".

## Commands

```bash
pnpm install            # bootstrap (requires Node >= 20.19, pnpm via corepack)
pnpm build              # build all packages (topological order)
pnpm typecheck          # tsc --noEmit in every package
pnpm test               # vitest run (all workspace projects)
pnpm test:watch         # vitest watch
pnpm check:boundaries   # validate package dependency edges
pnpm verify             # build + typecheck + boundaries + tests
pnpm dev                # vite dev server for apps/web
```

## Documentation

- `docs/` is the project's memory. Keep it concise, accurate,
  implementation-oriented. Mark clearly what is **current**, **planned**, and
  **future** — never document fiction as fact.
- Update the relevant doc whenever a system's design changes.
- Record architectural decisions (including reversals) in
  `docs/DECISIONS.md` with context and consequences.

## Git

- Never commit secrets (API keys, tokens, passwords, `.env` files).
- Suggested commit style: `phase N: short description` or
  `system: short description`.
- Do not push unless explicitly asked.

## Phases

`docs/ROADMAP.md` is the master plan. Implement one phase at a time; do not
jump ahead, and do not "helpfully" implement future-phase systems early.
