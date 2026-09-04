/**
 * RNG abstraction.
 *
 * Rule (AGENTS.md): never scatter `Math.random()` throughout gameplay.
 * Domain code receives an `RNG` instance; live play uses `RandomRNG`,
 * tests and simulations use `SeededRNG`. This enables deterministic
 * tests, reproducible simulations, debugging, and future server validation.
 */
export interface RNG {
  /** Uniform float in [0, 1). */
  next(): number;

  /** Uniform integer in [min, max], inclusive on both ends. */
  int(min: number, max: number): number;
}

/**
 * Convert a unit float in [0, 1) into an inclusive integer range.
 * Shared by all RNG implementations so range semantics are defined once.
 */
export function intFromUnit(unit: number, min: number, max: number): number {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new RangeError(`int() requires integer bounds, got [${min}, ${max}]`);
  }
  if (max < min) {
    throw new RangeError(`int() requires max >= min, got [${min}, ${max}]`);
  }
  const span = max - min + 1;
  return min + Math.floor(unit * span);
}
