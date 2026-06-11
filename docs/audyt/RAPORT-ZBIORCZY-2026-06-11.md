# Raport zbiorczy z audytu — AeroMat
Data: 2026-06-11

> ## Status wdrożenia (aktualizacja 2026-06-11, po sesji naprawczej)
>
> **✅ Wdrożone (Faza 1 + Faza 2):**
> - **QC-01 / SEC-04 / SEO-11** — dane kontaktowe ujednolicone (jedno źródło `app/lib/contact.ts`; linki tel/mailto zgodne z tekstem)
> - **SEC-02** — formularz: honeypot + limit po IP
> - **SEO-01/02/03** — `app/sitemap.ts`, `app/robots.ts`, `metadataBase` (domena: muralelublin.pl)
> - **SEO-04/05** — Open Graph + Twitter Card + JSON-LD `ProfessionalService`
> - **SEO-07** — metadane strony głównej + canonical
> - **SEO-10** — `noindex` na `/blog`, `/firma`, `/process`
> - **PERF-02** — usunięty nieużywany font Syne (Anton ZOSTAJE — jest używany, wbrew pierwotnemu znalezisku)
> - **PERF-04** — `/filmy` na leniwym `LazyYouTubeGridWithIntersection`
> - **A11Y-01** — globalny `prefers-reduced-motion` (animacje CSS; GSAP nadal do zrobienia osobno)
> - **A11Y-02** — kafelki filmów i galerii dostępne z klawiatury
> - **A11Y-04** — przycisk pauzy wideo w hero
> - **A11Y-06** — komunikat formularza w `role=status`/`aria-live`
> - **A11Y-03** — kontrast tekstu hover na białym (`#ff7302` → `#bf4d00`, ~4.9:1)
> - **SEO-08** — metadane na `/kontakt` i `/portfolio` (rozdział serwer/klient)
> - **SEC-01 (częściowo)** — usunięty `'unsafe-eval'` z CSP na produkcji + `object-src 'none'`, `base-uri 'self'`. Pełny nonce odrzucony: zweryfikowano buildem produkcyjnym, że Next 16 (Turbopack) nie dokleja nonce do skryptów → blokuje cały JS. `'unsafe-inline'` pozostaje.
> - **SEC-03** — usuwanie znaków nowej linii z tematu e-maila (ochrona przed wstrzyknięciem nagłówków)
> - **A11Y-07** — pierścień fokusu w polach formularza
> - **A11Y-09** — przywrócony widoczny fokus na przycisku hamburgera
> - **PERF-03** — leniwy lightbox na `/portfolio` (~140 KB ładowane po kliknięciu)
> - **PERF-05** — `PerformanceMonitor` rejestruje obserwatorów tylko w dev
> - **PERF-07** — usunięty zdublowany gradient `.gradient-new`
> - **SEO-09** — `alt` na wszystkich zdjęciach galerii `/portfolio` (title→alt)
> - **SEO-12** — `app/manifest.ts` (PWA)
> - **QC-02** — usunięty martwy kod (FooterLight, pixelBackground, 2 nieużywane hooki)
> - **SEO-06 / A11Y-05** — jeden H1 na stronie głównej (15→1). Tytuły kart, marquee (+aria-hidden), Intro, Outro → `h2`; zaktualizowane selektory w `globals.css`, `marquee.ts`, `HomeAnimations.tsx`. Zweryfikowano: rozmiary i wszystkie animacje (marquee, neon Intro/Outro, SplitText, pin panoramy) bez zmian.
>
> **↩️ Wycofane:**
> - **PERF-01** (leniwe ładowanie PanoramaScroll) — niezgodne z animacją przyklejania (pin) ScrollTrigger; komponent musi istnieć przy inicjalizacji. Odzyskanie ~600 KB three.js wymaga innego podejścia (dynamiczny import samego three.js wewnątrz komponentu) — osobny task.
>
> **⏳ Odłożone (ryzykowne lub duże — wymagają dedykowanej sesji):**
> - **SEC-01 (pełny nonce)** — blokowane przez Next 16/Turbopack (nie dokleja nonce); wróci przy migracji na `proxy.ts` lub naprawie w Next
> - **PERF-06** (statyczne `will-change`) — przy elementach animowanych; niska wartość, ryzyko niewidocznego „szarpnięcia" — pominięte świadomie
> - **PERF-08** (usunięcie `transpilePackages`) — wymaga weryfikacji buildem produkcyjnym
> - **A11Y-08** (dostępność klawiaturowa miniatur w `react-photo-album` na `/portfolio`)
> - **QC-03** (`any` w hookach/komponentach), **QC-04** (tsconfig, `@layer`, unifikacja importów, **testy** jednostkowe/E2E) — dług techniczny Fazy 3

