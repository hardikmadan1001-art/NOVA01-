"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import { installSquiggScroll, measureChapters } from "./scroll";

/**
 * Lenis owns the scroll position, so the notebook is never fed raw wheel
 * steps. A low lerp is most of what makes the motion read as one continuous
 * move through a real object rather than a series of jumps.
 *
 * Chapter origins are re-measured whenever the document changes height —
 * fonts swapping, the showcase grid reflowing, a phone rotating — because
 * the whole camera choreography is derived from those numbers.
 */
export default function SquiggScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const stop = installSquiggScroll();

    const t1 = window.setTimeout(measureChapters, 400);
    const t2 = window.setTimeout(measureChapters, 1500);
    document.fonts?.ready.then(measureChapters).catch(() => {});

    /* The layout settles more than once on a page this long. */
    let queued = 0;
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            window.clearTimeout(queued);
            queued = window.setTimeout(measureChapters, 180);
          })
        : null;
    observer?.observe(document.body);

    return () => {
      stop();
      observer?.disconnect();
      window.clearTimeout(queued);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: reduced ? 1 : 0.085,
        smoothWheel: !reduced,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
