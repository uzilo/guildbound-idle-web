# Idle / Offline Simulation

Status: model **[current as design]**, implementation **[planned, Phase 5]**.

## Principle: time is data

The game's source of truth is **timestamps**, never a ticking loop. The
browser being open or closed is irrelevant to correctness.

- State records `lastSimulatedAt: TimestampMillis` (Unix epoch ms).
- On load/claim/inspect, the client computes elapsed time and runs
  **catch-up simulation**:

```
simulateUntil(state, now: TimestampMillis) → { state, events }
```

- `now` is always injected by the caller (from `Date.now()` in the browser,
  arbitrary values in tests). game-core never reads the clock itself.

## What this supports

| Scenario | Behavior |
| --- | --- |
| Browser open | loop renders only; truth still `simulateUntil` on each tick/claim |
| Browser closed for hours | one `simulateUntil` on next load resolves everything |
| Page refresh | state + timestamps reload from persistence; catch-up resumes |
| Device sleep | clock still advanced; next tick catches up |
| Long offline periods | catch-up applies offline caps/efficiency (a *balance* lever, not a correctness one) |

A `setInterval` in the web app may drive **presentation** (smooth timers,
auto-refresh of the store) but is never authoritative; any tick just calls
`simulateUntil(state, Date.now())` again. This keeps the web app honest and
makes Node scripts/CLI tools first-class players.

## Activity model [planned, Phase 5]

Generic timed activities share one shape and lifecycle. Examples: expedition,
crafting job, market order, quest, training.

```
QUEUED ──▶ ACTIVE ──▶ READY ──▶ CLAIMED
              │
              └── CANCELLED (refund rules per activity type)
```

Conceptual activity record:

```
Activity {
  id
  type            // "expedition" | "crafting" | "market" | "quest" | "training" | ...
  status          // QUEUED | ACTIVE | READY | CLAIMED | CANCELLED
  startedAt       // TimestampMillis
  completesAt     // TimestampMillis
  payload         // type-specific data (team, recipeId, order, questId, ...)
}
```

- Lifecycle transitions are functions (`startActivity`, `completeReady`,
  `claimActivity`) returning `Result`s — not ad-hoc field writes.
- `payload` references definitions by id (dungeonId, recipeId, …); the
  resolution system pairs payload + definitions at claim time.
- Expeditions additionally store their combat seed so results are
  reproducible.

## Catch-up semantics [planned]

- Multiple ready activities resolve in deterministic order (by `completesAt`,
  then id).
- Only *completion boundaries* matter for rewards — idle time between
  boundaries has no cost. (Per-second accrual activities, if any, are
  computed analytically, not by stepping.)
- Offline efficiency/caps apply at claim time as data-driven multipliers.
