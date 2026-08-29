import { probeHealthTargets } from "@/lib/health-probe";

export async function GET() {
  const services = await probeHealthTargets();
  return Response.json(
    { services },
    { headers: { "Cache-Control": "private, max-age=60" } },
  );
}
