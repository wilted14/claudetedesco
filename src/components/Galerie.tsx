"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
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
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Agrandir : ${photo.alt}`}
                className="group relative block h-full w-full overflow-hidden rounded-sm border border-line bg-surface"
              >
                <div
                  className={`relative w-full ${
                    i === 0 ? "aspect-[4/3] md:h-full" : "aspect-[4/5]"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-bg/0 transition-colors duration-500 group-hover:bg-bg/20" />
                </div>
              </button>
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
            <button
              type="button"
              aria-label="Fermer"
              onClick={() => setOpen(null)}
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:border-gold hover:text-gold"
            >
              <X size={20} />
            </button>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
