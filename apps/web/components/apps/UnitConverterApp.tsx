"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/** Each unit stores its size relative to a base unit (metre, gram, etc.). */
interface Category {
  id: string;
  label: string;
  units: { id: string; label: string; factor: number }[];
}

const CATEGORIES: Category[] = [
  {
    id: "length",
    label: "Length",
    units: [
      { id: "mm", label: "Millimetre", factor: 0.001 },
      { id: "cm", label: "Centimetre", factor: 0.01 },
      { id: "m", label: "Metre", factor: 1 },
      { id: "km", label: "Kilometre", factor: 1000 },
      { id: "in", label: "Inch", factor: 0.0254 },
      { id: "ft", label: "Foot", factor: 0.3048 },
      { id: "mi", label: "Mile", factor: 1609.344 },
    ],
  },
  {
    id: "weight",
    label: "Weight",
    units: [
      { id: "g", label: "Gram", factor: 1 },
      { id: "kg", label: "Kilogram", factor: 1000 },
      { id: "oz", label: "Ounce", factor: 28.3495 },
      { id: "lb", label: "Pound", factor: 453.592 },
    ],
  },
  {
    id: "temp",
    label: "Temperature",
    units: [
      { id: "c", label: "Celsius", factor: 1 },
      { id: "f", label: "Fahrenheit", factor: 1 },
      { id: "k", label: "Kelvin", factor: 1 },
    ],
  },
];

function toCelsius(v: number, unit: string): number {
  if (unit === "f") return (v - 32) * (5 / 9);
  if (unit === "k") return v - 273.15;
  return v;
}
function fromCelsius(c: number, unit: string): number {
  if (unit === "f") return c * (9 / 5) + 32;
  if (unit === "k") return c + 273.15;
  return c;
}

function convert(value: number, from: string, to: string, cat: Category): number {
  if (cat.id === "temp") return fromCelsius(toCelsius(value, from), to);
  const f = cat.units.find((u) => u.id === from)!.factor;
  const t = cat.units.find((u) => u.id === to)!.factor;
  return (value * f) / t;
}

function round(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return Number(n.toPrecision(8)).toLocaleString(undefined, { maximumFractionDigits: 6 });
}

export function UnitConverterApp() {
  const [catId, setCatId] = useState("length");
  const cat = CATEGORIES.find((c) => c.id === catId)!;
  const [from, setFrom] = useState(cat.units[2]?.id ?? cat.units[0].id);
  const [to, setTo] = useState(cat.units[0].id);
  const [value, setValue] = useState("1");

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (Number.isNaN(v)) return "—";
    return round(convert(v, from, to, cat));
  }, [value, from, to, cat]);

  function pickCategory(id: string) {
    const next = CATEGORIES.find((c) => c.id === id)!;
    setCatId(id);
    setFrom(next.units[next.id === "length" ? 2 : 0].id);
    setTo(next.units[1].id);
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-line px-3 py-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => pickCategory(c.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              catId === c.id ? "bg-ink/5 text-ink" : "text-muted hover:text-ink",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4 p-6">
        <Field label="From">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-lg tabular-nums text-ink focus:border-line-strong focus:outline-none"
          />
          <UnitSelect units={cat.units} value={from} onChange={setFrom} />
        </Field>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={swap}
            aria-label="Swap units"
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-muted transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <ArrowRightLeft className="h-4 w-4 rotate-90" />
          </button>
        </div>

        <Field label="To">
          <div className="grid h-11 w-full items-center rounded-xl border border-line bg-surface-2 px-3.5 text-lg font-semibold tabular-nums text-ink">
            {result}
          </div>
          <UnitSelect units={cat.units} value={to} onChange={setTo} />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">{label}</p>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function UnitSelect({
  units,
  value,
  onChange,
}: {
  units: Category["units"];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-36 shrink-0 rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:border-line-strong focus:outline-none"
    >
      {units.map((u) => (
        <option key={u.id} value={u.id}>
          {u.label}
        </option>
      ))}
    </select>
  );
}
