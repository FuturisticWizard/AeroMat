# Raport optymalizacji zasobów graficznych — AeroMat

**Data:** 2026-03-08
**Autor:** Zespół BMad (Performance Engineer + Architect)
**Projekt:** AeroMat — strona portfolio artysty murali

---

## 1. Podsumowanie

Projekt AeroMat zawiera **234 pliki multimedialne** o łącznej wadze **~346 MB**. Zdecydowana większość zasobów graficznych to nieprzetworzone zdjęcia z aparatu w oryginalnej rozdzielczości (do 5776×4336 pikseli), zapisane w formacie JPEG bez kompresji przeznaczonej na potrzeby wyświetlania w przeglądarce. Analiza wykazała możliwość redukcji rozmiaru o **~239 MB (69%)** bez zauważalnej utraty jakości wizualnej.

---

## 2. Inwentaryzacja zasobów

### 2.1. Zestawienie ogólne

| Kategoria | Liczba plików | Łączny rozmiar |
|-----------|:------------:|:--------------:|
| Zdjęcia JPEG | 115 | 215 MB |
| Grafiki PNG | 84 | 53 MB |
| Zdjęcia WebP | 24 | 28 MB |
| Pliki GIF | 1 | 28 KB |
| Pliki SVG | 7 | ~5 KB |
| Wideo MP4 | 5 | ~33 MB |
| Wideo WebM | 3 | ~18 MB |
| **Razem** | **234** | **~346 MB** |

### 2.2. Podział według katalogów

| Katalog | Rozmiar | Opis zawartości |
|---------|:-------:|-----------------|
| `/public/images/` | 149 MB | Główna galeria — przeważnie niezoptymalizowane pliki JPEG |
| `/public/Portfolio/` | 92 MB | Zdjęcia portfolio — największe pliki w projekcie |
| `/public/movies/` | 50 MB | Filmy do sekcji hero w różnych formatach |
| `/public/pngs/` | 48 MB | Dekoracyjne plamy farby w formacie PNG z kanałem alfa |
| `/public/images/ptasie/` | 27 MB | Wersje WebP zdjęć z katalogu głównego |
| `/public/Collaborations/` | 3,8 MB | Logotypy partnerów i współpracowników |
| `/public/icons/` | 3,2 MB | Ikony interfejsu (zawiera również błędnie umieszczone zdjęcie 2,8 MB) |

---

## 3. Zidentyfikowane problemy

### 3.1. Pliki portfolio w oryginalnej rozdzielczości aparatu

Katalog `/public/Portfolio/` zawiera 17 plików JPEG o łącznej wadze **92 MB**. Są to nieprzetworzone eksporty z aparatu fotograficznego w rozdzielczości do 5776×4336 pikseli. Żadna przeglądarka internetowa nie wymaga obrazów o tak dużej rozdzielczości — największy zdefiniowany rozmiar w konfiguracji Next.js (`deviceSizes`) to 1920 pikseli.

Najcięższe pliki:

| Plik | Rozmiar | Rozdzielczość |
|------|:-------:|:-------------:|
| `mural-pieski.jpg` | 12 MB | 5776×4336 |
| `mural-spongebob.jpg` | 11 MB | 5776×4336 |
| `mural-mario.jpg` | 11 MB | 5776×4336 |
| `mural-magic-boxes.jpg` | 9,8 MB | 5776×4336 |
| `mural-rybka.jpg` | 8,2 MB | 5776×4336 |
| `mural-komeko.jpg` | 7,1 MB | ~5776×4336 |
| `mural-stare-miasto-lublin.jpg` | 6,6 MB | ~5776×4336 |

**Szacowana oszczędność po konwersji do WebP z maksymalną szerokością 2400 pikseli: ~87 MB (95% redukcji).**

### 3.2. Dekoracyjne pliki PNG o nadmiernym rozmiarze

Katalog `/public/pngs/` zawiera 7 plików PNG z kanałem przezroczystości, które służą jako dekoracyjne elementy (plamy farby w sprayach). Sześć z nich ma identyczną rozdzielczość 7448×6567 pikseli i waży po ~7 MB każdy.

