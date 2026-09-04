import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

/**
 * Resolve workspace packages to their TypeScript sources so tests never
 * require a prior `pnpm build`.
 * Keep in sync with the aliases in `apps/web/vite.config.ts`.
 */
const workspaceAliases = {
  "@guildbound/shared": r("./packages/shared/src/index.ts"),
  "@guildbound/game-core": r("./packages/game-core/src/index.ts"),
  "@guildbound/game-data": r("./packages/game-data/src/index.ts"),
  "@guildbound/game-simulation": r("./packages/game-simulation/src/index.ts"),
};

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "shared",
          include: ["packages/shared/**/*.test.ts"],
          environment: "node",
        },
        resolve: { alias: workspaceAliases },
      },
      {
        test: {
          name: "game-core",
          include: ["packages/game-core/**/*.test.ts"],
          environment: "node",
        },
        resolve: { alias: workspaceAliases },
      },
      {
        test: {
          name: "game-data",
          include: ["packages/game-data/**/*.test.ts"],
          environment: "node",
          passWithNoTests: true,
        },
        resolve: { alias: workspaceAliases },
      },
      {
        test: {
          name: "game-simulation",
          include: ["packages/game-simulation/**/*.test.ts"],
          environment: "node",
          passWithNoTests: true,
        },
        resolve: { alias: workspaceAliases },
      },
      {
        test: {
          name: "web",
          include: ["apps/web/src/**/*.test.{ts,tsx}"],
          environment: "jsdom",
          setupFiles: ["apps/web/src/test/setup.ts"],
        },
        plugins: [react()],
        resolve: { alias: workspaceAliases },
      },
    ],
  },
});
