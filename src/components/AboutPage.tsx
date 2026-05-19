import { ArrowLeft, Leaf, Heart, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 transition-all">
        <Header onMenuToggle={() => {}} />

        <div className="p-4 md:p-8 lg:p-12 max-w-[1000px] mx-auto mt-10 mb-20 bg-white rounded-3xl shadow-sm border border-slate-100">
          <button
            onClick={() => navigate("/")}
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            Volver a la tienda
          </button>

          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-brand-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
              Sobre Nosotros
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Conoce la historia y el propósito de Punto Verde, tu tienda de confianza para productos eco-eficientes.
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Heart className="text-brand-primary" />
                Nuestra Historia
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Punto Verde nació en Colombia con la visión de democratizar el acceso a tecnología eco-eficiente para el hogar. Somos distribuidores autorizados de las marcas más reconocidas del mercado, ofreciendo productos que combinan innovación, calidad y respeto por el medio ambiente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Award className="text-brand-primary" />
                Nuestra Misión
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Nuestra misión es proporcionar soluciones tecnológicas que reduzcan el consumo de energía y agua en los hogares colombianos, contribuye a un futuro más sostenible mientras economiza en las facturas de servicios públicos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Leaf className="text-brand-primary" />
                Valores
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Compromiso con la sostenibilidad ambiental</li>
                <li>Transparencia y honestidad en todas nuestras transacciones</li>
                <li>Excelencia en el servicio al cliente</li>
                <li>Productos de alta calidad con garantía oficial</li>
                <li>Precios competitivos y accesibles</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}