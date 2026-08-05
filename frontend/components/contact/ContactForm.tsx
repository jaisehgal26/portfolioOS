"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { submitContact } from "@/lib/api";
import { useOSStore } from "@/store/os-store";
import { cn } from "@/lib/utils";

type FormState = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-faint focus:border-line-strong focus:outline-none focus:ring-1 focus:ring-line-strong";

export function ContactForm() {
  const pushToast = useOSStore((s) => s.pushToast);
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in name, email, and message.");
      setState("error");
      return;
    }

    setState("submitting");

    try {
      await submitContact({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        subject: subject.trim() || undefined,
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setState("success");
      pushToast("Message sent — I'll get back to you soon.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
      setState("error");
      pushToast(msg);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <h2 className="text-sm font-medium uppercase tracking-wider text-faint">Send a message</h2>
        <div className="mt-3 rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5">
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
            >
              {error}
            </div>
          )}

          {state === "success" && !error && (
            <p className="mb-4 text-sm text-muted">Thanks for reaching out — your message was sent.</p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-1">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-faint">Name</span>
              <input
                type="text"
                name="name"
                required
                maxLength={255}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (state === "success") setState("idle");
                }}
                className={inputClass}
                placeholder="Your name"
                disabled={state === "submitting"}
              />
            </label>
            <label className="block sm:col-span-1">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-faint">Email</span>
              <input
                type="email"
                name="email"
                required
                maxLength={320}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "success") setState("idle");
                }}
                className={inputClass}
                placeholder="you@example.com"
                disabled={state === "submitting"}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-faint">
                Subject <span className="normal-case text-faint">(optional)</span>
              </span>
              <input
                type="text"
                name="subject"
                maxLength={255}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={inputClass}
                placeholder="What's this about?"
                disabled={state === "submitting"}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-faint">Message</span>
              <textarea
                name="message"
                required
                maxLength={5000}
                rows={4}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (state === "success") setState("idle");
                }}
                className={cn(inputClass, "resize-y min-h-[100px]")}
                placeholder="Tell me about your project…"
                disabled={state === "submitting"}
              />
            </label>
          </div>

          <div className="mt-4 flex justify-end">
            <Button type="submit" variant="primary" disabled={state === "submitting"}>
              {state === "submitting" ? "Sending…" : "Send message"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
