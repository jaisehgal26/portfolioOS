"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { adminInputClass } from "@/components/admin/admin-styles";
import { JaiLogo } from "@/components/os/JaiLogo";
import { Button } from "@/components/ui/Button";
import { adminLogin, AdminApiError } from "@/lib/admin-api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminLogin(username, password);
      const from = searchParams.get("from");
      router.push(from?.startsWith("/admin") ? from : "/admin/guestbook");
      router.refresh();
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-ink">
          Username
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={adminInputClass}
          placeholder="admin"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
          Password
        </label>
        <div className="flex items-center gap-2 rounded-full border border-line bg-surface/80 px-2 py-1.5 shadow-soft backdrop-blur">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-ink placeholder:text-faint focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            aria-label="Sign in"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-bg transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <Button type="submit" variant="secondary" size="md" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="wallpaper-aurora relative flex min-h-screen items-center justify-center px-4 py-16">
      <div className="noise pointer-events-none fixed inset-0 opacity-[0.35]" aria-hidden />
      <div className="vignette pointer-events-none fixed inset-0" aria-hidden />

      <div className="card relative w-full max-w-md p-8 shadow-lift sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-bg shadow-soft">
            <JaiLogo className="h-8 w-8" />
          </div>
          <p className="eyebrow mb-2">JaiOS</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Admin Center</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to manage guestbook and contact submissions
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center py-8 text-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
