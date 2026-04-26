import styles from "./page.module.css";

/*
  Mockup: sekcja #home-portfolio wzorowana na cam-l.pl
  (Salient/Nectar elastic masonry, style-2, ps="7").

  Layout 1:1 z oryginalem:
    - 4-kolumnowa siatka (desktop), gap 2px
    - 12 kafelkow w mieszanych rozmiarach: span 1 (25%) / span 2 (50%)
    - hover overlay w kolorze projektu, opacity 0 -> 0.8, fade ~1s cubic-bezier(0,1,.5,1)
    - tytul bialy + podtytul jasnoszary, scale 0.8 -> 1 na hover
    - CTA see-through (#3d929e) hover wypelnienie (#008f9d)

  Rozni sie od oryginalu: ZERO KADROWANIA.
    Kazdy kafelek ma aspect-ratio = aspect-ratio swojego zdjecia AeroMat,
    zatem `object-fit: fill` == brak cropu, brak letterboxow.
*/

type Tile = {
  title: string;
  category: string;
  src: string;
  width: number;
  height: number;
  span: 1 | 2;
  color: string;
};

const TILES: Tile[] = [
  { title: "Mural — wielkoformatowy",    category: "Murale · Identyfikacja",      src: "/Portfolio/murale/9.webp",           width: 2215, height: 3909, span: 1, color: "#d7a21e" },
  { title: "Wnętrze — recepcja",         category: "Wnętrza · Malarstwo ścienne", src: "/Portfolio/wnetrza/w1a.webp",        width: 4000, height: 1947, span: 2, color: "#7fa7c9" },
  { title: "Dekor — motyw geometryczny", category: "Wnętrza",                     src: "/Portfolio/wnetrza/w6.webp",         width: 1080, height: 1080, span: 1, color: "#d49c0e" },
  { title: "Projekt specjalny",          category: "Wnętrza · Custom",            src: "/Portfolio/wnetrza/P1371980.webp",   width: 4098, height: 4098, span: 2, color: "#2b5d9a" },
  { title: "Mural — ilustracja",         category: "Murale",                      src: "/Portfolio/murale/6.webp",           width: 2571, height: 2500, span: 2, color: "#e83e4f" },
  { title: "Ptasie — kompozycja",        category: "Malarstwo ptasie",            src: "/Portfolio/ptasie/2.webp",           width: 2400, height: 2400, span: 1, color: "#feb754" },
  { title: "Mural fasadowy",             category: "Murale",                      src: "/Portfolio/murale/8.webp",           width: 2400, height: 1157, span: 2, color: "#008f9d" },
  { title: "Ptasie — studium",           category: "Malarstwo ptasie",            src: "/Portfolio/ptasie/5.webp",           width: 2400, height: 2314, span: 1, color: "#f26428" },
  { title: "Dekor — wnętrze biurowe",    category: "Wnętrza",                     src: "/Portfolio/wnetrza/w4a.webp",        width: 2094, height: 2177, span: 1, color: "#d7a21e" },
  { title: "Mural — panorama",           category: "Murale",                      src: "/Portfolio/murale/2.webp",           width: 3382, height: 2000, span: 2, color: "#27ccc0" },
  { title: "Wnętrze — panorama loży",    category: "Wnętrza",                     src: "/Portfolio/wnetrza/w2.webp",         width: 3429, height: 2000, span: 2, color: "#00a2e0" },
  { title: "Ptasie — panorama",          category: "Malarstwo ptasie",            src: "/Portfolio/ptasie/7.webp",           width: 2400, height: 1485, span: 2, color: "#d49c0e" },
];

export default function PortfolioHomeMockupPage() {
  return (
    <main className={styles.page}>
      <section id="home-portfolio" className={styles.section}>
        <div className={styles.grid}>
          {TILES.map((t, i) => (
            <a
              key={i}
              href="#"
              className={styles.tile}
              data-span={t.span}
              style={{
                aspectRatio: `${t.width} / ${t.height}`,
                ["--project-color" as never]: t.color,
              }}
            >
              <img
                className={styles.img}
                src={t.src}
                alt={t.title}
                loading="lazy"
                decoding="async"
              />
              <span className={styles.overlay} aria-hidden="true" />
              <span className={styles.info}>
                <span className={styles.vcenter}>
                  <h3 className={styles.title}>{t.title}</h3>
                  <p className={styles.category}>{t.category}</p>
                </span>
              </span>
            </a>
          ))}
        </div>

        <div className={styles.ctaWrap}>
          <a href="/portfolio" className={styles.cta}>
            <span>Zobacz wszystkie</span>
          </a>
        </div>
      </section>
    </main>
  );
}
