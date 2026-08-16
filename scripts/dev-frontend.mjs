import { spawn } from "node:child_process";
import { ensureFrontendDeps } from "./ensure-frontend-deps.mjs";
import { freePort } from "./lib/free-port.mjs";
import { isWin, root } from "./lib/paths.mjs";

ensureFrontendDeps();
freePort(3000);

console.log("\n→ Starting frontend dev server (http://localhost:3000)…\n");

const child = spawn(isWin ? "pnpm.cmd" : "pnpm", ["--filter", "frontend", "dev"], {
  cwd: root,
  stdio: "inherit",
  shell: isWin,
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
