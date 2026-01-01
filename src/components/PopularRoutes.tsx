import { PopularRoute } from '@/lib/types';
import { getCityImageUrl } from '@/lib/destinations';
import { useState } from 'react';
import { MapPin, Sparkles } from 'lucide-react';

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
  onClick,
  index
}: { 
  destination: DestinationCard; 
  onClick: () => void;
  index: number;
}) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getCityImageUrl(destination.city, 'small');

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-muted card-image-hover animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={destination.city}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-travel-coral/20 flex items-center justify-center">
          <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">{destination.emoji}</span>
        </div>
      )}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-3 md:p-4">
        {/* Category badge */}
        <div className="flex justify-end">
          <span className={`text-[10px] md:text-xs font-semibold px-2 md:px-2.5 py-1 rounded-full backdrop-blur-sm ${
            destination.category === 'domestic' 
              ? 'bg-primary/90 text-primary-foreground' 
              : destination.category === 'visa-free'
              ? 'bg-success/90 text-success-foreground'
              : 'bg-white/20 text-white'
          }`}>
            {destination.category === 'domestic' ? '🏠 Yurt İçi' : 
             destination.category === 'visa-free' ? '✓ Vizesiz' : '📋 Vize'}
          </span>
        </div>
        
        {/* City info */}
        <div className="text-left">
          <div className="text-white font-display font-semibold text-sm md:text-base group-hover:translate-x-1 transition-transform duration-300">
            {destination.city}
          </div>
          <div className="text-white/70 text-xs md:text-sm flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {destination.country}
          </div>
        </div>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-2xl transition-colors duration-300" />
    </button>
  );
}

export function PopularRoutes({ onRouteSelect }: PopularRoutesProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm md:text-base font-display font-semibold text-foreground">Popüler Destinasyonlar</h3>
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {destinations.map((dest, index) => (
          <DestinationCardItem
            key={dest.code}
            destination={dest}
            onClick={() => onRouteSelect('IST', dest.code)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
