import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhatsAppButton() {
  const handleClick = async () => {
    // Track click in backend
    try {
      await fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          button: 'WhatsApp Floating',
          timestamp: new Date().toISOString() 
        })
      });
    } catch (e) {
      console.error('Analytics error:', e);
    }
    
    window.open('https://wa.me/573000000000?text=Hola,%20me%20gustaría%20hacer%20un%20pedido%20en%20Punto%20Verde.', '_blank');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 bg-[#25D366] text-white px-6 py-4 rounded-2xl shadow-2xl shadow-[#25D366]/40 font-semibold group transition-all"
    >
      <div className="relative">
        <MessageCircle size={24} className="fill-white" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold leading-none mb-1 text-left">Escríbenos</p>
        <p className="text-sm">Pedir por WhatsApp ahora</p>
      </div>
    </motion.button>
  );
}
