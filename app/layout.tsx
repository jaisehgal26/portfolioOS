import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site } from "@/data/profile";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Jai Sehgal — Frontend Developer Portfolio",
  description:
    "Interactive OS-style portfolio of Jai Sehgal, a Frontend Developer specializing in Next.js, React, TypeScript, real-time UI, dashboards, and scalable product interfaces.",
  keywords: [
    "Jai Sehgal",
    "Frontend Developer",
    "Next.js",
    "React",
    "TypeScript",
    "real-time UI",
    "dashboards",
    "JaiOS",
    "portfolio",
  ],
  authors: [{ name: site.name, url: site.url }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title: "Jai Sehgal — Frontend Developer Portfolio",
    description:
      "JaiOS — an interactive operating-system portfolio. Frontend craft, packaged as an OS.",
    siteName: "JaiOS Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jai Sehgal — Frontend Developer Portfolio",
    description: "JaiOS — frontend craft, packaged as an operating system.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#171411" },
  ],
};

const themeScript = `(function(){try{var p=JSON.parse(localStorage.getItem('jaios-prefs')||'{}');var dark=p.theme==='dark';if(dark)document.documentElement.classList.add('dark');var A={terracotta:['226 106 78','240 132 102'],blue:['79 110 247','126 150 250'],violet:['138 122 240','162 148 246'],mint:['47 175 137','80 198 162']};var a=A[p.accent]||A.terracotta;document.documentElement.style.setProperty('--accent',dark?a[1]:a[0]);if(p.reducedMotionPref)document.documentElement.classList.add('rm-off');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
