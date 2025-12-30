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
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Popüler Rotalar</h3>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {popularRoutes.map((route) => (
          <button
            key={`${route.origin}-${route.destination}`}
            onClick={() => onRouteSelect(route.origin, route.destination)}
            className={cn(
              "group flex items-center gap-2 px-4 py-2 rounded-full",
              "bg-card/80 border border-border/50 backdrop-blur-sm",
              "hover:bg-primary hover:text-primary-foreground hover:border-primary",
              "transition-all duration-300 hover:scale-105 hover:shadow-glow"
            )}
          >
            <span className="text-lg">{route.emoji}</span>
            <span className="font-medium">{route.originCity}</span>
            <span className="text-muted-foreground group-hover:text-primary-foreground/70">→</span>
            <span className="font-medium">{route.destinationCity}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
