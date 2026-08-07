import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const backend = join(root, "backend");
const isWin = process.platform === "win32";
const python = join(backend, ".venv", isWin ? "Scripts" : "bin", isWin ? "python.exe" : "python");

if (!existsSync(python)) {
  console.error(
    [
      "Backend venv not found.",
      "",
      "  cd backend",
      "  python -m venv .venv",
      isWin ? "  .venv\\Scripts\\activate" : "  source .venv/bin/activate",
      "  pip install -r requirements.txt",
      "  alembic upgrade head",
      "",
      "Then run: pnpm dev:backend",
    ].join("\n"),
  );
  process.exit(1);
}

const child = spawn(
  python,
  ["-m", "uvicorn", "app.main:app", "--reload", "--port", "8000"],
  { cwd: backend, stdio: "inherit", env: process.env },
);

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
