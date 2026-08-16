import { spawnSync } from "node:child_process";
import { isWin, root } from "./paths.mjs";

/** Start local Postgres via docker compose. Returns false if Docker is unavailable. */
export function runDockerUp() {
  console.log("\n→ Starting Docker (Postgres on port 5433)…\n");

  const result = spawnSync("docker", ["compose", "up", "-d"], {
    cwd: root,
    stdio: "inherit",
    shell: isWin,
  });

  if (result.status !== 0) {
    console.warn(
      [
        "⚠ Could not start Docker.",
        "  Install Docker Desktop and ensure it is running, then run: pnpm docker:up",
        "  Continuing without local Postgres…\n",
      ].join("\n"),
    );
    return false;
  }

  return true;
}
