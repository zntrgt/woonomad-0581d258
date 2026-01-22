import { useState, useEffect, useCallback } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Loader2, Languages } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TranslatableContentProps {
  children: React.ReactNode;
  texts: Record<string, string>;
  renderContent: (translatedTexts: Record<string, string>) => React.ReactNode;
  showIndicator?: boolean;
}

export function TranslatableContent({ 
  texts, 
  renderContent, 
  showIndicator = true 
}: TranslatableContentProps) {
  const { language, translatePageContent, isTranslating } = useSettings();
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>(texts);
  const [hasTranslated, setHasTranslated] = useState(false);

  useEffect(() => {
    // Reset when texts change
    setTranslatedTexts(texts);
    setHasTranslated(false);
  }, [JSON.stringify(texts)]);

  useEffect(() => {
    const translate = async () => {
      if (language === 'tr') {
        setTranslatedTexts(texts);
        setHasTranslated(false);
        return;
      }

      const result = await translatePageContent(texts);
      if (result) {
        setTranslatedTexts(result);
        setHasTranslated(true);
      }
    };

    translate();
  }, [language, translatePageContent, JSON.stringify(texts)]);

  return (
    <div className="relative">
      {/* Translation Indicator */}
      {showIndicator && (isTranslating || hasTranslated) && (
        <div className="absolute -top-2 -right-2 z-10">
          {isTranslating ? (
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Çeviriliyor...
            </Badge>
          ) : hasTranslated ? (
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
              <Languages className="h-3 w-3 mr-1" />
              AI Çeviri
            </Badge>
          ) : null}
        </div>
      )}
      
      {renderContent(translatedTexts)}
    </div>
  );
}

// Hook for simple text translation
export function useTranslatedText(texts: Record<string, string>) {
  const { language, translatePageContent, isTranslating } = useSettings();
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>(texts);

  useEffect(() => {
    const translate = async () => {
      if (language === 'tr') {
        setTranslatedTexts(texts);
        return;
      }

      const result = await translatePageContent(texts);
      if (result) {
        setTranslatedTexts(result);
      }
    };

    translate();
  }, [language, translatePageContent, JSON.stringify(texts)]);

  return { translatedTexts, isTranslating };
}
