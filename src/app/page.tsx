import React from 'react';
import MinecraftHotbar from '@/components/navigation/MinecraftHotbar';
import WorkshopSection from '@/sections/WorkshopSection';
import HeroScene from '@/components/scenes/HeroScene';
import K1Section from '@/sections/playground/K1Section';
import M1Section from '@/sections/playground/M1Section';
import D1Section from '@/sections/playground/D1Section';
import SpecsSection from '@/sections/playground/SpecsSection';
import InventorySection from '@/sections/playground/InventorySection';

export default function Page() {
  return (
    <main className="relative min-h-screen">
      {/* Announcement Strip */}
      <div className="w-full py-2 bg-white border-b border-gray-200 text-center">
        <span className="text-[10px] font-mono font-bold uppercase tracking-tighter">
          THE DESK IS YOURS. THE RULES ARE OPTIONAL. <span className="ml-4 opacity-50">NØVA PLAYGROUND / EXPERIMENT 001</span>
        </span>
      </div>

      {/* Nav Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-4xl bg-white/80 backdrop-blur-md border-2 border-[#1E1E24] box-shadow-[4px_4px_0_#1E1E24] shadow-[4px_4px_0_#1E1E24] rounded-full px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-xl tracking-tighter">NØVA SYSTEMS</span>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-mono font-bold">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            PLAYGROUND ONLINE
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
          <a href="#hero" className="hover:text-gray-500 transition-colors">PLAYGROUND</a>
          <a href="#workshop" className="hover:text-gray-500 transition-colors">HARDWARE</a>
          <a href="#lore" className="hover:text-gray-500 transition-colors">THE LORE</a>
          <a href="#configurator" className="hover:text-gray-500 transition-colors">CONFIGURE</a>
          <a href="#specs" className="hover:text-gray-500 transition-colors">SPECIFICATIONS</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-40 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <span className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4">
          NØVA SYSTEMS / INTERACTIVE HARDWARE COLLECTION
        </span>
        <h1 className="text-7xl md:text-9xl font-display font-bold tracking-tighter mb-6">
          PLAY WITH <br /> YOUR DESK.
        </h1>
        <HeroScene />
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 relative z-10">
          Three tools. Infinite ways to make them yours. Meet the keyboard that invites experimentation, the mouse built for fluid movement, and the dial that puts your favorite controls within reach.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-4 bg-[#1E1E24] text-white font-bold rounded-full hover:bg-black transition-all hover:scale-105 active:scale-95">
            ENTER THE PLAYGROUND
          </button>
          <button className="px-8 py-4 bg-white border-2 border-[#1E1E24] font-bold rounded-full hover:bg-gray-50 transition-all hover:scale-105 active:scale-95">
            MEET THE TRINITY
          </button>
        </div>
      </section>

      <WorkshopSection />

      {/* Product Deep-Dives */}
      <K1Section />
      <M1Section />
      <D1Section />

      {/* Utility Sections */}
      <SpecsSection />
      <InventorySection />

      <MinecraftHotbar />
    </main>
  );
}
