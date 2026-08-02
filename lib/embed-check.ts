/** Parse `frame-ancestors` sources from a Content-Security-Policy header value. */
export function parseFrameAncestors(csp: string | null | undefined): string[] | null {
  if (!csp) return null;
  const match = csp.match(/frame-ancestors\s+([^;]+)/i);
  if (!match) return null;
  return match[1].trim().split(/\s+/).filter(Boolean);
}

/**
 * Whether `parentOrigin` may embed a page at `pageUrl` based on response headers.
 * @param parentOrigin — the app origin doing the embedding (e.g. https://jaisehgal.com)
 */
export function isEmbeddableFromHeaders(
  headers: { get(name: string): string | null },
  pageUrl: string,
  parentOrigin: string,
): boolean {
  const pageOrigin = safeOrigin(pageUrl);
  const embedderOrigin = safeOrigin(parentOrigin);
  if (!pageOrigin || !embedderOrigin) return false;

  const xfo = headers.get("x-frame-options")?.trim().toLowerCase();
  if (xfo === "deny") return false;
  if (xfo === "sameorigin" && pageOrigin !== embedderOrigin) return false;

  const ancestors = parseFrameAncestors(headers.get("content-security-policy"));
  if (ancestors) {
    if (ancestors.includes("'none'")) return false;
    if (ancestors.includes("*")) return true;

    const allowed = ancestors.some((token) => {
      if (token === "'self'") return pageOrigin === embedderOrigin;
      if (token.startsWith("http://") || token.startsWith("https://")) {
        return safeOrigin(token) === embedderOrigin;
      }
      // host-source like *.example.com — allow exact host match
      try {
        const parent = new URL(embedderOrigin);
        return parent.hostname === token || parent.hostname.endsWith(`.${token.replace(/^\./, "")}`);
      } catch {
        return false;
      }
    });

    if (!allowed) return false;
  }

  return true;
}

function safeOrigin(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

/** Block SSRF targets — only public http(s) URLs. */
export function isAllowedEmbedTarget(raw: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return false;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;

  const host = parsed.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".local")) {
    return false;
  }

  // IPv4 private / link-local
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [, a, b] = ipv4.map(Number);
    if (a === 10) return false;
    if (a === 127) return false;
    if (a === 0) return false;
    if (a === 169 && b === 254) return false;
    if (a === 192 && b === 168) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
  }

  return true;
}

/** Client-side fallback when preflight passed but the preview may still be empty. */
export function isIframeLikelyBlocked(iframe: HTMLIFrameElement): boolean {
  try {
    const doc = iframe.contentDocument;
    if (doc) {
      const body = doc.body;
      if (!body) return true;
      const text = body.innerText?.trim() ?? "";
      const hasContent = text.length > 0 || body.children.length > 0;
      return !hasContent;
    }
  } catch {
    // Cross-origin — probe location when the browser exposes about:blank for blocked frames.
  }

  try {
    const href = iframe.contentWindow?.location.href;
    if (!href || href === "about:blank") return true;
    if (href.startsWith("about:")) return true;
  } catch {
    // SecurityError on cross-origin — treat as loaded (preflight already passed).
    return false;
  }

  return false;
}
