export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

export interface ContactResponse {
  id: string;
  created_at: string;
}

export interface ReactionCountItem {
  target_id: string;
  count: number;
}

export interface ReactionsListResponse {
  target_type: string;
  counts: ReactionCountItem[];
}

export interface ReactionResponse {
  target_type: string;
  target_id: string;
  count: number;
  already_reacted: boolean;
}

export interface HealthServiceStatus {
  target_key: string;
  url: string;
  status: string;
  status_code: number | null;
  latency_ms: number | null;
  error_message: string | null;
  checked_at: string;
}

export interface HealthStatusResponse {
  services: HealthServiceStatus[];
}

export interface GuestbookPublicItem {
  id: string;
  created_at: string;
  name: string;
  message: string;
}

export interface GuestbookListResponse {
  items: GuestbookPublicItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface GuestbookSubmitResponse {
  id: string;
  status: string;
  message: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public retryAfter?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function parseError(res: Response): Promise<string> {
  let message = "Something went wrong. Please try again.";
  try {
    const data = (await res.json()) as { detail?: string | { msg: string }[] };
    if (typeof data.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data.detail) && data.detail.length > 0) {
      message = data.detail.map((d) => d.msg).join(", ");
    }
  } catch {
    // use default message
  }
  if (res.status === 429) {
    const retryAfter = res.headers.get("Retry-After");
    const seconds = retryAfter ? parseInt(retryAfter, 10) : undefined;
    const wait = seconds && seconds > 0 ? ` Try again in ${seconds}s.` : "";
    message = `Too many requests.${wait}`;
  }
  return message;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);

  if (!res.ok) {
    const message = await parseError(res);
    const retryAfterHeader = res.headers.get("Retry-After");
    const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : undefined;
    throw new ApiError(message, res.status, retryAfter);
  }

  return res.json() as Promise<T>;
}

export async function submitContact(body: ContactPayload): Promise<ContactResponse> {
  return apiFetch<ContactResponse>("/api/v1/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function getReactions(targetType: string, targetId?: string): Promise<ReactionsListResponse> {
  const params = new URLSearchParams({ target_type: targetType });
  if (targetId) params.set("target_id", targetId);
  return apiFetch<ReactionsListResponse>(`/api/v1/reactions?${params}`);
}

export async function postReaction(targetType: string, targetId: string): Promise<ReactionResponse> {
  return apiFetch<ReactionResponse>("/api/v1/reactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target_type: targetType, target_id: targetId }),
  });
}

export async function getHealthStatus(): Promise<HealthStatusResponse> {
  return apiFetch<HealthStatusResponse>("/api/v1/health/status");
}

export async function getGuestbook(limit = 20, offset = 0): Promise<GuestbookListResponse> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  return apiFetch<GuestbookListResponse>(`/api/v1/guestbook?${params}`);
}

export async function submitGuestbook(body: {
  message: string;
  name?: string;
  email?: string;
  is_anonymous: boolean;
}): Promise<GuestbookSubmitResponse> {
  return apiFetch<GuestbookSubmitResponse>("/api/v1/guestbook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
