"use client";

import { useEffect, useRef, useState } from "react";
import {
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

/**
 * Piano en fond de site : la séquence détourée (120 frames WebP transparentes)
 * est dessinée sur un canvas FIXE derrière tout le contenu, et avance
 * image par image au rythme du défilement global de la page.
 * Aucun épinglage : le flux de lecture n'est jamais interrompu.
 * Les sections translucides laissent transparaître l'instrument.
 */

const FRAME_COUNT = 120;
const FRAME_W = 1600;
const FRAME_H = 900;

const frameSrc = (i: number) =>
  `/piano-frames/frame_${String(i + 1).padStart(3, "0")}.webp`;

export function PianoBackdrop() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const currentRef = useRef(-1);
  const [ready, setReady] = useState(false);

  // Progression du défilement de la page entière (0 en haut, 1 en bas)
  const { scrollYProgress } = useScroll();

  /* Dessin « cover » : remplit le viewport en conservant les proportions */
  const draw = (index: number) => {
    const canvas = canvasRef.current;
    const imgs = imagesRef.current;
    const loaded = loadedRef.current;
    if (!canvas || imgs.length === 0) return;

    let i = Math.max(0, Math.min(FRAME_COUNT - 1, index));
    if (!loaded[i]) {
      let j = i;
      while (j > 0 && !loaded[j]) j--;
      if (!loaded[j]) return;
      i = j;
    }
    // même frame : ne redessine que si un resize a eu lieu (currentRef remis à -1)
    if (i === currentRef.current) return;
    currentRef.current = i;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / FRAME_W, ch / FRAME_H);
    const dw = FRAME_W * scale;
    const dh = FRAME_H * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(imgs[i], (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  };

  /* Préchargement des frames + gestion du redimensionnement */
  useEffect(() => {
    if (reduce) return;
    let alive = true;

    const canvas = canvasRef.current;
    const sizeCanvas = () => {
      if (!canvas) return;
      // Canvas haute densité (netteté sur écrans Retina/HiDPI, plafonné à 2×)
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      currentRef.current = -1; // force le redessin à la même frame
      draw(Math.round(lastProgress.current * (FRAME_COUNT - 1)));
    };

    const imgs: HTMLImageElement[] = [];
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false);
    imagesRef.current = imgs;
    loadedRef.current = loaded;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      img.onload = () => {
        if (!alive) return;
        loaded[i] = true;
        if (i === 0) {
          setReady(true);
          sizeCanvas();
        }
      };
      imgs.push(img);
    }

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);
    return () => {
      alive = false;
      window.removeEventListener("resize", sizeCanvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const lastProgress = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    lastProgress.current = v;
    draw(Math.round(v * (FRAME_COUNT - 1)));
  });

  if (reduce) {
    // Version accessible : image fixe très discrète, aucune animation
    return (
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={frameSrc(0)}
          alt=""
          className="h-full w-full object-cover opacity-60"
        />
      </div>
    );
  }

  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className={`h-full w-full transition-opacity duration-1000 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
