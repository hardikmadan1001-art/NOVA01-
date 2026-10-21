"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import PenModel from "./PenModel";
import { productState } from "./finish";
import {
  SECTION_ORDER,
  type SectionId,
  damp,
  mix,
  pointerState,
  scrollState,
  sectionStart,
  smooth,
  span,
  viewState,
} from "@/lib/scroll";

/**
 * One room, one light, one palette — the whole site is photographed here.
 *
 * Smoothness comes from three places, in order of importance:
 *   1. Lenis interpolates the scroll position (components/site/SmoothScroll).
 *   2. Every value the camera or the object follows is passed through damp(),
 *      a frame-rate independent filter, so nothing snaps at speed.
 *   3. Camera and object poses are interpolated between *measured* section
 *      positions, so the choreography always matches the real layout.
 */

type Vec = [number, number, number];
type Pose = { cam: Vec; target: Vec; pen: Vec; rot: Vec; spin: number };

const POSES: Record<SectionId, Pose> = {
  /* Hero — the object hangs below the headline. */
  overview: {
    cam: [0, 0.85, 5.3],
    target: [0, 0.15, 0],
    pen: [0, -0.6, 0],
    rot: [0, 0.18, 0],
    spin: 0.14,
  },
  /* Features — closer, three-quarter, copy on the left. */
  features: {
    cam: [0.5, 0.95, 4.1],
    target: [0.75, 0.1, 0],
    pen: [1.2, -0.3, 0],
    rot: [-0.18, -0.5, 0.1],
    spin: 0.17,
  },
  /* Finishes — swung the other way so the new finish catches the key. */
  finishes: {
    cam: [-0.35, 0.8, 4.5],
    target: [0.45, 0.1, 0],
    pen: [0.75, -0.32, 0],
    rot: [0.12, 0.52, -0.08],
    spin: 0.21,
  },
  /* Showcase — eye level, dead centre, between the two columns of copy. */
  showcase: {
    cam: [0, 0.42, 5.05],
    target: [0, 0.08, 0],
    pen: [0, -0.32, 0],
    rot: [0, -0.32, 0.05],
    spin: 0.12,
  },
  /* Materials — looking down the barrel. */
  materials: {
    cam: [0.85, 2.9, 2.7],
    target: [0.7, 0.12, 0],
    pen: [0.95, -0.28, 0],
    rot: [-0.52, 0.22, 0.18],
    spin: 0.1,
  },
  /* Reserve — stepping back; the paper band takes over from here. */
  reserve: {
    cam: [0, 0.95, 6.3],
    target: [0, 0.1, 0],
    pen: [0, -0.42, 0],
    rot: [0, 0.4, 0],
    spin: 0.1,
  },
};

const lerpVec = (a: Vec, b: Vec, t: number): Vec => [
  mix(a[0], b[0], t),
  mix(a[1], b[1], t),
  mix(a[2], b[2], t),
];

/* ------------------------------------------------------------------ */
/* Choreography — poses keyed to where the sections actually sit       */
/* ------------------------------------------------------------------ */

function cameraKeys() {
  const keys = SECTION_ORDER.map((id) => ({ id, at: sectionStart(id) }));
  const measured = keys.some((k) => k.at > 0.0001);
  if (measured) return keys;
  /* Before the first measurement lands, spread the sections evenly. */
  return SECTION_ORDER.map((id, i) => ({
    id,
    at: i / (SECTION_ORDER.length - 1),
  }));
}

function poseAt(p: number) {
  const keys = cameraKeys();
  let i = 0;
  while (i < keys.length - 2 && p > keys[i + 1].at) i++;

  const a = POSES[keys[i].id];
  const b = POSES[keys[i + 1].id];
  const t = smooth(span(p, keys[i].at, keys[i + 1].at));

  return {
    cam: lerpVec(a.cam, b.cam, t),
    target: lerpVec(a.target, b.target, t),
    pen: lerpVec(a.pen, b.pen, t),
    rot: lerpVec(a.rot, b.rot, t),
    spin: mix(a.spin, b.spin, t),
  };
}

/* ------------------------------------------------------------------ */
/* Camera                                                             */
/* ------------------------------------------------------------------ */

function CameraRig() {
  const { camera, viewport } = useThree();

  const pos = useRef(new THREE.Vector3(...POSES.overview.cam));
  const look = useRef(new THREE.Vector3(...POSES.overview.target));
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((_, dt) => {
    /* Filter the document progress first, then filter the camera toward the
       pose that progress asks for. Two stages = no visible stepping. */
    viewState.progressSmooth = damp(viewState.progressSmooth, scrollState.progress, 0.11, dt);
    const pose = poseAt(viewState.progressSmooth);

    /* Heavily filtered so the parallax drifts instead of tracking the mouse. */
    pointer.current.x = damp(pointer.current.x, pointerState.x, 0.45, dt);
    pointer.current.y = damp(pointer.current.y, pointerState.y, 0.45, dt);

    /* Portrait viewports see a narrower slice of the room. */
    const aspect = viewport.aspect || 1;
    const fit = THREE.MathUtils.clamp(1.05 / aspect, 1, 1.9);

    pos.current.x = damp(pos.current.x, pose.cam[0] * fit + pointer.current.x * 0.32, 0.2, dt);
    pos.current.y = damp(pos.current.y, pose.cam[1] * fit + pointer.current.y * 0.2, 0.2, dt);
    pos.current.z = damp(pos.current.z, pose.cam[2] * fit, 0.2, dt);

    look.current.x = damp(look.current.x, pose.target[0] + pointer.current.x * 0.07, 0.25, dt);
    look.current.y = damp(look.current.y, pose.target[1] - pointer.current.y * 0.06, 0.25, dt);
    look.current.z = damp(look.current.z, pose.target[2], 0.25, dt);

    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });

  return null;
}