| Plik | Rozmiar | Rozdzielczość |
|------|:-------:|:-------------:|
| `black-spray.png` | 7,3 MB | 7448×6567 |
| `yellow-spray.png` | 6,9 MB | 7448×6567 |
| `red-spray.png` | 6,9 MB | 7448×6567 |
| `purple-spray.png` | 6,9 MB | 7448×6567 |
| `orange-spray.png` | 6,9 MB | 7448×6567 |
| `granat-spray.png` | 6,9 MB | 7448×6567 |
| `brush-strok-1.png` | 2,8 MB | 6008×2402 |

Są to elementy dekoracyjne, które na ekranie wyświetlają się w znacznie mniejszym rozmiarze niż ich oryginalna rozdzielczość. Konwersja do formatu WebP z zachowaniem kanału alfa i zmniejszeniem do 2000 pikseli szerokości pozwoli zachować jakość przy drastycznej redukcji rozmiaru.

**Szacowana oszczędność: ~42 MB (93% redukcji).**

### 3.3. Zduplikowane pliki

Analiza sumy kontrolnej MD5 wykazała 4 pary identycznych plików:

| Oryginał | Duplikat | Marnowany rozmiar |
|----------|----------|:-----------------:|
| `Portfolio/mural-samochod2.jpg` | `icons/mural-samochod2.jpg` | 2,8 MB |
| `images/birds-panorama.jpg` | `images/z2.jpg` | 4,1 MB |
| `images/Fotografia3.jpg` | `images/hero2.jpg` | 164 KB |
| `icons/graffiti-64.png` | `icons/mur_ipuszka.png` | ~1 KB |

**Łączna strata na duplikatach: ~7,1 MB.**

### 3.4. Pliki JPEG z istniejącymi odpowiednikami WebP

Katalog `/public/images/ptasie/` zawiera wersje WebP 19 zdjęć, które jednocześnie istnieją jako pliki JPEG w katalogu `/public/images/`. Oba zestawy plików są obecne w projekcie, co oznacza podwójne przechowywanie tych samych treści. Po przejściu wyłącznie na format WebP, oryginalne pliki JPEG (łącznie ~38 MB) można usunąć.

Przykładowe porównanie oszczędności:

| Plik | Rozmiar JPEG | Rozmiar WebP | Oszczędność |
|------|:------------:|:------------:|:-----------:|
| `6.jpg` / `6.webp` | 5,1 MB | 3,6 MB | 29% |
| `CZAPLA1.jpg` / `CZAPLA1.webp` | 2,4 MB | 1,2 MB | 51% |
| `6d2.jpg` / `6d2.webp` | 2,1 MB | 951 KB | 55% |
| `finish1.jpg` / `finish1.webp` | 3,4 MB | 1,9 MB | 46% |

### 3.5. Nadmiernie duży logotyp partnera

Plik `Collaborations/logo1.png` waży 3,1 MB przy rozdzielczości 1551×1573 pikseli. Dla logotypu wyświetlanego w niewielkim rozmiarze na stronie jest to wartość kilkudziesięciokrotnie wyższa od optymalnej. Po ponownym eksporcie w rozdzielczości ~400 pikseli i konwersji do formatu WebP rozmiar powinien spaść poniżej 100 KB.

### 3.6. Błędnie umieszczone zdjęcie w katalogu ikon

Plik `icons/mural-samochod2.jpg` (2,8 MB, 5076×3368 pikseli) to pełnowymiarowe zdjęcie umieszczone w katalogu przeznaczonym na ikony interfejsu. Jest identyczny z plikiem `Portfolio/mural-samochod2.jpg` i powinien zostać usunięty.

---

## 4. Problemy w kodzie źródłowym

### 4.1. Użycie surowych znaczników `<img>` zamiast komponentu Next.js `<Image>`

Pięć komponentów używa surowych znaczników HTML `<img>`, które całkowicie omijają wbudowany system optymalizacji obrazów Next.js (automatyczna konwersja do WebP/AVIF, responsywne rozmiary, leniwe ładowanie):

