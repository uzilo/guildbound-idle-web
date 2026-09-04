import { describe, expect, it } from "vitest";
import { err, isErr, isOk, ok, type Result } from "./result.ts";

describe("Result", () => {
  it("carries a success value", () => {
    const result = ok(42);
    expect(result.ok).toBe(true);
    if (isOk(result)) {
      expect(result.value).toBe(42);
    }
  });

  it("carries an error value", () => {
    const result: Result<number, string> = err("not_enough_gold");
    expect(result.ok).toBe(false);
    if (isErr(result)) {
      expect(result.error).toBe("not_enough_gold");
    }
  });

  it("narrows with isOk/isErr", () => {
    const success: Result<number, string> = ok(1);
    const failure: Result<number, string> = err("boom");

    expect(isOk(success)).toBe(true);
    expect(isErr(success)).toBe(false);
    expect(isOk(failure)).toBe(false);
    expect(isErr(failure)).toBe(true);
  });
});
