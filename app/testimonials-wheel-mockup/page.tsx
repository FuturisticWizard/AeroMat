"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, useMotionValue, animate } from "framer-motion";
import { ChevronUp, ChevronDown, Star } from "lucide-react";

// ── Demo data — 3 real + 5 fake ──────────────────────────────────
const testimonials = [
  { id: 1, name: "Paweł Suszek", role: "Członek Zarządu", company: "Ekopak Sp. z o.o.", image: "/logo/clients_logos/1P.png", content: "Projekt został wykonany kompleksowo — od koncepcji graficznej, przez przygotowanie ściany, aż po finalne wykonanie muralu. Wykonawca wykazał się profesjonalizmem, elastycznością oraz bardzo dobrym zrozumieniem tematyki ekologicznej.", rating: 5, workImage: "/Portfolio/murale/7B.webp", workTitle: "Mural ekologiczny dla Ekopak" },
  { id: 2, name: "Teresa Stępniak-Romanek", role: "Kierownik Strategii", company: "LPEC S.A.", image: "/logo/clients_logos/2P.png", content: "Wszystkie prace zostały wykonane zgodnie z ustaleniami, z należytą starannością, terminowo oraz na wysokim poziomie estetycznym i technicznym.", rating: 5, workImage: "/Portfolio/murale/10.webp", workTitle: "Murale dla LPEC w Lublinie" },
  { id: 3, name: "Paweł Rysak", role: "Prezes Zarządu", company: "SM Bieluch w Chełmie", image: "/logo/clients_logos/4P.png", content: "Firma Aeromat zrealizowała usługę w sposób w pełni profesjonalny, rzetelny i kompleksowy. Kolorystyka muralu jest intensywna i zgodna z projektem.", rating: 5, workImage: "/Portfolio/murale/13.webp", workTitle: "Mural promocyjny dla SM Bieluch" },
  { id: 4, name: "Anna Kowalska", role: "Dyrektor Marketingu", company: "Fikcyjna Firma A", image: "/logo/clients_logos/3P.png", content: "Świetna współpraca od początku do końca. Mural stał się wizytówką naszego biura — wszyscy pracownicy i klienci są pod wrażeniem.", rating: 5, workImage: "/Portfolio/murale/1.webp", workTitle: "Mural biurowy" },
  { id: 5, name: "Marek Nowak", role: "Właściciel", company: "Demo Company B", image: "/logo/clients_logos/5P.png", content: "Pełen profesjonalizm, terminowość i dbałość o każdy detal. Wykonanie przekroczyło moje oczekiwania.", rating: 5, workImage: "/Portfolio/murale/2.webp", workTitle: "Mural fasadowy" },
  { id: 6, name: "Katarzyna Wiśniewska", role: "Event Manager", company: "Events Plus Sp.", image: "/logo/clients_logos/6P.png", content: "Mural powstał w weekend — niewiarygodna szybkość bez kompromisu na jakości.", rating: 5, workImage: "/Portfolio/murale/3.webp", workTitle: "Mural eventowy" },
  { id: 7, name: "Tomasz Lewandowski", role: "CEO", company: "Tech Startup X", image: "/logo/clients_logos/7P.png", content: "Kreatywność i oryginalność na najwyższym poziomie. Polecam każdej firmie szukającej unikalnej identyfikacji wizualnej.", rating: 5, workImage: "/Portfolio/murale/4.webp", workTitle: "Mural branding" },
  { id: 8, name: "Magdalena Dąbrowska", role: "Architekt Wnętrz", company: "Studio D", image: "/logo/clients_logos/8P.png", content: "Współpraca z Aeromat to przyjemność. Artysta słucha i rozumie wizję klienta, a potem dostarcza coś jeszcze lepszego niż się spodziewaliśmy.", rating: 5, workImage: "/Portfolio/murale/5a.webp", workTitle: "Mural wnętrzarski" },
];

