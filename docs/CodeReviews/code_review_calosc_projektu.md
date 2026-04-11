# Raport Audytu Jakosci Kodu -- AeroMat

**Data:** 2026-04-06  
**Zakres:** 20 plikow (komponenty, strony, lib, context)  
**Audytor:** Claude Opus 4.6 (CTO Code Review)

---

## Podsumowanie

| Kategoria | Ocena (1-5) | Status |
|-----------|-------------|--------|
| Czytelnosc kodu | 2/5 | Wymaga poprawy |
| Wzorce React | 2.5/5 | Wymaga poprawy |
| TypeScript | 2/5 | Wymaga poprawy |
| Obsluga bledow | 2.5/5 | Wymaga poprawy |
| Dostepnosc (a11y) | 2/5 | Wymaga poprawy |
| Konwencje nazewnictwa | 2/5 | Wymaga poprawy |
| Potencjalne bledy | 3/5 | Srednie ryzyko |

---

## 1. PROBLEMY KRYTYCZNE (Must Fix)

### 1.1 `app/page.tsx` -- Monolityczny useEffect (758 linii, useEffect ~650 linii)

**Problem:** Caly plik `page.tsx` to pojedynczy komponent z jednym gigantycznym `useEffect` (linie 33-687) zawierajacym ponad 650 linii logiki GSAP, Lenis, ScrollTrigger, marquee i animacji neonowych. Jest to jeden z najdluzszych useEffect'ow jakie mozna spotkac w projekcie React.

**Wplyw:** 
- Niemozliwa izolacja bledow -- jeden bug psuje cala strone
- Brak mozliwosci testowania jednostkowego poszczegolnych animacji
- Kazda zmiana w jednej animacji wymaga zrozumienia calego bloku

**Rekomendacja:** Wyodrebnij logike do custom hooks:
```tsx
// hooks/useIntroAnimation.ts
export function useIntroAnimation(cards: HTMLElement[], isMobile: boolean) { ... }

// hooks/usePanoramaSync.ts  
export function usePanoramaSync() { ... }

// hooks/useNeonReveal.ts
export function useNeonReveal(selector: string, words: string[]) { ... }

// hooks/useLenisScroll.ts
export function useLenisScroll(isMobile: boolean) { ... }
```

### 1.2 `app/page.tsx` -- 15 `console.log` w produkcji

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/page.tsx`  
**Linie:** 35, 38, 51, 57, 71, 75, 83, 88-89, 113, 122, 236, 351, 659

**Problem:** 15 instrukcji `console.log` w glownym pliku strony. Razem z `app/lib/animations.ts` (5 console.log, linie 10-11, 28, 38-39) i `app/lib/marquee.js` (3 console.log/warn, linie 9, 14-15) daje to 23 instrukcji debugowania w krytycznych sciezkach renderowania.

**Laczna liczba w projekcie:** 51 wystapien `console.*` w 10 plikach.

**Rekomendacja:** Usun wszystkie console.log z produkcji lub wprowadz utilite:
```ts
const isDev = process.env.NODE_ENV === 'development';
export const debug = (...args: unknown[]) => isDev && console.log(...args);
```

### 1.3 `app/lib/marquee.js` -- Plik JavaScript bez typow

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/lib/marquee.js`  
**Problem:** Jedyny plik `.js` w projekcie TypeScript. Funkcja `horizontalLoop(items, config)` (linia 26) nie ma zadnych typow. Uzyte zmienne `let` bez typow: `tl`, `length`, `startX`, `widths`, `xPercents`, `pixelsPerSecond`, `totalWidth`, `curX`, `distanceToStart`, `distanceToLoop`, `item`, `i`.

**Rekomendacja:** Przemianuj na `marquee.ts` i dodaj interfejs konfiguracji:
```ts
interface MarqueeConfig {
  repeat?: number;
  paddingRight?: number;
  speed?: number;
}
function horizontalLoop(items: HTMLElement[], config: MarqueeConfig): gsap.core.Timeline { ... }
```

### 1.4 Duplikacja kodu: `AppleCards.tsx` vs `ui/apple-cards-carousel.tsx`

**Pliki:**
- `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/AppleCards.tsx` (11.8KB)
- `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/ui/apple-cards-carousel.tsx` (14.6KB)

