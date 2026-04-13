"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  Instagram,
  ArrowRight,
  Check,
} from "lucide-react";

// Helper styles: inline, Tailwind arbitrary font-family z var() bywa niestabilne
const syne = { fontFamily: "var(--font-syne)" } as const;
const space = { fontFamily: "var(--font-space)" } as const;
const inter = { fontFamily: "var(--font-inter)" } as const;

// ═══════════════════════════════════════════════════════════════════
// VARIANT A — "GOMAD model" — kanały + portret, bez formularza
// Inspiracja: marcusgomaddebie.com (35 lat doświadczenia muralista)
// ═══════════════════════════════════════════════════════════════════
function VariantA() {
  const channels = [
    {
      icon: Mail,
      label: "Email",
      value: "kontakt@aeromat.pl",
      href: "mailto:kontakt@aeromat.pl",
    },
    {
      icon: Phone,
      label: "Telefon",
      value: "+48 600 000 000",
      href: "tel:+48600000000",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "napisz teraz",
      href: "https://wa.me/48600000000",
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@aeromat",
      href: "https://instagram.com/aeromat",
    },
  ];

  return (
    <div className="grid min-h-[640px] grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 md:grid-cols-2">
      <div className="relative order-2 min-h-[360px] md:order-1">
        <Image
          src="/mateusz.jpg"
          alt="Mateusz — muralista"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          style={{ objectPosition: "center 18%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div style={syne} className="text-3xl font-bold">
            Mateusz
          </div>
          <div style={inter} className="mt-1 text-sm text-white/70">
            Muralista &middot; 25 lat &middot; cała Polska
          </div>
        </div>
      </div>

      <div className="order-1 flex flex-col justify-center p-8 md:order-2 md:p-12">
        <div
          style={inter}
          className="mb-3 text-xs uppercase tracking-[0.3em] text-[#ff7302]"
        >
          Dostępność &middot; maj 2026
        </div>
        <h2
          style={syne}
          className="text-4xl font-extrabold leading-[0.95] text-white md:text-5xl"
        >
          Odpowiadam osobiście.
        </h2>
        <p style={space} className="mt-4 max-w-md text-white/70">
          Bez asystentów, bez formularzy, bez autoreplay. Wybierz kanał który
          Ci pasuje — zwykle wracam w 24h.
        </p>

        <div className="mt-8 flex flex-col gap-2">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-[#ff7302]/50 hover:bg-white/[0.05]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff7302]/15 text-[#ff7302] transition group-hover:bg-[#ff7302] group-hover:text-white">
                  <c.icon size={18} />
                </div>
                <div>
                  <div
                    style={space}
                    className="text-xs uppercase tracking-wider text-white/50"
                  >
                    {c.label}
                  </div>
                  <div style={inter} className="text-white">
                    {c.value}
                  </div>
                </div>
              </div>
              <ArrowRight
                size={18}
                className="text-white/40 transition group-hover:translate-x-1 group-hover:text-[#ff7302]"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VARIANT B — "The Badass Project" brutalism
// Inspiracja: graffiti typography + parallax na procesie
// ═══════════════════════════════════════════════════════════════════
function VariantB() {
  return (
    <div className="relative min-h-[640px] overflow-hidden rounded-2xl border border-white/10 bg-black">
      <div className="absolute inset-0 opacity-30">
        <Image
          src="/Portfolio/murale/2.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ filter: "grayscale(0.6) contrast(1.1)" }}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, rgba(255,115,2,0.2) 100%)",
        }}
      />

      <div
        aria-hidden
        style={{
          ...syne,
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(8rem, 24vw, 22rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: "transparent",
          WebkitTextStroke: "2px rgba(255, 115, 2, 0.35)",
          lineHeight: 0.85,
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        NAPISZ
      </div>

      <div className="relative z-10 grid min-h-[640px] grid-cols-1 gap-8 p-8 md:grid-cols-[1fr_1fr] md:p-14">
        <div className="flex flex-col justify-end">
          <div
            style={inter}
            className="mb-3 text-xs uppercase tracking-[0.3em] text-[#ff7302]"
          >
            /01 &middot; Kontakt
          </div>
          <h2
            style={syne}
            className="text-5xl font-extrabold leading-[0.9] text-white md:text-7xl"
          >
            Pomalujmy
            <br />
            <span className="text-[#ff7302]">coś wielkiego.</span>
          </h2>
          <p style={space} className="mt-6 max-w-md text-white/75">
            Ściana, fasada, wnętrze — każdy projekt to inna historia.
            Opowiedz swoją.
          </p>
          <div
            style={space}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60"
          >
            <div>
              <span className="text-white/90">200+</span> realizacji
            </div>
            <div>
              <span className="text-white/90">25 lat</span> doświadczenia
            </div>
            <div>
              <span className="text-white/90">Cała</span> Polska
            </div>
          </div>
        </div>

        <form className="flex flex-col justify-center space-y-5 rounded-2xl border border-white/15 bg-black/50 p-6 backdrop-blur-md md:p-8">
          <div>
            <label
              style={space}
              className="block text-xs uppercase tracking-wider text-white/60"
            >
              Imię
            </label>
            <input
              type="text"
              placeholder="Jak mam się zwracać?"
              className="mt-2 w-full border-0 border-b border-white/20 bg-transparent py-2 text-white placeholder:text-white/30 focus:border-[#ff7302] focus:outline-none"
              style={inter}
            />
          </div>
          <div>
            <label
              style={space}
              className="block text-xs uppercase tracking-wider text-white/60"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="twoj@email.pl"
              className="mt-2 w-full border-0 border-b border-white/20 bg-transparent py-2 text-white placeholder:text-white/30 focus:border-[#ff7302] focus:outline-none"
              style={inter}
            />
          </div>
          <div>
            <label
              style={space}
              className="block text-xs uppercase tracking-wider text-white/60"
            >
              Opowiedz
            </label>
            <textarea
              rows={4}
              placeholder="Ściana, pomysł, termin…"
              className="mt-2 w-full resize-none border-0 border-b border-white/20 bg-transparent py-2 text-white placeholder:text-white/30 focus:border-[#ff7302] focus:outline-none"
              style={inter}
            />
          </div>
          <button
            type="button"
            className="group mt-2 flex items-center justify-center gap-3 rounded-none border-2 border-[#ff7302] bg-[#ff7302] px-8 py-4 text-white transition hover:bg-black hover:text-[#ff7302]"
            style={{ ...syne, fontWeight: 700, letterSpacing: "0.05em" }}
          >
            WYŚLIJ WIADOMOŚĆ
            <ArrowRight
              size={20}
              className="transition group-hover:translate-x-1"
            />
          </button>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VARIANT C — "Mysta + Alfa Charlie" hybryda
// Video tło + 3 pola + progress ring wokół kursora
// ═══════════════════════════════════════════════════════════════════
function VariantC() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const totalSteps = 3;

  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    if (!root || !ring) return;

    const onMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ring.style.transform = `translate(${x - 30}px, ${y - 30}px)`;
      ring.style.opacity = "1";
    };
    const onLeave = () => {
      ring.style.opacity = "0";
    };
    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const progress = step / totalSteps;
  const circumference = 2 * Math.PI * 26;

  return (
    <div
      ref={rootRef}
      className="relative min-h-[640px] overflow-hidden rounded-2xl border border-white/10 bg-black"
      style={{ cursor: "none" }}
    >
      <video
        src="/movies/hero_mini.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80" />

      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 60,
          height: 60,
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 180ms",
          zIndex: 30,
          mixBlendMode: "difference",
        }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle
            cx="30"
            cy="30"
            r="26"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />
          <circle
            cx="30"
            cy="30"
            r="26"
            fill="none"
            stroke="#ff7302"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            transform="rotate(-90 30 30)"
            style={{ transition: "stroke-dashoffset 300ms" }}
          />
          <circle cx="30" cy="30" r="3" fill="#ff7302" />
        </svg>
      </div>

      <div className="relative z-10 flex min-h-[640px] flex-col items-center justify-center p-8 md:p-14">
        <div
          style={inter}
          className="mb-3 text-xs uppercase tracking-[0.3em] text-[#ff7302]"
        >
          {String(step + 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")} · Ahoj
        </div>
        <h2
          style={syne}
          className="text-center text-5xl font-extrabold leading-[0.95] text-white md:text-6xl"
        >
          {step === 0 && "Jak się nazywasz?"}
          {step === 1 && "Gdzie Cię znaleźć?"}
          {step === 2 && "O czym pogadamy?"}
          {step === 3 && "Dzięki!"}
        </h2>
        <p style={space} className="mt-4 max-w-md text-center text-white/60">
          {step < totalSteps
            ? "Trzy pola, minuta czasu. Przesuń kursorem — zobaczysz progress."
            : "Wracam do Ciebie w 24h. Tymczasem możesz wrócić do portfolio."}
        </p>

        {step < totalSteps && (
          <div className="mt-10 w-full max-w-md">
            <input
              type={step === 1 ? "email" : "text"}
              placeholder={
                step === 0
                  ? "Jan Kowalski"
                  : step === 1
                  ? "jan@kowalski.pl"
                  : "Mural, ściana 6m², lipiec…"
              }
              className="w-full border-0 border-b-2 border-white/20 bg-transparent py-4 text-center text-xl text-white placeholder:text-white/25 focus:border-[#ff7302] focus:outline-none"
              style={{ ...syne, cursor: "text" }}
              autoFocus
            />
            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="text-sm text-white/50 transition hover:text-white disabled:opacity-30"
                style={{ ...space, cursor: "pointer" }}
              >
                ← Wstecz
              </button>
              <button
                type="button"
                onClick={() => setStep(Math.min(totalSteps, step + 1))}
                className="group flex items-center gap-3 rounded-full bg-[#ff7302] px-8 py-3 text-white transition hover:bg-white hover:text-[#ff7302]"
                style={{ ...syne, fontWeight: 700, cursor: "pointer" }}
              >
                {step === totalSteps - 1 ? "Wyślij" : "Dalej"}
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        )}

        {step === totalSteps && (
          <button
            type="button"
            onClick={() => setStep(0)}
            className="mt-10 flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-3 text-white/80 transition hover:border-[#ff7302] hover:text-white"
            style={{ ...space, cursor: "pointer" }}
          >
            <Check size={16} /> Zacznij od nowa
          </button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VARIANT D — Cevitxef microinteractions (bonus)
// Brutalist pola z animowanymi pomarańczowymi kołami na focus/type
// ═══════════════════════════════════════════════════════════════════
function VariantD() {
  return (
    <div className="relative min-h-[640px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 md:p-14">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div>
          <div
            style={inter}
            className="mb-4 text-xs uppercase tracking-[0.3em] text-[#ff7302]"
          >
            Kontakt
          </div>
          <h2
            style={syne}
            className="text-5xl font-extrabold leading-[0.95] text-white md:text-6xl"
          >
            Cześć.
            <br />
            Napisz.
          </h2>
          <p style={space} className="mt-6 max-w-sm text-white/70">
            Klasyczny formularz, ale każde pole reaguje na typing — dyskretna
            mikrointerakcja w brand-orange.
          </p>
          <div
            style={space}
            className="mt-10 flex gap-6 text-sm text-white/50"
          >
            <a href="mailto:kontakt@aeromat.pl" className="hover:text-[#ff7302]">
              kontakt@aeromat.pl
            </a>
            <span>&middot;</span>
            <a href="#" className="hover:text-[#ff7302]">
              @aeromat
            </a>
          </div>
        </div>

        <form className="space-y-8">
          {[
            { label: "IMIĘ", type: "text", placeholder: "Jan" },
            { label: "EMAIL", type: "email", placeholder: "jan@kowalski.pl" },
            {
              label: "WIADOMOŚĆ",
              type: "textarea",
              placeholder: "O czym pogadamy…",
            },
          ].map((f) => (
            <div key={f.label} className="relative">
              <label
                style={space}
                className="mb-2 block text-xs tracking-[0.2em] text-white/50"
              >
                {f.label}
              </label>
              <div className="relative">
                {f.type === "textarea" ? (
                  <textarea
                    rows={3}
                    placeholder={f.placeholder}
                    className="peer w-full resize-none border-b-2 border-white/15 bg-transparent pb-2 pt-1 text-xl text-white placeholder:text-white/25 focus:border-[#ff7302] focus:outline-none"
                    style={syne}
                  />
                ) : (
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    className="peer w-full border-b-2 border-white/15 bg-transparent pb-2 pt-1 text-xl text-white placeholder:text-white/25 focus:border-[#ff7302] focus:outline-none"
                    style={syne}
                  />
                )}
                <div
                  aria-hidden
                  className="pointer-events-none absolute right-0 top-0 h-3 w-3 rounded-full bg-[#ff7302] opacity-0 peer-focus:animate-ping peer-focus:opacity-100"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-1 top-0 h-3 w-3 rounded-full bg-[#ff7302] opacity-0 peer-focus:opacity-100"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="group relative w-full overflow-hidden rounded-none border-2 border-white py-5"
            style={{ ...syne, fontWeight: 700, letterSpacing: "0.1em" }}
          >
            <span className="relative z-10 text-white transition group-hover:text-black">
              WYŚLIJ →
            </span>
            <span className="absolute inset-0 origin-left scale-x-0 bg-[#ff7302] transition-transform duration-300 group-hover:scale-x-100" />
          </button>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VARIANT G — Instagram-like wall + minimal form pod spodem
// Social proof przez portfolio grid
// ═══════════════════════════════════════════════════════════════════
function VariantG() {
  const imgs = [
    "/Portfolio/murale/1.webp",
    "/Portfolio/murale/2.webp",
    "/Portfolio/murale/3.webp",
    "/Portfolio/murale/4.webp",
    "/Portfolio/murale/6.webp",
    "/Portfolio/murale/8.webp",
    "/Portfolio/murale/9.webp",
    "/Portfolio/murale/10.webp",
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
      <div className="grid grid-cols-4 gap-[2px] md:grid-cols-8">
        {imgs.map((src, i) => (
          <div
            key={src}
            className="relative aspect-square overflow-hidden bg-neutral-900"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="12vw"
              className="object-cover transition-transform duration-500 hover:scale-110"
            />
            {i === 7 && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/70">
                <div
                  style={syne}
                  className="text-center text-xs font-bold uppercase tracking-wider text-[#ff7302]"
                >
                  +192
                  <br />
                  więcej
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-[1.2fr_1fr] md:p-14">
        <div>
          <div
            style={inter}
            className="mb-3 text-xs uppercase tracking-[0.3em] text-[#ff7302]"
          >
            200+ realizacji &middot; cała PL
          </div>
          <h2
            style={syne}
            className="text-4xl font-extrabold leading-[0.95] text-white md:text-5xl"
          >
            Twoja ściana
            <br />
            w tym rzędzie.
          </h2>
          <p style={space} className="mt-5 max-w-md text-white/70">
            Każdy kadr powyżej to osobna historia. Opowiedz mi swoją — dopiszę
            ją do siatki.
          </p>
          <div className="mt-8 flex gap-4">
            <a
              href="https://instagram.com/aeromat"
              target="_blank"
              className="group flex items-center gap-2 text-white/70 transition hover:text-[#ff7302]"
              style={space}
            >
              <Instagram size={18} /> @aeromat
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Imię"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#ff7302] focus:outline-none"
            style={inter}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#ff7302] focus:outline-none"
            style={inter}
          />
          <textarea
            rows={4}
            placeholder="Opowiedz o swojej ścianie…"
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#ff7302] focus:outline-none"
            style={inter}
          />
          <button
            type="button"
            className="w-full rounded-lg bg-[#ff7302] py-3 text-white transition hover:bg-white hover:text-black"
            style={{ ...syne, fontWeight: 700 }}
          >
            WYŚLIJ
          </button>
        </form>
      </div>
    </div>
  );
}



// ═══════════════════════════════════════════════════════════════════
// VARIANT J — 3D tilt card z parallaxem (mouse-track)
// ═══════════════════════════════════════════════════════════════════
function VariantJ() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1200px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateZ(0)`;
    };
    const onLeave = () => {
      card.style.transform = "perspective(1200px) rotateX(0) rotateY(0)";
    };
    const parent = card.parentElement;
    if (!parent) return;
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="relative flex min-h-[640px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#1a0f05] to-[#0a0a0a] p-8">
      <div aria-hidden className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-[#ff7302] opacity-20 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-[#228DFF] opacity-15 blur-[100px]" />

      <div
        ref={cardRef}
        style={{
          transition: "transform 400ms cubic-bezier(0.2,0.9,0.3,1)",
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-black/60 p-10 shadow-2xl backdrop-blur-xl md:p-14"
      >
        <div style={{ transform: "translateZ(30px)" }}>
          <div style={inter} className="mb-3 text-xs uppercase tracking-[0.3em] text-[#ff7302]">
            Floating card &middot; parallax
          </div>
          <h2 style={syne} className="text-5xl font-extrabold leading-[0.95] text-white md:text-6xl">
            Hej,
            <br />
            <span className="text-[#ff7302]">zobacz mnie</span> w 3D.
          </h2>
          <p style={space} className="mt-5 max-w-md text-white/60">
            Porusz myszką — karta podąża. Pod spodem klasyczny formularz.
          </p>
        </div>

        <div style={{ transform: "translateZ(50px)" }} className="mt-10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Imię" className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#ff7302] focus:outline-none" style={inter} />
            <input type="email" placeholder="Email" className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#ff7302] focus:outline-none" style={inter} />
          </div>
          <textarea rows={3} placeholder="Krótko o projekcie…" className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#ff7302] focus:outline-none" style={inter} />
          <button type="button" className="w-full rounded-xl bg-[#ff7302] py-4 text-white transition hover:scale-[1.02] hover:bg-white hover:text-black" style={{ ...syne, fontWeight: 700, letterSpacing: "0.05em" }}>
            WYŚLIJ →
          </button>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════
// VARIANT L — Before/After slider
// ═══════════════════════════════════════════════════════════════════
function VariantL() {
  const [pos, setPos] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const update = (clientX: number) => {
      const rect = el.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      setPos(pct);
    };
    const onDown = (e: MouseEvent | TouchEvent) => {
      dragging.current = true;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      update(x);
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      update(x);
    };
    const onUp = () => (dragging.current = false);
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    el.addEventListener("touchstart", onDown);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <div className="grid min-h-[640px] grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-black md:grid-cols-[1.3fr_1fr]">
      <div ref={sliderRef} className="relative select-none overflow-hidden" style={{ cursor: "ew-resize", minHeight: "360px" }}>
        <Image src="/Portfolio/murale/1.webp" alt="Zanim" fill sizes="60vw" className="object-cover" style={{ filter: "grayscale(1) brightness(0.5) contrast(0.7)" }} />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src="/Portfolio/murale/2.webp" alt="Po" fill sizes="60vw" className="object-cover" />
        </div>

        <div className="absolute inset-y-0 w-1 bg-[#ff7302]" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
          <div className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#ff7302] bg-black shadow-xl">
            <span className="text-[#ff7302]">⇄</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-xs text-white/80 backdrop-blur-sm" style={space}>ZANIM</div>
        <div className="absolute bottom-4 right-4 rounded-full bg-[#ff7302]/90 px-3 py-1 text-xs text-white backdrop-blur-sm" style={space}>PO</div>
      </div>

      <div className="flex flex-col justify-center p-8 md:p-12">
        <div style={inter} className="mb-3 text-xs uppercase tracking-[0.3em] text-[#ff7302]">Transformacja</div>
        <h2 style={syne} className="text-4xl font-extrabold leading-[0.95] text-white md:text-5xl">
          Pokaż mi ścianę.
          <br />
          <span className="text-white/40">Reszta to moja praca.</span>
        </h2>
        <p style={space} className="mt-5 text-white/70">Przesuń suwak po lewej — każdy mural tak wygląda na starcie.</p>

        <form className="mt-8 space-y-4">
          <input type="text" placeholder="Imię" className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#ff7302] focus:outline-none" style={inter} />
          <input type="email" placeholder="Email" className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#ff7302] focus:outline-none" style={inter} />
          <button type="button" className="group flex w-full items-center justify-center gap-3 rounded-lg bg-[#ff7302] py-3 text-white transition hover:bg-white hover:text-black" style={{ ...syne, fontWeight: 700 }}>
            ZAMIEŃ MOJĄ ŚCIANĘ
            <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VARIANT M — Neon sign (nawiązanie do szyldów AeroMat)
// ═══════════════════════════════════════════════════════════════════
function VariantM() {
  return (
    <div className="relative min-h-[640px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "linear-gradient(45deg, #111 25%, transparent 25%), linear-gradient(-45deg, #111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111 75%), linear-gradient(-45deg, transparent 75%, #111 75%)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(255,115,2,0.18) 0%, transparent 60%)" }} />

      <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          2%, 10% { opacity: 0.6; }
          3%, 12% { opacity: 1; }
          40% { opacity: 0.95; }
          60% { opacity: 0.8; }
          61% { opacity: 1; }
        }
        .neon-tube {
          color: #fff5e8;
          text-shadow:
            0 0 4px #ff7302,
            0 0 10px #ff7302,
            0 0 22px #ff7302,
            0 0 45px rgba(255, 115, 2, 0.7),
            0 0 80px rgba(255, 115, 2, 0.4);
          animation: flicker 5.5s infinite;
        }
        .neon-blue {
          color: #eaf3ff;
          text-shadow:
            0 0 4px #228DFF,
            0 0 10px #228DFF,
            0 0 22px #228DFF,
            0 0 45px rgba(34, 141, 255, 0.6);
        }
      `}</style>

      <div className="relative z-10 flex min-h-[640px] flex-col items-center justify-center p-8">
        <div style={{ fontFamily: "monospace" }} className="mb-8 text-xs uppercase tracking-[0.4em] text-white/40">
          otwarte &middot; open &middot; offen
        </div>

        <div className="neon-tube text-center" style={{ ...syne, fontSize: "clamp(3rem, 9vw, 8rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 0.9 }}>
          AEROMAT
        </div>

        <div className="neon-blue mt-2 text-center" style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(2rem, 6vw, 4.5rem)", fontWeight: 700, transform: "rotate(-3deg)" }}>
          napisz do nas
        </div>

        <div style={{ fontFamily: "monospace" }} className="mt-6 text-xs uppercase tracking-widest text-white/50">
          est. 2000 &middot; ręcznie malowane od 25 lat
        </div>

        <div className="mt-10 flex w-full max-w-md flex-col gap-3">
          <input type="email" placeholder="twoj@email.pl" className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-center text-white placeholder:text-white/30 focus:border-[#ff7302] focus:outline-none" style={inter} />
          <button type="button" className="rounded-full border-2 border-[#ff7302] bg-transparent py-3 text-[#ff7302] transition hover:bg-[#ff7302] hover:text-black" style={{ ...syne, fontWeight: 700, letterSpacing: "0.15em", textShadow: "0 0 8px #ff7302, 0 0 16px rgba(255,115,2,0.6)" }}>
            ZADZWOŃ DO NAS
          </button>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════
// VARIANT O — Spray splatter reveal
// Animacja plamy farby odsłaniająca layout
// ═══════════════════════════════════════════════════════════════════
function VariantO() {
  return (
    <div className="relative min-h-[640px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
      <style jsx>{`
        @keyframes splatterIn {
          0% { transform: scale(0.2) rotate(-15deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(8deg); opacity: 0.9; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes drip {
          0% { height: 0; opacity: 0; }
          100% { height: var(--h, 120px); opacity: 1; }
        }
        .splat { animation: splatterIn 900ms cubic-bezier(0.2, 0.9, 0.3, 1) both; }
        .drip-line { animation: drip 1200ms ease-out 600ms both; }
      `}</style>

      <svg aria-hidden className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 800">
        <defs>
          <filter id="rough">
            <feTurbulence baseFrequency="0.015" numOctaves="3" seed="2" />
            <feDisplacementMap in="SourceGraphic" scale="30" />
          </filter>
        </defs>
        <g className="splat" style={{ transformOrigin: "600px 400px" }}>
          <ellipse cx="600" cy="400" rx="450" ry="320" fill="#ff7302" opacity="0.95" filter="url(#rough)" />
          <ellipse cx="280" cy="260" rx="80" ry="60" fill="#ff7302" opacity="0.6" filter="url(#rough)" />
          <ellipse cx="940" cy="520" rx="90" ry="70" fill="#ff7302" opacity="0.7" filter="url(#rough)" />
          <circle cx="180" cy="520" r="35" fill="#ff7302" opacity="0.5" filter="url(#rough)" />
          <circle cx="1050" cy="240" r="28" fill="#ff7302" opacity="0.5" filter="url(#rough)" />
          <circle cx="720" cy="110" r="20" fill="#ff7302" opacity="0.6" />
          <circle cx="360" cy="680" r="24" fill="#ff7302" opacity="0.5" />
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-around">
        {[80, 140, 100, 160, 90, 130, 110].map((h, i) => (
          <div key={i} className="drip-line w-[3px] bg-[#ff7302]/70" style={{ ["--h" as string]: `${h}px`, animationDelay: `${0.6 + i * 0.1}s` } as React.CSSProperties} />
        ))}
      </div>

      <div className="relative z-10 flex min-h-[640px] flex-col items-center justify-center p-8">
        <div style={inter} className="mb-3 text-xs uppercase tracking-[0.3em] text-black/70">
          Zaczynamy
        </div>
        <h2 style={syne} className="text-center text-5xl font-extrabold leading-[0.9] text-black md:text-7xl" >
          Zostaw ślad.
        </h2>
        <p style={space} className="mt-5 max-w-md text-center text-black/70">
          Plamka farby, trzy pola, jedna minuta.
        </p>

        <div className="mt-8 w-full max-w-md space-y-3">
          <input type="text" placeholder="Imię" className="w-full rounded-lg border-2 border-black/30 bg-white/95 px-4 py-3 text-black placeholder:text-black/40 focus:border-black focus:outline-none" style={inter} />
          <input type="email" placeholder="Email" className="w-full rounded-lg border-2 border-black/30 bg-white/95 px-4 py-3 text-black placeholder:text-black/40 focus:border-black focus:outline-none" style={inter} />
          <button type="button" className="w-full rounded-lg border-2 border-black bg-black py-3 text-white transition hover:bg-transparent hover:text-black" style={{ ...syne, fontWeight: 700, letterSpacing: "0.05em" }}>
            WYŚLIJ →
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VARIANT Q — Paint swatch color picker
// 8 próbek RAL, klik zmienia accent formularza
// ═══════════════════════════════════════════════════════════════════
function VariantQ() {
  const palette = [
    { name: "Aerosol Orange", code: "RAL 2009", color: "#ff7302" },
    { name: "Neon Blue", code: "RAL 5002", color: "#228DFF" },
    { name: "Rose Madder", code: "RAL 3017", color: "#e85a8c" },
    { name: "Chartreuse", code: "RAL 6018", color: "#bce021" },
    { name: "Deep Plum", code: "RAL 4007", color: "#5d3b6b" },
    { name: "Cadmium", code: "RAL 1021", color: "#f5c400" },
    { name: "Graphite", code: "RAL 9011", color: "#262626" },
    { name: "Bone", code: "RAL 9001", color: "#e8dcc4" },
  ];
  const [selected, setSelected] = useState(0);
  const accent = palette[selected];

  return (
    <div className="min-h-[640px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
      <div className="grid min-h-[640px] grid-cols-1 md:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col p-8 md:p-12">
          <div className="mb-3 text-xs uppercase tracking-[0.3em]" style={{ ...inter, color: accent.color }}>
            Paleta · wybierz swój kolor
          </div>
          <h2 style={syne} className="text-4xl font-extrabold leading-[0.95] text-white md:text-5xl">
            Jakim kolorem
            <br />
            <span style={{ color: accent.color, transition: "color 400ms" }}>pomalujemy</span>
            <br />
            twój projekt?
          </h2>

          <div className="mt-8 grid grid-cols-4 gap-2">
            {palette.map((p, i) => (
              <button
                key={p.code}
                type="button"
                onClick={() => setSelected(i)}
                className="group relative aspect-square overflow-hidden rounded-md transition hover:scale-105"
                style={{ backgroundColor: p.color, outline: selected === i ? `3px solid white` : "none", outlineOffset: "3px" }}
                aria-label={p.name}
              >
                {selected === i && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-white shadow-lg" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-baseline justify-between">
            <div style={syne} className="text-lg font-bold text-white">{accent.name}</div>
            <div style={{ fontFamily: "monospace" }} className="text-xs text-white/50">{accent.code}</div>
          </div>
          <div className="mt-1 text-xs" style={{ fontFamily: "monospace", color: accent.color }}>
            {accent.color.toUpperCase()}
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 md:p-12" style={{ background: `linear-gradient(135deg, ${accent.color}15 0%, transparent 50%)`, transition: "background 400ms" }}>
          <form className="w-full max-w-md space-y-5">
            <div>
              <label style={space} className="block text-xs uppercase tracking-wider text-white/60">Imię</label>
              <input type="text" placeholder="Jan Kowalski" className="mt-2 w-full border-0 border-b-2 border-white/15 bg-transparent py-2 text-xl text-white placeholder:text-white/25 focus:outline-none" style={{ ...inter, borderBottomColor: undefined }} onFocus={(e) => (e.currentTarget.style.borderBottomColor = accent.color)} onBlur={(e) => (e.currentTarget.style.borderBottomColor = "")} />
            </div>
            <div>
              <label style={space} className="block text-xs uppercase tracking-wider text-white/60">Email</label>
              <input type="email" placeholder="jan@kowalski.pl" className="mt-2 w-full border-0 border-b-2 border-white/15 bg-transparent py-2 text-xl text-white placeholder:text-white/25 focus:outline-none" style={inter} onFocus={(e) => (e.currentTarget.style.borderBottomColor = accent.color)} onBlur={(e) => (e.currentTarget.style.borderBottomColor = "")} />
            </div>
            <div>
              <label style={space} className="block text-xs uppercase tracking-wider text-white/60">Wiadomość</label>
              <textarea rows={3} placeholder="Ściana, wymiary, inspiracje…" className="mt-2 w-full resize-none border-0 border-b-2 border-white/15 bg-transparent py-2 text-xl text-white placeholder:text-white/25 focus:outline-none" style={inter} onFocus={(e) => (e.currentTarget.style.borderBottomColor = accent.color)} onBlur={(e) => (e.currentTarget.style.borderBottomColor = "")} />
            </div>
            <button type="button" className="w-full rounded-lg py-3 text-white transition hover:scale-[1.02]" style={{ ...syne, fontWeight: 700, letterSpacing: "0.05em", backgroundColor: accent.color }}>
              WYŚLIJ W KOLORZE {accent.code}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// VARIANT S — Fullscreen panorama (spójność z / home)
// Duże zdjęcie + animowany caption (jak panorama section)
// ═══════════════════════════════════════════════════════════════════
function VariantS() {
  return (
    <div className="relative min-h-[640px] overflow-hidden rounded-2xl border border-white/10 bg-black">
      <Image src="/Portfolio/murale/2.webp" alt="" fill sizes="100vw" className="object-cover" style={{ filter: "brightness(0.7)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.6) 100%)" }} />

      <div className="relative z-10 grid min-h-[640px] grid-cols-1 md:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col justify-center p-8 md:p-16">
          <div style={inter} className="mb-3 text-xs uppercase tracking-[0.3em] text-[#ff7302]">
            Kontakt · 03 · ostatnia sekcja
          </div>
          <h2 style={{ ...syne, fontSize: "clamp(3rem, 7vw, 7rem)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 0.9, color: "#fff" }}>
            Sztuka bez
            <br />
            granic.
          </h2>
          <p style={{ ...space, fontSize: "clamp(1rem, 1.3vw, 1.2rem)", lineHeight: 1.6, color: "rgb(255 255 255 / 82%)", maxWidth: "50ch", marginTop: "1.5rem" }}>
            Każdy mural to inna historia — od kameralnych wnętrz po wielkoformatowe fasady. Opowiedz swoją.
          </p>
          <div style={space} className="mt-8 flex flex-wrap gap-6 text-sm text-white/70">
            <span>● 200+ realizacji</span>
            <span>● 25 lat doświadczenia</span>
            <span>● cała Polska</span>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 md:p-12">
          <div className="rounded-2xl border border-white/15 bg-black/40 p-6 backdrop-blur-md md:p-8">
            <div style={syne} className="text-2xl font-bold text-white">
              Napisz do Mateusza
            </div>
            <form className="mt-6 space-y-4">
              <input type="text" placeholder="Imię" className="w-full border-0 border-b border-white/20 bg-transparent py-2 text-white placeholder:text-white/30 focus:border-[#ff7302] focus:outline-none" style={inter} />
              <input type="email" placeholder="Email" className="w-full border-0 border-b border-white/20 bg-transparent py-2 text-white placeholder:text-white/30 focus:border-[#ff7302] focus:outline-none" style={inter} />
              <textarea rows={3} placeholder="Krótko o projekcie…" className="w-full resize-none border-0 border-b border-white/20 bg-transparent py-2 text-white placeholder:text-white/30 focus:border-[#ff7302] focus:outline-none" style={inter} />
              <button type="button" className="mt-2 w-full bg-[#ff7302] py-3 text-white transition hover:bg-white hover:text-black" style={{ ...syne, fontWeight: 700, letterSpacing: "0.05em" }}>
                WYŚLIJ →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════
type Proposal = {
  id: string;
  rank: string;
  label: string;
  inspiration: string;
  pros: string;
  cons: string;
  render: React.FC;
};

const proposals: Proposal[] = [
  {
    id: "A",
    rank: "🥇",
    label: "A — \"GOMAD model\" · kanały + portret",
    inspiration: "marcusgomaddebie.com (holenderski muralista, 35 lat stażu)",
    pros: "Autentyczność solo-artysty · brak formularza = zero tarcia · portret buduje zaufanie",
    cons: "Wymaga dobrego zdjęcia · bez automatyzacji leadów",
    render: VariantA,
  },
  {
    id: "B",
    rank: "🥈",
    label: "B — Brutalism + ogromna typografia \"NAPISZ\"",
    inspiration: "The Badass Project (Muzli) — graffiti typography + parallax",
    pros: "Street-art DNA · spójne z Syne + #ff7302 · zerowe nowe assety",
    cons: "Mocny charakter — nie każdemu klientowi się spodoba",
    render: VariantB,
  },
  {
    id: "C",
    rank: "🥉",
    label: "C — Step-by-step + progress ring wokół kursora",
    inspiration: "Alfa Charlie + Mysta Electric (Muzli) — portfolio-first",
    pros: "Premium feel · redukuje tarcie · memorability (kursor)",
    cons: "Custom cursor łamie się na touch · trochę więcej JS",
    render: VariantC,
  },
  {
    id: "D",
    rank: "·",
    label: "D — Brutalizm z mikrointerakcjami (Cevitxef)",
    inspiration: "Cevitxef (Muzli) — czerwone koła na typing w input",
    pros: "Czysty formularz + charakter · klasyczna konwencja · zwięzłe",
    cons: "Mniej wyróżniające się niż A/B/C",
    render: VariantD,
  },
  {
    id: "G",
    rank: "·",
    label: "G — Instagram-wall + formularz",
    inspiration: "Mysta Electric + dowód społeczny",
    pros: "Portfolio = pierwsze wrażenie · CTA do Instagrama",
    cons: "Dużo obrazków = waga strony (LCP)",
    render: VariantG,
  },
  {
    id: "J",
    rank: "·",
    label: "J — 3D tilt card (mouse parallax)",
    inspiration: "Stripe / Linear-style floating cards",
    pros: "Premium feel · modern · reaguje na kursor",
    cons: "Wymaga JS · wyłączyć dla prefers-reduced-motion",
    render: VariantJ,
  },
  {
    id: "L",
    rank: "·",
    label: "L — Before/After drag slider",
    inspiration: "Renowacje, Apple product pages",
    pros: "Interaktywne · pokazuje wartość pracy · touch + mouse",
    cons: "Wymaga realnych par zdjęć przed/po",
    render: VariantL,
  },
  {
    id: "M",
    rank: "·",
    label: "M — Neon sign (szyld AeroMat)",
    inspiration: "Nawiązanie do szyldów AeroMat — brand heritage",
    pros: "Unikalny · rzemiosło (szyldy!) · flicker = życie",
    cons: "Mocno charakterystyczne",
    render: VariantM,
  },
  {
    id: "O",
    rank: "NEW",
    label: "O — Spray splatter reveal",
    inspiration: "Street-art DNA — rozprysk farby jako maska reveal",
    pros: "Street-art native · kinetic entrance · pasuje do muralisty",
    cons: "Animacja tylko na mount — jednorazowy efekt",
    render: VariantO,
  },
  {
    id: "Q",
    rank: "NEW",
    label: "Q — Paint swatch color picker",
    inspiration: "Próbki RAL / paleta malarza — interaktywny wybór akcentu",
    pros: "Meta-kolorystycznie · zabawa · klient wybiera swój kolor",
    cons: "Gimmickowy jeśli przesadzimy",
    render: VariantQ,
  },
  {
    id: "S",
    rank: "NEW",
    label: "S — Fullscreen panorama (spójność z /)",
    inspiration: "Nawiązanie do panoramy z home page — Syne captions",
    pros: "Spójność z już wdrożoną sekcją · brand consistency",
    cons: "Może być zbyt podobne do innych sekcji",
    render: VariantS,
  },
];

export default function KontaktMockup() {
  return (
    <main
      style={inter}
      className="min-h-screen bg-[#070707] text-white"
    >
      <header className="mx-auto max-w-[1400px] px-6 pt-24 pb-8">
        <div
          style={{
            ...inter,
            fontSize: "0.75rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#ff7302",
            marginBottom: "0.75rem",
          }}
        >
          Research-backed &middot; 3 rekomendacje + 1 bonus
        </div>
        <h1
          style={{
            ...syne,
            fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            lineHeight: 0.95,
            margin: 0,
          }}
        >
          Kontakt · mockupy
        </h1>
        <p
          style={space}
          className="mt-4 max-w-[65ch] leading-relaxed text-white/60"
        >
          Cztery pełne warianty zbudowane na realnych wzorcach z{" "}
          <Link
            href="https://muz.li/inspiration/contact-page/"
            target="_blank"
            className="text-white/90 underline decoration-[#ff7302] underline-offset-4 hover:text-[#ff7302]"
          >
            Muzli contact gallery
          </Link>{" "}
          i stron muralistów (GOMAD). Po wyborze przeniosę styl do{" "}
          <code className="text-[#ff7302]">app/kontakt/page.tsx</code>.
        </p>
      </header>

      <div className="mx-auto flex max-w-[1400px] flex-col gap-16 px-6 pb-24">
        {proposals.map((p) => {
          const Render = p.render;
          return (
            <section key={p.id}>
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <h3
                    style={syne}
                    className="m-0 text-2xl font-bold text-white"
                  >
                    <span className="mr-2">{p.rank}</span>
                    {p.label}
                  </h3>
                  <div
                    style={space}
                    className="mt-1 text-xs uppercase tracking-wider text-white/40"
                  >
                    Inspiracja: {p.inspiration}
                  </div>
                </div>
              </div>

              <div
                style={space}
                className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-sm"
              >
                <div className="text-emerald-400/90">+ {p.pros}</div>
                <div className="text-red-400/80">− {p.cons}</div>
              </div>

              <Render />
            </section>
          );
        })}
      </div>

      <footer
        style={space}
        className="mx-auto max-w-[1400px] px-6 pb-16 text-sm text-white/40"
      >
        Powiedz literę wariantu (A / B / C / D) — przeniosę do{" "}
        <code className="text-[#ff7302]">app/kontakt/page.tsx</code>.
      </footer>
    </main>
  );
}
