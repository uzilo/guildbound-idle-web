# UI Architecture

Status: shell **[current]**, behavior **[planned]** (Phases 8–10).

## Target experience

Mobile-first web game. The layout is a single column sized for phones
(`--layout-content-max-width: 520px`), centered on desktop, with
touch-friendly targets (`--touch-target-min: 44px`).

## Global shell [current]

```
┌──────────────────────────────┐
│ Header (emblem, title)       │
├──────────────────────────────┤
│                              │
│ Content (routed screens)     │
│                              │
├──────────────────────────────┤
│ Activity Tracker [planned]   │
├──────────────────────────────┤
│ Bottom Navigation (5 tabs)   │
└──────────────────────────────┘
```

Implemented in `apps/web/src/App.tsx` with React Router
(`react-router`, library mode) and styles from design tokens
(`src/styles/tokens.css`, `src/styles/global.css`).

## Primary navigation [current placeholders → planned screens]

| Tab | Route | Screen phase |
| --- | --- | --- |
| Guild | `/` | Phase 7–9 |
| Adventurers | `/adventurers` | Phase 9 |
| Explore | `/explore` | Phase 10 |
| Inventory | `/inventory` | Phase 9 |
| More | `/more` | Phase 9+ |

Explore hosts the conceptual categories: Dungeons, Raids, Tower, Arena
(category screens **[planned]**, Phase 10–11).

## Global modal layer [planned]

A single modal host mounts overlay flows above the shell:

- Adventurer Detail · Item Detail · Team Builder · Combat Viewer ·
  Activity Tracker · Reward Toast · Confirmation · Tooltip.

Modals receive data via the application layer like any other view.

## State management [planned, Phase 8]

- **Zustand** stores hold *view state* and mirror domain state.
- The UI never mutates domain state. Flow:

```
Component → store action → application layer → game-core command
          → new GameState (+ events) → store update → re-render
```

- Domain truth lives in game-core state (a serializable object); stores are
  projections. Persistence subscribes at the application layer, not inside
  components.
- (Zustand is intentionally not installed yet — it lands with the first real
  UI state in Phase 8; see `docs/DECISIONS.md`.)

## Design system [current foundation]

Semantic CSS custom properties in `apps/web/src/styles/tokens.css`:
`--color-*` (background, surface, surface-elevated, border, text-primary,
text-secondary, accent, success, danger, warning), `--text-*` typography
roles (display, heading, body, caption, label), spacing scale, radii,
elevation, layout metrics, motion. Components consume tokens, never raw
values. Visual direction: dark fantasy / pixel-art RPG — dark charcoal
surfaces, warm gold accent. Component styles move to CSS Modules as screens
become real; `global.css` stays for reset + shell.

## File conventions [current]

```
apps/web/src/
├── App.tsx            # shell: header, routes, bottom nav
├── main.tsx           # bootstrap (router + styles)
├── navigation.ts      # nav model (single source for tabs)
├── pages/             # one component per route
├── styles/            # tokens.css, global.css
└── test/              # test setup
```

Planned additions: `components/`, `stores/`, `application/` (command
dispatch), `persistence/` (IndexedDB adapter).
