const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const INPUT_DIR = path.resolve(__dirname, "../../AeromatPageImages/MURALE");
const OUTPUT_DIR = path.resolve(__dirname, "../public/images/murale");
const MAX_DIMENSION = 2400;
const WEBP_QUALITY = 80;

async function convert() {
  // Create output dir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(INPUT_DIR)
    .filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

  console.log(`Found ${files.length} images in ${INPUT_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Max dimension: ${MAX_DIMENSION}px, WebP quality: ${WEBP_QUALITY}\n`);

  let totalInputSize = 0;
  let totalOutputSize = 0;

  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const baseName = path.parse(file).name.toLowerCase().replace(/\s+/g, "-");
    const outputPath = path.join(OUTPUT_DIR, `${baseName}.webp`);

    const inputStats = fs.statSync(inputPath);
    totalInputSize += inputStats.size;

    const metadata = await sharp(inputPath).metadata();
    const { width, height } = metadata;

    // Resize so the longest side is MAX_DIMENSION, keep aspect ratio
    const longest = Math.max(width, height);
    const needsResize = longest > MAX_DIMENSION;

    let pipeline = sharp(inputPath);

    if (needsResize) {
      if (width >= height) {
        pipeline = pipeline.resize({ width: MAX_DIMENSION });
      } else {
        pipeline = pipeline.resize({ height: MAX_DIMENSION });
      }
    }

    await pipeline
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    totalOutputSize += outputStats.size;

    const outMeta = await sharp(outputPath).metadata();
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(
      `${file} (${(inputStats.size / 1024).toFixed(0)}KB, ${width}x${height}) -> ${baseName}.webp (${(outputStats.size / 1024).toFixed(0)}KB, ${outMeta.width}x${outMeta.height}) -${savings}%`
    );
  }

  console.log(`\nTotal: ${(totalInputSize / 1024 / 1024).toFixed(1)}MB -> ${(totalOutputSize / 1024 / 1024).toFixed(1)}MB (-${((1 - totalOutputSize / totalInputSize) * 100).toFixed(1)}%)`);
}

convert().catch(console.error);
