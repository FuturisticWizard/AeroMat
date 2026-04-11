# Audyt Architektury -- AeroMat Portfolio

**Data:** 2026-04-06
**Audytor:** CTO Agent (Claude Opus 4.6)
**Wersja projektu:** 0.1.0
**Stack:** Next.js 16.0.10 / React 19.2 / TypeScript 5 / Tailwind 3.4.17

---

## Podsumowanie

| Kategoria | Ocena | Opis |
|-----------|-------|------|
| **Struktura projektu** | 2/5 | Plaski uklad komponentow, brak logicznego grupowania, pliki .backup w repo |
| **Zaleznosci** | 2/5 | Nadmiarowe paczki, duplikacja bibliotek ikon i animacji, Three.js prawie nieuzywany |
| **Renderowanie (SSR/CSR)** | 1/5 | Cala strona glowna to `"use client"` -- zero SSR, zero SEO, zero metadanych |
| **Routing i strony** | 3/5 | Poprawny App Router, ale 3 stub-page'y nie maja sensu w produkcji |
| **Konfiguracja i bezpieczenstwo** | 4/5 | Solidne headery, chunk splitting, CSP -- najlepsza czesc projektu |
| **Code quality** | 2/5 | 760-liniowy monolityczny useEffect, 15 console.log w produkcji, dead code |
| **Lazy loading** | 4/5 | Dobrze zaprojektowany system IntersectionObserver + dynamic import |
| **Design system** | 3/5 | Rozbudowany Tailwind config, ale nadmiar safelist i nieuzywane kolory |

**Ocena ogolna: 2.6/5 -- wymaga istotnych zmian architektonicznych**

---

## 1. STRUKTURA PROJEKTU -- Ocena: 2/5

### 1.1 Organizacja komponentow

**Problem: Plaski katalog `app/components/` z 54+ plikami bez grupowania**

```
app/components/
  AboutMe.tsx          # Uzywany na stronie glownej
  Achievements.tsx     # Nieuzywany w zadnym imporcie
  AppleCards.tsx       # Uzywany
  AppleCards.tsx.backup  # BACKUP w repo!
  BentoGrid.tsx        # Nieuzywany w imporcie strony glownej
  CallButton.tsx       # ?
  CallButtonPortal.tsx # ?
  Card.tsx             # Osobny od Cards.tsx -- mylace
  CardFlip.tsx         # Uzywany?
  CardFlip2.tsx        # Duplikat CardFlip?
  Cards.tsx            # Uzywany na stronie glownej
  ...                  # 40+ wiecej plikow
```

**Konkretne problemy:**

- **Plik:** `app/components/AppleCards.tsx.backup` -- pliki `.backup` nie powinny byc w repozytorium. To zadanie dla gita (`git stash` lub branch).
- **Plik:** `app/components/Services.tsx.backup` -- j.w.
- **Plik:** `app/components/ui/apple-cards-carousel.tsx.backup` -- j.w.
- **Plik:** `app/components/Card.tsx` vs `app/components/Cards.tsx` -- nazwy mylace, nie wiadomo ktory robi co.
- **Plik:** `app/components/CardFlip.tsx` vs `app/components/CardFlip2.tsx` -- duplikat z numerem.
- **Plik:** `app/components/Hero.tsx` + `app/components/Hero3.tsx` + `app/components/hero/VideoHero.tsx` + `app/components/hero/GlitchedVideoHero.tsx` -- 4 warianty hero bez jasnej struktury.

**Rekomendacja:** Pogrupowac komponenty w podkatalogi wedlug funkcji:

```
app/components/
  layout/        # Navbar, Footer
  hero/          # GlitchedVideoHero (aktywny), VideoHero (archiwum)
  portfolio/     # Portfolio, PortfolioCard, Images, Cards
  sections/      # Intro, Outro, AboutMe, TrustedBy, HowItWorks, Services
  media/         # VideoPlayer, YoutubeVideosGrid, PanoramaScroll
  map/           # GoogleMap, MuralsMap
  ui/            # (jak jest -- komponenty bazowe)
  contact/       # email-template
```

