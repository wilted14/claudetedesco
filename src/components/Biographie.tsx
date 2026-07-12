"use client";

import Image from "next/image";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { useSite, useLanguage } from "@/content/LanguageContext";
import { asset } from "@/lib/asset";

export function Biographie() {
  const site = useSite();
  const { locale } = useLanguage();
  const { bio, artiste } = site;

  return (
    <section
      id="biographie"
      className="relative border-t border-line bg-bg-soft/70 py-24 md:py-36"
    >
      <div className="mx-auto grid max-w-[var(--max)] gap-14 px-6 md:grid-cols-[minmax(0,0.85fr)_1fr] md:gap-20">
        {/* Portrait */}
        <Reveal className="md:sticky md:top-28 md:self-start">
          <div className="relative">
            <TiltCard className="relative aspect-[4/5] overflow-hidden rounded-sm border border-line-strong bg-surface">
              {bio.portrait ? (
                <Image
                  src={asset(bio.portrait)}
                  alt={`Portrait de ${artiste.nom}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 440px"
                  className="object-cover"
                  style={{ objectPosition: bio.portraitPosition ?? "center" }}
                />
              ) : (
                // Cadre décoratif en attendant la vraie photo
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-surface-2 to-surface">
                  <span className="font-serif text-[6rem] leading-none text-line-strong">
                    {artiste.nom
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              )}
            </TiltCard>
            {/* Filet doré décoratif */}
            <div className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-sm border border-gold/30" />
          </div>
        </Reveal>

        {/* Texte */}
        <div>
          <Reveal>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
              {locale === "en" ? "About" : "À propos"}
            </p>
            <h2 className="font-serif text-4xl font-light text-ink md:text-5xl">
              {bio.titre}
            </h2>
            <div className="hairline-gold mt-6 h-px w-16" />
          </Reveal>

          <RevealStagger className="mt-8 space-y-5">
            {bio.paragraphes.map((p, i) => (
              <RevealItem key={i}>
                <p className="text-[1.02rem] leading-relaxed text-ink-soft">
                  {p}
                </p>
              </RevealItem>
            ))}
          </RevealStagger>

          {/* Repères chiffrés */}
          {bio.reperes?.length > 0 && (
            <RevealStagger className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-10">
              {bio.reperes.map((r, i) => (
                <RevealItem key={i}>
                  <div className="text-center md:text-left">
                    <div className="font-serif text-4xl text-gold md:text-5xl">
                      {r.valeur}
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-wider text-ink-mute">
                      {r.label}
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealStagger>
          )}
        </div>
      </div>
    </section>
  );
}
