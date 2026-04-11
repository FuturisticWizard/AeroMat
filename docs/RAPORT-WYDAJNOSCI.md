# RAPORT AUDYTU WYDAJNOSCI -- AeroMat

**Data:** 2026-04-06
**Audytor:** Performance Engineering Agent
**Wersja:** Next.js 16.0.10 / React 19.2 / Tailwind 3.4.17
**Srodowisko:** Portfolio artysty muralisty -- strona z ciezkimi animacjami i mediami

---

## PODSUMOWANIE WYKONAWCZE

| Obszar | Ocena (1-5) | Status |
|--------|:-----------:|--------|
| Rozmiar bundle | 2/5 | KRYTYCZNY |
| Poczatkowe ladowanie | 2/5 | KRYTYCZNY |
| Wydajnosc runtime | 3/5 | WYMAGA PRACY |
| Optymalizacja mediow | 1/5 | KRYTYCZNY |
| Wydajnosc animacji | 3/5 | WYMAGA PRACY |
| Zarzadzanie pamiecia | 3/5 | DOPUSZCZALNY |
| Fonty i CSS | 3/5 | WYMAGA PRACY |

**Srednia ocena: 2.4/5 -- strona ma powazne problemy wydajnosciowe.**

---

## 1. ROZMIAR BUNDLE -- OCENA 2/5

### 1.1 Problem: 4 biblioteki animacji + 4 biblioteki ikon

Aktualnie w projekcie zainstalowano:

| Biblioteka animacji | Szacowany rozmiar (gzip) | Gdzie uzywana |
|---------------------|------------------------:|---------------|
| GSAP + ScrollTrigger + SplitText | ~45 KB | page.tsx, PanoramaScroll, Cards, GlitchedVideoHero, Images, animations.ts, marquee.js |
| Framer Motion | ~35 KB | Images.tsx, YoutubeVideosGrid, Testimonials, AppleCards, Navbar, sparkles, VideoHero + 15 innych plikow |
| React Spring + use-gesture | ~25 KB | AppleCards.tsx (TYLKO 1 komponent!) |
| Lenis (smooth scroll) | ~8 KB | page.tsx (TYLKO desktop!) |
| **SUMA** | **~113 KB** | |

| Biblioteka ikon | Szacowany rozmiar (pelny) | Pliki uzywajace |
|-----------------|---------------------------:|-----------------|
| Lucide React | ~5 KB (tree-shaken) | 9 plikow |
| @tabler/icons-react | ~25 KB (tree-shaken) | 5 plikow (AppleCards + UI) |
| react-icons | ~? KB | 3 pliki (CardFlip, InNumbers, Flipcard) |
| FontAwesome | ~15 KB | Footer, Navbar |
| **4 BIBLIOTEKI IKON** | **~45+ KB** | |

**Werdykt:** React Spring i @use-gesture sa uzywane TYLKO w AppleCards.tsx (komponent carousel). To 25 KB za jeden komponent. react-icons jest uzywane w 3 plikach. Tabler Icons w 5. Fontawesome w 2-3. Lucide w 9. To 4 oddzielne systemy ikon.

### 1.2 Problem: Three.js w bundle glownym

```
PanoramaScroll.tsx: import * as THREE from "three"
ThreeCanvas.tsx: import { Canvas } from '@react-three/fiber' + import { OrbitControls } from '@react-three/drei'
```

- `PanoramaScroll` importuje Three.js BEZPOSREDNIO (nie lazy) i jest renderowany w `page.tsx` bez lazy loadingu
- `ThreeCanvas` jest lazy-loaded ale zakomentowany w page.tsx (`{/* <LazyThreeCanvasWithIntersection /> */}`)
- Three.js + R3F + drei = **~150-200 KB gzipped** w bundle

**KRYTYCZNE:** PanoramaScroll importuje `import * as THREE from "three"` -- cale Three.js wchodzi do bundle glownej strony mimo ze uzywane sa tylko: WebGLRenderer, Scene, OrthographicCamera, PlaneGeometry, MeshBasicMaterial, TextureLoader, LinearFilter. To ~6 klas z ogromnej biblioteki.

### 1.3 Problem: Nieuzywane zaleznosci

