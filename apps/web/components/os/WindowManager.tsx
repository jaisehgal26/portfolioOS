"use client";

import { AnimatePresence } from "framer-motion";
import { useOSStore, type OSWindow } from "@jaios/kernel/store";
import { useIsMobile } from "@jaios/kernel/hooks/use-media-query";
import { Window } from "./Window";
import { APP_COMPONENTS } from "./appRegistry";

function AppWindow({ win, isMobile }: { win: OSWindow; isMobile: boolean }) {
  const Component = APP_COMPONENTS[win.id];
  return (
    <Window win={win} isMobile={isMobile}>
      <Component />
    </Window>
  );
}

export function WindowManager() {
  const windows = useOSStore((s) => s.windows);
  const isMobile = useIsMobile();
  const visible = windows.filter((w) => !w.minimized);

  if (isMobile) {
    const top = [...visible].sort((a, b) => b.zIndex - a.zIndex)[0];
    return <AnimatePresence>{top && <AppWindow key={top.id} win={top} isMobile />}</AnimatePresence>;
  }

  return (
    <AnimatePresence>
      {visible.map((w) => (
        <AppWindow key={w.id} win={w} isMobile={false} />
      ))}
    </AnimatePresence>
  );
}
