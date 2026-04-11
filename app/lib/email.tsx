"use server";

import { EmailTemplate } from "../components/email-template";
import { Resend } from "resend";

import { z } from "zod";
import { formSchema } from "./schemas";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiter (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // max emails per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

export const send = async (emailForm: z.infer<typeof formSchema>) => {
  // Server-side validation (client can be bypassed)
  const parsed = formSchema.safeParse(emailForm);
  if (!parsed.success) {
    throw new Error("Nieprawidłowe dane formularza.");
  }

  // Rate limiting by sender email
  const now = Date.now();
  const key = parsed.data.email.toLowerCase();
  const entry = rateLimitMap.get(key);
  if (entry && entry.resetAt > now) {
    if (entry.count >= RATE_LIMIT) {
      throw new Error("Zbyt wiele wiadomości. Spróbuj ponownie później.");
    }
    entry.count++;
  } else {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW });
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
      subject: `Nowa wiadomość od ${parsed.data.firstName}: ${parsed.data.title}`,
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
