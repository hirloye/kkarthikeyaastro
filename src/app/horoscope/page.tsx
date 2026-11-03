"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Heart, Briefcase, DollarSign, Activity,
  ShieldAlert, ArrowRight
} from 'lucide-react';
import CosmicBackground from '@/components/CosmicBackground';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { useLanguage } from '@/context/LanguageContext';

interface HoroscopeDetail {
  general: string;
  love: number;
  career: number;
  finance: number;
  health: number;
  luckyColor: string;
  luckyNumber: number;
  remedy: string;
}

interface ZodiacSign {
  id: string;
  name: string;
  nameTa: string;
  sanskrit: string;
  dates: string;
  symbol: string;
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: 'aries', name: 'Aries', nameTa: 'மேஷம்', sanskrit: 'Mesha', dates: 'Mar 21 - Apr 19', symbol: '♈' },
  { id: 'taurus', name: 'Taurus', nameTa: 'ரிஷபம்', sanskrit: 'Vrishabha', dates: 'Apr 20 - May 20', symbol: '♉' },
  { id: 'gemini', name: 'Gemini', nameTa: 'மிதுனம்', sanskrit: 'Mithuna', dates: 'May 21 - Jun 20', symbol: '♊' },
  { id: 'cancer', name: 'Cancer', nameTa: 'கடகம்', sanskrit: 'Karka', dates: 'Jun 21 - Jul 22', symbol: '♋' },
  { id: 'leo', name: 'Leo', nameTa: 'சிம்மம்', sanskrit: 'Simha', dates: 'Jul 23 - Aug 22', symbol: '♌' },
  { id: 'virgo', name: 'Virgo', nameTa: 'கன்னி', sanskrit: 'Kanya', dates: 'Aug 23 - Sep 22', symbol: '♍' },
  { id: 'libra', name: 'Libra', nameTa: 'துலாம்', sanskrit: 'Tula', dates: 'Sep 23 - Oct 22', symbol: '♎' },
  { id: 'scorpio', name: 'Scorpio', nameTa: 'விருச்சிகம்', sanskrit: 'Vrishchika', dates: 'Oct 23 - Nov 21', symbol: '♏' },
  { id: 'sagittarius', name: 'Sagittarius', nameTa: 'தனுசு', sanskrit: 'Dhanu', dates: 'Nov 22 - Dec 21', symbol: '♐' },
  { id: 'capricorn', name: 'Capricorn', nameTa: 'மகரம்', sanskrit: 'Makara', dates: 'Dec 22 - Jan 19', symbol: '♑' },
  { id: 'aquarius', name: 'Aquarius', nameTa: 'கும்பம்', sanskrit: 'Kumbha', dates: 'Jan 20 - Feb 18', symbol: '♒' },
  { id: 'pisces', name: 'Pisces', nameTa: 'மீனம்', sanskrit: 'Meena', dates: 'Feb 19 - Mar 20', symbol: '♓' }
];

