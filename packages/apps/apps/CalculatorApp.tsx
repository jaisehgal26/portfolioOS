"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@jaios/ui/utils";

type Op = "+" | "-" | "x" | "÷";

function compute(a: number, b: number, op: Op): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "x":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
  }
}

/** Trim long floats so the display stays readable. */
function format(n: number): string {
  if (!Number.isFinite(n)) return "Error";
  const s = Number(n.toPrecision(12)).toString();
  return s.length > 12 ? n.toExponential(6) : s;
}

export function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [op, setOp] = useState<Op | null>(null);
  const [fresh, setFresh] = useState(true);

  const inputDigit = useCallback((d: string) => {
    setDisplay((cur) => {
      if (fresh) {
        setFresh(false);
        return d;
      }
      if (cur === "0") return d;
      if (cur.replace(/[-.]/g, "").length >= 12) return cur;
      return cur + d;
    });
  }, [fresh]);

  const inputDot = useCallback(() => {
    setDisplay((cur) => {
      if (fresh) {
        setFresh(false);
        return "0.";
      }
      return cur.includes(".") ? cur : cur + ".";
    });
  }, [fresh]);

  const clearAll = useCallback(() => {
    setDisplay("0");
    setStored(null);
    setOp(null);
    setFresh(true);
  }, []);

  const negate = useCallback(() => {
    setDisplay((cur) => (cur === "0" ? cur : cur.startsWith("-") ? cur.slice(1) : "-" + cur));
  }, []);

  const percent = useCallback(() => {
    setDisplay((cur) => format(parseFloat(cur) / 100));
    setFresh(true);
  }, []);

  const applyOp = useCallback((next: Op) => {
    const current = parseFloat(display);
    if (op !== null && !fresh && stored !== null) {
      const result = compute(stored, current, op);
      setStored(result);
      setDisplay(format(result));
    } else {
      setStored(current);
    }
    setOp(next);
    setFresh(true);
  }, [display, op, fresh, stored]);

  const equals = useCallback(() => {
    if (op === null || stored === null) return;
    const result = compute(stored, parseFloat(display), op);
    setDisplay(format(result));
    setStored(null);
    setOp(null);
    setFresh(true);
  }, [op, stored, display]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = e.key;
      if (k >= "0" && k <= "9") inputDigit(k);
      else if (k === ".") inputDot();
      else if (k === "+") applyOp("+");
      else if (k === "-") applyOp("-");
      else if (k === "*") applyOp("x");
      else if (k === "/") {
        e.preventDefault();
        applyOp("÷");
      } else if (k === "Enter" || k === "=") {
        e.preventDefault();
        equals();
      } else if (k === "Escape") clearAll();
      else if (k === "%") percent();
      else if (k === "Backspace")
        setDisplay((cur) => (cur.length <= 1 || (cur.length === 2 && cur.startsWith("-")) ? "0" : cur.slice(0, -1)));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inputDigit, inputDot, applyOp, equals, clearAll, percent]);

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex min-h-[88px] flex-1 flex-col items-end justify-end rounded-2xl border border-line bg-surface-2 px-5 py-4">
        <span className="h-5 text-sm text-faint">
          {stored !== null && op ? `${format(stored)} ${op}` : ""}
        </span>
        <span className="font-display text-4xl font-semibold tabular-nums text-ink sm:text-5xl">
          {display}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Key label="AC" onClick={clearAll} variant="util" />
        <Key label="±" onClick={negate} variant="util" />
        <Key label="%" onClick={percent} variant="util" />
        <Key label="÷" onClick={() => applyOp("÷")} variant="op" active={op === "÷" && fresh} />

        <Key label="7" onClick={() => inputDigit("7")} />
        <Key label="8" onClick={() => inputDigit("8")} />
        <Key label="9" onClick={() => inputDigit("9")} />
        <Key label="x" onClick={() => applyOp("x")} variant="op" active={op === "x" && fresh} />

        <Key label="4" onClick={() => inputDigit("4")} />
        <Key label="5" onClick={() => inputDigit("5")} />
        <Key label="6" onClick={() => inputDigit("6")} />
        <Key label="-" onClick={() => applyOp("-")} variant="op" active={op === "-" && fresh} />

        <Key label="1" onClick={() => inputDigit("1")} />
        <Key label="2" onClick={() => inputDigit("2")} />
        <Key label="3" onClick={() => inputDigit("3")} />
        <Key label="+" onClick={() => applyOp("+")} variant="op" active={op === "+" && fresh} />

        <Key label="0" onClick={() => inputDigit("0")} className="col-span-2" />
        <Key label="." onClick={inputDot} />
        <Key label="=" onClick={equals} variant="accent" />
      </div>
    </div>
  );
}

function Key({
  label,
  onClick,
  variant = "digit",
  active = false,
  className,
}: {
  label: string;
  onClick: () => void;
  variant?: "digit" | "op" | "util" | "accent";
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "grid h-12 select-none place-items-center rounded-xl text-lg font-medium tabular-nums transition-colors active:scale-[0.97]",
        variant === "digit" && "border border-line bg-surface text-ink hover:bg-ink/5",
        variant === "util" && "border border-line bg-surface-2 text-muted hover:bg-ink/5",
        variant === "op" && (active ? "bg-accent text-[#14100c]" : "bg-accent/12 text-accent hover:bg-accent/20"),
        variant === "accent" && "bg-ink text-bg hover:opacity-90",
        className,
      )}
    >
      {label}
    </button>
  );
}
