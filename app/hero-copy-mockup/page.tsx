import Link from "next/link";

type Variant = {
  id: string;
  tone: "krótki" | "emocjonalny" | "problem-rozwiązanie" | "autorytet" | "konkret" | "narracyjny" | "hybryda";
  headline?: string;
  paragraph: React.ReactNode;
  note: string;
};

const variants: Variant[] = [
  {
    id: "v1",
    tone: "krótki",
    headline: "Murale, które przyciągają wzrok.",
    paragraph: (
      <>
        I <strong>klientów do Twojego biznesu</strong>. Jedno malowanie — lata darmowej reklamy,
        która nie mruga i nie wymaga budżetu na Meta Ads.
      </>
    ),
    note: "Headline + zwięzły follow-up z twardą korzyścią (klient zamiast „uwagi”).",
  },
  {
    id: "v2",
    tone: "emocjonalny",
    headline: "Murale, które przyciągają wzrok.",
    paragraph: (
      <>
        Twoja ściana zaczyna <strong>opowiadać historię</strong> — ludzie zatrzymują się,
        robią zdjęcia, wracają. Zyskujesz <strong>wizytówkę, która pracuje 24/7</strong>,
        przez kilkanaście lat bez odświeżania.
      </>
    ),
    note: "Storytelling + twarda korzyść (24/7, żywotność). Lepsze dla klientów premium / HoReCa.",
  },
  {
    id: "v3",
    tone: "problem-rozwiązanie",
    paragraph: (
      <>
        Szara ściana to <strong>stracona szansa</strong>. Zamieniam ją w
        <strong> magnes na klientów</strong> i darmową reklamę, którą Twoi goście sami wrzucają na Instagrama.
      </>
    ),
    note: "Pain-point na start, korzyść na finał. Mocne dla lokali, które konkurują z sąsiadem w tej samej uliczce.",
  },
  {
    id: "v4",
    tone: "konkret",
    headline: "Murale, które przyciągają wzrok przechodniów, obiektyw smartfonów i algorytm social media.",
    paragraph: (
      <>
        Jedno wydarzenie, <strong>lata zysku</strong>. Ponad 25 lat doświadczenia i portfolio
        wielkoformatowych realizacji — bez eksperymentów, bez niespodzianek.
      </>
    ),
    note: "Trzy konkretne „przyciągnięcia” + dowód (25+ lat). Dobre dla klientów B2B / marketingu.",
  },
  {
    id: "v5",
    tone: "autorytet",
    paragraph: (
      <>
        Od <strong>25 lat</strong> maluję murale, które przyciągają wzrok i klientów. Twoja ściana
        może być <strong>następną, o której mówi całe miasto</strong> — i którą miesiącami udostępniają lokalne media.
      </>
    ),
    note: "Wchodzi od razu autorytetem, zamyka aspiracją („o której mówi całe miasto”).",
  },
  {
    id: "v6",
    tone: "narracyjny",
    paragraph: (
      <>
        Mural, który przyciąga wzrok, <strong>robi coś więcej niż dekoruje ścianę</strong>.
        Zatrzymuje przechodniów, generuje udostępnienia i <strong>buduje rozpoznawalność marki
        przez lata</strong> — zamiast kampanii, która kończy się po tygodniu.
      </>
    ),
    note: "Porównanie do krótkotrwałych kampanii — mocna korzyść dla właścicieli, którzy już wydali na reklamę.",
  },
  {
    id: "v7",
    tone: "hybryda",
    headline: "Murale, które przyciągają wzrok. I film z drona, który przyciąga obserwujących.",
    paragraph: (
      <>
        <strong>Dwie wizytówki w cenie jednej</strong> — mural na Twojej ścianie i profesjonalny film,
        który możesz puścić w social media jeszcze tego samego tygodnia.
      </>
    ),
    note: "Zachowuje kluczowy USP (film gratis), ale przenosi go na język korzyści. Bliskie obecnej treści.",
  },
  {
    id: "v8",
    tone: "krótki",
    headline: "Murale, które przyciągają wzrok.",
    paragraph: (
      <>
        I zatrzymują klientów. <strong>Ty płacisz raz, marka zarabia latami.</strong>
      </>
    ),
    note: "Minimalistyczna wersja dla ultra-czystego hero. Dwa zdania, twarda korzyść na końcu.",
  },
  {
    id: "v9",
    tone: "emocjonalny",
    paragraph: (
      <>
        Murale, które przyciągają wzrok — to <strong>ściana, która przestaje być tłem</strong>.
        Ludzie się zatrzymują, fotografują, udostępniają. <strong>Twoja marka rośnie</strong>,
        a reklama nie kosztuje Cię ani złotówki więcej.
      </>
    ),
    note: "Długa wersja — dobrze się czyta, ale zajmuje więcej miejsca w hero. Mobile może wymagać skrócenia.",
  },
  {
    id: "v10",
    tone: "konkret",
    headline: "Murale, które przyciągają wzrok — i kamery.",
    paragraph: (
      <>
        Portfolio zrealizowane dla marek, lokali i festiwali. <strong>Od projektu po film z drona</strong> —
        dostajesz gotową historię, którą klienci sami rozgłaszają.
      </>
    ),
    note: "Podkreśla kompleksowość (od A do Z). Dobre dla klienta, który nie chce koordynować kilku wykonawców.",
  },
];