const HOROSCOPE_DATABASE: Record<string, Record<'yesterday' | 'today' | 'tomorrow', HoroscopeDetail>> = {
  aries: {
    yesterday: {
      general: "Yesterday brought positive planetary energy to your career house. The Moon brought great networking opportunities. Trust your gut instincts regarding financial matters.",
      love: 75, career: 88, finance: 80, health: 85,
      luckyColor: "Red", luckyNumber: 9,
      remedy: "Chant 'Om Angarakaya Namaha' 9 times in the morning."
    },
    today: {
      general: "Today, Sun aligns with Jupiter, bringing creative energy and confidence. It is a favorable day to take bold steps in your work and business. Keep calm and avoid spicy food to stay healthy.",
      love: 85, career: 92, finance: 78, health: 90,
      luckyColor: "Saffron", luckyNumber: 3,
      remedy: "Offer water to the rising Sun in the morning and pray for good health and strength."
    },
    tomorrow: {
      general: "Tomorrow brings a peaceful and restful phase. Good day to meditate, plan your upcoming week, and avoid signing risky or uncertain contracts.",
      love: 80, career: 75, finance: 85, health: 82,
      luckyColor: "Yellow", luckyNumber: 7,
      remedy: "Donate food to someone in need to reduce planetary obstacles and bring peace."
    }
  },
  taurus: {
    yesterday: {
      general: "Yesterday highlighted family relationships. The transit of Venus provided harmony at home, allowing you to settle an ongoing property or financial debate calmly.",
      love: 90, career: 72, finance: 85, health: 80,
      luckyColor: "White", luckyNumber: 6,
      remedy: "Keep a silver coin in your wallet for material gains."
    },
    today: {
      general: "Today, planetary positions favor higher studies and legal matters. Venus brings supportive teachers and helpful advisors into your life. Speak kindly and honestly.",
      love: 88, career: 85, finance: 90, health: 85,
      luckyColor: "Cream", luckyNumber: 2,
      remedy: "Apply a small paste of white sandalwood to your forehead for mental cooling."
    },
    tomorrow: {
      general: "Tomorrow demands care regarding joint funds. An unexpected expenditure might arise in the afternoon. Keep your financial expenses organized and consult elders before investing.",
      love: 78, career: 82, finance: 68, health: 88,
      luckyColor: "Pale Blue", luckyNumber: 5,
      remedy: "Feed fresh green grass to a cow tomorrow morning to bring positive Mercury energy and peace."
    }
  },
  gemini: {
    yesterday: {
      general: "Yesterday felt a bit rushed. Mercury slowing down caused minor delays in messages and calls. However, the evening brought a comforting conversation with a friend.",
      love: 70, career: 75, finance: 78, health: 82,
      luckyColor: "Green", luckyNumber: 5,
      remedy: "Avoid using dark black clothes on days of Mercury shifts."
    },
    today: {
      general: "Today, mental clarity returns! A harmonious alignment between Mercury and Saturn grants focus to finish pending work, coding, or academic tasks. Trust your logical mind.",
      love: 80, career: 90, finance: 85, health: 88,
      luckyColor: "Emerald Green", luckyNumber: 14,
      remedy: "Chant 'Om Budhaya Namaha' 108 times to sharpen logical power."
    },
    tomorrow: {
      general: "Tomorrow suggests patience in relationships and partnerships. Mars movement may provoke impatient speech. Breathe deeply, stay calm, and communicate with understanding.",
      love: 65, career: 80, finance: 82, health: 75,
      luckyColor: "Turquoise", luckyNumber: 8,
      remedy: "Keep a small piece of camphor on your desk to clear toxic energy vibrations."
    }
  },
  scorpio: {
    yesterday: {
      general: "Yesterday brought deep clarity and helpful breakthroughs. Positive news regarding property or family plans worked in your favor.",
      love: 82, career: 78, finance: 90, health: 75,
      luckyColor: "Maroon", luckyNumber: 9,
      remedy: "Feed stray birds in the morning to balance Mars."
    },
    today: {
      general: "Today brings strong motivation and energy. You will feel confident and able to complete important projects ahead of time.",
      love: 78, career: 94, finance: 84, health: 88,
      luckyColor: "Crimson", luckyNumber: 1,
      remedy: "Light a ghee lamp in your puja corner and pray to Lord Murugan."
    },
    tomorrow: {
      general: "Tomorrow is ideal for quiet reflection and peace of mind. Spend time in calm study, note your ideas, and do not let outside noise distract your focus.",
      love: 90, career: 80, finance: 82, health: 85,
      luckyColor: "Orange", luckyNumber: 4,
      remedy: "Recite the Hanuman Chalisa in the evening to overcome delays and find peace."
    }
  }
};

