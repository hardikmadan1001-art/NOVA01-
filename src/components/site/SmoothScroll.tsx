"use client";

import { useEffect } from "react";
import { ReactLenis } from "lenis/react";
import { installScroll, measureSections } from "@/lib/scroll";

/**
 * Lenis owns the scroll position, so the scene is never fed raw wheel steps.
 * A low lerp value plus the damped camera in the stage is what makes the
 * motion read as a single continuous move rather than a series of jumps.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const stopScroll = installScroll();

    /* Section ranges shift as fonts swap and as the layout settles. */
    const t1 = window.setTimeout(measureSections, 300);
    const t2 = window.setTimeout(measureSections, 1200);
    document.fonts?.ready.then(measureSections).catch(() => {});

    return () => {
      stopScroll();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.075,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
