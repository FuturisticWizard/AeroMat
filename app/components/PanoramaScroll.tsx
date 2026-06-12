"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  animateContentIn,
  animateContentOut,
} from "@/app/lib/animations";

gsap.registerPlugin(ScrollTrigger, SplitText);

const CAPTIONS = [
  {
    title: "PRECYZJA MATERIAŁÓW",
    description:
      "Materiały dobieram z najwyższą starannością, uwzględniając otoczenie i jego wpływ na pracę. Farby antysmogowe, UV, spray, aerograf — każda technika dobrana do zlecenia.",
  },
  {
    title: "OD SZKICU DO ŚCIANY",
    description:
      "Pędzel, wałek, spray, aerograf, flamastry — pracuję każdą techniką, a ich dobór zawsze wynika z potrzeb konkretnego projektu.",
  },
  {
    title: "SZTUKA BEZ GRANIC",
    description:
      "Ani rozmiar ściany, ani położenie geograficzne mnie nie ograniczają. Działam w całej Polsce — od kameralnych wnętrz po wielkoformatowe fasady.",
  },
] as const;

const PanoramaScroll = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x050505, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -10, 10);
    camera.position.z = 5;

    let animationFrameId = 0;
    let plane:
      | THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
      | null = null;
    let texture: THREE.Texture | null = null;
    let scrollTrigger: ScrollTrigger | null = null;
    let captionEntries: Array<{
      chars: NodeListOf<HTMLElement>;
      visible: boolean;
    }> = [];

    const updateCamera = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);

      const viewHeight = 2;
      const viewWidth = viewHeight * (clientWidth / clientHeight || 1);

      camera.left = -viewWidth / 2;
      camera.right = viewWidth / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();

      if (plane && texture?.image) {
        const aspect = texture.image.width / texture.image.height;
        plane.scale.set(aspect * viewHeight, viewHeight, 1);
      }
    };

    let isVisible = false;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) animate();
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(container);

    const animate = () => {
      if (!isVisible) { animationFrameId = 0; return; }
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    const setupCaptions = () => {
      const captions = Array.from(
        container.querySelectorAll<HTMLElement>(".panorama-caption")
      );
      captionEntries = captions
        .map((caption) => {
          const title = caption.querySelector("h2");
          const description = caption.querySelector<HTMLElement>("p");
          if (!title) return null;
          const split = new SplitText(title, {
            type: "words,chars",
            charsClass: "char",
            wordsClass: "word",
            tag: "div",
          });
          split.chars.forEach((char) => {
            char.innerHTML = `<span>${char.textContent}</span>`;
          });
          // Opis dzielony po literce (te same klasy .word/.char co tytul) - dostaje
          // identyczny efekt maskowanego wjazdu zamiast przesuniecia calego bloku.
          if (description) {
            const descSplit = new SplitText(description, {
              type: "words,chars",
              charsClass: "char",
              wordsClass: "word",
              tag: "div",
            });
            descSplit.chars.forEach((char) => {
              const text = char.textContent ?? "";
              char.textContent = "";
              const span = document.createElement("span");
              span.textContent = text;
              char.appendChild(span);
            });
          }
          const chars = caption.querySelectorAll<HTMLElement>(".char span");
          gsap.set(chars, { x: "110%" });
          return {
            chars,
            visible: false,
          };
        })
        .filter(
          (entry): entry is {
            chars: NodeListOf<HTMLElement>;
            visible: boolean;
          } => Boolean(entry)
        );
    };

    const updateCaptions = (progress: number) => {
      if (!captionEntries.length) return;
      const clampedProgress = Math.min(progress, 0.999);
      const segment = 1 / captionEntries.length;
      const currentIndex = Math.min(
        captionEntries.length - 1,
        Math.floor(clampedProgress / segment)
      );
      const segmentProgress =
        (clampedProgress - currentIndex * segment) / segment;

      const lastIndex = captionEntries.length - 1;
      captionEntries.forEach((entry, index) => {
        const isLast = index === lastIndex;
        const shouldBeVisible =
          index === currentIndex &&
          segmentProgress >= 0.15 &&
          (isLast || segmentProgress < 0.75);

        if (shouldBeVisible && !entry.visible) {
          // Pokaż tekst (fala 0.6 s rozlozona na wszystkie litery podpisu)
          animateContentIn(entry.chars, null, null, 0.6);
          entry.visible = true;
        } else if (!shouldBeVisible && entry.visible) {
          // Schowaj tekst
          animateContentOut(entry.chars);
          entry.visible = false;
        }
      });
    };

    const loader = new THREE.TextureLoader();
    loader.load(
      "/Animation/Panorama/komeko-new.webp",
      (loadedTexture) => {
        texture = loadedTexture;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        updateCamera();

        const updatePlanePosition = (progress: number) => {
          if (!plane) return;
          const viewWidth = camera.right - camera.left;
          const planeWidth = plane.scale.x;
          const maxShift = Math.max(0, (planeWidth - viewWidth) / 2);
          plane.position.x =
            maxShift === 0 ? 0 : maxShift - progress * (maxShift * 2);
        };

        updateCamera();

        setupCaptions();
        updatePlanePosition(0);
        // Nie wywołujemy updateCaptions(0) - napisy pojawią się dopiero przy scrollowaniu

        // Desktop: listen to progress from page.tsx pin (avoids dual ScrollTrigger conflict)
        mm.add("(min-width: 768px)", () => {
          const onProgress = (e: Event) => {
            const progress = (e as CustomEvent).detail as number;
            updatePlanePosition(progress);
            updateCaptions(progress);
          };
          window.addEventListener("panorama-progress", onProgress);

          return () => {
            window.removeEventListener("panorama-progress", onProgress);
          };
        });

        // Mobile: scroll-based scrub like desktop, with pin
        mm.add("(max-width: 767px)", () => {
          scrollTrigger = ScrollTrigger.create({
            trigger: container,
            start: "top top",
            end: "+=150%", // Shorter than desktop but still gives good scroll range
            pin: true,
            pinSpacing: true,
            scrub: 0.5, // Slight smoothing for mobile touch
            onUpdate: (self) => {
              updatePlanePosition(self.progress);
              updateCaptions(self.progress);
            },
          });

          return () => {
            scrollTrigger?.kill();
            scrollTrigger = null;
          };
        });
      },
      undefined,
      (error) => {
        console.error("Failed to load panorama texture", error);
      }
    );

    const handleResize = () => {
      updateCamera();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      mm.revert();
      visibilityObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      scrollTrigger?.kill();
      captionEntries = [];
      if (plane) {
        plane.geometry.dispose();
        const material = plane.material;
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose());
        } else {
          material.dispose();
        }
      }
      texture?.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section ref={containerRef} className="card panorama-card">
      <div className="card-wrapper">
        <div className="card-img panorama-img-wrapper">
          <canvas ref={canvasRef} className="panorama-canvas" />
        </div>
        <div className="card-dim" aria-hidden />
        <div className="panorama-filter" aria-hidden />
        <div className="panorama-overlay">
          {CAPTIONS.map((caption) => (
            <div className="panorama-caption" key={caption.title}>
              <h2>{caption.title}</h2>
              <p>{caption.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PanoramaScroll;

