import { z } from "zod";

export const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  email: z.string().email().min(2).max(250),
  title: z.string().min(2).max(250),
  message: z.string().min(2).max(5000),
  // Honeypot — ukryte pole. Człowiek go nie widzi i zostawia puste;
  // boty często wypełniają wszystkie pola. Niepuste = odrzucamy po cichu.
  company: z.string().max(0).optional(),
});
