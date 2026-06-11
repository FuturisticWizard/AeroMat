import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Kontakt | AeroMat — bezpłatna wycena muralu",
  description:
    "Napisz lub zadzwoń — bezpłatna wycena muralu, malowidła ściennego lub dekoracji. Lublin i cała Polska. Odpowiadam w ciągu 24 godzin.",
  alternates: { canonical: "/kontakt" },
};

export default function Page() {
  return <ContactPageClient />;
}
