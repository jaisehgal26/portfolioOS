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

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function submitContact(body: ContactPayload): Promise<ContactResponse> {
  const res = await fetch(`${BASE}/api/v1/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
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
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<ContactResponse>;
}
