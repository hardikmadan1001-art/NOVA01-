/**
 * KERN 01 finishes.
 *
 * The UI is monochrome and the accent blue is spoken for, so the product
 * carries all of the colour. The swatch row writes into this module-level
 * store and the 3D pen lerps its materials toward the selection — no React
 * state in the render loop.
 */

export type FinishKey =
  | "brass"
  | "starlight"
  | "silver"
  | "sky"
  | "citrus"
  | "blush"
  | "indigo"
  | "midnight";

export type Finish = {
  key: FinishKey;
  name: string;
  /** The swatch field colour. */
  swatch: string;
  /** Barrel and cap. */
  body: string;
  /** Clip, bands, finial. */
  hardware: string;
  /** Nib. */
  nib: string;
  /** How glossy the body is. */
  roughness: number;
};

export const FINISHES: Finish[] = [
  {
    key: "brass",
    name: "Unlacquered brass",
    swatch: "#c08e46",
    body: "#a97c3c",
    hardware: "#c08e46",
    nib: "#e7c079",
    roughness: 0.44,
  },
  {
    key: "starlight",
    name: "Starlight",
    swatch: "#f0e4d3",
    body: "#f0e4d3",
    hardware: "#c08e46",
    nib: "#e7c079",
    roughness: 0.24,
  },
  {
    key: "silver",
    name: "Silver",
    swatch: "#e3e4e5",
    body: "#e3e4e5",
    hardware: "#b9bcc0",
    nib: "#cfd3d8",
    roughness: 0.2,
  },
  {
    key: "sky",
    name: "Sky",
    swatch: "#c8d8e0",
    body: "#c8d8e0",
    hardware: "#b9bcc0",
    nib: "#cfd3d8",
    roughness: 0.26,
  },
  {
    key: "citrus",
    name: "Citrus",
    swatch: "#dddc8c",
    body: "#dddc8c",
    hardware: "#c08e46",
    nib: "#e7c079",
    roughness: 0.26,
  },
  {
    key: "blush",
    name: "Blush",
    swatch: "#e8d0d0",
    body: "#e8d0d0",
    hardware: "#c08e46",
    nib: "#e7c079",
    roughness: 0.26,
  },
  {
    key: "indigo",
    name: "Indigo",
    swatch: "#596680",
    body: "#596680",
    hardware: "#b9bcc0",
    nib: "#cfd3d8",
    roughness: 0.22,
  },
  {
    key: "midnight",
    name: "Midnight",
    swatch: "#2e3642",
    body: "#2e3642",
    hardware: "#b9bcc0",
    nib: "#cfd3d8",
    roughness: 0.22,
  },
];

export const finishState = {
  current: FINISHES[0],
};

export function setFinish(key: FinishKey) {
  const next = FINISHES.find((f) => f.key === key);
  if (next) finishState.current = next;
}

/** How much studio light the materials pick up. Constant: one room, one mood. */
export const ENV_INTENSITY = 1.15;

/**
 * Product state the stage writes and the model reads, so the cap can post
 * from the scroll position without either component owning the other.
 * 0 = capped, 1 = fully posted.
 */
export const productState = {
  cap: 0,
};
