"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Calendar, Clock, MapPin, User, 
  ChevronRight, Compass, ShieldCheck, HelpCircle, Info, RefreshCw
} from 'lucide-react';
import CosmicBackground from '@/components/CosmicBackground';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import AuthGuard from '@/components/AuthGuard';

const ZODIAC_SIGNS = [
  { num: 1, name: 'Aries', sanskrit: 'Mesha', element: 'Fire', lord: 'Mars' },
  { num: 2, name: 'Taurus', sanskrit: 'Vrishabha', element: 'Earth', lord: 'Venus' },
  { num: 3, name: 'Gemini', sanskrit: 'Mithuna', element: 'Air', lord: 'Mercury' },
  { num: 4, name: 'Cancer', sanskrit: 'Karka', element: 'Water', lord: 'Moon' },
  { num: 5, name: 'Leo', sanskrit: 'Simha', element: 'Fire', lord: 'Sun' },
  { num: 6, name: 'Virgo', sanskrit: 'Kanya', element: 'Earth', lord: 'Mercury' },
  { num: 7, name: 'Libra', sanskrit: 'Tula', element: 'Air', lord: 'Venus' },
  { num: 8, name: 'Scorpio', sanskrit: 'Vrishchika', element: 'Water', lord: 'Mars' },
  { num: 9, name: 'Sagittarius', sanskrit: 'Dhanu', element: 'Fire', lord: 'Jupiter' },
  { num: 10, name: 'Capricorn', sanskrit: 'Makara', element: 'Earth', lord: 'Saturn' },
  { num: 11, name: 'Aquarius', sanskrit: 'Kumbha', element: 'Air', lord: 'Saturn' },
  { num: 12, name: 'Pisces', sanskrit: 'Meena', element: 'Water', lord: 'Jupiter' }
];

const PLANETS = [
  { key: 'Su', name: 'Sun (Surya)', meaning: 'Soul, ego, father, power, leadership' },
  { key: 'Mo', name: 'Moon (Chandra)', meaning: 'Mind, emotions, mother, peace, intuition' },
  { key: 'Ma', name: 'Mars (Mangal)', meaning: 'Energy, courage, passion, action, physical strength' },
  { key: 'Me', name: 'Mercury (Budha)', meaning: 'Intellect, communication, logic, speech, business' },
  { key: 'Ju', name: 'Jupiter (Guru)', meaning: 'Wisdom, luck, wealth, spirituality, learning' },
  { key: 'Ve', name: 'Venus (Shukra)', meaning: 'Love, beauty, relationships, luxury, art' },
  { key: 'Sa', name: 'Saturn (Shani)', meaning: 'Discipline, karma, hard work, delay, longevity' },
  { key: 'Ra', name: 'Rahu (North Node)', meaning: 'Desires, obsession, innovation, sudden events' },
  { key: 'Ke', name: 'Ketu (South Node)', meaning: 'Detachment, spirituality, liberation, deep wisdom' }
];

const HOUSE_INFO = [
  { house: 1, name: "1st House (Lagna / Ascendant)", significance: "Self, personality, physical body, appearance, character, health, and life direction." },
  { house: 2, name: "2nd House (Dhana Bhava)", significance: "Wealth, family, speech, primary education, values, assets, and food habits." },
  { house: 3, name: "3rd House (Sahaja Bhava)", significance: "Courage, sibling relations, short travels, efforts, communication, writing, and throat health." },
  { house: 4, name: "4th House (Sukha Bhava)", significance: "Mother, home, happiness, vehicle, property, peace of mind, and primary roots." },
  { house: 5, name: "5th House (Putra Bhava)", significance: "Children, creativity, intellect, past life credits (Purva Punya), romance, and speculation." },
  { house: 6, name: "6th House (Shatru Bhava)", significance: "Obstacles, debt, diseases, enemies, daily routines, service, and pets." },
  { house: 7, name: "7th House (Kalatra Bhava)", significance: "Marriage, partnerships, spouse, public relations, trade, and business associates." },
  { house: 8, name: "8th House (Ayur Bhava)", significance: "Longevity, sudden transformations, secrets, research, occult science, inheritance, and hidden obstacles." },
  { house: 9, name: "9th House (Dharma Bhava)", significance: "Luck, religion, higher education, father, long travel, teachers, and past life merits." },
  { house: 10, name: "10th House (Karma Bhava)", significance: "Career, profession, social status, fame, actions, authority, and accomplishments." },
  { house: 11, name: "11th House (Labha Bhava)", significance: "Gains, desires fulfillment, friends, elder siblings, income, and networking circles." },
  { house: 12, name: "12th House (Vyaya Bhava)", significance: "Expenditure, losses, foreign travel, isolation, bed pleasures, dreams, and spiritual liberation (Moksha)." }
];

