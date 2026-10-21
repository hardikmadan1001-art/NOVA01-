import React, { useState } from 'react';
import ProductCanvas from '@/components/scenes/ProductCanvas';
import M1Model from '@/components/scenes/M1Model';
import { PRODUCTS } from '@/data/products';

export default function M1Section() {
  const [viewMode, setViewMode] = useState<'standard' | 'internal' | 'exploded'>('standard');

  return (
    <section id="m1" className="py-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
      <div className="w-full md:w-1/2">
        <span className="text-sm font-mono uppercase tracking-widest text-gray-500">PROJECT 02 / PRECISION</span>
        <h2 className="text-6xl font-display font-bold mt-4 mb-6 tracking-tighter">NØVA M1</h2>
        <p className="text-lg text-gray-600 mb-8">
          Precision in every pixel. The M1 blends ergonomic sculpture with a professional-grade sensor, designed to vanish in your hand.
        </p>
        
        <div className="flex gap-4 mb-8">
          {(['standard', 'internal', 'exploded'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 text-xs font-bold uppercase border-2 border-[#1E1E24] transition-all ${
                viewMode === mode ? 'bg-[#FFD166] shadow-[2px_2px_0_#1E1E24]' : 'bg-white hover:bg-gray-50'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/2 h-[600px] relative neo-brutalist-card">
        <ProductCanvas cameraPosition={[0, 1, 4]} target={[0, 0, 0]}>
          <M1Model colorId={PRODUCTS.m1.defaultColor} />
        </ProductCanvas>
      </div>
    </section>
  );
}
