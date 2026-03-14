const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SOURCE_ROOT = path.resolve(__dirname, "../../AeromatPageImages");
const OUTPUT_ROOT = path.resolve(__dirname, "../public/portfolio");
const MAX_DIMENSION = 2400;
const WEBP_QUALITY = 80;

// Mapping: source folder name → output folder name
const FOLDERS = {
  "BIRDS GALLERY": "ptasie",
  "BRENDING (grafika naścienna)": "szyldy",
  "Wnętrza": "wnetrza",
  "Projekty Specjalne": "projekty",
  "Detale, tło Strony": "detale",
  "in action": "in-action",
  "Animacja": "animacja",
};

async function convertFolder(sourceName, outputName) {
  const inputDir = path.join(SOURCE_ROOT, sourceName);
  const outputDir = path.join(OUTPUT_ROOT, outputName);

  if (!fs.existsSync(inputDir)) {
    console.log(`SKIP: ${inputDir} not found`);
    return { input: 0, output: 0 };
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const files = fs
    .readdirSync(inputDir)
    .filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

  if (!files.length) {
    console.log(`SKIP: ${sourceName} — no images`);
    return { input: 0, output: 0 };
  }

  console.log(`\n=== ${sourceName} → ${outputName} (${files.length} files) ===`);

  let totalIn = 0;
  let totalOut = 0;

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.parse(file).name.toLowerCase().replace(/\s+/g, "-");
    const outputPath = path.join(outputDir, `${baseName}.webp`);

    const inputStats = fs.statSync(inputPath);
    totalIn += inputStats.size;

    const metadata = await sharp(inputPath).metadata();
    const { width, height } = metadata;

    const longest = Math.max(width, height);
    let pipeline = sharp(inputPath);

    if (longest > MAX_DIMENSION) {
      if (width >= height) {
        pipeline = pipeline.resize({ width: MAX_DIMENSION });
      } else {
        pipeline = pipeline.resize({ height: MAX_DIMENSION });
      }
    }

    await pipeline.webp({ quality: WEBP_QUALITY }).toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    totalOut += outputStats.size;

    const outMeta = await sharp(outputPath).metadata();
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(
      `  ${file} (${(inputStats.size / 1024).toFixed(0)}KB, ${width}x${height}) → ${baseName}.webp (${(outputStats.size / 1024).toFixed(0)}KB, ${outMeta.width}x${outMeta.height}) -${savings}%`
    );
  }

  console.log(
    `  Subtotal: ${(totalIn / 1024 / 1024).toFixed(1)}MB → ${(totalOut / 1024 / 1024).toFixed(1)}MB (-${((1 - totalOut / totalIn) * 100).toFixed(1)}%)`
  );

  return { input: totalIn, output: totalOut };
}

async function main() {
  let grandIn = 0;
  let grandOut = 0;

  for (const [source, output] of Object.entries(FOLDERS)) {
    const { input, output: out } = await convertFolder(source, output);
    grandIn += input;
    grandOut += out;
  }

  console.log(
    `\n=== TOTAL: ${(grandIn / 1024 / 1024).toFixed(1)}MB → ${(grandOut / 1024 / 1024).toFixed(1)}MB (-${((1 - grandOut / grandIn) * 100).toFixed(1)}%) ===`
  );
}

main().catch(console.error);
