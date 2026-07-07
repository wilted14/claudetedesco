"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Carte à effet 3D « holographique » (façon scrydex / cartes à collectionner).
 * L'élément s'incline en 3D en suivant le pointeur (souris ou doigt), avec un
 * reflet lumineux et un léger voile irisé doré qui se déplacent avec le curseur.
 * Écriture directe dans le DOM (pas de re-render) → parfaitement fluide.
 * Respecte prefers-reduced-motion (aucune inclinaison).
 */
export function TiltCard({
  children,
  className = "",
  max = 12,
}: {
  children: ReactNode;
  className?: string;
  /** inclinaison maximale en degrés */
  max?: number;
}) {
  const reduce = useReducedMotion();
  const innerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const inner = innerRef.current;
    if (!inner) return;
    const r = inner.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rotY = (px - 0.5) * 2 * max;
      const rotX = -(py - 0.5) * 2 * max;
      inner.style.transition = "transform 60ms linear";
      inner.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(
        2,
      )}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.03)`;

      if (glareRef.current) {
        glareRef.current.style.opacity = "1";
        glareRef.current.style.background = `radial-gradient(circle at ${(
          px * 100
        ).toFixed(1)}% ${(py * 100).toFixed(
          1,
        )}%, rgba(255,255,255,0.28), rgba(255,255,255,0) 45%)`;
      }
      if (sheenRef.current) {
        sheenRef.current.style.opacity = "0.5";
        sheenRef.current.style.backgroundPosition = `${(px * 100).toFixed(
          1,
        )}% ${(py * 100).toFixed(1)}%`;
      }
    });
  };

  const reset = () => {
    if (reduce) return;
    const inner = innerRef.current;
    if (!inner) return;
    cancelAnimationFrame(rafRef.current);
    inner.style.transition = "transform 500ms cubic-bezier(0.22,1,0.36,1)";
    inner.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
    if (sheenRef.current) sheenRef.current.style.opacity = "0";
  };

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div className={className} style={{ perspective: "1000px" }}>
      <div
        ref={innerRef}
        onPointerMove={onMove}
        onPointerLeave={reset}
        onPointerCancel={reset}
        onPointerUp={reset}
        className="relative h-full w-full [transform-style:preserve-3d] [will-change:transform]"
        style={{ touchAction: "pan-y" }}
      >
        {children}
        {/* Voile irisé doré, très subtil */}
        <div
          ref={sheenRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-soft-light transition-opacity duration-300"
          style={{
            backgroundImage:
              "linear-gradient(115deg, transparent 20%, rgba(198,166,100,0.55) 40%, rgba(255,240,210,0.65) 50%, rgba(198,166,100,0.55) 60%, transparent 80%)",
            backgroundSize: "300% 300%",
          }}
        />
        {/* Reflet lumineux qui suit le curseur */}
        <div
          ref={glareRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-overlay transition-opacity duration-300"
        />
      </div>
    </div>
  );
}
