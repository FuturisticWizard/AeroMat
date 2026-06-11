# Audyt jakości kodu i architektury — AeroMat
Data: 2026-05-15
Audytor: zespół agentów Claude Code

> **Uwaga interpretacyjna:** plik `D:\Builds\CLAUDE.md` opisuje projekt **BlockchainDungeons Blog**, NIE AeroMat. Reguły z niego (np. "nie używamy Server Actions", konwencje WP/GraphQL) nie obowiązują w tym projekcie. Znalezisko QC-002 dotyczące Server Action zostało zachowane wyłącznie jako uwaga architektoniczna — jeśli AeroMat świadomie używa Server Actions, można je pominąć.

---

## Executive Summary

Projekt jest dobrze zorganizowany technicznie (strict TypeScript, solidny CSP, rate limiting na formularzu, bundle splitting, brak `dangerouslySetInnerHTML`), ale ma kilka pilnych problemów:

1. **Placeholder telefonu `+48 600 000 000`** na produkcyjnym kontakcie (`/kontakt/page.tsx`).
2. **19 katalogów mockup routes** publicznie dostępnych bez `noindex` — duplicate content + zbędny build.
3. **`framer-motion` i `zod` w `devDependencies`** — używane w runtime, crash przy `npm install --production`.
4. **`@types/three` zduplikowany** w `dependencies` i `devDependencies` z różnymi wersjami.

---

## Krytyczne

### [QC-001] Placeholder telefonu w produkcyjnym kontakcie
- **Lokalizacja:** `app/kontakt/page.tsx:97-98`
- **Problem:** `href="tel:+48600000000"` i wyświetlany `+48 600 000 000` — fikcyjny numer.
- **Wpływ:** Klienci klikają niedziałający numer; utrata leadów sprzedażowych.
- **Rekomendacja:** Zastąpić prawdziwym numerem. Jeśli niedostępny — wstawić tymczasowo tylko email i `MapPin` bez `Phone`.

### [QC-002] Server Action (`"use server"`) — uwaga architektoniczna (NIE BLOKUJE)
- **Lokalizacja:** `app/lib/email.tsx:1`
- **Status:** to znalezisko wynikało z błędnej interpretacji CLAUDE.md (który należy do innego projektu). Jeśli w AeroMat świadomie używane są Server Actions — **POMIŃ TĘ POZYCJĘ**.
- **Rzeczywista uwaga:** Server Action jest poprawnym rozwiązaniem dla formularza kontaktowego. Domyślna ochrona CSRF Next.js działa. Brak akcji wymagana.

---

## Wysokie

### [QC-003] 19 mockup routes bez `noindex` — indeksowane przez wyszukiwarki
- **Lokalizacja:**
  `app/hero-mockup/`, `app/glitch-mockup/`, `app/gradient-mockup/`, `app/panorama-typography-mockup/`,
  `app/trusted-mockup/`, `app/trusted-mockup-top3/`, `app/typography-mockup/`, `app/footer-mockup/`,
  `app/hero-copy-mockup/`, `app/hero-copy-v3-mockup/`, `app/logos-grid-mockup/`,
  `app/logos-grid-black-mockup/`, `app/logos-grid-v10-mockup/`, `app/portfolio-home-mockup/`,
  `app/portfolio-card-variants-mockup/`, `app/portfolio-animation-variants-mockup/`,
  `app/kontakt-mockup/`, `app/testimonials-wheel-mockup/`, `app/mockups/`
- **Problem:** Żaden z 19 routes nie eksportuje `metadata` z `robots: { index: false }`. Każdy mockup zwiększa bundle/build time i może być indeksowany przez Google.
- **Wpływ:** SEO duplicate content; setki wariantów UI w sitemap.
- **Rekomendacja (opcja A — minimalna):** Dodać do każdej strony:
  ```ts
  export const metadata: Metadata = { robots: { index: false, follow: false } };
  ```
- **Opcja B — docelowa:** Przenieść wszystkie do route group `app/(mockups)/` z jednym shared `layout.tsx` z `noindex`. Nie wymaga zmian w żadnym `page.tsx`.

### [QC-004] `@types/three` w `dependencies` I `devDependencies` jednocześnie
- **Lokalizacja:** `package.json:22` i `package.json:51`
- **Problem:** `"@types/three": "^0.168.0"` w `dependencies` oraz `"@types/three": "^0.170.0"` w `devDependencies`.
- **Wpływ:** Potencjalny konflikt wersji typów; niepotrzebny wpis w runtime dependencies.
- **Rekomendacja:** Usunąć z `dependencies`, zostawić tylko `^0.170.0` w `devDependencies`.

