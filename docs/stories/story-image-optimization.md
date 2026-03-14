# Story: Optymalizacja obrazów i zasobów multimedialnych

**Epic:** Performance Optimization & Modernizacja
**Status:** Do realizacji
**Priorytet:** Krytyczny
**Oszacowanie:** 21 Story Points
**Raport źródłowy:** `docs/RAPORT-OPTYMALIZACJA-ZDJEC.md`

---

## User Story

**Jako użytkownik** chcę, aby obrazy w galerii i portfolio ładowały się szybko, abym mógł sprawnie przeglądać prace artysty bez długiego oczekiwania, nawet na wolniejszym połączeniu mobilnym.

## Wartość biznesowa

- **Wydajność:** Redukcja rozmiaru zasobów graficznych z 346 MB do ~107 MB (69% oszczędności)
- **SEO:** Poprawa wskaźników Core Web Vitals (LCP, CLS) — wyższe pozycje w Google
- **Użyteczność mobilna:** Dramatycznie szybsze ładowanie na urządzeniach mobilnych
- **Koszty hostingu:** Niższe zużycie transferu i pasma serwera

---

## Stan obecny (dane z audytu 2026-03-08)

| Kategoria zasobów | Liczba plików | Łączny rozmiar |
|-------------------|:------------:|:--------------:|
| Zdjęcia JPEG | 115 | 215 MB |
| Grafiki PNG | 84 | 53 MB |
| Zdjęcia WebP | 24 | 28 MB |
| Pliki wideo | 8 | ~50 MB |
| **Razem** | **234** | **~346 MB** |

### Kluczowe problemy

1. **92 MB** w katalogu Portfolio — zdjęcia w oryginalnej rozdzielczości aparatu (do 5776×4336 px, do 12 MB/plik)
2. **45 MB** w katalogu pngs — dekoracyjne plamy farby w rozdzielczości 7448×6567 px
3. **5 komponentów** używa surowego `<img>` zamiast `<Image>` z Next.js — omija optymalizację
4. **4 pary zduplikowanych plików** (~7 MB zmarnowane)
5. **Błąd w kodzie:** `Process.tsx` — nieprawidłowa właściwość `object-fit="cover"`
6. **Źle dobrane `sizes`** na komponentach ikon — generują zbyt duże warianty

---

## Plan realizacji

### Faza 1: Konwersja plików graficznych (8 SP)

#### Zadanie 1.1: Konwersja plików PNG z katalogu `/pngs/` do WebP
**Oszczędność: ~42 MB**

- [ ] Zmniejszenie rozdzielczości z 7448 px do 2000 px szerokości
- [ ] Konwersja do formatu WebP z zachowaniem kanału przezroczystości (alfa)
- [ ] Jakość kompresji: 80
- [ ] Aktualizacja wszystkich odwołań w komponentach
- [ ] Usunięcie oryginalnych plików PNG po weryfikacji

Pliki do konwersji:
- `pngs/black-spray.png` (7,3 MB)
- `pngs/yellow-spray.png` (6,9 MB)
- `pngs/red-spray.png` (6,9 MB)
- `pngs/purple-spray.png` (6,9 MB)
- `pngs/orange-spray.png` (6,9 MB)
- `pngs/granat-spray.png` (6,9 MB)
- `pngs/brush-strok-1.png` (2,8 MB)

```bash
for f in public/pngs/*.png; do
  cwebp -q 80 -resize 2000 0 "$f" -o "${f%.png}.webp"
done
```

#### Zadanie 1.2: Konwersja zdjęć portfolio do WebP
**Oszczędność: ~87 MB**

- [ ] Zmniejszenie rozdzielczości z 5776 px do 2400 px szerokości
- [ ] Konwersja do formatu WebP z jakością 80
- [ ] Aktualizacja ścieżek w pliku `app/lib/photos.tsx`
- [ ] Aktualizacja ścieżek we wszystkich komponentach odwołujących się do Portfolio
- [ ] Usunięcie oryginalnych plików JPEG po weryfikacji
- [ ] Weryfikacja wizualna każdego zdjęcia po konwersji

