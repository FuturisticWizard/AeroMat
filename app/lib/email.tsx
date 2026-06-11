"use server";

import { headers } from "next/headers";

import { EmailTemplate } from "../components/email-template";
import { Resend } from "resend";

import { z } from "zod";
import { formSchema } from "./schemas";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiter (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // max emails per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

// Sprawdza i zwiększa licznik dla danego klucza (e-mail lub IP).
// Zwraca true, jeśli limit został przekroczony.
const isRateLimited = (key: string, now: number): boolean => {
  const entry = rateLimitMap.get(key);
  if (entry && entry.resetAt > now) {
    if (entry.count >= RATE_LIMIT) return true;
    entry.count++;
  } else {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW });
  }
  return false;
};

export const send = async (emailForm: z.infer<typeof formSchema>) => {
  // Honeypot — jeśli ukryte pole jest wypełnione, to bot. Udajemy sukces
  // (nie zdradzamy botowi, że został wykryty) i nie wysyłamy nic.
  if (emailForm.company && emailForm.company.trim() !== "") {
    return;
  }

  // Server-side validation (client can be bypassed)
  const parsed = formSchema.safeParse(emailForm);
  if (!parsed.success) {
    throw new Error("Nieprawidłowe dane formularza.");
  }

  // Rate limiting — najpierw po adresie IP (Cloudflare > x-real-ip > x-forwarded-for),
  // potem po adresie e-mail nadawcy. IP blokuje bota zmieniającego e-maile.
  const now = Date.now();
  const hdrs = await headers();
  const ip =
    hdrs.get("cf-connecting-ip") ||
    hdrs.get("x-real-ip") ||
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  if (isRateLimited(`ip:${ip}`, now) || isRateLimited(`email:${parsed.data.email.toLowerCase()}`, now)) {
    throw new Error("Zbyt wiele wiadomości. Spróbuj ponownie później.");
  }

  try {
    const emailTemplate = await EmailTemplate({
      firstName: parsed.data.firstName,
      message: parsed.data.message,
    });

    // Send to site owner (NOT to the user — prevents open relay)
    const ownerEmail = process.env.CONTACT_EMAIL || process.env.RESEND_FROM_EMAIL;
    if (!ownerEmail) {
      throw new Error("Konfiguracja email nie jest ustawiona.");
    }

    const { error } = await resend.emails.send({
      from: `AeroMat Kontakt <${process.env.RESEND_FROM_EMAIL}>`,
      to: [ownerEmail],
      replyTo: parsed.data.email,
      // Usuwamy znaki nowej linii z tematu — chroni przed wstrzyknięciem nagłówków
      // e-mail i zapobiega rozjechaniu tematu.
      subject: `Nowa wiadomość od ${parsed.data.firstName}: ${parsed.data.title}`.replace(/[\r\n]+/g, " "),
      react: emailTemplate,
    });

    if (error) {
      throw new Error("Nie udało się wysłać wiadomości. Spróbuj ponownie.");
    }
  } catch (e) {
    if (e instanceof Error) throw e;
    throw new Error("Wystąpił błąd. Spróbuj ponownie.");
  }
};
