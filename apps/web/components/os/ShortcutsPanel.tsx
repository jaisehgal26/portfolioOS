"use client";

import { Modal } from "@/components/ui/Modal";
import { useOSStore } from "@/store/os-store";

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["⌘", "K"], label: "Open Spotlight search" },
  { keys: ["⌘", "1"], label: "Open About" },
  { keys: ["⌘", "2"], label: "Open Projects" },
  { keys: ["⌘", "3"], label: "Open Resume" },
  { keys: ["⌘", "4"], label: "Open Contact" },
  { keys: ["Esc"], label: "Close search / dialogs" },
  { keys: ["Right click"], label: "Desktop context menu" },
];

export function ShortcutsPanel() {
  const open = useOSStore((s) => s.helpOpen);
  const setOpen = useOSStore((s) => s.setHelpOpen);

  return (
    <Modal open={open} onClose={() => setOpen(false)} label="Keyboard shortcuts">
      <div className="p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">Keyboard shortcuts</h2>
        <p className="mt-1 text-sm text-muted">Use ⌘ on macOS or Ctrl on Windows / Linux.</p>
        <ul className="mt-6 divide-y divide-line">
          {SHORTCUTS.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-4 py-3">
              <span className="text-sm text-ink">{s.label}</span>
              <span className="flex items-center gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-lg border border-line bg-surface-2 px-2 font-mono text-xs font-medium text-muted shadow-soft"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