Pliki do konwersji (17 plików, od największych):
- `Portfolio/mural-pieski.jpg` (12 MB)
- `Portfolio/mural-spongebob.jpg` (11 MB)
- `Portfolio/mural-mario.jpg` (11 MB)
- `Portfolio/mural-magic-boxes.jpg` (9,8 MB)
- `Portfolio/mural-rybka.jpg` (8,2 MB)
- oraz 12 kolejnych plików (2–7 MB każdy)

```bash
for f in public/Portfolio/*.jpg; do
  cwebp -q 80 -resize 2400 0 "$f" -o "${f%.jpg}.webp"
done
```

#### Zadanie 1.3: Konwersja galerii zdjęć do WebP
**Oszczędność: ~40 MB**

- [ ] Konwersja ~50 plików JPEG z katalogu `/images/` do WebP (1920 px szerokości)
- [ ] Usunięcie 19 oryginalnych plików JPEG, które mają już odpowiedniki WebP w katalogu `ptasie/`
- [ ] Aktualizacja odwołań w kodzie
- [ ] Weryfikacja wizualna

#### Zadanie 1.4: Optymalizacja logotypu partnera
**Oszczędność: ~3 MB**

- [ ] Ponowny eksport `Collaborations/logo1.png` w rozdzielczości ~400 px
- [ ] Konwersja do formatu WebP lub odpowiednia kompresja PNG
- [ ] Docelowy rozmiar: poniżej 100 KB

#### Zadanie 1.5: Usunięcie duplikatów
**Oszczędność: ~7 MB**

- [ ] Usunięcie `icons/mural-samochod2.jpg` (duplikat `Portfolio/mural-samochod2.jpg`)
- [ ] Usunięcie `images/z2.jpg` (duplikat `images/birds-panorama.jpg`)
- [ ] Usunięcie `images/hero2.jpg` (duplikat `images/Fotografia3.jpg`)
- [ ] Usunięcie `icons/mur_ipuszka.png` (duplikat `icons/graffiti-64.png`)
- [ ] Przeszukanie kodu pod kątem odwołań do usuwanych plików i aktualizacja ścieżek

---

### Faza 2: Poprawki w kodzie źródłowym (8 SP)

#### Zadanie 2.1: Zamiana surowych znaczników `<img>` na komponent `<Image>`

- [ ] **`BentoGrid.tsx`** — najbardziej krytyczny: renderuje zdjęcia portfolio (do 12 MB) przez surowy `<img>`. Zamiana na `<Image>` z odpowiednimi właściwościami `sizes`, `quality`, `placeholder="blur"`.
- [ ] **`Services.tsx`** — ~15 zdjęć w kartach usług (288 KB – 951 KB bez optymalizacji). Zamiana danych w tablicy JSX na obiekty z komponentem `<Image>`.
- [ ] **`apple-cards-carousel.tsx`** — komponent `BlurImage` celowo używa `<img>`. Zamiana na `<Image>` z zachowaniem efektu rozmycia.
- [ ] **`AppleCards.tsx`** — ten sam wzorzec co wyżej.
- [ ] **`YoutubeVideosGrid.tsx`** — wymaga wcześniejszego dodania `remotePatterns` (zadanie 2.3).

#### Zadanie 2.2: Naprawa błędu w Process.tsx

- [ ] Zamiana nieprawidłowej właściwości `object-fit="cover"` na `className="object-cover"` (linia 41)
- [ ] Weryfikacja poprawnego wyświetlania ikon po zmianie

#### Zadanie 2.3: Konfiguracja `remotePatterns` w next.config.js

- [ ] Dodanie wzorca dla domeny `img.youtube.com` (miniatury filmów YouTube)
- [ ] Po dodaniu — zamiana surowego `<img>` na `<Image>` w `YoutubeVideosGrid.tsx`

