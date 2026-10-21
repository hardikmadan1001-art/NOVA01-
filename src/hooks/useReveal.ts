"use client";

import { useEffect, useRef } from "react";

/**
 * Attach to any element carrying the `k-reveal` class: it flips `is-in` the
 * first time the element enters the viewport. Stagger siblings with the
 * `--k-delay` custom property rather than extra state.
 */
export default function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.2,
  rootMargin = "0px 0px -12% 0px",
}: { threshold?: number; rootMargin?: string } = {}) {
  const ref = useRef<T | null>(null);

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
      { threshold, rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
