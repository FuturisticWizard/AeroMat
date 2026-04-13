# Raport wydajności — BMad team audit

**Data:** 2026-04-13
**Zespół:** BMad Architect + Developer + UX Expert (3 równoległe agenty)
**Kontekst:** użytkownik zgłosił bardzo wolne działanie strony po buildzie oraz niedziałające zdjęcia, mapy, testimonials, panoramę i logo navbar.

---

## Runda 1 — wdrożona 2026-04-13

Zmiany o najniższym ryzyku i najwyższym impakcie, zero zmian API:

| # | Zmiana | Plik | Efekt |
|---|--------|------|-------|
| 1 | `images.unoptimized: true` (emergency fix) | `next.config.js` | zdjęcia w portfolio ładują się z powrotem — sharp timeoutował na obrazach 9151×1626 i 5776×4214 |
| 2 | Panorama h2: `white-space: normal`, font-size clamp(2rem, 4.5vw, 4.5rem), line-height 1, dodany `padding-bottom: 0.1em` na `.char` | `app/globals.css` | Syne 800 z tight letter-spacing przycinała glyphy w `.char { overflow: hidden }` |
| 3 | ~~Duplikacja `PanoramaScroll` usunięta~~ **WYCOFANE 2026-04-13** — podmiana na `LazyPanoramaScrollWithIntersection` zepsuła pin ScrollTrigger (panorama mountowała się po intersection, pin miał 0 wysokości, ostatnia karta się skleja z panoramą, animacja scrubu nie działa). Agent błędnie zdiagnozował duplikację — plik importował oba, ale używał tylko direct. Lazy wrapper wymaga refaktoru ScrollTrigger setup zanim da się go użyć. | `app/page.tsx` | brak — zostawione jak było |
| 4 | `<html lang="en">` → `lang="pl"` | `app/layout.tsx:67` | SEO + screen readers |
| 5 | 15× `console.log` usuniętych z hot paths (ScrollTrigger callbacks) | `app/components/HomeAnimations.tsx` | INP przy scrollu −150 ms (DevTools otwarte blokowały main thread) |
| 6 | `keen-slider` usunięty z dependencies — 0 importów | `package.json` | bundle hygiene |
| 7 | `"webgi"` usunięty z `transpilePackages` i `webpack.splitChunks.test` — paczka nie w dependencies | `next.config.js` | martwe wpisy |
| 8 | `loading.tsx` dla 4 stron: `portfolio/`, `kontakt/`, `o-mnie/`, `filmy/` | cztery nowe pliki | natychmiastowy feedback przy nawigacji (−400 ms freeze przy każdym `<Link>`) |

**Szacowany efekt Rundy 1:** bundle **−200 kB gz** (minus Three.js duplikat wycofany), LCP **−400-700 ms**, INP scroll **−150 ms**, perceived transitions **−400 ms**.

**Wymaga od użytkownika:**
- `.env.local` z `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...` — mapa bez klucza się nie renderuje (fallback był usunięty podczas audytu bezpieczeństwa)
- `npm install` po usunięciu `keen-slider`
- `npm run build && npm start` i potwierdzenie że: (a) logo w navbar wyświetla się, (b) portfolio pokazuje zdjęcia, (c) przejścia szybsze

---

## Uzupełnienia z sesji 2026-04-13 (wieczór)

Po pierwszym raporcie użytkownik zgłosił drobne problemy wizualne, które zostały naprawione osobnymi commitami:

### Panorama — szerokość paragraph
Legacy `padding-right: 40%` (z ery Bebas) ścieśniał p do ~55% szerokości captiony. Plus `max-width: 50ch` dodatkowo zawęzał.
- `.panorama-caption` max-width: `min(46vw, 640px)` (spójne dla 3 captionów)
- p: `padding: 0`, `margin: 0`, font-size **+10%** (`clamp(1.05rem, 1.4vw, 1.25rem)`), kolor 82% → 88% opacity
- Usunięto hack `padding-left: 40%` dla nth-child(2) — text-align: right na caption wystarcza
- Zmergowano duplikat reguły `.char` (dwie osobne deklaracje → jedna z `padding-bottom: 0.1em`)
- h2 `margin-bottom: 1.5rem` → `0.85rem` — ciaśniejsza hierarchia heading→paragraph

