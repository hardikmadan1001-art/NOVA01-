"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * Squigg's sticker vocabulary.
 *
 * Every piece here is an original flat illustration: a 2.5px graphite
 * outline, one or two flat fills, no gradient and no shadow on the artwork
 * itself. They are punctuation — placed by hand, slightly rotated, never
 * aligned to a grid, and never used as an icon inside a control.
 *
 * Decorative colours (butter / mint / grape / crayon) are passed in by the
 * caller so a sticker can be recoloured per section without a new component.
 */

export type StickerColor =
  | "butter"
  | "mint"
  | "grape"
  | "crayon"
  | "petal"
  | "paper";

const FILL: Record<StickerColor, string> = {
  butter: "#ffd35c",
  mint: "#4fd1ae",
  grape: "#b18cf5",
  crayon: "#e8447e",
  petal: "#fbeaf1",
  paper: "#fff8f0",
};

const LINE = "#221e24";

type ArtProps = {
  size?: number;
  color?: StickerColor;
  accent?: StickerColor;
};

const art = ({ size = 56 }: ArtProps) => ({
  width: size,
  height: size,
  viewBox: "0 0 64 64",
  fill: "none" as const,
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
  focusable: "false" as const,
});

const stroke = {
  stroke: LINE,
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ------------------------------------------------------------------ */
/* The brand mark — a squiggle with a full stop                        */
/* ------------------------------------------------------------------ */

export function SquigMark({
  size = 34,
  color = "crayon",
}: {
  size?: number;
  color?: StickerColor;
}) {
  return (
    <svg
      width={size}
      height={size * 0.42}
      viewBox="0 0 100 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      <path
        d="M4 26C10 6 18 6 24 26C30 46 38 46 44 26C50 6 58 6 64 26"
        stroke={LINE}
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="84" cy="24" r="9" fill={FILL[color]} stroke={LINE} strokeWidth={6} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Stickers                                                           */
/* ------------------------------------------------------------------ */

/** A sun that is visibly pleased with itself. */
export function SunSticker({ size, color = "butter" }: ArtProps) {
  return (
    <svg {...art({ size })}>
      <g {...stroke}>
        <path d="M32 6v5M32 53v5M6 32h5M53 32h5M13 13l4 4M47 47l4 4M51 13l-4 4M17 47l-4 4" />
        <circle cx="32" cy="32" r="15" fill={FILL[color]} />
        <path d="M27 31.5h.01M37 31.5h.01" strokeWidth={3.6} />
        <path d="M27 36c3 3.4 7 3.4 10 0" />
      </g>
    </svg>
  );
}

/** Snail carrying its house, going nowhere quickly. */
export function SnailSticker({ size, color = "crayon" }: ArtProps) {
  return (
    <svg {...art({ size })}>
      <g {...stroke}>
        <path d="M8 48h44c4 0 6-3 6-6" />
        <circle cx="30" cy="30" r="16" fill={FILL[color]} />
        <path d="M30 30a9 9 0 1 1 9 9M30 30a4 4 0 0 0 4-4" />
        <path d="M50 34v-8M56 34v-6" />
        <circle cx="50" cy="24" r="2.6" fill={LINE} stroke="none" />
        <circle cx="56" cy="26" r="2.6" fill={LINE} stroke="none" />
      </g>
    </svg>
  );
}

/** Jam jar — the good kind, with the paper label. */
export function JamJarSticker({ size, color = "grape", accent = "crayon" }: ArtProps) {
  return (
    <svg {...art({ size })}>
      <g {...stroke}>
        <rect x="14" y="16" width="36" height="40" rx="7" fill={FILL[color]} />
        <path d="M14 12h36v6H14z" fill={FILL[accent]} />
        <rect x="21" y="29" width="22" height="16" rx="3" fill={FILL.paper} />
        <path d="M26 35h12M26 40h8" strokeWidth={2} />
      </g>
    </svg>
  );
}

/** Watering can, mid-pour. */
export function WateringCanSticker({ size, color = "mint" }: ArtProps) {
  return (
    <svg {...art({ size })}>
      <g {...stroke}>
        <path d="M22 22h24v28a5 5 0 0 1-5 5H27a5 5 0 0 1-5-5z" fill={FILL[color]} />
        <path d="M46 28l14-9v22z" fill={FILL[color]} />
        <path d="M22 32c-8 0-11 6-9 12" />
        <path d="M20 22c1-8 7-11 14-11s13 3 14 11" />
        <path d="M27 46c2-3 8-3 10 0" strokeWidth={2} />
      </g>
    </svg>
  );
}

/** A stubby pencil, chewed at the end. */
export function PencilSticker({ size, color = "crayon", accent = "butter" }: ArtProps) {
  return (
    <svg {...art({ size })}>
      <g {...stroke}>
        <path d="M40 8l16 16-26 26-16-16z" fill={FILL[color]} />
        <path d="M14 34l16 16-16 6z" fill={FILL.paper} />
        <path d="M14 50l5-5 5 5" />
        <path d="M40 8l16 16 5-5-16-16z" fill={FILL[accent]} />
      </g>
    </svg>
  );
}

/** A four-point spark that says "it worked". */
export function SparkSticker({ size, color = "butter" }: ArtProps) {
  return (
    <svg {...art({ size })}>
      <path
        d="M32 4c3 14 10 21 24 24-14 3-21 10-24 24-3-14-10-21-24-24 14-3 21-10 24-24z"
        fill={FILL[color]}
        {...stroke}
      />
    </svg>
  );
}

/** Five-point star, slightly wonky on purpose. */
export function StarSticker({ size, color = "butter" }: ArtProps) {
  return (
    <svg {...art({ size })}>
      <path
        d="M32 6l7 17 18 1-14 12 4 18-15-10-16 10 5-18L7 24l18-1z"
        fill={FILL[color]}
        {...stroke}
      />
    </svg>
  );
}

/** Bent paperclip. */
export function PaperclipSticker({ size, color = "grape" }: ArtProps) {
  return (
    <svg {...art({ size })}>
      <path
        d="M20 52V18a8 8 0 0 1 16 0v30a4 4 0 0 0 8 0V22a13 13 0 0 0-26 0v26"
        stroke={LINE}
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M20 52V18a8 8 0 0 1 16 0v30a4 4 0 0 0 8 0V22a13 13 0 0 0-26 0v26"
        stroke={FILL[color]}
        strokeWidth={3.5}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Tiny brain doodle. Deliberately not anatomical. */
export function BrainSticker({ size, color = "crayon" }: ArtProps) {
  return (
    <svg {...art({ size })}>
      <g {...stroke}>
        <path
          d="M22 14c-6 2-9 7-8 13 2 2 2 4 0 6-1 7 4 12 11 11 1 3 5 4 8 2 4 0 6-3 6-7 5-4 6-10 2-14 2-5 0-10-5-12-5-3-11-1-14 3z"
          fill={FILL[color]}
        />
        <path d="M28 18c-3 3-2 6 1 8s2 5-1 7M34 20c3 2 4 5 2 8" strokeWidth={2} />
      </g>
    </svg>
  );
}

/** Smiley, for when a feature is genuinely nice. */
export function SmileySticker({ size, color = "mint" }: ArtProps) {
  return (
    <svg {...art({ size })}>
      <g {...stroke}>
        <circle cx="32" cy="32" r="24" fill={FILL[color]} />
        <path d="M24 28h.01M40 28h.01" strokeWidth={4} />
        <path d="M22 38c4 6 16 6 20 0" />
      </g>
    </svg>
  );
}

/**
 * Squig — the little intelligence that lives in the notebook.
 *
 * A nib of a head with a squiggle for a body, two uneven eyes and no mouth,
 * so it reads as watching rather than performing. It never becomes a mascot
 * with a voice: it appears, points at something, and gets out of the way.
 */
export function SquigCharacter({
  size = 90,
  color = "crayon",
  accent = "butter",
}: ArtProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      {/* trailing squiggle body */}
      <path
        d="M56 62c8 4 12 10 10 18 8-2 14 2 16 8"
        stroke={LINE}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M56 62c8 4 12 10 10 18 8-2 14 2 16 8"
        stroke={FILL[accent]}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="6 7"
        fill="none"
      />
      {/* head */}
      <path
        d="M50 12c17 0 28 11 27 27-1 15-13 25-29 24C33 62 22 51 23 36 24 21 34 12 50 12z"
        fill={FILL[color]}
        stroke={LINE}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {/* one bigger eye, one smaller — the charm is in the error */}
      <circle cx="40" cy="36" r="6" fill={LINE} />
      <circle cx="58" cy="34" r="4.4" fill={LINE} />
      <circle cx="42" cy="34" r="1.8" fill={FILL.paper} />
      <circle cx="59.4" cy="32.6" r="1.3" fill={FILL.paper} />
      {/* antenna dot */}
      <path d="M52 12c0-5 3-7 7-6" stroke={LINE} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx="61" cy="5" r="3.2" fill={FILL.butter} stroke={LINE} strokeWidth={2.2} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Placement                                                          */
/* ------------------------------------------------------------------ */

/**
 * Places a sticker on a section. `left`/`top` accept any CSS length so the
 * composition can be tuned per breakpoint from the caller.
 */
export function Sticker({
  children,
  left,
  top,
  right,
  bottom,
  size,
  rotate = 0,
  motion = "wobble",
  delay = 0,
  z = 3,
  className = "",
  hiddenBelow,
}: {
  children: ReactNode;
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  size?: number;
  rotate?: number;
  motion?: "wobble" | "slow" | "static";
  delay?: number;
  z?: number;
  className?: string;
  hiddenBelow?: boolean;
}) {
  const style: CSSProperties = {
    left,
    top,
    right,
    bottom,
    zIndex: z,
    width: size,
    height: "auto",
    ["--sq-tilt" as string]: `${rotate}deg`,
    ["--sq-wobble-delay" as string]: `${delay}s`,
  };

  const motionClass =
    motion === "wobble"
      ? "sq-sticker-wobble"
      : motion === "slow"
        ? "sq-float-slow"
        : "";

  return (
    <span
      className={[
        "sq-sticker",
        motionClass,
        hiddenBelow ? "hidden md:block" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      aria-hidden
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Hand-drawn markup                                                  */
/* ------------------------------------------------------------------ */

/** Wobbly arrow with an open head — the caption's pointer. */
export function Arrow({
  width = 132,
  height = 88,
  rotate = 0,
  flip = false,
  className = "",
}: {
  width?: number;
  height?: number;
  rotate?: number;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 132 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      style={{
        transform: `${flip ? "scaleX(-1) " : ""}rotate(${rotate}deg)`,
        overflow: "visible",
      }}
    >
      <path
        d="M8 8c4 30 22 52 58 60 14 3 27 4 46 3"
        stroke={LINE}
        strokeWidth={2.2}
        strokeLinecap="round"
        fill="none"
        opacity={0.75}
      />
      <path
        d="M98 62l14 9-13 10"
        stroke={LINE}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.75}
      />
    </svg>
  );
}

/** Rough single-stroke underline that sits under an emphasised word. */
export function Underline({
  width = 160,
  height = 12,
  color = "crayon",
  className = "",
}: {
  width?: number;
  height?: number;
  color?: StickerColor;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 160 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      preserveAspectRatio="none"
    >
      <path
        d="M2 8C34 2 92 11 158 4"
        stroke={FILL[color]}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Loose loop scrawled around a phrase, drawn in one pass and overshot. */
export function CircleScrawl({
  width = 220,
  height = 90,
  color = "crayon",
  className = "",
}: {
  width?: number;
  height?: number;
  color?: StickerColor;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 220 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      preserveAspectRatio="none"
    >
      <path
        d="M118 12C64 4 14 18 10 42c-4 24 44 44 104 40 52-4 94-22 92-42-2-18-40-30-92-30"
        stroke={FILL[color]}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** A wavy rule, used instead of a straight divider between playful bands. */
export function SquiggleRule({
  className = "",
  color = "crayon",
}: {
  className?: string;
  color?: StickerColor;
}) {
  return (
    <svg
      className={className}
      width="100%"
      height="14"
      viewBox="0 0 240 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      preserveAspectRatio="none"
    >
      <path
        d="M0 7c10-9 20 9 30 0s20 9 30 0 20 9 30 0 20 9 30 0 20 9 30 0 20 9 30 0 20 9 30 0"
        stroke={FILL[color]}
        strokeWidth={2.4}
        strokeLinecap="round"
        fill="none"
        opacity={0.65}
      />
    </svg>
  );
}
