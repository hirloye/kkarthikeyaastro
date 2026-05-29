"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles, ShieldCheck, Star, Clock, Orbit, Sun
} from 'lucide-react';
import CosmicBackground from '@/components/CosmicBackground';
import AuthGuard from '@/components/AuthGuard';

export default function ServicesPage() {
  const [dynamicPrices, setDynamicPrices] = useState<Record<string, string>>({
    quick: "₹199",
    bronze: "₹399",
    silver: "₹599",
    gold: "₹799",
    marriage: "₹499",
    muhurtham: "₹499"
  });

  useEffect(() => {
    fetch('/api/pricing')
      .then(res => res.json())
      .then(data => {
        const prices: Record<string, string> = {};
        Object.keys(data).forEach(key => {
          prices[key] = data[key].price;
        });
        setDynamicPrices(prev => ({ ...prev, ...prices }));
      })
      .catch(err => console.error("Failed to fetch dynamic prices:", err));
  }, []);



  const muhurthams = [
    {
      id: "vehicle",
      title: "Vehicle Purchase Timing",
      benefits: "Jupiter & Venus hour checks, customized planetary hora matches.",
      image: "/assets/s1.webp"
    },
    {
      id: "house-warming",
      title: "House Warming Muhurtham",
      benefits: "Solar cycle maps, Vastu energy purification timing list.",
      image: "/assets/s2.webp"
    },
    {
      id: "c-section",
      title: "C-Section Delivery Timing",
      benefits: "Nakshatra calculations, Lagna strength alignment check.",
      image: "/assets/s3.webp"
    },
    {
      id: "marriage-timing",
      title: "Marriage Auspicious Timing",
      benefits: "Bride & Groom chart overlay check, custom Muhurtha hours.",
      image: "/assets/s4.webp"
    },
    {
      id: "business",
      title: "Business Opening Muhurtham",
      benefits: "Mercury & Lagna alignment checks, financial progress dates.",
      image: "/assets/s5.webp"
    },
    {
      id: "property",
      title: "Property Registration Timing",
      benefits: "Mars & 4th Lord hour evaluation, optimal registration periods.",
      image: "/assets/s6.webp"
    }
  ];

  return (
    <AuthGuard>
      <main className="relative min-h-screen w-full text-slate-100 overflow-x-hidden pb-16 selection:bg-amber-500/30">
        <CosmicBackground />

        {/* 🌌 Title Header */}
        <section className="pt-10 pb-8 px-6 max-w-6xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full border border-amber-500/20 bg-amber-950/20 text-amber-300 text-[9px] uppercase tracking-widest font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Sacred Offerings
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-serif leading-[1.15]">
            Astrology & Muhurtham Services
          </h1>
          <p className="text-xs md:text-sm text-indigo-300 font-bold uppercase tracking-widest">
            Personalized guidance for every step of your journey
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-indigo-500 mx-auto rounded-full mt-4" />
          <div className="max-w-6xl mx-auto px-6 space-y-12">

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {muhurthams.map((muh) => (
                <div
                  key={muh.id}
                  className="p-6 rounded-3xl border border-white/5 bg-slate-900/30 backdrop-blur-xl shadow-inner flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300"
                >
                  <div className="w-full h-32 md:h-40 mb-5 rounded-2xl overflow-hidden relative group">
                    <img src={muh.image} alt={muh.title} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <h3 className="text-xs font-black uppercase tracking-widest text-white font-serif">{muh.title}</h3>
                      <div className="text-right">
                        <span className="text-[10px] text-amber-400 font-bold block">{dynamicPrices.muhurtham}</span>
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest block font-bold">20 Mins</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-indigo-300 font-semibold leading-relaxed p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/5">
                      <strong>{muh.benefits}</strong>
                    </div>
                  </div>

                  <div className="pt-5">
                    <Link
                      href={`/booking?plan=muhurtham&service=${muh.id}`}
                      className="w-full py-2 rounded-xl border border-indigo-500/20 hover:border-indigo-500/50 text-[9px] uppercase tracking-widest font-black text-indigo-300 text-center block transition-all active:scale-95 hover:bg-indigo-500/5"
                    >
                      Book Muhurtham Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 rounded-3rem border border-white/5 bg-slate-900/30 backdrop-blur-xl max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white font-serif uppercase tracking-widest flex items-center gap-2">
                  Need a Custom Timing Consultation?
                </h3>
                <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                  If you have a complex event requiring multiple chart overlays (e.g. joint ventures or multiple baby delivery predictions), choose our <strong>Gold Plan</strong> for a full 60-minute session.
                </p>
              </div>
              <Link
                href="/booking?plan=gold"
                className="py-3 px-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest shadow-glow shrink-0"
              >
                Book Gold Consultation
              </Link>
            </div>

          </div>
        </section>



      </main>
    </AuthGuard>
  );
}