## Podsumowanie wykonawcze

Strona AeroMat ma bardzo dobry fundament techniczny w trzech obszarach: wydajność (szybkość ładowania), jakość kodu i podstawy dostępności są na wysokim poziomie. Jest jednak jeden obszar wyraźnie słaby — SEO (widoczność w wyszukiwarce Google), gdzie brakuje wręcz podstawowych elementów (mapa strony, dane strukturalne, podglądy przy udostępnianiu linków). Najpoważniejsze ryzyka to: realne osłabienie ochrony przed atakami przez wstrzyknięcie złośliwego kodu (CSP z `unsafe-inline`/`unsafe-eval`), podatność formularza kontaktowego na spam botów, ciężka biblioteka grafiki 3D (Three.js, ~600 KB) spowalniająca stronę główną, niedostępność galerii i filmów z klawiatury oraz słabe SEO ograniczające pozyskiwanie klientów z Google. Powtarzający się przez wszystkie obszary błąd to niespójne dane kontaktowe (różny e-mail i telefon w różnych miejscach) — to drobiazg technicznie, ale realnie grozi utratą wiadomości od klientów. Mocną stroną jest wzorcowo zoptymalizowany hero (sekcja powitalna), bogata infrastruktura leniwego ładowania, ścisły TypeScript bez obejść oraz dobrze zbudowany formularz kontaktowy.

## Ocena ogólna

| Obszar | Ocena (1-5) | Komentarz |
|---|---|---|
| Bezpieczeństwo aplikacji webowej | 3/5 | Solidne podstawy (sekrety po stronie serwera, walidacja), ale CSP praktycznie nie chroni i formularz jest podatny na spam botów. |
| Wydajność (szybkość ładowania) | 4/5 | Bardzo dobry fundament; jeden poważny problem (Three.js ~600 KB w starcie strony głównej) ciągnie ocenę w dół. |
| Jakość kodu i architektura | 4/5 | Ścisły TypeScript bez obejść, dobry podział warstw; psują obraz martwy kod, typy `any` i niespójne dane kontaktowe. |
| Dostępność (WCAG 2.1 AA) | 3/5 | Dobre podstawy semantyczne, ale galeria i filmy niedostępne z klawiatury oraz brak obsługi „ograniczony ruch”. |
| SEO i metadane (widoczność w Google) | 2/5 | Słaby fundament — brak mapy strony, danych strukturalnych i podglądów udostępnień; wiele nagłówków H1 na stronie głównej. |

## Znaleziska krytyczne i wysokie

### Bezpieczeństwo

**SEC-01 — CSP z `unsafe-inline` i `unsafe-eval` w `script-src`**
Lokalizacja: `next.config.js:137`
Problem: Reguła `script-src` (lista dozwolonych źródeł skryptów — czyli polityka bezpieczeństwa treści, po angielsku CSP — Content Security Policy) zawiera `unsafe-inline` i `unsafe-eval`, co praktycznie zeruje ochronę przed atakiem XSS (Cross-Site Scripting — wstrzyknięcie złośliwego skryptu na stronę). Wstrzyknięty skrypt nie zostanie zablokowany.
Rekomendacja: Wdrożyć CSP opartą na jednorazowym tokenie (nonce) przez `middleware.ts`; usunąć `unsafe-eval` i `unsafe-inline`.

**SEC-02 — Limit zgłoszeń liczony tylko po e-mailu, bez adresu IP i pułapki na boty**
Lokalizacja: `app/lib/email.tsx:11-34`
Problem: Limit 3 wysyłek na godzinę liczony jest po adresie e-mail z formularza; bot wystarczy, że poda kolejne adresy. Brak limitu po adresie IP (numer identyfikujący urządzenie w sieci) i pułapki na boty (honeypot — ukryte pole, które wypełniają tylko automaty). Licznik trzymany w pamięci procesu (znika po restarcie). Ryzyko spamu i wyczerpania limitu usługi pocztowej Resend.
Rekomendacja: Dodać limit po adresie IP oraz honeypot; rozważyć trwały magazyn licznika.

