# Audyt bezpieczeństwa — AeroMat
Data: 2026-05-15
Audytor: zespół agentów Claude Code
Poprzedni audyt: 2026-04-06 (docs/CodeReviews/code_review_security_audit_2026-04-06.md)
Zakres: weryfikacja stanu po poprzednim audycie + zmiany z maja 2026

---

## Executive summary

Projekt jest statycznym portfolio bez bazy danych i autentykacji, co istotnie ogranicza powierzchnię ataku. Dwa problemy wysokiego ryzyka z audytu z 2026-04-06 pozostają nierozwiązane: CSP z `unsafe-inline`/`unsafe-eval` (neutralizuje ochronę XSS) oraz rate limiting formularza kontaktowego oparty wyłącznie na emailu podanym przez użytkownika (podatny na spam/wyczerpanie Resend API). Od poprzedniego audytu naprawiono: `lang="pl"` w root layout, `async/await` + blokada przycisku w formularzu, `sandbox` na mobilnym iframe YouTube. Łącznie: **0 krytycznych (P0), 2 wysokie (P1), 4 średnie (P2), 3 niskie (P3)**.

---

## Krytyczne (P0)

Brak.

---

## Wysokie (P1)

### [P1-1] CSP zawiera 'unsafe-inline' i 'unsafe-eval' w script-src — NIENAPRAWIONE od 2026-04-06

- **Lokalizacja:** `next.config.js:137`
- **Opis:** Dyrektywa `script-src` zawiera oba flagi unsafe, co praktycznie zeruje ochronę CSP przed XSS. Każdy wstrzyknięty skrypt inline lub `eval()` zostanie wykonany bez blokady przeglądarki.
- **Wpływ:** Jeżeli kiedykolwiek pojawi się XSS (np. przez zmiany w Three.js/GSAP lub zewnętrzny asset), CSP nie będzie stanowić żadnej bariery. Google Maps JS API i GSAP są głównymi powodami tych flag.
- **Rekomendacja:** wdrożyć nonce-based CSP przez Next.js middleware.

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export function middleware(request: Request) {
  const nonce = crypto.randomBytes(16).toString('base64');
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://maps.googleapis.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // ... reszta dyrektyw
  ].join('; ');
  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('x-nonce', nonce);
  return response;
}
```

Nonce przekazać do komponentów serwerowych przez `headers()`. `'unsafe-eval'` można usunąć po weryfikacji że GSAP/Three.js nie wywołują `eval()` w trybie produkcyjnym.

---

### [P1-2] Rate limiting formularza oparty na emailu (in-memory, bez IP) — NIENAPRAWIONE od 2026-04-06

- **Lokalizacja:** `app/lib/email.tsx:12-33`
- **Opis:** Limit 3 emaile/godzinę jest kluczowany po `parsed.data.email.toLowerCase()` — adresie podanym przez użytkownika w formularzu. Bot może wysyłać 3 wiadomości/h z każdego unikalnego adresu (nieskończona pula). Brak limitu per IP. Stan resetuje się przy restarcie procesu Node.
- **Wpływ:** Wyczerpanie limitu Resend API (np. 100 emaili/dzień na free tier), spam do właściciela.
- **Rekomendacja:** dodać rate limiting per IP + honeypot.

```ts
// app/lib/schemas.ts — dodać honeypot
export const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  email: z.string().email().max(250),
  title: z.string().min(2).max(250),
  message: z.string().min(2).max(5000),
  _honeypot: z.string().max(0, "Bot detected"),
});

// app/lib/email.tsx — Server Action
import { headers } from 'next/headers';

export const send = async (emailForm: z.infer<typeof formSchema>) => {
  const parsed = formSchema.safeParse(emailForm);
  if (!parsed.success) throw new Error("Nieprawidlowe dane formularza.");
  if (parsed.data._honeypot) throw new Error("Nieprawidlowe dane formularza.");

  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim()
          ?? headersList.get('x-real-ip')
          ?? 'unknown';
  const ipEntry = rateLimitMap.get(`ip:${ip}`);
  const now = Date.now();
  if (ipEntry && ipEntry.resetAt > now && ipEntry.count >= RATE_LIMIT) {
    throw new Error("Zbyt wiele wiadomosci. Sprobuj pozniej.");
  }
  // ... reszta logiki
};
```

W formularzu (`app/kontakt/page.tsx`):
```tsx
<input type="text" {...form.register("_honeypot")} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
```

---

## Średnie (P2)

### [P2-1] innerHTML z interpolacją template literal — NIENAPRAWIONE od 2026-04-06

- **Lokalizacja:** `app/components/PanoramaScroll.tsx:120`
- **Opis:** `char.innerHTML = \`<span>${char.textContent}</span>\`` — dane pochodzą z `textContent` (czysty tekst, brak ryzyka dzisiaj), ale wzorzec jest niebezpieczny. Jeżeli źródło danych zmieni się na dynamiczne (CMS, props), powstanie podatność XSS.
- **Rekomendacja:**
```ts
const span = document.createElement('span');
span.textContent = char.textContent ?? '';
char.replaceChildren(span);
```

### [P2-2] Desktop overlay YouTube iframe bez atrybutu `sandbox` — NIENAPRAWIONE od 2026-04-06

- **Lokalizacja:** `app/components/YoutubeVideosGrid.tsx:134-141`
- **Opis:** Mobilny iframe (linia 187-195) ma poprawnie `sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"`. Desktop overlay iframe nie ma `sandbox`. Niespójność w obrębie tego samego komponentu.
- **Rekomendacja:** dodać identyczny `sandbox` do desktop iframe.

