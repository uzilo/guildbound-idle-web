import { describe, expect, it } from "vitest";
import { RandomRNG } from "./random-rng.ts";
import { SeededRNG } from "./seeded-rng.ts";
import { intFromUnit } from "./rng.ts";

describe("SeededRNG", () => {
  it("produces the same float sequence for the same seed", () => {
    const a = new SeededRNG(1234);
    const b = new SeededRNG(1234);

    const seqA = Array.from({ length: 16 }, () => a.next());
    const seqB = Array.from({ length: 16 }, () => b.next());

    expect(seqA).toEqual(seqB);
  });

  it("produces the same integer sequence for the same seed", () => {
    const a = new SeededRNG(42);
    const b = new SeededRNG(42);

    const seqA = Array.from({ length: 16 }, () => a.int(1, 6));
    const seqB = Array.from({ length: 16 }, () => b.int(1, 6));

    expect(seqA).toEqual(seqB);
  });

  it("produces different sequences for different seeds", () => {
    const a = new SeededRNG(1);
    const b = new SeededRNG(2);

    const seqA = Array.from({ length: 8 }, () => a.next());
    const seqB = Array.from({ length: 8 }, () => b.next());

    expect(seqA).not.toEqual(seqB);
  });

  it("keeps next() within [0, 1)", () => {
    const rng = new SeededRNG(7);
    for (let i = 0; i < 10_000; i++) {
      const value = rng.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("keeps int() within bounds and hits both endpoints over many draws", () => {
    const rng = new SeededRNG(99);
    const seen = new Set<number>();

    for (let i = 0; i < 10_000; i++) {
      const value = rng.int(1, 6);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
      expect(Number.isInteger(value)).toBe(true);
      seen.add(value);
    }

    expect(seen).toEqual(new Set([1, 2, 3, 4, 5, 6]));
  });

  it("rejects invalid ranges", () => {
    const rng = new SeededRNG(1);
    expect(() => rng.int(5, 1)).toThrow(RangeError);
    expect(() => rng.int(1.5, 6)).toThrow(RangeError);
  });
});

describe("RandomRNG", () => {
  it("keeps next() within [0, 1)", () => {
    const rng = new RandomRNG();
    for (let i = 0; i < 1_000; i++) {
      const value = rng.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("keeps int() within bounds", () => {
    const rng = new RandomRNG();
    for (let i = 0; i < 1_000; i++) {
      const value = rng.int(0, 100);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  });
});

describe("intFromUnit", () => {
  it("maps a unit float into the inclusive range", () => {
    expect(intFromUnit(0, 2, 4)).toBe(2);
    expect(intFromUnit(0.999, 2, 4)).toBe(4);
    expect(intFromUnit(0.5, 2, 4)).toBe(3);
  });
});
