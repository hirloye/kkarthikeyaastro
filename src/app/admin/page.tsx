"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Orbit, Shield, ArrowLeft, Users, Activity, Server,
  Compass, Calendar, MessageSquare, Phone, Sparkles,
  Lock, Key, Send, CheckCircle2, RefreshCw, Mail, DollarSign, LogOut, Trash2, FileText, Menu, X, Eye, EyeOff
} from 'lucide-react';
import CosmicBackground from '@/components/CosmicBackground';
import { useApp, UserData } from '@/context/AppContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

const getClientStatus = (user: UserData) => {
  if (!user.chatUnlocked) {
    return { text: "Locked", color: "text-red-400 border-red-500/20 bg-red-500/5", isLocked: true };
  } else {
    // Check paid expiration (10 minutes from unlockedAt)
    if (!user.unlockedAt) {
      return { text: "Locked", color: "text-red-400 border-red-500/20 bg-red-500/5", isLocked: true };
    }
    const elapsedMs = Date.now() - new Date(user.unlockedAt).getTime();
    const remainingMs = 10 * 60 * 1000 - elapsedMs;
    if (remainingMs <= 0) {
      return { text: "Locked (Expired)", color: "text-red-400 border-red-500/20 bg-red-500/5", isLocked: true };
    }
    const mins = Math.ceil(remainingMs / (60 * 1000));
    return { text: `Active (${mins}m left)`, color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/20", isLocked: false };
  }
};

export default function AdminDashboard() {
  const { allUsers, isOfflineMode, deleteUser, setAllUsers } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'chat' | 'pricing' | 'blog-list' | 'blog-upload'>('users');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showChatSidebar, setShowChatSidebar] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Presence state
  const [isManualOffline, setIsManualOffline] = useState(false);
  const [offlineUntil, setOfflineUntil] = useState<Date | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('astro_admin_presence');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.isManualOffline) {
          setIsManualOffline(true);
          if (parsed.offlineUntil) {
            setOfflineUntil(new Date(parsed.offlineUntil));
          }
        }
      } catch (e) {}
    }
  }, []);

  const updateAdminPresence = (offline: boolean, untilDate: Date | null) => {
    setIsManualOffline(offline);
    setOfflineUntil(untilDate);
    localStorage.setItem('astro_admin_presence', JSON.stringify({
      isManualOffline: offline,
      offlineUntil: untilDate ? untilDate.toISOString() : null
    }));
  };

  // Auth state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Blog Manager State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogKeyword, setBlogKeyword] = useState('');
  const [blogImageUrl, setBlogImageUrl] = useState('');
  const [blogImageAlt, setBlogImageAlt] = useState('');
  const [blogMetaDescription, setBlogMetaDescription] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [isSubmittingBlog, setIsSubmittingBlog] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [existingBlogs, setExistingBlogs] = useState<any[]>([]);

  // Client List Query state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);

  // Pricing edit states
  const [pricingPlans, setPricingPlans] = useState<any>(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingSuccess, setPricingSuccess] = useState(false);

  // Chat panel states
  const [selectedClient, setSelectedClient] = useState<UserData | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [adminTimeRemaining, setAdminTimeRemaining] = useState<number | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove the client "${name}" from the database? This will clear all their registration records.`)) {
      return;
    }

    setIsDeleting(userId);
    try {
      await deleteUser(userId);
      // If we were chatting with this client, clear selection
      if (selectedClient?.id === userId) {
        setSelectedClient(null);
        setChatMessages([]);
      }
    } catch (err: any) {
      alert(`Failed to delete client: ${err.message || err}`);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleChatUnlock = async (user: UserData) => {
    const status = getClientStatus(user);
    const shouldUnlock = status.isLocked;

    const nowStr = new Date().toISOString();
    const epochStr = new Date(0).toISOString();

    try {
      // Attempt updating the chat_unlocked column first
      const updatesUnlocked = shouldUnlock
        ? { chat_unlocked: true, unlocked_at: nowStr }
        : { chat_unlocked: false, unlocked_at: epochStr };

      let { error } = await supabase
        .from('seekers')
        .update(updatesUnlocked)
        .eq('id', user.id);

      // Fallback if chat_unlocked column does not exist (Postgres error code 42703 or column error text)
      if (error && (error.code === '42703' || error.message.includes('column') || error.message.includes('chat_unlocked'))) {
        const updatesUnblocked = shouldUnlock
          ? { chat_unblocked: true, unlocked_at: nowStr }
          : { chat_unblocked: false, unlocked_at: epochStr };

        const fallbackResult = await supabase
          .from('seekers')
          .update(updatesUnblocked)
          .eq('id', user.id);

        if (fallbackResult.error) throw fallbackResult.error;
      } else if (error) {
        throw error;
      }

      // Update in-memory allUsers list
      setAllUsers((prev) =>
        prev.map((u) => (u.id === user.id ? {
          ...u,
          chatUnlocked: shouldUnlock,
          unlockedAt: shouldUnlock ? nowStr : epochStr
        } : u))
      );

      // If we are currently chatting with this user, update selectedClient too
      if (selectedClient?.id === user.id) {
        setSelectedClient((prev) => (prev ? {
          ...prev,
          chatUnlocked: shouldUnlock,
          unlockedAt: shouldUnlock ? nowStr : epochStr
        } : null));
      }
    } catch (err: any) {
      alert(`Failed to update lock status: ${err.message || err}`);
    }
  };

  // Auto-scroll chats
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Auth persistence check
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('astro_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  // Filter users table
  useEffect(() => {
    setFilteredUsers(
      allUsers.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.mobile.includes(searchQuery) ||
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [allUsers, searchQuery]);

  // Load prices in admin
  useEffect(() => {
    if (!isAuthorized) return;
    fetch('/api/pricing')
      .then(res => res.json())
      .then(data => setPricingPlans(data))
      .catch(err => console.error("Failed to load dynamic pricing in admin:", err));
  }, [isAuthorized]);

  // Real-time Notification for New Users
  useEffect(() => {
    if (!isAuthorized || isOfflineMode) return;

    // Request native notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const channel = supabase
      .channel('admin_new_users')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'seekers'
        },
        (payload) => {
          const newUser = payload.new;
          const msg = `New client registered: ${newUser.name || 'Unknown'}`;

          // Native Browser Notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Registration', {
              body: msg,
              icon: '/assets/KK_Logo.webp'
            });
          } else {
            // Fallback
            toast.success(msg);
          }

          // Optionally, add to allUsers list so it shows up instantly without refresh
          setAllUsers((prev) => {
            if (prev.some(u => u.id === newUser.id)) return prev;
            return [{
              id: newUser.id,
              username: newUser.name,
              mobile: newUser.phone,
              email: newUser.email?.split('|')[0] || '',
              dob: newUser.email?.split('|')[1] || '',
              tob: newUser.email?.split('|')[2] || '',
              pob: newUser.email?.split('|')[3] || '',
              registeredAt: newUser.registered_at,
              firstMessageAt: newUser.first_message_at,
              chatUnlocked: newUser.chat_unlocked || false,
              unlockedAt: newUser.unlocked_at
            }, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthorized, isOfflineMode, setAllUsers]);

  // Listen for user entered chat broadcast
  useEffect(() => {
    if (!isAuthorized || isOfflineMode) return;

    const channel = supabase.channel('admin_notifications');
    channel.on(
      'broadcast',
      { event: 'user_entered_chat' },
      (payload) => {
        const user = payload.payload.user;
        const msg = `${user.username || 'A client'} entered the chat.\nDOB: ${user.dob || 'N/A'} | TOB: ${user.tob || 'N/A'} | Place: ${user.pob || 'N/A'}`;

        // Native Browser Notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Client Active', {
            body: msg,
            icon: '/assets/KK_Logo.webp'
          });
        } else {
          toast(msg, { icon: '👀' });
        }
      }
    ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthorized, isOfflineMode]);

  // Track Astrologer Presence
  useEffect(() => {
    if (!isAuthorized) return;

    const channel = supabase.channel('astrologer_status');

    channel
      .on('presence', { event: 'sync' }, () => {})
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            role: 'admin',
            isOffline: isOfflineMode || isManualOffline,
            offlineUntil: offlineUntil ? offlineUntil.toISOString() : null,
            talkingTo: selectedClient?.id || null
          });
        }
      });

    // Update presence when dependencies change
    const updatePresence = async () => {
      if (channel.state === 'joined') {
        await channel.track({
          role: 'admin',
          isOffline: isOfflineMode || isManualOffline,
          offlineUntil: offlineUntil ? offlineUntil.toISOString() : null,
          talkingTo: selectedClient?.id || null
        });
      }
    };
    updatePresence();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthorized, isOfflineMode, isManualOffline, offlineUntil, selectedClient?.id]);

  // Admin Countdown Timer for Selected Client
  useEffect(() => {
    if (!selectedClient || !selectedClient.chatUnlocked || !selectedClient.unlockedAt) {
      setAdminTimeRemaining(null);
      return;
    }
    const unlockedTimeMs = new Date(selectedClient.unlockedAt).getTime();
    // Default to 10 minutes
    const expiryTime = unlockedTimeMs + 10 * 60 * 1000;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setAdminTimeRemaining(remaining);
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    // Initial set
    setAdminTimeRemaining(Math.max(0, Math.floor((expiryTime - Date.now()) / 1000)));

    return () => clearInterval(interval);
  }, [selectedClient?.id, selectedClient?.chatUnlocked, selectedClient?.unlockedAt]);

  // Keep a ref to allUsers for the message listener to avoid constant re-subscriptions
  const allUsersRef = useRef<UserData[]>(allUsers);
  useEffect(() => {
    allUsersRef.current = allUsers;
  }, [allUsers]);

  // Global listener for new chat messages from users
  useEffect(() => {
    if (!isAuthorized || isOfflineMode) return;

    const channel = supabase
      .channel('admin_global_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: "sender=eq.user" // Only trigger for messages from 'user'
        },
        (payload) => {
          const newMsg = payload.new;

          // Don't notify if the admin is currently chatting with this user
          if (selectedClient && selectedClient.id === newMsg.user_id) return;

          const user = allUsersRef.current.find(u => u.id === newMsg.user_id);
          const name = user ? user.username : 'A client';
          const msgText = newMsg.content || 'Sent an attachment';

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`New message from ${name}`, {
              body: msgText,
              icon: '/assets/KK_Logo.webp'
            });
          } else {
            toast(`New message from ${name}`, { icon: '💬' });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthorized, isOfflineMode, selectedClient]);

  // Real-time Chat Sync for Selected Client
  useEffect(() => {
    if (!isAuthorized || !selectedClient) return;

    if (isOfflineMode) {
      // Mock chat database sync
      const mockHistory = [
        { id: 'm1', sender: 'astrologer', content: `Greetings, ${selectedClient.username}. How may the cosmic guides assist you today?`, created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
        { id: 'm2', sender: 'user', content: "Namaste guruji, I wanted to understand my Jupiter transits for this year.", created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() }
      ];
      setChatMessages(mockHistory);
    } else {
      // Query messages from Supabase
      const fetchHistory = async () => {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', selectedClient.id)
          .order('created_at', { ascending: true });

        if (!error && data) {
          setChatMessages(data);
        }
      };

      fetchHistory();

      // Subscribe to this client's chat thread
      const channel = supabase
        .channel(`admin_chat_thread_${selectedClient.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `user_id=eq.${selectedClient.id}`
          },
          (payload) => {
            const newMsg = payload.new;
            setChatMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedClient, isAuthorized, isOfflineMode]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === 'kkarthikeya' && passwordInput === 'astrotalk2026@') {
      setIsAuthorized(true);
      sessionStorage.setItem('astro_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid secret keys. Planetary access denied.');
    }
  };

  const handleAdminLogout = () => {
    setIsAuthorized(false);
    sessionStorage.removeItem('astro_admin_auth');
  };

  const handlePriceChange = (planId: string, field: string, val: string) => {
    setPricingPlans((prev: any) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [field]: val
      }
    }));
  };

  const handleSavePrices = async () => {
    setPricingLoading(true);
    setPricingSuccess(false);
    try {
      const res = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricingPlans)
      });
      const data = await res.json();
      if (data.success) {
        setPricingSuccess(true);
        setTimeout(() => setPricingSuccess(false), 2500);
      } else {
        alert("Plan saving sync failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server API connection error.");
    } finally {
      setPricingLoading(false);
    }
  };

  const fetchExistingBlogs = async () => {
    try {
      if (isOfflineMode) {
        const stored = JSON.parse(localStorage.getItem('astro_blogs') || '[]');
        setExistingBlogs(stored);
      } else {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setExistingBlogs(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'blog-list') {
      fetchExistingBlogs();
    }
  }, [activeTab, isOfflineMode]);

  const handleEditBlog = (blog: any) => {
    setEditingBlogId(blog.id);
    setBlogTitle(blog.title);
    setBlogSlug(blog.slug);
    setBlogKeyword(blog.keyword || '');
    setBlogImageUrl(blog.image_url || '');
    setBlogImageAlt(blog.image_alt || '');
    setBlogMetaDescription(blog.meta_description || '');
    setBlogContent(blog.content || '');
    setBlogImageFile(null);
    setActiveTab('blog-upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      if (isOfflineMode) {
        const stored = JSON.parse(localStorage.getItem('astro_blogs') || '[]');
        const updated = stored.filter((b: any) => b.id !== id);
        localStorage.setItem('astro_blogs', JSON.stringify(updated));
        setExistingBlogs(updated);
      } else {
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (error) throw error;
        setExistingBlogs((prev) => prev.filter((b) => b.id !== id));
      }
      toast.success("Blog deleted successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to delete blog: ${err.message || 'Unknown error'}`);
    }
  };

  const resetBlogForm = () => {
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogSlug('');
    setBlogKeyword('');
    setBlogImageUrl('');
    setBlogImageAlt('');
    setBlogImageFile(null);
    setBlogMetaDescription('');
    setBlogContent('');
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBlog(true);

    let finalImageUrl = blogImageUrl;

    try {
      if (blogImageFile) {
        if (isOfflineMode) {
          // Convert to base64 for local storage
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blogImageFile);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });
          finalImageUrl = base64;
        } else {
          // Upload to Supabase Storage
          const fileExt = blogImageFile.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('blog-images')
            .upload(fileName, blogImageFile);

          if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

          // Get public URL
          const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
          finalImageUrl = data.publicUrl;
        }
      }

      const blogData = {
        title: blogTitle,
        slug: blogSlug,
        keyword: blogKeyword,
        image_url: finalImageUrl,
        image_alt: blogImageAlt,
        meta_description: blogMetaDescription,
        content: blogContent
      };

      if (isOfflineMode) {
        const stored = JSON.parse(localStorage.getItem('astro_blogs') || '[]');
        if (editingBlogId) {
          const updated = stored.map((b: any) => b.id === editingBlogId ? { ...b, ...blogData } : b);
          localStorage.setItem('astro_blogs', JSON.stringify(updated));
        } else {
          const newBlog = { id: crypto.randomUUID(), ...blogData, created_at: new Date().toISOString() };
          localStorage.setItem('astro_blogs', JSON.stringify([newBlog, ...stored]));
        }
      } else {
        if (editingBlogId) {
          const { error } = await supabase.from('blogs').update(blogData).eq('id', editingBlogId);
          if (error) throw error;
        } else {
          const newBlog = { id: crypto.randomUUID(), ...blogData, created_at: new Date().toISOString() };
          const { error } = await supabase.from('blogs').insert([newBlog]);
          if (error) throw error;
        }
      }

      toast.success(`Blog ${editingBlogId ? 'updated' : 'published'} successfully!`);
      resetBlogForm();
      fetchExistingBlogs();
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to publish blog: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmittingBlog(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedClient) return;

    setIsSending(true);
    const textToSend = replyText.trim();
    setReplyText('');

    if (isOfflineMode) {
      const newMsg = {
        id: `mock-admin-${Date.now()}`,
        sender: 'astrologer',
        content: textToSend,
        created_at: new Date().toISOString()
      };
      setChatMessages((prev) => [...prev, newMsg]);
      setIsSending(false);

      // Auto reply mock
      setTimeout(() => {
        setChatMessages((prev) => [...prev, {
          id: `mock-user-${Date.now()}`,
          sender: 'user',
          content: "Thank you for clarifying my coordinates, guruji. I shall follow the remedies.",
          created_at: new Date().toISOString()
        }]);
      }, 2000);
    } else {
      try {
        const { error } = await supabase
          .from('messages')
          .insert([{
            user_id: selectedClient.id,
            sender: 'astrologer',
            content: textToSend
          }]);

        if (error) throw error;
      } catch (err) {
        console.error("Failed to send reply to Supabase:", err);
      } finally {
        setIsSending(false);
      }
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${d.toLocaleDateString()} @ ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // RENDER GATEWAY LOGIN IF NOT LOGGED IN
  if (!isAuthorized) {
    return (
      <main className="fixed inset-0 w-full h-full flex flex-col items-center justify-center text-slate-100 overflow-hidden bg-slate-950 z-[100] px-6">
        <CosmicBackground />

        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-md w-full rounded-3rem border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 shadow-antigravity relative overflow-hidden z-10 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-6 shadow-glow">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-xl md:text-2xl font-bold font-serif text-white uppercase tracking-wider">
            Vedic Admin Portal
          </h1>
          <p className="text-xs text-indigo-300/60 mt-1 max-w-xs mx-auto leading-relaxed">
            Enter astrological secure frequency credentials to sync control systems.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4.5 mt-8">
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block ml-1">Admin Username</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Name: kkarthikeya"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-xs text-white placeholder-slate-600 outline-none focus:border-amber-500/35 transition-all shadow-inner"
                required
              />
            </div>

            <div className="space-y-1.5 text-left relative">
              <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block ml-1">Secure Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-4 pr-12 text-xs text-white placeholder-slate-600 outline-none focus:border-amber-500/35 transition-all shadow-inner font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs font-semibold mt-2">{loginError}</motion.p>
            )}

            <button
              type="submit"
              className="w-full mt-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-widest shadow-glow active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Unlock Terminal <Key className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 border-t border-white/5 pt-4 text-center">
            <Link href="/" className="inline-flex items-center gap-1 text-[10px] text-indigo-300 font-semibold uppercase hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Sanctuary
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  // RENDER DYNAMIC DASHBOARD PORTAL
  return (
    <main className="relative min-h-screen w-full text-slate-100 flex flex-col -mt-20">

      {/* Admin Global Header (Sticky Top) */}
      <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Brand & Mobile Toggle Row */}
          <div className="flex items-center justify-between w-full md:w-auto px-1 md:px-0">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold text-white uppercase tracking-widest font-serif">Admin Portal</span>
              {typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted' && (
                <button 
                  onClick={() => Notification.requestPermission()}
                  className="ml-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 rounded-full text-[10px] font-bold uppercase"
                >
                  Enable Alerts
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-400 hover:text-white bg-white/5 p-1.5 rounded-lg border border-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop & Mobile Dropdown Tabs */}
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-2 mt-2 md:mt-0 w-full md:w-auto flex-1 md:justify-center`}>
            {[
              { id: 'users', label: 'Client Logs', icon: Users },
              { id: 'chat', label: 'Realtime Chat', icon: MessageSquare },
              { id: 'pricing', label: 'Fee Charges', icon: DollarSign },
              { id: 'blog-list', label: 'List of blogs', icon: FileText },
              { id: 'blog-upload', label: 'Upload Blog', icon: Sparkles }
            ].map((tab) => {
              const isTabActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-center gap-2.5 py-3 md:py-2 px-4 rounded-xl transition-all text-[11px] md:text-xs font-black uppercase tracking-widest ${isTabActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-glow border border-amber-400/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 border border-transparent'
                    }`}
                >
                  <tab.icon className={`w-4 h-4 ${isTabActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Admin Presence Controls */}
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex items-center gap-2 mt-2 md:mt-0 flex-col md:flex-row w-full md:w-auto`}>
            <button
              onClick={() => updateAdminPresence(!isManualOffline, null)}
              className={`flex items-center justify-center gap-2 px-4 py-2 md:py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all w-full md:w-auto ${
                !isManualOffline 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-glow' 
                  : 'bg-slate-800 text-slate-400 border-white/10 hover:bg-slate-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${!isManualOffline ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              {!isManualOffline ? 'Online' : 'Offline'}
            </button>

            {isManualOffline && (
              <select
                onChange={(e) => {
                  const minutes = parseInt(e.target.value);
                  if (minutes === 0) {
                    updateAdminPresence(true, null);
                  } else {
                    updateAdminPresence(true, new Date(Date.now() + minutes * 60000));
                  }
                }}
                className="bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-[10px] rounded-xl px-2 py-2.5 outline-none uppercase font-bold tracking-widest w-full md:w-auto"
                value={offlineUntil ? Math.max(30, Math.round((offlineUntil.getTime() - Date.now()) / 60000)) : 0}
              >
                <option value="0">Not Available</option>
                <option value="30">Back in 30 Min</option>
                <option value="60">Back in 1 Hr</option>
                <option value="90">Back in 1.5 Hr</option>
                <option value="120">Back in 2 Hr</option>
                <option value="150">Back in 2.5 Hr</option>
                <option value="180">Back in 3 Hr</option>
                <option value="210">Back in 3.5 Hr</option>
                <option value="240">Back in 4 Hr</option>
              </select>
            )}
          </div>

          {/* Logout Button */}
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex mt-2 md:mt-0 pt-3 md:pt-0 border-t border-white/10 md:border-none w-full md:w-auto justify-center`}>
            <button
              onClick={handleAdminLogout}
              className="flex items-center justify-center gap-2 py-2.5 md:py-2 px-4 md:px-5 rounded-xl border border-white/10 md:border-transparent bg-white/5 md:bg-red-500/10 md:hover:bg-red-500/20 md:text-red-400 text-slate-300 hover:text-white md:hover:text-red-300 transition-all active:scale-95 text-xs font-bold uppercase tracking-widest w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Controller Grid */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-6">

        {/* Tab Display Area */}
        <div>

          <AnimatePresence mode="wait">

            {/* 1. CLIENT LOGS */}
            {activeTab === 'users' && (
              <motion.div
                key="users-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-5"
              >
                {/* Statistics bento panel */}
                <div className="flex gap-4 shrink-0">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Total Clients</div>
                      <div className="text-xl font-bold text-white font-serif">{allUsers.length}</div>
                    </div>
                  </div>
                </div>

                {/* Table Bento Container */}
                <div className="rounded-3rem border border-white/10 bg-slate-900/30 backdrop-blur-2xl p-6 md:p-8 shadow-antigravity flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
                    <div>
                      <h2 className="text-lg font-bold font-serif text-white uppercase tracking-widest flex items-center gap-2">
                        Registered Clients Log
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">Database audit log of client connections.</p>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        placeholder="Search name, phone, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-4.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/20">
                    <table className="w-full text-left border-collapse min-w-[850px]">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/2 text-[9px] font-black uppercase tracking-widest text-slate-400 sticky top-0 backdrop-blur-md">
                          <th className="px-6 py-4">ID Reference</th>
                          <th className="px-6 py-4">Client</th>
                          <th className="px-6 py-4">Phone Frequency</th>
                          <th className="px-6 py-4">Email Address</th>
                          <th className="px-6 py-4">Chat Status</th>
                          <th className="px-6 py-4">Registered Date</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-white/5">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-white/2 transition-colors">
                              <td className="px-6 py-4 font-mono text-[10px] text-indigo-400/70">
                                #{user.id.slice(0, 8)}
                              </td>
                              <td className="px-6 py-4 font-semibold text-white">
                                {user.username}
                              </td>
                              <td className="px-6 py-4 text-slate-300 font-mono">
                                {user.mobile}
                              </td>
                              <td className="px-6 py-4 text-indigo-200/80">
                                {user.email || "n/a"}
                              </td>
                              <td className="px-6 py-4">
                                {(() => {
                                  const status = getClientStatus(user);
                                  return (
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase ${status.color}`}>
                                      {status.text}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className="px-6 py-4 text-slate-400">
                                {formatDate(user.registeredAt)}
                              </td>
                              <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleToggleChatUnlock(user)}
                                  className={`py-1.5 px-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider active:scale-95 transition-all inline-flex items-center gap-1 ${getClientStatus(user).isLocked
                                    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-500/50 shadow-glow"
                                    : "border-amber-500/20 bg-amber-500/5 text-amber-400 hover:bg-amber-500/25 hover:border-amber-500/50"
                                    }`}
                                >
                                  {getClientStatus(user).isLocked ? "Unlock Chat" : "Lock Chat"}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id, user.username)}
                                  disabled={isDeleting === user.id}
                                  className="py-1.5 px-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/25 hover:border-red-500/50 hover:text-white transition-all disabled:opacity-50 inline-flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider active:scale-95"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>{isDeleting === user.id ? 'Deleting...' : 'Delete'}</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-xs">
                              <Compass className="w-8 h-8 mx-auto text-slate-700 animate-spin [animation-duration:8s] mb-2" />
                              <span>No client charts align with your search criteria.</span>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. REAL-TIME CHAT PANEL */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-[650px] flex gap-6 overflow-hidden relative"
              >
                {/* Client List Sidebar */}
                <div className={`${showChatSidebar ? 'flex' : 'hidden'} w-full md:w-1/3 ${selectedClient ? 'absolute md:relative z-20 h-full' : ''} rounded-3rem border border-white/10 bg-slate-900/95 md:bg-slate-900/35 backdrop-blur-2xl p-5 flex-col overflow-hidden max-h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] md:shadow-none`}>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-3 shrink-0">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 font-serif">
                      Active Channels
                    </h3>
                    {selectedClient && (
                      <button onClick={() => setShowChatSidebar(false)} className="md:hidden p-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1.5 scrollbar-thin">
                    {allUsers.map((user) => {
                      const isSelected = selectedClient?.id === user.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => { setSelectedClient(user); setShowChatSidebar(false); }}
                          className={`w-full p-3.5 rounded-2xl text-left border flex items-center gap-3 transition-all ${isSelected
                            ? 'border-indigo-500 bg-indigo-950/20 text-indigo-300 shadow-glow'
                            : 'border-white/5 bg-white/2 hover:border-white/10 text-slate-300'
                            }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-[11px] text-white shrink-0">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate text-white">{user.username}</div>
                            <div className="text-[9px] text-slate-500 truncate mt-0.5">{user.mobile}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Message Thread area */}
                <div className="flex-1 rounded-3rem border border-white/10 bg-slate-900/35 backdrop-blur-2xl flex flex-col overflow-hidden max-h-full relative">

                  {selectedClient ? (
                    <>
                      {/* Active header bar */}
                      <div className="px-4 md:px-6 py-4.5 border-b border-white/5 bg-white/2 backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 shrink-0">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          {!showChatSidebar && (
                            <button
                              onClick={() => { setSelectedClient(null); setShowChatSidebar(true); }}
                              className="flex items-center gap-1.5 p-2 md:py-1.5 md:px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shrink-0 active:scale-95 shadow-glow"
                              title="Back to List"
                            >
                              <ArrowLeft className="w-4 h-4 md:w-3.5 md:h-3.5" />
                              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Back</span>
                            </button>
                          )}
                          <div className="min-w-0">
                            <h4 className="text-sm font-black uppercase tracking-widest text-white truncate flex items-center gap-2">
                              {selectedClient.username}
                              {selectedClient.gender && (
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-full border border-emerald-500/20">{selectedClient.gender}</span>
                              )}
                            </h4>
                            <span className="text-[11px] text-indigo-300 font-bold block mt-1 truncate flex flex-wrap items-center gap-2">
                              <span>{selectedClient.mobile}</span>
                              <span className="opacity-50">•</span>
                              <span>DOB: {selectedClient.dob || 'N/A'}</span>
                              <span className="opacity-50">•</span>
                              <span>TOB: {selectedClient.tob || 'N/A'}</span>
                              <span className="opacity-50">•</span>
                              <span>Place: {selectedClient.pob || 'N/A'}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 self-end md:self-auto">
                          <button
                            onClick={() => handleToggleChatUnlock(selectedClient)}
                            className={`py-1.5 px-3 rounded-xl border text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all ${getClientStatus(selectedClient).isLocked
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 shadow-glow"
                              : "border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                              }`}
                          >
                            {getClientStatus(selectedClient).isLocked ? "Approve & Unlock" : "Lock Session"}
                          </button>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 text-[8px] font-black uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            Live Sync
                          </span>
                        </div>
                      </div>

                      {/* Paid session active countdown banner */}
                      {selectedClient.chatUnlocked && adminTimeRemaining !== null && adminTimeRemaining > 0 && (
                        <div className="border-b text-xs px-6 py-2.5 flex items-center justify-between shrink-0 font-mono bg-emerald-500/10 border-emerald-500/20 text-emerald-300">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full animate-ping bg-emerald-400" />
                            Paid consultation session active. Remaining time:
                          </span>
                          <span className="font-bold px-2 py-0.5 rounded border text-emerald-400 bg-emerald-950/40 border-emerald-500/25">
                            {Math.floor(adminTimeRemaining / 60)}m {adminTimeRemaining % 60}s
                          </span>
                        </div>
                      )}

                      {/* Chat Messages */}
                      <div className="flex-1 p-6 overflow-y-auto space-y-4.5 scrollbar-thin">
                        {chatMessages.map((msg) => {
                          const isAdmin = msg.sender === 'astrologer';
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[70%] rounded-2xl p-4.5 text-xs leading-relaxed space-y-1 ${isAdmin
                                ? 'bg-amber-500 text-slate-950 rounded-tr-none shadow-glow'
                                : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                                }`}>
                                <p>{msg.content}</p>
                                <span className={`text-[8px] uppercase tracking-widest block text-right ${isAdmin ? 'text-amber-900/70' : 'text-slate-500'
                                  }`}>
                                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={chatBottomRef} />
                      </div>

                      {/* Input Reply capsule bar */}
                      <form onSubmit={handleSendReply} className="p-4 border-t border-white/5 bg-transparent backdrop-blur-md flex gap-2 shrink-0">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type cosmic guidance reply..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 px-4.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500/50 transition-all"
                          disabled={isSending}
                          required
                        />
                        <button
                          type="submit"
                          disabled={isSending}
                          className="p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-glow border border-amber-400/20 active:scale-95 transition-all flex items-center justify-center shrink-0 disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
                      <MessageSquare className="w-10 h-10 text-slate-700 animate-pulse mb-3" />
                      <span>Select a client from the left channel list to open communication.</span>
                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {/* 3. CONSULTATION FEES EDITING */}
            {activeTab === 'pricing' && (
              <motion.div
                key="pricing-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto space-y-6"
              >

                <div className="rounded-3rem border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 md:p-8 shadow-antigravity space-y-6">

                  <div>
                    <h2 className="text-lg font-bold font-serif text-white uppercase tracking-widest">
                      Customize Service Fees
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Modify consultation plans instantly. Updates are applied live across booking and services pages.
                    </p>
                  </div>

                  {pricingPlans ? (
                    <div className="space-y-4">
                      {Object.keys(pricingPlans).map((key) => {
                        const plan = pricingPlans[key];
                        return (
                          <div
                            key={plan.id}
                            className="p-4.5 rounded-2xl border border-white/5 bg-slate-950/20 space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 font-mono">Plan Key: {plan.id}</span>
                              <span className="text-[9px] py-0.5 px-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 uppercase tracking-widest font-black">Active</span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block ml-1">Plan Title</label>
                                <input
                                  type="text"
                                  value={plan.title}
                                  onChange={(e) => handlePriceChange(plan.id, 'title', e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/30 outline-none transition-all"
                                  required
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block ml-1">Price Rate (Standard Symbol)</label>
                                <input
                                  type="text"
                                  value={plan.price}
                                  onChange={(e) => handlePriceChange(plan.id, 'price', e.target.value)}
                                  placeholder="e.g. ₹399"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-amber-500/30 outline-none transition-all font-mono font-bold"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="pt-4 flex items-center justify-between">
                        {pricingSuccess && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Custom pricing synced successfully!
                          </motion.div>
                        )}
                        <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-500">Database auto-sync enabled</span>

                        <button
                          onClick={handleSavePrices}
                          disabled={pricingLoading}
                          className="py-3 px-8 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-glow flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                        >
                          {pricingLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" /> Saving Changes...
                            </>
                          ) : (
                            <>
                              Sync Live Rates
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
                      <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">Acquiring live rate parameters...</span>
                    </div>
                  )}

                </div>

              </motion.div>
            )}

            {/* 4. BLOG UPLOAD */}
            {activeTab === 'blog-upload' && (
              <motion.div
                key="blog-upload-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto w-full"
              >
                <div className="rounded-3rem border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 md:p-8 shadow-antigravity">
                  <div className="mb-8 border-b border-white/5 pb-4">
                    <h2 className="text-lg font-bold font-serif text-white uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-400" />
                      Publish New Blog Post
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Fill out the form below to publish a new blog to the platform. SEO metadata is generated automatically from your inputs.
                    </p>
                  </div>

                  <form onSubmit={handleBlogSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold ml-1 block">Blog Title</label>
                        <input
                          type="text"
                          value={blogTitle}
                          onChange={(e) => {
                            setBlogTitle(e.target.value);
                            if (!blogSlug) {
                              setBlogSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                            }
                          }}
                          placeholder="e.g. Venus Transit 2026 Effects"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold ml-1 block">URL Slug</label>
                        <input
                          type="text"
                          value={blogSlug}
                          onChange={(e) => setBlogSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          placeholder="venus-transit-2026"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all shadow-inner font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold ml-1 block">SEO Keyword</label>
                        <input
                          type="text"
                          value={blogKeyword}
                          onChange={(e) => setBlogKeyword(e.target.value)}
                          placeholder="e.g. astrology, transit"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold ml-1 block">Feature Image (URL or Upload)</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={blogImageUrl}
                            onChange={(e) => {
                              setBlogImageUrl(e.target.value);
                              setBlogImageFile(null);
                            }}
                            placeholder="https://example.com/image.jpg"
                            className="w-1/2 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all shadow-inner font-mono"
                            required={!blogImageFile}
                          />
                          <div className="w-1/2 relative group">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setBlogImageFile(e.target.files[0]);
                                  setBlogImageUrl('');
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              required={!blogImageUrl && !blogImageFile}
                            />
                            <div className="w-full h-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none group-hover:border-indigo-500/50 transition-all shadow-inner flex items-center justify-between relative z-0">
                              <span className="truncate">{blogImageFile ? blogImageFile.name : 'Upload Local File...'}</span>
                              <div className="bg-indigo-600/20 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase group-hover:bg-indigo-600 group-hover:text-white transition-all">Browse</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold ml-1 block">Image Alt Text (Optional)</label>
                      <input
                        type="text"
                        value={blogImageAlt}
                        onChange={(e) => setBlogImageAlt(e.target.value)}
                        placeholder="e.g. A golden zodiac wheel with Vedic astrological signs"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold ml-1 block">Meta Description</label>
                      <textarea
                        value={blogMetaDescription}
                        onChange={(e) => setBlogMetaDescription(e.target.value)}
                        placeholder="A short summary for search engines (150-160 characters)..."
                        className="w-full h-20 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all shadow-inner resize-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold ml-1 block">Blog Content (Markdown/HTML supported)</label>
                      <textarea
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                        placeholder="Write the full astrological insight here..."
                        className="w-full h-80 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all shadow-inner resize-y font-mono leading-relaxed"
                        required
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/5 gap-3">
                      {editingBlogId && (
                        <button
                          type="button"
                          onClick={resetBlogForm}
                          className="py-3.5 px-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                        >
                          Cancel Edit
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmittingBlog}
                        className="py-3.5 px-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-glow flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSubmittingBlog ? (
                          <><RefreshCw className="w-4 h-4 animate-spin" /> {editingBlogId ? 'Updating...' : 'Publishing...'}</>
                        ) : (
                          <><Send className="w-4 h-4" /> {editingBlogId ? 'Update Blog' : 'Publish Blog'}</>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* 5. BLOG LIST */}
            {activeTab === 'blog-list' && (
              <motion.div
                key="blog-list-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto w-full"
              >
                {/* Published Blogs List */}
                <div className="rounded-3rem border border-white/10 bg-slate-900/35 backdrop-blur-2xl p-6 md:p-8 shadow-antigravity">
                  <div className="mb-6 border-b border-white/5 pb-4">
                    <h2 className="text-lg font-bold font-serif text-white uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-400" />
                      Manage Published Blogs
                    </h2>
                  </div>
                  {existingBlogs.length === 0 ? (
                    <p className="text-slate-500 text-sm">No blogs published yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {existingBlogs.map((b) => (
                        <div key={b.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl gap-4 hover:border-white/20 transition-all">
                          <div>
                            <h3 className="text-white font-bold">{b.title}</h3>
                            <p className="text-slate-400 text-xs">/{b.slug}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => handleEditBlog(b)} className="px-4 py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-full text-xs font-bold transition-all">Edit</button>
                            <button onClick={() => handleDeleteBlog(b.id)} className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-full text-xs font-bold transition-all">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>
    </main>
  );
}
