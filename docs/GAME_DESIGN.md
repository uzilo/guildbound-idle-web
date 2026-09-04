# Game Design

Status: design foundation. Systems marked **[planned]** are targets, not
implementations. Numbers and balance are deliberately out of scope.

## Player fantasy

The player runs a **guild of adventurers**: recruits fresh faces, trains
them into specialized classes, gears them up, and sends balanced teams into
the dangerous world to bring back gold, loot, and glory. Progress continues
while the player is away — returning to a pile of rewards is the emotional
heartbeat of the game.

The player is a manager, not an avatar. Interesting decisions are about
*who* to recruit, *how* to develop them, *what* to craft and equip, and
*where* to send them — not twitch gameplay.

## Core loop

```
Recruit → Develop → Equip → Send → Resolve → Collect → Improve
   ▲                                                    │
   └────────────────────────────────────────────────────┘
```

- **Recruit** — spend gold/tokens to add adventurers to the roster.
- **Develop** — level, promote classes, learn skills, unlock traits, pets.
- **Equip** — craft/buy equipment, assign loadouts.
- **Send** — form teams, choose an activity (expedition, dungeon, …).
- **Resolve** — time passes; combat simulates automatically (idle or offline).
- **Collect** — claim XP, loot, currency when the activity completes.
- **Improve** — invest rewards into gear, facilities, and deeper content.

Idle/time mechanics wrap the whole loop: activities run on timestamps and
resolve whether or not the browser is open.

## Major gameplay areas

Primary navigation mirrors these areas (**[current]** as placeholder screens,
content **[planned]**):

### Guild
The home screen and management hub — roster capacity, facilities, treasury,
recruitment, crafting, storage, market access. **[planned]** (Phase 7+).

### Adventurers
Collection and development of individual adventurers — identity, class,
level, stats, equipment, skills, traits, pets, activity status. **[planned]**
(Phases 1–4 define the domain; Phase 9 the UI).

### Explore
Where teams are sent. Conceptual categories **[current placeholders,
systems planned]**:

- **Dungeons** — instanced combat runs with enemy progressions.
- **Raids** — large multi-stage boss encounters.
- **Tower** — roguelike floor climb with temporary modifiers.
- **Arena** — asynchronous PvP against other players' guild builds.

### Inventory
Equipment instances, stackable materials, capacity, crafting inputs.
**[planned]** (Phase 4).

### More
Settings, save management, stats, codex, and secondary systems. **[planned]**
(Phase 9+).

## Design pillars

1. **The game runs itself; the player steers.** Automation with meaningful
   managerial choices.
2. **Respect offline time.** Timestamp-based resolution, generous offline
   progression, no punishment for closing the tab.
3. **Data over code.** Content is data; adding a class, item, or dungeon must
   not require touching engine logic.
4. **Readable numbers.** Stats and rewards should be legible at a glance on a
   phone screen.
5. **Original work.** All code, content, names, and art direction are
   original to this project.

## Scope discipline

This document defines direction only. No system exists until its phase in
`docs/ROADMAP.md` is started, and docs are updated to reflect reality.
