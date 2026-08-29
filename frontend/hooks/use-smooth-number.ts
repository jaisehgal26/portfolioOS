import { useEffect, useRef, useState } from "react";

/** Ease a number toward `target` each frame for smooth gauge animation. */
export function useSmoothNumber(target: number, resetKey?: string | number) {
  const [value, setValue] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    current.current = 0;
    setValue(0);
  }, [resetKey]);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const delta = target - current.current;
      if (Math.abs(delta) < 0.05) {
        current.current = target;
      } else {
        current.current += delta * 0.12;
      }
      setValue(current.current);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return value;
}
