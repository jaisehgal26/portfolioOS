import { spawn, spawnSync } from "node:child_process";
import { ensureBackendVenv } from "./ensure-backend-venv.mjs";
import { ensureFrontendDeps } from "./ensure-frontend-deps.mjs";
import { runDockerUp } from "./lib/docker.mjs";
import { freePort } from "./lib/free-port.mjs";
import { backend, isWin, root } from "./lib/paths.mjs";

const dockerStarted = runDockerUp();
ensureFrontendDeps();
const python = ensureBackendVenv();

freePort(3000);
freePort(8000);

console.log("\n→ Starting full dev stack…");
console.log("   Frontend  http://localhost:3000");
console.log("   Backend   http://localhost:8000");
if (dockerStarted) console.log("   Postgres  localhost:5433");
console.log("   Press Ctrl+C to stop all servers.\n");

const children = [];
let shuttingDown = false;

function killAll() {
  for (const child of children) {
    if (!child.killed) {
      if (isWin) {
        spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore", shell: true });
      } else {
        child.kill("SIGTERM");
      }
    }
  }
}

function spawnProc(cmd, args, options) {
  const child = spawn(cmd, args, { stdio: "inherit", shell: isWin, ...options });
  children.push(child);

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    killAll();
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });

  return child;
}

spawnProc(python, ["-m", "uvicorn", "app.main:app", "--reload", "--port", "8000"], { cwd: backend, shell: false });
spawnProc(isWin ? "pnpm.cmd" : "pnpm", ["--filter", "frontend", "dev"], { cwd: root, shell: true });

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    if (shuttingDown) return;
    shuttingDown = true;
    killAll();
    process.exit(0);
  });
}
