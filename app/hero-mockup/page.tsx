import type { ReactNode } from "react";
import GlitchedVideoHero from "../components/hero/GlitchedVideoHero";

/* ============================================================
   Shared video helper — muted autoplay loop
   Uses hero_mini.mp4 (smallest) for multi-instance mockup page.
   Browser de-duplicates requests by URL — file downloads once.
   ============================================================ */
function Video({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/images/hero-poster.webp"
      className={className}
      style={style}
    >
      <source src="/movies/hero_mini.webm" type="video/webm" />
      <source src="/movies/hero_mini.mp4" type="video/mp4" />
    </video>
  );
}

/* ============================================================
   V2 — Minimalist: video + centered title + CTA
   ============================================================ */
function V2Minimalist() {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden bg-black">
      <Video className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <p className="text-[#ff7302] text-sm tracking-[0.4em] uppercase mb-4">Murale · Szyldy · Dekoracje</p>
        <h1
          className="text-white text-[clamp(3rem,8vw,7rem)] leading-[0.95] font-bold max-w-5xl"
          style={{ fontFamily: "var(--font-anton)", letterSpacing: "-0.01em" }}
        >
          Sztuka zmienia<br />przestrzeń wokół Ciebie.
        </h1>
        <div className="mt-10 flex gap-4">
          <a href="/kontakt" className="px-7 py-3 bg-[#ff7302] text-white rounded-md font-semibold hover:bg-[#ffa858] transition">
            Bezpłatna wycena →
          </a>
          <a href="/portfolio" className="px-7 py-3 border border-white/40 text-white rounded-md hover:bg-white/10 transition">
            Zobacz portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   V3 — Horizontal marquee top + bottom
   ============================================================ */
function V3HorizontalMarquee() {
  const words = "ŚCIANA · KAMERA · AKCJA · ŚCIANA · KAMERA · AKCJA · ŚCIANA · KAMERA · AKCJA · ";
  return (
    <div className="relative w-full h-[80vh] overflow-hidden bg-black">
      <Video className="absolute inset-0 w-full h-full object-cover" />
      {/* Top marquee */}
      <div className="absolute top-0 left-0 right-0 bg-black/70 py-3 overflow-hidden z-10">
        <div
          className="whitespace-nowrap text-white text-4xl tracking-widest"
          style={{ fontFamily: "var(--font-anton)", animation: "heroMockupMarqueeLeft 40s linear infinite" }}
        >
          {words.repeat(3)}
        </div>
      </div>
      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-3 overflow-hidden z-10">
        <div
          className="whitespace-nowrap text-[#ff7302] text-4xl tracking-widest"
          style={{ fontFamily: "var(--font-anton)", animation: "heroMockupMarqueeRight 40s linear infinite" }}
        >
          {words.repeat(3)}
        </div>
      </div>
      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-white text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-bold" style={{ fontFamily: "var(--font-anton)" }}>
          AEROMAT
        </h1>
        <p className="text-white/80 mt-4 text-lg">Twój mural — Twoja historia.</p>
      </div>
    </div>
  );
}

/* ============================================================
   V4 — Cinematic letterbox (2.35:1 style with top+bottom bars)
   ============================================================ */
function V4Letterbox() {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden bg-black">
      {/* Video constrained to middle ~70% */}
      <div className="absolute left-0 right-0 top-[15%] bottom-[15%] overflow-hidden">
        <Video className="w-full h-full object-cover" />
      </div>
      {/* Letterbox bars with film-like edge */}
      <div className="absolute top-0 left-0 right-0 h-[15%] bg-black z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-black z-10" />
      {/* Film strip perforations */}
      <div
        className="absolute top-0 left-0 right-0 h-[15%] z-20 opacity-60"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0 40px, #222 40px 50px, transparent 50px 90px)",
          maskImage: "linear-gradient(to bottom, black 0 60%, transparent 100%)",
        }}
      />
      {/* Title overlay centered */}
      <div className="absolute inset-0 flex items-center justify-center z-30 px-6">
        <div className="text-center">
          <p className="text-[#ff7302] text-xs tracking-[0.5em] uppercase mb-3">A Film by AeroMat · 2026</p>
          <h1
            className="text-white text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] font-black"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            ŚCIANY<br />MÓWIĄ.
          </h1>
          <a
            href="/kontakt"
            className="mt-8 inline-block px-6 py-2 border-2 border-white/70 text-white tracking-widest uppercase text-sm hover:bg-white hover:text-black transition"
          >
            Zacznij swój mural
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   V5 — Split screen (text left 45%, video right 55%)
   ============================================================ */
