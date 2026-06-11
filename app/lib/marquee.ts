import gsap from "gsap";

interface MarqueeConfig {
  repeat?: number;
  paddingRight?: number;
  speed?: number;
}

export default function setupMarqueeAnimation() {
  // Pobieramy wszystkie nagłówki paska marquee (.marquee h2)
  const marqueeItems = gsap.utils.toArray<HTMLElement>(".marquee h2");

  if (marqueeItems.length === 0) {
    console.warn(
      "Marquee items not found. Check if .marquee h1 exists in DOM."
    );
    return;
  }

  const isMobile = window.innerWidth < 768;
  horizontalLoop(marqueeItems, {
    repeat: -1,
    paddingRight: 30,
    speed: isMobile ? 0.2 : 0.4,
  });
}

function horizontalLoop(items: HTMLElement[], config: MarqueeConfig) {
  items = gsap.utils.toArray<HTMLElement>(items);
  config = config || {};
  const tl = gsap.timeline({
    repeat: config.repeat,
    defaults: { ease: "none" },
  });
  const length = items.length;
  const pixelsPerSecond = (config.speed || 1) * 100;
  let curX, distanceToStart, distanceToLoop, item, i;

  // BATCH READS FIRST — avoids O(N) forced layouts from interleaved reads/writes.
  // Cache all DOM geometry in one pass before any gsap.set writes invalidate layout.
  const startX = items[0].offsetLeft;
  const widths = new Array(length);
  const xPercents = new Array(length);
  const offsetLefts = new Array(length);
  const offsetWidths = new Array(length);
  const scales = new Array(length);
  for (i = 0; i < length; i++) {
    item = items[i];
    widths[i] = parseFloat(gsap.getProperty(item, "width", "px") as string);
    xPercents[i] =
      (parseFloat(gsap.getProperty(item, "x", "px") as string) / widths[i]) * 100 +
      (gsap.getProperty(item, "xPercent") as number);
    offsetLefts[i] = item.offsetLeft;
    offsetWidths[i] = item.offsetWidth;
    scales[i] = gsap.getProperty(item, "scaleX");
  }

  // Now do writes — no layout-read in between.
  gsap.set(items, { xPercent: (i: number) => xPercents[i] });
  gsap.set(items, { x: 0 });

  const totalWidth =
    offsetLefts[length - 1] +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    offsetWidths[length - 1] * scales[length - 1] +
    (config.paddingRight || 0);

  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = offsetLefts[i] + curX - startX;
    distanceToLoop = distanceToStart + widths[i] * scales[i];
    tl.to(
      item,
      {
        xPercent: ((curX - distanceToLoop) / widths[i]) * 100,
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    ).fromTo(
      item,
      { xPercent: ((curX - distanceToLoop + totalWidth) / widths[i]) * 100 },
      {
        xPercent: xPercents[i],
        duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
        immediateRender: false,
      },
      distanceToLoop / pixelsPerSecond
    );
  }
  tl.progress(i, true).progress(0, true);
  return tl;
}
