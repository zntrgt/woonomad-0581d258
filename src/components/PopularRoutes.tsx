import { PopularRoute } from '@/lib/types';
import { getCityImageUrl } from '@/lib/destinations';
import { useState } from 'react';

interface PopularRoutesProps {
  onRouteSelect: (origin: string, destination: string) => void;
}

interface DestinationCard {
  code: string;
  city: string;
  country: string;
  emoji: string;
  category: 'domestic' | 'visa-free' | 'visa-required';
}

const destinations: DestinationCard[] = [
  // Yurt İçi (3)
  { code: 'AYT', city: 'Antalya', country: 'Türkiye', emoji: '🏖️', category: 'domestic' },
  { code: 'ADB', city: 'İzmir', country: 'Türkiye', emoji: '🌊', category: 'domestic' },
  { code: 'BJV', city: 'Bodrum', country: 'Türkiye', emoji: '⛵', category: 'domestic' },
  
  // Vizesiz Yurtdışı (3)
  { code: 'ATH', city: 'Atina', country: 'Yunanistan', emoji: '🇬🇷', category: 'visa-free' },
  { code: 'TBS', city: 'Tiflis', country: 'Gürcistan', emoji: '🇬🇪', category: 'visa-free' },
  { code: 'SKP', city: 'Üsküp', country: 'K. Makedonya', emoji: '🇲🇰', category: 'visa-free' },
  
  // Vizeli Yurtdışı (3)
  { code: 'CDG', city: 'Paris', country: 'Fransa', emoji: '🗼', category: 'visa-required' },
  { code: 'FCO', city: 'Roma', country: 'İtalya', emoji: '🇮🇹', category: 'visa-required' },
  { code: 'BCN', city: 'Barselona', country: 'İspanya', emoji: '🇪🇸', category: 'visa-required' },
];

function DestinationCardItem({ 
  destination, 
  onClick 
}: { 
  destination: DestinationCard; 
  onClick: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getCityImageUrl(destination.city, 'small');

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl aspect-[4/3] bg-muted transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
    >
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={destination.city}
          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <span className="text-3xl md:text-4xl">{destination.emoji}</span>
        </div>
      )}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      {/* City name */}
      <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 text-left">
        <div className="text-white font-medium text-xs md:text-sm">{destination.city}</div>
        <div className="text-white/70 text-[10px] md:text-xs">{destination.country}</div>
      </div>
      
      {/* Category badge */}
      <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2">
        <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full ${
          destination.category === 'domestic' 
            ? 'bg-primary text-primary-foreground' 
            : destination.category === 'visa-free'
            ? 'bg-success text-success-foreground'
            : 'bg-muted text-muted-foreground'
        }`}>
          {destination.category === 'domestic' ? 'Yurt İçi' : 
           destination.category === 'visa-free' ? 'Vizesiz' : 'Vize'}
        </span>
      </div>
    </button>
  );
}

export function PopularRoutes({ onRouteSelect }: PopularRoutesProps) {
  return (
    <div className="w-full">
      <h3 className="text-xs md:text-sm text-muted-foreground text-center mb-3 md:mb-4">Popüler Destinasyonlar</h3>
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {destinations.map((dest) => (
          <DestinationCardItem
            key={dest.code}
            destination={dest}
            onClick={() => onRouteSelect('IST', dest.code)}
          />
        ))}
      </div>
    </div>
  );
}