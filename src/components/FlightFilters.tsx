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
    <div className="space-y-4">
      {/* Sort & Filter Toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Sort Buttons */}
        <div className="flex items-center gap-1 bg-card rounded-xl p-1 border border-border/50">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground ml-2" />
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
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
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "rounded-xl border-border/50",
            isOpen && "bg-primary text-primary-foreground border-primary"
          )}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtrele
        </Button>
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className={cn(
          "bg-card rounded-2xl p-5 border border-border/50 shadow-soft",
          "animate-scale-in"
        )}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Filtreler</h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
                Sıfırla
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-3">
                Fiyat Aralığı
              </label>
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                min={0}
                max={maxPrice}
                step={100}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₺{filters.priceRange[0].toLocaleString()}</span>
                <span>₺{filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Stops */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-3">
                Aktarma Sayısı
              </label>
              <div className="flex gap-2">
                {[
                  { value: -1, label: 'Hepsi' },
                  { value: 0, label: 'Direkt' },
                  { value: 1, label: '1 Aktarma' },
                  { value: 2, label: '2+' },
                ].map((stop) => (
                  <button
                    key={stop.value}
                    onClick={() => handleStopsChange(stop.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm transition-all duration-200",
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
              <label className="block text-sm font-medium text-foreground/80 mb-3">
                Kalkış Saati
              </label>
              <Slider
                value={filters.departureTimeRange}
                onValueChange={handleDepartureTimeChange}
                min={0}
                max={24}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{filters.departureTimeRange[0].toString().padStart(2, '0')}:00</span>
                <span>{filters.departureTimeRange[1].toString().padStart(2, '0')}:00</span>
              </div>
            </div>

            {/* Airlines */}
            {availableAirlines.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-3">
                  Havayolları
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableAirlines.map((airline) => (
                    <label
                      key={airline}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={filters.airlines.length === 0 || filters.airlines.includes(airline)}
                        onCheckedChange={() => handleAirlineToggle(airline)}
                      />
                      <span className="text-sm text-foreground">
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
