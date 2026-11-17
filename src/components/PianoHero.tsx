"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useSite, useLanguage } from "@/content/LanguageContext";
import { asset } from "@/lib/asset";

/**
 * Piano de la page d'accueil : une vidéo (travelling vers le clavier d'un piano
 * à queue) se joue une fois, puis se fige sur son image finale — un gros plan
 * des touches. Chaque touche devient alors interactive :
 *   • survol  → la touche s'illumine d'or et le titre qu'elle cache apparaît,
 *   • clic    → lance ce morceau (tiré au hasard dans tous les albums).
 * Les touches sont vues en perspective : on les reconstruit par homographie
 * (carré unité → quadrilatère du clavier dans l'image) et on les dessine en
 * SVG, ce qui donne des zones de survol/clic exactes à toutes les tailles.
 */

type Flat = { titre: string; collection: string; src: string };
type Pt = [number, number];

const VIDEO = "/images/piano-hero.mp4";
const STILL_START = "/images/piano-hero-start.jpg";
const STILL_END = "/images/piano-hero-end.jpg";

/* Repère de l'image finale (1280×720). u = le long du clavier, v = du fond
   (feutre rouge, v=0) vers le bord avant des touches blanches (v=1).
   Le quadrilatère couvre REF_KEYS touches blanches. */
const W = 1280;
const H = 720;
const REF_KEYS = 5;
const QUAD: [Pt, Pt, Pt, Pt] = [
  [839, 302], // fond, côté lointain   (u=0, v=0)
  [1201, 443], // fond, côté proche     (u=1, v=0)
  [530, 625], // avant, côté proche    (u=1, v=1)
  [258, 430], // avant, côté lointain  (u=0, v=1)
];
// Touches affichées : indices relatifs au quadrilatère de référence.
const KEY_FROM = -5;
const KEY_TO = 8;

/** Homographie carré unité → quadrilatère (Heckbert). */
function homography([p0, p1, p2, p3]: [Pt, Pt, Pt, Pt]) {
  const [x0, y0] = p0;
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const [x3, y3] = p3;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3;
  const sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dy1 * dx2;
  const g = (sx * dy2 - dx2 * sy) / den;
  const h = (dx1 * sy - sx * dy1) / den;
  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + h * x3;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + h * y3;
  return (u: number, v: number): Pt => {
    const w = g * u + h * v + 1;
    return [(a * u + b * v + x0) / w, (d * u + e * v + y0) / w];
  };
}

const project = homography(QUAD);

const KEYS = Array.from({ length: KEY_TO - KEY_FROM }, (_, n) => {
  const k = KEY_FROM + n;
  const u0 = k / REF_KEYS;
  const u1 = (k + 1) / REF_KEYS;
  const um = (u0 + u1) / 2;
  const pts = [project(u0, 0), project(u1, 0), project(u1, 1), project(u0, 1)];
  return {
    id: `k${n}`,
    points: pts.map((p) => p.map((c) => c.toFixed(1)).join(",")).join(" "),
    front: project(um, 1), // milieu du bord avant
    back: project(um, 0.05),
    // point d'ancrage du titre, gardé à l'intérieur du cadre
    anchor: ((p: Pt): Pt => [
      Math.min(W * 0.84, Math.max(W * 0.16, p[0])),
      Math.min(H * 0.82, Math.max(H * 0.3, p[1])),
    ])(project(um, 0.78)),
  };
});

