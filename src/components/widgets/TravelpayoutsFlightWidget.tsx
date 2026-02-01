import { useSettings } from '@/contexts/SettingsContext';
import { format, addDays } from 'date-fns';
import { Plane, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Travelpayouts partner ID - public affiliate ID, safe to expose
const PARTNER_ID = '604466';

interface TravelpayoutsFlightWidgetProps {
  origin?: string; // IATA code (e.g., 'IST')
  destination?: string; // IATA code (e.g., 'BCN')
  subId?: string; // Tracking sub ID
  className?: string;
  oneWay?: boolean;
}

// Language mapping for Aviasales URL
const langMap: Record<string, string> = {
  tr: 'tr',
  en: 'en',
  de: 'de',
  fr: 'fr',
  es: 'es',
  ar: 'ar',
};

export function TravelpayoutsFlightWidget({
  origin = '',
  destination = '',
  subId = 'homepage',
  className,
  oneWay = false,
}: TravelpayoutsFlightWidgetProps) {
  const { language } = useSettings();

  // Calculate dynamic dates (7 days from now for departure, 14 days for return)
  const today = new Date();
  const departureDate = format(addDays(today, 7), 'ddMM');
  const returnDate = oneWay ? '' : format(addDays(today, 14), 'ddMM');

  // Build Aviasales search URL
  const searchPath = origin && destination
    ? `${origin}${departureDate}${destination}${returnDate}1`
    : '';

  const aviasalesUrl = searchPath
    ? `https://www.aviasales.${langMap[language] === 'tr' ? 'com.tr' : 'com'}/search/${searchPath}?marker=${PARTNER_ID}.${subId}`
    : `https://www.aviasales.${langMap[language] === 'tr' ? 'com.tr' : 'com'}/?marker=${PARTNER_ID}.${subId}`;

  const displayOrigin = origin || 'IST';
  const displayDestination = destination || 'Tüm Destinasyonlar';

  return (
    <div className={`relative w-full rounded-xl overflow-hidden bg-card border border-border p-6 ${className || ''}`}>
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Plane className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            {origin && destination 
              ? `${origin} → ${destination} Uçuşları`
              : 'Ucuz Uçuş Bileti Bul'}
          </h3>
          <p className="text-muted-foreground text-sm max-w-md">
            {origin && destination 
              ? `${displayOrigin} - ${displayDestination} arası en uygun fiyatlı uçuşları karşılaştırın`
              : 'Binlerce havayolu ve seyahat acentesinden en iyi fiyatları karşılaştırın'}
          </p>
        </div>

        <Button
          asChild
          size="lg"
          className="gap-2"
        >
          <a
            href={aviasalesUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            Aviasales'te Ara
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>

        <p className="text-xs text-muted-foreground">
          Aviasales ile {origin && destination ? 'bu rota için' : ''} en düşük fiyatları bulun
        </p>
      </div>
    </div>
  );
}
