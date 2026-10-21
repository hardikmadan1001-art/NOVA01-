"use client";

import React, { useState } from 'react';
import ProductCanvas from '@/components/scenes/ProductCanvas';
import D1Model from '@/components/scenes/D1Model';
import { PRODUCTS } from '@/data/products';

export default function D1Section() {
  const [dialValue, setDialValue] = useState(0);

  const handleDialRotate = (e: React.WheelEvent) => {
    setDialValue(prev => prev + (e.deltaY > 0 ? 1 : -1));
  };

  return (
    <section id="d1" className="py-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row-reverse gap-12 items-center">
      <div className="w-full md:w-1/2">
        <span className="text-sm font-mono uppercase tracking-widest text-gray-500">PROJECT 03 / CONTROL</span>
        <h2 className="text-6xl font-display font-bold mt-4 mb-6 tracking-tighter">NØVA D1</h2>
        <p className="text-lg text-gray-600 mb-8">
          The centerpiece of the ecosystem. A physical bridge between you and your software. Rotate the dial to shift modes, adjust volume, or scrub timelines.
        </p>
        
        <div className="neo-brutalist-card p-6 bg-black text-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono uppercase">System Status</span>
            <span className="text-xs font-mono text-green-400">ACTIVE</span>
          </div>
          <div className="text-4xl font-mono text-center py-8 border-y border-white/20">
            VAL: {dialValue.toString().padStart(3, '0')}
          </div>
          <p className="text-[10px] font-mono text-gray-400 mt-4 text-center uppercase">
            Scroll over the model to simulate dial rotation
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-[600px] relative neo-brutalist-card" onWheel={handleDialRotate}>
        <ProductCanvas cameraPosition={[0, 1, 4]} target={[0, 0, 0]}>
          <D1Model colorId={PRODUCTS.d1.defaultColor} />
        </ProductCanvas>
      </div>
    </section>
  );
}
