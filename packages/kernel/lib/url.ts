/** URL helpers shared by the OS Browser app and the JaiBrowser shell. Pure, no React. */

/** Add a protocol if missing so a bare domain becomes a navigable URL. */
export function normalizeUrl(input: string): string {
  const u = input.trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

/** Hostname of a URL, or the raw string if it can't be parsed. */
export function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/** Google favicon service URL for a given site. */
export function favicon(url: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostOf(url))}&sz=64`;
}
