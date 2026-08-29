import { isAllowedEmbedTarget } from "@/lib/embed-check";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_BYTES = 512_000;

function metaContent(html: string, property: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeEntities(m[1].trim());
  }
  return null;
}

function pageTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1] ? decodeEntities(m[1].trim()) : null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function resolveUrl(base: string, maybeRelative: string | null): string | null {
  if (!maybeRelative) return null;
  try {
    return new URL(maybeRelative, base).href;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url")?.trim();

  if (!rawUrl || !isAllowedEmbedTarget(rawUrl)) {
    return Response.json({ error: "URL not allowed" }, { status: 400 });
  }

  try {
    const response = await fetch(rawUrl, {
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "User-Agent": "JaiOS-OGPreview/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      return Response.json({ error: `Fetch failed (${response.status})` }, { status: 502 });
    }

    const buf = await response.arrayBuffer();
    const slice = buf.byteLength > MAX_BYTES ? buf.slice(0, MAX_BYTES) : buf;
    const html = new TextDecoder("utf-8", { fatal: false }).decode(slice);

    const title =
      metaContent(html, "og:title") ??
      metaContent(html, "twitter:title") ??
      pageTitle(html);
    const description =
      metaContent(html, "og:description") ??
      metaContent(html, "twitter:description") ??
      metaContent(html, "description");
    const image =
      resolveUrl(rawUrl, metaContent(html, "og:image")) ??
      resolveUrl(rawUrl, metaContent(html, "twitter:image"));
    const card = metaContent(html, "twitter:card");

    return Response.json(
      { url: rawUrl, title, description, image, card },
      { headers: { "Cache-Control": "private, max-age=300" } },
    );
  } catch {
    return Response.json({ error: "Could not fetch URL" }, { status: 502 });
  }
}
