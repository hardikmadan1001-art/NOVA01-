"use client";

import type { CSSProperties, ReactNode } from "react";
import { Chapter, MaskedText, Reveal } from "./Chrome";
import {
  BrainSticker,
  JamJarSticker,
  PaperclipSticker,
  PencilSticker,
  SmileySticker,
  SnailSticker,
  SparkSticker,
  SquigCharacter,
  SquiggleRule,
  StarSticker,
  Sticker,
  SunSticker,
  Underline,
  WateringCanSticker,
} from "./Stickers";

/** Custom properties need the double cast; nothing here is worth a type. */
const vars = (input: Record<string, string | number>) =>
  input as unknown as CSSProperties;

/* ================================================================== */
/* Hero — the notebook has a brain                                    */
/* ================================================================== */

export function Hero() {
  return (
    <Chapter id="hero" className="sq-hero">
      {/* Stickers are placed, not laid out. */}
      <Sticker left="auto" right="5%" top="15%" size={96} rotate={11} motion="slow">
        <SunSticker size={96} />
      </Sticker>
      <Sticker right="41%" top="17%" size={50} rotate={-14} motion="wobble" delay={1.2} hiddenBelow>
        <SparkSticker size={50} />
      </Sticker>
      <Sticker right="46%" bottom="30%" size={54} rotate={9} motion="slow" delay={2.1} hiddenBelow>
        <StarSticker size={54} color="grape" />
      </Sticker>
      <Sticker left="45%" bottom="24%" size={58} rotate={-7} hiddenBelow>
        <PaperclipSticker size={58} />
      </Sticker>
      <Sticker right="13%" bottom="6%" size={82} rotate={-9} motion="slow" delay={0.6}>
        <SnailSticker size={82} />
      </Sticker>

      <div className="sq-wrap" style={{ width: "100%" }}>
        <div className="sq-hero-copy">
          <Reveal className="sq-hero-note">
            <span className="sq-chip">
              <span className="sq-output-dot" style={{ background: "var(--sq-mint)" }} />
              an ai notebook, on paper
            </span>
          </Reveal>

          {/* The visual headline is masked line by line; the accessible
              one is a single sentence, so screen readers do not read it as
              two unrelated fragments. */}
          <h1 className="sq-sr">Squigg — your notebook just got a brain.</h1>
          <MaskedText
            className="sq-display"
            lines={["your notebook", "just got a brain."]}
            step={130}
          />

          <Reveal delay={200} className="sq-row" style={{ gap: 10, marginTop: -6 }}>
            <span className="sq-hand">psst… it remembers.</span>
            <Underline width={128} />
          </Reveal>

          <Reveal delay={280}>
            <p className="sq-body">
              A paper notebook with something quietly alive inside it. Write the
              way you always have — Squigg reads the page, links every note to
              the ones beside it, and hands back the bit you were actually
              trying to remember.
            </p>
          </Reveal>

          <Reveal delay={360} className="sq-hero-cta">
            <a className="sq-btn" href="#sq-write">
              meet squigg
            </a>
            <a className="sq-link" href="#sq-understands">
              see how it thinks
            </a>
          </Reveal>

          <Reveal delay={440}>
            <p className="sq-micro">
              paper first · no setup · whatever you write stays yours
            </p>
          </Reveal>
        </div>
      </div>
    </Chapter>
  );
}

/* ================================================================== */
/* Chapters 1–5 — the cinematic sequence                              */
/* ================================================================== */