### 1.2 Layout -- `app/layout.tsx`

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/layout.tsx`

**Problem (linia 67):** `<html lang="en">` -- strona polskiego artysty z polskim contentem ma hardcoded `lang="en"`. To blad SEO i dostepnosci.

**Problem (linia 67):** Zakomentowany kod (linie 13-16, 40-54) -- dead code zanieczyszcza plik.

**Pozytyw:** 4 fonty ladowane przez `next/font/google` -- poprawna strategia (brak FOUT).

**Pozytyw:** `AudioProvider` jako context wrapper -- wlasciwe podejscie.

### 1.3 Strony-stuby

**Pliki:**
- `app/blog/page.tsx` -- 7 linii, renderuje `<div>Blog</div>`
- `app/firma/page.tsx` -- 7 linii, renderuje `<div>Firma</div>`
- `app/process/page.tsx` -- 58 linii, niedokonczony layout z hardcoded szerokosciami (`w-[600px]`) i debug borderami (`border-2 border-solid border-green-400`), referencja do nieistniejacego fontu (`--font-geist-sans`)

**Problem:** Te strony sa dostepne publicznie ale nie zawieraja tresci. Googlebot je zaindeksuje. Powinny byc albo ukonczone, albo usuniete z routingu, albo zablokowane w `robots.txt` / zwracac `notFound()`.

---

## 2. ZALEZNOSCI -- Ocena: 2/5

### 2.1 Nadmiarowe / nieuzywane paczki

| Paczka | Rozmiar w node_modules | Uzywana w plikach | Werdykt |
|--------|----------------------|-------------------|---------|
| `three` | 28 MB | 2 pliki (ThreeCanvas.tsx -- zakomentowany w page.tsx, PanoramaScroll.tsx) | Czesciowo -- PanoramaScroll uzywa surowego THREE, nie React Three Fiber |
| `@react-three/fiber` | 4.2 MB | 1 plik (ThreeCanvas.tsx -- zakomentowany!) | **MARTWY KOD** -- do usuniecia |
| `@react-three/drei` | 2.7 MB | 1 plik (ThreeCanvas.tsx -- zakomentowany!) | **MARTWY KOD** -- do usuniecia |
| `keen-slider` | ? | 0 plikow | **NIEUZYWANY** -- do usuniecia |
| `@tsparticles/*` (3 paczki) | ? | 1 plik (sparkles.tsx) | Ciezka paczka dla jednego efektu |
| `react-masonry-css` | ? | 1 plik (Portfolio.tsx) | OK, ale Portfolio.tsx moze byc martwy |
| `react-player` | ? | 1 plik (VideoPlayer.tsx) | OK |

### 2.2 Duplikacja bibliotek

**Problem: 3 biblioteki ikon rownoczesnie**

1. `lucide-react` -- uzywany w Navbar (Menu, X, Volume2, VolumeX, ArrowRight)
2. `@fortawesome/react-fontawesome` + `@fortawesome/fontawesome-svg-core` + `@fortawesome/free-brands-svg-icons` -- uzywany TYLKO dla 3 ikon social media (Facebook, Instagram, YouTube)
3. `react-icons` -- uzywany w 3 plikach (CardFlip.tsx, InNumbers.tsx, Flipcard.tsx)
4. `@tabler/icons-react` -- uzywany w 5 plikach (compare.tsx, apple-cards-carousel -- glownie AceternityUI)

**Rekomendacja:** Ustandaryzowac na jednej bibliotece ikon. `lucide-react` to najlepszy wybor -- lekki, tree-shakeable, pokrywa ikony social media. Pozwoli usunac 3 paczki FontAwesome i `react-icons`.

### 2.3 Duplikacja bibliotek animacji

**Problem: 4 biblioteki animacji rownoczesnie**

1. `gsap` (6.2 MB) -- **glowna** biblioteka, uzywana w page.tsx, PanoramaScroll, ThreeCanvas, kilku komponentach
2. `framer-motion` (3.2 MB) -- uzywana w **21 plikach** (Navbar, karty, ImageSlider, Compare, UI)
3. `@react-spring/web` -- uzywana w **2 plikach** (AppleCards.tsx, AppleCards.tsx.backup)
4. `lenis` (496 KB) -- smooth scroll, uzywany w page.tsx

GSAP i Framer Motion to dwie kompletne biblioteki animacji. Obie robia to samo (animacje CSS, scroll, layout). Utrzymywanie dwoch zwieksza bundle i komplikuje codebase.

**Rekomendacja:** Wybrac jedna. GSAP jest glebiej zintegrowany (page.tsx, ScrollTrigger, SplitText) -- wiec zachowac GSAP i stopniowo migrwoac Framer Motion. React Spring mozna usunac natychmiast (tylko backup plik).

### 2.4 `framer-motion` w devDependencies

**Plik:** `package.json` linia 69

`framer-motion` jest w `devDependencies` ale jest importowany w 21 plikach produkcyjnych. To powinno byc w `dependencies`. Dziala tylko dlatego, ze bundler (webpack/turbopack) nie rozroznia dev od prod przy budowaniu, ale to bledna klasyfikacja -- `npm ci --production` nie zainstaluje framer-motion na serwerze.

### 2.5 `zod` w devDependencies

**Plik:** `package.json` linia 77

`zod` jest w `devDependencies` ale jest importowany w `app/lib/schemas.ts` (produkcyjny Server Action). Ten sam problem co framer-motion.

### 2.6 Duplikat `@types/three`

**Plik:** `package.json` linie 28 i 63

`@types/three` jest zarowno w `dependencies` (^0.168.0) jak i `devDependencies` (^0.170.0) -- w roznych wersjach. Powinien byc tylko w devDependencies, w jednej wersji.

---

## 3. RENDEROWANIE (SSR/CSR) -- Ocena: 1/5

### 3.1 KRYTYCZNY: Cala strona glowna to Client Component

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/page.tsx`, linia 1

```tsx
"use client";
```

To jest **najwazniejszy problem architektoniczny calego projektu.** Strona glowna -- najwazniejsza strona portfolio artysty -- jest w calosci renderowana po stronie klienta.

**Konsekwencje:**

1. **Zero SEO** -- Googlebot widzi pusty `<div>` zanim JavaScript sie wykona. Zadna tresc strony glownej nie jest w HTML.
2. **Zero metadanych strony glownej** -- `app/page.tsx` nie moze eksportowac `metadata` ani `generateMetadata()` bo jest Client Component. Metadata z `app/layout.tsx` dotyczy calego serwisu, nie strony glownej.
3. **Wolne ladowanie** -- 758 linii JavaScript musi sie pobrac, sparsowac i wykonac zanim uzytkownik zobaczy cokolwiek.
4. **Brak SSR hydration** -- caly content jest generowany w przegladarce od zera.

**Dlaczego to sie stalo:** Strona glowna to jeden gigantyczny `useEffect` (linie 33-687) -- 654 linii logiki animacji GSAP. Wymaga `"use client"` bo uzywa hookow React + DOM API.

**Rekomendacja:** Rozdzielic na:
- `app/page.tsx` -- Server Component z metadanymi, strukturalnym HTML, danymi
- `app/components/HomePageClient.tsx` -- `"use client"` z logika animacji
- Albo lepiej: wydzielic kazda animacje do osobnego komponentu z wlasnym useEffect

### 3.2 Footer jest Client Component bez powodu

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/Footer.tsx`, linia 1

```tsx
"use client";
```

Footer nie uzywa ZADNYCH hookow (useState, useEffect, event handlerow). Jedyne co robi to renderuje statyczny HTML z linkami. `Image` i `Link` z Next.js dzialaja w Server Components.

**Rekomendacja:** Usunac `"use client"` -- Footer moze byc Server Component. Zmniejszy bundle klienta.

### 3.3 Statystyka "use client"

42 pliki komponentow maja `"use client"`. W calym katalogu `app/components/` praktycznie kazdy plik jest Client Component. To zaprzecza filozofii App Router, gdzie domyslnie wszystko jest Server Component a `"use client"` to wyjatki.

---

## 4. CODE QUALITY -- Ocena: 2/5

### 4.1 Monolityczny useEffect w page.tsx

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/page.tsx`, linie 33-687

654 linii w jednym `useEffect`. Odpowiada za:
- Inicjalizacje Lenis (smooth scroll)
- Konfiguracje ScrollTrigger z scrollerProxy
- Inicjalizacje kart (z-index, scale, pozycje)
- SplitText na tytulach
- Animacje intro card (circle reveal)
- Desktop pinning (matchMedia >= 768)
- Mobile pinning (matchMedia < 768)
- Portfolio card transitions (fade/scale)
- Parallax efekty na obrazach
- Text reveal triggers
- Intro neon animation timeline (50+ tweenow)
- Outro neon animation timeline (50+ tweenow)
- Marquee animation setup
- Marquee hover interaction
- Window load event
- Cleanup function

To jest niemozliwe do utrzymania, debugowania i testowania. Kazda z tych odpowiedzialnosci powinna byc osobnym hookiem lub komponentem.

### 4.2 15 console.log w page.tsx

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/page.tsx`

Linie: 35, 38, 51, 57, 71, 75, 83, 88, 89, 113, 116, 122, 236, 351, 659

Mimo ze `next.config.js` ma `removeConsole` w produkcji (linia 15-19), te logi zasmiecaja development i sa oznakami niedokonczonych prac debugowych.

### 4.3 Brak obslugi bledow w kontakcie

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/kontakt/page.tsx`, linia 65

```tsx
function onSubmit(values: z.infer<typeof formSchema>) {
  send(values);  // Fire-and-forget! Brak await, brak try/catch, brak UI feedback
}
```

`send()` jest async Server Action, ale nie jest `await`-owany. Uzytkownik nie dostanie informacji o powodzeniu ani bledzie. Formularz nie zostanie zresetowany. Brak loading state.

### 4.4 Zakomentowany kod

- `app/page.tsx` linie 3, 28-29, 741-747 -- zakomentowane importy i komponenty
- `app/layout.tsx` linie 13-16, 40-54 -- zakomentowane fonty
- `app/kontakt/page.tsx` linie 25-49 -- zakomentowana stara implementacja formularza
- `app/portfolio/page.tsx` linie 39-42, 102-118 -- zakomentowane sekcje

### 4.5 Placeholder image na stronie kontaktu

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/kontakt/page.tsx`, linia 73

```tsx
<Image src="/placeholder.png" alt="image" ... />
```

Produkcyjna strona kontaktu uzywa `placeholder.png` z alt textem `"image"`.

### 4.6 Niedokonczony Footer

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/Footer.tsx`, linia 69

```tsx
<p>(c) {new Date().getFullYear()} Made by . All rights reserved.</p>
```

"Made by " -- brakuje nazwy autora/firmy.

### 4.7 useMemoryOptimization.ts -- import na koncu pliku

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/hooks/useMemoryOptimization.ts`, linia 204

```tsx
import { useState } from 'react';
```

Import `useState` na samym koncu pliku, po uzyciu w `useNetworkStatus` (linia 167). TypeScript to zaakceptuje (hoisting), ale to antywzorzec ktory utrudnia czytanie kodu.

### 4.8 PerformanceMonitor -- monitoruje ale nie raportuje

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/PerformanceMonitor.tsx`

Zbiera Core Web Vitals ale:
- W development -- loguje do konsoli (OK)
- W produkcji -- probuje wyslac do `window.gtag` (Google Analytics) ale GA nie jest skonfigurowane nigdzie w projekcie
- Monitoruje pamiec co 30s w development -- moze powodowac garbage collection pressure

To jest zasadniczo martwy kod w produkcji.

---

## 5. ROUTING -- Ocena: 3/5

### 5.1 Struktura routingu

```
/              -> app/page.tsx          (glowna -- aktywna)
/portfolio     -> app/portfolio/page.tsx (aktywna)
/kontakt       -> app/kontakt/page.tsx   (aktywna, niedokonczena)
/blog          -> app/blog/page.tsx      (stub)
/firma         -> app/firma/page.tsx     (stub)
/process       -> app/process/page.tsx   (niedokonczona prototyp)
```

### 5.2 Brak stron 404 i error

Brak `app/not-found.tsx` i `app/error.tsx`. Uzytkownik zobaczy domyslna strone 404 Next.js.

### 5.3 Brak `robots.txt` i `sitemap.xml`

Nie znaleziono `app/robots.ts` ani `app/sitemap.ts`. Dla strony portfolio to istotne -- Googlebot nie wie co indeksowac.

### 5.4 Nawigacja Navbar vs routing

**Plik:** `app/components/Navbar.tsx`, linie 23-28

```tsx
const defaultItems: NavItem[] = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Filmy", href: "/#w-akcji" },
  { label: "O mnie", href: "/#o-mnie" },
  { label: "Kontakt", href: "/kontakt" },
];
```

Uzywa `<a href>` zamiast `<Link>` z Next.js (linia 79-86). To powoduje pelny page reload przy kazdej nawigacji zamiast client-side navigation. Link z Next.js jest importowany (linia 9) ale uzywany tylko dla logo i social links.

---

## 6. KONFIGURACJA I BEZPIECZENSTWO -- Ocena: 4/5

### 6.1 next.config.js -- dobrze

**Pozytyw:**
- `poweredByHeader: false` -- ukrywa Next.js header
- `reactStrictMode: true`
- `removeConsole` w produkcji (z wyjatkiem error/warn)
- Solidne security headers: CSP, X-Frame-Options, HSTS, Permissions-Policy
- Chunk splitting z named groups (maps, three, ui)
- `optimizePackageImports` dla ciezkich paczek
- Bundle analyzer dostepny

**Problem (linia 25):**
```js
images: { unoptimized: true }
```

Wylaczona optymalizacja obrazow Next.js. Komentarz mowi "source images already converted to WebP" -- ale Next.js moze dalej serwowac je z odpowiednim sizing i lazy loading. `sharp` jest zainstalowany ale nieuzywany.

**Problem (linia 44-50):** `transpilePackages` zawiera `three`, `@react-three/fiber`, `@react-three/drei` -- pakiety ktore sa (prawie) nieuzywane.

### 6.2 CSP -- prawie dobrze

**Plik:** `next.config.js`, linia 132

```
script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:
```

`'unsafe-eval'` jest wymagany przez GSAP/Three.js ale oslabia CSP. `'unsafe-inline'` moglby byc zastapiony nonce-based approach.

### 6.3 Cache headers

**Plik:** `next.config.js`, linie 165-181

Statyczne assety maja `immutable` cache na 1 rok -- dobrze. Ale pattern `/:dir(pngs|icons|...)/:path*` jest specyficzny i moze nie pokrywac wszystkich assetow.

---

## 7. LAZY LOADING -- Ocena: 4/5

### 7.1 LazyComponents.tsx -- dobrze zaprojektowany

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/LazyComponents.tsx`

**Pozytyw:**
- `dynamic()` z `ssr: false` dla ciezkich komponentow (Google Maps, Three, YouTube)
- `LazyWithIntersection` HOC -- laduje komponent dopiero gdy jest widoczny w viewport
- Rozne `rootMargin` dla roznych komponentow (100-300px)
- Loading placeholders z `animate-pulse` -- dobry UX
- Podwojne Suspense boundary (dynamic + React.Suspense)

**Problem:** ThreeCanvas jest lazy-loaded ale zakomentowany w page.tsx. LazyPanoramaScroll jest zdefiniowany ale PanoramaScroll jest importowany bezposrednio (linia 18 page.tsx) -- niespojnosc.

### 7.2 Niespojnosc lazy vs eager

- `PanoramaScroll` -- importowany bezposrednio w page.tsx (ciezki: THREE.js)
- `MuralsMap` -- importowany bezposrednio (ale istnieje `LazyMuralsMapWithIntersection`)
- `YouTubeGrid`, `Testimonials` -- uzywaja lazy wersji (dobrze)

**Rekomendacja:** PanoramaScroll i MuralsMap powinny uzywac lazy wariantow.

---

## 8. DESIGN SYSTEM (Tailwind) -- Ocena: 3/5

### 8.1 tailwind.config.ts

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/tailwind.config.ts`

**Problem:** 61 wpisow w `safelist` (linie 11-61). Safelist wylacza tree-shaking Tailwind dla tych klas. Wiekszosci z nich (kolory `green-light`, `cyan-medium`, itd.) prawdopodobnie nie potrzebuje safelist jesli sa uzywane w statycznym JSX.

**Problem:** 20+ kolorow zdefiniowanych w `colors` ktore wymagaja CSS variables (`--green-light`, `--cream`, `--ivory`, itd.). Jesli te zmienne nie sa zdefiniowane w `globals.css`, kolory beda przezroczyste/niewidoczne.

**Problem:** Rozbudowany system `screens` z 11 breakpointami:
```
xxs: 320, xs: 375, xxsm: 475, xsm: 625, sm: 768, lsm: 868,
md: 1024, lmd: 1124, lg: 1280, xl: 1440, 2xl: 1536, 3xl: 1765, 4xl: 1920
```

14 breakpointow to zdecydowanie za duzo. Standardowe 4-5 (sm, md, lg, xl, 2xl) wystarcza. Kazdy dodatkowy komplikuje responsive design.

**Problem:** `boxShadow.md` nadpisuje domyslny Tailwind shadow-md na `inset` shadow -- moze powodowac nieoczekiwane zachowanie.

**Pozytyw:** System kolorow shadcn/ui (background, foreground, card, primary, etc.) -- dobrze zorganizowany.

---

## 9. KONKRETNE REKOMENDACJE -- Priorytetyzowane

### KRYTYCZNE (sprint 1)

1. **Rozdzielic `app/page.tsx` na Server i Client Component.**
   - Utworzyc `app/page.tsx` jako Server Component z `metadata`, strukturalnym HTML
   - Przeniesc logike animacji do `app/components/home/HomeAnimations.tsx` (client)
   - Rozdzielic monolityczny useEffect na osobne custom hooks:
     - `useLenisSetup()` -- smooth scroll
     - `useCardAnimations()` -- card pin/reveal
     - `useNeonAnimation()` -- intro/outro neon
     - `useMarqueeAnimation()` -- marquee hover

2. **Naprawic `<html lang="en">` na `<html lang="pl">`** -- `app/layout.tsx` linia 67

3. **Naprawic formularz kontaktowy** -- dodac `await`, loading state, success/error UI

### WAZNE (sprint 2)

4. **Usunac nieuzywane paczki:**
   - `@react-three/fiber`, `@react-three/drei` (zakomentowane)
   - `keen-slider` (0 importow)
   - `@react-spring/web` (tylko backup)
   - Rozwazyc `@tsparticles/*` (1 uzycie)

5. **Przeniesc `framer-motion` i `zod` z devDependencies do dependencies**

6. **Usunac pliki `.backup` z repozytorium** -- uzyc gita

7. **Usunac stub pages** (`/blog`, `/firma`) lub dodac `notFound()`

8. **Zstandaryzowac biblioteke ikon** na lucide-react

### POPRAWKI (sprint 3)

9. **Dodac `app/not-found.tsx`, `app/error.tsx`, `app/robots.ts`, `app/sitemap.ts`**

10. **Zamienic `<a href>` na `<Link>` w nawigacji Navbar** (linia 79)

11. **Usunac `"use client"` z Footer.tsx** -- nie potrzebuje client-side JS

12. **Wlaczyc optymalizacje obrazow** -- usunac `images: { unoptimized: true }`

13. **Zredukowac breakpointy Tailwind** z 14 do 5-6

14. **Pogrupowac komponenty** w podkatalogi wedlug funkcji

---

## 10. ZALEZNOSCI -- Pelna analiza

### Uzywane i potrzebne
- `next`, `react`, `react-dom` -- framework
- `gsap`, `lenis` -- glowny system animacji
- `tailwindcss`, `tailwind-merge`, `class-variance-authority`, `clsx` -- styling
- `@vis.gl/react-google-maps`, `@googlemaps/markerclusterer` -- mapa murali
- `react-hook-form`, `@hookform/resolvers` -- formularz
- `resend` -- email
- `lucide-react` -- ikony
- `react-photo-album`, `yet-another-react-lightbox` -- galeria portfolio
- `embla-carousel-react` -- carousel (Testimonials)
- `@radix-ui/*` -- komponenty UI bazowe
- `sharp` -- optymalizacja obrazow (wylaczona!)

### Uzywane ale do konsolidacji
- `framer-motion` (3.2 MB) -- 21 plikow, ale mozna zastapic GSAP
- `@fortawesome/*` (3 paczki) -- 3 ikony social media, zastapic lucide
- `react-icons` -- 3 pliki, zastapic lucide
- `@tabler/icons-react` -- 5 plikow (AceternityUI), zastapic lucide
- `three` (28 MB) -- uzywany w PanoramaScroll (surowy THREE, nie React wrapper)

### Do usuniecia
- `@react-three/fiber` -- zakomentowany ThreeCanvas
- `@react-three/drei` -- j.w.
- `@react-spring/web` -- tylko .backup
- `keen-slider` -- 0 importow
- `react-masonry-css` -- 1 import (Portfolio.tsx moze byc martwy)

### Szacunkowy wplyw na bundle
Usuniecie `@react-three/*`, `keen-slider`, `@react-spring/web` oszczedzi ~7 MB w node_modules i ~100-200 KB w client bundle (po tree-shaking i chunk split).

---

## APPENDIX: Mapa importow strony glownej

```
app/page.tsx ("use client")
  |-- GlitchedVideoHero     (hero/GlitchedVideoHero.tsx)
  |-- Portfolio              (Portfolio.tsx) -- zakomentowany!
  |-- PortfolioCard          (PortfolioCard.tsx) x4
  |-- TrustedBy              (TrustedBy.tsx)
  |-- HowItWorks             (HowItWorks.tsx) -- nie w JSX!
  |-- WhoAmI2                (WhoAmI2.tsx) -- nie w JSX!
  |-- Services               (Services.tsx) -- nie w JSX!
  |-- MuralsMap               (MuralsMap.tsx)
  |-- Intro                  (Intro.tsx)
  |-- Outro                  (Outro.tsx)
  |-- AboutMe                (AboutMe.tsx)
  |-- Cards                  (Cards.tsx) x4
  |-- PanoramaScroll         (PanoramaScroll.tsx) -- ciezki (THREE.js)
  |-- LazyYouTubeGrid        (LazyComponents.tsx -> YoutubeVideosGrid.tsx)
  |-- LazyTestimonials       (LazyComponents.tsx -> Testimonials.tsx)
  |-- gsap, ScrollTrigger, SplitText
  |-- lenis
  |-- photos (lib/photos.tsx)
  |-- animations (lib/animations.ts)
  |-- marquee (lib/marquee.js)
```

**UWAGA:** `HowItWorks`, `WhoAmI2`, `Services` sa importowane (linie 8-10) ale NIE SA UZYTE w JSX. To martwe importy ktore bundler moze (lub nie) wyeliminowac.
