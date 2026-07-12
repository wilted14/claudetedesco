"use client";

import { useState, useEffect, useRef, type PointerEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { FlipCard } from "@/components/FlipCard";
import { useSite, useLanguage } from "@/content/LanguageContext";
import { asset } from "@/lib/asset";

export function Galerie() {
  const site = useSite();
  const { locale } = useLanguage();
  const { galerie } = site;
  const t =
    locale === "en"
      ? {
          inImages: "In pictures",
          discography: "Discography",
          enlarge: "Enlarge",
          coverOf: "Cover of the album",
          close: "Close",
        }
      : {
          inImages: "En images",
          discography: "Discographie",
          enlarge: "Agrandir",
          coverOf: "Pochette de l'album",
          close: "Fermer",
        };
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);

  // Fermeture au clavier + blocage du défilement quand la lightbox est ouverte
  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight")
        setOpen((i) => (i === null ? i : (i + 1) % galerie.photos.length));
      if (e.key === "ArrowLeft")
        setOpen((i) =>
          i === null ? i : (i - 1 + galerie.photos.length) % galerie.photos.length,
        );
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, galerie.photos.length]);

  // Effet 3D de la photo agrandie (souris + doigt), écriture DOM directe.
  // On mesure le pointeur depuis le CADRE stable (lbFrame, jamais transformé)
  // et on applique la rotation au calque intérieur (lbInner) → pas de boucle
  // de rétroaction, donc aucun tremblement, même dans les coins.
  const lbFrame = useRef<HTMLDivElement>(null);
  const lbInner = useRef<HTMLDivElement>(null);
  const lbGlare = useRef<HTMLDivElement>(null);
  const lbRaf = useRef(0);

  const onLbMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const frame = lbFrame.current;
    const el = lbInner.current;
    if (!frame || !el) return;
    const r = frame.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    cancelAnimationFrame(lbRaf.current);
    lbRaf.current = requestAnimationFrame(() => {
      const rotY = (px - 0.5) * 2 * 9;
      const rotX = -(py - 0.5) * 2 * 9;
      el.style.transition = "transform 60ms linear";
      el.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(
        2,
      )}deg)`;
      if (lbGlare.current) {
        lbGlare.current.style.opacity = "1";
        lbGlare.current.style.background = `radial-gradient(circle at ${(
          px * 100
        ).toFixed(1)}% ${(py * 100).toFixed(
          1,
        )}%, rgba(255,255,255,0.22), rgba(255,255,255,0) 46%)`;
      }
    });
  };

  const resetLb = () => {
    const el = lbInner.current;
    if (!el) return;
    cancelAnimationFrame(lbRaf.current);
    el.style.transition = "transform 500ms cubic-bezier(0.22,1,0.36,1)";
    el.style.transform = "rotateX(0deg) rotateY(0deg)";
    if (lbGlare.current) lbGlare.current.style.opacity = "0";
  };

  if (galerie.photos.length === 0) return null;

  return (
    <section
      id="galerie"
      className="relative border-t border-line bg-bg/70 py-24 md:py-36"
    >
      <div className="mx-auto max-w-[var(--max)] px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
            {t.inImages}
          </p>
          <h2 className="font-serif text-4xl font-light text-ink md:text-5xl">
            {galerie.titre}
          </h2>
          <div className="hairline-gold mx-auto mt-6 h-px w-16" />
          <p className="mt-6 text-ink-soft">{galerie.intro}</p>
        </Reveal>

        {/* Mosaïque : colonnes fluides, chaque photo garde ses proportions */}
        <div className="mt-14 columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-3">
          {galerie.photos.map((photo, i) => (
            <Reveal
              key={i}
              delay={(i % 6) * 0.05}
              className="mb-3 break-inside-avoid sm:mb-4"
            >
              <TiltCard
                className="relative w-full overflow-hidden rounded-sm border border-line bg-surface"
                max={8}
              >
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`${t.enlarge}: ${photo.alt}`}
                  className="block w-full"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(photo.src)}
                    alt={photo.alt}
                    loading="lazy"
                    className="block h-auto w-full object-cover"
                  />
                </button>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Albums — pochettes recto/verso */}
        <div className="mt-24 md:mt-32">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
              {t.discography}
            </p>
            <h3 className="font-serif text-3xl font-light text-ink md:text-4xl">
              {site.albums.titre}
            </h3>
            <div className="hairline-gold mx-auto mt-6 h-px w-16" />
            <p className="mt-6 text-ink-soft">{site.albums.intro}</p>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-10 sm:grid-cols-2">
            {site.albums.items.map((album, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <FlipCard
                  recto={asset(album.recto)}
                  verso={album.verso ? asset(album.verso) : undefined}
                  alt={`${t.coverOf} ${album.titre}`}
                  className="aspect-square w-full"
                />
                <div className="mt-4 flex items-baseline justify-between gap-3 px-1">
                  <span className="font-serif text-xl text-ink">
                    {album.titre}
                  </span>
                  <span className="shrink-0 text-sm text-ink-mute">
                    {album.sousTitre}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/95 p-4 backdrop-blur-sm md:p-10"
            onClick={() => setOpen(null)}
          >
            {/* Cadre STABLE (jamais transformé) : épouse la photo, capte le
                pointeur et sert de repère de mesure. Cliquer à côté ferme. */}
            <div
              ref={lbFrame}
              className="relative"
              style={{ perspective: "1200px", touchAction: "none" }}
              onClick={(e) => e.stopPropagation()}
              onPointerMove={onLbMove}
              onPointerLeave={resetLb}
              onPointerUp={resetLb}
              onPointerCancel={resetLb}
            >
              {/* Calque incliné : la photo + le reflet */}
              <motion.div
                key={open}
                ref={lbInner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative [will-change:transform]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(galerie.photos[open].src)}
                  alt={galerie.photos[open].alt}
                  draggable={false}
                  className="block h-auto max-h-[86vh] w-auto max-w-[92vw] select-none rounded-sm shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
                />
                {/* Reflet lumineux qui suit le curseur/doigt */}
                <div
                  ref={lbGlare}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-sm opacity-0 mix-blend-overlay transition-opacity duration-300"
                />
              </motion.div>

              {/* Fermer — note dorée, HORS du calque incliné : reste fixe au
                  coin, ne tremble pas, toujours cliquable. */}
              <button
                type="button"
                aria-label={t.close}
                onClick={() => setOpen(null)}
                className="absolute right-2 top-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-bg shadow-[0_8px_28px_-6px_rgba(198,166,100,0.75)] ring-1 ring-gold-bright/40 transition-colors duration-200 hover:bg-gold-bright md:h-14 md:w-14"
              >
                <NoteIcon />
                <span className="sr-only">{t.close}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* Note de musique (croche) dessinée en vectoriel — bouton de fermeture */
function NoteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      aria-hidden
    >
      <ellipse
        cx="8"
        cy="17"
        rx="3.6"
        ry="2.7"
        transform="rotate(-20 8 17)"
      />
      <rect x="10.7" y="4" width="1.7" height="13.2" />
      <path d="M12.4 4c3.2.7 4.8 2.9 3.4 5.9.3-2.4-1.3-3.7-3.4-4.1z" />
    </svg>
  );
}
