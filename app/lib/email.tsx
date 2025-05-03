"use server";

import { EmailTemplate } from "../components/email-template";
import { Resend } from "resend";

import { z } from "zod";
import { formSchema } from "./schemas";

const resend = new Resend(process.env.RESEND_API_KEY);

export const send = async (emailForm: z.infer<typeof formSchema>) => {
  try {
    //TODO Add this emailForm data to some database
    console.log(emailForm);
    const emailTemplate = await EmailTemplate({
      firstName: emailForm.firstName,
      message: emailForm.message,
    });
    const { error } = await resend.emails.send({
      from: `Acme <${process.env.RESEND_FROM_EMAIL}>`,
      to: [emailForm.email],
      subject: "Dziękujemy za wiadomość",
      react: emailTemplate,
    });

    if (error) {
      throw error;
    }
  } catch (e) {
    throw e;
  }
};
