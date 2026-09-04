# Guildbound

A mobile-first **idle guild management RPG** for the web. Recruit
adventurers, develop and equip them, send teams on timed expeditions, and
watch rewards roll in — with progression that continues while you're away.

Built game-system-first: the gameplay engine is a framework-independent
TypeScript monorepo that runs in Node (tests, simulations, tooling, future
server) and is rendered by a React web client.

> **Status:** Phase 0 — foundation & architecture complete. Gameplay systems
> arrive in later phases; see [docs/ROADMAP.md](docs/ROADMAP.md).

## Quick start

Requirements: **Node ≥ 20.19** and **pnpm** (via corepack, pinned by
`packageManager`):

```bash
corepack enable
pnpm install
```

Common commands:

| Command | What it does |
| --- | --- |
| `pnpm dev` | Vite dev server for the web app |
| `pnpm build` | Build all packages (topological order) |
| `pnpm typecheck` | `tsc --noEmit` in every package |
| `pnpm test` | Run all vitest projects |
| `pnpm check:boundaries` | Validate package dependency edges |
| `pnpm verify` | build + typecheck + boundaries + tests |

## Repository layout

```
├── apps/
│   └── web/                  # React + Vite client (UI only)
├── packages/
│   ├── game-core/            # Authoritative gameplay engine (no React, no browser)
│   ├── game-data/            # Static, data-driven content definitions
│   ├── game-simulation/      # Combat / idle / expedition simulation
│   └── shared/               # Genuinely shared primitives (Result, time)
├── tools/                    # Boundary checks and future tooling
├── docs/                     # Architecture & design docs (project memory)
├── AGENTS.md                 # Permanent instructions for AI coding agents
└── pnpm-workspace.yaml
```

### Dependency direction

```
apps/web  ──▶  game-simulation ──▶  game-core ──▶  (nothing)
   │                   │               ▲
   │                   └──▶ game-data ─┘  (data is pure content)
   └─────────────▶ all packages ◀────── shared (primitives only)
```

game-core and game-data never import React, the DOM, or persistence.
Enforced by `tools/check-boundaries.mjs`.

## Documentation

Start here, in order:

1. [AGENTS.md](AGENTS.md) — rules every change must follow
2. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — packages, boundaries, layers
3. [docs/ROADMAP.md](docs/ROADMAP.md) — phase plan and current status
4. [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md) — vision, fantasy, core loop
5. [docs/GAME_SYSTEMS.md](docs/GAME_SYSTEMS.md) — systems catalog

Design references: [DATA_MODEL](docs/DATA_MODEL.md) ·
[COMBAT](docs/COMBAT.md) · [ECONOMY](docs/ECONOMY.md) ·
[IDLE_SIMULATION](docs/IDLE_SIMULATION.md) · [UI_ARCHITECTURE](docs/UI_ARCHITECTURE.md) ·
[CONTENT_PIPELINE](docs/CONTENT_PIPELINE.md) · [TESTING](docs/TESTING.md) ·
[DECISIONS](docs/DECISIONS.md)
