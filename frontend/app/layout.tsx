import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SerwistRegister } from "@/components/pwa/SerwistRegister";
import "./globals.css";
import { profile, links, site, seo } from "@/data/profile";

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

const TITLE = seo.titleWithPortfolio;
const DESCRIPTION = seo.description;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: TITLE,
    template: `%s — ${site.name}`,
  },
  description: DESCRIPTION,
  applicationName: "JaiOS",
  keywords: [...seo.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "JaiOS — Jai Sehgal",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { email: false, address: false, telephone: false },
  appleWebApp: { capable: true, title: "JaiOS", statusBarStyle: "black-translucent" },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

/** JSON-LD structured data so search engines understand the person + site. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: profile.name,
      url: site.url,
      image: `${site.url}/opengraph-image`,
      jobTitle: profile.role,
      description: DESCRIPTION,
      email: `mailto:${links.email}`,
      address: { "@type": "PostalAddress", addressCountry: "India" },
      alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.school },
      knowsAbout: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Redux",
        "Zustand",
        "WebSockets",
        "Server-Sent Events",
        "Real-time UI",
        "AI product interfaces",
        "Full-stack architecture",
        "PostgreSQL",
        "FastAPI",
      ],
      sameAs: [links.linkedin, links.github],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.title,
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${site.url}/#person` },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <SerwistRegister>{children}</SerwistRegister>
        <Analytics />
      </body>
    </html>
  );
}
