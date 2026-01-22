import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Calendar, Users, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Popular hotel destinations
const popularDestinations = [
  { name: 'İstanbul', slug: 'istanbul', flag: '🇹🇷' },
  { name: 'Antalya', slug: 'antalya', flag: '🇹🇷' },
  { name: 'Paris', slug: 'paris', flag: '🇫🇷' },
  { name: 'Barcelona', slug: 'barcelona', flag: '🇪🇸' },
  { name: 'Roma', slug: 'roma', flag: '🇮🇹' },
  { name: 'Amsterdam', slug: 'amsterdam', flag: '🇳🇱' },
  { name: 'Dubai', slug: 'dubai', flag: '🇦🇪' },
  { name: 'Tokyo', slug: 'tokyo', flag: '🇯🇵' },
];

interface HotelSearchFormProps {
  variant?: 'full' | 'compact';
  className?: string;
}

export function HotelSearchForm({ variant = 'full', className }: HotelSearchFormProps) {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | undefined>(addDays(new Date(), 7));
  const [checkOut, setCheckOut] = useState<Date | undefined>(addDays(new Date(), 9));
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  const filteredDestinations = destination.length > 0
    ? popularDestinations.filter(d => 
        d.name.toLowerCase().includes(destination.toLowerCase())
      )
    : popularDestinations;

  const handleDestinationSelect = (dest: typeof popularDestinations[0]) => {
    setDestination(dest.name);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    const selectedDest = popularDestinations.find(
      d => d.name.toLowerCase() === destination.toLowerCase()
    );
    
    if (selectedDest) {
      navigate(`/sehir/${selectedDest.slug}/oteller`);
    } else if (destination) {
      // Try to find a matching city
      const slug = destination.toLowerCase()
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/\s+/g, '-');
      navigate(`/sehir/${slug}/oteller`);
    }
  };

  const updateGuests = (type: 'adults' | 'children' | 'rooms', delta: number) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(type === 'adults' ? 1 : type === 'rooms' ? 1 : 0, prev[type] + delta)
    }));
  };

  const guestSummary = `${guests.adults} Yetişkin${guests.children > 0 ? `, ${guests.children} Çocuk` : ''}, ${guests.rooms} Oda`;

  if (variant === 'compact') {
    return (
      <div className={cn("flex flex-col sm:flex-row gap-2", className)}>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Nereye gitmek istiyorsunuz?"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10"
          />
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
              {filteredDestinations.map((dest) => (
                <button
                  key={dest.slug}
                  onClick={() => handleDestinationSelect(dest)}
                  className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-sm"
                >
                  <span>{dest.flag}</span>
                  <span>{dest.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <Button onClick={handleSearch} className="gradient-primary">
          <Search className="h-4 w-4 mr-2" />
          Ara
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("card-modern p-4 md:p-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Hotel className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-display font-semibold">Otel Ara</h3>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        {/* Destination */}
        <div className="relative md:col-span-1">
          <label className="text-xs text-muted-foreground mb-1 block">Nereye?</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Şehir seçin"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10"
            />
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
                {filteredDestinations.map((dest) => (
                  <button
                    key={dest.slug}
                    onClick={() => handleDestinationSelect(dest)}
                    className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-sm"
                  >
                    <span>{dest.flag}</span>
                    <span>{dest.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Check-in Date */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Giriş</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {checkIn ? format(checkIn, 'd MMM', { locale: tr }) : 'Tarih seç'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkIn}
                onSelect={(date) => {
                  setCheckIn(date);
                  if (date && (!checkOut || checkOut <= date)) {
                    setCheckOut(addDays(date, 2));
                  }
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out Date */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Çıkış</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {checkOut ? format(checkOut, 'd MMM', { locale: tr }) : 'Tarih seç'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => date < (checkIn || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Misafirler</label>
          <Popover open={isGuestsOpen} onOpenChange={setIsGuestsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="truncate">{guestSummary}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end">
              <div className="space-y-4">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Yetişkin</div>
                    <div className="text-xs text-muted-foreground">18+ yaş</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests('adults', -1)}
                      disabled={guests.adults <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{guests.adults}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests('adults', 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Çocuk</div>
                    <div className="text-xs text-muted-foreground">0-17 yaş</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests('children', -1)}
                      disabled={guests.children <= 0}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{guests.children}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests('children', 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Rooms */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Oda</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests('rooms', -1)}
                      disabled={guests.rooms <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{guests.rooms}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateGuests('rooms', 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => setIsGuestsOpen(false)}
                >
                  Tamam
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Search Button */}
      <Button 
        onClick={handleSearch} 
        className="w-full mt-4 gradient-primary hover:opacity-90"
        size="lg"
        disabled={!destination}
      >
        <Search className="h-4 w-4 mr-2" />
        Otel Ara
      </Button>
    </div>
  );
}