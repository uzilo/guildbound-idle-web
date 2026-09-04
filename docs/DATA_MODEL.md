# Data Model

Foundation for the domain model. Shapes are intentionally underspecified —
fields get added in the phase that needs them. Distinguish every object
along four axes: **definition vs instance**, **static vs runtime**,
**persistent vs temporary**, **owned vs referenced**.

## The two worlds

```
STATIC (packages/game-data)              RUNTIME (packages/game-core state)
DefinitionX { id, ...data }      ◀─ref─  GameState { ...entities, byId }
immutable, shipped with build            mutated only by game systems
no identity over time                    identity: stable string ids
```

Gameplay logic consumes definitions by reference (`definitionId` fields) and
never copies definition data into runtime state.

## Entities

All entities have stable string ids (`"${type}/${slug}"` or UUID-style for
generated things). Ids are opaque; never parse meaning out of them.

### Player
Root owner of progression. **[planned]** One player per save.

### Guild
The player's guild: name, treasury, facilities, roster capacity. Owns the
adventurer roster. **[planned]**

### Adventurer
The central entity. References a `ClassDefinition`, carries level/xp,
equipment instance ids, skill/trait/pet references, and an activity
assignment. **[planned]**

### Class / Trait / Skill / Pet
Pure `DefinitionBase` content in game-data. Runtime state only stores ids
and per-instance progress (e.g. learned skills). **[planned definitions,
Phase 1–2]**

### ItemDefinition / EquipmentDefinition
Static item types (stackables and equipment). Equipment instances are
runtime objects with rolled modifiers. **[planned, Phase 4]**

### EquipmentInstance
Runtime: id, definition id, rolled modifiers, durability-ish fields if
needed. Lives in guild storage or equipped on an adventurer — never both.

### Recipe
Static: inputs (item + qty), output, time, unlock condition. **[planned,
Phase 5]**

### Enemy
Static combatant definition: stats, skills, loot table. **[planned, Phase 3/6]**

### Dungeon / Raid
Static: encounter sequences, level bands, reward tables, time costs.
**[planned, Phase 6]**

### Quest
Static objective + reward; runtime tracks per-quest progress. **[planned]**

### Activity
Runtime record of a timed job: see `docs/IDLE_SIMULATION.md`
(`id, type, status, startedAt, completesAt, payload`). **[planned, Phase 5]**

### Reward
A declarative bundle (`{ currency?, items?, xp? }`) granted by systems;
used by expeditions, quests, recipes costs, purchases. **[planned, Phase 4+]**

### Currency
Runtime counters on guild/player (gold, gems, tokens) mutated only through
economy operations (`grant`/`spend` with reasons). **[planned, Phase 4]**

### GameState
The single root runtime object, plain serializable data: everything above
plus meta (version, lastSimulatedAt). **[planned, Phase 1]** — from Phase 1
onward, GameState must remain JSON-serializable so persistence and future
server validation work unchanged.

## Identity & relationships

- **By id, not by reference.** Runtime entities reference each other via
  string ids (e.g. `adventurer.equipmentIds: EquipmentInstanceId[]`).
  Keep lookup maps (`Map<Id, Entity>`) in state or derive them in systems.
- **No back-pointers.** Relationships flow one direction (guild → roster →
  adventurer → equipment). Avoid cycles that complicate serialization.
- **Orphan discipline.** Systems that delete/move entities must clean up
  references (integration tests cover this).

## Static vs runtime summary

| Static (game-data) | Runtime (game-core state) |
| --- | --- |
| ClassDefinition | adventurer.classId, level, xp |
| SkillDefinition | learned skill ids, cooldowns mid-combat |
| ItemDefinition / EquipmentDefinition | EquipmentInstance, stacks |
| EnemyDefinition | combat copies created per encounter |
| DungeonDefinition | active expedition records |
| RecipeDefinition | crafting job records |
| QuestDefinition | quest progress |

## Persistent vs temporary

- **Persistent:** GameState (saved to IndexedDB in Phase 12).
- **Temporary:** combat state (per battle), RNG streams, UI state (React),
  cached lookups. Temporary state must be reconstructable from persistent
  state + definitions; nothing gameplay-critical may live only in
  temporary state.

## Status

**[current]** only the primitives: `DefinitionBase`/`DefinitionId`
(game-data), `Result`/time types (shared), `RNG` (game-core). Everything
else in this document is **[planned]** for Phases 1–6.
