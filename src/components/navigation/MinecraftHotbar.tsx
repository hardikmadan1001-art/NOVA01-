import React from 'react';
import { PRODUCTS, HOTBAR_SLOTS } from '@/data/products';
import { Telescope, Hammer, Book, Keyboard, MousePointer2, Disc, Anvil, Scroll, Package } from 'lucide-react';
import { useHotbar } from '@/hooks/playground/useHotbar';

const ICON_MAP: Record<string, React.ElementType> = {
  telescope: Telescope,
  hammer: Hammer,
  book: Book,
  keyboard: Keyboard,
  mouse: MousePointer2,
  dial: Disc,
  anvil: Anvil,
  scroll: Scroll,
  chest: Package,
};

export default function MinecraftHotbar() {
  const { activeSlot, setActiveSlot } = useHotbar();

  const handleSlotClick = (slotId: number, destination: string) => {
    setActiveSlot(slotId);
    const element = document.querySelector(destination);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '9') {
        const slotId = parseInt(e.key);
        const slot = HOTBAR_SLOTS.find(s => s.id === slotId);
        if (slot) {
          handleSlotClick(slotId, slot.destination);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveSlot]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
      {/* XP Bar */}
      <div className="w-64 h-3 bg-white border-2 border-[#1E1E24] relative overflow-hidden">
        <div
          className="h-full bg-[#06D6A0] transition-all duration-500 ease-out"
          style={{ width: `${(activeSlot / 9) * 100}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] font-mono font-bold uppercase tracking-tighter">
            LVL 99 TACTILE
          </span>
        </div>
      </div>

      {/* Hotbar Container */}
      <div className="flex gap-1 p-1 bg-white border-2 border-[#1E1E24] box-shadow-[4px_4px_0_#1E1E24] shadow-[4px_4px_0_#1E1E24]">
        {HOTBAR_SLOTS.map((slot) => {
          const Icon = ICON_MAP[slot.icon] || Package;
          const isActive = activeSlot === slot.id;

          return (
            <button
              key={slot.id}
              onClick={() => handleSlotClick(slot.id, slot.destination)}
              className={`
                w-12 h-12 flex items-center justify-center transition-all duration-100
                ${isActive
                  ? 'bg-[#FFD166] border-2 border-[#1E1E24] scale-110 z-10'
                  : 'bg-gray-100 border border-gray-300 hover:bg-gray-200'
                }
              `}
              title={slot.label}
            >
              <Icon size={20} className={isActive ? 'text-[#1E1E24]' : 'text-gray-500'} />
              {isActive && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1E1E24] text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap font-mono">
                  {slot.id.toString().padStart(2, '0')} / {slot.label}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
