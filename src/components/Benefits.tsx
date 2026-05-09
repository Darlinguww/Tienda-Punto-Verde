import React from 'react';
import { Truck, ShoppingBag, ShieldCheck } from 'lucide-react';
import { BENEFITS } from '../constants';

const ICON_MAP = {
  Truck: Truck,
  ShoppingBag: ShoppingBag,
  ShieldCheck: ShieldCheck,
};

export default function Benefits() {
  return (
    <section className="mb-20">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-display font-bold text-slate-900">¿Por qué elegirnos?</h2>
        <div className="h-[1px] flex-1 bg-slate-100 ml-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BENEFITS.map((benefit) => {
          const Icon = ICON_MAP[benefit.icon as keyof typeof ICON_MAP];
          return (
            <div 
              key={benefit.id}
              className="group bg-white p-10 rounded-[32px] border border-slate-100 hover:border-brand-primary/20 transition-all hover:shadow-2xl hover:shadow-brand-primary/5"
            >
              <div className="w-16 h-16 bg-brand-light rounded-[22px] flex items-center justify-center text-brand-primary mb-8 transition-transform group-hover:scale-110 duration-300">
                <Icon size={30} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
              <p className="text-slate-500 text-base leading-relaxed">
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}