"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export interface UserData {
  id: string;
  username: string;
  mobile: string;
  email?: string;
  dob?: string;
  tob?: string;
  pob?: string;
  gender?: string;
  registeredAt: string;
  firstMessageAt?: string | null;
  chatUnlocked?: boolean;
  unlockedAt?: string | null;
}

interface AppContextType {
  currentUser: UserData | null;
  allUsers: UserData[];
  registerUser: (username: string, mobile: string, email?: string, dob?: string, tob?: string, pob?: string, gender?: string) => Promise<UserData>;
  loginUser: (mobile: string) => Promise<UserData>;
  logoutUser: () => void;
  deleteUser: (userId: string) => Promise<void>;
  isOfflineMode: boolean;
  setAllUsers: React.Dispatch<React.SetStateAction<UserData[]>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const isOfflineMode = !isSupabaseConfigured;

  // Load database users list on mount
  useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('seekers')
            .select('*')
            .order('registered_at', { ascending: false });
          
          if (!error && data) {
            const mapped = data.map((u: any) => {
              const emailStr = u.email || '';
              const parts = emailStr.split('|');
              const emailVal = parts[0] || '';
              const dobVal = parts[1] || '';
              const tobVal = parts[2] || '';
              const pobVal = parts[3] || '';
              const genderVal = parts[4] || '';
              return {
                id: u.id,
                username: u.name,
                mobile: u.phone,
                email: emailVal,
                dob: dobVal,
                tob: tobVal,
                pob: pobVal,
                gender: genderVal,
                registeredAt: u.registered_at,
                firstMessageAt: u.first_message_at,
                chatUnlocked: u.chat_unlocked || false,
                unlockedAt: u.unlocked_at
              };
            });
            setAllUsers(mapped);
          } else {
            console.error("Failed to load seekers list from database:", error.message || error);
          }
        } catch (e) {
          console.error("Connection to database failed:", e);
        }
      }

      // Check active user session (use localStorage for persistent visits)
      const activeSession = localStorage.getItem('astro_active_user');
      const activeCookie = document.cookie.split('; ').find(row => row.startsWith('astro_user_logged_in='));
      
      if (activeSession && activeCookie) {
        try {
          const parsed = JSON.parse(activeSession);
          // Fetch latest state from Supabase to ensure accurate chatUnlocked/firstMessageAt
          if (isSupabaseConfigured) {
            const { data, error } = await supabase
              .from('seekers')
              .select('*')
              .eq('id', parsed.id)
              .single();
            if (!error && data) {
              const emailStr = data.email || '';
              const parts = emailStr.split('|');
              const emailVal = parts[0] || '';
              const dobVal = parts[1] || '';
              const tobVal = parts[2] || '';
              const pobVal = parts[3] || '';
              const genderVal = parts[4] || '';
              const freshUser = {
                id: data.id,
                username: data.name,
                mobile: data.phone,
                email: emailVal,
                dob: dobVal,
                tob: tobVal,
                pob: pobVal,
                gender: genderVal,
                registeredAt: data.registered_at,
                firstMessageAt: data.first_message_at,
                chatUnlocked: data.chat_unlocked || false,
                unlockedAt: data.unlocked_at
              };
              setCurrentUser(freshUser);
              localStorage.setItem('astro_active_user', JSON.stringify(freshUser));
            } else {
              setCurrentUser(parsed);
            }
          } else {
            setCurrentUser(parsed);
          }
        } catch (e) {
          console.error("Failed to parse active user session:", e);
        }
      } else {
        localStorage.removeItem('astro_active_user');
      }
      
      setIsHydrated(true);
    }

    loadData();
  }, []);

  const registerUser = async (username: string, mobile: string, email: string = '', dob: string = '', tob: string = '', pob: string = '', gender: string = '') => {
    const cleanEmail = email.trim().toLowerCase() || `${username.toLowerCase().replace(/\s+/g, '')}_${Date.now()}@offline.com`;
    const dbEmail = `${cleanEmail}|${dob}|${tob}|${pob}|${gender}`;
    const newUser: UserData = {
      id: '',
      username,
      mobile,
      email: cleanEmail,
      dob,
      tob,
      pob,
      gender,
      registeredAt: new Date().toISOString(),
      firstMessageAt: null,
      chatUnlocked: false,
      unlockedAt: null
    };

    const { data, error } = await supabase
      .from('seekers')
      .insert([
        { name: username, phone: mobile, email: dbEmail }
      ])
      .select();

    if (error) {
      console.error("Supabase user registration insert failed:", error.message || error);
      throw new Error(error.message || "Database registration failed.");
    }

    if (data && data[0]) {
      newUser.id = data[0].id;
      newUser.registeredAt = data[0].registered_at;
      newUser.firstMessageAt = data[0].first_message_at;
      newUser.chatUnlocked = data[0].chat_unlocked || false;
      newUser.unlockedAt = data[0].unlocked_at;
    } else {
      throw new Error("No data returned from registration insert.");
    }

    // Update state cache
    setAllUsers(prev => [newUser, ...prev.filter(u => u.email !== cleanEmail)]);
    setCurrentUser(newUser);
    
    // Sync session keys and cookie (using localStorage for persistence)
    localStorage.setItem('astro_active_user', JSON.stringify(newUser));
    document.cookie = `astro_user_logged_in=true; path=/; max-age=31536000`;
    
    return newUser;
  };

  const loginUser = async (mobile: string) => {
    const { data, error } = await supabase
      .from('seekers')
      .select('*')
      .eq('phone', mobile.trim())
      .maybeSingle();

    if (error) {
      console.error("Supabase user query failed:", error.message || error);
      throw new Error(error.message || "Database login query failed.");
    }

    if (!data) {
      throw new Error("No user chart found with this phone number. Please register as a New User.");
    }

    const emailStr = data.email || '';
    const parts = emailStr.split('|');
    const emailVal = parts[0] || '';
    const dobVal = parts[1] || '';
    const tobVal = parts[2] || '';
    const pobVal = parts[3] || '';
    const genderVal = parts[4] || '';

    const user: UserData = {
      id: data.id,
      username: data.name,
      mobile: data.phone,
      email: emailVal,
      dob: dobVal,
      tob: tobVal,
      pob: pobVal,
      gender: genderVal,
      registeredAt: data.registered_at,
      firstMessageAt: data.first_message_at,
      chatUnlocked: data.chat_unlocked || false,
      unlockedAt: data.unlocked_at
    };

    setCurrentUser(user);
    localStorage.setItem('astro_active_user', JSON.stringify(user));
    document.cookie = `astro_user_logged_in=true; path=/; max-age=31536000`;
    
    return user;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('astro_active_user');
    document.cookie = `astro_user_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  };

  const deleteUser = async (userId: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('seekers')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error("Supabase user deletion failed:", error.message || error);
        throw new Error(error.message || "Database deletion failed.");
      }
    }

    // Update in-memory state
    setAllUsers((prev) => prev.filter(u => u.id !== userId));

    // If the currently logged-in user is deleted, log them out
    if (currentUser?.id === userId) {
      logoutUser();
    }
  };

  if (!isHydrated) {
    return null; 
  }

  return (
    <AppContext.Provider value={{ currentUser, allUsers, registerUser, loginUser, logoutUser, deleteUser, isOfflineMode, setAllUsers, setCurrentUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
