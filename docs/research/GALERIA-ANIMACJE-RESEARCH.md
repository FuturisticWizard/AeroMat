# Research: Animacje Galerii Zdjec

> Data: 2026-03-07
> Autor: Claude (CTO)
> Cel: Analiza techniczna implementacji animacji scroll-triggered dla galerii obrazow

---

## Spis tresci

1. [Framer Motion vs GSAP - Porownianie](#1-framer-motion-vs-gsap---porownanie)
2. [Krzywe Easing (Cubic-Bezier)](#2-krzywe-easing-cubic-bezier)
3. [Optymalizacja wydajnosci na mobile](#3-optymalizacja-wydajnosci-na-mobile)
4. [Techniki animacji obrazow](#4-techniki-animacji-obrazow)
5. [Przyklady kodu](#5-przyklady-kodu)
6. [Rekomendacje](#6-rekomendacje)

---

## 1. Framer Motion vs GSAP - Porownanie

### Krotkie podsumowanie

| Aspekt | Motion (Framer Motion) | GSAP + ScrollTrigger |
|--------|------------------------|----------------------|
| **Rozmiar** | ~85KB | ~78KB (core + ScrollTrigger) |
| **Licencja** | MIT (open source) | Closed source (Webflow) |
| **Framework** | Tylko React | Framework-agnostic |
| **Scroll control** | `whileInView` / `useInView` | ScrollTrigger (scrub, pin, timeline) |
| **Timeline** | Brak natywnego systemu | `gsap.timeline()` - pelna kontrola |
| **Wydajnosc** | 2.5x szybszy od GSAP (animate from unknown) | Najlepsza dla zlozonych sekwencji |
| **DX** | Deklaratywne API, latwy w uzyciu | Imperatywne, krzywa uczenia |

### Framer Motion (Motion)

**Zalety:**
- Deklaratywne API idealnie pasujace do React
- `whileInView` i `useInView` do prostych scroll-triggered animacji
- Automatyczna optymalizacja (layout animations)
- Mniejszy narzut przy animowaniu z nieznanych wartosci

**Wady:**
- Brak prawdziwego systemu timeline
- Wymaga dodatkowego kodu dla scrub/pin
- Tylko React

**Kiedy uzywac:**
- Proste animacje reveal (fade-in, slide-in)
- Projekty React/Next.js
- Gdy priorytetem jest DX i szybkosc implementacji

### GSAP + ScrollTrigger

**Zalety:**
- Precyzyjna kontrola timeline (`gsap.timeline()`)
- Scrubbing - animacja powiazana z pozycja scrollbara
- Pinning elementow podczas scrollu
- Cross-browser consistency
- Od 2025 - calkowicie darmowy (przejecie przez Webflow)

**Wady:**
- Closed source
- Zakaz uzycia w konkurencji Webflow
- Wiekszy boilerplate dla prostych animacji

**Kiedy uzywac:**
- Zlozone sekwencje animacji
- Parallax z pinowaniem
- Precyzyjne scrubbing (animacja = scroll position)
- Projekty multi-framework

### Zrodla

- [Motion vs GSAP Comparison](https://motion.dev/docs/gsap-vs-motion)
- [GSAP vs Framer Motion - Artekia](https://www.artekia.com/en/blog/gsap-vs-framer-motion)
- [Best React Animation Libraries 2026 - LogRocket](https://blog.logrocket.com/best-react-animation-libraries/)

---

## 2. Krzywe Easing (Cubic-Bezier)

### Teoria

Krzywe easing kontroluja przyspieszenie animacji w czasie. `cubic-bezier(x1, y1, x2, y2)` definiuje krzywa Beziera gdzie:
- Os X = czas (0-1)
- Os Y = postep animacji
- x1, y1 = uchwyt startowy
- x2, y2 = uchwyt koncowy

### Najlepsze krzywe dla animacji reveal

#### Dla elementow wchodzacych na ekran (ease-out)

Elementy powinny "przybywac szybko i osiadac lagodnie":

| Nazwa | Cubic-Bezier | Opis |
|-------|--------------|------|
| **easeOutQuart** | `cubic-bezier(0.165, 0.84, 0.44, 1)` | Klasyczny reveal - naturalny, elegancki |
| **easeOutExpo** | `cubic-bezier(0.19, 1, 0.22, 1)` | Bardziej dramatyczny - szybki start |
| **easeOutCubic** | `cubic-bezier(0.215, 0.61, 0.355, 1)` | Subtelniejszy - dobry dla tekstu |
| **easeOutQuint** | `cubic-bezier(0.23, 1, 0.32, 1)` | Bardzo szybki start, powolne zatrzymanie |
| **easeOutBack** | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Z lekkim "bounce" na koncu |

#### Dla elementow opuszczajacych ekran (ease-in)

| Nazwa | Cubic-Bezier |
|-------|--------------|
| **easeInQuart** | `cubic-bezier(0.895, 0.03, 0.685, 0.22)` |
| **easeInExpo** | `cubic-bezier(0.95, 0.05, 0.795, 0.035)` |

#### Dla interakcji (ease-in-out)

| Nazwa | Cubic-Bezier |
|-------|--------------|
| **easeInOutQuart** | `cubic-bezier(0.77, 0, 0.175, 1)` |
| **easeInOutExpo** | `cubic-bezier(1, 0, 0, 1)` |
| **easeInOutCubic** | `cubic-bezier(0.645, 0.045, 0.355, 1)` |

### Pelna lista krzywych (easings-css)

```css
/* Sine */
--ease-in-sine: cubic-bezier(0.47, 0, 0.745, 0.715);
--ease-out-sine: cubic-bezier(0.39, 0.575, 0.565, 1);
--ease-in-out-sine: cubic-bezier(0.445, 0.05, 0.55, 0.95);

/* Quad */
--ease-in-quad: cubic-bezier(0.55, 0.085, 0.68, 0.53);
--ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-in-out-quad: cubic-bezier(0.455, 0.03, 0.515, 0.955);

/* Cubic */
--ease-in-cubic: cubic-bezier(0.55, 0.055, 0.675, 0.19);
--ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
--ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);

/* Quart - REKOMENDOWANE dla reveal */
--ease-in-quart: cubic-bezier(0.895, 0.03, 0.685, 0.22);
--ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
--ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);

/* Quint */
--ease-in-quint: cubic-bezier(0.755, 0.05, 0.855, 0.06);
--ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out-quint: cubic-bezier(0.86, 0, 0.07, 1);

/* Expo - DRAMATYCZNE efekty */
--ease-in-expo: cubic-bezier(0.95, 0.05, 0.795, 0.035);
--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
--ease-in-out-expo: cubic-bezier(1, 0, 0, 1);

/* Circ */
--ease-in-circ: cubic-bezier(0.6, 0.04, 0.98, 0.335);
--ease-out-circ: cubic-bezier(0.075, 0.82, 0.165, 1);
--ease-in-out-circ: cubic-bezier(0.785, 0.135, 0.15, 0.86);

/* Back - z "bounce" / overshoot */
--ease-in-back: cubic-bezier(0.6, -0.28, 0.735, 0.045);
--ease-out-back: cubic-bezier(0.175, 0.885, 0.32, 1.275);
--ease-in-out-back: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Narzedzia

- [easings.net](https://easings.net/) - wizualna sciaga z wszystkimi krzywymi
- [cubic-bezier.com](https://cubic-bezier.com/) - interaktywny edytor krzywych
- [curveeditor.com](https://curveeditor.com/) - edytor z podgladem animacji

### Zrodla

- [easings-css - npm](https://www.npmjs.com/package/easings-css)
- [GitHub - jacobbuck/easings-css](https://github.com/jacobbuck/easings-css)
- [Josh Collinsworth - Easing Curves](https://joshcollinsworth.com/blog/easing-curves)

---

## 3. Optymalizacja wydajnosci na mobile

### Cel: 60 FPS (16.67ms per frame)

Plynna animacja wymaga renderowania nowej klatki co 16.67ms. Ponizej 60fps uzytkownik odczuwa "lag".

### Zasada #1: Animuj tylko transform i opacity

Te wlasciwosci sa **hardware-accelerated** i pomijaja etapy Layout i Paint:

```css
/* DOBRE - GPU accelerated */
transform: translateX(100px);
transform: scale(1.2);
transform: rotate(45deg);
opacity: 0.5;

/* ZLE - triggeruja Layout/Paint */
width: 100px;
height: 100px;
top: 50px;
left: 50px;
margin: 20px;
border-radius: 50%;
```

### Zasada #2: Unikaj animacji wyzwalajacych Layout

| Etap | Wlasciwosci | Koszt |
|------|-------------|-------|
| **Layout** | width, height, margin, padding, top, left | WYSOKI |
| **Paint** | background, color, border, box-shadow, clip-path | SREDNI |
| **Composite** | transform, opacity | NISKI (GPU) |

### Zasada #3: Wymuszaj GPU compositing

```css
.animated-element {
  /* Wymusza utworzenie warstwy GPU */
  will-change: transform;
  /* lub */
  transform: translateZ(0);
  /* lub */
  transform: translate3d(0, 0, 0);
}
```

**UWAGA:** Zbyt wiele warstw GPU = negatywny wplyw na mobile! Uzywaj oszczednie.

### Zasada #4: Uzywaj requestAnimationFrame

```javascript
// ZLE
setInterval(() => {
  element.style.transform = `translateX(${x++}px)`;
}, 16);

// DOBRE
function animate() {
  element.style.transform = `translateX(${x++}px)`;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

### Zasada #5: CSS animations > JS animations

Animacje CSS dzialaja na **compositor thread** - oddzielnie od JavaScript i obliczen layout.

```css
/* Preferowane - dziala na compositor thread */
.reveal {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Zasada #6: Web Animations API (WAAPI)

Motion One (nastepca Motion/Framer Motion) uzywa WAAPI - animacje dzialaja na compositor thread:

```javascript
import { animate } from "motion";

animate(element, { opacity: 1, transform: "translateY(0)" }, {
  duration: 0.5,
  easing: [0.165, 0.84, 0.44, 1] // easeOutQuart
});
```

### Rekomendowane czasy animacji

Google Material Design zaleca:
- **100-300ms** - optymalne dla przejsc
- **>500ms** - zaburza flow uzytkownika

### Zrodla

- [60 FPS Web Animations - Algolia](https://www.algolia.com/blog/engineering/60-fps-performant-web-animations-for-optimal-ux)
- [Achieve 60 FPS with CSS3 - SitePoint](https://www.sitepoint.com/achieve-60-fps-mobile-animations-with-css3/)
- [Animation Performance - MDN](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate)
- [Motion Performance Guide](https://motion.dev/docs/performance)

---

## 4. Techniki animacji obrazow

### Porownanie technik

| Technika | Layout | Paint | GPU | Wydajnosc | Efekt wizualny |
|----------|--------|-------|-----|-----------|----------------|
| **transform: scale** | Skip | Skip | TAK | NAJLEPSZA | Skalowanie |
| **transform: translate** | Skip | Skip | TAK | NAJLEPSZA | Przesuwanie |
| **opacity** | Skip | Skip | TAK | NAJLEPSZA | Fade |
| **clip-path** | Skip | TAK | Wkrotce* | DOBRA | Maskowanie |
| **filter: blur** | TAK | TAK | Czesciowo | SREDNIA | Rozmycie |
| **border-radius** | TAK | TAK | NIE | SLABA | Zaokraglenia |

*Chromium dodaje hardware acceleration dla clip-path

### Rekomendowana kombinacja dla reveal

```css
.image-reveal {
  /* Poczatkowy stan */
  opacity: 0;
  transform: scale(1.1) translateY(20px);

  /* Optymalizacja GPU */
  will-change: opacity, transform;
}

.image-reveal.visible {
  opacity: 1;
  transform: scale(1) translateY(0);
  transition: opacity 0.6s cubic-bezier(0.165, 0.84, 0.44, 1),
              transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}
```

### Technika: Clip-path reveal

Clip-path pozwala na kreatywne "odslananie" obrazu:

```css
.clip-reveal {
  clip-path: inset(50% 50% 50% 50%); /* Ukryty */
}

.clip-reveal.visible {
  clip-path: inset(0% 0% 0% 0%); /* Widoczny */
  transition: clip-path 0.8s cubic-bezier(0.77, 0, 0.175, 1);
}
```

**Warianty clip-path:**
- `inset()` - prostokatne maskowanie
- `circle()` - koliste odslananie
- `polygon()` - niestandardowe ksztalty

### Technika: Scale + Overflow

Klasyczna technika GSAP - obraz jest skalowany podczas gdy kontener ma overflow: hidden:

```css
.reveal-container {
  overflow: hidden;
}

.reveal-image {
  transform: scale(1.3);
  transition: transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.reveal-image.visible {
  transform: scale(1);
}
```

### Technika: Blur reveal

```css
.blur-reveal {
  filter: blur(15px);
  opacity: 0;
  transform: scale(1.05);
}

.blur-reveal.visible {
  filter: blur(0);
  opacity: 1;
  transform: scale(1);
  transition: filter 0.8s ease-out,
              opacity 0.6s ease-out,
              transform 0.8s ease-out;
}
```

**UWAGA:** `filter: blur()` jest kosztowny na high-resolution images. Rozwazyc:
- Uzycie mniejszej rozdzielczosci
- Zmniejszenie blur radius (15px -> 8-10px)
- Dodanie `will-change: filter`

### Zrodla

- [CSS Reveal Animations - FreeFrontend](https://freefrontend.com/css-reveal-animations/)
- [CSS Image Effects - Prismic](https://prismic.io/blog/css-image-effects)
- [Animating clip-path - LogRocket](https://blog.logrocket.com/guide-to-css-animations-using-clip-path/)
- [Chrome Hardware Accelerated Animations](https://developer.chrome.com/blog/hardware-accelerated-animations)

---

## 5. Przyklady kodu

### 5.1 GSAP ScrollTrigger - Image Reveal

Zrodlo: [GitHub Gist - Cameron Knight](https://gist.github.com/devbob01/91e03c245dcbb99f930c249143f30f5a)

```html
<!-- HTML -->
<div class="container">
  <div class="reveal">
    <img src="image.jpg" alt="Reveal image">
  </div>
</div>
```

```css
/* CSS */
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  position: relative;
}

img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transform-origin: left;
}

.reveal {
  visibility: hidden;
  position: relative;
  width: 80%;
  height: 80%;
  max-width: 500px;
  overflow: hidden;
}
```

```javascript
// JavaScript
gsap.registerPlugin(ScrollTrigger);

const revealContainers = document.querySelectorAll(".reveal");

revealContainers.forEach((container) => {
  const image = container.querySelector("img");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      toggleActions: "restart none none reset"
    }
  });

  tl.set(container, { autoAlpha: 1 });

  // Kontener wjezdza z lewej
  tl.from(container, {
    duration: 1.5,
    xPercent: -100,
    ease: "power2.out"
  });

  // Obraz wjezdza z prawej + scale
  tl.from(image, {
    duration: 1.5,
    xPercent: 100,
    scale: 1.3,
    ease: "power2.out"
  }, "-=1.5"); // Start rownoczesnie z kontenerem
});
```

### 5.2 Framer Motion - whileInView

```tsx
// React/Next.js component
import { motion } from "framer-motion";

export function ImageReveal({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        ease: [0.165, 0.84, 0.44, 1] // easeOutQuart
      }}
      className="overflow-hidden"
    >
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1.2 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 1.2,
          ease: [0.165, 0.84, 0.44, 1]
        }}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}
```

### 5.3 Vanilla JS + Intersection Observer (bez bibliotek)

```typescript
// utils/createScrollReveal.ts
interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function createScrollReveal(options: RevealOptions = {}) {
  const { threshold = 0.2, rootMargin = "-50px", once = true } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold, rootMargin }
  );

  return {
    observe: (element: Element) => observer.observe(element),
    disconnect: () => observer.disconnect()
  };
}
```

```css
/* CSS dla Intersection Observer */
.reveal-image {
  opacity: 0;
  transform: translateY(30px) scale(1.05);
  transition:
    opacity 0.6s cubic-bezier(0.165, 0.84, 0.44, 1),
    transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.reveal-image.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}
```

### 5.4 CSS Scroll-Driven Animations (nowosc!)

```css
/* Nowoczesne API - animation-timeline: view() */
.gallery-image {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

@keyframes reveal {
  from {
    opacity: 0;
    clip-path: inset(20% 20% 20% 20%);
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    clip-path: inset(0% 0% 0% 0%);
    transform: scale(1);
  }
}
```

### 5.5 React Hook - useInView z Framer Motion

```tsx
// hooks/useImageReveal.ts
import { useRef } from "react";
import { useInView, MotionValue, useTransform, useScroll } from "framer-motion";

export function useImageReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 1.1
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.165, 0.84, 0.44, 1]
      }
    }
  };

  return { ref, isInView, variants };
}

