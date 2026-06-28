import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jai Sehgal — Frontend Developer",
    short_name: "JaiOS",
    description:
      "Interactive OS-style portfolio of Jai Sehgal — a Frontend Developer building Next.js, React and TypeScript product UIs.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#FAF7F2",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
  };
}
