/**
 * Foundation types for every static content definition.
 *
 * Registries, validation, and actual content collections (classes, items,
 * enemies, ...) are introduced in later phases — see docs/CONTENT_PIPELINE.md.
 */

declare const definitionId: unique symbol;

/**
 * Branded string identifier for a static definition.
 * Branding prevents mixing definition ids with arbitrary strings or
 * runtime entity ids.
 */
export type DefinitionId = string & { readonly [definitionId]: true };

/** Shape shared by every static definition. */
export interface DefinitionBase {
  /** Stable, unique identifier (e.g. "class/knight", "item/iron-sword"). */
  readonly id: DefinitionId;
  /** Human-readable name shown in the UI. */
  readonly name: string;
}
