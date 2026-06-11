# Audyt wydajności — AeroMat
Data: 2026-05-15
Audytor: zespół agentów Claude Code

## Executive summary

Stack: Next.js 16.0.10 (App Router, Turbopack), React 19, TypeScript, Tailwind 3.4, GSAP/SplitText, Three.js, Lenis, Framer Motion, react-photo-album, yet-another-react-lightbox, @vis.gl/react-google-maps, react-player.

Ogólny stan: infrastruktura optymalizacji jest częściowo bardzo dobra — Google Maps, react-player, PortfolioLightbox i Testimonials są poprawnie opakowane w `dynamic()` z IntersectionObserver. Krytyczny problem to **Three.js (~600 KB) lądujący w initial bundle strony głównej** przez jeden brakujący `dynamic()`. Dwa kolejne miejsca powielają ten wzorzec przy istniejących już lazy wrapperach.

### Top 5 quick wins
1. `PanoramaScroll` → `dynamic(ssr:false)` — Three.js ~600 KB znika z initial bundle
2. `/filmy/page.tsx` → użyć istniejącego `LazyYouTubeGridWithIntersection`
3. `PerformanceMonitor` → guard produkcyjny — eliminuje 3 niepotrzebne `PerformanceObserver` na każdej stronie
4. `/portfolio/page.tsx` → lazy-load `react-photo-album` + lightbox plugins (~180 KB)
5. Konwersja 4 nowych JPG w `public/images/` do webp (~30–60% mniejszy transfer)

---

## Krytyczne (największy wpływ na Core Web Vitals)

### [PERF-001] Three.js w initial bundle strony głównej

- **Lokalizacja:** `app/components/PanoramaScroll.tsx:4–7`, `app/page.tsx:11`
- **Problem:** `PanoramaScroll` zawiera `import * as THREE from "three"` jako statyczny top-level import i jest bezpośrednio (bez `dynamic()`) zaimportowany w `app/page.tsx`. Three.js waży ~600 KB minified. Mimo że splitChunks tworzy osobny chunk `three`, ten chunk jest wciągany do grafu zależności initial page load — importu nie chroni żadne code splitting boundary. Komponent inicjalizuje WebGL renderer dopiero w `useEffect`, ale JavaScript musi być pobrany i sparsowany zanim to nastąpi.
- **Wpływ na metryki:** TBT (main thread parsing 600 KB JS synchronicznie), LCP (blokuje rendering), INP
- **Rekomendacja:**

```tsx
// app/page.tsx — zastąp direct import:
// import PanoramaScroll from "./components/PanoramaScroll";

import dynamic from "next/dynamic";
const PanoramaScroll = dynamic(
  () => import("./components/PanoramaScroll"),
  { ssr: false, loading: () => <div className="panorama-section h-screen bg-[#050505]" /> }
);
```

- **Estymowany zysk:** ~600 KB mniej JS parsed na initial load. TBT potencjalnie -200–400 ms na wolniejszych urządzeniach.

---

## Wysokie

### [PERF-002] `/filmy` — statyczny import YoutubeVideosGrid mimo istniejącego lazy wrappera

- **Lokalizacja:** `app/filmy/page.tsx:1`
- **Problem:** `YoutubeVideosGrid` jest importowany statycznie. Komponent importuje `framer-motion`, `AnimatePresence`, `useMotionValue`, `animate` oraz `lucide-react/Play` eagerly. Tymczasem `LazyYouTubeGridWithIntersection` (z `LazyComponents.tsx`) już istnieje i opakowuje go prawidłowo przez `dynamic(ssr:false)` + IntersectionObserver, ale nie jest użyty.
- **Wpływ na metryki:** FCP, TBT — framer-motion (~110 KB) bundlowany do `/filmy` page chunk zamiast defer
- **Rekomendacja:**

