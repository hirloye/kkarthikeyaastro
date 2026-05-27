"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Lock, Orbit } from 'lucide-react';
import CosmicBackground from './CosmicBackground';
import { motion } from 'framer-motion';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setIsRedirecting(true);
      // Store current path so login page can redirect back after successful auth
      sessionStorage.setItem('astro_redirect_after_login', pathname || '/');
      const timer = setTimeout(() => {
        router.push('/login');
      }, 1000); // Small delay to let them see the "Celestial Seal" or loading animation
      return () => clearTimeout(timer);
    } else {
      setIsRedirecting(false);
    }
  }, [currentUser, router, pathname]);

  if (!currentUser || isRedirecting) {
    return (
      <main className="relative min-h-screen w-full flex flex-col items-center justify-center text-slate-100 overflow-hidden">
        <CosmicBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-antigravity text-center flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 shadow-glow">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">Celestial Gate Sealed</h2>
          <p className="text-xs text-indigo-200/70 mt-3 leading-relaxed">
            Please cross the gateway threshold to align your charts. Redirecting to the Login portal...
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-amber-300 font-mono tracking-widest uppercase">
            <Orbit className="w-4 h-4 animate-spin text-amber-500" />
            Connecting Session
          </div>
        </motion.div>
      </main>
    );
  }

  return <>{children}</>;
}
