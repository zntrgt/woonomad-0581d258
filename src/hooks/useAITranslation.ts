import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Language } from '@/contexts/SettingsContext';

interface TranslationCache {
  [key: string]: {
    [lang: string]: Record<string, string>;
  };
}

// In-memory cache for translations during session
const translationCache: TranslationCache = {};

export function useAITranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateTexts = useCallback(async (
    texts: Record<string, string>,
    targetLanguage: Language,
    sourceLanguage: Language = 'tr'
  ): Promise<Record<string, string> | null> => {
    // Same language, return original
    if (sourceLanguage === targetLanguage) {
      return texts;
    }

    // Check cache first
    const cacheKey = JSON.stringify(Object.keys(texts).sort());
    if (translationCache[cacheKey]?.[targetLanguage]) {
      return translationCache[cacheKey][targetLanguage];
    }

    setIsTranslating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('translate-content', {
        body: {
          texts,
          targetLanguage,
          sourceLanguage,
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.translations) {
        // Cache the result
        if (!translationCache[cacheKey]) {
          translationCache[cacheKey] = {};
        }
        translationCache[cacheKey][targetLanguage] = data.translations;
        
        return data.translations;
      }

      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Translation failed';
      setError(message);
      console.error('Translation error:', message);
      return null;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const translateSingleText = useCallback(async (
    text: string,
    targetLanguage: Language,
    sourceLanguage: Language = 'tr'
  ): Promise<string | null> => {
    const result = await translateTexts({ text }, targetLanguage, sourceLanguage);
    return result?.text || null;
  }, [translateTexts]);

  const clearCache = useCallback(() => {
    Object.keys(translationCache).forEach(key => {
      delete translationCache[key];
    });
  }, []);

  return {
    translateTexts,
    translateSingleText,
    isTranslating,
    error,
    clearCache,
  };
}
