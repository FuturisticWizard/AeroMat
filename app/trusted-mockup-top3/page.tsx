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
                  <Image src={logo} alt={`Logo ${idx + 1}`} sizes="84px" width={84} height={0} style={{ height: "auto" }} />
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

type V = { id: string; label: string; note?: string; render: () => ReactNode };

const absBase =
  "pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0";

/* =========================================================
   #35 — Inverted vignette (jasny środek, ciemne boki)
   ========================================================= */
const INVERTED_VIGNETTE: V[] = [
  {
    id: "35a",
    label: "35a · base white (85%, 60×70%)",
    note: "wyjściowy wariant z głównej strony",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "150px",
          background:
            "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 65%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    ),
  },
  {
    id: "35b",
    label: "35b · tight spotlight (40% × 60%)",
    note: "węższe światło, mocniejsze ciemne krawędzie",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "140px",
          background:
            "radial-gradient(ellipse 40% 60% at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 55%, rgba(0,0,0,0.85) 100%)",
        }}
      />
    ),
  },
  {
    id: "35c",
    label: "35c · wide soft (80% × 80%)",
    note: "szerokie, rozmyte światło",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "180px",
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    ),
  },
  {
    id: "35d",
    label: "35d · orange vignette",
    note: "pomarańczowa kulminacja zamiast białej",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "160px",
          background:
            "radial-gradient(ellipse 55% 70% at 50% 50%, rgba(255,155,60,0.9) 0%, rgba(255,115,2,0) 60%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    ),
  },
  {
    id: "35e",
    label: "35e · warm white + orange ring",
    note: "białe centrum, pomarańczowa obwódka, ciemny brzeg",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "160px",
          background:
            "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 35%, rgba(255,115,2,0.3) 55%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    ),
  },
  {
    id: "35f",
    label: "35f · full-width bright band",
    note: "szeroki jasny pas przez 100% szerokości",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "140px",
          background:
            "radial-gradient(ellipse 100% 60% at 50% 50%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 75%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    ),
  },
  {
    id: "35g",
    label: "35g · cinematic crushed blacks",
    note: "mocniejsze czarne boki (0.95), środek 90%",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "170px",
          background:
            "radial-gradient(ellipse 50% 65% at 50% 50%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 55%, rgba(0,0,0,0.95) 100%)",
        }}
      />
    ),
  },
  {
    id: "35h",
    label: "35h · double vignette (stacked radials)",
    note: "2 elipsy — wąska jasna + szersza delikatna",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "180px",
          background: `
            radial-gradient(ellipse 35% 60% at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 60%),
            radial-gradient(ellipse 70% 80% at 50% 50%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%, rgba(0,0,0,0.65) 100%)
          `,
        }}
      />
    ),
  },
];

/* =========================================================
   #37 — Neon orange line + bloom (box-shadow based)
   ========================================================= */
const NeonLine = ({
  lineColor,
  lineH = "1px",
  shadow,
}: {
  lineColor: string;
  lineH?: string;
  shadow: string;
}) => (
  <div aria-hidden className={absBase} style={{ height: lineH }}>
    <div className="absolute inset-0" style={{ background: lineColor, boxShadow: shadow }} />
  </div>
);

