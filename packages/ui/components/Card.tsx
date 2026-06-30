import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Add a hover lift + shadow transition (for interactive cards). */
  interactive?: boolean;
}

/** The standard rounded, soft-shadowed surface used across the site. */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, interactive, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "card",
        interactive &&
          "transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-line-strong hover:shadow-card",
        className,
      )}
      {...props}
    />
  );
});
