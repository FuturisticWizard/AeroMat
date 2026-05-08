# Naprawione Problemy - Aeromat

## 🔧 Problemy Naprawione

### 1. MapTiler API Error (RESOLVED)
**Problem**: 
```
AJAXError: Failed to fetch (0): https://api.maptiler.com/maps/streets/style.json?key=9S9fXnl3QBvnUZXAddkV
```

**Rozwiązanie**:
- Zastąpiono płatne MapTiler API bezpłatną OpenStreetMap
- Konfiguracja w `app/components/MapComponent.tsx`
- Używa standardowych OSM tiles bez konieczności API key

**Kod**:
```javascript
style: {
  version: 8,
  sources: {
    'osm': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm'
    }
  ]
}
```

### 2. Next.js Image Quality Warnings (RESOLVED)
**Problem**:
```
Image with src "/images/komeko-mural.webp" is using quality "85" which is not configured in images.qualities [75].
```

**Rozwiązanie**:
- Dodano `qualities: [75, 85]` do next.config.js
- Wszystkie obrazy mogą teraz używać quality 85 bez warnings

**Kod**:
```javascript
// next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24 * 30,
  qualities: [75, 85], // ✅ Added quality 85 support
},
```

### 3. Turbopack Workspace Warning (RESOLVED)
**Problem**:
```
Warning: Next.js inferred your workspace root, but it may not be correct.
We detected multiple lockfiles and selected the directory of /mnt/d/package-lock.json as the root directory.
```

**Rozwiązanie**:
- Dodano `turbopack.root` configuration do next.config.js
- Explicitly ustawiono root directory

**Kod**:
```javascript
// next.config.js
turbopack: {
  root: __dirname,
},
```

## ✅ Status Po Naprawach

### Development Server
- ✅ Next.js 16.0.1 działa poprawnie
- ✅ Port 3002 (3000 zajęty)
- ✅ Ready in ~37s
- ✅ Brak critical errors

### Map Component
- ✅ OpenStreetMap tiles ładują się poprawnie
- ✅ Markers działają (5 lokalizacji w Lublinie)
- ✅ Popups z YouTube embeds funktionalne
- ✅ Brak API key dependencies

### Image Optimization
- ✅ Quality 85 wspierana w konfiguracji
- ✅ WebP/AVIF conversion aktywna
- ✅ Lazy loading działające
- ✅ Blur placeholders aktywne

## 🎯 Pozostałe Warnings (Non-Critical)

### Browserslist Update (Optional)
```bash
npx update-browserslist-db@latest
```
**Impact**: Niski - tylko data freshness dla browser compatibility

### Port 3000 Usage (Informational)
- Dev server automatycznie przełączył na port 3002
- To normalne behavior gdy port 3000 jest zajęty

## 🚀 Status Aplikacji

**Development**: ✅ Fully functional
**Build**: ✅ Successfully compiles  
**Performance**: ✅ Optimized (React 19 + Next.js 16)
**Security**: ✅ Headers configured, vulnerabilities fixed
**Maps**: ✅ Working with free OpenStreetMap
**Images**: ✅ Optimized with proper quality settings

## 🔄 Następne Kroki (Opcjonalne)

1. **Browserslist Update**: `npx update-browserslist-db@latest`
2. **Image Conversion**: Convert existing JPG images to WebP format
3. **Performance Testing**: Run Lighthouse audit
4. **Production Deployment**: Ready for deployment

Aplikacja jest teraz w pełni funkcjonalna bez critical errors! 🎉

---

## 📝 Sesja 2026-05-08 — UX poprawki (home + kontakt + portfolio + o-mnie)

Realizacja punktów 7, 9, 11/12 z `docs/todos.txt`.

### 1. Przeniesienie neonu intro (todos #9)

**Problem**: Napis neonowy "Maluję ściany, które opowiadają historie..." był pod hero. Klient chciał, żeby pojawiał się dopiero po wszystkich PortfolioCard, tuż przed sekcją PanoramaScroll (z animacją "PRECYZJA MATERIAŁÓW" / KOM-EKO).

**Rozwiązanie**: `app/page.tsx`
- Usunięto `<Intro />` zaraz po `<GlitchedVideoHero />`.
- Wstawiono `<Intro />` pomiędzy ostatnim `<PortfolioCard data={projektySpecjalnePhotos} … />` (z-[70]) a wrapperem `<PanoramaScroll />` (z-[90]), opakowany w `<div className="relative z-[80]">` żeby czysto wpasować się w stacking context.
- Animacja świecenia neonu jest podpięta przez selektor `.intro` w `HomeAnimations.tsx`, więc działa niezależnie od pozycji w drzewie.

### 2. Reorder zakładki "Inne" w `/portfolio` (todos #7)

**Problem**: Klient prosił aby w `/portfolio` w zakładce "Inne" wyświetlały się najpierw samochody, potem kampery, na końcu te malowane na garażach.