### Wydajność

**PERF-01 — Three.js (~600 KB) w paczce początkowej strony głównej (komponent `PanoramaScroll` ładowany od razu)**
Lokalizacja: `app/page.tsx:11,82` + `app/components/PanoramaScroll.tsx:4`
Problem: Komponent `PanoramaScroll` ma na górze pliku statyczny import `import * as THREE from "three"`, a na stronie głównej jest renderowany bezpośrednio, bez opakowania w `dynamic()` (leniwe ładowanie). Three.js to biblioteka grafiki 3D ważąca ~600 KB. Przeglądarka musi ją pobrać i przetworzyć, zanim strona stanie się interaktywna, mimo że komponent uruchamia się dopiero w dole strony. To dokładnie ten sam problem co PERF-001 z audytu 2026-05-15 — nadal nienaprawiony.
Rekomendacja: W `app/page.tsx` zamienić import na leniwy: `const PanoramaScroll = dynamic(() => import("./components/PanoramaScroll"), { ssr: false, loading: () => <div className="panorama-section h-screen bg-[#050505]" /> })`. Komponent jest daleko w dole strony, więc `ssr:false` jest bezpieczne. Szacowany zysk: ~600 KB mniej JavaScriptu przy starcie, czas blokowania głównego wątku (TBT — Total Blocking Time) potencjalnie krótszy o 200–400 ms na słabszych urządzeniach.

### Dostępność

**A11Y-01 — Animacje gsap/framer-motion ignorują preferencję „ograniczony ruch” (prefers-reduced-motion)**
Lokalizacja: `HomeAnimations.tsx:16,208,282`; `PanoramaScroll.tsx:38,205,219`; `Images.tsx:136-188,266-330`; `SplitTextReveal.tsx:60-72`; `YoutubeVideosGrid.tsx:139-181`; `globals.css:500-505,561-563`
Problem: System operacyjny pozwala użytkownikowi włączyć ustawienie „ogranicz ruch/animacje” (prefers-reduced-motion — ważne dla osób z zawrotami głowy, migreną czy padaczką światłoczułą). Tutaj sterowanie animacjami uwzględnia tylko szerokość ekranu, a nie tę preferencję. W efekcie wszystkie duże animacje (przyklejanie sekcji przy przewijaniu, panorama, ujawnianie tekstu litera po literze, wjeżdżające kafelki) działają zawsze. Narusza WCAG 2.3.3 i częściowo 2.2.2.
Rekomendacja: Dodać w `globals.css` globalny blok `@media (prefers-reduced-motion: reduce)` zerujący czasy animacji/przejść, oraz w kodzie używać w `gsap.matchMedia()` klucza `'(prefers-reduced-motion: no-preference)'` dla efektów ozdobnych; w framer-motion użyć hooka `useReducedMotion()`.

**A11Y-02 — Kafelki filmów i galerii to klikalne `<div>`-y niedostępne z klawiatury**
Lokalizacja: `YoutubeVideosGrid.tsx:201-209`; `Images.tsx:208-213,275-282`
Problem: Kafelki uruchamiające film oraz kafelki galerii otwierające powiększenie to zwykłe `<div>` z `onClick`, bez `tabindex`, roli przycisku i obsługi klawiszy Enter/Spacja. Osoba poruszająca się klawiaturą lub korzystająca z czytnika ekranu nie aktywuje ich — całe portfolio i sekcja filmów są dla niej niedostępne. Narusza WCAG 2.1.1 i 4.1.2.
Rekomendacja: Zamienić klikalne `<div>`-y na `<button type="button">` (preferowane) lub dodać `role="button"`, `tabIndex={0}`, obsługę `onKeyDown` (Enter/Spacja) oraz `aria-label` opisujący akcję (np. „Odtwórz film: …”, „Powiększ zdjęcie: …”).

### SEO i metadane

**SEO-01 — Brak pliku `sitemap.ts` (mapa strony XML)**
Lokalizacja: `app/` (plik nie istnieje)
Problem: Brak mapy strony XML, przez co Google nie dostaje listy podstron do zaindeksowania — indeksacja jest wolniejsza i niepełna.
Rekomendacja: Utworzyć `app/sitemap.ts` z listą realnych tras: `''`, `/portfolio`, `/o-mnie`, `/filmy`, `/kontakt`. Nie dodawać pustych makiet. Wzór w `docs/stories/story-technical-seo.md` (Faza 4).

