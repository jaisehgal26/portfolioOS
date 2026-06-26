import { cn } from "@/lib/utils";

const SIZES = {
  sm: { box: "h-11 w-11", text: "text-base" },
  md: { box: "h-12 w-12", text: "text-lg" },
  lg: { box: "h-20 w-20", text: "text-2xl" },
  xl: { box: "h-24 w-24", text: "text-4xl" },
};

/**
 * Bespoke ink monogram — a flat ink disc with a Fraunces "JS". Replaces the
 * generic gradient-initials avatar; reads as a crafted mark, not a template.
 */
export function Monogram({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full bg-ink text-bg shadow-card ring-1 ring-ink/10",
        "before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/18 before:to-transparent",
        s.box,
        className,
      )}
      aria-hidden
    >
      <span className={cn("relative font-display font-semibold leading-none tracking-[-0.02em]", s.text)}>
        JS
      </span>
    </span>
  );
}