function V5SplitScreen() {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden bg-black grid grid-cols-[45%_55%]">
      {/* Left: text block */}
      <div className="relative z-10 flex flex-col justify-center px-10 md:px-16 bg-black">
        <p className="text-[#ff7302] text-xs tracking-[0.4em] uppercase mb-4">25+ lat doświadczenia</p>
        <h1
          className="text-white text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.95] font-black"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          Mural.<br />Film.<br /><span className="text-[#ff7302]">Twoja marka.</span>
        </h1>
        <p className="text-white/70 mt-6 text-lg max-w-md" style={{ fontFamily: "var(--font-inter)" }}>
          Tworzę dzieła, które nie tylko zdobią przestrzeń, ale też pracują na widoczność Twojego biznesu.
        </p>
        <div className="mt-8 flex gap-3">
          <a href="/kontakt" className="px-6 py-3 bg-[#ff7302] text-white rounded font-semibold hover:bg-[#ffa858] transition">
            Bezpłatna wycena
          </a>
          <a href="/portfolio" className="px-6 py-3 text-white/80 hover:text-white transition">
            Portfolio →
          </a>
        </div>
      </div>
      {/* Right: video */}
      <div className="relative">
        <Video className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/60" />
      </div>
    </div>
  );
}

/* ============================================================
   V6 — Duotone orange tint (multiply blend)
   ============================================================ */
