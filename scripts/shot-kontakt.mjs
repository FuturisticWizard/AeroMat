import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "docs/errors";
mkdirSync(OUT, { recursive: true });

const sizes = [
  { w: 390, h: 844, name: "mobile" },
  { w: 768, h: 1024, name: "tablet" },
  { w: 1024, h: 768, name: "laptop-short" },
  { w: 1440, h: 900, name: "1440" },
  { w: 1920, h: 1080, name: "fhd" },
  { w: 2560, h: 1440, name: "2560" },
];

const browser = await chromium.launch();
for (const s of sizes) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h } });
  await page.goto("http://localhost:3001/kontakt", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3500); // poczekaj na animacje wejscia
  const file = `${OUT}/kontakt_${s.w}x${s.h}_${s.name}.png`;
  await page.screenshot({ path: file }); // tylko widok (viewport), nie cala strona
  console.log("saved", file);
  await page.close();
}
await browser.close();
console.log("DONE");
