import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';

interface ProductCanvasProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  target?: [number, number, number];
  autoRotate?: boolean;
}

export default function ProductCanvas({
  children,
  cameraPosition = [0, 2, 5],
  target = [0, 0, 0],
  autoRotate = false
}: ProductCanvasProps) {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={cameraPosition} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        target={target}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
      />

      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.5} shadowBias={-0.001}>
          {children}
        </Stage>
        <Environment preset="city" />
        <ContactShadows
          opacity={0.4}
          scale={10}
          blur={2}
          far={10}
          resolution={256}
          color="#000000"
        />
      </Suspense>
    </Canvas>
  );
}