**Rozwiązanie**: `app/lib/photos.tsx` — kategoria `Inne` w `allPhotos` ma teraz porządek:
1. **Samochody** (5 wpisów) — `samochodzik-7a/-10/-11/-3/-12.webp` z `/Animation/Projekty_Specjalne/PortfolioCard/`, indeksy 73-77 (dodane do `allPhotos`, wcześniej tylko w `projektySpecjalnePhotos`).
2. **Kampery** (4 wpisy) — `kamper_1-4.webp`.
3. **Garaże / Brending** (7 wpisów) — `przedszkole 1v`, `grafika 4/6a/7/8`, `tif 2d`, `w2`.

### 3. Nowa strona `/kontakt` — V6 Floating Panel (todos #11)

**Problem**: Stary formularz krok-po-kroku (4 ekrany) był nadmiarowy. Klient chciał uproszczonego formularza + bezpośredni kontakt (telefon, email).

**Rozwiązanie**: `app/kontakt/page.tsx` — pełen rewrite (461 → 220 linii) wzorowany na wariancie V6 z `app/kontakt-mockup/page.tsx`.
- **Layout**: pełnoekranowe portretowe tło (`/images/portret.webp`) + gradient `bg-gradient-to-br from-black/85 via-black/40 to-black/75`.
- **Headline** w lewym górnym rogu: "Zacznijmy od krótkiej **wiadomości.**" (Bebas, akcent #ff7302).
- **Lewy dolny róg**: kontakt info z ikonami z `lucide-react` (Mail, Phone, MapPin), klikalne `mailto:` / `tel:`.
- **Prawy dolny róg**: szklisty floating panel formularza (`backdrop-blur-md`, border `white/15`, bg `white/[0.06]`, eyebrow "Napisz do mnie!").
- **Backend**: zachowano `react-hook-form` + zod (`formSchema`: `firstName/email/title/message`) + `send()` z `lib/email.tsx`. Dodano 4. pole "Temat" do formularza V6 (mockup miał 3) żeby zgadzało się ze schematem.
- **Stany**: `idle | sending | sent | error`. Po wysyłce panel zostaje, ale zawartość zmienia się na success state z CTA do home/portfolio.
- **Pozycja**: dolny rząd (kontakt info + form) podniesiony o `md:-translate-y-[14vh] lg:-translate-y-[20vh] xl:-translate-y-[24vh]` żeby siedział mniej-więcej na środku strony na desktop bez rozciągania sekcji (ważne — `padding-bottom` powiększał `min-height` co skalowało background image).
- Mockup `/kontakt-mockup` zostawiony nietknięty jako podgląd wszystkich wariantów V1-V6.

### 4. Sekcja "O mnie" — nowe zdjęcie (todos #12)

`app/components/AboutMe.tsx`: portret zmieniony z `/images/portret.webp` na `/images/oMnie.webp`.

`docs/oMnie.jpg` (3169×1842, GH5) → `public/images/oMnie.webp` (q=85, method=6, EXIF orientation applied) — konwersja przez Pillow (`ImageOps.exif_transpose`).

### 5. Czytelność tekstu w formularzu kontaktowym

**Problem**: Tekst wpisywany w pola formularza był mało czytelny / niewidoczny (autofill Chrome dawał ciemny tekst na żółtym tle, placeholder za blady).

**Rozwiązanie**: `app/globals.css` — nowy blok `.kontakt-form input/textarea`:
- Wymusza `color: #fff` i `caret-color: #ff7302`.
- Placeholder: `rgba(255,255,255,0.55)`.
- Override autofill Chrome/Edge: `-webkit-text-fill-color: #fff` + `-webkit-box-shadow: 0 0 0 1000px rgba(20,20,20,0.95) inset` + `transition: background-color 9999s ease-in-out 0s` (klasyczny trick żeby autofill nie zalewał pola żółtym tłem).

`app/kontakt/page.tsx` — formularz dostał klasę `kontakt-form`, usunięto zdublowane `placeholder:opacity-40 / focus:placeholder:opacity-60` z input className.

### 6. Commits

| SHA | Opis |
|-----|------|
| `946bd1e` | feat(home/kontakt): move neon intro between portfolios + V6 contact, reorder Inne |
| `8581409` | fix(kontakt): readable form text + autofill override; rename brief headline |
| `70ff49f` | fix(kontakt): lift form/contact row toward middle on desktop without scaling bg |

### 7. Pozostałe punkty z `docs/todos.txt` (do zrobienia)

- **#1** — przycisk "ZOBACZ PORTFOLIO" / "REALIZACJE" na hero z linkiem do `/portfolio`; przycisk "Bezpłatna wycena" przesunąć/usunąć.
- **#3** — błąd lokalizacji muralu "60-lecie LPEC" na mapie (powinien być na ul. Orkana, nie Puławskiej; współrzędne ~51.231451, 22.511928). Mural nie istnieje obecnie w `GoogleMap.tsx` jako osobny POI — wymaga dodania.
- **#4** — usunąć mural motyla z całej strony.
- **#5** — aktualizacja sekcji FILMY (kolejność/lista) — czeka na maila.
- **#8** — rozsynchronizowane zachowanie powiększania zdjęć w galerii (lightbox) — do zdiagnozowania.
- **#10** — poprawka pierwszej galerii na home (animacja portfolio jak w cam-l.pl).
- **#11** — kwadratowe zdjęcie na "O mnie" z plecakiem-ptakiem (zostawione obecne `oMnie.webp` 3169×1842).