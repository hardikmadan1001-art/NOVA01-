"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import {
  chapterStart,
  measureChapters,
  registerChapter,
  squiggScroll,
  type ChapterId,
} from "./scroll";
import { SquigMark, SquigCharacter } from "./Stickers";

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */

const cx = (...parts: (string | false | undefined)[]) =>
  parts.filter(Boolean).join(" ");

/**
 * Flips `is-in` on the first intersection. Every staged entrance in the
 * stylesheet hangs off that one class, so nothing animates twice and
 * nothing animates off-screen.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  id,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      id={id}
      ref={ref}
      className={cx("sq-reveal", className)}
      style={{ ...style, "--sq-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * Display type that rises out of its own line box. Used for the oversized
 * statements, where a plain fade would read as a generic scroll trick.
 */
export function MaskedText({
  lines,
  className,
  step = 110,
  delay = 0,
}: {
  lines: ReactNode[];
  className?: string;
  step?: number;
  delay?: number;
}) {
  return (
    <Reveal className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          className="sq-mask"
          style={{ "--sq-delay": `${delay + i * step}ms` } as CSSProperties}
        >
          <span>{line}</span>
        </span>
      ))}
    </Reveal>
  );
}

/**
 * A chapter owns its slice of the scroll. It registers its own element so
 * the 3D stage can measure where the copy actually landed instead of
 * hard-coding camera keys.
 */
export function Chapter({
  id,
  className,
  children,
}: {
  id: ChapterId;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    registerChapter(id, ref.current);
    measureChapters();
    return () => registerChapter(id, null);
  }, [id]);

  return (
    <section id={`sq-${id}`} ref={ref} className={className}>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

const NAV: { id: ChapterId; label: string }[] = [
  { id: "understands", label: "what it does" },
  { id: "knowledge", label: "how it thinks" },
  { id: "showcase", label: "the notebooks" },
];

/**
 * Stationery on a desk, not a toolbar: no bar, no blur, no border. Just a
 * mark in one corner and one action in the other, with a lot of air
 * between them.
 */
export function SquiggHeader() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const links = Array.from(el.querySelectorAll<HTMLElement>("[data-nav-link]"));
    if (!links.length) return;

    /* Active state comes from the same measured chapter origins the camera
       uses, so the nav and the object are always telling the same story. */
    const sync = () => {
      const doc = squiggScroll.progress;
      let current = NAV[0].id;
      for (const link of NAV) {
        if (doc >= chapterStart(link.id) - 0.02) current = link.id;
      }
      for (const link of links) {
        link.dataset.active = String(link.dataset.navLink === current);
      }
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const go = (id: string) => {
    document
      .getElementById(`sq-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="sq-header" ref={ref}>
      <div className="sq-header-inner">
        <button
          type="button"
          className="sq-mark"
          onClick={() => go("hero")}
          aria-label="Squigg — back to the top"
        >
          <SquigMark size={38} />
          squigg
        </button>

        <nav className="sq-nav" aria-label="Sections">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className="sq-nav-link"
              data-nav-link={item.id}
              data-active="false"
              onClick={() => go(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button type="button" className="sq-btn sq-btn-sm" onClick={() => go("final")}>
          get squigg
        </button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Footer — the berry band that ends the story                         */
/* ------------------------------------------------------------------ */

export function SquiggFooter() {
  const go = (id: ChapterId) =>
    document.getElementById(`sq-${id}`)?.scrollIntoView({ block: "start" });

  return (
    <footer className="sq-surface-berry" style={{ paddingBottom: 40 }}>
      <div className="sq-wrap">
        <div
          style={{
            paddingTop: 34,
            borderTop: "1.5px solid rgba(255, 248, 240, 0.28)",
            display: "flex",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div className="sq-footer-links">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                className="sq-footer-link"
                onClick={() => go(item.id)}
              >
                {item.label}
              </button>
            ))}
            <a className="sq-footer-link" href="mailto:hello@squigg.paper">
              hello@squigg.paper
            </a>
            <a
              className="sq-footer-link"
              href="https://instagram.com/squigg"
              target="_blank"
              rel="noreferrer"
            >
              instagram
            </a>
          </div>

          <span className="sq-row" style={{ gap: 12 }}>
            <span className="sq-footer-mark" style={{ fontSize: 26 }}>
              <SquigMark size={36} color="paper" />
              squigg
            </span>
            <SquigCharacter size={54} color="butter" accent="paper" />
          </span>
        </div>

        <p className="sq-micro" style={{ color: "rgba(255,248,240,0.72)", marginTop: 26 }}>
          © 2026 squigg paper co. your handwriting stays yours.
        </p>
      </div>
    </footer>
  );
}