const DEFAULT_HOROSCOPE = (sign: string, day: 'yesterday' | 'today' | 'tomorrow'): HoroscopeDetail => {
  const hash = sign.charCodeAt(0) + day.charCodeAt(0);
  return {
    general: `The planetary movements indicate a positive and rewarding time for ${sign}. The alignment of your ruling planet with Jupiter brings new opportunities, wisdom, and helpful people into your life. Maintain a calm mindset and follow your regular prayers for peace and prosperity.`,
    love: 70 + (hash % 25),
    career: 75 + (hash % 20),
    finance: 70 + (hash % 20),
    health: 80 + (hash % 15),
    luckyColor: hash % 2 === 0 ? "Golden Yellow" : "Royal Indigo",
    luckyNumber: (hash % 9) + 1,
    remedy: "Light a small sesame oil lamp in the evening and pray for ancestral peace."
  };
};

export default function DailyHoroscopePage() {
  const { t, tText } = useLanguage();
  const [selectedSign, setSelectedSign] = useState('aries');
  const selectedDay = 'today';
  const [activeReading, setActiveReading] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transitPlanets, setTransitPlanets] = useState<any[]>([]);

  const activeSignInfo = ZODIAC_SIGNS.find(s => s.id === selectedSign) || ZODIAC_SIGNS[0];

  useEffect(() => {
    let active = true;
    async function fetchTransits() {
      try {
        const res = await fetch('/api/horoscope', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude: 13.0827,
            longitude: 80.2707,
            timezone: 5.5
          })
        });
        if (!res.ok) {
          console.warn("Transit API error response");
          return;
        }
        const json = await res.json();
        if (active && json && json.success && json.data) {
          const rawData = json.data.data || json.data;
          let planetsArray: any[] = [];
          if (Array.isArray(rawData)) {
            planetsArray = rawData.map((p: any) => ({
              name: p.name || '',
              sign: p.sign || p.sign_name || '',
              house: p.house || '',
              isRetrograde: p.isRetrograde || p.is_retrograde || false,
              position: p.position ?? p.normDegree ?? 0
            }));
          } else if (typeof rawData === 'object') {
            planetsArray = Object.keys(rawData).map(key => ({
              name: rawData[key].name || key,
              sign: rawData[key].sign || rawData[key].sign_name || '',
              house: rawData[key].house || '',
              isRetrograde: rawData[key].isRetrograde || rawData[key].is_retrograde || false,
              position: rawData[key].position ?? rawData[key].normDegree ?? 0
            }));
          }
          if (planetsArray.length > 0) {
            setTransitPlanets(planetsArray);
          }
        }
      } catch (err) {
        console.error("Failed to fetch transits:", err);
      }
    }
    fetchTransits();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    async function fetchHoroscope() {
      setLoading(true);
      try {
        const res = await fetch(`/api/horoscope-text?sign=${selectedSign}&day=${selectedDay}`);
        if (!res.ok) throw new Error("Horoscope API error response");
        const json = await res.json();

        if (active && json && json.data) {
          const base = DEFAULT_HOROSCOPE(activeSignInfo.name, selectedDay);
          setActiveReading({
            general: json.data.horoscope,
            love: base.love,
            career: base.career,
            finance: base.finance,
            health: base.health,
            luckyColor: base.luckyColor,
            luckyNumber: base.luckyNumber,
            remedy: base.remedy
          });
        }
      } catch (err) {
        console.error("Failed to fetch horoscope from API, using fallback:", err);
        if (active) {
          const fallback = HOROSCOPE_DATABASE[selectedSign]?.[selectedDay]
            || DEFAULT_HOROSCOPE(activeSignInfo.name, selectedDay);
          setActiveReading(fallback);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchHoroscope();
    return () => { active = false; };
  }, [selectedSign, selectedDay, activeSignInfo.name]);

  return (
    <AuthGuard>
      <main className="relative min-h-screen w-full text-slate-100 overflow-x-hidden pb-20 selection:bg-amber-500/30">
        <CosmicBackground />

        {/* 🌌 Title section */}
        <section className="pt-10 pb-6 px-6 max-w-6xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full border border-amber-500/20 bg-amber-950/20 text-amber-300 text-[9px] uppercase tracking-widest font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {t.horoscope.badge}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-serif leading-[1.15]">
            {t.horoscope.title}
          </h1>
          <p className="text-xs md:text-sm text-indigo-300 font-bold uppercase tracking-widest">
            {t.horoscope.subtitle}
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-indigo-500 mx-auto rounded-full mt-3" />
        </section>

        {/* 🔮 Dashboard layout */}
        <section className="py-6 px-6 max-w-6xl mx-auto relative z-10 grid lg:grid-cols-12 gap-8 items-start">

          {/* Left Col: 12 Rashi Select Grid */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-5 shadow-antigravity space-y-4">
              <h2 className="text-xs font-black tracking-widest text-slate-300 font-serif uppercase border-b border-white/5 pb-2.5">
                {tText("Select Your Rashi (Zodiac)", "உங்கள் ராசியைத் தேர்ந்தெடுக்கவும்")}
              </h2>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-3 gap-1.5 sm:gap-2">
                {ZODIAC_SIGNS.map((sign) => {
                  const isSelected = selectedSign === sign.id;
                  return (
                    <button
                      key={sign.id}
                      onClick={() => setSelectedSign(sign.id)}
                      className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-center transition-all active:scale-95 flex flex-col items-center justify-center gap-1 group ${
                        isSelected
                          ? 'border-amber-500 bg-amber-950/20 text-amber-300 shadow-glow'
                          : 'border-white/5 bg-white/2 hover:border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className={`text-xl transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {sign.symbol}
                      </span>
                      <span className="text-[10px] font-bold tracking-wide leading-none">{tText(sign.name, sign.nameTa)}</span>
                      <span className="text-[7px] uppercase tracking-widest text-indigo-400/80 font-black">{sign.sanskrit}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live transiting planets */}
            {transitPlanets.length > 0 && (
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-5 shadow-antigravity space-y-4">
                <h3 className="text-xs font-black tracking-widest text-slate-300 font-serif uppercase border-b border-white/5 pb-2.5 flex items-center justify-between">
                  <span>{tText("Today's Planet Positions", "தற்போதைய கிரக சஞ்சாரம்")}</span>
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {transitPlanets.map((planet) => (
                    <div key={planet.name} className="p-2.5 rounded-xl bg-white/2 border border-white/5 flex flex-col">
                      <span className="text-[8px] uppercase tracking-widest text-indigo-300 font-black">{planet.name}</span>
                      <strong className="text-slate-200 mt-1 font-serif">{planet.sign}</strong>
                      <span className="text-[8px] text-slate-400 mt-0.5">{tText("House", "பாவகம்")} {planet.house} • {(planet.position ?? 0).toFixed(1)}°</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Interactive Horoscope Reading Card */}
          <div className="lg:col-span-7">
            <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 md:p-8 shadow-antigravity space-y-6 relative overflow-hidden">
              {/* Ambient Background Aura */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none" />

              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl text-amber-400 shadow-glow">
                    {activeSignInfo.symbol}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-serif text-white flex items-center gap-1.5">
                      {tText(activeSignInfo.name, activeSignInfo.nameTa)} <span className="text-xs uppercase tracking-widest text-slate-400 font-sans font-bold">({activeSignInfo.sanskrit})</span>
                    </h3>
                    <span className="text-[9px] uppercase tracking-widest text-indigo-300 font-bold flex items-center gap-2 mt-0.5">
                      {tText("Rashi Dates:", "ராசி காலங்கள்:")} {activeSignInfo.dates}
                    </span>
                  </div>
                </div>
              </div>

              {loading || !activeReading ? (
                <div className="space-y-6 animate-pulse py-4">
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-800 rounded w-1/4" />
                    <div className="h-3.5 bg-slate-800 rounded w-full" />
                    <div className="h-3.5 bg-slate-800 rounded w-5/6" />
                    <div className="h-3.5 bg-slate-800 rounded w-4/5" />
                  </div>
                  <div className="h-px bg-white/5 my-4" />
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-2.5 bg-slate-800 rounded w-1/3" />
                        <div className="h-2 bg-slate-800 rounded w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* General Prediction Narrative */}
                  <div className="space-y-2.5">
                    <span className="text-[8px] uppercase tracking-widest font-black text-slate-500 block">
                      {tText("Planetary Alignment Reading", "கிரக சஞ்சார பலன்கள்")}
                    </span>
                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-serif">
                      {activeReading.general}
                    </p>
                  </div>

                  {/* Dasha Indicators (Love, Career, Finance, Health progress bars) */}
                  <div className="space-y-4 border-t border-b border-white/5 py-5">
                    <span className="text-[8px] uppercase tracking-widest font-black text-amber-400 block -mb-1">
                      {tText("Planetary House Strength", "கிரக பலம் மற்றும் தாக்கம்")}
                    </span>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      
                      {/* Love */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                          <span className="flex items-center gap-1 text-pink-400">
                            <Heart className="w-3.5 h-3.5 fill-current" /> {tText("Shukra (Love & Family)", "சுக்கிரன் (காதல் & குடும்பம்)")}
                          </span>
                          <span className="font-mono text-white">{activeReading.love}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${activeReading.love}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-pink-500 to-pink-400"
                          />
                        </div>
                      </div>

                      {/* Career */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                          <span className="flex items-center gap-1 text-sky-400">
                            <Briefcase className="w-3.5 h-3.5" /> {tText("Shani (Career & Business)", "சனி (தொழில் & வேலை)")}
                          </span>
                          <span className="font-mono text-white">{activeReading.career}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${activeReading.career}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-sky-500 to-sky-400"
                          />
                        </div>
                      </div>

                      {/* Finance */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                          <span className="flex items-center gap-1 text-emerald-400">
                            <DollarSign className="w-3.5 h-3.5" /> {tText("Budha (Finance & Wealth)", "புதன் (பொருளாதாரம் & நிதி)")}
                          </span>
                          <span className="font-mono text-white">{activeReading.finance}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${activeReading.finance}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                          />
                        </div>
                      </div>

                      {/* Health */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                          <span className="flex items-center gap-1 text-amber-400">
                            <Activity className="w-3.5 h-3.5" /> {tText("Surya (Health & Energy)", "சூரியன் (ஆரோக்கியம் & நலம்)")}
                          </span>
                          <span className="font-mono text-white">{activeReading.health}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${activeReading.health}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Lucky numbers and daily guidance */}
                  <div className="grid sm:grid-cols-3 gap-4.5 text-xs">
                    <div className="p-3 bg-white/2 border border-white/5 rounded-2xl space-y-1">
                      <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block">{t.horoscope.luckyColor}</span>
                      <strong className="text-slate-100 font-bold">{activeReading.luckyColor}</strong>
                    </div>
                    <div className="p-3 bg-white/2 border border-white/5 rounded-2xl space-y-1">
                      <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block">{t.horoscope.luckyNumber}</span>
                      <strong className="text-slate-100 font-mono font-bold">{activeReading.luckyNumber}</strong>
                    </div>
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl sm:col-span-3 space-y-1.5">
                      <span className="text-[8px] uppercase tracking-widest text-indigo-300 font-extrabold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> {tText("Astrologer Remedy (Pariharam)", "ஜோதிட பரிகாரம் & வழிபாடு")}
                      </span>
                      <p className="text-[11px] text-slate-300 leading-normal">
                        {activeReading.remedy}
                      </p>
                    </div>
                  </div>

                  {/* Book consultation CTA */}
                  <div className="pt-2">
                    <Link 
                      href="/booking?plan=silver"
                      className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 border border-indigo-400/20 shadow-glow"
                    >
                      {tText("Book Personal Remedial Consultation", "நேரடி பரிகார ஆலோசனை முன்பதிவு செய்க")} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </>
              )}

            </div>
          </div>

        </section>
      </main>
    </AuthGuard>
  );
}
