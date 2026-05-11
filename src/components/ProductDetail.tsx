import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Truck, Shield, Headphones } from "lucide-react";
import { PRODUCTS } from "../constants";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const product = PRODUCTS.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, "-").replace(/"/g, "") === slug,
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Producto no encontrado
          </h1>
          <Link
            to="/"
            className="text-brand-primary hover:underline font-medium"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <h1 className="text-brand-dark font-display text-xl font-bold">
              Punto Verde
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative rounded-[32px] overflow-hidden bg-slate-50 aspect-square">
            {product.promotion && (
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-brand-primary text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-brand-primary/20">
                  {product.promotion}
                </span>
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase font-black text-brand-primary tracking-widest mb-3">
              {product.category}
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
              {product.name}
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="mb-10">
              <span className="text-4xl font-black text-slate-900 font-display">
                {formattedPrice}
              </span>
              {product.promotion && (
                <span className="ml-4 text-lg text-slate-400 line-through">
                  {formattedPrice}
                </span>
              )}
            </div>

            <div className="flex gap-4 mb-10">
              <button className="flex-1 bg-brand-primary text-white py-4 px-8 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-brand-dark transition-colors flex items-center justify-center gap-3 shadow-lg shadow-brand-primary/20">
                <ShoppingCart size={20} />
                Comprar Ahora
              </button>
              <button className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 hover:border-brand-primary/30 hover:text-brand-primary transition-all">
                <ShoppingCart size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-white rounded-3xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center">
                  <Truck size={20} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Domicilio</p>
                  <p className="text-[10px] text-slate-400">Express incluido</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center">
                  <Shield size={20} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Garantia</p>
                  <p className="text-[10px] text-slate-400">2 anos oficial</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center">
                  <Headphones size={20} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Soporte</p>
                  <p className="text-[10px] text-slate-400">24/7 disponible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}