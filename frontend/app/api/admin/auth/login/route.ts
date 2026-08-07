import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, getBackendUrl, SESSION_TTL_SECONDS } from "@/lib/admin-auth";

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ detail: "Invalid request body" }, { status: 400 });
  }

  const username = body.username?.trim();
  const password = body.password ?? "";
  if (!username || !password) {
    return NextResponse.json({ detail: "Username and password are required" }, { status: 400 });
  }

  const backend = getBackendUrl();
  const res = await fetch(`${backend}/api/v1/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({ detail: "Login failed" }))) as {
      detail?: string;
    };
    return NextResponse.json(
      { detail: data.detail ?? "Login failed" },
      { status: res.status },
    );
  }

  const { token, expires_in } = (await res.json()) as { token: string; expires_in: number };
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: expires_in ?? SESSION_TTL_SECONDS,
    path: "/",
  });
  return response;
}
