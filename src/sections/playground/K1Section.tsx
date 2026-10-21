"use client";

import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import ProductCanvas from '@/components/scenes/ProductCanvas';
import K1Model from '@/components/scenes/K1Model';
import { PRODUCTS } from '@/data/products';

export default function K1Section() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Map scroll progress to exploded view value
  const explodedValue = useTransform(scrollYProgress, [0.2, 0.7], [0, 2]);

  return (
    <section id="k1" ref={containerRef} className="relative min-h-[300vh] px-6 py-24">
      <div className="sticky top-0 h-screen flex items-center justify-between overflow-hidden">
        <div className="w-1/3 z-10">
          <span className="text-sm font-mono uppercase tracking-widest text-gray-500">PROJECT 01 / MECHANICAL</span>
          <h2 className="text-6xl font-display font-bold mt-4 mb-6 tracking-tighter">NØVA K1</h2>
          <p className="text-lg text-gray-600 mb-8">
            An exploded view of precision. From the translucent chassis to the custom PBT keycaps, every layer is an invitation to customize.
          </p>
          <div className="space-y-4">
            {PRODUCTS.k1.features.map(feature => (
              <div key={feature.id} className="neo-brutalist-card p-4">
                <h4 className="font-bold uppercase text-sm">{feature.title}</h4>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-2/3 h-full relative">
          <ProductCanvas cameraPosition={[0, 2, 5]} target={[0, 0, 0]}>
            <K1Model 
              colorId={PRODUCTS.k1.defaultColor} 
              exploded={explodedValue} 
            />
          </ProductCanvas>
        </div>
      </div>
    </section>
  );
}