| Komponent | Kontekst | Wpływ |
|-----------|----------|-------|
| `Services.tsx` | ~15 zdjęć w kartach usług | Obrazy 288 KB – 951 KB serwowane bez optymalizacji |
| `BentoGrid.tsx` | Siatka portfolio | Przeglądarka pobiera oryginalne pliki o wadze do 12 MB |
| `apple-cards-carousel.tsx` | Komponent `BlurImage` | Celowe użycie `<img>`, omija optymalizację |
| `AppleCards.tsx` | Karty z animacją | Jak wyżej |
| `YoutubeVideosGrid.tsx` | Miniatury YouTube | Zewnętrzne adresy URL — wymaga konfiguracji `remotePatterns` |

Komponent `BentoGrid.tsx` stanowi najpoważniejszy problem — renderuje dane z `photos.tsx` (zdjęcia o rozdzielczości do 5776 pikseli) przy użyciu surowego znacznika `<img>`, co powoduje pobieranie przez przeglądarkę oryginalnych, wielomegabajtowych plików.

### 4.2. Nieprawidłowa właściwość w komponencie Process.tsx

W pliku `Process.tsx` (linia 41) znajduje się błędna składnia:

```tsx
<Image src={step.icon} alt={step.title} fill object-fit="cover" />
```

Właściwość `object-fit` nie jest prawidłową właściwością komponentu `next/image`. Powinna być zastąpiona klasą Tailwind `className="object-cover"` lub stylem inline `style={{ objectFit: "cover" }}`. Obecna wersja jest po cichu ignorowana, co może powodować nieprawidłowe wyświetlanie ikon.

### 4.3. Zbyt szerokie wartości właściwości `sizes` dla ikon

Komponenty ikon (takie jak `SoundOn.tsx`, `SoundOff.tsx`, `Expand.tsx`) używają wartości `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"` dla elementów o faktycznym rozmiarze 64–100 pikseli. Taka deklaracja informuje Next.js, że obraz może mieć szerokość równą całemu oknu przeglądarki, co powoduje generowanie niepotrzebnie dużych wariantów graficznych. Dla małych ikon właściwość powinna mieć wartość `sizes="64px"` lub odpowiednio dobraną do faktycznego rozmiaru wyświetlania.

### 4.4. Generyczny symbol zastępczy rozmycia

Komponenty `Images.tsx` i `OptimizedImage.tsx` używają identycznego, zakodowanego na stałe symbolu zastępczego `blurDataURL` — jednopikselowego szarego obrazu w formacie base64. Nie daje to żadnego podglądu zawartości zdjęcia podczas ładowania. Zalecane jest wygenerowanie indywidualnych podglądów niskiej jakości (tzw. LQIP — Low Quality Image Placeholder) dla każdego zdjęcia za pomocą narzędzia takiego jak `plaiceholder`.

### 4.5. Brak konfiguracji `remotePatterns` dla zewnętrznych obrazów

Konfiguracja Next.js nie zawiera właściwości `remotePatterns` ani `domains`, co oznacza, że zewnętrzne obrazy (np. miniatury YouTube z domeny `img.youtube.com`) nie mogą być przetwarzane przez wbudowany optymalizator. Komponent `YoutubeVideosGrid.tsx` z tego powodu używa surowego znacznika `<img>`.

### 4.6. Duplikacja danych w pliku photos.tsx

Plik `/app/lib/photos.tsx` eksportuje trzy tablice: `allPhotos`, `portfolioPhotos` i `PtasieMurale`, które częściowo się pokrywają — te same źródła obrazów pojawiają się w wielu tablicach z nieco innymi metadanymi. Zalecane jest utworzenie jednego źródła prawdy z filtrowaniem po kategorii.

---

## 5. Konfiguracja Next.js — ocena

Plik `next.config.js` zawiera następującą konfigurację optymalizacji obrazów:

