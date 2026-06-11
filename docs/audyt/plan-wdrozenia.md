# Plan wdrożenia — audyt 2026-05-15

Plan oparty na 3 raportach: `security-audit.md`, `performance-audit.md`, `code-quality-audit.md`.

Łącznie: **2 krytyczne, 11 wysokich, 12 średnich, 11 niskich** znalezisk.

Estymacja całkowita: **~14 godzin** dev + ~2h testów manualnych.

---

## Faza 1 — Krytyczne (przed najbliższym deployem) — ~2h

Cel: zatrzymać wyciek leadów, naprawić build production, usunąć największy regres wydajności.

| # | ID | Zadanie | Plik | Czas | Wpływ |
|---|----|---------|------|------|-------|
| 1 | QC-001 | Zastąpić placeholder `+48 600 000 000` prawdziwym numerem (lub usunąć blok `Phone` jeśli numer niedostępny) | `app/kontakt/page.tsx:97-98` | 5 min | Klienci dzwonią w pustkę |
| 2 | QC-017 | Przenieść `framer-motion` z `devDependencies` do `dependencies` | `package.json:56` | 2 min | Crash przy `npm i --production` |
| 3 | QC-018 | Przenieść `zod` z `devDependencies` do `dependencies` | `package.json:65` | 2 min | Crash przy `npm i --production` |
| 4 | QC-004 | Usunąć `@types/three@0.168` z `dependencies` (zostaje `0.170` w devDeps) | `package.json:22` | 2 min | Konflikt typów |
| 5 | PERF-001 | `PanoramaScroll` → `dynamic(ssr:false)` | `app/page.tsx:11` | 10 min | -600 KB initial bundle (Three.js) |
| 6 | PERF-002 | `/filmy` — użyć `LazyYouTubeGridWithIntersection` | `app/filmy/page.tsx:1` | 5 min | -110 KB framer-motion z page chunk |
| 7 | QC-007 | `.gitignore`: `web-bundles/` | `.gitignore` | 1 min | 19 plików tooling out of repo |
| 8 | QC-008 | `.gitignore`: `docs/*.jpg`, `docs/*.png`, `docs/opinie/*.jpg` | `.gitignore` | 1 min | Robocze obrazy out of repo |

**Weryfikacja po fazie 1:**
```powershell
npm run build              # czy buduje się bez błędów
npm run build:analyze      # sprawdź czy three.js znika z initial chunks
git status                 # 19 plików z web-bundles + obrazy z docs/ nie pokazują się jako untracked
```

---

## Faza 2 — Wysokie / niskoryzykowe quick wins — ~3h

Cel: ochrona formularza, sandbox iframe, sprzątanie martwego CSS.

### 2a. Bezpieczeństwo formularza (~1h)

| # | ID | Zadanie | Plik | Czas |
|---|----|---------|------|------|
| 9 | P1-2 | Honeypot `_honeypot` w schemacie Zod | `app/lib/schemas.ts` | 15 min |
| 10 | P1-2 | Hidden input w formularzu | `app/kontakt/page.tsx` | 5 min |
| 11 | P1-2 | Rate limit per IP w `email.tsx` (drugi klucz `ip:X` w `rateLimitMap`) | `app/lib/email.tsx:12-33` | 30 min |
| 12 | P3-1 | Allowlist regex dla `firstName`, `.trim()` dla `title` | `app/lib/schemas.ts:4-8` | 10 min |

**Test manualny:** wypełnić formularz 4× — czwarta próba powinna zwrócić błąd rate limit.

### 2b. Iframe sandbox + nagłówki HTTP (~30 min)

| # | ID | Zadanie | Plik | Czas |
|---|----|---------|------|------|
| 13 | P2-2 | `sandbox` na desktop YouTube overlay | `YoutubeVideosGrid.tsx:138` | 2 min |
| 14 | P2-3 | `sandbox` na GoogleMap marker iframe | `GoogleMap/GoogleMap.tsx:292` | 2 min |
| 15 | P2-4 | COOP/CORP/X-Permitted-Cross-Domain-Policies w `next.config.js` | `next.config.js:128-188` | 10 min |
| 16 | P3-2 | Uzupełnić `.env.example` (RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_EMAIL, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) | `.env.example` | 5 min |

**Test manualny:** otworzyć stronę z mapą + filmami, kliknąć marker, kliknąć video — czy nadal działają.

### 2c. Quick wins wydajności (~1h)

| # | ID | Zadanie | Plik | Czas |
|---|----|---------|------|------|
| 17 | PERF-003 | `PerformanceMonitor` — early return dla production | `app/components/PerformanceMonitor.tsx` | 5 min |
| 18 | PERF-007 | Usunąć duplikat `.gradient-new` (zostaje 1 z 3) | `app/globals.css:122-138` | 5 min |
| 19 | PERF-008 / QC-006 | Usunąć `.yesteryear-regular` i `.allura` (orphaned, fonty nie są ładowane) | `app/globals.css:78-88` | 5 min |
| 20 | PERF-005 | Konwersja 4 JPG → webp (`apis_mural.jpg`, `komeko_mural.jpg`, `audi.jpg`, `monstertruck.jpg`) | `public/images/` | 15 min |
| 21 | P2-1 | `replaceChildren` zamiast `innerHTML` w PanoramaScroll | `PanoramaScroll.tsx:120` | 10 min |
| 22 | P3-3 | Ten sam fix w `docs/script.js:27` | `docs/script.js` | 5 min |

**Weryfikacja:** `npm run build:analyze` — sprawdzić czy dalsze obniżenie bundle.

