"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { portfolioPhotos } from "@/app/lib/photos";
import styles from "./page.module.css";

/*
  Portfolio animation variants mockup.
  Jedna wspólna animacja (Card intro „Murale Wielkoformatowe” + Portfolio),
  16 wariantów siatki przełączanych przyciskami u góry.

  4 strategie anti-crop × 4 sub-warianty = 16:
    V1 Justified Rows        — flex-wrap, aspect-ratio per item, stała wysokość rzędu
    V2 Aspect Bento          — CSS Grid, aspect-ratio komórki = aspect-ratio zdjęcia
    V3 Masonry Columns       — CSS columns (Pinterest waterfall)
    V4 Row-span Masonry      — CSS Grid + grid-row: span N policzone z aspect-ratio
*/

type Strategy = "v1" | "v2" | "v3" | "v4";

type Variant = {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  strategy: Strategy;
  cssVars: Record<string, string>;
  /** V2/V4 only: which photos span 2 columns (by index). */
  spanPanoramas?: boolean;
};

const VARIANTS: Variant[] = [
  // --- Strategy 1: Justified Rows ---
  { id: "v1-1", strategy: "v1", shortLabel: "V1.1", label: "V1.1 · 28vh / gap 4",
    description: "Justified Rows · baseline. Wysokość rzędu 28vh, gap 4px. Zdjęcia o naturalnych proporcjach układają się w rzędach o równej wysokości.",
    cssVars: { "--row-h": "28vh", "--gap": "4px" } },
  { id: "v1-2", strategy: "v1", shortLabel: "V1.2", label: "V1.2 · 22vh / gap 2",
    description: "Justified Rows · dense. Mniejsze rzędy (22vh), minimalny gap (2px) — najgęściej, najwięcej zdjęć w polu widzenia.",
    cssVars: { "--row-h": "22vh", "--gap": "2px" } },
  { id: "v1-3", strategy: "v1", shortLabel: "V1.3", label: "V1.3 · 32vh / gap 6",
    description: "Justified Rows · airy. Wyższe rzędy (32vh), większy gap (6px) — eksponowane, czytelne, mniej zdjęć na ekranie.",
    cssVars: { "--row-h": "32vh", "--gap": "6px" } },
  { id: "v1-4", strategy: "v1", shortLabel: "V1.4", label: "V1.4 · 26vh / gap 10",
    description: "Justified Rows · chunky. Średnie rzędy (26vh) z mocnym oddychaniem (gap 10px) — galeryjny wydźwięk.",
    cssVars: { "--row-h": "26vh", "--gap": "10px" } },

  // --- Strategy 2: Aspect Bento ---
  { id: "v2-1", strategy: "v2", shortLabel: "V2.1", label: "V2.1 · 4-col, span 1",
    description: "Aspect Bento · 4-kolumnowa siatka, każde zdjęcie span=1. Komórka ma aspect-ratio zdjęcia → zero kadrowania, mieszane wysokości w wierszu.",
    cssVars: { "--cols": "4", "--gap": "4px" } },
  { id: "v2-2", strategy: "v2", shortLabel: "V2.2", label: "V2.2 · 4-col, panoramy span 2",
    description: "Aspect Bento · 4-kol, panoramy (aspect ≥ 1.6) zajmują 2 kolumny. Mocniejszy rytm — jak na home portfolio.",
    cssVars: { "--cols": "4", "--gap": "4px" }, spanPanoramas: true },
  { id: "v2-3", strategy: "v2", shortLabel: "V2.3", label: "V2.3 · 6-col / gap 2",
    description: "Aspect Bento · 6 kolumn, gap 2px. Mniejsze, gęściej upakowane kafelki — więcej zdjęć widać jednocześnie.",
    cssVars: { "--cols": "6", "--gap": "2px" } },
  { id: "v2-4", strategy: "v2", shortLabel: "V2.4", label: "V2.4 · 5-col, panoramy span 2",
    description: "Aspect Bento · 5-kol z panoramami span=2. Asymetryczny rytm, mniej regularny niż V2.2.",
    cssVars: { "--cols": "5", "--gap": "4px" }, spanPanoramas: true },

  // --- Strategy 3: Masonry Columns (CSS columns) ---
  { id: "v3-1", strategy: "v3", shortLabel: "V3.1", label: "V3.1 · 3-col / gap 6",
    description: "Masonry Columns · 3 kolumny CSS, kaskada zdjęć. Zero JS. Czyta się góra→dół per kolumna.",
    cssVars: { "--cols": "3", "--gap": "6px" } },
  { id: "v3-2", strategy: "v3", shortLabel: "V3.2", label: "V3.2 · 4-col / gap 4",
    description: "Masonry Columns · 4 kolumny, ciaśniej. Mniejsze zdjęcia, więcej gęstości.",
    cssVars: { "--cols": "4", "--gap": "4px" } },
  { id: "v3-3", strategy: "v3", shortLabel: "V3.3", label: "V3.3 · 5-col / gap 4",
    description: "Masonry Columns · 5 kolumn — najgęstsza wersja CSS columns. Działa głównie na desktopie, mobile zwija do 2.",
    cssVars: { "--cols": "5", "--gap": "4px" } },
  { id: "v3-4", strategy: "v3", shortLabel: "V3.4", label: "V3.4 · 3-col / gap 14",
    description: "Masonry Columns · 3 kolumny z dużym oddychaniem (gap 14px) — galeryjnie, oddycha.",
    cssVars: { "--cols": "3", "--gap": "14px" } },

  // --- Strategy 4: Row-span Masonry ---
  { id: "v4-1", strategy: "v4", shortLabel: "V4.1", label: "V4.1 · 4-col / row 10px",
    description: "Row-span Masonry · 4 kol, grid-auto-rows 10px. Każdy item dostaje span policzony z aspect-ratio. Czyta się L→P jak gazeta.",
    cssVars: { "--cols": "4", "--gap": "4px", "--row-h": "10px" } },
  { id: "v4-2", strategy: "v4", shortLabel: "V4.2", label: "V4.2 · 6-col / row 8px",
    description: "Row-span Masonry · 6 kol, mniejsze rzędy 8px. Większa rozdzielczość siatki = mniejsze różnice wysokości między rzędami.",
    cssVars: { "--cols": "6", "--gap": "2px", "--row-h": "8px" } },
  { id: "v4-3", strategy: "v4", shortLabel: "V4.3", label: "V4.3 · 5-col / row 6px",
    description: "Row-span Masonry · 5 kol, drobne rzędy 6px — najprecyzyjniejsze odwzorowanie aspect-ratio.",
    cssVars: { "--cols": "5", "--gap": "6px", "--row-h": "6px" } },
  { id: "v4-4", strategy: "v4", shortLabel: "V4.4", label: "V4.4 · 4-col, panoramy span 2",
    description: "Row-span Masonry · 4 kol, panoramy zajmują 2 kolumny. Hybryda V4 + V2 dla większej zmienności.",
    cssVars: { "--cols": "4", "--gap": "4px", "--row-h": "10px" }, spanPanoramas: true },
];

