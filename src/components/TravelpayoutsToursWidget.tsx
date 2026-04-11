import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Ticket } from 'lucide-react';

// ─── Travelpayouts Klook Widget Configuration ─────────────────
// Widget: Specific City/Category Tours (promo_id=4497)
// Program: Klook (campaign_id=137)
const TP_CONFIG = {
  shmarker: '261144',
  trs: '485218',
  campaign_id: '137',
  promo_id: '4497',
  powered_by: 'true',
};

// WooNomad şehir slug → Klook şehir adı eşlemesi
// Travelpayouts widget'ı şehir adını İngilizce bekler
const cityMapping: Record<string, string> = {
  'istanbul': 'Istanbul',
  'ankara': 'Ankara',
  'izmir': 'Izmir',
  'antalya': 'Antalya',
  'berlin': 'Berlin',
  'munih': 'Munich',
  'paris': 'Paris',
  'londra': 'London',
  'roma': 'Rome',
  'milano': 'Milan',
  'barselona': 'Barcelona',
  'madrid': 'Madrid',
  'amsterdam': 'Amsterdam',
  'atina': 'Athens',
  'dubai': 'Dubai',
  'tokyo': 'Tokyo',
  'osaka': 'Osaka',
  'bangkok': 'Bangkok',
  'singapur': 'Singapore',
  'bali': 'Bali',
  'new-york': 'New York',
  'tiflis': 'Tbilisi',
  'lizbon': 'Lisbon',
  'porto': 'Porto',
  'prag': 'Prague',
  'viyana': 'Vienna',
  'budapeste': 'Budapest',
  'varşova': 'Warsaw',
  'zagreb': 'Zagreb',
  'dubrovnik': 'Dubrovnik',
  'kopenhag': 'Copenhagen',
  'stockholm': 'Stockholm',
  'seul': 'Seoul',
  'taipei': 'Taipei',
  'kuala-lumpur': 'Kuala Lumpur',
  'ho-chi-minh': 'Ho Chi Minh City',
  'hanoi': 'Hanoi',
  'marakeş': 'Marrakech',
  'kahire': 'Cairo',
  'cape-town': 'Cape Town',
  'sydney': 'Sydney',
  'melbourne': 'Melbourne',
};

// Klook'un desteklediği şehirler (widget içerik döndürmeyebilir)
// Desteklenmeyen şehirlerde widget gizlenir
const supportedCities = new Set(Object.values(cityMapping));

interface TravelpayoutsToursWidgetProps {
  citySlug: string;
  cityNameEn?: string;
  currency?: string;
  locale?: string;
  amount?: number;
  category?: number; // 3 = tours/activities
  className?: string;
}

export function TravelpayoutsToursWidget({
  citySlug,
  cityNameEn,
  currency = 'TRY',
  locale = 'en',
  amount = 3,
  category = 3,
  className = '',
}: TravelpayoutsToursWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Resolve city name
  const resolvedCity = cityNameEn || cityMapping[citySlug];

  useEffect(() => {
    if (!resolvedCity || !containerRef.current) return;

    // Clear previous content
    const container = containerRef.current;
    container.innerHTML = '';
    setIsLoaded(false);
    setHasError(false);

    // Build widget script URL
    const params = new URLSearchParams({
      currency,
      trs: TP_CONFIG.trs,
      shmarker: TP_CONFIG.shmarker,
      locale,
      category: String(category),
      amount: String(amount),
      powered_by: TP_CONFIG.powered_by,
      campaign_id: TP_CONFIG.campaign_id,
      promo_id: TP_CONFIG.promo_id,
      city: resolvedCity,
    });

    const script = document.createElement('script');
    script.src = `https://tpemd.com/content?${params.toString()}`;
    script.charset = 'utf-8';
    script.async = true;

    script.onload = () => {
      // Widget loaded — check if content was actually rendered
      setTimeout(() => {
        if (container.children.length > 1) {
          setIsLoaded(true);
        } else {
          // Script loaded but no content for this city
          setHasError(true);
        }
      }, 2000);
    };

    script.onerror = () => {
      setHasError(true);
    };

    container.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [resolvedCity, currency, locale, amount, category]);

  // Don't render if city not supported
  if (!resolvedCity) return null;

  // Hide on error (city not in Klook)
  if (hasError) return null;

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Ticket className="h-4 w-4 text-primary" />
          Tur ve Aktiviteler
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        {!isLoaded && !hasError && (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        )}
        <div
          ref={containerRef}
          className={`travelpayouts-widget ${!isLoaded ? 'min-h-0 overflow-hidden' : ''}`}
          style={!isLoaded ? { height: 0, opacity: 0 } : { opacity: 1, transition: 'opacity 0.3s ease' }}
        />
        <p className="text-[10px] text-muted-foreground/50 mt-2 text-center">
          Klook · Affiliate bağlantı
        </p>
      </CardContent>
    </Card>
  );
}
