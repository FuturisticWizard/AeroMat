"use client";

import Image from "next/image";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, Check, Mail, Phone, MapPin } from "lucide-react";

import { formSchema } from "../lib/schemas";
import { send } from "../lib/email";
import { CONTACT } from "../lib/contact";
import SplitTextReveal from "../components/SplitTextReveal";

type FormData = z.infer<typeof formSchema>;

const bebas = { fontFamily: "var(--font-bebas)", letterSpacing: "0.01em" } as const;
const space = { fontFamily: "var(--font-space)" } as const;

const PHOTO = "/images/portret.webp";

type FieldName = keyof FormData;

type FieldConfig = {
  name: FieldName;
  label: string;
  type: "text" | "email" | "textarea";
  placeholder: string;
  autoComplete?: string;
};

const fields: FieldConfig[] = [
  { name: "firstName", label: "Imię", type: "text", placeholder: "Jan Kowalski", autoComplete: "name" },
  { name: "email", label: "E-mail", type: "email", placeholder: "jan@firma.pl", autoComplete: "email" },
  { name: "title", label: "Temat", type: "text", placeholder: "np. mural 8m² na klatce" },
  { name: "message", label: "Wiadomość", type: "textarea", placeholder: "Krótko, w 1–2 zdaniach…" },
];

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: { firstName: "", email: "", title: "", message: "", company: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await send(values);
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
        setErrorMsg(res.message);
      }
    } catch {
      // Wyjątek tu oznacza błąd sieci/serwera (akcja nieosiągalna), nie logikę formularza.
      setStatus("error");
      setErrorMsg("Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.");
    }
  });

  const done = status === "sent";

  return (
    <main className="relative min-h-screen overflow-hidden bg-black pt-16 sm:pt-18 md:pt-20">
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-black">
        <Image
          src={PHOTO}
          alt="Mateusz — AeroMat"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/40 to-black/75" />

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl grid-cols-1 items-center gap-8 p-6 min-[700px]:grid-cols-2 md:gap-10 md:p-14">
          {/* lewa kolumna (na lg): naglowek + dane kontaktowe; na mniejszych na gorze */}
          <div className="flex flex-row items-center justify-between gap-4 min-[700px]:flex-col min-[700px]:items-start min-[700px]:justify-start min-[700px]:gap-8">
            <div className="max-w-2xl">
              <SplitTextReveal className="contact-hero" selector="h1">
                <h1
                  style={bebas}
                  className="text-white leading-[0.85] text-[clamp(1.75rem,5.5vw,5.5rem)]"
                >
                  Zacznijmy<br /> od krótkiej<br />
                  <span className="text-[#ff7302]">wiadomości.</span>
                </h1>
              </SplitTextReveal>
            </div>

            {/* dane kontaktowe */}
            <SplitTextReveal paragraphSelector="a, span">
              <ul className="space-y-3 text-white/85" style={space}>
                <li className="flex items-center gap-2 text-xs min-[700px]:gap-3 min-[700px]:text-xl xl:text-2xl">
                  <Mail size={22} className="text-[#ff7302]" />
                  <a href={`mailto:${CONTACT.email}`} className="hover:text-[#ff7302] transition">
                    {CONTACT.email}
                  </a>
                </li>
                <li className="flex items-center gap-2 text-xs min-[700px]:gap-3 min-[700px]:text-xl xl:text-2xl">
                  <Phone size={22} className="text-[#ff7302]" />
                  <a href={`tel:${CONTACT.phoneTel}`} className="hover:text-[#ff7302] transition">
                    {CONTACT.phoneDisplay}
                  </a>
                </li>
                <li className="flex items-center gap-2 text-xs min-[700px]:gap-3 min-[700px]:text-xl xl:text-2xl">
                  <MapPin size={20} className="text-[#ff7302]" /> <span>{CONTACT.location}</span>
                </li>
              </ul>
            </SplitTextReveal>
          </div>

          {/* prawa kolumna: formularz / sukces */}
          {!done ? (
              <form
                onSubmit={onSubmit}
                noValidate
                className="kontakt-form mx-auto w-full max-w-md border border-white/15 bg-white/[0.06] p-5 backdrop-blur-md sm:p-7 min-[700px]:ml-auto 2xl:max-w-xl 2xl:border-white/25 2xl:bg-white/10 2xl:p-9"
                style={{ boxShadow: "0 30px 60px -10px rgba(0,0,0,0.6)" }}
              >
                <div className="mb-3 lg:mb-5">
                  <p className="text-xs uppercase tracking-[0.32em] text-white/55 min-[2200px]:text-base" style={space}>
                    Napisz do mnie!
                  </p>
                </div>
                {/* Honeypot — ukryte pole-pułapka na boty. Niewidoczne dla ludzi
                    i pomijane przez czytniki ekranu; boty zwykle je wypełniają. */}
                <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="company">Nie wypełniaj tego pola</label>
                  <input
                    id="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...form.register("company")}
                  />
                </div>
                <div className="flex flex-col gap-3 lg:gap-5">
                  {fields.map((f) => {
                    const err = form.formState.errors[f.name]?.message as string | undefined;
                    const inputCls =
                      "w-full rounded-md border border-white/15 bg-white/[0.03] px-4 py-2 lg:py-3 text-white outline-none transition focus:border-[#ff7302] focus:ring-2 focus:ring-[#ff7302]/50 min-[2200px]:py-4 min-[2200px]:text-lg";
                    return (
                      <div key={f.name} className="flex flex-col gap-1.5 lg:gap-2">
                        <label
                          htmlFor={f.name}
                          className="text-[10px] uppercase tracking-[0.32em] text-white/55 min-[2200px]:text-sm"
                          style={space}
                        >
                          {f.label}
                        </label>
                        {f.type === "textarea" ? (
                          <textarea
                            id={f.name}
                            rows={3}
                            placeholder={f.placeholder}
                            {...form.register(f.name)}
                            className={`${inputCls} resize-none`}
                            style={space}
                          />
                        ) : (
                          <input
                            id={f.name}
                            type={f.type}
                            placeholder={f.placeholder}
                            autoComplete={f.autoComplete}
                            {...form.register(f.name)}
                            className={inputCls}
                            style={space}
                          />
                        )}
                        {/* Zawsze obecny wiersz na blad - rezerwuje miejsce, zeby pojawienie
                            sie komunikatu nie zmienialo wysokosci sekcji (tlo by sie skalowalo). */}
                        <p className="min-h-3.5 text-xs text-red-400 lg:min-h-4" style={space} role="alert">
                          {err ?? ""}
                        </p>
                      </div>
                    );
                  })}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group inline-flex w-full items-center justify-center gap-3 bg-[#ff7302] px-7 py-3 text-[1.2rem] font-semibold uppercase text-white transition hover:bg-white hover:text-[#bf4d00] disabled:opacity-60 lg:py-4 min-[2200px]:py-5 min-[2200px]:text-2xl"
                    style={{ ...bebas, letterSpacing: "0.25em" }}
                  >
                    {status === "sending" ? "Wysyłam…" : "Wyślij"}
                    <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </button>

                  {/* Komunikat o bledzie wysylki - pokazywany tylko gdy wystapi
                      (bez rezerwowania pustego miejsca pod przyciskiem). */}
                  {status === "error" && (
                    <p
                      role="alert"
                      aria-live="assertive"
                      className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-center text-xs text-red-300"
                      style={space}
                    >
                      {errorMsg}
                    </p>
                  )}
                </div>
              </form>
            ) : (
              <div
                role="status"
                aria-live="polite"
                className="mx-auto w-full max-w-md border border-white/15 bg-white/[0.06] p-5 text-center backdrop-blur-md sm:p-7 min-[700px]:ml-auto 2xl:max-w-xl 2xl:border-white/25 2xl:bg-white/10 2xl:p-9"
                style={{ boxShadow: "0 30px 60px -10px rgba(0,0,0,0.6)" }}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#ff7302] text-[#ff7302]">
                  <Check size={26} />
                </div>
                <h2 style={bebas} className="mt-5 text-3xl text-white">
                  Wiadomość wysłana.
                </h2>
                <p className="mt-3 text-sm text-white/70" style={space}>
                  Dziękuję
                  {form.getValues("firstName") ? `, ${form.getValues("firstName")}` : ""}.
                  Odzywam się w ciągu 24 godzin.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="/"
                    className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm text-white/80 transition hover:border-[#ff7302] hover:text-white"
                    style={space}
                  >
                    Strona główna
                  </a>
                  <a
                    href="/portfolio"
                    className="rounded-full bg-[#ff7302] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                    style={bebas}
                  >
                    Portfolio →
                  </a>
                </div>
              </div>
          )}
        </div>
      </section>
    </main>
  );
}
