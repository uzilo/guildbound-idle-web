/**
 * @guildbound/shared
 *
 * Genuinely shared types and utilities with zero domain knowledge and zero
 * dependencies. This package is NOT a dumping ground — gameplay concepts
 * belong in game-core, content definitions in game-data.
 *
 * See docs/ARCHITECTURE.md for package boundaries.
 */

export type { Result } from "./result.ts";
export { err, isErr, isOk, ok } from "./result.ts";

export type { DurationMillis, TimestampMillis } from "./time.ts";