| Pakiet | Status | Uzywany w |
|--------|--------|-----------|
| `keen-slider` | **NIEUZYWANY** -- brak importow | Nigdzie |
| `react-player` | Uzywany w VideoPlayer | Tak, ale lazy-loaded |
| `@react-three/fiber` + `@react-three/drei` | Zakomentowane w page.tsx | ThreeCanvas.tsx (martwy kod) |
| `react-masonry-css` | Prawdopodobnie portfolio | Wymaga weryfikacji |
| `react-photo-album` | Prawdopodobnie portfolio | Wymaga weryfikacji |
| `yet-another-react-lightbox` | Portfolio lightbox | Wymaga weryfikacji |

### 1.4 Szacowany calkowity JS (klient)

| Kategoria | Szacowany rozmiar (gzip) |
|-----------|-------------------------:|
| Next.js + React 19 runtime | ~90 KB |
| GSAP + plugins | ~45 KB |
| Framer Motion | ~35 KB |
| Three.js (przez PanoramaScroll) | ~80 KB |
| React Spring + use-gesture | ~25 KB |
| tsparticles (sparkles) | ~30 KB |
| Google Maps API + clusterer | ~60 KB (zewnetrzny) |
| Embla Carousel | ~8 KB |
| Lenis | ~8 KB |
| Ikony (4 biblioteki) | ~45 KB |
| Komponenty aplikacji | ~40 KB |
| **SUMA SZACUNKOWA** | **~466 KB gzip** |

**Target dla portfolio site: <200 KB gzip.** Aktualnie ponad 2x za duzo.

### REKOMENDACJE -- ROZMIAR BUNDLE

| # | Akcja | Wplyw | Trudnosc |
|---|-------|-------|----------|
| B1 | Usun `keen-slider` z package.json | -5 KB | Niski |
| B2 | Usun `@react-three/fiber`, `@react-three/drei`, `@types/three` -- ThreeCanvas jest zakomentowany | -150 KB potencjalny | Niski |
| B3 | Zamien React Spring + use-gesture na GSAP (juz w projekcie) w AppleCards.tsx | -25 KB | Sredni |
| B4 | Skonsoliduj ikony do jednej biblioteki (Lucide -- juz najszerzej uzywana) | -30 KB | Sredni |
| B5 | Lazy-loaduj PanoramaScroll przez `dynamic()` zamiast bezposredniego importu | -80 KB z critical path | Wysoki wplyw, latwe |
| B6 | Usun `react-icons` -- zamien 3 uzycia na Lucide | -10 KB | Niski |
| B7 | Usun `@tabler/icons-react` -- zamien 5 uzyc na Lucide | -20 KB | Niski |
| B8 | Uruchom `ANALYZE=true npm run build` i zweryfikuj rzeczywiste rozmiary | Diagnostyka | Niski |

---

## 2. POCZATKOWE LADOWANIE -- OCENA 2/5

### 2.1 Problem: Cala strona to "use client"

```tsx
// app/page.tsx - linia 1
"use client";
```

**KRYTYCZNE:** Caly `page.tsx` (758 linii) to komponent kliencki. To oznacza:
- Zero SSR / SSG -- cala strona renderuje sie TYLKO na kliencie
- Brak pre-renderingu HTML -- uzytkownik widzi puste DIV do momentu zaladowania JS
- LCP zalezy calkowicie od zaladowania i wykonania JavaScript
- Google crawler widzi pusta strone (lub musi czekac na JS)

### 2.2 Problem: Zbyt wiele komponentow ladowanych eagerly

Komponenty ladowane NATYCHMIAST przy starcie (non-lazy w page.tsx):

| Komponent | Zawartosc | Wplyw |
|-----------|-----------|-------|
| `GlitchedVideoHero` | Video MP4 (7.3 MB) + GSAP + pomiar fontow + glitch animation | CIEZKI |
| `Intro` | Tekst neonowy | Lekki |
| `Cards` (x4 instancje) | 4x Image + ScrollTrigger setup | SREDNI |
| `PortfolioCard` (x4 instancje) | 4 zestawy po 7-11 obrazow = ~36 obrazow | CIEZKI |
| `PanoramaScroll` | THREE.js WebGL renderer + tekstura 627 KB | CIEZKI |
| `Outro` | Tekst | Lekki |
| `AboutMe` | Zawartosc profilu | Sredni |
| `TrustedBy` | Logo klientow | Lekki |
| `MuralsMap` | Google Maps (lazy via LazyComponents) | OK (lazy) |

