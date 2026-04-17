# Epic: Dark/Light Mode

**Status:** Implemented — ready for review
**Priority:** Medium
**Created:** 2026-04-05
**Implemented:** 2026-04-17 (branch `feat/dark-light-mode`, 8 commits)
**Palette:** Option A — Clean White

---

## Overview

Implement a full dark/light mode toggle for AeroMat portfolio using next-themes. Dark mode is the current default. Light mode uses a clean white gallery aesthetic (Option A). Cinematic sections (Intro, Outro, Cards, Panorama, Portfolio Grids, Footer) remain always dark.

## Palette — Option A: Clean White

| Token | Light | Dark |
|-------|-------|------|
| Background | `#FFFFFF` | `#000000` |
| Section bg | `#FAFAFA` | `#0a0a0a` |
| Elevated bg | `#F5F5F5` | `#171717` |
| Text primary | `#1A1A1A` | `#FFFFFF` |
| Text body | `#333333` | `#D4D4D4` |
| Text muted | `#6B6B6B` | `#9CA3AF` |
| Accent | `#ff7302` | `#ff7302` |
| Accent hover | `#e56502` | `#e56502` |
| Border | `#E5E5E5` | `#262626` |
| Navbar bg | `rgba(255,255,255,0.92)` | `rgba(0,0,0,0.9)` |
| Navbar shadow | `shadow-black/8` | `shadow-black/50` |

## Architecture Decisions

1. **next-themes** with `attribute="class"`, `defaultTheme="dark"`, `enableSystem`
2. **CSS Variables** — migrate hardcoded colors to semantic tokens
3. **Always-dark sections:** `.intro`, `.outro`, `.card`, `.cards`, `.panorama-card`, `.portfolio-break`, `Footer`
4. **Themed sections:** Navbar, AboutMe, YouTubeGrid, TrustedBy, Testimonials, MuralsMap, /portfolio, /kontakt
5. **Logo swap** needed — dark variant for light mode navbar
6. **Orange `#ff7302`** only for large text on white (3.0:1 ratio — passes large text WCAG AA)

---

## Stories

### Story 1: Infrastructure Setup (Phase 0)
**Status:** ✅ Done (commit `db47c61`)

**Tasks:**
- [x] Install next-themes: `npm install next-themes` → v0.4.6
- [x] Create `app/components/ThemeProvider.tsx` (client wrapper)
- [x] Wrap layout.tsx body contents with ThemeProvider
- [x] Add `suppressHydrationWarning` to `<html>` tag
- [x] Verify site looks identical (defaultTheme="dark")

**Acceptance Criteria:**
- next-themes installed and configured
- No visual changes (dark mode preserved)
- No hydration warnings in console

---

### Story 2: CSS Variable Foundation (Phase 1)
**Status:** ✅ Done (commit `eb33833`)

**Tasks:**
- [x] Fix `:root` block — change `--background` from `0 0% 0%` to `0 0% 100%`
- [x] Update all `:root` variables to proper light mode values (Option A palette)
- [x] Verify `.dark` block has correct dark values — unified `.dark --accent` to orange
- [x] Add new semantic variables: `--section-bg`, `--surface-elevated`, `--text-primary`, `--text-secondary`, `--text-muted`, `--nav-bg`, `--accent-hover`
- [x] Site still looks identical (`.dark` class applied by default) — only shadcn tabs.tsx bg-accent visually changed (was brownish-gray, now orange as intended)

**Acceptance Criteria:**
- `:root` = light theme, `.dark` = dark theme
- No visual changes while defaultTheme="dark"

---

### Story 3: Theme Toggle (Phase 2)
**Status:** ✅ Done (commit `388fd62`)

**Tasks:**
- [x] Create `ThemeToggle.tsx` using `useTheme()` + Sun/Moon from lucide-react
- [x] Add toggle to Navbar desktop (next to sound button)
- [x] Add toggle to Navbar mobile (next to sound + hamburger)
- [x] Style matching existing sound button (`rounded-full h-10 w-10`)
- [x] Handle mounted state to avoid hydration mismatch (placeholder with `opacity-0` before mount)

**Acceptance Criteria:**
- Toggle visible on desktop and mobile
- Clicking switches between dark/light
- Theme persists after reload (localStorage)
- Respects system preference on first visit
- No FOUC (flash of unstyled content)

---

### Story 4: Unify Accent Color (Phase 3)
**Status:** ✅ Done (commit `853731e`)

**Tasks:**
- [x] Replace all `#ff7302`, `#FE9100`, `#FF6800` with `text-accent` / `bg-accent`
- [x] Replace hover variants `#ffa858`, `#e56502` with `hover:text-accent/70`, `hover:bg-accent/90`
- [x] 16 production files converted (Navbar, Footer, FooterLight, AboutMe, HeadingSection, GoogleMap, Testimonials, WhoAmI2, WhyChooseMe, YoutubeVideosGrid, ThemeToggle, portfolio/page, kontakt/page, kontakt/loading, o-mnie/loading, page)
- [x] Arbitrary Tailwind opacity syntax (`text-accent/15`, `border-accent/40`, `shadow-accent/30`) works via `hsl(var(--accent) / 0.x)`

**Not converted (intentional):**
- 3 SVG inline attrs in `kontakt/page.tsx` (stroke, fill, inline `backgroundColor` style) — cannot use Tailwind classes without refactor
- Mockup pages (hero-mockup, glitch-mockup, footer-mockup) — design experiments
- `GlitchedVideoHero.module.css` — CSS module, would need CSS var migration

**Acceptance Criteria:**
- Single accent color source (CSS variable)
- All hover states consistent
- No hardcoded orange hex values in themed components

---

