"use client";

import { Mail } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/content/site";

export function Footer() {
  const { contact, artiste } = site;
  const annee = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="bg-hall relative border-t border-line py-24 md:py-32"
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
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {contact.reseaux.map((r) => (
              <li key={r.label}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm uppercase tracking-[0.2em] text-ink-soft transition-colors hover:text-gold"
                >
                  {r.label}
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
            © {annee} {artiste.nom}. Tous droits réservés.
          </span>
        </div>
      </div>
    </footer>
  );
}
