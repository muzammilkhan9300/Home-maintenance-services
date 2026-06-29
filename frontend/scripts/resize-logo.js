/**
 * Resizes the Afnan logo to 400x400px for use in the navbar (displayed at 56x56px).
 * Original: 4.6MB — target: <150KB
 * Run: node scripts/resize-logo.js
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, "../src/assets/afnan-logo.png");
const dest = path.resolve(__dirname, "../src/assets/afnan-logo.png");

sharp(src)
  .resize(400, 400, { fit: "inside", withoutEnlargement: true })
  .png({ quality: 85, compressionLevel: 9 })
  .toFile(dest + ".tmp.png")
  .then((info) => {
    const fs = await import("fs");
    fs.renameSync(dest + ".tmp.png", dest);
    console.log(`✅ Logo resized: ${(info.size / 1024).toFixed(1)} KB`);
  })
  .catch(console.error);
