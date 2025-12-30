import { PopularRoute } from '@/lib/types';

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
    <div className="flex flex-wrap gap-2 justify-center">
      {popularRoutes.map((route) => (
        <button
          key={`${route.origin}-${route.destination}`}
          onClick={() => onRouteSelect(route.origin, route.destination)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <span>{route.emoji}</span>
          <span>{route.destinationCity}</span>
        </button>
      ))}
    </div>
  );
}
