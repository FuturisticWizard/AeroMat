# Story: Technical SEO Foundation

**Epic:** SEO & Digital Marketing Enhancement

## User Story
**Jako search engine** chcę móc łatwo crawlować i indeksować stronę, aby pokazywać ją w relevantnych wynikach wyszukiwania.

## Business Value
- **Organic Traffic**: +50% wzrost w 6 miesięcy dzięki lepszej indexacji
- **Local Visibility**: Top 3 positions dla "murale [miasto]"  
- **Conversion**: Lepsze qualified traffic = wyższe conversion rates
- **Brand Authority**: Wyższe pozycje = większe zaufanie klientów

## Acceptance Criteria

### Must Have
- [ ] **Meta tags**: Unique title i description na każdej stronie
- [ ] **XML Sitemap**: Auto-generated sitemap z wszystkimi pages
- [ ] **Robots.txt**: Proper directives dla search engines
- [ ] **Canonical URLs**: Prevent duplicate content issues
- [ ] **Schema markup**: Rich snippets dla portfolio items
- [ ] **Open Graph**: Social sharing optimization
- [ ] **Google Analytics 4**: Comprehensive tracking setup

### Should Have
- [ ] **Twitter Cards**: Enhanced social media shares
- [ ] **404 page optimization**: SEO-friendly error pages  
- [ ] **URL structure**: Clean, descriptive URLs
- [ ] **Internal linking**: Strategic cross-page linking

### Nice to Have
- [ ] **Multilingual SEO**: hreflang tags (PL/EN ready)
- [ ] **AMP pages**: Accelerated mobile pages dla portfolio
- [ ] **PWA features**: Manifest file, service worker basics

## Technical Implementation

### Phase 1: Meta Tags Strategy
```typescript
// app/layout.tsx - Global metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://aeromat.pl'),
  title: {
    template: '%s | Aeromat - Profesjonalne Murale i Graffiti',
    default: 'Aeromat - Profesjonalne Murale i Graffiti w Polsce',
  },
  description: 'Profesjonalne wykonanie murali, graffiti i reklam malowanych na całą Polskę. Portfolio 500+ realizacji. Bezpłatna wycena.',
  keywords: [
    'murale',
    'graffiti', 
    'reklama malowana',
    'street art',
    'malarstwo ścienne',
    'art uliczny',
    'murale na zamówienie'
  ],
  authors: [{ name: 'Aeromat', url: 'https://aeromat.pl' }],
  creator: 'Aeromat',
  publisher: 'Aeromat',
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
  verification: {
    google: 'google-site-verification-code',
  },
}
```

### Phase 2: Page-specific SEO
```typescript
// app/portfolio/page.tsx
export const metadata: Metadata = {
  title: 'Portfolio - Galeria Murali i Graffiti',
  description: 'Zobacz nasze najlepsze realizacje murali i graffiti. Portfolio zawiera 500+ projektów z całej Polski - od małych graffiti po duże murale reklamowe.',
  openGraph: {
    title: 'Portfolio Aeromat - Murale i Graffiti',
    description: 'Galeria najlepszych realizacji murali i graffiti w Polsce',
    url: '/portfolio',
    siteName: 'Aeromat',
    images: [
      {
        url: '/images/portfolio-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Portfolio realizacji Aeromat',
      },
    ],
    locale: 'pl_PL',
    type: 'website',
  },
}
```

### Phase 3: Schema.org Markup
```typescript
// lib/schema.ts
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Aeromat',
  description: 'Profesjonalne wykonanie murali i graffiti',
  url: 'https://aeromat.pl',
  logo: 'https://aeromat.pl/logo.jpg',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+48-123-456-789',
    contactType: 'Customer Service',
    availableLanguage: 'Polish'
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'PL',
    addressRegion: 'Mazowieckie',
    addressLocality: 'Warszawa'
  },
  sameAs: [
    'https://instagram.com/aeromat',
    'https://facebook.com/aeromat'
  ]
};

export const portfolioItemSchema = (item: PortfolioItem) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: item.title,
  description: item.description,
  creator: {
    '@type': 'Organization',
    name: 'Aeromat'
  },
  image: item.imageUrl,
  locationCreated: {
    '@type': 'Place',
    name: item.location
  }
});
```

