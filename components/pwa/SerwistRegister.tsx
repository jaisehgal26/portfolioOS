"use client";

import { useEffect, useRef, useState } from "react";
import { SerwistProvider } from "@serwist/next/react";
import { RefreshCw, X } from "lucide-react";
import { useOSStore } from "@/store/os-store";

const isProd = process.env.NODE_ENV === "production";

export function SerwistRegister({ children }: { children: React.ReactNode }) {
  return (
    <SerwistProvider swUrl="/sw.js" disable={!isProd} reloadOnOnline={false}>
      <SerwistUpdates />
      <InstallPrompt />
      {children}
    </SerwistProvider>
  );
}

function SerwistUpdates() {
  const pushToast = useOSStore((s) => s.pushToast);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const refreshing = useRef(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !isProd) return;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing.current) window.location.reload();
    });

    navigator.serviceWorker.ready.then((reg) => {
      if (reg.waiting) setWaiting(reg.waiting);

      reg.addEventListener("updatefound", () => {
        const worker = reg.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            setWaiting(worker);
            pushToast("Update available — refresh to get the latest JaiOS");
          }
        });
      });
    });
  }, [pushToast]);

  function applyUpdate() {
    if (!waiting) return;
    refreshing.current = true;
    waiting.postMessage({ type: "SKIP_WAITING" });
  }

  if (!waiting) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-[115] flex justify-center px-4 sm:bottom-24">
      <div className="glass-strong flex items-center gap-3 rounded-full border border-line px-4 py-2 shadow-card">
        <span className="text-sm text-ink">A new version of JaiOS is ready.</span>
        <button
          type="button"
          onClick={applyUpdate}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-medium text-bg"
        >
          <RefreshCw className="h-3 w-3" /> Refresh
        </button>
      </div>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "jaios-install-dismissed";

function InstallPrompt() {
  const tryUnlock = useOSStore((s) => s.tryUnlock);
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }

    const onBip = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBip);

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (standalone) tryUnlock("installed");
    if (isIos && !standalone) setIosHint(true);

    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, [tryUnlock]);

  function dismiss() {
    setDismissed(true);
    setEvent(null);
    setIosHint(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* private mode */
    }
  }

  async function install() {
    if (!event) return;
    await event.prompt();
    const choice = await event.userChoice;
    if (choice.outcome === "accepted") tryUnlock("installed");
    dismiss();
  }

  if (dismissed || (!event && !iosHint)) return null;

  return (
    <div className="fixed inset-x-0 bottom-32 z-[115] flex justify-center px-4 sm:bottom-36">
      <div className="glass-strong flex max-w-md items-start gap-3 rounded-2xl border border-line p-4 shadow-card">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Install JaiOS</p>
          <p className="mt-1 text-xs text-muted">
            {iosHint
              ? "Tap Share, then “Add to Home Screen” for an app-like experience — works offline too."
              : "Add this portfolio to your home screen for quick access and offline use."}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {event && (
            <button
              type="button"
              onClick={install}
              className="rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-bg"
            >
              Install
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss install prompt"
            className="grid h-7 w-7 place-items-center rounded-full text-faint hover:bg-ink/5 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
