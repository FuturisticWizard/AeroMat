"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { formSchema } from "../lib/schemas";
import { send } from "../lib/email";

type FormData = z.infer<typeof formSchema>;

type Step = {
  key: keyof FormData;
  label: string;
  eyebrow: string;
  placeholder: string;
  type: "text" | "email" | "textarea";
};

const steps: Step[] = [
  {
    key: "firstName",
    label: "Przedstaw się.",
    eyebrow: "Witaj",
    placeholder: "Imię i nazwisko",
    type: "text",
  },
  {
    key: "email",
    label: "Adres email.",
    eyebrow: "Kontakt zwrotny",
    placeholder: "imie@domena.pl",
    type: "email",
  },
  {
    key: "title",
    label: "Temat rozmowy.",
    eyebrow: "O projekcie",
    placeholder: "np. mural 8m² na klatce schodowej",
    type: "text",
  },
  {
    key: "message",
    label: "Opowiedz o projekcie.",
    eyebrow: "Szczegóły",
    placeholder: "Lokalizacja, wymiary, termin realizacji, inspiracje, budżet…",
    type: "textarea",
  },
];

const syne = { fontFamily: "var(--font-bebas)", letterSpacing: "0.02em" } as const;
const space = { fontFamily: "var(--font-space)" } as const;
const inter = { fontFamily: "var(--font-space)" } as const;

export default function ContactPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { firstName: "", email: "", title: "", message: "" },
  });

  const totalSteps = steps.length;
  const progress = status === "sent" ? 1 : step / totalSteps;
  const circumference = 2 * Math.PI * 26;

  // Custom cursor ring — tylko desktop, respektuje reduced-motion
  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    if (!root || !ring) return;

    const hasHover = window.matchMedia("(hover: hover)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hasHover || reduced) {
      root.style.cursor = "auto";
      return;
    }

    const onMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      ring.style.transform = `translate(${e.clientX - rect.left - 30}px, ${e.clientY - rect.top - 30}px)`;
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

  const current = steps[step];
  const isLast = step === totalSteps - 1;
  const done = status === "sent";

  const goNext = async () => {
    if (!current) return;
    const ok = await form.trigger(current.key);
    if (!ok) return;
    if (isLast) {
      await submit();
    } else {
      setStep((s) => Math.min(totalSteps - 1, s + 1));
    }
  };

  const goBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const submit = async () => {
    setStatus("sending");
    setErrorMsg("");
    try {
      await send(form.getValues());
      setStatus("sent");
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Wystąpił błąd.");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && current?.type !== "textarea") {
      e.preventDefault();
      goNext();
    }
  };

  const fieldError = current ? form.formState.errors[current.key]?.message : undefined;

  return (
    <main
      ref={rootRef}
      className="relative min-h-screen overflow-hidden bg-black"
      style={{ cursor: "none" }}
    >
      <video
        src="/movies/hero_mini.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
        aria-hidden
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/85"
      />

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
          <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
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

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16">
        {!done ? (
          <form
            onKeyDown={onKeyDown}
            onSubmit={(e) => e.preventDefault()}
            className="w-full max-w-2xl"
          >
            <div
              style={inter}
              className="mb-4 text-center text-xs uppercase tracking-[0.3em] text-[#ff7302]"
            >
              {String(step + 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")} &middot; {current.eyebrow}
            </div>

            <h1
              style={{ ...syne, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 0.95 }}
              className="text-center text-white"
            >
              {current.label}
            </h1>

            <div className="mt-10">
              {current.type === "textarea" ? (
                <textarea
                  key={current.key}
                  rows={5}
                  placeholder={current.placeholder}
                  autoFocus
                  {...form.register(current.key)}
                  className="w-full resize-none border-0 border-b-2 border-white/20 bg-transparent py-4 text-center text-lg text-white placeholder:text-white/25 focus:border-[#ff7302] focus:outline-none md:text-xl"
                  style={{ ...inter, cursor: "text" }}
                />
              ) : (
                <input
                  key={current.key}
                  type={current.type}
                  placeholder={current.placeholder}
                  autoFocus
                  autoComplete={current.key === "email" ? "email" : "off"}
                  {...form.register(current.key)}
                  className="w-full border-0 border-b-2 border-white/20 bg-transparent py-4 text-center text-2xl text-white placeholder:text-white/25 focus:border-[#ff7302] focus:outline-none md:text-3xl"
                  style={{ ...syne, cursor: "text" }}
                />
              )}
              {fieldError && (
                <div
                  style={space}
                  className="mt-3 text-center text-sm text-red-400"
                  role="alert"
                >
                  {String(fieldError)}
                </div>
              )}
            </div>

            <div className="mt-10 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 0 || status === "sending"}
                className="text-sm text-white/50 transition hover:text-white disabled:opacity-30"
                style={{ ...space, cursor: "pointer" }}
              >
                <ArrowLeft size={14} className="mr-1 inline" /> Wstecz
              </button>

              <div className="flex gap-2">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className="h-1 w-6 rounded-full transition-colors"
                    style={{
                      backgroundColor:
                        i < step ? "#ff7302" : i === step ? "rgba(255,115,2,0.5)" : "rgba(255,255,255,0.15)",
                    }}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                disabled={status === "sending"}
                className="group flex items-center gap-3 rounded-full bg-[#ff7302] px-8 py-3 text-white transition hover:bg-white hover:text-[#ff7302] disabled:opacity-60"
                style={{ ...syne, fontWeight: 700, cursor: "pointer" }}
              >
                {status === "sending" ? "Wysyłam…" : isLast ? "Wyślij" : "Dalej"}
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </button>
            </div>

            {status === "error" && (
              <div
                style={space}
                className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-300"
                role="alert"
              >
                {errorMsg}
              </div>
            )}

            <div
              style={space}
              className="mt-8 text-center text-xs text-white/40"
            >
              Enter &middot; następne pole &middot; odpowiedź w ciągu 24 godzin
            </div>
          </form>
        ) : (
          <div className="w-full max-w-xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#ff7302] text-[#ff7302]">
              <Check size={28} />
            </div>
            <h1
              style={{ ...syne, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 0.95 }}
              className="mt-8 text-white"
            >
              Wiadomość wysłana.
            </h1>
            <p style={space} className="mt-5 text-white/70">
              Dziękuję{form.getValues("firstName") ? `, ${form.getValues("firstName")}` : ""}. Odpowiem w ciągu 24 godzin.
              <br />
              W międzyczasie możesz zajrzeć do portfolio.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/"
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-white/80 transition hover:border-[#ff7302] hover:text-white"
                style={{ ...space, cursor: "pointer" }}
              >
                Strona główna
              </a>
              <a
                href="/portfolio"
                className="rounded-full bg-[#ff7302] px-6 py-3 text-white transition hover:bg-white hover:text-black"
                style={{ ...syne, fontWeight: 700, cursor: "pointer" }}
              >
                Portfolio →
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
