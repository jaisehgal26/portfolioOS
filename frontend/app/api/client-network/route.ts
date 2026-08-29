const CF_TRACE = "https://speed.cloudflare.com/cdn-cgi/trace";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";
}

function parseIsp(org: string | undefined): string | null {
  if (!org) return null;
  const cleaned = org.replace(/^AS\d+\s+/, "").trim();
  return cleaned || org;
}

function parseTrace(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const idx = line.indexOf("=");
    if (idx > 0) out[line.slice(0, idx)] = line.slice(idx + 1).trim();
  }
  return out;
}

async function fetchIpinfo(token?: string) {
  const url = token
    ? `https://api.ipinfo.io/lite/me?token=${encodeURIComponent(token)}`
    : "https://api.ipinfo.io/lite/me";

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    ip?: string;
    org?: string;
    city?: string;
    country?: string;
  };

  return {
    ip: data.ip ?? "unknown",
    isp: parseIsp(data.org),
    city: data.city ?? null,
    country: data.country ?? null,
  };
}

async function fetchCloudflareTrace() {
  const res = await fetch(CF_TRACE, { cache: "no-store" });
  if (!res.ok) return null;
  const fields = parseTrace(await res.text());
  return {
    ip: fields.ip ?? "unknown",
    isp: null as string | null,
    city: null as string | null,
    country: fields.loc ?? null,
  };
}

export async function GET(request: Request) {
  const fallbackIp = clientIp(request);
  const token = process.env.IPINFO_TOKEN;

  try {
    const ipinfo = await fetchIpinfo(token);
    if (ipinfo) {
      return Response.json(
        { ...ipinfo, ip: ipinfo.ip === "unknown" ? fallbackIp : ipinfo.ip },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }
  } catch {
    // fall through
  }

  try {
    const trace = await fetchCloudflareTrace();
    if (trace) {
      return Response.json(
        { ...trace, ip: trace.ip === "unknown" ? fallbackIp : trace.ip },
        { headers: { "Cache-Control": "private, no-store" } },
      );
    }
  } catch {
    // fall through
  }

  return Response.json(
    { ip: fallbackIp, isp: null, city: null, country: null },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
