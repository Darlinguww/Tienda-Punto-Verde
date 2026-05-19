import { ArrowLeft, Recycle, Zap, Droplets, TreePine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function SustainabilityPage() {
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
              <TreePine size={40} className="text-brand-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
              Sostenibilidad
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Nuestro compromiso con el medio ambiente y un futuro más verde para Colombia.
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Zap className="text-brand-primary" />
                Eficiencia Energética
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Todos nuestros productos están diseñados para reducir el consumo de energía. Desde neveras inverter hasta ventiladores de bajo consumo, cada electrodoméstico que ofrecemos cumple con los más altos estándares de eficiencia energética, ahorrando hasta un 60% en su factura de electricidad.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Droplets className="text-brand-primary" />
                Ahorro de Agua
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Nuestras lavadoras eco-eficientes utilizan tecnología avanzada para reducir el consumo de agua hasta un 50% comparado con equipos convencionales, sin comprometer la calidad del lavado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Recycle className="text-brand-primary" />
                Economía Circular
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Trabajamos con marcas que implementan programas de reciclaje y reutilización de componentes electrónicos. Cuando un producto llega al final de su vida útil, te guiamos para su correcta disposición a través de nuestros canales de reciclaje autorizados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <TreePine className="text-brand-primary" />
                Huella de Carbono
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Por cada producto vendido, plantamos un árbol en colaboración con organizaciones ambientales colombianas. Hasta la fecha, hemos contribuido a reforestar áreas naturales en diferentes regiones del país.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}