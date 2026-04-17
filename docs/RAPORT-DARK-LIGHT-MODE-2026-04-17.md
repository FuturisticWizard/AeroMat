# Raport sesji — Dark/Light Mode implementation

**Data:** 2026-04-17
**Branch:** `feat/dark-light-mode` (8 commits, exit-code-0 build)
**Epic:** `docs/stories/epic-dark-light-mode.md`
**Palette:** Option A — Clean White

## Streszczenie

W jednej sesji zaimplementowano 7 stories z epicu dark/light mode. Toggle Sun/Moon w navbarze działa, wszystkie kluczowe themed sekcje reagują na zmianę motywu, always-dark sekcje (intencjonalnie kinowe) pozostają ciemne. Build przechodzi bez błędów, wszystkie strony prerenderowane statycznie.

## Architektura

### Biblioteki
- `next-themes@^0.4.6` — zarządzanie motywem, persist w localStorage, system preference detection
- `lucide-react` — ikony Sun/Moon (już zainstalowane)

### Strategia
1. **CSS Variables w HSL format** — `hsl(var(--background))`, umożliwia Tailwind opacity syntax `bg-accent/30`
2. **`:root`** = light theme, **`.dark`** = dark theme (shadcn convention)
3. **`defaultTheme="dark"`** — zachowana estetyka kinowa jako fallback
4. **`attribute="class"`** — next-themes dokleja klasę `.dark` do `<html>`
5. **`disableTransitionOnChange`** — brak migającego przejścia, hard swap (lepszy UX niż 300ms animacja na tle pełnoekranowych obrazów)

### Semantic tokens (dodane)

```css
--section-bg       /* #FAFAFA / #0a0a0a */
--surface-elevated /* #F5F5F5 / #171717 */
--text-primary     /* #1A1A1A / #FFFFFF */
--text-secondary   /* #333333 / #D4D4D4 */
--text-muted       /* #6B6B6B / #9CA3AF */
--nav-bg           /* #FFFFFF / #000000 */
--accent-hover     /* #e56502 / #e56502 */
```

Shadcn tokens (`--background`, `--foreground`, `--card`, `--accent`, `--border`, `--secondary`, `--muted-foreground`) — naprawione wartości dla `:root` (wcześniej `--background: 0 0% 0%` — niepoprawnie czarny dla light mode).

## Sekcje — always-dark vs themed

### Always-dark (intencjonalne)
Pozostawione ciemne bo:
- Pełnoekranowe tła (video/obrazy) — light mode złamałby wrażenie kinowe
- Karty z obrazem-tłem — white-on-image jest intencjonalne
- Strefy "film-noir" portfolio

Lista:
- Intro, Outro (neon reveal — blue glow wymaga czarnego tła)
- Title Cards (`.card`, `.cards`)
- Panorama (`.panorama-card`)
- Portfolio Break (`.portfolio-break`)
- Footer (gradient `from-black to-[#2d1a0a]`)
- `/kontakt` (video hero w tle)
- Testimonials (karty z obrazem tła)
- YouTubeGrid (karty z thumbnail tła)

### Themed (reaguje na toggle)
- **Navbar** — `bg-background/90`, dual logo via CSS-only
- **AboutMe** — `text-foreground`, `text-muted-foreground`
- **TrustedBy** — divider + heading via tokens
- **WhyChooseMe** — karty: `bg-foreground/5`, `border-foreground/10`
- **MuralsMap → HeadingSection** — heading + body
- **Google Maps** — `useTheme()`, dark style gdy dark, default gdy light
- **`/portfolio`** — pełna obsługa light mode (hero, tabs, sekcja kontaktowa)

## Logo swap

Implementacja CSS-only:
```tsx
<Image src="/logo/logo-white.png" className="... hidden dark:block" />
<Image src="/logo/logo-black.jpg" className="... block dark:hidden" />
```

**Koszt:** oba obrazy ładowane, ale tylko jeden widoczny (~+20KB HTTP). Zalety: brak flicker przy toggle, brak hydration issues.

**Dług:** `logo-black.jpg` → zalecana konwersja na PNG/WebP z transparency dla lepszej jakości w light mode navbar.

## Unifikacja accent color (Story 4)

Zamieniono hardcoded `#ff7302`, `#ff8800`, `#FF6800`, `#FFA858`, `#e56502` na klasy Tailwind:

