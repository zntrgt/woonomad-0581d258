import { useEffect, useRef, useState, useId } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { WidgetContainer, WidgetFallback } from './WidgetContainer';
import { format, addDays } from 'date-fns';

// Travelpayouts partner ID - public affiliate ID, safe to expose
const PARTNER_ID = '604466';

interface TravelpayoutsFlightWidgetProps {
  origin?: string; // IATA code (e.g., 'IST')
  destination?: string; // IATA code (e.g., 'BCN')
  subId?: string; // Tracking sub ID
  className?: string;
  oneWay?: boolean;
}

// Language mapping for Travelpayouts
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

export function TravelpayoutsFlightWidget({
  origin = '',
  destination = '',
  subId = 'homepage',
  className,
  oneWay = false,
}: TravelpayoutsFlightWidgetProps) {
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

    // Create widget container div
    const widgetDiv = document.createElement('div');
    widgetDiv.id = `tp-widget-${widgetId}`;
    container.appendChild(widgetDiv);

    // Build widget script URL with parameters
    const params = new URLSearchParams({
      marker: PARTNER_ID,
      host: 'search.aviasales.com',
      locale: langMap[language] || 'en',
      currency: currencyMap[currency] || 'try',
      powered_by: 'true',
      one_way: oneWay ? 'true' : 'false',
      ...(origin && { origin }),
      ...(destination && { destination }),
      ...(subId && { subId }),
    });

    // Calculate dynamic dates (7 days from now for departure, 14 days for return)
    const today = new Date();
    const departureDate = format(addDays(today, 7), 'yyyy-MM-dd');
    const returnDate = format(addDays(today, 14), 'yyyy-MM-dd');

    // Load the Travelpayouts widget script with dynamic dates
    const script = document.createElement('script');
    script.src = `https://tp.media/content?trs=329339&shmarker=${PARTNER_ID}&locale=${langMap[language] || 'en'}&currency=${currencyMap[currency] || 'try'}&powered_by=true&origin=${origin}&destination=${destination}&one_way=${oneWay}&depart_date=${departureDate}&return_date=${returnDate}&promo_id=4132&campaign_id=100`;
    script.async = true;
    script.charset = 'utf-8';

    script.onload = () => {
      setIsLoading(false);
    };

    script.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };

    // Add timeout for loading state
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
  }, [language, currency, origin, destination, oneWay, subId, widgetId]);

  const fallbackUrl = origin && destination
    ? `https://www.aviasales.com/search/${origin}${destination}1?marker=${PARTNER_ID}`
    : `https://www.aviasales.com/?marker=${PARTNER_ID}`;

  return (
    <WidgetContainer
      className={className}
      isLoading={isLoading}
      loadingText="Uçuş arama yükleniyor..."
      minHeight="400px"
    >
      <div ref={containerRef} className="w-full min-h-[400px]" />
      {hasError && (
        <WidgetFallback
          title="Widget yüklenemedi"
          description="Doğrudan arama yapmak için aşağıdaki butonu kullanın"
          actionUrl={fallbackUrl}
          actionText="Aviasales'te Ara"
        />
      )}
    </WidgetContainer>
  );
}