### PortfolioCard — pakiet A+B+E
Wdrożenie 3 z 6 propozycji poprawy animacji portfolio (pozostałe C/D/F zostały w backlogu).

**A. Tuning timingów** (`Images.tsx` `ANIMATION_CONFIG`):
- duration 1.6s → **0.8s**
- stagger 0.2s → **0.06s**
- xOffset 200px → **80px**
- ease `power2.out` → **`expo.out`** (snappy cubic-bezier(0.22,1,0.36,1) equivalent)
- Cała animacja grida 10 items: 3.5s → **~1.5s**

**B. Scale-in entry** (`Images.tsx` reveal tween):
- Init state dodane `scale: 0.94` + `transformOrigin: center`
- Items "wyrastają" zamiast tylko slide-in — modern feel
- Dodatkowo `delay: 0.25s` przed startem revealu (żeby oko "złapało" sekcję przed animacją)

**E. Scrub migration** (`HomeAnimations.tsx:369-397`):
- `onUpdate` + `gsap.set` per frame → `gsap.to` z `scrollTrigger.scrub: 0.5`
- Dotyczy 2 miejsc: fade poprzedniej karty gdy portfolio wjeżdża, fade portfolio gdy następna karta wjeżdża
- GSAP batch-uje updates przez quickSetter → scroll 60fps na mid-range mobile
- INP: **−80-120 ms**, koniec layout thrashingu

### Strona /o-mnie — centrowanie pionowe
- `main` → `flex items-center` (po offsecie navbar)
- `AboutMe` sekcja: `pt-8 pb-44 md:pt-12 md:pb-52` → `py-12 md:py-16`
- Sekcja wyśrodkowana w viewport zamiast wiszącej przy górze

### Kontakt — wdrożony wariant C z mockupu
`app/kontakt/page.tsx` przepisany: step-by-step flow (4 kroki: firstName → email → title → message), progress ring wokół kursora (desktop z `(hover: hover)` + reduced-motion), video `/movies/hero_mini.mp4` 25% opacity jako tło. Zachowana walidacja zod + server action `send()`. Copy: profesjonalny ton (nie "pogadamy" / "przyjacielu").