### [QC-005] `app/lib/marquee.js` — plain JS z `console.log` w production code
- **Lokalizacja:** `app/lib/marquee.js:14-15`
- **Problem:** Plain JS (bez typów) + `console.log("Found marquee items:", ...)`. `removeConsole` w `next.config.js` usuwa logi w produkcji, ale tylko przez kompilator — przy Turbopack dev pozostają.
- **Rekomendacja:** Przemianować na `marquee.ts`, dodać typy dla `config`, usunąć `console.log`.

### [QC-006] Fonty `Yesteryear` i `Allura` zdefiniowane w CSS, nie załadowane w `layout.tsx`
- **Lokalizacja:** `app/globals.css:78-88`; `app/layout.tsx` (brak fontów)
- **Problem:** Klasy `.yesteryear-regular` i `.allura` odwołują się do fontów `Yesteryear` i `Allura` bez `next/font/google` w layout. Przeglądarka renderuje fallback `serif`.
- **Rekomendacja:** grep nie znalazł użycia klas poza definicją CSS — usunąć. Jeśli planowane — załadować przez `next/font/google` w `layout.tsx`.

### [QC-007] `web-bundles/` nie jest w `.gitignore`
- **Lokalizacja:** `.gitignore` (brak wpisu); `web-bundles/agents/`, `web-bundles/teams/`, `web-bundles/expansion-packs/`
- **Problem:** 19 plików `.txt` z definicjami agentów BMAD trackowane w repo. Tooling deweloperski bez związku z aplikacją.
- **Rekomendacja:** Dodać do `.gitignore`:
  ```
  # BMAD web bundles (tooling, not app code)
  web-bundles/
  ```

### [QC-008] Pliki robocze w `docs/` mogą trafić do commitu
- **Lokalizacja:** `docs/ChatGPT Image 2 maj 2026, 10_39_09.png`, `docs/ChatGPT Image 3 maj 2026, 10_53_13.png`, `docs/kamper_1.jpg` – `docs/kamper_4.jpg`, `docs/audi.jpg`, `docs/oMnie.jpg`, `docs/chapter3.jpg`, `docs/sekcja o mnie 3.jpg`, `docs/opinie/`
- **Problem:** Untracked (widoczne w `git status`). `.gitignore` nie wyklucza `docs/*.{jpg,png}`.
- **Rekomendacja:**
  ```
  # Robocze obrazy i AI mockupy
  docs/*.jpg
  docs/*.png
  docs/opinie/*.jpg
  ```

---

## Średnie

### [QC-009] Niespójny styl importów — mix `@/app/components/` i `../`
- **Lokalizacja:** 41 plików używa `@/app/components/...`; 11 wystąpień w 5 plikach używa `../` (np. `VideoPlayer.tsx` ×6).
- **Rekomendacja:** Zunifikować na `@/app/components/...`. Rozważyć dodanie krótszego aliasu `@/components/*` → `./app/components/*`.

### [QC-010] `any` w hookach
- **Lokalizacja:** `app/hooks/useMemoryOptimization.ts:4, 32, 146, 174, 186`
- **Problem:** Generyczne hooki `useDebounce<T extends (...args: any[]) => any>` i `deps: any[]`.
- **Rekomendacja:**
  ```ts
  export function useDebounce<T extends (...args: unknown[]) => unknown>(fn: T, ...)
  ```
  Dla `navigator.connection` i `performance.memory` — zdefiniować lokalne interface'y zamiast `as any`.

### [QC-011] `app/lib/wspolrzedne.txt` — plik danych w katalogu `lib/`
- **Lokalizacja:** `app/lib/wspolrzedne.txt`
- **Problem:** Plik tekstowy z 13 współrzędnymi GPS i linkami YouTube. Nietypowalny.
- **Rekomendacja:** Przenieść do `app/lib/mural-locations.ts` jako `export const muralLocations: MuralLocation[]`.

### [QC-012] `globals.css` — 1560 linii, klasy poza `@layer`
- **Lokalizacja:** `app/globals.css:78-139`
- **Problem:** Klasy `.yesteryear-regular`, `.allura`, `.anton-regular`, `.gradient-new`, `.custom-shape-divider-*` poza blokami `@layer`. Nieoczekiwany specificity precedence.
- **Rekomendacja:** Przenieść do `@layer components` lub `@layer utilities`. Rozważyć podział na osobne pliki CSS per sekcja.

