import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

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

/* ------------------------------------------------------------------ */
/* Per-logo V4 overrides — każde logo ma swój spec (src / filter / halo)
   na stan default I hover. Domyślnie wszystkie używają oryginału + grayscale + halo.
   Wyjątki opisane niżej. Overrides czytane tylko przez V4.              */
/* ------------------------------------------------------------------ */
type LogoOverride = {
  defaultSrc?: string;   // plik w stanie default (domyślnie oryginał)
  defaultFilter?: string; // filtr w stanie default (domyślnie FILTER_PLAIN = grayscale)
  hoverSrc?: string;     // plik w stanie hover (domyślnie = defaultSrc)
  showHalo?: boolean;    // czy pokazywać mleczny halo pod spodem w default (default true)
};

/* ------------------------------------------------------------------ */
/* Filter presets — all grayscale, all designed for BLACK background. */
/* ------------------------------------------------------------------ */
/*
  Problem: większość logosów klientów to ciemny druk na jasnym tle.
  Na czarnym tle zwykły `filter: grayscale(1)` sprawia że znikają.
  Poniżej 3 realne strategie "grayscale na black":

  A) INVERT — najczęstsze podejście do "dark mode logo wall". Darki stają się
     jasnymi tonami. Zachowuje wewnętrzne niuanse tonalne.

  B) BRIGHTEN — podniesienie jasności + kontrastu bez invertu. Zachowuje
     oryginalną polaryzację logosu (co było ciemne — nadal ciemniejsze),
     tylko lifted w stronę bieli. Czasem lepiej oddaje "osobowość" marki.

  C) HALO — zostawiamy logos JAK JEST (grayscale) i dodajemy pod spód
     delikatną białą poświatę / mleczny spot, żeby ciemne elementy miały na
     czym stanąć. Najdelikatniejsze, editorial.
*/

const FILTER_INVERT  = "grayscale(1) invert(1) opacity(0.88)";
const FILTER_BRIGHT  = "grayscale(1) brightness(2.6) contrast(0.85) opacity(0.9)";
const FILTER_PLAIN   = "grayscale(1) opacity(0.85)"; // używane z haloem

/* Per-logo overrides dla wariantów hover-to-color.
   - Molotow (idx 5): default jak V01 (FILTER_INVERT, no halo), hover = 6P-dark-plain.png
   - NIW    (idx 6): default i hover = 7P-dark.png (czarne elementy już zamienione na białe)
   - NCK    (idx 8): default jak V05 (FILTER_INVERT, no halo), hover = 9P-dark.webp
                     (czerwona ikona zachowana, tekst zinvertowany na biały) */
const V4_OVERRIDES: Record<number, LogoOverride> = {
  5: {
    defaultFilter: FILTER_INVERT,
    showHalo: false,
    hoverSrc: "/logo/clients_logos/6P-dark-plain.png",
  },
  6: {
    defaultSrc: "/logo/clients_logos/7P-dark.png",
    hoverSrc: "/logo/clients_logos/7P-dark.png",
  },
  8: {
    defaultFilter: FILTER_INVERT,
    showHalo: false,
    hoverSrc: "/logo/clients_logos/9P-dark.webp",
  },
};

/* V4.1 — identyczne jak V4, ale Molotow w hover ma dodatkowy 1px biały zewnętrzny
   okrąg wokół czarnego koła (plik 6P-dark-plain-ring.webp) — cienki kontur definiuje
   brzeg koła na czarnym tle bez grubej obwódki. */
const V4_1_OVERRIDES: Record<number, LogoOverride> = {
  ...V4_OVERRIDES,
  5: {
    ...V4_OVERRIDES[5],
    hoverSrc: "/logo/clients_logos/6P-dark-plain-ring.webp",
  },
};

type LogoSpec = {
  defaultSrc: string;
  defaultFilter: string;
  hoverSrc: string;
  showHalo: boolean;
};

