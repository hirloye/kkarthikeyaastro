"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, X, Send, User, Phone, CheckCircle, Orbit, Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { usePathname } from 'next/navigation';

interface LocalMessage {
  id: string;
  sender: 'user' | 'astrologer';
  content: string;
  timestamp: Date;
}

const VEDIC_RESPONSES = [
  "Pranam. I have analyzed your planetary vibrations. Traditional Vedic Astrology suggest that Jupiter is currently transiting your house of expansion. This is a very favorable phase for wisdom, travel, and financial gains.",
  "For marriage matching (Kundali Porutham), we inspect 10 key compatibility elements (Kootas). I highly recommend sharing both birth charts so I can generate a 100% accurate compatibility scorecard.",
  "Muhurtham is the science of choosing the exact minute when celestial configurations align with your personal charts. Auspicious actions initiated during Muhurtham always result in long-term success.",
  "Kadikara Prasannam is a specialized hourly horary branch of Vedic astrology that decodes the immediate cosmic answers using the exact clock timing of the query. What is your immediate question?",
  "To suggest precise Vedic remedies (Pariharams) for career or business, I will need to check your 10th Lord's placement in your birth chart (Lagna) and your Navamsha (D9) chart. Let's schedule a deep-dive consultation."
];

export default function FloatingChat() {
  const pathname = usePathname();
  const { currentUser, registerUser } = useApp();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Registration inside widget if guest
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regError, setRegError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Hide on admin page or main chat page (avoid redundant chat)
  const isHiddenPage = pathname?.startsWith('/admin') || pathname?.startsWith('/chat');

  useEffect(() => {
    if (isHiddenPage) return;

    // Seed initial greeting message
    const welcomeMsg: LocalMessage = {
      id: 'welcome',
      sender: 'astrologer',
      content: currentUser 
        ? `Namaste, ${currentUser.username}. Welcome back to Kkarthikeya Astrological Centre. How can I guide your planetary alignments today?`
        : "Namaste! Welcome to Kkarthikeya Astrological Centre. I am Astrologer Kkarthikeya. Feel free to ask me any question about your horoscope, marriage matching, or Muhurtham timings!",
      timestamp: new Date()
    };
    setMessages([welcomeMsg]);

    // Auto-open chat after 3 seconds on first load
    const timer = setTimeout(() => {
      const hasAutoOpened = sessionStorage.getItem('astro_chat_auto_opened');
      if (!hasAutoOpened) {
        setIsOpen(true);
        setShowNotification(true);
        sessionStorage.setItem('astro_chat_auto_opened', 'true');
        
        // Try playing a very short synthetic beep/chime for a premium notice
        try {
          const context = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = context.createOscillator();
          const gain = context.createGain();
          osc.connect(gain);
          gain.connect(context.destination);
          osc.frequency.setValueAtTime(523.25, context.currentTime); // C5
          gain.gain.setValueAtTime(0.05, context.currentTime);
          osc.start();
          gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.3);
          osc.stop(context.currentTime + 0.3);
        } catch (e) {
          // AudioContext blocked or not supported
        }
      } else {
        setShowNotification(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentUser, isHiddenPage]);

  if (isHiddenPage) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: LocalMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate astrologer Vedic response
    setTimeout(() => {
      const replyMsg: LocalMessage = {
        id: `astro-${Date.now()}`,
        sender: 'astrologer',
        content: VEDIC_RESPONSES[Math.floor(Math.random() * VEDIC_RESPONSES.length)],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, replyMsg]);
      setIsTyping(false);
    }, 2000 + Math.random() * 1500);
  };

  const handleWidgetRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return setRegError("Please enter your name.");
    if (!regPhone.trim()) return setRegError("Please enter your mobile number.");
    if (regPhone.trim().length < 5) return setRegError("Enter a valid number.");

    registerUser(regName, regPhone);
    setRegError('');
    
    // Auto-inject a welcome confirmation
    const confirmMsg: LocalMessage = {
      id: `confirm-${Date.now()}`,
      sender: 'astrologer',
      content: `Planetary connection secured, ${regName}! The cosmic gateway is fully unlocked. How may I help you today?`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMsg]);
  };

  return (
    <>
      {/* 🔮 Floating Chat Bubble Trigger */}
      <div className="fixed bottom-6 left-6 z-50 pointer-events-auto">
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowNotification(false);
          }}
          className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 text-white shadow-[0_4px_25px_rgba(99,102,241,0.5)] border border-indigo-400/30 hover:scale-110 active:scale-95 transition-all duration-300"
          id="floating-chat-btn"
          whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
        >
          {/* Cosmic Glow Aura */}
          <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20" />
          
          <MessageSquare className="w-6 h-6 relative z-10" />

          {/* New message badge count */}
          {showNotification && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 z-20">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] text-slate-950 font-bold items-center justify-center">1</span>
            </span>
          )}

          {/* Tooltip */}
          <span className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-300 origin-left whitespace-nowrap bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 text-indigo-300 text-xs py-1.5 px-3.5 rounded-xl font-medium tracking-wide shadow-antigravity pointer-events-none">
            Chat with Astrologer
          </span>
        </motion.button>
      </div>

      {/* 🌌 Mini Chat Window Portal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50, x: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30, x: -10 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            className="fixed bottom-24 left-6 z-50 w-[90vw] sm:w-[380px] h-[500px] rounded-3xl border border-white/10 bg-slate-950/85 backdrop-blur-2xl shadow-antigravity overflow-hidden flex flex-col pointer-events-auto"
            style={{ boxShadow: '0 25px 60px rgba(99, 102, 241, 0.25)' }}
          >
            {/* Header branding */}
            <div className="relative px-5 py-4 bg-gradient-to-r from-indigo-950/50 via-slate-900/50 to-purple-950/50 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full border border-indigo-500/30 p-0.5 bg-indigo-950 shadow-glow">
                  <img 
                    src="/assets/astrologer.png?v=2" 
                    alt="Astrologer Kkarthikeya" 
                    className="w-full h-full object-cover rounded-full"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1">
                    Astro Kkarthikeya
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  </h3>
                  <span className="text-[10px] text-indigo-300 font-medium tracking-wide uppercase">Vedic Consultation Live</span>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 relative">
              {/* Stars Grid Background */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
              
              {/* Message loop */}
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.content}
                    <div className={`text-[8px] mt-1 text-right opacity-40`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input / Register Drawer */}
            <div className="p-4 border-t border-white/5 bg-slate-900/40 backdrop-blur-md">
              {currentUser ? (
                /* Regular Chat input */
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about career, love, Muhurtham..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-full py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-glow border border-indigo-400/20 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Mini gateway registration within chat widget */
                <form onSubmit={handleWidgetRegister} className="space-y-3">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">
                    Unlock Live User Session
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-300/40" />
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={regName}
                        onChange={(e) => { setRegName(e.target.value); setRegError(''); }}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-8 pr-2.5 text-xs text-white outline-none focus:border-indigo-500/50 transition-all"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-300/40" />
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        value={regPhone}
                        onChange={(e) => { setRegPhone(e.target.value); setRegError(''); }}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-8 pr-2.5 text-xs text-white outline-none focus:border-indigo-500/50 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {regError && (
                    <div className="text-red-400 text-[10px] text-center font-medium animate-pulse">{regError}</div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-glow border border-indigo-400/20 active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    Connect User <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* Bottom booking plug */}
              <div className="mt-3 text-center">
                <a 
                  href="/booking" 
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1 text-[10px] text-indigo-300 hover:text-white uppercase tracking-widest font-semibold hover:underline"
                >
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400/20" /> 
                  Book Full Audio Consultation 
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
