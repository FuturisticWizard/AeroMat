import Image from "next/image";
import { Fragment, type ReactNode } from "react";

const logos = [
  "/logo/clients_logos/1P.png",
  "/logo/clients_logos/2P.png",
  "/logo/clients_logos/3P.png",
  "/logo/clients_logos/4P.png",
  "/logo/clients_logos/5P.png",
  "/logo/clients_logos/6P.png",
  "/logo/clients_logos/7P.png",
  "/logo/clients_logos/8P.png",
  "/logo/clients_logos/9P.png",
  "/logo/clients_logos/10P.png",
  "/logo/clients_logos/11P.png",
  "/logo/clients_logos/12P.png",
];

function LogosMarquee() {
  return (
    <div className="relative w-full overflow-hidden z-10">
      <div className="flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex flex-none gap-24 pr-4 py-3 animate-move-right [animation-duration:60s] hover:paused">
          {[...new Array(2)].fill(0).map((_, i) => (
            <Fragment key={i}>
              {logos.map((logo, idx) => (
                <div key={idx} className="inline-flex items-center">
                  <Image
                    src={logo}
                    alt={`Logo ${idx + 1}`}
                    sizes="84px"
                    width={84}
                    height={0}
                    style={{ height: "auto" }}
                  />
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

type Variant = {
  n: number;
  label: string;
  /** total glow height in px */
  height: number;
  /** peak alpha at the center (0–1) */
  peak: number;
  /** plateau width around center in % (0 = sharp peak, 20 = flat plateau 40–60%) */
  plateau?: number;
  /** tint RGB (default white) */
  rgb?: string;
};

const V: Variant[] = [
  // Set A — różne wysokości, pełna biel (100%), gładki szpic
  { n: 1,  label: "h 40px · 100% peak",              height: 40,  peak: 1 },
  { n: 2,  label: "h 60px · 100% peak",              height: 60,  peak: 1 },
  { n: 3,  label: "h 100px · 100% peak",             height: 100, peak: 1 },
  { n: 4,  label: "h 160px · 100% peak",             height: 160, peak: 1 },
  { n: 5,  label: "h 240px · 100% peak",             height: 240, peak: 1 },

  // Set B — stonowana biel (niższy peak)
  { n: 6,  label: "h 80px · 80% peak",               height: 80,  peak: 0.8 },
  { n: 7,  label: "h 100px · 60% peak",              height: 100, peak: 0.6 },
  { n: 8,  label: "h 140px · 45% peak",              height: 140, peak: 0.45 },
  { n: 9,  label: "h 200px · 30% peak (subtle)",     height: 200, peak: 0.3 },

  // Set C — peak z plateau (mocna jasna belka w środku + fade)
  { n: 10, label: "h 80px · 100% · plateau 15%",     height: 80,  peak: 1,    plateau: 15 },
  { n: 11, label: "h 100px · 100% · plateau 25%",    height: 100, peak: 1,    plateau: 25 },
  { n: 12, label: "h 120px · 100% · plateau 40%",    height: 120, peak: 1,    plateau: 40 },
  { n: 13, label: "h 160px · 80% · plateau 30%",     height: 160, peak: 0.8,  plateau: 30 },

  // Set D — bardzo mocny, szeroki blask
  { n: 14, label: "h 180px · 100% peak (wide)",      height: 180, peak: 1 },
  { n: 15, label: "h 220px · 100% · plateau 20%",    height: 220, peak: 1,    plateau: 20 },

  // Set E — odcień ciepły / chłodny
  { n: 16, label: "h 100px · warm white",            height: 100, peak: 1,    rgb: "255, 248, 235" },
  { n: 17, label: "h 100px · cool white",            height: 100, peak: 1,    rgb: "244, 250, 255" },
  { n: 18, label: "h 140px · warm · 70% peak",       height: 140, peak: 0.7,  rgb: "255, 238, 210" },

  // Set F — bardzo wąski, ostry pasek świetlny
  { n: 19, label: "h 24px · 100% (hard light bar)",  height: 24,  peak: 1,    plateau: 30 },
  { n: 20, label: "h 14px · 100% (thin neon bar)",   height: 14,  peak: 1,    plateau: 60 },

  // Set G — POMARAŃCZOWY (#ff7302) z palety AeroMat
  { n: 21, label: "h 100px · orange 100%",           height: 100, peak: 1,    rgb: "255, 115, 2" },
  { n: 22, label: "h 160px · orange 80%",            height: 160, peak: 0.8,  rgb: "255, 115, 2" },
  { n: 23, label: "h 220px · orange 55% (soft)",     height: 220, peak: 0.55, rgb: "255, 115, 2" },
  { n: 24, label: "h 120px · orange · plateau 25%",  height: 120, peak: 1,    plateau: 25, rgb: "255, 115, 2" },
  { n: 25, label: "h 140px · orange light (#ffa858)",height: 140, peak: 0.9,  rgb: "255, 168, 88" },
];

function Glow({ v }: { v: Variant }) {
  const rgb = v.rgb ?? "255, 255, 255";
  const p = v.peak;
  const hasPlateau = v.plateau && v.plateau > 0;
  const stops = hasPlateau
    ? `rgba(${rgb}, 0) 0%,
       rgba(${rgb}, ${p}) ${50 - (v.plateau! / 2)}%,
       rgba(${rgb}, ${p}) ${50 + (v.plateau! / 2)}%,
       rgba(${rgb}, 0) 100%`
    : `rgba(${rgb}, 0) 0%,
       rgba(${rgb}, ${p}) 50%,
       rgba(${rgb}, 0) 100%`;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0"
      style={{
        height: `${v.height}px`,
        background: `linear-gradient(to bottom, ${stops})`,
      }}
    />
  );
}

export default function TrustedMockupPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2">Trusted-By Glow — 20 wariantów</h1>
        <p className="text-white/60 mb-10 text-sm">
          Jeden symetryczny gradient (biała kulminacja w środku, fade w górę i w dół). Bez linii — środek płynnie się zlewa.
        </p>

        <div className="flex flex-col gap-14">
          {V.map((v) => (
            <section key={v.n} className="flex flex-col gap-3">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-[#ff7302] font-bold">#{v.n}</span>
                <h2 className="font-semibold">{v.label}</h2>
              </div>
              <div className="relative py-12">
                <Glow v={v} />
                <LogosMarquee />
              </div>
            </section>
          ))}

          {CUSTOM.map((cv) => (
            <section key={cv.n} className="flex flex-col gap-3">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-[#ff7302] font-bold">#{cv.n}</span>
                <h2 className="font-semibold">{cv.label}</h2>
                {cv.note && <span className="text-white/40 text-xs">{cv.note}</span>}
              </div>
              <div className="relative py-16">
                {cv.render()}
                <LogosMarquee />
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   Custom variants — each with its own rendering strategy.
   ============================================================ */
type CV = { n: number; label: string; note?: string; render: () => ReactNode };

const bg = (style: React.CSSProperties) => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0"
    style={style}
  />
);

const CUSTOM: CV[] = [
  // 26 — Radial spotlight białe (ellipse za środkiem paska)
  {
    n: 26,
    label: "Radial spotlight · white",
    note: "ellipse 60% × 120px, biała kulminacja",
    render: () =>
      bg({
        height: "200px",
        background:
          "radial-gradient(ellipse 50% 100% at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.4) 35%, rgba(255,255,255,0) 70%)",
      }),
  },
  // 27 — Radial spotlight orange
  {
    n: 27,
    label: "Radial spotlight · orange",
    note: "#ff7302, wąska elipsa",
    render: () =>
      bg({
        height: "180px",
        background:
          "radial-gradient(ellipse 40% 80% at 50% 50%, rgba(255,115,2,0.9) 0%, rgba(255,115,2,0.3) 45%, rgba(255,115,2,0) 75%)",
      }),
  },
  // 28 — Trzy stage-lights (3 spotlighty)
  {
    n: 28,
    label: "Three stage lights",
    note: "3 radialne spotlighty — lewy/środek/prawy",
    render: () =>
      bg({
        height: "200px",
        background: `
          radial-gradient(circle at 20% 50%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 25%),
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 30%),
          radial-gradient(circle at 80% 50%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 25%)
        `,
      }),
  },
  // 29 — Dwie cienkie linie neonowe (rama) + delikatna poświata
  {
    n: 29,
    label: "Dual hairlines · orange frame",
    note: "2 cienkie pomarańczowe linie + box-shadow blur",
    render: () => (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0"
        style={{ height: "110px" }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "#ff7302", boxShadow: "0 0 12px 2px rgba(255,115,2,0.75)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: "#ff7302", boxShadow: "0 0 12px 2px rgba(255,115,2,0.75)" }}
        />
      </div>
    ),
  },
  // 30 — Dwie linie białe + subtelny fade do środka
  {
    n: 30,
    label: "Dual hairlines · white + inner fade",
    note: "2 białe linie z delikatnym wypełnieniem",
    render: () => (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0"
        style={{ height: "100px" }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "#ffffff", boxShadow: "0 0 10px 0 rgba(255,255,255,0.6)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: "#ffffff", boxShadow: "0 0 10px 0 rgba(255,255,255,0.6)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>
    ),
  },
  // 31 — Film perforations (motyw nawiązujący do hero)
  {
    n: 31,
    label: "Film perforations · white dots",
    note: "rząd perforacji na górze i dole — nawiązanie do hero",
    render: () => (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0"
        style={{ height: "120px" }}
      >
        <div
          className="absolute inset-x-0 top-0 h-2"
          style={{
            background:
              "repeating-linear-gradient(90deg, #fff 0 6px, transparent 6px 20px)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-2"
          style={{
            background:
              "repeating-linear-gradient(90deg, #fff 0 6px, transparent 6px 20px)",
          }}
        />
      </div>
    ),
  },
  // 32 — Scanlines (retro CRT)
  {
    n: 32,
    label: "CRT scanlines · white",
    note: "powtarzane poziome linie — retro/filmowe",
    render: () =>
      bg({
        height: "100px",
        background:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.35) 0 1px, transparent 1px 4px)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)",
      }),
  },
  // 33 — Horizontal color-shift: orange → white → orange
  {
    n: 33,
    label: "Horizontal color-shift · orange/white/orange",
    note: "kolor zmienia się wzdłuż szerokości",
    render: () =>
      bg({
        height: "140px",
        background: `
          linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%),
          linear-gradient(to right, rgba(255,115,2,0.6) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,115,2,0.6) 100%)
        `,
        backgroundBlendMode: "screen",
      }),
  },
  // 34 — Aurora: multi-color soft wash (warm)
  {
    n: 34,
    label: "Aurora wash · warm",
    note: "magenta → orange → amber, subtelne",
    render: () =>
      bg({
        height: "200px",
        background: `
          radial-gradient(ellipse 30% 60% at 25% 50%, rgba(236,72,153,0.4) 0%, transparent 60%),
          radial-gradient(ellipse 30% 60% at 50% 50%, rgba(255,115,2,0.5) 0%, transparent 60%),
          radial-gradient(ellipse 30% 60% at 75% 50%, rgba(255,200,0,0.4) 0%, transparent 60%)
        `,
      }),
  },
  // 35 — Inverted vignette (ciemne krawędzie, jasny środek)
  {
    n: 35,
    label: "Inverted vignette",
    note: "jasny środek, ciemne boki",
    render: () =>
      bg({
        height: "150px",
        background:
          "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 65%, rgba(0,0,0,0.6) 100%)",
      }),
  },
  // 36 — Orange glow + top+bottom hairlines (combo)
  {
    n: 36,
    label: "Orange glow + white hairlines",
    note: "pomarańczowy wash + 2 cienkie białe linie",
    render: () => (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0"
        style={{ height: "140px" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,115,2,0) 0%, rgba(255,115,2,0.55) 50%, rgba(255,115,2,0) 100%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: "rgba(255,255,255,0.85)" }} />
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "rgba(255,255,255,0.85)" }} />
      </div>
    ),
  },
  // 37 — Neon line + wide orange bloom
  {
    n: 37,
    label: "Neon orange line + bloom",
    note: "1px neonowa kreska z mocnym box-shadow bloom",
    render: () => (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0"
        style={{ height: "1px" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "#ff9c4a",
            boxShadow:
              "0 0 4px 1px rgba(255,156,74,1), 0 0 14px 4px rgba(255,115,2,0.85), 0 0 40px 10px rgba(255,115,2,0.45), 0 0 90px 25px rgba(255,115,2,0.2)",
          }}
        />
      </div>
    ),
  },
  // 38 — Gradient + noise (film grain)
  {
    n: 38,
    label: "Gradient + film grain",
    note: "SVG noise overlay dla filmowego ziarna",
    render: () => (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0"
        style={{ height: "160px" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
          }}
        />
      </div>
    ),
  },
  // 39 — Split warm/cool (góra chłodna, dół ciepła)
  {
    n: 39,
    label: "Split warm/cool",
    note: "górna połówka chłodna biel, dolna ciepła",
    render: () => (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0"
        style={{ height: "140px" }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1/2"
          style={{
            background:
              "linear-gradient(to bottom, rgba(240,250,255,0) 0%, rgba(240,250,255,0.9) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,238,210,1) 0%, rgba(255,238,210,0) 100%)",
          }}
        />
      </div>
    ),
  },
  // 40 — Dotted lines top+bottom (bardziej tech)
  {
    n: 40,
    label: "Dotted lines · tech",
    note: "2 kropkowane linie — porządny podział bez mocnej poświaty",
    render: () => (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0"
        style={{ height: "90px" }}
      >
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: "2px",
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.75) 0 3px, transparent 3px 10px)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "2px",
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.75) 0 3px, transparent 3px 10px)",
          }}
        />
      </div>
    ),
  },
];
