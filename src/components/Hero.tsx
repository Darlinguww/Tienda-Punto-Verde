import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
      {/* Main Banner */}
      <div className="lg:col-span-2 relative overflow-hidden rounded-[40px] bg-slate-100 min-h-[500px] flex items-center">
        <img 
          src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200" 
          alt="Banner Principal"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent" />
        
        <div className="relative h-full p-12 md:p-16 flex flex-col justify-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-extrabold uppercase tracking-widest rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Ofertas de la semana
            </div>
            
            <h2 className="text-5xl md:text-7xl text-slate-900 font-display font-extrabold leading-[1.05] tracking-tight mb-8">
              Innovación para un <span className="text-brand-primary">Hogar Sostenible</span>
            </h2>
            
            <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-md">
              Electrodomésticos de alta eficiencia y tecnología de punta. Envíos inmediatos para equipar tu hogar.
            </p>

            <button className="inline-flex items-center gap-4 bg-brand-primary hover:bg-brand-dark text-white px-8 py-5 rounded-2xl font-bold shadow-xl shadow-brand-primary/20 transition-all group scale-100 hover:scale-[1.02] active:scale-95">
              EXPLORAR COLECCIÓN
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Featured Card */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-2xl shadow-brand-dark/5 relative overflow-hidden flex flex-col">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-brand-primary text-xs font-bold uppercase tracking-wider mb-1">Destacado del Mes</p>
            <h3 className="text-2xl font-bold text-slate-900">Aire Smart V4</h3>
            <p className="text-slate-400 text-sm">Purificación Inteligente</p>
          </div>
          <div className="text-xl font-black text-slate-900">$299.900</div>
        </div>
        
        <div className="aspect-square bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 mb-8 overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1591290619615-585808298715?auto=format&fit=crop&q=80&w=400" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            alt="Product"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <div className="bg-brand-light text-brand-primary px-4 py-3 rounded-2xl text-[10px] font-bold flex items-center justify-center uppercase tracking-wider">Alta Potencia</div>
          <div className="bg-slate-100 text-slate-600 px-4 py-3 rounded-2xl text-[10px] font-bold flex items-center justify-center uppercase tracking-wider text-center">Modo Eco</div>
        </div>
      </div>
    </section>
  );
}