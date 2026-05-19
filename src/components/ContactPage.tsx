import { ArrowLeft, Phone, Mail, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { useWhatsAppNumber } from "../hooks/useWhatsAppNumber";
import { useBusinessEmail } from "../hooks/useBusinessEmail";

export default function ContactPage() {
  const navigate = useNavigate();
  const whatsAppNumber = useWhatsAppNumber();
  const businessEmail = useBusinessEmail();

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
              <Phone size={40} className="text-brand-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
              Contáctanos
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Estamos listos para ayudarte. Contáctanos por el canal de tu preferencia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-50 p-6 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
                  <Phone size={24} className="text-brand-primary" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">WhatsApp</h3>
              </div>
              <p className="text-slate-600 mb-4">
                Chatea con nosotros directamente para resolver tus dudas y recibir asesoría personalizada.
              </p>
              {whatsAppNumber && (
                <a
                  href={`https://wa.me/${whatsAppNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold transition-colors"
                >
                  <Phone size={18} />
                  Abrir WhatsApp
                </a>
              )}
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
                  <Mail size={24} className="text-brand-primary" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Correo Electrónico</h3>
              </div>
              <p className="text-slate-600 mb-4">
                Escríbenos y te responderemos a la brevedad posible.
              </p>
              {businessEmail ? (
                <a
                  href={`mailto:${businessEmail}`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-brand-primary hover:bg-brand-dark text-white rounded-xl font-bold transition-colors"
                >
                  <Mail size={18} />
                  {businessEmail}
                </a>
              ) : (
                <p className="text-slate-400 text-sm">Cargando email...</p>
              )}
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
                  <Clock size={24} className="text-brand-primary" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Horario de Atención</h3>
              </div>
              <p className="text-slate-600 mb-4">
                Nuestro equipo está disponible para ayudarte en los siguientes horarios:
              </p>
              <div className="text-slate-800 space-y-1">
                <p><span className="font-medium">Lunes a Viernes:</span> 8:00 AM - 6:00 PM</p>
                <p><span className="font-medium">Sábados:</span> 9:00 AM - 2:00 PM</p>
                <p><span className="font-medium">Domingos:</span> Cerrado</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}