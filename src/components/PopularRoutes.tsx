import { cn } from '@/lib/utils';
import { PopularRoute } from '@/lib/types';
import { TrendingUp } from 'lucide-react';

interface PopularRoutesProps {
  onRouteSelect: (origin: string, destination: string) => void;
}

const popularRoutes: PopularRoute[] = [
  { origin: 'IST', originCity: 'İstanbul', destination: 'AYT', destinationCity: 'Antalya', emoji: '🏖️' },
  { origin: 'IST', originCity: 'İstanbul', destination: 'ADB', destinationCity: 'İzmir', emoji: '🌊' },
  { origin: 'IST', originCity: 'İstanbul', destination: 'BCN', destinationCity: 'Barselona', emoji: '🇪🇸' },
  { origin: 'IST', originCity: 'İstanbul', destination: 'ATH', destinationCity: 'Atina', emoji: '🇬🇷' },
  { origin: 'IST', originCity: 'İstanbul', destination: 'CDG', destinationCity: 'Paris', emoji: '🗼' },
  { origin: 'IST', originCity: 'İstanbul', destination: 'FCO', destinationCity: 'Roma', emoji: '🇮🇹' },
  { origin: 'SAW', originCity: 'İstanbul', destination: 'DXB', destinationCity: 'Dubai', emoji: '🏙️' },
  { origin: 'ESB', originCity: 'Ankara', destination: 'AYT', destinationCity: 'Antalya', emoji: '☀️' },
];

export function PopularRoutes({ onRouteSelect }: PopularRoutesProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Popüler Rotalar</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {popularRoutes.map((route) => (
          <button
            key={`${route.origin}-${route.destination}`}
            onClick={() => onRouteSelect(route.origin, route.destination)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm",
              "bg-card border border-border",
              "hover:border-primary hover:text-primary",
              "transition-colors duration-200"
            )}
          >
            <span>{route.emoji}</span>
            <span className="text-muted-foreground">→</span>
            <span className="font-medium">{route.destinationCity}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
