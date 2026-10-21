import * as THREE from "three";

/**
 * The notebook's paper, drawn at runtime.
 *
 * Both surfaces are 2D canvases wrapped in a CanvasTexture: the cover carries
 * the Squigg wordmark and a name label, the page carries the rules and the
 * handwriting itself. Drawing rather than modelling means the ink can appear
 * stroke by stroke as the reader scrolls, which is the whole point of the
 * hero object — the notebook looks like it is being written in, not
 * animated.
 *
 * Fonts: next/font hashes the family name, so the raw value of the CSS
 * custom property (already a full font-family list) is read off <html> and
 * handed straight to ctx.font. Nothing is hard-coded to a Google family.
 */

export type Fonts = { hand: string; display: string };

const FALLBACK: Fonts = {
  hand: '"Shantell Sans", cursive',
  display: "Fraunces, Georgia, serif",
};

export function readFonts(): Fonts {
  if (typeof window === "undefined") return FALLBACK;
  /* The variables live on the Squigg root, not on <html> — the root layout
     owns that element and belongs to another brand. */
  const scope = document.querySelector(".sq-root") ?? document.documentElement;
  const styles = getComputedStyle(scope);
  const value = (name: string, fallback: string) => {
    const v = styles.getPropertyValue(name).trim();
    return v || fallback;
  };
  return {
    hand: value("--font-shantell", FALLBACK.hand),
    display: value("--font-fraunces", FALLBACK.display),
  };
}

/** next/font swaps the real face in after first paint. */
export function whenFontsReady(cb: () => void) {
  if (typeof document === "undefined" || !document.fonts) return;
  document.fonts.ready.then(cb).catch(() => {});
}

const INK = "#3a1730";
const GRAPHITE = "#221e24";
const CRAYON = "#e8447e";
const PAGE = "#fffdfa";

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/** Rounded rectangle, hand-rolled: `ctx.roundRect` is still missing on a
    few browsers that otherwise run this page perfectly well. */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function toTexture(canvas: HTMLCanvasElement, anisotropy = 8) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.needsUpdate = true;
  return texture;
}

/* ------------------------------------------------------------------ */
/* Cover                                                              */
/* ------------------------------------------------------------------ */

/** The cover colours a Squigg notebook ships in. */
export type CoverName = "berry" | "butter" | "mint" | "grape" | "paper";

const COVERS: Record<CoverName, { fill: string; ink: string; band: string }> = {
  berry: { fill: "#e8447e", ink: "#fff8f0", band: "rgba(34,30,36,0.16)" },
  butter: { fill: "#ffd35c", ink: "#3a1730", band: "rgba(34,30,36,0.12)" },
  mint: { fill: "#4fd1ae", ink: "#3a1730", band: "rgba(34,30,36,0.12)" },
  grape: { fill: "#b18cf5", ink: "#3a1730", band: "rgba(34,30,36,0.12)" },
  paper: { fill: "#fbeaf1", ink: "#3a1730", band: "rgba(34,30,36,0.1)" },
};

export type CoverSurface = {
  texture: THREE.CanvasTexture;
  redraw: () => void;
  fill: string;
};

/** Flat cover colour, for the box the printed plane sits on. */
export const coverFill = (name: CoverName) => COVERS[name].fill;
export const coverInk = (name: CoverName) => COVERS[name].ink;

