import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const HEADLINE_DEFAULT = "Porozmawiajmy o Twojej ścianie";
const INTRO_DEFAULT =
  "Zostaw wymiary, lokalizację i pomysł — w 24h dostaniesz wstępną wycenę i termin realizacji.";

const PROJECT_OPTIONS = [
  "Mural wielkoformatowy",
  "Szyld / logotyp",
  "Wnętrze / dekoracja",
  "Projekt specjalny",
];

/* ====================================================================
   REUSABLE FIELDS / FORM
   ==================================================================== */
type Field =
  | { kind: "text"; name: string; label: string; placeholder?: string; type?: string }
  | { kind: "select"; name: string; label: string; options: string[] }
  | { kind: "textarea"; name: string; label: string; placeholder?: string };

const STANDARD_FIELDS: Field[] = [
  { kind: "text",     name: "name",   label: "Imię i nazwisko", placeholder: "Jan Kowalski" },
  { kind: "text",     name: "email",  label: "E-mail",          placeholder: "jan@firma.pl", type: "email" },
  { kind: "text",     name: "phone",  label: "Telefon",         placeholder: "+48 …",        type: "tel" },
  { kind: "text",     name: "city",   label: "Miasto / lokalizacja", placeholder: "Warszawa, ul. …" },
  { kind: "select",   name: "type",   label: "Rodzaj projektu", options: PROJECT_OPTIONS },
  { kind: "text",     name: "size",   label: "Wymiary (m²)",    placeholder: "ok. 60 m²" },
  { kind: "text",     name: "when",   label: "Planowany termin", placeholder: "wiosna 2026" },
  { kind: "textarea", name: "msg",    label: "Opis pomysłu",    placeholder: "Kilka słów o wizji, referencji, charakterze ściany…" },
];

function RenderField({ f }: { f: Field }) {
  if (f.kind === "select") {
    return (
      <div className={styles.field}>
        <label className={styles.label} htmlFor={f.name}>{f.label}</label>
        <select id={f.name} name={f.name} className={styles.select} defaultValue="">
          <option value="" disabled>— wybierz —</option>
          {f.options.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
    );
  }
  if (f.kind === "textarea") {
    return (
      <div className={styles.field}>
        <label className={styles.label} htmlFor={f.name}>{f.label}</label>
        <textarea id={f.name} name={f.name} className={styles.textarea} placeholder={f.placeholder} />
      </div>
    );
  }
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={f.name}>{f.label}</label>
      <input id={f.name} name={f.name} type={f.type ?? "text"} className={styles.input} placeholder={f.placeholder} />
    </div>
  );
}

type FormLayout = "full" | "compact" | "minimal";
function Form({ layout = "compact", submitLabel = "Wyślij zapytanie →" }: { layout?: FormLayout; submitLabel?: string }) {
  const byName = Object.fromEntries(STANDARD_FIELDS.map((f) => [f.name, f]));
  if (layout === "minimal") {
    return (
      <form className={styles.form}>
        <RenderField f={byName.name} />
        <RenderField f={byName.email} />
        <RenderField f={byName.msg} />
        <button type="button" className={styles.submit}>{submitLabel}</button>
      </form>
    );
  }
  if (layout === "full") {
    return (
      <form className={styles.form}>
        <div className={styles.row2}>
          <RenderField f={byName.name} />
          <RenderField f={byName.email} />
        </div>
        <div className={styles.row2}>
          <RenderField f={byName.phone} />
          <RenderField f={byName.city} />
        </div>
        <div className={styles.row2}>
          <RenderField f={byName.type} />
          <RenderField f={byName.size} />
        </div>
        <RenderField f={byName.when} />
        <RenderField f={byName.msg} />
        <button type="button" className={styles.submit}>{submitLabel}</button>
      </form>
    );
  }
  return (
    <form className={styles.form}>
      <div className={styles.row2}>
        <RenderField f={byName.name} />
        <RenderField f={byName.email} />
      </div>
      <div className={styles.row2}>
        <RenderField f={byName.city} />
        <RenderField f={byName.type} />
      </div>
      <RenderField f={byName.msg} />
      <button type="button" className={styles.submit}>{submitLabel}</button>
    </form>
  );
}

