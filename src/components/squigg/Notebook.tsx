"use client";

import { useEffect, useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, damp, smooth, span } from "@/lib/scroll";
import {
  coverFill,
  createCoverSurface,
  createPageSurface,
  readFonts,
  whenFontsReady,
  type CoverName,
} from "./handwriting";
import { chapterStart, squiggMotion, squiggView } from "./scroll";

/**
 * The notebook.
 *
 * Everything is procedural — two boards, a block of pages, a printed cover
 * plane and a handful of stickers — because a real object built out of
 * rounded boxes and matte materials reads as tactile in a way a downloaded
 * mesh rarely does. It is deliberately imperfect: the corners are soft, the
 * boards overhang the pages, the cover is printed rather than embossed.
 *
 * Two things move here and nothing else:
 *   · the front board, hinged on the spine, opening as the reader reaches
 *     chapter two and closing again when the story is told;
 *   · the handwriting, drawn onto the page canvas as the reader scrolls.
 *
 * Both are driven off `squiggView.progressSmooth`, which the camera rig
 * filters first, so the object never sees a raw scroll value.
 */

/** Overall object dimensions. Exported so the camera can frame it. */
export const NOTEBOOK = { W: 2.4, H: 3.2, D: 0.5, T: 0.08 };

/**
 * 112 degrees, not 146.
 *
 * Flipping the board nearly flat doubles the notebook's footprint, and the
 * spread is photographed in the right-hand column only — at a full flip the
 * handwriting page ends up off the right edge of the frame. A board at 112
 * degrees is what a book resting open on a desk actually does, and it keeps
 * the page visible.
 */
const OPEN_ANGLE = 1.95;

