"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Heart, Briefcase, DollarSign, Activity, 
  Compass, Award, ShieldAlert, ArrowRight 
} from 'lucide-react';
import CosmicBackground from '@/components/CosmicBackground';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';

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

const ZODIAC_SIGNS = [
  { id: 'aries', name: 'Aries', sanskrit: 'Mesha', dates: 'Mar 21 - Apr 19', symbol: '♈' },
  { id: 'taurus', name: 'Taurus', sanskrit: 'Vrishabha', dates: 'Apr 20 - May 20', symbol: '♉' },
  { id: 'gemini', name: 'Gemini', sanskrit: 'Mithuna', dates: 'May 21 - Jun 20', symbol: '♊' },
  { id: 'cancer', name: 'Cancer', sanskrit: 'Karka', dates: 'Jun 21 - Jul 22', symbol: '♋' },
  { id: 'leo', name: 'Leo', sanskrit: 'Simha', dates: 'Jul 23 - Aug 22', symbol: '♌' },
  { id: 'virgo', name: 'Virgo', sanskrit: 'Kanya', dates: 'Aug 23 - Sep 22', symbol: '♍' },
  { id: 'libra', name: 'Libra', sanskrit: 'Tula', dates: 'Sep 23 - Oct 22', symbol: '♎' },
  { id: 'scorpio', name: 'Scorpio', sanskrit: 'Vrishchika', dates: 'Oct 23 - Nov 21', symbol: '♏' },
  { id: 'sagittarius', name: 'Sagittarius', sanskrit: 'Dhanu', dates: 'Nov 22 - Dec 21', symbol: '♐' },
  { id: 'capricorn', name: 'Capricorn', sanskrit: 'Makara', dates: 'Dec 22 - Jan 19', symbol: '♑' },
  { id: 'aquarius', name: 'Aquarius', sanskrit: 'Kumbha', dates: 'Jan 20 - Feb 18', symbol: '♒' },
  { id: 'pisces', name: 'Pisces', sanskrit: 'Meena', dates: 'Feb 19 - Mar 20', symbol: '♓' }
];

const HOROSCOPE_DATABASE: Record<string, Record<'yesterday' | 'today' | 'tomorrow', HoroscopeDetail>> = {
  aries: {
    yesterday: {
      general: "Yesterday brought significant planetary alignment in your career house. The Moon in your tenth house enabled excellent networking opportunities. Trust your gut instincts regarding financial matters.",
      love: 75, career: 88, finance: 80, health: 85,
      luckyColor: "Red", luckyNumber: 9,
      remedy: "Chant 'Om Angarakaya Namaha' 9 times in the morning."
    },
    today: {
      general: "Today, Sun aligns with Jupiter, radiating creative wisdom into your core solar plexus. It is an auspicious day to take bold actions in business. Avoid hot temper and spicy meals to maintain energetic balance.",
      love: 85, career: 92, finance: 78, health: 90,
      luckyColor: "Saffron", luckyNumber: 3,
      remedy: "Offer water to the Sun deity at sunrise and pray for cosmic strength."
    },
    tomorrow: {
      general: "Tomorrow suggests a restful phase as the Moon shifts into your twelfth house. Good day to meditate, plan your upcoming week, and refrain from signing speculative contracts.",
      love: 80, career: 75, finance: 85, health: 82,
      luckyColor: "Yellow", luckyNumber: 7,
      remedy: "Donate generic food items to someone in need to align your Saturn values."
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
      general: "Today, the celestial tides favor higher studies and legal settlements. Venus in your ninth house expands your learning capacity and draws helpful mentors into your orbit. Speak truth with gentleness.",
      love: 88, career: 85, finance: 90, health: 85,
      luckyColor: "Cream", luckyNumber: 2,
      remedy: "Apply a small paste of white sandalwood to your forehead for mental cooling."
    },
    tomorrow: {
      general: "Tomorrow demands care regarding joint funds. An unexpected expenditure might arise in the afternoon. Keep your financial charts organized and consult elders before investing.",
      love: 78, career: 82, finance: 68, health: 88,
      luckyColor: "Pale Blue", luckyNumber: 5,
      remedy: "Feed a green grass bundle to a cow tomorrow morning to pacify Mercury."
    }
  },
  gemini: {
    yesterday: {
      general: "Yesterday felt a bit rushed. Mercury's retrograding shadow triggered slight delay in communications. However, late evening brought a comforting dialogue with a friend.",
      love: 70, career: 75, finance: 78, health: 82,
      luckyColor: "Green", luckyNumber: 5,
      remedy: "Avoid using dark black clothes on days of Mercury shifts."
    },
    today: {
      general: "Today, intellectual clarity returns! A favorable trine between Mercury and Saturn grants focus to execute pending writing tasks, coding, or academic calculations. Trust your logical mind.",
      love: 80, career: 90, finance: 85, health: 88,
      luckyColor: "Emerald Green", luckyNumber: 14,
      remedy: "Chant 'Om Budhaya Namaha' 108 times to sharpen logical power."
    },
    tomorrow: {
      general: "Tomorrow warns against verbal friction in partnerships. The transition of Mars may provoke impatient speech. Breathe deeply, count to ten, and seek mutual understanding.",
      love: 65, career: 80, finance: 82, health: 75,
      luckyColor: "Turquoise", luckyNumber: 8,
      remedy: "Keep a small piece of camphor on your desk to clear toxic energy vibrations."
    }
  },
  scorpio: {
    yesterday: {
      general: "Yesterday pushed you to confront a secret fear. A highly spiritual day that deepened your intuition and allowed you to see hidden agendas with complete clarity.",
      love: 80, career: 85, finance: 78, health: 90,
      luckyColor: "Maroon", luckyNumber: 9,
      remedy: "Pray to Lord Kartikeya (Murugan) for victory over negative forces."
    },
    today: {
      general: "Today, Mars bestows dynamic energy upon your ascendant house! You feel highly motivated, charismatic, and powerful. Excellent day for physical exercise, legal debates, or competing for a promotion.",
      love: 85, career: 95, finance: 88, health: 92,
      luckyColor: "Crimson Red", luckyNumber: 1,
      remedy: "Light a ghee lamp in your home altar and pray for divine courage and protection."
    },
    tomorrow: {
      general: "Tomorrow points to spiritual introspection. Spend time in solitary research, write down your dreams, and do not let external chaotic voices distract your inner alignment.",
      love: 90, career: 80, finance: 82, health: 85,
      luckyColor: "Orange", luckyNumber: 4,
      remedy: "Recite the Hanuman Chalisa in the evening to dispel Saturn delays."
    }
  }
};

