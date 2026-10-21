"use client";

import React, { useRef } from 'react';
import * as THREE from 'three';
import { createMatteMaterial } from '@/lib/three/materials';
import { BRAND_COLORS } from '@/lib/three/materials';
import { ProductColorId } from '@/types/product';

interface M1ModelProps {
  colorId: ProductColorId;
  position?: [number, number, number];
}

export default function M1Model({ colorId, position = [0, 0, 0] }: M1ModelProps) {
  return (
    <group dispose={null} position={position}>
      {/* Simple Mouse Shell - Sphere distorted */}
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={BRAND_COLORS[colorId]} roughness={0.7} metalness={0} />
      </mesh>
      {/* Scroll Wheel */}
      <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.15, 16]} />
        <meshStandardMaterial color="#A7ABB4" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}