// Uzycie w komponencie
function GalleryImage({ src }: { src: string }) {
  const { ref, isInView, variants } = useImageReveal();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    >
      <img src={src} alt="" />
    </motion.div>
  );
}
```

### Przyklady CodePen

- [Image reveal animation using GSAP ScrollTrigger](https://codepen.io/cameronknight/pen/pogQKwR)
- [Image Reveal without dependencies](https://codepen.io/cameronknight/pen/WNwZORV)
- [Reveal Gallery Images - Top-to-Bottom](https://codepen.io/tutsplus/pen/ZEdZoje)
- [Scroll to view gallery](https://codepen.io/GreenSock/pen/wvKwZXG)
- [Photo gallery with Scroll Driven Animation](https://codepen.io/argyleink/pen/LEYOgxy)

---

## 6. Rekomendacje

### Dla projektu Next.js + shadcn/ui

#### Opcja A: Framer Motion (REKOMENDOWANA)

**Zalety:**
- Juz zainstalowana w wielu projektach shadcn/ui
- Deklaratywne API pasujace do React
- `whileInView` idealny dla prostych reveal
- Dobra wydajnosc na mobile

**Implementacja:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{
    duration: 0.6,
    ease: [0.165, 0.84, 0.44, 1]
  }}
>
  <Image src={...} />
</motion.div>
```

