import Image from "next/image";
import { Fragment, type CSSProperties, type ReactNode } from "react";

/*
  Mockup eksploracji wariantu V10 („V4.1") — trzy warianty kontekstu:
    • W01: V10 na czarnym (baseline — referencja z /logos-grid-black-mockup)
    • W02: V10 na jasnym tle (warm stone) — pełny kolor od razu, bez dark overrides
    • W03: V10 na czarnym w gęstszym gridzie 6-kol (ta sama mechanika, inny rytm)

  Logika V4HoverGrid zduplikowana z /logos-grid-black-mockup/page.tsx.
  Pliki `*-dark.*` i `*-dark-plain-ring.webp` zaprojektowane dla CZARNEGO tła —
  dlatego W02 (jasne tło) używa pustego overrides (oryginały + grayscale + halo off).
*/

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

const FILTER_INVERT = "grayscale(1) invert(1) opacity(0.88)";
const FILTER_PLAIN  = "grayscale(1) opacity(0.85)";

type LogoOverride = {
  defaultSrc?: string;
  defaultFilter?: string;
  hoverSrc?: string;
  showHalo?: boolean;
};

type LogoSpec = {
  defaultSrc: string;
  defaultFilter: string;
  hoverSrc: string;
  showHalo: boolean;
};

const resolveSpec = (
  i: number,
  overridesMap: Record<number, LogoOverride>,
  defaults: { filter: string; halo: boolean } = { filter: FILTER_PLAIN, halo: true }
): LogoSpec => {
  const o = overridesMap[i] ?? {};
  const defaultSrc = o.defaultSrc ?? logos[i];
  return {
    defaultSrc,
    defaultFilter: o.defaultFilter ?? defaults.filter,
    hoverSrc: o.hoverSrc ?? defaultSrc,
    showHalo: o.showHalo ?? defaults.halo,
  };
};

/* ------------------------------------------------------------------ */
/* Overrides                                                           */
/* ------------------------------------------------------------------ */

/* V10 (V4.1) — jak w /logos-grid-black-mockup, z Molotow outer ring 1.5px. */
const V10_OVERRIDES: Record<number, LogoOverride> = {
  5: {
    defaultFilter: FILTER_INVERT,
    showHalo: false,
    hoverSrc: "/logo/clients_logos/6P-dark-plain-ring.webp",
  },
  6: {
    defaultSrc: "/logo/clients_logos/7P-dark.png",
    hoverSrc:   "/logo/clients_logos/7P-dark.png",
  },
  8: {
    defaultFilter: FILTER_INVERT,
    showHalo: false,
    hoverSrc: "/logo/clients_logos/9P-dark.webp",
  },
};

/* Light bg — pusty override, wszystkie logos używają oryginału. Halo wyłączone
   przez `defaults.halo = false` w resolveSpec (halo ma sens tylko na ciemnym). */
const LIGHT_OVERRIDES: Record<number, LogoOverride> = {};

/* ------------------------------------------------------------------ */
/* V10LogoCell — wspólna komórka używana przez Grid i Marquee         */
/* ------------------------------------------------------------------ */

type V10CellProps = {
  idx: number;
  spec: LogoSpec;
  haloRgb: string;
  disableHalo: boolean;
  className?: string;
  sizes?: string;
};

function V10LogoCell({
  idx,
  spec,
  haloRgb,
  disableHalo,
  className = "h-20 md:h-24",
  sizes = "160px",
}: V10CellProps) {
  return (
    <div className={`${className} group relative`}>
      {spec.showHalo && !disableHalo && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out group-hover:opacity-0"
          style={{
            background: `radial-gradient(ellipse at center, rgba(${haloRgb}, 0.12) 0%, rgba(${haloRgb}, 0.04) 35%, rgba(${haloRgb}, 0) 70%)`,
          }}
        />
      )}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-out group-hover:opacity-0"
        style={{ filter: spec.defaultFilter }}
      >
        <Image src={spec.defaultSrc} alt={`Klient ${idx + 1}`} fill sizes={sizes} className="object-contain" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
        <Image src={spec.hoverSrc} alt={`Klient ${idx + 1}`} fill sizes={sizes} className="object-contain" />
      </div>
    </div>
  );
}

type RenderOpts = {
  overridesMap: Record<number, LogoOverride>;
  haloRgb: string;
  disableHalo: boolean;
  defaultFilter: string;
};

const specFor = (i: number, opts: RenderOpts): LogoSpec =>
  resolveSpec(i, opts.overridesMap, { filter: opts.defaultFilter, halo: !opts.disableHalo });

/* ------------------------------------------------------------------ */
/* V4HoverGrid — parametryzowany kontenerem + rozmiarem komórki       */
/* ------------------------------------------------------------------ */

