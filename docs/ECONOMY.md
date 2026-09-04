# Economy Architecture

Status: **[planned]** (Phase 4+). This document fixes the *shape* of economy
operations; balances and tables come later.

## Currencies [planned]

| Currency | Sink/source character | Notes |
| --- | --- | --- |
| Gold | soft, abundant | recruitment, upgrades, market |
| Gems/tokens | hard, scarce | premium recruits, skips, capacity |
| Guild marks | medium | arena/tower-specific sinks |
| Materials | item resources | crafting inputs, stackable, not "currency" in the API sense but tradable via the same operations |

Currency amounts are integers (no floats for money).

## Core operations [planned]

```
canAfford(state, cost: Cost)              → boolean
spend(state, cost, reason: EconomyReason) → Result<NewState, EconomyError>
grant(state, reward: Reward, reason)      → NewState + RewardGranted events
```

- All mutations of currency/inventory flow through these operations — no
  direct `state.gold -= 100` anywhere.
- `Cost` and `Reward` are declarative bundles (`{ gold: 100, items: [...] }`)
  shared with the reward system.

## Transaction reasons [planned]

Every `grant`/`spend` carries an explicit reason, recorded in an economy
event log (ring buffer, not forever):

```
"crafting" | "recruitment" | "upgrade" | "reward" | "market"
| "quest" | "expedition" | "training" | "facility" | "debug"
```

Reasons make balance analysis possible ("where does gold actually go?") and
give tests/user-facing activity feeds meaning.

## Crafting costs [planned]

Recipes declare costs as `Cost` bundles plus a duration; crafting jobs spend
upfront (fail-closed: `canAfford` gate before starting) and grant output on
claim.

## Balance workflow [planned, not Phase 0]

- Sources and sinks defined as data (loot tables, prices, costs).
- Simulation scripts (`tools/`) run seeded sessions over economy operations
  to measure inflation/drain before shipping content changes.

## Anti-cheat considerations [future]

Client-authoritative saves are editable; that is accepted for a single-player
idle game. The design keeps the door open for server validation:

- economy changes flow through few, enumerable operations with reasons;
- state is serializable with a version stamp;
- `game-core` runs in Node, so a future server can replay and validate
  transitions (notably Arena) without reimplementing rules.

No DRM or obfuscation is planned; the boundary work is what matters.