```tsx
// app/filmy/page.tsx
import { LazyYouTubeGridWithIntersection } from "@/app/components/LazyComponents";

export default function FilmyPage() {
  return (
    <main className="min-h-screen bg-black pt-16 sm:pt-18 md:pt-20">
      <LazyYouTubeGridWithIntersection />
    </main>
  );
}
```

### [PERF-003] PerformanceMonitor — 3 PerformanceObserver aktywne w produkcji bez celu

- **Lokalizacja:** `app/components/PerformanceMonitor.tsx:38–83`, `app/layout.tsx:7,91`
- **Problem:** `PerformanceMonitor` montowany na każdej stronie. Rejestruje `lcpObserver`, `fidObserver`, `clsObserver` bezwarunkowo. `reportMetrics` jest gated przez `NODE_ENV === 'development'`. Efekt: 3 `PerformanceObserver` + `setTimeout(5000)` + `measureBundleSize` uruchamia się w produkcji bez żadnego efektu.
- **Wpływ na metryki:** INP, TBT — niepotrzebne event listener registration, minor CPU drain
- **Rekomendacja:**

```tsx
export default function PerformanceMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    // ... reszta kodu bez zmian
  }, []);
  return null;
}
```

Alternatywnie — zintegrować z `GoogleAnalytics.tsx` używając `web-vitals` library z wysyłką do GA4.

### [PERF-004] `/portfolio` — react-photo-album i lightbox plugins ładowane eagerly

- **Lokalizacja:** `app/portfolio/page.tsx:2–18`
- **Problem:** `"use client"` page importuje statycznie: `react-photo-album/rows.css`, `yet-another-react-lightbox/styles.css`, `yet-another-react-lightbox/plugins/thumbnails.css`, `Fullscreen`, `Slideshow`, `Thumbnails`, `Zoom`, `Lightbox`, `RowsPhotoAlbum`. Lightbox i 4 pluginy potrzebne tylko po kliknięciu na zdjęcie (~140 KB). Paradoksalnie `Portfolio.tsx` na stronie głównej używa `LazyLightbox = dynamic(...)`.
- **Rekomendacja:**

```tsx
import dynamic from "next/dynamic";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });
const Fullscreen = dynamic(() => import("yet-another-react-lightbox/plugins/fullscreen"), { ssr: false });
// ... analogicznie Slideshow, Thumbnails, Zoom
```

---

## Średnie

### [PERF-005] 4 nowe pliki JPG w `public/images/` bez konwersji

- **Lokalizacja:** `public/images/apis_mural.jpg`, `komeko_mural.jpg`, `audi.jpg`, `monstertruck.jpg` (wszystkie `??` w `git status`)
- **Problem:** Pliki JPG nie są przetwarzane przez `next/image` optimizer jeśli są serwowane jako statyczne zasoby. WebP daje 25–35% oszczędności, AVIF 40–50%.
- **Rekomendacja:**
```bash
for f in public/images/apis_mural.jpg public/images/komeko_mural.jpg public/images/audi.jpg public/images/monstertruck.jpg; do
  cwebp -q 82 "$f" -o "${f%.jpg}.webp"
done
```

### [PERF-006] Nadmiarowe `will-change: transform` w globals.css

- **Lokalizacja:** `app/globals.css:502, 509, 648, 750, 1222, 1269, 1309`
- **Problem:** `will-change: transform` zadeklarowane na 7 selektorach statycznie. Tworzy nowy compositing layer w GPU dla każdego dopasowanego elementu. Spec zaleca ustawiać `will-change` tuż przed animacją i usuwać po, nie statycznie.
- **Rekomendacja:** Usunąć ze statycznych klas CSS — GSAP robi to automatycznie przy `force3D: true` (domyślnie aktywne).

---

## Niskie / micro-optimizations

### [PERF-007] `globals.css` — `.gradient-new` trzykrotnie zduplikowana