**SEO-02 — Brak pliku `robots.ts` (instrukcje dla robotów wyszukiwarek)**
Lokalizacja: `app/` (plik nie istnieje)
Problem: Brak jednoznacznych reguł, co indeksować, i wskazania adresu mapy strony. Podstawowy element technicznego SEO.
Rekomendacja: Utworzyć `app/robots.ts` z regułą `allow '/'` i odwołaniem do mapy strony. Wzór w `story-technical-seo.md` (Faza 5).

**SEO-03 — Brak `metadataBase` (bazowego adresu) w globalnym layoucie**
Lokalizacja: `app/layout.tsx:66-69`
Problem: Bez `metadataBase` (np. `https://aeromat.pl`) względne adresy w podglądach udostępnień (Open Graph) i adresy kanoniczne nie rozwiną się do pełnych URL — psuje to podglądy i może powodować duplikaty treści.
Rekomendacja: Dodać `metadataBase: new URL('https://aeromat.pl')`. Warunek wstępny dla SEO-04 i SEO-05.

**SEO-04 — Brak Open Graph i Twitter Card w całej witrynie**
Lokalizacja: `app/layout.tsx:66-69` oraz wszystkie `page.tsx`
Problem: Brak konfiguracji podglądów udostępnień (Open Graph — dane do podglądu linku na Facebooku/LinkedIn/WhatsApp; Twitter Card — to samo dla platformy X). Przy udostępnianiu linku nie pojawi się obraz, tytuł ani opis. Dla portfolio wizualnego (murale) to duża strata.
Rekomendacja: Dodać w globalnych metadanych `openGraph` (type website, locale pl_PL, siteName AeroMat, obrazy 1200×630) oraz `twitter` (card summary_large_image). Przygotować obraz podglądu (np. `/images/og-aeromat.jpg`).

**SEO-05 — Brak danych strukturalnych JSON-LD (schemat `LocalBusiness`)**
Lokalizacja: `app/layout.tsx` oraz `app/kontakt/page.tsx` (brak gdziekolwiek)
Problem: Brak skryptu danych strukturalnych (JSON-LD — format opisu firmy zrozumiały dla Google). Dla lokalnej firmy z Lublina brak schematu `LocalBusiness` to utrata wzbogaconych wyników Google i widoczności lokalnej (np. „muralista Lublin”).
Rekomendacja: Dodać JSON-LD typu `LocalBusiness`/`ProfessionalService` (name, description, telephone, email, areaServed, address, url, image, sameAs) przez `<script type="application/ld+json">` w layoucie lub na `/kontakt`. Dane są już w `app/kontakt/page.tsx:91-102`.

**SEO-06 — Wiele znaczników H1 na stronie głównej**
Lokalizacja: `GlitchedVideoHero.tsx:98`, `Cards.tsx:80-83,103`, `Intro.tsx:6`, `Outro.tsx:6`
Problem: Strona główna renderuje wiele elementów H1 naraz (nagłówek hero, powtarzane H1 w animowanym pasku, tytuły kart, dekoracyjne H1 w Intro/Outro). Powinien być dokładnie jeden H1. Nadużycie rozmywa dla Google temat strony i szkodzi dostępności.
Rekomendacja: Zostawić jeden H1 w hero. Dekoracyjne i animowane nagłówki zamienić na `div`/`span` lub niższe poziomy (h2/h3).

### Jakość kodu i architektura

**QC-01 — Rozbieżność danych kontaktowych (telefon i e-mail)**
Lokalizacja: `Footer.tsx:47-58`; `kontakt/page.tsx:91-92`
Problem: Telefon wyświetlany jako 500 044 156, a link `tel:` prowadzi do 500 123 456 (placeholder). E-mail wyświetlany jako gmail, a `mailto:` wskazuje aeromat.pl. (Ten sam problem opisują też SEC-04 i SEO-11.) Realne ryzyko utraty wiadomości od klientów.
Rekomendacja: Ujednolicić tekst z linkami, dane trzymać w jednej stałej (jedno źródło prawdy).

## Znaleziska średnie

