# Audyt: znikające sekcje na stronie głównej (czarny środek strony)

**Data:** 2026-06-14
**Komponent:** `app/components/HomeAnimations.tsx` (+ powiązane: `page.tsx`, `globals.css`, `lib/animations.ts`)
**Zgłoszenie:** zrzut `docs/errors/2026-06-14 13_58_59-.png` — czasami przy wczytaniu strony środek (sekcje Cards / Portfolio / Intro / Panorama) jest pusty/czarny, widać tylko górę (hero) i dół (Filmy).

---

## 1. Jak to działa (kontekst)

Cała strona główna jest opakowana w `<HomeAnimations>`. Środkowe sekcje (kafle „Cards", galerie „Portfolio", neon „Intro", „Panorama") są **przypięte** (po angielsku *pinned* — element zostaje „przyklejony" na ekranie podczas przewijania) i sterowane biblioteką **GSAP ScrollTrigger** (animacje zależne od pozycji przewijania) razem z **Lenis** (płynne przewijanie).

Kluczowe: te sekcje są **domyślnie niewidoczne** i pokazują się dopiero, gdy ScrollTrigger wyliczy poprawne pozycje i odpali odsłonięcie:
- `globals.css:677` — `.card-title h2 { opacity: 0 }`
- `globals.css:644` — `.card-dim { opacity: 0 }`
- `HomeAnimations.tsx:145` — opis karty `opacity: 0`
- `HomeAnimations.tsx:430, 457` — poprzednia karta / galeria zanikają do `opacity: 0` (animacje typu *scrub*, sterowane pozycją).

Jeśli pomiar pozycji jest błędny, przypięty stos „składa się" i/lub treść zostaje na `opacity: 0` → na czarnym tle strony widać pustkę. To zgadza się ze zrzutem.

---

## 2. Główna przyczyna (najpewniejsza) — wyścig ze zdarzeniem `load`

`HomeAnimations.tsx:671-675`:

```js
const onLoadRefresh = () => {
  ScrollTrigger.refresh();   // przelicz pozycje przypięć po załadowaniu obrazów/fontów
  revealActiveTexts();
};
window.addEventListener("load", onLoadRefresh, { once: true });
```

**Problem:** nie ma sprawdzenia, czy strona już się załadowała. Jeśli w momencie uruchomienia tego kodu strona **jest już wczytana** (`document.readyState === "complete"` — częste przy szybkim łączu, z pamięci podręcznej, przy odświeżeniu), zdarzenie `load` **już się odpaliło i nie odpali ponownie** → `ScrollTrigger.refresh()` po załadowaniu obrazów **nigdy się nie wykona**.

Skutek: pozycje przypięć pozostają takie, jak wyliczono na samym początku (zanim obrazy dostały wysokość, zanim wczytał się font Bebas) → przypięcia są policzone źle → przypięty stos zapada się / treść nie zostaje odsłonięta → **czarny środek**.

**Dlaczego „czasami":** to wyścig. Czasem `load` zdąży się odpalić po zamontowaniu komponentu (działa OK), a czasem przed (błąd). Stąd losowość.

**Dowód, że to wzorzec znany w projekcie, ale tu pominięty:** `PerformanceMonitor.tsx:177` robi to poprawnie:
```js
if (document.readyState === 'complete') { /* od razu */ }
else { window.addEventListener('load', ...) }
```
`HomeAnimations` tego zabezpieczenia **nie ma**.

---

## 3. Przyczyny współtowarzyszące (pogłębiają problem / dają nawroty)

### 3a. Brak odświeżenia po wczytaniu fontów
Nigdzie nie ma `document.fonts.ready → ScrollTrigger.refresh()`. Font **Bebas** zmienia wymiary tekstu po podmianie; przypięcia policzone przed podmianą fontu są przesunięte.

### 3b. `scrollRestoration: true` + przywracanie pozycji przy odświeżeniu
`next.config.js:57` ma włączone przywracanie pozycji przewijania. Po odświeżeniu strony przeglądarka może „wrzucić" użytkownika w środek przypiętego stosu. Odsłonięcia kart działają przez zdarzenia `onEnter`/`onEnterBack` (przekroczenie progu) — a jeśli użytkownik startuje już za progiem, zdarzenie się nie odpala i tekst zostaje niewidoczny.

### 3c. Awaryjne odsłonięcie jest puste (nie działa)
`revealActiveTexts()` (`HomeAnimations.tsx:507`) miał odsłaniać karty aktywne w chwili startu. Ale iteruje po tablicy `textTriggers`, która **jest pusta** (komentarz `:504-505`: „No separate text triggers needed" — triggery tekstu wcielono do przypięć). Czyli funkcja awaryjna **nic nie robi** → przy starcie w środku strony nie ma żadnego ratunku dla niewidocznego tekstu.

### 3d. Przedwczesny `ScrollTrigger.refresh()`
`HomeAnimations.tsx:50` woła `refresh()` synchronicznie zaraz po konfiguracji Lenis, zanim układ/obrazy się ustabilizują — ten pomiar i tak jest niepewny, a (przez 2.) bywa jedynym.

### 3e. (drobne, nie-błąd) Zostawione logi diagnostyczne
`lib/animations.ts:13-14, 31, 42` — `console.log("[AnimateIn] …")` w kodzie produkcyjnym. Do usunięcia (hałas w konsoli), nie wpływa na błąd.

---

## 4. Rekomendowane naprawy (propozycja, kolejność wg ważności)

1. **Zabezpieczyć `load` (główna naprawa):** jeśli `document.readyState === "complete"`, wywołać `onLoadRefresh()` od razu (przez `requestAnimationFrame`); w przeciwnym razie nasłuchiwać `load`. To usuwa wyścig.
2. **Odświeżyć po fontach:** `document.fonts?.ready.then(() => ScrollTrigger.refresh())`.
3. **Naprawić awaryjne odsłonięcie:** zamiast pustej `revealActiveTexts()` przejść po realnie utworzonych przypięciach i odsłonić te aktywne na starcie (albo dodać jednorazowy `IntersectionObserver` na każdej karcie — odporny na złe pomiary, tak jak już zrobiono dla „Outro" w tym samym pliku, `:619-633`).
4. **Rozważyć** wyłączenie `scrollRestoration` na stronie głównej lub wymuszenie startu od góry, dopóki układ z przypięciami jest tak wrażliwy.
5. **Posprzątać** `console.log` w `lib/animations.ts`.

> Uwaga: naprawy 1–2 są małe i niskiego ryzyka — najpierw je, potem weryfikacja na żywo (twarde odświeżanie z pamięci podręcznej i bez). 3–4 to większa zmiana zachowania — wdrożyć osobno.

---

## 5. Jak potwierdzić diagnozę (test ręczny)

1. Otworzyć stronę główną, `npm run dev`.
2. Odświeżać **wielokrotnie** (Ctrl+R i Ctrl+Shift+R) na szybkim łączu / z włączoną pamięcią podręczną — błąd powinien pojawiać się losowo.
3. W konsoli sprawdzić, czy po starcie nie ma `ScrollTrigger.refresh()` (gdy `load` już minął).
4. Po naprawie #1 błąd powinien zniknąć (pozycje przeliczane zawsze, niezależnie od wyścigu).
