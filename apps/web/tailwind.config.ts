import type { Config } from "tailwindcss";
import { jaiosPreset } from "@jaios/tailwind-config";

const config: Config = {
  presets: [jaiosPreset],
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "../../packages/ui/**/*.{ts,tsx}",
    "../../packages/shell/**/*.{ts,tsx}",
    "../../packages/apps/**/*.{ts,tsx}",
  ],
};

export default config;
