import { create } from 'zustand';

interface HotbarState {
  activeSlot: number;
  setActiveSlot: (slot: number) => void;
}

export const useHotbar = create<HotbarState>((set) => ({
  activeSlot: 1,
  setActiveSlot: (slot) => set({ activeSlot: slot }),
}));