/* ====================================================================
   TYPOGRAPHIC ATOMS
   ==================================================================== */
function Heading({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={`${styles.heading} ${className ?? ""}`}>{children}</h2>;
}
function Kicker({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <p className={styles.kicker} style={style}>{children}</p>;
}
function Intro({ children }: { children: ReactNode }) {
  return <p className={styles.intro}>{children}</p>;
}
function Badge({ children }: { children: ReactNode }) {
  return <div className={styles.badge}>{children}</div>;
}
function Divider({ kicker, title, desc }: { kicker: string; title: string; desc: string }) {
  return (
    <div className={styles.divider}>
      <p className={styles.dividerKicker}>{kicker}</p>
      <h2 className={styles.dividerTitle}>{title}</h2>
      <p className={styles.dividerDesc}>{desc}</p>
    </div>
  );
}

/* ====================================================================
   CONTENT BLOCKS — contact section building blocks
   ==================================================================== */
function ContactInfo({ className }: { className?: string }) {
  return (
    <div className={`${styles.infoBlock} ${className ?? ""}`}>
      <div className={styles.infoItem}>
        <span className={styles.ilabel}>Telefon</span>
        <span className={styles.ivalue}>+48 600 000 000</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.ilabel}>E-mail</span>
        <span className={styles.ivalue}>kontakt@aeromat.pl</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.ilabel}>Pracownia</span>
        <span className={styles.ivalue}>Warszawa · cała Polska</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.ilabel}>Odpowiedź</span>
        <span className={styles.ivalue}>w 24 h, pon–pt</span>
      </div>
    </div>
  );
}

function Hours() {
  return (
    <div className={styles.hours}>
      <div className={styles.hoursRow}><span className={styles.hoursDay}>Pon–Pt</span><span>09:00 – 18:00</span></div>
      <div className={styles.hoursRow}><span className={styles.hoursDay}>Sobota</span><span>10:00 – 14:00</span></div>
      <div className={styles.hoursRow}><span className={styles.hoursDay}>Niedz.</span><span>wg umowy</span></div>
    </div>
  );
}

function Social() {
  return (
    <div className={styles.social}>
      <a href="#" className={styles.socialLink}>Instagram</a>
      <a href="#" className={styles.socialLink}>Facebook</a>
      <a href="#" className={styles.socialLink}>YouTube</a>
      <a href="#" className={styles.socialLink}>TikTok</a>
    </div>
  );
}

function QuickCTAs() {
  return (
    <div className={styles.quickCTAs}>
      <a href="tel:+48600000000" className={styles.quickCTA}>
        <span className={styles.qctaIcon} aria-hidden>☎</span>
        <span className={styles.qctaText}>
          <span className={styles.qctaLabel}>Telefon</span>
          <span className={styles.qctaValue}>+48 600 000 000</span>
        </span>
      </a>
      <a href="mailto:kontakt@aeromat.pl" className={styles.quickCTA}>
        <span className={styles.qctaIcon} aria-hidden>✉</span>
        <span className={styles.qctaText}>
          <span className={styles.qctaLabel}>E-mail</span>
          <span className={styles.qctaValue}>kontakt@aeromat.pl</span>
        </span>
      </a>
      <a href="#" className={styles.quickCTA}>
        <span className={styles.qctaIcon} aria-hidden>◎</span>
        <span className={styles.qctaText}>
          <span className={styles.qctaLabel}>WhatsApp</span>
          <span className={styles.qctaValue}>Napisz na +48 600</span>
        </span>
      </a>
    </div>
  );
}

function Stats() {
  return (
    <div className={styles.stats}>
      <div className={styles.statItem}>
        <span className={styles.statNum}>25+</span>
        <span className={styles.statLabel}>lat doświadczenia</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statNum}>500+</span>
        <span className={styles.statLabel}>realizacji</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statNum}>24 h</span>
        <span className={styles.statLabel}>czas odpowiedzi</span>
      </div>
    </div>
  );
}

