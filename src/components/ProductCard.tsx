import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { cloudinaryWebP } from '../lib/cloudinary';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useCart();
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(product.price);

  const slug = product.slug ?? product.name.toLowerCase().replace(/\s+/g, '-').replace(/"/g, '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-500"
    >
      <Link to={`/producto/${slug}`} className="block">
        <div className="relative h-72 bg-slate-50 overflow-hidden">
          {product.promotion && (
            <div className="absolute top-5 left-5 z-10">
              <span className="bg-brand-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-brand-primary/20">
                {product.promotion}
              </span>
            </div>
          )}
          <img
            src={cloudinaryWebP(product.image, 800)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors" />
          
          <button 
            className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl shadow-slate-900/5 translate-y-24 group-hover:translate-y-0 transition-all duration-500 hover:bg-brand-primary hover:text-white z-20"
            onClick={(e) => { 
              e.preventDefault(); 
              addToCart(product);
            }}
          >
            <ShoppingCart size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-8">
          <p className="text-[10px] uppercase font-black text-brand-primary tracking-widest mb-2">{product.category}</p>
          <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-brand-primary transition-colors leading-tight">{product.name}</h3>
          <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">{product.description}</p>
          
          <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
            <span className="text-2xl font-black text-slate-900 font-display">{formattedPrice}</span>
            <span className="text-xs font-bold text-slate-400 hover:text-brand-primary transition-colors uppercase tracking-widest">Detalles</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}