function ChapterCopy({
  index,
  heading,
  body,
  chips,
  align = "center",
  children,
}: {
  index: string;
  heading: string[];
  body: string;
  chips?: string[];
  /** Where the panel sits in the pinned viewport. The notebook is always in
      the right column, so this is the only vertical variety available. */
  align?: "top" | "center" | "bottom";
  children?: ReactNode;
}) {
  return (
    <div className="sq-chapter-copy" data-align={align}>
      <Reveal className="sq-chapter-index">
        <span className="sq-chapter-num">{index}</span>
        <span className="sq-label">chapter</span>
      </Reveal>

      <MaskedText className="sq-heading-lg" lines={heading} step={120} />

      <Reveal delay={220}>
        <p className="sq-body">{body}</p>
      </Reveal>

      {chips ? (
        <Reveal delay={320} className="sq-row" style={{ gap: 10, flexWrap: "wrap" }}>
          {chips.map((chip) => (
            <span key={chip} className="sq-chip">
              {chip}
            </span>
          ))}
        </Reveal>
      ) : null}

      {children}
    </div>
  );
}

/**
 * The object is doing the work of the copy here, so each panel stays short:
 * an index, a headline, one paragraph, one annotated aside. Everything the
 * reader learns about the product is happening on the page in the canvas.
 */
export function Chapters() {
  return (
    <>
      <Chapter id="write" className="sq-chapter">
        <div className="sq-chapter-inner">
          <div className="sq-wrap" style={{ width: "100%" }}>
            <ChapterCopy
              index="01"
              heading={["write it.", "squigg gets it."]}
              body="Open the cover and start anywhere — mid-sentence, sideways, in pencil. There are no tags to add and nothing to tidy up first, because Squigg reads handwriting, not templates."
              chips={["ink in, meaning out", "no formatting, ever"]}
            />
          </div>
        </div>
      </Chapter>

      <Chapter id="understands" className="sq-chapter">
        <div className="sq-chapter-inner">
          <div className="sq-wrap" style={{ width: "100%" }}>
            <ChapterCopy
              index="02"
              align="bottom"
              heading={["it knows", "what you meant"]}
              body="Every note gets read, not just filed. Squigg finds the words carrying the meaning, notices the question hiding under a crossed-out sentence, and leaves the page exactly where you left it."
              chips={["handwriting, word by word"]}
            >
              <Reveal delay={420} className="sq-row" style={{ gap: 14, marginTop: 8 }}>
                <span style={{ flexShrink: 0 }}>
                  <SquigCharacter size={78} />
                </span>
                <span className="sq-hand-sm" style={{ maxWidth: "20ch" }}>
                  “that one was a question, wasn’t it?”
                </span>
              </Reveal>
            </ChapterCopy>
          </div>
        </div>
      </Chapter>

      <Chapter id="remembers" className="sq-chapter">
        <div className="sq-chapter-inner">
          <div className="sq-wrap" style={{ width: "100%" }}>
            <ChapterCopy
              index="03"
              heading={["it remembers", "so you don’t"]}
              body="A note you wrote in March turns up the moment it becomes useful again. Squigg holds the whole notebook in mind and brings the old page forward, instead of making you go looking for it."
              chips={["5 notebooks, one memory", "old pages resurface on their own"]}
            />
          </div>
        </div>
      </Chapter>

      <Chapter id="ask" className="sq-chapter">
        <div className="sq-chapter-inner">
          <div className="sq-wrap" style={{ width: "100%" }}>
            <ChapterCopy
              index="04"
              align="top"
              heading={["ask your", "notebook"]}
              body="Write a question in the margin. Squigg walks back through everything you have written, finds the pages that answer it, and replies in the notebook rather than in a chat window you will never open again."
              chips={["the answer is already on page 14"]}
            />
          </div>
        </div>
      </Chapter>

      <Chapter id="transform" className="sq-chapter">
        <div className="sq-chapter-inner">
          <div className="sq-wrap" style={{ width: "100%" }}>
            <ChapterCopy
              index="05"
              heading={["one page,", "six shapes"]}
              body="A messy page of revision becomes a summary, a cheat sheet, a quiz and a set of cards. Same ink, different shape — and every version is still a page you can scribble on."
              chips={["summary", "revision sheet", "quiz", "flashcards", "checklist"]}
            />
          </div>
        </div>
      </Chapter>
    </>
  );
}

