"use client";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Star, ChevronUp, ChevronDown } from "lucide-react";
// Testimonial data — real references from clients
const testimonials = [
  {
    id: 1,
    type: "Mural",
    name: "Paweł Suszek",
    role: "Członek Zarządu",
    company: "Ekopak Sp. z o.o.",
    image: "/logo/clients_logos/1P.png",
    content:
      "Projekt został wykonany kompleksowo — od koncepcji graficznej, przez przygotowanie ściany, aż po finalne wykonanie muralu. Wykonawca wykazał się profesjonalizmem, elastycznością oraz bardzo dobrym zrozumieniem tematyki ekologicznej. Efekt końcowy spełnił nasze oczekiwania zarówno pod względem wizualnym, jak i wizerunkowym.",
    rating: 5,
    workImage: "/Portfolio/murale/7c.webp",
    workTitle: "Mural ekologiczny dla Ekopak",
  },
  {
    id: 2,
    type: "Mural",
    name: "Teresa Stępniak-Romanek",
    role: "Kierownik Działu Strategii i Komunikacji",
    company: "LPEC S.A.",
    image: "/logo/clients_logos/2P.png",
    content:
      "Wszystkie prace zostały wykonane zgodnie z ustaleniami, z należytą starannością, terminowo oraz na wysokim poziomie estetycznym i technicznym. Współpraca przebiegała bez zastrzeżeń. Z pełnym przekonaniem możemy polecić wykonawcę jako solidnego i godnego zaufania partnera.",
    rating: 5,
    workImage: "/Portfolio/murale/10.webp",
    workTitle: "Murale dla LPEC w Lublinie",
  },
  {
    id: 3,
    type: "Mural",
    name: "Paweł Rysak",
    role: "Prezes Zarządu",
    company: "SM Bieluch w Chełmie",
    image: "/logo/clients_logos/4P.png",
    content:
      "Firma Aeromat zrealizowała usługę w sposób w pełni profesjonalny, rzetelny i kompleksowy. Kolorystyka muralu jest intensywna, wyrazista i zgodna z projektem. Powstały mural stanowi atrakcyjną, a zarazem nienachalną formę promocji — przyciąga uwagę przechodniów, którzy chętnie zatrzymują się, aby go obejrzeć.",
    rating: 5,
    workImage: "/Portfolio/murale/13.webp",
    workTitle: "Mural promocyjny dla SM Bieluch",
  },
];

// Star Rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5 mt-2">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