### [P2-3] GoogleMap iframe (marker overlay) bez `sandbox`

- **Lokalizacja:** `app/components/GoogleMap/GoogleMap.tsx:292-300`
- **Opis:** Iframe renderowany po kliknięciu markera na mapie nie ma `sandbox`. `src={selectedPoi.src}` pochodzi ze statycznych danych — niskie ryzyko, ale staje się wyższe jeśli `selectedPoi.src` będzie kiedykolwiek dynamicznie pobierane.
- **Rekomendacja:** dodać `sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"`.

### [P2-4] Brakujące nagłówki Cross-Origin — NIENAPRAWIONE od 2026-04-06

- **Lokalizacja:** `next.config.js:128-188`
- **Opis:** Brakuje:
  - `Cross-Origin-Opener-Policy: same-origin` — ochrona przed Spectre / cross-origin window access
  - `Cross-Origin-Resource-Policy: same-origin` — ochrona zasobów statycznych przed hotlinkingiem
  - `X-Permitted-Cross-Domain-Policies: none` — blokuje Flash/PDF cross-domain policy
- **Rekomendacja:** dodać do tablicy `headers` w `next.config.js`:
```js
{ key: "Cross-Origin-Opener-Policy", value: "same-origin" },
{ key: "Cross-Origin-Resource-Policy", value: "same-origin" },
{ key: "X-Permitted-Cross-Domain-Policies", value: "none" },
```

---

## Niskie / Best practice (P3)

### [P3-1] Brak allowlist znaków w `firstName` i `title` (subject injection)

- **Lokalizacja:** `app/lib/schemas.ts:4-8`, `app/lib/email.tsx:52`
- **Opis:** Pola `firstName` i `title` trafiają bezpośrednio do nagłówka Subject emaila. Resend odcina CRLF (brak bezpośredniego ryzyka header injection), ale `firstName` może zawierać znaki specjalne / emoji w szablonie.
- **Rekomendacja:**
```ts
firstName: z.string().min(2).max(50)
  .regex(/^[\p{L}\p{M}\s'\-]+$/u, "Imię zawiera niedozwolone znaki"),
title: z.string().min(2).max(250).trim(),
```

### [P3-2] `.env.example` niekompletny

- **Lokalizacja:** `.env.example`
- **Opis:** Plik dokumentuje tylko `NEXT_PUBLIC_GA_ID`. Brakuje: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_EMAIL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

### [P3-3] `docs/script.js` zawiera ten sam niebezpieczny wzorzec innerHTML

- **Lokalizacja:** `docs/script.js:27`
- **Opis:** Identyczny wzorzec co PanoramaScroll.tsx. Plik nie jest deployowany, ale może być kopiowany jako wzorzec.

---

## Co jest dobrze zrobione

- Brak `dangerouslySetInnerHTML` w całym codebase React (zweryfikowane grep).
- `RESEND_API_KEY` i pozostałe sekrety wyłącznie w env, nie w kodzie.
- `.gitignore` poprawnie wyklucza `.env*` i `backups/`.
- Wszystkie `target="_blank"` mają `rel="noopener noreferrer"` (Navbar, Footer, FooterLight, footer-mockup).
- Brak API routes — eliminuje klasę ataków broken access control.
- Server Action `send()` waliduje dane po stronie serwera przez Zod (`email.tsx:18-21`).
- Email wysyłany wyłącznie do właściciela, adres użytkownika tylko w `replyTo` — brak open relay.
- `poweredByHeader: false` — nagłówek X-Powered-By wyłączony.
- HSTS z `max-age=63072000; includeSubDomains; preload` — prawidłowa konfiguracja.
- `lang="pl"` w root layout — naprawione od poprzedniego audytu.
- Formularz ma `async/await`, blokadę przycisku podczas wysyłania i komunikat sukcesu.
- Mobilny iframe YouTube ma poprawny atrybut `sandbox`.
- `strict: true` w `tsconfig.json`, `reactStrictMode: true` w `next.config.js`.
- `removeConsole` włączony dla produkcji (z wyjątkiem error/warn).

---

## Plan remediacji (kolejność wdrożenia)

1. **[P1-2] Honeypot** — 30 min. Ukryte pole w schemacie Zod + formularzu. Natychmiastowa ochrona przed botami bez zależności zewnętrznych.
2. **[P1-2] Rate limit per IP** — 1h. Drugi klucz `ip:X` w `rateLimitMap` używając `headers()` z Next.js.
3. **[P2-2] sandbox na desktop iframe YouTube** — 5 min.
4. **[P2-3] sandbox na GoogleMap iframe** — 5 min.
5. **[P3-2] Uzupełnić `.env.example`** — 5 min.
6. **[P2-1] Naprawić innerHTML w PanoramaScroll.tsx** — 15 min. Zastąpić `replaceChildren`.
7. **[P2-4] Dodać COOP/CORP/X-Permitted** — 10 min. Trzy linie w `next.config.js`.
8. **[P3-1] Regex w schemacie Zod** — 15 min.
9. **[P1-1] Nonce-based CSP** — 3-4h. Wymaga middleware, przekazania nonce do komponentów serwerowych i weryfikacji że GSAP/Three.js działają bez `unsafe-eval`. Najtrudniejsza zmiana, wdrożyć na koniec po przetestowaniu.
