import { NavLink, Route, Routes } from "react-router";
import { NAV_ITEMS } from "./navigation";
import { AdventurersPage } from "./pages/AdventurersPage";
import { ExplorePage } from "./pages/ExplorePage";
import { GuildPage } from "./pages/GuildPage";
import { InventoryPage } from "./pages/InventoryPage";
import { MorePage } from "./pages/MorePage";
import { NotFoundPage } from "./pages/NotFoundPage";

/**
 * Top-level application shell: header, routed content, and bottom navigation.
 *
 * Layout only — no domain state. The UI never mutates game state directly;
 * it will dispatch commands to game-core through an application layer
 * (docs/UI_ARCHITECTURE.md). The activity tracker slot is reserved between
 * content and navigation for a later phase.
 */
export function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-header-emblem" aria-hidden="true">
          🛡️
        </span>
        <div className="app-header-titles">
          <h1 className="app-title">Guildbound</h1>
          <p className="app-tagline">Idle Guild RPG</p>
        </div>
      </header>

      <main className="app-content" id="main">
        <Routes>
          <Route path="/" element={<GuildPage />} />
          <Route path="/adventurers" element={<AdventurersPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <nav className="bottom-nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              isActive ? "bottom-nav-link bottom-nav-link--active" : "bottom-nav-link"
            }
          >
            <span className="bottom-nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