- **Lokalizacja:** `app/globals.css:122–138`
- **Problem:** Identyczny `linear-gradient(360deg, ...)` zapisany 3 razy. Tylko ostatnia deklaracja ma efekt.

### [PERF-008] `globals.css` — orphaned font classes `.yesteryear-regular` i `.allura`

- **Lokalizacja:** `app/globals.css:78–88`
- **Problem:** Klasy odwołują się do fontów `Yesteryear` i `Allura` które nie są nigdzie załadowane. CSS wysyłany do klientów, fonty nigdy nie pobrane.

### [PERF-009] `transpilePackages: ["three", "gsap"]` — zbędne w Next.js 16

- **Lokalizacja:** `next.config.js:55`
- **Problem:** `three` i `gsap` publikują ESM builds z poprawnym `exports` field. Next.js 16 z Turbopack obsługuje je natywnie.

### [PERF-010] `optimizePackageImports` nie obejmuje `gsap`

- **Lokalizacja:** `next.config.js:42–49`
- **Rekomendacja:** Dodać `"gsap"` dla kompletności (wpływ minimalny — GSAP importowany przez default export).

---

## Co jest dobrze zrobione

- **Google Maps** owinięty w `LazyMuralsMapWithIntersection` (dynamic + IntersectionObserver, `ssr:false`)
- **react-player** owinięty w `dynamic(ssr:false)` w `VideoPlayer.tsx`
- **PortfolioLightbox** (na homepage flow) owinięty w `LazyLightbox = dynamic(...)`
- **Testimonials** owinięty w `LazyTestimonialsWithIntersection`
- **Hero poster** — celowy `<img>` z `fetchPriority="high"` matching `<link rel="preload">` w `layout.tsx` (unika URL mismatch z `/_next/image?url=...`)
- **Polyfill aliased to empty-module** — oszczędza ~14 KB na każdej stronie dla Chrome ≥105 / Safari ≥15.4
- **splitChunks** z dedykowanymi cacheGroups dla `three`, `maps`, `ui`
- **Cache-Control: immutable** dla wszystkich katalogów statycznych assets
- **AVIF/WebP formats** w `next/image` config
- **removeConsole** w production (z wyjątkiem `error`/`warn`)
- **Cards.tsx** — `priority={isFirst}` tylko na pierwszej karcie (above-the-fold)
- **`scrollRestoration: true`** w experimental — poprawnie przy Lenis
- **Video hero** — defer przez `requestIdleCallback`/timeout, poster jako LCP element

---

## Plan wdrożenia

### Quick wins (1–2 godz.)
1. `app/page.tsx` — owinąć `PanoramaScroll` w `dynamic(ssr:false)` (PERF-001)
2. `app/filmy/page.tsx` — zamienić direct import na `LazyYouTubeGridWithIntersection` (PERF-002)
3. `app/components/PerformanceMonitor.tsx` — dodać early return dla production (PERF-003)
4. Skonwertować 4 JPG w `public/images/` do webp (PERF-005)
5. Usunąć duplikat `.gradient-new` i orphaned font classes z `globals.css` (PERF-007, PERF-008)

### Średnie (2–4 godz.)
6. `app/portfolio/page.tsx` — dynamic imports dla lightbox + pluginów (PERF-004)
7. Przejrzeć i oczyścić `will-change` ze statycznych klas CSS (PERF-006)

### Większe (opcjonalne)
8. Usunąć `transpilePackages: ["three", "gsap"]` i zweryfikować build (PERF-009)
9. Rozważyć zastąpienie `PerformanceMonitor` przez `web-vitals` library z wysyłką do GA4
10. Zebrać faktyczne rozmiary bundle (`npm run build:analyze`) po wdrożeniu zmian 1–7

---

*Audyt oparty wyłącznie na weryfikacji kodu źródłowego. Metryki runtime (PSI score, LCP w sekundach) wymagają oddzielnego pomiaru po wdrożeniu zmian.*
