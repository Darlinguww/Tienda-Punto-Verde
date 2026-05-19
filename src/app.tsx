import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import Benefits from "./components/Benefits";
import { Category } from "./types";
import { useState, useEffect } from "react";
import CartDrawer from "./components/CartDrawer";
import GuaranteePage from "./components/GuaranteePage";
import AboutPage from "./components/AboutPage";
import SustainabilityPage from "./components/SustainabilityPage";
import ContactPage from "./components/ContactPage";
import LoginModal from "./components/LoginModal";
import ProductDetail from "./components/ProductDetail";
import { useAuth } from "./context/AuthContext";
import { useProductsContext } from "./context/ProductContext";
import AdminPanel from "./components/AdminPanel";
import WhatsAppFAB from "./components/WhatsAppFAB";

function MainPage({ defaultCategory = "Dashboard" }: { defaultCategory?: Category }) {
  const [activeCategory, setActiveCategory] = useState<Category>(defaultCategory);

  useEffect(() => {
    setActiveCategory(defaultCategory);
  }, [defaultCategory]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoginModalOpen, setIsLoginModalOpen, user } = useAuth();
  const navigate = useNavigate();

  const isCatalogo = activeCategory === "Catálogo";

  useEffect(() => {
    if (isCatalogo && searchQuery.trim().length > 2) {
      const timeout = setTimeout(() => {
        import("./lib/analytics").then(({ trackEvent }) => trackEvent('search', searchQuery.trim().toLowerCase()));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery, isCatalogo]);

  const { products, categories, loading } = useProductsContext();

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === "Dashboard" ||
      activeCategory === "Catálogo" ||
      p.category_slug === activeCategory ||
      (activeCategory === "promociones" && !!p.promotion);

    const matchesSearch = !isCatalogo || !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const activeCategoryName =
    categories.find((c) => c.slug === activeCategory)?.name ?? activeCategory;

  const popularProducts = [...products]
    .filter(p => (p.interes ?? 0) > 0)
    .sort((a, b) => (b.interes ?? 0) - (a.interes ?? 0));

  const displayedProducts =
    activeCategory === 'Dashboard' && popularProducts.length > 0
      ? popularProducts
      : filteredProducts;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 lg:ml-64 transition-all flex flex-col">
        <Header
          onMenuToggle={() => setIsSidebarOpen(true)}
          showSearch={isCatalogo}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUserClick={() => {
            if (user?.isAdmin) {
              navigate("/admin");
            } else {
              setIsLoginModalOpen(true);
            }
          }}
        />

        <div className="flex-1 p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
          {activeCategory === "Dashboard" && <Hero onExplore={() => setActiveCategory('promociones')} />}

          <section className="mb-16 mt-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-display text-brand-dark mb-2">
                  {activeCategory === "Dashboard"
                    ? popularProducts.length > 0 ? "Lo Más Popular" : "Novedades de Temporada"
                    : activeCategory === "Catálogo" ? "Catálogo de Productos"
                    : activeCategoryName}
                </h2>
                <p className="text-gray-500 text-sm">
                  {activeCategory === "Catálogo" && searchQuery
                    ? `Resultados para "${searchQuery}"`
                    : "Explora nuestra coleccion curada de productos eco-eficientes."}
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
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-[32px] border border-slate-100 overflow-hidden animate-pulse">
                    <div className="h-72 bg-slate-100" />
                    <div className="p-8 space-y-3">
                      <div className="h-3 bg-slate-100 rounded w-1/3" />
                      <div className="h-5 bg-slate-100 rounded w-2/3" />
                      <div className="h-3 bg-slate-100 rounded w-full" />
                    </div>
                  </div>
                ))
              ) : (
                displayedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))
              )}
            </div>
          </section>

          {activeCategory === "Dashboard" && <Benefits />}
        </div>

        <footer className="mt-auto">
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
                  {["FB"].map((social) => (
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
                  Compañía
                </h4>
                <ul className="space-y-4 flex flex-col">
                  {[
                    { label: "Sobre Nosotros", path: "/sobre-nosotros" },
                    { label: "Sostenibilidad", path: "/sostenibilidad" },
                    { label: "Garantía", path: "/garantia" },
                    { label: "Contacto", path: "/contacto" },
                  ].map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.path}
                        className="text-sm font-medium text-slate-500 hover:text-brand-primary transition-colors"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-900 px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col md:flex-row items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>© 2026 PUNTO VERDE S.A.S.</span>
                <span className="hidden md:block w-1.5 h-1.5 bg-brand-primary rounded-full" />
                <span>NIT: 901.xxx.xxx-1</span>
              </div>
            </div>
          </footer>
      </main>

    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/catalogo" element={<MainPage defaultCategory="Catálogo" />} />
        <Route path="/garantia" element={<GuaranteePage />} />
        <Route path="/sobre-nosotros" element={<AboutPage />} />
        <Route path="/sostenibilidad" element={<SustainabilityPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/producto/:slug" element={<ProductDetail />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <CartDrawer />
      <LoginModal />
      <WhatsAppFAB />
    </>
  );
}