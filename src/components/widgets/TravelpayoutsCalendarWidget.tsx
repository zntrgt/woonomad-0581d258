import { useEffect, useRef, useState, useId } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { WidgetContainer, WidgetFallback } from './WidgetContainer';
import { Calendar } from 'lucide-react';

// Travelpayouts partner ID - public affiliate ID
const PARTNER_ID = '604466';

interface TravelpayoutsCalendarWidgetProps {
  origin: string; // IATA code (required)
  destination: string; // IATA code (required)
  subId?: string;
  className?: string;
}

// Language mapping
const langMap: Record<string, string> = {
  tr: 'tr',
  en: 'en',
  de: 'de',
  fr: 'fr',
  es: 'es',
  ar: 'ar',
};

// Currency mapping
const currencyMap: Record<string, string> = {
  TRY: 'try',
  USD: 'usd',
  EUR: 'eur',
  GBP: 'gbp',
  AED: 'aed',
};

export function TravelpayoutsCalendarWidget({
  origin,
  destination,
  subId = 'calendar',
  className,
}: TravelpayoutsCalendarWidgetProps) {
  const { language, currency } = useSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const widgetId = useId().replace(/:/g, '');

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !origin || !destination) return;

    setIsLoading(true);
    setHasError(false);

    // Clear previous widget
    container.innerHTML = '';

    // Create widget container
    const widgetDiv = document.createElement('div');
    widgetDiv.id = `tp-calendar-${widgetId}`;
    container.appendChild(widgetDiv);

    // Low fares calendar widget
    const script = document.createElement('script');
    script.src = `https://tp.media/content?trs=329339&shmarker=${PARTNER_ID}&locale=${langMap[language] || 'en'}&currency=${currencyMap[currency] || 'try'}&powered_by=true&origin=${origin}&destination=${destination}&promo_id=4033&campaign_id=100`;
    script.async = true;
    script.charset = 'utf-8';

    script.onload = () => {
      setIsLoading(false);
    };

    script.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    container.appendChild(script);

    return () => {
      clearTimeout(timeout);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [language, currency, origin, destination, subId, widgetId]);

  const fallbackUrl = `https://www.aviasales.com/search/${origin}${destination}1?marker=${PARTNER_ID}`;

  if (!origin || !destination) {
    return (
      <div className={`rounded-xl border border-border bg-card p-6 ${className}`}>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Calendar className="h-5 w-5" />
          <span className="text-sm">Fiyat takvimini görmek için bir rota seçin</span>
        </div>
      </div>
    );
  }

  return (
    <WidgetContainer
      className={className}
      isLoading={isLoading}
      loadingText="Fiyat takvimi yükleniyor..."
      minHeight="350px"
    >
      <div ref={containerRef} className="w-full min-h-[350px]" />
      {hasError && (
        <WidgetFallback
          title="Fiyat takvimi yüklenemedi"
          description="Fiyatları görmek için Aviasales'e gidin"
          actionUrl={fallbackUrl}
          actionText="Fiyatları Gör"
        />
      )}
    </WidgetContainer>
  );
}
