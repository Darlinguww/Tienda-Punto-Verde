import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductsContext } from '../context/ProductContext';
import { cloudinaryWebP } from '../lib/cloudinary';
import { useHeroBanner } from '../hooks/useHeroBanner';

export default function Hero({ onExplore }: { onExplore?: () => void }) {
  const banner = useHeroBanner();
  const { products } = useProductsContext();
  const destacados = products.filter((p) => p.destacado);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (destacados.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % destacados.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [destacados.length]);

  const prev = () => setCurrent((i) => (i - 1 + destacados.length) % destacados.length);
  const next = () => setCurrent((i) => (i + 1) % destacados.length);

  const product = destacados[current];

  const formattedPrice = product
    ? new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(product.price)
    : '';

  const productSlug = product
    ? (product.slug ?? product.name.toLowerCase().replace(/\s+/g, '-').replace(/"/g, ''))
    : '';

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
      {/* Main Banner */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-[40px] bg-slate-100 min-h-[500px] flex items-center">
        {banner?.image_url && (
          <img
            src={cloudinaryWebP(banner.image_url, 1600)}
            alt="Banner Principal"
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent" />

        <div className="relative h-full p-12 md:p-16 flex flex-col justify-center max-w-2xl">
          <AnimatePresence mode="wait">
            {banner ? (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-extrabold uppercase tracking-widest rounded-full mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                  Ofertas de la semana
                </div>

                <h2 className="text-5xl md:text-7xl text-slate-900 font-display font-extrabold leading-[1.05] tracking-tight mb-8">
                  {banner.title.split(' ').slice(0, -2).join(' ')}{' '}
                  <span className="text-brand-primary">
                    {banner.title.split(' ').slice(-2).join(' ')}
                  </span>
                </h2>

                <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-md">
                  {banner.description}
                </p>

                <button
                  onClick={onExplore}
                  className="inline-flex items-center gap-4 bg-brand-primary hover:bg-brand-dark text-white px-8 py-5 rounded-2xl font-bold shadow-xl shadow-brand-primary/20 transition-all group scale-100 hover:scale-[1.02] active:scale-95"
                >
                  EXPLORAR COLECCIÓN
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 w-full max-w-lg"
              >
                <div className="h-5 w-36 bg-slate-200 rounded-full animate-pulse" />
                <div className="space-y-3">
                  <div className="h-12 w-full bg-slate-200 rounded-2xl animate-pulse" />
                  <div className="h-12 w-4/5 bg-slate-200 rounded-2xl animate-pulse" />
                </div>
                <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                <div className="h-14 w-52 bg-slate-200 rounded-2xl animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Carrusel de Destacados */}
      {destacados.length > 0 && product && (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-2xl shadow-brand-dark/5 relative overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col flex-1"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-brand-primary text-xs font-bold uppercase tracking-wider mb-1">
                    Destacados del Mes
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{product.name}</h3>
                  <p className="text-slate-400 text-sm">{product.category}</p>
                </div>
                <div className="text-lg font-black text-slate-900 shrink-0">{formattedPrice}</div>
              </div>

              {/* Imagen */}
              <Link
                to={`/producto/${productSlug}`}
                className="aspect-square bg-slate-50 rounded-3xl border border-slate-100 mb-6 overflow-hidden group block"
              >
                <img
                  src={cloudinaryWebP(product.image, 600)}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </Link>

              {/* CTA */}
              <Link
                to={`/producto/${productSlug}`}
                className="w-full py-3 bg-brand-primary text-white rounded-2xl text-sm font-bold text-center hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20"
              >
                Ver producto
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Navegación (solo si hay más de uno) */}
          {destacados.length > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-1.5 items-center">
                {destacados.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current ? 'bg-brand-primary w-6' : 'bg-slate-200 w-1.5'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-brand-primary hover:border-brand-primary/20 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-brand-primary hover:border-brand-primary/20 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
