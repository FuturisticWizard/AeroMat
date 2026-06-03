import { describe, it, expect, vi, beforeEach } from "vitest";

// Hoisted mocks so the (hoisted) vi.mock factories can reference them safely.
const { sendMock, templateMock, resendCtor } = vi.hoisted(() => {
  const sendMock = vi.fn();
  return {
    sendMock,
    templateMock: vi.fn(async () => "<email/>"),
    resendCtor: vi.fn(() => ({ emails: { send: sendMock } })),
  };
});

vi.mock("resend", () => ({ Resend: resendCtor }));
vi.mock("../components/email-template", () => ({ EmailTemplate: templateMock }));

const RATE_LIMIT = 3;
const RATE_WINDOW = 60 * 60 * 1000;

const valid = {
  firstName: "Jan",
  email: "jan@firma.pl",
  title: "Mural 8m2",
  message: "Chcialbym zamowic mural na klatce schodowej.",
};

let clock = 1_000_000;

// Each test gets a fresh module so the in-memory rate-limit map starts empty.
async function loadSend() {
  vi.resetModules();
  const mod = await import("./email");
  return mod.send;
}

beforeEach(() => {
  vi.clearAllMocks();
  sendMock.mockResolvedValue({ error: null });
  process.env.CONTACT_EMAIL = "owner@aeromat.pl";
  process.env.RESEND_FROM_EMAIL = "noreply@aeromat.pl";
  clock = 1_000_000;
  vi.spyOn(Date, "now").mockImplementation(() => clock);
});

describe("send — validation", () => {
  it("rejects an invalid payload without calling Resend", async () => {
    const send = await loadSend();
    await expect(send({ ...valid, email: "nope" })).rejects.toThrow(
      "Nieprawidłowe dane formularza."
    );
    expect(sendMock).not.toHaveBeenCalled();
  });
});

describe("send — happy path", () => {
  it("sends one email on a valid payload", async () => {
    const send = await loadSend();
    await expect(send(valid)).resolves.toBeUndefined();
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("delivers only to the owner and never to the sender (no open relay)", async () => {
    const send = await loadSend();
    await send(valid);
    const payload = sendMock.mock.calls[0][0];
    expect(payload.to).toEqual(["owner@aeromat.pl"]);
    expect(payload.to).not.toContain(valid.email);
    expect(payload.replyTo).toBe(valid.email);
    expect(payload.from).toContain("noreply@aeromat.pl");
    expect(payload.subject).toContain(valid.firstName);
  });

  it("falls back to RESEND_FROM_EMAIL when CONTACT_EMAIL is unset", async () => {
    delete process.env.CONTACT_EMAIL;
    const send = await loadSend();
    await send(valid);
    expect(sendMock.mock.calls[0][0].to).toEqual(["noreply@aeromat.pl"]);
  });
});

describe("send — configuration & delivery errors", () => {
  it("throws when no owner address is configured", async () => {
    delete process.env.CONTACT_EMAIL;
    delete process.env.RESEND_FROM_EMAIL;
    const send = await loadSend();
    await expect(send(valid)).rejects.toThrow("Konfiguracja email nie jest ustawiona.");
  });

  it("surfaces a user-facing error when Resend reports a failure", async () => {
    sendMock.mockResolvedValue({ error: { message: "boom" } });
    const send = await loadSend();
    await expect(send(valid)).rejects.toThrow(
      "Nie udało się wysłać wiadomości. Spróbuj ponownie."
    );
  });
});

describe("send — rate limiting", () => {
  it("allows up to the limit then blocks within the window", async () => {
    const send = await loadSend();
    for (let i = 0; i < RATE_LIMIT; i++) {
      await expect(send(valid)).resolves.toBeUndefined();
    }
    await expect(send(valid)).rejects.toThrow("Zbyt wiele wiadomości. Spróbuj ponownie później.");
    expect(sendMock).toHaveBeenCalledTimes(RATE_LIMIT);
  });

  it("resets the counter after the window elapses", async () => {
    const send = await loadSend();
    for (let i = 0; i < RATE_LIMIT; i++) await send(valid);
    await expect(send(valid)).rejects.toThrow("Zbyt wiele wiadomości");

    clock += RATE_WINDOW + 1;
    await expect(send(valid)).resolves.toBeUndefined();
    expect(sendMock).toHaveBeenCalledTimes(RATE_LIMIT + 1);
  });

  it("keeps separate buckets per sender email", async () => {
    const send = await loadSend();
    for (let i = 0; i < RATE_LIMIT; i++) await send(valid);
    await expect(send(valid)).rejects.toThrow("Zbyt wiele wiadomości");

    await expect(send({ ...valid, email: "ktos.inny@firma.pl" })).resolves.toBeUndefined();
  });

  it("treats the sender email case-insensitively", async () => {
    const send = await loadSend();
    for (let i = 0; i < RATE_LIMIT; i++) {
      await send({ ...valid, email: i % 2 === 0 ? "Jan@Firma.PL" : "jan@firma.pl" });
    }
    await expect(send({ ...valid, email: "JAN@FIRMA.PL" })).rejects.toThrow(
      "Zbyt wiele wiadomości"
    );
  });
});
