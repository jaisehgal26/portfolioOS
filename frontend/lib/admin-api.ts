export interface GuestbookAdminItem {
  id: string;
  created_at: string;
  status: string;
  name: string | null;
  email: string | null;
  message: string;
  is_anonymous: boolean;
}

export interface GuestbookAdminListResponse {
  items: GuestbookAdminItem[];
}

export interface ContactAdminItem {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
}

export interface ContactAdminListResponse {
  items: ContactAdminItem[];
  total: number;
  limit: number;
  offset: number;
}

class AdminApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { detail?: string };
    if (typeof data.detail === "string") return data.detail;
  } catch {
    // use default
  }
  return "Something went wrong. Please try again.";
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/admin/${path}`, {
    ...init,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new AdminApiError(await parseError(res), res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function adminLogin(username: string, password: string): Promise<void> {
  const res = await fetch("/api/admin/auth/login", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    throw new AdminApiError(await parseError(res), res.status);
  }
}

export async function adminLogout(): Promise<void> {
  await fetch("/api/admin/auth/logout", { method: "POST", credentials: "same-origin" });
}

export async function getGuestbookAdmin(status: string): Promise<GuestbookAdminListResponse> {
  return adminFetch<GuestbookAdminListResponse>(`guestbook?status=${encodeURIComponent(status)}`);
}

export async function updateGuestbookStatus(
  entryId: string,
  status: "approved" | "rejected",
): Promise<GuestbookAdminItem> {
  return adminFetch<GuestbookAdminItem>(`guestbook/${entryId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getContactSubmissions(
  limit = 50,
  offset = 0,
): Promise<ContactAdminListResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  return adminFetch<ContactAdminListResponse>(`contact?${params}`);
}

export { AdminApiError };
