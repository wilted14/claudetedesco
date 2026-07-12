"use client";

import { Mail } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { useSite, useLanguage } from "@/content/LanguageContext";

export function Footer() {
  const site = useSite();
  const { locale } = useLanguage();
  const { contact, artiste } = site;
  const annee = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="bg-hall-veil relative border-t border-line py-24 md:py-32"
    >
      <div className="mx-auto max-w-[var(--max)] px-6 text-center">
        <Reveal>
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
            {contact.titre}
          </p>
          <h2 className="text-balance font-serif text-4xl font-light text-ink md:text-6xl">
            {contact.intro}
          </h2>

          <a
            href={`mailto:${contact.email}`}
            className="group mt-10 inline-flex items-center gap-3 text-lg text-ink transition-colors hover:text-gold md:text-2xl"
          >
            <Mail size={20} className="text-gold" />
            <span className="border-b border-line-strong pb-1 transition-colors group-hover:border-gold">
              {contact.email}
            </span>
          </a>
        </Reveal>

        {/* Réseaux */}
        <Reveal delay={0.1}>
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {contact.reseaux.map((r) => (
              <li key={r.label}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={r.label}
                  className="group inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-gold"
                >
                  {r.label === "YouTube" ? (
                    <YouTubeLogo />
                  ) : (
                    <span className="text-sm uppercase tracking-[0.2em]">
                      {r.label}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Bas de page */}
        <div className="mt-20 flex flex-col items-center gap-3 border-t border-line pt-8 text-xs text-ink-mute sm:flex-row sm:justify-between">
          <span className="font-serif text-base text-ink-soft">
            {artiste.nom}
          </span>
          <span>
            © {annee} {artiste.nom}.{" "}
            {locale === "en" ? "All rights reserved." : "Tous droits réservés."}
          </span>
        </div>
      </div>
    </footer>
  );
}

/* Logo YouTube officiel (badge rouge) — devient plus lumineux au survol */
function YouTubeLogo() {
  return (
    <svg
      viewBox="0 0 28 20"
      width="34"
      height="24"
      role="img"
      aria-hidden
      className="transition-transform duration-300 group-hover:scale-105"
    >
      <path
        fill="#FF0033"
        d="M27.4 3.1a3.5 3.5 0 0 0-2.46-2.48C22.77 0 14 0 14 0S5.23 0 3.06.62A3.5 3.5 0 0 0 .6 3.1 36.5 36.5 0 0 0 0 10a36.5 36.5 0 0 0 .6 6.9 3.5 3.5 0 0 0 2.46 2.48C5.23 20 14 20 14 20s8.77 0 10.94-.62a3.5 3.5 0 0 0 2.46-2.48A36.5 36.5 0 0 0 28 10a36.5 36.5 0 0 0-.6-6.9Z"
      />
      <path fill="#fff" d="M11.2 14.3 18.5 10l-7.3-4.3v8.6Z" />
    </svg>
  );
}
