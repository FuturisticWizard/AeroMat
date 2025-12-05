# Epic: Performance Optimization & Modernizacja

## Opis Epic
Jako użytkownik strony Aeromat chcę aby strona ładowała się szybko i działała płynnie na wszystkich urządzeniach, aby móc sprawnie przeglądać portfolio i skontaktować się z firmą.

## Business Value
- **Konwersja**: +25% lepsze conversion rates przy szybszym ładowaniu
- **SEO**: Wyższe pozycje w Google dzięki Core Web Vitals
- **UX**: Lepsze wrażenia użytkownika na mobile
- **Maintenance**: Łatwiejsze utrzymanie dzięki nowoczesnym zależnościom

## Success Criteria
- [ ] Lighthouse Performance Score: 90+
- [ ] Lighthouse Accessibility Score: 95+
- [ ] Lighthouse SEO Score: 100
- [ ] Core Web Vitals: All green
- [ ] Bundle size reduction: 30%+
- [ ] Brak security vulnerabilities

## Stories w Epic

### 1. Modernizacja Frameworka
**Jako developer** chcę zaktualizować Next.js i React do najnowszych wersji, aby wyeliminować security vulnerabilities i korzystać z najnowszych features.

**Acceptance Criteria:**
- [ ] Next.js upgraded do v16
- [ ] React upgraded do v19
- [ ] Wszystkie testy passują po upgrade
- [ ] Brak breaking changes w UI
- [ ] Security audit: 0 vulnerabilities

**Estimate:** 8 SP | **Priority:** High | **Zespół:** Frontend

---

### 2. Optymalizacja Obrazów i Media
**Jako użytkownik** chcę aby obrazy w galerii ładowały się szybko, aby móc sprawnie przeglądać portfolio.

**Acceptance Criteria:**
- [ ] Wszystkie obrazy w formacie WebP/AVIF
- [ ] Implementacja lazy loading dla galerii
- [ ] Responsive images (różne rozmiary dla różnych urządzeń)
- [ ] Blur placeholder podczas ładowania
- [ ] Kompresja video files (hero section)
- [ ] Image optimization w next.config.js

**Estimate:** 13 SP | **Priority:** High | **Zespół:** Frontend

---

### 3. Bundle Size Optimization
**Jako użytkownik na słabszym połączeniu** chcę aby strona ładowała się szybko, aby nie czekać długo na załadowanie treści.

**Acceptance Criteria:**
- [ ] Dynamic imports dla Three.js components
- [ ] Tree shaking dla unused dependencies
- [ ] Code splitting na route level
- [ ] Usunięcie duplicate dependencies
- [ ] Font optimization (local fonts zamiast Google Fonts)
- [ ] Bundle analyzer report

**Estimate:** 8 SP | **Priority:** Medium | **Zespół:** Frontend

---

### 4. Three.js Performance Tuning
**Jako użytkownik** chcę aby 3D animacje działały płynnie, aby doświadczenie nie było przerywane przez lag.

**Acceptance Criteria:**
- [ ] Reduced polygon count w 3D models
- [ ] Proper cleanup w useEffect hooks
- [ ] Memory leak fixes w GSAP animations
- [ ] Performance monitoring dla Three.js
- [ ] Fallback dla devices bez WebGL support
- [ ] Throttling dla animations na mobile

**Estimate:** 13 SP | **Priority:** Medium | **Zespół:** Frontend

---

### 5. Critical Path CSS
**Jako użytkownik** chcę aby strona renderowała się szybko, aby widzieć treść bez flash of unstyled content.

**Acceptance Criteria:**
- [ ] Inline critical CSS w <head>
- [ ] Async loading dla non-critical CSS
- [ ] Removed unused Tailwind classes
- [ ] Optimized CSS delivery
- [ ] Reduced CLS (Cumulative Layout Shift)

**Estimate:** 5 SP | **Priority:** Medium | **Zespół:** Frontend

---

## Dependencies
- **Epic Security Enhancement** - niektóre security patches potrzebne przed performance work
- **Epic Testing Infrastructure** - potrzebne dla regression testing

## Risks
- **Breaking Changes**: React 19 może mieć breaking changes
- **Three.js Compatibility**: Starsze wersje Three.js mogą mieć problemy z nowszymi browsers
- **Performance vs Features**: Niektóre optymalizacje mogą wpłynąć na user experience

## Timeline
**Sprint 1-2:** Framework modernization, Security fixes
**Sprint 3-4:** Image optimization, Bundle optimization  
**Sprint 5:** Three.js tuning, CSS optimization

## Metrics to Track
- **Before/After Lighthouse scores**
- **Page load times** (LCP, FCP, FID)
- **Bundle sizes** (main bundle, chunk sizes)
- **Memory usage** (Three.js scenes)
- **User engagement** (bounce rate, session duration)