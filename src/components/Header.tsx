"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Orbit, Menu, X, ChevronRight, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Header() {
  const pathname = usePathname();
  const { currentUser, logoutUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide header on admin and chat routes
  if (pathname?.startsWith('/admin') || pathname === '/chat') {
    return null;
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Horoscope', path: '/horoscope' },
    { name: 'Panchangam', path: '/panchangam' },
    { name: 'Birth Chart', path: '/birth-chart' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Booking', path: '/booking' }
  ];

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-40 border border-white/10 bg-slate-950/65 backdrop-blur-xl rounded-full px-5 py-2.5 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        {/* Logo Branding */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/assets/KK_Logo.webp?v=2"
            alt="Kkarthikeya Astrological Centre Logo"
            width={56}
            height={56}
            className="w-14 h-14 object-contain group-hover:scale-105 transition-transform duration-300"
            priority
          />
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-widest bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent uppercase font-serif">
              Kkarthikeya
            </span>
            <span className="text-[7px] uppercase tracking-widest text-indigo-300 font-bold -mt-0.5">
              Astrological Centre
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6.5 text-[10px] font-bold uppercase tracking-widest">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`relative py-1 transition-all duration-300 hover:text-amber-300 ${isActive ? 'text-amber-400 font-extrabold' : 'text-slate-300/80'
                  }`}
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
        <div className="hidden lg:flex items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-[9px] tracking-widest text-emerald-400 font-extrabold uppercase border border-emerald-500/20 bg-emerald-950/20 py-1.5 px-3 rounded-full">
                {currentUser.username}
              </span>
              <Link
                href="/chat"
                className="text-[9px] uppercase tracking-widest py-1.5 px-4 rounded-full bg-indigo-600 text-white font-bold transition-all shadow-[0_4px_12px_rgba(99,102,241,0.2)] border border-indigo-500/20 active:scale-95"
              >
                Quick Chat
              </Link>
              <button
                onClick={logoutUser}
                className="p-2 border border-red-500/20 rounded-full bg-red-500 hover:bg-red-400 hover:border-red-500/20 text-white hover:text-white transition-all active:scale-95"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="relative group overflow-hidden py-2 px-5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[9px] font-bold tracking-wider uppercase shadow-[0_4px_15px_rgba(217,119,6,0.3)] border border-amber-400/20 active:scale-95 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-1">
                Login Portal
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger menu header bar */}
        <div className="flex lg:hidden items-center gap-2">
          {currentUser ? (
            <Link
              href="/chat"
              className="text-[8px] uppercase tracking-widest font-extrabold py-1.5 px-3.5 bg-indigo-600 border border-indigo-500/25 rounded-full text-white shadow-glow"
            >
              Quick Chat
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-[8px] uppercase tracking-widest font-extrabold py-1.5 px-3.5 bg-amber-600 border border-amber-500/25 rounded-full text-white shadow-glow"
            >
              Login
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full border border-white/10 bg-slate-900/60 text-slate-300 active:scale-90 transition-all"
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
            className="fixed top-20 left-1/2 -translate-x-1/2 w-[95%] z-40 lg:hidden bg-slate-950/90 border border-white/10 backdrop-blur-2xl rounded-3xl p-5 shadow-antigravity pointer-events-auto"
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
          >
            <div className="flex flex-col gap-4">
              <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold border-b border-white/5 pb-1.5 flex justify-between items-center">
                <span>Stellar Navigation</span>
                {currentUser && (
                  <span className="text-[8px] text-emerald-400 font-semibold uppercase">User: {currentUser.username}</span>
                )}
              </div>

              <nav className="flex flex-col gap-2.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-xs py-2 px-3 rounded-xl transition-all ${isActive
                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold'
                        : 'text-slate-300 hover:bg-white/5'
                        }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-white/5 pt-3.5 flex flex-col gap-2.5">
                {currentUser ? (
                  <>
                    <Link
                      href="/chat"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2 rounded-full border border-indigo-500/30 text-center text-xs font-semibold uppercase tracking-wider text-white bg-indigo-600 flex items-center justify-center gap-2"
                    >
                      Open Quick Chat Channel
                    </Link>
                    <button
                      onClick={() => {
                        logoutUser();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 rounded-full border border-red-500/20 text-center text-xs font-semibold uppercase tracking-wider text-red-400 bg-red-950/20 flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect Portal
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-center text-xs font-bold uppercase tracking-wider text-white shadow-glow border border-amber-500/20"
                  >
                    Open Login Portal
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
