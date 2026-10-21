/**
 * Scroll state + chapter registry for the Squigg story.
 *
 * Same contract as the rest of the repo (see lib/scroll.ts): one passive
 * listener writes a mutable module object, the WebGL stage reads it inside
 * useFrame, and React state never sees a scroll value.
 *
 * Chapters are *measured*, not hard-coded. Each <Chapter> registers its own
 * element, so the camera choreography in Stage.tsx is derived from where the
 * copy actually landed — which stays true when the copy reflows.
 *
 * The maths is imported from lib/scroll: damp(), smooth(), span(), mix()
 * already behave identically at 30, 60 and 120fps.
 */

export type ChapterId =
  | "hero"
  | "write"
  | "understands"
  | "remembers"
  | "ask"
  | "transform"
  | "knowledge"
  | "collapse"
  | "showcase"
  | "final";

export const CHAPTER_ORDER: ChapterId[] = [
  "hero",
  "write",
  "understands",
  "remembers",
  "ask",
  "transform",
  "knowledge",
  "collapse",
  "showcase",
  "final",
];

/** Whole-document progress, 0 -> 1. Never goes through React. */
export const squiggScroll = {
  progress: 0,
  raw: 0,
  velocity: 0,
};

/** Double-smoothed progress the camera and the object both follow. */
export const squiggView = {
  progressSmooth: 0,
};

/** Normalised pointer, -1 -> 1. Written by the DOM, read by the stage. */
export const squiggPointer = { x: 0, y: 0 };

/** True when the user has asked the OS for less movement. */
export const squiggMotion = { reduced: false };

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

const elements = new Map<ChapterId, HTMLElement>();
const origins = new Map<ChapterId, number>();

export function registerChapter(id: ChapterId, el: HTMLElement | null) {
  if (el) elements.set(id, el);
  else {
    elements.delete(id);
    origins.delete(id);
  }
}

export function measureChapters() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return;
  for (const [id, el] of elements) {
    const top = el.getBoundingClientRect().top + window.scrollY;
    origins.set(id, Math.min(Math.max(top / max, 0), 1));
  }
}

/** Document progress at which a chapter's pinned panel takes the screen. */
export function chapterStart(id: ChapterId) {
  return origins.get(id) ?? 0;
}

/* ------------------------------------------------------------------ */
/* Listener                                                            */
/* ------------------------------------------------------------------ */

export function installSquiggScroll() {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  squiggMotion.reduced = mq.matches;
  const onMq = () => {
    squiggMotion.reduced = mq.matches;
  };
  mq.addEventListener("change", onMq);

  let lastY = window.scrollY;
  let lastT = performance.now();

  const update = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    squiggScroll.progress = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0;
    squiggScroll.raw = y;

    const t = performance.now();
    const dt = Math.max(t - lastT, 1) / 1000;
    squiggScroll.velocity = (y - lastY) / dt;
    lastY = y;
    lastT = t;
  };

  const onResize = () => {
    measureChapters();
    update();
  };

  const onPointer = (e: PointerEvent) => {
    squiggPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    squiggPointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  measureChapters();
  update();

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("pointermove", onPointer, { passive: true });

  return () => {
    mq.removeEventListener("change", onMq);
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointer);
  };
}
