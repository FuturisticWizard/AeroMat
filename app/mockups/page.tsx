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
    label: "Kontakt — formularz",
    tag: "layout",
    description: "Warianty strony kontaktowej: layouty, typografie, hero treatment.",
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
