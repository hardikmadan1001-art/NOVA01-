export type ProductId = "k1" | "m1" | "d1";

export type ProductColorId =
  | "bubblegum-pink"
  | "neon-mint"
  | "sunny-yellow"
  | "graphite"
  | "titanium";

export interface ProductColor {
  id: ProductColorId;
  name: string;
  hex: string;
}

export interface ProductSpecification {
  id: string;
  label: string;
  value: string;
  status: "provided" | "proposed" | "unknown";
  description?: string;
}

export interface ProductFeature {
  id: string;
  title: string;
  description: string;
}

export interface Product {
  id: ProductId;
  slug: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  defaultColor: ProductColorId;
  colors: ProductColor[];
  features: ProductFeature[];
  specifications: ProductSpecification[];
  proposedPrice: number;
  currency: string;
  modelPath: string;
}

export interface CartItem {
  productId: ProductId;
  variantId: ProductColorId;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface ProductConfiguration {
  k1: { color: ProductColorId; position: [number, number, number] };
  m1: { color: ProductColorId; position: [number, number, number] };
  d1: { color: ProductColorId; position: [number, number, number] };
  activeProduct: ProductId;
}

export interface HotbarSlot {
  id: number;
  icon: string;
  destination: string;
  label: string;
}
