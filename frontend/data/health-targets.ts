/** Public service URLs — keep in sync with backend/app/constants.py HEALTH_TARGETS */
export const HEALTH_PROBE_TARGETS: { target_key: string; url: string }[] = [
  { target_key: "jaios", url: "https://jaisehgal.com" },
  { target_key: "quickpad", url: "https://quickpad.jaisehgal.com" },
  { target_key: "formforge", url: "https://formforge.jaisehgal.com" },
];
