# Audyty AeroMat

## Najnowszy: raport zbiorczy 2026-06-11

**[RAPORT-ZBIORCZY-2026-06-11.md](./RAPORT-ZBIORCZY-2026-06-11.md)** — pełny audyt zespołem 5 agentów (bezpieczeństwo, wydajność, jakość kodu, dostępność WCAG, SEO) + synteza. **37 znalezisk.** Zawiera ocenę ogólną, znaleziska wg ważności oraz plan naprawczy w 3 fazach.

Najważniejsze (Faza 1): ujednolicić dane kontaktowe (QC-01), zabezpieczyć formularz przed botami (SEC-02), leniwe ładowanie Three.js/`PanoramaScroll` (PERF-01), utworzyć `sitemap.ts` + `robots.ts` + `metadataBase` (SEO-01/02/03).

---

# Audyt AeroMat — 2026-05-15 (poprzedni)

Profesjonalny audyt zespołem 3 agentów Claude Code (parallel dispatch). Część znalezisk już naprawiona (sprzątanie 2026-06-11: usunięte makiety, przeniesione zależności, martwy CSS, duplikaty obrazów).

## Dokumenty

| Plik | Zakres | Krytyczne | Wysokie | Średnie | Niskie |
|------|--------|-----------|---------|---------|--------|
| [security-audit.md](./security-audit.md) | Bezpieczeństwo (CSP, Resend, formularz, sekrety) | 0 | 2 | 4 | 3 |
| [performance-audit.md](./performance-audit.md) | Wydajność (bundle, lazy, obrazy, CWV) | 1 | 3 | 2 | 4 |
| [code-quality-audit.md](./code-quality-audit.md) | Jakość kodu i architektura | 1 | 6 | 6 | 4 |
| **[plan-wdrozenia.md](./plan-wdrozenia.md)** | **Plan wdrożenia (5 faz, ~14h)** | — | — | — | — |

## Top 10 priorytetów (cross-cutting)

1. **[PERF-001]** `PanoramaScroll` → `dynamic(ssr:false)` — Three.js ~600 KB znika z initial bundle (homepage)
2. **[QC-001]** Zastąpić placeholder telefonu `+48 600 000 000` na `/kontakt` prawdziwym numerem
3. **[QC-017/018]** Przenieść `framer-motion` i `zod` z `devDependencies` do `dependencies`
4. **[P1-2]** Honeypot + rate limit per IP w formularzu (`email.tsx`)
5. **[QC-003]** 19 mockup routes → dodać `noindex` lub przenieść do `(mockups)/` route group
6. **[PERF-002]** `/filmy` — użyć istniejącego `LazyYouTubeGridWithIntersection`
7. **[PERF-003]** `PerformanceMonitor` — guard produkcyjny (3 PerformanceObserver bez celu)
8. **[QC-007/008]** `.gitignore`: dodać `web-bundles/`, `docs/*.{jpg,png}`
9. **[P2-2/P2-3]** Dodać `sandbox` do iframe (YouTube desktop overlay, GoogleMap marker overlay)
10. **[P1-1]** Nonce-based CSP (usunięcie `unsafe-inline`/`unsafe-eval`) — ostatnie, najbardziej pracochłonne

## Metodologia

- Każdy agent miał **wąski zakres** (security / performance / quality) i pracował niezależnie
- Reguły: **confidence-based** — zgłaszane tylko issues zweryfikowane w kodzie (z `file:line`)
- Bez generycznych rekomendacji — każde znalezisko ma konkretny fragment kodu do wdrożenia
- Cross-reference: niektóre znaleziska pokrywają się (np. orphaned font classes PERF-008 = QC-006) — to potwierdzenie, nie duplikat

## Co dalej

Sugerowane uruchomienie po wdrożeniu Fazy 1 + Fazy 2:
```bash
npm run build:analyze    # weryfikacja bundle size po PERF-001..004
npm audit --omit=dev     # check po przeniesieniu zależności
```

Następny pomiar Lighthouse / PSI po wdrożeniu zmian — porównać z baseline.
