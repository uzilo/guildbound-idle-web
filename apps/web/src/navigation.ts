/** Primary navigation model (docs/UI_ARCHITECTURE.md). */
export interface NavItem {
  /** Route path. */
  readonly path: string;
  /** Visible label. */
  readonly label: string;
  /** Placeholder glyph; replaced by real art in later phases. */
  readonly icon: string;
  /** Whether the route should match only when it is the exact path. */
  readonly end: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { path: "/", label: "Guild", icon: "🏰", end: true },
  { path: "/adventurers", label: "Adventurers", icon: "⚔️", end: false },
  { path: "/explore", label: "Explore", icon: "🗺️", end: false },
  { path: "/inventory", label: "Inventory", icon: "🎒", end: false },
  { path: "/more", label: "More", icon: "•••", end: false },
] as const;