const N = testimonials.length;
const ITEM_H = 96; // px
const COPIES = 3;
const INITIAL_VIDX = N; // start in middle copy

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5 mt-1.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`} />
    ))}
  </div>
);

// ── Infinite wheel with single source of truth ────────────────────
// - virtualIdx is a monotone integer (grows/shrinks freely)
// - wheel Y = computeY(virtualIdx)
// - Clicking next/prev: virtualIdx ± 1 (direction is intentional, never reversed)
// - Clicking a slot: virtualIdx = slot.virtualIdx (move directly to that slot)
// - After animation settles, silent teleport to keep virtualIdx in [N, 2N)
// - activeRealIdx = ((virtualIdx % N) + N) % N — derived

function InfiniteWheel({
  virtualIdxRef,
  onTick,
}: {
  virtualIdxRef: React.MutableRefObject<number>;
  onTick: () => void; // called when virtualIdx changes
}) {
  const wheelY = useMotionValue(0);
  const containerH = useRef(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const animControl = useRef<ReturnType<typeof animate> | null>(null);

  const computeY = useCallback((vIdx: number) => {
    const center = containerH.current / 2;
    return center - ITEM_H / 2 - vIdx * ITEM_H;
  }, []);

  const setVirtual = useCallback(
    (newVIdx: number, skipAnim = false) => {
      virtualIdxRef.current = newVIdx;
      onTick();
      const target = computeY(newVIdx);
      animControl.current?.stop();
      if (skipAnim) {
        wheelY.set(target);
      } else {
        animControl.current = animate(wheelY, target, {
          duration: 0.55,
          ease: [0.16, 1, 0.3, 1],
          onComplete: () => {
            // Normalize after settle: if drifted outside middle copy, silent teleport.
            let vi = virtualIdxRef.current;
            while (vi < N) vi += N;
            while (vi >= 2 * N) vi -= N;
            if (vi !== virtualIdxRef.current) {
              virtualIdxRef.current = vi;
              wheelY.set(computeY(vi));
              onTick();
            }
          },
        });
      }
    },
    [computeY, wheelY, virtualIdxRef, onTick]
  );

  // Expose setVirtual via an attached API on the ref wrapper
  useEffect(() => {
    (window as unknown as { __wheelSetVirtual?: typeof setVirtual }).__wheelSetVirtual = setVirtual;
    return () => {
      delete (window as unknown as { __wheelSetVirtual?: unknown }).__wheelSetVirtual;
    };
  }, [setVirtual]);

  // Initial positioning
  useEffect(() => {
    const el = wheelRef.current?.parentElement;
    if (!el) return;
    containerH.current = el.clientHeight;
    wheelY.set(computeY(virtualIdxRef.current));
  }, [computeY, wheelY, virtualIdxRef]);

  const items = Array.from({ length: N * COPIES }, (_, i) => ({
    virtualIdx: i,
    realIdx: i % N,
    item: testimonials[i % N],
  }));

  const activeRealIdx = ((virtualIdxRef.current % N) + N) % N;

  return (
    <motion.div
      ref={wheelRef}
      style={{ y: wheelY }}
      className="flex flex-col absolute left-0 right-0 items-center"
    >
      {items.map((slot) => (
        <button
          key={slot.virtualIdx}
          onClick={() => setVirtual(slot.virtualIdx)}
          className={`w-20 h-20 my-2 rounded-full overflow-hidden bg-white p-2 transition-[transform,opacity,box-shadow] duration-300 ${
            slot.realIdx === activeRealIdx
              ? "scale-110 ring-2 ring-[#ff7302] opacity-100 shadow-lg shadow-[#ff7302]/30"
              : "opacity-55 hover:opacity-90"
          }`}
          aria-label={`Opinia ${slot.realIdx + 1}`}
        >
          <Image
            src={slot.item.image}
            alt=""
            width={80}
            height={80}
            className="w-full h-full object-contain"
          />
        </button>
      ))}
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function WheelMockup() {
  const virtualIdxRef = useRef(INITIAL_VIDX);
  const [, setTick] = useState(0);
  const tick = useCallback(() => setTick((x) => x + 1), []);
  const [auto, setAuto] = useState(false);
  const [speed, setSpeed] = useState(2000);

  const activeRealIdx = ((virtualIdxRef.current % N) + N) % N;
  const t = testimonials[activeRealIdx];

  const setVirtual = (v: number) => {
    type WheelApi = { __wheelSetVirtual?: (v: number, skip?: boolean) => void };
    (window as unknown as WheelApi).__wheelSetVirtual?.(v);
  };

  const next = () => setVirtual(virtualIdxRef.current + 1);
  const prev = () => setVirtual(virtualIdxRef.current - 1);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(next, speed);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, speed]);

  return (
    <main className="min-h-screen bg-neutral-950 text-white py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            Testimonials — infinite wheel v2
          </h1>
          <p className="text-gray-400 text-sm">
            {N} opinii · single source of truth, next/prev zawsze w zamierzonym kierunku
          </p>
          <div className="mt-4 flex gap-3 justify-center items-center flex-wrap">
            <button
              onClick={() => setAuto((a) => !a)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                auto ? "bg-[#ff7302] text-white" : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
              }`}
            >
              {auto ? "Pauza" : "Auto-play"}
            </button>
            <label className="text-xs text-gray-400 flex items-center gap-2">
              Szybkość:
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-white"
              >
                <option value={1000}>1s</option>
                <option value={2000}>2s</option>
                <option value={3000}>3s</option>
              </select>
            </label>
            <span className="text-gray-500 text-xs">
              aktywny: {activeRealIdx + 1} / {N} · vIdx: {virtualIdxRef.current}
            </span>
          </div>
        </header>

        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-3 items-center shrink-0">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center hover:bg-[#ff7302] hover:border-[#ff7302] transition-colors"
              aria-label="Poprzedni"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            <div className="relative h-[336px] w-24 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-neutral-950 to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-neutral-950 to-transparent z-10 pointer-events-none" />
              <InfiniteWheel virtualIdxRef={virtualIdxRef} onTick={tick} />
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center hover:bg-[#ff7302] hover:border-[#ff7302] transition-colors"
              aria-label="Następny"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
              <Image
                src={t.workImage}
                alt={t.workTitle}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 80vw, 1000px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <span className="inline-block bg-[#ff7302] text-white text-xs font-semibold px-2 py-0.5 rounded mb-2 self-start">
                  Mural
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-6">{t.workTitle}</h3>
                <div className="flex items-start gap-4 max-w-2xl">
                  <div className="w-14 h-14 rounded-full bg-white p-2 shrink-0">
                    <Image src={t.image} alt="" width={56} height={56} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-gray-300 text-sm">{t.role} · {t.company}</p>
                    <StarRating rating={t.rating} />
                    <blockquote className="mt-3 italic text-white/90 text-sm md:text-base leading-relaxed">
                      &quot;{t.content}&quot;
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-3xl mx-auto text-gray-300 text-sm space-y-3">
          <h2 className="text-white text-lg font-bold">Co naprawione vs v1</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Single source of truth</strong> — tylko <code>virtualIdx</code> (ref), wheel.y zawsze wynika z niego</li>
            <li><strong>Next/prev zawsze ±1</strong> — brak heurystyki &quot;shortest path&quot;, żadne cofnięcia przy klikaniu</li>
            <li><strong>Klik na slot</strong> — idzie bezpośrednio do jego virtualIdx (widzianej pozycji), nie do shortest path</li>
            <li><strong>Cancelowanie animacji</strong> — <code>animate().stop()</code> przy szybkim klikaniu, nowa animacja startuje od aktualnego y (płynne przyspieszenie)</li>
            <li><strong>Silent teleport tylko po settle</strong> — <code>onComplete</code> odpala się dopiero gdy animacja dokończy bez przerwania</li>
            <li><strong>Brak <code>activeIdx</code> state</strong> — eliminuje desync między state a virtualIdx podczas rapid clicks</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