type V4GridProps = {
  overridesMap: Record<number, LogoOverride>;
  gridClassName?: string;
  cellClassName?: string;
  haloRgb?: string;
  disableHalo?: boolean;
  defaultFilter?: string;
};

function V4HoverGrid({
  overridesMap,
  gridClassName = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-10",
  cellClassName = "h-20 md:h-24",
  haloRgb = "255, 255, 255",
  disableHalo = false,
  defaultFilter = FILTER_PLAIN,
}: V4GridProps) {
  const opts: RenderOpts = { overridesMap, haloRgb, disableHalo, defaultFilter };
  return (
    <div className={gridClassName}>
      {logos.map((_, i) => (
        <V10LogoCell key={i} idx={i} spec={specFor(i, opts)} haloRgb={haloRgb} disableHalo={disableHalo} className={cellClassName} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* V4HoverMarquee — nieskończony poziomy loop z V10 hover-to-color    */
/* ------------------------------------------------------------------ */

type V4MarqueeProps = {
  overridesMap: Record<number, LogoOverride>;
  haloRgb?: string;
  disableHalo?: boolean;
  defaultFilter?: string;
  durationSec?: number;
  /** szerokość pojedynczej komórki (liczba × rem) — ustawia też wysokość */
  cellWidthPx?: number;
  cellHeightPx?: number;
};

function V4HoverMarquee({
  overridesMap,
  haloRgb = "255, 255, 255",
  disableHalo = false,
  defaultFilter = FILTER_PLAIN,
  durationSec = 60,
  cellWidthPx = 180,
  cellHeightPx = 80,
}: V4MarqueeProps) {
  const opts: RenderOpts = { overridesMap, haloRgb, disableHalo, defaultFilter };
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          className="flex flex-none gap-16 py-3 animate-move-right hover:[animation-play-state:paused]"
          style={{ animationDuration: `${durationSec}s` }}
        >
          {[0, 1].map((rep) => (
            <Fragment key={rep}>
              {logos.map((_, i) => (
                <div
                  key={`${rep}-${i}`}
                  className="flex-none"
                  style={{ width: `${cellWidthPx}px`, height: `${cellHeightPx}px` }}
                >
                  <V10LogoCell
                    idx={i}
                    spec={specFor(i, opts)}
                    haloRgb={haloRgb}
                    disableHalo={disableHalo}
                    className="w-full h-full"
                    sizes={`${cellWidthPx}px`}
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

/* ------------------------------------------------------------------ */
/* Creative layouts                                                    */
/* ------------------------------------------------------------------ */

/* Staggered brick — rzędy w zygzak, co drugi offset o połowę komórki.
   12 logosów = 3 rzędy po 4. Rzędy 0 i 2 bez offsetu, rząd 1 z offsetem. */
function V10Staggered({ overridesMap, haloRgb = "255, 255, 255", disableHalo = false, defaultFilter = FILTER_PLAIN }: V4GridProps) {
  const opts: RenderOpts = { overridesMap, haloRgb, disableHalo, defaultFilter };
  return (
    <div className="space-y-10">
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          className="grid grid-cols-4 gap-x-10"
          style={row % 2 === 1 ? { paddingLeft: "calc(100% / 8)", paddingRight: "calc(100% / 8)" } : undefined}
        >
          {logos.slice(row * 4, row * 4 + 4).map((_, j) => {
            const i = row * 4 + j;
            return (
              <V10LogoCell
                key={i}
                idx={i}
                spec={specFor(i, opts)}
                haloRgb={haloRgb}
                disableHalo={disableHalo}
                className="h-16 md:h-20"
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* Pyramid — 5 / 4 / 3 malejąco, każdy rząd centered. Kierunek flagi wyższej ważniejszy. */
function V10Pyramid({ overridesMap, haloRgb = "255, 255, 255", disableHalo = false, defaultFilter = FILTER_PLAIN }: V4GridProps) {
  const opts: RenderOpts = { overridesMap, haloRgb, disableHalo, defaultFilter };
  const rows = [
    { count: 5, start: 0 },
    { count: 4, start: 5 },
    { count: 3, start: 9 },
  ];
  return (
    <div className="space-y-10">
      {rows.map((r, idx) => (
        <div key={idx} className="flex justify-center gap-8 md:gap-12 flex-wrap">
          {Array.from({ length: r.count }).map((_, j) => {
            const i = r.start + j;
            return (
              <div key={i} className="w-[120px] md:w-[140px]">
                <V10LogoCell
                  idx={i}
                  spec={specFor(i, opts)}
                  haloRgb={haloRgb}
                  disableHalo={disableHalo}
                  className="h-14 md:h-16"
                  sizes="140px"
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* Asymmetric columns — 3 kolumny o różnych szerokościach (5fr / 3fr / 4fr).
   Każda kolumna to stack 4 logosów. Editorial / magazyn. */
function V10AsymmetricCols({ overridesMap, haloRgb = "255, 255, 255", disableHalo = false, defaultFilter = FILTER_PLAIN }: V4GridProps) {
  const opts: RenderOpts = { overridesMap, haloRgb, disableHalo, defaultFilter };
  return (
    <div className="grid gap-x-10 md:grid-cols-[5fr_3fr_4fr]">
      {[0, 1, 2].map((col) => (
        <div key={col} className="flex flex-col gap-y-8 py-2">
          {logos.slice(col * 4, col * 4 + 4).map((_, j) => {
            const i = col * 4 + j;
            return (
              <V10LogoCell
                key={i}
                idx={i}
                spec={specFor(i, opts)}
                haloRgb={haloRgb}
                disableHalo={disableHalo}
                className="h-14 md:h-16"
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section wrapper                                                     */
/* ------------------------------------------------------------------ */

type SectionProps = {
  n: number;
  title: string;
  description: string;
  bgStyle: CSSProperties;
  children: ReactNode;
  titleColor?: string;
  descColor?: string;
};

const Section = ({ n, title, description, bgStyle, children, titleColor = "text-white", descColor = "text-white/60" }: SectionProps) => (
  <section className="mb-20">
    <div className="max-w-6xl mx-auto px-6 mb-4">
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-[#ff7302] font-mono text-xs">W{n.toString().padStart(2, "0")}</span>
        <h2 className={`${titleColor} text-xl font-semibold`}>{title}</h2>
      </div>
      <p className={`${descColor} text-sm max-w-3xl`}>{description}</p>
    </div>
    <div className="border-y border-white/5" style={bgStyle}>
      <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">{children}</div>
    </div>
  </section>
);

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

export default function V10VariationsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 pb-32">
      <header className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#ff7302] font-mono text-xs mb-2">/logos-grid-v10-mockup</p>
          <h1
            className="text-white text-4xl md:text-5xl font-bold mb-3"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            V10 (V4.1) — warianty kontekstu i layoutu
          </h1>
          <p className="text-white/60 max-w-3xl text-sm leading-relaxed">
            Ta sama mechanika hover-to-color w 11 kontekstach: W01 baseline,
            W02 warm cream (brand-aligned jasne tło), W03 dense grid,
            W04 marquee (infinite loop, pause on hover), W05 staggered brick,
            W06 pyramid, W07 asymmetric columns, W08–W11 „less dark" — różne
            odcienie ciemnego tła między pure black a jasnym (neutral gray,
            warm charcoal, vertical gradient, radial spotlight). Molotow
            dostaje 1.5px biały zewnętrzny pierścień z offsetem 1px na hover
            wszędzie gdzie dark overrides są aktywne.
          </p>
        </div>
      </header>

      <Section
        n={1}
        title="V10 · baseline (czarne tło, even 4×3)"
        description="Referencyjny V10: even 4 kolumny, dark overrides aktywne (Molotow z pierścieniem 1.5px + 1px offset, NIW dark-ready, NCK czerwona ikona + biały tekst), halo pod spodem w default."
        bgStyle={{ background: "#000" }}
      >
        <V4HoverGrid overridesMap={V10_OVERRIDES} haloRgb="255, 255, 255" />
      </Section>

      <Section
        n={2}
        title="V10 · jasne tło (warm cream, brand-aligned)"
        description="To samo zachowanie na ciepłym kremowym tle z subtelnym gradientem (#faf5ec → #f2e8d5). Pasuje do brandu AeroMat (ciepły orange), kojarzy się z farbą / ścianą / muralem. Dark overrides NIEaktywne — wszystkie logos używają oryginałów. Default = grayscale, hover = pełny kolor. Halo off."
        bgStyle={{
          background: "linear-gradient(180deg, #faf5ec 0%, #f2e8d5 100%)",
        }}
      >
        <V4HoverGrid overridesMap={LIGHT_OVERRIDES} disableHalo />
      </Section>

      <Section
        n={3}
        title="V10 · dense 6-kol na czarnym"
        description="Ta sama mechanika dark overrides co W01, ale gęstszy 6-kolumnowy grid (logos mniejsze, 2 rzędy). Działa gdy masz dużo klientów albo chcesz logosy jako akcent poniżej headline'u, nie jako główny focus."
        bgStyle={{ background: "#000" }}
      >
        <V4HoverGrid
          overridesMap={V10_OVERRIDES}
          gridClassName="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-6 gap-y-8"
          cellClassName="h-14 md:h-16"
          haloRgb="255, 255, 255"
        />
      </Section>

      <Section
        n={4}
        title="V10 · Marquee (infinite horizontal loop)"
        description="Nieskończony poziomy scroll (animate-move-right, 60s/pełny cykl). Pause on hover — jak TapeRight na produkcji. Fade maski po bokach. Hover na konkretnym logo wciąż pokazuje pełny kolor (V10 mechanika). Użyj gdy chcesz ciągły ruch, nie statyczną ścianę."
        bgStyle={{ background: "#000" }}
      >
        <V4HoverMarquee overridesMap={V10_OVERRIDES} durationSec={60} cellWidthPx={170} cellHeightPx={80} />
      </Section>

      <Section
        n={5}
        title="V10 · Staggered brick (rzędy w zygzak)"
        description="3 rzędy po 4 logosy, co drugi rząd przesunięty o połowę komórki. Dynamiczny rytm, czyta się jak cegły na ścianie. Dobre gdy chcesz mniej sztywnego rasteryzmu niż even 4×3."
        bgStyle={{ background: "#000" }}
      >
        <V10Staggered overridesMap={V10_OVERRIDES} />
      </Section>

      <Section
        n={6}
        title="V10 · Pyramid (5 / 4 / 3 malejąco)"
        description="Piramida: 5 logos w górnym rzędzie, 4 w środkowym, 3 na dole. Każdy rząd centered. Wagowo: najważniejsi klienci w górze (najszerszy rząd = najsilniejsze social proof), mniej znani na dole."
        bgStyle={{ background: "#000" }}
      >
        <V10Pyramid overridesMap={V10_OVERRIDES} />
      </Section>

      <Section
        n={7}
        title="V10 · Asymmetric columns (editorial 5fr / 3fr / 4fr)"
        description="3 kolumny o różnych szerokościach, każda stack 4 logosów. Rytm jak w magazynie / editorial layoucie. Można mapować kolumny do kategorii klientów (np. duzi / średni / mali albo branże)."
        bgStyle={{ background: "#000" }}
      >
        <V10AsymmetricCols overridesMap={V10_OVERRIDES} />
      </Section>

      {/* ============================================================
           „Less dark" — ciemne, ale nie pure black.
           Te same V10_OVERRIDES, różne odcienie tła.
           ============================================================ */}

      <Section
        n={8}
        title="V10 · neutral dark gray (#1a1a1a)"
        description="Płaski neutralny ciemny szary. Modern / industrial look. Zachowuje kontrast z białymi sylwetkami (Molotow, NIW, NCK) ale nie jest tak surowe jak pure black — sekcja nie wygląda jak „dziura” w stronie."
        bgStyle={{ background: "#1a1a1a" }}
      >
        <V4HoverGrid overridesMap={V10_OVERRIDES} />
      </Section>

      <Section
        n={9}
        title="V10 · warm charcoal (#1d1915)"
        description="Ciepły ciemny szary z lekkim brązowym podtonem. Pasuje do AeroMat (pomarańczowy brand) — czuć że sekcja jest z tej samej palety co reszta strony. Nie zimny, nie neutralny — „warm dark wall”."
        bgStyle={{ background: "#1d1915" }}
      >
        <V4HoverGrid overridesMap={V10_OVERRIDES} />
      </Section>

      <Section
        n={10}
        title="V10 · vertical lift (#0a0a0a → #1f1c18)"
        description="Subtelny gradient z góry do dołu: prawie czarny → warm charcoal. Sekcja robi wrażenie oświetlonej od dołu / lekko „podświetlonej”. Płynne przejście do sąsiednich sekcji jeśli obie są dark."
        bgStyle={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #1f1c18 100%)",
        }}
      >
        <V4HoverGrid overridesMap={V10_OVERRIDES} />
      </Section>

      <Section
        n={11}
        title="V10 · warm radial spotlight (#211c16 center → #0a0806 edges)"
        description="Radialny gradient z rozjaśnionym centrum (warm charcoal) i ciemnymi brzegami (prawie black). Efekt delikatnego „oświetlenia” — wygląda jakby logosy były na ścianie oświetlonej reflektorem. Najbardziej cinematic z grupy."
        bgStyle={{
          background:
            "radial-gradient(ellipse at center, #211c16 0%, #0a0806 70%)",
        }}
      >
        <V4HoverGrid overridesMap={V10_OVERRIDES} />
      </Section>

      <footer className="max-w-6xl mx-auto px-6 mt-12 text-sm text-white/40 leading-relaxed">
        <p>
          Wspólny komponent <code className="text-white/70 bg-white/5 px-1 rounded">V10LogoCell</code> obsługuje wszystkie
          warianty (Grid, Marquee, Staggered, Pyramid, Asymmetric). Każdy layout to tylko inny wrapper — cała logika
          hover-to-color (halo + dwie warstwy Image + filter transitions + per-logo overrides) współdzielona.
        </p>
      </footer>
    </main>
  );
}
