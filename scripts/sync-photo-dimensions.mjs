#!/usr/bin/env node
// Reads actual dimensions of referenced webp files and rewrites width/height
// entries in app/lib/photos.tsx if they diverge from disk.

import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "/mnt/d/Builds/AeroMat1.0/AeroMat";
const PHOTOS_PATH = join(ROOT, "app/lib/photos.tsx");
const PUBLIC_DIR = join(ROOT, "public");

const source = readFileSync(PHOTOS_PATH, "utf8");
const lines = source.split("\n");
const entryRe = /src: "([^"]+\.webp)".*?width: (\d+), height: (\d+)/;

let updated = 0;
const newLines = [];

for (const line of lines) {
  const match = line.match(entryRe);
  if (!match) {
    newLines.push(line);
    continue;
  }
  const [, src, wStr, hStr] = match;
  const absPath = join(PUBLIC_DIR, src);
  try {
    const meta = await sharp(absPath).metadata();
    const oldW = parseInt(wStr, 10);
    const oldH = parseInt(hStr, 10);
    if (meta.width === oldW && meta.height === oldH) {
      newLines.push(line);
      continue;
    }
    const patched = line
      .replace(`width: ${oldW}`, `width: ${meta.width}`)
      .replace(`height: ${oldH}`, `height: ${meta.height}`);
    newLines.push(patched);
    console.log(`${src}: ${oldW}x${oldH} -> ${meta.width}x${meta.height}`);
    updated++;
  } catch (err) {
    console.warn(`SKIP (missing): ${src}`);
    newLines.push(line);
  }
}

if (updated > 0) {
  writeFileSync(PHOTOS_PATH, newLines.join("\n"));
  console.log(`\nUpdated ${updated} entries in photos.tsx`);
} else {
  console.log("\nNo changes needed.");
}
