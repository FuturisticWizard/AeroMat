"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";

/* =============================================================================
   AeroMat — Kontakt mockupy v2
   Założenie: KRÓTKI formularz (3 pola: imię, kontakt, wiadomość) + ZDJĘCIE.
   Spójne z resztą strony: czarne tło, akcent #ff7302, Bebas + Space Grotesk.
   6 wariantów — każdy z własnym charakterem, ale w tej samej rodzinie.
   ============================================================================= */

const ORANGE = "#ff7302";
const PHOTO = "/images/portret.webp";

const bebas = { fontFamily: "var(--font-bebas)", letterSpacing: "0.01em" } as const;
const space = { fontFamily: "var(--font-space)" } as const;
const syne  = { fontFamily: "var(--font-syne)"  } as const;
const caveat = { fontFamily: "var(--font-caveat)" } as const;

/* ===========================================================================
   Atomy formularza
   =========================================================================== */
type FieldProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "textarea";
  placeholder?: string;
  variant?: "underline-dark" | "underline-light" | "boxed-dark" | "boxed-cream";
};

function Field({ label, name, type = "text", placeholder, variant = "underline-dark" }: FieldProps) {
  const wrapBase = "flex flex-col gap-2";
  const labelBase = "text-[10px] uppercase tracking-[0.32em]";
  const labelTone = variant.includes("cream") ? "text-black/55" : "text-white/55";

  const inputCommon =
    "w-full bg-transparent outline-none transition placeholder:opacity-40 focus:placeholder:opacity-60";

  const inputStyle: Record<string, string> = {
    "underline-dark":
      "border-0 border-b border-white/20 py-3 text-white text-lg focus:border-[#ff7302]",
    "underline-light":
      "border-0 border-b border-black/20 py-3 text-black text-lg focus:border-[#ff7302]",
    "boxed-dark":
      "border border-white/15 bg-white/[0.03] px-4 py-3 text-white rounded-md focus:border-[#ff7302]",
    "boxed-cream":
      "border border-black/15 bg-white px-4 py-3 text-black rounded-md focus:border-[#ff7302]",
  };

  const cls = `${inputCommon} ${inputStyle[variant]}`;

  return (
    <div className={wrapBase}>
      <label htmlFor={name} className={`${labelBase} ${labelTone}`} style={space}>
        {label}
      </label>
      {type === "textarea" ? (
        <textarea id={name} name={name} rows={3} placeholder={placeholder} className={`${cls} resize-none`} style={space} />
      ) : (
        <input id={name} name={name} type={type} placeholder={placeholder} className={cls} style={space} />
      )}
    </div>
  );
}

function CTA({
  children,
  full = false,
  tone = "orange",
}: {
  children: ReactNode;
  full?: boolean;
  tone?: "orange" | "outline-light" | "outline-dark" | "black";
}) {
  const base =
    "group inline-flex items-center justify-center gap-3 px-7 py-3.5 font-semibold uppercase tracking-[0.18em] text-sm transition";
  const tones: Record<string, string> = {
    orange: "bg-[#ff7302] text-white hover:bg-white hover:text-[#ff7302]",
    "outline-light": "border border-white/40 text-white hover:bg-white hover:text-black",
    "outline-dark": "border border-black/40 text-black hover:bg-black hover:text-white",
    black: "bg-black text-white hover:bg-[#ff7302]",
  };
  const w = full ? "w-full" : "";
  return (
    <button type="button" className={`${base} ${tones[tone]} ${w}`} style={bebas}>
      {children}
      <ArrowRight size={16} className="transition group-hover:translate-x-1" />
    </button>
  );
}

/* ===========================================================================
   V1 — EDITORIAL SPLIT
   Magazynowy split 50/50: portret na całą wysokość po lewej,
   gigantyczny BEBAS headline + 3 pola po prawej. Refined.
   =========================================================================== */