- **PERF-02** (`app/layout.tsx:27-31,39-43`) — Dwa nieużywane fonty Google (Anton, Syne) ładowane na każdej stronie; klasa `.anton-regular` faktycznie używa Bebas Neue. Usunąć deklaracje i zmienne `${anton.variable}`, `${syne.variable}` z body.
- **PERF-03** (`app/portfolio/page.tsx:2-18,82`) — Na `/portfolio` biblioteka lightbox + 4 wtyczki (~140 KB) ładowane od razu zamiast po kliknięciu w zdjęcie. Opakować w `dynamic({ ssr:false })`.
- **PERF-04** (`app/filmy/page.tsx:1,11`) — `/filmy` importuje siatkę YouTube statycznie (wciąga framer-motion ~110 KB), mimo gotowego leniwego `LazyYouTubeGridWithIntersection`. Użyć gotowego komponentu.
- **A11Y-03** (`YoutubeVideosGrid.tsx:130`; `kontakt/page.tsx:163`) — Niewystarczający kontrast pomarańczowego `#ff7302` na białym tle w stanie hover (~2,9:1 przy wymaganym 4,5:1). Użyć ciemniejszego odcienia lub ciemnego tekstu.
- **A11Y-04** (`hero/GlitchedVideoHero.tsx:77-92`) — Autoodtwarzane, zapętlone wideo w hero bez przycisku pauzy (WCAG 2.2.2). Dodać dostępny z klawiatury przycisk wstrzymania/wznowienia.
- **A11Y-05** (`filmy/page.tsx:8-14`; `AboutMe.tsx:34`; `globals.css:528`, `Cards.tsx`) — Brak H1 na `/filmy` i `/o-mnie`; ozdobne H1 w pasku marquee zaburzają hierarchię. Dodać po jednym semantycznym H1; marquee zamienić na `span` z `aria-hidden`.
- **A11Y-06** (`kontakt/page.tsx:107,181-214`) — Komunikat o wysłaniu formularza nie jest ogłaszany czytnikom ekranu i nie przejmuje fokusu. Owinąć w `role="status"` + `aria-live="polite"` lub przenieść fokus.
- **SEO-07** (`app/page.tsx:34`) — Strona główna nie eksportuje własnych metadanych (dziedziczy globalny tytuł). Dodać `metadata` z `title`/`description` pod słowa kluczowe oraz `alternates.canonical '/'`.
- **SEO-08** (`kontakt/page.tsx:1`, `portfolio/page.tsx:1`) — `/kontakt` i `/portfolio` to komponenty klienckie (`use client`), więc nie mogą mieć metadanych. Rozdzielić na serwerowy `page.tsx` z `metadata` + osobny komponent kliencki.
- **SEO-09** (`portfolio/page.tsx:62-86`, `PortfolioCard.tsx`, `lib/photos.tsx:1-40`) — Obrazy portfolio bez tekstu alternatywnego `alt` (pole `title` jest usuwane przed renderem). Dodać pole `alt`, nie usuwać go, przekazać do albumu i lightboxa.
- **SEO-10** (`blog/page.tsx`, `firma/page.tsx`, `process/page.tsx:1-58`) — Puste trasy-makiety indeksowalne przez Google (thin content). Usunąć lub oznaczyć `robots index:false` i wykluczyć z sitemap. `/process` używa nieistniejącej zmiennej `--font-geist-sans`.
- **QC-02** (`FooterLight.tsx`; `pixelBackground/index.jsx`; `useMemoryOptimization.ts`; `use-outside-click.ts`) — Martwy/nieimportowany kod (m.in. kopia stopki). Usunąć; wariant stopki przez prop `variant`.
- **QC-03** (`PerformanceMonitor.tsx`, `VideoPlayer.tsx:84`, hooki; `photos.tsx`) — Liczne `any` i 5 tablic zdjęć bez typu. Dodać lokalne interfejsy / `unknown`; typ `Photo`.
- **QC-04** (`tsconfig.json:11,32,37`; `globals.css:78-127`; `package.json:7`) — Błędne ścieżki `include`, brak `noUncheckedIndexedAccess`, brak testów (schematy, e-mail), CSS poza `layer`, mieszane importy, `dev:turbo` (`rm`) nie działa w PowerShell. Poprawić tsconfig, dodać vitest + E2E, klasy do `layer`, alias, `rimraf`.

## Znaleziska niskie / nice-to-have