function V6Duotone() {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden" style={{ background: "#ff7302" }}>
      <Video
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "grayscale(100%) contrast(1.1)", mixBlendMode: "multiply" }}
      />
      {/* Secondary color layer for duotone */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, #2a0f00 0%, transparent 50%, rgba(255,115,2,0.4) 100%)", mixBlendMode: "screen" }}
      />
      <div className="absolute inset-0 flex flex-col items-start justify-end p-10 md:p-16">
        <p className="text-black/80 text-sm tracking-[0.4em] uppercase mb-3 font-bold">AeroMat Studios</p>
        <h1
          className="text-black text-[clamp(3rem,8vw,7rem)] leading-[0.9] font-black"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          Sztuka która<br />zostawia ślad.
        </h1>
        <div className="mt-8">
          <a href="/kontakt" className="px-7 py-3 bg-black text-[#ff7302] rounded font-bold hover:bg-neutral-800 transition">
            Zacznij projekt →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   V7 — Spotlight circular mask (video visible only in circle)
   ============================================================ */
function V7Spotlight() {
  return (
    <div className="relative w-full h-[85vh] overflow-hidden bg-black">
      <div
        className="absolute inset-0"
        style={{
          maskImage: "radial-gradient(circle at 50% 50%, black 0, black 30%, transparent 45%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 0, black 30%, transparent 45%)",
        }}
      >
        <Video className="absolute inset-0 w-full h-full object-cover" />
      </div>
      {/* Ring glow around spotlight */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 30%, rgba(255,115,2,0.3) 42%, transparent 55%)",
        }}
      />
      {/* Content arranged around spotlight */}
      <div className="absolute inset-0 flex flex-col items-center justify-between py-16">
        <p className="text-[#ff7302] text-sm tracking-[0.5em] uppercase">Murale · Szyldy · Film</p>
        <div className="flex-1" />
        <div className="text-center px-6 pb-4">
          <h1
            className="text-white text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] font-black"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            Patrz przez obiektyw.
          </h1>
          <a href="/kontakt" className="mt-6 inline-block px-7 py-3 bg-[#ff7302] text-white rounded font-semibold hover:bg-[#ffa858] transition">
            Bezpłatna wycena →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   V8 — Floating CTA badge (poster over video)
   ============================================================ */
function V8FloatingBadge() {
  return (
    <div className="relative w-full h-[85vh] overflow-hidden bg-black">
      <Video className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/30" />
      {/* Floating card bottom-left */}
      <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 bg-[#ff7302] text-black p-8 md:p-10 rounded max-w-md shadow-2xl rotate-[-1.5deg]">
        <p className="text-xs tracking-[0.3em] uppercase font-bold mb-3">Nowy mural w 3 krokach</p>
        <h2 className="text-3xl md:text-4xl font-black leading-[1.05]" style={{ fontFamily: "var(--font-anton)" }}>
          Twój pomysł.<br />Moje pędzle.<br />Wielkie płótno.
        </h2>
        <a href="/kontakt" className="mt-6 inline-block px-6 py-3 bg-black text-[#ff7302] rounded font-bold hover:bg-neutral-800 transition">
          Zadzwoń do mnie →
        </a>
      </div>
      {/* Top bar with brand */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <p className="text-white text-sm tracking-[0.4em] uppercase font-bold">AEROMAT</p>
        <p className="text-white/60 text-xs tracking-widest">25+ lat · ponad 400 murali</p>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
type V = { n: string; tag: "current" | "recent" | "new"; label: string; note: string; node: ReactNode };

const VARIANTS: V[] = [
  {
    n: "V1",
    tag: "current",
    label: "Current — Film strips + CTA (GlitchedVideoHero)",
    note: "Aktualny production: pionowe paski ŚCIANA/KAMERA/AKCJA po obu bokach + CTA pod spodem.",
    node: <GlitchedVideoHero />,
  },
  {
    n: "V2",
    tag: "recent",
    label: "Minimalist — video + centered title + CTA",
    note: "Uproszczona wersja bez pasków. Big title na środku, dwa CTA, subtelny gradient.",
    node: <V2Minimalist />,
  },
  {
    n: "V3",
    tag: "recent",
    label: "Horizontal marquee (top + bottom)",
    note: "Poziome przewijające się paski zamiast pionowych. Brand-centric AEROMAT w środku.",
    node: <V3HorizontalMarquee />,
  },
  {
    n: "V4",
    tag: "new",
    label: "Cinematic letterbox 2.35:1",
    note: "Efekt ekranu kinowego — górna i dolna czarna belka 15%, perforacje, tytuł A Film by AeroMat.",
    node: <V4Letterbox />,
  },
  {
    n: "V5",
    tag: "new",
    label: "Split screen — text 45% + video 55%",
    note: "Twardy podział. Lewa strona czarna z bold headline, prawa video. Klasyczny landing pattern.",
    node: <V5SplitScreen />,
  },
  {
    n: "V6",
    tag: "new",
    label: "Duotone orange tint",
    note: "Video w trybie multiply na pomarańczowym tle + drugi gradient screen. Monochrome brand feel.",
    node: <V6Duotone />,
  },
  {
    n: "V7",
    tag: "new",
    label: "Spotlight circular mask",
    note: "Video widoczne tylko w okrągłym spotlighcie. Pomarańczowa obwódka glow. Teatralny klimat.",
    node: <V7Spotlight />,
  },
  {
    n: "V8",
    tag: "new",
    label: "Floating poster badge over video",
    note: "Pełne video w tle + pomarańczowa karta-plakat w lewym dolnym rogu (lekko skręcona).",
    node: <V8FloatingBadge />,
  },
];

const tagStyles: Record<V["tag"], { bg: string; text: string; label: string }> = {
  current: { bg: "bg-green-500", text: "text-black", label: "ACTUAL PRODUCTION" },
  recent:  { bg: "bg-white",     text: "text-black", label: "RECENT ITERATION" },
  new:     { bg: "bg-[#ff7302]", text: "text-white", label: "NEW — RESEARCH" },
};

export default function HeroMockupPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Marquee keyframes (inline so this page is self-contained) */}
      <style>{`
        @keyframes heroMockupMarqueeLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes heroMockupMarqueeRight {
          from { transform: translateX(-33.333%); }
          to { transform: translateX(0); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-2">Hero Video Section — warianty</h1>
        <p className="text-white/60 text-sm max-w-3xl">
          8 wariantów sekcji hero z tym samym źródłem video (hero_mini).
          V1 = stan aktualny (production), V2–V3 = warianty kontynuujące ostatni kierunek,
          V4–V8 = nowe propozycje po researchu (2025 trendy: letterbox, split-screen, duotone, spotlight).
        </p>
      </div>

      <div className="flex flex-col gap-24">
        {VARIANTS.map((v) => {
          const t = tagStyles[v.tag];
          return (
            <section key={v.n} className="flex flex-col gap-3">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className={`${t.bg} ${t.text} px-2 py-0.5 text-[10px] font-bold tracking-widest`}>
                    {t.label}
                  </span>
                  <span className="text-[#ff7302] font-mono text-sm">{v.n}</span>
                  <h2 className="font-semibold text-lg">{v.label}</h2>
                </div>
                <p className="text-white/50 text-sm mt-1">{v.note}</p>
              </div>
              <div className="w-full">{v.node}</div>
            </section>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white/10 mt-24">
        <h3 className="text-lg font-semibold mb-3">Źródła (research)</h3>
        <ul className="text-sm text-white/60 space-y-1" style={{ fontFamily: "var(--font-space)" }}>
          <li>
            <a href="https://detachless.com/blog/hero-section-web-design-ideas" className="underline" target="_blank" rel="noopener noreferrer">
              Best Practices and Creative Hero Section Design Ideas for 2025 — Detachless
            </a>
          </li>
          <li>
            <a href="https://www.marketermilk.com/blog/hero-section-examples" className="underline" target="_blank" rel="noopener noreferrer">
              30 jaw-dropping hero section examples — Marketer Milk
            </a>
          </li>
          <li>
            <a href="https://blog.logrocket.com/ux-design/hero-section-examples-best-practices/" className="underline" target="_blank" rel="noopener noreferrer">
              10 best hero section examples — LogRocket
            </a>
          </li>
          <li>
            <a href="https://www.premiumbeat.com/blog/free-letterbox-templates-for-video-editing/" className="underline" target="_blank" rel="noopener noreferrer">
              352 Free Letterbox Templates — PremiumBeat
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
}
