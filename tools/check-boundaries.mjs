#!/usr/bin/env node
// Boundary check: validates workspace dependency edges against the rules in
// docs/ARCHITECTURE.md. Deliberately dependency-free so it runs anywhere.
//
// Run via `pnpm check:boundaries` (also part of `pnpm verify`).

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const workspacePackages = [
  "packages/shared",
  "packages/game-core",
  "packages/game-data",
  "packages/game-simulation",
  "apps/web",
];

/** Which internal packages each package may depend on (dependency direction). */
const allowedInternalDeps = {
  "@guildbound/shared": [],
  "@guildbound/game-core": [],
  "@guildbound/game-data": [],
  "@guildbound/game-simulation": [
    "@guildbound/shared",
    "@guildbound/game-core",
    "@guildbound/game-data",
  ],
  "@guildbound/web": [
    "@guildbound/shared",
    "@guildbound/game-core",
    "@guildbound/game-data",
    "@guildbound/game-simulation",
  ],
};

/** Packages that must stay runnable in plain Node (no React, no browser APIs). */
const mustBeEnvironmentAgnostic = [
  "@guildbound/shared",
  "@guildbound/game-core",
  "@guildbound/game-data",
  "@guildbound/game-simulation",
];

const browserOnlyPattern = /^(react|react-dom|react-router|zustand)(\/|$)/;

let failed = false;
const fail = (message) => {
  failed = true;
  console.error(`  x ${message}`);
};

for (const dir of workspacePackages) {
  const pkg = JSON.parse(readFileSync(resolve(repoRoot, dir, "package.json"), "utf8"));
  console.log(`Checking ${pkg.name} (${dir})`);

  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.peerDependencies,
  };

  for (const dep of Object.keys(deps)) {
    if (dep in allowedInternalDeps && !allowedInternalDeps[pkg.name].includes(dep)) {
      fail(`${pkg.name} depends on ${dep} — not allowed by docs/ARCHITECTURE.md`);
    }
  }

  if (mustBeEnvironmentAgnostic.includes(pkg.name)) {
    for (const dep of Object.keys(deps)) {
      if (browserOnlyPattern.test(dep)) {
        fail(`${pkg.name} must be environment-agnostic but depends on ${dep}`);
      }
    }
  }
}

if (failed) {
  console.error("\nBoundary check FAILED. See docs/ARCHITECTURE.md for the allowed edges.");
  process.exit(1);
}

console.log("\nBoundary check passed: dependency direction matches docs/ARCHITECTURE.md.");
