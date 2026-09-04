/**
 * Explicit success/failure result.
 *
 * Domain APIs use results for *expected* outcomes (e.g. an unaffordable
 * purchase, an invalid command) instead of throwing, so state transitions
 * stay explicit and easy to test. Exceptions remain for programmer errors.
 */
export type Result<TValue, TError> =
  | { readonly ok: true; readonly value: TValue }
  | { readonly ok: false; readonly error: TError };

export function ok<TValue>(value: TValue): Result<TValue, never> {
  return { ok: true, value };
}

export function err<TError>(error: TError): Result<never, TError> {
  return { ok: false, error };
}

export function isOk<TValue, TError>(
  result: Result<TValue, TError>,
): result is Extract<Result<TValue, TError>, { ok: true }> {
  return result.ok;
}

export function isErr<TValue, TError>(
  result: Result<TValue, TError>,
): result is Extract<Result<TValue, TError>, { ok: false }> {
  return !result.ok;
}
