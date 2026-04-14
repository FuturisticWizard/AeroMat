#!/usr/bin/env node
// Resize WebP files in public/Portfolio/ that exceed MAX_WIDTH.
// Originals backed up to backups/portfolio-resize-<date>/ preserving relative path.

import sharp from "sharp";
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const ROOT = "/mnt/d/Builds/AeroMat1.0/AeroMat";
const PUBLIC_DIR = join(ROOT, "public");
const PORTFOLIO_DIR = join(PUBLIC_DIR, "Portfolio");
const BACKUP_DIR = join(
  ROOT,
  `backups/portfolio-resize-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`,
);
const MAX_WIDTH = 2400;
const QUALITY = 82;
const MIN_SIZE_BYTES = 1024 * 1024;

function collectWebp(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectWebp(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".webp") && statSync(full).size > MIN_SIZE_BYTES) {
      out.push(full);
    }
  }
  return out;
}

const files = collectWebp(PORTFOLIO_DIR);

let processed = 0;
let skipped = 0;
let savedBytes = 0;

for (const file of files) {
  const meta = await sharp(file).metadata();
  if (meta.width <= MAX_WIDTH) {
    skipped++;
    continue;
  }

  const rel = relative(PUBLIC_DIR, file);
  const backupPath = join(BACKUP_DIR, rel);
  mkdirSync(dirname(backupPath), { recursive: true });
  copyFileSync(file, backupPath);

  const sizeBefore = statSync(file).size;

  const buffer = await sharp(file)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();

  await sharp(buffer).toFile(file);

  const sizeAfter = statSync(file).size;
  const after = await sharp(file).metadata();
  savedBytes += sizeBefore - sizeAfter;
  processed++;

  const mbBefore = (sizeBefore / 1024 / 1024).toFixed(2);
  const mbAfter = (sizeAfter / 1024 / 1024).toFixed(2);
  console.log(`${meta.width}x${meta.height} -> ${after.width}x${after.height}  ${mbBefore}MB -> ${mbAfter}MB  ${rel}`);
}

console.log(`\nProcessed: ${processed} | Skipped: ${skipped} | Saved: ${(savedBytes / 1024 / 1024).toFixed(1)} MB`);
console.log(`Backups: ${BACKUP_DIR}`);
