/* Baza pytan i odpowiedzi chatbota. Edytuj smialo — keywords to slowa,
   po ktorych bot rozpoznaje pytanie (bez polskich znakow, male litery). */

export interface FaqEntry {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
}

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: "cena",
    question: "Ile kosztuje mural?",
    keywords: ["cena", "koszt", "kosztuje", "wycena", "cennik", "drogo", "zaplace", "budzet", "stawka"],
    answer:
      "Cena zależy od powierzchni, stopnia szczegółowości projektu i lokalizacji. Każdą wycenę przygotowuję indywidualnie i bezpłatnie — napisz przez formularz na stronie /kontakt albo na aeromat88@gmail.com, podaj przybliżone wymiary ściany i pomysł, a odezwę się w ciągu 24 godzin.",
  },
  {
    id: "obszar",
    question: "Gdzie działacie?",
    keywords: ["gdzie", "obszar", "miasto", "lublin", "warszawa", "polska", "dojazd", "okolice", "wojewodztwo", "dzialacie"],
    answer:
      "Stacjonuję w Lublinie, ale pracuję na terenie całej Polski — od kameralnych wnętrz po wielkoformatowe fasady. Dojazd ustalamy przy wycenie.",
  },
  {
    id: "czas",
    question: "Ile trwa realizacja?",
    keywords: ["czas", "trwa", "termin", "szybko", "realizacja", "dlugo", "kiedy"],
    answer:
      "To zależy od wielkości i szczegółowości pracy: mniejsze realizacje to zwykle kilka dni, duże murale wielkoformatowe — do kilku tygodni. Konkretny termin podaję przy wycenie.",
  },
  {
    id: "uslugi",
    question: "Co malujecie?",
    keywords: ["uslugi", "malujecie", "zakres", "oferta", "mural", "szyld", "auto", "samochod", "wnetrze", "elewacja", "fasada", "reklama", "logo"],
    answer:
      "Maluję murale wielkoformatowe, malowidła we wnętrzach, szyldy i logotypy, dekoracje elewacji oraz projekty specjalne — np. artystyczne malowanie aut. Zobacz pełne portfolio na stronie /portfolio.",
  },
  {
    id: "projekt",
    question: "Czy projekt jest indywidualny?",
    keywords: ["projekt", "indywidualny", "wzor", "pomysl", "wlasny", "zaprojektowac", "szkic"],
    answer:
      "Tak — każdy projekt powstaje indywidualnie pod Twoją przestrzeń i potrzeby. Możesz przyjść z gotowym pomysłem albo zostawić mi wolną rękę; przed malowaniem zawsze zobaczysz szkic do akceptacji.",
  },
  {
    id: "techniki",
    question: "Jakie techniki i farby?",
    keywords: ["technika", "farby", "spray", "aerograf", "pedzel", "trwale", "antysmogowe", "uv"],
    answer:
      "Pracuję pędzlem, wałkiem, sprayem i aerografem — dobór techniki zależy od projektu. Używam trwałych farb odpornych na warunki atmosferyczne i UV, w tym farb antysmogowych.",
  },
  {
    id: "kontakt",
    question: "Jak się skontaktować?",
    keywords: ["kontakt", "telefon", "mail", "email", "napisac", "zadzwonic", "numer", "skontaktowac"],
    answer:
      "Najprościej przez formularz na stronie /kontakt — odpowiadam w ciągu 24 godzin. Dane kontaktowe (e-mail i telefon) znajdziesz też w stopce strony.",
  },
  {
    id: "doswiadczenie",
    question: "Jakie macie doświadczenie?",
    keywords: ["doswiadczenie", "lat", "dawno", "portfolio", "realizacje", "referencje", "klienci"],
    answer:
      "Malarstwo to moja pasja i zawód od ponad 25 lat. Realizacje obejrzysz na stronie /portfolio i /filmy, a opinie klientów — na stronie głównej.",
  },
  {
    id: "mapa",
    question: "Gdzie zobaczę murale na żywo?",
    keywords: ["mapa", "zobaczyc", "zywo", "spacer", "aeromapa", "lokalizacja", "adres"],
    answer:
      "Na stronie głównej znajdziesz AeroMapę — interaktywną mapę z lokalizacjami moich murali. Każdy jest opisany, więc łatwo odnajdziesz je podczas spaceru.",
  },
];

/* Fakty o firmie dla warstwy AI — jedno zrodlo prawdy dla promptu systemowego. */
export const SITE_FACTS = `
AeroMat — Mateusz, artysta malarz z Lublina, ponad 25 lat doświadczenia.
Usługi: murale wielkoformatowe, malowidła ścienne we wnętrzach, szyldy i logotypy,
dekoracje elewacji, artystyczne malowanie aut, projekty specjalne.
Obszar działania: cała Polska, baza w Lublinie.
Techniki: pędzel, wałek, spray, aerograf; farby trwałe, odporne na UV, także antysmogowe.
Proces: bezpłatna indywidualna wycena -> szkic projektu do akceptacji -> realizacja.
Czas realizacji: od kilku dni (mniejsze prace) do kilku tygodni (duże murale).
Kontakt: formularz na /kontakt (odpowiedź do 24 h); portfolio: /portfolio; filmy: /filmy.
Na stronie głównej jest AeroMapa — interaktywna mapa murali w mieście.
`.trim();
