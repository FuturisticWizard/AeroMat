import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio | AeroMat — murale, wnętrza, dekoracje",
  description:
    "Galeria realizacji: murale wielkoformatowe, malowidła ścienne, wnętrza i projekty specjalne. Zobacz prace AeroMat z Lublina i całej Polski.",
  alternates: { canonical: "/portfolio" },
};

export default function Page() {
  return <PortfolioClient />;
}