- **Formaty:** `["image/avif", "image/webp"]` — poprawnie, AVIF jest priorytetowy ze względu na lepszą kompresję.
- **Rozmiary urządzeń:** `[640, 750, 828, 1080, 1200, 1920]` — standardowy zestaw punktów granicznych.
- **Rozmiary obrazów:** `[16, 32, 48, 64, 96, 128, 256, 384]` — poprawny.
- **Czas przechowywania w pamięci podręcznej:** 2 592 000 sekund (30 dni) — odpowiedni dla zasobów statycznych.
- **Jakość:** `[75, 85]` — dwupoziomowa jakość, dobrze dobrana.

Nagłówki pamięci podręcznej dla plików w katalogu `/images/*` ustawione są na `Cache-Control: public, max-age=31536000, immutable` (1 rok), co jest prawidłowe dla zasobów statycznych, ale wymaga ostrożności przy aktualizacji plików pod tym samym adresem URL.

---

## 6. Problemy z plikami wideo

Katalog `/public/movies/` zawiera 8 plików wideo o łącznej wadze ~50 MB:

| Plik | Rozmiar | Uwagi |
|------|:-------:|-------|
| `reel_output.mp4` | 15 MB | Największy plik wideo |
| `hero_compressed.webm` | 11 MB | Wersja WebM większa niż odpowiednik MP4 — nietypowe |
| `hero_output.mp4` | 7,4 MB | Wersja przed kompresją |
| `hero_compressed.mp4` | 7,0 MB | Wersja skompresowana — oszczędność jedynie 5% |
| `hero_medium.webm` | 4,1 MB | Średnia jakość |
| `hero_mini.mp4` | 3,3 MB | Wersja mobilna |
| `hero_mini.webm` | 2,8 MB | Wersja mobilna WebM |
| `tiffosi_szyld.mp4` | 1,7 MB | W katalogu głównym `/public/` |

Zidentyfikowane problemy:
- Plik `hero_compressed.webm` (11 MB) jest **większy** niż odpowiednik MP4 (7 MB), co sugeruje nieefektywne kodowanie. Powinien zostać ponownie zakodowany kodekiem VP9 z niższym bitrate.
- Plik `hero_output.mp4` (7,4 MB) i `hero_compressed.mp4` (7 MB) mają niemal identyczny rozmiar — kompresja była nieskuteczna. Zalecane ponowne kodowanie z parametrem CRF 28–32.
- Projekt zawiera 6 wariantów filmu hero (~36 MB). Wystarczające byłyby 2 warianty: mały (mobilny) i duży (desktopowy).

---

## 7. Plan optymalizacji — priorytety

### Priorytet 1: Konwersja plików PNG z katalogu `/pngs/` do formatu WebP

**Szacowana oszczędność: ~42 MB**

Zmniejszenie rozdzielczości z 7448 pikseli do maksymalnie 2000 pikseli szerokości i konwersja do formatu WebP z zachowaniem kanału przezroczystości. Przykładowe polecenie:

```bash
for f in public/pngs/*-spray.png; do
  cwebp -q 80 -resize 2000 0 "$f" -o "${f%.png}.webp"
done
```

### Priorytet 2: Konwersja zdjęć portfolio do formatu WebP

**Szacowana oszczędność: ~87 MB**

Zmniejszenie rozdzielczości z 5776 pikseli do maksymalnie 2400 pikseli i konwersja do formatu WebP z jakością 80. Następnie aktualizacja ścieżek w pliku `photos.tsx` i wszystkich komponentach odwołujących się do tych plików.

### Priorytet 3: Usunięcie duplikatów

**Szacowana oszczędność: ~7 MB**

- Usunięcie `icons/mural-samochod2.jpg` (duplikat pliku z katalogu Portfolio).
- Usunięcie `images/z2.jpg` (duplikat pliku `images/birds-panorama.jpg`).
- Usunięcie `images/hero2.jpg` (duplikat pliku `images/Fotografia3.jpg`).
- Usunięcie `icons/mur_ipuszka.png` (duplikat pliku `icons/graffiti-64.png`).
- Aktualizacja wszelkich odwołań w kodzie.

### Priorytet 4: Konwersja galerii zdjęć do formatu WebP

**Szacowana oszczędność: ~40 MB**

