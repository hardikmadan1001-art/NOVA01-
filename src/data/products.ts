import { Product, ProductColor, ProductId } from "../types/product";

export const PRODUCT_COLORS: Record<string, ProductColor> = {
  "bubblegum-pink": { id: "bubblegum-pink", name: "Bubblegum Pink", hex: "#FF5C8A" },
  "neon-mint": { id: "neon-mint", name: "Neon Mint", hex: "#06D6A0" },
  "sunny-yellow": { id: "sunny-yellow", name: "Sunny Yellow", hex: "#FFD166" },
  "graphite": { id: "graphite", name: "Graphite", hex: "#2B2D42" },
  "titanium": { id: "titanium", name: "Titanium", hex: "#A7ABB4" },
};

export const PRODUCTS: Record<ProductId, Product> = {
  k1: {
    id: "k1",
    slug: "nova-k1",
    name: "NØVA K1",
    category: "75% Compact Mechanical Keyboard",
    description: "A compact mechanical playground with hot-swappable switches, double-shot PBT keycaps, and a translucent chassis.",
    longDescription: "The K1 is designed to turn typing into an expressive act. With its 75% layout and translucent body, it blends high-performance engineering with a playful aesthetic.",
    defaultColor: "bubblegum-pink",
    colors: Object.values(PRODUCT_COLORS),
    proposedPrice: 189,
    currency: "USD",
    modelPath: "/models/k1.glb",
    features: [
      { id: "switches", title: "Hot-swappable", description: "Change your feel without soldering." },
      { id: "caps", title: "Double-shot PBT", description: "Legends that never fade." },
      { id: "chassis", title: "Translucent Body", description: "See the engineering inside." },
    ],
    specifications: [
      { id: "layout", label: "Layout", value: "75% Compact", status: "provided" },
      { id: "switches", label: "Switches", value: "Mechanical", status: "provided" },
    ],
  },
  m1: {
    id: "m1",
    slug: "nova-m1",
    name: "NØVA M1",
    category: "Ergonomic Wireless Precision Mouse",
    description: "An ergonomic wireless precision mouse with a 26,000 DPI sensor concept and a titanium scroll wheel.",
    longDescription: "Designed for fluid movement, the M1 reduces the gap between intention and action with a sculpted shell and high-precision tracking.",
    defaultColor: "neon-mint",
    colors: Object.values(PRODUCT_COLORS),
    proposedPrice: 129,
    currency: "USD",
    modelPath: "/models/m1.glb",
    features: [
      { id: "sensor", title: "26K DPI Sensor", description: "Extreme precision tracking." },
      { id: "wheel", title: "Titanium Wheel", description: "A tactile, premium scrolling experience." },
      { id: "shell", title: "Soft-touch Matte", description: "Ergonomic comfort for long sessions." },
    ],
    specifications: [
      { id: "dpi", label: "Sensor", value: "26,000 DPI", status: "proposed" },
      { id: "polling", label: "Polling Rate", value: "1,000Hz", status: "proposed" },
    ],
  },
  d1: {
    id: "d1",
    slug: "nova-d1",
    name: "NØVA D1",
    category: "Programmable Desk Controller",
    description: "A programmable desk controller concept built around a weighted rotary dial and a circular OLED display.",
    longDescription: "The D1 is the centerpiece of the NØVA philosophy: physical control over digital complexity. One dial, infinite shortcuts.",
    defaultColor: "sunny-yellow",
    colors: Object.values(PRODUCT_COLORS),
    proposedPrice: 159,
    currency: "USD",
    modelPath: "/models/d1.glb",
    features: [
      { id: "dial", title: "Haptic Dial", description: "Weighted rotary encoder for precision." },
      { id: "screen", title: "OLED Display", description: "1.2-inch circular status screen." },
      { id: "body", title: "CNC Aluminum", description: "15-degree angled precision chassis." },
    ],
    specifications: [
      { id: "angle", label: "Chassis Angle", value: "15 Degrees", status: "provided" },
      { id: "screen", label: "Display", value: "1.2\" OLED", status: "proposed" },
    ],
  },
};

export const HOTBAR_SLOTS = [
  { id: 1, icon: "telescope", destination: "#hero", label: "COSMIC LOBBY" },
  { id: 2, icon: "hammer", destination: "#workshop", label: "HARDWARE WORKSHOP" },
  { id: 3, icon: "book", destination: "#lore", label: "THE LORE" },
  { id: 4, icon: "keyboard", destination: "#k1", label: "NØVA K1" },
  { id: 5, icon: "mouse", destination: "#m1", label: "NØVA M1" },
  { id: 6, icon: "dial", destination: "#d1", label: "NØVA D1" },
  { id: 7, icon: "anvil", destination: "#configurator", label: "CONFIGURATOR" },
  { id: 8, icon: "scroll", destination: "#specs", label: "ITEM SPECS" },
  { id: 9, icon: "chest", destination: "#checkout", label: "INVENTORY" },
];
