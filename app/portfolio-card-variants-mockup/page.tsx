import type { ReactNode } from "react";
import styles from "./page.module.css";

/*
  Warianty "portfolio card" w layoucie z /portfolio-home-mockup.
  Ta sama siatka (4-kol, 12 kafelkow, mieszane rozmiary, grid-auto-flow: dense),
  ale obraz jest mniejszy — kazdy kafelek ma dodatkowy obszar na tytul/kategorie/opis.

  Warianty:
    V1 Classic      — biale tlo karty, ramka, tekst pod obrazem
    V2 Dark         — czarne tlo, akcent pomaranczowy #ff7302 (home palette)
    V3 Label inline — obraz wypelnia, pasek z podpisem na dole (zawsze widoczny)
    V4 Polaroid     — obraz z marginesem, krem/papierowe tlo, podpis wycentrowany

  Anty-crop: aspect-ratio .imgBox = aspect-ratio zdjecia,
  `object-fit: fill` == brak kadrowania, brak letterboxow.
*/

type Tile = {
  title: string;
  category: string;
  description: string;
  src: string;
  width: number;
  height: number;
  span: 1 | 2;
  color: string;
};

const TILES: Tile[] = [
  { title: "Mural — wielkoformatowy",    category: "Murale · Identyfikacja",      description: "Monumentalna forma na elewacji, pion 22 m.",         src: "/Portfolio/murale/9.webp",           width: 2215, height: 3909, span: 1, color: "#d7a21e" },
  { title: "Wnętrze — recepcja",         category: "Wnętrza · Malarstwo ścienne", description: "Ręcznie malowany motyw za ladą recepcji.",            src: "/Portfolio/wnetrza/w1a.webp",        width: 4000, height: 1947, span: 2, color: "#7fa7c9" },
  { title: "Dekor — motyw geometryczny", category: "Wnętrza",                     description: "Wzór modułowy na ścianie wewnętrznej.",               src: "/Portfolio/wnetrza/w6.webp",         width: 1080, height: 1080, span: 1, color: "#d49c0e" },
  { title: "Projekt specjalny",          category: "Wnętrza · Custom",            description: "Instalacja autorska — realizacja na zamówienie.",     src: "/Portfolio/wnetrza/P1371980.webp",   width: 4098, height: 4098, span: 2, color: "#2b5d9a" },
  { title: "Mural — ilustracja",         category: "Murale",                      description: "Ilustracyjny mural narracyjny, fasada boczna.",       src: "/Portfolio/murale/6.webp",           width: 2571, height: 2500, span: 2, color: "#e83e4f" },
  { title: "Ptasie — kompozycja",        category: "Malarstwo ptasie",            description: "Seria motywów awifauny — wariant pełnej kompozycji.", src: "/Portfolio/ptasie/2.webp",           width: 2400, height: 2400, span: 1, color: "#feb754" },
  { title: "Mural fasadowy",             category: "Murale",                      description: "Panoramiczny fryz na fasadzie kamienicy.",            src: "/Portfolio/murale/8.webp",           width: 2400, height: 1157, span: 2, color: "#008f9d" },
  { title: "Ptasie — studium",           category: "Malarstwo ptasie",            description: "Studium gatunku w technice akrylowej.",               src: "/Portfolio/ptasie/5.webp",           width: 2400, height: 2314, span: 1, color: "#f26428" },
  { title: "Dekor — wnętrze biurowe",    category: "Wnętrza",                     description: "Ściana przewodnia w strefie coworkingu.",             src: "/Portfolio/wnetrza/w4a.webp",        width: 2094, height: 2177, span: 1, color: "#d7a21e" },
  { title: "Mural — panorama",           category: "Murale",                      description: "Pełna szerokość fasady, układ horyzontalny.",         src: "/Portfolio/murale/2.webp",           width: 3382, height: 2000, span: 2, color: "#27ccc0" },
  { title: "Wnętrze — panorama loży",    category: "Wnętrza",                     description: "Długi format — ściana loży w lokalu gastro.",         src: "/Portfolio/wnetrza/w2.webp",         width: 3429, height: 2000, span: 2, color: "#00a2e0" },
  { title: "Ptasie — panorama",          category: "Malarstwo ptasie",            description: "Panoramiczny układ ptasich sylwet.",                  src: "/Portfolio/ptasie/7.webp",           width: 2400, height: 1485, span: 2, color: "#d49c0e" },
];

type Variant = "classic" | "dark" | "label" | "polaroid";

function Grid({ variant }: { variant: Variant }) {
  return (
    <div className={`${styles.grid} ${styles[`grid_${variant}`]}`}>
      {TILES.map((t, i) => (
        <article
          key={i}
          className={`${styles.card} ${styles[`card_${variant}`]}`}
          data-span={t.span}
          style={{ ["--project-color" as never]: t.color }}
        >
          <div
            className={styles.imgBox}
            style={{ aspectRatio: `${t.width} / ${t.height}` }}
          >
            <img
              className={styles.img}
              src={t.src}
              alt={t.title}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className={styles.meta}>
            <h3 className={styles.title}>{t.title}</h3>
            <p className={styles.category}>{t.category}</p>
            {variant === "dark" || variant === "classic" ? (
              <p className={styles.desc}>{t.description}</p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

function Section({ label, sub, children }: { label: string; sub: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.variantLabel}>{label}</h2>
        <p className={styles.variantSub}>{sub}</p>
      </div>
      {children}
    </section>
  );
}

export default function PortfolioCardVariantsMockupPage() {
  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <h1>Warianty Portfolio Card</h1>
        <p>
          Ta sama siatka 4-kolumnowa, 12 kafelków, mieszane rozmiary. Zdjęcia mniejsze —
          reszta karty to metadane. Zero kadrowania: aspect-ratio obrazu = aspect-ratio pliku.
        </p>
      </header>

      <Section label="V1 — Classic" sub="Białe tło karty, cienka ramka, tytuł + kategoria + krótki opis pod obrazem.">
        <Grid variant="classic" />
      </Section>

      <Section label="V2 — Dark" sub="Czarne tło karty, akcent pomarańczowy (#ff7302 z palety home), jasny podtytuł.">
        <Grid variant="dark" />
      </Section>

      <Section label="V3 — Label inline" sub="Obraz wypełnia kafelek, pasek z podpisem zawsze widoczny (gradient u dołu). Zero metadanych rozpraszających.">
        <Grid variant="label" />
      </Section>

      <Section label="V4 — Polaroid" sub="Ramka wokół obrazu, kremowe tło karty, podpis wycentrowany. Klimat galerii.">
        <Grid variant="polaroid" />
      </Section>
    </main>
  );
}
