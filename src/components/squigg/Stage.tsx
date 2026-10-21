"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { damp, mix, smooth, span } from "@/lib/scroll";
import Notebook from "./Notebook";
import {
  chapterStart,
  squiggMotion,
  squiggPointer,
  squiggScroll,
  squiggView,
  type ChapterId,
} from "./scroll";

/**
 * The desk the whole site is photographed on.
 *
 * One fixed canvas sits behind the page. Sections that want the object show
 * through stay transparent; sections that want the reader's full attention
 * paint themselves over it. Nothing is ever composited on the fly, so the
 * cost of the 3D does not grow with the length of the story.
 *
 * Smoothness comes from three places, in order of importance:
 *   1. Lenis interpolates the scroll position (see SquiggScroll.tsx).
 *   2. Every value the camera follows passes through damp(), which behaves
 *      the same at 30, 60 and 120fps.
 *   3. Camera poses are interpolated between *measured* chapter origins, so
 *      the choreography still lines up when the copy reflows.
 */

type Vec = [number, number, number];

type Pose = {
  /** Camera position. */
  cam: Vec;
  /** Where the camera is looking. */
  target: Vec;
  /** Where the notebook sits in the room. */
  obj: Vec;
  /** How the notebook is turned. */
  rot: Vec;
};

/**
 * Ten chapters, ten poses. Read top to bottom the object does one thing:
 * floats, is approached, is opened, is read, is closed, and is put away.
 *
 * Every `obj[0]` below is solved, not eyeballed, so that the notebook's
 * leftmost screen pixel always clears the copy by a fixed gutter:
 *
 *   hero      copy glyphs reach x=686 (a 560px column), object starts 744
 *   chapters  copy glyphs reach x=545 (a 400px column), object starts 620
 *
 * That is why the object only ever sits in the right column. An earlier
 * draft alternated the copy left and right; because the pose keys are one
 * per chapter, the interpolation then dragged the notebook straight through
 * the paragraph, and no amount of easing fixes a collision. Variety comes
 * from camera height, distance and orbit instead — the spread is looked at
 * from above, from below, and from either side, and it never crosses the
 * words.
 */
const POSES: Record<ChapterId, Pose> = {
  /* Hero — hanging in afternoon light, three-quarter, right of the copy. */
  hero: {
    cam: [0, 0.55, 7.2],
    target: [0.5, -0.05, 0],
    obj: [2.03, -0.02, 0],
    rot: [0.07, -0.44, -0.05],
  },
  /* Chapter 1 — the camera steps in; the boards are shut, then open. */
  write: {
    cam: [0, 0.52, 7.2],
    target: [0.55, 0.02, 0],
    obj: [2.94, 0, 0],
    rot: [0.03, -0.3, -0.03],
  },
  /* Chapter 2 — seen from the other side of the spread, camera low. */
  understands: {
    cam: [0.25, 0.62, 8.5],
    target: [-0.25, 0.05, 0],
    obj: [1.18, 0.3, 0],
    rot: [0.07, 0.3, 0.02],
  },
  /* Chapter 3 — pulled back and up, so the pages separate in depth. */
  remembers: {
    cam: [-0.45, 1, 7.9],
    target: [0.45, -0.1, 0],
    obj: [2.9, -0.2, 0],
    rot: [-0.1, -0.42, -0.05],
  },
  /* Chapter 4 — the closest look at the page, from just above it. */
  ask: {
    cam: [0.3, 0.66, 8.6],
    target: [-0.2, 0.05, 0],
    obj: [0.87, 0.32, 0],
    rot: [0.1, 0.44, 0.03],
  },
  /* Chapter 5 — looking down at the page being turned into other things. */
  transform: {
    cam: [-0.3, 1.25, 7.8],
    target: [0.55, -0.15, 0],
    obj: [3.07, -0.28, 0],
    rot: [0.3, -0.46, -0.06],
  },
  /* The statement chapter paints itself over the canvas, so this pose only
     has to match `collapse` — otherwise the notebook would visibly jump the
     moment the petal band scrolls away. */
  knowledge: {
    cam: [0, 0.4, 7.4],
    target: [0.5, 0.02, 0],
    obj: [1.3, 0.06, 0],
    rot: [0.05, -0.24, -0.02],
  },
  /* Everything collapses back into one notebook — the cover shuts across
     this chapter, which is the whole point of it. */
  collapse: {
    cam: [0, 0.35, 7.2],
    target: [0.5, 0, 0],
    obj: [1.26, 0, 0],
    rot: [0, -0.14, 0],
  },
  /* Put away on the shelf, off to the side of the product row. */
  showcase: {
    cam: [0, 0.3, 8.5],
    target: [0.8, 0.1, 0],
    obj: [1.53, 0.3, 0],
    rot: [0.16, -0.52, -0.08],
  },
  final: {
    cam: [0, 0.35, 9.5],
    target: [0, 0.3, 0],
    obj: [0.6, 1, 0],
    rot: [0.1, 0.3, 0],
  },
};

