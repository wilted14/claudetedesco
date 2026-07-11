"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Music2, Film } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion/Reveal";
import { site } from "@/content/site";
import { asset } from "@/lib/asset";

export function Medias() {
  const { medias } = site;

  return (
    <section
      id="medias"
      className="relative border-t border-line bg-bg-soft/70 py-24 md:py-36"
    >
      <div className="mx-auto max-w-[var(--max)] px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
            Écouter &amp; regarder
          </p>
          <h2 className="font-serif text-4xl font-light text-ink md:text-5xl">
            {medias.titre}
          </h2>
          <div className="hairline-gold mx-auto mt-6 h-px w-16" />
          <p className="mt-6 text-ink-soft">{medias.intro}</p>
        </Reveal>

        {/* Lecteur Spotify officiel */}
        <Reveal className="mt-14">
          <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
            <iframe
              title="Claude Tedesco sur Spotify"
              src={`https://open.spotify.com/embed/artist/${medias.spotifyArtistId}?utm_source=generator&theme=0`}
              width="100%"
              height="352"
              loading="lazy"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="block"
            />
          </div>
        </Reveal>

        {/* Enregistrements, organisés par collection */}
        {medias.collections.length > 0 && (
          <div className="mt-16">
            <div className="mb-8 flex items-center gap-2 text-ink-mute">
              <Music2 size={16} className="text-gold" />
              <span className="text-xs uppercase tracking-[0.2em]">
                Enregistrements
              </span>
            </div>
            <AudioCollections collections={medias.collections} />
          </div>
        )}

        {/* Vidéos */}
        <div className="mt-16">
          <div className="mb-6 flex items-center gap-2 text-ink-mute">
            <Film size={16} className="text-gold" />
            <span className="text-xs uppercase tracking-[0.2em]">Vidéos</span>
          </div>
          <RevealStagger className="grid gap-6 md:grid-cols-2">
            {medias.video.map((v, i) => (
              <RevealItem key={i}>
                <VideoLocal {...v} />
              </RevealItem>
            ))}
            <RevealItem>
              <YouTubeCard href={medias.youtubeChannel} />
            </RevealItem>
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Lecteur audio -------------------------------- */

type Piste = { titre: string; src: string };
type Collection = { titre: string; sousTitre?: string; pistes: Piste[] };

/**
 * Discographie en collections, navigation par ONGLETS horizontaux : on choisit
 * la collection en haut, seule sa liste s'affiche (pas de scroll interminable).
 * Un SEUL <audio> partagé → la lecture continue même en changeant d'onglet, et
 * l'onglet en cours de lecture affiche un point doré. Lecture optimiste :
 * « indisponible » seulement si le fichier échoue réellement (fiable iOS).
 */
function AudioCollections({ collections }: { collections: Collection[] }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [active, setActive] = useState(0);
  const [current, setCurrent] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<string>("");
  const [errored, setErrored] = useState<Set<string>>(new Set());

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const toggle = (id: string, src: string) => {
    if (!src || errored.has(id)) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (current === id) {
      playing ? audio.pause() : void audio.play();
    } else {
      audio.src = asset(src);
      setCurrent(id);
      setProgress(0);
      setDuration("");
      void audio.play();
    }
  };

  // Collection contenant le morceau en cours de lecture
  const playingCol = current ? Number(current.split("-")[0]) : null;
  const col = collections[active];

  return (
    <div>
      <audio
        ref={audioRef}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onError={() =>
          setErrored((s) => (current === null ? s : new Set(s).add(current)))
        }
        onLoadedMetadata={(e) => setDuration(fmt(e.currentTarget.duration))}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          if (el.duration) setProgress((el.currentTime / el.duration) * 100);
        }}
      />

      {/* Onglets horizontaux (défilables sur mobile) */}
      <div
        role="tablist"
        aria-label="Collections"
        className="-mx-1 flex gap-1 overflow-x-auto border-b border-line px-1 [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {collections.map((cc, c) => {
          const isActive = active === c;
          const isPlayingHere = playingCol === c && playing;
          return (
            <button
              key={c}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(c)}
              className={`group relative shrink-0 whitespace-nowrap px-4 py-3 text-sm transition-colors ${
                isActive ? "text-ink" : "text-ink-mute hover:text-ink"
              }`}
            >
              <span className="font-serif text-base md:text-lg">{cc.titre}</span>
              <span className="ml-2 align-middle text-xs tabular-nums text-ink-mute">
                {cc.pistes.length}
              </span>
              {isPlayingHere && (
                <span
                  aria-hidden
                  className="ml-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gold align-middle"
                />
              )}
              {/* Soulignement actif */}
              <span
                aria-hidden
                className={`absolute -bottom-px left-2 right-2 h-0.5 rounded-full transition-colors ${
                  isActive ? "bg-gold" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Sous-titre de la collection active */}
      {col.sousTitre && (
        <p className="mt-6 px-1 text-[0.65rem] uppercase tracking-[0.3em] text-gold">
          {col.sousTitre}
        </p>
      )}

      {/* Liste de la collection active (fondu au changement d'onglet) */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mt-3 overflow-hidden rounded-sm border border-line"
      >
        <ul>
          {col.pistes.map((t, i) => {
            const id = `${active}-${i}`;
            const isActive = current === id;
            const isPlaying = isActive && playing;
            const failed = errored.has(id) || !t.src;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => toggle(id, t.src)}
                  disabled={failed}
                  aria-label={`${isPlaying ? "Mettre en pause" : "Lire"} ${t.titre}`}
                  className={`group flex w-full items-center gap-4 border-b border-line px-5 py-3.5 text-left transition-colors last:border-b-0 ${
                    failed ? "cursor-default" : "hover:bg-surface"
                  } ${isActive ? "bg-surface" : ""}`}
                >
                  {/* Numéro ↔ lecture */}
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
                    <span
                      className={`text-sm tabular-nums transition-opacity ${
                        isActive
                          ? "opacity-0"
                          : "text-ink-mute group-hover:opacity-0"
                      } ${failed ? "opacity-30" : ""}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`absolute inset-0 flex items-center justify-center rounded-full transition-opacity ${
                        isActive
                          ? "bg-gold text-bg opacity-100"
                          : "text-gold opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {isPlaying ? (
                        <Pause size={14} />
                      ) : (
                        <Play size={14} className="ml-0.5" />
                      )}
                    </span>
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate font-serif text-lg transition-colors ${
                        isActive ? "text-gold" : "text-ink"
                      }`}
                    >
                      {t.titre}
                    </span>
                    {failed && (
                      <span className="block truncate text-sm text-ink-mute">
                        indisponible
                      </span>
                    )}
                  </span>

                  {isActive && duration && (
                    <span className="shrink-0 text-sm tabular-nums text-ink-mute">
                      {duration}
                    </span>
                  )}
                </button>
                {isActive && !failed && (
                  <div className="h-0.5 w-full bg-line">
                    <div
                      className="h-full bg-gold transition-[width] duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}

/* ----------------------------- Vidéo locale ------------------------------- */

function VideoLocal({
  titre,
  sousTitre,
  src,
  poster,
}: {
  titre: string;
  sousTitre: string;
  src: string;
  poster?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="overflow-hidden rounded-sm border border-line bg-surface">
      <div className="relative aspect-video w-full bg-bg-soft">
        {!failed ? (
          <video
            controls
            playsInline
            preload="metadata"
            poster={poster ? asset(poster) : undefined}
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={asset(src)} type="video/mp4" />
          </video>
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-3 bg-cover bg-center text-ink-mute"
            style={
              poster ? { backgroundImage: `url("${asset(poster)}")` } : undefined
            }
          >
            <div className="absolute inset-0 bg-bg/70" />
            <Film size={26} className="relative text-line-strong" />
            <span className="relative text-xs uppercase tracking-[0.2em]">
              Vidéo indisponible
            </span>
          </div>
        )}
      </div>
      <figcaption className="flex items-baseline justify-between gap-4 px-5 py-4">
        <span className="min-w-0 truncate font-serif text-lg text-ink">
          {titre}
        </span>
        <span className="shrink-0 text-sm text-ink-mute">{sousTitre}</span>
      </figcaption>
    </figure>
  );
}

/* --------------------------- Carte chaîne YouTube ------------------------- */

function YouTubeCard({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex aspect-video flex-col items-center justify-center gap-4 rounded-sm border border-line bg-surface p-6 text-center transition-colors hover:border-gold"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line-strong text-gold transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-bg">
        <Film size={26} />
      </span>
      <span className="font-serif text-xl text-ink">Chaîne YouTube</span>
      <span className="inline-flex items-center gap-1 text-sm text-ink-soft transition-colors group-hover:text-gold">
        Voir toutes les vidéos <span aria-hidden>↗</span>
      </span>
    </a>
  );
}
