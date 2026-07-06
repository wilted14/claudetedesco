"use client";

import { motion, type MotionValue } from "framer-motion";

/**
 * Épure d'un piano à queue (vue de profil), en trait doré.
 * Purement décoratif — utilisé comme motif de fond discret.
 */
type MV = MotionValue<number>;

export function PianoMotif({
  lidY,
  lidRot,
  keysX,
  bodyX,
  stringsOpacity,
}: {
  lidY?: MV;
  lidRot?: MV;
  keysX?: MV;
  bodyX?: MV;
  stringsOpacity?: MV | number;
}) {
  const gold = "var(--gold)";
  const ink = "var(--ink)";

  return (
    <svg
      viewBox="0 0 1000 620"
      className="h-auto w-full"
      fill="none"
      role="img"
      aria-label=""
    >
      {/* Cordes (harpe), à l'intérieur du cadre */}
      <motion.g
        style={{ opacity: stringsOpacity ?? 0.35 }}
        stroke={gold}
        strokeWidth={1}
      >
        {Array.from({ length: 11 }).map((_, i) => {
          const y = 348 + i * 7;
          return <line key={i} x1={250} y1={y} x2={735} y2={y} opacity={0.75} />;
        })}
        <line x1={250} y1={348} x2={735} y2={392} opacity={0.5} />
        <line x1={250} y1={425} x2={735} y2={388} opacity={0.5} />
      </motion.g>

      {/* Pédalier */}
      <g stroke={gold}>
        <line x1={452} y1={432} x2={452} y2={520} strokeWidth={1.5} />
        <line x1={470} y1={432} x2={470} y2={520} strokeWidth={1.5} />
        <rect x={432} y={520} width={58} height={16} rx={4} strokeWidth={1.5} />
        <line x1={446} y1={536} x2={446} y2={548} strokeWidth={2} />
        <line x1={461} y1={536} x2={461} y2={548} strokeWidth={2} />
        <line x1={476} y1={536} x2={476} y2={548} strokeWidth={2} />
      </g>

      {/* Pieds */}
      <g stroke={gold} strokeWidth={1.5}>
        <path d="M198 432 L188 560 L232 560 L214 432 Z" />
        <path d="M690 432 L682 560 L726 560 L710 432 Z" />
      </g>

      {/* Corps / cadre */}
      <motion.g style={{ x: bodyX }}>
        <path
          d="M170 330 L760 330 Q802 330 802 372 Q802 432 742 432 L170 432 Z"
          stroke={gold}
          strokeWidth={2}
          fill="rgba(198,166,100,0.04)"
        />
        <path
          d="M186 346 L742 346 Q786 346 786 380 Q786 416 730 416 L186 416 Z"
          stroke={gold}
          strokeWidth={1}
          opacity={0.4}
        />
      </motion.g>

      {/* Clavier */}
      <motion.g style={{ x: keysX }}>
        <rect
          x={120}
          y={318}
          width={230}
          height={24}
          rx={3}
          stroke={gold}
          strokeWidth={1.5}
          fill="rgba(244,239,230,0.06)"
        />
        {Array.from({ length: 13 }).map((_, i) => (
          <line
            key={i}
            x1={132 + i * 16.5}
            y1={322}
            x2={132 + i * 16.5}
            y2={338}
            stroke={gold}
            strokeWidth={0.75}
            opacity={0.5}
          />
        ))}
        {[0, 1, 3, 4, 5, 7, 8, 10, 11].map((i) => (
          <rect
            key={i}
            x={140 + i * 16.5}
            y={320}
            width={9}
            height={11}
            rx={1}
            fill={ink}
            opacity={0.75}
          />
        ))}
      </motion.g>

      {/* Couvercle relevé */}
      <motion.g
        style={{
          y: lidY,
          rotate: lidRot,
          transformBox: "fill-box",
          transformOrigin: "left bottom",
        }}
      >
        <path
          d="M206 322 L716 150 L742 172 L232 344 Z"
          stroke={gold}
          strokeWidth={2}
          fill="rgba(198,166,100,0.06)"
        />
        <line
          x1={560}
          y1={330}
          x2={612}
          y2={240}
          stroke={gold}
          strokeWidth={1.5}
          opacity={0.7}
        />
      </motion.g>
    </svg>
  );
}
