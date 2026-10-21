import * as THREE from 'three';
import { ProductColorId } from '@/types/product';

export const BRAND_COLORS: Record<ProductColorId, string> = {
  "bubblegum-pink": "#FF5C8A",
  "neon-mint": "#06D6A0",
  "sunny-yellow": "#FFD166",
  "graphite": "#2B2D42",
  "titanium": "#A7ABB4",
};

export const createTranslucentMaterial = (color: string) => {
  return new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: 0.2,
    metalness: 0,
    transmission: 0.5,
    thickness: 0.5,
    ior: 1.45,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
    transparent: true,
    opacity: 0.8,
  });
};

export const createAluminumMaterial = (color: string) => {
  return new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.3,
    metalness: 0.9,
  });
};

export const createMatteMaterial = (color: string) => {
  return new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.8,
    metalness: 0,
  });
};