const resolveSpec = (i: number, overrides: Record<number, LogoOverride>): LogoSpec => {
  const o = overrides[i] ?? {};
  const defaultSrc = o.defaultSrc ?? logos[i];
  return {
    defaultSrc,
    defaultFilter: o.defaultFilter ?? FILTER_PLAIN,
    hoverSrc: o.hoverSrc ?? defaultSrc,
    showHalo: o.showHalo ?? true,
  };
};

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

type LogoCellProps = {
  src: string;
  idx: number;
  filter: string;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
};

const LogoCell = ({
  src,
  idx,
  filter,
  sizes = "160px",
  className = "",
  style,
}: LogoCellProps) => (
  <div
    className={`relative w-full h-full flex items-center justify-center transition-[filter,opacity] duration-500 ease-out ${className}`}
    style={{ filter, ...style }}
  >
    <Image
      src={src}
      alt={`Klient ${idx + 1}`}
      fill
      sizes={sizes}
      className="object-contain"
    />
  </div>
);

/* Komórka z subtelnym mlecznym haloem pod spodem. Dla FILTER_PLAIN. */
const HaloCell = ({ src, idx, sizes = "160px" }: { src: string; idx: number; sizes?: string }) => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 35%, rgba(255,255,255,0) 70%)",
      }}
    />
    <div className="relative w-full h-full" style={{ filter: FILTER_PLAIN }}>
      <Image src={src} alt={`Klient ${idx + 1}`} fill sizes={sizes} className="object-contain" />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Section wrapper                                                     */
/* ------------------------------------------------------------------ */

type VariantProps = {
  n: number;
  title: string;
  description: string;
  children: ReactNode;
  /** np. "czerniejsze", "pure black", "subtle noise" itd. */
  bgTone?: "pure" | "gradient" | "noise";
};

const bgStyle: Record<NonNullable<VariantProps["bgTone"]>, CSSProperties> = {
  pure: { background: "#000" },
  gradient: {
    background:
      "radial-gradient(ellipse at 50% 0%, #161616 0%, #000 60%)",
  },
  noise: {
    background:
      // bardzo delikatny szum + czerń — czyta się jak film grain
      "repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.012) 0 1px, transparent 1px 3px), #000",
  },
};

const Variant = ({ n, title, description, children, bgTone = "pure" }: VariantProps) => (
  <section className="mb-16">
    <div className="max-w-6xl mx-auto px-6 mb-4">
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-[#ff7302] font-mono text-xs">V{n.toString().padStart(2, "0")}</span>
        <h2 className="text-white text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-white/50 text-sm max-w-3xl">{description}</p>
    </div>

    <div className="border-y border-white/10" style={bgStyle[bgTone]}>
      <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">{children}</div>
    </div>
  </section>
);

/* ================================================================== */
/* Variants                                                            */
/* ================================================================== */

/* V1 — Invert + grayscale, even 4×3 grid.
   Podejście A. Klasyczny dark-mode logo wall — najbezpieczniejsze dla ciemnych logosów. */
function V1_InvertEven() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-10 gap-y-12">
      {logos.map((src, i) => (
        <div key={i} className="h-16 md:h-20">
          <LogoCell src={src} idx={i} filter={FILTER_INVERT} />
        </div>
      ))}
    </div>
  );
}

/* V2 — Brightness-lifted (no invert), even 4×3 grid.
   Podejście B. Zachowuje polaryzację: co było ciemne, zostaje ciemniejsze
   w obrębie logosu — ale cała rzecz "wyniesiona" bliżej bieli. Subtelniejsze od inverta. */
function V2_BrightEven() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-10 gap-y-12">
      {logos.map((src, i) => (
        <div key={i} className="h-16 md:h-20">
          <LogoCell src={src} idx={i} filter={FILTER_BRIGHT} />
        </div>
      ))}
    </div>
  );
}

