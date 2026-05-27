"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Orbit, Phone, Mail, Compass, Star, Sparkles } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin or active chat screens
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/chat')) {
    return null;
  }

  return (
    <footer className="w-full bg-slate-950/60 border-t border-white/5 pt-16 pb-8 px-6 mt-auto relative overflow-hidden">
      {/* Absolute Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Branding Col */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/KK_Logo.png?v=2"
              alt="Kkarthikeya Astrological Centre Logo"
              className="w-14 h-14 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-widest bg-gradient-to-r from-amber-200 to-white bg-clip-text text-transparent font-serif uppercase">
                Kkarthikeya
              </span>
              <span className="text-[8px] uppercase tracking-widest text-indigo-400 font-bold -mt-0.5">
                Astrological Centre
              </span>
            </div>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Personalized Vedic astrology guidance to help you make confident life decisions through scientific horoscope analysis and precise Muhurtham calculations.
          </p>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-slate-300 ml-1 text-[11px]">(5000+ Happy Users)</span>
          </div>
        </div>

        {/* Quick Sitemap */}
        <div className="space-y-3.5">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> Site Index
          </h4>
          <ul className="text-xs space-y-2 text-slate-400 font-medium">
            <li><Link href="/" className="hover:text-amber-300 transition-colors">Home Portal</Link></li>
            <li><Link href="/about" className="hover:text-amber-300 transition-colors">About Astrologer</Link></li>
            <li><Link href="/services" className="hover:text-amber-300 transition-colors">Services</Link></li>
            <li><Link href="/horoscope" className="hover:text-amber-300 transition-colors">Daily Horoscope</Link></li>
            <li><Link href="/panchangam" className="hover:text-amber-300 transition-colors">Daily Panchangam</Link></li>
            <li><Link href="/booking" className="hover:text-amber-300 transition-colors">Book Consultation</Link></li>
            <li><Link href="/about#contact" className="hover:text-amber-300 transition-colors">Conatct</Link></li>
          </ul>
        </div>

        {/* Core Specialities */}
        <div className="space-y-3.5">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Specialized Services
          </h4>
          <ul className="text-xs space-y-2 text-slate-400">
            <li><Link href="/services" className="hover:text-indigo-300 transition-colors">Horoscope Analysis</Link></li>
            <li><Link href="/services" className="hover:text-indigo-300 transition-colors">Marriage Compatibility (10 Koota)</Link></li>
            <li><Link href="/services" className="hover:text-indigo-300 transition-colors">Kadikara Prasannam (Horary)</Link></li>
            <li><Link href="/services" className="hover:text-indigo-300 transition-colors">House Warming & Grihapravesham</Link></li>
            <li><Link href="/services" className="hover:text-indigo-300 transition-colors">C-Section & Child Birth Horas</Link></li>
          </ul>
        </div>

        {/* Local SEO & Contact Info */}
        <div className="space-y-3.5">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
            Location Coordinates
          </h4>
          <div className="text-xs space-y-3 text-slate-400">
            <p className="leading-relaxed">
              <strong>Kkarthikeya Astrological Centre</strong><br />
              Astrologer in Chennai & Tamilnadu.<br />
              Online Consultations globally.
            </p>
            <div className="space-y-1">
              <a href="tel:+918344874681" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>+91 83448 74681</span>
              </a>
              <a href="mailto:kkarthikeya.astro@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>kkarthikeya.astro@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Social Bar & Copyright */}
      <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
        <div>
          © 2026 Kkarthikeya Astrological Centre. Locked in Cosmic Alignment.
        </div>

        {/* Social Icons matching Instagram, FB */}
        <div className="flex items-center gap-4">
          <a href="https://www.instagram.com/kkarthikeyaastro" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
            Instagram
          </a>
          <a href="https://www.facebook.com/kkarthikeyaastro" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            Facebook
          </a>
          <a href="/admin" className="hover:text-white transition-colors border border-white/10 rounded-full px-2.5 py-1 bg-white/2">
            Admin Core
          </a>
        </div>
      </div>
    </footer>
  );
}
