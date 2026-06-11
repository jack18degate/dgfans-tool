'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Translations, Locale, LOCALES } from './translations';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'it',
  setLocale: () => {},
  t: translations.it,
});

const STORAGE_KEY = 'degate-tools-lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && LOCALES.some(l => l.code === saved)) {
        setLocaleState(saved);
        return;
      }
    } catch { /* SSR or no localStorage */ }

    // Auto-detect from browser language
    try {
      const browserLang = navigator.language || (navigator as any).userLanguage || '';
      const langCode = browserLang.split('-')[0].toLowerCase();
      const matchedLocale = LOCALES.find(l => l.code === langCode);
      if (matchedLocale) {
        setLocaleState(matchedLocale.code);
      } else {
        setLocaleState('en');
      }
    } catch {
      setLocaleState('en');
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch { /* ignore */ }
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export { LOCALES };
export type { Locale };
