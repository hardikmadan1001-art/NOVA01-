"use client";

import { useEffect, useRef, useState } from "react";
import { SECTION_ORDER, measureSections, registerSection, type SectionId } from "@/lib/scroll";

/**
 * Sections register themselves so the stage can measure where they sit. The
 * camera choreography and the nav's active state both read those ranges, so
 * neither has to hard-code positions.
 */
export function Section({
  id,
  className = "",
  children,
}: {
  id: SectionId;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    registerSection(id, ref.current);
    measureSections();
    return () => registerSection(id, null);
  }, [id]);

  return (
    <section id={id} ref={ref} className={className}>
      {children}
    </section>
  );
}

const LINKS: { id: SectionId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "finishes", label: "Finishes" },
  { id: "materials", label: "Materials" },
];

export function Nav() {
  const [active, setActive] = useState<SectionId>("overview");

  useEffect(() => {
    const els = SECTION_ORDER.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!els.length || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: SectionId) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <header className="st-nav">
      <div className="st-nav-inner">
        <button
          type="button"
          className="st-nav-mark"
          onClick={() => go("overview")}
          style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", padding: 0, letterSpacing: "0.14em" }}
        >
          KERN
        </button>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Sections">
          {LINKS.map((l) => (
            <button
              key={l.id}
              type="button"
              className="st-nav-link"
              data-active={active === l.id}
              onClick={() => go(l.id)}
              style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <button type="button" className="st-pill" onClick={() => go("reserve")}>
          Reserve 01
        </button>
      </div>
    </header>
  );
}

export function Footer() {
  const go = (id: SectionId) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <footer className="st-band" style={{ paddingBlock: "72px" }}>
      <div className="st-wrap">
        <div className="st-rule" />
        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <p className="st-nav-mark">KERN</p>
            <p className="st-caption mt-3 max-w-[280px]">
              A fountain pen machined in small runs. Turned, fitted and written
              with before it leaves the workshop.
            </p>
          </div>

          {[
            { title: "Product", items: ["overview", "features", "finishes"] as SectionId[], labels: ["Overview", "Features", "Finishes"] },
            { title: "Details", items: ["materials", "reserve"] as SectionId[], labels: ["Materials", "Reserve"] },
          ].map((col) => (
            <div key={col.title}>
              <p className="st-label">{col.title}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {col.items.map((id, i) => (
                  <li key={id}>
                    <button
                      type="button"
                      className="st-nav-link"
                      onClick={() => go(id)}
                      style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }}
                    >
                      {col.labels[i]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="st-label">Contact</p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a className="st-link" href="mailto:hello@kern.works">
                  hello@kern.works
                </a>
              </li>
              <li>
                <span className="st-caption">Orebro, Sweden</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="st-micro mt-12">
          © 2026 Kern Werkstatt. Patina is not a defect.
        </p>
      </div>
    </footer>
  );
}
