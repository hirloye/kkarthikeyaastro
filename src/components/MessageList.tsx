"use client";

import React, { useEffect, useRef } from 'react';
import { Message } from '@/types';
import MessageBubble from './MessageBubble';
import { AnimatePresence, motion } from 'framer-motion';

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
}

export default function MessageList({ messages, isTyping = false }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll functionality
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-1">
      <AnimatePresence mode="popLayout">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-start mb-4 animate-float-medium"
          >
            <div className="rounded-3xl rounded-tl-lg px-6 py-4 border border-indigo-500/10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl text-slate-100 flex items-center gap-1.5 shadow-antigravity">
              <span className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div ref={bottomRef} />
    </div>
  );
}
