# Combat & Stats Architecture

Status: **[planned]** unless marked **[current]**. The stat pipeline and
event-oriented combat design below are the target for Phases 2–3. The RNG
abstraction is **[current]** (`packages/game-core/src/rng`).

## Stat architecture

Final stats are computed through an ordered pipeline. Each stage contributes
`Modifier`s; nothing downstream knows how upstream values were produced.

```
Base Stats
   ↓  (definition: species/class baseline)
Level Growth
   ↓  (per-level curve from class definition)
Class
   ↓  (class modifiers + promotion bonuses)
Equipment
   ↓  (equipment instance modifiers)
Traits
   ↓  (trait modifiers)
Skills
   ↓  (passive skill modifiers)
Pet
   ↓  (companion modifiers)
Temporary Effects
   ↓  (buffs/debuffs, tower cards, facility boosts)
Final Stats
```

### Concepts

- **Stat** — a named numeric property (`attack`, `defense`, `speed`,
  `maxHp`, `critChance`, …). Names are a closed set defined with the stat
  system in Phase 2.
- **Base stat** — the pre-modifier value from definitions and level.
- **Modifier** — `{ stat, op: "add" | "multiply" | "set", value, source }`.
  Applied in a fixed order: `set` → `add` → `multiply` (order must be
  deterministic and documented in code).
- **ModifierSource** — where a modifier came from (`"equipment"`,
  `"trait"`, `"skill"`, `"pet"`, `"buff"`, …). Sources allow removal
  (unequip) and debugging ("why is my crit 80%?").
- **Derived stat** — computed from other stats (e.g. `power = attack + 2×defense`).
  Recomputed, never stored.
- **Final stat snapshot** — an immutable `StatSnapshot` produced by folding
  all modifiers over base stats. Combat consumes snapshots; UI displays
  them. Snapshots are cheap to rebuild and never cached in persistent state.

## Combat architecture

Event-oriented. The engine is a pure function from inputs to a result
stream — no UI, no clock, no `Math.random()` outside the injected RNG.

```
CombatInput  { allies: StatSnapshot[], enemies, rng, options }
      ↓
CombatEngine (step / runAll)
      ↓
CombatState  { combatants, turn order, active effects, round }
      ↓
CombatEvent[]  (appended every step)
      ↓
CombatResult  { outcome: "victory"|"defeat"|"timeout", events, duration, rewards? }
```

### Event vocabulary

| Event | Meaning |
| --- | --- |
| `CombatStarted` | battle begins, lists combatants |
| `TurnStarted` / `TurnEnded` | a combatant's turn boundary |
| `AttackDeclared` | actor announces an action (attack/skill) |
| `Miss` | attack failed accuracy check |
| `Hit` | attack connected (carries raw damage) |
| `Critical` | crit multiplier applied |
| `Damage` | final damage after mitigation, target HP change |
| `Heal` | HP restored |
| `StatusApplied` / `StatusRemoved` | effect added/expired/dispelled |
| `Death` | combatant HP reached 0 |
| `Victory` / `Defeat` | battle outcome |

Events are plain serializable data: the same stream drives the UI combat
log, animations, replay, debugging, and tests. The engine never formats
strings for humans.

### Determinism

- All randomness flows through the injected `RNG` (seeded in tests and for
  replays — a seed + inputs fully reproduces a battle).
- Combat runs on its own internal round counter, not wall time. Long
  expeditions "spend" combat outcomes, not frames.

### Rules sketch (Phase 3 decisions)

Turn order by `speed` desc with deterministic tie-break; accuracy roll per
attack; damage formula roughly `attack × skillPower − mitigation` with
bounds; crit chance/multiplier from stats. Exact formulas are decided with
tests during Phase 3 and recorded here.
