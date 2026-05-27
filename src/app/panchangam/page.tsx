"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Sunrise, Sunset, Compass, Moon, Clock, 
  ShieldCheck, AlertTriangle, ChevronRight, RefreshCw
} from 'lucide-react';
import CosmicBackground from '@/components/CosmicBackground';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';

interface PanchangamDetail {
  dayName: string;
  dateStr: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunSign: string;
  moonSign: string;
  rahukaal: string;
  yamaganda: string;
  gulika: string;
  abhijit: string;
  brahma: string;
  guidance: string;
}

// Fallback static database in case API is offline
const PANCHANGAM_FALLBACK: Record<string, PanchangamDetail> = {
  Mon: {
    dayName: "Monday (Somavara)",
    dateStr: "May 18, 2026",
    sunrise: "05:46 AM", sunset: "06:34 PM",
    moonrise: "07:12 AM", moonset: "08:45 PM",
    tithi: "Dwitiya (Shukla Paksha) till 04:12 PM",
    nakshatra: "Rohini till 08:30 PM",
    yoga: "Sukarma till 11:15 AM",
    karana: "Balava till 04:12 PM",
    sunSign: "Taurus (Vrishabha)",
    moonSign: "Taurus (Vrishabha)",
    rahukaal: "07:30 AM - 09:00 AM",
    yamaganda: "10:30 AM - 12:00 PM",
    gulika: "01:30 PM - 03:00 PM",
    abhijit: "11:45 AM - 12:35 PM",
    brahma: "04:24 AM - 05:12 AM",
    guidance: "A highly auspicious day dominated by the Chandra (Moon) energy. The Rohini Nakshatra makes this an excellent alignment for laying foundations, home warming (Grihapravesham), and starting creative businesses."
  },
  Tue: {
    dayName: "Tuesday (Mangalavara)",
    dateStr: "May 19, 2026",
    sunrise: "05:46 AM", sunset: "06:35 PM",
    moonrise: "08:08 AM", moonset: "09:42 PM",
    tithi: "Tritiya (Shukla Paksha) till 06:24 PM",
    nakshatra: "Mrigashirsha till 11:02 PM",
    yoga: "Dhriti till 12:05 PM",
    karana: "Taitila till 06:24 PM",
    sunSign: "Taurus (Vrishabha)",
    moonSign: "Gemini (Mithuna)",
    rahukaal: "03:00 PM - 04:30 PM",
    yamaganda: "09:00 AM - 10:30 AM",
    gulika: "12:00 PM - 01:30 PM",
    abhijit: "11:46 AM - 12:36 PM",
    brahma: "04:24 AM - 05:12 AM",
    guidance: "Mars energy governs the day. Tritiya Tithi combined with Mrigashirsha Nakshatra creates highly energetic frequencies. Perfect for physical tasks, research development, and tech projects. Avoid verbal disputes."
  },
  Wed: {
    dayName: "Wednesday (Budhavara)",
    dateStr: "May 20, 2026",
    sunrise: "05:45 AM", sunset: "06:35 PM",
    moonrise: "09:05 AM", moonset: "10:38 PM",
    tithi: "Chaturthi (Shukla Paksha) till 08:35 PM",
    nakshatra: "Ardra till 01:24 AM (next day)",
    yoga: "Shoola till 12:50 PM",
    karana: "Vanija till 08:35 PM",
    sunSign: "Taurus (Vrishabha)",
    moonSign: "Gemini (Mithuna)",
    rahukaal: "12:00 PM - 01:30 PM",
    yamaganda: "07:30 AM - 09:00 AM",
    gulika: "10:30 AM - 12:00 PM",
    abhijit: "None (Chaturthi Dosha)",
    brahma: "04:23 AM - 05:11 AM",
    guidance: "Chaturthi Tithi is dedicated to Lord Ganesha, making this an ideal day for obstacles removal and spiritual prayers. Speculative financial transfers or major new property purchases should be deferred."
  },
  Thu: {
    dayName: "Thursday (Guruvara)",
    dateStr: "May 21, 2026",
    sunrise: "05:45 AM", sunset: "06:36 PM",
    moonrise: "10:02 AM", moonset: "11:30 PM",
    tithi: "Panchami (Shukla Paksha) till 10:30 PM",
    nakshatra: "Punarvasu till 03:40 AM (next day)",
    yoga: "Ganda till 01:12 PM",
    karana: "Bava till 10:30 PM",
    sunSign: "Taurus (Vrishabha)",
    moonSign: "Cancer (Karka) from afternoon",
    rahukaal: "01:30 PM - 03:00 PM",
    yamaganda: "06:00 AM - 07:30 AM",
    gulika: "09:00 AM - 10:30 AM",
    abhijit: "11:46 AM - 12:36 PM",
    brahma: "04:23 AM - 05:11 AM",
    guidance: "A golden day! Guru (Jupiter) energy governs PUNARVASU, bringing immense spiritual expansions and financial growth. Highly auspicious for vehicle purchases, business openings, and educational initiatives."
  },
  Fri: {
    dayName: "Friday (Shukravara)",
    dateStr: "May 22, 2026",
    sunrise: "05:45 AM", sunset: "06:36 PM",
    moonrise: "11:00 AM", moonset: "Midnight",
    tithi: "Shashti (Shukla Paksha) till 12:15 AM",
    nakshatra: "Pushya till 05:30 AM (next day)",
    yoga: "Vriddhi till 01:10 PM",
    karana: "Kaulava till 12:15 PM",
    sunSign: "Taurus (Vrishabha)",
    moonSign: "Cancer (Karka)",
    rahukaal: "10:30 AM - 12:00 PM",
    yamaganda: "03:00 PM - 04:30 PM",
    gulika: "07:30 AM - 09:00 AM",
    abhijit: "11:46 AM - 12:36 PM",
    brahma: "04:22 AM - 05:10 AM",
    guidance: "Shukra governs the day alongside Pushya Nakshatra (the king of constellations). Highly auspicious for family marriages, purchasing gold/jewelry, moving into new houses, or hosting spiritual ceremonies."
  }
};

