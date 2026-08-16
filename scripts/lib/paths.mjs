import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
export const root = join(scriptsDir, "..", "..");
export const backend = join(root, "backend");
export const isWin = process.platform === "win32";

export function venvPython() {
  return join(backend, ".venv", isWin ? "Scripts" : "bin", isWin ? "python.exe" : "python");
}
