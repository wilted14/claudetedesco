"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { site } from "@/content/site";

export function Galerie() {
  const { galerie } = site;
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

  if (galerie.photos.length === 0) return null;

  return (
    <section
      id="galerie"
      className="relative border-t border-line bg-bg/70 py-24 md:py-36"
    >
      <div className="mx-auto max-w-[var(--max)] px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
            En images
          </p>
          <h2 className="font-serif text-4xl font-light text-ink md:text-5xl">
            {galerie.titre}
          </h2>
          <div className="hairline-gold mx-auto mt-6 h-px w-16" />
          <p className="mt-6 text-ink-soft">{galerie.intro}</p>
        </Reveal>

        {/* Grille */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {galerie.photos.map((photo, i) => (
            <Reveal
              key={i}
              delay={i * 0.06}
              className={
                // Première photo mise en avant sur grand écran
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }
            >
              <TiltCard
                className={`relative w-full overflow-hidden rounded-sm border border-line bg-surface ${
                  i === 0 ? "aspect-[4/3] md:h-full" : "aspect-[4/5]"
                }`}
                max={10}
              >
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Agrandir : ${photo.alt}`}
                  className="block h-full w-full"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                    style={{
                      objectPosition:
                        (photo as { position?: string }).position ?? "center",
                    }}
                  />
                </button>
              </TiltCard>
            </Reveal>
          ))}
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
            <motion.div
              key={open}
              initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full max-h-[85vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galerie.photos[open].src}
                alt={galerie.photos[open].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />

              {/* Fermer — note de musique dorée, près de la photo */}
              <button
                type="button"
                aria-label="Fermer la photo"
                onClick={() => setOpen(null)}
                className="absolute right-2 top-2 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-bg shadow-[0_8px_28px_-6px_rgba(198,166,100,0.75)] ring-1 ring-gold-bright/40 transition-transform duration-200 hover:scale-110 hover:bg-gold-bright focus-visible:scale-110 md:h-14 md:w-14"
              >
                <NoteIcon />
                <span className="sr-only">Fermer</span>
              </button>
            </motion.div>
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
