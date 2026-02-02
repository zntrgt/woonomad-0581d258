import { useState } from 'react';
import { MapPin, Hotel, ExternalLink, CalendarIcon, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { getAgodaUrl, getCityEnglishName } from '@/lib/agodaMapping';

interface Neighborhood {
  name: string;
  description: string;
}

interface CityNeighborhoodsProps {
  citySlug: string;
  cityName: string;
  cityNameEn?: string;
  neighborhoods: Neighborhood[];
}

export const CityNeighborhoods = ({ 
  citySlug, 
  cityName,
  cityNameEn,
  neighborhoods 
}: CityNeighborhoodsProps) => {
  const today = new Date();
  const [checkInDate, setCheckInDate] = useState<Date>(addDays(today, 7));
  const [checkOutDate, setCheckOutDate] = useState<Date>(addDays(today, 9));
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  const checkIn = format(checkInDate, 'yyyy-MM-dd');
  const checkOut = format(checkOutDate, 'yyyy-MM-dd');

  const updateGuests = (type: 'adults' | 'children' | 'rooms', delta: number) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(type === 'adults' ? 1 : type === 'rooms' ? 1 : 0, prev[type] + delta)
    }));
  };

  const guestSummary = `${guests.adults} Yetişkin${guests.children > 0 ? `, ${guests.children} Çocuk` : ''}`;

  return (
    <div className="space-y-4">
      {/* Compact Date Selector */}
      <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-xl">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" />
              {format(checkInDate, 'd MMM', { locale: tr })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-50" align="start">
            <Calendar
              mode="single"
              selected={checkInDate}
              onSelect={(date) => {
                if (date) {
                  setCheckInDate(date);
                  if (checkOutDate <= date) {
                    setCheckOutDate(addDays(date, 2));
                  }
                }
              }}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span className="self-center text-muted-foreground">→</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" />
              {format(checkOutDate, 'd MMM', { locale: tr })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-50" align="start">
            <Calendar
              mode="single"
              selected={checkOutDate}
              onSelect={(date) => date && setCheckOutDate(date)}
              disabled={(date) => date <= checkInDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover open={isGuestsOpen} onOpenChange={setIsGuestsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 ml-auto">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs">{guestSummary}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 z-50" align="end">
            <div className="space-y-3">
              {(['adults', 'children', 'rooms'] as const).map((type) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm capitalize">
                    {type === 'adults' ? 'Yetişkin' : type === 'children' ? 'Çocuk' : 'Oda'}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateGuests(type, -1)}
                      disabled={guests[type] <= (type === 'children' ? 0 : 1)}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center text-sm">{guests[type]}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateGuests(type, 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
              <Button size="sm" className="w-full" onClick={() => setIsGuestsOpen(false)}>
                Tamam
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Neighborhoods List */}
      <div className="space-y-2">
        {neighborhoods.slice(0, 5).map((neighborhood, index) => {
          const cityEnName = getCityEnglishName(citySlug) || cityNameEn || cityName;
          const searchQuery = `${neighborhood.name} ${cityEnName}`;
          const neighborhoodUrl = getAgodaUrl(citySlug, searchQuery, checkIn, checkOut, {
            adults: guests.adults,
            rooms: guests.rooms
          });

          return (
            <a
              key={index}
              href={neighborhoodUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-primary/10 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                  {neighborhood.name}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {neighborhood.description}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <Hotel className="w-3 h-3" />
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
