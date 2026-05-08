import Link from "next/link";

type Mockup = {
  path: string;
  label: string;
  tag: "hero" | "section" | "typography" | "layout";
  description: string;
  count?: string;
};

const mockups: Mockup[] = [
  {
    path: "/hero-mockup",
    label: "Hero Video Section",
    tag: "hero",
    description:
      "8 wariantów sekcji hero: current (film strips), minimalist, horizontal marquee, cinematic letterbox, split-screen, duotone orange, spotlight circular, floating poster badge.",
    count: "8 wariantów",
  },
  {
    path: "/glitch-mockup",
    label: "Glitch Hero (prototyp)",
    tag: "hero",
    description:
      "Wczesny prototyp hero z efektami glitch. Eksploracja skanlinii, RGB split, neon pulse.",
  },
  {
    path: "/gradient-mockup",
    label: "Hero Bottom Gradient",
    tag: "hero",
    description:
      "Warianty gradientu na dole hero (mask fade vs solid overlay). Kontrola jak video przechodzi w sekcję Intro.",
  },
  {
    path: "/hero-copy-mockup",
    label: "Hero Paragraph — copy",
    tag: "hero",
    description:
      "10 propozycji paragrafu pod CTA w hero. Punkt wyjścia: „Murale, które przyciągają wzrok” + język korzyści (konkretny zysk, liczby, porównanie do kampanii, perspektywa klienta).",
    count: "10 wariantów",
  },
  {
    path: "/hero-copy-v3-mockup",
    label: "Hero Copy #3 — 12 stylizacji (video)",
    tag: "hero",
    description:
      "13 pełnoekranowych sekcji hero (z video) z tą samą kopią (wariant #3: „szara ściana = stracona szansa…”). Trzy zestawy typograficzne: Bebas Neue + Space Grotesk (6 + wariacja V4 bottom-center = 7), Archivo Black + Space 300 (3), Anton + Space (3). Różne layouty: center, left rail, orange accent, outlined, stacked diagonal, frosted card, mega impact, editorial left, paint stroke.",
    count: "13 wariantów",
  },

  {
    path: "/trusted-mockup",
    label: "Trusted-By Glow (main)",
    tag: "section",
    description:
      "25 wariantów gradientu za paskiem logo klientów: różne wysokości, intensywności, pomarańczowe + specjalne (radial spotlight, scanlines, aurora, film perforations, color-shift, noise grain).",
    count: "25 wariantów",
  },
  {
    path: "/trusted-mockup-top3",
    label: "Trusted-By Top 3 · mutacje",
    tag: "section",
    description:
      "Pogłębienie 3 najciekawszych kierunków: inverted vignette (8×), neon line + bloom (8×), aurora wash (8×). Od subtelnych do mocnych.",
    count: "24 warianty",
  },
  {
    path: "/logos-grid-mockup",
    label: "Logos — Grid Wall (bez kart, bez marquee)",
    tag: "section",
    description:
      "8 wariantów gridowych sekcji „zaufali mi”: even 4×3, hover-to-color, bento uneven, line-separated rows, dense 6×2, asymmetric featured, duotone orange (dark), white silhouettes (black). Wszystkie grayscale/monotone zrobione w CSS (filter + mask) — zero duplikatów PNG.",
    count: "8 wariantów",
  },
  {
    path: "/logos-grid-black-mockup",
    label: "Logos — Grayscale na Czarnym",
    tag: "section",
    description:
      "9 wariantów sekcji „zaufali mi” na czarnym tle. Trzy strategie konwersji ciemnych logosów: A · invert+grayscale (dark-mode klasyka), B · brightness-lift (bez invertu, zachowuje polaryzację), C · halo (mleczny spot pod logosem). Layouty: even, bento, rows, featured, dense, ABC-compare. Wszystko CSS filter — jedno źródło PNG.",
    count: "9 wariantów",
  },
  {
    path: "/logos-grid-v10-mockup",
    label: "Logos — V10 (V4.1) · 11 wariantów kontekstu i layoutu",
    tag: "section",
    description:
      "Pogłębienie V10: W01 baseline, W02 warm cream (jasne), W03 dense 6-kol, W04 marquee infinite loop, W05 staggered brick, W06 pyramid 5/4/3, W07 asymmetric columns, W08–W11 „less dark” (neutral gray #1a1a1a, warm charcoal #1d1915, vertical gradient, radial spotlight) — ciemne tła pośrednie między pure black a jasnym. Wspólny V10LogoCell dla wszystkich.",
    count: "11 wariantów",
  },
  {
    path: "/panorama-typography-mockup",
    label: "Panorama Typography",
    tag: "section",
    description:
      "Warianty typografii nad sekcją panoramiczną — headline + caption w różnych stylach.",
  },
  {
    path: "/testimonials-wheel-mockup",
    label: "Testimonials Wheel",
    tag: "section",
    description: "Animowane koło z opiniami klientów. Warianty rotacji i interakcji.",
  },
  {
    path: "/footer-mockup",
    label: "Footer",
    tag: "layout",
    description: "Warianty footera (dark vs light gradient, układ kolumn, social icons).",
  },
  {
    path: "/kontakt-mockup",
    label: "Kontakt — krótki formularz + zdjęcie",
    tag: "layout",
    description:
      "6 wariantów sekcji kontakt zbudowanych wokół zasady „3 pola + portret Mateusza”. Spójne z resztą strony (czarne tło, akcent #ff7302, Bebas + Space Grotesk + Syne). V1 Editorial Split (50/50 magazynowy), V2 Postcard on Photo (frosted card na pełnoekranowym portrecie), V3 Horizontal Banner (wąski pasek portretu + 3 pola w wierszu), V4 Diagonal Paint Stroke (clip-path + pomarańczowa smuga), V5 Cream Card (jasny wariant editorial), V6 Floating Panel (szklisty panel formularza w rogu hero portretu).",
    count: "6 wariantów",
  },

  {
    path: "/portfolio-home-mockup",
    label: "Portfolio — home section (masonry 4-kol)",
    tag: "section",
    description:
      "Replika layoutu sekcji #home-portfolio z cam-l.pl: 4-kolumnowy elastic masonry (12 kafelków w mieszanych rozmiarach 25%/50%, gutter 2px), hover overlay w kolorze projektu (fade ~1s cubic-bezier(0,1,.5,1)), scale na tytule, CTA see-through (#3d929e → #008f9d). Zero kadrowania: aspect-ratio każdego kafelka = aspect-ratio zdjęcia AeroMat. Content z /public/Portfolio.",
    count: "12 kafelków",
  },
  {
    path: "/portfolio-card-variants-mockup",
    label: "Portfolio Card — 4 warianty karty",
    tag: "section",
    description:
      "Ta sama siatka 4-kol / 12 kafelków co w /portfolio-home-mockup, ale obraz mniejszy — karta ma obszar na metadane. Warianty: V1 Classic (białe tło, ramka, tytuł + kategoria + opis), V2 Dark (czarne tło, akcent #ff7302 z home), V3 Label inline (obraz wypełnia, pasek z gradientem na dole), V4 Polaroid (ramka wokół obrazu, kremowe tło, serif).",
    count: "4 warianty",
  },
  {
    path: "/portfolio-animation-variants-mockup",
    label: "Portfolio Animation — 16 wariantów anti-crop (4×4)",
    tag: "section",
    description:
      "Replika animacji home (Card intro „Murale Wielkoformatowe” + Portfolio) z przełącznikiem 16 wariantów siatki portfolio bez kadrowania. Cztery strategie po cztery sub-warianty: V1 Justified Rows (rzędy o równej wysokości, zmienne szerokości), V2 Aspect Bento (CSS Grid, aspect-ratio komórki = aspect-ratio zdjęcia), V3 Masonry Columns (CSS columns, kaskada), V4 Row-span Masonry (CSS Grid + grid-row span policzony z aspect-ratio). Dane: portfolioPhotos (Murale, 11 zdjęć).",
    count: "16 wariantów",
  },

  {
    path: "/typography-mockup",
    label: "Typografia · 12 par fontów",
    tag: "typography",
    description:
      "12 zestawów heading + paragraph. Pierwsze 6 z fontów już na stronie (Anton, Bebas, Syne, Inter, Caveat, Space Grotesk). Kolejne 6 z bold/extra-bold displays (Archivo Black, Oswald, Unbounded, Bricolage).",
    count: "12 par",
  },
];

