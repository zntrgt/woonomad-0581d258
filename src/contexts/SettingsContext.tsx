import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'tr' | 'en' | 'de' | 'fr' | 'es' | 'ar';
export type Currency = 'TRY' | 'USD' | 'EUR' | 'GBP' | 'AED';

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

interface CurrencyOption {
  code: Currency;
  name: string;
  symbol: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export const CURRENCIES: CurrencyOption[] = [
  { code: 'TRY', name: 'Türk Lirası', symbol: '₺' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
];

interface SettingsContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  getLanguageInfo: () => LanguageOption;
  getCurrencyInfo: () => CurrencyOption;
  formatPrice: (price: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'tr';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('app-currency');
    return (saved as Currency) || 'TRY';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('app-currency', curr);
  };

  const getLanguageInfo = () => {
    return LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  };

  const getCurrencyInfo = () => {
    return CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  };

  const formatPrice = (price: number) => {
    const info = getCurrencyInfo();
    return `${info.symbol}${price.toLocaleString('tr-TR')}`;
  };

  return (
    <SettingsContext.Provider value={{
      language,
      currency,
      setLanguage,
      setCurrency,
      getLanguageInfo,
      getCurrencyInfo,
      formatPrice,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