/* ================================================================== */
/* §8 — the four features, each shown as notebook behaviour           */
/* ================================================================== */

function Feature({
  index,
  title,
  body,
  flip = false,
  children,
}: {
  index: string;
  title: string;
  body: string;
  flip?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`sq-feature${flip ? " sq-feature-flip" : ""}`}>
      <Reveal className="sq-feature-copy sq-stack" style={{ gap: 18 }}>
        <span className="sq-tab">{index}</span>
        <h3 className="sq-heading" style={{ margin: 0 }}>
          {title}
        </h3>
        <p className="sq-body">{body}</p>
      </Reveal>
      <Reveal delay={140}>{children}</Reveal>
    </div>
  );
}

const REVEAL_LINES = [
  { text: "photosynthesis is confusing", word: "photosynthesis" },
  { text: "plants eat light??", word: "light" },
  { text: "chlorophyll = the green bit", word: "chlorophyll" },
  { text: "so a leaf is a tiny solar panel" },
];

export function Features() {
  return (
    <section className="sq-surface-paper sq-band" id="sq-features">
      <div className="sq-wrap sq-stack" style={{ gap: "clamp(72px, 9vw, 140px)" }}>
        <Reveal className="sq-stack" style={{ gap: 20, alignItems: "flex-start" }}>
          <span className="sq-tab">what it does</span>
          <MaskedText
            className="sq-display"
            lines={["four things,", "all on paper."]}
            step={130}
          />
          <p className="sq-body">
            Squigg is not a workspace. It is a notebook that happens to
            understand what you put in it — and every one of these behaviours
            shows up on the page, not in a panel.
          </p>
        </Reveal>

        {/* ---- 01 · handwriting ---------------------------------- */}
        <Feature
          index="01 — handwriting"
          title="it reads the messy bits"
          body="Squigg recognises handwriting word by word, mistakes included. The words that carry the meaning get picked out and underlined, and the question you did not quite ask gets found anyway."
        >
          <div className="sq-note" style={{ position: "relative" }}>
            <Reveal>
              <div className="sq-note-lines">
                {REVEAL_LINES.map((line, i) => (
                  <span
                    key={line.text}
                    className="sq-note-line"
                    data-word={line.word ? "true" : undefined}
                    style={vars({ "--sq-delay": `${220 + i * 240}ms` })}
                  >
                    {line.text}
                  </span>
                ))}
              </div>
              <div className="sq-note-foot">
                <span className="sq-chip">4 lines read</span>
                <span className="sq-chip">1 question found</span>
              </div>
              <div className="sq-reply">
                <div className="sq-reply-head">
                  <SquigCharacter size={34} />
                  <span className="sq-label" style={{ color: "var(--sq-jam)" }}>
                    squigg knows
                  </span>
                </div>
                <p className="sq-reply-text">
                  short version — leaves turn sunlight, water and air into
                  sugar. the green stuff doing it is chlorophyll, and that is
                  the whole trick.
                </p>
              </div>
            </Reveal>

            <Sticker right="-6%" top="-8%" size={72} rotate={14} motion="slow">
              <BrainSticker size={72} color="grape" />
            </Sticker>
            <Sticker left="-7%" bottom="34%" size={64} rotate={-12} hiddenBelow>
              <PencilSticker size={64} color="butter" />
            </Sticker>
          </div>
        </Feature>

        {/* ---- 02 · memory --------------------------------------- */}
        <Feature
          index="02 — memory"
          flip
          title="it keeps the whole notebook"
          body="Pages never fall out of reach. Ask about something you wrote months ago and Squigg brings that page back to the top, laid next to the note that made you think of it."
        >
          <div className="sq-layers">
            {[
              { date: "12 mar", text: "jam jar experiment — why didn’t it set?" },
              { date: "02 apr", text: "pectin = the thing in fruit skin that sets jam" },
              { date: "18 apr", text: "so it was never the sugar??" },
              { date: "today", text: "jam jar → pectin → set point. sorted." },
            ].map((layer, i) => (
              <Reveal
                key={layer.date}
                className="sq-layer"
                delay={120 + i * 150}
                style={vars({ "--sq-tilt": `${(i - 1.5) * 1.4}deg` })}
              >
                <p className="sq-layer-date">{layer.date}</p>
                <p className="sq-layer-text">{layer.text}</p>
              </Reveal>
            ))}
          </div>
        </Feature>

        {/* ---- 03 · ask ------------------------------------------ */}
        <Feature
          index="03 — answers"
          title="it answers from your own pages"
          body="Not the internet’s answer — yours. Squigg replies with what you actually wrote, and shows you which page it came from, so you can check it and argue with it."
        >
          <div className="sq-note">
            <Reveal>
              <div className="sq-note-lines">
                <span className="sq-note-line" style={vars({ "--sq-delay": "200ms" })}>
                  why does my jam keep failing?
                </span>
              </div>
              <div className="sq-reply">
                <div className="sq-reply-head">
                  <SquigCharacter size={34} accent="mint" />
                  <span className="sq-label" style={{ color: "var(--sq-jam)" }}>
                    from page 14
                  </span>
                </div>
                <p className="sq-reply-text">
                  because it is not the sugar — it is the pectin. you wrote that
                  on 2 april, in the margin, next to a drawing of a jar with
                  legs.
                </p>
                <div className="sq-note-foot" style={{ paddingLeft: 0, marginTop: 16 }}>
                  <span className="sq-chip">page 14 · 2 apr</span>
                  <span className="sq-chip">page 22 · 18 apr</span>
                </div>
              </div>
            </Reveal>
            <Sticker right="-8%" top="8%" size={62} rotate={-10} hiddenBelow>
              <JamJarSticker size={62} />
            </Sticker>
          </div>
        </Feature>

        {/* ---- 04 · transform ------------------------------------ */}
        <Feature
          index="04 — outputs"
          flip
          title="notes that do something"
          body="One page, several shapes. Squigg reshapes what you already wrote — it never invents a note you did not make, and nothing ever leaves the notebook."
        >
          <Reveal>
            <div className="sq-outputs">
              {[
                "summary",
                "revision sheet",
                "quiz",
                "flashcards",
                "ideas",
                "checklist",
              ].map((label, i) => (
                <span
                  key={label}
                  className="sq-output"
                  style={vars({
                    "--sq-delay": `${160 + i * 90}ms`,
                    "--sq-tilt": `${i % 2 === 0 ? -1.4 : 1.2}deg`,
                  })}
                >
                  <span className="sq-output-dot" />
                  {label}
                </span>
              ))}
            </div>

            <div style={{ marginTop: 34 }}>
              <SquiggleRule />
              <p className="sq-hand-sm" style={{ marginTop: 18, maxWidth: "34ch" }}>
                same page. six ways to look at it.
              </p>
            </div>
          </Reveal>
        </Feature>
      </div>
    </section>
  );
}

