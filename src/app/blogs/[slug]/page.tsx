"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useApp } from '@/context/AppContext';
import CosmicBackground from '@/components/CosmicBackground';

interface Blog {
  id: string;
  title: string;
  slug: string;
  keyword: string;
  image_url: string;
  image_alt?: string;
  meta_description: string;
  content: string;
  created_at: string;
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  // Next.js 15+ passes params as a Promise, so we unwrap it safely
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const { slug } = resolvedParams;
  
  const { isOfflineMode } = useApp();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        if (isOfflineMode) {
          const stored = JSON.parse(localStorage.getItem('astro_blogs') || '[]');
          const found = stored.find((b: Blog) => b.slug === slug);
          if (found) setBlog(found);
        } else {
          const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('slug', slug)
            .single();
          
          if (error && error.code !== 'PGRST116') throw error;
          if (data) setBlog(data);
        }
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [slug, isOfflineMode]);

  // Set document title dynamically
  useEffect(() => {
    if (blog) {
      document.title = `${blog.title} | Kkarthikeya Astrology`;
    }
  }, [blog]);

  if (loading) {
    return (
      <main className="relative min-h-screen w-full text-slate-100 overflow-x-hidden flex flex-col selection:bg-amber-500/30">
        <CosmicBackground />
        <div className="flex-1 flex justify-center py-32 relative z-10">
          <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  if (!blog) {
    return notFound();
  }

  return (
    <main className="relative min-h-screen w-full text-slate-100 overflow-x-hidden flex flex-col selection:bg-amber-500/30">
      <CosmicBackground />
      
      <article className="flex-1 w-full max-w-4xl mx-auto px-6 pt-6 md:pt-8 pb-12 md:pb-20 relative z-10">
        
        <Link 
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-amber-400 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all articles
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            <span className="flex items-center gap-1.5 bg-slate-900/40 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            {blog.keyword && (
              <span className="bg-amber-950/20 text-amber-300 px-3 py-1.5 rounded-full border border-amber-500/20">
                {blog.keyword}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-8 drop-shadow-lg">
            {blog.title}
          </h1>

          <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 mb-12 border border-white/10 bg-white p-1">
            <img 
              src={blog.image_url || '/icon.jpg'} 
              alt={blog.image_alt || blog.title}
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => { (e.target as HTMLImageElement).src = '/icon.jpg' }}
            />
          </div>
        </header>

        <div className="prose prose-lg prose-invert max-w-none">
          {blog.content.split('\n').map((line, idx) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('# ')) {
              return <h1 key={idx} className="text-3xl md:text-4xl font-serif text-white mt-12 mb-6">{trimmed.replace(/^# /, '')}</h1>;
            } else if (trimmed.startsWith('## ')) {
              return <h2 key={idx} className="text-2xl md:text-3xl font-serif text-white mt-10 mb-4">{trimmed.replace(/^## /, '')}</h2>;
            } else if (trimmed.startsWith('### ')) {
              return <h3 key={idx} className="text-xl md:text-2xl font-serif text-white mt-8 mb-3">{trimmed.replace(/^### /, '')}</h3>;
            } else if (trimmed.startsWith('#### ')) {
              return <h4 key={idx} className="text-lg md:text-xl font-serif text-white mt-6 mb-2">{trimmed.replace(/^#### /, '')}</h4>;
            } else if (trimmed.startsWith('##### ')) {
              return <h5 key={idx} className="text-base md:text-lg font-bold text-white mt-4 mb-2">{trimmed.replace(/^##### /, '')}</h5>;
            } else if (trimmed.startsWith('###### ')) {
              return <h6 key={idx} className="text-sm md:text-base font-bold text-slate-400 mt-4 mb-2 uppercase tracking-wide">{trimmed.replace(/^###### /, '')}</h6>;
            } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              return (
                <ul key={idx} className="list-none text-slate-300 leading-relaxed mb-2 pl-2">
                  <li className="relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-amber-500 before:rounded-full">
                    {trimmed.replace(/^[-*] /, '')}
                  </li>
                </ul>
              );
            } else if (trimmed === '') {
              return <div key={idx} className="h-4"></div>;
            } else {
              return <p key={idx} className="text-slate-300 leading-relaxed mb-4">{trimmed}</p>;
            }
          })}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
          <div className="text-slate-400 font-medium">
            Written by <strong className="text-white">Kkarthikeya Admin</strong>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/40 backdrop-blur-md border border-white/10 hover:border-amber-500/50 hover:text-amber-400 text-slate-300 rounded-full text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <Share2 className="w-4 h-4" /> Share Article
          </button>
        </div>

      </article>
    </main>
  );
}