const DEFAULT_HOROSCOPE = (sign: string, day: 'yesterday' | 'today' | 'tomorrow'): HoroscopeDetail => {
  const hash = sign.charCodeAt(0) + day.charCodeAt(0);
  return {
    general: `The celestial coordinates suggest a very progressive period for ${sign} individuals. The alignment of your ruling planet with Jupiter expands your creative wisdom and brings supportive seekers into your alignment. Focus on maintaining emotional balance and execute pending spiritual remedies to secure prosperity.`,
    love: 70 + (hash % 25),
    career: 75 + (hash % 20),
    finance: 65 + (hash % 30),
    health: 80 + (hash % 15),
    luckyColor: hash % 2 === 0 ? "Golden Yellow" : "Royal Indigo",
    luckyNumber: (hash % 9) + 1,
    remedy: "Light a small sesame oil lamp in the evening and pray for ancestral peace."
  };
};

export default function DailyHoroscopePage() {
  const [selectedSign, setSelectedSign] = useState('aries');
  const [selectedDay, setSelectedDay] = useState<'yesterday' | 'today' | 'tomorrow'>('today');
  const [activeReading, setActiveReading] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDynamic, setIsDynamic] = useState(false);
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
        if (!res.ok) throw new Error("Transit API error response");
        const json = await res.json();
        if (active && json && json.success && json.data) {
          const rawData = json.data.data || json.data;
          let planetsArray = [];
          if (Array.isArray(rawData)) {
            planetsArray = rawData;
          } else if (typeof rawData === 'object') {
            planetsArray = Object.keys(rawData).map(key => ({
              name: rawData[key].name || key,
              sign: rawData[key].sign || rawData[key].sign_name || '',
              house: rawData[key].house || '',
              isRetrograde: rawData[key].isRetrograde || rawData[key].is_retrograde || false,
              position: rawData[key].position || rawData[key].normDegree || 0
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
          setIsDynamic(true);
        }
      } catch (err) {
        console.error("Failed to fetch horoscope from API, using fallback:", err);
        if (active) {
          const fallback = HOROSCOPE_DATABASE[selectedSign]?.[selectedDay] 
            || DEFAULT_HOROSCOPE(activeSignInfo.name, selectedDay);
          setActiveReading(fallback);
          setIsDynamic(false);
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
        <section className="pt-24 pb-6 px-6 max-w-6xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full border border-amber-500/20 bg-amber-950/20 text-amber-300 text-[9px] uppercase tracking-widest font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Vedic Almanac
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-serif leading-[1.15]">
            Daily Horoscope
          </h1>
          <p className="text-xs md:text-sm text-indigo-300 font-bold uppercase tracking-widest">
            Personalized Rashi predictions based on traditional Vedic calculations
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-indigo-500 mx-auto rounded-full mt-3" />
        </section>

        {/* 🔮 Dashboard layout */}
        <section className="py-6 px-6 max-w-6xl mx-auto relative z-10 grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Col: 12 Rashi Select Grid */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-5 shadow-antigravity space-y-4">
              <h2 className="text-xs font-black tracking-widest text-slate-300 font-serif uppercase border-b border-white/5 pb-2.5">
                Select Your Rashi (Zodiac)
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
                      <span className="text-[10px] font-bold tracking-wide leading-none">{sign.name}</span>
                      <span className="text-[7px] uppercase tracking-widest text-indigo-400/80 font-black">{sign.sanskrit}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live transiting planets fetched using the user's secret API key */}
            {transitPlanets.length > 0 && (
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-5 shadow-antigravity space-y-4">
                <h3 className="text-xs font-black tracking-widest text-slate-300 font-serif uppercase border-b border-white/5 pb-2.5 flex items-center justify-between">
                  <span>Live Transiting Planets</span>

                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {transitPlanets.map((planet) => (
                    <div key={planet.name} className="p-2.5 rounded-xl bg-white/2 border border-white/5 flex flex-col">
                      <span className="text-[8px] uppercase tracking-widest text-indigo-300 font-black">{planet.name}</span>
                      <strong className="text-slate-200 mt-1 font-serif">{planet.sign}</strong>
                      <span className="text-[8px] text-slate-400 mt-0.5">House {planet.house} • {planet.position.toFixed(1)}°</span>
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
                      {activeSignInfo.name} <span className="text-xs uppercase tracking-widest text-slate-400 font-sans font-bold">({activeSignInfo.sanskrit})</span>
                    </h3>
                    <span className="text-[9px] uppercase tracking-widest text-indigo-300 font-bold flex items-center gap-2 mt-0.5">
                      Rashi Dates: {activeSignInfo.dates}

                    </span>
                  </div>
                </div>

                {/* Day filter tabs */}
                <div className="flex bg-slate-950/60 p-1 rounded-full border border-white/5 text-[9px] font-black uppercase tracking-widest self-start sm:self-center">
                  {(['yesterday', 'today', 'tomorrow'] as const).map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`py-1.5 px-3 rounded-full transition-all ${
                        selectedDay === day
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
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
                    <span className="text-[8px] uppercase tracking-widest font-black text-slate-500 block">Planetary Alignment Reading</span>
                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-serif">
                      {activeReading.general}
                    </p>
                  </div>

              {/* Dasha Indicators (Love, Career, Finance, Health progress bars) */}
              <div className="space-y-4 border-t border-b border-white/5 py-5">
                <span className="text-[8px] uppercase tracking-widest font-black text-amber-400 block -mb-1">Planetary House Strength</span>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  
                  {/* Love */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                      <span className="flex items-center gap-1 text-pink-400"><Heart className="w-3.5 h-3.5 fill-current" /> Shukra (Love)</span>
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
                      <span className="flex items-center gap-1 text-sky-400"><Briefcase className="w-3.5 h-3.5" /> Shani (Career)</span>
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
                      <span className="flex items-center gap-1 text-emerald-400"><DollarSign className="w-3.5 h-3.5" /> Budha (Finance)</span>
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
                      <span className="flex items-center gap-1 text-amber-400"><Activity className="w-3.5 h-3.5" /> Surya (Health)</span>
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

              {/* Lucky coordinates and daily pariharams */}
              <div className="grid sm:grid-cols-3 gap-4.5 text-xs">
                <div className="p-3 bg-white/2 border border-white/5 rounded-2xl space-y-1">
                  <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block">Lucky Color</span>
                  <strong className="text-slate-100 font-bold">{activeReading.luckyColor}</strong>
                </div>
                <div className="p-3 bg-white/2 border border-white/5 rounded-2xl space-y-1">
                  <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block">Lucky Number</span>
                  <strong className="text-slate-100 font-mono font-bold">{activeReading.luckyNumber}</strong>
                </div>
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl sm:col-span-3 space-y-1.5">
                  <span className="text-[8px] uppercase tracking-widest text-indigo-300 font-extrabold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Astrologer Remedy (Pariharam)
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
                  Book Personal Remedial Consultation <ArrowRight className="w-4 h-4" />
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
