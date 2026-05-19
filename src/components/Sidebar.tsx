import React from 'react';
import { LayoutDashboard, Fan, Tv, WashingMachine, Refrigerator, Tag, type LucideIcon } from 'lucide-react';
import { useProductsContext } from '../context/ProductContext';

const ICON_MAP: Record<string, LucideIcon> = {
  Fan,
  Tv,
  WashingMachine,
  Refrigerator,
  Tag,
};

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ activeCategory, onCategoryChange, isOpen, onToggle }: SidebarProps) {
  const { categories } = useProductsContext();

  const handleSelect = (slug: string) => {
    onCategoryChange(slug);
    if (window.innerWidth < 1024) onToggle();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-100 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <div>
              <h1 className="text-brand-dark font-display text-xl font-bold tracking-tight">Punto Verde</h1>
              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold">Premium</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => handleSelect('Dashboard')}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200
                ${activeCategory === 'Dashboard'
                  ? 'bg-brand-light text-brand-primary font-bold shadow-sm shadow-brand-primary/5'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <LayoutDashboard size={18} strokeWidth={activeCategory === 'Dashboard' ? 2.5 : 2} />
              <span className="text-sm">Inicio</span>
            </button>

            {categories.map((cat) => {
              const Icon = ICON_MAP[cat.icon] ?? Tag;
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelect(cat.slug)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200
                    ${isActive
                      ? 'bg-brand-light text-brand-primary font-bold shadow-sm shadow-brand-primary/5'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-sm">{cat.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