| Było | Jest |
|------|------|
| `text-[#ff7302]` | `text-accent` |
| `bg-[#ff7302]` | `bg-accent` |
| `border-[#ff7302]` | `border-accent` |
| `hover:bg-[#e56502]` | `hover:bg-accent/90` |
| `ring-[#ff7302]` | `ring-accent` |
| `shadow-[#ff7302]/30` | `shadow-accent/30` |
| `text-[#ff7302]/15` | `text-accent/15` |

**Pliki:** Navbar, Footer, FooterLight, AboutMe, HeadingSection, GoogleMap, Testimonials, WhoAmI2, WhyChooseMe, YoutubeVideosGrid, ThemeToggle, portfolio/page, kontakt/page, kontakt/loading, o-mnie/loading, page (16 plików).

**Nieskonwertowane:**
- 3 SVG inline attrs w `kontakt/page.tsx` (stroke, fill, inline `backgroundColor`) — wymagają refaktora na CSS vars albo styled SVG
- Mockup pages (hero-mockup, glitch-mockup, footer-mockup) — design experiments
- `GlitchedVideoHero.module.css` — CSS module, oddzielna ścieżka migracji

## Print mode

Dodany `@media print` w `globals.css`:
```css
@media print {
  :root { color-scheme: light; }
  html.dark { background: #fff !important; color: #000 !important; }
  .bg-background, .bg-secondary, .bg-card { background: #fff !important; }
  .text-foreground, .text-muted-foreground { color: #000 !important; }
}
```

Wymusza biały papier + czarny tekst niezależnie od trybu.

## Commity

```
9fa0ce8 feat(theme): story 7 — Google Maps light style + print mode
a5c77da feat(theme): story 6 — theme /portfolio page
bd6ad25 feat(theme): story 5 (cont.) — HeadingSection + WhyChooseMe
08f51dc feat(theme): story 5 (partial) — Navbar, AboutMe, TrustedBy
853731e feat(theme): story 4 — unify accent color
388fd62 feat(theme): story 3 — ThemeToggle button in Navbar
eb33833 feat(theme): story 2 — CSS variable foundation
db47c61 feat(theme): story 1 — next-themes infrastructure
```

## Ryzyka i długi techniczne

### WCAG AA contrast
Orange `#ff7302` na białym tle ma współczynnik **3.0:1**, co:
- **Przechodzi** dla tekstu ≥24px lub ≥18px bold (WCAG AA large)
- **Nie przechodzi** dla body text <18px

**Akcja:** Manualny audit przez Lighthouse/axe-core, ewentualnie ciemniejszy akcent dla light mode (np. `#e56502` = 3.8:1) — albo dodać `--accent-text-light` jako osobny token.

### Logo asset
`logo-black.jpg` bez transparency — widoczne białe tło na hover/pod shadow. Zalecana konwersja na PNG/WebP.

### Testimonials/YoutubeGrid
Obecnie always-light/dark niezależne od toggle. Decyzja: tło obrazów jest intencjonalne. Jeśli light mode użytkownik ma preferować jasne chromy tych sekcji, wymagana kolejna iteracja.

### Google Maps light mode
Użyto `undefined` dla default Google style — można rozważyć custom light style array dla spójności z paletą AeroMat.

## Co pozostaje

### Pilne (przed merge)
- [ ] Manual QA w obu trybach: home, portfolio, o-mnie, kontakt, filmy
- [ ] Logo-black asset → PNG/WebP
- [ ] Lighthouse WCAG audit

### Opcjonalne (po merge)
- [ ] Custom Google Maps light style array (żeby mapa pasowała do AeroMat color brand)
- [ ] Refactor SVG inline styles w kontakt/page.tsx na CSS vars
- [ ] Konwersja `GlitchedVideoHero.module.css` na semantic tokens
- [ ] Dedykowany `--accent-text-light` token dla body tekstu w light mode

## PR

https://github.com/FuturisticWizard/AeroMat/pull/new/feat/dark-light-mode

**Test plan:**
1. `git checkout feat/dark-light-mode && npm ci && npm run dev`
2. Kliknij Sun/Moon w navbarze
3. Przejdź: home → o-mnie → portfolio → kontakt → filmy
4. Obserwuj: Navbar/AboutMe/WhyChooseMe/TrustedBy/portfolio zmieniają się, reszta always-dark
5. Sprawdź `Ctrl+P` print preview → biała strona z czarnym tekstem
6. Sprawdź localStorage persistence: toggle → F5 → tryb zachowany
