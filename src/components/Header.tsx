"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, LogOut, Languages } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const pathname = usePathname();
  const { currentUser, logoutUser } = useApp();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide header on admin and chat routes
  if (pathname?.startsWith('/admin') || pathname === '/chat') {
    return null;
  }

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.services, path: '/services' },
    { name: t.nav.horoscope, path: '/horoscope' },
    { name: t.nav.panchangam, path: '/panchangam' },
    { name: t.nav.birthChart, path: '/birth-chart' },
    { name: t.nav.blogs, path: '/blogs' },
    { name: t.nav.booking, path: '/booking' }
  ];

  return (
    <>
      <header className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 w-[96%] sm:w-[95%] max-w-6xl z-40 border border-white/10 bg-slate-950/75 backdrop-blur-xl rounded-full px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.6)] notranslate" translate="no">
        {/* Logo Branding */}
        <Link href="/" prefetch={false} className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink group notranslate" translate="no">
          <Image
            src="/assets/KK_Logo.webp"
            alt="Kkarthikeya Astrological Centre Logo"
            width={56}
            height={56}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain group-hover:scale-105 transition-transform duration-300 shrink-0"
            priority
            loading="eager"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] sm:text-xs md:text-sm font-black tracking-wide sm:tracking-widest bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent uppercase font-serif whitespace-nowrap">
              {language === 'ta' ? 'கார்த்திகேயா' : 'Kkarthikeya'}
            </span>
            <span className="text-[6.5px] sm:text-[7px] md:text-[8px] uppercase tracking-wider sm:tracking-widest text-indigo-300 font-bold -mt-0.5 whitespace-nowrap">
              {language === 'ta' ? 'ஜோதிட மையம்' : 'Astrological Centre'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6.5 text-[10px] font-bold uppercase tracking-widest notranslate" translate="no">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                prefetch={false}
                className={`relative py-1 transition-all duration-300 hover:text-amber-300 notranslate ${isActive ? 'text-amber-400 font-extrabold' : 'text-slate-300/80'
                  }`}
                translate="no"
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Call to Actions (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 notranslate" translate="no">
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            type="button"
            aria-label="Toggle language between English and Tamil"
            className="group relative flex items-center bg-slate-900/90 hover:bg-slate-850 border border-white/10 hover:border-amber-400/40 rounded-full p-1 transition-all duration-300 shadow-sm active:scale-95 cursor-pointer notranslate"
            title={language === 'en' ? 'தமிழில் மாற்றுக (Switch to Tamil)' : 'Switch to English (ஆங்கிலம்)'}
            translate="no"
          >
            <div className="flex items-center gap-1.5 px-2 py-0.5">
              <Languages className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              <div className="flex items-center text-[10px] tracking-wider uppercase font-semibold">
                <span
                  className={`px-1.5 py-0.5 rounded-full transition-all duration-200 ${
                    language === 'en'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  EN
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded-full transition-all duration-200 ${
                    language === 'ta'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  தமிழ்
                </span>
              </div>
            </div>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-[9px] tracking-widest text-emerald-900 font-extrabold uppercase bg-white py-1.5 px-3 rounded-full shadow-sm">
                {currentUser.username}
              </span>
              <Link
                href="/chat"
                prefetch={false}
                className="text-[9px] uppercase tracking-widest py-1.5 px-4 rounded-full bg-indigo-600 text-white font-bold transition-all shadow-[0_4px_12px_rgba(99,102,241,0.2)] border border-indigo-500/20 active:scale-95"
              >
                {t.nav.quickChat}
              </Link>
              <button
                onClick={logoutUser}
                className="p-2 border border-red-500/20 rounded-full bg-red-500 hover:bg-red-400 hover:border-red-500/20 text-white hover:text-white transition-all active:scale-95"
                title={t.nav.logout}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              prefetch={false}
              className="relative group overflow-hidden py-2 px-5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[9px] font-bold tracking-wider uppercase shadow-[0_4px_15px_rgba(217,119,6,0.3)] border border-amber-400/20 active:scale-95 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-1">
                {t.nav.login}
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger menu header bar */}
        <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0 notranslate" translate="no">
          {/* Customized Mobile Language Toggle Icon */}
          <button
            onClick={toggleLanguage}
            type="button"
            aria-label={language === 'en' ? 'Switch to Tamil' : 'Switch to English'}
            className="relative flex items-center justify-center w-8 h-8 rounded-full border border-amber-500/40 bg-gradient-to-b from-slate-900 to-slate-950 text-amber-300 hover:border-amber-400 active:scale-90 transition-all shadow-sm shrink-0 notranslate"
            title={language === 'en' ? 'தமிழில் மாற்றுக (Switch to Tamil)' : 'Switch to English'}
            translate="no"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span className="absolute -bottom-1 -right-1 min-w-[14px] h-[13px] px-0.5 flex items-center justify-center text-[7px] font-black uppercase tracking-tighter bg-amber-500 text-slate-950 rounded-full leading-none shadow-[0_0_8px_rgba(245,158,11,0.5)] border border-slate-950 font-sans">
              {language === 'en' ? 'த' : 'EN'}
            </span>
          </button>

          {currentUser ? (
            <Link
              href="/chat"
              prefetch={false}
              className="text-[8px] uppercase tracking-wider font-extrabold py-1.5 px-2.5 sm:px-3.5 bg-indigo-600 border border-indigo-500/25 rounded-full text-white shadow-glow whitespace-nowrap"
            >
              {t.nav.quickChat}
            </Link>
          ) : (
            <Link
              href="/login"
              prefetch={false}
              className="text-[8px] uppercase tracking-wider font-extrabold py-1.5 px-2.5 sm:px-3.5 bg-amber-600 border border-amber-500/25 rounded-full text-white shadow-glow whitespace-nowrap"
            >
              {t.nav.login}
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 sm:p-2 rounded-full border border-white/10 bg-slate-900/60 text-slate-300 active:scale-90 transition-all shrink-0"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-[95%] z-40 lg:hidden bg-slate-950/90 border border-white/10 backdrop-blur-2xl rounded-3xl p-5 shadow-antigravity pointer-events-auto notranslate"
            translate="no"
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
          >
            <div className="flex flex-col gap-4 notranslate" translate="no">
              <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold border-b border-white/5 pb-1.5 flex justify-between items-center">
                <span>{t.nav.navigation}</span>
                {currentUser && (
                  <span className="text-[8px] text-emerald-400 font-semibold uppercase">{t.nav.user}: {currentUser.username}</span>
                )}
              </div>

              <nav className="flex flex-col gap-2.5 notranslate" translate="no">
                {navLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      prefetch={false}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-xs py-2 px-3 rounded-xl transition-all notranslate ${isActive
                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold'
                        : 'text-slate-300 hover:bg-white/5'
                        }`}
                      translate="no"
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-white/5 pt-3.5 flex flex-col gap-2.5 notranslate" translate="no">
                {/* Language Switch button in drawer */}
                <button
                  type="button"
                  onClick={() => {
                    toggleLanguage();
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300 text-xs font-semibold flex items-center justify-between notranslate"
                  translate="no"
                >
                  <span className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-amber-400" />
                    {language === 'en' ? 'Language: English' : 'மொழி: தமிழ்'}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                    {language === 'en' ? 'தமிழில் மாற்றுக' : 'Switch to English'}
                  </span>
                </button>

                {currentUser ? (
                  <>
                    <Link
                      href="/chat"
                      prefetch={false}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2 rounded-full border border-indigo-500/30 text-center text-xs font-semibold uppercase tracking-wider text-white bg-indigo-600 flex items-center justify-center gap-2 notranslate"
                      translate="no"
                    >
                      {t.nav.quickChat}
                    </Link>
                    <button
                      onClick={() => {
                        logoutUser();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 rounded-full border border-red-500/20 text-center text-xs font-semibold uppercase tracking-wider text-red-400 bg-red-950/20 flex items-center justify-center gap-2 notranslate"
                      translate="no"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.nav.logout}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    prefetch={false}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-center text-xs font-bold uppercase tracking-wider text-white shadow-glow border border-amber-500/20 notranslate"
                    translate="no"
                  >
                    {t.nav.login}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
