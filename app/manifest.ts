import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AeroMat — Murale, Szyldy, Dekoracje",
    short_name: "AeroMat",
    description:
      "Portfolio artysty muralisty — murale wielkoformatowe, komunikacja wizualna, wnętrza i dekoracje.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#ff7302",
    lang: "pl",
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
