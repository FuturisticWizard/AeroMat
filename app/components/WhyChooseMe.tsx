"use client";

import { useEffect, useRef } from "react";
import { Route, Users, ShieldCheck, Video } from "lucide-react";

const features = [
  {
    number: "01",
    icon: Route,
    title: "Od pomysłu do realizacji",
    description:
      "Kompleksowe podejście do każdego zlecenia: od pomysłu, poprzez projekt i doradztwo technologiczne, aż do finalizacji prac.",
  },
  {
    number: "02",
    icon: Users,
    title: "Indywidualne podejście",
    description:
      "Każdy projekt dopasowuję do potrzeb, oczekiwań i budżetu klienta. Nie ma dwóch takich samych realizacji.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Trwałość na lata",
    description:
      "W zakładce 'Portfolio' znajdziesz prace sprzed kilkunastu lat, które świetnie się prezentują mimo działania czynników atmosferycznych.",
  },
  {
    number: "04",
    icon: Video,
    title: "Film z procesu",
    description:
      "Do każdego zlecenia mogę zrealizować film z procesu malowania, który wykorzystasz w swoich mediach społecznościowych.",
  },
];

export default function WhyChooseMe() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll<HTMLElement>("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 md:py-24 lg:py-32"
      aria-labelledby="why-choose-heading"
    >
      <h2
        id="why-choose-heading"
        className="text-5xl md:text-7xl font-[family-name:var(--font-bebas)] tracking-tight text-accent mb-2"
      >
        Co mnie wyróżnia?
      </h2>
      <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mb-12">
        Ponad 25 lat doświadczenia przekutych w podejście, któremu zaufały
        dziesiątki firm w całej Polsce.
      </p>

      <div
        ref={cardsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
      >
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.number}
              data-reveal
              className="relative bg-white/5 border border-white/10 rounded-2xl p-6 transition-colors duration-300 hover:border-accent/30 hover:bg-white/[0.07]"
              style={{
                opacity: 0,
                transform: "translateY(24px)",
                transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s, background-color 0.3s, border-color 0.3s`,
              }}
            >
              <span className="absolute top-4 right-5 text-5xl font-[family-name:var(--font-bebas)] text-accent/15 select-none leading-none">
                {feature.number}
              </span>

              <Icon
                className="text-accent mb-4"
                size={32}
                strokeWidth={1.5}
                aria-hidden="true"
              />

              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
