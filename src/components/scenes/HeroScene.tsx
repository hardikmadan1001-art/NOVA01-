"use client";

import React, { useState } from 'react';
import ProductCanvas from '@/components/scenes/ProductCanvas';
import D1Model from '@/components/scenes/D1Model';
import M1Model from '@/components/scenes/M1Model';
import K1Model from '@/components/scenes/K1Model';
import { PRODUCTS } from '@/data/products';

export default function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <ProductCanvas cameraPosition={[0, 3, 7]} target={[0, 0, 0]} autoRotate={true}>
        <group>
          <D1Model colorId={PRODUCTS.d1.defaultColor} />
          <M1Model colorId={PRODUCTS.m1.defaultColor} position={[1.5, 0, -1]} />
          <K1Model colorId={PRODUCTS.k1.defaultColor} position={[-1.5, 0, -1]} exploded={0} />
        </group>
      </ProductCanvas>
    </div>
  );
}