**Lazy-loaded (poprawnie):**
- `LazyYouTubeGridWithIntersection` -- IntersectionObserver + dynamic
- `LazyTestimonialsWithIntersection` -- IntersectionObserver + dynamic

**Problem:** PanoramaScroll, Cards (x4), PortfolioCard (x4) -- to OGROMNA ilosc zasobow ladowanych od razu.

### 2.3 Problem: useEffect gigant w page.tsx

`page.tsx` zawiera POJEDYNCZY useEffect (linie 33-687) -- **654 linie kodu** wykonywane na mount:
- Rejestracja GSAP plugins
- Inicjalizacja Lenis (smooth scroll)
- Setup scrollerProxy
- SplitText na wszystkich tytulach
- Tworzenie ~20+ ScrollTrigger instancji
- Marquee animation
- Neon intro/outro animations
- Event listenery

To blokuje interaktywnosc na kilkaset milisekund po mount.

### 2.4 Problem: Hero video -- 7.3 MB MP4

```html
<source src="/movies/hero_compressed.mp4" type="video/mp4" />
```

- `hero_compressed.mp4` = 7.3 MB
- `hero_compressed.webm` = 10.9 MB (wiekszy niz MP4!)
- `preload="auto"` w GlitchedVideoHero -- pobiera CALY plik od razu
- Brak adaptive bitrate
- Brak mniejszej wersji na mobile

Inne wersje sa dostepne ale NIEUZYWANE:
- `hero_mini.mp4` = 3.4 MB
- `hero_mini.webm` = 2.9 MB
- `hero_medium.webm` = 4.2 MB

### 2.5 Problem: 4 fonty Google

```tsx
const inter = Inter({ subsets: ["latin", "latin-ext"] });
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin", "latin-ext"] });
const anton = Anton({ weight: "400", subsets: ["latin", "latin-ext"] });
const caveat = Caveat({ weight: ["400", "700"], subsets: ["latin", "latin-ext"] });
```

- 4 fonty x 2 subsety = 8 plikow fontow
- `latin-ext` jest potrzebny (polskie znaki) -- OK
- Ale Caveat jest uzywany NIGDZIE w widocznym kodzie (moze w CSS?)
- Kazdy font to dodatkowe ~15-30 KB

### REKOMENDACJE -- POCZATKOWE LADOWANIE

| # | Akcja | Wplyw | Trudnosc |
|---|-------|-------|----------|
| L1 | **Rozdziel page.tsx na server + client czesci** -- wyodrebnij animacje do oddzielnego komponentu klienta | LCP -50% | Wysoki |
| L2 | **Uzyj `hero_mini.mp4` na mobile** -- media query `(max-width: 768px)` | -4 MB na mobile | Niski |
| L3 | Zmien `preload="auto"` na `preload="metadata"` w GlitchedVideoHero | Szybszy start | Niski |
| L4 | **Lazy-loaduj PanoramaScroll** przez LazyComponents + IntersectionObserver | -80 KB + -627 KB tekstury | Sredni |
| L5 | **Lazy-loaduj PortfolioCard** -- sa ponizej fold | Mniej obrazow na starcie | Sredni |
| L6 | Zweryfikuj czy font Caveat jest uzywany -- jesli nie, usun | -20 KB | Niski |
| L7 | Rozbij gigantyczny useEffect na mniejsze, zainicjalizowane po `requestIdleCallback` | Lepsza interaktywnosc | Sredni |

---

## 3. OPTYMALIZACJA MEDIOW -- OCENA 1/5

### 3.1 KRYTYCZNE: `images.unoptimized: true`

```js
// next.config.js
images: {
    unoptimized: true,
},
```

**To jest NAJWAZNIEJSZY problem wydajnosciowy calej strony.**