/* ================================================================== */
/* §13 — the moment: a messy page that is secretly organised          */
/* ================================================================== */

const SCRIBBLES = [
  { text: "photosynthesis is confusing", left: "6%", top: "12%", tilt: -1.6 },
  { text: "chlorophyll = green + light", left: "58%", top: "8%", tilt: 1.2 },
  { text: "so a leaf is a solar panel", left: "9%", top: "48%", tilt: 0.8 },
  { text: "wait — this is the same as page 3", left: "55%", top: "46%", tilt: -1.1 },
  { text: "asked on 12 mar, answered today", left: "26%", top: "76%", tilt: 0.6 },
];

export function Knowledge() {
  return (
    <Chapter id="knowledge" className="sq-knowledge sq-band">
      <div className="sq-wrap">
        {/* The band paints over the canvas, so the statement can use most of
            the width — but not all of it, or a 120px line runs past the
            comfortable measure. */}
        <div style={{ maxWidth: "min(920px, 86%)" }}>
          <MaskedText
            className="sq-statement"
            lines={["write normally.", "squigg does the", "remembering."]}
            step={140}
          />
        </div>

        <Reveal delay={200} className="sq-row" style={{ gap: 12, marginTop: 26 }}>
          <span className="sq-hand-sm" style={{ fontSize: 19 }}>
            nothing was ever filed. it still found itself.
          </span>
        </Reveal>

        <Reveal delay={120}>
          <div className="sq-knowledge-page">
            {/* The connections. Drawn, not glowing — paper layers moving
                rather than a network diagram. */}
            <svg
              className="sq-thread sq-draw"
              viewBox="0 0 1000 620"
              preserveAspectRatio="none"
              aria-hidden
              focusable="false"
            >
              <g
                fill="none"
                stroke="var(--sq-crayon)"
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.75}
                style={vars({ "--sq-dash": 1 })}
              >
                <path pathLength={1} d="M250 120C420 110 520 140 640 110" />
                <path pathLength={1} d="M300 150C330 240 300 290 190 330" />
                <path pathLength={1} d="M650 140C700 220 690 260 660 300" />
                <path pathLength={1} d="M220 340C400 380 520 360 640 320" />
                <path pathLength={1} d="M420 520C400 430 380 380 340 340" />
              </g>
              <g fill="var(--sq-crayon)" opacity={0.85}>
                <circle cx="250" cy="120" r="5" />
                <circle cx="640" cy="110" r="5" />
                <circle cx="190" cy="330" r="5" />
                <circle cx="660" cy="300" r="5" />
                <circle cx="420" cy="520" r="5" />
              </g>
            </svg>

            {SCRIBBLES.map((note, i) => (
              <Reveal
                key={note.text}
                className="sq-scribble"
                delay={340 + i * 180}
                style={vars({
                  left: note.left,
                  top: note.top,
                  /* Inline so the tilt survives the reveal transform. */
                  transform: `rotate(${note.tilt}deg)`,
                })}
              >
                {note.text}
              </Reveal>
            ))}

            <Sticker right="4%" bottom="5%" size={86} rotate={8} motion="slow">
              <SquigCharacter size={86} color="crayon" accent="butter" />
            </Sticker>
          </div>
        </Reveal>

        <Reveal delay={260}>
          <p className="sq-body" style={{ marginTop: 26 }}>
            March&rsquo;s note and today&rsquo;s question were always the same
            thought. Squigg just keeps pointing at the middle.
          </p>
        </Reveal>
      </div>
    </Chapter>
  );
}

