export const ADMIN_SESSION_COOKIE = "admin_session";
export const SESSION_TTL_SECONDS = 7 * 24 * 3600;

export function getBackendUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  // Same-origin on Vercel — FastAPI is served via /api/v1 rewrite on this deployment.
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
    return `https://${host}`;
  }
  return "http://localhost:8000";
}