Co robi ta flaga:
- **WYLACZA** Next.js Image Optimization -- zadne automatyczne resizing
- **WYLACZA** automatyczne tworzenie srcset (responsive images)
- **WYLACZA** lazy loading przez Next.js (pozostaje natywne)
- `quality={85}` w komponentach Images.tsx jest **IGNOROWANE**
- `placeholder="blur"` z inline blurDataURL DZIALA, ale bez resizingu
- Przegladarka pobiera PELNOROZMIAROWE obrazy

Komentarz w kodzie mowi: "source images already converted to WebP, skip re-encoding"

**To jest BLEDNE rozumowanie.** Nawet jesli obrazy sa w WebP:
- `murale/4.webp` = 2.88 MB, wymiary 7196x1500 -- na ekranie 1920px to 4x wiecej pikseli niz potrzeba
- `murale/7A.webp` = 2.2 MB, wymiary 5358x3000
- `wnetrza/P1371890.webp` = 2.5 MB, wymiary 5776x4214
- Sredni obraz portfolio: ~800 KB -- 100+ takich obrazow

**Na jednym przescrolowaniu strony uzytkownik pobiera ~30-50 MB obrazow.**

### 3.2 Problem: Obrazy portfolio -- za duze wymiary zrodlowe

Analiza 20 najwiekszych obrazow:

| Plik | Rozmiar | Wymiary | Potrzebne (max) |
|------|--------:|---------|-----------------|
| murale/4.webp | 2880 KB | 7196x1500 | ~2000x416 |
| wnetrza/P1371890.webp | 2496 KB | 5776x4214 | ~800x584 |
| murale/7A.webp | 2200 KB | 5358x3000 | ~1200x672 |
| Brending/grafika 6a.webp | 2024 KB | 5019x2902 | ~800x462 |
| wnetrza/ww3.webp | 1904 KB | 3215x2000 | ~800x498 |

**Werdykt:** Obrazy zrodlowe sa 3-5x wieksze niz potrzebne. Nawet w WebP, to ogromne marnotrawstwo przepustowosci.

### 3.3 Problem: Video hero bez adaptacji

| Plik | Rozmiar | Status |
|------|--------:|--------|
| hero_compressed.mp4 | 7.3 MB | UZYWANY (desktop + mobile) |
| hero_compressed.webm | 10.9 MB | UZYWANY (fallback) |
| hero_mini.mp4 | 3.4 MB | NIEUZYWANY |
| hero_mini.webm | 2.9 MB | NIEUZYWANY |
| hero_medium.webm | 4.2 MB | NIEUZYWANY |
| reel_output.mp4 | 15.6 MB | Dostepny publicznie |

Mniejsze wersje istnieja ale nie sa uzywane -- brak `<source media="...">`.

### 3.4 Problem: Panorama tekstura

`komeko-new.webp` = 627 KB -- ladowana przez Three.js TextureLoader. To jest OK w porownaniu do reszty, ale:
- Ladowana EAGERLY (nie lazy)
- Dekompresja do pelnej tekstury GPU (duze zuzycie VRAM)

### REKOMENDACJE -- MEDIA

| # | Akcja | Wplyw | Trudnosc |
|---|-------|-------|----------|
| M1 | **USUN `unoptimized: true`** z next.config.js | -70% transferu obrazow | NISKI (1 linia!) |
| M2 | Dodaj `sizes` attribute do wszystkich Image (juz czesciowo jest) | Poprawne srcset | Niski |
| M3 | Przeskaluj obrazy portfolio do max 2400px szerokosc | -50% rozmiaru plikow | Sredni |
| M4 | Dodaj responsive video: `<source media="(max-width:768px)" src="hero_mini.mp4">` | -4 MB mobile | Niski |
| M5 | Zmien preload na `metadata` dla video hero | Szybszy start | Niski |
| M6 | Usun `reel_output.mp4` (15.6 MB) z publicznego dostępu jesli nie jest linkowany | -15.6 MB | Niski |
| M7 | Rozważ CDN (Cloudflare Images, Imgix) dla dynamicznego resizingu | Optymalny transfer | Wysoki |

---

## 4. WYDAJNOSC RUNTIME -- OCENA 3/5

### 4.1 Scroll performance

**Pozytywne:**
- Lenis smooth scroll TYLKO na desktop (wylaczony na mobile -- dobra decyzja)
- ScrollTrigger z `matchMedia` -- responsive breakpoints
- IntersectionObserver dla portfolio items (zamiast ScrollTrigger) -- unika konfliktow
- Marquee hover throttled z `requestAnimationFrame`

