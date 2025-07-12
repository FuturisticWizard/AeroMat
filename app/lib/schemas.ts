import { z } from "zod";

export const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  email: z.string().email().min(2).max(250),
  title: z.string().min(2).max(250),
  message: z.string().min(2),
});