const NEON_LINE: V[] = [
  {
    id: "37a",
    label: "37a · base orange + 4-layer bloom",
    note: "wariant z głównej strony",
    render: () => (
      <NeonLine
        lineColor="#ff9c4a"
        shadow="0 0 4px 1px rgba(255,156,74,1), 0 0 14px 4px rgba(255,115,2,0.85), 0 0 40px 10px rgba(255,115,2,0.45), 0 0 90px 25px rgba(255,115,2,0.2)"
      />
    ),
  },
  {
    id: "37b",
    label: "37b · intense + wide halo",
    note: "mocniejszy peak + szerszy fade (150px halo)",
    render: () => (
      <NeonLine
        lineColor="#ffb066"
        shadow="0 0 6px 1px rgba(255,176,102,1), 0 0 20px 6px rgba(255,115,2,0.95), 0 0 60px 18px rgba(255,115,2,0.5), 0 0 150px 40px rgba(255,115,2,0.22)"
      />
    ),
  },
  {
    id: "37c",
    label: "37c · subtle / restrained",
    note: "delikatne, bez \"Vegas\" bloom",
    render: () => (
      <NeonLine
        lineColor="#ff7302"
        shadow="0 0 3px 0 rgba(255,115,2,0.9), 0 0 10px 2px rgba(255,115,2,0.45), 0 0 24px 6px rgba(255,115,2,0.18)"
      />
    ),
  },
  {
    id: "37d",
    label: "37d · thick 2px neon tube",
    note: "grubszy \"rurkowy\" neon, bardziej sceniczny",
    render: () => (
      <NeonLine
        lineH="2px"
        lineColor="#ffc48a"
        shadow="0 0 5px 1px rgba(255,196,138,1), 0 0 16px 5px rgba(255,140,40,0.9), 0 0 45px 14px rgba(255,115,2,0.5), 0 0 100px 30px rgba(255,115,2,0.22)"
      />
    ),
  },
  {
    id: "37e",
    label: "37e · white core + orange halo",
    note: "rdzeń biały (rozżarzony), otoczenie pomarańczowe",
    render: () => (
      <NeonLine
        lineColor="#ffffff"
        shadow="0 0 3px 1px rgba(255,255,255,1), 0 0 8px 2px rgba(255,210,160,0.95), 0 0 28px 8px rgba(255,115,2,0.7), 0 0 70px 20px rgba(255,115,2,0.3)"
      />
    ),
  },
  {
    id: "37f",
    label: "37f · stacked dual tubes",
    note: "dwie rurki — jedna nad drugą, efekt podwójnej LED",
    render: () => (
      <div aria-hidden className={absBase} style={{ height: "14px" }}>
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: "1px",
            background: "#ffc48a",
            boxShadow: "0 0 4px 1px rgba(255,196,138,1), 0 0 14px 4px rgba(255,115,2,0.7), 0 0 40px 10px rgba(255,115,2,0.3)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "1px",
            background: "#ffc48a",
            boxShadow: "0 0 4px 1px rgba(255,196,138,1), 0 0 14px 4px rgba(255,115,2,0.7), 0 0 40px 10px rgba(255,115,2,0.3)",
          }}
        />
      </div>
    ),
  },
  {
    id: "37g",
    label: "37g · gradient tube (fade ends)",
    note: "linia jest gradientem poziomym — blaknie na brzegach",
    render: () => (
      <div aria-hidden className={absBase} style={{ height: "1px" }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, #ffb066 15%, #ff9c4a 50%, #ffb066 85%, transparent 100%)",
            boxShadow:
              "0 0 6px 1px rgba(255,176,102,0.9), 0 0 20px 6px rgba(255,115,2,0.55), 0 0 50px 14px rgba(255,115,2,0.22)",
          }}
        />
      </div>
    ),
  },
  {
    id: "37h",
    label: "37h · cold white neon (no orange)",
    note: "alternatywa kolorystyczna — czysto biały neon",
    render: () => (
      <NeonLine
        lineColor="#ffffff"
        shadow="0 0 3px 1px rgba(255,255,255,1), 0 0 12px 3px rgba(255,255,255,0.85), 0 0 32px 10px rgba(255,255,255,0.4), 0 0 80px 22px rgba(255,255,255,0.18)"
      />
    ),
  },
];

/* =========================================================
   #34 — Aurora wash (multi-color radial blobs)
   ========================================================= */
