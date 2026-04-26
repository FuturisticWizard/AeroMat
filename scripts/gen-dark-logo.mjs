#!/usr/bin/env node
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

/*
 * Tryby (--mode):
 *   "dark-to-light" (default): tylko ciemne neutralne piksele (lum<LUM) lecą
 *     do białego. Białe / jasne elementy zostają. Dobre gdy logo ma BIAŁE tło
 *     wnętrze (np. NIW — czarna ramka na białym wnętrzu).
 *
 *   "invert": wszystkie neutralne piksele (sat<SAT) flipują luminancję.
 *     Czarne → białe, białe → czarne, szare → negatyw. Dobre dla PURE B&W
 *     logosów (np. Molotow — czarne koło + białe M + czarny tekst).
 *
 * Kolorowe piksele (sat>=SAT) zawsze zachowane. Alpha zawsze zachowana.
 */
function parseArgs(argv) {
  const positional = [];
  const opts = {
    sat: 30,
    lum: 150,
    mode: "dark-to-light",
    yMin: null,
    yMax: null,
    outline: 0,              // szerokość białej obwódki w px (0 = off)
    outlineOffset: 0,        // odsunięcie obwódki od krawędzi kształtu w px
    outlineThreshold: 10,    // threshold po blurze (0–255)
  };
  for (const arg of argv) {
    if (arg.startsWith("--sat=")) opts.sat = Number(arg.split("=")[1]);
    else if (arg.startsWith("--lum=")) opts.lum = Number(arg.split("=")[1]);
    else if (arg.startsWith("--mode=")) opts.mode = arg.split("=")[1];
    else if (arg.startsWith("--y-min=")) opts.yMin = Number(arg.split("=")[1]);
    else if (arg.startsWith("--y-max=")) opts.yMax = Number(arg.split("=")[1]);
    else if (arg.startsWith("--outline=")) opts.outline = Number(arg.split("=")[1]);
    else if (arg.startsWith("--outline-offset=")) opts.outlineOffset = Number(arg.split("=")[1]);
    else if (arg.startsWith("--outline-threshold=")) opts.outlineThreshold = Number(arg.split("=")[1]);
    else positional.push(arg);
  }
  if (!["dark-to-light", "invert"].includes(opts.mode)) {
    throw new Error(`Invalid --mode: ${opts.mode} (expected "dark-to-light" or "invert")`);
  }
  return { positional, opts };
}

async function convertBlackToWhite(inputAbs, outputAbs, opts) {
  const { sat: SAT, lum: LUM, mode, yMin, yMax, outline, outlineOffset, outlineThreshold } = opts;

  const img = sharp(inputAbs).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  if (channels !== 4) {
    throw new Error(`Expected RGBA (4 channels), got ${channels}`);
  }

  const yStart = yMin ?? 0;
  const yEnd = yMax ?? height;

  // --- Biała obwódka (outline) ---
  // Obwódka = pierścień (ring) między dwoma dilated masks:
  //   innerMask = dilacja o outlineOffset (wewnętrzna krawędź pierścienia)
  //   outerMask = dilacja o outlineOffset + outline (zewnętrzna krawędź)
  // Piksel jest w pierścieniu jeśli: outerMask ma go AND innerMask NIE ma go
  // AND oryginał był przezroczysty. Wypełniamy wtedy białym.
  //
  // outlineOffset = 0 → obwódka tuż przy kształcie (bez odstępu)
  // outlineOffset = N → N pikseli odstępu między kształtem a obwódką
  let innerMask = null;
  let outerMask = null;
  if (outline > 0) {
    const innerBlur = outlineOffset;
    const outerBlur = outlineOffset + outline;

    // sharp.blur wymaga radius >= 0.3; dla 0 używamy oryginalnej alphy
    const innerPipeline =
      innerBlur < 0.3
        ? sharp(inputAbs).ensureAlpha().extractChannel("alpha").threshold(outlineThreshold)
        : sharp(inputAbs).ensureAlpha().extractChannel("alpha").blur(innerBlur).threshold(outlineThreshold);
    innerMask = await innerPipeline.raw().toBuffer();

    outerMask = await sharp(inputAbs)
      .ensureAlpha()
      .extractChannel("alpha")
      .blur(outerBlur)
      .threshold(outlineThreshold)
      .raw()
      .toBuffer();
  }

  let converted = 0;
  let outlined = 0;

  for (let y = 0; y < height; y++) {
    const inInvertRegion = y >= yStart && y < yEnd;

    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;

      // Białą obwódkę (pierścień) wpisujemy poza regionem invert, tam gdzie
      // oryginał był przezroczysty, outerMask nas obejmuje a innerMask nie.
      if (!inInvertRegion && outerMask && innerMask && data[i + 3] === 0) {
        const maskIdx = y * width + x;
        if (outerMask[maskIdx] > 0 && innerMask[maskIdx] === 0) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = 255;
          outlined++;
          continue;
        }
      }

      if (!inInvertRegion) continue;

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max - min;
      const luminance = (r + g + b) / 3;

      const neutralPixel = saturation < SAT;
      const shouldConvert =
        mode === "invert"
          ? neutralPixel
          : neutralPixel && luminance < LUM;

      if (shouldConvert) {
        const inverted = 255 - luminance;
        data[i] = inverted;
        data[i + 1] = inverted;
        data[i + 2] = inverted;
        converted++;
      }
    }
  }

  // Auto-detekcja formatu z rozszerzenia — .webp → lossless WebP, .png → PNG
  const ext = path.extname(outputAbs).toLowerCase();
  let pipeline = sharp(data, { raw: { width, height, channels } });
  if (ext === ".webp") {
    pipeline = pipeline.webp({ lossless: true });
  } else if (ext === ".png") {
    pipeline = pipeline.png();
  } else {
    throw new Error(`Unsupported output extension: ${ext} (use .png or .webp)`);
  }
  await pipeline.toFile(outputAbs);

  const totalPx = width * height;
  const pct = ((converted / totalPx) * 100).toFixed(1);
  const regionLabel = (yMin != null || yMax != null) ? `, y=[${yStart}..${yEnd})` : "";
  const outlineLabel = outline > 0
    ? `, outline=${outline}px (offset=${outlineOffset}px) → ${outlined}px painted`
    : "";
  console.log(`OK ${path.relative(PROJECT_ROOT, outputAbs)}`);
  console.log(`  ${width}x${height}, mode=${mode}, converted ${converted} / ${totalPx} px (${pct}%), sat<${SAT}${mode === "dark-to-light" ? `, lum<${LUM}` : ""}${regionLabel}${outlineLabel}`);
}

const { positional, opts } = parseArgs(process.argv.slice(2));

if (positional.length < 2) {
  console.error("Usage: node scripts/gen-dark-logo.mjs <input> <output> [--mode=dark-to-light|invert] [--sat=30] [--lum=150]");
  process.exit(1);
}

const inputAbs = path.resolve(PROJECT_ROOT, positional[0]);
const outputAbs = path.resolve(PROJECT_ROOT, positional[1]);

convertBlackToWhite(inputAbs, outputAbs, opts).catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
