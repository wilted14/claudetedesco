"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useSite } from "@/content/LanguageContext";
import { PianoMotif } from "@/components/PianoMotif";
import { PianoHero } from "@/components/PianoHero";
import { asset } from "@/lib/asset";

export function Hero() {
  const site = useSite();
  const reduce = useReducedMotion();
  const { nom } = site.artiste;
  const words = nom.split(" ");

  // Parallaxe légère du piano en fond, liée au scroll normal de la page.
  // Pas de pin/scroll-jacking : le motif suit simplement la lecture, sans jamais la retenir.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const pianoY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const pianoLidY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const pianoLidRot = useTransform(scrollYProgress, [0, 1], [0, -3]);
  const pianoKeysX = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const pianoStrings = useTransform(scrollYProgress, [0, 1], [0.15, 0.4]);

  // Révélation par mot : chaque mot glisse depuis un masque
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.45 } },
  };
  const word: Variants = {
    hidden: { y: reduce ? 0 : "110%" },
    visible: {
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  };
  const fade: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    visible: (d: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <section
      ref={sectionRef}
      id="accueil"
      className="bg-hall relative flex min-h-dvh items-center overflow-hidden"
    >
      {/* Photo de fond plein cadre, assombrie pour la lisibilité */}
      {site.heroImage && (
        <div aria-hidden className="absolute inset-0">
          <Image
            src={asset(site.heroImage)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-40"
          />
          {/* Voiles dégradés pour asseoir le texte et fondre les bords */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/55 to-bg" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-bg/70" />
        </div>
      )}

      {/* Halo doré qui « respire » lentement en arrière-plan */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(198,166,100,0.12), transparent 60%)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Fines lignes verticales évoquant les cordes du piano */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--ink) 0 1px, transparent 1px 84px)",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 78%)",
        }}
      />

      {/* Piano en filigrane — suit le scroll normalement, aucune retenue du défilement */}
      {!reduce && (
        <motion.div
          aria-hidden
          style={{ y: pianoY }}
          className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center opacity-[0.08]"
        >
          <div className="w-full max-w-4xl translate-y-1/3">
            <PianoMotif
              lidY={pianoLidY}
              lidRot={pianoLidRot}
              keysX={pianoKeysX}
              stringsOpacity={pianoStrings}
            />
          </div>
        </motion.div>
      )}

      <div className="relative mx-auto w-full max-w-[var(--max)] px-6 py-28 text-center">
        {/* Surtitre */}
        <motion.p
          custom={0.15}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="mb-7 text-[0.7rem] uppercase tracking-[0.42em] text-gold md:text-xs"
        >
          {site.hero.surtitre}
        </motion.p>

        {/* Nom — révélation par mot */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="font-serif text-[3.4rem] font-light leading-[0.95] tracking-tight text-ink sm:text-7xl md:text-8xl lg:text-[8.5rem]"
        >
          {words.map((w, i) => (
            <span
              key={i}
              className="mx-[0.12em] inline-block overflow-hidden pb-[0.08em] align-bottom"
            >
              <motion.span variants={word} className="inline-block">
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Filet doré */}
        <motion.div
          custom={1.15}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="hairline-gold mx-auto mt-9 h-px w-24"
        />

        {/* Piano interactif — chaque touche lance un morceau au hasard */}
        <motion.div
          custom={1.3}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="mt-10 md:mt-12"
        >
          <PianoHero />
        </motion.div>

        {/* Boutons */}
        <motion.div
          custom={1.5}
          variants={fade}
          initial="hidden"
          animate="visible"
          className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href={site.hero.ctaPrincipal.href}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-8 text-sm font-medium text-bg transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_0_30px_-6px_rgba(198,166,100,0.6)]"
          >
            {site.hero.ctaPrincipal.label}
          </a>
          <a
            href={site.hero.ctaSecondaire.href}
            className="inline-flex h-12 items-center justify-center rounded-full border border-line-strong px-8 text-sm text-ink transition-colors duration-300 hover:border-gold hover:text-gold"
          >
            {site.hero.ctaSecondaire.label}
          </a>
        </motion.div>
      </div>

      {/* Indicateur de défilement */}
      {!reduce && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-5 items-start justify-center rounded-full border border-line-strong pt-2"
          >
            <span className="h-1.5 w-px bg-gold" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
