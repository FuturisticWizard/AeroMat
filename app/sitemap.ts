import type { MetadataRoute } from "next";

// Adres produkcyjny — można nadpisać zmienną środowiskową NEXT_PUBLIC_SITE_URL.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://muralelublin.pl";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Tylko realne, publiczne podstrony (bez pustych makiet /blog, /firma, /process).
  const routes = ["", "/portfolio", "/o-mnie", "/filmy", "/kontakt"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
