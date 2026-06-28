import type { MetadataRoute } from "next";
import { site } from "@/data/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
  ];
}
