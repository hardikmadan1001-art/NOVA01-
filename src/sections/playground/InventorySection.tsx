import React from 'react';
import { PRODUCTS } from '@/data/products';

export default function InventorySection() {
  return (
    <section id="checkout" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-sm font-mono uppercase tracking-widest text-gray-500">CARGO BAY</span>
        <h2 className="text-6xl font-display font-bold mt-4 mb-6 tracking-tighter">YOUR INVENTORY</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="neo-brutalist-card p-8">
          <h3 className="text-2xl font-display font-bold mb-6">Selected Items</h3>
          <div className="space-y-4 mb-8">
            {Object.values(PRODUCTS).map(product => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white border border-gray-300 flex items-center justify-center font-bold text-xs">
                    {product.id.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{product.name}</p>
                    <p className="text-[10px] font-mono text-gray-500">{product.currency} {product.proposedPrice}</p>
                  </div>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-black" />
              </div>
            ))}
          </div>
          <div className="border-t-2 border-black pt-6 flex justify-between items-end">
            <div>
              <p className="text-xs font-mono uppercase text-gray-500">Total Weight</p>
              <p className="text-2xl font-bold">4.2 KG</p>
            </div>
            <button className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all">
              CONFIRM SHIPMENT
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="neo-brutalist-card p-6 bg-yellow-50">
            <h4 className="font-bold uppercase text-sm mb-2">Shipping Warning</h4>
            <p className="text-xs text-gray-600 italic">
              Your shipment will be delivered via NØVA Express. Expected arrival: 3-5 Standard Galactic Days.
            </p>
          </div>
          <div className="neo-brutalist-card p-6 bg-blue-50">
            <h4 className="font-bold uppercase text-sm mb-2">Customization Note</h4>
            <p className="text-xs text-gray-600 italic">
              All items are assembled to order in the NØVA Workshop.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
