import Image from "next/image";
import type { CSSProperties } from "react";

/*
  TrustedByGrid — 4×3 „hover-to-color" wall.
  Stan spoczynku: grayscale + delikatna lewitacja nad „podłożem" (translateY -4px
  co ~4.2s). Cień pod logiem synchroniczny: gdy logo wyżej → cień szerszy / bledszy,
  gdy niżej → węższy / ciemniejszy (imitacja odległości od podłoża). Hover: pełny kolor,
  cień/lewitacja dalej grają. Stagger per komórka (ujemny animation-delay) — logosy nie
  bujają synchronicznie, co daje „organiczny" rytm. `prefers-reduced-motion` wyłącza ruch.

  Per-logo overrides dla logosów z czarnymi elementami, które na czarnym tle nie czytają się:
    - Molotow (6P) — default V01-style invert filter, hover: 6P-dark-plain-ring.webp
    - NIW    (7P) — dark-ready plik w obu stanach
    - NCK    (9P) — default V01-style invert, hover: 9P-dark.webp
*/

const logos = [
  "/logo/clients_logos/1P.png",
  "/logo/clients_logos/2P.png",
  "/logo/clients_logos/3P.png",
  "/logo/clients_logos/4P.png",
  "/logo/clients_logos/5P.png",
  "/logo/clients_logos/6P.png",
  "/logo/clients_logos/7P.png",
  "/logo/clients_logos/8P.png",
  "/logo/clients_logos/9P.png",
  "/logo/clients_logos/10P.png",
  "/logo/clients_logos/11P.png",
  "/logo/clients_logos/12P.png",
];

const FILTER_INVERT = "grayscale(1) invert(1) opacity(0.88)";
const FILTER_PLAIN  = "grayscale(1) opacity(0.85)";

type LogoOverride = {
  defaultSrc?: string;
  defaultFilter?: string;
  hoverSrc?: string;
};

const OVERRIDES: Record<number, LogoOverride> = {
  5: {
    defaultFilter: FILTER_INVERT,
    hoverSrc: "/logo/clients_logos/6P-dark-plain-ring.webp",
  },
  6: {
    defaultSrc: "/logo/clients_logos/7P-dark.png",
    hoverSrc:   "/logo/clients_logos/7P-dark.png",
  },
  8: {
    defaultFilter: FILTER_INVERT,
    hoverSrc: "/logo/clients_logos/9P-dark.webp",
  },
};

type LogoSpec = {
  defaultSrc: string;
  defaultFilter: string;
  hoverSrc: string;
};

const resolveSpec = (i: number): LogoSpec => {
  const o = OVERRIDES[i] ?? {};
  const defaultSrc = o.defaultSrc ?? logos[i];
  return {
    defaultSrc,
    defaultFilter: o.defaultFilter ?? FILTER_PLAIN,
    hoverSrc:      o.hoverSrc      ?? defaultSrc,
  };
};

/* Ujemny delay rozrzuca fazę per komórka w obrębie cyklu 4.2s.
   Krok 0.35s × 12 = 4.2s → równomiernie po całym cyklu. */
const floatDelay = (i: number) => `${(i * -0.35).toFixed(2)}s`;

const TrustedByGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 md:gap-x-10 gap-y-28 md:gap-y-36 max-w-5xl mx-auto">
      {logos.map((_, i) => {
        const spec = resolveSpec(i);
        const delay = floatDelay(i);
        const animStyle: CSSProperties = { animationDelay: delay };
        return (
          <div key={i} className="h-16 md:h-20 group relative">
            <div
              aria-hidden
              className="aeromat-logo-shadow pointer-events-none absolute left-1/2 w-[55%] h-3 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
              style={{
                ...animStyle,
                bottom: "-32px",
                background:
                  "radial-gradient(ellipse, rgba(255,255,255,0.32) 0%, rgba(235,235,235,0.14) 45%, rgba(210,210,210,0) 80%)",
                filter: "blur(5px)",
              }}
            />
            <div className="aeromat-logo-float absolute inset-0" style={animStyle}>
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-out group-hover:opacity-0"
                style={{ filter: spec.defaultFilter }}
              >
                <Image
                  src={spec.defaultSrc}
                  alt={`Klient ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 160px, 120px"
                  className="object-contain"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
                <Image
                  src={spec.hoverSrc}
                  alt={`Klient ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 160px, 120px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrustedByGrid;
