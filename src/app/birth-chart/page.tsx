"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Calendar, Clock, MapPin, User, 
  ChevronRight, Compass, ShieldCheck, HelpCircle, RefreshCw
} from 'lucide-react';
import CosmicBackground from '@/components/CosmicBackground';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import AuthGuard from '@/components/AuthGuard';
import SouthIndianChart from '@/components/SouthIndianChart';

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
      setIsGenerated(true);
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
        <section className="pt-10 pb-6 px-6 max-w-6xl mx-auto relative z-10 text-center space-y-4">
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
              {isGenerated ? (
                <motion.div
                  key="result-dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid md:grid-cols-12 gap-6"
                >
                  <div className="md:col-span-12 rounded-[2.5rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 shadow-antigravity flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[40px] rounded-full pointer-events-none" />
                    
                    <h3 className="text-xs font-black tracking-widest text-slate-300 font-serif uppercase mb-5 border-b border-white/5 pb-2 w-full text-center">
                      South Indian Rasi Chart
                    </h3>

                    <div className="w-full flex justify-center py-4">
                      <SouthIndianChart dob={dob} tob={tob} pob={pob} title="Rasi Chart" />
                    </div>

                    <h3 className="text-xs font-black tracking-widest text-slate-300 font-serif uppercase mt-10 mb-5 border-b border-white/5 pb-2 w-full text-center">
                      South Indian Navamsam Chart
                    </h3>

                    <div className="w-full flex justify-center py-4">
                      <SouthIndianChart dob={dob} tob={tob} pob={pob} title="Navamsam Chart" />
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
