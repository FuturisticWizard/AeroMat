/**
 * Skrypt optymalizacji obrazów dla projektu AeroMat.
 * Konwertuje JPEG/PNG do WebP z odpowiednim zmniejszeniem rozdzielczości.
 * Wymaga: sharp (zainstalowany jako zależność Next.js)
 *
 * Użycie: node scripts/optimize-images.mjs [--dry-run]
 */

import sharp from "sharp";
import { readdir, stat, mkdir, unlink } from "fs/promises";
import { join, extname, basename, dirname } from "path";

const DRY_RUN = process.argv.includes("--dry-run");
const PUBLIC = "public";

// Konfiguracja konwersji per katalog
const TASKS = [
  {
    name: "Dekoracyjne PNG (spraypaint)",
    dir: "public/pngs",
    extensions: [".png"],
    maxWidth: 2000,
    quality: 80,
    preserveAlpha: true,
  },
  {
    name: "Portfolio JPEG",
    dir: "public/Portfolio",
    extensions: [".jpg", ".jpeg"],
    maxWidth: 2400,
    quality: 80,
    preserveAlpha: false,
  },
  {
    name: "Galeria główna JPEG",
    dir: "public/images",
    extensions: [".jpg", ".jpeg"],
    maxWidth: 1920,
    quality: 80,
    preserveAlpha: false,
    recursive: false, // nie wchodź do ptasie/
  },
  {
    name: "Logotypy współpracowników",
    dir: "public/Collaborations",
    extensions: [".png", ".jpg", ".jpeg"],
    maxWidth: 800,
    quality: 80,
    preserveAlpha: true,
  },
];

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function getFiles(dir, extensions, recursive = false) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isFile() && extensions.includes(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
    // nie wchodzimy do podkatalogów chyba że recursive
    if (entry.isDirectory() && recursive) {
      files.push(...(await getFiles(fullPath, extensions, recursive)));
    }
  }

  return files;
}

async function convertFile(filePath, maxWidth, quality, preserveAlpha) {
  const originalStat = await stat(filePath);
  const originalSize = originalStat.size;

  const ext = extname(filePath).toLowerCase();
  const outputPath = filePath.replace(/\.(jpe?g|png)$/i, ".webp");

  if (DRY_RUN) {
    return { filePath, outputPath, originalSize, newSize: null, skipped: false };
  }

  let pipeline = sharp(filePath);

  // Pobierz metadane żeby sprawdzić czy trzeba zmniejszać
  const metadata = await pipeline.metadata();
  if (metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true });
  }

  // Konwertuj do WebP
  pipeline = pipeline.webp({
    quality,
    effort: 4, // balans szybkość/kompresja
    ...(preserveAlpha ? {} : { alphaQuality: 0 }),
  });

  await pipeline.toFile(outputPath);

  const newStat = await stat(outputPath);
  return {
    filePath,
    outputPath,
    originalSize,
    newSize: newStat.size,
    width: metadata.width,
    skipped: false,
  };
}

async function main() {
  console.log(DRY_RUN ? "\n=== TRYB PODGLĄDU (--dry-run) ===\n" : "\n=== KONWERSJA OBRAZÓW ===\n");

  let totalOriginal = 0;
  let totalNew = 0;
  let totalFiles = 0;

  for (const task of TASKS) {
    console.log(`\n--- ${task.name} (${task.dir}) ---`);

    try {
      const files = await getFiles(task.dir, task.extensions, task.recursive ?? false);

      if (files.length === 0) {
        console.log("  Brak plików do konwersji.");
        continue;
      }

      console.log(`  Znaleziono ${files.length} plików.\n`);

      for (const file of files) {
        try {
          const result = await convertFile(file, task.maxWidth, task.quality, task.preserveAlpha);
          totalOriginal += result.originalSize;
          totalFiles++;

          if (DRY_RUN) {
            console.log(`  ${basename(file)}: ${formatSize(result.originalSize)} -> [WebP]`);
          } else {
            totalNew += result.newSize;
            const savings = ((1 - result.newSize / result.originalSize) * 100).toFixed(0);
            console.log(
              `  ${basename(file)}: ${formatSize(result.originalSize)} -> ${formatSize(result.newSize)} (${savings}% mniej${result.width ? `, ${result.width}px` : ""})`
            );
          }
        } catch (err) {
          console.error(`  BŁĄD ${basename(file)}: ${err.message}`);
        }
      }
    } catch (err) {
      console.error(`  BŁĄD katalogu: ${err.message}`);
    }
  }

  console.log("\n=== PODSUMOWANIE ===");
  console.log(`Plików: ${totalFiles}`);
  console.log(`Rozmiar oryginalny: ${formatSize(totalOriginal)}`);
  if (!DRY_RUN) {
    console.log(`Rozmiar po konwersji: ${formatSize(totalNew)}`);
    console.log(`Oszczędność: ${formatSize(totalOriginal - totalNew)} (${((1 - totalNew / totalOriginal) * 100).toFixed(0)}%)`);
    console.log("\nUWAGA: Oryginalne pliki NIE zostały usunięte.");
    console.log("Po weryfikacji wizualnej uruchom: node scripts/optimize-images.mjs --cleanup");
  }

  // Tryb cleanup — usuwa oryginały po weryfikacji
  if (process.argv.includes("--cleanup")) {
    console.log("\n=== USUWANIE ORYGINAŁÓW ===");
    for (const task of TASKS) {
      const files = await getFiles(task.dir, task.extensions, task.recursive ?? false);
      for (const file of files) {
        const webpPath = file.replace(/\.(jpe?g|png)$/i, ".webp");
        try {
          await stat(webpPath);
          await unlink(file);
          console.log(`  Usunięto: ${file}`);
        } catch {
          console.log(`  Pominięto (brak WebP): ${file}`);
        }
      }
    }
  }
}

main().catch(console.error);
