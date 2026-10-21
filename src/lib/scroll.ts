/**
 * Scroll state for the site.
 *
 * One passive listener writes a mutable module-level object; the WebGL stage
 * reads it inside useFrame. Scroll never goes through React state.
 *
 * Two things keep the motion smooth, and both matter:
 *
 *  1. Lenis (see components/site/SmoothScroll.tsx) interpolates the window's
 *     scroll position, so raw wheel steps never reach the scene.
 *  2. `damp()` below is a frame-rate independent exponential filter. Every
 *     value the camera or the object follows is filtered, so the result
 *     glides instead of snapping when the scroll is fast.
 */

export const scrollState = {
  /** Whole-document progress, 0 -> 1 */
  progress: 0,
  /** Raw scrollY in px */
  raw: 0,
  /** Scroll velocity in px/s */
  velocity: 0,
};

/**
 * The stage writes its damped values here so sibling components can follow
 * the same clock without prop-drilling a value that changes every frame.
 */
export const viewState = {
  /** Double-smoothed document progress the camera and object both follow. */
  progressSmooth: 0,
};

/** Normalised pointer, -1 -> 1. Written by the DOM layer, read by the stage. */
export const pointerState = { x: 0, y: 0 };

/* ------------------------------------------------------------------ */
/* Math                                                                */
/* ------------------------------------------------------------------ */

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const smooth = (t: number) => t * t * (3 - 2 * t);

export const span = (p: number, a: number, b: number) =>
  b === a ? (p >= b ? 1 : 0) : clamp01((p - a) / (b - a));

/** mix() eased across a window of document progress. */
export const between = (
  p: number,
  a: number,
  b: number,
  from: number,
  to: number,
) => mix(from, to, smooth(span(p, a, b)));

/**
 * Exponential smoothing that behaves identically at 30, 60 or 120fps.
 * `halfLife` is the time in seconds for the value to close half the gap —
 * larger is slower and heavier. 0.08–0.25 reads as "cinematic".
 */
export const damp = (
  current: number,
  target: number,
  halfLife: number,
  dt: number,
) => {
  const t = 1 - Math.pow(0.5, Math.min(dt, 0.1) / Math.max(halfLife, 0.0001));
  return current + (target - current) * t;
};

/* ------------------------------------------------------------------ */
/* Section registry — where each band of the page lives                */
/* ------------------------------------------------------------------ */

export type SectionId =
  | "overview"
  | "features"
  | "finishes"
  | "showcase"
  | "materials"
  | "reserve";

export const SECTION_ORDER: SectionId[] = [
  "overview",
  "features",
  "finishes",
  "showcase",
  "materials",
  "reserve",
];

const elements = new Map<SectionId, HTMLElement>();
const ranges = new Map<SectionId, { start: number; end: number }>();

export function registerSection(id: SectionId, el: HTMLElement | null) {
  if (el) elements.set(id, el);
  else elements.delete(id);
}

export function measureSections() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return;

  for (const [id, el] of elements) {
    const top = el.getBoundingClientRect().top + window.scrollY;
    ranges.set(id, {
      start: clamp01(top / max),
      end: clamp01((top + el.offsetHeight) / max),
    });
  }
}

/** Document progress at which a section starts, 0 -> 1. */
export function sectionStart(id: SectionId) {
  return ranges.get(id)?.start ?? 0;
}

export function sectionCenter(id: SectionId) {
  const r = ranges.get(id);
  return r ? (r.start + r.end) / 2 : 0;
}

/* ------------------------------------------------------------------ */
/* Listener                                                            */
/* ------------------------------------------------------------------ */

export function installScroll() {
  let lastY = window.scrollY;
  let lastT = performance.now();

  const update = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollState.progress = max > 0 ? clamp01(y / max) : 0;
    scrollState.raw = y;

    const t = performance.now();
    const dt = Math.max(t - lastT, 1) / 1000;
    scrollState.velocity = (y - lastY) / dt;
    lastY = y;
    lastT = t;
  };

  const onResize = () => {
    measureSections();
    update();
  };

  measureSections();
  update();

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", onResize);

  return () => {
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", onResize);
  };
}
