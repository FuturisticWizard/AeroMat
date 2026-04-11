# Audyt Bezpieczenstwa -- AeroMat Portfolio Website

**Data:** 2026-04-06
**Audytor:** Claude Opus 4.6 (Security Auditor)
**Zakres:** Pelny przeglad bezpieczenstwa aplikacji
**Stack:** Next.js 16.0.10, React 19.2, Resend API, Google Maps API
**Metodologia:** OWASP Top 10 (2021), OWASP ASVS 4.0

---

## Podsumowanie

| Poziom | Liczba |
|--------|--------|
| KRYTYCZNY | 0 |
| WYSOKI | 3 |
| SREDNI | 5 |
| NISKI | 5 |
| INFORMACYJNY | 6 |

Aplikacja jest statycznym portfolio bez bazy danych ani systemu autentykacji, co znacznie ogranicza powierzchnie ataku. Glowne ryzyko koncentruje sie wokol formularza kontaktowego (Server Action), polityki CSP oraz ekspozycji klucza Google Maps API.

---

## WYSOKI

### W-1: CSP zawiera 'unsafe-inline' i 'unsafe-eval' w script-src

**Plik:** `next.config.js`, linia 132
**OWASP:** A03:2021 -- Injection
**CWE:** CWE-79 (Cross-site Scripting)

Dyrektywa `script-src` zawiera `'unsafe-inline'` i `'unsafe-eval'`, co praktycznie neutralizuje ochrone CSP przed atakami XSS. Atakujacy, ktory znajdzie punkt wstrzykniecia HTML, moze wykonac dowolny JavaScript.

```
script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://maps.googleapis.com ...
```

CSP staje sie jedynie deklaratywna, nie blokuje wstrzyknietych skryptow inline ani eval().

**Rekomendacja:**
1. Usunac `'unsafe-inline'` i zastosowac nonce-based CSP. Next.js 16 wspiera `nonce` natywnie.
2. Usunac `'unsafe-eval'` -- jezeli GSAP lub inna biblioteka wymaga eval, rozwazyc wezszy zakres.
3. Dodac dyrektywe `'strict-dynamic'` z nonce, co eliminuje potrzebe whitelistowania domen.

**Priorytet naprawy:** Wysoki. To jest najwazniejsza zmiana bezpieczenstwa do wdrozenia.

---

### W-2: Brak ochrony przed CSRF/botami na formularzu kontaktowym

**Plik:** `app/kontakt/page.tsx`, linia 62-66
**Plik:** `app/lib/email.tsx`
**OWASP:** A07:2021 -- Identification and Authentication Failures
**CWE:** CWE-352 (CSRF), CWE-799 (Improper Control of Interaction Frequency)

Formularz kontaktowy wywoluje Server Action `send()` bez zadnej ochrony CAPTCHA, honeypot ani tokenu CSRF. Rate limiting jest oparty wylacznie na adresie email podanym przez uzytkownika (linia 25 w email.tsx), co oznacza ze:

- Bot moze wyslac 3 emaile na godzine z kazdego unikalnego adresu email (nieskonczona liczba adresow).
- Nie ma limitu per IP.
- Rate limit resetuje sie przy restarcie serwera (in-memory Map, linia 12).

Ryzyko: Spam emailowy (abuse Resend API), wyczerpanie limitu Resend API (free tier: 100/dzien), potencjalny phishing przez manipulacje polem `replyTo`.

**Rekomendacja:**
1. Dodac rate limiting per IP (uzyc `headers()` z Next.js do pobrania IP).
2. Wdrozyc honeypot (ukryte pole, ktore boty wypelniaja) -- najtansza ochrona.
3. Rozwazyc Cloudflare Turnstile (darmowy) lub reCAPTCHA v3 jako bariere anty-bot.
4. Przeniesc rate limit do trwalego storage (Redis/KV) lub przynajmniej dodac komentarz o ograniczeniu in-memory.

---

### W-3: innerHTML uzywany z danymi z DOM bez sanityzacji

