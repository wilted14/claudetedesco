"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site";

export function Nav() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Empêche le défilement de l'arrière-plan quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ opacity: 0, y: reduce ? 0 : -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        open
          ? "border-b border-line bg-bg"
          : scrolled
            ? "border-b border-line bg-bg/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[var(--max)] items-center justify-between px-6 md:h-20">
        <a
          href="/"
          onClick={(e) => {
            // Recharge complètement le site et revient en haut
            e.preventDefault();
            window.history.replaceState(null, "", "/");
            window.location.reload();
          }}
          className="font-serif text-lg tracking-wide text-ink transition-colors hover:text-gold md:text-xl"
        >
          {site.artiste.nom}
        </a>

        {/* Liens — bureau */}
        <ul className="hidden items-center gap-9 md:flex">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group relative text-sm text-ink-soft transition-colors hover:text-ink"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Bouton menu — mobile */}
        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center text-ink md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Panneau mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-16 z-40 bg-bg md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-6">
              {site.nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: reduce ? 0 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.05 }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line py-4 font-serif text-2xl text-ink transition-colors hover:text-gold"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
