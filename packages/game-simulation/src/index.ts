/**
 * @guildbound/game-simulation
 *
 * Simulation systems: combat resolution, expedition runs, idle catch-up
 * (`simulateUntil`), dungeons, raids, and tower runs.
 *
 * Hard constraints (see AGENTS.md and docs/ARCHITECTURE.md):
 * - May depend on game-core and game-data. Never on React or the browser.
 * - Deterministic given state, seed, and elapsed time (seeded RNG only).
 * - Produces data (events, results, reward lists) — never UI.
 *
 * Phase 0: package boundary only. Systems arrive in Phase 3+
 * (combat engine) and Phase 5+ (idle/expedition simulation).
 * See docs/COMBAT.md and docs/IDLE_SIMULATION.md for the target designs.
 */

export const GAME_SIMULATION_VERSION = "0.1.0";
