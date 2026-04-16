import type { ReactNode } from "react";
import { Oswald, Archivo_Black, Unbounded, Bricolage_Grotesque } from "next/font/google";

// NEW display fonts loaded ONLY on this mockup page (nie wpływa na bundle głównej strony)
const oswald = Oswald({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
const archivoBlack = Archivo_Black({
  weight: "400", // naturalnie "black" — rendering jak 900
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
const unbounded = Unbounded({
  weight: ["700", "800", "900"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
const bricolage = Bricolage_Grotesque({
  weight: ["400", "700", "800"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

type Pair = {
  n: number;
  label: string;
  vibe: string;
  headingFont: string; // CSS var
  bodyFont: string; // CSS var
  headingWeight?: number;
  bodyWeight?: number;
  headingStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
};

const PAIRS: Pair[] = [
  {
    n: 1,
    label: "Anton + Inter",
    vibe: "Editorialny, kinowy plakat. Mocny nagłówek, neutralne body.",
    headingFont: "var(--font-anton)",
    bodyFont: "var(--font-inter)",
    headingWeight: 400,
    bodyWeight: 400,
  },
  {
    n: 2,
    label: "Bebas Neue + Space Grotesk",
    vibe: "Współczesna marka, techno-przemysłowa. Condensed caps + geometric.",
    headingFont: "var(--font-bebas)",
    bodyFont: "var(--font-space)",
    headingWeight: 400,
    bodyWeight: 400,
    headingStyle: { letterSpacing: "0.02em" },
  },
  {
    n: 3,
    label: "Syne + Inter",
    vibe: "Galeryjny, art-studio. Wyrafinowany display + czyste body.",
    headingFont: "var(--font-syne)",
    bodyFont: "var(--font-inter)",
    headingWeight: 800,
    bodyWeight: 400,
  },
  {
    n: 4,
    label: "Anton + Space Grotesk",
    vibe: "Industrial + tech. Agresywny headline i precyzyjne body.",
    headingFont: "var(--font-anton)",
    bodyFont: "var(--font-space)",
    headingWeight: 400,
    bodyWeight: 300,
  },
  {
    n: 5,
    label: "Bebas Neue + Inter",
    vibe: "Vintage plakat / szyld. Klasyczny billboard + neutralny tekst.",
    headingFont: "var(--font-bebas)",
    bodyFont: "var(--font-inter)",
    headingWeight: 400,
    bodyWeight: 400,
    headingStyle: { letterSpacing: "0.04em" },
  },
  {
    n: 6,
    label: "Syne + Space Grotesk",
    vibe: "Design-forward. Dwa charakterne fonty, silna identyfikacja.",
    headingFont: "var(--font-syne)",
    bodyFont: "var(--font-space)",
    headingWeight: 700,
    bodyWeight: 400,
  },

  // ── Zestaw 2 — NEW fonts, wyraźnie bold / extra bold ─────────
  {
    n: 7,
    label: "Archivo Black + Inter",
    vibe: "Maksymalny impact. Ultra-heavy display + neutralne body.",
    headingFont: archivoBlack.style.fontFamily,
    bodyFont: "var(--font-inter)",
    headingWeight: 400, // naturalnie black
    bodyWeight: 400,
    headingStyle: { letterSpacing: "-0.02em" },
  },
  {
    n: 8,
    label: "Oswald Bold + Space Grotesk",
    vibe: "Condensed editorial / sportowy plakat.",
    headingFont: oswald.style.fontFamily,
    bodyFont: "var(--font-space)",
    headingWeight: 700,
    bodyWeight: 400,
    headingStyle: { letterSpacing: "0.01em" },
  },
  {
    n: 9,
    label: "Unbounded 900 + Inter",
    vibe: "Futurystyczny, techno-artystyczny. Szeroki geometric black.",
    headingFont: unbounded.style.fontFamily,
    bodyFont: "var(--font-inter)",
    headingWeight: 900,
    bodyWeight: 400,
    headingStyle: { letterSpacing: "-0.01em" },
  },
  {
    n: 10,
    label: "Bricolage Grotesque 800 + Space Grotesk",
    vibe: "Modern grotesk editorial. Display variable font z opticalsizing.",
    headingFont: bricolage.style.fontFamily,
    bodyFont: "var(--font-space)",
    headingWeight: 800,
    bodyWeight: 400,
  },
  {
    n: 11,
    label: "Unbounded 800 + Bricolage 400",
    vibe: "Dwie nowoczesne grotesk-display, spójna familia wizualna.",
    headingFont: unbounded.style.fontFamily,
    bodyFont: bricolage.style.fontFamily,
    headingWeight: 800,
    bodyWeight: 400,
  },
  {
    n: 12,
    label: "Archivo Black + Space Grotesk 300",
    vibe: "Najsilniejszy kontrast: ultra-heavy heading + airy, cienki paragraph.",
    headingFont: archivoBlack.style.fontFamily,
    bodyFont: "var(--font-space)",
    headingWeight: 400, // black
    bodyWeight: 300,
    headingStyle: { letterSpacing: "-0.02em" },
  },
];

function SampleBlock({ pair }: { pair: Pair }): ReactNode {
  return (
    <div className="flex flex-col gap-6 py-10 border-t border-white/10">
      {/* Header meta */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-[#ff7302] font-mono text-sm">#{pair.n}</span>
        <h2 className="font-semibold text-lg">{pair.label}</h2>
        <span className="text-white/40 text-sm">{pair.vibe}</span>
      </div>

      {/* Pre-heading small label */}
      <p
        className="text-[#ff7302] text-xs tracking-[0.3em] uppercase"
        style={{ fontFamily: pair.bodyFont, fontWeight: 500 }}
      >
        Murale wielkoformatowe · Usługa 01
      </p>

      {/* H1 huge */}
      <h1
        className="text-white"
        style={{
          fontFamily: pair.headingFont,
          fontWeight: pair.headingWeight,
          fontSize: "clamp(3rem, 7vw, 6.5rem)",
          lineHeight: 0.95,
          ...pair.headingStyle,
        }}
      >
        Sztuka zmienia przestrzeń,<br />
        w której żyjesz.
      </h1>

      {/* H2 medium */}
      <h3
        className="text-white/80"
        style={{
          fontFamily: pair.headingFont,
          fontWeight: pair.headingWeight,
          fontSize: "clamp(1.3rem, 2.2vw, 2rem)",
          lineHeight: 1.15,
          ...pair.headingStyle,
        }}
      >
        Przekształcam szare ściany w żywe dzieła.
      </h3>

      {/* Body paragraph */}
      <p
        className="text-white/70 max-w-3xl"
        style={{
          fontFamily: pair.bodyFont,
          fontWeight: pair.bodyWeight,
          fontSize: "1.125rem",
          lineHeight: 1.7,
          ...pair.bodyStyle,
        }}
      >
        Każdy mural to opowieść wyrażona kolorem i formą na wielkim płótnie miasta.
        Pracuję z materiałami wybranymi z najwyższą starannością, uwzględniając środowisko
        i jego wpływ na dzieło. Posiadam doświadczenie z farbami antysmogowymi i UV, a
        także z różnymi technikami: pędzel, wałek, spray, aerograf i flamastry.
      </p>

      {/* Small caption */}
      <p
        className="text-white/40 text-sm italic"
        style={{ fontFamily: pair.bodyFont, fontWeight: pair.bodyWeight }}
      >
        &ldquo;Ściany mówią — jeśli tylko pozwolimy im znaleźć głos.&rdquo;
      </p>
    </div>
  );
}

export default function TypographyMockupPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Typografia — 6 zestawów fontów
        </h1>
        <p className="text-white/60 mb-10 text-sm">
          Pary <strong>heading + paragraph</strong> złożone z fontów już załadowanych w layout.tsx:
          Inter, Bebas Neue, Anton, Caveat, Syne, Space Grotesk.
          Każdy blok używa tego samego tekstu — różni się tylko typografia.
        </p>

        {PAIRS.map((p) => (
          <SampleBlock key={p.n} pair={p} />
        ))}

        <div className="mt-20 pt-10 border-t border-white/10">
          <h3 className="text-lg font-semibold mb-3">Dostępne fonty (już w layout.tsx)</h3>
          <ul className="text-sm text-white/60 space-y-1" style={{ fontFamily: "var(--font-space)" }}>
            <li><code className="text-[#ff7302]">var(--font-inter)</code> — Inter</li>
            <li><code className="text-[#ff7302]">var(--font-bebas)</code> — Bebas Neue</li>
            <li><code className="text-[#ff7302]">var(--font-anton)</code> — Anton</li>
            <li><code className="text-[#ff7302]">var(--font-caveat)</code> — Caveat (400, 700)</li>
            <li><code className="text-[#ff7302]">var(--font-syne)</code> — Syne (500, 700, 800)</li>
            <li><code className="text-[#ff7302]">var(--font-space)</code> — Space Grotesk (300, 400, 500, 700)</li>
          </ul>
          <h3 className="text-lg font-semibold mb-3 mt-8">Nowe fonty — tylko na tej stronie (#7–12)</h3>
          <ul className="text-sm text-white/60 space-y-1" style={{ fontFamily: "var(--font-space)" }}>
            <li><code className="text-[#ff7302]">Oswald</code> (400, 700) — condensed display</li>
            <li><code className="text-[#ff7302]">Archivo Black</code> (400 = natywny black) — ultra-heavy</li>
            <li><code className="text-[#ff7302]">Unbounded</code> (700, 800, 900) — futurystyczny geometric</li>
            <li><code className="text-[#ff7302]">Bricolage Grotesque</code> (400, 700, 800) — variable grotesk</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