### [QC-013] `stylelint` w devDependencies bez skryptu npm i bez CI
- **Lokalizacja:** `package.json:59`; brak `"lint:css"` w scripts
- **Rekomendacja:** Dodać skrypt lub usunąć z devDependencies.

### [QC-014] `tsconfig.json` bez `noUncheckedIndexedAccess`
- **Lokalizacja:** `tsconfig.json`
- **Rekomendacja:**
  ```json
  "noUncheckedIndexedAccess": true
  ```

---

## Niskie / nice-to-have

### [QC-015] `PerformanceMonitor.tsx` — `any` przy Web Vitals API
- **Lokalizacja:** `app/components/PerformanceMonitor.tsx:55, 70, 71, 137, 187`
- **Rekomendacja:** Zdefiniować lokalne interfaces dla `PerformanceEventTiming`, `NetworkInformation`, `MemoryInfo`. Lub użyć pakietu `web-vitals` (oficjalne typy).

### [QC-016] README.md nieaktualny
- **Lokalizacja:** `README.md`
- **Problem:** Wspomina o "Blog Page" — tej strony nie ma w projekcie (to portfolio muralisty).
- **Rekomendacja:** Aktualizacja: opis projektu, `npm run dev`, zmienne środowiskowe.

### [QC-017] `framer-motion` w devDependencies, używana w runtime — **WYSOKIE w praktyce**
- **Lokalizacja:** `package.json:56`
- **Problem:** Używana w komponentach klienckich (`Testimonials.tsx` i in.). `npm install --production` nie zainstaluje → crash w produkcji.
- **Rekomendacja:** Przenieść do `dependencies`.

### [QC-018] `zod` w devDependencies, używana w runtime — **WYSOKIE w praktyce**
- **Lokalizacja:** `package.json:65`
- **Problem:** Runtime dependency (walidacja formularza w `email.tsx` i schemas).
- **Rekomendacja:** Przenieść do `dependencies`.

---

## Co jest dobrze zrobione

- **Zero `@ts-ignore` / `@ts-nocheck`** w całej bazie kodu.
- **Zero `dangerouslySetInnerHTML`** — brak ryzyka XSS przez unsafe HTML injection.
- **Wszystkie `target="_blank"`** w komponentach produkcyjnych mają `rel="noopener noreferrer"`.
- **Rate limiting na formularzu kontaktowym** — 3 emaile/h, walidacja Zod server-side.
- **CSP, HSTS, X-Frame-Options, X-Content-Type-Options** skonfigurowane w `next.config.js`.
- **Bundle splitting** — oddzielne chunki dla `three`, `maps`, `ui`, `vendor`.
- **`removeConsole`** — logi debug usuwane w produkcji.
- **`backups/`** prawidłowo w `.gitignore`.
- **`/mockups`** — zorganizowany indeks z opisami; mockupy nie linkowane z menu produkcyjnego.
- **`app/lib/email.tsx`** — brak open relay, `replyTo` poprawnie, env vars zamiast hardcoded.
- **`strict: true`** w `tsconfig.json`.

---

## Plan refaktoryzacji

### Faza 1 — Natychmiastowe (przed deploy / przy najbliższym PR)
1. **QC-001:** Zastąpić placeholder telefonu prawdziwym numerem.
2. **QC-004:** Usunąć `@types/three` z `dependencies`.
3. **QC-017 + QC-018:** Przenieść `framer-motion` i `zod` do `dependencies`.
4. **QC-007:** Dodać `web-bundles/` do `.gitignore`.
5. **QC-008:** Dodać `docs/*.jpg`, `docs/*.png` do `.gitignore`.

### Faza 2 — Krótkoterminowe (w ciągu tygodnia)
6. **QC-003:** Dodać `noindex` do 19 mockup pages lub przenieść do route group `(mockups)/`.
7. **QC-006:** Usunąć martwe klasy CSS `.yesteryear-regular` i `.allura`.
8. **QC-005:** Przemianować `marquee.js` → `marquee.ts`, usunąć `console.log`.

### Faza 3 — Długoterminowe (refaktoring)
9. **QC-011:** Przenieść `wspolrzedne.txt` do typowanego `mural-locations.ts`.
10. **QC-009:** Zunifikować importy na `@/app/components/...`.
11. **QC-012:** Posprzątać `globals.css` — przenieść klasy do `@layer components`.
12. **QC-010 + QC-015:** Zastąpić `any` w hookach i PerformanceMonitor.
13. **QC-014:** Włączyć `noUncheckedIndexedAccess`.
14. Dodać pierwsze testy: `app/lib/schemas.ts` (unit), `app/lib/email.tsx` (integration z mock Resend).
