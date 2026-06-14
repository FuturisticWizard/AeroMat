"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import { MessageCircle, X } from "lucide-react";
import gsap from "gsap";

/* Panel (wraz z baza FAQ i logika) laduje sie dopiero po pierwszym kliknieciu
   w przycisk — zero wplywu na poczatkowe ladowanie strony. */
const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });

const useIsoEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  /* Wejscie "spadajacej monety" - kazda wlasciwosc to JEDEN plynny ruch
     (zero recznych laczen = zero szarpania):
       - pion: gladki spadek zza gornej krawedzi z miekkim odbiciem (bounce.out),
         konczy sie ~1 s;
       - obrot: jeden dlugi, gladko hamujacy ruch wokol osi pionowej (power2.out)
         trwajacy ~3,4 s. Trwa dluzej niz spadek, wiec po dotknieciu ziemi moneta
         dalej sie kreci - coraz wolniej, az energia wygasa.
     Po wyladowaniu czyszczymy transform, by hover:scale-105 dalej dzialal. */
  useIsoEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* WAZNE: przycisk ma w klasach Tailwinda `transition` (dla hover), czyli
       CSS-owe przejscie na `transform`. To walczy z GSAP (przegladarka dogania
       kazda klatke z opoznieniem) i powoduje szarpniecie na koncu. Na czas
       animacji wylaczamy CSS-owe przejscie, a po wyladowaniu je przywracamy. */
    el.style.transition = "none";

    gsap.set(el, {
      y: -(window.innerHeight + 140),
      rotationY: 2160, // 6 obrotow "zapasu" energii
      transformPerspective: 800,
      transformOrigin: "center center",
    });

    const tl = gsap.timeline({
      delay: 0.3,
      onComplete: () => {
        // Czyscimy inline-transform (by hover:scale-105 z klasy mogl dzialac)
        // i przywracamy CSS-owe przejscie. Stan koncowy == stan spoczynkowy,
        // wiec czyszczenie jest niewidoczne (zero przeskoku).
        gsap.set(el, { clearProps: "all" });
        el.style.transition = "";
      },
    });

    // Pion: jeden plynny spadek z miekkim odbiciem o podloze
    tl.to(el, { y: 0, duration: 1.0, ease: "bounce.out" }, 0);

    // Obrot: jeden plynny ruch, ktory po wyladowaniu dalej sie kreci
    // coraz wolniej, az do wygasniecia energii (dlugi ogon power2.out)
    tl.to(el, { rotationY: 0, duration: 3.4, ease: "power2.out" }, 0);

    return () => {
      tl.kill();
    };
  }, []);

  const toggle = () => {
    setOpen((o) => !o);
    setEverOpened(true);
  };

  return (
    <>
      {everOpened && open && <ChatPanel onClose={() => setOpen(false)} />}
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label={open ? "Zamknij czat" : "Otwórz czat z pytaniami"}
        aria-expanded={open}
        className="fixed bottom-5 right-4 z-[96] flex h-14 w-14 items-center justify-center rounded-full bg-[#ff7302] text-white shadow-lg transition hover:scale-105 hover:bg-[#e76700] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
};

export default ChatWidget;
