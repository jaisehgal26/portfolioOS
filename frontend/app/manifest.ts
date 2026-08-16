import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jai Sehgal — Software Engineer",
    short_name: "JaiOS",
    description:
      "Interactive OS-style portfolio of Jai Sehgal — a Software Engineer building full-stack products with Next.js, FastAPI, and PostgreSQL.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#FAF7F2",
    theme_color: "#FAF7F2",
    categories: ["portfolio", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
