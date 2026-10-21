import React from 'react';
import { PRODUCTS } from '@/data/products';

export default function SpecsSection() {
  return (
    <section id="specs" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-sm font-mono uppercase tracking-widest text-gray-500">DATA SHEETS</span>
        <h2 className="text-6xl font-display font-bold mt-4 mb-6 tracking-tighter">ITEM SPECS</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {Object.values(PRODUCTS).map((product) => (
          <div key={product.id} className="neo-brutalist-card p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-display font-bold">{product.name}</h3>
              <div className="w-12 h-12 bg-gray-100 border-2 border-black flex items-center justify-center font-bold">
                {product.id.toUpperCase()}
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              {product.specifications.map(spec => (
                <div key={spec.id} className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-xs font-mono text-gray-500 uppercase">{spec.label}</span>
                  <span className="text-sm font-bold">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gray-50 border border-gray-200 text-[10px] font-mono text-gray-400 leading-relaxed">
              Designed by NØVA SYSTEMS. Built for the tactile enthusiast. 
              All specifications are subject to prototype revision.
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
