"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Music2, Film, X } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { useSite, useLanguage } from "@/content/LanguageContext";
import { asset } from "@/lib/asset";

const UI = {
  fr: {
    listenWatch: "Écouter & regarder",
    recordings: "Enregistrements",
    videos: "Vidéos",
    unavailable: "indisponible",
    videoUnavailable: "Vidéo indisponible",
    youtubeChannel: "Chaîne YouTube",
    seeAllVideos: "Voir toutes les vidéos",
    collections: "Collections",
    pause: "Mettre en pause",
    play: "Lire",
    close: "Fermer",
  },
  en: {
    listenWatch: "Listen & watch",
    recordings: "Recordings",
    videos: "Videos",
    unavailable: "unavailable",
    videoUnavailable: "Video unavailable",
    youtubeChannel: "YouTube Channel",
    seeAllVideos: "See all videos",
    collections: "Collections",
    pause: "Pause",
    play: "Play",
    close: "Close",
  },
} as const;

export function Medias() {
  const site = useSite();
  const { locale } = useLanguage();
  const ui = UI[locale];
  const { medias } = site;

  return (
    <section
      id="medias"
      className="relative border-t border-line bg-bg-soft/70 py-24 md:py-36"
    >
      <div className="mx-auto max-w-[var(--max)] px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
            {ui.listenWatch}
          </p>
          <h2 className="font-serif text-4xl font-light text-ink md:text-5xl">
            {medias.titre}
          </h2>
          <div className="hairline-gold mx-auto mt-6 h-px w-16" />
          <p className="mt-6 text-ink-soft">{medias.intro}</p>
        </Reveal>

        {/* Enregistrements, organisés par collection */}
        {medias.collections.length > 0 && (
          <div className="mt-16 md:mt-20">
            <div className="mb-8 flex items-center gap-2 text-ink-mute">
              <Music2 size={16} className="text-gold" />
              <span className="text-xs uppercase tracking-[0.2em]">
                {ui.recordings}
              </span>
            </div>
            <AudioCollections collections={medias.collections} ui={ui} />
          </div>
        )}

        {/* Vidéos */}
        <div className="mt-16 md:mt-20">
          <div className="mb-6 flex items-center gap-2 text-ink-mute">
            <Film size={16} className="text-gold" />
            <span className="text-xs uppercase tracking-[0.2em]">
              {ui.videos}
            </span>
          </div>
          <VideoGallery
            videos={medias.video}
            youtube={medias.youtubeChannel}
            ui={ui}
          />
        </div>
      </div>
    </section>
  );
}

type Ui = Record<keyof (typeof UI)["fr"], string>;

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
function AudioCollections({
  collections,
  ui,
}: {
  collections: Collection[];
  ui: Ui;
}) {
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
        aria-label={ui.collections}
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
                  aria-label={`${isPlaying ? ui.pause : ui.play} ${t.titre}`}
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
                        {ui.unavailable}
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

/* ----------------------------- Galerie vidéos ----------------------------- */

type Video = {
  titre: string;
  sousTitre: string;
  src: string;
  poster?: string;
};

/**
 * Grille de vignettes uniformes (poster + bouton lecture), même langage visuel
 * que la galerie photos : épuré, pas de lecteurs empilés. Un clic ouvre la
 * vidéo en plein écran dans une modale. La chaîne YouTube ferme la grille.
 */
function VideoGallery({
  videos,
  youtube,
  ui,
}: {
  videos: Video[];
  youtube: string;
  ui: Ui;
}) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = open !== null ? videos[open] : null;

  return (
    <>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-3">
        {videos.map((v, i) => (
          <Reveal key={i} delay={(i % 3) * 0.05}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`${ui.play} — ${v.titre}`}
              className="group relative block aspect-video w-full overflow-hidden bg-surface text-left"
            >
              {v.poster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset(v.poster)}
                  alt={v.titre}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
              )}
              {/* Voile pour lisibilité du titre */}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/85 via-bg/10 to-transparent" />
              <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/0 transition-all duration-500 group-hover:ring-gold/50" />

              {/* Bouton lecture central */}
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-bg/40 text-ink backdrop-blur-sm transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-bg">
                <Play size={20} className="ml-0.5" />
              </span>

              {/* Titre + sous-titre en bas */}
              <span className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-3 p-4">
                <span className="min-w-0 truncate font-serif text-lg text-ink">
                  {v.titre}
                </span>
                <span className="shrink-0 text-xs uppercase tracking-[0.15em] text-ink-mute">
                  {v.sousTitre}
                </span>
              </span>
            </button>
          </Reveal>
        ))}

        {/* Carte chaîne YouTube — même format de cellule */}
        <Reveal delay={0.05}>
          <a
            href={youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex aspect-video w-full flex-col items-center justify-center gap-3 bg-surface p-6 text-center ring-1 ring-inset ring-line transition-all duration-500 hover:ring-gold/50"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line-strong text-gold transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-bg">
              <Film size={24} />
            </span>
            <span className="font-serif text-xl text-ink">
              {ui.youtubeChannel}
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-ink-soft transition-colors group-hover:text-gold">
              {ui.seeAllVideos} <span aria-hidden>↗</span>
            </span>
          </a>
        </Reveal>
      </div>

      {/* Modale de lecture */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/95 p-4 backdrop-blur-sm md:p-10"
            onClick={() => setOpen(null)}
          >
            <div
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                key={active.src}
                controls
                autoPlay
                playsInline
                poster={active.poster ? asset(active.poster) : undefined}
                className="max-h-[82vh] w-full rounded-sm bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
              >
                <source src={asset(active.src)} type="video/mp4" />
              </video>

              <div className="mt-4 flex items-baseline justify-between gap-4 px-1">
                <span className="font-serif text-xl text-ink">
                  {active.titre}
                </span>
                <span className="shrink-0 text-sm text-ink-mute">
                  {active.sousTitre}
                </span>
              </div>

              <button
                type="button"
                aria-label={ui.close}
                onClick={() => setOpen(null)}
                className="absolute -right-2 -top-2 flex h-11 w-11 items-center justify-center rounded-full bg-gold text-bg shadow-[0_8px_28px_-6px_rgba(198,166,100,0.75)] ring-1 ring-gold-bright/40 transition-colors duration-200 hover:bg-gold-bright md:h-12 md:w-12"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
