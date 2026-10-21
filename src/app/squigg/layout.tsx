import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans, Shantell_Sans } from "next/font/google";
import "../squigg.css";

/**
 * Three faces, three jobs — and no overlap between them.
 *
 *   Fraunces        every display size. A wonky, soft serif that behaves
 *                   like a rounded sans once it is 88px tall.
 *   Plus Jakarta    the interface: nav, body, labels. The warmest of the
 *                   Google-hosted grotesques, and the closest published
 *                   stand-in for General Sans.
 *   Shantell Sans   handwriting. Annotations, margins, tiny jokes. Never a
 *                   heading, never body copy.
 *
 * All three are self-hosted through next/font. The canvas textures in
 * components/squigg/handwriting.ts read the generated families back off
 * `.sq-root`, so the cover of the notebook is set in the same faces as the
 * page around it.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-general",
  display: "swap",
});

const shantell = Shantell_Sans({
  subsets: ["latin"],
  variable: "--font-shantell",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Squigg — your notebook just got a brain",
  description:
    "Squigg is a paper notebook with a small intelligence inside it. Write normally; Squigg reads your handwriting, keeps every note connected and hands back the bit you were trying to remember.",
  keywords: [
    "Squigg",
    "AI notebook",
    "smart notebook",
    "handwriting recognition",
    "notetaking",
    "paper notebook",
  ],
  authors: [{ name: "Squigg Paper Co." }],
  openGraph: {
    title: "Squigg — your notebook just got a brain",
    description:
      "Write normally. Squigg does the remembering. Shipping spring 2027.",
    type: "website",
    siteName: "Squigg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Squigg",
    description: "Your notebook just got a brain.",
  },
  alternates: {
    canonical: "https://squigg.paper/",
  },
};

export const viewport: Viewport = {
  themeColor: "#fff8f0",
  width: "device-width",
  initialScale: 1,
};

export default function SquiggLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`sq-root ${fraunces.variable} ${jakarta.variable} ${shantell.variable}`}
    >
      {children}
    </div>
  );
}
