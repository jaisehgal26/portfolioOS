"use client";

import { useMemo, useState } from "react";
import { Check, Circle, Plus, X } from "lucide-react";
import { useLocalStorage } from "@jaios/kernel/hooks/use-local-storage";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  text: string;
  done: boolean;
}

type Filter = "all" | "active" | "done";

export function TodoApp() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("jaios-todos", []);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const remaining = tasks.filter((t) => !t.done).length;
  const visible = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.done);
    if (filter === "done") return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

  function add() {
    const text = draft.trim();
    if (!text) return;
    setTasks((prev) => [{ id: `t-${Date.now()}`, text, done: false }, ...prev]);
    setDraft("");
  }

  function toggle(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function remove(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line p-4">
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Add a task…"
            className="h-10 flex-1 rounded-xl border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-faint focus:border-line-strong focus:outline-none"
          />
          <button
            type="button"
            onClick={add}
            disabled={!draft.trim()}
            aria-label="Add task"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-bg transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-1">
          {(["all", "active", "done"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
                filter === f ? "bg-ink text-bg" : "text-muted hover:bg-ink/5 hover:text-ink",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {visible.length === 0 ? (
          <p className="px-3 py-10 text-center text-sm text-faint">
            {filter === "done" ? "Nothing completed yet." : "No tasks — add one above."}
          </p>
        ) : (
          <ul className="space-y-0.5">
            {visible.map((t) => (
              <li key={t.id} className="group flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-ink/[0.04]">
                <button
                  type="button"
                  onClick={() => toggle(t.id)}
                  aria-label={t.done ? "Mark as not done" : "Mark as done"}
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors",
                    t.done ? "border-mint bg-mint text-bg" : "border-line-strong text-transparent hover:border-ink",
                  )}
                >
                  {t.done ? <Check className="h-3 w-3" /> : <Circle className="h-3 w-3 opacity-0" />}
                </button>
                <span className={cn("min-w-0 flex-1 text-sm", t.done ? "text-faint line-through" : "text-ink")}>
                  {t.text}
                </span>
                <button
                  type="button"
                  onClick={() => remove(t.id)}
                  aria-label="Delete task"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-faint opacity-0 transition-opacity hover:bg-ink/5 hover:text-ink group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-line px-4 py-2 text-xs text-faint">
        <span className="tabular-nums">{remaining} remaining</span>
        {tasks.some((t) => t.done) && (
          <button
            type="button"
            onClick={() => setTasks((prev) => prev.filter((t) => !t.done))}
            className="transition-colors hover:text-ink"
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}
