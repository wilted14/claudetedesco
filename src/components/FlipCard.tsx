"use client";

import { useRef, useState, type PointerEvent, type KeyboardEvent } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Carte recto/verso « pochette d'album » :
 *  – un clic (ou un tap, ou Entrée/Espace) retourne la carte ;
 *  – au survol, la carte s'incline en 3D vers le pointeur (même langage
 *    visuel que TiltCard), avec un reflet doré qui suit le curseur.
 * Deux transformations sont composées sur des calques séparés :
 * l'inclinaison sur le conteneur, la rotation recto/verso sur le cœur.
 * Respecte prefers-reduced-motion (bascule instantanée, pas d'inclinaison).
 */
export function FlipCard({
  recto,
  verso,
  alt,
  className = "",
  max = 9,
}: {
  recto: string;
  verso: string;
  alt: string;
  className?: string;
  /** inclinaison maximale en degrés */
  max?: number;
}) {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      el.style.transition = "transform 60ms linear";
      el.style.transform = `rotateX(${(-(py - 0.5) * 2 * max).toFixed(
        2,
      )}deg) rotateY(${((px - 0.5) * 2 * max).toFixed(2)}deg)`;
      if (glareRef.current) {
        glareRef.current.style.opacity = "1";
        glareRef.current.style.background = `radial-gradient(circle at ${(
          px * 100
        ).toFixed(1)}% ${(py * 100).toFixed(
          1,
        )}%, rgba(255,255,255,0.22), rgba(255,255,255,0) 50%)`;
      }
    });
  };

  const resetTilt = () => {
    if (reduce) return;
    const el = tiltRef.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    el.style.transition = "transform 500ms cubic-bezier(0.22,1,0.36,1)";
    el.style.transform = "rotateX(0deg) rotateY(0deg)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped((f) => !f);
    }
  };

  return (
    <div className={className} style={{ perspective: "1200px" }}>
      {/* Calque inclinaison (pointeur) */}
      <div
        ref={tiltRef}
        onPointerMove={onMove}
        onPointerLeave={resetTilt}
        onPointerCancel={resetTilt}
        className="relative h-full w-full cursor-pointer [transform-style:preserve-3d]"
        style={{ touchAction: "pan-y" }}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${alt} — cliquer pour retourner la pochette`}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={onKey}
      >
        {/* Calque retournement recto/verso */}
        <div
          className="relative h-full w-full [transform-style:preserve-3d]"
          style={{
            transform: `rotateY(${flipped ? 180 : 0}deg)`,
            transition: reduce
              ? "none"
              : "transform 700ms cubic-bezier(0.32, 0.72, 0.22, 1)",
          }}
        >
          {/* Recto */}
          <div className="absolute inset-0 overflow-hidden rounded-sm border border-line-strong bg-surface [backface-visibility:hidden]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={recto}
              alt={`${alt} — recto`}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Verso (pré-tourné de 180°) */}
          <div
            className="absolute inset-0 overflow-hidden rounded-sm border border-line-strong bg-surface [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={verso}
              alt={`${alt} — verso`}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Reflet lumineux */}
        <div
          ref={glareRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-sm opacity-0 mix-blend-overlay transition-opacity duration-300"
        />

        {/* Badge « retourner » */}
        <span
          aria-hidden
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-gold/90 text-bg shadow-[0_6px_20px_-4px_rgba(198,166,100,0.7)] transition-transform duration-500"
          style={{ transform: flipped ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M6 2v3.5H9.5" />
          </svg>
        </span>
      </div>
    </div>
  );
}