const CHAPTER_KEYS: ChapterId[] = [
  "hero",
  "write",
  "understands",
  "remembers",
  "ask",
  "transform",
  "knowledge",
  "collapse",
  "showcase",
  "final",
];

const lerpVec = (a: Vec, b: Vec, t: number): Vec => [
  mix(a[0], b[0], t),
  mix(a[1], b[1], t),
  mix(a[2], b[2], t),
];

/** Chapter keys with the positions the layout actually gave them. */
function keys() {
  const measured = CHAPTER_KEYS.map((id) => ({ id, at: chapterStart(id) }));
  if (measured.some((k) => k.at > 0.0001)) return measured;
  /* Before the first measurement lands, spread them evenly so nothing
     lurches on the first frame after hydration. */
  return CHAPTER_KEYS.map((id, i) => ({
    id,
    at: i / (CHAPTER_KEYS.length - 1),
  }));
}

function poseAt(p: number) {
  const k = keys();
  let i = 0;
  while (i < k.length - 2 && p > k[i + 1].at) i++;
  const a = POSES[k[i].id];
  const b = POSES[k[i + 1].id];
  const t = smooth(span(p, k[i].at, k[i + 1].at));
  return {
    cam: lerpVec(a.cam, b.cam, t),
    target: lerpVec(a.target, b.target, t),
    obj: lerpVec(a.obj, b.obj, t),
    rot: lerpVec(a.rot, b.rot, t),
  };
}

/* ------------------------------------------------------------------ */
/* Camera                                                             */
/* ------------------------------------------------------------------ */

