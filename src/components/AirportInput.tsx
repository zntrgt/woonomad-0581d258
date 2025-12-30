import { useState, useRef, useEffect, useMemo } from 'react';
import { Plane, MapPin, Loader2, Globe, Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAirportSearch } from '@/hooks/useAirportSearch';
import { Airport, ANYWHERE_DESTINATION, REGION_DESTINATIONS } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AirportInputProps {
  label: string;
  placeholder: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  icon?: 'origin' | 'destination';
  showAnywhereOption?: boolean;
}

export function AirportInput({
  label,
  placeholder,
  value,
  onChange,
  icon = 'origin',
  showAnywhereOption = false,
}: AirportInputProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { airports, isLoading, searchAirports, clearAirports } = useAirportSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onChange(null);
    
    if (newQuery.length >= 2) {
      searchAirports(newQuery);
      setIsOpen(true);
    } else if (showAnywhereOption && newQuery.length === 0) {
      clearAirports();
      setIsOpen(true);
    } else {
      clearAirports();
      setIsOpen(false);
    }
  };

  const handleFocus = () => {
    if (airports.length > 0) {
      setIsOpen(true);
    } else if (showAnywhereOption) {
      setIsOpen(true);
    }
  };

  const handleSelectAirport = (airport: Airport) => {
    onChange(airport);
    if (airport.code === '') {
      setQuery('Her Yere');
    } else {
      setQuery(`${airport.city} (${airport.code})`);
    }
    setIsOpen(false);
    clearAirports();
  };

  const displayValue = value 
    ? (value.code === '' ? 'Her Yere 🌍' : 
       REGION_DESTINATIONS.some(r => r.code === value.code) ? `${value.city} 🗺️` :
       `${value.city} (${value.code})`)
    : query;

  const showAnywhere = showAnywhereOption && (query.length === 0 || query.toLowerCase().includes('her'));
  
  // Filter region destinations based on query
  const matchingRegions = useMemo(() => {
    if (!showAnywhereOption) return [];
    const q = query.toLowerCase();
    if (q.length === 0) return REGION_DESTINATIONS;
    return REGION_DESTINATIONS.filter(r => 
      r.city.toLowerCase().includes(q) ||
      r.continent?.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q)
    );
  }, [query, showAnywhereOption]);

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <label className="block text-sm font-medium text-foreground/80 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full",
          icon === 'origin' ? 'bg-primary/10 text-primary' : 'bg-secondary/20 text-secondary'
        )}>
          {icon === 'origin' ? (
            <Plane className="h-4 w-4" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </div>
        <Input
          ref={inputRef}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={cn(
            "h-14 pl-14 pr-10 text-lg rounded-2xl",
            "bg-card border-border/50 shadow-soft",
            "focus:shadow-card-hover focus:border-primary/50",
            "transition-all duration-300"
          )}
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (showAnywhere || matchingRegions.length > 0 || airports.length > 0) && (
        <div className={cn(
          "absolute z-50 w-full mt-2 py-2 bg-card rounded-2xl shadow-card border border-border/50 max-h-80 overflow-y-auto",
          "animate-scale-in"
        )}>
          {/* Anywhere option */}
          {showAnywhere && (
            <button
              onClick={() => handleSelectAirport(ANYWHERE_DESTINATION)}
              className={cn(
                "w-full px-4 py-3 text-left",
                "hover:bg-accent/10 transition-colors",
                "flex items-center gap-3 border-b border-border/30"
              )}
            >
              <div className="p-2 rounded-full bg-accent/20 text-accent">
                <Globe className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground flex items-center gap-2">
                  Her Yere
                  <span className="text-lg">🌍</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Tüm destinasyonlarda en uygun fiyatları gör
                </div>
              </div>
            </button>
          )}

          {/* Region options */}
          {matchingRegions.length > 0 && (
            <>
              {matchingRegions.map((region) => (
                <button
                  key={region.code}
                  onClick={() => handleSelectAirport(region)}
                  className={cn(
                    "w-full px-4 py-3 text-left",
                    "hover:bg-accent/10 transition-colors",
                    "flex items-center gap-3"
                  )}
                >
                  <div className="p-2 rounded-full bg-secondary/20 text-secondary">
                    <Map className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      {region.name}
                      <span className="text-lg">🗺️</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {region.continent} kıtasındaki tüm destinasyonlar
                    </div>
                  </div>
                </button>
              ))}
              {airports.length > 0 && <div className="border-t border-border/30 my-1" />}
            </>
          )}
          {airports.map((airport) => (
            <button
              key={airport.code}
              onClick={() => handleSelectAirport(airport)}
              className={cn(
                "w-full px-4 py-3 text-left",
                "hover:bg-primary/5 transition-colors",
                "flex items-center gap-3"
              )}
            >
              <div className={cn(
                "p-2 rounded-full",
                icon === 'origin' ? 'bg-primary/10 text-primary' : 'bg-secondary/20 text-secondary'
              )}>
                <Plane className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground">
                  {airport.city}
                  <span className="ml-2 text-primary font-bold">{airport.code}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {airport.name}, {airport.country}
                  {airport.region && ` • ${airport.region}`}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