---

## Faza 3 — Średnie (w ciągu tygodnia) — ~5h

Cel: SEO mockupów, jakość kodu, typowanie.

| # | ID | Zadanie | Czas | Notatka |
|---|----|---------|------|---------|
| 23 | QC-003 | 19 mockup routes → przenieść do `app/(mockups)/` z shared `layout.tsx` z `noindex` | 1h | **Opcja docelowa** zamiast dodawania `noindex` per page. Wszystkie pliki `page.tsx` pozostają bez zmian. |
| 24 | QC-005 | `marquee.js` → `marquee.ts`, dodać typy `config`, usunąć `console.log` | 30 min | |
| 25 | PERF-004 | `/portfolio` — lazy lightbox + 4 pluginy | 45 min | -140 KB JS |
| 26 | PERF-006 | Usunąć statyczne `will-change` z 7 selektorów w `globals.css` | 20 min | GSAP zarządza tym automatycznie przy `force3D: true` |
| 27 | QC-011 | `wspolrzedne.txt` → `mural-locations.ts` z typem `MuralLocation[]` | 45 min | Update referencji w GoogleMap |
| 28 | QC-009 | Unifikacja importów na `@/app/components/...` (11 miejsc z `../`) | 30 min | |
| 29 | QC-013 | `package.json` — dodać `"lint:css": "stylelint 'app/**/*.css'"` lub usunąć stylelint | 10 min | |
| 30 | QC-016 | Aktualizacja `README.md` — opis projektu, env vars, dev/build | 20 min | |

**Weryfikacja po fazie 3:**
```powershell
npx next build && npx next start    # smoke test produkcji
# Sprawdzić w przeglądarce: /mockups* powinny mieć <meta name="robots" content="noindex"> w <head>
```

---

## Faza 4 — Niskie / refactor (kiedy będzie czas) — ~4h

| # | ID | Zadanie | Czas |
|---|----|---------|------|
| 31 | QC-010 | Zastąpić `any` w `useMemoryOptimization.ts` przez `unknown` + lokalne interfaces dla `navigator.connection`, `performance.memory` | 30 min |
| 32 | QC-015 | Lokalne typy dla Web Vitals API w `PerformanceMonitor.tsx` lub przejście na pakiet `web-vitals` | 30 min |
| 33 | QC-012 | `globals.css` — przenieść custom klasy do `@layer components/utilities`, rozważyć split na osobne pliki | 1h |
| 34 | QC-014 | Włączyć `noUncheckedIndexedAccess` w `tsconfig.json` + naprawić nowe błędy TS | 1h |
| 35 | PERF-009 | Usunąć `transpilePackages: ["three", "gsap"]`, zweryfikować build w CI | 15 min |
| 36 | PERF-010 | Dodać `"gsap"` do `optimizePackageImports` | 2 min |
| 37 | — | Dodać pierwsze testy: `app/lib/schemas.ts` (unit), `app/lib/email.tsx` (integration z mock Resend) | ~1h |

---

## Faza 5 — Strategiczne (osobny epic) — ~4h

### [P1-1] Nonce-based CSP — usunięcie `unsafe-inline`/`unsafe-eval`

Najtrudniejsza zmiana, wymaga:
1. Stworzenia `middleware.ts` generującego nonce per request.
2. Przekazania nonce do komponentów serwerowych przez `headers()`.
3. Weryfikacji że GSAP / Three.js działają bez `unsafe-eval` w produkcji.
4. Testów regresji wszystkich animacji.

**Estymacja:** 3-4h + dzień testów. Wdrożyć dopiero po Fazie 1-3, na osobnej gałęzi.

---

## Mapa zależności

```
Faza 1 (deploy blocker)
  ↓
Faza 2a (security formularz) ── Faza 2b (sandbox + headers) ── Faza 2c (perf quick wins)
  ↓                              ↓                              ↓
  └──────────────────────────────┴──────────────────────────────┘
                                  ↓
                              Faza 3 (medium)
                                  ↓
                              Faza 4 (refactor)
                                  ↓
                              Faza 5 (CSP nonce)
```

Fazy 2a / 2b / 2c są od siebie niezależne — można je realizować równolegle lub w dowolnej kolejności.

---

## Acceptance criteria

Wdrożenie uznajemy za zakończone gdy:

- [ ] `npm run build` przechodzi bez warningów
- [ ] `npm run build:analyze` pokazuje że `three.js` chunk NIE jest w initial JS strony `/`
- [ ] Formularz kontaktowy: 4. próba wysłania w ciągu godziny zwraca błąd rate limit
- [ ] Lighthouse mobile na `/` ≥ 90 dla Performance (baseline do ustalenia przed wdrożeniem)
- [ ] `git status` nie pokazuje `web-bundles/` ani `docs/*.{jpg,png}` jako untracked
- [ ] `securityheaders.com` skanowanie domeny daje min. ocenę A (po fazie 2b)
- [ ] Wszystkie mockup routes zwracają `X-Robots-Tag: noindex` lub mają `<meta name="robots" content="noindex">`
- [ ] `package.json` — `framer-motion` i `zod` w `dependencies`; brak duplikatu `@types/three`

---

## Co odkładamy / pomijamy

- **QC-002 (Server Action)** — błędna interpretacja CLAUDE.md innego projektu. AeroMat może używać Server Actions.
- **Testy E2E** — poza zakresem tego planu. Sugerowane do osobnego epica po Fazie 4.
- **Migracja do Next.js 17 / React 20** — nie ma takiej potrzeby na ten moment.