function shuffled(n: number) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PianoHero() {
  const site = useSite();
  const { locale } = useLanguage();
  const reduce = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // « intro » = la vidéo se joue ; « ready » = image finale, touches actives
  const [phase, setPhase] = useState<"intro" | "ready">("intro");
  const [assign, setAssign] = useState<number[]>([]); // morceau par touche
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [nowPlaying, setNowPlaying] = useState<Flat | null>(null);
  const [playing, setPlaying] = useState(false);
  const reroll = useRef<number | null>(null);

  const en = locale === "en";

  const tracks = useMemo<Flat[]>(
    () =>
      site.medias.collections.flatMap((c) =>
        c.pistes.map((p) => ({
          titre: p.titre,
          collection: c.titre,
          src: p.src,
        })),
      ),
    [site],
  );

  // Tirage au sort côté client uniquement (pas d'écart d'hydratation)
  useEffect(() => {
    setAssign(shuffled(tracks.length).slice(0, KEYS.length));
  }, [tracks.length]);

  // Lancement de la vidéo (après l'apparition du bloc), avec replis
  useEffect(() => {
    if (reduce) {
      setPhase("ready");
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    let started = false;
    const onPlaying = () => (started = true);
    v.addEventListener("playing", onPlaying);
    const start = window.setTimeout(() => {
      v.play().catch(() => setPhase("ready"));
    }, 1100);
    // Lecture auto bloquée (économie d'énergie…) → on passe à l'image finale
    const guard = window.setTimeout(() => {
      if (!started) setPhase("ready");
    }, 3600);
    return () => {
      v.removeEventListener("playing", onPlaying);
      window.clearTimeout(start);
      window.clearTimeout(guard);
    };
  }, [reduce]);

  const trackOf = (key: number): Flat | undefined => tracks[assign[key]];

  const playKey = (key: number) => {
    const audio = audioRef.current;
    const t = trackOf(key);
    if (!audio || !t) return;
    audio.src = asset(t.src);
    setNowPlaying(t);
    setActiveKey(key);
    reroll.current = key;
    void audio.play();
  };

  // Après un clic, la touche reçoit un nouveau morceau dès qu'on la quitte :
  // chaque clic reste une surprise.
  const leaveKey = (key: number) => {
    setHovered((h) => (h === key ? null : h));
    if (reroll.current !== key || tracks.length <= KEYS.length) return;
    reroll.current = null;
    setAssign((cur) => {
      const used = new Set(cur);
      const free = tracks.map((_, i) => i).filter((i) => !used.has(i));
      if (free.length === 0) return cur;
      const next = [...cur];
      next[key] = free[Math.floor(Math.random() * free.length)];
      return next;
    });
  };

  const togglePause = () => {
    const audio = audioRef.current;
    if (!audio || !nowPlaying) return;
    if (playing) audio.pause();
    else void audio.play();
  };

  const ready = phase === "ready";
  const hoveredTrack = hovered !== null ? trackOf(hovered) : undefined;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <audio
        ref={audioRef}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setActiveKey(null);
        }}
      />

      <div className="relative aspect-video w-full select-none">
        {/* Halo doré derrière le piano */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-6 -inset-y-4 rounded-[50%] opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(198,166,100,0.16), transparent 68%)",
          }}
        />

        {/* Image détourée : les bords se fondent dans le décor */}
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, #000 16%, #000 84%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 18%, #000 80%, transparent 100%)",
            maskComposite: "intersect",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, #000 16%, #000 84%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 18%, #000 80%, transparent 100%)",
            WebkitMaskComposite: "source-in",
          }}
        >
          {!reduce && (
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              poster={asset(STILL_START)}
              onEnded={() => setPhase("ready")}
              onError={() => setPhase("ready")}
              onClick={() => setPhase("ready")}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={asset(VIDEO)} type="video/mp4" />
            </video>
          )}

          {/* Image finale (identique à la dernière image de la vidéo) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(STILL_END)}
            alt=""
            draggable={false}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Touches interactives */}
          {ready && (
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              role="group"
              aria-label={
                en ? "Piano keys — each plays a track" : "Touches du piano — chacune joue un morceau"
              }
            >
              <defs>
                {KEYS.map((k) => (
                  <linearGradient
                    key={k.id}
                    id={`glow-${k.id}`}
                    gradientUnits="userSpaceOnUse"
                    x1={k.front[0]}
                    y1={k.front[1]}
                    x2={k.back[0]}
                    y2={k.back[1]}
                  >
                    <stop offset="0" stopColor="#f3d590" stopOpacity="0.85" />
                    <stop offset="0.45" stopColor="#c6a664" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#c6a664" stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>
              {KEYS.map((k, i) => {
                const t = trackOf(i);
                const lit = hovered === i;
                const on = activeKey === i;
                return (
                  <polygon
                    key={k.id}
                    points={k.points}
                    fill={`url(#glow-${k.id})`}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      t
                        ? `${en ? "Play" : "Écouter"} ${t.titre} — ${t.collection}`
                        : en
                          ? "Play a track"
                          : "Écouter un morceau"
                    }
                    onPointerEnter={() => setHovered(i)}
                    onPointerLeave={() => leaveKey(i)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => leaveKey(i)}
                    onClick={() => playKey(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        playKey(i);
                      }
                    }}
                    className={`cursor-pointer outline-none transition-opacity ${
                      lit
                        ? "opacity-100 duration-300"
                        : on
                          ? "opacity-60 duration-700"
                          : "opacity-0 duration-700"
                    }`}
                    style={{ pointerEvents: "all" }}
                  />
                );
              })}
            </svg>
          )}
        </div>

        {/* Titre « féerique » au-dessus de la touche survolée */}
        <AnimatePresence>
          {ready && hovered !== null && hoveredTrack && (
            <motion.div
              key={`${hovered}-${hoveredTrack.src}`}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute z-10"
              style={{
                left: `${(KEYS[hovered].anchor[0] / W) * 100}%`,
                top: `${(KEYS[hovered].anchor[1] / H) * 100}%`,
              }}
            >
              <div className="relative -translate-x-1/2 -translate-y-[130%] whitespace-nowrap text-center">
                {/* Brume sombre : garde le titre lisible sur les touches claires */}
                <span
                  aria-hidden
                  className="absolute -inset-x-8 -inset-y-3 rounded-[50%] bg-black/70 blur-lg"
                />
                <Sparkles reduce={reduce} />
                <span
                  className="relative block font-serif text-base italic text-[#f6e3b4] sm:text-lg md:text-xl"
                  style={{
                    textShadow:
                      "0 0 18px rgba(198,166,100,0.75), 0 0 2px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.85)",
                  }}
                >
                  {hoveredTrack.titre}
                </span>
                <span
                  className="relative mt-0.5 block text-[0.55rem] uppercase tracking-[0.32em] text-ink-soft sm:text-[0.6rem]"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.95)" }}
                >
                  {hoveredTrack.collection}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* En écoute + bouton pause */}
      <div className="mt-3 flex min-h-9 items-center justify-center gap-3 text-sm">
        {nowPlaying ? (
          <>
            <button
              type="button"
              onClick={togglePause}
              aria-label={
                playing
                  ? en
                    ? "Pause the music"
                    : "Mettre la musique en pause"
                  : en
                    ? "Resume the music"
                    : "Reprendre la musique"
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/60 bg-gold/10 text-gold shadow-[0_0_20px_-8px_rgba(198,166,100,0.8)] transition-all duration-300 hover:bg-gold hover:text-bg hover:shadow-[0_0_24px_-6px_rgba(198,166,100,0.9)]"
            >
              {playing ? (
                <Pause size={15} />
              ) : (
                <Play size={15} className="ml-0.5" />
              )}
            </button>
            <Equalizer playing={playing} reduce={reduce} />
            <span className="min-w-0 truncate">
              <span className="text-ink">{nowPlaying.titre}</span>
              <span className="text-ink-mute"> · {nowPlaying.collection}</span>
            </span>
          </>
        ) : (
          <span
            className={`text-ink-mute transition-opacity duration-700 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          >
            {en
              ? "Brush a key to reveal a title — click to listen"
              : "Effleurez une touche pour révéler un titre — cliquez pour l'écouter"}
          </span>
        )}
      </div>
    </div>
  );
}

/* Poussière d'étoiles autour du titre */
const SPARKS = [
  { x: -46, y: -6, d: 0, s: 3 },
  { x: -18, y: -20, d: 0.25, s: 2 },
  { x: 14, y: -24, d: 0.1, s: 2.5 },
  { x: 44, y: -10, d: 0.4, s: 3 },
  { x: 58, y: 10, d: 0.55, s: 2 },
  { x: -60, y: 12, d: 0.35, s: 2 },
];

function Sparkles({ reduce }: { reduce: boolean | null }) {
  if (reduce) return null;
  return (
    <span aria-hidden className="absolute left-1/2 top-1/2">
      {SPARKS.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#ffe9b0]"
          style={{
            left: `${p.x}%`,
            top: p.y,
            width: p.s,
            height: p.s,
            marginLeft: p.x,
            boxShadow: "0 0 8px 1px rgba(255,225,160,0.9)",
          }}
          initial={{ opacity: 0, scale: 0, y: 6 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0.4],
            y: [6, -6, -16],
          }}
          transition={{
            duration: 1.6,
            delay: p.d,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </span>
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
