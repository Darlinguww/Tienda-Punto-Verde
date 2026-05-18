import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import Benefits from "./components/Benefits";
import WhatsAppButton from "./components/WhatsAppButton";
import ProductDetail from "./components/ProductDetail";
import { PRODUCTS } from "./constants";
import { Category } from "./types";
import { useState, useEffect } from "react";
import CartDrawer from "./components/CartDrawer";
import GuaranteePage from "./components/GuaranteePage";
import LoginModal from "./components/LoginModal";

function MainPage({ defaultCategory = "Dashboard" }: { defaultCategory?: Category }) {
  const [activeCategory, setActiveCategory] = useState<Category>(defaultCategory);
  
  // Refrescar la categoría si el usuario cambia de ruta en el menú (ej. de Inicio a Catálogo)
  useEffect(() => {
    setActiveCategory(defaultCategory);
  }, [defaultCategory]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = PRODUCTS.filter((p) => {
    // 1. Filtro por categoría
    const matchesCategory =
      activeCategory === "Dashboard" || activeCategory === "Catálogo" ||
      p.category === activeCategory ||
      (activeCategory === "Promociones" && p.promotion);

    // 2. Filtro por búsqueda de texto
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 lg:ml-64 transition-all">
        <Header 
          onMenuToggle={() => setIsSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCartClick={() => {}} // Ya lo maneja el contexto interno de Header
          onUserClick={() => setIsLoginOpen(true)}
        />

        <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
          {activeCategory === "Dashboard" && <Hero />}

          <section className="mb-16 mt-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-display text-brand-dark mb-2">
                  {activeCategory === "Dashboard" ? "Novedades de Temporada" : 
                   activeCategory === "Catálogo" ? "Catálogo de Productos" : activeCategory}
                </h2>
                <p className="text-gray-500 text-sm">
                  Explora nuestra coleccion curada de productos eco-eficientes.
                </p>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white rounded-xl text-sm font-medium border border-gray-100 hover:border-brand-primary/30 transition-all">
                  Popular
                </button>
                <button className="px-4 py-2 bg-white rounded-xl text-sm font-medium border border-gray-100 hover:border-brand-primary/30 transition-all">
                  Precio
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>

          {activeCategory === "Dashboard" && <Benefits />}

          <footer className="mt-40 -mx-4 md:-mx-8 lg:-mx-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 px-12 py-20 bg-white border-t border-slate-100">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                  <h1 className="text-brand-dark font-display text-2xl font-bold">
                    Punto Verde
                  </h1>
                </div>
                <p className="text-slate-500 text-base max-w-sm leading-relaxed mb-8">
                  Innovacion tecnologica para un hogar eco-eficiente. Lideres en
                  soluciones sostenibles con garantia certificada.
                </p>
                <div className="flex gap-4">
                  {["FB", "IG", "TW", "LI"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-brand-primary hover:border-brand-primary/20 transition-all font-bold text-xs"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-display font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">
                  Productos
                </h4>
                <ul className="space-y-4">
                  {["Ventiladores", "TV & Audio", "Lavado Eco", "Refrigeracion"].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm font-medium text-slate-500 hover:text-brand-primary transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-display font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">
                  Compania
                </h4>
                <ul className="space-y-4">
                  {["Sobre Nosotros", "Sostenibilidad", "Garantia", "Contacto"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-sm font-medium text-slate-500 hover:text-brand-primary transition-colors"
                    >
                      {item}
                    </a>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-900 px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col md:flex-row items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>© 2026 PUNTO VERDE S.A.S.</span>
                <span className="hidden md:block w-1.5 h-1.5 bg-brand-primary rounded-full" />
                <span>NIT: 901.455.122-1</span>
              </div>
              <div className="flex items-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                  Chat disponible hasta 6:00 PM
                </div>
                <a href="#" className="hover:text-white transition-colors">
                  Terminos
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Privacidad
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>

      <WhatsAppButton />
      <CartDrawer />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/catalogo" element={<MainPage defaultCategory="Catálogo" />} />
      <Route path="/garantia" element={<GuaranteePage />} />
      <Route path="/producto/:slug" element={<ProductDetail />} />
    </Routes>
  );
}