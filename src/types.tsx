export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  category: string;
  category_slug: string;
  image: string;
  featured?: boolean;
  destacado?: boolean;
  interes?: number;
  promotion?: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export type Category = string;

export interface CartItem {
  product: Product;
  quantity: number;
}
