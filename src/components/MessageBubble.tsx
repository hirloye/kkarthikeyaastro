"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';
  const [isPlaying, setIsPlaying] = useState(false);

  // Render content based on message type
  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <p className="text-sm leading-relaxed text-slate-100">{message.content}</p>;

      case 'audio':
        return (
          <div className="flex items-center gap-3 py-1.5 px-2">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-indigo-500/30 text-white transition-all duration-300 focus:outline-none border border-white/10"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            
            {/* Waveform Container */}
            <div className="flex items-end gap-[3px] h-6 px-2">
              {Array.from({ length: 16 }).map((_, i) => {
                // Generate variable heights for the waveform bars
                const height = [12, 20, 8, 16, 24, 12, 18, 10, 14, 22, 16, 20, 8, 14, 10, 16][i];
                return (
                  <div 
                    key={i}
                    className={cn(
                      "w-[3px] rounded-full transition-all duration-300 bg-indigo-300/50",
                      isPlaying ? "waveform-bar" : ""
                    )}
                    style={{ 
                      height: `${height}px`, 
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '0.9s'
                    }}
                  />
                );
              })}
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-indigo-200/70 select-none">
              <Volume2 className="w-3 h-3" />
              <span>{message.audioDuration || "0:12"}</span>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="group/img flex flex-col gap-3">
            {message.content && <p className="text-sm text-slate-100 mb-1">{message.content}</p>}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 p-2 shadow-inner transition-all duration-500 hover:-translate-y-1 hover:shadow-antigravity">
              <Image 
                src={message.imageUrl || "/assets/birth_chart.png"} 
                alt="Birth Chart" 
                width={300} 
                height={300}
                className="rounded-xl object-cover w-full h-48 md:h-64 transition-all duration-700 group-hover/img:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-xs font-medium text-white drop-shadow-md tracking-wide">View Natal Configuration</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex w-full mb-4 animate-float-medium",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] md:max-w-[70%] relative transition-all duration-300",
          isUser 
            ? "rounded-3xl rounded-tr-lg px-5 py-3.5 border border-white/15 shadow-antigravity text-white bg-white/10 backdrop-blur-md hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-antigravity-hover" 
            : "rounded-3xl rounded-tl-lg px-5 py-3.5 border border-indigo-500/10 shadow-antigravity bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl text-indigo-50 shadow-[inset_0_1px_20px_rgba(99,102,241,0.1)] hover:-translate-y-0.5 hover:shadow-glow",
          message.type === 'image' && "p-3"
        )}
      >
        {renderContent()}
        
        {/* Timestamp */}
        <div className={cn(
          "text-[10px] mt-1 opacity-40 select-none",
          isUser ? "text-right" : "text-left"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
}
