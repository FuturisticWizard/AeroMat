import { describe, it, expect, vi, beforeEach } from "vitest";

// Podstawiamy (mockujemy) zewnetrzne zaleznosci akcji send(), zeby test byl
// szybki, deterministyczny i NIE wysylal prawdziwego maila:
//  - resend            → udajemy klienta wysylki, lapiemy argumenty
//  - next/headers      → udajemy naglowki zadania (adres IP goscia)
//  - email-template    → pomijamy renderowanie Reacta
const sendMock = vi.fn();
const headersGet = vi.fn<(name: string) => string | null>();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

vi.mock("next/headers", () => ({
  headers: async () => ({ get: headersGet }),
}));

vi.mock("../../app/components/email-template", () => ({
  EmailTemplate: vi.fn(async () => null),
}));

const validForm = {
  firstName: "Konrad",
  email: "klient@example.com",
  title: "Zapytanie o mural",
  message: "Prosze o wycene muralu 5x8 m.",
  company: "",
};

// Swiezy modul (a wiec swiezy licznik limitu) na kazdy test.
const importSend = async () => (await import("../../app/lib/email")).send;

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
  process.env.RESEND_API_KEY = "test-key";
  process.env.RESEND_FROM_EMAIL = "from@aeromat.test";
  process.env.CONTACT_EMAIL = "owner@aeromat.test";
  headersGet.mockReturnValue("1.2.3.4");
  sendMock.mockResolvedValue({ error: null });
});

describe("send() — pulapka na boty (honeypot)", () => {
  it("nie wysyla maila, gdy ukryte pole jest wypelnione", async () => {
    const send = await importSend();
    await send({ ...validForm, company: "Bot Inc." });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("udaje sukces (nie rzuca bledu), gdy wykryto bota", async () => {
    const send = await importSend();
    await expect(send({ ...validForm, company: "Bot Inc." })).resolves.toBeUndefined();
  });
});

describe("send() — walidacja po stronie serwera", () => {
  it("odrzuca niepoprawne dane (pomimo obejscia walidacji w przegladarce)", async () => {
    const send = await importSend();
    await expect(send({ ...validForm, email: "bez-malpy" })).rejects.toThrow(
      "Nieprawidłowe dane formularza."
    );
  });

  it("nie wysyla maila przy niepoprawnych danych", async () => {
    const send = await importSend();
    await send({ ...validForm, email: "bez-malpy" }).catch(() => {});
    expect(sendMock).not.toHaveBeenCalled();
  });
});

describe("send() — poprawna wysylka", () => {
  it("wysyla maila do wlasciciela strony, nie do nadawcy (ochrona przed open relay)", async () => {
    const send = await importSend();
    await send(validForm);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock.mock.calls[0][0].to).toEqual(["owner@aeromat.test"]);
  });

  it("ustawia replyTo na adres nadawcy", async () => {
    const send = await importSend();
    await send(validForm);
    expect(sendMock.mock.calls[0][0].replyTo).toBe("klient@example.com");
  });

  it("usuwa znaki nowej linii z tematu (ochrona przed wstrzyknieciem naglowkow)", async () => {
    const send = await importSend();
    await send({ ...validForm, title: "Temat\r\nBcc: ofiara@example.com" });
    expect(sendMock.mock.calls[0][0].subject).not.toMatch(/[\r\n]/);
  });
});

describe("send() — limit zgloszen (rate limiting)", () => {
  it("przepuszcza pierwsze 3 zgloszenia z tego samego adresu IP", async () => {
    const send = await importSend();
    await send(validForm);
    await send(validForm);
    await expect(send(validForm)).resolves.toBeUndefined();
  });

  it("blokuje 4. zgloszenie z tego samego adresu IP w ciagu godziny", async () => {
    const send = await importSend();
    await send(validForm);
    await send(validForm);
    await send(validForm);
    await expect(send(validForm)).rejects.toThrow("Zbyt wiele wiadomości.");
  });
});

describe("send() — brak konfiguracji", () => {
  it("rzuca czytelny blad, gdy nie ustawiono adresu odbiorcy", async () => {
    delete process.env.CONTACT_EMAIL;
    delete process.env.RESEND_FROM_EMAIL;
    const send = await importSend();
    await expect(send(validForm)).rejects.toThrow("Konfiguracja email nie jest ustawiona.");
  });
});