function V1EditorialSplit() {
  return (
    <section className="relative grid min-h-[680px] grid-cols-1 overflow-hidden bg-[#0a0a0a] md:grid-cols-[5fr_6fr]">
      <div className="relative min-h-[400px] md:min-h-full">
        <Image src={PHOTO} alt="Mateusz — AeroMat" fill className="object-cover" sizes="(max-width:768px) 100vw, 42vw" priority />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/30" />
        <div className="absolute left-6 bottom-6 text-white/80" style={caveat}>
          <p className="text-2xl">— Mateusz</p>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50" style={space}>Lublin · cała Polska</p>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-8 px-8 py-14 md:px-16">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#ff7302]" style={space}>
            §01 — Kontakt
          </p>
          <h2 style={bebas} className="text-white leading-[0.85] text-[clamp(3rem,7vw,6rem)]">
            Napisz, <br />
            <span className="text-[#ff7302]">odpowiem w 24h.</span>
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65" style={space}>
            Zostaw imię, kontakt i kilka zdań o ścianie — wracam z wstępną wyceną i terminem.
          </p>
        </div>

        <form className="flex flex-col gap-6">
          <Field label="Imię" name="name" placeholder="Jan Kowalski" />
          <Field label="E-mail lub telefon" name="contact" placeholder="jan@firma.pl" />
          <Field label="O projekcie" name="msg" type="textarea" placeholder="Lokalizacja, wymiary, termin…" />
          <div className="pt-2">
            <CTA tone="orange">Wyślij zapytanie</CTA>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ===========================================================================
   V2 — POSTCARD ON PHOTO
   Pełnoekranowy portret z gradientem, „pocztówka" formularza wycentrowana.
   =========================================================================== */
function V2Postcard() {
  return (
    <section className="relative isolate min-h-[720px] overflow-hidden bg-black">
      <Image src={PHOTO} alt="Mateusz — AeroMat" fill className="object-cover opacity-70" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[720px] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-[#ff7302]" style={space}>
          AeroMat × Twoja ściana
        </p>
        <h2 style={bebas} className="mt-4 text-white leading-[0.9] text-[clamp(3rem,9vw,6.5rem)]">
          Porozmawiajmy
        </h2>

        <div
          className="mt-10 w-full border border-white/15 bg-black/60 p-8 backdrop-blur-md md:p-10"
          style={{
            boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          <form className="flex flex-col gap-5 text-left">
            <Field label="Imię" name="name" placeholder="Jan Kowalski" variant="boxed-dark" />
            <Field label="E-mail" name="email" type="email" placeholder="jan@firma.pl" variant="boxed-dark" />
            <Field label="Krótko o pomyśle" name="msg" type="textarea" placeholder="…" variant="boxed-dark" />
            <CTA full tone="orange">Wyślij wiadomość</CTA>
          </form>
        </div>

        <p className="mt-6 text-xs text-white/40" style={space}>
          kontakt@aeromat.pl · +48 600 000 000
        </p>
      </div>
    </section>
  );
}

/* ===========================================================================
   V3 — HORIZONTAL BANNER
   Pasek portretowy na lewo (wysoki + wąski), po prawej: kicker + nagłówek
   + 3 pola w jednym rzędzie (desktop) i orange CTA. Industrial / press.
   =========================================================================== */
function V3HorizontalBanner() {
  return (
    <section className="relative grid min-h-[560px] grid-cols-1 overflow-hidden bg-[#0c0c0c] md:grid-cols-[1fr_3fr]">
      <div className="relative min-h-[280px] md:min-h-full">
        <Image src={PHOTO} alt="Mateusz" fill className="object-cover grayscale-[35%]" sizes="(max-width:768px) 100vw, 25vw" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 to-black/60" />
        <div className="absolute right-4 top-4 rounded-full border border-[#ff7302] bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[#ff7302]" style={space}>
          Wolne terminy · maj
        </div>
      </div>

      <div className="flex flex-col justify-center gap-10 px-8 py-12 md:px-14">
        <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.4em] text-white/50" style={space}>
              Brief w 60 sekund
            </p>
            <h2 style={bebas} className="text-white leading-[0.9] text-[clamp(2.5rem,5.5vw,4.5rem)]">
              Pisz wprost. <span className="text-[#ff7302]">Działam wprost.</span>
            </h2>
          </div>
          <div className="hidden text-right text-xs uppercase tracking-[0.3em] text-white/40 md:block" style={space}>
            <p>kontakt@aeromat.pl</p>
            <p className="mt-1">+48 600 000 000</p>
          </div>
        </div>

        <form className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Field label="Imię" name="name" placeholder="Jan" />
          <Field label="Kontakt zwrotny" name="contact" placeholder="jan@firma.pl / 600…" />
          <Field label="Krótko o ścianie" name="msg" placeholder="Mural ~50m², Warszawa…" />
        </form>

        <div className="flex flex-wrap items-center gap-6">
          <CTA tone="orange">Wyślij brief</CTA>
          <p className="text-xs text-white/40" style={space}>
            Albo napisz na WhatsApp — link w stopce.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   V4 — DIAGONAL PAINT STROKE
   Portret z diagonalnym clip-path po prawej, formularz po lewej w czerni.
   Pomarańczowa „smuga" z gradientu zamiast twardej linii. Energetyczny.
   =========================================================================== */
function V4Diagonal() {
  return (
    <section className="relative min-h-[680px] overflow-hidden bg-black">
      {/* prawa strona — portret diagonalnie kadrowany */}
      <div
        className="absolute inset-y-0 right-0 hidden w-[58%] md:block"
        style={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0% 100%)" }}
      >
        <Image src={PHOTO} alt="Mateusz" fill className="object-cover" sizes="58vw" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-black/60" />
      </div>

      {/* pomarańczowa smuga – dekoracyjna */}
      <div
        aria-hidden
        className="absolute -left-[5%] top-[20%] hidden h-2 w-[55%] rotate-[-18deg] md:block"
        style={{
          background: "linear-gradient(90deg, transparent, #ff7302 35%, #ff7302 70%, transparent)",
          filter: "blur(0.5px)",
        }}
      />

      <div className="relative z-10 grid min-h-[680px] grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center gap-8 px-8 py-14 md:px-14">
          <p className="text-3xl text-[#ff7302]" style={caveat}>
            cześć!
          </p>
          <h2 style={syne} className="text-white font-extrabold leading-[0.9] text-[clamp(2.6rem,6vw,5rem)]">
            Twój pomysł.<br />
            <span className="text-[#ff7302]">Moja ściana.</span>
          </h2>

          <form className="mt-2 flex flex-col gap-5 max-w-md">
            <Field label="Imię" name="name" placeholder="Jan" />
            <Field label="E-mail" name="email" type="email" placeholder="jan@firma.pl" />
            <Field label="Wiadomość" name="msg" type="textarea" placeholder="Co masz na myśli?" />
            <div className="pt-1">
              <CTA tone="orange">Wyślij</CTA>
            </div>
          </form>
        </div>
        {/* pusta prawa kolumna — wypełniona absolutnym obrazem */}
        <div />
      </div>
    </section>
  );
}

/* ===========================================================================
   V5 — CREAM CARD (light variant)
   Jeden jasny wariant dla kontrastu w mockupach. Kremowe tło, czarna typografia,
   portret w okrągłym kadrze, spokojny minimal. Inspiracja: editorial / paper.
   =========================================================================== */
function V5Cream() {
  return (
    <section className="relative min-h-[680px] bg-[#f5f1ea] py-20">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-14 px-6 md:grid-cols-[auto_1fr]">
        <div className="relative mx-auto h-72 w-72 overflow-hidden rounded-full ring-1 ring-black/10 md:h-80 md:w-80">
          <Image src={PHOTO} alt="Mateusz" fill className="object-cover" sizes="320px" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#ff7302]" style={space}>
            Kontakt — bezpośrednio
          </p>
          <h2 style={bebas} className="mt-2 text-black leading-[0.9] text-[clamp(2.8rem,6vw,5.5rem)]">
            Trzy pola.<br />
            <span className="text-[#ff7302]">Jeden e-mail.</span>
          </h2>
          <p className="mt-4 max-w-md text-base text-black/70" style={space}>
            Bez formularzy na 12 kroków. Zostaw kontakt i kilka słów — odzywam się tego samego dnia.
          </p>

          <form className="mt-8 grid max-w-lg grid-cols-1 gap-5">
            <Field label="Imię" name="name" placeholder="Jan Kowalski" variant="underline-light" />
            <Field label="E-mail" name="email" type="email" placeholder="jan@firma.pl" variant="underline-light" />
            <Field label="W kilku słowach" name="msg" type="textarea" placeholder="Mural przy wjeździe do hali…" variant="underline-light" />
            <div className="pt-2">
              <CTA tone="black">Wyślij</CTA>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   V6 — FLOATING FORM PANEL
   Pełnoekranowy hero portret. Headline w lewym górnym rogu, info w lewym dolnym,
   formularz „wisi" w prawym dolnym rogu jako szklisty panel.
   =========================================================================== */
function V6FloatingPanel() {
  return (
    <section className="relative min-h-[720px] overflow-hidden bg-black">
      <Image src={PHOTO} alt="Mateusz — AeroMat" fill className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/40 to-black/75" />

      <div className="relative z-10 flex min-h-[720px] flex-col justify-between p-8 md:p-14">
        {/* top — headline */}
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.5em] text-[#ff7302]" style={space}>
            01 / Kontakt
          </p>
          <h2 style={bebas} className="mt-3 text-white leading-[0.85] text-[clamp(3rem,8vw,7rem)]">
            Zacznijmy<br /> od krótkiej<br />
            <span className="text-[#ff7302]">wiadomości.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-2">
          {/* bottom-left — kontakt info */}
          <ul className="space-y-3 text-white/85" style={space}>
            <li className="flex items-center gap-3 text-sm">
              <Mail size={16} className="text-[#ff7302]" /> kontakt@aeromat.pl
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-[#ff7302]" /> +48 600 000 000
            </li>
            <li className="flex items-center gap-3 text-sm">
              <MapPin size={16} className="text-[#ff7302]" /> Lublin · cała Polska
            </li>
          </ul>

          {/* bottom-right — floating form */}
          <form
            className="ml-auto w-full max-w-md border border-white/15 bg-white/[0.06] p-7 backdrop-blur-md"
            style={{ boxShadow: "0 30px 60px -10px rgba(0,0,0,0.6)" }}
          >
            <p className="mb-5 text-xs uppercase tracking-[0.32em] text-white/55" style={space}>
              Krótki brief
            </p>
            <div className="flex flex-col gap-5">
              <Field label="Imię" name="name" placeholder="Jan" variant="boxed-dark" />
              <Field label="Kontakt" name="contact" placeholder="email lub telefon" variant="boxed-dark" />
              <Field label="Wiadomość" name="msg" type="textarea" placeholder="Krótko, w 1–2 zdaniach…" variant="boxed-dark" />
              <CTA full tone="orange">Wyślij</CTA>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   Index page — switcher między wariantami
   =========================================================================== */
type Variant = {
  id: string;
  label: string;
  desc: string;
  Component: () => JSX.Element;
};

const VARIANTS: Variant[] = [
  { id: "v1", label: "V1 · Editorial Split",       desc: "Magazynowy 50/50. Portret + duży Bebas + 3 pola.", Component: V1EditorialSplit },
  { id: "v2", label: "V2 · Postcard on Photo",     desc: "Pełnoekranowy portret + frosted card z formularzem.", Component: V2Postcard },
  { id: "v3", label: "V3 · Horizontal Banner",     desc: "Wąski portret + wiersz pól + CTA. Press / industrial.", Component: V3HorizontalBanner },
  { id: "v4", label: "V4 · Diagonal Paint Stroke", desc: "Diagonalny clip-path + pomarańczowa smuga. Energy.",  Component: V4Diagonal },
  { id: "v5", label: "V5 · Cream Card (light)",    desc: "Jasny wariant: kremowe tło, okrągły portret, minimal.", Component: V5Cream },
  { id: "v6", label: "V6 · Floating Panel",        desc: "Hero portret + szklisty panel formularza w rogu.",     Component: V6FloatingPanel },
];

export default function KontaktMockupPage() {
  const [active, setActive] = useState<string>(VARIANTS[0].id);
  const Active = VARIANTS.find((v) => v.id === active)?.Component ?? V1EditorialSplit;

  return (
    <main className="min-h-screen bg-neutral-950 pb-24 pt-28 text-white">
      <header className="mx-auto mb-10 max-w-6xl px-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[#ff7302]" style={space}>
          Mockup · Kontakt v2
        </p>
        <h1 style={bebas} className="mt-2 text-white text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95]">
          Krótki formularz + zdjęcie — 6 wariantów
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/55" style={space}>
          Każdy wariant: 3 pola (imię / kontakt / wiadomość) + zdjęcie Mateusza. Spójne z resztą
          strony (czarne tło, akcent <span className="text-[#ff7302]">#ff7302</span>, Bebas Neue + Space Grotesk).
        </p>

        <nav className="mt-8 flex flex-wrap gap-2">
          {VARIANTS.map((v) => {
            const on = v.id === active;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setActive(v.id)}
                className={`border px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition ${
                  on
                    ? "border-[#ff7302] bg-[#ff7302] text-white"
                    : "border-white/15 text-white/65 hover:border-white/40 hover:text-white"
                }`}
                style={space}
              >
                {v.label}
              </button>
            );
          })}
        </nav>

        <p className="mt-4 text-xs text-white/45" style={space}>
          {VARIANTS.find((v) => v.id === active)?.desc}
        </p>
      </header>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="overflow-hidden border border-white/10 bg-black">
          <Active />
        </div>
      </div>
    </main>
  );
}