const tagStyle: Record<Mockup["tag"], { bg: string; label: string }> = {
  hero:       { bg: "bg-[#ff7302] text-white",    label: "HERO" },
  section:    { bg: "bg-blue-500 text-white",     label: "SECTION" },
  layout:     { bg: "bg-neutral-500 text-white",  label: "LAYOUT" },
  typography: { bg: "bg-purple-500 text-white",   label: "TYPOGRAPHY" },
};

const grouped: Record<Mockup["tag"], Mockup[]> = {
  hero: mockups.filter((m) => m.tag === "hero"),
  section: mockups.filter((m) => m.tag === "section"),
  typography: mockups.filter((m) => m.tag === "typography"),
  layout: mockups.filter((m) => m.tag === "layout"),
};

const groupOrder: Mockup["tag"][] = ["hero", "section", "typography", "layout"];
const groupHeading: Record<Mockup["tag"], string> = {
  hero: "Hero Section",
  section: "Sekcje strony",
  typography: "Typografia",
  layout: "Layout",
};

export default function MockupsIndexPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-anton)" }}>
          Mockupy / warianty designerskie
        </h1>
        <p className="text-white/60 mb-12 text-sm max-w-2xl">
          Indeks wszystkich stron mockupów — narzędzia do eksploracji wariantów UI przed wdrożeniem
          na produkcję. Każda strona pokazuje kilka–kilkadziesiąt propozycji tej samej sekcji.
        </p>

        {groupOrder.map((tag) => {
          const items = grouped[tag];
          if (!items.length) return null;
          return (
            <section key={tag} className="mb-14">
              <h2 className="text-xl font-semibold mb-5 text-[#ff7302]">{groupHeading[tag]}</h2>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {items.map((m) => {
                  const t = tagStyle[m.tag];
                  return (
                    <Link
                      key={m.path}
                      href={m.path}
                      className="group relative border border-white/10 rounded-lg p-5 hover:border-[#ff7302] transition bg-black/40 hover:bg-black/60"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className={`${t.bg} px-2 py-0.5 text-[10px] font-bold tracking-widest rounded`}>
                          {t.label}
                        </span>
                        {m.count && (
                          <span className="text-[#ff7302] text-xs font-mono">{m.count}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-[#ff7302] transition">
                        {m.label}
                      </h3>
                      <p className="text-sm text-white/60 leading-relaxed">{m.description}</p>
                      <p className="text-xs text-white/30 mt-3 font-mono">{m.path}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className="mt-20 pt-8 border-t border-white/10 text-sm text-white/40">
          <p>
            Łącznie: <strong className="text-white/70">{mockups.length} stron mockupów</strong>,
            po której powinna trafiać tylko świadoma decyzja o wdrożeniu wybranego wariantu do produkcji.
          </p>
          <p className="mt-2">
            Strony mockupów nie są indeksowane w menu — dostęp tylko przez URL lub ten index.
          </p>
        </div>
      </div>
    </main>
  );
}
