'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div 
      className="relative flex items-center bg-white dark:bg-[#1f2937] border border-[#1e1b4b]/10 dark:border-white/10 p-0.5 rounded-[8px] shadow-sm select-none w-[72px] h-[36px] overflow-hidden"
      title={language === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}
    >
      {/* Sliding active bubble */}
      <div
        className={`absolute top-0.5 bottom-0.5 w-[32px] rounded-[6px] bg-gradient-to-tr from-[#8b5cf6] to-[#1e1b4b] dark:from-[#8b5cf6] dark:to-violet-800 transition-all duration-300 ease-out shadow-sm ${
          language === 'es' ? 'left-0.5' : 'left-[37px]'
        }`}
      />

      {/* Spanish Button */}
      <button
        onClick={() => setLanguage('es')}
        className={`flex-1 text-center font-display text-[10px] font-bold tracking-wider z-10 transition-colors duration-300 h-full flex items-center justify-center ${
          language === 'es' 
            ? 'text-white' 
            : 'text-[#1e1b4b]/60 dark:text-slate-400 hover:text-[#1e1b4b] dark:hover:text-white'
        }`}
        aria-label="Español"
      >
        ES
      </button>

      {/* English Button */}
      <button
        onClick={() => setLanguage('en')}
        className={`flex-1 text-center font-display text-[10px] font-bold tracking-wider z-10 transition-colors duration-300 h-full flex items-center justify-center ${
          language === 'en' 
            ? 'text-white' 
            : 'text-[#1e1b4b]/60 dark:text-slate-400 hover:text-[#1e1b4b] dark:hover:text-white'
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
