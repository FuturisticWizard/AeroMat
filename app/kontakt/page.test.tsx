import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock("../lib/email", () => ({ send: sendMock }));

// next/image renders a real <img> via a server component; stub it to a plain img,
// dropping Next-only props that aren't valid DOM attributes.
vi.mock("next/image", () => ({
  default: ({ fill, priority, sizes, ...rest }: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...(rest as any)} />;
  },
}));

import ContactPage from "./page";

const valid = {
  firstName: "Jan",
  email: "jan@firma.pl",
  title: "Mural na klatce",
  message: "Chcialbym zamowic mural na klatce schodowej.",
};

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Imię"), valid.firstName);
  await user.type(screen.getByLabelText("E-mail"), valid.email);
  await user.type(screen.getByLabelText("Temat"), valid.title);
  await user.type(screen.getByLabelText("Wiadomość"), valid.message);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ContactPage", () => {
  it("submits valid data and shows the success panel", async () => {
    sendMock.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<ContactPage />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /Wyślij/i }));

    await waitFor(() => expect(screen.getByText("Wiadomość wysłana.")).toBeInTheDocument());
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith(valid);
    // Personalised thank-you uses the entered first name.
    expect(screen.getByText(/Jan/)).toBeInTheDocument();
  });

  it("shows the server error message when send rejects", async () => {
    sendMock.mockRejectedValueOnce(new Error("Zbyt wiele wiadomości."));
    const user = userEvent.setup();
    render(<ContactPage />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /Wyślij/i }));

    const alert = await screen.findByText("Zbyt wiele wiadomości.");
    expect(alert).toBeInTheDocument();
    // Stays on the form (no success panel).
    expect(screen.queryByText("Wiadomość wysłana.")).not.toBeInTheDocument();
  });

  it("does not call send when fields are invalid", async () => {
    const user = userEvent.setup();
    render(<ContactPage />);

    // Submit empty form.
    await user.click(screen.getByRole("button", { name: /Wyślij/i }));

    await waitFor(() => expect(screen.getAllByRole("alert").length).toBeGreaterThan(0));
    expect(sendMock).not.toHaveBeenCalled();
  });
});
