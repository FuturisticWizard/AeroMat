# Story: Optymalizacja Obrazów i Media

**Epic:** Performance Optimization & Modernizacja  

## User Story
**Jako użytkownik** chcę aby obrazy w galerii ładowały się szybko, aby móc sprawnie przeglądać portfolio.

## Business Value
- **Performance**: -60% reduction w image loading time
- **SEO**: Lepsze Core Web Vitals scores
- **Mobile UX**: Drastycznie szybsze ładowanie na słabszych połączeniach
- **Storage**: -40% bandwidth usage

## Acceptance Criteria

### Must Have
- [ ] **WebP/AVIF formats**: Wszystkie obrazy w nowoczesnych formatach  
- [ ] **Lazy loading**: Obrazy ładują się when user scrolls
- [ ] **Responsive images**: Różne rozmiary dla różnych screen sizes
- [ ] **Blur placeholders**: Smooth loading experience
- [ ] **Next.js Image**: Wszystkie <img> tags zastąpione <Image>
- [ ] **Video optimization**: Hero video w multiple formats i compressions

### Should Have
- [ ] **Progressive loading**: Blur-up effect podczas ładowania
- [ ] **Error handling**: Fallback dla failed image loads  
- [ ] **Loading skeletons**: Placeholder components dla image grids
- [ ] **Preload critical images**: Above-fold images preloaded

### Nice to Have
- [ ] **Image CDN**: CloudFlare/AWS CloudFront dla global delivery
- [ ] **Auto-optimization**: Automated pipeline dla new images
- [ ] **Performance monitoring**: Image loading metrics tracking

## Technical Implementation

### Phase 1: Image Analysis & Conversion
```bash
# Analyze current images
find public/images -name "*.jpg" -exec ls -lh {} \; | sort -k5 -hr

# Convert to WebP (automated script)
npm install sharp
node scripts/convert-images.js
```

### Phase 2: Next.js Image Integration
```typescript
// Before
<img src="/images/mural.jpg" alt="Mural" />

// After  
<Image
  src="/images/mural.webp"
  alt="Mural"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={isAboveFold}
/>
```

### Phase 3: Responsive Image Configuration
```javascript
// next.config.js
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['aeromat.pl'], // If using external images
  },
}
```

### Phase 4: Video Optimization
```typescript
// Hero video optimization
<video
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  poster="/images/hero-poster.webp"
>
  <source src="/movies/hero.webm" type="video/webm" />
  <source src="/movies/hero.mp4" type="video/mp4" />
</video>
```

## File Size Targets

### Current State (problematic files)
- `/images/mural-starowka.jpg`: 3.2MB → Target: 200KB
- `/images/lpec-dom1.jpg`: 2.8MB → Target: 180KB  
- `/images/komeko-mural.jpg`: 1.9MB → Target: 150KB
- `/movies/hero_output.mp4`: 45MB → Target: 8MB

### Optimization Strategy
- **Portfolio images**: 1920px width max, 80% quality WebP
- **Thumbnail images**: 400px width, 75% quality WebP  
- **Hero images**: 1920px width, 85% quality WebP
- **Icon images**: SVG preferred, PNG fallback

## Performance Metrics

### Before Optimization
- **Portfolio page LCP**: 4.2s
- **Image load time average**: 2.8s
- **Total image weight**: 120MB
- **Lighthouse Performance**: 65

### Target Metrics  
- **Portfolio page LCP**: <2.5s
- **Image load time average**: <1.5s
- **Total image weight**: <50MB
- **Lighthouse Performance**: 85+

## Definition of Done
- [ ] ✅ All portfolio images converted to WebP/AVIF
- [ ] ✅ All <img> tags replaced with Next.js <Image>
- [ ] ✅ Lazy loading implemented across site
- [ ] ✅ Blur placeholders working for all images
- [ ] ✅ Performance test shows >50% improvement in LCP
- [ ] ✅ Mobile testing completed (3G throttling)
- [ ] ✅ Image fallbacks working for unsupported browsers
- [ ] ✅ Video optimization completed and tested

## Testing Checklist

### Performance Testing
- [ ] Lighthouse audit (mobile & desktop)
- [ ] WebPageTest.org analysis
- [ ] Real device testing (iPhone, Android)
- [ ] Network throttling (3G, slow 4G)

### Functionality Testing
- [ ] All images display correctly
- [ ] Lazy loading works in all browsers
- [ ] Blur placeholders show/hide properly
- [ ] Error states work (broken image URLs)
- [ ] Gallery lightbox functions normally

### Browser Compatibility
- [ ] Chrome 90+ (WebP/AVIF support)
- [ ] Firefox 88+ (WebP/AVIF support)  
- [ ] Safari 14+ (WebP support)
- [ ] Edge 90+ (WebP/AVIF support)
- [ ] Legacy browser fallbacks (JPEG/PNG)

## Risk Assessment

### Risk: WebP/AVIF Browser Support
**Probability:** Low | **Impact:** Medium
**Mitigation:** Next.js automatically serves fallback formats dla unsupported browsers

### Risk: Large Video Files
**Probability:** High | **Impact:** Medium
**Mitigation:** Multiple compression levels, adaptive streaming consideration

### Risk: SEO Impact  
**Probability:** Low | **Impact:** High
**Mitigation:** Maintain proper alt tags, test image indexing

## Dependencies
- **Requires:** Framework modernization completed
- **Blocks:** Bundle size optimization
- **Related:** Performance monitoring setup

## Estimate: 13 Story Points
**Breakdown:**
- Image analysis & conversion: 3 SP
- Next.js Image implementation: 4 SP
- Video optimization: 3 SP  
- Testing & validation: 3 SP

## Sprint Planning
- **Sprint:** Sprint 24
- **Assignee:** Frontend Developer + Performance Engineer
- **Timeline:** 5 days
- **External dependencies:** Design team dla image requirements

## Automation Scripts

### Image Conversion Script
```javascript
// scripts/convert-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertImage(inputPath, outputPath) {
  await sharp(inputPath)
    .resize(1920, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath);
}
```

### Image Audit Script
```bash
#!/bin/bash
# scripts/audit-images.sh
echo "Large images (>500KB):"
find public/images -name "*.jpg" -o -name "*.png" | xargs du -h | awk '$1 ~ /M/ || ($1 ~ /K/ && $1 > 500)'
```

## Success Metrics
- **LCP Improvement**: >50% reduction
- **Bundle Size**: Image assets <50MB total
- **Lighthouse Performance**: Score 85+
- **User Engagement**: Longer session duration na portfolio
- **Bounce Rate**: Reduction due to faster loading