# Roadmap

High-level phase plan. One phase at a time; adjust order only when real
implementation dependencies demand it. Each phase ends with green
`pnpm verify` and updated docs.

| Phase | Scope | Status |
| --- | --- | --- |
| **0** | Foundation: monorepo, package boundaries, tooling, docs, design tokens, minimal shell | ✅ **done** |
| **1** | Core domain model: GameState, Guild, Adventurer, ids, serialization-first shapes | ⬜ |
| **2** | Stats / modifiers / progression pipeline (stat system, level curves, trait hooks) | ⬜ |
| **3** | Combat engine (event stream, turn order, damage, status, seeded determinism) | ⬜ |
| **4** | Inventory / equipment / economy (definitions, instances, grant/spend with reasons) | ⬜ |
| **5** | Activities / crafting / idle (`simulateUntil`, activity lifecycle, recipes, offline) | ⬜ |
| **6** | Expeditions / dungeons / rewards (dispatch teams, resolution, loot tables) | ⬜ |
| **7** | Guild systems (facilities, recruitment, roster capacity, upgrades) | ⬜ |
| **8** | Web application shell (Zustand stores, application layer, persistence adapter, Playwright) | ⬜ |
| **9** | Adventurer / inventory / guild UI (real screens replacing placeholders) | ⬜ |
| **10** | Explore / combat UI (dungeon flows, combat event rendering) | ⬜ |
| **11** | Tower / raids / arena (roguelike layer, multi-stage raids, async PvP) | ⬜ |
| **12** | Persistence / cloud sync / backend (save migrations, optional server validation) | ⬜ |
| **13** | Polish / performance / PWA / deployment | ⬜ |

Notes on sequencing:

- Phases 1–7 build the engine headless (verifiable from Node/CLI alone);
  UI phases consume it afterwards. This is deliberate: the engine is the
  product's core and the UI is a client.
- Persistence lands twice by design: a minimal save/load adapter with the
  Phase 8 shell, and versioned migrations/cloud sync in Phase 12.
- Arena (11) is the only system that may eventually require a server;
  nothing before it depends on one.

After each phase: update affected `docs/*`, append decisions to
`docs/DECISIONS.md`, and keep `AGENTS.md` accurate.
