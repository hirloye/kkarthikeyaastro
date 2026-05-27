"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, Mic, Send, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputCapsuleProps {
  onSendMessage: (text: string) => void;
  onSendAudio: (duration: string) => void;
  onUploadClick: () => void;
}

export default function InputCapsule({ onSendMessage, onSendAudio, onUploadClick }: InputCapsuleProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordDuration(0);
    timerRef.current = setInterval(() => {
      setRecordDuration(prev => prev + 1);
    }, 1000);
  };

  const stopAndSendRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    const mins = Math.floor(recordDuration / 60);
    const secs = recordDuration % 60;
    const formattedDuration = `${mins}:${secs.toString().padStart(2, '0')}`;
    onSendAudio(formattedDuration === "0:00" ? "0:05" : formattedDuration);
  };

  const cancelRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  return (
    <div className="px-4 pb-6 md:px-8 w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex items-center w-full p-2 rounded-full border border-white/15 bg-slate-900/50 backdrop-blur-2xl shadow-antigravity transition-all hover:shadow-antigravity-hover"
      >
        <AnimatePresence mode="wait">
          {!isRecording ? (
            // --- Standard Text Input Mode ---
            <motion.div 
              key="input-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full items-center"
            >
              {/* File Attachment */}
              <button
                onClick={onUploadClick}
                className="p-3.5 ml-1 text-slate-400 hover:text-indigo-300 hover:bg-white/5 rounded-full transition-all duration-300 focus:outline-none active:scale-95"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Text Input Field */}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your celestial configuration..."
                className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 text-sm px-4 outline-none focus:ring-0 placeholder-indigo-300/30"
              />

              {/* Dynamic Action Buttons */}
              <div className="flex items-center gap-2 mr-1">
                {message.trim() ? (
                  // Send Button (Text mode)
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={handleSend}
                    className="p-3.5 rounded-full bg-indigo-600 text-white shadow-[0_4px_15px_rgba(79,70,229,0.4)] hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  >
                    <Send className="w-4 h-4 fill-current ml-0.5" />
                  </motion.button>
                ) : (
                  // Mic Button (Inactive mode)
                  <button
                    onClick={startRecording}
                    className="p-3.5 text-slate-400 hover:text-indigo-300 hover:bg-white/5 rounded-full transition-all duration-300 focus:outline-none group"
                  >
                    <Mic className="w-5 h-5 group-hover:scale-105 transition-transform" />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            // --- Live Voice Recording Mode ---
            <motion.div
              key="recording-mode"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex w-full items-center justify-between px-3"
            >
              {/* Cancel button */}
              <button 
                onClick={cancelRecording}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>

              {/* Pulse & Timer Visualization */}
              <div className="flex items-center gap-4 flex-1 justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                  </span>
                  <span className="text-sm font-mono text-slate-200 font-medium">
                    {Math.floor(recordDuration / 60)}:{ (recordDuration % 60).toString().padStart(2, '0') }
                  </span>
                </div>

                {/* Micro pulsing waveform preview */}
                <div className="flex items-center gap-[2px] h-4">
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <div 
                      key={idx} 
                      className="w-[2px] bg-red-500/60 rounded-full animate-pulse" 
                      style={{ 
                        height: `${[4, 12, 8, 16, 6, 14, 8, 12, 4, 10, 16, 6][idx % 12]}px`,
                        animationDuration: '0.6s',
                        animationDelay: `${idx * 0.08}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Finish/Send recording pill */}
              <button
                onClick={stopAndSendRecording}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-indigo-50 text-xs font-semibold shadow-glow border border-indigo-400/20 animate-pulse-glow transition-all duration-300 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                Stop & Send
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
