/**
 * @guildbound/game-core
 *
 * The authoritative gameplay engine: entities, runtime state, stats,
 * modifiers, formulas, rules, commands, and game systems.
 *
 * Hard constraints (see AGENTS.md and docs/ARCHITECTURE.md):
 * - No React, no DOM, no browser APIs.
 * - No persistence or network access.
 * - No `Math.random()` in domain logic — use the `RNG` abstraction.
 * - Deterministic given the same starting state, seed, and timestamps.
 *
 * Runs in plain Node, workers, and the browser.
 *
 * Phase 0: foundation only. The RNG abstraction is the first piece of
 * infrastructure; domain systems arrive in Phase 1+ (docs/ROADMAP.md).
 */

export const GAME_CORE_VERSION = "0.1.0";

export type { RNG } from "./rng/rng.ts";
export { intFromUnit } from "./rng/rng.ts";
export { RandomRNG } from "./rng/random-rng.ts";
export { SeededRNG } from "./rng/seeded-rng.ts";
