import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useWhatsAppNumber } from '../hooks/useWhatsAppNumber';

export default function WhatsAppFAB() {
  const number = useWhatsAppNumber();

  if (!number) return null;

  const message = encodeURIComponent('Hola, necesito más información sobre los productos de Punto Verde');

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 sm:gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full h-12 sm:h-14 px-4 sm:px-5 shadow-xl shadow-[#25D366]/30 hover:shadow-2xl hover:shadow-[#25D366]/40 active:scale-95 transition-all duration-300"
    >
      <MessageCircle size={22} className="shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
      <span className="text-xs sm:text-sm font-bold whitespace-nowrap hidden sm:block pr-1">
        ¿Necesitas ayuda?
      </span>
    </a>
  );
}