- **SEC-03** (`app/lib/email.tsx:49-53`) — Temat e-maila bez usuwania znaków nowej linii w zod; nowe linie psują temat.
- **SEC-04** (`app/kontakt/page.tsx:91-93`, `FooterLight.tsx:49-53`) — Niespójny e-mail (mailto aeromat.pl vs tekst gmail) — ujednolicić.
- **PERF-05** (`PerformanceMonitor.tsx:36-87` + `layout.tsx:90`) — 3 obserwatory wydajności rejestrowane w produkcji bez efektu; dodać wczesny `return` poza trybem development.
- **PERF-06** (`globals.css:490,497,636,738,1210,1257,1297`) — Statyczne `will-change` na 7 selektorach; usunąć (GSAP zarządza tym przez `force3D`).
- **PERF-07** (`globals.css:112-126`) — Trzykrotnie zduplikowany gradient w `.gradient-new`; zostawić fallback + jedną deklarację.
- **PERF-08** (`next.config.js:55`) — `transpilePackages: ["three","gsap"]` prawdopodobnie zbędne w Next.js 16; spróbować usunąć i zweryfikować build.
- **A11Y-07** (`kontakt/page.tsx:120-121`) — Słaby wskaźnik fokusu w polach formularza; dodać `focus:ring-2` (≥3:1).
- **A11Y-08** (`PortfolioLightbox.tsx:16-26`, `Portfolio.tsx:56-62`) — Lightbox niedostępny, bo wyzwalacze nie reagują na klawiaturę (zależne od A11Y-02); opcjonalnie polskie etykiety kontrolek.
- **A11Y-09** (`Navbar.tsx:194`) — Usunięty pierścień fokusu na hamburgerze (`focus-visible:ring-0`); przywrócić widoczny wskaźnik.
- **SEO-11** (`kontakt/page.tsx:91-93`) — Niespójny e-mail (href vs tekst) — ujednolicić, użyć tego samego w schemacie `LocalBusiness`.
- **SEO-12** (`app/` brak `manifest.ts`, `layout.tsx` brak `verification`) — Brak manifestu PWA i kodu weryfikacji Search Console; dodać `app/manifest.ts` i `verification.google`.

## Co jest zrobione dobrze

**Bezpieczeństwo i kod**
- Sekrety tylko po stronie serwera; plik `.env` nie w repozytorium; brak otwartego przekaźnika poczty (open relay).
- Walidacja serwerowa przez zod; brak `dangerouslySetInnerHTML`; linki z `rel="noopener noreferrer"`; solidne nagłówki bezpieczeństwa.
- Ścisły TypeScript, zero `ts-ignore`/obejść; dobry podział warstw; fonty ładowane raz przez `next/font/google`.
- Sprzątanie kodu potwierdzone w drzewie roboczym (stary audyt 2026-05-15 nieaktualny).

**Wydajność**
- Hero (`GlitchedVideoHero.tsx`) wzorcowo zoptymalizowany pod LCP: poster jako `<img>` z `fetchPriority=high` i jawnymi wymiarami, dopasowany do `<link rel=preload>`; wideo ładowane po `requestIdleCallback`, osobne warianty mobile/desktop.
- Galeria (`Images.tsx`) bez zarzutu: jawne `width/height` (zero przesunięć układu / CLS), responsywne `sizes`, `loading=lazy`. W `Cards.tsx` `priority` tylko na pierwszej karcie.
- Bogata infrastruktura leniwego ładowania (`LazyComponents.tsx`): Mapy Google, siatka YouTube, Testimonials, odtwarzacz wideo w `dynamic(ssr:false)` + IntersectionObserver z estetycznymi szkieletami.
- Google Analytics ładowany `afterInteractive`; konfiguracja `next/image` z formatami AVIF/WebP; `splitChunks` z osobnymi grupami (three, maps, ui); nagłówki `Cache-Control: immutable`; `removeConsole` w produkcji; polyfill aliasowany do pustego modułu (~14 KB oszczędności).
- Naprawione względem poprzedniego audytu: skonwertowane/usunięte 4 pliki JPG, usunięte martwe klasy fontów yesteryear/allura.

**Dostępność**
- Poprawny język dokumentu (`lang="pl"`), landmark `<main>` na każdej podstronie, nawigacja w semantycznym `<nav>`.
- Wszystkie obrazy z atrybutem `alt`; obraz dekoracyjny hero ma `alt=""` + `aria-hidden`.
- Przyciski-ikony z polskim `aria-label`, menu mobilne z `aria-expanded`/`aria-controls`; ikony SVG social z `aria-hidden`/`focusable="false"`.
- Formularz kontaktowy wzorowo oetykietowany: `<label htmlFor>`, błędy z `role="alert"`, `noValidate`, `autoComplete`; odtwarzacz na podstronach z natywnymi kontrolkami.

