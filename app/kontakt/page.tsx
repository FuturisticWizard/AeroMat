"use client";

import Image from "next/image";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, Check, Mail, Phone, MapPin } from "lucide-react";

import { formSchema } from "../lib/schemas";
import { send } from "../lib/email";

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
    defaultValues: { firstName: "", email: "", title: "", message: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus("sending");
    setErrorMsg("");
    try {
      await send(values);
      setStatus("sent");
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Wystąpił błąd.");
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

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col justify-between gap-12 p-6 md:p-14">
          {/* top — headline */}
          <div className="max-w-2xl">
            <h1
              style={bebas}
              className="text-white leading-[0.85] text-[clamp(2.5rem,8vw,7rem)]"
            >
              Zacznijmy<br /> od krótkiej<br />
              <span className="text-[#ff7302]">wiadomości.</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-2 md:-translate-y-[14vh] lg:-translate-y-[20vh] xl:-translate-y-[24vh]">
            {/* bottom-left — kontakt info */}
            <ul className="space-y-3 text-white/85 md:mb-24" style={space}>
              <li className="flex items-center gap-3 text-lg">
                <Mail size={20} className="text-[#ff7302]" />
                <a href="mailto:kontakt@aeromat.pl" className="hover:text-[#ff7302] transition">
                  aeromat88@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-lg">
                <Phone size={20} className="text-[#ff7302]" />
                <a href="tel:+48500044156" className="hover:text-[#ff7302] transition">
                  +48 500 044 156
                </a>
              </li>
              <li className="flex items-center gap-3 text-lg">
                <MapPin size={20} className="text-[#ff7302]" /> Lublin · cała Polska
              </li>
            </ul>

            {/* bottom-right — floating form / success */}
            {!done ? (
              <form
                onSubmit={onSubmit}
                noValidate
                className="kontakt-form ml-auto w-full max-w-md border border-white/15 bg-white/[0.06] p-7 backdrop-blur-md"
                style={{ boxShadow: "0 30px 60px -10px rgba(0,0,0,0.6)" }}
              >
                <p className="mb-5 text-xs uppercase tracking-[0.32em] text-white/55" style={space}>
                  Napisz do mnie!
                </p>
                <div className="flex flex-col gap-5">
                  {fields.map((f) => {
                    const err = form.formState.errors[f.name]?.message as string | undefined;
                    const inputCls =
                      "w-full rounded-md border border-white/15 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-[#ff7302]";
                    return (
                      <div key={f.name} className="flex flex-col gap-2">
                        <label
                          htmlFor={f.name}
                          className="text-[10px] uppercase tracking-[0.32em] text-white/55"
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
                        {err && (
                          <p className="text-xs text-red-400" style={space} role="alert">
                            {err}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group inline-flex w-full items-center justify-center gap-3 bg-[#ff7302] px-7 py-4 font-semibold uppercase text-white transition hover:bg-white hover:text-[#ff7302] disabled:opacity-60"
                    style={{ ...bebas, fontSize: "1.2rem", letterSpacing: "0.25em" }}
                  >
                    {status === "sending" ? "Wysyłam…" : "Wyślij"}
                    <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </button>

                  {status === "error" && (
                    <p
                      className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-center text-xs text-red-300"
                      style={space}
                      role="alert"
                    >
                      {errorMsg}
                    </p>
                  )}
                </div>
              </form>
            ) : (
              <div
                className="ml-auto w-full max-w-md border border-white/15 bg-white/[0.06] p-7 text-center backdrop-blur-md"
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
        </div>
      </section>
    </main>
  );
}
