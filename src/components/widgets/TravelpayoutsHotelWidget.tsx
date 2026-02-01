import { useEffect, useRef, useState, useId } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { WidgetContainer, WidgetFallback } from './WidgetContainer';
import { getAgodaUrl } from '@/lib/agodaMapping';
import { format, addDays } from 'date-fns';

// Travelpayouts partner ID
const PARTNER_ID = '604466';

interface TravelpayoutsHotelWidgetProps {
  cityName?: string; // City name for search
  cityId?: string; // Hotellook city ID
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

export function TravelpayoutsHotelWidget({
  cityName = '',
  cityId = '',
  subId = 'hotels',
  className,
}: TravelpayoutsHotelWidgetProps) {
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
    widgetDiv.id = `tp-hotel-${widgetId}`;
    container.appendChild(widgetDiv);

    // Hotel search widget - using Hotellook
    const locationParam = cityId || cityName;
    const script = document.createElement('script');
    script.src = `https://tp.media/content?trs=329339&shmarker=${PARTNER_ID}&locale=${langMap[language] || 'en'}&currency=${currencyMap[currency] || 'try'}&powered_by=true&locationId=${locationParam}&promo_id=4427&campaign_id=100`;
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
  }, [language, currency, cityName, cityId, subId, widgetId]);

  // Fallback to Agoda
  const today = new Date();
  const checkIn = format(addDays(today, 7), 'yyyy-MM-dd');
  const checkOut = format(addDays(today, 10), 'yyyy-MM-dd');
  
  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
  const fallbackUrl = getAgodaUrl(citySlug, cityName, checkIn, checkOut, {
    adults: 2,
    rooms: 1,
  });

  return (
    <WidgetContainer
      className={className}
      isLoading={isLoading}
      loadingText="Otel arama yükleniyor..."
      minHeight="400px"
    >
      <div ref={containerRef} className="w-full min-h-[400px]" />
      {hasError && (
        <WidgetFallback
          title="Widget yüklenemedi"
          description="Doğrudan Agoda'da arama yapabilirsiniz"
          actionUrl={fallbackUrl}
          actionText="Agoda'da Ara"
        />
      )}
    </WidgetContainer>
  );
}
