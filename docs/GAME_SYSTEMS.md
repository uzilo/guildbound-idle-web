# Game Systems

Catalog of the intended systems, grouped by area. Every entry is a **design
target** unless marked **[current]**. Implementation order lives in
`docs/ROADMAP.md`; domain shapes live in `docs/DATA_MODEL.md`.

## Guild

- **Roster capacity** — base slots, expanded by facilities or upgrades.
- **Facilities** — buildings that unlock/boost systems (training grounds,
  forge, market stall, …).
- **Recruitment** — generate candidate adventurers; spend currency to hire.
- **Economy** — currencies, income, sinks (see `docs/ECONOMY.md`).
- **Crafting** — recipes turn materials into equipment (Phase 5).
- **Storage** — shared guild inventory separate from adventurer loadouts.
- **Market** — buy/sell items at dynamic-ish prices; time-gated offers.

## Adventurers

- **Identity** — name, portrait, rarity.
- **Class** — class family, promotion ladder (see Classes below).
- **Level / XP** — earned from activities; level curve as data.
- **Traits** — passive modifiers with data-driven effects.
- **Stats** — derived through the modifier pipeline (`docs/COMBAT.md`).
- **Equipment** — per-slot loadout; equipment instances roll modifiers.
- **Skills** — active abilities with cooldowns/costs, unlocked by class/level.
- **Pet** — one companion contributing modifiers/abilities.
- **Activity state** — idle, or assigned to an activity with a return time.

## Classes

- **Base classes** — starting archetypes (e.g. warrior, mage, rogue, cleric).
- **Class families** — shared progression trees (martial, arcane, …).
- **Promotion** — tier-2/3 promotions chosen at level gates.
- **Progression graph** — classes form a data-defined graph, not code paths.
- **Skill access** — a class grants its skill list by level.

Classes must be `ClassDefinition` data; gameplay never branches on specific
class ids.

## Equipment

- **Slots** — weapon, armor, accessory, offhand.
- **Definitions vs instances** — an `EquipmentDefinition` is the item type;
  an `EquipmentInstance` is a rolled/owned copy with modifier values.
- **Modifiers** — stat bonuses sourced from the item, removable/replaceable.
- **Rarity** — affects modifier count/ranges and visuals.

## Inventory

- **Stackables** — materials/currencies with quantity.
- **Unique items** — equipment instances, one per stack entry.
- **Capacity** — soft limits with upgrade paths.
- **Sources/sinks** — loot, crafting, market, rewards.

## Activities (timed jobs)

Generic timed model (see `docs/IDLE_SIMULATION.md`):

```
QUEUED → ACTIVE → READY → CLAIMED
```

- **Expedition** — send a team; returns with rewards after a duration.
- **Crafting job** — recipe takes real time.
- **Market order** — listing expires or sells after time.
- **Quests** — timed objectives with rewards.
- **Training** — short jobs granting XP/stats.

## Exploration

- **Expeditions** — the core repeatable activity; risk/reward tiers.
- **Dungeons** — multi-encounter runs with progression and a boss.
- **Raids** — multi-stage, higher coordination (loadout) demands.

## Combat

Automatic, deterministic, event-producing. Full design:
`docs/COMBAT.md`. Summary:

- **Turn order** — from final stats (speed, tie-breaks via RNG).
- **Actions** — attack, skill, item-less defaults; AI by simple data-driven
  priorities.
- **Resolution** — accuracy, damage, defense/mitigation, critical.
- **Effects/status** — buffs/debuffs with durations as events.
- **Victory/defeat** — side elimination or turn/round limits.
- **Output** — `CombatEvent[]` consumed by UI, logs, replay, tests.

## Roguelike layer (Tower)

- **Temporary copies** — runs operate on a snapshot of guild state; no
  permanent loss.
- **Floors** — escalating encounters; bosses at gates.
- **Cards** — draft temporary modifiers between floors.
- **Run rewards** — converted to permanent progression on completion.

## Arena (PvP)

- **Player builds** — a defensive team snapshot published from guild state.
- **Validation** — server (or local validator) confirms build legality.
- **Server-authoritative combat** **[future]** — real opponents resolve on a
  server; offline client shows results. The combat engine must be runnable
  server-side (it will be, by design).

## Cross-cutting systems

- **Persistence** — serialize state, versioned migrations (Phase 12).
- **Offline progression** — `simulateUntil` catch-up with sane caps.
- **Settings/meta** — options, codex, statistics.
