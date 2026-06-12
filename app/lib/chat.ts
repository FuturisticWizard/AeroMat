"use server";

import { headers } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

import { SITE_FACTS } from "./faq";

const FALLBACK_ANSWER =
  "Asystent AI jest w tej chwili niedostępny. Napisz proszę przez formularz na stronie /kontakt — odpowiadam w ciągu 24 godzin.";

const questionSchema = z.string().trim().min(3).max(300);

const client = new Anthropic();

const SYSTEM_PROMPT = `Jesteś asystentem na stronie AeroMat (artysta malarz murali z Lublina).
Odpowiadasz po polsku, krótko (2-4 zdania), rzeczowo i uprzejmie.

Fakty o firmie (jedyne źródło wiedzy o usługach):
${SITE_FACTS}

Zasady:
- Odpowiadasz WYŁĄCZNIE na pytania związane z usługami AeroMat (murale, szyldy, malowanie, wycena, kontakt itp.).
- Na pytania niezwiązane z tematem odpowiedz jednym zdaniem, że pomagasz tylko w sprawach usług AeroMat.
- Nie podawaj konkretnych cen — wycena jest zawsze indywidualna; kieruj na stronę /kontakt.
- Nie wymyślaj faktów spoza listy powyżej. Gdy nie znasz odpowiedzi, zaproponuj kontakt przez /kontakt.`;

// Limity w pamieci procesu (resetuja sie po restarcie — jak w email.tsx)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // pytan na okno czasowe na adres IP
const RATE_WINDOW = 60 * 60 * 1000; // 1 godzina

// Globalny bezpiecznik kosztowy: maks. odpowiedzi AI na dobe (caly serwis)
let dailyCount = 0;
let dailyResetAt = 0;
const DAILY_LIMIT = 200;

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

export async function askAssistant(rawQuestion: string): Promise<{ answer: string }> {
  const parsed = questionSchema.safeParse(rawQuestion);
  if (!parsed.success) {
    return { answer: "Pytanie powinno mieć od 3 do 300 znaków." };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return { answer: FALLBACK_ANSWER };
  }

  const now = Date.now();

  if (now > dailyResetAt) {
    dailyCount = 0;
    dailyResetAt = now + 24 * 60 * 60 * 1000;
  }
  if (dailyCount >= DAILY_LIMIT) {
    return { answer: FALLBACK_ANSWER };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("cf-connecting-ip") ||
    hdrs.get("x-real-ip") ||
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  if (isRateLimited(`chat:${ip}`, now)) {
    return {
      answer:
        "Zadałeś już sporo pytań w krótkim czasie. Daj asystentowi chwilę odpocząć albo napisz bezpośrednio przez /kontakt.",
    };
  }

  dailyCount++;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: parsed.data }],
    });

    const answer = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return { answer: answer || FALLBACK_ANSWER };
  } catch {
    return { answer: FALLBACK_ANSWER };
  }
}