**Plik:** `app/page.tsx`, linia 124
**Plik:** `app/components/PanoramaScroll.tsx`, linia 120
**OWASP:** A03:2021 -- Injection
**CWE:** CWE-79 (Cross-site Scripting)

W trzech miejscach w codebase uzywany jest pattern:

```javascript
char.innerHTML = `<span>${char.textContent}</span>`;
```

Pliki: app/page.tsx:124, app/components/PanoramaScroll.tsx:120, docs/script.js:27

Chociaz dane pochodza z `textContent` (ktore zwraca czysty tekst, nie HTML), to wzorzec `innerHTML` z interpolacja jest niebezpiecznym anty-patternem. Jesli kiedykolwiek zrodlo danych zmieni sie na cos dynamicznego (np. z CMS), powstanie podatnosc XSS.

Aktualnie ryzyko niskie (dane statyczne), ale wzorzec jest niebezpieczny.

**Rekomendacja:**
Zamienic na bezpieczne API DOM:

```javascript
const span = document.createElement('span');
span.textContent = char.textContent;
char.replaceChildren(span);
```

---

## SREDNI

### S-1: Klucz Google Maps API eksponowany w kliencie bez restrykcji

**Plik:** `app/components/GoogleMap/GoogleMap.tsx`, linia 260
**OWASP:** A02:2021 -- Cryptographic Failures
**CWE:** CWE-200 (Exposure of Sensitive Information)

Klucz `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` jest dostepny w kodzie klienta (prefix `NEXT_PUBLIC_` = publiczny). To jest wymagane do dzialania Google Maps JS API, ale klucz musi byc odpowiednio zabezpieczony po stronie Google Cloud Console.

Bez restrykcji klucz moze byc uzyty przez osoby trzecie do generowania kosztow na koncie Google Cloud (quota theft).

**Rekomendacja:**
Zweryfikowac w Google Cloud Console, ze klucz ma:
1. Application restriction: HTTP referrers ograniczone do domeny produkcyjnej.
2. API restriction: Ograniczenie do Maps JavaScript API.
3. Quota limit: Ustawiony dzienny limit zapytan.

---

### S-2: Brak walidacji/sanityzacji danych w szablonie emaila

**Plik:** `app/components/email-template.tsx`, linie 8-18
**OWASP:** A03:2021 -- Injection
**CWE:** CWE-79 (XSS via Email)

Szablon emailowy renderuje `firstName` i `message` bezposrednio w JSX. React JSX automatycznie escapuje dane, wiec nie ma bezposredniego ryzyka XSS. Jednak email jest wyswietlany w kliencie pocztowym, a Resend konwertuje React na HTML.

Dodatkowo, pole `subject` w email.tsx (linia 53) zawiera dane uzytkownika:
```typescript
subject: `Nowa wiadomosc od ${parsed.data.firstName}: ${parsed.data.title}`,
```

**Rekomendacja:**
1. Dodac `trim()` i sanityzacje `firstName` i `title` przed uzyciem w subject.
2. Ograniczne dopuszczalne znaki w `firstName` w schemacie Zod:
   ```typescript
   firstName: z.string().min(2).max(50).regex(/^[a-zA-Z\u0105\u0107\u0119\u0142\u0144\u00f3\u015b\u017a\u017c\u0104\u0106\u0118\u0141\u0143\u00d3\u015a\u0179\u017b\s\-']+$/),
   ```

---

### S-3: Formularz kontaktowy nie informuje uzytkownika o wyniku wysylki

**Plik:** `app/kontakt/page.tsx`, linia 62-66
**CWE:** CWE-754 (Improper Check for Unusual or Exceptional Conditions)

Funkcja `onSubmit` wywoluje `send(values)` ale nie obsluguje Promise (brak `await`, brak `try/catch`, brak stanu ladowania):

```typescript
function onSubmit(values: z.infer<typeof formSchema>) {
  send(values); // Fire-and-forget, brak obslugi bledow
}
```

Uzytkownik nie wie czy wiadomosc zostala wyslana. Bledy serwera sa "polykane". Brak blokady przycisku podczas wysylania umozliwia wielokrotne submitowanie.

