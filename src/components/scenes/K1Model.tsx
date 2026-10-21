"use client";

import React from 'react';
import * as THREE from 'three';
import { createTranslucentMaterial } from '@/lib/three/materials';
import { BRAND_COLORS } from '@/lib/three/materials';
import { ProductColorId } from '@/types/product';

interface K1ModelProps {
  colorId: ProductColorId;
  exploded: number; // 0 to 1
  position?: [number, number, number];
}

export default function K1Model({ colorId, exploded = 0, position = [0, 0, 0] }: K1ModelProps) {
  return (
    <group dispose={null} position={position}>
      {/* Chassis */}
      <mesh position={[0, -0.1 * exploded, 0]}>
        <boxGeometry args={[2, 0.2, 1]} />
        <meshPhysicalMaterial
          color={BRAND_COLORS[colorId]}
          transmission={0.5}
          thickness={0.2}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* PCB */}
      <mesh position={[0, 0.1 * exploded, 0]}>
        <boxGeometry args={[1.9, 0.05, 0.9]} />
        <meshStandardMaterial color="#1E4E32" />
      </mesh>

      {/* Keycaps - Representative cluster */}
      <group position={[0, 0.3 * exploded, 0]}>
        {[...Array(10)].map((_, i) => (
          <mesh key={i} position={[(i % 5) * 0.3 - 0.6, 0, Math.floor(i / 5) * 0.3 - 0.15]}>
            <boxGeometry args={[0.2, 0.1, 0.2]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
