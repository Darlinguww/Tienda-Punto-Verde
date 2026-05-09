export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  featured?: boolean;
  promotion?: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export type Category = 'Ventiladores' | 'TV' | 'Lavadoras' | 'Neveras' | 'Promociones' | 'Dashboard';