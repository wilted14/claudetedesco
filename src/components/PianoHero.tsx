"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
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
// Masque des pixels « touche blanche » de l'image finale : les surbrillances
// épousent ainsi la forme réelle de chaque touche (les noires la découpent).
const KEYS_MASK = "/images/piano-hero-keys-mask.jpg";

/* Repère de l'image finale (1280×720). u = le long du clavier, v = vers le
   bord avant des touches blanches (v=1) ; le fond du clavier (feutre rouge)
   est vers v = V_BACK. Le quadrilatère couvre REF_KEYS touches blanches.
   Ses coins sont AJUSTÉS sur les rainures réelles entre les touches,
   détectées par analyse des pixels de l'image (écart < 1 px). */
const W = 1280;
const H = 720;
const REF_KEYS = 5;
const QUAD: [Pt, Pt, Pt, Pt] = [
  [625.4, 361], // côté lointain          (u=0, v=0)
  [984.9, 521.3], // côté proche          (u=1, v=0)
  [613.1, 684.5], // avant, côté proche   (u=1, v=1)
  [292.3, 454.6], // avant, côté lointain (u=0, v=1)
];
const V_BACK = -0.7;
// Touches affichées : indices relatifs au quadrilatère de référence.
const KEY_FROM = -5;
const KEY_TO = 7;

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
  const f0 = project(u0, 1); // bord avant, côté lointain
  const f1 = project(u1, 1); // bord avant, côté proche
  const edge = Math.hypot(f1[0] - f0[0], f1[1] - f0[1]);
  const face = edge * 0.68; // hauteur visible de la face avant de la touche
  const dip = edge * 0.2; // enfoncement du bord avant quand on appuie
  const str = (pts: Pt[]) =>
    pts.map((p) => p.map((c) => c.toFixed(1)).join(",")).join(" ");
  const top: Pt[] = [project(u0, V_BACK), project(u1, V_BACK), f1, f0];
  // dessus + face avant (prolongée de l'enfoncement) : zone de la touche
  const body = (extra: number): Pt[] => [
    project(u0, V_BACK),
    project(u1, V_BACK),
    f1,
    [f1[0], f1[1] + face + extra],
    [f0[0], f0[1] + face + extra],
    f0,
  ];
  // La touche pivote à l'arrière : le déplacement vertical croît de 0 (fond)
  // à `dip` (bord avant). C'est une transformation affine de l'image.
  const front = project(um, 1);
  const pivot = project(um, V_BACK);
  const ax = front[0] - pivot[0];
  const ay = front[1] - pivot[1];
  const len2 = ax * ax + ay * ay;
  const nx = ax / len2;
  const ny = ay / len2;
  const pressed = `matrix(1, ${(dip * nx).toFixed(5)}, 0, ${(1 + dip * ny).toFixed(5)}, 0, ${(-dip * (pivot[0] * nx + pivot[1] * ny)).toFixed(3)})`;
  return {
    id: `k${n}`,
    points: str(top),
    hit: str(body(0)),
    clip: str(body(dip)),
    pressed,
    front, // milieu du bord avant
    back: project(um, V_BACK * 0.85),
    // point d'ancrage du titre, gardé à l'intérieur du cadre
    anchor: ((p: Pt): Pt => [
      Math.min(W * 0.84, Math.max(W * 0.16, p[0])),
      Math.min(H * 0.82, Math.max(H * 0.3, p[1])),
    ])(project(um, 0.62)),
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

  // Touche enfoncée : `pressKey` garde la dernière touche pressée pour que
  // l'animation de remontée puisse se jouer ; `down` = doigt/souris appuyé.
  const [pressKey, setPressKey] = useState<number | null>(null);
  const [down, setDown] = useState(false);
  const downAt = useRef(0);
  const releaseTimer = useRef<number | undefined>(undefined);

  const pressDown = (key: number) => {
    window.clearTimeout(releaseTimer.current);
    // eslint-disable-next-line react-hooks/purity -- appelé dans un gestionnaire, pas au rendu
    downAt.current = performance.now();
    setPressKey(key);
    setDown(true);
  };
  // On laisse la touche en bas au moins un instant, même sur un clic éclair
  const pressUp = () => {
    // eslint-disable-next-line react-hooks/purity -- appelé dans un gestionnaire, pas au rendu
    const wait = Math.max(0, 170 - (performance.now() - downAt.current));
    window.clearTimeout(releaseTimer.current);
    releaseTimer.current = window.setTimeout(() => setDown(false), wait);
  };
  useEffect(() => () => window.clearTimeout(releaseTimer.current), []);

  // Au défilement : le clavier bascule légèrement vers le spectateur, grossit,
  // et un reflet doré balaie les touches.
  const { scrollY } = useScroll();
  const tilt = useTransform(scrollY, [0, 650], [0, 16]);
  const zoom = useTransform(scrollY, [0, 650], [1, 1.1]);
  const lift = useTransform(scrollY, [0, 650], [0, -36]);
  const sheenX = useTransform(scrollY, [0, 650], ["-130%", "130%"]);
  const sheenO = useTransform(scrollY, [0, 80, 520, 650], [0, 1, 1, 0]);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tirage aléatoire réservé au client
    setAssign(shuffled(tracks.length).slice(0, KEYS.length));
  }, [tracks.length]);

  // Lancement de la vidéo (après l'apparition du bloc), avec replis
  useEffect(() => {
    if (reduce) return;
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

  const ready = phase === "ready" || Boolean(reduce);
  const glowCls = (i: number) =>
    `transition-opacity ${
      hovered === i
        ? "opacity-100 duration-300"
        : activeKey === i
          ? "opacity-55 duration-700"
          : "opacity-0 duration-700"
    }`;
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

      <motion.div
        className="relative aspect-video w-full select-none"
        style={
          reduce
            ? undefined
            : {
                rotateX: tilt,
                scale: zoom,
                y: lift,
                transformPerspective: 1100,
                transformOrigin: "50% 100%",
              }
        }
      >
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
                <mask
                  id="pk-whites"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width={W}
                  height={H}
                >
                  <image
                    href={asset(KEYS_MASK)}
                    width={W}
                    height={H}
                    preserveAspectRatio="none"
                  />
                </mask>
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
                    <stop offset="0" stopColor="#f0d28c" stopOpacity="0.3" />
                    <stop offset="0.45" stopColor="#c6a664" stopOpacity="0.15" />
                    <stop offset="1" stopColor="#c6a664" stopOpacity="0.03" />
                  </linearGradient>
                ))}
                {pressKey !== null && (
                  <clipPath id="pk-press-clip">
                    <polygon points={KEYS[pressKey].clip} />
                  </clipPath>
                )}
              </defs>

              {/* Surbrillances dorées : uniquement le DESSUS de la touche (pas sa face
                  avant), découpées sur la forme réelle des touches */}
              <g mask="url(#pk-whites)" style={{ pointerEvents: "none" }}>
                {KEYS.map((k, i) =>
                  i === pressKey ? null : (
                    <polygon
                      key={k.id}
                      points={k.points}
                      fill={`url(#glow-${k.id})`}
                      className={glowCls(i)}
                    />
                  ),
                )}
              </g>

              {/* Touche enfoncée : sa portion d'image bascule vers le bas (pivot
                  à l'arrière), dans l'ombre des touches voisines. */}
              {pressKey !== null && (
                <g
                  clipPath="url(#pk-press-clip)"
                  style={{ pointerEvents: "none" }}
                >
                  <polygon
                    points={KEYS[pressKey].clip}
                    fill="#1c140a"
                    mask="url(#pk-whites)"
                    style={{
                      opacity: down ? 0.82 : 0,
                      transition: `opacity ${down ? 70 : 240}ms ease`,
                    }}
                  />
                  <g
                    style={{
                      transform: down
                        ? KEYS[pressKey].pressed
                        : "matrix(1, 0, 0, 1, 0, 0)",
                      transition: down
                        ? "transform 85ms cubic-bezier(0.3, 0, 0.5, 1)"
                        : "transform 280ms cubic-bezier(0.2, 0.9, 0.3, 1.25)",
                    }}
                  >
                    <g mask="url(#pk-whites)">
                      <image
                        href={asset(STILL_END)}
                        width={W}
                        height={H}
                        preserveAspectRatio="none"
                        style={{
                          filter: down ? "brightness(0.9)" : "brightness(1)",
                          transition: "filter 160ms ease",
                        }}
                      />
                      <polygon
                        points={KEYS[pressKey].points}
                        fill={`url(#glow-${KEYS[pressKey].id})`}
                        className={glowCls(pressKey)}
                      />
                    </g>
                  </g>
                </g>
              )}

              {/* Zones de survol / clic (invisibles) */}
              {KEYS.map((k, i) => {
                const t = trackOf(i);
                return (
                  <polygon
                    key={k.id}
                    points={k.hit}
                    fill="transparent"
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
                    onPointerLeave={() => {
                      leaveKey(i);
                      if (pressKey === i) pressUp();
                    }}
                    onPointerDown={() => pressDown(i)}
                    onPointerUp={pressUp}
                    onPointerCancel={pressUp}
                    onFocus={() => setHovered(i)}
                    onBlur={() => leaveKey(i)}
                    onClick={() => playKey(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        pressDown(i);
                        pressUp();
                        playKey(i);
                      }
                    }}
                    className="cursor-pointer outline-none"
                    style={{ pointerEvents: "all" }}
                  />
                );
              })}
            </svg>
          )}

          {/* Reflet doré qui balaie le clavier au défilement */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-full mix-blend-screen"
              style={{
                x: sheenX,
                opacity: sheenO,
                background:
                  "linear-gradient(105deg, transparent 38%, rgba(255,226,160,0.28) 50%, transparent 62%)",
              }}
            />
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
      </motion.div>

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
