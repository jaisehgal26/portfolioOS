/**
 * The JaiOS brand mark — a monochrome "tile" with a negative-space aperture:
 * concentric rounded diamonds around a pinhole core, like a system lens. No
 * literal initial. Uses `currentColor`, so it adapts to the surrounding ink.
 * Mirrored in app/icon.svg (favicon) and app/apple-icon.svg.
 */
export function JaiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <mask id="jai-logo" maskUnits="userSpaceOnUse" x="4" y="4" width="40" height="40">
        <rect x="4" y="4" width="40" height="40" rx="12" fill="#fff" />
        <rect x="12" y="12" width="24" height="24" rx="6" transform="rotate(45 24 24)" fill="#000" />
        <rect x="18" y="18" width="12" height="12" rx="3.5" transform="rotate(45 24 24)" fill="#fff" />
        <circle cx="24" cy="24" r="2.6" fill="#000" />
      </mask>
      <rect x="4" y="4" width="40" height="40" rx="12" fill="currentColor" mask="url(#jai-logo)" />
    </svg>
  );
}
