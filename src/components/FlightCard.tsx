import { Plane, FileCheck, FileX, ChevronRight, Timer, ExternalLink } from 'lucide-react';
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

const airlineLogos: Record<string, { name: string; color: string; gradient: string }> = {
  'TK': { name: 'Turkish Airlines', color: 'bg-red-500', gradient: 'from-red-500 to-red-600' },
  'PC': { name: 'Pegasus', color: 'bg-yellow-500', gradient: 'from-yellow-500 to-orange-500' },
  'XQ': { name: 'SunExpress', color: 'bg-orange-500', gradient: 'from-orange-500 to-red-500' },
  'XC': { name: 'Corendon', color: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600' },
  'AJ': { name: 'AnadoluJet', color: 'bg-red-600', gradient: 'from-red-600 to-red-700' },
  'LH': { name: 'Lufthansa', color: 'bg-yellow-600', gradient: 'from-yellow-600 to-blue-900' },
  'BA': { name: 'British Airways', color: 'bg-blue-700', gradient: 'from-blue-700 to-red-700' },
  'AF': { name: 'Air France', color: 'bg-blue-600', gradient: 'from-blue-600 to-red-500' },
  'EK': { name: 'Emirates', color: 'bg-red-700', gradient: 'from-red-700 to-yellow-600' },
  'QR': { name: 'Qatar Airways', color: 'bg-purple-700', gradient: 'from-purple-700 to-purple-900' },
};

const getVisaBadge = (visaStatus?: string) => {
  switch (visaStatus) {
    case 'visa-free':
      return (
        <Badge variant="success" className="gap-1">
          <FileCheck className="h-3 w-3" />
          Vizesiz
        </Badge>
      );
    case 'visa-required':
      return (
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 gap-1">
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

  const airlineInfo = airlineLogos[flight.airline] || { name: flight.airline, color: 'bg-muted', gradient: 'from-muted to-muted-foreground/20' };
  
  // Get destination info
  const destInfo = getDestinationInfo(flight.destination);
  const destFlag = destInfo ? getCountryFlag(destInfo.countryCode) : '🌍';
  const destCity = destInfo?.city || flight.destination;
  const destCountry = destInfo?.country || '';

  const getRankBadge = () => {
    switch (rank) {
      case 'cheapest':
        return <Badge variant="success">En Ucuz</Badge>;
      case 'fastest':
        return <Badge className="bg-travel-teal text-primary-foreground">En Hızlı</Badge>;
      case 'best':
        return <Badge variant="popular">Önerilen</Badge>;
      default:
        return null;
    }
  };

  const handleBooking = () => {
    // Use the flight's link field directly if available, otherwise use affiliateLink
    if (flight.link) {
      window.open(`https://www.aviasales.com${flight.link}`, '_blank');
    } else if (flight.affiliateLink) {
      window.open(flight.affiliateLink, '_blank');
    } else {
      // Fallback: construct URL with proper format (DDMM)
      const departDateStr = format(departureTime, 'ddMM');
      const returnDateStr = flight.return_at ? format(parseISO(flight.return_at), 'ddMM') : '';
      const url = `https://www.aviasales.com/search/${flight.origin}${departDateStr}${flight.destination}${returnDateStr}1`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="card-modern group overflow-hidden">
      {/* Top gradient bar */}
      <div className={cn("h-1 bg-gradient-to-r", airlineInfo.gradient)} />
      
      <div className="p-5 md:p-6">
        {/* Header: Date, Airline, Badges */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br shadow-md",
              airlineInfo.gradient
            )}>
              {flight.airline}
            </div>
            <div>
              <div className="font-semibold text-foreground">{airlineInfo.name}</div>
              <div className="text-sm text-muted-foreground">{formattedDepartDate}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getRankBadge()}
            {getVisaBadge(flight.visaStatus)}
          </div>
        </div>

        {/* Flight Route */}
        <div className="flex items-center gap-4 mb-5">
          {/* Departure */}
          <div className="flex-1">
            <div className="text-3xl md:text-4xl font-display font-bold text-foreground">{formattedDepartTime}</div>
            <div className="text-sm text-muted-foreground font-medium">{flight.origin}</div>
          </div>
          
          {/* Flight Path Visual */}
          <div className="flex-1 flex flex-col items-center gap-2 px-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              <Timer className="h-3.5 w-3.5" />
              <span className="font-medium">{durationText}</span>
            </div>
            <div className="w-full flex items-center gap-1 relative">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-border via-primary/40 to-primary rounded-full" />
              <div className="absolute left-1/2 -translate-x-1/2 bg-card p-1.5 rounded-full border border-border">
                <Plane className="h-4 w-4 text-primary rotate-90" />
              </div>
              <div className="h-0.5 flex-1 bg-gradient-to-r from-primary to-primary/40 via-border rounded-full" />
            </div>
            <div className="text-xs font-semibold">
              {flight.transfers === 0 ? (
                <span className="text-success bg-success/10 px-2 py-0.5 rounded-full">Direkt Uçuş</span>
              ) : (
                <span className="text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{flight.transfers} aktarma</span>
              )}
            </div>
          </div>
          
          {/* Arrival */}
          <div className="flex-1 text-right">
            <div className="text-3xl md:text-4xl font-display font-bold text-foreground">{formattedArrivalTime}</div>
            <div className="text-sm text-muted-foreground font-medium flex items-center justify-end gap-1.5">
              <span className="text-base">{destFlag}</span>
              <span>{flight.destination}</span>
            </div>
          </div>
        </div>

        {/* Destination Info & Price */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{destFlag}</span>
            <div>
              <div className="font-display font-semibold text-foreground">{destCity}</div>
              <div className="text-sm text-muted-foreground">{destCountry}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl md:text-4xl font-display font-bold text-primary">
                ₺{flight.price.toLocaleString('tr-TR')}
              </div>
              <div className="text-xs text-muted-foreground">kişi başı</div>
            </div>
            
            <Button
              onClick={handleBooking}
              size="lg"
              className="rounded-xl px-6 gradient-primary hover:opacity-90 shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all btn-interactive"
            >
              <span className="font-semibold">Satın Al</span>
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