**Negatywne:**
- ~20+ ScrollTrigger instancji aktywnych jednoczesnie
- Kazdy scroll event przechodzi przez Lenis -> ScrollTrigger.update() -> ~20 callback'ow
- `gsap.set()` w `onUpdate` callbackach (np. linie 164-189, 415-419) -- wymusza layout recalc
- PanoramaScroll: Three.js render loop (`requestAnimationFrame`) dziala nawet gdy niewidoczny... ale jest IntersectionObserver ktory to kontroluje -- OK

### 4.2 tsparticles (sparkles.tsx)

```tsx
fpsLimit: 120,
```

- System czasteczkowy z fpsLimit 120 -- na slabszych urzadzeniach to za duzo
- `onClick: enable: true, mode: "push"` -- dodaje nowe czasteczki przy kazdym kliknieciu
- `particleDensity: 120` domyslnie -- 120 czasteczek na 400x400 obszar
- Canvas rendering w petli -- ciagly koszt GPU

**Pytanie:** Czy sparkles sa uzywane na glownej stronie? Jesli nie, to OK (lazy loaded). Jesli tak -- problem.

### 4.3 Memory management

**PerformanceMonitor.tsx** -- monitoruje Web Vitals (FCP, LCP, FID, CLS, TTFB) i loguje do konsoli w dev. W produkcji wysyla do gtag. To jest OK ale:
- `setInterval(monitorMemory, 30000)` w dev -- co 30s sprawdza pamiec (niepotrzebne w produkcji, jest guard)
- Brak `useMemoryOptimization.ts` -- hook nie istnieje w projekcie (mimo ze byl wymieniony w audit tasks)

**Cleanup w page.tsx** -- DOBRZE:
- `mm.revert()` -- czysci matchMedia
- `lenis.destroy()` -- czysci smooth scroll
- `ScrollTrigger.defaults({ scroller: window })` -- resetuje proxy
- Usuwa event listenery
- `cancelAnimationFrame(marqueeRafId)`

**PanoramaScroll cleanup** -- DOBRZE:
- Dispose geometry, material, texture
- Renderer dispose
- Observer disconnect
- ScrollTrigger kill

### REKOMENDACJE -- RUNTIME

| # | Akcja | Wplyw | Trudnosc |
|---|-------|-------|----------|
| R1 | Zmniejsz fpsLimit sparkles do 30-60 | Mniejsze zuzycie CPU/GPU | Niski |
| R2 | Uzyj `will-change: transform` na animowanych elementach (czesciowo jest) | Mniej reflow | Niski |
| R3 | Zmien `gsap.set()` w onUpdate na `gsap.quickSetter()` | ~30% szybsze | Sredni |
| R4 | Debounce ScrollTrigger.refresh() na resize (czesciowo jest) | Mniej recalc | Niski |

---

## 5. WYDAJNOSC ANIMACJI -- OCENA 3/5

### 5.1 Architektura animacji -- analiza

| Warstwa | Uzycie | Uzasadnienie |
|---------|--------|-------------|
| GSAP + ScrollTrigger | Core scroll animations, pin, text reveal | UZASADNIONE -- to glowny silnik strony |
| GSAP SplitText | Animacja tekstu char-by-char | UZASADNIONE -- uzywane z GSAP |
| Framer Motion | Images.tsx whileInView, modals, UI transitions | CZESCIOWO UZASADNIONE |
| React Spring | AppleCards drag | NIEUZASADNIONE -- GSAP to umie |
| Lenis | Smooth scroll desktop | UZASADNIONE -- dopelnia ScrollTrigger |

**Werdykt:**
- GSAP jest silnikiem glownym i powinien pozostac
- Lenis jest uzasadniony (smooth scroll + ScrollTrigger proxy)
- Framer Motion -- uzywany w 21 plikach, glownie do `whileInView`, `AnimatePresence`, `motion.div`. Czesc z tych uzyc mozna zastapic GSAP, ale pelna migracja bylaby duza. **Mozna zyc z dwoma bibliotekami (GSAP + FM).**
- React Spring -- uzywany TYLKO w AppleCards.tsx i powinien byc usuniety