function MapHint({ light = false }: { light?: boolean }) {
  return (
    <div className={`${styles.mapBox} ${light ? styles.mapBoxLight : ""}`}>
      <span className={styles.mapArea}>Warszawa</span>
      <span className={styles.mapPin} aria-hidden />
      <span className={styles.mapLabel}>📍 Pracownia AeroMat</span>
    </div>
  );
}

function FAQ() {
  return (
    <div className={styles.faq}>
      <div className={styles.faqItem}>
        <p className={styles.faqQ}>Czy dojeżdżam w całej Polsce?</p>
        <p className={styles.faqA}>Tak — bazuję w Warszawie, ale 70% realizacji jest w terenie.</p>
      </div>
      <div className={styles.faqItem}>
        <p className={styles.faqQ}>Ile trwa wycena?</p>
        <p className={styles.faqA}>Odpowiem w 24 h, pełną ofertę ze wstępną wizualizacją w 3 dni.</p>
      </div>
      <div className={styles.faqItem}>
        <p className={styles.faqQ}>Czy film z realizacji jest w cenie?</p>
        <p className={styles.faqA}>Tak — każdy mural dostaje profesjonalny film z drona w standardzie.</p>
      </div>
    </div>
  );
}

/* ====================================================================
   PAGE — 25 sekcji kontakt
   ==================================================================== */
