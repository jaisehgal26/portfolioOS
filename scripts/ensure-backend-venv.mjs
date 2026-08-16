import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { backend, isWin, venvPython } from "./lib/paths.mjs";

function findPythonLauncher() {
  const candidates = isWin
    ? [["python"], ["py", "-3"], ["python3"]]
    : [["python3"], ["python"]];

  for (const cmd of candidates) {
    const check = spawnSync(cmd[0], [...cmd.slice(1), "--version"], {
      stdio: "pipe",
      shell: false,
    });
    if (check.status === 0) return cmd;
  }

  return null;
}

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: false, ...options });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

/** Create backend .venv if missing, then install Python requirements. */
export function ensureBackendVenv() {
  const python = venvPython();

  if (!existsSync(python)) {
    const launcher = findPythonLauncher();
    if (!launcher) {
      console.error(
        [
          "Python not found. Install Python 3.11+ and ensure it is on your PATH.",
          isWin ? "  Try: winget install Python.Python.3.12" : "  Try: brew install python@3.12",
        ].join("\n"),
      );
      process.exit(1);
    }

    console.log("\n→ Creating backend virtual environment (.venv)…\n");
    run(launcher[0], [...launcher.slice(1), "-m", "venv", ".venv"], { cwd: backend });
  }

  console.log("\n→ Installing backend dependencies (pip install)…\n");
  run(python, ["-m", "pip", "install", "-r", "requirements.txt"], { cwd: backend });

  return python;
}

if (process.argv[1]?.endsWith("ensure-backend-venv.mjs")) {
  ensureBackendVenv();
}