### 5.2 GlitchedVideoHero -- wydajnosc

**Pozytywne:**
- Font measurement z reusable measurer element (singleton pattern)
- Layout calculation z debounce na resize
- Intro animation GSAP timeline -- raz odpalona, nie w petli
- Glitch wave z `setInterval(tick, 800)` -- lekki efekt

**Negatywne:**
- `setTimeout(calc, 100)` na starcie -- magiczny delay
- 30 iteracji binary search do font fitting (`fitFont`) -- kosztowne ale jednorazowe
- `preload="auto"` na video -- pobiera caly plik od razu

### 5.3 Intro/Outro neon animation

Animacja jest zlozona (wiele keyframe'ow dla efektu "migajacego neonu") ale jest:
- Timeline-based (jednorazowe odpalenie)
- `once: true` na ScrollTrigger -- nie powtarza sie
- Nie uzywa petli render

**Ocena: OK** -- dobrze napisana animacja jednorazowa.

### 5.4 Card pin system

Desktop: karty sa "pinned" i "stacked" -- kazda karta ma swoj pin ScrollTrigger. To generuje ~8-12 pinow aktywnych jednoczesnie. GSAP radzi sobie z tym dobrze, ale kazdy pin tworzy wrapper DIV z `position: fixed`.

Mobile: analogicznie, z drobna roznica w endTrigger.

**Potencjalny problem:** Duzo pinned elementow = duzo `position: fixed` = potencjalne jank na slabszych GPU (repaint calego viewport przy scroll).

### REKOMENDACJE -- ANIMACJE

| # | Akcja | Wplyw | Trudnosc |
|---|-------|-------|----------|
| A1 | **Usun React Spring** -- zamien drag w AppleCards na GSAP Draggable lub natywny scroll-snap | -25 KB, 1 biblioteka mniej | Sredni |
| A2 | Rozważ zamiane prostych `motion.div whileInView` na CSS `@starting-style` lub GSAP | Mniej FM kodu | Duzy (21 plikow) |
| A3 | Dodaj `contain: layout style paint` do pinowanych kart | Mniej repaint | Niski |
| A4 | Uzyj `gsap.quickSetter()` w scroll-update callbackach | Szybsze set | Sredni |

---

## 6. CSS I FONTY -- OCENA 3/5

### 6.1 globals.css -- 1331 linii

Plik CSS jest bardzo duzy. Zawartosc:
- Tailwind base/components/utilities (~3 linie)
- Utilities layer: blur/gpu/call-button (~57 linii)
- Font classes: yesteryear, allura, anton (~30 linii)
- Gradients, shapes (~20 linii)
- Card system: .card, .card-wrapper, .card-img, .card-dim, .card-content, .card-marquee (~200 linii)
- Panorama system: .panorama-card, .panorama-canvas, .panorama-filter, .panorama-caption (~100 linii)
- Mobile overrides: @media max-width 768px (~150 linii)
- Intro/outro styles, neon glow (~50 linii)
- CSS variables (light + dark): ~150 zmiennych kolorow (~90 linii)
- Portfolio grid variants: grid-small-container, grid-small-7, grid-small-7sq (~200 linii)
- Animacje: scroll, flip-card, gradient (~50 linii)
- Reszta: misc styles (~100 linii)

**Problem:** Wiele klas CSS jest prawdopodobnie nieuzywanych (`.yesteryear-regular`, `.allura`, `.bentogrid-body`, `.box`). CSS custom variables definiuja ~60 kolorow z ktorych wiekszosc nie jest uzywana na stronie glownej.

### 6.2 Tailwind safelist -- 60 klas

```ts
safelist: [
    "bg-green-light", "bg-cyan-light", // ... ~45 klas kolorow
    "w-[620px]", "h-[620px]", // ... arbitrarne rozmiary
    "blur-sm", "blur-0", "backdrop-blur-lg",
]
```

- 45 klas kolorow w safelist -- wymusza ich generowanie nawet jesli nie sa uzywane w HTML
- Wiele z nich (bg-green-light, bg-cyan-medium, itd.) jest uzywanych jako dynamiczne klasy w Services.tsx -- ale ten komponent uzywa JSX content, wiec Tailwind nie widzi tych klas w scan
- **Optymalnie:** zamien dynamiczne klasy na `style={{ backgroundColor: ... }}` i usun safelist

### 6.3 Fonty -- 4 rodziny

| Font | Wagi | Gdzie uzywany | Potrzebny? |
|------|------|---------------|------------|
| Inter | default (400) | Caly body, opisy | TAK |
| Bebas Neue | 400 | Tytuly kart, panorama | TAK |
| Anton | 400 | GlitchedVideoHero, fancy-text | TAK |
| Caveat | 400, 700 | **NIEJASNE** -- brak widocznego uzycia | DO WERYFIKACJI |

- Fonty sa ladowane przez `next/font/google` -- to dobrze (self-hosted, preload)
- Ale 4 fonty * 2 subsety = 8 fontow do pobrania
- Kazdy font ~15-25 KB -> **~80-120 KB fontow**

### REKOMENDACJE -- CSS/FONTY

| # | Akcja | Wplyw | Trudnosc |
|---|-------|-------|----------|
| C1 | Zweryfikuj i usun font Caveat jesli nieuzywany | -25 KB | Niski |
| C2 | Wyczysc nieuzywane klasy CSS (.yesteryear, .allura, .bentogrid-body, .box) | Czystszy kod | Niski |
| C3 | Zmniejsz safelist -- zamien dynamiczne bg-klasy na inline styles | Mniejszy CSS output | Sredni |
| C4 | Rozważ podzielenie globals.css na mniejsze pliki (cards.css, panorama.css) | Lepsza organizacja | Sredni |

---

## 7. YOUTUBE EMBEDS -- OCENA 4/5

### 7.1 Analiza YoutubeVideosGrid.tsx

**Dobrze zrobione:**
- Uzywane sa **thumbnails** (`img.youtube.com/vi/{id}/hqdefault.jpg`) zamiast iframe -- brak ladowania YouTube JS do momentu klikniecia
- Desktop: klikniecie otwiera modal z iframe (`youtube-nocookie.com`) -- prywatnosc
- Mobile: klikniecie zamienia thumbnail na inline iframe
- Lazy-loaded przez `LazyYouTubeGridWithIntersection` + IntersectionObserver

**Mozna poprawic:**
- Brak `loading="lazy"` na thumbnailach (sa `<img>` nie `<Image>`)
- Uzywany format thumbnails: `hqdefault.jpg` (~15-20 KB kazdy) -- mozna uzyc `mqdefault.jpg` (~5 KB) na mobile
- Brak `srcdoc` pattern (lite-youtube) -- ale obecne rozwiazanie jest prawie rownie dobre

### REKOMENDACJE -- YOUTUBE

| # | Akcja | Wplyw | Trudnosc |
|---|-------|-------|----------|
| Y1 | Dodaj `loading="lazy"` do thumbnail `<img>` | Mniej wczesnych pobran | Niski |
| Y2 | Uzywaj `mqdefault.jpg` na mobile zamiast `hqdefault.jpg` | -10 KB/thumbnail | Niski |
| Y3 | Zamien `<img>` na Next.js `<Image>` z responsywnymi rozmiarami | Automatyczny resize | Sredni |

---

## 8. GOOGLE MAPS -- OCENA 4/5

### 8.1 Analiza

**Dobrze:**
- Lazy-loaded przez `LazyMuralsMapWithIntersection` + IntersectionObserver (rootMargin 200px)
- `ssr: false` w dynamic import -- nie blokuje server render
- `memo()` na PoiMarkers i GoogleMapInner
- `useCallback` na handlery
- Error boundary na mapie
- Custom dark mode styles

**Problemy:**
- Klikniecie markera otwiera YouTube iframe bezposrednio (nie lazy, nie thumbnail) -- kazde klikniecie laduje pelny YouTube player
- `onCameraChanged` callback jest pusty: `(ev: MapCameraChangedEvent) => {}` -- zbedny prop

### REKOMENDACJE -- MAPS

| # | Akcja | Wplyw | Trudnosc |
|---|-------|-------|----------|
| G1 | Usun pusty `onCameraChanged` callback | Czystszy kod | Niski |
| G2 | Laduj YouTube w markerze przez thumbnail + click-to-load (jak YouTubeGrid) | Mniej JS | Sredni |

---

## 9. INNE PROBLEMY

### 9.1 console.log w produkcji

`page.tsx` zawiera ~30 `console.log()` wywolan:
```tsx
console.log("Plugins registered");
console.log("[Viewport] isMobile:", isMobile);
console.log("[Lenis] init, start scroll:", currentScroll);
// ... itd
```

Konfiguracja `removeConsole` w next.config.js:
```js
removeConsole: process.env.NODE_ENV === "production"
    ? { exclude: ["error", "warn"] }
    : false,
```

To powinno usuwac console.log z production build -- **OK, ale wymaga weryfikacji**.

### 9.2 Services.tsx -- komentarze

Services.tsx zawiera ~120 linii zakomentowanego kodu (stare warianty kart). To nie wplywa na bundle (zostanie usuniete) ale zasmuca plik.

### 9.3 PerformanceMonitor -- koszt w produkcji

PerformanceMonitor renderuje `null` ale:
- Tworzy PerformanceObserver (LCP, FID, CLS)
- `setTimeout(reportMetrics, 5000)` -- raportuje po 5s
- W produkcji wysyla do `window.gtag` -- OK jesli GA jest zainstalowane

**Problem:** Komponent jest ZAWSZE renderowany (w layout.tsx). Jesli GA nie jest zainstalowane, to raportowanie jest bezcelowe. Rozważ warunkowe ladowanie.

---

## 10. PRIORYTETY -- TOP 10 ZMIAN WEDLUG WPLYWU

| Priorytet | Akcja | Szacowane oszczednosci | Trudnosc |
|:---------:|-------|----------------------:|----------|
| **1** | **USUN `images.unoptimized: true`** | -70% transferu obrazow (~30 MB/visit) | 1 linia kodu |
| **2** | **Lazy-loaduj PanoramaScroll** przez dynamic() | -80 KB JS + -627 KB eager texture | 10 min pracy |
| **3** | **Responsive video hero** (mini na mobile) | -4 MB na mobile | 15 min pracy |
| **4** | **Usun React Spring + use-gesture** (zamien na GSAP w AppleCards) | -25 KB JS | 2-3h pracy |
| **5** | **Usun @react-three/fiber, drei** (martwy kod) | -150 KB potencjalny leak | 5 min pracy |
| **6** | **Skonsoliduj ikony do Lucide** (usun tabler, react-icons, FA) | -30 KB JS | 3-4h pracy |
| **7** | Usun keen-slider z dependencies | Czystszy package.json | 1 min |
| **8** | Zmien video preload na "metadata" | Szybszy start | 1 linia |
| **9** | Usun/zweryfikuj font Caveat | -25 KB | 10 min |
| **10** | Przeskaluj top-20 obrazow do max 2400px szer. | -10 MB | 1h (skrypt) |

---

## 11. ESTYMOWANE WYNIKI PO OPTYMALIZACJI

| Metryka | Przed (szac.) | Po (szac.) | Zmiana |
|---------|:-------------:|:----------:|:------:|
| JS bundle (gzip) | ~466 KB | ~250 KB | -46% |
| Obrazy na visit | ~30-50 MB | ~8-15 MB | -70% |
| LCP (mobile) | >5s | <3s | -40% |
| Video hero (mobile) | 7.3 MB | 3.4 MB | -53% |
| Fonty | ~100 KB | ~75 KB | -25% |
| Lighthouse score | ~45-55 | ~75-85 | +30 pkt |

---

## 12. NASTEPNE KROKI

1. Uruchom `ANALYZE=true npm run build` i daj mi wyniki -- pozwoli zmierzyc faktyczne rozmiary bundle
2. Uruchom Lighthouse na produkcji i zrob screenshot -- baseline
3. Zaimplementuj priorytety 1-3 (1 linia + 2 male zmiany) -- natychmiastowy wplyw
4. Przetestuj po zmianach -- Lighthouse porownanie
5. Nastepna iteracja: priorytety 4-7

---

*Raport wygenerowany przez Performance Engineering Agent, 2026-04-06.*
*Bazuje na statycznej analizie kodu -- wyniki mogą się różnić od rzeczywistych pomiarów.*
