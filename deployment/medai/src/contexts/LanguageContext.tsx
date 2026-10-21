import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'es' | 'en' | 'fr';
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void };
export const LanguageContext = createContext<LanguageContextValue>({ language: 'es', setLanguage: () => undefined });

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('es');
  useEffect(() => {
    const saved = window.localStorage.getItem('medai-language');
    if (saved === 'es' || saved === 'en' || saved === 'fr') setLanguageState(saved);
  }, []);
  const setLanguage = (next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem('medai-language', next);
    document.documentElement.lang = next;
  };
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
};
export const useLanguage = () => useContext(LanguageContext);
