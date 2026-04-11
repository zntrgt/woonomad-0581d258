import { useTranslation } from 'react-i18next';
import { useUserLocation, AIRPORT_TO_COUNTRY } from '@/hooks/useUserLocation';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PopularRouteChipsProps {
  onSelect: (destinationCode: string) => void;
  className?: string;
}

interface RouteChip {
  code: string;
  city: string;
  emoji: string;
  countryCode: string;
}

// Popular destination routes
const popularRoutes: RouteChip[] = [
  { code: 'AYT', city: 'Antalya', emoji: '🏖️', countryCode: 'TR' },
  { code: 'ADB', city: 'İzmir', emoji: '🌊', countryCode: 'TR' },
  { code: 'ATH', city: 'Atina', emoji: '🇬🇷', countryCode: 'GR' },
  { code: 'TBS', city: 'Tiflis', emoji: '🇬🇪', countryCode: 'GE' },
  { code: 'BCN', city: 'Barselona', emoji: '🇪🇸', countryCode: 'ES' },
  { code: 'FCO', city: 'Roma', emoji: '🇮🇹', countryCode: 'IT' },
  { code: 'CDG', city: 'Paris', emoji: '🇫🇷', countryCode: 'FR' },
  { code: 'DXB', city: 'Dubai', emoji: '🇦🇪', countryCode: 'AE' },
];

export function PopularRouteChips({ onSelect, className }: PopularRouteChipsProps) {
  const { t } = useTranslation();
  const { nationality, getVisaStatus } = useUserLocation();

  const getBadgeColor = (countryCode: string) => {
    const status = getVisaStatus(countryCode);
    switch (status) {
      case 'domestic':
        return 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20';
      case 'visa-free':
        return 'bg-success/10 text-success border-success/20 hover:bg-success/20';
      default:
        return 'bg-muted text-muted-foreground border-border hover:bg-muted/80';
    }
  };

  const getStatusIcon = (countryCode: string) => {
    const status = getVisaStatus(countryCode);
    switch (status) {
      case 'domestic':
        return '🏠';
      case 'visa-free':
        return '✓';
      default:
        return '';
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="h-3 w-3" />
        <span>{t('search.popularRoutes', 'Popüler Rotalar')}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {popularRoutes.map((route) => (
          <button
            key={route.code}
            onClick={() => onSelect(route.code)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all',
              getBadgeColor(route.countryCode)
            )}
          >
            <span>{route.emoji}</span>
            <span>{route.city}</span>
            {getStatusIcon(route.countryCode) && (
              <span className="text-2xs">{getStatusIcon(route.countryCode)}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
