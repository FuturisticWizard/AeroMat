/* Dopasowanie pytania do bazy FAQ po slowach kluczowych.
   Logika czysto lokalna (dziala w przegladarce) — 0 kosztow. */

import type { FaqEntry } from "./faq";

export interface FaqMatch {
  entry: FaqEntry | null;
  /* true = trafienie na tyle mocne, ze odpowiadamy bez pytania AI */
  confident: boolean;
}

/* Male litery, bez polskich znakow i interpunkcji. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* Czy slowo z pytania pasuje do slowa kluczowego?
   Dopuszczamy odmiane koncowki (np. "wycene" ~ "wycena"): dla dluzszych slow
   porownujemy rdzen (slowo kluczowe bez ostatniej litery). */
function tokenMatches(token: string, keyword: string): boolean {
  if (token === keyword) return true;
  if (keyword.length >= 5) {
    const stem = keyword.slice(0, -1);
    return token.startsWith(stem);
  }
  return false;
}

export function matchFaq(question: string, entries: FaqEntry[]): FaqMatch {
  const tokens = normalize(question).split(" ").filter(Boolean);
  if (tokens.length === 0) return { entry: null, confident: false };

  let best: FaqEntry | null = null;
  let bestHits = 0;

  for (const entry of entries) {
    let hits = 0;
    for (const keyword of entry.keywords) {
      if (tokens.some((t) => tokenMatches(t, keyword))) hits++;
    }
    if (hits > bestHits) {
      bestHits = hits;
      best = entry;
    }
  }

  if (bestHits === 0) return { entry: null, confident: false };
  return { entry: best, confident: bestHits >= 2 };
}
