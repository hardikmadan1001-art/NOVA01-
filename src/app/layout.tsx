import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

/**
 * One typeface for the whole site. Inter is the substitute every one of the
 * source references names — Apple's SF Pro, Air's Control, Slush's Aeonik,
 * Superr's supporting grotesque — so the type stops announcing which system
 * it came from. Space Grotesk survives only for the AURA film at /aura.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kern.works"),
  title: "KERN 01 — Write like it matters",
  description:
    "A fountain pen turned from one billet of unlacquered brass, fitted with German ebonite and a 14K nib. 42 grams, 141 millimetres, two hundred pieces a year.",
  keywords: [
    "Kern",
    "Kern 01",
    "fountain pen",
    "brass fountain pen",
    "ebonite",
    "14K nib",
    "Kern Werkstatt",
  ],
  authors: [{ name: "Kern Werkstatt" }],
  openGraph: {
    title: "KERN 01 — Write like it matters",
    description:
      "Machined brass, ebonite grip, 14K nib. Built to be kept, not replaced.",
    type: "website",
    siteName: "KERN",
    images: [
      {
        url: "/kern-og.png",
        width: 1200,
        height: 630,
        alt: "KERN 01 — a machined brass fountain pen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KERN 01",
    description: "Machined brass, ebonite grip, 14K nib.",
    images: ["/kern-og.png"],
  },
  alternates: {
    canonical: "https://kern.works/",
  },
};

export const viewport: Viewport = {
  themeColor: "#08090d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
