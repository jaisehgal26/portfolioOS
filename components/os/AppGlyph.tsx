import type { AppId } from "@/data/apps";

/**
 * Hand-drawn, multi-color SVG app icons — each a distinct illustration
 * (folder, envelope, globe, flask…) rather than a flat glyph-on-a-box.
 * Transparent background; depth comes from gradients + a CSS drop shadow
 * applied by <AppIcon />.
 */
export function AppGlyph({ id, className }: { id: AppId; className?: string }) {
  const common = { viewBox: "0 0 48 48", className, fill: "none" as const };

  switch (id) {
    case "quick-hire":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="qh-a" x1="12" y1="5" x2="34" y2="43" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFB867" />
              <stop offset="1" stopColor="#F0612F" />
            </linearGradient>
          </defs>
          <path
            d="M27.4 4.6 11.7 27.4c-.8 1.1 0 2.6 1.4 2.6H21l-1.9 12.3c-.3 1.7 1.9 2.6 2.9 1.2L36.3 20c.8-1.1 0-2.6-1.4-2.6h-7.6l2.1-11.4c.3-1.7-1.9-2.5-3-1.4Z"
            fill="url(#qh-a)"
          />
          <path
            d="M27.4 4.6 11.7 27.4c-.8 1.1 0 2.6 1.4 2.6H21"
            stroke="#fff"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="38.5" cy="9" r="2" fill="#FFD9AE" />
          <circle cx="9" cy="37" r="1.6" fill="#FFC894" />
        </svg>
      );

    case "about":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="ab-a" x1="11" y1="9" x2="37" y2="43" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8FA6FF" />
              <stop offset="1" stopColor="#6C63E8" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="17" r="7.6" fill="url(#ab-a)" />
          <path
            d="M11 41.2C11 32.3 17.9 27 24 27s13 5.3 13 14.2c0 1-.8 1.8-1.8 1.8H12.8c-1 0-1.8-.8-1.8-1.8Z"
            fill="url(#ab-a)"
          />
          <ellipse cx="20.8" cy="14.4" rx="2.5" ry="3" fill="#fff" fillOpacity="0.4" />
        </svg>
      );

    case "resume":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="rs-a" x1="13" y1="5" x2="35" y2="43" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#E9F0FB" />
            </linearGradient>
            <linearGradient id="rs-b" x1="17" y1="15" x2="31" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5CA8FF" />
              <stop offset="1" stopColor="#3D74E6" />
            </linearGradient>
          </defs>
          <path
            d="M13 7c0-1.1.9-2 2-2h13.5L35 11.5V41c0 1.1-.9 2-2 2H15c-1.1 0-2-.9-2-2Z"
            fill="url(#rs-a)"
            stroke="#CAD7EC"
            strokeWidth="1"
          />
          <path d="M28.5 5v4.5c0 1.1.9 2 2 2H35Z" fill="#CAD7EC" />
          <rect x="17" y="15" width="14" height="5" rx="1.6" fill="url(#rs-b)" />
          <rect x="17" y="24" width="14" height="2.4" rx="1.2" fill="#C4CFE1" />
          <rect x="17" y="29" width="14" height="2.4" rx="1.2" fill="#C4CFE1" />
          <rect x="17" y="34" width="9" height="2.4" rx="1.2" fill="#C4CFE1" />
        </svg>
      );

    case "projects":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="pj-a" x1="14" y1="10" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A99BFF" />
              <stop offset="1" stopColor="#7A5BE0" />
            </linearGradient>
          </defs>
          <rect x="9" y="15" width="22" height="25" rx="4.5" fill="#C7BCFF" />
          <rect x="15" y="10" width="24" height="27" rx="4.5" fill="url(#pj-a)" />
          <rect x="19" y="16" width="16" height="2.8" rx="1.4" fill="#fff" fillOpacity="0.9" />
          <rect x="19" y="21.5" width="16" height="2.8" rx="1.4" fill="#fff" fillOpacity="0.6" />
          <rect x="19" y="27" width="10" height="2.8" rx="1.4" fill="#fff" fillOpacity="0.9" />
        </svg>
      );

    case "case-studies":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="cs-a" x1="9" y1="9" x2="39" y2="39" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F8C45E" />
              <stop offset="1" stopColor="#EE9038" />
            </linearGradient>
          </defs>
          <path d="M24 12.5c-4-3-10-3.2-15-1.2v26c5-2 11-1.8 15 1.2Z" fill="url(#cs-a)" />
          <path d="M24 12.5c4-3 10-3.2 15-1.2v26c-5-2-11-1.8-15 1.2Z" fill="url(#cs-a)" />
          <rect x="23" y="12.5" width="2" height="26" rx="1" fill="#D97A2E" />
          <path d="M12 17c3-1 6.5-.8 9 .6M12 22c3-1 6.5-.8 9 .6M27 17.6c2.5-1.4 6-1.6 9-.6M27 22.6c2.5-1.4 6-1.6 9-.6" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case "skills":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="sk-a" x1="9" y1="9" x2="39" y2="39" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5BE0C0" />
              <stop offset="1" stopColor="#22A98C" />
            </linearGradient>
          </defs>
          <rect x="8.5" y="8.5" width="14" height="14" rx="3.6" fill="url(#sk-a)" />
          <rect x="25.5" y="8.5" width="14" height="14" rx="3.6" fill="#86E8D2" />
          <rect x="8.5" y="25.5" width="14" height="14" rx="3.6" fill="#86E8D2" />
          <rect x="25.5" y="25.5" width="14" height="14" rx="3.6" fill="url(#sk-a)" />
        </svg>
      );

    case "experience":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="ex-a" x1="9" y1="14" x2="39" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8094F2" />
              <stop offset="1" stopColor="#4452D0" />
            </linearGradient>
          </defs>
          <path d="M19 14v-2a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2" stroke="#5566D8" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="8.5" y="14" width="31" height="24" rx="5" fill="url(#ex-a)" />
          <rect x="8.5" y="23.5" width="31" height="2.6" fill="#3C49B8" fillOpacity="0.5" />
          <rect x="20.5" y="22.5" width="7" height="5" rx="1.6" fill="#fff" fillOpacity="0.85" />
        </svg>
      );

    case "contact":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="ct-a" x1="8" y1="12" x2="40" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9CA8" />
              <stop offset="1" stopColor="#F05674" />
            </linearGradient>
          </defs>
          <rect x="8" y="12" width="32" height="24" rx="5" fill="url(#ct-a)" />
          <path d="M9.5 15 24 26l14.5-11" stroke="#fff" strokeOpacity="0.9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "finder":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="fn-a" x1="8" y1="19" x2="40" y2="37" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBD06B" />
              <stop offset="1" stopColor="#F2A93C" />
            </linearGradient>
          </defs>
          <path d="M8 14c0-1.7 1.3-3 3-3h7.5l3.5 3.5H37c1.7 0 3 1.3 3 3V34c0 1.7-1.3 3-3 3H11c-1.7 0-3-1.3-3-3Z" fill="#E89A2E" />
          <path d="M8 19h32v15c0 1.7-1.3 3-3 3H11c-1.7 0-3-1.3-3-3Z" fill="url(#fn-a)" />
          <rect x="8" y="19" width="32" height="2.4" fill="#fff" fillOpacity="0.35" />
        </svg>
      );

    case "browser":
      return (
        <svg {...common}>
          <defs>
            <radialGradient id="bw-a" cx="0.4" cy="0.32" r="0.85">
              <stop stopColor="#7DD8F0" />
              <stop offset="1" stopColor="#3E9BE0" />
            </radialGradient>
          </defs>
          <circle cx="24" cy="24" r="16" fill="url(#bw-a)" />
          <ellipse cx="24" cy="24" rx="6.6" ry="16" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.5" />
          <path d="M8 24h32M10.5 16.5c8 2.5 19 2.5 27 0M10.5 31.5c8-2.5 19-2.5 27 0" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="18" cy="17" rx="4.5" ry="3" fill="#fff" fillOpacity="0.25" />
        </svg>
      );

    case "notes":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="nt-a" x1="11" y1="9" x2="37" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#92E0A4" />
              <stop offset="1" stopColor="#46B86E" />
            </linearGradient>
          </defs>
          <rect x="11" y="9" width="26" height="33" rx="5" fill="url(#nt-a)" />
          <rect x="11" y="9" width="26" height="6.5" rx="5" fill="#3FA862" />
          <rect x="16" y="21" width="16" height="2.6" rx="1.3" fill="#fff" fillOpacity="0.95" />
          <rect x="16" y="27" width="16" height="2.6" rx="1.3" fill="#fff" fillOpacity="0.8" />
          <rect x="16" y="33" width="10" height="2.6" rx="1.3" fill="#fff" fillOpacity="0.95" />
          <circle cx="18" cy="12.2" r="1.3" fill="#fff" fillOpacity="0.9" />
          <circle cx="24" cy="12.2" r="1.3" fill="#fff" fillOpacity="0.9" />
          <circle cx="30" cy="12.2" r="1.3" fill="#fff" fillOpacity="0.9" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="st-a" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C6CDDA" />
              <stop offset="1" stopColor="#6E7888" />
            </linearGradient>
          </defs>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <rect key={a} x="21" y="5.5" width="6" height="9" rx="2.5" fill="url(#st-a)" transform={`rotate(${a} 24 24)`} />
          ))}
          <circle cx="24" cy="24" r="12.5" fill="url(#st-a)" />
          <circle cx="24" cy="24" r="5.4" fill="#EEF1F6" />
        </svg>
      );

    case "ui-gallery":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="ug-a" x1="8" y1="11" x2="40" y2="39" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B07CEC" />
              <stop offset="1" stopColor="#E06BC0" />
            </linearGradient>
          </defs>
          <ellipse cx="24" cy="25" rx="16" ry="14" fill="url(#ug-a)" />
          <circle cx="29.5" cy="29.5" r="3.6" fill="#fff" fillOpacity="0.9" />
          <circle cx="17" cy="18.5" r="2.6" fill="#FF6B6B" />
          <circle cx="24" cy="16" r="2.6" fill="#FFD166" />
          <circle cx="31" cy="18.5" r="2.6" fill="#4ECDC4" />
          <circle cx="15" cy="26" r="2.6" fill="#5B8DEF" />
        </svg>
      );

    case "system-monitor":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="sm-a" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5FCFC8" />
              <stop offset="1" stopColor="#2E9BB0" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="16" fill="url(#sm-a)" />
          <path d="M10.5 25h6l3-7 4.5 13 3-7h10" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="18" cy="16" rx="4.5" ry="3" fill="#fff" fillOpacity="0.2" />
        </svg>
      );

    case "experiments":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="xp-a" x1="12" y1="30" x2="36" y2="41" gradientUnits="userSpaceOnUse">
              <stop stopColor="#B083F0" />
              <stop offset="1" stopColor="#C44FB0" />
            </linearGradient>
          </defs>
          <path
            d="M21 7.5h6V18l8.5 16c1.3 3-.8 6.5-4.1 6.5H16.6c-3.3 0-5.4-3.5-4.1-6.5L21 18Z"
            fill="#fff"
            fillOpacity="0.16"
            stroke="#9B6BE8"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M15.2 30h17.6l2.7 4c1.3 3-.8 6.5-4.1 6.5H16.6c-3.3 0-5.4-3.5-4.1-6.5Z" fill="url(#xp-a)" />
          <rect x="19.5" y="6" width="9" height="3" rx="1.5" fill="#9B6BE8" />
          <circle cx="22" cy="35" r="1.5" fill="#fff" fillOpacity="0.7" />
          <circle cx="27.5" cy="37" r="1.1" fill="#fff" fillOpacity="0.6" />
        </svg>
      );
  }
}