function Rig() {
  const { camera, viewport } = useThree();
  const pos = useRef(new THREE.Vector3(...POSES.hero.cam));
  const look = useRef(new THREE.Vector3(...POSES.hero.target));
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((_, dt) => {
    /* Filter progress, then filter the camera toward the pose that
       progress asks for. Two stages means no visible stepping. */
    squiggView.progressSmooth = damp(
      squiggView.progressSmooth,
      squiggScroll.progress,
      squiggMotion.reduced ? 0.02 : 0.12,
      dt,
    );

    const pose = poseAt(squiggView.progressSmooth);
    /* Heavily filtered, so the parallax drifts behind the cursor instead of
       tracking it. Reduced motion pins it dead centre. */
    const pointerHalfLife = squiggMotion.reduced ? 0.001 : 0.42;
    pointer.current.x = damp(pointer.current.x, squiggPointer.x, pointerHalfLife, dt);
    pointer.current.y = damp(pointer.current.y, squiggPointer.y, pointerHalfLife, dt);

    /* Portrait viewports see a narrower slice of the room. */
    const aspect = viewport.aspect || 1;
    const fit = THREE.MathUtils.clamp(1.05 / aspect, 1, 1.75);

    pos.current.x = damp(pos.current.x, pose.cam[0] * fit + pointer.current.x * 0.26, 0.2, dt);
    pos.current.y = damp(pos.current.y, pose.cam[1] * fit + pointer.current.y * 0.16, 0.2, dt);
    pos.current.z = damp(pos.current.z, pose.cam[2] * fit, 0.2, dt);

    look.current.x = damp(look.current.x, pose.target[0] + pointer.current.x * 0.08, 0.26, dt);
    look.current.y = damp(look.current.y, pose.target[1] - pointer.current.y * 0.06, 0.26, dt);
    look.current.z = damp(look.current.z, pose.target[2], 0.26, dt);

    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* The object                                                         */
/* ------------------------------------------------------------------ */

function Product() {
  const group = useRef<THREE.Group>(null);
  const rot = useRef<Vec>([...POSES.hero.rot]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;

    const pose = poseAt(squiggView.progressSmooth);
    const reduced = squiggMotion.reduced;
    const halfLife = reduced ? 0.02 : 0.26;

    rot.current[0] = damp(rot.current[0], pose.rot[0], halfLife, dt);
    rot.current[1] = damp(rot.current[1], pose.rot[1], halfLife, dt);
    rot.current[2] = damp(rot.current[2], pose.rot[2], halfLife, dt);

    /* A little sway from scroll velocity keeps the object feeling like it
       has weight behind it rather than easing for its own sake. */
    const sway = reduced
      ? 0
      : THREE.MathUtils.clamp(-squiggScroll.velocity * 0.00002, -0.05, 0.05);

    const t = state.clock.elapsedTime;
    const bob = reduced ? 0 : Math.sin(t * 0.34) * 0.045;

    g.position.x = damp(g.position.x, pose.obj[0], halfLife, dt);
    g.position.y = damp(g.position.y, pose.obj[1] + bob, halfLife, dt);
    g.position.z = damp(g.position.z, pose.obj[2], halfLife, dt);

    g.rotation.x = rot.current[0];
    g.rotation.y =
      rot.current[1] + (reduced ? 0 : Math.sin(t * 0.17) * 0.022) + sway;
    g.rotation.z = rot.current[2];
  });

  return (
    <group ref={group} position={[...POSES.hero.obj]}>
      <Notebook />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Light — late afternoon through a window, nothing cooler than skin   */
/* ------------------------------------------------------------------ */

function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} color="#fff2e2" />
      {/* The window: high, warm, slightly to the right. */}
      <directionalLight position={[4.4, 6, 3.2]} intensity={2.1} color="#fff6ea" />
      {/* Bounce off the desk, filling the lower half of every board. */}
      <directionalLight position={[-4.4, 1.2, -2.6]} intensity={0.75} color="#ffd9c0" />
      <pointLight position={[0, -2.8, 2.2]} intensity={4.5} distance={12} decay={2} color="#ffe7d0" />
    </>
  );
}

/**
 * The room's only other content: a warm backdrop far enough back that the
 * fog swallows its edges, and a soft contact shadow so the notebook reads
 * as sitting in a space rather than pasted onto one.
 */
function Desk() {
  return (
    <>
      <mesh position={[0, 0, -9]}>
        <planeGeometry args={[48, 32]} />
        <meshBasicMaterial color="#fdf0e2" />
      </mesh>
      <ContactShadows
        position={[0, -1.95, 0]}
        opacity={0.26}
        scale={16}
        blur={3.2}
        far={5}
        resolution={512}
        color="#7a5a4a"
      />
    </>
  );
}

/* ------------------------------------------------------------------ */

export default function Stage() {
  return (
    <div className="sq-stage" aria-hidden="true">
      <Canvas
        dpr={[1, 1.7]}
        shadows={false}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: POSES.hero.cam, fov: 38, near: 0.1, far: 60 }}
        onCreated={({ gl, scene }) => {
          /* Warm paper, so every transparent section reads as this page. */
          gl.setClearColor("#fff8f0");
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          scene.fog = new THREE.Fog("#fff8f0", 8, 17);
        }}
      >
        <Suspense fallback={null}>
          <Rig />
          <Lights />
          <Desk />
          <Environment resolution={256}>
            <Lightformer
              form="rect"
              intensity={4.2}
              color="#fff3e4"
              position={[0, 5, 2]}
              rotation={[Math.PI / 2 - 0.35, 0, 0]}
              scale={[9, 4, 1]}
            />
            <Lightformer
              form="rect"
              intensity={2.4}
              color="#ffd9c8"
              position={[-5.5, 1.2, -1]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[8, 3, 1]}
            />
            <Lightformer
              form="rect"
              intensity={2}
              color="#ffffff"
              position={[5.5, 1.6, 1]}
              rotation={[0, -Math.PI / 2, 0]}
              scale={[7, 2, 1]}
            />
            {/* One hint of the brand's pink, doing the rim. */}
            <Lightformer
              form="circle"
              intensity={1.4}
              color="#e8447e"
              position={[0, -4, 2]}
              scale={4}
            />
          </Environment>
          <Product />
        </Suspense>
      </Canvas>

      {/* Inside the stage, not above the page: the warm vignette belongs to
          the room, so it must sit under the copy and over the canvas. */}
      <div className="sq-vignette" />
    </div>
  );
}
