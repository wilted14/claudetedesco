"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/content/site";
import { asset } from "@/lib/asset";

/**
 * Clavier de piano interactif (page d'accueil) : chaque touche — blanche ou
 * noire — lance un morceau AU HASARD parmi tous les enregistrements de la
 * médiathèque. Touches ivoire / laque noire, accent or, léger relief 3D.
 * Un seul <audio> ; la touche jouée reste éclairée. Respecte reduced-motion.
 */

type Flat = { titre: string; collection: string; src: string };

// 2 octaves : 14 touches blanches. Touches noires après les blanches d'index
// 0,1,3,4,5 dans chaque octave (Do#, Ré#, Fa#, Sol#, La#).
const WHITE_COUNT = 14;
const BLACK_AFTER = [0, 1, 3, 4, 5];
const WHITE_W = 100 / WHITE_COUNT;

const blackKeys = [0, 1].flatMap((oct) =>
  BLACK_AFTER.map((p) => {
    const whiteLeftIndex = oct * 7 + p;
    return { id: `b${whiteLeftIndex}`, leftIndex: whiteLeftIndex };
  }),
);

export function PianoHero() {
  const reduce = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastIndex = useRef(-1);

  const [nowPlaying, setNowPlaying] = useState<Flat | null>(null);
  const [playing, setPlaying] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const tracks = useMemo<Flat[]>(
    () =>
      site.medias.collections.flatMap((c) =>
        c.pistes.map((p) => ({
          titre: p.titre,
          collection: c.titre,
          src: p.src,
        })),
      ),
    [],
  );

  const playRandom = (keyId: string) => {
    const audio = audioRef.current;
    if (!audio || tracks.length === 0) return;
    let idx = Math.floor(Math.random() * tracks.length);
    if (tracks.length > 1) {
      while (idx === lastIndex.current)
        idx = Math.floor(Math.random() * tracks.length);
    }
    lastIndex.current = idx;
    const t = tracks[idx];
    audio.src = asset(t.src);
    setNowPlaying(t);
    setActiveKey(keyId);
    void audio.play();
  };

  const togglePause = () => {
    const audio = audioRef.current;
    if (!audio || !nowPlaying) return;
    playing ? audio.pause() : void audio.play();
  };

  return (
    <div className="mx-auto w-full max-w-xl md:max-w-2xl">
      <audio
        ref={audioRef}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setActiveKey(null);
        }}
      />

      {/* Le meuble du clavier */}
      <div
        className="relative rounded-xl border border-gold/25 bg-gradient-to-b from-[#161618] to-[#0a0a0c] p-2.5 shadow-[0_36px_70px_-34px_rgba(0,0,0,0.95)] sm:p-3"
        style={{ perspective: "1000px" }}
      >
        {/* Filet doré (abattant) */}
        <div className="mb-2 h-1 rounded-full bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

        {/* Clavier — légèrement incliné pour le relief */}
        <div
          className="relative select-none"
          style={{
            transform: reduce ? undefined : "rotateX(7deg)",
            transformOrigin: "center bottom",
          }}
        >
          {/* Touches blanches */}
          <div className="relative flex h-28 overflow-hidden rounded-b-md sm:h-36 md:h-44">
            {Array.from({ length: WHITE_COUNT }).map((_, i) => {
              const id = `w${i}`;
              const on = activeKey === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-label="Jouer un morceau au hasard"
                  onClick={() => playRandom(id)}
                  className={`relative h-full flex-1 border-l border-black/15 transition-[transform,filter] duration-100 first:border-l-0 active:translate-y-[3px] ${
                    on
                      ? "bg-gradient-to-b from-[#f6e6bf] to-[#e7cf95]"
                      : "bg-gradient-to-b from-[#faf8f2] to-[#e7e1d3] hover:from-white hover:to-[#efeadd]"
                  }`}
                  style={{
                    boxShadow: on
                      ? "inset 0 -14px 18px -12px rgba(198,166,100,0.9), inset 0 0 0 1px rgba(198,166,100,0.5)"
                      : "inset 0 -12px 14px -12px rgba(0,0,0,0.35)",
                  }}
                >
                  {/* liseré doré en pied de touche */}
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gold/30" />
                </button>
              );
            })}
          </div>

          {/* Touches noires */}
          {blackKeys.map(({ id, leftIndex }) => {
            const on = activeKey === id;
            const left = (leftIndex + 1) * WHITE_W - WHITE_W * 0.32;
            return (
              <button
                key={id}
                type="button"
                aria-label="Jouer un morceau au hasard"
                onClick={() => playRandom(id)}
                className="absolute top-0 z-10 h-[62%] rounded-b-[5px] transition-[transform,filter] duration-100 active:translate-y-[2px]"
                style={{
                  left: `${left}%`,
                  width: `${WHITE_W * 0.64}%`,
                  background: on
                    ? "linear-gradient(to bottom, #8a6d2e, #5f4a18)"
                    : "linear-gradient(to bottom, #2b2b31, #070708)",
                  boxShadow: on
                    ? "0 5px 8px rgba(0,0,0,0.6), 0 0 14px rgba(198,166,100,0.65), inset 0 1px 0 rgba(255,232,180,0.4)"
                    : "0 5px 7px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* En écoute */}
      <div className="mt-5 flex h-6 items-center justify-center gap-3 text-sm">
        {nowPlaying ? (
          <button
            type="button"
            onClick={togglePause}
            className="group inline-flex items-center gap-2.5 text-ink-soft transition-colors hover:text-gold"
            aria-label={playing ? "Mettre en pause" : "Reprendre"}
          >
            <Equalizer playing={playing} reduce={reduce} />
            <span className="text-ink">{nowPlaying.titre}</span>
            <span className="text-ink-mute">· {nowPlaying.collection}</span>
          </button>
        ) : (
          <span className="text-ink-mute">
            Touchez une note — laissez le hasard choisir un morceau
          </span>
        )}
      </div>
    </div>
  );
}

/* Petit égaliseur 3 barres (statique si reduced-motion ou en pause) */
function Equalizer({
  playing,
  reduce,
}: {
  playing: boolean;
  reduce: boolean | null;
}) {
  const bars = [0, 1, 2];
  return (
    <span className="flex h-4 items-end gap-[3px]" aria-hidden>
      {bars.map((b) => (
        <motion.span
          key={b}
          className="w-[3px] rounded-full bg-gold"
          initial={{ height: 5 }}
          animate={
            playing && !reduce
              ? { height: [5, 15, 8, 16, 6] }
              : { height: 6 }
          }
          transition={
            playing && !reduce
              ? {
                  duration: 0.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: b * 0.15,
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </span>
  );
}