### Phase 4: XML Sitemap
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aeromat.pl'
  
  // Static pages
  const staticPages = [
    '',
    '/portfolio', 
    '/firma',
    '/process',
    '/kontakt'
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  // Portfolio items (dynamic)
  const portfolioItems = getPortfolioItems().map(item => ({
    url: `${baseUrl}/portfolio/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...portfolioItems]
}
```

### Phase 5: Robots.txt
```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://aeromat.pl'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

## SEO Content Strategy

### Primary Keywords (High Priority)
1. **"murale Warszawa"** - 1,200 searches/month
2. **"graffiti na zamówienie"** - 800 searches/month
3. **"reklama malowana"** - 900 searches/month
4. **"malarstwo ścienne"** - 600 searches/month

### Long-tail Keywords (Conversion Focus)
1. **"ile kosztuje namalowanie muralu"** - 200 searches/month
2. **"profesjonalne murale biura"** - 100 searches/month
3. **"graffiti artykuł reklamowy Kraków"** - 80 searches/month

### Local SEO Keywords
- "murale [miasto]" dla top 20 polskich miast
- "graffiti [region]" 
- "street art [lokalizacja]"

## URL Structure
```
https://aeromat.pl/
├── portfolio/
│   ├── murale/
│   ├── graffiti/  
│   └── reklamy/
├── uslugi/
│   ├── murale-zewnetrzne/
│   ├── graffiti-reklamowe/
│   └── malarstwo-scienne/
├── realizacje/
│   └── [miasto]/
├── firma/
├── proces/
└── kontakt/
```

## Analytics & Tracking Setup

### Google Analytics 4 Events
```typescript
// lib/analytics.ts
export const trackPortfolioView = (itemId: string) => {
  gtag('event', 'view_item', {
    item_id: itemId,
    item_name: 'Portfolio Item',
    item_category: 'Portfolio',
    currency: 'PLN'
  })
}

export const trackContactForm = (formType: string) => {
  gtag('event', 'generate_lead', {
    currency: 'PLN', 
    value: 1000, // Average project value
    form_type: formType
  })
}
```

### Search Console Integration
```typescript
// Verify domain ownership
const searchConsoleVerification = {
  google: 'google-site-verification=XXXXX',
  bing: 'msvalidate.01=XXXXX'
}
```

## Performance & SEO Optimization

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: <2.5s
- **FID (First Input Delay)**: <100ms  
- **CLS (Cumulative Layout Shift)**: <0.1

### Technical SEO Checklist
- [ ] HTTPS enabled (SSL certificate)
- [ ] Mobile-friendly design
- [ ] Page speed optimization
- [ ] Image alt tags
- [ ] Heading hierarchy (H1, H2, H3)
- [ ] Internal linking strategy
- [ ] External links w/ proper attributes

## Definition of Done
- [ ] ✅ All meta tags implemented across site
- [ ] ✅ XML sitemap auto-generating
- [ ] ✅ Schema markup on key pages
- [ ] ✅ Google Analytics 4 tracking working
- [ ] ✅ Search Console verified and configured
- [ ] ✅ Lighthouse SEO score: 100
- [ ] ✅ Manual SEO audit completed
- [ ] ✅ Analytics dashboard configured

## Testing & Validation

### SEO Testing Tools
1. **Google Search Console**: Index status, search performance
2. **Google PageSpeed Insights**: Core Web Vitals
3. **Lighthouse SEO Audit**: Technical SEO checklist
4. **Schema.org Validator**: Structured data testing
5. **Facebook Debugger**: Open Graph testing

### Manual Testing Checklist
- [ ] All pages have unique titles/descriptions
- [ ] Sitemap accessible at /sitemap.xml
- [ ] Robots.txt working at /robots.txt  
- [ ] Schema markup validating
- [ ] Social sharing showing correct previews

## Risk Assessment

### Risk: Google Algorithm Changes
**Probability:** Medium | **Impact:** Medium
**Mitigation:** Focus na user experience, nie black-hat techniques

### Risk: Technical SEO Errors
**Probability:** Low | **Impact:** High
**Mitigation:** Comprehensive testing, staged deployment

### Risk: Keyword Cannibalization
**Probability:** Medium | **Impact:** Medium  
**Mitigation:** Clear keyword mapping per page

## Dependencies
- **Requires:** Content strategy définitions
- **Blocks:** Local SEO implementation
- **Related:** Performance optimization dla Core Web Vitals

## Estimate: 8 Story Points
**Breakdown:**
- Meta tags & structure: 2 SP
- Schema markup: 2 SP
- Analytics setup: 2 SP
- Testing & validation: 2 SP

## Success Metrics
- **Lighthouse SEO Score**: 95+ (from current ~70)
- **Search Console Impressions**: Baseline establishment
- **Organic Click-through Rate**: Monitor improvement
- **Core Web Vitals**: All green scores
- **Index Coverage**: 100% important pages indexed
- **Rich Results**: Schema markup showing w search results