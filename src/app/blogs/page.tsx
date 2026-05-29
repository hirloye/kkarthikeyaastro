"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useApp } from '@/context/AppContext';
import CosmicBackground from '@/components/CosmicBackground';

interface Blog {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  meta_description: string;
  created_at: string;
}

export default function BlogsPage() {
  const { isOfflineMode } = useApp();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        if (isOfflineMode) {
          const stored = JSON.parse(localStorage.getItem('astro_blogs') || '[]');
          setBlogs(stored);
        } else {
          const { data, error } = await supabase
            .from('blogs')
            .select('id, title, slug, image_url, meta_description, created_at')
            .order('created_at', { ascending: false });

          if (error) throw error;
          setBlogs(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, [isOfflineMode]);

  return (
    <main className="relative min-h-screen w-full text-slate-100 overflow-x-hidden flex flex-col selection:bg-amber-500/30">
      <CosmicBackground />
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 pt-6 pb-12 md:pt-8 md:pb-20 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-950/20 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <BookOpen className="w-4 h-4" />
            Cosmic Insights
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-white mb-6"
          >
            Astrological Journal & Wisdom
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-lg"
          >
            Explore our collection of deep celestial insights, transit updates, and spiritual remedies to guide your path.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-transparent backdrop-blur-md shadow-inner">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">No Articles Yet</h3>
            <p className="text-slate-400 mt-2">Check back soon for cosmic insights and updates.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col bg-white backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-inner hover:bg-transparent hover:border-amber-500 transition-all duration-300"
              >
                <Link href={`/blogs/${blog.slug}`} className="block relative h-56 overflow-hidden bg-white p-2 border border-white/5">
                  <img
                    src={blog.image_url || '/assets/icon.jpg'}
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/icon.jpg' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>

                  <Link href={`/blogs/${blog.slug}`}>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                  </Link>

                  <p className="text-slate-300 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                    {blog.meta_description}
                  </p>

                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors mt-auto"
                  >
                    Read Full Article <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
