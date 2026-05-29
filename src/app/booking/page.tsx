"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalIcon, Clock, Shield, CheckCircle, 
  ChevronRight, Sparkles, User, PhoneCall, Moon, Compass, Sun, Orbit 
} from 'lucide-react';
import CosmicBackground from '@/components/CosmicBackground';
import AuthGuard from '@/components/AuthGuard';
import { useApp } from '@/context/AppContext';

function BookingFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentUser } = useApp();
  
  const planParam = searchParams.get('plan') || 'silver';
  const serviceParam = searchParams.get('service') || '';

  // Dynamic Plans State
  const [plansData, setPlansData] = useState<Record<string, { title: string; price: number }>>({
    quick: { title: "Quick Chat Consultation", price: 199 },
    bronze: { title: "Bronze Consultation (15 Mins)", price: 399 },
    silver: { title: "Silver Consultation (30 Mins)", price: 599 },
    gold: { title: "Gold Deep Analysis (60 Mins)", price: 799 },
    marriage: { title: "Marriage Matching", price: 499 },
    muhurtham: { title: "Muhurtham & Auspicious Timing", price: 499 }
  });

  // Form States
  const [selectedPlan, setSelectedPlan] = useState(planParam);
  const [userName, setUserName] = useState(currentUser?.username || '');
  const [mobileNum, setMobileNum] = useState(currentUser?.mobile || '');
  const [gender, setGender] = useState(currentUser?.gender || '');
  const [dob, setDob] = useState(currentUser?.dob || '');

  // Helper to parse stored "HH:MM AM" into "HH:MM" (24h) for input type="time"
  const parseTobForInput = (raw: string) => {
    if (!raw) return '';
    const parts = raw.split(' ');
    let time = parts[0];
    if (parts[1]) {
      let [hours, mins] = time.split(':');
      let h = parseInt(hours, 10);
      if (parts[1].toUpperCase() === 'PM' && h < 12) h += 12;
      if (parts[1].toUpperCase() === 'AM' && h === 12) h = 0;
      time = `${h.toString().padStart(2, '0')}:${mins}`;
    }
    return time;
  };

  const [tob, setTob] = useState(parseTobForInput(currentUser?.tob || ''));
  const [pob, setPob] = useState(currentUser?.pob || '');
  
  useEffect(() => {
    if (currentUser) {
      if (!userName) setUserName(currentUser.username || '');
      if (!mobileNum) setMobileNum(currentUser.mobile || '');
      if (!gender) setGender(currentUser.gender || '');
      if (!dob) setDob(currentUser.dob || '');
      if (!tob) setTob(parseTobForInput(currentUser.tob || ''));
      if (!pob) setPob(currentUser.pob || '');
    }
  }, [currentUser]);

  // Custom Date Picker Grid States
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // Flow control states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Fetch custom prices
  useEffect(() => {
    fetch('/api/pricing')
      .then(res => res.json())
      .then(data => {
        const updated: Record<string, { title: string; price: number }> = {};
        Object.keys(data).forEach(key => {
          const numPrice = parseInt(data[key].price.replace(/[^\d]/g, ''), 10) || 0;
          updated[key] = {
            title: data[key].title,
            price: numPrice
          };
        });
        setPlansData(prev => ({ ...prev, ...updated }));
      })
      .catch(err => console.error("Failed to load dynamic pricing for booking:", err));
  }, []);

  const activePlanInfo = plansData[selectedPlan] || plansData.silver;

  // Sync plan if param changes
  useEffect(() => {
    if (planParam && plansData[planParam]) {
      setSelectedPlan(planParam);
    }
  }, [planParam, plansData]);

  // Generate calendar days for current month
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const timeSlots = [
    { time: "09:30 AM", label: "Morning Hora" },
    { time: "11:00 AM", label: "Morning Hora" },
    { time: "02:30 PM", label: "Afternoon Hora" },
    { time: "04:30 PM", label: "Evening Hora" },
    { time: "06:30 PM", label: "Pradosha Hora" }
  ];

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = `${selectedDate} ${monthName} ${currentDate.getFullYear()}`;
      fetch(`/api/booking/availability?date=${encodeURIComponent(formattedDate)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setBookedSlots(data.bookedSlots || []);
          } else {
            setBookedSlots([]);
          }
        })
        .catch(err => console.error("Failed to load availability:", err));
    } else {
      setBookedSlots([]);
    }
  }, [selectedDate, monthName, currentDate]);

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      alert("Please select a date from the calendar.");
      return;
    }
    if (!selectedSlot) {
      alert("Please select a convenient time slot.");
      return;
    }
    
    setIsProcessing(true);
    const newBookingId = "KK" + Math.floor(100000 + Math.random() * 900000);
    
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: newBookingId,
          seekerName: userName,
          mobileNum,
          gender,
          dob,
          tob,
          pob,
          planTitle: activePlanInfo.title,
          planPrice: activePlanInfo.price,
          selectedDate: `${selectedDate} ${monthName} ${currentDate.getFullYear()}`,
          selectedSlot
        })
      });

      const data = await response.json();

      if (data.success) {
        setBookingId(newBookingId);
        setIsBooked(true);
      } else {
        alert(data.error || 'Failed to submit booking. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
      alert('Network error. Failed to schedule appointment.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppConfirmation = () => {
    const formattedDate = `${selectedDate} ${monthName} ${currentDate.getFullYear()}`;
    const textMsg = `Namaste Kkarthikeya Astrological Centre. I have successfully scheduled a consultation appointment.\n\n*Booking ID:* ${bookingId}\n*Service:* ${activePlanInfo.title}\n*Date:* ${formattedDate}\n*Time:* ${selectedSlot}\n*User:* ${userName}\n*Gender:* ${gender || 'N/A'}\n*Birth Details:* ${dob} @ ${tob}, ${pob}\n*Status:* Confirmed (Pay on Consultation)\n\nPlease confirm my spiritual consultation details.`;
    
    const phoneNumber = "917845369302";
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMsg)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 relative z-10">
      
      <AnimatePresence mode="wait">
        {!isBooked ? (
          /* 📅 STEP 1: FILL BOOKING DETAILS & CALENDAR */
          <motion.form 
            key="booking-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Main Form Container */}
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 md:p-8 shadow-antigravity space-y-8">
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-xl font-bold font-serif text-white uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" /> Astrological Plan & User Details
                </h2>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
                  Select your desired consultation service and verify your details.
                </p>
              </div>

              <div className="space-y-5">
                {/* Plan Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-amber-300">
                    Selected Astrological Plan
                  </label>
                  <select 
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all font-serif"
                  >
                    <option value="quick">Quick Chat Consultation — ₹{plansData.quick.price}</option>
                    <option value="bronze">Bronze Consultation (15 Mins) — ₹{plansData.bronze.price}</option>
                    <option value="silver">Silver Consultation (30 Mins) — ₹{plansData.silver.price}</option>
                    <option value="gold">Gold Deep Analysis (60 Mins) — ₹{plansData.gold.price}</option>
                    <option value="marriage">Marriage Matching — ₹{plansData.marriage.price}</option>
                    <option value="muhurtham">Muhurtham Auspicious Timing — ₹{plansData.muhurtham.price}</option>
                  </select>
                </div>

                {/* Name, Phone, Gender */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                      User Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="Eg: Ramesh Kumar" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <PhoneCall className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="tel" 
                        placeholder="Eg: +91 78453 69302" 
                        value={mobileNum}
                        onChange={(e) => setMobileNum(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                      Gender
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <select 
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>
                </div>

                <div className="border-t border-white/5 pt-5 mt-5">
                  <h2 className="text-xl font-bold font-serif text-white uppercase tracking-widest flex items-center gap-2">
                    <Compass className="w-5 h-5 text-indigo-400" /> Birth Coordinates
                  </h2>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest mb-4">
                    Fill in birth coordinates for high-accuracy horoscope chart mapping.
                  </p>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                      Date of Birth
                    </label>
                    <input 
                      type="date" 
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-slate-200 outline-none focus:border-indigo-500/50 transition-all [color-scheme:dark]"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                      Time of Birth
                    </label>
                    <input 
                      type="time" 
                      value={tob}
                      onChange={(e) => setTob(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-slate-200 outline-none focus:border-indigo-500/50 transition-all [color-scheme:dark]"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                      Place of Birth
                    </label>
                    <input 
                      type="text" 
                      placeholder="City, Country"
                      value={pob}
                      onChange={(e) => setPob(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time Picker Section */}
                <div className="border-t border-white/5 pt-6 mt-6 space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold font-serif text-white uppercase tracking-widest flex items-center gap-2">
                      <Clock className="w-5 h-5 text-indigo-400" /> Schedule Appointment
                    </h2>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
                      Select your preferred date and available auspicious time slot.
                    </p>
                  </div>
              
              {/* Calendar card */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-5 shadow-antigravity space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <h3 className="text-xs font-black tracking-widest text-slate-300 font-serif uppercase">
                    Select Date
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
                    <button onClick={handlePrevMonth} className="p-1 hover:text-white text-slate-500">◀</button>
                    <span className="text-amber-300 font-bold font-serif">{monthName} {currentDate.getFullYear()}</span>
                    <button onClick={handleNextMonth} className="p-1 hover:text-white text-slate-500">▶</button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold">
                  {/* Days headers */}
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, idx) => (
                    <span key={idx} className="text-slate-500 py-1 uppercase">{d}</span>
                  ))}
                  
                  {/* Empty offsets */}
                  {Array.from({ length: firstDayIndex }).map((_, idx) => (
                    <span key={`empty-${idx}`} />
                  ))}

                  {/* Days */}
                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const isSelected = selectedDate === dayNum;
                    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isPast = dayDate < today;

                    return (
                      <button
                        key={`day-${dayNum}`}
                        onClick={() => { if (!isPast) setSelectedDate(dayNum); }}
                        disabled={isPast}
                        className={`py-2 rounded-xl border text-[10px] font-mono transition-all ${
                          isPast 
                            ? 'opacity-30 cursor-not-allowed border-transparent bg-white/2'
                            : isSelected
                              ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-glow'
                              : 'border-transparent bg-white/2 hover:bg-white/5 text-slate-300 hover:text-white'
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slot Picker */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-5 shadow-antigravity space-y-4">
                <h3 className="text-xs font-black tracking-widest text-slate-300 font-serif uppercase border-b border-white/5 pb-2.5">
                  Select Auspicious Hora (Time)
                </h3>

                <div className="flex flex-col lg:flex-row lg:overflow-x-auto gap-2 lg:pb-2 scrollbar-hide">
                  {timeSlots.map((slot, idx) => {
                    const isSelected = selectedSlot === slot.time;
                    const isBooked = bookedSlots.includes(slot.time);
                    return (
                      <button
                        key={idx}
                        onClick={() => { if (!isBooked) setSelectedSlot(slot.time); }}
                        disabled={isBooked}
                        className={`w-full lg:w-max lg:shrink-0 p-3 rounded-xl border text-left flex items-center justify-between gap-6 transition-all active:scale-95 ${
                          isBooked
                            ? 'border-red-500/20 bg-red-950/20 text-red-400/50 cursor-not-allowed'
                            : isSelected
                              ? 'border-indigo-500 bg-indigo-950/20 text-indigo-300'
                              : 'border-white/5 bg-white/2 hover:border-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock className={`w-4 h-4 ${isBooked ? 'text-red-500/30' : isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                          <span className={`text-xs font-bold font-mono ${isBooked ? 'line-through decoration-red-500/50' : ''}`}>{slot.time}</span>
                        </div>
                        <span className={`text-[8px] uppercase tracking-widest font-black py-0.5 px-2 rounded-full ${
                          isBooked
                            ? 'text-red-400/50 bg-red-500/10'
                            : 'text-indigo-400 bg-indigo-500/10'
                        }`}>
                          {isBooked ? 'Slot Booked' : slot.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Security Shield */}
              <div className="flex items-center gap-2 p-3 bg-white/2 border border-white/5 rounded-2xl text-[9px] uppercase tracking-widest font-extrabold text-slate-500">
                <Shield className="w-5 h-5 text-indigo-400" />
                <span>Your birth details are encrypted and strictly confidential.</span>
              </div>

              </div>
            </div>

            {/* Form Footer / Submit */}
            <div className="space-y-4">
              {/* Selected slots summary display */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 shadow-antigravity text-xs text-slate-400">
                <div className="grid sm:grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-500">Plan Selection</span>
                    <strong className="text-white font-bold block">{activePlanInfo.title}</strong>
                  </div>
                  <div className="space-y-1 border-x border-white/5">
                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-500">Rate Fee</span>
                    <strong className="text-amber-400 font-serif font-black text-sm block">₹{activePlanInfo.price}</strong>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-500">Chosen Coordinate</span>
                    <strong className="text-indigo-300 font-medium block">
                      {selectedDate ? `${selectedDate} ${monthName} ${currentDate.getFullYear()}` : "Not Selected"} <br/> 
                      {selectedSlot || "Time Slot Not Selected"}
                    </strong>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-5 rounded-[2rem] bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-sm font-black uppercase tracking-widest shadow-glow active:scale-95 transition-all border border-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Orbit className="w-5 h-5 animate-spin" />
                    Running Vedic Algorithms...
                  </>
                ) : (
                  <>
                    Book Appointment
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        ) : (
          /* 🏆 STEP 2: CONFIRMATION & RECEIPT SCREEN */
          <motion.div
            key="booking-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto rounded-[2.5rem] border border-white/15 bg-slate-900/75 backdrop-blur-2xl p-8 md:p-10 shadow-antigravity text-center space-y-6"
            style={{ boxShadow: '0 25px 70px rgba(16,185,129,0.15)' }}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-pulse shadow-glow">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3.5xl font-black font-serif text-white uppercase tracking-widest">
                Booking Confirmed!
              </h2>
              <span className="text-[10px] text-emerald-400 tracking-widest font-black uppercase bg-emerald-500/10 border border-emerald-500/20 py-1 px-4 rounded-full inline-block">
                Celestial Channel Secured
              </span>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm mx-auto">
              Namaste {userName}. Your auspicious slot has been successfully secured. Astrologer Kkarthikeya has blocked this hora for your personalized chart calculations.
            </p>

            {/* Receipt details */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-3 text-left text-xs text-slate-300 font-medium">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-500 uppercase tracking-widest text-[9px]">Booking Code</span>
                <span className="font-mono text-indigo-300 font-bold">{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase tracking-widest text-[9px]">Consultation Plan</span>
                <span className="text-white font-bold">{activePlanInfo.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase tracking-widest text-[9px]">Auspicious Date</span>
                <span className="text-white font-bold">{selectedDate} {monthName} {currentDate.getFullYear()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase tracking-widest text-[9px]">Consultation Hour</span>
                <span className="text-white font-bold">{selectedSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase tracking-widest text-[9px]">Booking Status</span>
                <span className="text-amber-400 font-bold font-serif">Confirmed (Pay on Consultation)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button 
                onClick={handleWhatsAppConfirmation}
                className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black tracking-widest uppercase shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-1.5"
              >
                Send Details to WhatsApp
              </button>
              <button 
                onClick={() => router.push('/')}
                className="w-full py-3 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
              >
                Return to Centre
              </button>
            </div>

            <div className="text-[8px] text-slate-500 tracking-wider uppercase">
              An automated email and SMS notification have been sent with join coordinates.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}

// Main page component with Suspense fallback for SearchParams
export default function BookingPage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="min-h-screen w-full flex items-center justify-center">
          <Orbit className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      }>
        <BookingFormContent />
      </Suspense>
    </AuthGuard>
  );
}
