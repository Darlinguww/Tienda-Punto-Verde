import React from 'react';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 md:px-12 h-20 flex items-center justify-between">
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={onMenuToggle}
          className="p-2 hover:bg-slate-50 rounded-xl lg:hidden transition-colors"
        >
          <Menu size={22} className="text-slate-600" />
        </button>

        <div className="relative max-w-sm w-full hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar productos..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-brand-primary/20 focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <nav className="hidden lg:flex items-center gap-10 mr-12 text-sm font-semibold tracking-tight">
          <a href="#" className="text-brand-dark border-b-2 border-brand-primary pb-1">Inicio</a>
          <a href="#" className="text-slate-500 hover:text-brand-primary transition-colors">Catálogo</a>
          <a href="#" className="text-slate-500 hover:text-brand-primary transition-colors">Garantía</a>
        </nav>

        <div className="flex items-center gap-2">
          <button className="p-3 hover:bg-slate-50 rounded-2xl relative transition-all group">
            <ShoppingCart size={20} className="text-slate-600 group-hover:text-brand-primary" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-primary rounded-full ring-2 ring-white" />
          </button>
          <button className="p-3 hover:bg-slate-50 rounded-2xl transition-all group">
            <User size={20} className="text-slate-600 group-hover:text-brand-primary" />
          </button>
        </div>
      </div>
    </header>
  );
}