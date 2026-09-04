# Architectural Decisions

Append-only log. Each decision records context, choice, and consequences.
Reversing a decision means adding a new entry, not editing history.

1. **Game Core is independent from React.** The engine must run headless
   (tests, simulations, CLI tools, future server). React is a client detail.
2. **Game Core is independent from browser APIs.** Same reasoning; also keeps
   engine logic reviewable in isolation.
3. **Game content is data-driven.** Content lives in `game-data` as typed
   definitions; gameplay consumes data so content grows without engine
   rewrites.
4. **Idle simulation is timestamp-based.** `simulateUntil(state, now)` with
   injected time; a UI loop is presentation-only. This makes offline,
   refresh, and sleep correctness structural rather than patched-on.
5. **Combat is event-oriented.** The engine emits serializable
   `CombatEvent[]`; UI/log/replay/tests all consume the same stream.
6. **RNG uses an abstraction.** `RNG` interface + `RandomRNG`/`SeededRNG`
   (mulberry32). Deterministic tests, reproducible combat, future server
   validation. No `Math.random()` in domain logic.
7. **Modular monolith.** One repo, few packages, explicit boundaries —
   no microservices, no runtime plugin systems.
8. **UI is mobile-first.** Single-column shell, bottom navigation,
   44px touch targets; desktop gets a centered phone-width column.
9. **Persistence is separated from game-core.** game-core never touches
   storage; `apps/web` (and later a server) own save/load of serialized
   state.
10. **IndexedDB (via Dexie if it earns its keep) is the initial client
    persistence layer.** Async, large quota, browser-native.
11. **Backend is optional and deferred.** The engine being headless keeps a
    future server possible without rewrites; nothing in Phases 0–10
    requires one.
12. **Arena/PvP will be server-authoritative eventually.** Combat must stay
    runnable server-side (deterministic, seeded) for this to be cheap later.

## Phase 0 implementation decisions

13. **Repo root = workspace root.** The git repository is the monorepo (no
    nested `idle-guild/` directory) — nesting would add paths without value.
14. **Packages build with plain `tsc` to ESM `dist/`; no bundler for
    libraries.** Simplest reliable setup that keeps Node-executable output;
    Vite bundles only `apps/web`. `rewriteRelativeImportExtensions` +
    `.ts` import extensions give Node-runnable `dist/` without
    `.js`-in-source hacks.
15. **Workspace-internal resolution aliases packages to TypeScript sources**
    (root `vitest.config.ts`, `apps/web/vite.config.ts`, web `tsconfig.json`
    `paths`). Apps/tests run without building packages first; `dist/`
    exports remain for external/Node consumers. The three alias sites must
    stay in sync.
16. **Boundary enforcement is a dependency-free Node script**
    (`tools/check-boundaries.mjs`) rather than a linter plugin: ~80 lines,
    zero dependencies, runs anywhere, codifies the dependency table from
    `docs/ARCHITECTURE.md`.
17. **TypeScript ~5.9 (mature line) instead of 7.x.** TS 7 is the new native
    compiler; ecosystem compatibility (Vite/Vitest/plugins) is not yet
    proven for this stack. Revisit later.
18. **Zustand is chosen but not yet installed.** It lands in Phase 8 with the
    first real UI state; installing unused dependencies invites rot.
19. **React Router (library mode) is included in Phase 0** because the shell's
    five-tab navigation is fundamental structure, not polish.
20. **Playwright deferred to Phase 8** — no meaningful browser flows exist
    before the shell has behavior; installing browsers now would be dead
    weight.
21. **Package scope is `@guildbound/*`, all packages `private: true`.**
    Nothing is published to npm; `workspace:*` versions everywhere.
