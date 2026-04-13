import Image from "next/image";
import {
  Playfair_Display,
  Syne,
  Space_Grotesk,
  Archivo_Black,
  DM_Serif_Display,
  Cormorant_Garamond,
  JetBrains_Mono,
  Oswald,
  Cinzel,
} from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--mk-playfair",
  weight: ["400", "700", "900"],
});
const syne = Syne({
  subsets: ["latin", "latin-ext"],
  variable: "--mk-syne",
  weight: ["500", "700", "800"],
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--mk-space",
  weight: ["300", "400", "500", "700"],
});
const archivoBlack = Archivo_Black({
  subsets: ["latin", "latin-ext"],
  variable: "--mk-archivo",
  weight: "400",
});
const dmSerif = DM_Serif_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--mk-dmserif",
  weight: "400",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--mk-cormorant",
  weight: ["300", "400", "500"],
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--mk-mono",
  weight: ["400", "500"],
});
const oswald = Oswald({
  subsets: ["latin", "latin-ext"],
  variable: "--mk-oswald",
  weight: ["300", "500", "700"],
});
const cinzel = Cinzel({
  subsets: ["latin", "latin-ext"],
  variable: "--mk-cinzel",
  weight: ["400", "600", "900"],
});

type Variant = {
  id: string;
  label: string;
  note: string;
  fonts: string;
  h2Style: React.CSSProperties;
  pStyle: React.CSSProperties;
  wrapper?: React.CSSProperties;
  accent?: React.ReactNode;
};

const SAMPLE = {
  title: "PRECYZJA MATERIAŁÓW",
  description:
    "Materiały dobieram z najwyższą starannością, uwzględniając otoczenie i jego wpływ na pracę. Farby antysmogowe, UV, spray, aerograf — każda technika dobrana do zlecenia.",
};