/* V3 — Halo under each logo (bez invertu, zwykły grayscale).
   Podejście C. Mleczna poświata pod każdym logosem — ciemne detale mają na czym stanąć.
   Najdelikatniejsze, editorial, "galerie w czarnej sali". */
function V3_HaloEven() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-10">
      {logos.map((src, i) => (
        <div key={i} className="h-20 md:h-24 rounded-sm">
          <HaloCell src={src} idx={i} />
        </div>
      ))}
    </div>
  );
}

/* V4 — Hover to full color.
   Każde logo ma swój spec (resolveSpec): defaultSrc + defaultFilter + hoverSrc + showHalo.
   Dwie warstwy Image stackowane, cross-fade na hover.
   Default = spec.defaultSrc z filtrem defaultFilter (+ opcjonalne halo).
   Hover   = spec.hoverSrc bez filtra.
   `overridesMap` określa per-logo wyjątki od standardowego zachowania. */
function V4HoverGrid({ overridesMap }: { overridesMap: Record<number, LogoOverride> }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-10">
      {logos.map((_, i) => {
        const spec = resolveSpec(i, overridesMap);
        return (
          <div key={i} className="h-20 md:h-24 group relative">
            {/* Halo pod spodem — widoczny w stanie default, fade-out na hover */}
            {spec.showHalo && (
              <div
                aria-hidden
                className="
                  pointer-events-none absolute inset-0
                  transition-opacity duration-500 ease-out
                  group-hover:opacity-0
                "
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 35%, rgba(255,255,255,0) 70%)",
                }}
              />
            )}

            {/* Default layer — widoczny gdy nie-hover */}
            <div
              className="
                absolute inset-0 flex items-center justify-center
                transition-opacity duration-500 ease-out
                group-hover:opacity-0
              "
              style={{ filter: spec.defaultFilter }}
            >
              <Image
                src={spec.defaultSrc}
                alt={`Klient ${i + 1}`}
                fill
                sizes="160px"
                className="object-contain"
              />
            </div>

            {/* Hover layer — widoczny tylko na hover, bez filtra */}
            <div
              className="
                absolute inset-0 flex items-center justify-center
                opacity-0 transition-opacity duration-500 ease-out
                group-hover:opacity-100
              "
            >
              <Image
                src={spec.hoverSrc}
                alt={`Klient ${i + 1}`}
                fill
                sizes="160px"
                className="object-contain"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* V5 — Line-separated rows, invert+grayscale.
   Editorial minimal — zero borderów, tylko cienkie białe linie między wierszami. */
function V5_Rows() {
  const perRow = 4;
  const rows: string[][] = [];
  for (let i = 0; i < logos.length; i += perRow) rows.push(logos.slice(i, i + perRow));

  return (
    <div className="divide-y divide-white/10">
      {rows.map((row, r) => (
        <div key={r} className="grid grid-cols-4 py-8 md:py-10 gap-x-6">
          {row.map((src, i) => (
            <div key={i} className="h-14 md:h-16">
              <LogoCell src={src} idx={r * perRow + i} filter={FILTER_INVERT} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* V6 — Bento uneven, invert+grayscale.
   Różne col-span / row-span, 1 featured. Subtelny border żeby komórki czytały się w ciemności. */
function V6_Bento() {
  const pattern = [
    { col: 2, row: 2 },
    { col: 2, row: 1 },
    { col: 2, row: 1 },
    { col: 2, row: 1 },
    { col: 1, row: 1 },
    { col: 1, row: 1 },
    { col: 1, row: 1 },
    { col: 1, row: 1 },
    { col: 2, row: 1 },
    { col: 1, row: 1 },
    { col: 1, row: 1 },
    { col: 2, row: 1 },
  ];
  return (
    <div className="grid grid-cols-6 auto-rows-[70px] md:auto-rows-[90px] gap-3">
      {logos.map((src, i) => (
        <div
          key={i}
          className="
            flex items-center justify-center p-3
            border border-white/10 rounded-sm
            hover:border-white/25 transition-colors
          "
          style={{
            gridColumn: `span ${pattern[i].col}`,
            gridRow: `span ${pattern[i].row}`,
          }}
        >
          <LogoCell
            src={src}
            idx={i}
            filter={FILTER_INVERT}
            sizes="(min-width: 768px) 300px, 160px"
          />
        </div>
      ))}
    </div>
  );
}

/* V7 — Asymmetric featured, invert+grayscale.
   1 duży flagowy + 11 mniejszych. Podkreśla flagowego klienta. */
function V7_Featured() {
  const [hero, ...rest] = logos;
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
      <div className="md:col-span-5">
        <div className="h-36 md:h-44">
          <LogoCell
            src={hero}
            idx={0}
            filter={FILTER_INVERT}
            sizes="(min-width: 768px) 400px, 300px"
          />
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-white/50">
          Flagowy klient
        </p>
      </div>

      <div className="md:col-span-7 grid grid-cols-3 sm:grid-cols-4 gap-x-6 gap-y-8">
        {rest.map((src, i) => (
          <div key={i} className="h-12 md:h-14">
            <LogoCell src={src} idx={i + 1} filter={FILTER_INVERT} sizes="120px" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* V8 — Dense 6×2 tight, brightness-lifted (nie invert).
   Małe logosy gęsto — lepiej czyta się bez invertu, z lekkim liftem. */
function V8_Dense() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-6 gap-y-8">
      {logos.map((src, i) => (
        <div key={i} className="h-10 md:h-12">
          <LogoCell src={src} idx={i} filter={FILTER_BRIGHT} sizes="100px" />
        </div>
      ))}
    </div>
  );
}

/* V9 — Split comparison: A vs B vs C w jednej siatce.
   Pokazuje te same 4 logos w trzech trybach obok siebie — do podjęcia decyzji. */
function V9_ABCCompare() {
  const sample = logos.slice(0, 4);
  const cols: { label: string; filter?: string; halo?: boolean }[] = [
    { label: "A · invert", filter: FILTER_INVERT },
    { label: "B · brighten", filter: FILTER_BRIGHT },
    { label: "C · halo", halo: true },
  ];
  return (
    <div className="grid grid-cols-3 gap-x-8">
      {cols.map((col, c) => (
        <div key={c}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-5 text-center">
            {col.label}
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
            {sample.map((src, i) => (
              <div key={i} className="h-14">
                {col.halo ? (
                  <HaloCell src={src} idx={i} />
                ) : (
                  <LogoCell src={src} idx={i} filter={col.filter!} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

export default function LogosGridBlackMockupPage() {
  return (
    <main className="min-h-screen bg-neutral-950 pb-32">
      <header className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#ff7302] font-mono text-xs mb-2">
            /logos-grid-black-mockup
          </p>
          <h1
            className="text-white text-4xl md:text-5xl font-bold mb-3"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            Klient Logos — Grayscale na Czarnym
          </h1>
          <p className="text-white/60 max-w-3xl text-sm leading-relaxed">
            9 wariantów gridowych sekcji „zaufali mi” na czarnym tle. Trzy
            strategie konwersji:{" "}
            <strong className="text-white/80">A · invert+grayscale</strong>{" "}
            (dark-mode klasyka),{" "}
            <strong className="text-white/80">B · brightness-lift</strong>{" "}
            (bez invertu, zachowuje polaryzację logos),{" "}
            <strong className="text-white/80">C · halo</strong> (mleczny spot
            pod logosem, najdelikatniejsze). Wszystko w CSS — jeden plik PNG,
            zero duplikatów.
          </p>
        </div>
      </header>

      <Variant
        n={1}
        title="Invert + grayscale · even 4×3"
        description="Strategia A. Klasyczny dark-mode logo wall — najbezpieczniejszy wybór gdy logosy klientów są ciemne na jasnym tle. Darki stają się jasnymi tonami, wewnętrzne niuanse zostają."
      >
        <V1_InvertEven />
      </Variant>

      <Variant
        n={2}
        title="Brightness-lifted · even 4×3"
        description="Strategia B. Bez invertu — podnosimy jasność i spuszczamy kontrast. Zachowuje oryginalną polaryzację (co było ciemne, nadal ciemniejsze w obrębie logo). Subtelniejsze od V1."
        bgTone="gradient"
      >
        <V2_BrightEven />
      </Variant>

      <Variant
        n={3}
        title="Halo under logo · even 4×3"
        description="Strategia C. Logos zostaje jak jest (grayscale, bez inversji), a pod spodem lekki mleczny radial glow — ciemne detale mają na czym stanąć. Editorial, najdelikatniejsze."
      >
        <V3_HaloEven />
      </Variant>

      <Variant
        n={4}
        title="Hover to full color (halo default)"
        description="Default: tryb halo — logo grayscale + mleczny radial glow pod spodem. Hover: filtr off, pełny kolor, halo fade-out. Standard agencyjny, sygnalizuje że klienci są realni."
      >
        <V4HoverGrid overridesMap={V4_OVERRIDES} />
      </Variant>

      <Variant
        n={5}
        title="Line-separated rows · invert"
        description="Editorial minimal — zero borderów, tylko cienkie białe linie między wierszami. Pasuje do premium / architektury / segmentu B2B."
      >
        <V5_Rows />
      </Variant>

      <Variant
        n={6}
        title="Bento uneven · invert"
        description="Różne col-span / row-span. Cienkie białe obramowania komórek, żeby rytm siatki czytał się w ciemności. 1 featured duży + różne proporcje."
        bgTone="noise"
      >
        <V6_Bento />
      </Variant>

      <Variant
        n={7}
        title="Asymmetric featured · invert"
        description="1 flagowy duży + 11 mniejszych. Podkreśla najważniejszego klienta, reszta jako social proof. Dobre zaraz po mocnym headline."
      >
        <V7_Featured />
      </Variant>

      <Variant
        n={8}
        title="Dense 6×2 · brighten (no invert)"
        description="Małe logosy gęsto w 6 kolumnach. Tutaj brightness-lift czyta się lepiej niż invert — oryginalna polaryzacja zostaje, portfolio robi wrażenie skalą."
        bgTone="gradient"
      >
        <V8_Dense />
      </Variant>

      <Variant
        n={9}
        title="A · B · C — porównanie obok siebie"
        description="Te same 4 logosy w trzech trybach: invert, brightness-lift, halo. Pomocne przy podejmowaniu decyzji który kierunek wybrać na produkcję."
      >
        <V9_ABCCompare />
      </Variant>

      <Variant
        n={10}
        title="V4.1 — Hover to color (Molotow z outer ring)"
        description="Ta sama mechanika co V4, jedna różnica: Molotow w stanie hover dostaje dodatkowy cienki 1px biały zewnętrzny okrąg wokół czarnego koła (plik 6P-dark-plain-ring.webp). Kontur definiuje brzeg koła na czarnym tle bez grubej obwódki."
      >
        <V4HoverGrid overridesMap={V4_1_OVERRIDES} />
      </Variant>

      <footer className="max-w-6xl mx-auto px-6 mt-12 text-sm text-white/40 leading-relaxed">
        <p>
          Wszystkie 3 strategie są czystym CSS (
          <code className="text-white/70 bg-white/5 px-1 rounded">filter</code>{" "}
          na kontenerze lub radialny gradient pod spodem). Zero duplikatów
          plików — tych samych 12 PNG używają wszystkie warianty. Zmiana jednej
          linii zamienia całą sekcję między invert / brighten / halo.
        </p>
      </footer>
    </main>
  );
}
