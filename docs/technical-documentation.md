# Dokumentacja Techniczna - Aeromat Portfolio

## 1. Przegląd Architektury

### Stack Technologiczny
- **Framework**: Next.js 14.2.26 (App Router)
- **Frontend**: React 18.2.0 + TypeScript 5.x
- **Styling**: Tailwind CSS 3.4.17 + Custom CSS
- **Animacje**: Framer Motion 11.18.2 + GSAP 3.13.0
- **3D Graphics**: Three.js 0.168.0 + React Three Fiber 8.18.0
- **UI Components**: Radix UI + Shadcn/ui
- **Maps**: Google Maps (@vis.gl/react-google-maps)
- **Forms**: React Hook Form + Zod validation

### Struktura Katalogów
```
/app
├── components/          # Komponenty React
│   ├── ui/             # Podstawowe komponenty UI
│   ├── hero/           # Komponenty sekcji hero
│   ├── icons/          # Komponenty ikon SVG
│   ├── GoogleMap/      # Komponenty map
│   └── VideoPlayer/    # Player wideo
├── lib/                # Utilitki i konfiguracja
├── hooks/              # Custom React hooks
├── blog/               # Strona blog
├── firma/              # Strona o firmie
├── kontakt/            # Strona kontakt
├── portfolio/          # Strona portfolio
└── process/            # Strona proces

/public
├── images/             # Zdjęcia projektów
├── movies/             # Pliki wideo
├── icons/              # Ikony i grafiki
└── pngs/               # Grafiki PNG
```

## 2. Analiza Komponenty

### Główne Komponenty

#### VideoHero (`components/hero/VideoHero.tsx`)
- **Funkcja**: Sekcja hero z autoodtwarzanym wideo tłem
- **Features**: Responsive video, lazy loading
- **Pliki**: `/public/movies/hero_compressed.mp4`

#### Portfolio (`components/Portfolio.tsx`)
- **Funkcja**: Galeria projektów z lightbox
- **Biblioteki**: yet-another-react-lightbox, react-photo-album
- **Animacje**: Framer Motion (staggered animations)

#### Services (`components/Services.tsx`)
- **Funkcja**: Prezentacja usług w formie kart
- **Design**: Apple Cards style carousel
- **Features**: Touch/mouse interactions

#### MuralsMap (`components/MuralsMap.tsx`)
- **Funkcja**: Interaktywna mapa realizacji
- **API**: Google Maps API
- **Features**: Custom markers, clustering

#### ThreeCanvas (`components/ThreeCanvas.tsx`)
- **Funkcja**: 3D wizualizacja spray can
- **Biblioteki**: Three.js, React Three Fiber
- **Animacje**: GSAP rotation animations
- **Loading**: Dynamic import (SSR disabled)

#### VideoPlayer (`components/VideoPlayer/VideoPlayer.tsx`)
- **Problem**: Używa przestarzałe `react-player-controls`
- **Features**: Custom controls, fullscreen support
- **Issues**: Compatibility problems z nowszymi wersjami

## 3. Analiza Wydajności

### Zidentyfikowane Problemy

#### 🔴 Krytyczne
1. **Brak optymalizacji obrazów**
   - Duże pliki w `/public/images/` (niektóre >2MB)
   - Brak WebP/AVIF variants
   - Brak responsive images

2. **Nieefektywne ładowanie wideo**
   - Autoplay wideo na hero sekcji
   - Brak preload="metadata"
   - Multiple video formats bez compression

3. **Problemy z Three.js**
   - Brak cleanup w useEffect
   - Nieoptymalne geometrie (32 segments for cylinder)
   - Memory leaks w animacjach GSAP

#### 🟡 Średnie
1. **Bundle Size**
   - Three.js ecosystem (~500KB)
   - Multiple animation libraries (Framer Motion + GSAP)
   - Unused Google Fonts

2. **CSS Issues**
   - External Google Fonts (render blocking)
   - Large Tailwind safelist (45+ classes)
   - Redundant CSS w globals.css

3. **Client-side Only Components**
   - ThreeCanvas wyłączone SSR
   - Dynamic imports nie są używane konsekwentnie

#### 🟢 Niskie
1. **Code Quality**
   - Zakomentowany kod w Images.tsx
   - Unused imports
   - Inconsistent naming conventions

### Rekomendacje Optymalizacji

#### Obrazy i Media
```typescript
// 1. Użyj Next.js Image component wszędzie
import Image from 'next/image'

// 2. Dodaj blur placeholder
<Image
  src="/images/mural.jpg"
  alt="Mural"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// 3. Skonfiguruj image optimization w next.config.js
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

#### Performance Monitoring
```typescript
// 4. Dodaj performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

