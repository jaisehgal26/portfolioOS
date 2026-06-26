import type { AppMeta } from "@/data/apps";
import { AppGlyph } from "./AppGlyph";
import { cn } from "@/lib/utils";

const SIZES = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

interface AppIconProps {
  app: AppMeta;
  size?: keyof typeof SIZES;
  className?: string;
}

/** Renders an app's illustrated SVG icon (no background tile) with a soft lift. */
export function AppIcon({ app, size = "md", className }: AppIconProps) {
  return (
    <AppGlyph
      id={app.id}
      className={cn(
        "shrink-0 drop-shadow-[0_3px_6px_rgba(20,16,12,0.22)]",
        SIZES[size],
        className,
      )}
    />
  );
}