export default function Notebook({ cover = "berry" }: { cover?: CoverName }) {
  const { W, H, D, T } = NOTEBOOK;

  const hinge = useRef<THREE.Group>(null);
  const angle = useRef(0);

  /* Offscreen canvases. Guarded for the server pass: `document` does not
     exist there, and a CanvasTexture has nothing to do on the server
     anyway. */
  const surfaces = useMemo(() => {
    if (typeof document === "undefined") return null;
    const fonts = readFonts();
    return {
      cover: createCoverSurface(cover, fonts),
      page: createPageSurface(undefined, fonts),
      inside: createPageSurface([], fonts),
    };
  }, [cover]);

  /* next/font swaps the real faces in after first paint, so both surfaces
     are redrawn once the handwriting face is actually available. */
  useEffect(() => {
    if (!surfaces) return;
    whenFontsReady(() => {
      surfaces.cover.redraw();
      surfaces.page.redraw();
      surfaces.inside.redraw();
    });
  }, [surfaces]);

  useFrame((_, dt) => {
    const g = hinge.current;
    if (!g) return;

    const p = squiggView.progressSmooth;
    const reduced = squiggMotion.reduced;

    /* The board opens once, across chapter one, and shuts again across the
       collapse — the reader watches it become a single closed object again
       before it is put away on the shelf. */
    const opening =
      smooth(span(p, chapterStart("write"), chapterStart("write") + 0.075)) -
      smooth(
        span(
          p,
          chapterStart("collapse") + 0.002,
          chapterStart("collapse") + 0.032,
        ),
      );
    const target = clamp01(opening) * OPEN_ANGLE;

    angle.current = reduced ? target : damp(angle.current, target, 0.18, dt);
    g.rotation.y = -angle.current;

    /* The writing arrives across the four feature chapters and then stays,
       because a notebook that forgets its own ink is not the product. */
    surfaces?.page.render(
      clamp01(
        span(p, chapterStart("understands"), chapterStart("transform") + 0.04),
      ),
    );
  });

  const coverMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(coverFill(cover)),
        roughness: 0.82,
        metalness: 0,
      }),
    [cover],
  );

  const pageMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#f6ede3"),
        roughness: 0.96,
        metalness: 0,
      }),
    [],
  );

  const spineMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(coverFill(cover)).multiplyScalar(0.86),
        roughness: 0.86,
        metalness: 0,
      }),
    [cover],
  );

  const zFront = D / 2 + T / 2;

  return (
    <group>
      {/* ---- Spine ------------------------------------------------- */}
      <RoundedBox
        args={[0.1, H, D + T * 2]}
        radius={0.035}
        smoothness={4}
        position={[-W / 2 - 0.02, 0, 0]}
        material={spineMaterial}
      />

      {/* ---- Back board -------------------------------------------- */}
      <RoundedBox
        args={[W, H, T]}
        radius={0.05}
        smoothness={4}
        position={[0, 0, -zFront]}
        material={coverMaterial}
      />

      {/* ---- The block of pages ------------------------------------ */}
      <RoundedBox
        args={[W - 0.12, H - 0.12, D]}
        radius={0.025}
        smoothness={3}
        material={pageMaterial}
      />

      {/* Two sheets proud of the block, so the fore-edge reads as a stack
          rather than a solid slab. */}
      <mesh position={[0, 0, D / 2 + 0.003]}>
        <planeGeometry args={[W - 0.14, H - 0.14]} />
        <meshStandardMaterial
          map={surfaces?.page.texture}
          roughness={0.95}
          metalness={0}
        />
      </mesh>
      <mesh
        position={[(W - 0.12) / 2 - 0.006, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[D - 0.06, H - 0.16]} />
        <meshStandardMaterial
          color="#efe4d8"
          roughness={0.98}
          metalness={0}
        />
      </mesh>

      {/* ---- Front board, hinged on the spine ---------------------- */}
      <group ref={hinge} position={[-W / 2, 0, 0]}>
        <group position={[W / 2, 0, zFront]}>
          <RoundedBox
            args={[W, H, T]}
            radius={0.05}
            smoothness={4}
            material={coverMaterial}
          />

          {/* Printed cover: mark, wordmark and the name label. */}
          <mesh position={[0, 0, T / 2 + 0.002]}>
            <planeGeometry args={[W - 0.01, H - 0.01]} />
            <meshStandardMaterial
              map={surfaces?.cover.texture}
              roughness={0.86}
              metalness={0}
            />
          </mesh>

          {/* Inside of the board — the left half of the open spread. */}
          <mesh position={[0, 0, -T / 2 - 0.002]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[W - 0.02, H - 0.02]} />
            <meshStandardMaterial
              map={surfaces?.inside.texture}
              roughness={0.95}
              metalness={0}
            />
          </mesh>

          {/* ---- Stickers, stuck on by hand ----------------------- */}
          <CoverDot position={[0.82, 1.02, T / 2 + 0.006]} color="#ffd35c" />
          <CoverSpark position={[-0.78, -1.08, T / 2 + 0.006]} color="#4fd1ae" />
          <CoverSpark
            position={[0.86, -0.9, T / 2 + 0.006]}
            color="#b18cf5"
            scale={0.62}
            turn={0.5}
          />
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Cover stickers — flat, graphite-outlined, slightly rotated          */
/* ------------------------------------------------------------------ */

function CoverDot({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <group position={position}>
      <mesh>
        <circleGeometry args={[0.155, 40]} />
        <meshStandardMaterial color="#221e24" roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <circleGeometry args={[0.128, 40]} />
        <meshStandardMaterial color={color} roughness={0.75} metalness={0} />
      </mesh>
    </group>
  );
}

/** A four-point spark drawn as one quadratic-per-arm shape. */
function sparkShape(r: number) {
  const waist = r * 0.18;
  const s = new THREE.Shape();
  s.moveTo(0, r);
  s.quadraticCurveTo(waist, waist, r, 0);
  s.quadraticCurveTo(waist, -waist, 0, -r);
  s.quadraticCurveTo(-waist, -waist, -r, 0);
  s.quadraticCurveTo(-waist, waist, 0, r);
  return s;
}

function CoverSpark({
  position,
  color,
  scale = 1,
  turn = -0.24,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  turn?: number;
}) {
  const shape = useMemo(() => sparkShape(0.24), []);
  return (
    <group position={position} scale={scale} rotation={[0, 0, turn]}>
      <mesh scale={1.16}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color="#221e24" roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color={color} roughness={0.75} metalness={0} />
      </mesh>
    </group>
  );
}
