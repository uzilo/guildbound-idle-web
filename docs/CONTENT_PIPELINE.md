# Content Pipeline

How game content (classes, items, skills, traits, enemies, dungeons,
recipes, pets, quests) is added. Status: principles **[current]**, tooling
**[planned]**.

## Principles [current]

1. **Content is data.** Everything a designer would author lives in
   `packages/game-data` as typed definitions implementing `DefinitionBase`
   (`id`, `name`).
2. **Gameplay consumes definitions.** Core systems look up behavior from
   data; they never branch on content ids (`if (classId === "knight")` is
   forbidden — express the difference as data).
3. **Extensible without rewrites.** Adding content must require zero changes
   to game-core/game-simulation.
4. **No runtime mutation.** Definitions are frozen at build; runtime state
   references them by id.

## Target flow

```
Author definitions (TypeScript objects in game-data)
   ↓  (typed against definition interfaces — compile-time gate 1)
Validation (structural + cross-reference checks — [planned])
   ↓  (fail build/tests on invalid content — gate 2)
Registries (indexed, frozen collections per definition type — [planned])
   ↓
Runtime (game-core/game-simulation look up by id)
```

### Definition conventions [current]

- Ids are stable strings, namespaced by type: `"class/knight"`,
  `"item/iron-sword"`, `"dungeon/sunken-crypt"`.
- One module per content family under `packages/game-data/src/`
  (`classes/`, `items/`, `enemies/`, …), each exporting a typed collection.
- Collections are `readonly` and exported as a single registry object per
  family once registries exist.

### Validation [planned, small tool]

A validation pass (vitest-based or a `tools/` script) checks:

- unique ids within and across families;
- referential integrity (a class's skill ids exist; a recipe's item ids
  exist; a dungeon's enemy ids exist);
- enum/range sanity (levels ≥ 1, positive costs, non-empty loot tables).

It runs in CI so bad content fails the build, and later grows into proper
content tooling. **Do not build a content editor in Phase 0.**

## Adding a new content family (future example flow)

1. Define the definition interface in game-data (extends `DefinitionBase`).
2. Add registry + validation rules.
3. Extend the consuming system in game-core/simulation.
4. Author first content + tests proving the system uses it generically.