export function reportWebVitals({ name, value }: any) {
  console.log(name, value)
  // Send to analytics
}
```

#### Three.js Optimization
```typescript
// 5. Optimize 3D components
const SprayCan = React.memo(() => {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 2, 16]} /> {/* Reduced segments */}
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    </group>
  )
})

// 6. Proper cleanup
useEffect(() => {
  const animation = gsap.to(canRef.current.rotation, {
    y: Math.PI * 2,
    duration: 2,
    repeat: -1,
  })
  
  return () => animation.kill() // Cleanup GSAP
}, [])
```

## 4. Problemy Bezpieczeństwa

### CSP Headers
- Obecny CSP bardzo podstawowy (tylko frame-src)
- Brak ochrony przed XSS, injection attacks

### Rekomendowane CSP
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "media-src 'self'",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
            ].join('; '),
          },
        ],
      },
    ]
  },
}
```

## 5. Struktura Metadanych SEO

### Obecne Problemy
- Generic metadata w layout.tsx
- Brak Open Graph tags
- Brak structured data

### Rekomendowane Ulepszenia
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: '%s | Aeromat - Murale i Graffiti',
    default: 'Aeromat - Profesjonalne Murale i Graffiti',
  },
  description: 'Profesjonalne wykonawstwo murali, graffiti i reklam malowanych. Portfolio realizacji na terenie całej Polski.',
  keywords: ['murale', 'graffiti', 'reklamy malowane', 'art uliczny', 'malarstwo ścienne'],
  authors: [{ name: 'Aeromat' }],
  openGraph: {
    title: 'Aeromat - Profesjonalne Murale i Graffiti',
    description: 'Portfolio realizacji murali i graffiti na terenie całej Polski',
    url: 'https://aeromat.pl',
    siteName: 'Aeromat',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aeromat - Portfolio murali',
      },
    ],
    locale: 'pl_PL',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

## 6. Testing Strategy

### Obecny Stan
- Brak testów jednostkowych
- Brak testów integracyjnych
- Brak CI/CD pipeline

### Rekomendacje
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.4",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@playwright/test": "^1.40.0"
  }
}
```

## 7. Deployment i Monitoring

### Obecna Konfiguracja
- Brak environment variables
- Brak error monitoring
- Brak analytics

### Rekomendowane Dodatki
```typescript
// lib/analytics.ts
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined') {
    // Google Analytics 4
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: url,
    })
  }
}

// lib/error-monitoring.ts
export const initSentry = () => {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
  })
}
```

## 8. Plan Modernizacji

### Faza 1 - Security & Dependencies (1 tydzień)
- [ ] Aktualizacja Next.js do v16
- [ ] Aktualizacja React do v19
- [ ] Naprawienie security vulnerabilities
- [ ] Implementacja proper CSP headers

### Faza 2 - Performance (2 tygodnie)
- [ ] Optymalizacja obrazów (WebP/AVIF)
- [ ] Implementacja lazy loading
- [ ] Bundle size optimization
- [ ] Three.js performance tuning

### Faza 3 - Code Quality (1 tydzień)
- [ ] Usunięcie deprecated react-player-controls
- [ ] Code cleanup (unused code, comments)
- [ ] TypeScript strict mode
- [ ] ESLint/Prettier konfiguracja

### Faza 4 - Testing & Monitoring (1 tydzień)
- [ ] Unit tests setup
- [ ] E2E tests dla krytycznych ścieżek
- [ ] Error monitoring (Sentry)
- [ ] Analytics implementation

### Faza 5 - SEO & Accessibility (3 dni)
- [ ] Proper metadata structure
- [ ] Schema.org structured data
- [ ] WCAG 2.1 compliance
- [ ] Sitemap i robots.txt

## 9. Koszty i ROI

### Szacowane Koszty Modernizacji
- **Development**: 40-60 godzin
- **Testing**: 15-20 godzin
- **Deployment**: 5-8 godzin
- **Total**: ~2-3 tygodnie pracy

### Oczekiwane Korzyści
- **Performance**: +40% faster loading
- **SEO**: Better search rankings
- **Security**: Eliminacja known vulnerabilities
- **Maintenance**: Easier future updates
- **User Experience**: Smoother interactions

### Metryki Sukcesu
- **Lighthouse Score**: 90+ na wszystkich metrykach
- **Core Web Vitals**: Green scores
- **Bundle Size**: <500KB initial load
- **Error Rate**: <0.1%