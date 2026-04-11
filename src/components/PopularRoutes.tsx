import { PopularRoute } from '@/lib/types';
import { useState, useMemo } from 'react';
import { MapPin, Sparkles, MapPinned } from 'lucide-react';
import { useUserLocation, AIRPORT_TO_COUNTRY } from '@/hooks/useUserLocation';
import { useTranslation } from 'react-i18next';

// Import local city images
import antalyaImg from '@/assets/cities/antalya.jpg';
import izmirImg from '@/assets/cities/izmir.jpg';
import bodrumImg from '@/assets/cities/bodrum.jpg';
import athensImg from '@/assets/cities/athens.jpg';
import tbilisiImg from '@/assets/cities/tbilisi.jpg';
import skopjeImg from '@/assets/cities/skopje.jpg';
import parisImg from '@/assets/cities/paris.jpg';
import romeImg from '@/assets/cities/rome.jpg';
import barcelonaImg from '@/assets/cities/barcelona.jpg';

// City images mapping
const cityImages: Record<string, string> = {
  'Antalya': antalyaImg,
  'İzmir': izmirImg,
  'Bodrum': bodrumImg,
  'Atina': athensImg,
  'Tiflis': tbilisiImg,
  'Üsküp': skopjeImg,
  'Paris': parisImg,
  'Roma': romeImg,
  'Barselona': barcelonaImg,
};

interface PopularRoutesProps {
  onRouteSelect: (origin: string, destination: string) => void;
}

interface DestinationCard {
  code: string;
  city: string;
  country: string;
  emoji: string;
  countryCode: string; // For visa check
}

// Static destination list (visa status will be computed dynamically)
const destinations: DestinationCard[] = [
  // Turkey
  { code: 'AYT', city: 'Antalya', country: 'Türkiye', emoji: '🏖️', countryCode: 'TR' },
  { code: 'ADB', city: 'İzmir', country: 'Türkiye', emoji: '🌊', countryCode: 'TR' },
  { code: 'BJV', city: 'Bodrum', country: 'Türkiye', emoji: '⛵', countryCode: 'TR' },
  
  // Balkans
  { code: 'ATH', city: 'Atina', country: 'Yunanistan', emoji: '🇬🇷', countryCode: 'GR' },
  { code: 'TBS', city: 'Tiflis', country: 'Gürcistan', emoji: '🇬🇪', countryCode: 'GE' },
  { code: 'SKP', city: 'Üsküp', country: 'K. Makedonya', emoji: '🇲🇰', countryCode: 'MK' },
  
  // Europe
  { code: 'CDG', city: 'Paris', country: 'Fransa', emoji: '🗼', countryCode: 'FR' },
  { code: 'FCO', city: 'Roma', country: 'İtalya', emoji: '🇮🇹', countryCode: 'IT' },
  { code: 'BCN', city: 'Barselona', country: 'İspanya', emoji: '🇪🇸', countryCode: 'ES' },
];

function DestinationCardItem({ 
  destination, 
  visaStatus,
  onClick,
  index,
  t,
}: { 
  destination: DestinationCard; 
  visaStatus: 'domestic' | 'visa-free' | 'visa-required';
  onClick: () => void;
  index: number;
  t: (key: string) => string;
}) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = cityImages[destination.city] || null;

  const getBadgeStyle = () => {
    switch (visaStatus) {
      case 'domestic':
        return 'bg-primary/90 text-primary-foreground';
      case 'visa-free':
        return 'bg-success/90 text-success-foreground';
      default:
        return 'bg-white/20 text-white';
    }
  };

  const getBadgeText = () => {
    switch (visaStatus) {
      case 'domestic':
        return `🏠 ${t('destinations.domestic')}`;
      case 'visa-free':
        return `✓ ${t('destinations.visaFree')}`;
      default:
        return `📋 ${t('destinations.visaRequired')}`;
    }
  };

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-muted card-image-hover animate-fade-in-up tap-highlight focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={destination.city}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-active:scale-100"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 flex items-center justify-center">
          <span className="text-4xl md:text-5xl group-hover:scale-110 group-active:scale-100 transition-transform duration-300">{destination.emoji}</span>
        </div>
      )}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-3 md:p-4">
        {/* Category badge */}
        <div className="flex justify-end">
          <span className={`text-2xs md:text-xs font-semibold px-2 md:px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm ${getBadgeStyle()}`}>
            {getBadgeText()}
          </span>
        </div>
        
        {/* City info */}
        <div className="text-left">
          <div className="text-white font-display font-semibold text-sm md:text-base group-hover:translate-x-1 group-active:translate-x-0 transition-transform duration-300">
            {destination.city}
          </div>
          <div className="text-white/70 text-xs md:text-sm flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {destination.country}
          </div>
        </div>
      </div>
      
      {/* Hover/focus border effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 group-focus:border-primary/50 rounded-2xl transition-colors duration-200" />
      
      {/* Active press feedback */}
      <div className="absolute inset-0 bg-black/0 group-active:bg-black/10 transition-colors duration-100 rounded-2xl" />
    </button>
  );
}

export function PopularRoutes({ onRouteSelect }: PopularRoutesProps) {
  const { t } = useTranslation();
  const { originAirport, nationality, getVisaStatus, isLoading } = useUserLocation();

  // Compute visa status for each destination based on user's nationality
  const destinationsWithVisaStatus = useMemo(() => {
    return destinations.map(dest => ({
      ...dest,
      visaStatus: getVisaStatus(dest.countryCode),
    }));
  }, [nationality, getVisaStatus]);

  // Get origin display name
  const getOriginLabel = () => {
    const airportLabels: Record<string, string> = {
      'IST': 'İstanbul',
      'FRA': 'Frankfurt',
      'LHR': 'Londra',
      'CDG': 'Paris',
      'AMS': 'Amsterdam',
      'DXB': 'Dubai',
      'JFK': 'New York',
    };
    return airportLabels[originAirport] || originAirport;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm md:text-base font-display font-semibold text-foreground">
            {t('destinations.popular')}
          </h3>
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        {!isLoading && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPinned className="h-3 w-3" />
            <span>{t('destinations.fromLocation', { location: getOriginLabel() })}</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {destinationsWithVisaStatus.map((dest, index) => (
          <DestinationCardItem
            key={dest.code}
            destination={dest}
            visaStatus={dest.visaStatus}
            onClick={() => onRouteSelect(originAirport, dest.code)}
            index={index}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}