/**
 * Parallax reads the window directly: the canvas never takes pointer events,
 * and a raw <div> cannot live inside the R3F tree.
 */
function PointerTracker() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerState.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerState.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}

/* ------------------------------------------------------------------ */
/* The object                                                          */
/* ------------------------------------------------------------------ */

function Product() {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0);
  const rot = useRef<Vec>([...POSES.overview.rot]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;

    const p = viewState.progressSmooth;
    const pose = poseAt(p);
    spin.current += dt * pose.spin;

    rot.current[0] = damp(rot.current[0], pose.rot[0], 0.3, dt);
    rot.current[1] = damp(rot.current[1], pose.rot[1], 0.3, dt);
    rot.current[2] = damp(rot.current[2], pose.rot[2], 0.3, dt);

    /* A little sway from scroll velocity keeps the object feeling physical. */
    const sway = THREE.MathUtils.clamp(-scrollState.velocity * 0.00002, -0.05, 0.05);

    const t = state.clock.elapsedTime;
    g.position.x = damp(g.position.x, pose.pen[0], 0.24, dt);
    g.position.y = damp(g.position.y, pose.pen[1] + Math.sin(t * 0.38) * 0.05, 0.24, dt);
    g.position.z = damp(g.position.z, pose.pen[2], 0.24, dt);

    g.rotation.x = rot.current[0];
    g.rotation.y = rot.current[1] + Math.sin(t * 0.19) * 0.02 + sway;
    g.rotation.z = rot.current[2];

    /* The cap posts once, between the hero and the first feature band. */
    productState.cap = smooth(
      span(p, sectionStart("overview"), sectionStart("features") + 0.06),
    );
  });

  return (
    <group ref={group} position={[...POSES.overview.pen]}>
      <PenModel />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Room: floor, glass, light                                           */
/* ------------------------------------------------------------------ */

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]}>
      <planeGeometry args={[80, 80]} />
      <meshPhysicalMaterial
        color="#0b0d13"
        roughness={0.38}
        metalness={0.6}
        clearcoat={0.5}
        clearcoatRoughness={0.35}
        envMapIntensity={0.9}
      />
    </mesh>
  );
}

/**
 * The references' 3D language: sculptural translucent glass, lit from behind
 * so the forms read as shape rather than surface. They drift slowly and stay
 * for the whole page — the one atmospheric constant.
 */
function GlassForms() {
  const group = useRef<THREE.Group>(null);

  /* Created once and never mutated — a ref would mean reading it during
     render. All three forms share the same material. */
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#cfe0ff",
        metalness: 0,
        roughness: 0.08,
        transmission: 1,
        thickness: 1.4,
        ior: 1.45,
        transparent: true,
        opacity: 0.62,
      }),
    [],
  );

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y = 0.06 + Math.sin(t * 0.06) * 0.05;
    g.position.y = Math.sin(t * 0.16) * 0.1;
  });

  return (
    <group ref={group}>
      <mesh position={[-2.75, 0.55, -1.1]} material={glass}>
        <icosahedronGeometry args={[1.15, 0]} />
      </mesh>
      <mesh position={[-1.15, 1.7, -2.5]} material={glass}>
        <sphereGeometry args={[0.78, 48, 32]} />
      </mesh>
      <mesh position={[3.05, -0.15, -1.3]} rotation={[0.42, 0.25, 0]} material={glass}>
        <torusGeometry args={[0.72, 0.24, 32, 64]} />
      </mesh>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} color="#26344c" />
      {/* Cool key, high and to the right */}
      <directionalLight position={[4.5, 6, 3]} intensity={2.1} color="#dbe6ff" />
      {/* The accent, doing the only job colour is allowed: the rim light */}
      <directionalLight position={[-5, 1.4, -3]} intensity={2.4} color="#2b7fff" />
      <pointLight position={[0, -2.4, 1.4]} intensity={7} distance={14} decay={2} color="#4da2ff" />
    </>
  );
}

/* ------------------------------------------------------------------ */

export default function Studio() {
  return (
    <div className="st-stage" aria-hidden="true">
      <PointerTracker />
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.85, 5.3], fov: 40, near: 0.1, far: 90 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#08090d");
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <Lights />
          <Environment resolution={256}>
            <Lightformer
              form="rect"
              intensity={5}
              color="#eaf1ff"
              position={[0, 5, 1.5]}
              rotation={[Math.PI / 2 - 0.3, 0, 0]}
              scale={[9, 3, 1]}
            />
            <Lightformer
              form="rect"
              intensity={4.2}
              color="#4da2ff"
              position={[-5.5, 1.2, -1]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[8, 2.4, 1]}
            />
            <Lightformer
              form="rect"
              intensity={2}
              color="#ffffff"
              position={[5.5, 1.6, 1]}
              rotation={[0, -Math.PI / 2, 0]}
              scale={[7, 1.6, 1]}
            />
            <Lightformer
              form="circle"
              intensity={1.6}
              color="#2b7fff"
              position={[0, -4, 2]}
              scale={4}
            />
          </Environment>

          <Floor />
          <GlassForms />
          <Product />
        </Suspense>
      </Canvas>
    </div>
  );
}
