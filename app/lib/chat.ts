"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { SITE_FACTS } from "./faq";

/* Konfiguracja dostawcy AI przez zmienne srodowiskowe (.env):
   CHAT_API_KEY  - klucz API (wymagany, inaczej warstwa AI wylaczona)
   CHAT_MODEL    - nazwa modelu (domyslnie gpt-4o-mini)
   CHAT_API_URL  - endpoint zgodny z formatem OpenAI chat/completions
                   (domyslnie OpenAI; dziala tez Gemini i Claude - patrz docs/specs/chatbot-faq.md) */
const CHAT_API_URL = process.env.CHAT_API_URL || "https://api.openai.com/v1/chat/completions";
const CHAT_MODEL = process.env.CHAT_MODEL || "gpt-4o-mini";

const FALLBACK_ANSWER =
  "Asystent AI jest w tej chwili niedostępny. Napisz proszę przez formularz na stronie /kontakt — odpowiadam w ciągu 24 godzin.";

const questionSchema = z.string().trim().min(3).max(300);

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

  const apiKey = process.env.CHAT_API_KEY;
  if (!apiKey) {
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
    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        max_tokens: 400,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: parsed.data },
        ],
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      return { answer: FALLBACK_ANSWER };
    }

    const data: { choices?: { message?: { content?: string } }[] } = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim();

    return { answer: answer || FALLBACK_ANSWER };
  } catch {
    return { answer: FALLBACK_ANSWER };
  }
}