### Story 5: Convert Themed Sections (Phase 4-5)
**Status:** ✅ Done (commits `08f51dc`, `bd6ad25`)

**Tasks:**
- [x] Navbar: `bg-black/90` → `bg-background/90`, `border-neutral-800` → `border-border`, `text-gray-300/text-white` → `text-foreground/80 | text-foreground`, `bg-neutral-800` (sound button) → `bg-secondary`
- [x] Footer: kept always-dark (gradient `from-black to-[#2d1a0a]`) — part of the intentional always-dark set
- [x] AboutMe: text-white → text-foreground, text-gray-300/400 → text-muted-foreground
- [x] TrustedBy: text-white → text-foreground, border-white/20 → border-foreground/20
- [x] MuralsMap + HeadingSection: text/bg conversions
- [x] WhyChooseMe: bg-white/5 → bg-foreground/5, border-white/10 → border-foreground/10, text conversions
- [x] Logo swap: `logo-white.png` + `logo-black.jpg` via `dark:hidden` / `hidden dark:block`

**Deferred (visible text is over hero images — white-on-image intentional):**
- YouTubeGrid: video card content
- Testimonials: testimonial card content over photos

**Acceptance Criteria:**
- All themed sections render correctly in both modes
- No hardcoded bg-black, text-white in themed sections
- Logo switches between light/dark variants

---

### Story 6: Subpages (Phase 6)
**Status:** ✅ Done (commit `a5c77da`)

**Tasks:**
- [x] `/portfolio` page: bg-black → bg-background, text-white/gray-300 → text-foreground/text-muted-foreground, TabsList bg-neutral-800/border-neutral-700 → bg-secondary/border-border, contact section bg-neutral-900/border-neutral-700 → bg-card/border-border
- [x] Tab styling adaptation for light mode

**Decision — `/kontakt` stays always-dark:** Full-bleed video hero (`/movies/hero_mini.mp4`) is a core visual feature. Light mode with video overlay breaks the cinematic contact-form experience. Inputs stay white-on-dark for consistency with video background.

**Acceptance Criteria:**
- Both subpages fully themed
- Form inputs readable in both modes
- Tabs contrast correct in both modes

---

### Story 7: Polish & Edge Cases (Phase 7)
**Status:** ✅ Partially done (commit `9fa0ce8`)

**Tasks:**
- [x] Google Maps light style — `useTheme()` + conditional `styles` (dark preserves custom theme, light uses default Google style)
- [x] Print mode — `@media print` in globals.css forces white bg + black text on all semantic tokens
- [ ] ~~Smooth transition on toggle~~ — deferred intentionally: `disableTransitionOnChange` in ThemeProvider prevents flicker on hard swap (better UX than animated transition)
- [ ] 172 QA checkpoints — **manual testing required** by user
- [ ] WCAG AA contrast audit — **manual testing required** (orange `#ff7302` on white = 3.0:1, only passes for large text ≥24px or ≥18px bold)

**Acceptance Criteria:**
- [x] No layout shift on theme change (CSS variables swap instantly)
- [ ] All QA tests pass (pending user QA)
- [ ] WCAG AA contrast (pending manual audit)

---

## QA Test Summary

| Category | Count |
|----------|-------|
| Functional | 20 |
| Visual (per section) | 102 |
| Edge Cases | 17 |
| Accessibility | 23 |
| Performance | 10 |
| **Total** | **172** |

## Files Affected

~15 component files + globals.css + tailwind.config.ts + layout.tsx + 2 new files (ThemeProvider, ThemeToggle)

## Implementation summary — 2026-04-17

**Branch:** `feat/dark-light-mode` — 8 commits, exit-code-0 build.

**New files:**
- `app/components/ThemeProvider.tsx` — next-themes client wrapper
- `app/components/ThemeToggle.tsx` — Sun/Moon toggle with mounted-guard

**Modified files:**
- `app/layout.tsx` — wrap with ThemeProvider, `suppressHydrationWarning` on `<html>`
- `app/globals.css` — `:root` fixed (light palette), `.dark` unified, semantic tokens, `@media print`
- `app/components/Navbar.tsx` — themed bg/border/text + dual logo
- `app/components/AboutMe.tsx`, `TrustedBy.tsx`, `HeadingSection.tsx`, `WhyChooseMe.tsx` — theme-aware tokens
- `app/components/Footer.tsx`, `FooterLight.tsx`, `Testimonials.tsx`, `YoutubeVideosGrid.tsx`, `WhoAmI2.tsx`, `GoogleMap/GoogleMap.tsx` — accent unification (Story 4) + GoogleMap theme-aware
- `app/portfolio/page.tsx` — full light-mode support
- `app/page.tsx`, `app/o-mnie/loading.tsx`, `app/kontakt/page.tsx`, `app/kontakt/loading.tsx` — accent unification
- `package.json` — `next-themes@^0.4.6`

**Commits:**
1. `db47c61` Story 1 — infrastructure
2. `eb33833` Story 2 — CSS variable foundation
3. `388fd62` Story 3 — ThemeToggle
4. `853731e` Story 4 — accent unification
5. `08f51dc` Story 5a — Navbar, AboutMe, TrustedBy + dual logo
6. `bd6ad25` Story 5b — HeadingSection, WhyChooseMe
7. `a5c77da` Story 6 — /portfolio
8. `9fa0ce8` Story 7 — Google Maps + print mode

**Remaining manual work:**
1. QA across 172 checkpoints in both modes (navigate every page, toggle, verify)
2. WCAG AA contrast audit (Lighthouse, axe-core) — orange-on-white edge cases
3. Logo asset: current `logo-black.jpg` is JPG — consider PNG/WebP with transparency for better quality in light mode navbar
