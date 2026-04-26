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
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

type LogoCellProps = {
  src: string;
  idx: number;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
};

const LogoCell = ({
  src,
  idx,
  sizes = "160px",
  className = "",
  style,
}: LogoCellProps) => (
  <div
    className={`relative w-full h-full flex items-center justify-center ${className}`}
    style={style}
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

/* Monotone cell (mask trick) — recolors any transparent PNG to one solid color. */
const MaskedCell = ({
  src,
  idx,
  color,
}: {
  src: string;
  idx: number;
  color: string;
}) => (
  <div
    role="img"
    aria-label={`Klient ${idx + 1}`}
    className="w-full h-full"
    style={{
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      WebkitMaskSize: "contain",
      maskSize: "contain",
      backgroundColor: color,
    }}
  />
);

/* ------------------------------------------------------------------ */
/* Section wrapper                                                     */
/* ------------------------------------------------------------------ */

type VariantProps = {
  n: number;
  title: string;
  description: string;
  background: "white" | "stone" | "dark" | "black";
  children: ReactNode;
};

const bgClass: Record<VariantProps["background"], string> = {
  white: "bg-white",
  stone: "bg-stone-100",
  dark:  "bg-neutral-900",
  black: "bg-black",
};

const Variant = ({ n, title, description, background, children }: VariantProps) => (
  <section className="mb-20">
    <div className="max-w-6xl mx-auto px-6 mb-4">
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-[#ff7302] font-mono text-xs">V{n.toString().padStart(2, "0")}</span>
        <h2 className="text-white text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-white/50 text-sm max-w-3xl">{description}</p>
    </div>

    <div className={`${bgClass[background]} border-y border-white/5`}>
      <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">{children}</div>
    </div>
  </section>
);

/* ================================================================== */
/* Variants                                                            */
/* ================================================================== */

/* V1 — Even 4×3 grid, grayscale, white background.
   Klasyczna ściana klientów: równe komórki, ten sam rozmiar, czysty grayscale. */
function V1_Even() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-10 gap-y-12">
      {logos.map((src, i) => (
        <div key={i} className="h-16 md:h-20">
          <LogoCell
            src={src}
            idx={i}
            className="[filter:grayscale(1)_contrast(0.9)] opacity-80"
          />
        </div>
      ))}
    </div>
  );
}

/* V2 — Hover-to-color. Domyślnie szare + 60% opacity, hover = pełny kolor + 100%.
   Standard agencyjny: zachęca do interakcji, zdradza, że są to realni klienci. */
function V2_HoverToColor() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-10 gap-y-12">
      {logos.map((src, i) => (
        <div key={i} className="h-16 md:h-20">
          <LogoCell
            src={src}
            idx={i}
            className="
              [filter:grayscale(1)] opacity-60
              transition-all duration-500 ease-out
              hover:[filter:grayscale(0)] hover:opacity-100
            "
          />
        </div>
      ))}
    </div>
  );
}

/* V3 — Bento uneven grid. Różne col-span + row-span. Niektóre logos większe.
   Ciekawszy rytm, dobry kiedy chcesz podkreślić wybranych klientów. */
function V3_Bento() {
  // Pattern: pierwsze 3 duże (col-span-2), reszta po 1. Dzielone na 6 kolumn.
  const pattern = [
    { col: 2, row: 2 }, // featured 1
    { col: 2, row: 1 }, // wide
    { col: 2, row: 1 }, // wide
    { col: 2, row: 1 }, // wide
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
            flex items-center justify-center
            border border-black/5 rounded-sm
            hover:border-black/15 transition-colors
          "
          style={{
            gridColumn: `span ${pattern[i].col}`,
            gridRow: `span ${pattern[i].row}`,
          }}
        >
          <LogoCell
            src={src}
            idx={i}
            sizes="(min-width: 768px) 300px, 160px"
            className="[filter:grayscale(1)] opacity-75 p-3"
          />
        </div>
      ))}
    </div>
  );
}

/* V4 — Line-separated rows. Zero borderów na komórkach, tylko cienkie linie między wierszami.
   Bardzo minimalistyczny, editorial feel, pasuje do premium / architektury. */
