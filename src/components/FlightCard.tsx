import { Heart, Clock, Plane, ArrowRight, ExternalLink, FileCheck, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flight } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { getDestinationInfo, getCountryFlag, getCityImageUrl } from '@/lib/destinations';
import { useState } from 'react';

interface FlightCardProps {
  flight: Flight;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  rank?: 'cheapest' | 'fastest' | 'best' | null;
}

const airlineLogos: Record<string, string> = {
  'TK': '🇹🇷 Turkish Airlines',
  'PC': '✈️ Pegasus',
  'XQ': '☀️ SunExpress',
  'XC': '🛫 Corendon',
  'AJ': '🌊 AnadoluJet',
  'LH': '🇩🇪 Lufthansa',
  'BA': '🇬🇧 British Airways',
  'AF': '🇫🇷 Air France',
  'EK': '🇦🇪 Emirates',
  'QR': '🇶🇦 Qatar Airways',
};

const getVisaBadge = (visaStatus?: string) => {
  switch (visaStatus) {
    case 'visa-free':
      return (
        <Badge variant="outline" className="bg-success/10 text-success border-success/30 gap-1">
          <FileCheck className="h-3 w-3" />
          Vizesiz
        </Badge>
      );
    case 'visa-required':
      return (
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 gap-1">
          <FileX className="h-3 w-3" />
          Vize Gerekli
        </Badge>
      );
    default:
      return null;
  }
};

export function FlightCard({ flight, isFavorite, onToggleFavorite, rank }: FlightCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const departureTime = parseISO(flight.departure_at);
  const formattedDepartDate = format(departureTime, 'd MMM', { locale: tr });
  const formattedDepartTime = format(departureTime, 'HH:mm');
  
  const durationHours = Math.floor(flight.duration / 60);
  const durationMins = flight.duration % 60;
  const durationText = `${durationHours}s ${durationMins}d`;

  const airlineName = airlineLogos[flight.airline] || `✈️ ${flight.airline}`;
  
  // Get destination info
  const destInfo = getDestinationInfo(flight.destination);
  const destFlag = destInfo ? getCountryFlag(destInfo.countryCode) : '🌍';
  const destCity = destInfo?.city || flight.destination;
  const destCountry = destInfo?.country || '';
  const cityImageUrl = destInfo ? getCityImageUrl(destInfo.city, 'small') : null;

  const getRankBadge = () => {
    switch (rank) {
      case 'cheapest':
        return <Badge className="bg-success text-success-foreground">En Ucuz</Badge>;
      case 'fastest':
        return <Badge className="bg-flight-blue text-primary-foreground">En Hızlı</Badge>;
      case 'best':
        return <Badge className="bg-flight-navy text-primary-foreground">Önerilen</Badge>;
      default:
        return null;
    }
  };

  const handleBooking = () => {
    const link = flight.affiliateLink || `https://www.aviasales.com/search/${flight.origin}${format(departureTime, 'ddMM')}${flight.destination}1`;
    window.open(link, '_blank');
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:border-primary/30 transition-colors">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        {/* Destination */}
        <div className="flex items-center gap-2 md:w-32">
          <span className="text-xl">{destFlag}</span>
          <div>
            <div className="font-medium text-foreground text-sm">{destCity}</div>
            <div className="text-xs text-muted-foreground">{destCountry}</div>
          </div>
        </div>

        {/* Times */}
        <div className="flex-1 flex items-center gap-3">
          <div className="text-center">
            <div className="text-lg font-semibold">{formattedDepartTime}</div>
            <div className="text-xs text-muted-foreground">{flight.origin}</div>
          </div>
          
          <div className="flex-1 flex flex-col items-center gap-0.5">
            <div className="text-xs text-muted-foreground">{durationText}</div>
            <div className="w-full h-px bg-border relative">
              <Plane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-primary rotate-90" />
            </div>
            <div className="text-xs text-muted-foreground">
              {flight.transfers === 0 ? 'Direkt' : `${flight.transfers} aktarma`}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold">
              {format(new Date(departureTime.getTime() + flight.duration * 60000), 'HH:mm')}
            </div>
            <div className="text-xs text-muted-foreground">{flight.destination}</div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center gap-3 md:ml-auto">
          <div className="text-right">
            <div className="text-xl font-bold text-primary">₺{flight.price.toLocaleString('tr-TR')}</div>
            <div className="text-xs text-muted-foreground">{airlineName.split(' ').slice(1).join(' ')}</div>
          </div>
          
          <Button
            onClick={handleBooking}
            size="sm"
            className="rounded-full"
          >
            Satın Al
          </Button>
        </div>
      </div>
    </div>
  );
}
