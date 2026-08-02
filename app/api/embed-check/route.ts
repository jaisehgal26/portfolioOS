import { isAllowedEmbedTarget, isEmbeddableFromHeaders } from "@/lib/embed-check";

const FETCH_TIMEOUT_MS = 8_000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url")?.trim();

  if (!rawUrl || !isAllowedEmbedTarget(rawUrl)) {
    return Response.json({ embeddable: false }, { status: 400 });
  }

  const parentOrigin =
    request.headers.get("origin") ??
    (() => {
      const referer = request.headers.get("referer");
      if (!referer) return null;
      try {
        return new URL(referer).origin;
      } catch {
        return null;
      }
    })() ??
    new URL(request.url).origin;

  try {
    const signal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
    let response = await fetch(rawUrl, {
      method: "HEAD",
      redirect: "follow",
      signal,
      headers: { "User-Agent": "JaiOS-EmbedCheck/1.0" },
    });

    if (response.status === 405 || response.status === 501) {
      response = await fetch(rawUrl, {
        method: "GET",
        redirect: "follow",
        signal,
        headers: {
          "User-Agent": "JaiOS-EmbedCheck/1.0",
          Range: "bytes=0-0",
        },
      });
    }

    const embeddable = isEmbeddableFromHeaders(response.headers, rawUrl, parentOrigin);
    return Response.json(
      { embeddable },
      { headers: { "Cache-Control": "private, max-age=300" } },
    );
  } catch {
    // Network error — let the client try the preview and use the load fallback.
    return Response.json({ embeddable: true });
  }
}
