import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  formatPrice: (price: number, overrideCurrency?: Currency) => string;
  t: (key: string, options?: Record<string, unknown>) => string;
  isTranslating: boolean;
  translatePageContent: (texts: Record<string, string>) => Promise<Record<string, string> | null>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Translation cache
const translationCache: Record<string, Record<string, Record<string, string>>> = {};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'tr';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('app-currency');
    return (saved as Currency) || 'TRY';
  });

  const [isTranslating, setIsTranslating] = useState(false);

  // Initialize i18n language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('app-language') as Language;
    if (savedLang && i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  const translatePageContent = useCallback(async (
    texts: Record<string, string>
  ): Promise<Record<string, string> | null> => {
    // For Turkish, return original
    if (language === 'tr') {
      return texts;
    }

    // Check cache
    const cacheKey = JSON.stringify(Object.keys(texts).sort());
    if (translationCache[cacheKey]?.[language]) {
      return translationCache[cacheKey][language];
    }

    setIsTranslating(true);

    try {
      const { data, error } = await supabase.functions.invoke('translate-content', {
        body: {
          texts,
          targetLanguage: language,
          sourceLanguage: 'tr',
        },
      });

      if (error) {
        console.error('Translation error:', error);
        return null;
      }

      if (data?.translations) {
        // Cache result
        if (!translationCache[cacheKey]) {
          translationCache[cacheKey] = {};
        }
        translationCache[cacheKey][language] = data.translations;
        return data.translations;
      }

      return null;
    } catch (err) {
      console.error('Translation error:', err);
      return null;
    } finally {
      setIsTranslating(false);
    }
  }, [language]);

  const setLanguage = async (lang: Language) => {
    const prevLang = language;
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
    i18n.changeLanguage(lang);
    
    // Update document direction for RTL languages
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }

    // Show toast for non-Turkish languages
    if (lang !== 'tr' && lang !== prevLang) {
      const langName = LANGUAGES.find(l => l.code === lang)?.name || lang;
      toast.info(`${langName} çevirisi aktif`, {
        description: 'Sayfa içerikleri AI ile çevrilecek',
        duration: 3000,
      });
    }
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

  const formatPrice = (price: number, overrideCurrency?: Currency) => {
    const curr = overrideCurrency || currency;
    const info = CURRENCIES.find(c => c.code === curr) || getCurrencyInfo();
    
    const localeMap: Record<Currency, string> = {
      'TRY': 'tr-TR',
      'USD': 'en-US',
      'EUR': 'de-DE',
      'GBP': 'en-GB',
      'AED': 'ar-AE',
    };
    
    const locale = localeMap[curr] || 'tr-TR';
    return `${info.symbol}${price.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
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
      t,
      isTranslating,
      translatePageContent,
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
