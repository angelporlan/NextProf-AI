'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { translations, Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLanguage = 'es',
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const router = useRouter();
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    // Detect preferred language from localStorage/cookie or browser as a client-side sync
    const savedLang = document.cookie
      .split('; ')
      .find((row) => row.startsWith('lang='))
      ?.split('=')[1] as Language | undefined;

    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      setLanguageState(savedLang);
    } else {
      const localLang = localStorage.getItem('lang') as Language | undefined;
      if (localLang && (localLang === 'es' || localLang === 'en')) {
        setLanguageState(localLang);
        document.cookie = `lang=${localLang}; path=/; max-age=31536000`;
      } else {
        const browserLang = navigator.language.startsWith('en') ? 'en' : 'es';
        setLanguageState(browserLang);
        document.cookie = `lang=${browserLang}; path=/; max-age=31536000`;
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
    document.cookie = `lang=${lang}; path=/; max-age=31536000`;
    
    // Refresh Server Components so they render in the new language
    router.refresh();
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to Spanish if key is not found in selected language
        let fallbackValue: any = translations['es'];
        for (const fk of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
            fallbackValue = fallbackValue[fk];
          } else {
            fallbackValue = undefined;
            break;
          }
        }
        if (typeof fallbackValue === 'string') {
          value = fallbackValue;
        } else {
          return key; // Return the key itself as a fallback
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    let result = value;
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, val]) => {
        result = result.replace(new RegExp(`{${placeholder}}`, 'g'), String(val));
      });
    }

    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
