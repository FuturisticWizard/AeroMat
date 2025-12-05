# Burza Mózgów: Animacja Cards na Mobile

**Data:** 2024-12-05  
**Status:** Do rozważenia  
**Priorytet:** Średni-Wysoki

---

## Obecne problemy (prawdopodobne):

1. **Pinning ScrollTrigger** - często glitchy na iOS Safari
2. **Performance** - animacje scale/transform są ciężkie na słabszych telefonach
3. **Długość scrollowania** - `+=300vh` może być frustrująca na małym ekranie
4. **Lenis + ScrollTrigger** - konflikty z native touch scrolling

---

## 💡 Opcje rozwiązań:

### Opcja A: Całkowicie inna animacja na mobile

```
- Wykryj mobile (media query lub JS)
- Na mobile: proste fade-in/slide-up przy wejściu w viewport
- Na desktop: obecna animacja scroll-driven
```

**Pros:** 
- Najlepszy UX na obu platformach
- Pełna kontrola nad doświadczeniem mobile

**Cons:** 
- Więcej kodu do utrzymania
- Duplikacja logiki

**Implementacja:**
```typescript
const isMobile = window.matchMedia("(max-width: 768px)").matches;

if (isMobile) {
  // Proste animacje intersection observer
  cards.forEach((card) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top 80%",
      onEnter: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.6 }),
    });
  });
} else {
  // Obecna pełna animacja
}
```

---

### Opcja B: Uproszczona wersja na mobile

```
- Bez pinowania kart
- Krótsze animacje (+=100vh zamiast +=300vh)
- Bez scale na obrazach (tylko opacity)
- Bez marquee na pierwszej karcie
```

**Pros:** 
- Jeden kod, warunkowe parametry
- Łatwiejsze utrzymanie

**Cons:** 
- Mniej efektowne
- Kompromis między platformami

**Implementacja:**
```typescript
const isMobile = window.matchMedia("(max-width: 768px)").matches;

ScrollTrigger.create({
  trigger: introCard,
  start: "top top",
  end: isMobile ? "+=100vh" : "+=300vh",
  pin: !isMobile, // Bez pinowania na mobile
  // ...
});
```

---

### Opcja C: Natywny CSS scroll-snap

```
- Na mobile: CSS scroll-snap zamiast GSAP
- scroll-snap-type: y mandatory
- Każda karta to osobna "strona"
```

**Pros:** 
- Natywne, płynne, bez JS
- Świetne wsparcie na iOS

**Cons:** 
- Mniej kontroli nad animacjami
- Może kolidować z resztą strony

**Implementacja CSS:**
```css
@media (max-width: 768px) {
  .cards {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: 100vh;
  }
  
  .card {
    scroll-snap-align: start;
    height: 100vh;
  }
}
```

---

### Opcja D: Wyłącz animację na mobile

```
- matchMedia("(max-width: 768px)") 
- Na mobile: statyczne karty bez animacji
- Focus na treść, nie efekty
```

**Pros:** 
- Najszybsze wdrożenie
- Zero problemów z performance
- Mniej możliwości bugów

**Cons:** 
- Mniej atrakcyjne wizualnie
- Brak "wow" efektu na mobile

**Implementacja:**
```typescript
const isMobile = window.matchMedia("(max-width: 768px)").matches;

if (!isMobile) {
  // Cała logika animacji tylko na desktop
  initCardsAnimation();
}
```

---

## 🎯 Rekomendacja

**Opcja A lub B** - zależy od priorytetów:

| Kryterium | Opcja A | Opcja B |
|-----------|---------|---------|
| WOW efekt | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Czas wdrożenia | ⭐⭐ | ⭐⭐⭐⭐ |
| Utrzymanie | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## Pytania do rozstrzygnięcia

1. Co konkretnie nie działa? (glitchy scroll, zacina się, nie widać animacji?)
2. Na jakich urządzeniach testujesz? (iOS Safari, Android Chrome?)
3. Czy wolisz zachować efekt "karty na sobie" czy możemy pójść w innym kierunku?
4. Jaki jest budżet czasowy na tę poprawkę?

---

## Następne kroki

- [ ] Zebrać feedback od użytkowników mobile
- [ ] Zdecydować która opcja
- [ ] Implementacja wybranej opcji
- [ ] Testy na różnych urządzeniach (iOS Safari, Android Chrome)
- [ ] Performance profiling przed/po

---

## Powiązane pliki

- `app/components/Cards.tsx` - komponent kart
- `app/page.tsx` - logika animacji GSAP
- `app/globals.css` - style kart
- `app/lib/animations.ts` - funkcje animacji

