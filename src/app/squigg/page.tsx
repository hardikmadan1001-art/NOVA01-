import Stage from "@/components/squigg/Stage";
import SquiggScroll from "@/components/squigg/SmoothScroll";
import { SquiggFooter, SquiggHeader } from "@/components/squigg/Chrome";
import {
  Chapters,
  Collapse,
  Features,
  Final,
  Hero,
  Knowledge,
  Showcase,
} from "@/components/squigg/Sections";

/**
 * Squigg — one scroll-driven story about one object.
 *
 * The fixed canvas behind the page owns the notebook; this file owns the
 * order of the story it tells. Sections that stay transparent let the
 * notebook show through, sections that paint themselves (the feature band,
 * the shelf, the berry close) give the reader somewhere quiet to land.
 *
 * Ten chapters, in order: hero, write, understands, remembers, ask,
 * transform, knowledge, collapse, showcase, final. The camera poses in
 * components/squigg/Stage.tsx are keyed to those same ids, so reordering
 * this file re-choreographs the film.
 */
export default function SquiggPage() {
  return (
    <SquiggScroll>
      <Stage />
      <div className="sq-grain" aria-hidden />

      <div className="sq-page">
        <SquiggHeader />
        <main>
          <Hero />
          <Chapters />
          <Features />
          <Knowledge />
          <Collapse />
          <Showcase />
          <Final />
        </main>
        <SquiggFooter />
      </div>
    </SquiggScroll>
  );
}