const AURORA: V[] = [
  {
    id: "34a",
    label: "34a · base (magenta/orange/amber)",
    note: "wariant z głównej strony",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "200px",
          background: `
            radial-gradient(ellipse 30% 60% at 25% 50%, rgba(236,72,153,0.4) 0%, transparent 60%),
            radial-gradient(ellipse 30% 60% at 50% 50%, rgba(255,115,2,0.5) 0%, transparent 60%),
            radial-gradient(ellipse 30% 60% at 75% 50%, rgba(255,200,0,0.4) 0%, transparent 60%)
          `,
        }}
      />
    ),
  },
  {
    id: "34b",
    label: "34b · intense warm (deeper colors)",
    note: "mocniejsze nasycenie tej samej palety",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "220px",
          background: `
            radial-gradient(ellipse 35% 70% at 25% 50%, rgba(236,72,153,0.75) 0%, transparent 55%),
            radial-gradient(ellipse 35% 70% at 50% 50%, rgba(255,115,2,0.85) 0%, transparent 55%),
            radial-gradient(ellipse 35% 70% at 75% 50%, rgba(255,200,0,0.75) 0%, transparent 55%)
          `,
        }}
      />
    ),
  },
  {
    id: "34c",
    label: "34c · pure AeroMat palette (oranges only)",
    note: "3 odcienie pomarańczowego, spójne z brandem",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "200px",
          background: `
            radial-gradient(ellipse 30% 60% at 20% 50%, rgba(255,168,88,0.55) 0%, transparent 60%),
            radial-gradient(ellipse 35% 65% at 50% 50%, rgba(255,115,2,0.75) 0%, transparent 60%),
            radial-gradient(ellipse 30% 60% at 80% 50%, rgba(255,200,100,0.55) 0%, transparent 60%)
          `,
        }}
      />
    ),
  },
  {
    id: "34d",
    label: "34d · cool aurora (blue/cyan/violet)",
    note: "chłodna paleta — sugeruje tech",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "200px",
          background: `
            radial-gradient(ellipse 30% 60% at 25% 50%, rgba(90,130,255,0.5) 0%, transparent 60%),
            radial-gradient(ellipse 30% 60% at 50% 50%, rgba(60,220,255,0.55) 0%, transparent 60%),
            radial-gradient(ellipse 30% 60% at 75% 50%, rgba(180,90,255,0.5) 0%, transparent 60%)
          `,
        }}
      />
    ),
  },
  {
    id: "34e",
    label: "34e · 5 blobs (more complex)",
    note: "5 plam w różnych miejscach — bogatsze",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "220px",
          background: `
            radial-gradient(ellipse 22% 55% at 10% 40%, rgba(236,72,153,0.45) 0%, transparent 60%),
            radial-gradient(ellipse 22% 55% at 32% 60%, rgba(255,115,2,0.55) 0%, transparent 60%),
            radial-gradient(ellipse 22% 55% at 54% 45%, rgba(255,200,0,0.45) 0%, transparent 60%),
            radial-gradient(ellipse 22% 55% at 76% 60%, rgba(255,115,2,0.5) 0%, transparent 60%),
            radial-gradient(ellipse 22% 55% at 92% 40%, rgba(236,72,153,0.4) 0%, transparent 60%)
          `,
        }}
      />
    ),
  },
  {
    id: "34f",
    label: "34f · asymmetric (left-weighted)",
    note: "plamy nierównomiernie — większy \"ciężar\" z lewej",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "200px",
          background: `
            radial-gradient(ellipse 40% 70% at 18% 50%, rgba(255,115,2,0.75) 0%, transparent 60%),
            radial-gradient(ellipse 25% 55% at 48% 45%, rgba(255,200,0,0.5) 0%, transparent 60%),
            radial-gradient(ellipse 20% 50% at 82% 55%, rgba(236,72,153,0.35) 0%, transparent 60%)
          `,
        }}
      />
    ),
  },
  {
    id: "34g",
    label: "34g · aurora + horizontal fade mask",
    note: "ta sama paleta, maska zanika po bokach — bardziej cinematic",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "200px",
          background: `
            radial-gradient(ellipse 30% 60% at 25% 50%, rgba(236,72,153,0.55) 0%, transparent 60%),
            radial-gradient(ellipse 30% 60% at 50% 50%, rgba(255,115,2,0.7) 0%, transparent 60%),
            radial-gradient(ellipse 30% 60% at 75% 50%, rgba(255,200,0,0.55) 0%, transparent 60%)
          `,
          maskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      />
    ),
  },
  {
    id: "34h",
    label: "34h · subtle (watermark-level)",
    note: "bardzo subtelna, ledwie widoczna — dla eleganckiego \"szeptu\"",
    render: () => (
      <div
        aria-hidden
        className={absBase}
        style={{
          height: "220px",
          background: `
            radial-gradient(ellipse 35% 70% at 25% 50%, rgba(236,72,153,0.2) 0%, transparent 60%),
            radial-gradient(ellipse 35% 70% at 50% 50%, rgba(255,115,2,0.28) 0%, transparent 60%),
            radial-gradient(ellipse 35% 70% at 75% 50%, rgba(255,200,0,0.2) 0%, transparent 60%)
          `,
        }}
      />
    ),
  },
];

/* =========================================================
   PAGE
   ========================================================= */
function Section({ title, items }: { title: string; items: V[] }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6 text-[#ff7302]">{title}</h2>
      <div className="flex flex-col gap-12">
        {items.map((v) => (
          <div key={v.id} className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-[#ff7302] font-mono text-sm">#{v.id}</span>
              <h3 className="font-semibold">{v.label}</h3>
              {v.note && <span className="text-white/40 text-xs">{v.note}</span>}
            </div>
            <div className="relative py-16">
              {v.render()}
              <LogosMarquee />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function TrustedMockupTop3Page() {
  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-2">Trusted-By · Top 3 warianty i ich mutacje</h1>
        <p className="text-white/60 mb-10 text-sm">
          Wariancje trzech wybranych kierunków: inverted vignette (#35), neonowa linia z bloom (#37) i aurora wash (#34).
          Po 8 wariantów każdego — od mocniejszych do subtelniejszych.
        </p>

        <Section title="#35 — Inverted vignette · 8 wariantów" items={INVERTED_VIGNETTE} />
        <Section title="#37 — Neon line + bloom · 8 wariantów" items={NEON_LINE} />
        <Section title="#34 — Aurora wash · 8 wariantów" items={AURORA} />
      </div>
    </main>
  );
}
