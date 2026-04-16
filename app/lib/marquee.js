import gsap from "gsap";

export default function setupMarqueeAnimation() {
  // Pobieramy wszystkie elementy h1 z klasy .marquee h1
  const marqueeItems = gsap.utils.toArray(".marquee h1");

  if (marqueeItems.length === 0) {
    console.warn(
      "Marquee items not found. Check if .marquee h1 exists in DOM."
    );
    return;
  }

  console.log("Found marquee items:", marqueeItems.length);
  console.log(marqueeItems);
  if (marqueeItems.length > 0) {
    const isMobile = window.innerWidth < 768;
    const tl = horizontalLoop(marqueeItems, {
      repeat: -1,
      paddingRight: 30,
      speed: isMobile ? 0.2 : 0.4,
    });
  }
}

function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({
    repeat: config.repeat,
    defaults: { ease: "none" },
  });
  let length = items.length;
  let pixelsPerSecond = (config.speed || 1) * 100;
  let totalWidth, curX, distanceToStart, distanceToLoop, item, i;

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
    widths[i] = parseFloat(gsap.getProperty(item, "width", "px"));
    xPercents[i] =
      (parseFloat(gsap.getProperty(item, "x", "px")) / widths[i]) * 100 +
      gsap.getProperty(item, "xPercent");
    offsetLefts[i] = item.offsetLeft;
    offsetWidths[i] = item.offsetWidth;
    scales[i] = gsap.getProperty(item, "scaleX");
  }

  // Now do writes — no layout-read in between.
  gsap.set(items, { xPercent: (i) => xPercents[i] });
  gsap.set(items, { x: 0 });

  totalWidth =
    offsetLefts[length - 1] +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    offsetWidths[length - 1] * scales[length - 1] +
    (parseFloat(config.paddingRight) || 0);

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
