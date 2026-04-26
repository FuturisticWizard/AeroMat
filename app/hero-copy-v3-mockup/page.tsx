import type { ReactNode } from "react";
import Link from "next/link";
import { Archivo_Black } from "next/font/google";
import styles from "./page.module.css";

// Archivo Black loaded only on this mockup page (no impact on main bundle)
const archivoBlack = Archivo_Black({
  variable: "--font-archivo",
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const HEADLINE = "Murale, które przyciągają wzrok";

const HeroBg = () => (
  <>
    <img
      src="/images/hero-poster.webp"
      alt=""
      aria-hidden
      className={styles.poster}
      loading="lazy"
      decoding="async"
    />
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/images/hero-poster.webp"
      className={styles.video}
    >
      <source src="/movies/hero_medium.webm" type="video/webm" />
      <source src="/movies/hero_compressed.mp4" type="video/mp4" />
    </video>
  </>
);

const Paragraph = ({ className }: { className: string }) => (
  <p className={className}>
    Szara ściana to <strong>stracona szansa</strong>. Zamieniam ją w{" "}
    <strong>magnes na klientów</strong> i darmową reklamę, którą Twoi goście sami wrzucają na Instagrama.
  </p>
);

const Cta = ({ className }: { className: string }) => (
  <div className={className}>
    <a href="#" className={styles.btn}>
      Bezpłatna wycena →
    </a>
    <span className={styles.micro}>25+ lat doświadczenia</span>
  </div>
);

const Badge = ({ children }: { children: ReactNode }) => (
  <div className={styles.badge}>{children}</div>
);

const Divider = ({ kicker, title, desc }: { kicker: string; title: string; desc: string }) => (
  <div className={styles.divider}>
    <p className={styles.dividerKicker}>{kicker}</p>
    <h2 className={styles.dividerTitle}>{title}</h2>
    <p className={styles.dividerDesc}>{desc}</p>
  </div>
);

export default function HeroCopyV3MockupPage() {
  return (
    <main className={`${styles.page} ${archivoBlack.variable}`}>
      <h1 className={styles.visuallyHidden}>
        Hero copy V3 — 12 stylizacji tej samej treści
      </h1>

      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          zIndex: 50,
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <Link
          href="/mockups"
          style={{
            fontFamily: "var(--font-space), sans-serif",
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.7)",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            padding: "0.55rem 0.9rem",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          ← indeks
        </Link>
      </div>

      <Divider
        kicker="Zestaw #1"
        title="Bebas Neue + Space Grotesk"
        desc="Kinowy, plakatowy — condensed display heading + neutralny, lekko techniczny paragraf."
      />

      {/* V1 — Center Spotlight */}
      <section className={styles.hero}>
        <HeroBg />
        <div className={styles.overlay1} />
        <div className={styles.content1}>
          <h2 className={styles.heading1}>{HEADLINE}</h2>
          <Paragraph className={styles.paragraph1} />
          <Cta className={styles.cta1} />
        </div>
        <Badge>V1 · Bebas + Space · Center Spotlight</Badge>
      </section>

      {/* V2 — Left Rail */}
      <section className={styles.hero}>
        <HeroBg />
        <div className={styles.overlay2} />
        <div className={styles.content2}>
          <div className={styles.rule2} />
          <h2 className={styles.heading2}>{HEADLINE}</h2>
          <Paragraph className={styles.paragraph2} />
          <Cta className={styles.cta2} />
        </div>
        <Badge>V2 · Bebas + Space · Left Rail</Badge>
      </section>

      {/* V3 — Orange Accent Italic */}
      <section className={styles.hero}>
        <HeroBg />
        <div className={styles.overlay3} />
        <div className={styles.content3}>
          <h2 className={styles.heading3}>
            Murale, które przyciągają <em>wzrok</em>
          </h2>
          <div className={styles.rule3} />
          <Paragraph className={styles.paragraph3} />
          <Cta className={styles.cta3} />
        </div>
        <Badge>V3 · Bebas + Space · Orange Italic Accent</Badge>
      </section>

      {/* V4 — Outlined Editorial */}
      <section className={styles.hero}>
        <HeroBg />
        <div className={styles.overlay4} />
        <div className={styles.content4}>
          <h2 className={styles.heading4}>
            Murale, <em>które</em> przyciągają wzrok
          </h2>
          <Paragraph className={styles.paragraph4} />
          <Cta className={styles.cta4} />
        </div>
        <Badge>V4 · Bebas + Space · Outlined Editorial</Badge>
      </section>

      {/* V5 — Stacked Diagonal */}
      <section className={styles.hero}>
        <HeroBg />
        <div className={styles.overlay5} />
        <div className={styles.content5}>
          <h2 className={styles.heading5}>
            <span>Murale,</span>
            <span>które</span>
            <span>przyciągają</span>
            <span>wzrok</span>
          </h2>
          <div className={styles.block5}>
            <Paragraph className={styles.paragraph5} />
            <Cta className={styles.cta5} />
          </div>
        </div>
        <Badge>V5 · Bebas + Space · Stacked Diagonal</Badge>
      </section>

      {/* V6 — Frosted Card */}
      <section className={styles.hero}>
        <HeroBg />
        <div className={styles.overlay6} />
        <div className={styles.content6}>
          <p className={styles.kicker6}>Aeromat · Malarstwo ścienne</p>
          <h2 className={styles.heading6}>{HEADLINE}</h2>
          <Paragraph className={styles.paragraph6} />
          <Cta className={styles.cta6} />
        </div>
        <Badge>V6 · Bebas + Space · Frosted Card</Badge>
      </section>

      <Divider
        kicker="Zestaw #2"
        title="Archivo Black + Space Grotesk 300"
        desc="Maksymalny kontrast wagowy — ultra-heavy display (weight 900 wizualnie) zestawiony z cienkim, przewiewnym paragrafem. Nowoczesny editorial."
      />

      {/* V7 — Archivo Black Mega Impact */}
      <section className={styles.hero}>
        <HeroBg />
        <div className={styles.overlay7} />
        <div className={styles.content7}>
          <h2 className={styles.heading7}>{HEADLINE}</h2>
          <Paragraph className={styles.paragraph7} />
          <Cta className={styles.cta7} />
        </div>
        <Badge>V7 · Archivo Black + Space 300 · Mega Impact</Badge>
      </section>

      {/* V8 — Archivo Black Editorial Left */}
      <section className={styles.hero}>
        <HeroBg />
        <div className={styles.overlay8} />
        <div className={styles.content8}>
          <p className={styles.kicker8}>Warszawa · Malarstwo ścienne</p>
          <h2 className={styles.heading8}>{HEADLINE}</h2>
          <div className={styles.hairline8} />
          <Paragraph className={styles.paragraph8} />
          <Cta className={styles.cta8} />
        </div>
        <Badge>V8 · Archivo Black + Space 300 · Editorial Left</Badge>
      </section>

      {/* V9 — Archivo Black Orange Last Word */}
      <section className={styles.hero}>
        <HeroBg />
        <div className={styles.overlay9} />
        <div className={styles.content9}>
          <h2 className={styles.heading9}>
            <small>Murale,</small>
            <small>które przyciągają</small>
            <mark>wzrok.</mark>
          </h2>
          <Paragraph className={styles.paragraph9} />
          <Cta className={styles.cta9} />
        </div>
        <Badge>V9 · Archivo Black + Space 300 · Orange Last Word</Badge>
      </section>

      <Divider
        kicker="Zestaw #3"
        title="Anton + Space Grotesk"
        desc="Condensed, wysoki display — billboardowy, mocny charakter. Bliski aktualnej identyfikacji strony (Anton już jest w użyciu)."
      />

      {/* V10 — Anton Condensed Classic Center */}
      <section className={styles.hero}>
        <HeroBg />
        <div className={styles.overlay10} />
        <div className={styles.content10}>
          <h2 className={styles.heading10}>{HEADLINE}</h2>
          <Paragraph className={styles.paragraph10} />
          <Cta className={styles.cta10} />
        </div>
        <Badge>V10 · Anton + Space · Condensed Classic</Badge>
      </section>

      {/* V11 — Anton Billboard Side Split */}
      <section className={styles.hero}>
        <HeroBg />
        <div className={styles.overlay11} />
        <div className={styles.content11}>
          <h2 className={styles.heading11}>
            Murale,<br />
            które<br />
            przyciągają<br />
            <span>wzrok</span>
          </h2>
          <div className={styles.block11}>
            <Paragraph className={styles.paragraph11} />
            <Cta className={styles.cta11} />
          </div>
        </div>
        <Badge>V11 · Anton + Space · Billboard Side Split</Badge>
      </section>

      {/* V12 — Anton Paint Stroke */}
      <section className={styles.hero}>
        <HeroBg />
        <div className={styles.overlay12} />
        <div className={styles.content12}>
          <h2 className={styles.heading12}>
            Murale, które przyciągają <mark>wzrok</mark>
          </h2>
          <Paragraph className={styles.paragraph12} />
          <Cta className={styles.cta12} />
        </div>
        <Badge>V12 · Anton + Space · Paint Stroke</Badge>
      </section>

      <Divider
        kicker="Wariacja V4"
        title="Outlined · Bottom Center"
        desc="Ten sam outlined stroke co V4, ale mniejszy heading, wyśrodkowany tekst i położenie na dole sekcji hero — bliżej layoutu produkcyjnego."
      />

      {/* V13 — Bebas Outlined Bottom Center (wariacja V4) */}
      <section className={styles.hero}>
        <HeroBg />
        <div className={styles.overlay13} />
        <div className={styles.content13}>
          <h2 className={styles.heading13}>
            Murale, <em>które</em> przyciągają wzrok
          </h2>
          <Paragraph className={styles.paragraph13} />
          <Cta className={styles.cta13} />
        </div>
        <Badge>V13 · Bebas + Space · Outlined · Bottom Center</Badge>
      </section>
    </main>
  );
}
