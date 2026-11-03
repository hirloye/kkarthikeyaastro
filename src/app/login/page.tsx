"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import CosmicBackground from '@/components/CosmicBackground';
import { motion } from 'framer-motion';
import { Orbit, User, Phone, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const { currentUser, loginUser, registerUser } = useApp();
  const { t, language, tText } = useLanguage();
  const router = useRouter();

  // Mode: Existing User (false) vs New User (true)
  const [isRegister, setIsRegister] = useState(true);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [tobPeriod, setTobPeriod] = useState('AM');
  const [pob, setPob] = useState('');
  const [gender, setGender] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      const redirectPath = sessionStorage.getItem('astro_redirect_after_login') || '/';
      sessionStorage.removeItem('astro_redirect_after_login');
      router.push(redirectPath);
    }
  }, [currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone.trim()) {
      return setError(tText('Please enter your phone number.', 'உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்.'));
    }

    if (isRegister) {
      if (!name.trim()) return setError(tText('Please enter your full name.', 'உங்கள் முழு பெயரை உள்ளிடவும்.'));
      const trimmedEmail = email.trim().toLowerCase();
      if (trimmedEmail && !trimmedEmail.includes('@')) {
        return setError(tText('Please enter a valid email address.', 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.'));
      }
      if (!gender) return setError(tText('Please select your gender.', 'பாலினத்தைத் தேர்ந்தெடுக்கவும்.'));
      if (!dob) return setError(tText('Please enter your date of birth.', 'பிறந்த தேதியை உள்ளிடவும்.'));
      if (!tob) return setError(tText('Please enter your time of birth.', 'பிறந்த நேரத்தை உள்ளிடவும்.'));
      if (!pob.trim()) return setError(tText('Please enter your place of birth.', 'பிறந்த இடத்தை உள்ளிடவும்.'));
    }

    setIsLoading(true);
    try {
      if (isRegister) {
        const { data: existingUser, error: queryErr } = await supabase
          .from('seekers')
          .select('id')
          .eq('phone', phone.trim())
          .maybeSingle();

        if (queryErr) throw queryErr;

        if (existingUser) {
          setError(tText(
            'This phone number is already registered. Please login as an Existing User.',
            'இந்த தொலைபேசி எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது. ஏற்கெனவே உள்ள பயனர் வழியாக உள்நுழையவும்.'
          ));
          setIsLoading(false);
          return;
        }

        const formattedTob = `${tob} ${tobPeriod}`;
        await registerUser(name.trim(), phone.trim(), email.trim().toLowerCase(), dob, formattedTob, pob.trim(), gender);
      } else {
        await loginUser(phone.trim());
      }
    } catch (err: any) {
      console.error("Authentication failed:", err);
      setError(err.message || tText('Authentication failed. Please verify your details.', 'உள்நுழைவு தோல்வியடைந்தது. உங்கள் விவரங்களை சரிபார்க்கவும்.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full text-slate-100 overflow-hidden flex flex-col items-center justify-center py-12 px-6">
      <CosmicBackground />

      {/* Main Glass login card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full rounded-3rem border border-white/10 bg-slate-900/35 backdrop-blur-xl p-8 md:p-10 shadow-antigravity relative overflow-hidden z-10"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold font-serif text-white tracking-wide uppercase">
            {tText("User Sign In & Register", "பயனர் உள்நுழைவு & பதிவு")}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {tText("Access your consultations, birth charts, and chat", "உங்கள் ஆலோசனைகள் மற்றும் ஜாதக விபரங்களைப் பார்க்க")}
          </p>
        </div>

        {/* Toggle Mode Tabs */}
        <div className="flex justify-center gap-6 mb-6 border-b border-white/5 pb-4">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`pb-2 text-xs font-black uppercase tracking-widest transition-all border-b-2 cursor-pointer ${!isRegister ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            {tText("Existing User", "ஏற்கெனவே உள்ள பயனர்")}
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`pb-2 text-xs font-black uppercase tracking-widest transition-all border-b-2 cursor-pointer ${isRegister ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            {tText("New Registration", "புதிய பதிவு")}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Only visible in Register mode) */}
          {isRegister && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-1.5 overflow-hidden"
            >
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block ml-1">
                {tText("Full Name", "முழு பெயர்")}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={tText("Enter your name", "உங்கள் பெயரை உள்ளிடவும்")}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/10 transition-all shadow-inner"
                  disabled={isLoading}
                  required={isRegister}
                />
              </div>
            </motion.div>
          )}

          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block ml-1">
              {tText("Phone Number", "தொலைபேசி எண்")}
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300/40" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/10 transition-all shadow-inner"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Gender Field */}
          {isRegister && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-1.5 overflow-hidden"
            >
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block ml-1">
                {t.booking.gender}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300/40" />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-slate-100 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/10 transition-all shadow-inner cursor-pointer"
                  disabled={isLoading}
                  required={isRegister}
                >
                  <option value="" disabled>{tText("-- Select Gender --", "-- பாலினத்தைத் தேர்ந்தெடுக்கவும் --")}</option>
                  <option value="Male">{t.common.male}</option>
                  <option value="Female">{t.common.female}</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Date of Birth Field */}
          {isRegister && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-1.5 overflow-hidden"
            >
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block ml-1">
                {t.booking.dob}
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-xs text-slate-100 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/10 transition-all shadow-inner [color-scheme:dark]"
                disabled={isLoading}
                required={isRegister}
              />
            </motion.div>
          )}

          {/* Birth Time Field */}
          {isRegister && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-3 gap-3 overflow-hidden"
            >
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block ml-1">
                  {t.booking.tob}
                </label>
                <input
                  type="time"
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-xs text-slate-100 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/10 transition-all shadow-inner [color-scheme:dark]"
                  disabled={isLoading}
                  required={isRegister}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block ml-1">AM/PM</label>
                <select
                  value={tobPeriod}
                  onChange={(e) => setTobPeriod(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl py-3.5 px-3 text-xs text-slate-100 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/10 transition-all shadow-inner cursor-pointer"
                  disabled={isLoading}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Birth Place Field */}
          {isRegister && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-1.5 overflow-hidden"
            >
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block ml-1">
                {t.booking.pob}
              </label>
              <input
                type="text"
                value={pob}
                onChange={(e) => setPob(e.target.value)}
                placeholder={tText("City, State, Country", "ஊர் / நகரம், மாவட்டம்")}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/10 transition-all shadow-inner"
                disabled={isLoading}
                required={isRegister}
              />
            </motion.div>
          )}

          {/* Email Field (Optional) */}
          {isRegister && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-1.5 overflow-hidden"
            >
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block ml-1">
                {tText("Email Address (Optional)", "மின்னஞ்சல் முகவரி (விருப்பத்தேர்வு)")}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/10 transition-all shadow-inner"
                  disabled={isLoading}
                />
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-xs font-semibold text-center mt-2"
            >
              {error}
            </motion.div>
          )}

          {/* Connect Button */}
          <button
            type="submit"
            className="w-full mt-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest shadow-glow border border-indigo-400/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Orbit className="w-4 h-4 animate-spin text-white" />
                {tText("Processing...", "செயல்படுத்தப்படுகிறது...")}
              </>
            ) : (
              <>
                {isRegister ? tText('Create Account', 'புதிய கணக்கு தொடங்கு') : tText('Sign In', 'உள்நுழைக')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer info inside card */}
        <div className="mt-8 border-t border-t-white/5 pt-5 text-center flex items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest font-extrabold text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>{tText("Vedic Encryption Standards Shielded", "பாரம்பரிய வேத ஜோதிட விதிகளின்படி பாதுகாப்பானது")}</span>
        </div>
      </motion.div>
    </main>
  );
}