**Rekomendacja:**
Dodac `async/await`, stan ladowania, obsluge bledow i komunikat sukcesu.

---

### S-4: Brakujace naglowki bezpieczenstwa

**Plik:** `next.config.js`, linie 123-183
**OWASP:** A05:2021 -- Security Misconfiguration
**CWE:** CWE-693 (Protection Mechanism Failure)

Konfiguracja naglowkow jest solidna (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), ale brakuje:

1. `Cross-Origin-Opener-Policy: same-origin` -- chroni przed atakami Spectre/cross-origin.
2. `Cross-Origin-Resource-Policy: same-origin` -- chroni zasoby statyczne przed hotlinkingiem.
3. `X-Permitted-Cross-Domain-Policies: none` -- blokuje Flash/Acrobat cross-domain policy.

**Rekomendacja:**
Dodac brakujace naglowki do konfiguracji headers() w next.config.js.

---

### S-5: Atrybut lang="en" zamiast lang="pl" w root layout

**Plik:** `app/layout.tsx`, linia 67

Strona jest w jezyku polskim (metadata, teksty, formularze), ale atrybut `lang` wskazuje na angielski. Wplywa na czytniki ekranowe i indeksowanie przez wyszukiwarki.

**Rekomendacja:** Zmienic na `lang="pl"`.

---

## NISKI

### N-1: Brak .env.example w repozytorium

**OWASP:** A05:2021 -- Security Misconfiguration

Repozytorium nie zawiera pliku `.env.example` dokumentujacego wymagane zmienne srodowiskowe. Wykryte zmienne: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_EMAIL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `ANALYZE`.

**Rekomendacja:** Utworzyc `.env.example` z lista wymaganych zmiennych (bez wartosci).

---

### N-2: Nadmierna ilosc console.log w kodzie produkcyjnym

**Pliki:** `app/page.tsx` (~15 wywolan), `app/lib/animations.ts` (~6), `app/components/hero/VideoHero.tsx`, inne

Mimo ze `next.config.js` ma `removeConsole` w produkcji, wiele plikow `"use client"` zawiera `console.log()` ktore moga nie byc usuwane przez kompilator w bundlach klientowych.

**Rekomendacja:** Usunac debugowe console.log z komponentow klienta.

---

### N-3: Brak sandbox na iframe YouTube w desktop overlay

**Plik:** `app/components/YoutubeVideosGrid.tsx`, linia 133-140

Desktop overlay iframe nie ma atrybutu `sandbox`, podczas gdy mobilna wersja tego samego komponentu (linia 193) poprawnie uzywa sandbox.

**Rekomendacja:** Dodac `sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"` do desktop iframe.

---

### N-4: Brak sandbox na iframe w Google Maps overlay

**Plik:** `app/components/GoogleMap/GoogleMap.tsx`, linia 292-300

Iframe YouTube w komponencie mapy (po kliknieciu markera) nie ma atrybutu `sandbox`.

**Rekomendacja:** Dodac odpowiedni atrybut `sandbox`.

---

### N-5: Numer telefonu hardkodowany w wielu komponentach

**Pliki:** `app/components/CallButton.tsx`:8, `app/components/CallButtonPortal.tsx`:13, `app/components/hero/VideoHero.tsx`:152

Numer telefonu `+48780428883` jest hardkodowany w trzech miejscach. Nie jest to podatnosc, ale narusza zasade DRY.

**Rekomendacja:** Wyciagnac do stalej w pliku konfiguracyjnym (np. `app/lib/constants.ts`).

---

## INFORMACYJNY

### I-1: Poprawne praktyki bezpieczenstwa (pozytywy)

