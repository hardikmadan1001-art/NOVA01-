import React from 'react';
import { PRODUCTS } from '@/data/products';

export default function WorkshopSection() {
  return (
    <section id="workshop" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-sm font-mono uppercase tracking-widest text-gray-500">THE HARDWARE TRINITY</span>
        <h2 className="text-5xl md:text-7xl font-display font-bold mt-4 mb-6">THREE TOOLS. ONE VERY PERSONAL DESK.</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Every great setup has a rhythm. The K1 handles the words. The M1 handles the movement. The D1 handles the little things you wish took one less click.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.values(PRODUCTS).map((product) => (
          <div key={product.id} className="neo-brutalist-card p-6 flex flex-col h-full group cursor-pointer">
            <div className="mb-4 flex justify-between items-start">
              <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-1 border border-gray-300">
                ITEM 0{Object.values(PRODUCTS).indexOf(product) + 1} / {product.category.split(' ')[0].toUpperCase()}
              </span>
              <span className="text-xs font-mono text-green-600 font-bold">ONLINE</span>
            </div>

            <h3 className="text-3xl font-display font-bold mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-6 flex-grow">{product.description}</p>

            <div className="aspect-square bg-gray-50 rounded-3xl border-2 border-gray-100 mb-6 flex items-center justify-center overflow-hidden relative group-hover:scale-105 transition-transform duration-300">
               {/* Placeholder for 3D Model */}
               <div className="text-gray-300 font-bold text-4xl opacity-20">{product.id.toUpperCase()}</div>
               <div className="absolute bottom-4 right-4 bg-white border-2 border-[#1E1E24] px-3 py-1 text-[10px] font-mono font-bold shadow-[2px_2px_0_#1E1E24]">
                 +{(product.id === 'd1' ? '99' : product.id === 'm1' ? '30' : '50')} FLOW
               </div>
            </div>

            <button className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors mb-3">
              EXPLORE THE {product.id.toUpperCase()}
            </button>
            <button className="w-full py-3 border-2 border-black font-bold rounded-lg hover:bg-gray-100 transition-colors">
              ADD TO INVENTORY
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
