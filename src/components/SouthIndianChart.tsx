"use client";

import React, { useEffect, useState } from 'react';
import { Compass, Loader2 } from 'lucide-react';

interface ChartProps {
  dob?: string;
  tob?: string;
  pob?: string;
}

// Tamil mapping for Zodiac Signs
const TAMIL_SIGNS: Record<string, string> = {
  "Pisces": "மீனம்", "Aries": "மேஷம்", "Taurus": "ரிஷபம்", "Gemini": "மிதுனம்",
  "Aquarius": "கும்பம்", "Cancer": "கடகம்", "Capricorn": "மகரம்", "Leo": "சிம்மம்",
  "Sagittarius": "தனுசு", "Scorpio": "விருச்சிகம்", "Libra": "துலாம்", "Virgo": "கன்னி"
};

// Tamil mapping for Planets (short abbreviations)
const TAMIL_PLANETS: Record<string, string> = {
  "Sun": "சூ", "Moon": "ச", "Mars": "செ", "Mercury": "பு",
  "Jupiter": "கு", "Venus": "சு", "Saturn": "சனி", "Rahu": "ரா",
  "Ketu": "கே", "Ascendant": "ல", "Lagna": "ல"
};

// 4x4 Grid mapping for South Indian chart. Null indicates hollow center.
const SOUTH_INDIAN_GRID = [
  "Pisces", "Aries", "Taurus", "Gemini",
  "Aquarius", null, null, "Cancer",
  "Capricorn", null, null, "Leo",
  "Sagittarius", "Scorpio", "Libra", "Virgo"
];

// Fallback planets for demo when API is unavailable
const FALLBACK_PLANETS = [
  { name: 'Ascendant', sign: 'Aries' },
  { name: 'Sun', sign: 'Leo' },
  { name: 'Moon', sign: 'Taurus' },
  { name: 'Mars', sign: 'Aries' },
  { name: 'Mercury', sign: 'Virgo' },
  { name: 'Jupiter', sign: 'Sagittarius' },
  { name: 'Venus', sign: 'Libra' },
  { name: 'Saturn', sign: 'Capricorn' },
  { name: 'Rahu', sign: 'Gemini' },
  { name: 'Ketu', sign: 'Sagittarius' }
];

export default function SouthIndianChart({ dob, tob }: ChartProps) {
  const [loading, setLoading] = useState(true);
  const [planets, setPlanets] = useState<any[]>([]);

  useEffect(() => {
    async function fetchChart() {
      try {
        if (!dob) {
          setPlanets(FALLBACK_PLANETS);
          setLoading(false);
          return;
        }

        const [year, month, date] = dob.split('-');
        let hours = 12, minutes = 0;
        if (tob) {
          const [h, m] = tob.split(':');
          hours = parseInt(h);
          minutes = parseInt(m);
        }

        const res = await fetch('/api/horoscope', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            year: parseInt(year), 
            month: parseInt(month), 
            date: parseInt(date),
            hours,
            minutes
          })
        });

        const json = await res.json();
        
        if (json.success && Array.isArray(json.data)) {
          setPlanets(json.data);
        } else {
          console.warn("Falling back to demo chart data");
          setPlanets(FALLBACK_PLANETS);
        }
      } catch (err) {
        console.error("Chart fetch error:", err);
        setPlanets(FALLBACK_PLANETS);
      } finally {
        setLoading(false);
      }
    }

    fetchChart();
  }, [dob, tob]);

  if (loading) {
    return (
      <div className="w-full aspect-square max-w-sm mx-auto bg-slate-900/50 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-6 text-indigo-300">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-amber-500" />
        <span className="text-xs uppercase tracking-widest font-bold">Calculating alignments...</span>
      </div>
    );
  }

  // Group planets by sign
  const planetsBySign: Record<string, string[]> = {};
  planets.forEach(p => {
    if (!p.sign) return;
    if (!planetsBySign[p.sign]) planetsBySign[p.sign] = [];
    
    // Use Tamil abbreviations for display
    let shortName = TAMIL_PLANETS[p.name] || p.name.substring(0, 2).toUpperCase();
    if (p.name === 'Ascendant' && !TAMIL_PLANETS[p.name]) shortName = 'ASC';
    
    planetsBySign[p.sign].push(shortName);
  });

  return (
    <div className="w-full max-w-sm mx-auto bg-slate-950/80 rounded-2xl border border-white/15 shadow-antigravity overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500/20 to-indigo-500/20 p-3 border-b border-white/10 flex items-center justify-center gap-2">
        <Compass className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-200">Natal Rasi Chart</h3>
      </div>
      
      <div className="p-4 flex justify-center">
        <div className="grid grid-cols-4 gap-1 w-full aspect-square max-w-[280px]">
          {SOUTH_INDIAN_GRID.map((sign, idx) => {
            if (!sign) {
              return (
                <div key={idx} className="flex items-center justify-center col-span-1 row-span-1 border-none bg-transparent">
                  {idx === 5 && (
                    <div className="col-span-2 row-span-2 w-full h-full flex flex-col items-center justify-center opacity-30 select-none -mr-[200%] -mb-[200%] z-0 pointer-events-none">
                      <Compass className="w-16 h-16 text-amber-500" />
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-1 text-slate-400">South Indian</span>
                    </div>
                  )}
                </div>
              );
            }

            const isCorner = [0, 3, 12, 15].includes(idx);
            
            return (
              <div 
                key={idx} 
                className={`relative border border-amber-500/30 bg-amber-950/20 flex flex-col p-1 transition-all hover:bg-amber-900/30 ${isCorner ? 'bg-amber-950/40 border-amber-500/40' : ''}`}
              >
                <span className="text-[9px] text-amber-500/70 font-black absolute top-1 left-1 md:text-[10px]">
                  {TAMIL_SIGNS[sign] || sign.substring(0,3)}
                </span>
                
                <div className="flex-1 flex flex-wrap content-center justify-center gap-[2px] mt-2">
                  {planetsBySign[sign]?.map((p, i) => (
                    <span 
                      key={i} 
                      className={`text-xs md:text-sm font-bold ${p === 'ல' ? 'text-emerald-400' : 'text-slate-200'}`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
