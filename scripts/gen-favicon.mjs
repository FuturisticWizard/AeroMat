import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "public/logo/aeromat_logos/aeromatka.png");

const srcMeta = await sharp(src).metadata();
const side = Math.min(srcMeta.width, srcMeta.height);

const squared = sharp(src).extract({
  left: Math.round((srcMeta.width - side) / 2),
  top: Math.round((srcMeta.height - side) / 2),
  width: side,
  height: side,
});

// PNG targets (Next.js app/ convention)
const pngTargets = [
  { out: "app/icon.png", size: 512 },
  { out: "app/apple-icon.png", size: 180 },
];

for (const t of pngTargets) {
  await squared
    .clone()
    .resize(t.size, t.size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .png()
    .toFile(join(root, t.out));
  console.log(`wrote ${t.out} (${t.size}x${t.size})`);
}

// ICO target — multi-size PNG-in-ICO (supported Vista+)
// Format reference: https://en.wikipedia.org/wiki/ICO_(file_format)
const icoSizes = [16, 32, 48, 64];
const pngBuffers = await Promise.all(
  icoSizes.map((size) =>
    squared
      .clone()
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .ensureAlpha()
      .png({ compressionLevel: 9, force: true })
      .toBuffer(),
  ),
);

const ICONDIR_SIZE = 6;
const ICONDIRENTRY_SIZE = 16;
const headerSize = ICONDIR_SIZE + icoSizes.length * ICONDIRENTRY_SIZE;

const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0);                 // reserved
header.writeUInt16LE(1, 2);                 // type = 1 (icon)
header.writeUInt16LE(icoSizes.length, 4);   // image count

let offset = headerSize;
for (let i = 0; i < icoSizes.length; i++) {
  const size = icoSizes[i];
  const buf = pngBuffers[i];
  const entryOffset = ICONDIR_SIZE + i * ICONDIRENTRY_SIZE;

  header.writeUInt8(size === 256 ? 0 : size, entryOffset);     // width (0 = 256)
  header.writeUInt8(size === 256 ? 0 : size, entryOffset + 1); // height
  header.writeUInt8(0, entryOffset + 2);                       // color palette
  header.writeUInt8(0, entryOffset + 3);                       // reserved
  header.writeUInt16LE(1, entryOffset + 4);                    // color planes
  header.writeUInt16LE(32, entryOffset + 6);                   // bits per pixel
  header.writeUInt32LE(buf.length, entryOffset + 8);           // size of image data
  header.writeUInt32LE(offset, entryOffset + 12);              // offset to image data
  offset += buf.length;
}

const ico = Buffer.concat([header, ...pngBuffers]);
await writeFile(join(root, "app/favicon.ico"), ico);
console.log(`wrote app/favicon.ico (${icoSizes.join(", ")}px, ${ico.length} bytes)`);
