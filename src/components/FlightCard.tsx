import { Plane, FileCheck, FileX, ChevronRight, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flight } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { getDestinationInfo, getCountryFlag } from '@/lib/destinations';

interface FlightCardProps {
  flight: Flight;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  rank?: 'cheapest' | 'fastest' | 'best' | null;
}

const airlineLogos: Record<string, { name: string; color: string }> = {
  'TK': { name: 'Turkish Airlines', color: 'bg-red-500' },
  'PC': { name: 'Pegasus', color: 'bg-yellow-500' },
  'XQ': { name: 'SunExpress', color: 'bg-orange-500' },
  'XC': { name: 'Corendon', color: 'bg-blue-500' },
  'AJ': { name: 'AnadoluJet', color: 'bg-red-600' },
  'LH': { name: 'Lufthansa', color: 'bg-yellow-600' },
  'BA': { name: 'British Airways', color: 'bg-blue-700' },
  'AF': { name: 'Air France', color: 'bg-blue-600' },
  'EK': { name: 'Emirates', color: 'bg-red-700' },
  'QR': { name: 'Qatar Airways', color: 'bg-purple-700' },
};

const getVisaBadge = (visaStatus?: string) => {
  switch (visaStatus) {
    case 'visa-free':
      return (
        <Badge variant="outline" className="bg-success/10 text-success border-success/30 gap-1 text-xs">
          <FileCheck className="h-3 w-3" />
          Vizesiz
        </Badge>
      );
    case 'visa-required':
      return (
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 gap-1 text-xs">
          <FileX className="h-3 w-3" />
          Vize
        </Badge>
      );
    default:
      return null;
  }
};

export function FlightCard({ flight, isFavorite, onToggleFavorite, rank }: FlightCardProps) {
  const departureTime = parseISO(flight.departure_at);
  const formattedDepartDate = format(departureTime, 'd MMM EEEE', { locale: tr });
  const formattedDepartTime = format(departureTime, 'HH:mm');
  const arrivalTime = new Date(departureTime.getTime() + flight.duration * 60000);
  const formattedArrivalTime = format(arrivalTime, 'HH:mm');
  
  const durationHours = Math.floor(flight.duration / 60);
  const durationMins = flight.duration % 60;
  const durationText = `${durationHours}s ${durationMins}d`;

  const airlineInfo = airlineLogos[flight.airline] || { name: flight.airline, color: 'bg-muted' };
  
  // Get destination info
  const destInfo = getDestinationInfo(flight.destination);
  const destFlag = destInfo ? getCountryFlag(destInfo.countryCode) : '🌍';
  const destCity = destInfo?.city || flight.destination;
  const destCountry = destInfo?.country || '';

  const getRankBadge = () => {
    switch (rank) {
      case 'cheapest':
        return <Badge className="bg-success text-success-foreground text-xs">En Ucuz</Badge>;
      case 'fastest':
        return <Badge className="bg-flight-blue text-primary-foreground text-xs">En Hızlı</Badge>;
      case 'best':
        return <Badge className="bg-flight-navy text-primary-foreground text-xs">Önerilen</Badge>;
      default:
        return null;
    }
  };

  const handleBooking = () => {
    const link = flight.affiliateLink || `https://www.aviasales.com/search/${flight.origin}${format(departureTime, 'ddMM')}${flight.destination}1`;
    window.open(link, '_blank');
  };

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      {/* Top gradient bar */}
      <div className={cn("h-1", airlineInfo.color)} />
      
      <div className="p-4 md:p-5">
        {/* Header: Date, Airline, Badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm", airlineInfo.color)}>
              {flight.airline}
            </div>
            <div>
              <div className="font-medium text-sm text-foreground">{airlineInfo.name}</div>
              <div className="text-xs text-muted-foreground">{formattedDepartDate}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getRankBadge()}
            {getVisaBadge(flight.visaStatus)}
          </div>
        </div>

        {/* Flight Route */}
        <div className="flex items-center gap-4 mb-4">
          {/* Departure */}
          <div className="flex-1">
            <div className="text-2xl md:text-3xl font-bold text-foreground">{formattedDepartTime}</div>
            <div className="text-sm text-muted-foreground">{flight.origin}</div>
          </div>
          
          {/* Flight Path Visual */}
          <div className="flex-1 flex flex-col items-center gap-1 px-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Timer className="h-3 w-3" />
              {durationText}
            </div>
            <div className="w-full flex items-center gap-1">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/20 to-primary/60 rounded-full" />
              <Plane className="h-4 w-4 text-primary rotate-90 -mx-1" />
              <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/60 to-primary/20 rounded-full" />
            </div>
            <div className="text-xs font-medium text-center">
              {flight.transfers === 0 ? (
                <span className="text-success">Direkt Uçuş</span>
              ) : (
                <span className="text-muted-foreground">{flight.transfers} aktarma</span>
              )}
            </div>
          </div>
          
          {/* Arrival */}
          <div className="flex-1 text-right">
            <div className="text-2xl md:text-3xl font-bold text-foreground">{formattedArrivalTime}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-end gap-1">
              <span>{destFlag}</span>
              <span>{flight.destination}</span>
            </div>
          </div>
        </div>

        {/* Destination Info & Price */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{destFlag}</span>
            <div>
              <div className="font-semibold text-foreground">{destCity}</div>
              <div className="text-xs text-muted-foreground">{destCountry}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-bold text-primary">
                ₺{flight.price.toLocaleString('tr-TR')}
              </div>
              <div className="text-xs text-muted-foreground">kişi başı</div>
            </div>
            
            <Button
              onClick={handleBooking}
              className="rounded-full px-5 group-hover:scale-105 transition-transform"
            >
              <span>Satın Al</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}