**Problem:** Oba pliki eksportuja te same nazwy (`Carousel`, `Card`, `CarouselContext`, `BlurImage`) z prawie identyczna logika. Roznia sie szczegolami implementacji (np. drag w AppleCards korzysta z `@use-gesture/react` + `@react-spring/web`, a wersja w `ui/` nie). Oba definiuja `type Card` lokalnie. Oba uzywaja `isMobile()` jako funkcji (nie hooka).

Plik `Services.tsx` importuje z `AppleCards.tsx` (linia 5), ale nie jest jasne kto importuje `ui/apple-cards-carousel.tsx`.

**Rekomendacja:** Zachowaj jeden plik, usun duplikat. Jezeli wersja `ui/` jest bardziej rozbudowana (ma hover, modal navigation), uzyj jej jako zrodla prawdy.

### 1.5 `app/components/photo-portfolio.tsx` -- Martwy kod / Placeholder

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/photo-portfolio.tsx`  
**Problem:** Caly komponent uzywa placeholder danych w jezyku angielskim:
- "Company Name" (linia 310), "123 Photography Lane" (319), "New York, NY 10001" (320)
- "(555) 123-4567" (322), "info@companyphotos.com" (321)
- Wszystkie zdjecia to `/placeholder.svg?height=...` (linie 23, 34, 45, 55, 65, 76, 87, 98, 109, 225)
- Zawiera wlasny `<footer>` (linia 306) ktory koliduje z glownym Footer.tsx

To wyglada na skopiowany szablon, ktory nigdy nie zostal zaimplementowany.

**Rekomendacja:** Albo zaimplementuj z prawdziwymi danymi, albo usun plik. Prawdziwa strona portfolio juz istnieje w `app/portfolio/page.tsx`.

### 1.6 Pliki `.backup` w repozytorium

**Pliki:**
- `app/components/AppleCards.tsx.backup`
- `app/components/Services.tsx.backup`

**Problem:** Pliki backupowe nie powinny byc w repozytorium -- do tego sluzy git.

**Rekomendacja:** Usun oba pliki i dodaj `*.backup` do `.gitignore`.

---

## 2. OSTRZEZENIA (Should Fix)

### 2.1 Brak obslugi bledow w formularzu kontaktowym

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/kontakt/page.tsx`  
**Linia:** 62-66

```tsx
function onSubmit(values: z.infer<typeof formSchema>) {
  send(values);  // <-- Brak await, brak try/catch, brak feedback dla uzytkownika
}
```

**Problem:** Funkcja `send()` z `app/lib/email.tsx` jest async i rzuca bledy, ale `onSubmit` nie jest async, nie awaituje wyniku i nie lapie bledow. Uzytkownik nie dostaje zadnego potwierdzenia ze wiadomosc zostala wyslana ani informacji o bledzie.

**Rekomendacja:**
```tsx
const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

async function onSubmit(values: z.infer<typeof formSchema>) {
  setStatus('sending');
  try {
    await send(values);
    setStatus('success');
    form.reset();
  } catch (err) {
    setStatus('error');
  }
}
```

### 2.2 Komentarze w kodzie -- pozostalosci zakomentowanego kodu

**Dotkniete pliki i linie:**
- `app/components/Services.tsx` -- linie 19-125 (106 linii zakomentowanego kodu, wiecej niz aktywnego kodu!)
- `app/kontakt/page.tsx` -- linie 25-49 (stary handleSubmit)
- `app/page.tsx` -- linie 3, 28-29, 741-747 (stare importy i JSX)
- `app/portfolio/page.tsx` -- linie 39-42, 102-118 (zakomentowane Button i Compare)

**Rekomendacja:** Usun caly zakomentowany kod. Git przechowuje historie.

### 2.3 `app/components/GoogleMap/GoogleMap.tsx` -- Wyciek listenerow na markerach

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/GoogleMap/GoogleMap.tsx`  
**Linie:** 120-161

**Problem:** Markery Google Maps sa tworzone z listenerami `click` (linia 138), ale w cleanup (linia 159) wywolywane jest tylko `marker.setMap(null)`. Nie ma jawnego usuwania listenerow (`google.maps.event.clearInstanceListeners(marker)`). Przy kazdym renderze tworzone sa nowe markery, a stare listenery moga pozostawac w pamieci.

Dodatkowo, `useEffect` ma `props.pois` w tablicy zaleznosci (linia 161) ale brakuje `props.onSelectPoi`, co moze prowadzic do stalego (stale) callbacka w zamknieciu (closure).

**Rekomendacja:** Dodaj `google.maps.event.clearInstanceListeners(marker)` przed `marker.setMap(null)` w cleanup.

### 2.4 `app/components/GoogleMap/GoogleMap.tsx` -- Hardkodowany klucz API jako fallback

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/GoogleMap/GoogleMap.tsx`  
**Linia:** 261

