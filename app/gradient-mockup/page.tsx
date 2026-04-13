"use client";

import Image from "next/image";

type Variant = {
  label: string;
  css: string; // CSS used for mask-image / background
  note: string;
  mode: "mask" | "overlay"; // mask = dark area with mask fade; overlay = semi-transparent gradient layer
};

const variants: Variant[] = [
  // ── MASK gradients (used like current koHalf) ────────────────
  {
    label: "1) Obecny — mask 0% → 60%",
    css: "linear-gradient(to bottom, transparent 0%, black 60%)",
    note: "height 80%, fade przez 60% elementu",
    mode: "mask",
  },
  {
    label: "2) Maxymalnie wydłużony — mask 0% → 100%",
    css: "linear-gradient(to bottom, transparent 0%, black 100%)",
    note: "Fade przez CAŁĄ wysokość elementu, bez solidnego obszaru",
    mode: "mask",
  },
  {
    label: "3) Full height + full fade",
    css: "linear-gradient(to bottom, transparent 0%, black 100%)",
    note: "height 100% (cały ekran) + fade 0%→100%",
    mode: "mask",
  },
  {
    label: "4) Ease-out simulation (ręczne stops)",
    css: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.5) 70%, black 100%)",
    note: "Wielostopniowy — przyspiesza na dole, wolno na górze",
    mode: "mask",
  },
  {
    label: "5) Ease-in simulation",
    css: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.85) 60%, black 100%)",
    note: "Szybko ciemnieje na górze fadea",
    mode: "mask",
  },
  {
    label: "6) S-curve (najbardziej naturalny)",
    css: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.9) 80%, black 100%)",
    note: "Sigmoid — płynne początki i końce",
    mode: "mask",
  },

  // ── OVERLAY gradients (background layer, not mask) ──────────
  {
    label: "7) Overlay — rgba gradient",
    css: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)",
    note: "Zamiast mask — półprzezroczysta warstwa z gradientem alfa",
    mode: "overlay",
  },
  {
    label: "8) Overlay subtelny — 0 → 0.55",
    css: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 100%)",
    note: "Bardzo delikatne przyciemnienie, tekst na dole widoczny przez półprzezroczyste tło",
    mode: "overlay",
  },
  {
    label: "9) Overlay S-curve rgba",
    css: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0.85) 100%)",
    note: "Overlay z sigmoidą — najbardziej naturalne dla tła wideo",
    mode: "overlay",
  },

  // ── RADIAL and angled for comparison ─────────────────────────
  {
    label: "10) Radial z dołu — eliptyczny spotlight",
    css: "radial-gradient(ellipse at bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 90%)",
    note: "Ciemno w dole-środku, jaśniej na brzegach i górze",
    mode: "overlay",
  },
  {
    label: "11) Diagonal 165deg",
    css: "linear-gradient(165deg, transparent 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 100%)",
    note: "Skośny gradient — dolny-prawy róg najciemniejszy",
    mode: "overlay",
  },
  {
    label: "12) Double-layer (top + bottom)",
    css: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 40%, transparent 70%, rgba(0,0,0,0.35) 100%)",
    note: "Ciemno góra i dół, jasno środek — kinowe panele",
    mode: "overlay",
  },
];

function Preview({ variant }: { variant: Variant }) {
  if (variant.mode === "mask") {
    // Simulate current koHalf: black layer on full tile, with mask fade
    return (
      <div className="relative w-full h-56 rounded-xl overflow-hidden">
        <Image
          src="/Animation/Wnetrza_i_Dekoracje/TitleCard/desktop.webp"
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(5, 5, 5, 0.72)",
            WebkitMaskImage: variant.css,
            maskImage: variant.css,
          }}
        />
        {/* Sample content to show readability */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-xl font-bold">Twój nagłówek</p>
          <p className="text-sm text-white/80">Paragraf z CTA i opisem — sprawdź czy czytelny</p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative w-full h-56 rounded-xl overflow-hidden">
      <Image
        src="/Animation/Wnetrza_i_Dekoracje/TitleCard/desktop.webp"
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: variant.css }}
      />
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <p className="text-xl font-bold">Twój nagłówek</p>
        <p className="text-sm text-white/80">Paragraf z CTA i opisem — sprawdź czy czytelny</p>
      </div>
    </div>
  );
}

export default function GradientMockup() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Gradient przyciemnienia — warianty
          </h1>
          <p className="text-gray-400 text-sm max-w-3xl">
            Testowisko gradientów dla dolnego przyciemnienia hero. Każdy wariant
            pokazany na tym samym obrazie. Dwa tryby:{" "}
            <strong className="text-white">mask</strong> (ciemna warstwa + mask-image fade)
            i <strong className="text-white">overlay</strong> (półprzezroczysta warstwa z gradientem alfa).
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {variants.map((v, i) => (
            <div key={i}>
              <p className="text-sm text-gray-300 font-semibold mb-1">{v.label}</p>
              <p className="text-xs text-gray-500 mb-2">{v.note}</p>
              <Preview variant={v} />
              <pre className="mt-2 text-[11px] bg-neutral-900 border border-neutral-800 rounded px-3 py-2 overflow-x-auto text-gray-400">
                {v.mode === "mask" ? "mask-image: " : "background: "}
                <span className="text-gray-200">{v.css}</span>
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-gray-300 text-sm space-y-3">
          <h2 className="text-white text-lg font-bold">Jak to się ma do obecnej produkcji</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Obecna sekcja hero używa <strong>mask</strong> na ciemnej warstwie (`.koHalf`) — tekst jest „wybijany" przez maskę
            </li>
            <li>
              <strong>Maxymalnie wydłużony</strong> = <code>mask 0%→100%</code> — brak twardej krawędzi, pełny fade od góry do dołu
            </li>
            <li>
              Można zwiększyć <code>height</code> do <strong>100%</strong> żeby gradient pokrywał cały ekran
            </li>
            <li>
              <strong>S-curve</strong> daje najbardziej naturalne przejście — lepsze niż liniowe dla tła z detalem
            </li>
            <li>
              <strong>Overlay</strong> (zamiast mask) jest prostsze, dobre gdy nie potrzebujesz „wybijania" tekstu
            </li>
          </ul>
          <p className="pt-3">
            Powiedz który numer — wdrożę w <code>GlitchedVideoHero.module.css</code>.
          </p>
        </div>
      </div>
    </main>
  );
}
