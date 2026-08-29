"use client";

import { useEffect, useRef } from "react";
import { useOSStore } from "@/store/os-store";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

/** Classic ↑↑↓↓←→←→BA — unlocks classified folder + achievement. */
export function useKonamiCode() {
  const idxRef = useRef(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[idxRef.current]) {
        idxRef.current += 1;
        if (idxRef.current === KONAMI.length) {
          idxRef.current = 0;
          const st = useOSStore.getState();
          st.unlockClassified();
          st.tryUnlock("konami-code");
          st.pushToast("🎮 Konami code accepted — classified folder unlocked.");
        }
        return;
      }
      idxRef.current = key === KONAMI[0] ? 1 : 0;
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
