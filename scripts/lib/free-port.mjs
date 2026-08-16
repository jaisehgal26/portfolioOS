import { execSync, spawnSync } from "node:child_process";
import { isWin } from "./paths.mjs";

/** PIDs listening on the given TCP port (empty if port is free). */
export function getPidsOnPort(port) {
  if (isWin) {
    try {
      const out = execSync("netstat -ano", { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] });
      const pids = new Set();

      for (const line of out.split(/\r?\n/)) {
        if (!line.includes("LISTENING")) continue;
        if (!new RegExp(`:${port}\\s`).test(line)) continue;

        const parts = line.trim().split(/\s+/);
        const pid = Number(parts.at(-1));
        if (Number.isInteger(pid) && pid > 0) pids.add(pid);
      }

      return [...pids];
    } catch {
      return [];
    }
  }

  try {
    const out = execSync(`lsof -ti :${port} -sTCP:LISTEN`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });
    return out
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .map(Number)
      .filter((pid) => pid > 0);
  } catch {
    return [];
  }
}

function killPid(pid) {
  if (pid === process.pid) return false;

  const result = isWin
    ? spawnSync("taskkill", ["/PID", String(pid), "/F"], { stdio: "ignore", shell: true })
    : spawnSync("kill", ["-9", String(pid)], { stdio: "ignore" });

  return result.status === 0;
}

function sleep(ms) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    // busy-wait — short delays only (port release)
  }
}

/** Kill any process listening on `port`, then wait until the port is free. */
export function freePort(port, { retries = 10, delayMs = 300 } = {}) {
  let pids = getPidsOnPort(port).filter((pid) => pid !== process.pid);

  if (pids.length === 0) return;

  console.log(
    `\n→ Port ${port} is in use (PID${pids.length > 1 ? "s" : ""}: ${pids.join(", ")}). Stopping…`,
  );

  for (const pid of pids) {
    if (killPid(pid)) console.log(`   Killed PID ${pid}`);
  }

  for (let attempt = 0; attempt < retries; attempt += 1) {
    pids = getPidsOnPort(port).filter((pid) => pid !== process.pid);
    if (pids.length === 0) {
      console.log(`   Port ${port} is free.\n`);
      return;
    }
    sleep(delayMs);
  }

  console.error(`Could not free port ${port}. Still in use by PID(s): ${pids.join(", ")}`);
  process.exit(1);
}
