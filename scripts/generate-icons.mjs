import { mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svgPath = join(root, "app", "icon.svg");
const outDir = join(root, "public", "icons");

const svg = await readFile(svgPath);

await mkdir(outDir, { recursive: true });

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "icon-maskable-192.png", size: 192, padding: 0.15 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size, padding = 0 } of sizes) {
  const inner = Math.round(size * (1 - padding * 2));
  const offset = Math.round((size - inner) / 2);
  let img = sharp(svg).resize(inner, inner).png();
  if (padding > 0) {
    img = sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 250, g: 247, b: 242, alpha: 1 },
      },
    })
      .composite([{ input: await img.toBuffer(), left: offset, top: offset }])
      .png();
  }
  await img.toFile(join(outDir, name));
  console.log(`Wrote ${name}`);
}
