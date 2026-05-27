"use client";

import React, { useState, useEffect } from 'react';
import { Message } from '@/types';
import CosmicBackground from '@/components/CosmicBackground';
import AstrologerProfile from '@/components/AstrologerProfile';
import MessageList from '@/components/MessageList';
import InputCapsule from '@/components/InputCapsule';
import { Sparkles, Lock, ArrowLeft, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'init-1',
    sender: 'astrologer',
    type: 'text',
    content: "Greetings, user. The cosmos has aligned perfectly for our connection today. Please write your query below, and let the planetary insights guide you.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  }
];

const RESPONSES = [
  "Ah, I see. Mercury resides in your 10th house, suggesting that during the retrograde, you should reflect and reorganize rather than launch new initiatives.",
  "Your chart vibrates with Jupiter's expansion right now. It's an exceptional time for deep spiritual growth and learning.",
  "Interesting question. The Moon is entering Pisces tonight. Focus on your intuition and let it guide your decisions for the next 48 hours.",
  "The stellar flows indicate high energetic resonance in your relationships. Keep open channels for positive cosmic shifts."
];

function AstrologyChatPage() {
  const { currentUser, logoutUser, isOfflineMode, setCurrentUser } = useApp();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Chat locking states
  const [chatUnlocked, setChatUnlocked] = useState(false);
  const [firstMessageAt, setFirstMessageAt] = useState<string | null>(null);
  const [unlockedAt, setUnlockedAt] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // in seconds
  const isLocked = !chatUnlocked || (timeRemaining !== null && timeRemaining <= 0);
  const [pricingPlans, setPricingPlans] = useState<any>(null);

  // Review & Rating Bonus States
  const [claimedBonus, setClaimedBonus] = useState(false);
  const [showConfirmBonus, setShowConfirmBonus] = useState(false);
  const [ratingExpiresAt, setRatingExpiresAt] = useState<number | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isBonusSession, setIsBonusSession] = useState(false);
  // New state for claim bonus submission
  const [isSubmittingBonus, setIsSubmittingBonus] = useState(false);

  // Sync claimed review bonus status from localStorage on mount/user load
  useEffect(() => {
    if (currentUser) {
      const savedClaimed = localStorage.getItem(`astro_claimed_review_bonus_${currentUser.id}`);
      setClaimedBonus(savedClaimed === 'true');
    }
  }, [currentUser]);

  // Notify admin when this user enters the chat
  useEffect(() => {
    if (!currentUser || isOfflineMode) return;

    const channel = supabase.channel('admin_notifications');
    
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        channel.send({
          type: 'broadcast',
          event: 'user_entered_chat',
          payload: { user: currentUser }
        });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, isOfflineMode]);

  // Sync bonus session flag from current timer state
  useEffect(() => {
    if (currentUser && chatUnlocked) {
      const saved = localStorage.getItem(`astro_session_expiry_${currentUser.id}`);
      try {
        const parsed = saved ? JSON.parse(saved) : null;
        setIsBonusSession(!!parsed?.isBonus);
      } catch (e) {
        setIsBonusSession(false);
      }
    } else {
      setIsBonusSession(false);
    }
  }, [currentUser, chatUnlocked, unlockedAt]);

  const handleWriteReviewAndPrompt = () => {
    window.open("https://g.page/r/CUMI2zFm_hJiEBM/review", "_blank");
    setShowConfirmBonus(true);
  };

  const handleClaimBonus = async () => {
    if (!currentUser) return;
    setIsSubmittingBonus(true);
    try {
      const nowStr = new Date().toISOString();
      const expiryKey = `astro_session_expiry_${currentUser.id}`;
      const expiryTime = Date.now() + 2 * 60 * 1000; // 2 minutes (120s)

      // Store expiry time specifically as a bonus session
      localStorage.setItem(expiryKey, JSON.stringify({ unlockedAt: nowStr, expiryTime, isBonus: true }));
      localStorage.setItem(`astro_claimed_review_bonus_${currentUser.id}`, 'true');
      setClaimedBonus(true);
      setShowConfirmBonus(false);

      if (isOfflineMode) {
        setChatUnlocked(true);
        setUnlockedAt(nowStr);
      } else {
        // Update Supabase database
        const updatesUnlocked = { chat_unlocked: true, unlocked_at: nowStr };
        let { error } = await supabase
          .from('seekers')
          .update(updatesUnlocked)
          .eq('id', currentUser.id);

        if (error && (error.code === '42703' || error.message.includes('column') || error.message.includes('chat_unlocked'))) {
          const updatesUnblocked = { chat_unlocked: true, unlocked_at: nowStr };
          await supabase
            .from('seekers')
            .update(updatesUnblocked)
            .eq('id', currentUser.id);
        }

        // Optimistically set states
        setChatUnlocked(true);
        setUnlockedAt(nowStr);
      }
    } catch (err) {
      console.error("Failed to claim review bonus:", err);
      alert("Failed to activate bonus session. Please try again.");
    } finally {
      setIsSubmittingBonus(false);
    }
  };

  // Load pricing plans for dynamic fee representation
  useEffect(() => {
    fetch('/api/pricing')
      .then(res => res.json())
      .then(data => setPricingPlans(data))
      .catch(err => console.error("Failed to load pricing for chat lock:", err));
  }, []);

  // Fetch seeker database status and listen to updates in real time
  useEffect(() => {
    if (!currentUser) return;

    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('seekers')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (!error && data) {
          const freshFirstMsg = data.first_message_at;
          const freshUnlocked = data.chat_unlocked || false;
          const freshUnlockedAt = data.unlocked_at;

          setFirstMessageAt(freshFirstMsg);
          setChatUnlocked(freshUnlocked);
          setUnlockedAt(freshUnlockedAt);

          // Also sync app-wide context and localStorage
          setCurrentUser(prev => {
            if (prev && (prev.chatUnlocked !== freshUnlocked || prev.firstMessageAt !== freshFirstMsg || prev.unlockedAt !== freshUnlockedAt)) {
              const updated = {
                ...prev,
                firstMessageAt: freshFirstMsg,
                chatUnlocked: freshUnlocked,
                unlockedAt: freshUnlockedAt
              };
              localStorage.setItem('astro_active_user', JSON.stringify(updated));
              return updated;
            }
            return prev;
          });
        }
      } catch (err) {
        console.error("Failed to load seeker lock status:", err);
      }
    };

    fetchStatus();

    // Fallback polling: fetch status every 5 seconds in case Supabase Realtime replication is disabled
    const pollInterval = setInterval(fetchStatus, 5000);

    // Subscribe to changes on user record
    const channel = supabase
      .channel(`seeker_status_${currentUser.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'seekers',
        filter: `id=eq.${currentUser.id}`
      }, (payload) => {
        if (payload.new) {
          const freshFirstMsg = payload.new.first_message_at;
          const freshUnlocked = payload.new.chat_unlocked || false;
          const freshUnlockedAt = payload.new.unlocked_at;

          setFirstMessageAt(freshFirstMsg);
          setChatUnlocked(freshUnlocked);
          setUnlockedAt(freshUnlockedAt);

          setCurrentUser(prev => {
            if (prev) {
              const updated = {
                ...prev,
                firstMessageAt: freshFirstMsg,
                chatUnlocked: freshUnlocked,
                unlockedAt: freshUnlockedAt
              };
              localStorage.setItem('astro_active_user', JSON.stringify(updated));
              return updated;
            }
            return prev;
          });
        }
      })
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [currentUser, setCurrentUser]);

  // Initialize rating timer on first lock
  useEffect(() => {
    if (isLocked && currentUser) {
      const ratingKey = `astro_rating_shown_${currentUser.id}`;
      const alreadyRated = localStorage.getItem(ratingKey);
      if (!alreadyRated && !ratingExpiresAt) {
        // start 12‑minute rating window
        setRatingExpiresAt(Date.now() + 12 * 60 * 1000);
      }
    } else {
      // reset when session is unlocked again
      setRatingExpiresAt(null);
    }
  }, [isLocked, currentUser]);

  // Initialize or retrieve expiration time based on user's local clock to prevent admin/client clock skew
  useEffect(() => {
    if (!currentUser) return;

    const key = `astro_session_expiry_${currentUser.id}`;
    const saved = localStorage.getItem(key);
    let expiryTime = 0;

    try {
      const parsed = saved ? JSON.parse(saved) : null;
      if (!parsed || parsed.unlockedAt !== unlockedAt) {
        // First time seeing this unlock action: start a fresh 10 minutes from now
        expiryTime = Date.now() + 10 * 60 * 1000;
        localStorage.setItem(key, JSON.stringify({ unlockedAt, expiryTime }));
      } else {
        expiryTime = parsed.expiryTime;
      }
    } catch (e) {
      expiryTime = Date.now() + 10 * 60 * 1000;
      localStorage.setItem(key, JSON.stringify({ unlockedAt, expiryTime }));
    }

    // Early exit if not unlocked
    if (!chatUnlocked || !unlockedAt || !currentUser) {
      setTimeRemaining(null);
      if (currentUser) {
        localStorage.removeItem(`astro_session_expiry_${currentUser.id}`);
      }
      return; // exit effect
    }

    const updateTimer = () => {
      const now = Date.now();
      const remainingMs = expiryTime - now;

      if (remainingMs <= 0) {
        setTimeRemaining(0);
      } else {
        setTimeRemaining(Math.ceil(remainingMs / 1000));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [chatUnlocked, unlockedAt, currentUser]);


  // const isLocked moved above to avoid usage before declaration

  // Load and Subscribe to Chat Messages
  useEffect(() => {
    if (!currentUser) return;

    if (isOfflineMode) {
      setMessages(INITIAL_MESSAGES);
    } else {
      const fetchHistory = async () => {
        try {
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: true });

          if (error) throw error;

          if (data && data.length > 0) {
            const mapped: Message[] = data.map((msg: any) => ({
              id: msg.id,
              sender: msg.sender,
              type: msg.image_url ? 'image' : (msg.audio_duration ? 'audio' : 'text'),
              content: msg.content,
              imageUrl: msg.image_url,
              audioDuration: msg.audio_duration,
              timestamp: new Date(msg.created_at)
            }));
            setMessages(mapped);
          } else {
            setMessages(INITIAL_MESSAGES);

            await supabase.from('messages').insert([
              { user_id: currentUser.id, sender: 'astrologer', content: INITIAL_MESSAGES[0].content }
            ]);
          }
        } catch (err) {
          console.error("Failed to load chat history from Supabase:", err);
        }
      };

      fetchHistory();

      // Realtime subscription
      const channel = supabase
        .channel(`chat_${currentUser.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `user_id=eq.${currentUser.id}`
          },
          (payload) => {
            const newMsg = payload.new;
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, {
                id: newMsg.id,
                sender: newMsg.sender,
                type: newMsg.image_url ? 'image' : (newMsg.audio_duration ? 'audio' : 'text'),
                content: newMsg.content,
                imageUrl: newMsg.image_url,
                audioDuration: newMsg.audio_duration,
                timestamp: new Date(newMsg.created_at)
              }];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUser, isOfflineMode]);

  const simulateResponse = () => {
    setIsTyping(true);
    const randomDelay = Math.random() * 2000 + 2500;

    setTimeout(() => {
      const randomMsg = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
      const newMessage: Message = {
        id: `auto-${Date.now()}`,
        sender: 'astrologer',
        type: 'text',
        content: randomMsg,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(false);
    }, randomDelay);
  };

  const handleSendMessage = async (text: string) => {
    if (!currentUser) return;
    if (isLocked) return;

    if (isOfflineMode) {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        sender: 'user',
        type: 'text',
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      simulateResponse();
    } else {
      try {
        const { error } = await supabase
          .from('messages')
          .insert([{
            user_id: currentUser.id,
            sender: 'user',
            content: text
          }]);
        if (error) throw error;
      } catch (err) {
        console.error("Failed to insert message into Supabase:", err);
      }
    }
  };

  const handleSendAudio = async (duration: string) => {
    if (!currentUser) return;
    if (isLocked) return;

    if (isOfflineMode) {
      const audioMessage: Message = {
        id: `audio-${Date.now()}`,
        sender: 'user',
        type: 'audio',
        audioDuration: duration,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, audioMessage]);
      simulateResponse();
    } else {
      try {
        const { error } = await supabase
          .from('messages')
          .insert([{
            user_id: currentUser.id,
            sender: 'user',
            content: `Voice note message (${duration})`,
            audio_duration: duration
          }]);
        if (error) throw error;
      } catch (err) {
        console.error("Failed to send voice message to Supabase:", err);
      }
    }
  };

  const handleUploadSimulate = async () => {
    if (!currentUser) return;
    if (isLocked) return;

    if (isOfflineMode) {
      const imageMessage: Message = {
        id: `img-${Date.now()}`,
        sender: 'user',
        type: 'image',
        content: "Here are my details for a natal forecast:",
        imageUrl: '/assets/birth_chart.png',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, imageMessage]);

      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: `reply-${Date.now()}`,
          sender: 'astrologer',
          type: 'text',
          content: "I have channeled your birth alignments into my crystalline engine. A path emerges...",
          timestamp: new Date(),
        }]);
        setIsTyping(false);
      }, 3000);
    } else {
      try {
        const { error } = await supabase
          .from('messages')
          .insert([{
            user_id: currentUser.id,
            sender: 'user',
            content: "Consultation Chart Uploaded",
            image_url: '/assets/birth_chart.png'
          }]);
        if (error) throw error;
      } catch (err) {
        console.error("Failed to send image message to Supabase:", err);
      }
    }
  };


  if (!currentUser) return null; // Handled by AuthGuard

  const rawPriceStr = pricingPlans?.quick?.price || "₹99";

  /*
  html, body { 
    margin: 0; 
    background-color: #1b102e; 
    background-image: linear-gradient(135deg, #1B102E 0%, #2D1B4E 50%, #5B0F0F 100%); 
    background-attachment: fixed; 
    color: #f3f4f6; 
    font-family: var(--font-inter), system-ui, -apple-system, sans-serif; 
    min-height: 100vh; 
    overflow-x: hidden; 
    overflow-y: auto; 
    transition: background-color 0.4s ease, color 0.4s ease; 
  }
  */

  const priceNumeric = rawPriceStr.replace(/[^0-9]/g, '');

  return (
    <main className="relative min-h-screen -mt-20 w-full text-slate-100 overflow-hidden flex flex-col">
      <CosmicBackground />

      {/* Header Nav */}
      <header className="w-full border-b border-white/5 bg-slate-950/20 backdrop-blur-md px-6 py-4.5 z-10 flex items-center">
        <Link
          href="/"
          className="flex items-center gap-2 py-2 px-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-widest transition-all active:scale-95 duration-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:p-8 flex flex-col md:flex-row gap-6 items-stretch overflow-hidden h-[calc(100vh-73px)]">

        <AstrologerProfile className="hidden md:flex self-start max-h-full sticky top-0 shrink-0" />

        {/* Main Chat Bento */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex flex-col rounded-3xl border border-white/10 bg-slate-900/35 backdrop-blur-xl shadow-antigravity relative overflow-hidden max-h-full"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="md:hidden flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-slate-950/20">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-indigo-500/30 p-0.5 bg-indigo-950">
              <img src="/assets/astrologer.png?v=2" alt="Avatar" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1">
                Kkarthikeya<Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </h3>
              <span className="text-[10px] text-emerald-400">● Active Guide</span>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-between px-8 py-4 border-b border-white/5 text-xs text-indigo-200/60 bg-white/2 backdrop-blur-sm shrink-0">
            <span>Tethered session for {currentUser.username}</span>
            <div className="flex items-center gap-2 text-emerald-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Channel Est. {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <a href={`tel:${currentUser?.mobile || ''}`} className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 bg-white rounded-[20px] px-6 py-2">
                <Phone className="w-4 h-4" />
                Call
              </a>
            </div>
          </div>

          {/* Paid session active countdown banner */}
          {chatUnlocked && timeRemaining !== null && timeRemaining > 0 && (
            <div className={`border-b text-xs px-6 py-2.5 flex items-center justify-between shrink-0 font-mono ${isBonusSession ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'}`}>
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full animate-ping ${isBonusSession ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                {isBonusSession ? 'Review bonus free extension active. Remaining time:' : 'Paid consultation session active. Remaining time:'}
              </span>
              <span className={`font-bold px-2 py-0.5 rounded border ${isBonusSession ? 'text-amber-400 bg-amber-950/40 border-amber-500/25' : 'text-emerald-400 bg-emerald-950/40 border-emerald-500/25'}`}>
                {Math.floor(timeRemaining / 60)}m {timeRemaining % 60}s
              </span>
            </div>
          )}

          <>
            <MessageList messages={messages} isTyping={isTyping} />

            {isLocked ? (
              <div className="border-t border-white/10 bg-slate-950/70 backdrop-blur-xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 relative">
                <div className="absolute inset-0 bg-red-500/[0.02] pointer-events-none" />

                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                    <Lock className="w-3.5 h-3.5 animate-pulse" />
                    <span>Celestial Session Sealed</span>
                  </div>
                  <p className="text-[11px] text-slate-300 max-w-md leading-relaxed">
                    Your 10-minute session has expired. Scan the QR code or send payment to the UPI ID. Chat input will automatically restore once approved.
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1">
                    <span className="text-xs text-slate-400 font-bold">FEE: <span className="text-amber-400 font-serif text-sm font-black">{pricingPlans?.quick?.price || "₹99"}</span></span>
                    <span className="text-[10px] text-slate-500">|</span>
                    <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-xl border border-white/5">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">UPI:</span>
                      <span className="text-[10px] font-mono text-indigo-300 font-bold select-all">princekarthi111-2@okaxis</span>
                    </div>
                  </div>

                  {/* Rating / Review Buttons */}
                  <div className="flex flex-col items-center md:items-start gap-2">
                    {/* Rating button appears only on first lock */}
                    {(!localStorage.getItem(`astro_rating_shown_${currentUser?.id}`) && ratingExpiresAt) && (
                      <button
                        onClick={() => {
                          localStorage.setItem(`astro_rating_shown_${currentUser?.id}`, 'true');
                          setShowRatingModal(true);
                        }}
                        className="px-4 py-2 rounded-full bg-amber-500 text-slate-900 font-semibold hover:bg-amber-600 transition text-[10px]"
                      >
                        Give Feedback ({Math.max(0, Math.ceil((ratingExpiresAt - Date.now()) / 1000))}s)
                      </button>
                    )}
                    {/* Review button appears after rating has been submitted */}
                    {localStorage.getItem(`astro_rating_shown_${currentUser?.id}`) && (
                      <button
                        onClick={() => window.open('https://g.page/r/CUMI2zFm_hJiEBM/review', '_blank')}
                        className="px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition text-[10px]"
                      >
                        Review
                      </button>
                    )}
                  </div>

                  {/* Warm gold glow */}
                  {showRatingModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                      <div className="bg-slate-900 rounded-2xl p-6 w-96 shadow-lg border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4">Thank you for your feedback</h3>
                        <p className="text-sm text-slate-300 mb-4">Your rating has been recorded.</p>
                        <button
                          onClick={() => setShowRatingModal(false)}
                          className="mt-2 w-full py-2 rounded bg-emerald-600 text-white hover:bg-emerald-500 transition"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Google Review Bonus Section */}
                  {!claimedBonus && (
                    <div className="mt-4 p-3 rounded-2xl border border-amber-500/20 bg-amber-950/20 text-left max-w-md">
                      <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        Claim 2 Minutes Free Chat!
                      </div>
                      <p className="text-[9.5px] text-slate-300 leading-normal mt-1">
                        Submit a review and rating on our Google Business Profile to unlock a one-time 2-minute free extension instantly.
                      </p>

                      <div className="mt-2.5">
                        {showConfirmBonus ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleClaimBonus}
                              disabled={isSubmittingBonus}
                              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider transition-colors duration-200"
                            >
                              {isSubmittingBonus ? 'Unlocking...' : 'Yes, I submitted review'}
                            </button>
                            <button
                              onClick={() => setShowConfirmBonus(false)}
                              className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 text-[10px] font-bold uppercase transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={handleWriteReviewAndPrompt}
                            className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-[9.5px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1"
                          >
                            Write Google Review & Claim Bonus
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-2 shrink-0">
                  {/* QR Code */}
                  <div className="w-28 h-28 bg-white p-1.5 rounded-xl border border-white/10 shadow-inner flex items-center justify-center overflow-hidden">
                    <img
                      src="/assets/qr.jpeg"
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[8px] text-amber-300 font-mono tracking-widest uppercase animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Awaiting Approval...
                  </div>
                </div>
              </div>
            ) : (
              <InputCapsule
                onSendMessage={handleSendMessage}
                onSendAudio={handleSendAudio}
                onUploadClick={handleUploadSimulate}
              />
            )}
          </>
        </motion.div>
      </div>
    </main>
  );
}

export default function ProtectedChatPage() {
  return (
    <AuthGuard>
      <AstrologyChatPage />
    </AuthGuard>
  );
}
