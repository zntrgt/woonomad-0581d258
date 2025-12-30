import { useState } from 'react';
import { SlidersHorizontal, X, Check, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export interface FilterOptions {
  priceRange: [number, number];
  maxStops: number;
  airlines: string[];
  departureTimeRange: [number, number]; // hours 0-24
}

interface FlightFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableAirlines: string[];
  maxPrice: number;
}

type SortOption = 'price' | 'duration' | 'departure' | 'best';

interface FlightFiltersWithSortProps extends FlightFiltersProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const airlineNames: Record<string, string> = {
  'TK': 'Turkish Airlines',
  'PC': 'Pegasus',
  'XQ': 'SunExpress',
  'XC': 'Corendon',
  'AJ': 'AnadoluJet',
  'LH': 'Lufthansa',
  'BA': 'British Airways',
  'AF': 'Air France',
  'EK': 'Emirates',
  'QR': 'Qatar Airways',
};

export function FlightFilters({
  filters,
  onFiltersChange,
  availableAirlines,
  maxPrice,
  sortBy,
  onSortChange,
}: FlightFiltersWithSortProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] as [number, number] });
  };

  const handleStopsChange = (stops: number) => {
    onFiltersChange({ ...filters, maxStops: stops });
  };

  const handleAirlineToggle = (airline: string) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter(a => a !== airline)
      : [...filters.airlines, airline];
    onFiltersChange({ ...filters, airlines: newAirlines });
  };

  const handleDepartureTimeChange = (value: number[]) => {
    onFiltersChange({ ...filters, departureTimeRange: [value[0], value[1]] as [number, number] });
  };

  const resetFilters = () => {
    onFiltersChange({
      priceRange: [0, maxPrice],
      maxStops: -1,
      airlines: [],
      departureTimeRange: [0, 24],
    });
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'best', label: 'Önerilen' },
    { value: 'price', label: 'En Ucuz' },
    { value: 'duration', label: 'En Hızlı' },
    { value: 'departure', label: 'En Erken' },
  ];

  return (
    <div className="space-y-3">
      {/* Sort & Filter Toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Sort Buttons */}
        <div className="flex items-center gap-1 bg-card rounded-lg p-1 border border-border">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground ml-2" />
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                sortBy === option.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "rounded-lg h-8 text-xs",
            isOpen && "bg-primary text-primary-foreground border-primary"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
          Filtrele
        </Button>
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Filtreler</h3>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs text-muted-foreground h-7">
                Sıfırla
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7">
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Fiyat Aralığı
              </label>
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                min={0}
                max={maxPrice}
                step={100}
                className="mb-1.5"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₺{filters.priceRange[0].toLocaleString()}</span>
                <span>₺{filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Stops */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Aktarma Sayısı
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { value: -1, label: 'Hepsi' },
                  { value: 0, label: 'Direkt' },
                  { value: 1, label: '1' },
                  { value: 2, label: '2+' },
                ].map((stop) => (
                  <button
                    key={stop.value}
                    onClick={() => handleStopsChange(stop.value)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs transition-colors",
                      filters.maxStops === stop.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {stop.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Departure Time */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Kalkış Saati
              </label>
              <Slider
                value={filters.departureTimeRange}
                onValueChange={handleDepartureTimeChange}
                min={0}
                max={24}
                step={1}
                className="mb-1.5"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{filters.departureTimeRange[0].toString().padStart(2, '0')}:00</span>
                <span>{filters.departureTimeRange[1].toString().padStart(2, '0')}:00</span>
              </div>
            </div>

            {/* Airlines */}
            {availableAirlines.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Havayolları
                </label>
                <div className="space-y-1.5 max-h-28 overflow-y-auto">
                  {availableAirlines.map((airline) => (
                    <label
                      key={airline}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={filters.airlines.length === 0 || filters.airlines.includes(airline)}
                        onCheckedChange={() => handleAirlineToggle(airline)}
                      />
                      <span className="text-xs text-foreground">
                        {airlineNames[airline] || airline}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
