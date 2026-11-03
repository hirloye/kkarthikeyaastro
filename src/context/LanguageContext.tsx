"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationDictionary, Language } from '@/locales/translations';

export type { Language, TranslationDictionary };

interface LanguageContextType {
  language: Language;
  t: TranslationDictionary;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  isTranslating: boolean;
  tText: (enText: string, taText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to remove any legacy googtrans cookies across paths/domains
function clearGoogleTranslateCookies() {
  if (typeof document === 'undefined') return;
  const hostname = window.location.hostname;
  const expireStr = "expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  document.cookie = `googtrans=; ${expireStr}`;
  document.cookie = `googtrans=; ${expireStr} domain=${hostname};`;

  if (hostname.includes('.')) {
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      const rootDomain = parts.slice(-2).join('.');
      document.cookie = `googtrans=; ${expireStr} domain=.${rootDomain};`;
    }
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isTranslating, setIsTranslating] = useState(false);

  // Initialize language from localStorage on mount & clean up any leftover google translate artifacts
  useEffect(() => {
    try {
      clearGoogleTranslateCookies();
      const stored = localStorage.getItem('astro_language') as Language | null;
      if (stored === 'ta' || stored === 'en') {
        setLanguageState(stored);
      }
    } catch (e) {
      console.error("Failed to read language preference:", e);
    }
  }, []);

  // Suppress any legacy Google Translate banner frames or injected elements
  useEffect(() => {
    const cleanupExtTranslate = () => {
      if (typeof document === 'undefined') return;

      if (document.body && document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
      if (document.documentElement && document.documentElement.style.top && document.documentElement.style.top !== '0px') {
        document.documentElement.style.top = '0px';
      }

      const elementsToHide = document.querySelectorAll<HTMLElement>(
        'iframe.skiptranslate, iframe[class*="skiptranslate"], iframe[class*="VIpgJd"], iframe[id*=":1.container"], iframe[id*=":2.container"], .goog-te-banner-frame, body > .skiptranslate, [class*="VIpgJd-ZVi9od"], #google_translate_element'
      );
      elementsToHide.forEach((el) => {
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('height', '0px', 'important');
        el.style.setProperty('width', '0px', 'important');
        el.style.setProperty('opacity', '0', 'important');
        el.style.setProperty('pointer-events', 'none', 'important');
      });
    };

    cleanupExtTranslate();
    const interval = setInterval(cleanupExtTranslate, 500);
    return () => clearInterval(interval);
  }, []);

  const changeLanguage = (targetLang: Language) => {
    setIsTranslating(true);
    setLanguageState(targetLang);

    try {
      localStorage.setItem('astro_language', targetLang);
      clearGoogleTranslateCookies();
    } catch (e) {
      console.error("Error setting language:", e);
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ta' : 'en';
    changeLanguage(nextLang);
  };

  const tText = (enText: string, taText: string) => {
    return language === 'ta' ? taText : enText;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: translations[language],
        toggleLanguage,
        setLanguage: changeLanguage,
        isTranslating,
        tText
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
