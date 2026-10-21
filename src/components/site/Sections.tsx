"use client";

import { useState } from "react";
import Reveal from "@/components/stage/Reveal";
import { FINISHES, setFinish, type FinishKey } from "@/components/stage/finish";
import { Section } from "./Chrome";

const go = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export function Hero() {
  return (
    <Section id="overview" className="st-band">
      <div className="st-wrap flex min-h-svh flex-col pt-28">
        <Reveal className="max-w-[860px]">
          <p className="st-label">Kern 01 — machined brass fountain pen</p>
          <h1 className="st-display mt-6">Write like it matters.</h1>
          <p className="st-body mt-7 max-w-[560px]">
            One billet of unlacquered brass, turned and fitted by hand with
            German ebonite and a 14K nib. Heavy enough to steady a signature,
            warm enough to reach for every day.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button type="button" className="st-pill" onClick={() => go("reserve")}>
              Reserve 01 — $340
            </button>
            <button
              type="button"
              className="st-ghost"
              onClick={() => go("finishes")}
            >
              See the finishes
            </button>
          </div>
          <p className="st-micro mt-6">
            Two hundred pieces a year · Ships April 2026
          </p>
        </Reveal>

        {/* The object's half of the hero. Copy never enters this box. */}
        <div className="st-slot mt-auto" />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Features                                                            */
/* ------------------------------------------------------------------ */

const CARDS = [
  {
    title: "Turned from one billet.",
    body: "No seams, no plating, no lacquer to chip. The barrel and the cap come off the same bar of brass, which is why the thread feels like it was made for your hand — it was, once.",
  },
  {
    title: "Ebonite, not plastic.",
    body: "The grip is German ebonite: it warms to your fingers in about four seconds and stays grippy when your hands are cold. It is also the part we expect to replace first, so it unscrews.",
  },
  {
    title: "A nib that meets paper.",
    body: "14K gold in a fine grind, hand-set and written with before it ships. Wet enough to show ink shading, dry enough to survive cheap paper and a fast signature.",
  },
];

const STATS = [
  { value: "42 g", label: "Total weight" },
  { value: "141 mm", label: "Capped length" },
  { value: "200 / year", label: "Made" },
];

export function Features() {
  return (
    <Section id="features" className="st-band st-band-alt">
      <div className="st-wrap">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,42%)]">
          <Reveal>
            <p className="st-label">Why it is built this way</p>
            <h2 className="st-heading mt-4 max-w-[520px]">
              Built to be kept, not replaced.
            </h2>
            <p className="st-body mt-6 max-w-[480px]">
              Almost every pen is a plastic tube with a brass-look coating. This
              one is the brass. It takes a patina instead of wearing out, and
              every part that can wear is designed to be unscrewed and swapped
              in a workshop rather than thrown away.
            </p>
            <button
              type="button"
              className="st-link mt-7"
              onClick={() => go("materials")}
              style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }}
            >
              Read the material notes <span aria-hidden>›</span>
            </button>
          </Reveal>
          <div className="st-slot" />
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 90} className="st-card">
              <h3 className="st-heading-sm">{card.title}</h3>
              <p className="st-body mt-4">{card.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-16 grid gap-8 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="st-stat">
              <span className="st-stat-value">{stat.value}</span>
              <span className="st-label">{stat.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Finishes — the one interactive moment, and it moves the product     */
/* ------------------------------------------------------------------ */

export function Finishes() {
  const [key, setKey] = useState<FinishKey>("brass");
  const active = FINISHES.find((f) => f.key === key) ?? FINISHES[0];

  return (
    <Section id="finishes" className="st-band">
      <div className="st-wrap grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,40%)]">
        <Reveal>
          <p className="st-label">Eight finishes</p>
          <h2 className="st-heading mt-4 max-w-[520px]">
            One billet, eight finishes.
          </h2>
          <p className="st-body mt-6 max-w-[500px]">
            Pick a swatch and it is applied to the object behind this text —
            these are the real materials, not mockups. Brass stays bare so the
            hand can finish it; the lacquers are polished and sealed.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            {FINISHES.map((f) => (
              <button
                key={f.key}
                type="button"
                aria-label={f.name}
                aria-pressed={key === f.key}
                className="st-swatch"
                data-active={key === f.key}
                style={{ background: f.swatch }}
                onClick={() => {
                  setKey(f.key);
                  setFinish(f.key);
                }}
              />
            ))}
          </div>

          <p className="st-body st-body-strong mt-8">
            Selected: <span style={{ color: "var(--signal-soft)" }}>{active.name}</span>
          </p>
        </Reveal>

        <div className="st-slot" />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Showcase — the one three-column statement                          */
/* ------------------------------------------------------------------ */

const SHOWCASE = [
  { k: "Balance", v: "18 mm from the nib" },
  { k: "Section", v: "12.4 mm, tapered" },
  { k: "Grind", v: "Fine, hand-set" },
];

export function Showcase() {
  return (
    <Section id="showcase" className="flex min-h-svh items-center">
      <div className="st-wrap grid w-full items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,40%)_minmax(0,1fr)]">
        <Reveal>
          <p className="st-label">The weight</p>
          <h2 className="st-display-sm mt-4">Heavy on purpose.</h2>
        </Reveal>

        <div className="st-slot" />

        <Reveal delay={140}>
          <p className="st-body">
            Forty-two grams is not an accident. Mass is what lets ink meet paper
            without pressure, so the writing happens without the pen asking
            anything of your wrist.
          </p>
          <dl className="mt-9 flex flex-col gap-4">
            {SHOWCASE.map((row) => (
              <div key={row.k} className="flex items-baseline justify-between gap-6">
                <dt className="st-label">{row.k}</dt>
                <dd className="st-caption">{row.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Materials                                                          */
/* ------------------------------------------------------------------ */

const SPECS = [
  { k: "Body", v: "Machined brass, unlacquered" },
  { k: "Grip", v: "German ebonite" },
  { k: "Nib", v: "14K gold, fine" },
  { k: "Weight", v: "42 g" },
  { k: "Length", v: "141 mm capped" },
  { k: "Edition", v: "200 a year" },
];

export function Materials() {
  return (
    <Section id="materials" className="st-band st-band-alt">
      <div className="st-wrap grid gap-12 md:grid-cols-2">
        <Reveal>
          <p className="st-label">Materials</p>
          <h2 className="st-heading mt-4 max-w-[460px]">
            A map of where it has been.
          </h2>
          <p className="st-body mt-6 max-w-[470px]">
            Brass is left unlacquered on purpose. It darkens with the hand that
            carries it, so after a year the pen holds a record of every pocket
            and every desk it has crossed — and no two records are alike.
          </p>

          <dl className="mt-10 flex flex-col">
            {SPECS.map((spec) => (
              <div
                key={spec.k}
                className="flex items-baseline justify-between gap-6 py-4"
                style={{ borderTop: "1px solid var(--line)" }}
              >
                <dt className="st-label">{spec.k}</dt>
                <dd className="st-caption">{spec.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="st-slot" />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Reserve — the one light band, and the only form on the page         */
/* ------------------------------------------------------------------ */

export function Reserve() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <Section id="reserve" className="st-band st-band-paper">
      <div className="st-wrap grid gap-12 md:grid-cols-2">
        <Reveal>
          <p className="st-label">The list</p>
          <h2 className="st-heading mt-4">Two hundred a year.</h2>
          <p className="st-body mt-6 max-w-[480px]">
            Every piece is turned, fitted and written with before it leaves the
            workshop. When the year&rsquo;s run is gone, the list moves to the
            next one — so the wait is part of the object.
          </p>
        </Reveal>

        <Reveal delay={120}>
          {done ? (
            <div>
              <p className="st-body" style={{ color: "var(--paper-text)" }}>
                You&rsquo;re on the list. We&rsquo;ll write when the next run
                opens — once, and only once.
              </p>
              <button
                type="button"
                className="st-ghost mt-6"
                onClick={() => setDone(false)}
              >
                Use a different address
              </button>
            </div>
          ) : (
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setDone(true);
              }}
            >
              <div className="flex flex-col gap-3">
                <label className="st-label" htmlFor="kern-email">
                  Email
                </label>
                <input
                  id="kern-email"
                  className="st-input"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <button type="submit" className="st-pill">
                  Join the list
                </button>
                <span className="st-caption">
                  No newsletter. One email per run.
                </span>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
