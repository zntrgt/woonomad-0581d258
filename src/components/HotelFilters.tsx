import { useState, useEffect } from 'react';
import { Filter, Star, Wifi, Car, Coffee, Dumbbell, Waves, Heart, X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface HotelFilterOptions {
  priceRange: [number, number];
  minStars: number;
  minRating: number;
  amenities: string[];
}

interface HotelFiltersProps {
  maxPrice: number;
  onFilterChange: (filters: HotelFilterOptions) => void;
  resultsCount: number;
  totalCount: number;
}

const amenityOptions = [
  { id: 'pool', label: 'Havuz', icon: Waves },
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'breakfast', label: 'Kahvaltı', icon: Coffee },
  { id: 'parking', label: 'Otopark', icon: Car },
  { id: 'gym', label: 'Fitness', icon: Dumbbell },
  { id: 'spa', label: 'Spa', icon: Heart },
];

export type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'stars' | 'popular';

interface SortSelectorProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelector({ value, onChange }: SortSelectorProps) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popular', label: 'Popülerlik' },
    { value: 'price-asc', label: 'Fiyat (Düşük → Yüksek)' },
    { value: 'price-desc', label: 'Fiyat (Yüksek → Düşük)' },
    { value: 'rating', label: 'Puan' },
    { value: 'stars', label: 'Yıldız' },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground hidden sm:inline">Sırala:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="text-sm bg-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export function HotelFilters({ maxPrice, onFilterChange, resultsCount, totalCount }: HotelFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<HotelFilterOptions>({
    priceRange: [0, maxPrice],
    minStars: 0,
    minRating: 0,
    amenities: [],
  });

  // Update price range when maxPrice changes
  useEffect(() => {
    if (maxPrice > 0 && filters.priceRange[1] !== maxPrice) {
      setFilters(prev => ({ ...prev, priceRange: [0, maxPrice] }));
    }
  }, [maxPrice]);

  const handleFilterChange = (newFilters: Partial<HotelFilterOptions>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleAmenityToggle = (amenityId: string) => {
    const newAmenities = filters.amenities.includes(amenityId)
      ? filters.amenities.filter(a => a !== amenityId)
      : [...filters.amenities, amenityId];
    handleFilterChange({ amenities: newAmenities });
  };

  const resetFilters = () => {
    const defaultFilters: HotelFilterOptions = {
      priceRange: [0, maxPrice],
      minStars: 0,
      minRating: 0,
      amenities: [],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = 
    filters.minStars > 0 || 
    filters.minRating > 0 || 
    filters.amenities.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice;

  return (
    <div className="card-modern p-4 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filtreler</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-[10px]">
              Aktif
            </Badge>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs">
              <X className="h-3 w-3 mr-1" />
              Temizle
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            {resultsCount} / {totalCount} otel
          </span>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-6 animate-fade-in">
          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Fiyat Aralığı: ₺{filters.priceRange[0].toLocaleString('tr-TR')} - ₺{filters.priceRange[1].toLocaleString('tr-TR')}
            </label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange({ priceRange: value as [number, number] })}
              min={0}
              max={maxPrice}
              step={100}
              className="w-full"
            />
          </div>

          {/* Star Rating */}
          <div>
            <label className="text-sm font-medium mb-3 block">Minimum Yıldız</label>
            <div className="flex gap-2">
              {[0, 3, 4, 5].map((stars) => (
                <button
                  key={stars}
                  onClick={() => handleFilterChange({ minStars: stars })}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg border transition-all text-sm",
                    filters.minStars === stars
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {stars === 0 ? (
                    'Tümü'
                  ) : (
                    <>
                      {stars}
                      <Star className="h-3 w-3 fill-travel-gold text-travel-gold" />
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* User Rating */}
          <div>
            <label className="text-sm font-medium mb-3 block">Minimum Puan</label>
            <div className="flex gap-2 flex-wrap">
              {[0, 4.0, 4.5, 4.8].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange({ minRating: rating })}
                  className={cn(
                    "px-3 py-2 rounded-lg border transition-all text-sm",
                    filters.minRating === rating
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {rating === 0 ? 'Tümü' : `${rating}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-sm font-medium mb-3 block">Özellikler</label>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = filters.amenities.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    onClick={() => handleAmenityToggle(amenity.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {amenity.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}