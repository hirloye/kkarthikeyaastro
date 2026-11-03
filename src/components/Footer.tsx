"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Mail, Compass, Star, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const pathname = usePathname();
  const { t, tText } = useLanguage();

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
            <Image
              src="/assets/KK_Logo.webp"
              alt="Kkarthikeya Astrological Centre Logo"
              width={56}
              height={56}
              className="w-14 h-14 object-contain"
              priority
              loading="eager"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-widest bg-gradient-to-r from-amber-200 to-white bg-clip-text text-transparent font-serif uppercase">
                {t.nav.centreName}
              </span>
              <span className="text-[8px] uppercase tracking-widest text-indigo-400 font-bold -mt-0.5">
                {t.nav.centreSubtitle}
              </span>
            </div>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            {t.footer.description}
          </p>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-slate-300 ml-1 text-[11px]">({t.common.happyClients})</span>
          </div>
        </div>

        {/* Quick Sitemap */}
        <div className="space-y-3.5">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> {t.footer.sitemap}
          </h4>
          <ul className="text-xs space-y-2 text-slate-400 font-medium">
            <li><Link href="/" prefetch={false} className="hover:text-amber-300 transition-colors">{t.nav.home}</Link></li>
            <li><Link href="/about" prefetch={false} className="hover:text-amber-300 transition-colors">{t.nav.about}</Link></li>
            <li><Link href="/services" prefetch={false} className="hover:text-amber-300 transition-colors">{t.nav.services}</Link></li>
            <li><Link href="/horoscope" prefetch={false} className="hover:text-amber-300 transition-colors">{t.nav.horoscope}</Link></li>
            <li><Link href="/panchangam" prefetch={false} className="hover:text-amber-300 transition-colors">{t.nav.panchangam}</Link></li>
            <li><Link href="/birth-chart" prefetch={false} className="hover:text-amber-300 transition-colors">{t.nav.birthChart}</Link></li>
            <li><Link href="/booking" prefetch={false} className="hover:text-amber-300 transition-colors">{t.nav.booking}</Link></li>
            <li><Link href="/about#contact" prefetch={false} className="hover:text-amber-300 transition-colors">{tText("Contact", "தொடர்பு")}</Link></li>
          </ul>
        </div>

        {/* Core Specialities */}
        <div className="space-y-3.5">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> {t.footer.specializedServices}
          </h4>
          <ul className="text-xs space-y-2 text-slate-400">
            <li><Link href="/services" prefetch={false} className="hover:text-indigo-300 transition-colors">{tText("Horoscope Analysis", "ஜாதக கணிப்பு & பலன்கள்")}</Link></li>
            <li><Link href="/services" prefetch={false} className="hover:text-indigo-300 transition-colors">{tText("Marriage Compatibility (10 Koota)", "திருமணப் பொருத்தம் (10 பொருத்தம்)")}</Link></li>
            <li><Link href="/services" prefetch={false} className="hover:text-indigo-300 transition-colors">{tText("Kadikara Prasannam (Horary)", "கடிகாரப் பிரசன்னம்")}</Link></li>
            <li><Link href="/services" prefetch={false} className="hover:text-indigo-300 transition-colors">{tText("House Warming & Grihapravesham", "கிரகப்பிரவேசம் & புதுமனை புகுவிழா")}</Link></li>
            <li><Link href="/services" prefetch={false} className="hover:text-indigo-300 transition-colors">{tText("Child Birth & Auspicious Timing", "குழந்தை பிறப்பு சுப முகூர்த்தம்")}</Link></li>
          </ul>
        </div>

        {/* Local SEO & Contact Info */}
        <div className="space-y-3.5">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
            {t.footer.location}
          </h4>
          <div className="text-xs space-y-3 text-slate-400">
            <p className="leading-relaxed">
              <strong>{t.nav.centreName} {t.nav.centreSubtitle}</strong><br />
              {t.footer.locationDesc}
            </p>
            <div className="space-y-1">
              <a href="tel:+917845369302" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>+91 78453 69302</span>
              </a>
              <a href="mailto:kkarthikeyaastro@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>kkarthikeyaastro@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Social Bar & Copyright */}
      <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
        <div>
          {tText("© 2026 Kkarthikeya Astrological Centre. All Rights Reserved.", "© 2026 கார்த்திகேயா ஜோதிட மையம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.")}
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
            {t.footer.adminCore}
          </a>
        </div>
      </div>
    </footer>
  );
}
