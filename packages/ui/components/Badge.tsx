import { cn } from "../lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

/** Neutral pill chip for tech tags and small labels. */
export function Badge({ children, className, icon }: BadgeProps) {
  return (
    <span className={cn("chip", className)}>
      {icon}
      {children}
    </span>
  );
}
