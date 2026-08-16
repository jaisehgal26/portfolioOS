import { spawn } from "node:child_process";
import { ensureBackendVenv } from "./ensure-backend-venv.mjs";
import { freePort } from "./lib/free-port.mjs";
import { backend } from "./lib/paths.mjs";

const python = ensureBackendVenv();
freePort(8000);

console.log("\n→ Starting backend dev server (http://localhost:8000)…\n");

const child = spawn(
  python,
  ["-m", "uvicorn", "app.main:app", "--reload", "--port", "8000"],
  { cwd: backend, stdio: "inherit", env: process.env },
);

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