```javascript
remotePatterns: [
  { protocol: 'https', hostname: 'img.youtube.com' },
],
```

#### Zadanie 2.4: Korekta właściwości `sizes` na komponentach ikon

- [ ] Przeszukanie komponentów `SoundOn.tsx`, `SoundOff.tsx`, `Expand.tsx` i podobnych
- [ ] Zamiana `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"` na wartość odpowiadającą faktycznemu rozmiarowi wyświetlania (np. `sizes="64px"`)

#### Zadanie 2.5: Refaktoryzacja pliku photos.tsx

- [ ] Utworzenie jednej tablicy źródłowej ze wszystkimi zdjęciami i polem kategorii
- [ ] Zamiana tablic `allPhotos`, `portfolioPhotos`, `PtasieMurale` na funkcje filtrujące
- [ ] Aktualizacja importów we wszystkich komponentach korzystających z tych danych

---

### Faza 3: Optymalizacja wideo i finalizacja (5 SP)

#### Zadanie 3.1: Konsolidacja plików wideo
**Oszczędność: ~18 MB**

- [ ] Usunięcie `hero_output.mp4` (7,4 MB) — zachowanie wyłącznie wersji skompresowanej
- [ ] Ponowne zakodowanie `hero_compressed.webm` (11 MB) kodekiem VP9 z niższym bitrate (docelowo ~4 MB)
- [ ] Ponowne zakodowanie `hero_compressed.mp4` z parametrem CRF 28–32 (docelowo ~4 MB)
- [ ] Zachowanie tylko 2 wariantów hero: mały (mobilny) i duży (desktopowy)
- [ ] Aktualizacja komponentu `VideoHero` jeśli zmienią się nazwy plików

#### Zadanie 3.2: Wygenerowanie indywidualnych podglądów rozmycia (LQIP)

- [ ] Instalacja narzędzia `plaiceholder` lub napisanie skryptu z użyciem biblioteki `sharp`
- [ ] Wygenerowanie unikalnych podglądów base64 dla każdego zdjęcia w `photos.tsx`
- [ ] Zastąpienie generycznego szarego piksela właściwymi podglądami w komponentach `Images.tsx` i `OptimizedImage.tsx`

#### Zadanie 3.3: Usunięcie metadanych EXIF

- [ ] Przetworzenie wszystkich plików JPEG/WebP narzędziem `exiftool` lub `sharp` w celu usunięcia metadanych aparatu
- [ ] Eliminacja potencjalnego wycieku danych lokalizacyjnych

#### Zadanie 3.4: Skrypt audytu obrazów

- [ ] Napisanie skryptu `scripts/audit-images.sh` sprawdzającego rozmiary plików graficznych
- [ ] Ostrzeganie w przypadku plików przekraczających 300 KB
- [ ] Opcjonalnie: integracja z procesem CI/CD jako krok walidacyjny

---

## Kryteria akceptacji

### Wymagane (Must Have)
- [ ] Wszystkie zdjęcia portfolio skonwertowane do WebP (maks. 2400 px szerokości)
- [ ] Dekoracyjne pliki PNG skonwertowane do WebP z kanałem alfa
- [ ] Wszystkie surowe znaczniki `<img>` zastąpione komponentem `<Image>` z Next.js
- [ ] Duplikaty plików usunięte
- [ ] Łączny rozmiar zasobów graficznych poniżej 120 MB
- [ ] Żaden pojedynczy plik graficzny nie przekracza 300 KB po przetworzeniu przez Next.js
- [ ] Weryfikacja wizualna — brak widocznej degradacji jakości

### Pożądane (Should Have)
- [ ] Indywidualne podglądy rozmycia (LQIP) dla zdjęć portfolio
- [ ] Skorygowane właściwości `sizes` na komponentach ikon
- [ ] Konfiguracja `remotePatterns` dla miniatur YouTube
- [ ] Skrypt audytu sprawdzający rozmiary nowych plików