export function createCoverSurface(
  name: CoverName = "berry",
  fonts: Fonts = FALLBACK,
): CoverSurface {
  const W = 1024;
  const H = 1365;
  const canvas = makeCanvas(W, H);
  const ctx = canvas.getContext("2d");
  const palette = COVERS[name];

  const draw = () => {
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = palette.fill;
    ctx.fillRect(0, 0, W, H);

    /* The spine reads as a shade change, not a gradient — one flat band,
       exactly like the CSS notebook in the showcase. */
    ctx.fillStyle = palette.band;
    ctx.fillRect(0, 0, 46, H);

    /* The mark, set large and slightly low so it feels printed and worn. */
    ctx.save();
    ctx.translate(512, 560);
    ctx.strokeStyle = palette.ink;
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 44;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-250, 0);
    ctx.bezierCurveTo(-190, -190, -130, -190, -70, 0);
    ctx.bezierCurveTo(-10, 190, 50, 190, 110, 0);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(250, -10, 62, 0, Math.PI * 2);
    ctx.fillStyle = palette.ink;
    ctx.fill();
    ctx.restore();

    /* Name label — the small laminated sticker every schoolbook carries. */
    const lx = 560;
    const ly = 120;
    const lw = 344;
    const lh = 208;
    ctx.save();
    ctx.fillStyle = PAGE;
    ctx.strokeStyle = GRAPHITE;
    ctx.lineWidth = 4;
    roundRect(ctx, lx, ly, lw, lh, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = GRAPHITE;
    ctx.font = `600 42px ${fonts.hand}`;
    ctx.fillText("name", lx + 28, ly + 62);
    ctx.fillText("class", lx + 28, ly + 112);
    ctx.font = `600 40px ${fonts.hand}`;
    ctx.fillStyle = INK;
    ctx.fillText("squigg", lx + 160, ly + 62);
    ctx.fillText("thinking", lx + 160, ly + 112);
    ctx.strokeStyle = "rgba(34,30,36,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lx + 150, ly + 78);
    ctx.lineTo(lx + lw - 28, ly + 78);
    ctx.moveTo(lx + 150, ly + 128);
    ctx.lineTo(lx + lw - 28, ly + 128);
    ctx.stroke();
    ctx.fillStyle = "rgba(34,30,36,0.5)";
    ctx.font = `500 34px ${fonts.hand}`;
    ctx.fillText("roll no. 001", lx + 28, ly + 168);
    ctx.restore();

    /* Wordmark, bottom-left, lowercase. */
    ctx.save();
    ctx.fillStyle = palette.ink;
    ctx.font = `600 128px ${fonts.display}`;
    ctx.fillText("squigg", 84, H - 170);
    ctx.globalAlpha = 0.7;
    ctx.font = `600 46px ${fonts.hand}`;
    ctx.fillText("a notebook that remembers", 88, H - 106);
    ctx.restore();

    texture.needsUpdate = true;
  };

  const texture = toTexture(canvas);
  draw();

  return { texture, redraw: draw, fill: palette.fill };
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export type PageLine = { text: string; indent?: number; size?: number };

const DEFAULT_LINES: PageLine[] = [
  { text: "photosynthesis is confusing", size: 64 },
  { text: "plants eat light??" },
  { text: "they breathe in what we breathe out" },
  { text: "chlorophyll = the green bit" },
  { text: "so a leaf is a tiny solar panel" },
];

export type PageSurface = {
  texture: THREE.CanvasTexture;
  /** Reveal the handwriting up to `progress` (0 -> 1). Cheap when unchanged. */
  render: (progress: number) => void;
  redraw: () => void;
};

/**
 * A ruled page. `lines: []` gives the blank inside-face of the cover, so the
 * two halves of an open notebook come from one drawing routine.
 */
export function createPageSurface(
  lines: PageLine[] = DEFAULT_LINES,
  fonts: Fonts = FALLBACK,
): PageSurface {
  const W = 1024;
  const H = 1365;
  const canvas = makeCanvas(W, H);
  const ctx = canvas.getContext("2d");

  const RULE_TOP = 210;
  const RULE_GAP = 96;
  const LEFT = 168;
  const MARGIN = 116;

  const drawRules = () => {
    if (!ctx) return;
    ctx.fillStyle = PAGE;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(58,23,48,0.11)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let y = RULE_TOP; y < H - 40; y += RULE_GAP) {
      ctx.moveTo(54, y + 12);
      ctx.lineTo(W - 54, y + 12);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(232,68,126,0.32)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(MARGIN, 60);
    ctx.lineTo(MARGIN, H - 60);
    ctx.stroke();
  };

  let drawn = -1;
  let requested = 0;

  const render = (progress: number) => {
    if (!ctx) return;
    const p = Math.min(Math.max(progress, 0), 1);
    requested = p;

    /* Redrawing a 1024x1365 canvas every frame would cost more than the
       whole scene, so the sheet only repaints when the reveal has actually
       moved. The step is small enough to read as continuous. */
    if (Math.abs(p - drawn) < 0.006 && drawn >= 0) return;
    drawn = p;

    drawRules();

    const n = lines.length;
    if (!n) {
      texture.needsUpdate = true;
      return;
    }

    ctx.textBaseline = "alphabetic";
    const per = 1 / n;

    lines.forEach((line, i) => {
      const local = Math.min(Math.max((p - i * per) / (per * 0.72), 0), 1);
      if (local <= 0) return;

      const size = line.size ?? 58;
      ctx.font = `600 ${size}px ${fonts.hand}`;
      const x = LEFT + (line.indent ?? 0);
      const y = RULE_TOP + i * RULE_GAP;
      const width = ctx.measureText(line.text).width;

      ctx.save();
      ctx.translate(x, y);
      /* A hair of rotation per line. Handwriting is never level. */
      ctx.rotate(((-0.5 + (i % 3) * 0.42) * Math.PI) / 180);
      if (local < 1) {
        ctx.beginPath();
        ctx.rect(-8, -size, (width + 20) * local, size * 1.9);
        ctx.clip();
      }
      ctx.fillStyle = INK;
      ctx.fillText(line.text, 0, 0);
      ctx.restore();

      /* The ring around the first line lands last, like a second pass. */
      if (i === 0 && p > per * 0.9) {
        const t = Math.min(Math.max((p - per * 0.9) / (per * 0.5), 0), 1);
        ctx.save();
        ctx.strokeStyle = CRAYON;
        ctx.globalAlpha = 0.75 * t;
        ctx.lineWidth = 3.4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.ellipse(
          x + width / 2,
          y - size * 0.32,
          (width / 2) * (0.7 + 0.35 * t) + 16,
          size * 1.05,
          -0.012,
          0,
          Math.PI * (0.55 + 1.75 * t),
        );
        ctx.stroke();
        ctx.restore();
      }
    });

    texture.needsUpdate = true;
  };

  const texture = toTexture(canvas);
  render(0);

  return {
    texture,
    render,
    /* Re-draws at whatever the reveal last asked for — used when the real
       webfont arrives after first paint. */
    redraw: () => {
      drawn = -1;
      render(requested);
    },
  };
}
