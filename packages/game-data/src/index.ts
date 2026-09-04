/**
 * @guildbound/game-data
 *
 * Static, data-driven game content: classes, skills, traits, items,
 * equipment, enemies, dungeons, raids, recipes, pets, quests, rewards,
 * and progression definitions.
 *
 * Hard constraints (see AGENTS.md and docs/CONTENT_PIPELINE.md):
 * - Definitions are pure data. No gameplay logic, no runtime state.
 * - Gameplay code consumes definitions; it must not branch on specific
 *   content ids (no `if (classId === "knight")`).
 * - Content is extendable without rewriting core systems.
 *
 * Phase 0: type contracts only. Content authoring begins alongside the
 * Phase 1 domain model (docs/ROADMAP.md).
 */

export const GAME_DATA_VERSION = "0.1.0";

export type { DefinitionBase, DefinitionId } from "./definition";
