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

// Wynik akcji zwracany do klienta. Celowo NIE rzucamy wyjątków dla
// spodziewanych błędów — Next.js na produkcji ukrywa treść rzuconych
// wyjątków (zostaje generyczny angielski komunikat + digest). Zwracając
// obiekt, polski komunikat dociera do użytkownika bez zmian.
type SendResult = { ok: true } | { ok: false; message: string };

export const send = async (emailForm: z.infer<typeof formSchema>): Promise<SendResult> => {
  // Honeypot — jeśli ukryte pole jest wypełnione, to bot. Udajemy sukces
  // (nie zdradzamy botowi, że został wykryty) i nie wysyłamy nic.
  if (emailForm.company && emailForm.company.trim() !== "") {
    return { ok: true };
  }

  // Server-side validation (client can be bypassed)
  const parsed = formSchema.safeParse(emailForm);
  if (!parsed.success) {
    return { ok: false, message: "Nieprawidłowe dane formularza. Sprawdź pola i spróbuj ponownie." };
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
    return { ok: false, message: "Wysłano już sporo wiadomości w krótkim czasie. Spróbuj ponownie za godzinę albo napisz bezpośrednio na podany e-mail." };
  }

  // Send to site owner (NOT to the user — prevents open relay)
  const ownerEmail = process.env.CONTACT_EMAIL || process.env.RESEND_FROM_EMAIL;
  if (!ownerEmail || !process.env.RESEND_FROM_EMAIL) {
    console.error("[kontakt] Brak konfiguracji e-mail (CONTACT_EMAIL / RESEND_FROM_EMAIL)");
    return { ok: false, message: "Wysyłka jest chwilowo niedostępna. Napisz proszę bezpośrednio na podany adres e-mail." };
  }

  try {
    const emailTemplate = await EmailTemplate({
      firstName: parsed.data.firstName,
      message: parsed.data.message,
    });

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
      // Logujemy pełną treść błędu Resend (widoczna w logach serwera Vercel) —
      // bez tego diagnoza była niemożliwa. Użytkownik dostaje przyjazny komunikat.
      console.error("[kontakt] Resend odrzucił wysyłkę:", error);
      return { ok: false, message: "Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę." };
    }

    return { ok: true };
  } catch (e) {
    console.error("[kontakt] Nieoczekiwany błąd wysyłki:", e);
    return { ok: false, message: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie za chwilę." };
  }
};