**SEO**
- Favicon i ikony w konwencji App Router (`favicon.ico`, `icon.png`, `apple-icon.png`); sensowny globalny `title`/`description` po polsku.
- Dwie podstrony (`/o-mnie`, `/filmy`) mają własne, unikalne metadane.
- Gotowy, szczegółowy plan SEO w `docs/stories/story-technical-seo.md` (wzory sitemap, robots, schema, Open Graph) — do bezpośredniego wdrożenia.
- Google Analytics zintegrowany z regułą CSP; filmy na stronie głównej z opisowymi, lokalnymi tytułami (materiał pod przyszłe `VideoObject`).

## Plan naprawczy — priorytety

### Faza 1 — natychmiastowe (najwyższe ryzyko, niski/średni nakład)
1. **QC-01 / SEC-04 / SEO-11 — ujednolicić dane kontaktowe** (telefon i e-mail w jednej stałej). Mały nakład, realnie chroni przed utratą klientów. Naprawia trzy znaleziska naraz.
2. **SEC-02 — zabezpieczyć formularz** (limit po IP + honeypot). Chroni przed spamem i wyczerpaniem usługi pocztowej.
3. **PERF-01 — leniwe ładowanie `PanoramaScroll`** (`dynamic({ ssr:false })`). Jedna zmiana, ~600 KB mniej przy starcie strony głównej.
4. **SEO-01, SEO-02, SEO-03 — utworzyć `sitemap.ts`, `robots.ts`, dodać `metadataBase`.** Gotowy wzór w repo; fundament całego SEO i warunek wstępny dla SEO-04/05.

### Faza 2 — krótkoterminowe (1–2 tygodnie)
5. **SEC-01 — wdrożyć CSP na nonce** (usunąć `unsafe-inline`/`unsafe-eval`). Większy nakład (zmiana w middleware), ale istotnie podnosi bezpieczeństwo.
6. **A11Y-02 / A11Y-08 — udostępnić kafelki filmów i galerii z klawiatury** (`<button>` + obsługa Enter/Spacja). Odblokowuje portfolio i filmy dla klawiatury, a przy okazji lightbox.
7. **A11Y-01 — obsłużyć `prefers-reduced-motion`** (globalny blok CSS + warunki w gsap/framer-motion).
8. **SEO-04, SEO-05 — Open Graph/Twitter Card + JSON-LD `LocalBusiness`.** Podglądy udostępnień i widoczność lokalna w Google.
9. **SEO-06 — jeden H1 na stronie głównej** (resztę na h2/h3/`span`).
10. **PERF-02, PERF-03, PERF-04 — leniwe ładowanie i usunięcie zbędnych fontów** (Anton/Syne, lightbox na `/portfolio`, siatka YouTube na `/filmy`).
11. **SEO-07, SEO-08 — metadane strony głównej oraz rozdzielenie `/kontakt` i `/portfolio` na część serwerową + kliencką.**
12. **A11Y-03, A11Y-04, A11Y-06 — kontrast hover, przycisk pauzy hero, ogłaszanie sukcesu formularza.**
13. **SEO-09, SEO-10 — `alt` w portfolio; usunąć/odindeksować puste makiety (`/blog`, `/firma`, `/process`).**

### Faza 3 — długoterminowe (dług techniczny, jakość)
14. **QC-02, QC-03, QC-04 — usunąć martwy kod, wyeliminować `any`, poprawić tsconfig, dodać testy (vitest + E2E Playwright), `rimraf` zamiast `rm`.**
15. **A11Y-05, A11Y-07, A11Y-09 — H1 na podstronach, mocniejszy wskaźnik fokusu w formularzu i na hamburgerze.**
16. **SEC-03 — usuwać znaki nowej linii z tematu e-maila w zod.**
17. **PERF-05, PERF-06, PERF-07, PERF-08 — porządki wydajnościowe (PerformanceMonitor, will-change, zduplikowany gradient, transpilePackages).**
18. **SEO-12 — `manifest.ts` (PWA) + weryfikacja Google Search Console.**

---

*Raport wygenerowany zespołem 5 agentów audytujących (bezpieczeństwo, wydajność, jakość kodu, dostępność, SEO) + synteza. Łącznie 37 znalezisk.*
