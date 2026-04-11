# Raport UX/Frontend Audit — AeroMat

**Data:** 2026-04-06  
**Audytor:** CTO Agent (Claude Code)  
**Wersja:** Next.js 16.1.4, React 19.2.3, Tailwind 3.4.1  
**Zakres:** Strona glowna, Portfolio, Kontakt, Nawigacja, Footer, Animacje, SEO, Dostepnosc

---

## Podsumowanie Wykonawcze

AeroMat to wizualnie imponujaca strona portfolio z zaawansowanymi animacjami GSAP, Three.js panorama i efektami glitch/neon. Strona robi silne pierwsze wrazenie, ale ma istotne problemy w obszarach: dostepnosci (a11y), responsywnosci mobilnej, SEO, walidacji formularzy i czesci UX. Ponizej szczegolowa analiza w 10 kategoriach z ocenami 1-5.

---

## 1. Nawigacja — Ocena: 3/5

### Co dziala dobrze
- Navbar jest fixed i zawsze widoczny (z-index 100)
- Logo prowadzi do strony glownej
- Hamburger na mobile z animowana zamiana ikony (Menu/X via Framer Motion)
- Social media linki w desktop i mobile menu
- Przycisk glosnosci w navbarze (kontrola audio)
- Hover states z kolorem akcentowym (#ff7302)

### Problemy

**P1 — Brak linkow do /blog i /firma w nawigacji**  
Stub pages `/blog` i `/firma` istnieja w codebase, ale Navbar ich nie linkuje. Jesli nie sa gotowe, powinny byc usuniete z routingu lub wyswietlac komunikat "Wkrotce".
```
defaultItems = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Filmy", href: "/#w-akcji" },
  { label: "O mnie", href: "/#o-mnie" },
  { label: "Kontakt", href: "/kontakt" },
];
```

**P2 — Linki nawigacyjne uzywaja `<a href>` zamiast Next.js `<Link>`**  
Wewnetrzne linki w Navbar (`items.map`) renderowane przez `<a href>` zamiast `<Link>` z next/link. To powoduje pelne przeladowanie strony zamiast client-side navigation.

**P3 — Brak wskaznika aktywnej sekcji**  
Nie ma wizualnego wyrozniku aktywnego linku nawigacji (np. podkreslenie, bold) informujacego uzytkownika gdzie sie znajduje.

**P4 — Mobile menu nie blokuje scrollu tla**  
Gdy mobile menu jest otwarte, tlo nadal jest scrollowalne. Powinna byc blokada `overflow: hidden` na body.

**P5 — Brak aria-expanded na hamburger button**  
Przycisk hamburger nie ma atrybutu `aria-expanded` informujacego czytniki ekranowe o stanie menu.

**P6 — Brak skip-to-content link**  
Nie ma ukrytego linku "Przejdz do tresci" dla uzytkownikow klawiatury.

### Rekomendacje
1. Zamienic `<a href>` na `<Link>` dla linkow wewnetrznych
2. Dodac `aria-expanded={isMobileMenuOpen}` i `aria-label="Menu nawigacji"` 
3. Dodac skip-to-content link na poczatku body
4. Dodac active state indicator bazujacy na scroll position (IntersectionObserver)
5. Zablokowac scroll body gdy mobile menu jest otwarte

---

## 2. Strona Glowna (Homepage) — Ocena: 3/5

### Struktura sekcji (kolejnosc od gory)
1. GlitchedVideoHero — hero z wideo + typografia GSAP
2. Intro — "Maluje sciany, ktore opowiadaja historie..."
3. Card 0: Murale Wielkoformatowe + Spacer
4. Portfolio 1: Galeria murali
5. Card 1: Komunikacja Wizualna
6. Portfolio 2: Galeria szyldow
7. Card 2: Wnetrza i Dekoracje
8. Portfolio 3: Galeria wnetrz
9. Card 3: Inne (Projekty Specjalne)
10. Portfolio 4: Galeria projektow specjalnych
11. PanoramaScroll — Three.js panorama
12. Outro — "Masz sciane? Mam pomysl. Porozmawiajmy."
13. AboutMe — Kim jestem?
14. YouTube Videos Grid — Filmy
15. TrustedBy — Loga klientow
16. Testimonials — Opinie klientow
17. MuralsMap — Mapa murali

### Co dziala dobrze
- Efektowne hero z wideo i animowana typografia glitch
- Plynne przejscia miedzy sekcjami (card stacking z GSAP ScrollTrigger)
- Lazy loading ciezkich komponentow (YouTube, Testimonials, Map) z IntersectionObserver
- Skeleton/placeholder states dla lazy-loaded komponentow
- Neonowa animacja tekstu w Intro/Outro — realistyczny efekt zapalajacego sie neonu
- Marquee hover interaction na pierwszej karcie
- PerformanceMonitor do sledzenia Core Web Vitals

### Problemy

**P7 — Strona glowna jest ZA DLUGA**  
17 sekcji to zdecydowanie za duzo. Uzytkownik musi przescrollowac: hero + intro + 4 cards + 4 portfolia + panorama + outro + about me + filmy (9 filmow) + trusted by + testimonials + mapa. Na desktopie z pinned sections to okolo 30-40 ekranow scrollowania. Na mobile jeszcze wiecej.

**Rekomendacja:** Priorytetyzowac sekcje. Rozwazyc przeniesienie filmow na oddzielna strone lub pokazanie max 3 z linkiem "Zobacz wiecej". Mapa Google moze byc na stronie kontaktowej zamiast homepage.

**P8 — Cala strona glowna to "use client"**  
`app/page.tsx` jest Client Component z ogromnym useEffect (~680 linii). To oznacza:
- Zero SSR/SSG dla homepage — caly HTML generowany client-side
- Gorsze SEO (crawlery moga nie wykonac JS)
- Wolniejsze FCP i LCP
- Brak metadata export (niemozliwe w Client Component)

**P9 — Console.log w produkcji**  
Mimo ze `next.config.js` ma `removeConsole` w compiler, `app/page.tsx` ma dziesieki `console.log()` w useEffect. Te sa runtime i moga nie byc usuwane przez compiler w trybie strict.

**P10 — `window.innerWidth` zamiast matchMedia**  
```js
const isMobile = window.innerWidth < 768;
```
Uzycie `window.innerWidth` w useEffect nie reaguje na zmiane rozmiaru okna. Lepiej uzywac `matchMedia` z listenerem (jak w Cards.tsx).

**P11 — Brak CTA w widocznej czesci Outro**  
Sekcja Outro mowi "Masz sciane? Mam pomysl. Porozmawiajmy." ale nie ma zadnego buttona ani linku do kontaktu. To zmarnowana szansa na konwersje.

**P12 — WhoAmI2 komponent jest zakomentowany ale nadal zaimportowany(?)**  
W `page.tsx` uzyty jest `AboutMe`, ale `WhoAmI2` jest rowniez importowany przez `Services`. Duplikacja sekcji "Kim jestem?".

### Rekomendacje
1. Podzielic page.tsx na Server Component wrapper z Client Component sections
2. Dodac CTA button w Outro linkujacy do /kontakt
3. Skrocic homepage — przeniesc mape i filmy do oddzielnych stron
4. Zamienic `window.innerWidth` na `matchMedia` z event listenerem
5. Usunac console.log z production path

---

## 3. Portfolio (/portfolio) — Ocena: 3.5/5

### Co dziala dobrze
- Kategorie z Tabs (shadcn/ui) — filtrowanie po typie pracy
- Lightbox z pluginami (Fullscreen, Slideshow, Thumbnails, Zoom)
- RowsPhotoAlbum do eleganckiego layoutu galerii
- CTA sekcja na dole z linkiem do kontaktu
- Ciemna kolorystyka spojny z reszta strony

### Problemy

**P13 — Zakomentowany Compare component**  
Sekcja Compare (Before/After slider) jest zakomentowana. To swietne narzedzie dla artysty muralisty — powinno byc wlaczone.

**P14 — Brak metadata (SEO)**  
`/portfolio/page.tsx` jest Client Component ("use client") i nie exportuje metadata. Brak title, description, Open Graph dla strony portfolio.

**P15 — Tab categories nie matchuja do danych**  
Categories: "Wszystkie", "Murale", "Wnetrza", "Ptasia galeria", "Branding". Ale na homepage sa 4 kategorie: Murale Wielkoformatowe, Komunikacja Wizualna, Wnetrza i Dekoracje, Inne. Niespojnosc nazewnictwa.

**P16 — Brak animacji wejscia**  
Galeria nie ma zadnych animacji wejscia (stagger, fade-in) — wyswietla sie natychmiastowo co wyglada "płasko" w porownaniu z homepage.

### Rekomendacje
1. Wlaczyc Compare component (Before/After) jako showcase
2. Przekonwertowac na Server Component z metadata
3. Ujednolicic nazwy kategorii miedzy homepage a portfolio
4. Dodac stagger fade-in animacje dla zdjec w galerii

---

## 4. Kontakt (/kontakt) — Ocena: 2.5/5

### Co dziala dobrze
- react-hook-form + zod walidacja
- Server Action z rate limitingiem (3 emaili/h)
- Resend jako dostawca email
- Walidacja server-side (nie tylko client)

### Problemy

**P17 — Placeholder image**  
```jsx
<Image src="/placeholder.png" alt="image" ... />
```
Obok formularza wyswietlany jest `/placeholder.png` — to prawdopodobnie placeholder ktory nigdy nie zostal zamieniony na prawdziwe zdjecie.

**P18 — Brak feedback po wyslaniu formularza**  
Funkcja `onSubmit` wywoluje `send(values)` ale:
- Nie ma stanu loading (spinning indicator)
- Nie ma komunikatu sukcesu ("Wiadomosc wyslana!")
- Nie ma obslugi bledu (try/catch z wyswietleniem komunikatu)
- Formularz nie resetuje sie po udanym wyslaniu

**P19 — Brak metadata SEO**  
Client Component — brak exportu metadata. Strona kontaktowa nie ma title/description.

**P20 — Brak telefonu i adresu**  
Strona kontaktowa nie wyswietla numeru telefonu, adresu ani mapy. Dla artysty lokalnego to wazne informacje. Hero komponent (`VideoHero.tsx`) ma numer telefonu, ale kontakt go nie pokazuje.

**P21 — Walidacja zbyt minimalna**  
Schema `formSchema` wymaga `min(2)` dla imienia. Nie ma wlasnych komunikatow bledow — domyslne sa po angielsku ("String must contain at least 2 character(s)").

**P22 — Brak honeypot/anti-spam**  
Poza rate limitingiem po stronie serwera, nie ma zadnego mechanizmu anti-spam (honeypot field, captcha) na formularzu kontaktowym.

### Rekomendacje
1. Zamienic placeholder.png na zdjecie z realizacji lub kontaktowe
2. Dodac stan loading, komunikat sukcesu/bledu, reset formularza
3. Spolszczyc komunikaty walidacji (`z.string().min(2, "Imie musi miec co najmniej 2 znaki")`)
4. Dodac honeypot field (ukryte pole ktore boty wypelniaja)
5. Wyswietlic dane kontaktowe (telefon, email, lokalizacja)
6. Dodac mape Google na stronie kontaktowej

---

## 5. Responsywnosc — Ocena: 3/5

### Co dziala dobrze
- Tailwind breakpoints dobrze zdefiniowane (xxs: 320px do 4xl: 1920px)
- GlitchedVideoHero ma responsywny layout z breakpointami (desktop/tablet/mobile/small)
- Cards maja wersje mobilne i desktopowe zdjec
- PanoramaScroll ma oddzielny ScrollTrigger dla mobile (scrub + pin)
- Navbar responsywny z hamburger menu na mobile

### Problemy

**P23 — Lenis smooth scroll wylaczony na mobile — dobrze, ale...**  
Lenis jest wylaczony na mobile (co jest dobre — oszczedza RAM), ale ScrollTrigger z GSAP pinning na mobile moze powodowac jank i zacieranie (szarpanie) na slabszych urzadzeniach.

**P24 — Breakpoint sm: 768px w Tailwind != sm w GSAP**  
Tailwind ma `sm: 768px`, ale GSAP matchMedia w page.tsx uzywa `(max-width: 767px)`. To jest poprawne technicznie, ale w GlitchedVideoHero `getBreakpoint()` uzywa:
```js
if (w >= 1025) return "desktop";
if (w > 768) return "tablet";  // 769-1024
if (w >= 480) return "mobile"; // 480-768
return "small"; // <480
```
To nie matchuje do Tailwind breakpoints i moze powodowac niespojne zachowania.

**P25 — Testimonials carousel na malych ekranach**  
Carousel z nawigacja wheel (w-24, h-[336px]) + duzy content area. Na ekranach <375px nawigacja moze sie wychodzic poza viewport. Minimalny testowany rozmiar: `xxs:h-[350px]` (320px szerokosc).

**P26 — WhoAmI2 tekst z kolorem text-gray-600 na czarnym tle**  
Opis w WhoAmI2:
```jsx
<p className="text-sm xsm:text-base md:text-md lg:text-lg text-semibold text-gray-600 ...">
```
`text-gray-600` na czarnym tle (#000) ma zbyt niski kontrast (WCAG fail). AboutMe komponent poprawnie uzywa `text-gray-300`.

**P27 — Footer "Made by ." — brak nazwy**  
```jsx
<p>© {new Date().getFullYear()} Made by . All rights reserved.</p>
```
Pusta wartosc po "Made by" — brakuje nazwy firmy/artysty.

### Rekomendacje
1. Ujednolicic breakpoints miedzy Tailwind i JS (GSAP, getBreakpoint)
2. Przetestowac na urzadzeniach 320px (iPhone SE)
3. Poprawic kontrast w WhoAmI2 (text-gray-600 -> text-gray-300)
4. Uzupelnic "Made by [AeroMat]" w Footer

---

## 6. Typografia — Ocena: 3.5/5

### System fontow
- **Inter** (--font-inter) — body text, opisy, nawigacja
- **Bebas Neue** (--font-bebas) — headingi sekcji, panorama captions, AboutMe h2
- **Anton** (--font-anton) — hero typografia (GlitchedVideoHero), Cards titles, fancy-text
- **Caveat** (--font-caveat) — Intro/Outro (recznie pisane uczucie, neonowy tekst)

### Co dziala dobrze
- Fonty ladowane przez next/font/google (automatyczny self-hosting, brak FOUT)
- Subsety latin + latin-ext (obsluga polskich znakow)
- Hierarchia fontow jest sensowna: display (Anton/Bebas) + body (Inter) + accent (Caveat)
- clamp() dla responsywnych rozmiarow w panorama captions i hero

### Problemy

**P28 — 4 rozne display fonts to za duzo**  
Anton, Bebas Neue, i Caveat sa uzywane jako display fonts. To 3 display + 1 body = 4 fonty do zaladowania. Kazdy font dodaje ~20-50KB do poczatkowego loadu.

**P29 — Niespojne definiowanie fontow**  
Fonty definiowane na 3 sposoby:
1. CSS variable: `font-family: var(--font-anton)` (poprawnie)
2. Tailwind: `font-[family-name:var(--font-caveat)]` (niestandardowy inline)  
3. CSS class: `.anton-regular { font-family: Anton, serif; }` (fallback serif zamiast sans-serif)

Brak spojnego systemu — rozne komponenty uzywaja roznych metod.

**P30 — html lang="en" zamiast "pl"**  
```jsx
<html lang="en">
```
Strona jest w jezyku polskim, ale atrybut lang wskazuje angielski. To wazne dla SEO i czytnikow ekranowych.

**P31 — Brak font-display strategy widocznej**  
next/font automatycznie ustawia `font-display: swap`, ale brak explicit kontroli. Dla display fontow (Anton, Bebas) `font-display: optional` moze byc lepsze (unika layout shift).

### Rekomendacje
1. Zmienic `<html lang="en">` na `<html lang="pl">`
2. Rozwazyc usuniecie jednego z display fontow (Anton vs Bebas Neue — sa bardzo podobne)
3. Ujednolicic sposob uzywania fontow (Tailwind classes, nie inline)
4. Dodac explicit `display: 'swap'` lub `display: 'optional'` w next/font config

---

## 7. Kolory — Ocena: 3.5/5

### Paleta
- **Tlo:** #000000 (czarny) — dominujacy
- **Akcent glowny:** #ff7302 / #FE9100 / #e87f00 (pomaranczowy) — CTA, hover, linki
- **Tekst:** #ffffff (bialy) — naglowki, #d1d5db (gray-300) — body, #9ca3af (gray-400) — secondary
- **Glitch efekty:** #0af (niebieski), #ffe600 (zolty) — hero typografia
- **Neon:** bialy z text-shadow niebieskim — Intro/Outro
- **Cards dim:** czarny gradient overlay na zdjeciach

### Co dziala dobrze
- Ciemna paleta idealnie pasuje do artysty muralisty/street art
- Pomaranczowy akcent jest wyrazisty i przyciaga uwage
- Gradient w Footer (from-black to-[#2d1a0a]) daje cieplejszy zakonczenie

### Problemy

**P32 — Niespojnosc koloru akcentowego**  
Uzyto kilku wariantow pomaranczowego:
- `#ff7302` — Navbar hover, Portfolio tabs, CTA buttons
- `#FE9100` — Hero CTA button (VideoHero.tsx), FlipWords
- `#e87f00` — hover state (GlitchedVideoHero)
- `#e56502` — hover state (Portfolio CTA)
- `#FF6800` — WhoAmI2 span kolor

Powinien byc JEDEN kolor akcentowy zdefiniowany w CSS variables.

**P33 — CSS variables zdefiniowane ale rzadko uzywane**  
globals.css definiuje pelny system kolorow (--accent, --primary, itd.) ale wiekszosc komponentow uzywa hardcoded hex:
```jsx
className="hover:text-[#ff7302]"   // zamiast text-accent
className="bg-[#ff7302]"           // zamiast bg-accent
```
System kolorow shadcn/ui jest zdefiniowany ale nie uzywany.

**P34 — Ogromna ilosc nieuzywanych zmiennych kolorystycznych**  
globals.css definiuje ~60 zmiennych kolorystycznych (green-light/medium/dark, magenta, bronze, cream, ivory, itd.) z pelnym dark mode wariantem. Wiekszosc z nich NIE jest uzywana nigdzie w kodzie. To bloat w CSS.

**P35 — Brak dark mode implementation**  
Mimo ze `tailwind.config.ts` ma `darkMode: ["class"]` i globals.css ma `.dark {}` sekcje, nie ma zadnego mechanizmu przelaczania (next-themes nie jest uzyte, brak toggle). Strona jest zawsze "ciemna" natywnie (bg-black), wiec dark mode variables sa redundantne.

### Rekomendacje
1. Zdefiniowac JEDEN kolor akcentowy jako CSS variable i uzywac go konsekwentnie
2. Usunac nieuzywane zmienne kolorystyczne z globals.css
3. Przelaczac sie na Tailwind semantic colors (bg-accent, text-primary) zamiast hex
4. Usunac cala sekcje .dark {} jesli dark mode nie jest planowany

---

## 8. Animacje — Ocena: 4/5

### Stack animacji
- **GSAP** + ScrollTrigger + SplitText — core scroll animations, card pinning, text reveals
- **Lenis** — smooth scroll (tylko desktop)
- **Three.js** — PanoramaScroll (panoramic image viewer)
- **Framer Motion** — Navbar menu, YouTube overlay, Testimonials carousel
- **CSS** — marquee, neon glow, glitch effects, flip cards

### Co dziala dobrze
- Kart-stacking effect jest imponujacy i dobrze wykonany
- Neonowa animacja tekstu (Intro/Outro) jest realistyczna i kreatywna
- GlitchedVideoHero typografia jest unikalna i zapamietywalna
- PanoramaScroll z Three.js to oryginalne podejscie do showcasinguprojektu
- Lazy loading + IntersectionObserver dla ciezkich komponentow
- Proper cleanup w useEffect (kill ScrollTrigger, destroy Lenis, dispose Three.js)
- matchMedia w GSAP — rozne zachowania na desktop vs mobile

### Problemy

**P36 — Potrojny stack animacji jest overkill**  
GSAP + Framer Motion + CSS animations — trzy rozne systemy animacji. To zwieksza bundle size i komplikuje utrzymanie. Framer Motion jest uzywany minimalnie (tylko Navbar i YouTube overlay).

**P37 — Brak prefers-reduced-motion**  
Nie ma nigdzie `@media (prefers-reduced-motion: reduce)`. Uzytkownicy z epilepsja lub wrażliwoscia na ruch nie moga wylaczych animacji. Glitch effects i neon flicker moga byc problematyczne.

**P38 — PanoramaScroll + Three.js laduje zawsze**  
Mimo ze inne ciezkie komponenty sa lazy-loaded (YouTube, Testimonials, Map), PanoramaScroll jest importowany bezposrednio w page.tsx (nie lazy). Three.js to duzy bundle (~600KB).

**Uwaga:** W LazyComponents.tsx jest `LazyPanoramaScrollWithIntersection` ale w page.tsx uzyty jest bezposredni import `PanoramaScroll`. To moze byc swiadoma decyzja (panorama jest w srodku card-stacking flow i musi byc w DOM od poczatku dla ScrollTrigger pinning).

**P39 — 800ms glitch interval moze byc meczacy**  
GlitchedVideoHero ma `setInterval(tick, 800)` — co 800ms zmienia sie podswietlony element. Na dluzszych wizytach moze to meczyc oczy.

### Rekomendacje
1. Dodac `@media (prefers-reduced-motion: reduce)` — wylaczac glitch, neon flicker, ScrollTrigger scrub
2. Rozwazyc usuniecie Framer Motion i zastapienie GSAP-em (redukcja bundle)
3. Spowolnic glitch interval do 2-3 sekund
4. Dodac mozliwosc wylaczenia animacji (przycisk w UI)

---

## 9. SEO — Ocena: 2/5

### Co dziala dobrze
- metadata w layout.tsx: title i description
- Security headers w next.config.js (CSP, X-Frame-Options, HSTS)
- Semantyczne HTML w niektorych komponentach (section, header, footer, main)
- Cache-Control headers dla zasobow statycznych (1 rok, immutable)

### Problemy

**P40 — Homepage jest Client Component — brak SSR**  
`app/page.tsx` ma `"use client"` — cala strona glowna renderuje sie na kliencie. Crawlery Google wykonuja JS, ale:
- Wolniejszy FCP/LCP
- Brak export metadata (niemozliwe w Client Component)
- Brak generateStaticParams, brak ISR
- Gorszy ranking SEO

**P41 — Brak metadata na podstronach**  
- `/portfolio/page.tsx` — brak metadata (Client Component)
- `/kontakt/page.tsx` — brak metadata (Client Component)
- `/blog/page.tsx` — stub, brak metadata
- `/firma/page.tsx` — stub, brak metadata

**P42 — `<html lang="en">` zamiast "pl"**  
Powtorzenie P30 — krytyczne dla SEO. Google uzywa lang do klasyfikacji jezyka strony.

**P43 — Brak sitemap.xml i robots.txt**  
Nie znaleziono `app/sitemap.ts` ani `public/robots.txt`. To podstawowe pliki SEO.

**P44 — Brak JSON-LD structured data**  
Strona artysty lokalnego powinna miec:
- LocalBusiness schema
- Person schema (artysta)
- ImageGallery schema (portfolio)
- Service schema (uslugi)

**P45 — images.unoptimized: true w next.config.js**  
Optymalizacja obrazow Next.js jest wylaczona:
```js
images: { unoptimized: true }
```
Komentarz mowi "source images already converted to WebP" ale:
- Brak automatycznego resizowania per viewport
- Brak lazy loading z blur placeholder
- Brak WebP/AVIF conversion dla PNG (logo)

**P46 — YouTube thumbnails ladowane z img zamiast next/image**  
```jsx
<img src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} ...>
```
Native `<img>` zamiast `<Image>` — brak lazy loading, brak optimization.

**P47 — Services.tsx uzywa native `<img>` zamiast next/image**  
Wewnatrz content kart (AppleCards) uzyte sa native `<img>` z hardcoded width/height. Brak optymalizacji obrazow.

### Rekomendacje
1. Refaktor homepage: Server Component wrapper + Client Component sections
2. Dodac metadata do kazdej strony (title, description, OG)
3. Zmienic `lang="en"` na `lang="pl"`
4. Dodac `app/sitemap.ts` z dynamicznymi URL-ami
5. Dodac `public/robots.txt` lub `app/robots.ts`
6. Dodac JSON-LD structured data (LocalBusiness, Person, ImageGallery)
7. Wlaczyc next/image optimization (usunac `unoptimized: true`)
8. Zamienic native `<img>` na `<Image>` wszedzie

---

## 10. Dostepnosc (a11y) — Ocena: 2/5

### Co dziala dobrze
- aria-label na przyciskach social media
- aria-label na przyciskach dzwieku (muted/unmuted)
- aria-hidden na elementach dekoracyjnych (card-dim)
- aria-label na przyciskach nawigacji w Testimonials
- Semantyczne tagi HTML (section, nav, main, footer, header)

### Problemy

**P48 — Brak alt text na wielu obrazach**  
- TapeRight (logo klientow): `alt="Logo ${index + 1}"` — generyczne, nie mowi jaka firma
- Testimonials: `alt=""` na profilowych obrazach w wheel — powinno byc imie osoby
- WhoAmI2: `alt="Masked content"` — nieopisowy
- Kontakt: `alt="image"` — kompletnie nieopisowy

**P49 — Brak focus styles**  
Wiele interaktywnych elementow (karty portfolio, video cards, carousel buttons) nie ma widocznych stylów focus. `focus-visible:ring-0` na hamburger button jawnie usuwa focus ring.

**P50 — Animacje bez prefers-reduced-motion (powtorzenie P37)**  
Kluczowe dla uzytkownikow z zaburzeniami vestibularnymi. Glitch, neon flicker i parallax scrolling moga powodowac zawroty glowy.

**P51 — Brak ARIA landmarks**  
Navbar nie ma `role="navigation"` (motion.nav uzywa `<nav>`, co jest OK). Ale main content area nie ma `role="main"` explicit, i sekcje nie maja `aria-label` identyfikujacych je.

**P52 — Formularz kontaktowy — brak autocomplete**  
Pola formularza nie maja atrybutow `autoComplete`:
```jsx
<Input placeholder="Twoje imie" />  // brak autoComplete="given-name"
<Input placeholder="Twoj email" />  // brak autoComplete="email"
```

**P53 — YouTube iframe brak title**  
Inline iframes w mobile mode maja `title={video.title}` (OK), ale sandbox moze blokowac dostepnosc.

**P54 — Keyboard navigation przez card-stacking sections**  
GSAP pinning z position:fixed sprawia, ze keyboard navigation (Tab) moze byc nieprzewidywalna — fokus moze "skakac" miedzy pinned elementami.

### Rekomendacje
1. Poprawic alt text na wszystkich obrazach (opisowe, nie generyczne)
2. Dodac `@media (prefers-reduced-motion: reduce)` globaly
3. Dodac `autoComplete` na polach formularza
4. Dodac widoczne focus styles (focus-visible:ring-2)
5. Dodac `aria-label` na sekcjach (np. `aria-label="Portfolio murali"`)
6. Przetestowac keyboard navigation z czytnikiem ekranowym

---

## Dodatkowe Obserwacje

### Stub Pages
- `/blog` — renderuje `<div>Blog</div>` — nie powinno byc dostepne dla uzytkownikow
- `/firma` — renderuje `<div>Firma</div>` — nie powinno byc dostepne dla uzytkownikow

**Rekomendacja:** Dodac redirect lub strone "Wkrotce" z informacja i mozliwoscia powrotu. Albo usunac z routingu az beda gotowe.

### Bundle Size
Strona laduje ciezkie biblioteki:
- GSAP + ScrollTrigger + SplitText (~100KB gzipped)
- Three.js (~180KB gzipped)
- Framer Motion (~40KB gzipped)
- Lenis (~8KB gzipped)
- embla-carousel (~10KB gzipped)

Laczny JS bundle na homepage moze przekraczac 400KB gzipped. Rekomendacja: code-splitting i lazy loading Three.js.

### Komentarz w kodzie / Dead Code
- Duzo zakomentowanego kodu w Services.tsx, VideoHero.tsx, WhoAmI2.tsx, portfolio/page.tsx
- Importy nieuzywanych komponentow (np. `import Services from "./components/Services"` ale nie uzywany na homepage)

---

## Tabela Podsumowujaca

| Kategoria | Ocena | Priorytet naprawy |
|-----------|-------|-------------------|
| 1. Nawigacja | 3/5 | Sredni |
| 2. Strona Glowna | 3/5 | Wysoki |
| 3. Portfolio | 3.5/5 | Sredni |
| 4. Kontakt | 2.5/5 | Wysoki |
| 5. Responsywnosc | 3/5 | Sredni |
| 6. Typografia | 3.5/5 | Niski |
| 7. Kolory | 3.5/5 | Niski |
| 8. Animacje | 4/5 | Sredni |
| 9. SEO | 2/5 | **Krytyczny** |
| 10. Dostepnosc | 2/5 | **Krytyczny** |
| **Srednia** | **3.0/5** | |

---

## Top 10 Rekomendacji (priorytet malejacy)

1. **[SEO/Krytyczny]** Zmienic `<html lang="en">` na `<html lang="pl">`
2. **[SEO/Krytyczny]** Dodac metadata (title, description, OG) do kazdej strony
3. **[SEO/Krytyczny]** Dodac sitemap.xml i robots.txt
4. **[a11y/Krytyczny]** Dodac `@media (prefers-reduced-motion: reduce)` 
5. **[UX/Wysoki]** Naprawic formularz kontaktowy — feedback, loading state, polskie komunikaty bledow
6. **[UX/Wysoki]** Dodac CTA button w Outro sekcji (link do /kontakt)
7. **[SEO/Wysoki]** Wlaczyc next/image optimization (usunac `unoptimized: true`)
8. **[a11y/Sredni]** Poprawic alt text na obrazach, dodac focus styles
9. **[Perf/Sredni]** Ujednolicic kolor akcentowy — jeden CSS variable
10. **[UX/Sredni]** Zamienic `<a href>` na `<Link>` w Navbar

---

*Raport wygenerowany automatycznie przez Claude Code CTO Agent.*