### Dodatkowe (Nice to Have)
- [ ] Automatyczny pipeline optymalizacji dla nowo dodawanych zdjęć
- [ ] Monitoring metryk ładowania obrazów
- [ ] Format AVIF jako źródłowy dla najważniejszych zdjęć

---

## Metryki docelowe

| Metryka | Stan obecny | Cel |
|---------|:-----------:|:---:|
| Łączny rozmiar zasobów | 346 MB | < 120 MB |
| Największy plik graficzny | 12 MB | < 500 KB |
| Lighthouse Performance (mobile) | ~65 | 85+ |
| LCP strony portfolio | ~4,2 s | < 2,5 s |
| Czas ładowania obrazu (średni) | ~2,8 s | < 1,0 s |

---

## Szacowane oszczędności według faz

| Faza | Oszczędność | Story Points |
|------|:-----------:|:------------:|
| Faza 1: Konwersja plików | ~179 MB | 8 SP |
| Faza 2: Poprawki w kodzie | poprawa wydajności runtime | 8 SP |
| Faza 3: Wideo i finalizacja | ~18 MB + jakość UX | 5 SP |
| **Razem** | **~239 MB (69%)** | **21 SP** |

---

## Ocena ryzyka

### Ryzyko: Utrata jakości wizualnej po konwersji
**Prawdopodobieństwo:** Niskie | **Wpływ:** Wysoki
**Mitygacja:** Weryfikacja wizualna każdego skonwertowanego zdjęcia. Jakość WebP 80 zapewnia nierozróżnialną jakość dla zdjęć fotograficznych.

### Ryzyko: Uszkodzenie odwołań w kodzie po zmianie ścieżek
**Prawdopodobieństwo:** Średnie | **Wpływ:** Średni
**Mitygacja:** Przeszukanie całego kodu pod kątem starych ścieżek przed usunięciem plików. Testy manualne wszystkich stron po wdrożeniu.

### Ryzyko: Kompatybilność przeglądarek z formatem WebP
**Prawdopodobieństwo:** Niskie | **Wpływ:** Niski
**Mitygacja:** Next.js automatycznie serwuje formaty zastępcze (JPEG/PNG) dla przeglądarek bez wsparcia WebP. Wsparcie WebP przekracza 97% globalnego rynku przeglądarek.

---

## Zależności

- **Wymaga:** Brak — może być realizowana niezależnie
- **Blokuje:** Story "Bundle Size Optimization" (zależna od redukcji rozmiaru zasobów)
- **Powiązane:** Story "Three.js Performance Tuning" (panorama używa dużego zdjęcia)

---

## Harmonogram realizacji

| Faza | Czas realizacji | Zależności |
|------|:--------------:|-----------|
| Faza 1: Konwersja plików | 2–3 dni | Brak |
| Faza 2: Poprawki w kodzie | 2–3 dni | Faza 1 (zaktualizowane ścieżki) |
| Faza 3: Wideo i finalizacja | 1–2 dni | Brak |
| **Razem** | **5–8 dni** | |

---

## Checklist testowy

### Testy wydajności
- [ ] Audyt Lighthouse (mobile i desktop) — przed i po
- [ ] Analiza WebPageTest.org
- [ ] Testy na prawdziwych urządzeniach (iPhone, Android)
- [ ] Testy z ograniczeniem przepustowości (3G, wolne 4G)

### Testy funkcjonalne
- [ ] Wszystkie obrazy wyświetlają się poprawnie na każdej stronie
- [ ] Leniwe ładowanie działa w każdej przeglądarce
- [ ] Podglądy rozmycia pojawiają się i znikają prawidłowo
- [ ] Lightbox galerii działa z nowymi formatami
- [ ] Panorama THREE.js ładuje się i scrolluje poprawnie

### Kompatybilność przeglądarek
- [ ] Chrome 90+ (wsparcie WebP/AVIF)
- [ ] Firefox 88+ (wsparcie WebP/AVIF)
- [ ] Safari 14+ (wsparcie WebP)
- [ ] Edge 90+ (wsparcie WebP/AVIF)
