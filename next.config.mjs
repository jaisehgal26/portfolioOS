import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import withSerwistInit from "@serwist/next";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() || randomUUID();

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
  globPublicPatterns: ["**/*.{pdf,svg,png,ico,webp}"],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  webpack: (config, { dev }) => {
    // This project lives inside OneDrive, which syncs/locks webpack's on-disk
    // cache pack files mid-write and corrupts them ("invalid block type"
    // restore warnings). Use an in-memory cache in dev to avoid it entirely.
    if (dev) config.cache = { type: "memory" };
    return config;
  },
};

export default withSerwist(nextConfig);
