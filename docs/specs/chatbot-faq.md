# Spec: Chatbot FAQ (hybryda)

Data: 2026-06-12

## Co to robi

Pływający przycisk czatu (prawy dolny róg, wszystkie podstrony). Po kliknięciu
otwiera się okienko, w którym gość zadaje pytanie:

1. **Warstwa darmowa ("Recepcjonista")** — pytanie dopasowywane lokalnie
   (w przeglądarce) do bazy FAQ po słowach kluczowych. Trafienie = natychmiastowa
   odpowiedź, 0 zł.
2. **Warstwa AI ("Asystent")** — gdy dopasowanie jest słabe, gość może kliknąć
   "Zapytaj asystenta AI". Pytanie idzie na serwer, który odpyta model
   Claude Haiku 4.5 (`claude-haiku-4-5`, ~1–2 gr za odpowiedź) z wgraną wiedzą
   o usługach AeroMat.

```
Gość → okienko czatu → dopasowanie lokalne (0 zł)
                          │ brak trafienia
                          ▼
                   przycisk "Zapytaj asystenta AI"
                          │
                          ▼
            akcja serwerowa askAssistant() → Claude Haiku → odpowiedź
            (limit po IP + dzienny bezpiecznik kosztowy)
```

## Kryteria akceptacji

- [x] Przycisk czatu widoczny na każdej podstronie; kod panelu ładuje się
      dopiero po pierwszym kliknięciu (zero wpływu na start strony).
- [x] Pytania z bazy FAQ (np. "ile kosztuje mural") dostają odpowiedź lokalnie,
      bez żadnego zapytania sieciowego.
- [x] Przy słabym dopasowaniu pojawia się opcja zapytania AI.
- [x] Zabezpieczenia AI: limit 10 pytań/h na adres IP, limit długości pytania
      (300 znaków), globalny bezpiecznik 200 odpowiedzi AI dziennie — po
      przekroczeniu bot grzecznie odsyła do formularza kontaktowego.
- [x] Brak klucza `CHAT_API_KEY` na serwerze nie psuje strony — warstwa AI
      zwraca komunikat zastępczy z odesłaniem do /kontakt.
- [x] Logika dopasowania pokryta testami jednostkowymi (vitest, 11 testów).

Test ręczny w przeglądarce (2026-06-12, Playwright + Edge): 12/12 sprawdzeń OK —
otwarcie/zamknięcie panelu, odpowiedź FAQ bez zapytań sieciowych, oferta AI przy
słabym dopasowaniu, komunikat zastępczy bez klucza, chipy szybkich pytań, Escape,
brak błędów w konsoli, widok mobilny na /kontakt.

## Pliki

- `app/lib/faq.ts` — baza pytań i odpowiedzi (edytowalna ręcznie)
- `app/lib/faqMatch.ts` — dopasowanie słów kluczowych (logika biznesowa, TDD)
- `app/lib/chat.ts` — akcja serwerowa askAssistant() (wzorzec jak email.tsx)
- `app/components/Chat/ChatWidget.tsx` — przycisk + leniwy panel
- `app/components/Chat/ChatPanel.tsx` — okno rozmowy
- `tests/unit/faqMatch.test.ts` — testy dopasowania

## Konfiguracja dostawcy AI (.env)

Zaplecze uzywa standardowego formatu OpenAI chat/completions — dziala z kazdym
z trzech glownych dostawcow. Ustaw w `.env`:

```
CHAT_API_KEY=...        # klucz API (bez niego warstwa AI jest wylaczona = 0 zl)
CHAT_MODEL=gpt-4o-mini  # domyslny
CHAT_API_URL=...        # domyslnie OpenAI
```

| Dostawca | CHAT_API_URL | przykladowy CHAT_MODEL |
|---|---|---|
| OpenAI (domyslny) | `https://api.openai.com/v1/chat/completions` | `gpt-4o-mini` |
| Google Gemini | `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions` | `gemini-2.5-flash-lite` |
| Anthropic Claude | `https://api.anthropic.com/v1/chat/completions` | `claude-haiku-4-5` |

## Koszty

- Warstwa lokalna: 0 zł.
- Warstwa AI: typowa odpowiedź ≈ 1500 tokenów wejścia + 250 wyjścia.
  gpt-4o-mini / gemini flash-lite: ~0,1–0,2 gr za odpowiedź; claude-haiku-4-5: ~1 gr.
  Bezpiecznik dzienny 200 odpowiedzi ogranicza najgorszy scenariusz do groszy/zlotowek dziennie.