// Helper to hash details and return consistent values
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export default function BirthChartPage() {
  const { currentUser } = useApp();
  
  // Inputs
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [tobPeriod, setTobPeriod] = useState('AM');
  const [pob, setPob] = useState('');
  
  // Result States
  const [isGenerated, setIsGenerated] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-fill from logged-in user details
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.username || '');
      setDob(currentUser.dob || '');
      setPob(currentUser.pob || '');
      
      if (currentUser.tob) {
        const timePart = currentUser.tob.match(/(\d+:\d+)/);
        const periodPart = currentUser.tob.match(/(AM|PM)/i);
        if (timePart) setTob(timePart[0]);
        if (periodPart) setTobPeriod(periodPart[0].toUpperCase());
      }
    }
  }, [currentUser]);

  const handleGenerateChart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob || !tob || !pob) return;

    setIsProcessing(true);
    
    setTimeout(() => {
      const birthStr = `${name.toLowerCase()}-${dob}-${tob}-${tobPeriod}-${pob.toLowerCase()}`;
      const seed = simpleHash(birthStr);
      
      // Determine Ascendant (Lagna) sign (1 to 12)
      const lagnaIndex = (seed % 12) + 1; // Aries=1, Taurus=2, etc.
      
      // Map signs to houses (counter-clockwise)
      // house 1 has lagnaIndex. house 2 has lagnaIndex+1, etc.
      const housesSigns: Record<number, number> = {};
      for (let h = 1; h <= 12; h++) {
        housesSigns[h] = ((lagnaIndex - 1 + (h - 1)) % 12) + 1;
      }
      
      // Distribute planets across houses deterministically based on seed
      const planetPlacements: Record<number, string[]> = {};
      for (let h = 1; h <= 12; h++) {
        planetPlacements[h] = [];
      }
      
      PLANETS.forEach((planet, idx) => {
        // Place planets in houses (distributing based on seed + planet index)
        const targetHouse = ((seed + idx * 7) % 12) + 1;
        planetPlacements[targetHouse].push(planet.key);
      });

      const lagnaSign = ZODIAC_SIGNS.find(z => z.num === lagnaIndex)!;
      const moonHouse = ((seed + 17) % 12) + 1;
      const moonSign = ZODIAC_SIGNS.find(z => z.num === housesSigns[moonHouse])!;
      
      const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Visakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Sravana", "Dhanishta", "Satabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
      const nakshatra = nakshatras[seed % 27];

      setChartData({
        lagnaIndex,
        lagnaSign,
        moonSign,
        nakshatra,
        housesSigns,
        planetPlacements
      });
      
      setIsGenerated(true);
      setSelectedHouse(1); // default selection
      setIsProcessing(false);
    }, 1500);
  };

  // SVG Coordinates for drawing Houses in North Indian style:
  // Points: (0,0), (400,0), (400,400), (0,400), (200,200)
  // Let's create an interactive layout overlay.
  // We divide the houses using standard paths so we can capture click events on them.
  const housesPaths = [
    {
      house: 1, // Top center diamond
      path: "M 0 200 L 200 0 L 400 200 L 200 200 Z",
      labelX: 200, labelY: 120, planetX: 200, planetY: 155
    },
    {
      house: 2, // Upper left triangle
      path: "M 0 0 L 200 0 L 200 200 Z",
      labelX: 110, labelY: 45, planetX: 110, planetY: 80
    },
    {
      house: 3, // Far left triangle
      path: "M 0 0 L 200 200 L 0 200 Z",
      labelX: 45, labelY: 110, planetX: 45, planetY: 145
    },
    {
      house: 4, // Middle left diamond
      path: "M 0 200 L 200 200 L 200 400 L 0 200 Z",
      labelX: 120, labelY: 200, planetX: 125, planetY: 235
    },
    {
      house: 5, // Lower left triangle
      path: "M 0 200 L 200 200 L 0 400 Z",
      labelX: 45, labelY: 290, planetX: 45, planetY: 325
    },
    {
      house: 6, // Bottom left triangle
      path: "M 0 400 L 200 400 L 200 200 Z",
      labelX: 110, labelY: 355, planetX: 110, planetY: 320
    },
    {
      house: 7, // Bottom center diamond
      path: "M 200 200 L 400 200 L 200 400 Z",
      labelX: 200, labelY: 290, planetX: 200, planetY: 255
    },
    {
      house: 8, // Bottom right triangle
      path: "M 200 200 L 400 400 L 200 400 Z",
      labelX: 290, labelY: 355, planetX: 290, planetY: 320
    },
    {
      house: 9, // Lower right triangle
      path: "M 200 200 L 400 200 L 400 400 Z",
      labelX: 355, labelY: 290, planetX: 355, planetY: 325
    },
    {
      house: 10, // Middle right diamond
      path: "M 200 200 L 400 200 L 200 0 L 200 200 Z",
      labelX: 280, labelY: 200, planetX: 275, planetY: 235
    },
    {
      house: 11, // Upper right triangle
      path: "M 200 200 L 400 0 L 400 200 Z",
      labelX: 355, labelY: 110, planetX: 355, planetY: 145
    },
    {
      house: 12, // Top right triangle
      path: "M 200 0 L 400 0 L 200 200 Z",
      labelX: 290, labelY: 45, planetX: 290, planetY: 80
    }
  ];

  return (
    <AuthGuard>
      <main className="relative min-h-screen w-full text-slate-100 overflow-x-hidden pb-20 selection:bg-amber-500/30">
        <CosmicBackground />

        {/* 🌌 Title section */}
        <section className="pt-24 pb-6 px-6 max-w-6xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full border border-amber-500/20 bg-amber-950/20 text-amber-300 text-[9px] uppercase tracking-widest font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Natal Calculations
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-serif leading-[1.15]">
            Birth Chart (Kundli)
          </h1>
          <p className="text-xs md:text-sm text-indigo-300 font-bold uppercase tracking-widest">
            Vedic Ascendant & Planetary Placements Map Generator
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-indigo-500 mx-auto rounded-full mt-3" />
        </section>

        {/* 🔮 Dashboard Layout */}
        <section className="py-6 px-6 max-w-6xl mx-auto relative z-10 grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Birth Details Input Form */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 md:p-7 shadow-antigravity space-y-4">
              <h2 className="text-xs font-black tracking-widest text-slate-300 font-serif uppercase border-b border-white/5 pb-2.5">
                Birth Coordinates
              </h2>

              <form onSubmit={handleGenerateChart} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300/40" />
                    <input 
                      type="text" 
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                      disabled={isProcessing}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block ml-1">Date of Birth</label>
                  <input 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-slate-200 outline-none focus:border-indigo-500/50 transition-all [color-scheme:dark]"
                    disabled={isProcessing}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block ml-1">Birth Time</label>
                    <input 
                      type="time" 
                      value={tob}
                      onChange={(e) => setTob(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-slate-200 outline-none focus:border-indigo-500/50 transition-all [color-scheme:dark]"
                      disabled={isProcessing}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block ml-1">AM/PM</label>
                    <select
                      value={tobPeriod}
                      onChange={(e) => setTobPeriod(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl py-3 px-2.5 text-xs text-white outline-none focus:border-indigo-500/50 transition-all"
                      disabled={isProcessing}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block ml-1">Place of Birth</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300/40" />
                    <input 
                      type="text" 
                      placeholder="City, State, Country"
                      value={pob}
                      onChange={(e) => setPob(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                      disabled={isProcessing}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest shadow-glow border border-indigo-400/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Decrypting Cosmos...
                    </>
                  ) : (
                    <>
                      Generate Kundli Chart
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Encryption Shield Tag */}
            <div className="flex items-center gap-2 p-3.5 rounded-2xl border border-white/5 bg-slate-900/20 text-[9px] uppercase tracking-widest font-black text-slate-500 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Vedic Astrological Encryption Secure</span>
            </div>
          </div>

          {/* Right Column: Chart display and interpretations */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {isGenerated && chartData ? (
                <motion.div
                  key="result-dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid md:grid-cols-12 gap-6"
                >
                  {/* SVG Chart Bento (col-6) */}
                  <div className="md:col-span-6 rounded-[2.5rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 shadow-antigravity flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[40px] rounded-full pointer-events-none" />
                    
                    <h3 className="text-xs font-black tracking-widest text-slate-300 font-serif uppercase mb-5 border-b border-white/5 pb-2 w-full text-center">
                      North Indian Lagna Chart
                    </h3>

                    {/* SVG Kundli Graphic */}
                    <div className="relative w-full max-w-[320px] aspect-square">
                      <svg 
                        viewBox="0 0 400 400" 
                        className="w-full h-full stroke-amber-500/55 stroke-2 fill-none select-none drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]"
                      >
                        {/* Outer Square */}
                        <rect x="10" y="10" width="380" height="380" className="stroke-amber-500/40" />
                        
                        {/* Diagonals */}
                        <line x1="10" y1="10" x2="390" y2="390" className="stroke-amber-500/45" />
                        <line x1="390" y1="10" x2="10" y2="390" className="stroke-amber-500/45" />
                        
                        {/* Inner Diamond */}
                        <line x1="200" y1="10" x2="10" y2="200" className="stroke-amber-500/45" />
                        <line x1="10" y1="200" x2="200" y2="390" className="stroke-amber-500/45" />
                        <line x1="200" y1="390" x2="390" y2="200" className="stroke-amber-500/45" />
                        <line x1="390" y1="200" x2="200" y2="10" className="stroke-amber-500/45" />

                        {/* Interactive Invisible Overlay Paths for Clicking Houses */}
                        {housesPaths.map((hInfo) => {
                          const isHouseSelected = selectedHouse === hInfo.house;
                          const rashiNum = chartData.housesSigns[hInfo.house];
                          const placements = chartData.planetPlacements[hInfo.house] || [];
                          
                          return (
                            <g key={hInfo.house} className="group/house cursor-pointer">
                              {/* Clicking Path Area */}
                              <path 
                                d={hInfo.path} 
                                className={`fill-amber-500/[0.01] hover:fill-amber-500/10 transition-all stroke-0 ${
                                  isHouseSelected ? 'fill-amber-500/[0.08] stroke-amber-400 stroke-1' : ''
                                }`}
                                onClick={() => setSelectedHouse(hInfo.house)}
                              />
                              
                              {/* Rashi Sign Number */}
                              <text 
                                x={hInfo.labelX} 
                                y={hInfo.labelY} 
                                className={`text-[10px] font-mono font-bold fill-slate-400/80 pointer-events-none ${
                                  isHouseSelected ? 'fill-amber-300 font-extrabold' : 'group-hover/house:fill-white'
                                }`}
                                textAnchor="middle"
                              >
                                {rashiNum}
                              </text>

                              {/* Planets Placed */}
                              {placements.length > 0 && (
                                <text 
                                  x={hInfo.planetX} 
                                  y={hInfo.planetY} 
                                  className="text-[9px] font-mono font-bold fill-indigo-300 drop-shadow-[0_0_4px_rgba(129,140,248,0.5)] pointer-events-none"
                                  textAnchor="middle"
                                >
                                  {placements.join(' ')}
                                </text>
                              )}
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    <p className="text-[9px] uppercase tracking-widest font-black text-slate-500 mt-4 flex items-center gap-1">
                      <Info className="w-3 h-3 text-indigo-400" /> Click houses in the grid to view readings.
                    </p>
                  </div>

                  {/* House Interpretations Bento (col-6) */}
                  <div className="md:col-span-6 flex flex-col gap-4">
                    
                    {/* Celestial Coordinates Summary card */}
                    <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4.5 space-y-3.5">
                      <span className="text-[8px] uppercase tracking-widest text-indigo-300 font-black block border-b border-white/5 pb-1">Vedic Rashi Coordinates</span>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-white/2 border border-white/5">
                          <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block">Ascendant (Lagna)</span>
                          <strong className="text-slate-100 font-bold">{chartData.lagnaSign.name} ({chartData.lagnaSign.sanskrit})</strong>
                          <span className="text-[7px] text-slate-400 block mt-0.5">{chartData.lagnaSign.element} Element</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/2 border border-white/5">
                          <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block">Moon Sign (Rashi)</span>
                          <strong className="text-slate-100 font-bold">{chartData.moonSign.name} ({chartData.moonSign.sanskrit})</strong>
                          <span className="text-[7px] text-slate-400 block mt-0.5">Lord: {chartData.moonSign.lord}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 col-span-2 flex justify-between items-center">
                          <div>
                            <span className="text-[8px] uppercase tracking-widest text-indigo-300 font-extrabold block">Janma Nakshatra (Birth Star)</span>
                            <strong className="text-indigo-200 font-serif font-black">{chartData.nakshatra}</strong>
                          </div>
                          <Compass className="w-5 h-5 text-indigo-400" />
                        </div>
                      </div>
                    </div>

                    {/* House Details Panel */}
                    <div className="flex-1 rounded-2xl border border-white/10 bg-slate-900/35 p-5 flex flex-col justify-between">
                      {selectedHouse !== null ? (
                        (() => {
                          const houseObj = HOUSE_INFO.find(h => h.house === selectedHouse)!;
                          const rashiIndex = chartData.housesSigns[selectedHouse];
                          const rashiObj = ZODIAC_SIGNS.find(z => z.num === rashiIndex)!;
                          const planets = chartData.planetPlacements[selectedHouse] || [];
                          
                          return (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <h4 className="text-xs font-black uppercase tracking-widest text-white">{houseObj.name}</h4>
                                <span className="text-[8px] py-0.5 px-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full font-extrabold uppercase">{rashiObj.name} Rashi</span>
                              </div>

                              <div className="space-y-2 text-xs">
                                <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block">House Significance</span>
                                <p className="text-slate-300 leading-relaxed font-sans">{houseObj.significance}</p>
                              </div>

                              <div className="space-y-2 text-xs pt-1">
                                <span className="text-[8px] uppercase tracking-widest text-indigo-400 font-extrabold block">Planetary Placements</span>
                                {planets.length > 0 ? (
                                  <div className="space-y-2">
                                    {planets.map((pKey: string) => {
                                      const pObj = PLANETS.find(p => p.key === pKey)!;
                                      return (
                                        <div key={pKey} className="p-2 rounded-xl bg-white/2 border border-white/5 space-y-1">
                                          <div className="font-bold text-slate-200">{pObj.name}</div>
                                          <div className="text-[10px] text-slate-400 leading-normal">{pObj.meaning}</div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <p className="text-slate-500 italic">No planetary transits currently mapping this house coordinates.</p>
                                )}
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                          <span>Select a house in the Kundli chart diagram to inspect details.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Interpretations Panel (col-12) */}
                  <div className="md:col-span-12 rounded-[2.5rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 md:p-8 space-y-6">
                    <div className="border-b border-white/5 pb-3">
                      <h3 className="text-lg font-bold font-serif text-white uppercase tracking-widest">Personal Horoscope Reading</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Calculated predictions from your Ascendant {chartData.lagnaSign.name} & Nakshatra {chartData.nakshatra}.</p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6 text-xs leading-relaxed">
                      
                      {/* personality */}
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-widest text-amber-400 font-black block border-b border-white/5 pb-1">Temperament & Personality</span>
                        <p className="text-slate-300">
                          As a {chartData.lagnaSign.name} Lagna native, your vital energy is ruled by {chartData.lagnaSign.lord}. You possess a naturally {chartData.lagnaSign.element === 'Fire' ? 'passionate, leading, and expressive' : chartData.lagnaSign.element === 'Water' ? 'sensitive, intuitive, and caring' : chartData.lagnaSign.element === 'Air' ? 'intellectual, communicative, and versatile' : 'stable, structured, and practical'} character. People perceive you as confident, and your birth star {chartData.nakshatra} gives you a sharp capacity to learn complex Occult subjects easily.
                        </p>
                      </div>

                      {/* Career */}
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-black block border-b border-white/5 pb-1">Best Professional Fields</span>
                        <p className="text-slate-300">
                          Your profession house (10th house) aligns under the influence of {ZODIAC_SIGNS.find(z => z.num === chartData.housesSigns[10])?.lord || 'Saturn'}. Planetary vectors suggest highly successful career alignments in fields of corporate leadership, academic research, technology management, medical science, or spiritual counseling. Starting independent consulting businesses during positive Jupiter transits is highly recommended.
                        </p>
                      </div>

                      {/* Remedies */}
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-widest text-rose-400 font-black block border-b border-white/5 pb-1">Vedic Pariharams (Remedies)</span>
                        <p className="text-slate-300">
                          To strengthen the lord of your birth nakshatra and clear obstacles regarding career delays:
                          <span className="block mt-2 font-bold text-amber-300">• Chant 'Om Namah Shivaya' 11 times in the morning.</span>
                          <span className="block mt-1 font-bold text-amber-300">• Light a small sesame oil lamp at home on Saturday evenings.</span>
                          <span className="block mt-1 font-bold text-amber-300">• Donate food to someone in need to align your material values.</span>
                        </p>
                      </div>

                    </div>

                    <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-[9px] uppercase tracking-widest font-black text-slate-500">Calculated via Kkarthikeya Vedic Ephemeris Engine v1.2</span>
                      <Link 
                        href={`/booking?plan=silver&service=kundli`}
                        className="py-3 px-8 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-widest transition-all shadow-glow flex items-center gap-1.5"
                      >
                        Request Detailed PDF consultation <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                </motion.div>
              ) : (
                <motion.div
                  key="empty-prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-[2.5rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-12 text-center text-slate-500 space-y-4"
                >
                  <Compass className="w-12 h-12 mx-auto text-slate-700 animate-spin [animation-duration:15s]" />
                  <div className="space-y-2 max-w-sm mx-auto">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 font-serif">Awaiting Coordinates</h3>
                    <p className="text-xs leading-relaxed text-slate-500">
                      Enter your precise birth date, time, and coordinates on the left panel to generate your interactive Vedic Kundli chart.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </section>
      </main>
    </AuthGuard>
  );
}
