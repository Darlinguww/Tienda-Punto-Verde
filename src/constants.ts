import { Product, Benefit } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Purificador de Aire Pro",
    description: "Ventilación inteligente y aire puro para tu hogar.",
    price: 299000,
    category: "Ventiladores",
    category_slug: "ventiladores",
    image:
      "https://images.unsplash.com/photo-1591290619615-585808298715?auto=format&fit=crop&q=80&w=400",
    featured: true,
  },
  {
    id: "2",
    name: 'Smart TV 4K 55"',
    description: "Resolución cinematográfica y eficiencia energética.",
    price: 1200000,
    category: "TV & Audio",
    category_slug: "tv-audio",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400",
    promotion: "-40% LIQUIDACIÓN",
  },
  {
    id: "3",
    name: "Lavadora Eco-Wash",
    description: "Ahorro de agua extremo y motores silenciosos.",
    price: 1500000,
    category: "Lavado Eco",
    category_slug: "lavado-eco",
    image:
      "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "4",
    name: "Nevera Inverter Duo",
    description: "Frío envolvente con consumo mínimo de energía.",
    price: 2500000,
    category: "Refrigeración",
    category_slug: "refrigeracion",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400",
  },
];

export const BENEFITS: Benefit[] = [
  {
    id: "b1",
    title: "Domicilio Express",
    description:
      "Entregamos tus pedidos en la puerta de tu casa con total seguridad.",
    icon: "Truck",
  },
  {
    id: "b2",
    title: "Venta competitiva",
    description: "Buenos precios desde una sola unidad para tu hogar.",
    icon: "ShoppingBag",
  },
  {
    id: "b3",
    title: "Confianza Total",
    description:
      "Garantía oficial y soporte técnico especializado siempre disponible.",
    icon: "ShieldCheck",
  },
];
