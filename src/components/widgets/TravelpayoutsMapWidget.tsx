import { useEffect, useRef, useState, useId } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { WidgetContainer, WidgetFallback } from './WidgetContainer';
import { MapPin } from 'lucide-react';

// Travelpayouts partner ID
const PARTNER_ID = '604466';

interface TravelpayoutsMapWidgetProps {
  origin?: string; // IATA code for departure city
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

export function TravelpayoutsMapWidget({
  origin = 'IST',
  subId = 'map',
  className,
}: TravelpayoutsMapWidgetProps) {
  const { language, currency } = useSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const widgetId = useId().replace(/:/g, '');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setIsLoading(true);
    setHasError(false);

    // Clear previous widget
    container.innerHTML = '';

    // Create widget container
    const widgetDiv = document.createElement('div');
    widgetDiv.id = `tp-map-${widgetId}`;
    container.appendChild(widgetDiv);

    // Map widget - shows cheapest destinations from origin
    const script = document.createElement('script');
    script.src = `https://tp.media/content?trs=329339&shmarker=${PARTNER_ID}&locale=${langMap[language] || 'en'}&currency=${currencyMap[currency] || 'try'}&powered_by=true&origin=${origin}&promo_id=4038&campaign_id=100`;
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
  }, [language, currency, origin, subId, widgetId]);

  const fallbackUrl = `https://www.aviasales.com/map?origin=${origin}&marker=${PARTNER_ID}`;

  return (
    <WidgetContainer
      className={className}
      isLoading={isLoading}
      loadingText="Harita yükleniyor..."
      minHeight="450px"
    >
      <div ref={containerRef} className="w-full min-h-[450px]" />
      {hasError && (
        <WidgetFallback
          title="Harita widget'ı yüklenemedi"
          description="Destinasyonları haritada görmek için Aviasales'e gidin"
          actionUrl={fallbackUrl}
          actionText="Haritayı Gör"
        />
      )}
    </WidgetContainer>
  );
}