Konwersja pozostałych ~50 plików JPEG z katalogu `/images/` do formatu WebP ze zmniejszeniem do 1920 pikseli szerokości. Po aktualizacji odwołań w kodzie — usunięcie oryginalnych plików JPEG, które mają już odpowiedniki WebP w katalogu `ptasie/`.

### Priorytet 5: Optymalizacja logotypu partnera

**Szacowana oszczędność: ~3 MB**

Ponowny eksport pliku `Collaborations/logo1.png` w rozdzielczości ~400 pikseli z odpowiednią kompresją lub konwersja do formatu WebP.

### Priorytet 6: Konsolidacja plików wideo

**Szacowana oszczędność: ~18 MB**

- Usunięcie pliku `hero_output.mp4` (zachowanie wyłącznie wersji skompresowanej).
- Ponowne zakodowanie `hero_compressed.webm` kodekiem VP9 z niższym bitrate.
- Zachowanie tylko 2 wariantów filmu hero: wersji mobilnej i desktopowej.

### Priorytet 7: Poprawki w kodzie źródłowym

Zmiany niewymagające modyfikacji plików graficznych:

1. Zamiana surowych znaczników `<img>` na komponent `<Image>` z Next.js w plikach: `BentoGrid.tsx`, `Services.tsx`, `apple-cards-carousel.tsx`, `AppleCards.tsx`.
2. Naprawa właściwości `object-fit="cover"` na `className="object-cover"` w pliku `Process.tsx`.
3. Korekta właściwości `sizes` w komponentach ikon (z `100vw` na wartość odpowiadającą faktycznemu rozmiarowi wyświetlania).
4. Dodanie konfiguracji `remotePatterns` dla domeny `img.youtube.com` w pliku `next.config.js`.
5. Wygenerowanie indywidualnych podglądów rozmycia (LQIP) dla zdjęć portfolio.
6. Refaktoryzacja pliku `photos.tsx` — jedno źródło danych z filtrowaniem po kategorii.

---

## 8. Szacowane oszczędności — podsumowanie

| Działanie | Przed | Po | Oszczędność |
|-----------|:-----:|:--:|:-----------:|
| Pliki PNG (spraypaint) → WebP | 45 MB | 3 MB | 42 MB |
| Portfolio → WebP | 92 MB | 5 MB | 87 MB |
| Usunięcie duplikatów | 7 MB | 0 MB | 7 MB |
| Galeria JPEG → WebP | 122 MB | 40 MB | 82 MB |
| Optymalizacja logotypu | 3 MB | 0,1 MB | 3 MB |
| Konsolidacja wideo | 50 MB | 32 MB | 18 MB |
| **Razem** | **~346 MB** | **~107 MB** | **~239 MB (69%)** |

---

## 9. Dodatkowe zalecenia

1. **Usunięcie metadanych EXIF** — większość plików JPEG zawiera pełne metadane aparatu fotograficznego (Panasonic GH5/GH6), w tym potencjalnie dane lokalizacyjne. Usunięcie tych danych oszczędza kilka kilobajtów na plik i eliminuje ryzyko wycieku informacji.

2. **Ustalenie budżetu wydajnościowego** — żaden pojedynczy obraz dostarczany do przeglądarki nie powinien przekraczać 300 KB. Zdjęcia portfolio o szerokości 2400 pikseli w formacie WebP z jakością 80 mieszczą się zazwyczaj w przedziale 150–300 KB.

3. **Wykorzystanie formatu AVIF** — konfiguracja Next.js już obsługuje format AVIF, który osiąga o 30–50% mniejsze rozmiary plików niż WebP przy porównywalnej jakości. Komponent `<Image>` automatycznie serwuje ten format przeglądarkom, które go wspierają.

4. **Automatyzacja procesu** — zalecane jest wdrożenie skryptu optymalizacyjnego uruchamianego przed wdrożeniem (np. jako krok w procesie CI/CD), który automatycznie sprawdza rozmiary nowo dodanych plików graficznych i ostrzega w przypadku przekroczenia ustalonego limitu.
