import { intFromUnit, type RNG } from "./rng.ts";

/**
 * Non-deterministic RNG backed by `Math.random()`.
 * Use for live play. Use `SeededRNG` for tests and simulations.
 */
export class RandomRNG implements RNG {
  next(): number {
    return Math.random();
  }

  int(min: number, max: number): number {
    return intFromUnit(this.next(), min, max);
  }
}