/* ================================================================== */
/* Chapter 9 — everything collapses back into one notebook            */
/* ================================================================== */

export function Collapse() {
  return (
    <Chapter id="collapse" className="sq-band sq-band-tight">
      <div className="sq-wrap">
        <div style={{ maxWidth: 560 }}>
          <MaskedText
            className="sq-heading-lg"
            lines={["and then it’s", "just paper again."]}
            step={130}
          />
          <Reveal delay={200}>
            <p className="sq-body" style={{ marginTop: 22 }}>
              No dashboards. No folders to keep tidy. No workspace you have to
              maintain before you are allowed to think. Close Squigg and it
              looks exactly like the notebook you bought.
            </p>
          </Reveal>
          <Reveal delay={320} className="sq-row" style={{ gap: 12, marginTop: 26, flexWrap: "wrap" }}>
            <span className="sq-chip">
              <span className="sq-output-dot" style={{ background: "var(--sq-dust)" }} />
              no folders
            </span>
            <span className="sq-chip">
              <span className="sq-output-dot" style={{ background: "var(--sq-dust)" }} />
              no accounts to keep
            </span>
            <span className="sq-chip">
              <span className="sq-output-dot" style={{ background: "var(--sq-dust)" }} />
              no notifications
            </span>
          </Reveal>
        </div>
      </div>
    </Chapter>
  );
}

