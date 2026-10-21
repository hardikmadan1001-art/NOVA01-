"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mix } from "@/lib/scroll";
import { ENV_INTENSITY, finishState, productState } from "./finish";

/**
 * KERN 01 — the object, procedural.
 *
 * Machined barrel, ebonite grip, 14K nib, built along the local X axis with
 * its centreline on y = 0. The cap unposts as the reader leaves the hero and
 * stays posted; the finish lerps toward whatever the swatch row selected.
 *
 * Pose and camera belong to the stage — this component is only the object.
 */

const BARREL_RADIUS = 0.155;
/** Closed: the cap's mouth sits just past the nib tip at x = 1.71. */
const CAP_CLOSED_X = 0.97;
/** Posted: the cap's mouth meets the barrel's rear at x = -1.27. */
const CAP_POSTED_X = -2.02;

/* Cylinders and cones run along +X after these rotations. */
const ALONG_X: [number, number, number] = [0, 0, Math.PI / 2];
const NIB_TIP_X: [number, number, number] = [0, 0, -Math.PI / 2];

const scratch = new THREE.Color();

type Mats = {
  body: THREE.MeshPhysicalMaterial;
  hardware: THREE.MeshPhysicalMaterial;
  nib: THREE.MeshPhysicalMaterial;
  ebonite: THREE.MeshPhysicalMaterial;
  cream: THREE.MeshPhysicalMaterial;
  dark: THREE.MeshBasicMaterial;
};

/**
 * Per-frame material update, deliberately outside the component so the frame
 * loop mutates arguments rather than values captured from render.
 */
function animateMaterials(mats: Mats, dt: number) {
  const f = finishState.current;
  const k = 1 - Math.pow(0.002, Math.min(dt, 0.1));

  mats.body.color.lerp(scratch.set(f.body), k);
  mats.body.roughness += (f.roughness - mats.body.roughness) * k;
  mats.hardware.color.lerp(scratch.set(f.hardware), k);
  mats.nib.color.lerp(scratch.set(f.nib), k);

  mats.body.envMapIntensity +=
    (ENV_INTENSITY - mats.body.envMapIntensity) * k;
  mats.hardware.envMapIntensity +=
    (ENV_INTENSITY * 1.15 - mats.hardware.envMapIntensity) * k;
  mats.nib.envMapIntensity += (ENV_INTENSITY * 1.3 - mats.nib.envMapIntensity) * k;
}

export default function KernPen() {
  const cap = useRef<THREE.Group>(null);

  const mats = useMemo(
    () => ({
      /** Barrel and cap — the finish the swatches write to. */
      body: new THREE.MeshPhysicalMaterial({
        color: "#a97c3c",
        metalness: 1,
        roughness: 0.44,
        envMapIntensity: 1,
      }),
      /** Clip, bands, finial, blind cap. */
      hardware: new THREE.MeshPhysicalMaterial({
        color: "#c08e46",
        metalness: 1,
        roughness: 0.26,
        envMapIntensity: 1.15,
      }),
      nib: new THREE.MeshPhysicalMaterial({
        color: "#e7c079",
        metalness: 1,
        roughness: 0.15,
        envMapIntensity: 1.3,
      }),
      /** Grip and feed — dark ebonite, constant across every finish. */
      ebonite: new THREE.MeshPhysicalMaterial({
        color: "#150c06",
        metalness: 0.06,
        roughness: 0.62,
        envMapIntensity: 0.8,
      }),
      cream: new THREE.MeshPhysicalMaterial({
        color: "#ffedd7",
        metalness: 0.35,
        roughness: 0.3,
        envMapIntensity: 1,
      }),
      dark: new THREE.MeshBasicMaterial({ color: "#1d1208" }),
    }),
    [],
  );

  useFrame((_, dt) => {
    animateMaterials(mats, dt);

    if (cap.current) {
      cap.current.position.x = mix(CAP_CLOSED_X, CAP_POSTED_X, productState.cap);
    }
  });

  return (
    <group>
      {/* ---------------- Cap ---------------- */}
      <group ref={cap} position={[CAP_CLOSED_X, 0, 0]}>
        <mesh rotation={ALONG_X} material={mats.body}>
          <cylinderGeometry args={[0.175, 0.175, 1.5, 48]} />
        </mesh>
        <mesh position={[0.72, 0, 0]} rotation={ALONG_X} material={mats.hardware}>
          <cylinderGeometry args={[0.185, 0.185, 0.1, 48]} />
        </mesh>
        <mesh position={[-0.79, 0, 0]} rotation={ALONG_X} material={mats.hardware}>
          <cylinderGeometry args={[0.115, 0.115, 0.16, 40]} />
        </mesh>
        <mesh position={[-0.9, 0, 0]} rotation={ALONG_X} material={mats.cream}>
          <cylinderGeometry args={[0.125, 0.125, 0.035, 40]} />
        </mesh>
        <mesh position={[0.16, 0.152, 0]} material={mats.hardware}>
          <boxGeometry args={[0.95, 0.05, 0.15]} />
        </mesh>
        <mesh position={[0.635, 0.158, 0]} material={mats.hardware}>
          <sphereGeometry args={[0.045, 24, 16]} />
        </mesh>
      </group>

      {/* ---------------- Barrel ---------------- */}
      <mesh position={[-0.25, 0, 0]} rotation={ALONG_X} material={mats.body}>
        <cylinderGeometry args={[BARREL_RADIUS, BARREL_RADIUS, 1.8, 48]} />
      </mesh>
      <mesh position={[-1.2, 0, 0]} rotation={ALONG_X} material={mats.hardware}>
        <cylinderGeometry args={[0.15, 0.15, 0.14, 40]} />
      </mesh>
      <mesh position={[-0.62, 0, 0]} rotation={ALONG_X} material={mats.cream}>
        <cylinderGeometry args={[0.162, 0.162, 0.04, 40]} />
      </mesh>

      {/* ---------------- Section + nib ---------------- */}
      <mesh position={[0.68, 0, 0]} rotation={ALONG_X} material={mats.hardware}>
        <cylinderGeometry args={[0.148, 0.148, 0.07, 40]} />
      </mesh>
      <mesh position={[0.965, 0, 0]} rotation={ALONG_X} material={mats.ebonite}>
        <cylinderGeometry args={[0.132, 0.132, 0.5, 40]} />
      </mesh>
      <mesh position={[1.36, -0.012, 0]} material={mats.ebonite}>
        <boxGeometry args={[0.42, 0.106, 0.12]} />
      </mesh>
      <mesh position={[1.46, 0, 0]} rotation={NIB_TIP_X} material={mats.nib}>
        <coneGeometry args={[0.092, 0.5, 32]} />
      </mesh>
      <mesh position={[1.4, 0.05, 0]} material={mats.dark}>
        <boxGeometry args={[0.34, 0.016, 0.022]} />
      </mesh>
    </group>
  );
}
