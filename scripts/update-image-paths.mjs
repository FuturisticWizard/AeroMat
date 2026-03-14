/**
 * Aktualizacja ścieżek obrazów z JPG/PNG na WebP w kodzie źródłowym.
 * Wyklucza: /icons/, YouTube URL, pliki ptasie/ (już WebP), logo8.png, logo9.png
 *
 * Użycie: node scripts/update-image-paths.mjs [--dry-run]
 */

import { readdir, readFile, writeFile, stat } from "fs/promises";
import { join, extname } from "path";

const DRY_RUN = process.argv.includes("--dry-run");
const ROOT = ".";

// Katalogi do przeszukania
const SEARCH_DIRS = ["app"];

// Rozszerzenia plików do edycji
const CODE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".css"];

// Pliki które NIE powinny być konwertowane do WebP (większe w WebP lub specjalne)
const EXCLUDE_FILENAMES = ["logo8.png", "logo9.png"];

// Wzorce do zamiany: [regex, replacement]
// Zamieniamy .jpg/.jpeg/.png na .webp TYLKO w ścieżkach do /images/, /Portfolio/, /pngs/, /Collaborations/
const REPLACEMENTS = [
  // /images/*.jpg -> /images/*.webp (ale nie /images/ptasie/ bo już .webp)
  { pattern: /(\/images\/(?!ptasie\/)[\w\s.%-]+)\.jpe?g/g, replace: "$1.webp" },
  // /Portfolio/*.jpg -> /Portfolio/*.webp
  { pattern: /(\/Portfolio\/[\w\s.%-]+)\.jpe?g/g, replace: "$1.webp" },
  // /pngs/*.png -> /pngs/*.webp
  { pattern: /(\/pngs\/[\w\s.%-]+)\.png/g, replace: "$1.webp" },
  // /Collaborations/*.jpg -> /Collaborations/*.webp
  { pattern: /(\/Collaborations\/[\w\s.%-]+)\.jpe?g/g, replace: "$1.webp" },
  // /Collaborations/*.png -> /Collaborations/*.webp (except logo8, logo9)
  { pattern: /(\/Collaborations\/(?!logo8|logo9)[\w\s.%-]+)\.png/g, replace: "$1.webp" },
];

async function getCodeFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    if (entry.isDirectory()) {
      files.push(...(await getCodeFiles(fullPath)));
    } else if (CODE_EXTENSIONS.includes(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  console.log(DRY_RUN ? "\n=== PODGLĄD ZMIAN (--dry-run) ===\n" : "\n=== AKTUALIZACJA ŚCIEŻEK ===\n");

  let totalChanges = 0;
  let filesChanged = 0;

  for (const searchDir of SEARCH_DIRS) {
    const files = await getCodeFiles(join(ROOT, searchDir));

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      let newContent = content;

      for (const { pattern, replace } of REPLACEMENTS) {
        // Reset lastIndex for global regex
        pattern.lastIndex = 0;
        newContent = newContent.replace(pattern, replace);
      }

      if (newContent !== content) {
        // Count changes
        const oldLines = content.split("\n");
        const newLines = newContent.split("\n");
        let changes = 0;
        for (let i = 0; i < oldLines.length; i++) {
          if (oldLines[i] !== newLines[i]) changes++;
        }

        totalChanges += changes;
        filesChanged++;

        console.log(`${file}: ${changes} zmian`);

        // Show diff
        for (let i = 0; i < oldLines.length; i++) {
          if (oldLines[i] !== newLines[i]) {
            console.log(`  L${i + 1}: ${oldLines[i].trim()}`);
            console.log(`    → ${newLines[i].trim()}`);
          }
        }

        if (!DRY_RUN) {
          await writeFile(file, newContent, "utf-8");
        }
      }
    }
  }

  console.log(`\n=== PODSUMOWANIE ===`);
  console.log(`Plików zmienionych: ${filesChanged}`);
  console.log(`Linii zmienionych: ${totalChanges}`);
  if (DRY_RUN) console.log("\nUruchom bez --dry-run aby zapisać zmiany.");
}

main().catch(console.error);
