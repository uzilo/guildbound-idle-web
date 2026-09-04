# Architecture

Status legend: **[current]** exists in code · **[planned]** designed, not yet
built · **[future]** direction only, details may change.

## Overview

Guildbound is a pnpm monorepo of small TypeScript packages. The gameplay
engine is framework- and environment-independent; the React web app is a
view layer on top. The repository root is the workspace root (the git repo
*is* the project — there is no nested `idle-guild/` folder).

```
idle-guild/
├── apps/
│   └── web/                  # React + Vite client
├── packages/
│   ├── game-core/            # Authoritative gameplay engine
│   ├── game-data/            # Static content definitions
│   ├── game-simulation/      # Combat / idle simulation
│   └── shared/               # Shared primitives
├── tools/                    # check-boundaries.mjs, future tooling
└── docs/                     # Project memory
```

## Package boundaries [current]

| Package | Responsibility | Depends on | Forbidden |
| --- | --- | --- | --- |
| `@guildbound/game-core` | Entities, runtime state, stats, modifiers, formulas, rules, commands, systems, economy, progression, activities, rewards | `@guildbound/shared` | React, DOM, browser APIs, IndexedDB, network, game-data |
| `@guildbound/game-data` | Static definitions: classes, skills, traits, items, equipment, enemies, dungeons, raids, recipes, pets, quests | `@guildbound/shared` | React, DOM, game-core, runtime state |
| `@guildbound/game-simulation` | Combat, expedition, idle catch-up, dungeon/raid/tower simulation | core, data, shared | React, DOM, browser APIs |
| `@guildbound/shared` | `Result`, time primitives, truly generic utilities | nothing | anything domain-specific |
| `@guildbound/web` | React UI, routing, styling, persistence adapter | core, data, simulation, shared | mutating domain state directly |

Edges are enforced by `tools/check-boundaries.mjs` (`pnpm check:boundaries`),
which fails CI/builds when a `package.json` gains a disallowed dependency or
an engine package gains React/browser-only dependencies.

## Dependency direction [current]

```
UI (apps/web)
    ↓
Application layer [planned: command dispatch + UI state stores]
    ↓
Game Core (packages/game-core)
    ↓ (consumes, does not contain)
Game Data (packages/game-data)

Simulation (packages/game-simulation)
    ↓
Game Core + Game Data
```

Never allowed:

```
Game Core → React          Game Core → IndexedDB          Game Core → network
```

## Game-core principles [current]

- Runs in plain Node (`node -e "import('./packages/game-core/dist/index.js')"`
  must always work).
- Deterministic: same state + same seed (`RNG`) + same timestamps ⇒ same
  result.
- Pure TypeScript, zero runtime dependencies.
- No I/O of any kind. State goes in, state/events come out.

## UI architecture [current shell, planned behavior]

`apps/web` renders routes and components from a design-token stylesheet.
It never mutates domain state; in later phases it will dispatch commands
through an application layer. Details: `docs/UI_ARCHITECTURE.md`.

## Simulation architecture [planned, boundary current]

`game-simulation` consumes core state and data definitions and produces
data — combat event streams, rewards, updated state. It is UI-agnostic and
deterministic so any combat can be replayed from a seed.
Details: `docs/COMBAT.md`, `docs/IDLE_SIMULATION.md`.

## Persistence boundary [planned]

- game-core/simulation/data contain **no** storage code.
- `apps/web` owns persistence: save/load serialized state to IndexedDB (Dexie)
  via a persistence adapter.
- Save format = serialized game state + version stamp; migrations live with
  the adapter.

## Future backend boundary [future]

A server would reuse game-core/data/simulation unchanged for
authoritative validation (notably Arena/PvP). That is only possible because
the engine never touches browser or client infrastructure.

## Build & tooling [current]

- pnpm workspaces; packages build with `tsc` to `dist/` (ESM, `"type": "module"`).
- `rewriteRelativeImportExtensions` lets sources import with `.ts`
  extensions; tsc emits `.js` so Node can execute `dist/` directly.
- Within the workspace, Vite/Vitest/tsconfig alias `@guildbound/*` to
  package sources, so apps and tests never require a prior `pnpm build`.
  Keep the three alias sites in sync: root `vitest.config.ts`,
  `apps/web/vite.config.ts`, `apps/web/tsconfig.json`.
- Tests: Vitest projects per package (root `vitest.config.ts`).
- TypeScript ~5.9 (mature line; the 7.x native compiler is not yet adopted —
  see `docs/DECISIONS.md`).