```tsx
apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
```

**Problem:** Pusty string jako fallback oznacza ze mapa probuje sie zaladowac bez klucza, co powoduje blad w konsoli ale nie daje uzytkownikowi informacji. Lepiej nie renderowac mapy w ogole.

### 2.5 `app/page.tsx` -- Bezposredni dostep do `window` bez SSR guard

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/page.tsx`  
**Linia:** 37

```tsx
const isMobile = window.innerWidth < 768;
```

**Problem:** Chociaz komponent ma `"use client"` i kod jest w `useEffect`, bezposredni dostep do `window.innerWidth` na linia 37 jest bezpieczny, ale nie reaguje na zmiane rozmiaru okna. Wartosc jest obliczana raz i uzycia w calym 650-liniowym useEffect nie aktualizuja sie.

### 2.6 Duplikacja tablicy `socials` w Navbar.tsx i Footer.tsx

**Pliki:**
- `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/Navbar.tsx` linie 31-34
- `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/Footer.tsx` linie 8-24

**Problem:** Identyczna lista social media (Facebook, Instagram, YouTube) jest zdefiniowana w dwoch plikach. Zmiana URL wymaga edycji w dwoch miejscach.

**Rekomendacja:** Wyodrebnij do `app/lib/constants.ts`:
```ts
export const SOCIAL_LINKS = [
  { title: "facebook", icon: faFacebookF, link: "https://www.facebook.com/aeromat1" },
  // ...
] as const;
```

### 2.7 `app/components/Testimonials.tsx` -- `activeIndex` w tablicy zaleznosci useEffect

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/Testimonials.tsx`  
**Linia:** 143

```tsx
useEffect(() => { ... }, [api, activeIndex, totalTestimonials]);
```

**Problem:** `activeIndex` jest w tablicy zaleznosci, ale wewnatrz efektu `activeIndex` nie jest uzywany. Efekt rejestruje listener `handleSelect` ktory ustawia `activeIndex`, wiec za kazdym razem gdy `activeIndex` sie zmieni, listener jest odlaczany i przylaczany na nowo, co jest niepotrzebnym overhead.

**Rekomendacja:** Usun `activeIndex` z tablicy zaleznosci: `[api, totalTestimonials]`.