/* ================================================================== */
/* §12 — the shelf                                                    */
/* ================================================================== */

type BookSpec = {
  name: string;
  caption: string;
  fill: string;
  ink: string;
  accent: string;
  pattern: "squiggle" | "ruled" | "dots" | "stars";
  ry: string;
  tilt: string;
  sticker?: ReactNode;
};

const BOOKS: BookSpec[] = [
  {
    name: "berry",
    caption: "this one’s mine",
    fill: "#e8447e",
    ink: "#fff8f0",
    accent: "#ffd35c",
    pattern: "squiggle",
    ry: "-14deg",
    tilt: "-1.2deg",
    sticker: <StarSticker size={30} color="butter" />,
  },
  {
    name: "butter",
    caption: "the sunshine one",
    fill: "#ffd35c",
    ink: "#3a1730",
    accent: "#e8447e",
    pattern: "stars",
    ry: "-18deg",
    tilt: "1.6deg",
    sticker: <SunSticker size={30} />,
  },
  {
    name: "mint",
    caption: "made for thinking",
    fill: "#4fd1ae",
    ink: "#3a1730",
    accent: "#fff8f0",
    pattern: "ruled",
    ry: "-11deg",
    tilt: "-1.8deg",
    sticker: <SmileySticker size={30} color="butter" />,
  },
  {
    name: "grape",
    caption: "the messy one",
    fill: "#b18cf5",
    ink: "#3a1730",
    accent: "#fff8f0",
    pattern: "dots",
    ry: "-20deg",
    tilt: "1.1deg",
    sticker: <WateringCanSticker size={30} color="mint" />,
  },
  {
    name: "paper",
    caption: "blank on purpose",
    fill: "#fbeaf1",
    ink: "#3a1730",
    accent: "#e8447e",
    pattern: "squiggle",
    ry: "-15deg",
    tilt: "-0.8deg",
    sticker: <PaperclipSticker size={30} />,
  },
];

function CoverPattern({ kind, accent }: { kind: BookSpec["pattern"]; accent: string }) {
  if (kind === "ruled") {
    return (
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.4 }}
        aria-hidden
      >
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={i}
            x1="6"
            x2="94"
            y1={12 + i * 10}
            y2={12 + i * 10}
            stroke={accent}
            strokeWidth="0.8"
          />
        ))}
      </svg>
    );
  }

  if (kind === "dots") {
    return (
      <svg
        viewBox="0 0 100 100"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.45 }}
        aria-hidden
      >
        {Array.from({ length: 64 }, (_, i) => (
          <circle
            key={i}
            cx={9 + (i % 8) * 12}
            cy={9 + Math.floor(i / 8) * 12}
            r="1.1"
            fill={accent}
          />
        ))}
      </svg>
    );
  }

  if (kind === "stars") {
    return (
      <svg
        viewBox="0 0 100 100"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }}
        aria-hidden
      >
        {[
          [18, 22],
          [74, 16],
          [30, 66],
          [80, 74],
          [50, 44],
        ].map(([cx, cy], i) => (
          <path
            key={i}
            d={`M${cx} ${cy - 5}l1.8 3.4 3.7.6-2.7 2.6.6 3.6-3.4-1.8-3.4 1.8.6-3.6-2.7-2.6 3.7-.6z`}
            fill={accent}
          />
        ))}
      </svg>
    );
  }

  /* squiggle — the house pattern */
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }}
      aria-hidden
    >
      <path
        d="M8 30c8-14 16 14 24 0s16 14 24 0 16 14 24 0M8 62c8-14 16 14 24 0s16 14 24 0 16 14 24 0"
        fill="none"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SquigBook({ book }: { book: BookSpec }) {
  return (
    <Reveal className="sq-book" delay={80}>
      <div
        className="sq-book-object"
        style={vars({ "--sq-ry": book.ry, "--sq-rz": book.tilt })}
      >
        <div className="sq-book-cover" style={{ background: book.fill }}>
          <CoverPattern kind={book.pattern} accent={book.accent} />
          <div className="sq-book-spine" />
          <span
            style={{
              position: "absolute",
              right: 14,
              top: 14,
              transform: "rotate(12deg)",
            }}
          >
            {book.sticker}
          </span>
          <span
            className="sq-book-label"
            style={{ color: book.ink, borderColor: "rgba(34,30,36,0.2)" }}
          >
            name
            <br />
            squigg
          </span>
        </div>
      </div>
      <p className="sq-book-caption" style={{ color: "var(--sq-jam)" }}>
        {book.caption}
      </p>
    </Reveal>
  );
}

