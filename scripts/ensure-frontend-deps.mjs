import { spawnSync } from "node:child_process";
import { root, isWin } from "./lib/paths.mjs";

/** Install workspace dependencies (frontend lives in the pnpm workspace). */
export function ensureFrontendDeps() {
  console.log("\n→ Installing frontend dependencies (pnpm install)…\n");

  const result = spawnSync(isWin ? "pnpm.cmd" : "pnpm", ["install"], {
    cwd: root,
    stdio: "inherit",
    shell: isWin,
  });

  if (result.status !== 0) {
    console.error("pnpm install failed.");
    process.exit(result.status ?? 1);
  }
}

if (process.argv[1]?.endsWith("ensure-frontend-deps.mjs")) {
  ensureFrontendDeps();
}
