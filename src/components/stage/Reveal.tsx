"use client";

import type { CSSProperties, ReactNode } from "react";
import useReveal from "@/hooks/useReveal";

/**
 * One shared entrance for every act: fade and lift the first time the block
 * enters the viewport. Stagger siblings with `delay` rather than state.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </div>
  );
}
