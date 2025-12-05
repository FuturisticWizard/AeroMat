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
    title: "TWORZĘ Z PASJĄ",
    description:
      "Każda ściana to dla mnie płótno. Przemieniam szare przestrzenie w żywe dzieła sztuki.",
  },
  {
    title: "OD POMYSŁU DO MURALU",
    description:
      "Współpracuję z klientem od pierwszego szkicu po ostatni pociągnięcie pędzla. Razem tworzymy coś wyjątkowego.",
  },
  {
    title: "SZTUKA BEZ GRANIC",
    description:
      "Murale, szyldy, wnętrza, eventy – każdy projekt to nowe wyzwanie i nowa historia do opowiedzenia.",
  },
] as const;

const PanoramaScroll = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
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
      description: HTMLElement | null;
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

    const animate = () => {
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
            type: "chars",
            charsClass: "char",
            tag: "div",
          });
          split.chars.forEach((char) => {
            char.innerHTML = `<span>${char.textContent}</span>`;
          });
          const chars = caption.querySelectorAll<HTMLElement>(".char span");
          gsap.set(chars, { x: "100%" });
          if (description) {
            gsap.set(description, { x: "40px", opacity: 0 });
          }
          return {
            chars,
            description,
            visible: false,
          };
        })
        .filter(
          (entry): entry is {
            chars: NodeListOf<HTMLElement>;
            description: HTMLElement | null;
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

      captionEntries.forEach((entry, index) => {
        const shouldBeVisible = 
          index === currentIndex && 
          segmentProgress >= 0.15 && 
          segmentProgress < 0.75;

        if (shouldBeVisible && !entry.visible) {
          // Pokaż tekst
          animateContentIn(entry.chars, entry.description);
          entry.visible = true;
        } else if (!shouldBeVisible && entry.visible) {
          // Schowaj tekst
          animateContentOut(entry.chars, entry.description);
          entry.visible = false;
        }
      });
    };

    const loader = new THREE.TextureLoader();
    loader.load(
      "/images/komeko-new.jpg",
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

        // ScrollTrigger bez pinowania - pinowanie robi główna logika w page.tsx
        // Animacja panoramy uruchamia się gdy sekcja jest w widoku
        scrollTrigger = ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: "+=200%",
          scrub: true,
          onUpdate: (self) => {
            updatePlanePosition(self.progress);
            updateCaptions(self.progress);
          },
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