const STRATEGY_LABEL: Record<Strategy, string> = {
  v1: "V1 · Justified Rows",
  v2: "V2 · Aspect Bento",
  v3: "V3 · Masonry Columns",
  v4: "V4 · Row-span Masonry",
};

const STRATEGIES: Strategy[] = ["v1", "v2", "v3", "v4"];

/** Heurystyka: panorama = aspect-ratio ≥ 1.6. */
const isPanorama = (w: number, h: number) => w / h >= 1.6;

/** V4: ile rzędów grid-auto-rows zajmuje item dla danego rozmiaru kolumny. */
function computeRowSpan(
  imgW: number,
  imgH: number,
  colWidth: number,
  rowH: number,
  gap: number,
  colspan: number,
): number {
  const itemW = colWidth * colspan + gap * (colspan - 1);
  const itemH = (imgH / imgW) * itemW;
  return Math.max(1, Math.ceil((itemH + gap) / (rowH + gap)));
}

export default function PortfolioAnimationVariantsMockupPage() {
  const [currentId, setCurrentId] = useState<string>("v1-1");
  const [containerW, setContainerW] = useState<number>(1280);
  const portfolioRef = useRef<HTMLDivElement>(null);

  // Track grid container width — needed for V4 row-span calc.
  useEffect(() => {
    const onResize = () => {
      if (portfolioRef.current) {
        setContainerW(portfolioRef.current.clientWidth);
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Re-measure when variant changes (different padding/cols may shift width)
  useEffect(() => {
    if (portfolioRef.current) {
      setContainerW(portfolioRef.current.clientWidth);
    }
  }, [currentId]);

  // Re-trigger reveal animation on variant switch (replay stagger).
  const [revealKey, setRevealKey] = useState(0);
  useEffect(() => {
    setRevealKey((k) => k + 1);
  }, [currentId]);

  const variant = useMemo(
    () => VARIANTS.find((v) => v.id === currentId) ?? VARIANTS[0],
    [currentId],
  );

  return (
    <main className={styles.page}>
      {/* ---- Sticky switcher ---- */}
      <div className={styles.switcher}>
        <div className={styles.switcherInner}>
          {STRATEGIES.map((s) => (
            <div key={s} className={styles.group}>
              <span className={styles.groupLabel}>{STRATEGY_LABEL[s]}</span>
              <div className={styles.groupRow}>
                {VARIANTS.filter((v) => v.strategy === s).map((v) => (
                  <button
                    key={v.id}
                    className={`${styles.btn} ${v.id === currentId ? styles.btnActive : ""}`}
                    onClick={() => setCurrentId(v.id)}
                    title={v.label}
                  >
                    {v.shortLabel}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Variant description bar ---- */}
      <div className={styles.descBar}>
        <strong>{variant.shortLabel}</strong>
        {variant.description}
      </div>

      {/* ---- Card intro (statyczna replika .card z home) ---- */}
      <section className={styles.cardIntro}>
        <div className={styles.cardImg}>
          <Image
            src="/Animation/Murale_Wielkoformatowe/TitleCard/desktop.webp"
            alt="Murale Wielkoformatowe"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.cardDim} aria-hidden />
        <div className={styles.cardContent}>
          <h1 className={styles.cardTitle}>Murale Wielkoformatowe</h1>
          <p className={styles.cardDesc}>
            Przekształcam szare ściany w żywe dzieła sztuki. Każdy mural to opowieść
            wyrażona kolorem i formą na wielkim płótnie miasta.
          </p>
        </div>
        <span className={styles.scrollHint}>scroll ↓</span>
      </section>

      {/* ---- Portfolio (variant grid) ---- */}
      <section className={styles.portfolio}>
        <div className={styles.portfolioHead}>
          <p className={styles.portfolioLabel}>Portfolio · {variant.shortLabel}</p>
          <h2 className={styles.portfolioTitle}>Wybrane realizacje</h2>
        </div>

        <div ref={portfolioRef} key={revealKey}>
          <VariantGrid variant={variant} containerW={containerW} />
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   VariantGrid — wybiera klasę siatki na podstawie strategii,
   liczy span dla V4, ustawia CSS vars per item.
   ============================================================ */
function VariantGrid({ variant, containerW }: { variant: Variant; containerW: number }) {
  const cssVars = variant.cssVars as React.CSSProperties;
  const className = `${styles[variant.strategy]}`;

  // V4 needs row-span calc per item
  const v4Cols = parseInt(variant.cssVars["--cols"] ?? "4", 10);
  const v4Gap = parseInt(variant.cssVars["--gap"] ?? "4", 10);
  const v4RowH = parseInt(variant.cssVars["--row-h"] ?? "10", 10);

  // estimated col width for V4 (container minus padding minus gaps, divided by cols)
  const colWidth = (containerW - v4Gap * 2 - v4Gap * (v4Cols - 1)) / v4Cols;

  return (
    <div className={className} style={cssVars}>
      {portfolioPhotos.map((p, idx) => {
        const useSpan2 = !!variant.spanPanoramas && isPanorama(p.width, p.height);
        const colspan = useSpan2 ? 2 : 1;

        // Build per-item style
        const itemStyle: React.CSSProperties = {
          ["--ar" as never]: `${p.width} / ${p.height}`,
          animationDelay: `${Math.min(idx * 0.06, 0.6)}s`,
        };

        if (variant.strategy === "v4") {
          const rowSpan = computeRowSpan(p.width, p.height, colWidth, v4RowH, v4Gap, colspan);
          itemStyle.gridRow = `span ${rowSpan}`;
        }

        return (
          <div
            key={`${variant.id}-${p.index}`}
            className={`${styles.itemBase} ${styles.reveal}`}
            data-span={useSpan2 ? "2" : "1"}
            data-colspan={useSpan2 ? "2" : "1"}
            style={itemStyle}
          >
            <Image
              src={p.src}
              alt={p.title}
              width={p.width}
              height={p.height}
              className={styles.imgEl}
              sizes={
                variant.strategy === "v3"
                  ? "(max-width: 520px) 50vw, (max-width: 900px) 33vw, 25vw"
                  : "(max-width: 520px) 50vw, (max-width: 900px) 33vw, 22vw"
              }
              quality={85}
              loading={idx < 4 ? "eager" : "lazy"}
            />
          </div>
        );
      })}
    </div>
  );
}
