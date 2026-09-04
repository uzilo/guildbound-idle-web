import { intFromUnit, type RNG } from "./rng.ts";

/**
 * Deterministic RNG (mulberry32): small, fast, well-distributed 32-bit PRNG.
 * The same seed always produces the same sequence, which makes tests and
 * simulations reproducible.
 */
export class SeededRNG implements RNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  int(min: number, max: number): number {
    return intFromUnit(this.next(), min, max);
  }
}
