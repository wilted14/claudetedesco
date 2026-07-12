"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSite, useLanguage } from "@/content/LanguageContext";

export function Nav() {
  const site = useSite();
  const { locale, setLocale } = useLanguage();
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
        <div className="hidden items-center gap-9 md:flex">
          <ul className="flex items-center gap-9">
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
          <LanguageToggle locale={locale} setLocale={setLocale} />
        </div>

        {/* Mobile : langue + bouton menu */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle locale={locale} setLocale={setLocale} />
          <button
            type="button"
            aria-label={open ? (locale === "en" ? "Close menu" : "Fermer le menu") : (locale === "en" ? "Open menu" : "Ouvrir le menu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center text-ink"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
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

/* Sélecteur de langue — discret, pastille à curseur doré coulissant */
function LanguageToggle({
  locale,
  setLocale,
}: {
  locale: "fr" | "en";
  setLocale: (l: "fr" | "en") => void;
}) {
  return (
    <div
      role="group"
      aria-label="Langue / Language"
      className="relative flex h-7 items-center rounded-full border border-line-strong bg-surface/60 p-0.5 text-[0.65rem] font-medium uppercase tracking-wider"
    >
      <motion.span
        aria-hidden
        className="absolute inset-y-0.5 w-7 rounded-full bg-gold"
        animate={{ x: locale === "fr" ? 0 : 28 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
      <button
        type="button"
        onClick={() => setLocale("fr")}
        aria-pressed={locale === "fr"}
        className={`relative z-10 flex h-6 w-7 items-center justify-center rounded-full transition-colors duration-200 ${
          locale === "fr" ? "text-bg" : "text-ink-mute hover:text-ink"
        }`}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`relative z-10 flex h-6 w-7 items-center justify-center rounded-full transition-colors duration-200 ${
          locale === "en" ? "text-bg" : "text-ink-mute hover:text-ink"
        }`}
      >
        EN
      </button>
    </div>
  );
}
