/**
 * Time primitives.
 *
 * All idle simulation scheduling is expressed with plain epoch-millisecond
 * timestamps and durations — never with a live ticking clock.
 * See docs/IDLE_SIMULATION.md.
 */

/** A point in time as Unix epoch milliseconds (UTC). */
export type TimestampMillis = number;

/** An elapsed duration in milliseconds. */
export type DurationMillis = number;
