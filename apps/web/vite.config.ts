import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Workspace packages resolve to their TypeScript sources so the dev server
 * and production build pick up package changes without a prior `pnpm build`.
 * Keep in sync with the aliases in the root `vitest.config.ts` and the
 * `paths` mapping in `apps/web/tsconfig.json`.
 */
const workspacePackage = (dir: string) =>
  fileURLToPath(new URL(`../../packages/${dir}/src/index.ts`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@guildbound/shared": workspacePackage("shared"),
      "@guildbound/game-core": workspacePackage("game-core"),
      "@guildbound/game-data": workspacePackage("game-data"),
      "@guildbound/game-simulation": workspacePackage("game-simulation"),
    },
  },
  server: {
    // Bind to all interfaces and accept the sandbox preview hostname.
    host: true,
    allowedHosts: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
});