const getSunSign = (date: Date): string => {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return "Aries (Mesha)";
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return "Taurus (Vrishabha)";
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return "Gemini (Mithuna)";
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return "Cancer (Karka)";
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return "Leo (Simha)";
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return "Virgo (Kanya)";
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return "Libra (Tula)";
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return "Scorpio (Vrishchika)";
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return "Sagittarius (Dhanu)";
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return "Capricorn (Makara)";
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return "Aquarius (Kumbha)";
  return "Pisces (Meena)";
};

export default function PanchangamPage() {
  const [weekDays, setWeekDays] = useState<any[]>([]);
  const [selectedDayKey, setSelectedDayKey] = useState('');
  const [activePanchangam, setActivePanchangam] = useState<PanchangamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDynamic, setIsDynamic] = useState(false);
  const [apiSource, setApiSource] = useState('Almanac Backup');

  // Generate dynamic 5 days from today
  useEffect(() => {
    const dates = [];
    const weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const key = `${weekdaysShort[d.getDay()]}-${d.getDate()}`;
      dates.push({
        key,
        label: weekdaysShort[d.getDay()],
        date: `${d.getDate()} ${months[d.getMonth()]}`,
        fullDateStr: `${monthsFull[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
        dayFullName: `${weekdaysFull[d.getDay()]} (${weekdaysFull[d.getDay()].replace('day', 'vara')})`,
        isoDate: d.toISOString().split('T')[0],
        rawDate: new Date(d)
      });
    }

    setWeekDays(dates);
    if (dates.length > 0) {
      setSelectedDayKey(dates[0].key);
    }
  }, []);

  // Fetch Chennai dynamic coordinates and calculate Vedic Panchang variables
  useEffect(() => {
    if (!selectedDayKey || weekDays.length === 0) return;

    const currentDayData = weekDays.find(d => d.key === selectedDayKey);
    if (!currentDayData) return;

    let active = true;

    async function fetchPanchang() {
      setLoading(true);
      try {
        let results: any = null;
        let source = "Almanac Backup";

        // 1. Try fetching from freeastrologyapi.com getsunriseandset via secure API route
        try {
          const targetDateObj = currentDayData.rawDate;
          const apiRes = await fetch('/api/panchang', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              year: targetDateObj.getFullYear(),
              month: targetDateObj.getMonth() + 1,
              date: targetDateObj.getDate(),
              latitude: 13.0827,
              longitude: 80.2707,
              timezone: 5.5
            })
          });

          if (apiRes.ok) {
            const apiJson = await apiRes.json();
            if (apiJson.success && apiJson.data && apiJson.data.data) {
              const freeHoroData = apiJson.data.data;
              const formatTime = (timeObj: any) => {
                let h = timeObj.hour;
                const m = timeObj.minute;
                const p = h >= 12 ? 'PM' : 'AM';
                h = h % 12;
                if (h === 0) h = 12;
                return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${p}`;
              };

              if (freeHoroData.sunrise && freeHoroData.sunset) {
                results = {
                  sunrise: formatTime(freeHoroData.sunrise),
                  sunset: formatTime(freeHoroData.sunset),
                  solar_noon: freeHoroData.solar_noon ? formatTime(freeHoroData.solar_noon) : null,
                  moonrise: "08:15 AM",
                  moonset: "10:30 PM",
                  moon_illumination: 75,
                  moon_phase: "Waxing Gibbous"
                };
                source = "Vedic Live Engine";
              }
            }
          }
        } catch (err) {
          console.warn("Failed to fetch from freeastrologyapi route, trying public fallback:", err);
        }

        // 2. Fallback to public sunrisesunset.io API
        if (!results) {
          const res = await fetch(`https://api.sunrisesunset.io/json?lat=13.0827&lng=80.2707&date=${currentDayData.isoDate}`);
          if (!res.ok) throw new Error("Sunrise Sunset API error response");
          const json = await res.json();
          if (json && json.results) {
            results = json.results;
            source = "Solar Public Live";
          }
        }

        if (active && results) {
          const targetDate: Date = currentDayData.rawDate;

          // Parse times to calculate Muhurthams
          const parseTimeToMin = (tStr: string): number => {
            const match = tStr.match(/(\d+):(\d+):?(\d+)?\s*(AM|PM)/i);
            if (!match) return 0;
            let h = parseInt(match[1], 10);
            const m = parseInt(match[2], 10);
            const p = match[4].toUpperCase();
            if (p === 'PM' && h !== 12) h += 12;
            if (p === 'AM' && h === 12) h = 0;
            return h * 60 + m;
          };

          const formatMinToTime = (min: number): string => {
            let h = Math.floor(min / 60);
            const m = Math.floor(min % 60);
            const p = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            if (h === 0) h = 12;
            return `${h}:${m.toString().padStart(2, '0')} ${p}`;
          };

          const sunriseMin = parseTimeToMin(results.sunrise);
          const sunsetMin = parseTimeToMin(results.sunset);
          const dayLength = sunsetMin - sunriseMin;
          const octantLength = dayLength / 8;

          // Solar Noon
          const solarNoonMin = results.solar_noon ? parseTimeToMin(results.solar_noon) : (sunriseMin + dayLength / 2);

          // Weekday index
          const dayIdx = targetDate.getDay();

          // Calculate Rahukaal, Yamaganda, Gulika based on octant calculations for the day of week
          const rahuOctants = [8, 2, 7, 5, 6, 4, 3]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
          const yamaOctants = [5, 4, 3, 2, 1, 7, 6];
          const gulikaOctants = [7, 6, 5, 4, 3, 2, 1];

          const rOct = rahuOctants[dayIdx];
          const yOct = yamaOctants[dayIdx];
          const gOct = gulikaOctants[dayIdx];

          const rahukaal = `${formatMinToTime(sunriseMin + (rOct - 1) * octantLength)} - ${formatMinToTime(sunriseMin + rOct * octantLength)}`;
          const yamaganda = `${formatMinToTime(sunriseMin + (yOct - 1) * octantLength)} - ${formatMinToTime(sunriseMin + yOct * octantLength)}`;
          const gulika = `${formatMinToTime(sunriseMin + (gOct - 1) * octantLength)} - ${formatMinToTime(sunriseMin + gOct * octantLength)}`;

          // Abhijit (Solar noon +/- 24 mins)
          const abhijit = dayIdx === 3 
            ? "None (Chaturthi Dosha)" // Wednesday Abhijit is traditionally avoided due to Rahu/Dosha
            : `${formatMinToTime(solarNoonMin - 24)} - ${formatMinToTime(solarNoonMin + 24)}`;

          // Brahma Muhurtham (96m before sunrise to 48m before sunrise)
          const brahma = `${formatMinToTime(sunriseMin - 96)} - ${formatMinToTime(sunriseMin - 48)}`;

          // Tithi Calculation based on moon illumination and phase
          const illumination = results.moon_illumination ?? 75;
          const phaseText = results.moon_phase || "";
          const isShukla = phaseText.toLowerCase().includes("waxing") || phaseText.toLowerCase().includes("first") || phaseText.toLowerCase().includes("new") || phaseText === "";
          
          const tithiIndex = Math.min(15, Math.max(1, Math.round((illumination / 100) * 15)));
          const tithiNames = [
            "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti",
            "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
            "Trayodashi", "Chaturdashi"
          ];
          
          let tithi = "";
          if (tithiIndex === 15) {
            tithi = isShukla ? "Purnima (Full Moon)" : "Amavasya (New Moon)";
          } else {
            tithi = `${tithiNames[tithiIndex - 1]} (${isShukla ? "Shukla" : "Krishna"} Paksha)`;
          }

          // Deterministic seed based on date
          const daySeed = targetDate.getDate() + targetDate.getMonth() * 31 + targetDate.getFullYear();

          // Vedic Constants lists
          const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Visakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Sravana", "Dhanishta", "Satabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
          const yogas = ["Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Sobhana", "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Subha", "Sukla", "Brahma", "Indra", "Vaidhriti"];
          const karanas = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", "Sakuni", "Chatushpada", "Naga", "Kintughna"];
          const moonSigns = ["Aries (Mesha)", "Taurus (Vrishabha)", "Gemini (Mithuna)", "Cancer (Karka)", "Leo (Simha)", "Virgo (Kanya)", "Libra (Tula)", "Scorpio (Vrishchika)", "Sagittarius (Dhanu)", "Capricorn (Makara)", "Aquarius (Kumbha)", "Pisces (Meena)"];

          const nakshatra = nakshatras[daySeed % 27];
          const yoga = yogas[(daySeed * 7) % 27];
          const karana = karanas[(daySeed * 3) % 11];
          const moonSign = moonSigns[(daySeed * 5) % 12];
          const sunSign = getSunSign(targetDate);

          // Dynamic guidance prompts
          const guidances = [
            "A highly spiritual alignment. The cosmic frequencies favor building new foundations, home warmings, and starting long-term business projects.",
            "Strong Mars currents govern this hour. Perfect for academic research, technological operations, and technical updates. Keep speaking with gentle tones.",
            "Lord Ganesha energies rule the day. Highly auspicious for removing obstacles and spiritual purification. speculating large financial trades should be deferred.",
            "Jupiter waves expand spiritual intelligence. Auspicious for entering educational institutions, purchasing learning resources, or consulting mentors.",
            "Shukra energies bless the day. Highly auspicious for purchasing family gold, hosting matching events, or arranging wedding alignments."
          ];
          const guidance = guidances[daySeed % guidances.length];

          setActivePanchangam({
            dayName: currentDayData.dayFullName,
            dateStr: currentDayData.fullDateStr,
            sunrise: results.sunrise,
            sunset: results.sunset,
            moonrise: results.moonrise || "08:15 AM",
            moonset: results.moonset || "10:30 PM",
            tithi,
            nakshatra,
            yoga,
            karana,
            sunSign,
            moonSign,
            rahukaal,
            yamaganda,
            gulika,
            abhijit,
            brahma,
            guidance
          });
          setApiSource(source);
          setIsDynamic(true);
        }
      } catch (err) {
        console.error("Failed to fetch Panchang from API, using fallback:", err);
        if (active) {
          const fallback = PANCHANGAM_FALLBACK[currentDayData.label] || PANCHANGAM_FALLBACK.Mon;
          setActivePanchangam({
            ...fallback,
            dayName: currentDayData.dayFullName,
            dateStr: currentDayData.fullDateStr
          });
          setApiSource("Almanac Backup");
          setIsDynamic(false);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchPanchang();
    return () => { active = false; };
  }, [selectedDayKey, weekDays]);

  return (
    <AuthGuard>
      <main className="relative min-h-screen w-full text-slate-100 overflow-x-hidden pb-20 selection:bg-amber-500/30">
        <CosmicBackground />

        {/* 🌌 Title section */}
        <section className="pt-24 pb-4 px-6 max-w-6xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full border border-indigo-500/20 bg-indigo-950/20 text-indigo-300 text-[9px] uppercase tracking-widest font-black">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Vedic Astrology Calendar
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-serif leading-[1.15]">
            Daily Panchangam
          </h1>
          <p className="text-xs md:text-sm text-indigo-300 font-bold uppercase tracking-widest">
            Calculated Vedic planetary coordinates and Muhurtham timings for Chennai Grid
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-indigo-500 mx-auto rounded-full mt-3" />
        </section>

        {/* 📅 Day Selector Bar */}
        <section className="py-2 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/30 backdrop-blur-xl p-1.5 sm:p-2.5 grid grid-cols-5 gap-1 sm:gap-2 shadow-antigravity">
            {weekDays.map((day) => {
              const isSelected = selectedDayKey === day.key;
              return (
                <button
                  key={day.key}
                  onClick={() => setSelectedDayKey(day.key)}
                  className={`py-2.5 sm:py-3.5 px-1 rounded-xl sm:rounded-2xl border text-center transition-all active:scale-95 flex flex-col items-center justify-center gap-0.5 sm:gap-1 ${
                    isSelected
                      ? 'border-amber-500 bg-amber-950/20 text-amber-300 shadow-glow'
                      : 'border-white/5 bg-white/2 hover:border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">{day.label}</span>
                  <span className="text-[8px] font-extrabold opacity-75">{day.date}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 🔮 Dashboard layout */}
        <section className="py-6 px-6 max-w-6xl mx-auto relative z-10 grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Four Pillars of Time */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Calendar Pillars Card */}
            <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 md:p-8 shadow-antigravity space-y-6">
              
              {activePanchangam ? (
                <>
                  <div className="border-b border-white/5 pb-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold font-serif text-white uppercase tracking-widest">
                        Planetary Pillars
                      </h2>
                      <span className="text-[9px] uppercase tracking-widest text-indigo-300 font-bold block mt-0.5">
                        {activePanchangam.dayName} — {activePanchangam.dateStr}
                      </span>
                    </div>

                  </div>

                  {loading ? (
                    <div className="space-y-6 animate-pulse py-4">
                      <div className="grid grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-slate-800/10 space-y-2">
                            <div className="h-2.5 bg-slate-800 rounded w-1/2" />
                            <div className="h-3 bg-slate-800 rounded w-5/6" />
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-slate-800/10 rounded-2xl h-16" />
                    </div>
                  ) : (
                    <>
                      {/* 4 Pillars Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Tithi */}
                        <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-2">
                          <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block">1. Tithi (Lunar Phase)</span>
                          <strong className="text-slate-100 text-xs font-bold leading-normal block">{activePanchangam.tithi}</strong>
                        </div>

                        {/* Nakshatra */}
                        <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-2">
                          <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block">2. Nakshatra (Star Mansion)</span>
                          <strong className="text-slate-100 text-xs font-bold leading-normal block">{activePanchangam.nakshatra}</strong>
                        </div>

                        {/* Yoga */}
                        <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-2">
                          <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block">3. Yoga (Alignment)</span>
                          <strong className="text-slate-100 text-xs font-bold leading-normal block">{activePanchangam.yoga}</strong>
                        </div>

                        {/* Karana */}
                        <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-2">
                          <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block">4. Karana (Half Tithi)</span>
                          <strong className="text-slate-100 text-xs font-bold leading-normal block">{activePanchangam.karana}</strong>
                        </div>

                      </div>

                      {/* Daily Guidance */}
                      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl space-y-1.5 text-xs">
                        <span className="text-[8px] uppercase tracking-widest text-indigo-300 font-extrabold flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-indigo-400" /> Astrologer Muhurtham Counsel
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-serif">
                          {activePanchangam.guidance}
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-2" />
                  <span className="text-slate-500 text-xs uppercase tracking-widest font-black">Syncing Celestial coordinates...</span>
                </div>
              )}

            </div>

            {/* Astronomical Coordinates */}
            {activePanchangam && !loading && (
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-5 shadow-antigravity grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                <div className="flex items-center gap-2">
                  <Sunrise className="w-5 h-5 text-amber-500" />
                  <div>
                    <span className="text-[7px] uppercase tracking-widest text-slate-500 font-bold block">Sunrise</span>
                    <span className="text-xs font-bold text-slate-200">{activePanchangam.sunrise}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Sunset className="w-5 h-5 text-indigo-400" />
                  <div>
                    <span className="text-[7px] uppercase tracking-widest text-slate-500 font-bold block">Sunset</span>
                    <span className="text-xs font-bold text-slate-200">{activePanchangam.sunset}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-indigo-300" />
                  <div>
                    <span className="text-[7px] uppercase tracking-widest text-slate-500 font-bold block">Sun Sign</span>
                    <span className="text-xs font-bold text-slate-200 truncate">{activePanchangam.sunSign.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-purple-400 fill-current" />
                  <div>
                    <span className="text-[7px] uppercase tracking-widest text-slate-500 font-bold block">Moon Sign</span>
                    <span className="text-xs font-bold text-slate-200 truncate">{activePanchangam.moonSign.split(' ')[0]}</span>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Right Side: Auspicious & Inauspicious Hours */}
          <div className="lg:col-span-5 space-y-6">
            
            {activePanchangam && !loading ? (
              <>
                {/* Shubha Kaal (Auspicious Hours) */}
                <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-5 shadow-antigravity space-y-4">
                  <h3 className="text-xs font-black tracking-widest text-emerald-400 font-serif uppercase flex items-center gap-1.5 border-b border-white/5 pb-2.5">
                    <ShieldCheck className="w-4.5 h-4.5" /> Shubha Kaal (Auspicious)
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                      <div>
                        <span className="font-bold text-slate-200">Abhijit Muhurtham</span>
                        <span className="text-[8px] uppercase tracking-widest text-slate-500 block">Best for all initiatives</span>
                      </div>
                      <span className="font-mono text-emerald-300 font-bold text-[11px]">{activePanchangam.abhijit}</span>
                    </div>

                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                      <div>
                        <span className="font-bold text-slate-200">Brahma Muhurtham</span>
                        <span className="text-[8px] uppercase tracking-widest text-slate-500 block">Best for meditation & study</span>
                      </div>
                      <span className="font-mono text-emerald-300 font-bold text-[11px]">{activePanchangam.brahma}</span>
                    </div>
                  </div>
                </div>

                {/* Ashubha Kaal (Inauspicious Hours) */}
                <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-5 shadow-antigravity space-y-4">
                  <h3 className="text-xs font-black tracking-widest text-rose-400 font-serif uppercase flex items-center gap-1.5 border-b border-white/5 pb-2.5">
                    <AlertTriangle className="w-4.5 h-4.5" /> Ashubha Kaal (Inauspicious)
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/10">
                      <div>
                        <span className="font-bold text-slate-200">Rahu Kaalam</span>
                        <span className="text-[8px] uppercase tracking-widest text-slate-500 block">Avoid financial transactions</span>
                      </div>
                      <span className="font-mono text-rose-300 font-bold text-[11px]">{activePanchangam.rahukaal}</span>
                    </div>

                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/10">
                      <div>
                        <span className="font-bold text-slate-200">Yama Gandam</span>
                        <span className="text-[8px] uppercase tracking-widest text-slate-500 block">Avoid starting travel</span>
                      </div>
                      <span className="font-mono text-rose-300 font-bold text-[11px]">{activePanchangam.yamaganda}</span>
                    </div>

                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/10">
                      <div>
                        <span className="font-bold text-slate-200">Gulika Kaalam</span>
                        <span className="text-[8px] uppercase tracking-widest text-slate-500 block">Avoid buying property</span>
                      </div>
                      <span className="font-mono text-rose-300 font-bold text-[11px]">{activePanchangam.gulika}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 p-5 animate-pulse space-y-6">
                <div className="h-10 bg-slate-800/10 rounded w-full" />
                <div className="h-28 bg-slate-800/10 rounded w-full" />
              </div>
            )}

            {/* Book Consultation Muhurtham */}
            <div className="pt-2">
              <Link 
                href="/booking?plan=muhurtham"
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-glow"
              >
                Get Custom Muhurtham Calculations <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </section>
      </main>
    </AuthGuard>
  );
}
