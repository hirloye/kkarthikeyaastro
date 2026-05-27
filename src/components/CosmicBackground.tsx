"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function CosmicBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 5
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
      
      {/* ☁️ LIGHT MODE DECORATIONS (Sky Cloud Theme) */}
      
      {/* Golden Sun beam / Warm Solar aura in top left */}
      <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-amber-200/40 blur-[130px]" />
      
      {/* Soft Blue sky aura in top right */}
      <div className="absolute top-[10%] right-[5%] w-[550px] h-[550px] rounded-full bg-sky-200/60 blur-[120px]" />
      
      {/* Fluffy drifting cloud shapes (simulated with glassmorphic glowing blur circles) */}
      <motion.div 
        className="absolute bottom-[15%] left-[5%] w-[450px] h-[250px] rounded-[150px] bg-white/60 blur-[70px]"
        animate={{
          x: [-10, 15, -10],
          y: [0, 8, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-[25%] right-[10%] w-[550px] h-[300px] rounded-[180px] bg-white/70 blur-[90px]"
        animate={{
          x: [15, -15, 15],
          y: [0, -10, 0]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute top-[30%] left-[35%] w-[350px] h-[180px] rounded-[100px] bg-white/50 blur-[60px]"
        animate={{
          x: [0, 20, 0],
          y: [-5, 5, -5]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Sky network grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04]" 
        style={{
          backgroundImage: `radial-gradient(circle, #0ea5e9 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

    </div>
  );
}