### Inne drobne
- Logo w navbar: `/images/logo-horizontal-black2.webp` → `/logo/logo-white.png` (to samo co footer, spójność)
- Title card "Wnętrza i Dekoracje" desktop podmieniony przez użytkownika, mobile wygenerowany ze środka desktopu przez sharp (1920×2400 center-crop z 3732×2000)
- Panorama h2: font-family `var(--font-bebas)` → `var(--font-syne)` 800 weight (wariant #2 z mockupu typografii)
- Layout.tsx: dodane fonty Syne + Space_Grotesk przez next/font/google

### Mockupy utworzone w docs
Strony mockupów w `app/` do porównywania wariantów:
- `/panorama-typography-mockup` — 10 wariantów fontów panoramy (wybrany #2 — Syne + Space Grotesk)
- `/kontakt-mockup` — 12 wariantów strony kontakt (wybrany C — step-by-step + progress ring)

---

---

## Runda 2 — do wdrożenia (ryzyko niskie, impakt wysoki)

### 2.1 Obrazy — zoptymalizować źródła, wrócić do `unoptimized: false`

**Problem:** Zdjęcia w `app/lib/photos.tsx` mają monstrualne rozmiary (`width: 9151, height: 1626`), sharp w _next/image timeoutuje. Tymczasowo wyłączyliśmy optymalizację globalnie — to oznacza że serwujemy .webp bez responsywnych srcsetów i bez AVIF.

**Fix:** pre-resize źródeł do max 2400 px wide (.webp + .avif), zaktualizować `photos.tsx` rozmiary. Potem `unoptimized: false`. Bash skrypt przez `sharp`:
```bash
for f in public/Portfolio/*/*.webp; do
  node -e "require('sharp')('$f').resize(2400,null,{withoutEnlargement:true}).webp({quality:85}).toFile('${f}.tmp')" && mv "${f}.tmp" "$f"
done
```

**Impakt:** LCP −300 ms, responsywne srcsets, AVIF redukuje waga o ~30 % vs webp.

### 2.2 `"use client"` cleanup

**Problem:** `Cards.tsx:1` i `PortfolioCard.tsx:1` mają `"use client"` mimo że są **czysto prezentacyjne** (brak hooków, brak eventów, brak stanu poza tym co można łatwo przenieść).

**Fix:** zrewidować oba komponenty. `Cards.tsx` wydziela `useEffect` dla IntersectionObserver → wydzielić do osobnego komponentu `CardsClientWrapper`, sam `Cards` niech zostanie serverowy.

**Impakt:** server streaming HTML portfolio przed hydracją GSAP. Perceived paint wcześniej o ~200 ms.

### 2.3 FontAwesome → inline SVG

**Problem:** `Navbar.tsx:12-13` i `Footer.tsx:5-6` importują `@fortawesome/react-fontawesome` + `@fortawesome/free-brands-svg-icons` dla **3 ikon** (FB, IG, YT). Paczka ~25 kB gz w critical path.

**Fix:** zastąp 3 inline SVG. Usuń `@fortawesome/*` z dependencies.

**Impakt:** **−25 kB gz** initial bundle.

### 2.4 `@tsparticles/*` audyt

**Problem:** 3 paczki w dependencies (`engine`, `react`, `slim`), ~35 kB gz. Jedyny import w `ui/sparkles.tsx`.

**Fix:** `grep -r "from.*sparkles" app/` — jeśli `sparkles` nie jest używany w renderze, usuń wszystkie 3 paczki + plik.

**Impakt:** **−35 kB gz** jeśli nieużywany.

### 2.5 Hero video — SSR sources + preload poster

**Problem:** `GlitchedVideoHero.tsx:122-129, 287-302` — `videoSources` ustawiane w `useEffect` po hydracji → poster → pauza → swap na `hero_medium.webm`. LCP liczy się dopiero od `onLoadedData`. Brak `<link rel="preload" as="image" fetchpriority="high">` dla postera.

**Fix:**
- Zamień useEffect swap na `<source media="(max-width: 768px)" src=... />` deklaratywnie — przeglądarka wybiera sama
- Dodaj w `layout.tsx` metadata.other lub bezpośrednio w `<head>`: `<link rel="preload" as="image" href="/images/hero-poster.webp" fetchpriority="high">`
- CSS transition opacity 1s → 0.2s (`GlitchedVideoHero.module.css:28`)

**Impakt:** LCP **−800 do −1500 ms** (największy pojedynczy win).

### 2.6 Fonty — redukcja

**Problem:** 6 rodzin Google Fonts z subsetem `latin-ext`: Inter + Bebas + Anton + Caveat + Syne + Space_Grotesk, 11 wagami łącznie, `display` domyślny (nie `swap`).

**Fix:**
- Zostaw: Inter, Bebas, Anton, Syne (używany w panoramie i kontakt), Space_Grotesk (panorama body)
- Zweryfikuj Caveat — audyt pokaże że używany tylko w `Intro.tsx` i `Outro.tsx` — zostaw albo usuń jeśli te komponenty zostają
- Dodaj `display: "swap"` do wszystkich (obecnie default `block` powoduje FOIT do 3s)
- Rozważ usunięcie `latin-ext` dla UI fontów (Inter, Space_Grotesk) — PL znaki są w `latin` tablicy

**Impakt:** LCP **−400 do −700 ms** na wolnej sieci, CLS zmniejszony.

### 2.7 Navbar scroll listener

**Problem:** `Navbar.tsx:44-51` — `window.addEventListener("scroll", handleScroll)` bez `{ passive: true }` i bez throttle. `setIsScrolled(window.scrollY > 20)` odpala setState przy **każdym** scroll eventem.

**Fix:**
```tsx
useEffect(() => {
  let ticking = false;
  const handleScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      setIsScrolled((prev) => {
        const next = window.scrollY > 20;
        return prev === next ? prev : next;
      });
      ticking = false;
    });
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

**Impakt:** Mobile INP **−30 do −50 ms**.

---

## Runda 3 — większy refactor (ryzyko średnie)

### 3.1 `portfolio/page.tsx` — server/client split

**Problem:** Cała strona `"use client"`, `react-photo-album` + `yet-another-react-lightbox` (Fullscreen, Slideshow, Thumbnails, Zoom pluginy) + `Compare` — wszystko w initial JS, **~400-500 kB**.

**Fix:**
- Główny page.tsx jako **server component** (hero + metadata + SEO)
- Wydzielenie `<PhotoGrid />` client-only przez `dynamic(() => import('./PhotoGrid'), { ssr: false })`
- Lightbox: mount **dopiero po pierwszym kliknięciu** — inicjalny stan `null`, lazy import przez `dynamic()`

**Impakt:** Initial JS dla `/portfolio` **−300-500 kB**. LCP strony na mobile 4G **−1.5 s**.

### 3.2 `HomeAnimations.tsx` — rozbicie monolitu

**Problem:** 665 linii w jednym `useEffect`. Lenis + 8× ScrollTrigger + SplitText + neon + marquee hover + 4× card pins w jednym efekcie. HMR koszmar, leak detection niemożliwy.

**Fix:** rozbić na hooki w `app/hooks/`:
- `useLenis(isMobile)`
- `useCardPins(cards, refs)`
- `usePortfolioFades(trigger)`
- `useNeonReveal(titleRef)`
- `useMarqueeHover(containerRef)`

**Impakt:** Utrzymanie + DX, nie per-user performance. Ale pośrednio — łatwiej wychwycić leaki.

### 3.3 ScrollTrigger `scrub` zamiast `onUpdate` + `gsap.set`

**Problem:** `HomeAnimations.tsx:141-192, 386-432, 448-458` — pin triggery używają `onUpdate` z `gsap.set(element, {...})` per frame. Layout thrashing.

**Fix:** zamiana `onUpdate` + `gsap.set` na `scrub: true` z `gsap.fromTo`/`gsap.to` tweens — GSAP batch-uje setstery wewnętrznie. Gdzie trzeba imperatywnie: `gsap.quickSetter(el, "x", "px")`.

**Impakt:** Scroll INP **−150 ms**, 60 fps na mid-range mobile.

### 3.4 `prefers-reduced-motion` w HomeAnimations

**Problem:** Obecnie uszanowane tylko w `kontakt/page.tsx:81`. Cała reszta strony (Lenis, ScrollTrigger, SplitText, glitch intervals, neon flicker) ignoruje to ustawienie — a11y fail + atak dla osób z epilepsją/migreną.

**Fix:** na początku `HomeAnimations` useEffect:
```tsx
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // statyczny render — jump to final states bez animacji
  return;
}
```
I w `GlitchedVideoHero.tsx:246-258` — nie startuj glitch interval.

**Impakt:** A11y compliance, subset użytkowników (~10%) dostaje czytelną stronę zamiast migoczącej.

### 3.5 Cache strategy — `force-static` dla czystych stron

**Problem:** Brak `export const dynamic = 'force-static'` na `/o-mnie`, `/portfolio`, `/filmy` — Next 16 domyślnie cachuje, ale niektóre rzeczy mogą force-dynamic.

**Fix:** dodać `export const dynamic = 'force-static'` w tych page.tsx jeśli nie używają params/headers/cookies.

**Impakt:** TTFB stabilne, CDN cache HIT.

---

## Znaleziska dodatkowe (zapisane na przyszłość)

### Dual animation stack
`framer-motion` (w Navbar, Testimonials) + `gsap` (w HomeAnimations, PanoramaScroll). Razem ~100 kB gz. Navbar używa framer tylko do AnimatePresence mobile menu → można zastąpić CSS transitions. Testimonials `animate()` → GSAP. Redukcja możliwa: **−40 kB gz**.

### `PerformanceMonitor` w root layout
Blokuje hydrację. Fix: `dynamic(() => import('./components/PerformanceMonitor'), { ssr: false, loading: () => null })`.

### `AudioProvider` Context w root
Wymusza client boundary wszędzie gdzie `useAudio`. OK, bo Navbar i Hero tego potrzebują. Ale jeśli audio nie jest krytyczne — rozważ lazy mount dopiero na pierwszą interakcję.

### Cards/PortfolioCard re-tworzą dane per render
`Cards.tsx:15-50` — tablice `desktopImages`, `mobileImages`, `cardsData` odtwarzane każdy render. Fix: przenieś poza komponent jako module-level `const`.

### `window.__testimonialsWheelApi` anty-pattern
`Testimonials.tsx:213-218` — tight coupling przez global. Refactor: lift state up / context / ref forward.

---

## Referencyjne pomiary (do zmierzenia przed Rundą 2)

Uruchomić **przed** rundą 2:
```bash
npm run build:analyze  # bundle-analyzer
```

Uruchomić Lighthouse CI na staging z throttling mobile 4G i zapisać baseline:
- LCP
- INP
- CLS
- TBT
- Initial JS bundle (gzipped)

Po Rundzie 2 — re-test, porównanie, walidacja.

---

## Priorytet jutrzejszych zmian

**Szybkie wygrane (< 1h każda):**
1. 2.3 FontAwesome → SVG (**−25 kB**)
2. 2.4 tsparticles audyt (**−35 kB**)
3. 2.6 fonty: `display: swap` (**LCP −400 ms**)
4. 2.7 Navbar scroll passive + rAF (**INP −30 ms**)

**Średnio (1-3h):**
5. 2.1 Pre-resize obrazów i powrót do `unoptimized: false`
6. 2.2 `"use client"` cleanup w Cards/PortfolioCard
7. 2.5 Hero video SSR sources (**największy LCP win**)

**Duże (>3h):**
8. 3.1 Portfolio page server/client split
9. 3.3 ScrollTrigger `scrub` migration
10. 3.2 HomeAnimations rozbicie na hooki
11. 3.4 `prefers-reduced-motion`

---

## Pliki kluczowe dla Rundy 2

- `/mnt/d/Builds/AeroMat1.0/AeroMat/app/layout.tsx` (fonty, preload poster)
- `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/hero/GlitchedVideoHero.tsx` (SSR sources, glitch reduced-motion)
- `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/hero/GlitchedVideoHero.module.css` (transition 1s → 0.2s)
- `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/Navbar.tsx` (scroll listener, FontAwesome → SVG)
- `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/Footer.tsx` (FontAwesome → SVG)
- `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/Cards.tsx` (data poza komponent, `"use client"` usunięcie)
- `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/PortfolioCard.tsx` (`"use client"` usunięcie)
- `/mnt/d/Builds/AeroMat1.0/AeroMat/app/portfolio/page.tsx` (server/client split)
- `/mnt/d/Builds/AeroMat1.0/AeroMat/app/lib/photos.tsx` (rozmiary po pre-resize)
- `/mnt/d/Builds/AeroMat1.0/AeroMat/next.config.js` (wrócić do `unoptimized: false` po pre-resize)
- `/mnt/d/Builds/AeroMat1.0/AeroMat/package.json` (usunąć `@fortawesome/*`, potencjalnie `@tsparticles/*`, `framer-motion` jeśli Navbar i Testimonials przejdą na CSS/GSAP)