### 2.8 `app/components/ui/apple-cards-carousel.tsx` -- `useEffect` z brakujaca zaleznoscia

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/ui/apple-cards-carousel.tsx`  
**Linia:** 265

```tsx
useEffect(() => {
  // Uses handleClose which references onCardClose
  if (open) {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
  } else {
    document.body.style.overflow = "auto";
  }
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [open]); // Missing handleClose / handleKeyDown in deps
```

**Problem:** `handleKeyDown` wywoluje `handleClose()`, ktore nie jest stabilne (nie jest owiniety w `useCallback`). Przy strict mode moze to prowadzic do stalych referencji.

### 2.9 Manipulacja `document.body.style.overflow` w wielu komponentach

**Dotkniete pliki:**
- `app/components/YoutubeVideosGrid.tsx` linia 79
- `app/components/AppleCards.tsx` linia 239
- `app/components/ui/apple-cards-carousel.tsx` linia 259

**Problem:** Kazdy komponent niezaleznie ustawia `document.body.style.overflow = "hidden"` / `"auto"`. Jesli dwa modale sa otwarte jednoczesnie (np. AppleCards modal + YouTube overlay), zamkniecie jednego przywroci scroll mimo ze drugi jest jeszcze otwarty.

**Rekomendacja:** Stworz hook `useBodyScrollLock()` ktory liczy aktywne blokady:
```ts
// hooks/useBodyScrollLock.ts
const lockCount = { current: 0 };
export function useBodyScrollLock(isLocked: boolean) { ... }
```

### 2.10 `app/components/PanoramaScroll.tsx` -- THREE.js textura bez obsluga rozlaczenia sieci

**Plik:** `/mnt/d/Builds/AeroMat1.0/AeroMat/app/components/PanoramaScroll.tsx`  
**Linia:** 172-241

**Problem:** `THREE.TextureLoader.load()` ma callback bledu (linia 238-240), ale jedynie loguje blad do konsoli. Uzytkownik widzi czarny ekran bez zadnej informacji.

**Rekomendacja:** Dodaj state `textureError` i wyrenderuj fallback UI z komunikatem.

---

## 3. SUGESTIE (Consider Improving)

### 3.1 Czytelnosc kodu -- Ocena: 2/5

**Problemy:**
- `app/page.tsx`: 758 linii, z czego 650+ to jeden useEffect. Stosunek logiki do JSX wynosi ~8:1.
- `app/components/Services.tsx`: 126 linii zakomentowanego kodu na 304 linie pliku (41% to komentarze).
- `app/components/ui/apple-cards-carousel.tsx`: 448 linii z wieloma zagniezdzonymi warunkami hover/modal/tap state.
- Magic numbers rozrzucone po calym kodzie:
  - `page.tsx:93`: `{ 0: 10, 1: 30, 2: 50, 3: 60 }` -- z-index mapping
  - `page.tsx:368`: `{ murale: 20, szyldy: 40, wnetrza: 55, projekty: 70 }` -- portfolio z-index
  - `page.tsx:375-376`: `0.85`, `0.75`, `-50`, `-100` -- scale/offset
  - `page.tsx:103`: `"+=120vh"`, `"+=300vh"` -- ScrollTrigger end values
  - `page.tsx:517-551`: Dziesiatki wartosci `opacity` i `duration` w animacji neonowej

**Rekomendacja:** Wyodrebnij stale do dedykowanego pliku konfiguracji:
```ts
// lib/animation-config.ts
export const CARD_Z_INDEX = { intro: 10, szyldy: 30, wnetrza: 50, projekty: 60 } as const;
export const PORTFOLIO_Z_INDEX = { murale: 20, szyldy: 40, wnetrza: 55, projekty: 70 } as const;
```

### 3.2 Wzorce React -- Ocena: 2.5/5

**Problemy:**
- `isMobile()` jako zwykla funkcja (nie hook) w `AppleCards.tsx` linia 141 i `apple-cards-carousel.tsx` linia 128:
  ```tsx
  const isMobile = () => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  };
  ```
  Ta funkcja jest wywolywana w trakcie renderowania, ale jej wynik nie jest reaktywny. Zmiana rozmiaru okna nie spowoduje re-renderowania.

- Brak `useCallback` dla wielu handlerowych funkcji przekazywanych jako props:
  - `page.tsx`: `revealActiveTexts`, `onMouseMove`, `onMouseLeave`
  - `Testimonials.tsx`: `calculatePosition`
  
- `GlitchedVideoHero.tsx`: Uzywanie `_measurer` jako zmiennej globalnej na poziomie modulu (linia 54) ktora mutuje DOM. Ta zmienna jest wspoldzielona miedzy instancjami komponentu i nigdy nie jest czyszczona.

- `AppleCards.tsx` importuje `Image` z `next/image` (linia 16) ale `BlurImage` uzywa zwyklego `<img>` tagu (linia 366-376), co niweczy optymalizacje Next.js Image.

### 3.3 TypeScript -- Ocena: 2/5

**Problemy:**
- `app/lib/marquee.js` -- caly plik bez typow (patrz sekcja 1.3)
- `app/components/Services.tsx` linia 14-16 -- lokalna definicja `type Card` ktora koliduje z importowanym `Card` z AppleCards:
  ```tsx
  type Card = {    // <-- Ten typ nie jest nigdzie uzywany
    card: CardData;
  };
  ```
- `app/components/AppleCards.tsx` linia 26 -- `type Card` zdefiniowany identycznie w dwoch plikach
- `app/components/ui/apple-cards-carousel.tsx` linia 35 -- trzecia kopia `type Card`
- `app/components/GoogleMap/GoogleMap.tsx` linia 267:
  ```tsx
  onCameraChanged={(ev: MapCameraChangedEvent) => {}}  // pustny handler
  ```
- Brak strictNullChecks w praktyce -- wiele miejsc uzywa `!` (non-null assertion):
  - `page.tsx:56`: `lenis!.scrollTo(value as number, ...)`
  - `page.tsx:77`: `lenis!.raf(time * 1000)`

### 3.4 Obsluga bledow -- Ocena: 2.5/5

**Dobre praktyki:**
- `app/lib/email.tsx` -- solidna walidacja server-side z Zod + rate limiting
- `GoogleMap.tsx` -- `MapErrorBoundary` class component do obslugi bledow mapy

**Problemy:**
- `kontakt/page.tsx` -- brak obslugi bledow w `onSubmit` (patrz 2.1)
- `PanoramaScroll.tsx` -- blad textury logowany do konsoli bez fallback UI (patrz 2.10)
- `GlitchedVideoHero.tsx:201`:
  ```tsx
  const play = async () => { try { v.muted = true; await v.play(); } catch (_) {} };
  ```
  Blad odtwarzania wideo jest calkowicie ignorowany.
- `page.tsx` -- brak jakiegokolwiek error boundary lub try/catch w 650-liniowym useEffect. Blad w dowolnym punkcie lamanczy cala animacje.

### 3.5 Dostepnosc (a11y) -- Ocena: 2/5

**Problemy:**
- **Brak `alt` na obrazku nawigacyjnym w Testimonials.tsx linia 233:**
  ```tsx
  <Image src={...} alt="" width={380} height={380} ... />
  ```
  Pusty `alt` na obrazkach klientow ktore sluza jako nawigacja.

- **Brak oblugi klawiatury w lightbox/modal:**
  - `photo-portfolio.tsx` -- modal ze zdjeciami nie ma obslugi Escape (w przeciwienstwie do `apple-cards-carousel.tsx` ktory ma)
  - `YoutubeVideosGrid.tsx` -- overlay wideo nie ma obslugi Escape na klawiaturze

- **Brak `aria-label` na przyciskach nawigacyjnych karuzeli:**
  - `AppleCards.tsx` linie 198-210 -- przyciski strzalek bez `aria-label`
  - `apple-cards-carousel.tsx` linie 195-209 -- to samo

- **Brak `role` i `aria` na interaktywnych elementach:**
  - `YoutubeVideosGrid.tsx` linia 176 -- `<div onClick>` zamiast `<button>` na kartach wideo
  - `photo-portfolio.tsx` linia 180 -- `<div onClick>` na kartach zdjec
  - `Testimonials.tsx` linia 278 -- `<div onClick>` na overlay zamkniecia mapy

- **Kontrast tekstu:**
  - `Footer.tsx` linia 69: "Made by ." -- brakujaca nazwa (tekst zacina sie na kropce)

- **`frameBorder="0"` jest deprecated w HTML5:**
  - `YoutubeVideosGrid.tsx` linie 137, 191
  - `GoogleMap/GoogleMap.tsx` linia 297

### 3.6 Konwencje nazewnictwa -- Ocena: 2/5

**Mieszane konwencje nazw plikow:**

| Konwencja | Pliki |
|-----------|-------|
| PascalCase | `Cards.tsx`, `Footer.tsx`, `Navbar.tsx`, `Services.tsx`, `Testimonials.tsx`, `PanoramaScroll.tsx` |
| kebab-case | `photo-portfolio.tsx`, `email-template.tsx`, `apple-cards-carousel.tsx` |
| camelCase | `marquee.js` |
| z numerami | `WhoAmI2.tsx`, `CardFlip2.tsx`, `Hero3.tsx` |

**Nieuzywane/przestarzale komponenty (po nazwach):**
- `Hero.tsx`, `Hero3.tsx` -- prawdopodobnie zastapione przez `GlitchedVideoHero.tsx`
- `CardFlip.tsx`, `CardFlip2.tsx` -- czy sa jeszcze uzywane?
- `WhoAmI2.tsx` -- dlaczego "2"? Co sie stalo z "1"?

**Rekomendacja:** Przyjmij jedna konwencje (PascalCase dla komponentow, kebab-case dla narzedzi) i trzymaj sie jej.

### 3.7 Potencjalne bledy -- Ocena: 3/5

**a) `page.tsx` linia 109 -- podwojne setTimeout + requestAnimationFrame:**
```tsx
requestAnimationFrame(() => ScrollTrigger.refresh());
setTimeout(() => ScrollTrigger.refresh(), 200);
```
Dwa odswiezenia w krotkim odstepie moga powodowac migotanie na mobilnych.

**b) `page.tsx` linia 436 -- potencjalny undefined:**
```tsx
const fadeTarget = nextCard || cards.find((c) => (c as HTMLElement).classList.contains("panorama-card")) as HTMLElement | undefined;
```
Jesli `nextCard` jest `undefined` i panorama-card nie istnieje, `fadeTarget` jest `undefined`, ale dalszy kod (`if (fadeTarget && portfolioWrapper)`) obsluguje to poprawnie.

**c) `GlitchedVideoHero.tsx` linia 54 -- globalna zmienna DOM:**
```tsx
let _measurer: HTMLSpanElement | null = null;
```
Element `<span>` dodany do `document.body` (linia 59) nigdy nie jest usuwany, nawet po odmontowaniu wszystkich instancji komponentu. W SPA z wielokrotnym montowaniem/odmontowaniem jest to wyciek pamieci.

**d) `Testimonials.tsx` linia 125-133 -- nieosiagalny warunek:**
```tsx
if (newIndex === totalTestimonials) { ... }
else if (newIndex === -1) { ... }
```
Embla carousel z `loop: true` nigdy nie zwroci `-1` z `selectedScrollSnap()`. Ten branch jest martwy.

**e) `apple-cards-carousel.tsx` linia 98 -- null safety:**
```tsx
const prevIndex = openModalIndex > 0 ? openModalIndex - 1 : items.length - 1;
```
`openModalIndex` moze byc `null` (definicja: `useState<number | null>(null)`), ale jest uzywany w porownaniu `> 0` bez sprawdzenia. Warunek `if (isModalOpen)` wyzej chroni, ale TypeScript nie moze tego zagwarantowac (brak type narrowing).

**f) `app/components/Cards.tsx` linia 93 -- deprecated `onLoadingComplete`:**
```tsx
onLoadingComplete={() => ScrollTrigger.refresh()}
```
`onLoadingComplete` jest deprecated w Next.js 14+. Nalezy uzyc `onLoad`.

---

## 4. Podsumowanie Rekomendacji (Priorytetyzacja)

### Faza 1 -- Natychmiast (blokery jakosci)
1. Usun 51 instrukcji `console.log/warn/error` z produkcji lub zastap debug utilita
2. Usun pliki `.backup` z repozytorium
3. Napraw `onSubmit` w kontakt/page.tsx (await + error handling + user feedback)
4. Usun lub zaimplementuj `photo-portfolio.tsx` (placeholder dane)

### Faza 2 -- Krotkoterminowa (1-2 tygodnie)
5. Przekonwertuj `marquee.js` na TypeScript
6. Wyeliminuj duplikacje: `AppleCards.tsx` vs `ui/apple-cards-carousel.tsx`
7. Wyodrebnij `socials` do wspolnego pliku constants
8. Dodaj `useBodyScrollLock` hook zamiast bezposredniej manipulacji `document.body.style`
9. Napraw wycieki listenerow w GoogleMap markers

### Faza 3 -- Sredniookresowa (refactoring)
10. Rozbij `page.tsx` useEffect na custom hooks
11. Usun zakomentowany kod z Services.tsx, kontakt/page.tsx, portfolio/page.tsx
12. Ujednolic konwencje nazewnictwa plikow
13. Dodaj obsluge klawiatury (Escape) do YoutubeVideosGrid i photo-portfolio modali
14. Zastap `frameBorder="0"` CSS `border: none`
15. Dodaj `aria-label` do przyciskow nawigacyjnych karuzeli

---

## 5. Pozytywne aspekty

Warto docenic nastepujace dobre praktyki w projekcie:

1. **`app/lib/email.tsx`** -- Wzorcowa implementacja: server-side walidacja Zod, rate limiting, brak open relay (wiadomosci ida do wlasciciela, nie do uzytkownika), replyTo zamiast from.

2. **`app/context/AudioContext.tsx`** -- Czysty, minimalny context pattern z poprawnym error handling w `useAudio()`.

3. **`app/components/LazyComponents.tsx`** -- Dobrze zaprojektowany system lazy loading z IntersectionObserver + dynamic import + Suspense fallbacks.

4. **`app/components/PanoramaScroll.tsx`** -- Wzorowy cleanup: dispose geometry, material, texture, renderer; disconnect observer; cancel animation frame.

5. **`app/components/GoogleMap/GoogleMap.tsx`** -- Error boundary + Suspense + memo + loading states.

6. **`app/components/GlitchedVideoHero.tsx`** -- Inteligentne podejscie do layoutu (debounced resize, binary search font fitting, responsive breakpoints).

7. **GSAP cleanup** w `page.tsx` (linie 671-686) -- Poprawne usuwanie Lenis, ScrollTrigger defaults, event listenerow i animacji.
