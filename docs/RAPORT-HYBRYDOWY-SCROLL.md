# Raport: Koncepcja Hybrydowego Scrolla

**Projekt:** AeroMat
**Data:** 7 marca 2026
**Autorzy:** Zespół agentów BMad Method (UX Designer, Frontend Developer, Backend Architect)

---

## Spis treści

1. [Streszczenie wykonawcze](#1-streszczenie-wykonawcze)
2. [Analiza UX](#2-analiza-ux)
3. [Analiza techniczna GSAP](#3-analiza-techniczna-gsap)
4. [Architektura React/Next.js](#4-architektura-reactnextjs)
5. [Rekomendacje](#5-rekomendacje)
6. [Alternatywy](#6-alternatywy)

---

## 1. Streszczenie wykonawcze

### Opis koncepcji

Użytkownik zaproponował wstawienie sekcji Portfolio pomiędzy pinowane karty w animacji scrolla. Konkretnie:

1. Pierwsza karta - pełna animacja (jak obecnie)
2. **Portfolio** - naturalny scroll przez galerię zdjęć
3. Kolejne karty - kontynuacja pinowanej animacji

### Główne wnioski

| Aspekt | Ocena | Komentarz |
|--------|-------|-----------|
| **UX** | Ryzykowny | Przerwanie flow pinowania może być dezorientujące |
| **Technicznie** | Możliwy | Wymaga zaawansowanej konfiguracji ScrollTrigger |
| **Wydajność** | Neutralny | Nie pogorszy wydajności przy prawidłowej implementacji |
| **Rekomendacja** | Ostrożna | Wymaga prototypu i testów użytkowników |

---

## 2. Analiza UX

### 2.1 Wzorce hybrydowego scrolla

**Znane przykłady:**
- Apple.com (iPhone product pages) - mieszanie pinned sections z normalnym scroll
- Stripe.com - pinned hero + scrollable content sections
- Linear.app - interlaced pinned i scrollable sections

### 2.2 Problemy potencjalne

#### Problem 1: Dezorientacja użytkownika

Gdy użytkownik przyzwyczai się do pinowanego scrolla (gdzie strona "nie scrolluje" normalnie), nagłe przejście do normalnego scrolla może być mylące.

**Objawy:**
- Użytkownik może pomyśleć że strona się "zacięła"
- Utrata poczucia lokalizacji na stronie
- Frustracja przy powrocie do pinowanej sekcji

#### Problem 2: Mobile UX

Na mobile pinowany scroll jest już problematyczny. Dodanie przerw jeszcze bardziej komplikuje interakcję.

### 2.3 Rozwiązania UX

**Jeśli zdecydujesz się na implementację:**

1. **Wizualne sygnały przejścia**
   - Animacja "unpinning" przed sekcją Portfolio
   - Progress indicator pokazujący gdzie jesteś
   - Subtelny parallax na granicy sekcji

2. **Płynne przejścia**
   - Fade out ostatniej karty
   - Portfolio "wsuwa się" od dołu
   - Następna karta "czeka" na górze

3. **Konsekwentne zachowanie**
   - Albo wszystkie przerwy albo żadna
   - Nie mieszaj zbyt wielu wzorców

---

## 3. Analiza techniczna GSAP

### 3.1 Obecna architektura

```
page.tsx
├── PanoramaScroll (własne pinowanie)
└── cards.map() => ScrollTrigger.create()
    ├── card[0] - pin: start → end
    ├── card[1] - pin: start → end
    ├── card[2] - pin: start → end
    └── card[3] - pin: start → end
```

### 3.2 Propozycja hybrydowa

```
page.tsx
├── PanoramaScroll (własne pinowanie)
├── card[0] - ScrollTrigger z pin
├── UNPIN ZONE (naturalny scroll)
│   └── Portfolio (bez pinowania)
├── card[1] - ScrollTrigger z pin (nowy trigger point)
├── card[2] - ScrollTrigger z pin
└── card[3] - ScrollTrigger z pin
```

### 3.3 Implementacja GSAP

```typescript
// Pseudokod koncepcyjny
const setupHybridScroll = () => {
  const cards = document.querySelectorAll('.card');
  const portfolio = document.querySelector('.portfolio-section');

  // Pierwsza karta - standardowe pinowanie
  ScrollTrigger.create({
    trigger: cards[0],
    start: 'top top',
    end: '+=100%',
    pin: true,
    onLeave: () => {
      // Unpinuj i pozwól Portfolio się pokazać
    }
  });

  // Portfolio - BEZ pinowania
  // Po prostu naturalne scrollowanie

  // Pozostałe karty - trigger PO portfolio
  cards.slice(1).forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: () => {
        // Dynamiczny start point - po portfolio
        const portfolioBottom = portfolio.offsetTop + portfolio.offsetHeight;
        return `top+=${portfolioBottom}px top`;
      },
      end: '+=100%',
      pin: true
    });
  });
};
```

### 3.4 Wyzwania techniczne

| Wyzwanie | Rozwiązanie |
|----------|-------------|
| **Dynamiczne trigger points** | Użyj `invalidateOnRefresh: true` |
| **Resize handling** | `ScrollTrigger.refresh()` na resize |
| **Mobile conflicts** | Osobna logika dla mobile |
| **Z-index wars** | Kontrolowane stacking context |
| **Smooth transitions** | GSAP timeline dla przejść |

---

## 4. Architektura React/Next.js

### 4.1 Obecna struktura

```tsx
// page.tsx
<main>
  <PanoramaScroll />
  {cards.map(card => <CardComponent />)}
  <Portfolio /> {/* Obecnie osobna sekcja */}
</main>
```

### 4.2 Proponowana struktura

```tsx
// page.tsx z hybrydowym scrollem
<main>
  <PanoramaScroll />
  <PinnedCard index={0} />

  {/* Przerwa - naturalny scroll */}
  <ScrollBreak>
    <Portfolio />
  </ScrollBreak>

  <PinnedCardsGroup startIndex={1}>
    {remainingCards.map(card => <PinnedCard />)}
  </PinnedCardsGroup>
</main>
```

### 4.3 Nowy komponent: ScrollBreak

```tsx
// components/ScrollBreak.tsx
'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ScrollBreakProps {
  children: React.ReactNode;
  onEnter?: () => void;
  onLeave?: () => void;
}

const ScrollBreak = ({ children, onEnter, onLeave }: ScrollBreakProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Marker dla GSAP - "tu kończy się pinowanie"
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      onEnter,
      onLeave,
      markers: process.env.NODE_ENV === 'development'
    });
  }, [onEnter, onLeave]);

  return (
    <div
      ref={ref}
      className="scroll-break relative z-10"
      style={{ position: 'relative' }} // Przerywa stacking context
    >
      {children}
    </div>
  );
};
```

### 4.4 Refaktor page.tsx

Wymagałoby to znaczącego refaktoru obecnej logiki w `page.tsx`:

1. **Wydzielenie logiki pinowania do hooka** `usePinnedCards()`
2. **Obsługa przerw** przez konfigurację
3. **Dynamiczne obliczanie wysokości** sekcji

**Szacowany zakres zmian:**
- `page.tsx` - 150+ linii zmian
- Nowy komponent `ScrollBreak.tsx`
- Nowy hook `usePinnedCards.ts`
- Zmiany w CSS dla z-index

---

## 5. Rekomendacje

### 5.1 Opcja A: Nie implementuj (Rekomendowane)

**Uzasadnienie:**
- Obecny flow jest spójny i działa dobrze
- Portfolio już ma swoją sekcję po kartach
- Ryzyko UX jest wysokie
- Nakład pracy znaczący (8-12h)

**Zamiast tego:**
- Ulepsz animacje Portfolio (już zrobione)
- Dodaj smooth scroll between sections
- Rozważ lazy loading dla portfolio images

### 5.2 Opcja B: Prototyp na osobnej branch

Jeśli chcesz eksperymentować:

1. Stwórz branch `feature/hybrid-scroll`
2. Zaimplementuj podstawową wersję
3. Testuj na różnych urządzeniach
4. Zbierz feedback od użytkowników
5. Zdecyduj czy merge

### 5.3 Opcja C: Alternatywne podejście

Zamiast przerywać pinowanie, rozważ:

**"Portfolio Preview" na jednej z kart:**
- Karta z miniaturami portfolio
- Kliknięcie rozwija pełną galerię
- Modal/overlay zamiast sekcji w scroll

**"Floating Portfolio" podczas scrollowania:**
- Małe preview w rogu ekranu
- Rozwija się przy hover/tap
- Nie przerywa głównego flow

---

## 6. Alternatywy

### 6.1 Parallax Portfolio na ostatniej karcie

Zamiast osobnej sekcji, zintegruj portfolio z ostatnią kartą:

```tsx
<Card title="Portfolio">
  <ParallaxGallery images={portfolioImages} />
</Card>
```

Portfolio scrolluje się WEWNĄTRZ pinowanej karty z efektem parallax.

### 6.2 Horizontal scroll gallery

Po wszystkich kartach, sekcja portfolio ze scroll horizontalnym:

```tsx
<section className="h-screen overflow-x-scroll snap-x">
  {images.map(img => (
    <div className="w-screen h-full snap-center" />
  ))}
</section>
```

### 6.3 GSAP-powered gallery reveal

Portfolio odkrywa się stopniowo podczas scrollowania, ale bez przerywania pinowania:

- Obrazy "wlatują" z boku podczas scroll
- Tło karty rozmywa się ujawniając galerię
- Płynne przejście bez "skoku" UX

---

## Podsumowanie

Koncepcja hybrydowego scrolla jest technicznie wykonalna, ale niesie ze sobą ryzyko UX i wymaga znaczącego nakładu pracy.

**Rekomendacja:** Pozostań przy obecnej architekturze i skup się na usprawnianiu istniejących animacji. Jeśli nadal chcesz eksperymentować, stwórz prototyp na osobnej branch i przetestuj z rzeczywistymi użytkownikami.

---

*Raport przygotowany przez zespół agentów BMad Method dla projektu AeroMat.*
