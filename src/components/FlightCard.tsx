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
    <div className={cn(
      "bg-card rounded-xl overflow-hidden",
      "border border-border",
      "hover:border-primary/40 transition-colors duration-200"
    )}>
      {/* City Image Banner - simplified */}
      {cityImageUrl && !imageError && (
        <div className="relative h-28 w-full overflow-hidden">
          <img 
            src={cityImageUrl}
            alt={destCity}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          
          {/* Destination overlay on image */}
          <div className="absolute bottom-2 left-3 flex items-center gap-2">
            <span className="text-2xl">{destFlag}</span>
            <div>
              <div className="text-base font-semibold text-foreground">{destCity}</div>
              <div className="text-xs text-muted-foreground">{destCountry}</div>
            </div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 right-2 flex gap-1.5">
            {getVisaBadge(flight.visaStatus)}
            {rank && getRankBadge()}
          </div>
        </div>
      )}
      
      {/* Fallback header without image */}
      {(!cityImageUrl || imageError) && (
        <div className="px-4 pt-3 pb-2 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{destFlag}</span>
              <div>
                <div className="font-semibold text-foreground text-sm">{destCity}</div>
                <div className="text-xs text-muted-foreground">{destCountry}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {getVisaBadge(flight.visaStatus)}
              {rank && getRankBadge()}
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          {/* Airline Info */}
          <div className="flex items-center gap-3 md:w-44">
            <div className="text-2xl">{airlineName.split(' ')[0]}</div>
            <div>
              <div className="font-medium text-foreground text-sm">{airlineName.split(' ').slice(1).join(' ')}</div>
              <div className="text-xs text-muted-foreground">
                {flight.flight_number}
              </div>
            </div>
          </div>

          {/* Flight Route */}
          <div className="flex-1 flex items-center gap-4 md:gap-6">
            {/* Departure */}
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-foreground">{formattedDepartTime}</div>
              <div className="text-sm text-muted-foreground">{flight.origin}</div>
              <div className="text-xs text-muted-foreground">{formattedDepartDate}</div>
            </div>

            {/* Duration & Stops */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{durationText}</span>
              </div>
              <div className="relative w-full h-px bg-border">
                <Plane className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-primary rotate-90" />
              </div>
              <div className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                flight.transfers === 0 
                  ? "bg-success/10 text-success" 
                  : "bg-secondary/10 text-secondary"
              )}>
                {flight.transfers === 0 ? 'Direkt' : `${flight.transfers} Aktarma`}
              </div>
            </div>

            {/* Arrival (calculated based on duration) */}
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-foreground">
                {format(new Date(departureTime.getTime() + flight.duration * 60000), 'HH:mm')}
              </div>
              <div className="text-sm text-muted-foreground">{flight.destination}</div>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center gap-3 md:flex-col md:items-end">
            <div className="flex-1 md:text-right">
              <div className="text-2xl md:text-3xl font-bold text-gradient">
                ₺{flight.price.toLocaleString('tr-TR')}
              </div>
              <div className="text-xs text-muted-foreground">kişi başı</div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleFavorite}
                className={cn(
                  "h-10 w-10 rounded-full",
                  isFavorite 
                    ? "bg-destructive/10 text-destructive" 
                    : "bg-muted text-muted-foreground hover:text-destructive"
                )}
              >
                <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
              </Button>

              <Button
                onClick={handleBooking}
                className={cn(
                  "h-10 px-4 rounded-xl",
                  "bg-primary text-primary-foreground",
                  "hover:bg-primary/90 hover:scale-105",
                  "transition-all duration-300"
                )}
              >
                <span className="hidden md:inline mr-2">Satın Al</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Return flight info if available */}
        {flight.return_at && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowRight className="h-4 w-4" />
              <span>Dönüş: {format(parseISO(flight.return_at), 'd MMM HH:mm', { locale: tr })}</span>
              {flight.return_transfers !== undefined && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  flight.return_transfers === 0 
                    ? "bg-success/10 text-success" 
                    : "bg-secondary/10 text-secondary"
                )}>
                  {flight.return_transfers === 0 ? 'Direkt' : `${flight.return_transfers} Aktarma`}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