export function Showcase() {
  return (
    <Chapter id="showcase" className="sq-surface-petal sq-band">
      <div className="sq-wrap">
        <div className="sq-row" style={{ justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 560 }}>
            <MaskedText className="sq-display" lines={["pick a cover,", "keep the brain."]} step={130} />
            <Reveal delay={200}>
              <p className="sq-body" style={{ marginTop: 20 }}>
                Five covers, one notebook inside. Every Squigg has the same
                paper, the same stitched spine and the same small intelligence
                reading over your shoulder.
              </p>
            </Reveal>
          </div>
          <Reveal delay={280}>
            <span className="sq-hand" style={{ display: "inline-block" }}>
              (hover one. it turns.)
            </span>
          </Reveal>
        </div>

        <div className="sq-shelf" style={{ marginTop: "clamp(48px, 6vw, 84px)" }}>
          {BOOKS.map((book) => (
            <SquigBook key={book.name} book={book} />
          ))}
        </div>

        <Reveal delay={200} style={{ marginTop: "clamp(48px, 6vw, 76px)" }}>
          <SquiggleRule />
          <div
            className="sq-row"
            style={{ justifyContent: "space-between", gap: 20, marginTop: 22, flexWrap: "wrap" }}
          >
            <span className="sq-caption">a5 · 192 pages · 100gsm · stitched spine</span>
            <span className="sq-caption">from £38 · refills every season</span>
          </div>
        </Reveal>
      </div>
    </Chapter>
  );
}

/* ================================================================== */
/* §19 — the berry brand band                                         */
/* ================================================================== */

export function Final() {
  return (
    <Chapter id="final" className="sq-final sq-band">
      <Sticker right="7%" top="12%" size={92} rotate={13} motion="slow">
        <SunSticker size={92} />
      </Sticker>
      <Sticker right="20%" bottom="24%" size={64} rotate={-11} hiddenBelow>
        <SparkSticker size={64} color="butter" />
      </Sticker>
      <Sticker left="4%" bottom="16%" size={58} rotate={7} hiddenBelow>
        <SnailSticker size={58} color="paper" />
      </Sticker>

      <div className="sq-wrap sq-final-inner">
        <MaskedText
          className="sq-statement"
          lines={["go make a mess.", "squigg remembers."]}
          step={150}
        />

        <Reveal delay={240} className="sq-hero-cta" style={{ marginTop: 40 }}>
          <a
            className="sq-btn"
            href="#sq-showcase"
            style={{ background: "var(--sq-paper)", color: "var(--sq-jam)", boxShadow: "0 4px 0 rgba(58,23,48,0.35)" }}
          >
            get squigg
          </a>
          <a
            className="sq-link"
            href="mailto:hello@squigg.paper"
            style={{ color: "rgba(255,248,240,0.9)", borderColor: "rgba(255,248,240,0.45)" }}
          >
            tell me when it ships
          </a>
        </Reveal>

        <Reveal delay={320} style={{ marginTop: 26 }}>
          <p className="sq-caption" style={{ maxWidth: "44ch" }}>
            Shipping spring 2027. Nothing you write is used to train anything —
            Squigg reads your notebook for you and nobody else.
          </p>
        </Reveal>
      </div>
    </Chapter>
  );
}