const variants: Variant[] = [
  {
    id: "v0",
    label: "0) Obecny (baseline)",
    note: "H2 uppercase, letter-spacing 0.1rem, line-height 1.4",
    fonts: "Bebas Neue + Inter",
    h2Style: {
      fontFamily: "var(--font-bebas)",
      fontSize: "clamp(2.5rem, 5vw, 5rem)",
      fontWeight: 400,
      letterSpacing: "0.1rem",
      lineHeight: 1,
      textTransform: "uppercase",
      color: "#fff",
      marginBottom: "1rem",
    },
    pStyle: {
      fontFamily: "var(--font-inter)",
      fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
      lineHeight: 1.4,
      letterSpacing: "0.05rem",
      color: "rgb(238 244 255 / 92%)",
      maxWidth: "60ch",
    },
  },
  {
    id: "v1",
    label: "1) Editorial serif — Playfair Display + Inter",
    note: "Elegancki serif high-contrast; świetny dla premium feel, mocny kontrast z rustykalnym tłem panoramy",
    fonts: "Playfair Display 900 + Inter 300",
    h2Style: {
      fontFamily: "var(--mk-playfair)",
      fontSize: "clamp(3rem, 6vw, 6rem)",
      fontWeight: 900,
      letterSpacing: "-0.01em",
      lineHeight: 0.95,
      textTransform: "none",
      color: "#fff",
      marginBottom: "1.75rem",
      fontStyle: "italic",
    },
    pStyle: {
      fontFamily: "var(--font-inter)",
      fontSize: "clamp(1rem, 1.2vw, 1.1rem)",
      lineHeight: 1.75,
      letterSpacing: 0,
      color: "rgb(255 255 255 / 78%)",
      maxWidth: "46ch",
      fontWeight: 300,
    },
  },
  {
    id: "v2",
    label: "2) Modern geometric — Syne + Space Grotesk",
    note: "Designerski duet — Syne jako display, Space Grotesk jako body; świeże i młode",
    fonts: "Syne 800 + Space Grotesk 400",
    h2Style: {
      fontFamily: "var(--mk-syne)",
      fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)",
      fontWeight: 800,
      letterSpacing: "-0.02em",
      lineHeight: 0.95,
      textTransform: "none",
      color: "#fff",
      marginBottom: "1.5rem",
    },
    pStyle: {
      fontFamily: "var(--mk-space)",
      fontSize: "clamp(1rem, 1.25vw, 1.15rem)",
      lineHeight: 1.6,
      letterSpacing: 0,
      color: "rgb(255 255 255 / 82%)",
      maxWidth: "50ch",
      fontWeight: 400,
    },
  },
  {
    id: "v3",
    label: "3) Heavy grotesk — Archivo Black + Inter",
    note: "Mocny, industrialny punch. Pasuje do projektu streetartowego, wielkoformatowego",
    fonts: "Archivo Black + Inter 400",
    h2Style: {
      fontFamily: "var(--mk-archivo)",
      fontSize: "clamp(2.5rem, 5vw, 5rem)",
      fontWeight: 400,
      letterSpacing: "-0.015em",
      lineHeight: 0.95,
      textTransform: "uppercase",
      color: "#fff",
      marginBottom: "1.5rem",
    },
    pStyle: {
      fontFamily: "var(--font-inter)",
      fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
      lineHeight: 1.65,
      letterSpacing: 0,
      color: "rgb(255 255 255 / 80%)",
      maxWidth: "48ch",
      fontWeight: 400,
    },
  },
  {
    id: "v4",
    label: "4) Klasyczny serif — DM Serif Display + Cormorant",
    note: "Luksusowe, galeryjne wrażenie; najbardziej \"artystyczny\" wariant",
    fonts: "DM Serif Display + Cormorant Garamond 400",
    h2Style: {
      fontFamily: "var(--mk-dmserif)",
      fontSize: "clamp(3rem, 6vw, 6rem)",
      fontWeight: 400,
      letterSpacing: 0,
      lineHeight: 1,
      textTransform: "none",
      color: "#fff",
      marginBottom: "1.5rem",
    },
    pStyle: {
      fontFamily: "var(--mk-cormorant)",
      fontSize: "clamp(1.1rem, 1.4vw, 1.35rem)",
      lineHeight: 1.55,
      letterSpacing: 0,
      color: "rgb(255 255 255 / 82%)",
      maxWidth: "50ch",
      fontWeight: 400,
      fontStyle: "italic",
    },
  },
  {
    id: "v5",
    label: "5) Display + mono akcent — Anton + JetBrains Mono",
    note: "Techniczna etykieta (mono) nad dużym displayem — czytelna hierarchia",
    fonts: "Anton + JetBrains Mono 500",
    h2Style: {
      fontFamily: "var(--font-anton)",
      fontSize: "clamp(3.2rem, 7vw, 7.5rem)",
      fontWeight: 400,
      letterSpacing: "-0.01em",
      lineHeight: 0.9,
      textTransform: "uppercase",
      color: "#fff",
      margin: "0.5rem 0 1.5rem",
    },
    pStyle: {
      fontFamily: "var(--font-inter)",
      fontSize: "clamp(0.95rem, 1.15vw, 1.05rem)",
      lineHeight: 1.7,
      letterSpacing: 0,
      color: "rgb(255 255 255 / 78%)",
      maxWidth: "42ch",
      fontWeight: 300,
    },
    accent: (
      <div
        style={{
          fontFamily: "var(--mk-mono)",
          fontSize: "0.75rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#ff7302",
          fontWeight: 500,
        }}
      >
        // 01 &middot; FILOZOFIA
      </div>
    ),
  },
  {
    id: "v6",
    label: "6) Jedna rodzina — Space Grotesk (700 + 300)",
    note: "Minimalizm: cała typografia w jednej rodzinie, hierarchia przez wagę i rozmiar",
    fonts: "Space Grotesk 700 + Space Grotesk 300",
    h2Style: {
      fontFamily: "var(--mk-space)",
      fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)",
      fontWeight: 700,
      letterSpacing: "-0.025em",
      lineHeight: 1,
      textTransform: "none",
      color: "#fff",
      marginBottom: "1.5rem",
    },
    pStyle: {
      fontFamily: "var(--mk-space)",
      fontSize: "clamp(1rem, 1.25vw, 1.15rem)",
      lineHeight: 1.6,
      letterSpacing: 0,
      color: "rgb(255 255 255 / 75%)",
      maxWidth: "48ch",
      fontWeight: 300,
    },
  },
  {
    id: "v7",
    label: "7) Condensed — Oswald + Inter",
    note: "Wąski i wysoki; dobre dla długich polskich tytułów (nie łamie się)",
    fonts: "Oswald 500 + Inter 400",
    h2Style: {
      fontFamily: "var(--mk-oswald)",
      fontSize: "clamp(3rem, 6vw, 6.5rem)",
      fontWeight: 500,
      letterSpacing: "0.02em",
      lineHeight: 0.95,
      textTransform: "uppercase",
      color: "#fff",
      marginBottom: "1.5rem",
    },
    pStyle: {
      fontFamily: "var(--font-inter)",
      fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
      lineHeight: 1.65,
      letterSpacing: "0.01em",
      color: "rgb(255 255 255 / 80%)",
      maxWidth: "50ch",
      fontWeight: 400,
    },
  },
  {
    id: "v8",
    label: "8) Monumentalny — Cinzel + Cormorant",
    note: "Rzymski, pomnikowy. Pasuje jeśli chcesz podkreślić rzemiosło / tradycję",
    fonts: "Cinzel 900 + Cormorant Garamond 400",
    h2Style: {
      fontFamily: "var(--mk-cinzel)",
      fontSize: "clamp(2.2rem, 4.5vw, 4.2rem)",
      fontWeight: 900,
      letterSpacing: "0.06em",
      lineHeight: 1.1,
      textTransform: "uppercase",
      color: "#fff",
      marginBottom: "1.5rem",
    },
    pStyle: {
      fontFamily: "var(--mk-cormorant)",
      fontSize: "clamp(1.05rem, 1.35vw, 1.3rem)",
      lineHeight: 1.55,
      letterSpacing: "0.01em",
      color: "rgb(255 255 255 / 82%)",
      maxWidth: "52ch",
      fontWeight: 400,
    },
  },
  {
    id: "v9",
    label: "9) Neon glow — Bebas + Inter (spójny z intro/outro)",
    note: "Text-shadow #228DFF multi-layer; nawiązuje do animacji intro/outro strony",
    fonts: "Bebas Neue + Inter",
    h2Style: {
      fontFamily: "var(--font-bebas)",
      fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)",
      fontWeight: 400,
      letterSpacing: "0.12em",
      lineHeight: 1,
      textTransform: "uppercase",
      color: "#eaf3ff",
      marginBottom: "1.5rem",
      textShadow:
        "0 0 6px rgba(34,141,255,0.85), 0 0 18px rgba(34,141,255,0.6), 0 0 40px rgba(34,141,255,0.4)",
    },
    pStyle: {
      fontFamily: "var(--font-inter)",
      fontSize: "clamp(1rem, 1.25vw, 1.1rem)",
      lineHeight: 1.6,
      letterSpacing: "0.02em",
      color: "rgb(234 243 255 / 85%)",
      maxWidth: "52ch",
      fontWeight: 400,
    },
  },
];