#### Opcja B: GSAP ScrollTrigger

**Kiedy wybrac:**
- Potrzebujesz scrubbing (animacja = scroll position)
- Zlozone timeline z wieloma elementami
- Pinowanie elementow podczas scroll

**Instalacja:**
```bash
npm install gsap
```

**Implementacja:**
```tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function GalleryWithGSAP() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gallery-item", {
        y: 100,
        opacity: 0,
        scale: 1.1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      {/* gallery items */}
    </div>
  );
}
```

### Najlepsze praktyki

1. **Animuj tylko transform i opacity** - GPU accelerated
2. **Uzyj easeOutQuart** `[0.165, 0.84, 0.44, 1]` jako domyslnej krzywej
3. **Czas 0.5-0.8s** dla reveal, max 1.2s dla dramatycznych efektow
4. **viewport={{ once: true }}** - animacja raz, nie przy kazdym scroll
5. **margin: "-100px"** - trigger wczesniej niz element jest widoczny
6. **Lazy loading obrazow** - animacja + optymalizacja ladowania
7. **will-change: transform** - tylko na animowanych elementach

### Podsumowanie technik

| Cel | Technika | Wlasciwosci |
|-----|----------|-------------|
| Fade-in | opacity | `opacity: 0 -> 1` |
| Slide-up | transform | `translateY(40px) -> 0` |
| Zoom-out | transform | `scale(1.1) -> 1` |
| Wipe/Reveal | clip-path | `inset(50%) -> inset(0)` |
| Blur reveal | filter | `blur(10px) -> blur(0)` (kosztowne!) |

---

## Zrodla i linki

### Dokumentacja
- [Framer Motion - useInView](https://motion.dev/docs/react-use-in-view)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [MDN - Animation Performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate)

### Tutoriale
- [Codrops - Layered Zoom Scroll Effect](https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/)
- [Codrops - WebGL Gallery](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/)
- [LogRocket - React Scroll Animations](https://blog.logrocket.com/react-scroll-animations-framer-motion/)

### Repozytoria
- [GitHub - GSAP Image Reveal](https://github.com/Rajacharles/GSAP-Image-Reveal-Animation-using-ScrollTrigger)
- [GitHub - Awesome GSAP](https://github.com/zhengdechang/awesome-gsap)
- [GitHub - easings-css](https://github.com/jacobbuck/easings-css)

### Narzedzia
- [easings.net](https://easings.net/)
- [cubic-bezier.com](https://cubic-bezier.com/)
- [curveeditor.com](https://curveeditor.com/)
