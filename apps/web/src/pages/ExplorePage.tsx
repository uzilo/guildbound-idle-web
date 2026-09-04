const EXPLORE_MODES = [
  { icon: "🕳️", name: "Dungeons", note: "Instanced combat runs" },
  { icon: "🐉", name: "Raids", note: "Large-scale boss battles" },
  { icon: "🗼", name: "Tower", note: "Roguelike floor climb" },
  { icon: "🏟️", name: "Arena", note: "PvP versus other guilds" },
] as const;

/**
 * Placeholder screen — exploration content arrives in Phase 6+ (docs/ROADMAP.md).
 * The list mirrors the conceptual Explore categories in docs/GAME_DESIGN.md.
 */
export function ExplorePage() {
  return (
    <section className="page-placeholder">
      <h2 className="page-placeholder-title">Explore</h2>
      <ul className="explore-list">
        {EXPLORE_MODES.map((mode) => (
          <li key={mode.name} className="explore-item">
            <span className="explore-item-icon" aria-hidden="true">
              {mode.icon}
            </span>
            <div>
              <p className="explore-item-name">{mode.name}</p>
              <p className="explore-item-note">{mode.note}</p>
            </div>
            <span className="explore-item-lock" aria-label="Locked">
              🔒
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