// Mobile layout — Variant 2 (Swipe-first). Fixed height prevents navigation from jumping.
const MobileTestimonials = () => {
  const [i, setI] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = (idx: number) => {
    setI(((idx % testimonials.length) + testimonials.length) % testimonials.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      goTo(dx < 0 ? i + 1 : i - 1);
    }
    touchStartX.current = null;
  };

  const t = testimonials[i];

  return (
    <div className="md:hidden w-full max-w-md mx-auto px-4 py-6 flex flex-col gap-3">
      <div
        ref={trackRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative w-full h-[540px] rounded-xl overflow-hidden select-none"
      >
        <Image
          src={t.workImage || "/placeholder.svg"}
          alt={t.workTitle}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 0px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <span className="inline-block bg-[#ff7302] text-white text-xs font-semibold px-2 py-0.5 rounded mb-2 self-start">
            {t.type}
          </span>
          <h3 className="text-white font-bold text-lg mb-4 leading-tight">
            {t.workTitle}
          </h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full bg-white p-1.5 shrink-0">
              <Image
                src={t.image}
                alt=""
                width={44}
                height={44}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-semibold text-sm truncate">
                {t.name}
              </p>
              <p className="text-gray-300 text-xs truncate">
                {t.role}, {t.company}
              </p>
              <StarRating rating={t.rating} />
            </div>
          </div>
          <blockquote className="text-white/95 text-sm leading-relaxed italic backdrop-blur-sm bg-black/30 rounded-lg p-3 min-h-[140px]">
            &quot;{t.content}&quot;
          </blockquote>
        </div>
      </div>

      <div className="flex justify-center gap-2 pt-1">
        {testimonials.map((tt, idx) => (
          <button
            key={tt.id}
            onClick={() => goTo(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === i ? "w-8 bg-[#ff7302]" : "w-2 bg-neutral-600"
            }`}
            aria-label={`Referencja ${idx + 1}`}
          />
        ))}
      </div>
      <p className="text-center text-xs text-gray-500">← przesuń palcem →</p>
    </div>
  );
};

// ── Desktop infinite wheel — v2 mechanism ─────────────────────────
// Single source of truth: virtualIdxRef (monotone integer).
// - next/prev: virtualIdx ± 1 (direction always intentional)
// - click slot: set virtualIdx to the slot's absolute virtualIdx
// - animation cancellation on rapid clicks (smooth, no jumps)
// - silent teleport only after settle (onComplete)

const N = testimonials.length;
const ITEM_H = 96; // 80px button + 16px gap
const COPIES = 3;
const INITIAL_VIDX = N;

function DesktopInfiniteWheel({
  virtualIdxRef,
  onTick,
}: {
  virtualIdxRef: React.MutableRefObject<number>;
  onTick: () => void;
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

  useEffect(() => {
    (window as unknown as { __testimonialsWheelApi?: typeof setVirtual }).__testimonialsWheelApi = setVirtual;
    return () => {
      delete (window as unknown as { __testimonialsWheelApi?: unknown }).__testimonialsWheelApi;
    };
  }, [setVirtual]);

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

export default function TestimonialsCarousel3() {
  const virtualIdxRef = useRef(INITIAL_VIDX);
  const [, setTick] = useState(0);
  const tick = useCallback(() => setTick((x) => x + 1), []);

  const activeRealIdx = ((virtualIdxRef.current % N) + N) % N;
  const t = testimonials[activeRealIdx];

  const setVirtual = (v: number) => {
    type Api = { __testimonialsWheelApi?: (v: number, skip?: boolean) => void };
    (window as unknown as Api).__testimonialsWheelApi?.(v);
  };

  const next = () => setVirtual(virtualIdxRef.current + 1);
  const prev = () => setVirtual(virtualIdxRef.current - 1);

  return (
    <>
      <MobileTestimonials />
      <div className="hidden md:flex max-w-[1600px] mx-auto py-6 bg-background items-center overflow-hidden px-4 sm:px-8">
        {/* Wheel + prev/next buttons */}
        <div className="flex flex-col gap-2 items-center justify-center shrink-0">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={prev}
            aria-label="Poprzednia opinia"
            className="mx-4 w-10 h-10 rounded-full bg-neutral-800 border border-neutral-600 text-white flex items-center justify-center hover:bg-[#ff7302] hover:border-[#ff7302] transition-colors"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>

          <div className="relative h-[336px] w-24 overflow-hidden px-4">
            <div className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
            <DesktopInfiniteWheel virtualIdxRef={virtualIdxRef} onTick={tick} />
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={next}
            aria-label="Następna opinia"
            className="mx-4 w-10 h-10 rounded-full bg-neutral-800 border border-neutral-600 text-white flex items-center justify-center hover:bg-[#ff7302] hover:border-[#ff7302] transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Active testimonial card with crossfade */}
        <div className="flex-1 min-w-0 relative h-[500px] lg:h-[700px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 rounded-xl overflow-hidden"
            >
              <Image
                src={t.workImage || "/placeholder.svg"}
                alt={t.workTitle}
                fill
                className="object-cover"
                sizes="100vw"
                loading="lazy"
              />
              <div className="absolute -inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent via-60%" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
                <Badge className="mb-4 self-start">{t.type}</Badge>
                <h3 className="text-white font-bold text-2xl md:text-3xl mb-4">
                  {t.workTitle}
                </h3>
                <Card className="bg-transparent backdrop-blur-sm border-0 shadow-lg w-full md:max-w-[700px] xl:max-w-[800px]">
                  <CardContent className="p-2 sm:p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-12 w-12 border-2 border-primary/10 text-sm">
                        <AvatarImage src={t.image} alt={t.name} />
                        <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-gray-200 font-semibold text-lg">
                          {t.name}
                        </h4>
                        <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                          <span className="text-gray-400">{t.role}</span>
                          <span className="text-xs">•</span>
                          <Badge variant="secondary" className="font-normal">
                            {t.company}
                          </Badge>
                        </div>
                        <StarRating rating={t.rating} />
                      </div>
                    </div>
                    <blockquote className="text-white/90 text-base md:text-lg italic">
                      &quot;{t.content}&quot;
                    </blockquote>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