export default function KontaktFormMockupPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.visuallyHidden}>Kontakt — 25 wariantów jednostronicowej sekcji</h1>

      <div style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 50 }}>
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
        kicker="Typografia #2"
        title="Bebas Neue + Space Grotesk · 9 wariantów"
        desc="Condensed display + geometric grotesk. Plakatowy charakter, współczesna marka."
      />

      {/* V1 — Centered + QuickCTAs + Form + ContactInfo */}
      <section className={`${styles.section} ${styles.v1} ${styles.layoutCenter}`}>
        <div style={{ maxWidth: 720, width: "100%" }}>
          <Kicker>Zacznijmy</Kicker>
          <Heading>{HEADLINE_DEFAULT}</Heading>
          <Intro>{INTRO_DEFAULT}</Intro>
          <div style={{ marginBottom: "2rem" }}><QuickCTAs /></div>
          <Form layout="compact" />
          <div style={{ marginTop: "3rem" }}><ContactInfo /></div>
        </div>
        <Badge>V1 · #2 · Centered + QuickCTAs</Badge>
      </section>

      {/* V2 — Split: left info/hours, right form */}
      <section className={`${styles.section} ${styles.v2}`}>
        <div className={styles.layoutSplit}>
          <div className={styles.leftCol}>
            <Kicker>Kontakt</Kicker>
            <Heading>Pogadajmy o Twojej ścianie.</Heading>
            <Intro>{INTRO_DEFAULT}</Intro>
            <div style={{ marginBottom: "2rem" }}><ContactInfo /></div>
            <Hours />
          </div>
          <Form layout="full" />
        </div>
        <Badge>V2 · #2 · Split Info + Hours / Form</Badge>
      </section>

      {/* V3 — Brutalist grid: form + info grid below */}
      <section className={`${styles.section} ${styles.v3}`}>
        <div style={{ maxWidth: 820, width: "100%" }}>
          <Heading>Napisz. Bez zbędnych formułek.</Heading>
          <Intro>{INTRO_DEFAULT}</Intro>
          <Form layout="compact" submitLabel="Wysyłam →" />
          <div style={{ marginTop: "2rem", padding: "1.5rem", border: "1px solid #222" }}>
            <ContactInfo />
          </div>
        </div>
        <Badge>V3 · #2 · Brutalist + Info Card</Badge>
      </section>

      {/* V4 — Newspaper: 3-col (info, hours, form) + stats */}
      <section className={`${styles.section} ${styles.v4} ${styles.layoutCenter}`}>
        <div style={{ maxWidth: 1000, width: "100%" }}>
          <Kicker>AeroMat · Bono 1998–Dziś</Kicker>
          <Heading>„Każda ściana ma drugi życiorys.”</Heading>
          <Intro>{INTRO_DEFAULT}</Intro>
          <div className={styles.cols3} style={{ textAlign: "left", marginTop: "2rem" }}>
            <div className={styles.subcard} style={{ ["--subcard-bg" as string]: "transparent", ["--subcard-border" as string]: "1px solid rgba(25,20,18,0.15)" }}>
              <p className={styles.subcardTitle} style={{ color: "#c84d00" }}>Kontakt</p>
              <ContactInfo />
            </div>
            <div className={styles.subcard} style={{ ["--subcard-bg" as string]: "transparent", ["--subcard-border" as string]: "1px solid rgba(25,20,18,0.15)" }}>
              <p className={styles.subcardTitle} style={{ color: "#c84d00" }}>Godziny</p>
              <Hours />
            </div>
            <div className={styles.subcard} style={{ ["--subcard-bg" as string]: "transparent", ["--subcard-border" as string]: "1px solid rgba(25,20,18,0.15)" }}>
              <p className={styles.subcardTitle} style={{ color: "#c84d00" }}>Napisz</p>
              <Form layout="minimal" submitLabel="Wyślij →" />
            </div>
          </div>
          <div style={{ marginTop: "2.5rem" }}>
            <Stats />
          </div>
        </div>
        <Badge>V4 · #2 · Newspaper 3-col + Stats</Badge>
      </section>

      {/* V5 — Floating labels + social */}
      <section className={`${styles.section} ${styles.v5} ${styles.layoutCenter}`}>
        <div style={{ maxWidth: 540, width: "100%" }}>
          <Heading>Zamów wycenę</Heading>
          <Intro>24 h na odpowiedź. Bez zobowiązań.</Intro>
          <Form layout="compact" submitLabel="Wyślij →" />
          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}><Social /></div>
        </div>
        <Badge>V5 · #2 · Floating Labels + Social</Badge>
      </section>

      {/* V6 — Neon Border Card with Stats + Social */}
      <section className={`${styles.section} ${styles.v6} ${styles.layoutCenter}`}>
        <div className={styles.layoutCard}>
          <Kicker>Wycena · Bezpłatnie</Kicker>
          <Heading>Porozmawiajmy</Heading>
          <Intro>{INTRO_DEFAULT}</Intro>
          <div style={{ margin: "1.5rem 0" }}><Stats /></div>
          <Form layout="compact" />
          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}><Social /></div>
        </div>
        <Badge>V6 · #2 · Neon Card + Stats + Social</Badge>
      </section>

      {/* V7 — Minimal Mono: 2-col info+hours / form */}
      <section className={`${styles.section} ${styles.v7}`}>
        <div style={{ maxWidth: 1000, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <Heading>Kontakt</Heading>
            <Intro>Mural. Szyld. Wnętrze. Napisz, co Cię interesuje.</Intro>
          </div>
          <div className={styles.cols2}>
            <div>
              <p className={styles.subcardTitle} style={{ color: "#000" }}>Dane</p>
              <ContactInfo />
              <div style={{ marginTop: "2rem" }}>
                <p className={styles.subcardTitle} style={{ color: "#000" }}>Godziny</p>
                <Hours />
              </div>
            </div>
            <Form layout="compact" />
          </div>
        </div>
        <Badge>V7 · #2 · Mono Split (info+hours / form)</Badge>
      </section>

      {/* V8 — Orange info col / dark form col */}
      <section className={`${styles.section} ${styles.v8}`}>
        <div className={styles.duo}>
          <aside className={styles.infoCol}>
            <div>
              <Kicker style={{ color: "rgba(0,0,0,0.65)" }}>AeroMat</Kicker>
              <Heading>Odezwij się bezpośrednio.</Heading>
            </div>
            <div>
              <ContactInfo />
              <div style={{ marginTop: "2rem" }}><Hours /></div>
            </div>
          </aside>
          <div className={styles.formCol}>
            <Form layout="full" />
          </div>
        </div>
        <Badge>V8 · #2 · Orange Info + Hours / Dark Form</Badge>
      </section>

      {/* V9 — Orange Band header + 2-col form/info */}
      <section className={`${styles.section} ${styles.v9}`}>
        <div className={styles.container}>
          <div className={styles.band}>
            <p className={styles.kicker} style={{ color: "rgba(0,0,0,0.65)" }}>Kontakt</p>
            <Heading>Porozmawiajmy o Twojej ścianie</Heading>
          </div>
          <div className={styles.formWrap}>
            <div className={styles.cols14}>
              <div>
                <p className={styles.subcardTitle} style={{ color: "#c84d00" }}>Dane</p>
                <ContactInfo />
                <div style={{ marginTop: "1.5rem" }}><Hours /></div>
              </div>
              <Form layout="compact" />
            </div>
          </div>
        </div>
        <Badge>V9 · #2 · Orange Band + 2-col (info+hours / form)</Badge>
      </section>

      <Divider
        kicker="Typografia #4"
        title="Anton + Space Grotesk 300 · 8 wariantów"
        desc="Agresywny, wysoki headline + przewiewne, cienkie pola. Industrialny sznyt."
      />

      {/* V10 — Industrial: Heading + Stats + Form + Social */}
      <section className={`${styles.section} ${styles.v10} ${styles.setAnton} ${styles.layoutCenter}`}>
        <div style={{ maxWidth: 700, width: "100%" }}>
          <Kicker>Wycena</Kicker>
          <Heading>{HEADLINE_DEFAULT}</Heading>
          <Intro>{INTRO_DEFAULT}</Intro>
          <div style={{ margin: "1.5rem 0 2.5rem" }}><Stats /></div>
          <Form layout="compact" />
          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}><Social /></div>
        </div>
        <Badge>V10 · #4 · Industrial + Stats + Social</Badge>
      </section>

      {/* V11 — Vertical Heading + form + info */}
      <section className={`${styles.v11} ${styles.setAnton}`}>
        <div className={styles.vertical}>
          Kontakt · <span>AeroMat</span>
        </div>
        <div className={styles.formCol}>
          <Kicker>Zostaw znak</Kicker>
          <Heading>Porozmawiajmy.</Heading>
          <Intro>{INTRO_DEFAULT}</Intro>
          <Form layout="compact" />
          <div style={{ marginTop: "2rem" }}><ContactInfo /></div>
        </div>
        <Badge>V11 · #4 · Vertical + Form + Info</Badge>
      </section>

      {/* V12 — Airy Editorial Light: 2-col (info+hours / form) + mapLight */}
      <section className={`${styles.v12} ${styles.setAnton} ${styles.section}`}>
        <div style={{ maxWidth: 1100, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <Kicker>Aeromat · Est. 1998</Kicker>
            <Heading>Gotowy na swoją ścianę?</Heading>
            <Intro>{INTRO_DEFAULT}</Intro>
          </div>
          <div className={styles.cols14}>
            <div>
              <ContactInfo />
              <div style={{ marginTop: "2rem" }}><Hours /></div>
              <div style={{ marginTop: "2rem" }}><MapHint light /></div>
            </div>
            <Form layout="compact" />
          </div>
        </div>
        <Badge>V12 · #4 · Airy Light + Map</Badge>
      </section>

      {/* V13 — Dark Orange Border Card with QuickCTAs + Form */}
      <section className={`${styles.section} ${styles.v13} ${styles.setAnton} ${styles.layoutCenter}`}>
        <div className={styles.layoutCard}>
          <Kicker>Zapytanie</Kicker>
          <Heading>Porozmawiajmy o projekcie</Heading>
          <Intro>{INTRO_DEFAULT}</Intro>
          <div style={{ margin: "1.5rem 0" }}><QuickCTAs /></div>
          <Form layout="compact" />
        </div>
        <Badge>V13 · #4 · Orange Border Card + QuickCTAs</Badge>
      </section>

      {/* V14 — Stacked Rows: heading + info rows + form rows + hours + social */}
      <section className={`${styles.v14} ${styles.setAnton}`}>
        <div className={styles.headerRow}>
          <Kicker>Kontakt</Kicker>
          <Heading>Każde pole = jedna decyzja.</Heading>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Telefon</span>
          <a href="tel:+48600000000" className={styles.input} style={{ color: "#fff", textDecoration: "none", padding: 0 }}>+48 600 000 000</a>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>E-mail</span>
          <a href="mailto:kontakt@aeromat.pl" className={styles.input} style={{ color: "#fff", textDecoration: "none", padding: 0 }}>kontakt@aeromat.pl</a>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Pracownia</span>
          <input type="text" className={styles.input} defaultValue="Warszawa · cała Polska" readOnly />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Imię</span>
          <input type="text" className={styles.input} placeholder="Jan Kowalski" />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Projekt</span>
          <select className={styles.select} defaultValue="">
            <option value="" disabled>— wybierz —</option>
            {PROJECT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Wiadomość</span>
          <textarea className={styles.textarea} placeholder="Opisz pomysł…" />
        </div>
        <div className={styles.submitRow}>
          <button type="button" className={styles.submit}>Wyślij →</button>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Social</span>
          <div style={{ padding: "0.4rem 0" }}><Social /></div>
        </div>
        <Badge>V14 · #4 · Stacked Rows (info + form + social)</Badge>
      </section>

      {/* V15 — Modal Center: Heading + ContactInfo + Form + Social */}
      <section className={`${styles.section} ${styles.v15} ${styles.setAnton}`}>
        <div className={styles.modal}>
          <Kicker>Darmowa wycena</Kicker>
          <Heading>{HEADLINE_DEFAULT}</Heading>
          <Intro>{INTRO_DEFAULT}</Intro>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", margin: "1.25rem 0" }}>
            <div className={styles.infoItem}>
              <span className={styles.ilabel}>Telefon</span>
              <span className={styles.ivalue}>+48 600 000 000</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.ilabel}>E-mail</span>
              <span className={styles.ivalue}>kontakt@aeromat.pl</span>
            </div>
          </div>
          <Form layout="compact" submitLabel="Wyślij zapytanie" />
          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center" }}><Social /></div>
        </div>
        <Badge>V15 · #4 · Modal + Mini-Info + Social</Badge>
      </section>

      {/* V16 — Banner top + Form | ContactInfo + Map */}
      <section className={`${styles.v16} ${styles.setAnton}`}>
        <div className={styles.banner}>
          <Heading>Kontakt. <span>Bez pośredników.</span></Heading>
        </div>
        <div className={styles.formWrap} style={{ maxWidth: 1100 }}>
          <div className={styles.cols14}>
            <Form layout="full" />
            <div>
              <p className={styles.subcardTitle}>Dane</p>
              <ContactInfo />
              <div style={{ marginTop: "1.5rem" }}><MapHint /></div>
            </div>
          </div>
        </div>
        <Badge>V16 · #4 · Banner + Form + Map</Badge>
      </section>

      {/* V17 — Sidebar (testimonial + info) + Form + FAQ */}
      <section className={`${styles.v17} ${styles.setAnton}`}>
        <aside className={styles.sidebar}>
          <div>
            <Kicker>AeroMat · 25+ lat</Kicker>
            <Heading>Zacznijmy od Twojej ściany.</Heading>
            <Intro>{INTRO_DEFAULT}</Intro>
          </div>
          <blockquote className={styles.quote}>
            „Mural AeroMatu przyciągnął do nas media i tysiące przechodniów. Zwrócił się w ciągu miesiąca.”
            <cite>— Adrian, Cafe Stamp</cite>
          </blockquote>
          <div style={{ marginTop: "2rem" }}><ContactInfo /></div>
        </aside>
        <div className={styles.formArea}>
          <div style={{ display: "grid", gap: "2.5rem", width: "100%", maxWidth: 560 }}>
            <Form layout="compact" />
            <div>
              <p className={styles.subcardTitle}>Najczęściej pytacie</p>
              <FAQ />
            </div>
          </div>
        </div>
        <Badge>V17 · #4 · Sidebar (quote+info) + Form + FAQ</Badge>
      </section>

      <Divider
        kicker="Typografia #5"
        title="Bebas Neue + Inter · 8 wariantów"
        desc="Klasyczny billboard + neutralny paragraph. Vintage/editorial sznyt z pocztówkowymi akcentami."
      />

      {/* V18 — Billboard + Grid QuickCTAs + Form + Hours */}
      <section className={`${styles.section} ${styles.v18} ${styles.setBebasInter}`}>
        <div className={styles.container}>
          <div className={styles.billboard}>
            <Heading>{HEADLINE_DEFAULT}</Heading>
          </div>
          <div className={styles.formWrap}>
            <Intro>{INTRO_DEFAULT}</Intro>
            <div style={{ margin: "1.5rem 0" }}><QuickCTAs /></div>
            <Form layout="compact" />
            <div style={{ marginTop: "2rem", borderTop: "1px solid rgba(25,20,18,0.1)", paddingTop: "1.5rem" }}>
              <p className={styles.subcardTitle} style={{ color: "#c84d00" }}>Godziny</p>
              <Hours />
            </div>
          </div>
        </div>
        <Badge>V18 · #5 · Billboard + QuickCTAs + Hours</Badge>
      </section>

      {/* V19 — Postcard with address block + stamp */}
      <section className={`${styles.section} ${styles.v19} ${styles.setBebasInter}`}>
        <div className={styles.postcard}>
          <Kicker>Pocztówka z pracowni</Kicker>
          <Heading>Drogi przyszły kliencie,</Heading>
          <Intro>{INTRO_DEFAULT}</Intro>
          <div className={styles.cols2} style={{ marginTop: "1.5rem" }}>
            <div>
              <p className={styles.subcardTitle} style={{ color: "#c84d00" }}>Adresuj do</p>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: "0.95rem", lineHeight: 1.7, color: "#2d2014" }}>
                AeroMat — Mateusz Bono<br />
                Pracownia muralu<br />
                Warszawa · cała Polska<br />
                +48 600 000 000<br />
                kontakt@aeromat.pl
              </div>
            </div>
            <Form layout="minimal" submitLabel="Wyślij pocztówkę →" />
          </div>
        </div>
        <Badge>V19 · #5 · Postcard + Address + Form</Badge>
      </section>

      {/* V20 — Glass Card on Hero: QuickCTAs + Form + Social */}
      <section className={`${styles.section} ${styles.v20} ${styles.setBebasInter}`}>
        <div className={styles.glass}>
          <Kicker>Kontakt</Kicker>
          <Heading>Porozmawiajmy</Heading>
          <div style={{ margin: "1.25rem 0" }}><QuickCTAs /></div>
          <Form layout="minimal" submitLabel="Wyślij →" />
          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center" }}><Social /></div>
        </div>
        <Badge>V20 · #5 · Glass + QuickCTAs + Form + Social</Badge>
      </section>

      {/* V21 — Magazine: pullquote + 2-col (info+hours / form) + stats */}
      <section className={`${styles.v21} ${styles.setBebasInter}`}>
        <div style={{ maxWidth: 1100, width: "100%" }}>
          <p className={styles.pullquote}>„Ściana to <span>dziennik miasta</span>.”</p>
          <p className={styles.leadIn}>
            Od 25 lat tłumaczę marki na język muralu. Zanim przyjadę, podziel się pomysłem — sprawdzę,
            czy wizja się domknie w budżecie i terminie. Odpowiadam w 24 h, bez szablonów.
          </p>
          <div className={styles.cols14} style={{ marginTop: "2.5rem" }}>
            <div>
              <p className={styles.subcardTitle} style={{ color: "#c84d00" }}>Dane</p>
              <ContactInfo />
              <div style={{ marginTop: "1.5rem" }}>
                <p className={styles.subcardTitle} style={{ color: "#c84d00" }}>Godziny</p>
                <Hours />
              </div>
            </div>
            <Form layout="compact" />
          </div>
          <div style={{ marginTop: "2.5rem" }}>
            <Stats />
          </div>
        </div>
        <Badge>V21 · #5 · Magazine + Info/Hours + Form + Stats</Badge>
      </section>

      {/* V22 — Spotlight Dark: QuickCTAs + Form + Social */}
      <section className={`${styles.section} ${styles.v22} ${styles.setBebasInter}`}>
        <div className={styles.container}>
          <Kicker>Zacznij</Kicker>
          <Heading>{HEADLINE_DEFAULT}</Heading>
          <div style={{ margin: "1.5rem 0" }}><QuickCTAs /></div>
          <Form layout="compact" submitLabel="Wyślij zapytanie" />
          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}><Social /></div>
        </div>
        <Badge>V22 · #5 · Spotlight + QuickCTAs + Form + Social</Badge>
      </section>

      {/* V23 — Horizontal: header + info row + form row + map row */}
      <section className={`${styles.v23} ${styles.setBebasInter}`}>
        <div className={styles.headerRow}>
          <Kicker>Kontakt — 60 sek.</Kicker>
          <Heading>Wypełnij w jednej linii.</Heading>
        </div>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <span className={styles.label}>Imię</span>
            <input className={styles.input} placeholder="Jan Kowalski" />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>E-mail</span>
            <input className={styles.input} type="email" placeholder="jan@firma.pl" />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Miasto</span>
            <input className={styles.input} placeholder="Warszawa" />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Rodzaj</span>
            <select className={styles.select} defaultValue="">
              <option value="" disabled>—</option>
              {PROJECT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.messageWrap}>
          <div className={styles.field}>
            <span className={styles.label}>Krótki opis</span>
            <textarea className={styles.textarea} placeholder="Pomysł, referencje, lokalizacja…" />
          </div>
          <button type="button" className={styles.submit}>Wyślij →</button>
        </div>
        <div style={{ padding: "2rem clamp(2rem, 5vw, 4rem)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div>
            <p className={styles.subcardTitle}>Dane</p>
            <ContactInfo />
          </div>
          <MapHint />
        </div>
        <Badge>V23 · #5 · Horizontal Row + Info + Map</Badge>
      </section>

      {/* V24 — Split: image+heading+stats / form+info */}
      <section className={`${styles.v24} ${styles.setBebasInter}`}>
        <div className={styles.imageCol}>
          <Kicker>Portfolio · 500+ realizacji</Kicker>
          <Heading>Każda ściana ma swoją historię.</Heading>
          <div style={{ marginTop: "2rem" }}><Stats /></div>
        </div>
        <div className={styles.formCol}>
          <div style={{ maxWidth: 460, width: "100%" }}>
            <Intro>{INTRO_DEFAULT}</Intro>
            <div style={{ marginBottom: "2rem" }}><ContactInfo /></div>
            <Form layout="compact" />
          </div>
        </div>
        <Badge>V24 · #5 · Split Image+Stats / Info+Form</Badge>
      </section>

      {/* V25 — Retro Stamp: address + form + mapLight */}
      <section className={`${styles.section} ${styles.v25} ${styles.setBebasInter}`}>
        <div className={styles.sheet}>
          <div className={styles.stamp}>
            EST. 1998
            <span className={styles.sub}>AEROMAT</span>
          </div>
          <Kicker>Zapytanie</Kicker>
          <Heading>{HEADLINE_DEFAULT}</Heading>
          <Intro>{INTRO_DEFAULT}</Intro>
          <div className={styles.cols14} style={{ marginTop: "1.5rem" }}>
            <div>
              <p className={styles.subcardTitle} style={{ color: "#c84d00" }}>Adres</p>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: "0.95rem", lineHeight: 1.7, color: "#2a1f10" }}>
                AeroMat — Mateusz Bono<br />
                Warszawa · cała Polska<br />
                +48 600 000 000<br />
                kontakt@aeromat.pl
              </div>
              <div style={{ marginTop: "1.5rem" }}>
                <p className={styles.subcardTitle} style={{ color: "#c84d00" }}>Godziny</p>
                <Hours />
              </div>
            </div>
            <div>
              <Form layout="compact" submitLabel="Wyślij →" />
              <div style={{ marginTop: "1.5rem" }}><MapHint light /></div>
            </div>
          </div>
        </div>
        <Badge>V25 · #5 · Retro Sheet + Address + Form + Map</Badge>
      </section>
    </main>
  );
}
