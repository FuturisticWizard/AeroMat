import gsap from "gsap";

type GsapTarget = gsap.TweenTarget;

export function animateContentIn(
  titleChars: GsapTarget,
  description?: GsapTarget | null,
  dimLayer?: GsapTarget | null,
  /* Laczny czas fali (sekundy) rozlozony na wszystkie elementy; 0 = wszystkie
     naraz (dotychczasowe zachowanie, uzywane przez tytuly kart). */
  staggerAmount = 0
) {
  console.log("[AnimateIn] titleChars:", titleChars, "description:", description);
  console.log("[AnimateIn] titleChars length:", Array.isArray(titleChars) ? titleChars.length : "not array");
  
  if (dimLayer) {
    gsap.to(dimLayer, {
      opacity: 1,
      duration: 0.45,
      ease: "power2.out",
      overwrite: true,
    });
  }

  gsap.to(titleChars, {
    x: "0%",
    duration: 0.75,
    ease: "power4.out",
    overwrite: true,
    stagger: { amount: staggerAmount },
    onComplete: () => console.log("[AnimateIn] Title animation complete"),
  });
  if (description) {
    console.log("[AnimateIn] Animating description");
    gsap.to(description, {
      x: 0,
      opacity: 1,
      duration: 0.75,
      delay: 0,
      ease: "power4.out",
      overwrite: true,
      onComplete: () => console.log("[AnimateIn] Description animation complete"),
    });
  }
}

export function animateContentOut(
  titleChars: GsapTarget,
  description?: GsapTarget | null,
  dimLayer?: GsapTarget | null
) {
  if (dimLayer) {
    gsap.to(dimLayer, {
      opacity: 0,
      duration: 0.35,
      ease: "power2.out",
      overwrite: true,
    });
  }

  gsap.to(titleChars, {
    x: "110%",
    duration: 0.75,
    ease: "power4.out",
    overwrite: true,
  });
  if (description) {
    gsap.to(description, {
      x: "40px",
      opacity: 0,
      duration: 0.5,
      ease: "power4.out",
      overwrite: true,
    });
  }
}

