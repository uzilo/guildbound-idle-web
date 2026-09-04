# Testing Strategy

Status: framework **[current]**, per-system suites arrive with each phase.

## Priorities

1. **game-core correctness first.** Domain tests are the safety net; UI test
   coverage is secondary (smoke-level until Phase 9).
2. **Determinism over snapshots.** Seeded RNG and injected time; no
   snapshot-anything unless asserting serialized output shape.
3. **Tests live next to the code they own.** `*.test.ts` beside sources.

## Layers

### Unit tests
For formulas, rules, modifiers, validation, and economy operations.
Fast, isolated, no I/O. **[current]** RNG contract tests are the template
(`packages/game-core/src/rng/rng.test.ts`).

### Simulation tests
For combat, rewards, progression, idle catch-up. Always seeded:
`new SeededRNG(42)` — a test that depends on luck is a broken test.
Assert on *event streams / results*, not internal call order.
**[planned, Phases 3–6]**

### Integration tests
For state transitions, commands, and game systems: build a small fixture
GameState, run a command, assert state diff + emitted events + `Result`
errors for invalid input. Also cover referential cleanup (no orphaned
equipment ids after roster changes). **[planned, Phase 1+]**

### Browser tests
Playwright for important UI flows (first-run, recruit → dispatch → claim,
save/load round-trip). **[planned, Phase 8+ — not installed in Phase 0]**
React Testing Library already covers component smoke tests
(`apps/web/src/App.test.tsx`).

### Deterministic tests
Anywhere randomness or time matters:

```ts
const rng = new SeededRNG(1234);
simulateUntil(state, KNOWN_TIMESTAMP);   // time injected, never Date.now()
```

## Tooling [current]

- **Vitest** with one project per package (root `vitest.config.ts`).
  Node environment for engine packages; jsdom + React Testing Library for
  `apps/web`.
- Workspace packages resolve to TS sources via aliases — tests never need a
  prior `pnpm build`.
- `pnpm test` runs everything; `pnpm test:watch` for loops.
- UI tests clean up renders explicitly (`afterEach(cleanup)`) since vitest
  globals are off.

## Commands

```bash
pnpm test                    # all projects
pnpm test -- --project=game-core   # one project
pnpm verify                  # build + typecheck + boundaries + tests
```
