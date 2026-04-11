# Epic: Dark/Light Mode

**Status:** Ready for Development
**Priority:** Medium
**Created:** 2026-04-05
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
**Status:** To Do

**Tasks:**
- [ ] Install next-themes: `npm install next-themes`
- [ ] Create `app/components/ThemeProvider.tsx` (client wrapper)
- [ ] Wrap layout.tsx body contents with ThemeProvider
- [ ] Add `suppressHydrationWarning` to `<html>` tag
- [ ] Verify site looks identical (defaultTheme="dark")

**Acceptance Criteria:**
- next-themes installed and configured
- No visual changes (dark mode preserved)
- No hydration warnings in console

---

### Story 2: CSS Variable Foundation (Phase 1)
**Status:** To Do

**Tasks:**
- [ ] Fix `:root` block — change `--background` from `0 0% 0%` to `0 0% 100%`
- [ ] Update all `:root` variables to proper light mode values (Option A palette)
- [ ] Verify `.dark` block has correct dark values (already does)
- [ ] Add new semantic variables: `--nav-bg`, `--section-bg`, `--surface-elevated`, `--text-primary`, `--text-secondary`
- [ ] Site still looks identical (`.dark` class applied by default)

**Acceptance Criteria:**
- `:root` = light theme, `.dark` = dark theme
- No visual changes while defaultTheme="dark"

---

### Story 3: Theme Toggle (Phase 2)
**Status:** To Do

**Tasks:**
- [ ] Create `ThemeToggle.tsx` using `useTheme()` + Sun/Moon from lucide-react
- [ ] Add toggle to Navbar desktop (next to sound button)
- [ ] Add toggle to Navbar mobile (next to sound + hamburger)
- [ ] Style matching existing sound button (`rounded-full h-10 w-10`)
- [ ] Handle mounted state to avoid hydration mismatch

**Acceptance Criteria:**
- Toggle visible on desktop and mobile
- Clicking switches between dark/light
- Theme persists after reload (localStorage)
- Respects system preference on first visit
- No FOUC (flash of unstyled content)

---

### Story 4: Unify Accent Color (Phase 3)
**Status:** To Do

**Tasks:**
- [ ] Replace all `#ff7302`, `#FE9100`, `#FF6800` with `text-accent` / `bg-accent`
- [ ] Replace hover variants `#e87f00`, `#e56502` with `hover:bg-accent/90`
- [ ] Files: Navbar, VideoHero, AboutMe, YoutubeGrid, HeadingSection, CallButtonPortal, portfolio/page, kontakt/page, WhoAmI2

**Acceptance Criteria:**
- Single accent color source (CSS variable)
- All hover states consistent
- No hardcoded orange hex values in themed components

---

### Story 5: Convert Themed Sections (Phase 4-5)
**Status:** To Do

**Tasks:**
- [ ] Navbar: `bg-black/90` → `bg-background/90`, text/border/shadow conversions
- [ ] Footer: gradient adaptation or keep always dark
- [ ] AboutMe: text-white → text-foreground, text-gray-300 → text-muted-foreground
- [ ] YouTubeGrid: card bg, text, borders → semantic tokens
- [ ] TrustedBy: text-white → text-foreground, border-white/20 → border-foreground/20
- [ ] Testimonials: verify bg-background works (already uses semantic token partially)
- [ ] MuralsMap + HeadingSection: text/bg conversions
- [ ] Logo swap: dark variant in Navbar for light mode

**Acceptance Criteria:**
- All themed sections render correctly in both modes
- No hardcoded bg-black, text-white in themed sections
- Logo switches between light/dark variants

---

### Story 6: Subpages (Phase 6)
**Status:** To Do

**Tasks:**
- [ ] /portfolio page: bg-black → bg-background, all text/border conversions
- [ ] /kontakt page: bg-black → bg-background, form inputs adaptation
- [ ] Tab styling adaptation for light mode

**Acceptance Criteria:**
- Both subpages fully themed
- Form inputs readable in both modes
- Tabs contrast correct in both modes

---

### Story 7: Polish & Edge Cases (Phase 7)
**Status:** To Do

**Tasks:**
- [ ] Google Maps light style array (optional)
- [ ] Smooth transition on toggle (transition-theme CSS class)
- [ ] Print mode (@media print forces light)
- [ ] Test all 172 QA checkpoints
- [ ] Fix any WCAG AA contrast failures

**Acceptance Criteria:**
- All QA tests pass
- No layout shift on theme change
- Smooth 300ms transition on toggle

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
