import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  message,
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    Dziękuję za Twoją wiadomość! Zwykle odpowiadamy w przeciągu 24h!
    --------------------
    <p>{message}</p>
  </div>
);
