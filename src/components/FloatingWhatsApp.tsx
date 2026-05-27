"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  // Hide on admin portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const phoneNumber = "918344874681"; // Standard Astro Phone Number
  const message = encodeURIComponent("Welcome to Kkarthikeya Astrological Centre. I would like to book a Vedic astrology consultation.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50 pointer-events-auto"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
    >
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] border border-emerald-400/30 hover:scale-110 active:scale-95 transition-all duration-300"
        title="Consult via WhatsApp"
        id="floating-whatsapp-btn"
      >
        {/* Pulsing Aura */}
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25 group-hover:opacity-40" />

        {/* WhatsApp Premium Icon */}
        <svg 
          className="w-7 h-7 fill-current relative z-10 transition-transform group-hover:rotate-12 duration-300" 
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.666.988 3.31 1.47 5.375 1.471 5.488 0 9.954-4.461 9.957-9.945.002-2.657-1.03-5.154-2.905-7.03C17.198 1.765 14.708.73 12.012.73c-5.49 0-9.959 4.461-9.962 9.948-.001 2.032.521 4.021 1.514 5.751L2.57 21.43l5.077-1.332zM18.062 14.9c-.327-.164-1.93-.954-2.227-1.063-.297-.109-.513-.164-.729.164-.216.327-.837 1.063-1.026 1.28-.19.216-.379.24-.705.077-.327-.164-1.38-.509-2.63-1.625-.972-.867-1.629-1.939-1.82-2.266-.19-.327-.02-.504.143-.667.147-.146.327-.379.49-.569.164-.19.219-.327.327-.54.109-.216.054-.407-.027-.57-.081-.164-.729-1.758-1.002-2.413-.265-.636-.532-.55-.729-.56-.19-.01-.407-.01-.624-.01-.216 0-.569.081-.867.407-.297.327-1.137 1.112-1.137 2.71 0 1.597 1.164 3.136 1.326 3.354.164.218 2.292 3.5 5.552 4.908.775.335 1.38.535 1.85.684.779.248 1.488.213 2.048.129.624-.093 1.93-.789 2.2-1.514.271-.725.271-1.347.19-1.471-.082-.124-.298-.186-.625-.35z"/>
        </svg>

        {/* Tooltip Label */}
        <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-300 origin-right whitespace-nowrap bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs py-1.5 px-3.5 rounded-xl font-medium tracking-wide shadow-antigravity pointer-events-none">
          Book on WhatsApp
        </span>
      </a>
    </motion.div>
  );
}