const mkVars = `${playfair.variable} ${syne.variable} ${spaceGrotesk.variable} ${archivoBlack.variable} ${dmSerif.variable} ${cormorant.variable} ${jetbrains.variable} ${oswald.variable} ${cinzel.variable}`;

export default function PanoramaTypographyMockup() {
  return (
    <main
      className={mkVars}
      style={{
        background: "#0a0a0a",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "var(--font-inter)",
      }}
    >
      <header
        style={{
          padding: "3rem 2rem 2rem",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-bebas)",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            letterSpacing: "0.05em",
            margin: 0,
          }}
        >
          Panorama · propozycje typografii i fontów
        </h1>
        <p
          style={{
            marginTop: "0.75rem",
            color: "rgb(255 255 255 / 60%)",
            maxWidth: "60ch",
            lineHeight: 1.6,
          }}
        >
          Ten sam tekst, to samo tło — zmienia się tylko typografia i para
          fontów. Scrolluj i wybierz numer wariantu, przeniosę styl do
          <code style={{ color: "#ff7302" }}> .panorama-caption</code>.
        </p>
      </header>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
          padding: "2rem",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {variants.map((v) => (
          <section key={v.id}>
            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#ff7302",
                    margin: 0,
                    letterSpacing: "0.02em",
                  }}
                >
                  {v.label}
                </h3>
                <div
                  style={{
                    fontFamily: "var(--mk-mono)",
                    fontSize: "0.75rem",
                    color: "rgb(255 255 255 / 50%)",
                    marginTop: "0.35rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {v.fonts}
                </div>
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "rgb(255 255 255 / 55%)",
                  margin: 0,
                  maxWidth: "60ch",
                  lineHeight: 1.5,
                }}
              >
                {v.note}
              </p>
            </div>

            <div
              style={{
                position: "relative",
                width: "100%",
                height: "clamp(400px, 55vh, 620px)",
                overflow: "hidden",
                borderRadius: "4px",
                border: "1px solid rgb(255 255 255 / 8%)",
              }}
            >
              <Image
                src="/Animation/Panorama/komeko-new.webp"
                alt=""
                fill
                sizes="100vw"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, rgb(0 0 0 / 55%) 0%, rgb(0 0 0 / 20%) 50%, rgb(0 0 0 / 45%) 100%)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  padding: "clamp(1.5rem, 4vw, 3rem)",
                }}
              >
                <div style={v.wrapper}>
                  {v.accent}
                  <h2 style={v.h2Style}>{SAMPLE.title}</h2>
                  <p style={v.pStyle}>{SAMPLE.description}</p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <footer
        style={{
          padding: "3rem 2rem 5rem",
          maxWidth: "1400px",
          margin: "0 auto",
          color: "rgb(255 255 255 / 45%)",
          fontSize: "0.85rem",
        }}
      >
        Powiedz numer wariantu (np. „jedziemy z 4") — przeniosę styl do{" "}
        <code style={{ color: "#ff7302" }}>app/globals.css</code> pod{" "}
        <code style={{ color: "#ff7302" }}>.panorama-caption</code>.
      </footer>
    </main>
  );
}
