import gsap from "gsap";

type GsapTarget = gsap.TweenTarget;

export function animateContentIn(
  titleChars: GsapTarget,
  description?: GsapTarget | null
) {
  gsap.to(titleChars, {
    x: "0%",
    duration: 0.75,
    ease: "power4.out",
    overwrite: true,
  });
  if (description) {
    gsap.to(description, {
      x: 0,
      opacity: 1,
      duration: 0.75,
      delay: 0.1,
      ease: "power4.out",
      overwrite: true,
    });
  }
}

export function animateContentOut(
  titleChars: GsapTarget,
  description?: GsapTarget | null
) {
  gsap.to(titleChars, {
    x: "100%",
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