const toneStyle: Record<Variant["tone"], string> = {
  "krótki": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "emocjonalny": "bg-rose-500/15 text-rose-300 border-rose-500/30",
  "problem-rozwiązanie": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "autorytet": "bg-sky-500/15 text-sky-300 border-sky-500/30",
  "konkret": "bg-violet-500/15 text-violet-300 border-violet-500/30",
  "narracyjny": "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
  "hybryda": "bg-[#ff7302]/15 text-[#ffa858] border-[#ff7302]/40",
};

export default function HeroCopyMockupPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white pt-24 pb-32">
      <div className="max-w-5xl mx-auto px-6">
        <Link
          href="/mockups"
          className="text-sm text-white/40 hover:text-[#ff7302] transition inline-block mb-6"
        >
          ← indeks mockupów
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-anton)" }}>
          Hero Paragraph — warianty copy
        </h1>
        <p className="text-white/60 text-sm max-w-2xl mb-2">
          Propozycje paragrafu pod CTA w sekcji hero. Punkt wyjścia:{" "}
          <strong className="text-white/90">„Murale, które przyciągają wzrok”</strong>.
        </p>
        <p className="text-white/50 text-xs max-w-2xl mb-12">
          Każdy wariant łączy to zdanie z językiem korzyści — konkretnym zyskiem dla klienta
          (nowi klienci, darmowa reklama, żywotność, udostępnienia w social media).
        </p>

        {/* Kontekst — aktualna wersja */}
        <section className="mb-14 border border-white/10 rounded-lg p-6 bg-black/40">
          <div className="text-[10px] font-bold tracking-widest text-white/40 mb-2">AKTUALNA WERSJA</div>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
            Dostajesz <strong>mural, który przyciąga wzrok</strong> — i{" "}
            <strong>profesjonalny film z ujęciami z drona</strong>, który przyciąga obserwujących.
          </p>
          <p className="text-xs text-white/40 mt-3">
            Problem: brak konkretnej korzyści dla klienta („obserwujący” = nieprzeliczalne), brak zahaczki emocjonalnej,
            pomija ponad 25 lat doświadczenia.
          </p>
        </section>

        <h2 className="text-2xl font-semibold mb-6 text-[#ff7302]" style={{ fontFamily: "var(--font-anton)" }}>
          Propozycje
        </h2>

        <div className="grid gap-6">
          {variants.map((v, i) => (
            <article
              key={v.id}
              className="border border-white/10 rounded-lg p-6 bg-black/40 hover:border-[#ff7302]/40 transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono text-white/30">#{String(i + 1).padStart(2, "0")}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold tracking-widest rounded border ${toneStyle[v.tone]}`}>
                  {v.tone.toUpperCase()}
                </span>
              </div>

              {/* preview w kontekście hero */}
              <div className="rounded-md bg-gradient-to-b from-neutral-900 to-black p-6 md:p-8 border border-white/5 text-center mb-4">
                {v.headline && (
                  <h3
                    className="text-xl md:text-2xl text-white mb-3 leading-tight"
                    style={{ fontFamily: "var(--font-anton)", letterSpacing: "-0.01em" }}
                  >
                    {v.headline}
                  </h3>
                )}
                <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                  {v.paragraph}
                </p>
                <div className="flex items-center justify-center gap-6 flex-wrap mt-5">
                  <span
                    className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded"
                    style={{ background: "#fe9100", color: "#000" }}
                  >
                    Bezpłatna wycena →
                  </span>
                  <span className="text-xs text-white/40 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fe9100]/60 inline-block" />
                    25+ lat doświadczenia
                  </span>
                </div>
              </div>

              <p className="text-xs text-white/50 leading-relaxed">
                <span className="text-white/80 font-medium">Uwaga: </span>
                {v.note}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-16 border-t border-white/10 pt-8 text-sm text-white/50 space-y-3 max-w-2xl">
          <h3 className="text-white/90 font-semibold mb-2">Język korzyści — zasady zastosowane w wariantach</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-white/80">Konkretny zysk &gt; cecha</strong> — „pracuje 24/7” zamiast „jest trwały”.</li>
            <li><strong className="text-white/80">Liczby i czas</strong> — „25 lat”, „lata zysku”, „tego samego tygodnia”.</li>
            <li><strong className="text-white/80">Porównanie do alternatywy</strong> — mural vs kampania, która kończy się po tygodniu.</li>
            <li><strong className="text-white/80">Ruch klienta</strong> — zatrzymuje, fotografuje, udostępnia, wraca.</li>
            <li><strong className="text-white/80">„Ty” zamiast „my”</strong> — zawsze mówimy o kliencie i jego biznesie, nie o wykonawcy.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
