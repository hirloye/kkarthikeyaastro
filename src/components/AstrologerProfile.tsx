"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Star, ShieldCheck, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AstrologerProfile({ className, status = 'online' }: { className?: string, status?: 'online' | 'offline' | 'busy' }) {
  return (
    <aside className={cn("flex flex-col gap-5 w-full md:w-80", className)}>
      {/* Main Astrologer Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden group rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 shadow-antigravity transition-all duration-500 hover:-translate-y-2 hover:shadow-antigravity-hover"
      >
        {/* Ambient glow behind avatar */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/10 blur-[60px] rounded-full transition-all group-hover:bg-indigo-500/20" />
        
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-32 h-32 mb-4">
            {/* Ring Orbit Animation */}
            <div className="absolute inset-0 rounded-full border border-dashed border-indigo-500/30 animate-[spin_20s_linear_infinite]" />
            
            {/* Avatar frame */}
            <div className="absolute inset-2 rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-1 overflow-hidden backdrop-blur-md">
              <img 
                src="/assets/astrologer.png?v=2"
                alt="Astrologer Nova"
                className="w-full h-full object-cover rounded-full transform transition duration-500 group-hover:scale-105 animate-float-slow"
              />
            </div>
            
            {/* Active Pulse Indicator */}
            {status === 'online' && (
              <span className="absolute bottom-2 right-2 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            )}
            {status === 'busy' && (
              <span className="absolute bottom-2 right-2 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-slate-950"></span>
              </span>
            )}
            {status === 'offline' && (
              <span className="absolute bottom-2 right-2 flex h-4 w-4">
                <span className="relative inline-flex rounded-full h-4 w-4 bg-slate-500 border-2 border-slate-950"></span>
              </span>
            )}
          </div>

          <h2 className="text-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Astrologer Nova
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </h2>
          <p className="text-xs text-indigo-300 tracking-wider uppercase mt-1">Master Psychic & Vedic Guide</p>
          
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Expert
          </div>
        </div>

        {/* Expertise Pills */}
        <div className="mt-6 space-y-3">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Celestial Arts</p>
          <div className="flex flex-wrap gap-2">
            {["Natal Charts", "Tarot", "Synastry", "Soul Path"].map((badge) => (
              <span 
                key={badge}
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200 backdrop-blur-sm transition-all hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-200 cursor-default"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Secondary Bento stats card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-5 shadow-antigravity transition-all duration-500 hover:-translate-y-1.5 hover:shadow-antigravity-hover"
      >
        <div className="grid grid-cols-2 gap-4 divide-x divide-white/5">
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-xl bg-white/5 mb-2 border border-white/5 text-indigo-300">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-lg font-semibold text-white">14.2k</div>
            <div className="text-[10px] uppercase text-slate-500 tracking-widest">Readings</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-xl bg-white/5 mb-2 border border-white/5 text-amber-300">
              <Star className="w-5 h-5 fill-amber-300/20" />
            </div>
            <div className="text-lg font-semibold text-white">4.98</div>
            <div className="text-[10px] uppercase text-slate-500 tracking-widest">Rating</div>
          </div>
        </div>
        
        {/* Live Moon Phase Container */}
        <div className="mt-4 flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/10 text-indigo-200 text-xs">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-300" />
            <span>Waxing Gibbous</span>
          </div>
          <span className="opacity-60">84% illuminated</span>
        </div>
      </motion.div>
    </aside>
  );
}
