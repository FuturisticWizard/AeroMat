import { describe, it, expect } from "vitest";
import { formSchema } from "../../app/lib/schemas";

// Poprawny komplet danych — baza, ktora w poszczegolnych testach psujemy
// jednym polem, zeby sprawdzic walidacje izolujac jedna regule.
const valid = {
  firstName: "Konrad",
  email: "klient@example.com",
  title: "Zapytanie o mural",
  message: "Chcialbym wycene muralu na scianie 5x8 metrow.",
  company: "", // honeypot — czlowiek zostawia puste
};

describe("formSchema — poprawne dane", () => {
  it("przepuszcza kompletny, poprawny formularz", () => {
    expect(formSchema.safeParse(valid).success).toBe(true);
  });

  it("przepuszcza formularz bez pola honeypot (pole opcjonalne)", () => {
    const { company, ...withoutHoneypot } = valid;
    void company;
    expect(formSchema.safeParse(withoutHoneypot).success).toBe(true);
  });

  it("przepuszcza wiadomosc ze znakami specjalnymi i emoji", () => {
    const data = { ...valid, message: "Cześć! 🎨 Ściana 5×8 m — ile to <koszt>?" };
    expect(formSchema.safeParse(data).success).toBe(true);
  });
});

describe("formSchema — imie (firstName)", () => {
  it("odrzuca puste imie", () => {
    expect(formSchema.safeParse({ ...valid, firstName: "" }).success).toBe(false);
  });

  it("odrzuca imie krotsze niz 2 znaki", () => {
    expect(formSchema.safeParse({ ...valid, firstName: "K" }).success).toBe(false);
  });

  it("odrzuca imie dluzsze niz 50 znakow", () => {
    expect(formSchema.safeParse({ ...valid, firstName: "K".repeat(51) }).success).toBe(false);
  });
});

describe("formSchema — email", () => {
  it("odrzuca pusty email", () => {
    expect(formSchema.safeParse({ ...valid, email: "" }).success).toBe(false);
  });

  it("odrzuca email bez znaku @", () => {
    expect(formSchema.safeParse({ ...valid, email: "niepoprawny-email" }).success).toBe(false);
  });

  it("odrzuca email dluzszy niz 250 znakow", () => {
    const longEmail = `${"a".repeat(250)}@example.com`; // 262 znaki — powyzej limitu 250
    expect(formSchema.safeParse({ ...valid, email: longEmail }).success).toBe(false);
  });
});

describe("formSchema — temat (title)", () => {
  it("odrzuca pusty temat", () => {
    expect(formSchema.safeParse({ ...valid, title: "" }).success).toBe(false);
  });

  it("odrzuca temat dluzszy niz 250 znakow", () => {
    expect(formSchema.safeParse({ ...valid, title: "x".repeat(251) }).success).toBe(false);
  });
});

describe("formSchema — wiadomosc (message)", () => {
  it("odrzuca pusta wiadomosc", () => {
    expect(formSchema.safeParse({ ...valid, message: "" }).success).toBe(false);
  });

  it("odrzuca wiadomosc dluzsza niz 5000 znakow", () => {
    expect(formSchema.safeParse({ ...valid, message: "x".repeat(5001) }).success).toBe(false);
  });
});

describe("formSchema — honeypot (company)", () => {
  it("odrzuca formularz z wypelnionym ukrytym polem (sygnal bota)", () => {
    expect(formSchema.safeParse({ ...valid, company: "Spam Sp. z o.o." }).success).toBe(false);
  });
});
