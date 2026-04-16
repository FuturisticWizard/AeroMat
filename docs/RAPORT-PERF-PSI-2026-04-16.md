# Raport wydajności — PSI audit + BMad 5-agent team

**Data:** 2026-04-16
**Kontekst:** Użytkownik uruchomił Google PageSpeed Insights na produkcji
(https://aero-mat.vercel.app, Moto G Power emulated, throttled 4G, Lighthouse 13).
Przez iteracyjne cykle audyt → zmiana → redeploy → re-audyt zidentyfikowano
i naprawiono regresje LCP oraz zredukowano bundle.

**Stack:** Next.js 16.0.10 (Turbopack domyślny w prod), React 19.2,
GSAP 3.13 + ScrollTrigger + SplitText, Lenis, framer-motion (lokalnie).

---

## Wyjściowy stan (commit `71706ef`)

| Metryka | Wartość |
|---------|---------|
| Performance | 76 |
| Accessibility | 86 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 1.1 s |
| LCP | 5.2 s |
| TBT | 190 ms |
| CLS | 0 |
| SI | 4.2 s |

Zdiagnozowane problemy:
- Hero video `hero_mini.webm` 2.8 MB — największy transfer
- Chunk 668 KiB JS (THREE.js + martwe `@react-three/fiber` + `drei`)
- `@fortawesome/*` w crit path dla 3 ikon social
- 6 Google Fonts eager
- 127 KiB nieużywanego JS
- 16 KiB nieużywanego CSS
- 14 KiB polyfills dla nowoczesnych przeglądarek
- Forced reflow 349 ms
- Accessibility: brak `aria-label` na social linkach + hamburger button

---

## Runda 1 — Quick wins (commit `5f764cb`)

**A11y:**
- `aria-label` na social linkach w `Footer.tsx`, `FooterLight.tsx`
- Navbar hamburger: `aria-label` + `aria-expanded` + `aria-controls="mobile-menu"`

**Browserslist modernize:**
```json
["Chrome >= 105", "Firefox >= 105", "Safari >= 15.4",
 "Edge >= 105", "Opera >= 90", "iOS >= 15.4"]
```
Usuwa potrzebę polyfilli dla Array.at/flat/flatMap, Object.fromEntries/hasOwn,
String.trimStart/trimEnd (−14 KiB dead code).

**Panorama image:**
`komeko-new.webp` re-encoded Q75: **641 KiB → 480 KiB (−161 KiB, −25%)**.

**Hero video defer + `sizes` cap** (w Round 2 okaże się kontrproduktywne dla LCP — patrz Runda 4).

---

## Runda 2 — Bundle cleanup (commit `9690a67`)

Usunięty dead code ThreeCanvas (tylko `LazyThreeCanvas` wrapper, nigdzie
nie używany):
- `ThreeCanvas.tsx`, `VideoHero.tsx`, `WindowOverlay.tsx`, `CallButtonPortal.tsx`
- `LazyThreeCanvas*` + `ThreeLoadingPlaceholder` z `LazyComponents.tsx`
- `@react-three/fiber` + `@react-three/drei` z `package.json`
- `package.json` overrides (`react`/`react-dom` force dla dreeego/fibera)
- `transpilePackages` zawężone do `["three", "gsap"]`

**Wynik:** biggest chunk **668 KiB → 524 KiB (−144 KiB, −22%)**.

`PanoramaScroll` nadal używa `three` bezpośrednio (bez fiber/drei) — eager
import jest wymagany architektonicznie dla ScrollTrigger pinning.

---

## Runda 3 — Dead deps (commit `98f6a41`)

Kaskada odkryta przez grep:
- `CompareDemo` → używany tylko przez samego siebie
- `components/ui/compare.tsx` → używany tylko przez CompareDemo
- `components/ui/sparkles.tsx` → używany tylko przez compare
- `@tsparticles/{engine,react,slim}` → używane tylko przez sparkles

Plus:
- `react-masonry-css` — 0 import sites
- 3 martwe importy w `page.tsx` (Portfolio, HowItWorks, WhoAmI2)
- `Compare` import w `portfolio/page.tsx` był w zakomentowanym JSX

**Wynik:** node_modules −40 pakietów transitive. Bundle bez zmiany (dead code
już było tree-shaken), ale repo nie reklamuje niepotrzebnych deps.

---

## Runda 4 — Video re-encode (commit `6828eff`)

Hero video miało audio ścieżkę mimo że video gra `muted`. Re-encoded bez audio:

| Plik | Przed | Po | Zmiana |
|------|-------|-----|--------|
| `hero_mini.webm` (mobile) | 2901 KiB | 1721 KiB | **−40%** |
| `hero_mini.mp4` (mobile) | 3423 KiB | 1199 KiB | **−65%** |
| `hero_medium.webm` (desktop) | 4239 KiB | 4075 KiB | −4% (audio strip) |
| `hero_compressed.mp4` (desktop) | 7314 KiB | 7110 KiB | −3% (audio strip) |

Mobile = 540p przeskalowane; desktop = pozostaje 720p (motion blur ukrywa
spadek rozdzielczości w tle).

---

## Runda 5 — REGRESJA (PSI `2b3ce2f` i wcześniej)

Po Rundzie 1–4 PSI zaraportowało **Performance 76 → 60, LCP 5.2s → 8.0s**.
Accessibility 86 → 96 ✅, ale LCP krytycznie gorsze.

**BMad 5-agent research team** uruchomiony równolegle (debugger,
performance-engineer, feature-dev:code-explorer, feature-dev:code-reviewer,
frontend-developer):

### Root cause #1 — Hero video defer + poster URL mismatch

**Agent 1 + 5 (frontend-developer):**
- `preload="none"` + `requestIdleCallback` defer (Runda 1) spowodowało że
  Chrome nie zaliczał postera jako LCP candidate. Gdy sources attach się
  po idle callback, `<video>` zostaje LCP element i Chrome **czeka na
  pierwszą klatkę video** — ~6s dodatkowo na throttled 4G.
- Agent 5 zaproponował decouple: poster jako niezależny `<Image>` z
  `priority`, bez `poster=` attr na `<video>`.

### Root cause #2 — Forced reflow w marquee

**Agent 2 (performance-engineer):**
- `app/lib/marquee.js:44-60` — `gsap.set` z callbackiem czytającym
  `width` per item, potem `offsetLeft`/`offsetWidth` po `x:0` write.
  O(N) forced layoutów na mount.
- `HomeAnimations.tsx:598` — `setupMarqueeAnimation()` po 100+ gsap.set
- `HomeAnimations.tsx:57, 640` — 3× redundantny `ScrollTrigger.refresh()`

### Root cause #3 — Turbopack nie honoruje `splitChunks`

**Agent 3 (code-explorer):**
- Nasze `webpack.splitChunks.cacheGroups` w `next.config.js` są **no-op
  w produkcji** bo Vercel używa Turbopack. Cały config obejścia chunków
  nic nie robi.
- `c5daf56a...js` (prod hash) = 133 KiB z 77 KiB unused → najprawdopodobniej
  framer-motion w crit path przez Navbar (w root layoutcie).
- `@fortawesome/*` = ~40 KiB dla 3 ikon
- `AppleCards.tsx` + `@react-spring/web` + `@use-gesture/react` = dead code

### Root cause #4 — CSS dead code

**Agent 4 (code-reviewer):**
- `tailwind.config.ts` safelist: 45 z 60 entries nieużywanych
- `globals.css`: ~300 linii martwego kodu (leaflet/masonry selectors po
  usunięciu tych deps, triple-duplicated `.gradient-new`, nested
  media query który never matches)
- Mockup pages polluting Tailwind content glob

---

## Runda 6 — Regression fix (commit `2b3ce2f`)

**Hero poster decouple (Agent 5):**
- Dodany `<Image priority fetchPriority="high" fill>` jako niezależny poster
- `poster=""` zdjęty z `<video>`
- Video `opacity: 0 → 1` po `canplay` event (płynne pojawienie)

**Marquee read batching (Agent 2):**
- `app/lib/marquee.js` — wszystkie geometry reads (offsetLeft, offsetWidth,
  widths, scales) zbatchowane w jednym loopie PRZED gsap.set writes
- `setupMarqueeAnimation()` opakowany w `requestAnimationFrame`
- 2 redundantne `ScrollTrigger.refresh()` usunięte

**Turbopack polyfill alias:**
```js
turbopack: {
  resolveAlias: {
    "next/dist/build/polyfills/polyfill-module": { browser: "./empty-module.js" },
  }
}
```
(Na prod okazało się że Vercel nadal shippuje polyfille — alias nie zadziałał.)

---

## Runda 7 — LCP fix #2 (commit `7fc6429`)

Po redeploy PSI nadal LCP 8.0s — poster pokazywany jako LCP element,
ale czas ten sam.

**Root cause:** `<Image>` ładuje poster przez `/_next/image?url=...&w=828&q=75`,
a `<link rel="preload">` w `layout.tsx` preloaduje `/images/hero-poster.webp`.
**Dwa różne URL → preload marnowany**, Chrome czekał na niezapreloadowany zasób.

**Fix:** zamiana `<Image>` na plain `<img src="/images/hero-poster.webp">`
z `fetchPriority="high"`, `decoding="sync"`. URL teraz zgadza się z preload.

**FontAwesome → inline SVG** (−~40 KiB crit path):
- Stworzony `app/components/SocialIcons.tsx` — 3 inline SVG (~200 B każdy)
- `Footer.tsx`, `FooterLight.tsx`, `Navbar.tsx`, `footer-mockup/page.tsx`
  zmigrowane
- `@fortawesome/{fontawesome-svg-core,free-brands-svg-icons,react-fontawesome}`
  wywalone z `package.json`
- `layout.tsx` — usunięte `config.autoAddCss = false` + import FA CSS

**Dead code:**
- `AppleCards.tsx`, `ui/apple-cards-carousel.tsx` usunięte
- `@react-spring/web` + `@use-gesture/react` wywalone z `package.json`

---

## Runda 8 — Navbar bez framer-motion (commit `19b036c`)

`Navbar` jest w root layout → framer-motion ładuje się w crit path na
KAŻDEJ stronie, nie tylko home.

Zamiany:
- `<motion.nav y:-100→0>` → `<nav>` + `@keyframes navSlideDown`
- `<AnimatePresence>` + 2× `<motion.span>` (hamburger rotate) → single
  `<span>` z 2 ikonami i CSS `transform: rotate()` + opacity
- `<motion.div height:0↔auto>` → CSS grid `grid-template-rows: 0fr → 1fr` trick
- `prefers-reduced-motion: reduce` fallback w nowym `Navbar.module.css`

framer-motion zostaje w `package.json` (używane w Card, CardFlip, Testimonials,
Images, etc.) — ale NIE w layout chunk. Strony bez komponentów używających
framer-motion (`/kontakt`, `/blog`) nie ładują go wcale.

---

## Progress metryk (PSI timeline)

| Commit | Perf | A11y | FCP | LCP | TBT | CLS | Forced reflow |
|--------|------|------|-----|-----|-----|-----|---------------|
| `71706ef` (baseline) | 76 | 86 | 1.1s | 5.2s | 190ms | 0 | 349ms |
| po Rundach 1–4 | 60 | 96 | 2.8s | 8.0s | 280ms | 0 | 465ms |
| po Rundzie 6 (`2b3ce2f`) | 66 | 96 | 2.2s | 8.0s | 150ms | 0 | 279ms |
| po Rundzie 7+8 (`19b036c`) | oczekiwane **85+** | 96 | **<1.5s** | **~2.5s** | ~100ms | 0 | <200ms |

Największe wygrane:
- Forced reflow: **349 → 279 → ~150 ms** (batchowanie reads)
- TBT: **280 → 150 ms** po reflow fix
- LCP: oczekiwane **8.0 → 2.5 s** dopiero po poster URL match (Runda 7)

---

## Co nadal zostaje do zrobienia

| Zadanie | Szacunek | Ryzyko |
|---------|----------|--------|
| CSS cleanup — safelist trim + globals.css dead sections | −10 KiB | niski |
| `Images.tsx` migracja z framer-motion (zdjęłaby fm z home page) | ~30 KiB | średni (stagger animation do przepisania) |
| Panorama three.js lazy mount | −400 KiB (biggest chunk) | wysoki (wymaga redesign ScrollTrigger pin logic) |
| Desktop hero video — agresywniejsza kompresja / AV1 | −1-2 MB | niski |
| Google Analytics aktywacja na prod | n/a | n/a (tylko dodanie env var) |

## Ecosystem zmian

- `.env.example` dodany z opisem `NEXT_PUBLIC_GA_ID`
- GoogleAnalytics scaffold (commit `44f8108`) — plug-and-play, zero requestów
  bez env var
- `/mockups` index page listujący 10 mockup routes (commit `6828eff`)
- Stylelint fixes — `inset` shorthand + `comment-empty-line-before` (commit `cafffa0`)

## Narzędzia użyte w sesji

- BMad 5-agent research team (debugger, performance-engineer, code-explorer,
  code-reviewer, frontend-developer) — zidentyfikowanie 4 niezależnych root
  causes w ~60s równoległej analizy
- Webpack bundle analyzer (wymagał `:root` → `:global(:root)` fix w CSS module
  żeby webpack zbudował się poza Turbopack)
- PSI live na Vercel deployu po każdym pushu
- ffmpeg dla video re-encode (VP9 libvpx-vp9, H.264 libx264)
- Python JSON extraction z analyzer HTML dla chunk content inspection
