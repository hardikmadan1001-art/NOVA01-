import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createAluminumMaterial } from '@/lib/three/materials';
import { BRAND_COLORS } from '@/lib/three/materials';
import { ProductColorId } from '@/types/product';

interface D1ModelProps {
  colorId: ProductColorId;
}

export default function D1Model({ colorId }: D1ModelProps) {
  const group = useRef<THREE.Group>(null);
  const dialRef = useRef<THREE.Mesh>(null);

  // Simulate a dial rotation based on some state or just idle
  useFrame((state) => {
    if (dialRef.current) {
      dialRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={group} dispose={null}>
      {/* Chassis - Angled Aluminum Box */}
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.4, 1.5]} />
        <meshStandardMaterial color={BRAND_COLORS[colorId]} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Dial */}
      <mesh ref={dialRef} position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
        <meshStandardMaterial color="#A7ABB4" metalness={1} roughness={0.2} />
      </mesh>

      {/* OLED Screen */}
      <mesh position={[0, 0.22, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 32]} />
        <meshStandardMaterial color="#1E1E24" emissive="#000" roughness={0} />
      </mesh>
    </group>
  );
}
