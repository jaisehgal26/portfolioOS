/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@jaios/content", "@jaios/kernel", "@jaios/ui", "@jaios/apps", "@jaios/shell"],
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

export default nextConfig;
