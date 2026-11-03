"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles, Orbit, Sun, Star, Compass,
  ChevronRight, MessageSquare, Award,
  PhoneCall, CheckCircle2
} from 'lucide-react';
import CosmicBackground from '@/components/CosmicBackground';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t, language, tText } = useLanguage();
  const [reviewsData, setReviewsData] = useState<{
    rating: number;
    totalReviews: number;
    googleSearchUrl: string;
    reviews: Array<{
      id: number;
      author: string;
      location: string;
      rating: number;
      text: string;
      time: string;
    }>;
  } | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
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

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          setReviewsData(data);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    }
    fetchReviews();
  }, []);

  const pricingPlans = [
    {
      id: "bronze",
      title: tText("BRONZE", "வெண்கலம்"),
      subtitle: tText("CONSULTATION", "ஆலோசனை"),
      price: dynamicPrices.bronze,
      duration: tText("15 Minutes Consultation", "15 நிமிட ஆலோசனை"),
      colorClass: "border-amber-700/50 bg-gradient-to-b from-amber-950/20 to-slate-900/40 text-amber-300",
      btnClass: "bg-gradient-to-r from-amber-700 to-amber-800 text-white hover:from-amber-600 hover:to-amber-700 shadow-[0_4px_15px_rgba(180,83,9,0.3)]",
      benefits: language === 'ta' ? [
        "தொலைபேசி / அரட்டை உதவி",
        "அடிப்படை ஜாதக ஆய்வு",
        "எளிய பரிகார வழிகாட்டல்",
        "1 முக்கிய வாழ்க்கை கேள்விக்கான தீர்வு"
      ] : [
        tText("Phone / Chat Support", "தொலைபேசி / அரட்டை ஆதரவு"),
        tText("Basic Horoscope Analysis", "அடிப்படை ஜாதக கணிப்பு"),
        tText("Simple Remedies Included", "எளிய பரிகார வழிகாட்டல்"),
        tText("1 Key Life Question Answered", "1 முக்கிய கேள்விக்கான தீர்வு")
      ]
    },
    {
      id: "silver",
      title: tText("SILVER", "வெள்ளி"),
      subtitle: tText("CONSULTATION", "ஆலோசனை"),
      price: dynamicPrices.silver,
      duration: tText("30 Minutes Consultation", "30 நிமிட விரிவான ஆலோசனை"),
      popular: true,
      colorClass: "border-slate-400/50 bg-gradient-to-b from-slate-800/20 to-slate-900/40 text-slate-200 shadow-[0_0_30px_rgba(148,163,184,0.1)]",
      btnClass: "bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-500 hover:to-slate-600 shadow-[0_4px_15px_rgba(71,85,105,0.3)]",
      benefits: language === 'ta' ? [
        "முழுமையான ஜாதகப் பலன்கள்",
        "தொழில் / திருமணம் / நிதி குறித்த ஆலோசனை",
        "பிரத்யேக வேத பரிகாரங்கள்",
        "முன்னுரிமை உடனடி பதில்"
      ] : [
        tText("Detailed Horoscope Reading", "முழுமையான ஜாதக ஆய்வு"),
        tText("Career / Marriage / Finance Focus", "தொழில் / திருமணம் / நிதி ஆலோசனை"),
        tText("Personalized Vedic Remedies", "தனிப்பயனாக்கப்பட்ட வேத பரிகாரங்கள்"),
        tText("Priority Consultation Slot", "முன்னுரிமை நேர ஒதுக்கீடு")
      ]
    },
    {
      id: "gold",
      title: tText("GOLD", "தங்கம்"),
      subtitle: tText("CONSULTATION", "ஆலோசனை"),
      price: dynamicPrices.gold,
      duration: tText("45-60 Minutes Deep Analysis", "45-60 நிமிட ஆழமான ஆய்வு"),
      colorClass: "border-yellow-500/50 bg-gradient-to-b from-yellow-950/20 to-slate-900/40 text-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.15)]",
      btnClass: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-400 hover:to-yellow-500 shadow-[0_4px_20px_rgba(234,179,8,0.3)] font-black",
      benefits: language === 'ta' ? [
        "ஆழ்ந்த முழு ஜாதகக் கணிப்பு",
        "வாழ்வின் அனைத்து பகுதிகள் ஆய்வு",
        "மேம்பட்ட பரிகாரங்கள் & கணிப்புகள்",
        "முன்னுரிமை முன்பதிவு & அடுத்த நாள் ஆலோசனை",
        "1 மாத தொடர் ஆலோசனை உதவி"
      ] : [
        tText("In-Depth Horoscope & Life Timeline Study", "ஆயுள், தசா புக்தி முழு ஜாதக ஆய்வு"),
        tText("All Major Life Areas Covered (Career, Health, Marriage, Wealth)", "வாழ்வின் அனைத்து நிலைகளுக்கும் வழிகாட்டல்"),
        tText("Advanced Remedies & Predictions", "துல்லியமான எதிர்கால கணிப்பு & பரிகாரம்"),
        tText("Priority Booking & Next-day Consultation", "அடுத்த நாள் உடனடி ஆலோசனை"),
        tText("1-Month Follow-Up Support", "1 மாத தொடர் வழிகாட்டல்")
      ]
    },
    {
      id: "marriage",
      title: tText("MARRIAGE", "திருமணம்"),
      subtitle: tText("MATCHING", "பொருத்தம்"),
      price: dynamicPrices.marriage,
      duration: tText("Kundli Matching", "ஜாதகப் பொருத்தம்"),
      colorClass: "border-rose-500/50 bg-gradient-to-b from-rose-950/20 to-slate-900/40 text-rose-300",
      btnClass: "bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-400 hover:to-rose-500 shadow-[0_4px_15px_rgba(244,63,94,0.3)]",
      benefits: language === 'ta' ? [
        "விரிவான திருமணப் பொருத்தம்",
        "10 விதமான பொருத்தங்கள் ஆய்வு",
        "செவ்வாய் & தோஷ பரிசீலனை",
        "பரிகாரங்கள் & நல்வழிகாட்டல்"
      ] : [
        tText("Detailed Compatibility Analysis", "விரிவான திருமணப் பொருத்த ஆய்வு"),
        tText("10-Point Marriage Compatibility Check", "10 விதமான பொருத்தங்கள் சரிபார்த்தல்"),
        tText("Mars & Planetary Dosha Check", "செவ்வாய் தோஷம் & நாக தோஷ ஆய்வு"),
        tText("Remedies & Guidance Included", "பரிகாரங்கள் & முகூர்த்த ஆலோசனைகள்")
      ]
    }
  ];

  return (
    <main className="relative min-h-screen w-full text-slate-100 overflow-x-hidden pb-16 selection:bg-amber-500/30">
      <CosmicBackground />

      {/* 🌌 Hero Section */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center pt-16 px-6 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse-glow" />

        <div className="max-w-4xl mx-auto grid md:grid-cols-12 gap-8 items-center pt-8">

          {/* Copy Side (Left) */}
          <div className="md:col-span-7 text-left space-y-6 z-10">
            <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full border border-amber-500/20 bg-amber-950/30 text-amber-300 text-[10px] uppercase tracking-widest font-bold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400/20 text-amber-400" />
              {t.home.badge}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6.5xl font-extrabold tracking-tight text-white leading-[1.1] font-serif">
              {t.home.heroTitle1} <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
                {t.home.heroTitle2}
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-300/90 leading-relaxed max-w-xl">
              {t.home.heroDesc}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/booking"
                prefetch={false}
                className="py-3 px-7 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black tracking-widest uppercase shadow-[0_10px_30px_rgba(245,158,11,0.2)] active:scale-95 transition-all duration-300 text-center flex items-center justify-center gap-1"
              >
                {t.common.bookConsultation}
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                prefetch={false}
                className="py-3 px-7 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white text-xs font-bold tracking-widest uppercase hover:bg-white/10 transition-all duration-300 text-center"
              >
                {t.common.exploreServices}
              </Link>
            </div>

            {/* Google Reviews Mini Badge */}
            <div className="inline-flex items-center gap-3 p-3 rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-md mt-4">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-[10px] text-slate-300 tracking-wide font-medium">
                {t.home.ratingBadge}
              </div>
            </div>
          </div>

          {/* Portrait Photo Container (Right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="md:col-span-5 relative flex justify-center z-10"
          >
            <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center group p-2 drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              {/* Glowing center aura */}
              <div className="absolute w-48 h-48 bg-amber-500/30 blur-[50px] rounded-full pointer-events-none" />

              {/* Golden Zodiac Wheel SVG */}
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full z-10 select-none"
              >
                <defs>
                  <radialGradient id="goldPlate" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                    <stop offset="0%" stopColor="#fef9c3" />
                    <stop offset="20%" stopColor="#fef08a" />
                    <stop offset="60%" stopColor="#fde047" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </radialGradient>
                  <radialGradient id="innerGold" cx="50%" cy="50%" r="50%" fx="35%" fy="35%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#fcd34d" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </radialGradient>
                  <radialGradient id="redRim" cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
                    <stop offset="85%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </radialGradient>
                  <filter id="insetShadow">
                    <feOffset dx="0" dy="2" />
                    <feGaussianBlur stdDeviation="3" result="offset-blur" />
                    <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                    <feFlood floodColor="black" floodOpacity="0.3" result="color" />
                    <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                    <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                  </filter>
                  <filter id="dropShadow">
                    <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
                  </filter>
                </defs>

                {/* 1. Base Mild Gold/Amber Rim */}
                <circle cx="200" cy="200" r="195" fill="url(#redRim)" stroke="#b45309" strokeWidth="2" filter="url(#dropShadow)" />

                {/* 2. Outer Golden Zodiac Ring */}
                <circle cx="200" cy="200" r="180" fill="url(#goldPlate)" filter="url(#insetShadow)" />

                <g className="animate-[spin_60s_linear_infinite] origin-center">
                  {[...Array(12)].map((_, i) => (
                    <path
                      key={i}
                      d="M 200 20 C 220 50, 180 80, 200 110"
                      transform={`rotate(${i * 30} 200 200)`}
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-60"
                    />
                  ))}

                  {/* South Indian Style Vedic Rashi Names & Images */}
                  {[
                    { name: 'MESHA', nameTa: 'மேஷம்', img: '/assets/zodiac/aries.png' },
                    { name: 'VRISHA', nameTa: 'ரிஷபம்', img: '/assets/zodiac/taurus.png' },
                    { name: 'MITHUNA', nameTa: 'மிதுனம்', img: '/assets/zodiac/gemini.png' },
                    { name: 'KARKA', nameTa: 'கடகம்', img: '/assets/zodiac/cancer.png' },
                    { name: 'SIMHA', nameTa: 'சிம்மம்', img: '/assets/zodiac/leo.png' },
                    { name: 'KANYA', nameTa: 'கன்னி', img: '/assets/zodiac/virgo.png' },
                    { name: 'TULA', nameTa: 'துலாம்', img: '/assets/zodiac/libra.png' },
                    { name: 'VRISCHIKA', nameTa: 'விருச்சிகம்', img: '/assets/zodiac/scorpio.png' },
                    { name: 'DHANUS', nameTa: 'தனுசு', img: '/assets/zodiac/sagittarius.png' },
                    { name: 'MAKARA', nameTa: 'மகரம்', img: '/assets/zodiac/capricorn.png' },
                    { name: 'KUMBHA', nameTa: 'கும்பம்', img: '/assets/zodiac/aquarius.png' },
                    { name: 'MEENA', nameTa: 'மீனம்', img: '/assets/zodiac/pisces.png' }
                  ].map((sign, i) => {
                    const angle = (i * 30 - 75) * (Math.PI / 180);
                    const radius = 145;
                    const x = 200 + radius * Math.cos(angle);
                    const y = 200 + radius * Math.sin(angle);
                    const groupRotation = i * 30 + 15; 
                    return (
                      <g key={i} transform={`rotate(${groupRotation} ${x} ${y})`}>
                        <image
                          href={sign.img}
                          x={x - 16}
                          y={y - 24}
                          width="32"
                          height="32"
                          className="drop-shadow-md"
                        />
                        <text
                          x={x}
                          y={y + 14}
                          className="text-[9px] font-black fill-black/80 tracking-widest"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {language === 'ta' ? sign.nameTa : sign.name}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* 3. Middle Planetary Ring */}
                <circle cx="200" cy="200" r="110" fill="url(#redRim)" stroke="#b45309" strokeWidth="1" filter="url(#insetShadow)" />
                <circle cx="200" cy="200" r="104" fill="url(#innerGold)" filter="url(#insetShadow)" />

                <g className="animate-[spin_40s_linear_infinite_reverse] origin-center">
                  <circle cx="200" cy="200" r="85" fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="4 4" />
                  
                  {['☉', '☽', '♂', '☿', '♃', '♀', '♄', '☊'].map((planet, i) => {
                    const angle = (i * 45 - 90) * (Math.PI / 180);
                    const radius = 75;
                    const x = 200 + radius * Math.cos(angle);
                    const y = 200 + radius * Math.sin(angle);
                    return (
                      <g key={i}>
                        <circle cx={200 + 94 * Math.cos(angle)} cy={200 + 94 * Math.sin(angle)} r="5" fill="#d97706" />
                        <text
                          x={x}
                          y={y}
                          className="text-[24px] font-bold fill-black/70"
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(${-i * 45} ${x} ${y})`}
                        >
                          {planet}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* 4. Center Sun/Mandala Area */}
                <circle cx="200" cy="200" r="48" fill="url(#redRim)" stroke="#b45309" strokeWidth="1" />
                <circle cx="200" cy="200" r="42" fill="url(#goldPlate)" filter="url(#insetShadow)" />

                <g className="animate-[spin_20s_linear_infinite] origin-center">
                  {[...Array(8)].map((_, i) => (
                    <path
                      key={i}
                      d="M 200 158 L 208 180 L 200 186 L 192 180 Z"
                      fill="#b45309"
                      transform={`rotate(${i * 45} 200 200)`}
                    />
                  ))}
                  <circle cx="200" cy="200" r="14" fill="#92400e" />
                  <circle cx="200" cy="200" r="6" fill="#fbbf24" />
                </g>
              </svg>

              {/* Center Lucide Sun overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="relative flex items-center justify-center w-full h-full animate-[spin_20s_linear_infinite]">
                  <Sun className="w-8 h-8 text-amber-500 fill-amber-500/20 mix-blend-overlay" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 🏆 Stats Highlights Bento Grid */}
      <section className="py-12 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t.home.statsUsers, val: "5000+", desc: t.home.statsUsersDesc, icon: Award },
            { label: t.home.statsMarriage, val: "500+", desc: t.home.statsMarriageDesc, icon: Orbit },
            { label: t.home.statsMuhurtham, val: "1000+", desc: t.home.statsMuhurthamDesc, icon: Compass },
            { label: t.home.statsFormats, val: tText("Online / Phone", "நேரடி / ஆன்லைன்"), desc: t.home.statsFormatsDesc, icon: MessageSquare }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-white/5 bg-slate-900/20 backdrop-blur-md shadow-inner flex flex-col justify-between hover:border-amber-500/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-5 h-5 text-amber-400" />
                <span className="text-[8px] text-indigo-400 font-black tracking-widest uppercase">{t.common.verified}</span>
              </div>
              <div>
                <div className="text-lg md:text-2xl font-black text-white font-serif tracking-tight leading-tight break-words">{stat.val}</div>
                <div className="text-[9px] uppercase tracking-widest text-slate-300 font-extrabold mt-1">{stat.label}</div>
                <div className="text-[10px] text-slate-500 mt-1 leading-snug">{stat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ✨ Services Highlights */}
      <section className="py-20 bg-slate-950/20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-3">{t.home.plansHeading}</div>
            <h2 className="text-3xl md:text-4.5xl font-bold text-white font-serif">{t.home.plansTitle}</h2>
            <p className="text-slate-400 text-xs md:text-sm mt-3 max-w-xl mx-auto">
              {t.home.plansSubtitle}
            </p>
          </div>

          {/* 🛸 Quick Chat Horizontal Strip */}
          <div className="w-full rounded-2xl border border-indigo-500/40 bg-slate-950/60 p-4.5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-glow relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/10 via-purple-950/10 to-indigo-950/10 pointer-events-none" />

            <div className="flex items-center gap-4.5 z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <PhoneCall className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold tracking-widest text-white uppercase">
                    {t.home.quickChatTitle}
                  </h3>
                  <span className="text-[8px] py-0.5 px-2 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 uppercase tracking-widest font-black">
                    {t.home.quickChatBadge}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {t.home.quickChatDesc}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 z-10 shrink-0">
              <div className="text-center md:text-right">
                <span className="text-[10px] text-slate-500 line-through">₹299</span>
                <div className="text-2xl font-black text-white font-serif -mt-1">{dynamicPrices.quick}</div>
              </div>
              <Link
                href="/booking?plan=quick"
                prefetch={false}
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider shadow-glow active:scale-95 transition-all border border-indigo-400/20"
              >
                {t.home.quickChatBtn}
              </Link>
            </div>
          </div>

          {/* 🎴 Comparison Card Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl border p-6 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 ${plan.colorClass}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 border border-amber-400/20 text-white text-[8px] font-black tracking-widest uppercase py-1 px-4.5 rounded-full shadow-[0_4px_15px_rgba(245,158,11,0.4)]">
                    {tText("MOST POPULAR", "முக்கிய திட்டம்")}
                  </span>
                )}

                <div className="space-y-4">
                  <div className="text-center border-b border-white/5 pb-4">
                    <h3 className="text-base font-black tracking-widest font-serif uppercase">{plan.title}</h3>
                    <span className="text-[8px] tracking-widest uppercase font-bold text-slate-500 -mt-1 block">{plan.subtitle}</span>
                    <div className="text-3xl font-black mt-3 font-serif">{plan.price}</div>
                    <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest">{plan.duration}</p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                    {plan.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    href={`/booking?plan=${plan.id}`}
                    prefetch={false}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-center block transition-all active:scale-95 text-white ${plan.btnClass}`}
                  >
                    {t.common.bookNow}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              prefetch={false}
              className="inline-flex items-center gap-2 py-3 px-8 rounded-full border border-amber-500/25 bg-amber-950/15 hover:bg-amber-950/30 text-amber-300 text-xs font-bold uppercase tracking-widest transition-all duration-300"
            >
              {t.home.comparePricing}
            </Link>
          </div>
        </div>
      </section>

      {/* 💬 Verified Testimonials Grid */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-3">{t.home.reviewsHeading}</div>
          <h2 className="text-3xl md:text-4.5xl font-bold text-white font-serif">{t.home.reviewsTitle}</h2>
          <p className="text-slate-400 text-xs md:text-sm mt-3">{t.home.reviewsSubtitle}</p>
        </div>

        {/* 🌟 Dynamic Rating Header */}
        <div className="flex flex-col items-center justify-center gap-4 mb-14">
          <div className="flex items-center gap-3.5 bg-slate-900/45 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-antigravity">
            <div className="flex items-center text-amber-400 gap-1">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-base font-black text-white ml-0.5">
                {reviewsData?.rating || '4.8'}
              </span>
            </div>
            <div className="w-[1px] h-6 bg-white/10" />
            <span className="text-xs text-slate-300 font-extrabold uppercase tracking-widest">
              {reviewsData?.totalReviews || '142'} {t.home.googleReviews}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://g.page/r/CUMI2zFm_hJiEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider hover:bg-amber-500/20 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              {t.home.writeReview}
            </a>
          </div>
        </div>

        {loadingReviews ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="rounded-3xl p-6 border border-white/5 bg-slate-900/10 backdrop-blur-md animate-pulse space-y-6"
              >
                <div className="space-y-2">
                  <div className="h-4 bg-slate-800 rounded w-1/3" />
                  <div className="h-3 bg-slate-800 rounded w-full" />
                  <div className="h-3 bg-slate-800 rounded w-5/6" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800" />
                  <div className="space-y-1.5 flex-grow">
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                    <div className="h-2 bg-slate-800 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {reviewsData?.reviews.slice(0, 3).map((tst) => (
              <div
                key={tst.id}
                className="rounded-3xl p-6 border border-white/5 bg-slate-900/20 backdrop-blur-md shadow-inner flex flex-col justify-between hover:bg-slate-900/40 transition-all duration-300 hover:border-amber-500/15 hover:scale-[1.02]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(tst.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                    </div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">{tst.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300 italic mb-6">
                    &ldquo;{tst.text}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[10px] font-bold text-amber-300 font-serif">
                    {tst.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-serif uppercase tracking-wider">{tst.author}</div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest font-medium">{tst.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
