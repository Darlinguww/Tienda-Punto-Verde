import { ArrowLeft, ShieldCheck, Wrench, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import WhatsAppButton from "./WhatsAppButton";
import CartDrawer from "./CartDrawer";

export default function GuaranteePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <main className="flex-1 transition-all">
        <Header onMenuToggle={() => {}} />

        <div className="p-4 md:p-8 lg:p-12 max-w-[1000px] mx-auto mt-10 bg-white rounded-3xl shadow-sm border border-slate-100">
          <button
            onClick={() => navigate("/")}
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            Volver a la tienda
          </button>

          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} className="text-brand-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
              Garantía Oficial Punto Verde
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Todos nuestros productos cuentan con garantía oficial directa con el fabricante para tu total tranquilidad.
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <ShieldCheck className="text-brand-primary" />
                Cobertura de 2 Años
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Nuestros productos eco-eficientes están cubiertos por una garantía estándar de 2 años contra defectos de fabricación o fallas en el funcionamiento normal. Si tu equipo presenta algún inconveniente técnico, nuestro equipo de soporte se encargará de gestionarlo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Wrench className="text-brand-primary" />
                Soporte Técnico Especializado
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Contamos con técnicos certificados listos para ayudarte. Si requieres asistencia técnica, el proceso es:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Contactar a nuestro equipo por WhatsApp con tu número de factura.</li>
                <li>Describir el problema (puedes enviar fotos o videos).</li>
                <li>Agendaremos una revisión remota o presencial según el caso.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <RefreshCw className="text-brand-primary" />
                Políticas de Devolución
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Tienes hasta 15 días hábiles después de la compra para solicitar un cambio o devolución si el producto no cumple con tus expectativas, siempre y cuando se encuentre en su empaque original, sin uso y con todas sus etiquetas y manuales.
              </p>
            </section>
          </div>
        </div>
      </main>

    </div>
  );
}