1. **Brak dangerouslySetInnerHTML** -- Zero uzycia w calym codebase.
2. **Brak API routes** -- Brak katalogu `app/api/`, eliminuje klase atakow broken access control.
3. **Server Action z walidacja Zod** -- email.tsx waliduje dane po stronie serwera (linia 18-21).
4. **Brak open relay** -- Email wysylany TYLKO do wlasciciela strony, adres uzytkownika w `replyTo`.
5. **poweredByHeader: false** -- Naglowek X-Powered-By jest wylaczony.
6. **HSTS z preload** -- Prawidlowa konfiguracja z max-age=63072000, includeSubDomains i preload.
7. **.gitignore chroni .env** -- Pliki `.env*` sa poprawnie wykluczone z repozytorium.
8. **YouTube nocookie** -- YoutubeVideosGrid uzywa youtube-nocookie.com.
9. **Social links z rel="noopener noreferrer"** -- Wszystkie linki zewnetrzne maja poprawne atrybuty.
10. **Statyczne dane** -- Wszystkie dane sa hardkodowane, eliminuje injection z API.

### I-2: images.unoptimized: true

**Plik:** `next.config.js`, linia 25

Optymalizacja obrazow wylaczona. Z punktu widzenia bezpieczenstwa akceptowalne (eliminuje wektor DoS przez /_next/image).

### I-3: Brak robots.txt i sitemap.xml

Brak plikow robots.txt i sitemap.xml. Warto dodac robots.txt zeby kontrolowac crawlery.

### I-4: PerformanceMonitor odwoluje sie do window.gtag

**Plik:** `app/components/PerformanceMonitor.tsx`, linie 107-118

Kod odwoluje sie do `window.gtag` (Google Analytics), ale nie widac skryptu GA w kodzie. Zweryfikowac konfiguracje GA (anonimizacja IP, brak PII).

### I-5: Brak Subresource Integrity (SRI)

Zewnetrzne skrypty (Google Maps API) ladowane bez SRI hash. Dla Google Maps akceptowalne.

### I-6: Komentarze z placeholderowymi danymi w kodzie

**Plik:** `app/components/Footer.tsx`, linie 41-49

Zakomentowany blok zawiera przykladowe dane kontaktowe. Warto usunac z kodu produkcyjnego.

---

## Plan naprawczy (priorytetyzowany)

### Faza 1 -- Natychmiastowe (1-2 dni)
- [ ] W-2: Dodac honeypot do formularza kontaktowego
- [ ] W-3: Zamienic innerHTML na bezpieczne API DOM we wszystkich 3 plikach
- [ ] S-3: Dodac obsluge bledow i stan ladowania do formularza kontaktowego
- [ ] S-5: Zmienic lang="en" na lang="pl" w layout.tsx

### Faza 2 -- Krotkoterminowe (1 tydzien)
- [ ] W-1: Wdrozyc nonce-based CSP (wymaga testow z GSAP, Google Maps, YouTube)
- [ ] W-2: Dodac rate limiting per IP do Server Action
- [ ] S-2: Dodac regex walidacje firstName w schemacie Zod
- [ ] S-4: Dodac brakujace security headers (COOP, CORP, X-Permitted-Cross-Domain)

### Faza 3 -- Srednioterminowe (2-4 tygodnie)
- [ ] S-1: Zweryfikowac restrykcje Google Maps API key w Cloud Console
- [ ] N-1: Utworzyc .env.example
- [ ] N-2: Usunac debugowe console.log z komponentow klienta
- [ ] N-3, N-4: Dodac sandbox do brakujacych iframe

---

## Podsumowanie koncowe

Aplikacja AeroMat wykazuje solidne podstawy bezpieczenstwa. Brak bazy danych, brak systemu autentykacji i statyczne dane znacznie ograniczaja powierzchnie ataku. Glowne obszary do poprawy to:

1. **CSP** -- Obecna polityka jest zbyt liberalna i wymaga wdrozenia nonce-based approach.
2. **Formularz kontaktowy** -- Wymaga ochrony anty-bot i lepszej obslugi bledow.
3. **innerHTML** -- Anty-pattern ktory nalezy wyeliminowac profilaktycznie.

Zadna z wykrytych podatnosci nie umozliwia bezposredniego przejecia serwera ani wycieku danych uzytkownikow. Ryzyka dotycza glownie naduzywania zasobow (spam emailowy, quota theft Google Maps) oraz teoretycznych wektorow XSS.
