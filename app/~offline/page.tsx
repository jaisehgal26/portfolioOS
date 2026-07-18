import Link from "next/link";

export const metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center text-ink">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-faint">JaiOS</p>
      <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight">You&apos;re offline</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        No network right now. If you&apos;ve visited before, the full OS is still cached on this device.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
      >
        Open JaiOS
      </Link>
    </main>
  );
}