function V4_Rows() {
  const perRow = 4;
  const rows: string[][] = [];
  for (let i = 0; i < logos.length; i += perRow) rows.push(logos.slice(i, i + perRow));

  return (
    <div className="divide-y divide-black/10">
      {rows.map((row, r) => (
        <div key={r} className="grid grid-cols-4 py-8 md:py-10 gap-x-6">
          {row.map((src, i) => (
            <div key={i} className="h-14 md:h-16">
              <LogoCell
                src={src}
                idx={r * perRow + i}
                className="[filter:grayscale(1)] opacity-70"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* V5 — Tight dense 6×2. Małe logosy, duże zagęszczenie.
   Działa gdy masz dużo logosów i chcesz pokazać skalę portfolio bez rozlewania sekcji. */
function V5_Dense() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-6 gap-y-8">
      {logos.map((src, i) => (
        <div key={i} className="h-10 md:h-12">
          <LogoCell
            src={src}
            idx={i}
            sizes="100px"
            className="[filter:grayscale(1)] opacity-70"
          />
        </div>
      ))}
    </div>
  );
}

/* V6 — Asymmetric featured. Jeden duży logo + siatka mniejszych obok.
   Editorial hero — podkreśla flagowego klienta, reszta jako social proof. */
function V6_Featured() {
  const [hero, ...rest] = logos;
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
      {/* Featured */}
      <div className="md:col-span-5">
        <div className="h-36 md:h-44">
          <LogoCell
            src={hero}
            idx={0}
            sizes="(min-width: 768px) 400px, 300px"
            className="[filter:grayscale(1)] opacity-90"
          />
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-black/50">
          Flagowy klient
        </p>
      </div>

      {/* Grid reszty */}
      <div className="md:col-span-7 grid grid-cols-3 sm:grid-cols-4 gap-x-6 gap-y-8">
        {rest.map((src, i) => (
          <div key={i} className="h-12 md:h-14">
            <LogoCell
              src={src}
              idx={i + 1}
              sizes="120px"
              className="[filter:grayscale(1)] opacity-65"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* V7 — Duotone orange na dark bg. Logosy przemalowane mask-trickiem na brand #ff7302.
   Mocny statement, dobry jako "logo wall" w ciemnej sekcji kampanii. */
function V7_DuotoneOrange() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-10 gap-y-12">
      {logos.map((src, i) => (
        <div key={i} className="h-14 md:h-16">
          <MaskedCell src={src} idx={i} color="#ff7302" />
        </div>
      ))}
    </div>
  );
}

/* V8 — Białe sylwetki na czarnym tle. Każde logo sprowadzone do jednej wagi.
   Najbardziej uniwersalne na ciemnym tle — logosy kolorowe tutaj nie gryzą z bg. */
function V8_WhiteSilhouettes() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-10 gap-y-12">
      {logos.map((src, i) => (
        <div key={i} className="h-14 md:h-16">
          <MaskedCell src={src} idx={i} color="rgba(255,255,255,0.85)" />
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

export default function LogosGridMockupPage() {
  return (
    <main className="min-h-screen bg-neutral-950 pb-32">
      {/* Header */}
      <header className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#ff7302] font-mono text-xs mb-2">
            /logos-grid-mockup
          </p>
          <h1
            className="text-white text-4xl md:text-5xl font-bold mb-3"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            Klient Logos — Grid Wall
          </h1>
          <p className="text-white/60 max-w-3xl text-sm leading-relaxed">
            8 wariantów gridowych sekcji „zaufali mi”. Zero kart, zero marquee —
            same siatki. Wszędzie użyto tego samego źródłowego PNG;
            grayscale/duotone/white-silhouette zrobione w CSS (
            <code className="text-white/80 bg-white/5 px-1 rounded">
              filter: grayscale(1)
            </code>{" "}
            lub mask-trick), bez osobnych plików.
          </p>
        </div>
      </header>

      <Variant
        n={1}
        title="Even 4×3 grid"
        description="Najprostszy i najbezpieczniejszy wybór. Równe komórki, białe tło, grayscale + 80% opacity. Działa jako fallback i jako finalny wariant."
        background="white"
      >
        <V1_Even />
      </Variant>

      <Variant
        n={2}
        title="Hover-to-color"
        description="Klasyczny trick agencyjny: domyślnie szary i wyciszony (60%), na hover pełny kolor i 100%. Zaprasza do interakcji, sygnalizuje że klienci są realni."
        background="white"
      >
        <V2_HoverToColor />
      </Variant>

      <Variant
        n={3}
        title="Bento uneven grid"
        description="Różne col-span i row-span — jeden featured duży, trzy wide, reszta mała. Ciekawszy rytm, lekkie cienie komórek na hover."
        background="stone"
      >
        <V3_Bento />
      </Variant>

      <Variant
        n={4}
        title="Line-separated rows"
        description="Zero borderów na komórkach, tylko cienkie poziome linie pomiędzy wierszami. Bardzo minimalistyczne, editorial feel — pasuje do premium / architektury."
        background="white"
      >
        <V4_Rows />
      </Variant>

      <Variant
        n={5}
        title="Dense 6×2 tight"
        description="Małe logosy, duże zagęszczenie. Sygnalizuje skalę portfolio bez rozciągania sekcji. Przydatne gdy liczba klientów > 20."
        background="stone"
      >
        <V5_Dense />
      </Variant>

      <Variant
        n={6}
        title="Asymmetric featured"
        description="1 duży + 11 mniejszych, układ editorial. Wyróżnia flagowego klienta, reszta jako tło social proof. Dobre po długim headline nad sekcją."
        background="white"
      >
        <V6_Featured />
      </Variant>

      <Variant
        n={7}
        title="Duotone orange (dark bg)"
        description="Logosy przemalowane na brand #ff7302 przez CSS mask. Wszystkie sprowadzone do jednej barwy — mocny statement dla kampanii."
        background="dark"
      >
        <V7_DuotoneOrange />
      </Variant>

      <Variant
        n={8}
        title="White silhouettes (black bg)"
        description="Każde logo jako pojedyncza biała sylwetka na czarnym tle. Najbardziej uniwersalne na dark sections — nic nie gryzie się z tłem."
        background="black"
      >
        <V8_WhiteSilhouettes />
      </Variant>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 mt-12 text-sm text-white/40 leading-relaxed">
        <p>
          Grayscale jest zrobiony w CSS (<code className="text-white/70 bg-white/5 px-1 rounded">filter: grayscale(1)</code>).
          Monotone (orange / white) przez <code className="text-white/70 bg-white/5 px-1 rounded">mask-image</code> +
          <code className="text-white/70 bg-white/5 px-1 rounded"> background-color</code> — to ten sam plik PNG renderowany jako maska.
          Zero duplikacji plików, jedno źródło prawdy.
        </p>
      </footer>
    </main>
  );
}
