import { describe, it, expect } from "vitest";
import { matchFaq, normalize } from "../../app/lib/faqMatch";
import type { FaqEntry } from "../../app/lib/faq";

const FAQ: FaqEntry[] = [
  {
    id: "cena",
    question: "Ile kosztuje mural?",
    keywords: ["cena", "koszt", "kosztuje", "wycena", "cennik", "drogo", "zaplacic"],
    answer: "Cena zalezy od powierzchni i projektu.",
  },
  {
    id: "obszar",
    question: "Gdzie dzialacie?",
    keywords: ["gdzie", "obszar", "miasto", "lublin", "polska", "dojazd", "dzialacie"],
    answer: "Stacjonuje w Lublinie, dzialam w calej Polsce.",
  },
  {
    id: "czas",
    question: "Ile trwa realizacja?",
    keywords: ["czas", "trwa", "termin", "szybko", "realizacja", "dlugo"],
    answer: "Zwykle od kilku dni do kilku tygodni.",
  },
];

describe("normalize", () => {
  it("zamienia wielkie litery na male", () => {
    expect(normalize("MURAL")).toBe("mural");
  });

  it("usuwa polskie znaki diakrytyczne", () => {
    expect(normalize("ściana żółć ąę")).toBe("sciana zolc ae");
  });

  it("usuwa znaki interpunkcyjne", () => {
    expect(normalize("ile to kosztuje?!")).toBe("ile to kosztuje");
  });
});

describe("matchFaq", () => {
  it("znajduje wpis po slowie kluczowym", () => {
    const result = matchFaq("ile kosztuje mural na scianie", FAQ);
    expect(result.entry?.id).toBe("cena");
  });

  it("ignoruje wielkosc liter i polskie znaki w pytaniu", () => {
    const result = matchFaq("JAKA JEST CENA MURALU?", FAQ);
    expect(result.entry?.id).toBe("cena");
  });

  it("wybiera wpis z wieksza liczba trafien gdy pasuje kilka", () => {
    const result = matchFaq("jaki obszar, gdzie dzialacie, czy Lublin", FAQ);
    expect(result.entry?.id).toBe("obszar");
  });

  it("zwraca brak wpisu dla pytania bez zadnego slowa kluczowego", () => {
    const result = matchFaq("czy malujecie obrazy olejne na plotnie", FAQ);
    expect(result.entry).toBeNull();
  });

  it("oznacza dopasowanie jednym slowem jako niepewne", () => {
    const result = matchFaq("jak szybko odpisujecie na maile", FAQ);
    expect(result.confident).toBe(false);
  });

  it("oznacza dopasowanie wieloma slowami jako pewne", () => {
    const result = matchFaq("jaki koszt i cena, prosze o cennik", FAQ);
    expect(result.confident).toBe(true);
  });

  it("zwraca brak wpisu dla pustego pytania", () => {
    const result = matchFaq("   ", FAQ);
    expect(result.entry).toBeNull();
  });

  it("dopasowuje slowo kluczowe po odmianie przez prefiks", () => {
    const result = matchFaq("prosze o wycene muralu", FAQ);
    expect(result.entry?.id).toBe("cena");
  });
});
