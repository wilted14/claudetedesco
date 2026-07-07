"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Fond de site : nuée de notes de musique dorées, dessinées au canvas
 * (donc parfaitement nettes à toute résolution, sans image ni contour).
 * Elles dérivent doucement et sont « soulevées » par le défilement (parallaxe).
 * Respecte prefers-reduced-motion (rendu statique, aucune animation).
 */

type Note = {
  x: number; // position horizontale (0..1 de la largeur)
  y: number; // position verticale en px (défile)
  size: number; // taille en px
  depth: number; // 0.3 (loin) .. 1 (près) — pilote parallaxe/vitesse/opacité
  swayAmp: number; // amplitude de balancement horizontal (px)
  swaySpeed: number;
  phase: number;
  spin: number; // légère inclinaison animée
  spinSpeed: number;
  type: 0 | 1 | 2; // noire / croche / deux croches liées
  alpha: number;
};

const GOLD = "198, 166, 100";

export function NotesBackdrop() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let notes: Note[] = [];
    let dust: { x: number; y: number; r: number; depth: number; a: number }[] =
      [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const build = () => {
      const count = Math.round(Math.min(20, Math.max(11, W / 95)));
      notes = Array.from({ length: count }, () => {
        const depth = rand(0.35, 1);
        return {
          x: Math.random(),
          y: rand(-H * 0.5, H * 1.5),
          size: rand(13, 30) * depth,
          depth,
          swayAmp: rand(12, 40),
          swaySpeed: rand(0.15, 0.4),
          phase: rand(0, Math.PI * 2),
          spin: rand(-0.12, 0.12),
          spinSpeed: rand(0.1, 0.25),
          type: [0, 1, 2][Math.floor(Math.random() * 3)] as 0 | 1 | 2,
          alpha: rand(0.09, 0.2) * (0.6 + depth * 0.4),
        };
      });
      const dcount = Math.round(Math.min(70, Math.max(30, W / 26)));
      dust = Array.from({ length: dcount }, () => {
        const depth = rand(0.3, 1);
        return {
          x: Math.random(),
          y: rand(0, H),
          r: rand(0.6, 1.8) * depth,
          depth,
          a: rand(0.05, 0.14),
        };
      });
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    /* --- dessin d'une note (noire / croche / deux croches liées) --- */
    const drawNote = (n: Note, x: number, y: number, tilt: number) => {
      const s = n.size;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tilt);
      ctx.fillStyle = `rgba(${GOLD}, ${n.alpha})`;

      const head = (hx: number) => {
        ctx.save();
        ctx.translate(hx, 0);
        ctx.rotate(-0.32);
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.62, s * 0.46, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      const stem = (sx: number) => {
        ctx.fillRect(sx + s * 0.5, -s * 3.35, s * 0.13, s * 3.2);
      };

      if (n.type === 2) {
        // deux croches liées par une barre
        head(-s * 0.9);
        head(s * 0.9);
        stem(-s * 0.9);
        stem(s * 0.9);
        ctx.fillRect(-s * 0.9 + s * 0.5, -s * 3.35, s * 2.3, s * 0.42);
      } else {
        head(0);
        stem(0);
        if (n.type === 1) {
          // hampe + crochet (drapeau)
          ctx.beginPath();
          ctx.moveTo(s * 0.63, -s * 3.35);
          ctx.quadraticCurveTo(s * 1.5, -s * 2.9, s * 1.15, -s * 1.9);
          ctx.quadraticCurveTo(s * 1.35, -s * 2.6, s * 0.63, -s * 2.75);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const drawStatic = (scroll: number) => {
      ctx.clearRect(0, 0, W, H);
      // poussières dorées
      for (const d of dust) {
        const yy = wrap(d.y - scroll * d.depth * 0.12, H);
        ctx.fillStyle = `rgba(${GOLD}, ${d.a})`;
        ctx.beginPath();
        ctx.arc(d.x * W, yy, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // notes
      for (const n of notes) {
        const yy = wrap(n.y - scroll * n.depth * 0.18, H + n.size * 4) -
          n.size * 2;
        const x = n.x * W + Math.sin(n.phase) * n.swayAmp;
        drawNote(n, x, yy, n.spin);
      }
    };

    const wrap = (v: number, span: number) => {
      const m = span + 40;
      return ((v % m) + m) % m - 20;
    };

    let t0 = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - t0) / 1000, 0.05);
      t0 = now;
      const scroll = window.scrollY;

      ctx.clearRect(0, 0, W, H);

      for (const d of dust) {
        d.y -= dt * 6 * d.depth;
        const yy = wrap(d.y - scroll * d.depth * 0.12, H);
        ctx.fillStyle = `rgba(${GOLD}, ${d.a})`;
        ctx.beginPath();
        ctx.arc(d.x * W, yy, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const n of notes) {
        n.y -= dt * 9 * (0.5 + n.depth); // dérive lente vers le haut
        n.phase += dt * n.swaySpeed;
        n.spin += dt * n.spinSpeed * 0.15 * Math.sin(n.phase);
        const yy =
          wrap(n.y - scroll * n.depth * 0.18, H + n.size * 4) - n.size * 2;
        const x = n.x * W + Math.sin(n.phase) * n.swayAmp;
        drawNote(n, x, yy, n.spin * 0.4);
      }

      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!reduce && !raf) {
        t0 = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      drawStatic(window.scrollY);
    } else {
      raf = requestAnimationFrame(loop);
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
