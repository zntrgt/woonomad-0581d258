import { useState, useEffect } from 'react';
import { 
  Wifi, Monitor, Armchair, Volume2, Coffee, 
  X, SlidersHorizontal, ChevronDown, ChevronUp,
  Users, Clock, Zap, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface WorkCentricFilterOptions {
  minWifiSpeed: number;
  hasErgonomicDesk: boolean | null;
  quietLevel: 'any' | 'quiet' | 'moderate' | 'lively';
  hasPowerOutlets: boolean | null;
  has24HourAccess: boolean | null;
  hasPrivateRooms: boolean | null;
  priceRange: [number, number];
  amenities: string[];
}

interface WorkCentricFiltersProps {
  maxPrice?: number;
  onFilterChange: (filters: WorkCentricFilterOptions) => void;
  resultsCount: number;
  totalCount: number;
  filterType?: 'coworking' | 'hotel' | 'cafe';
}

const workAmenities = [
  { id: 'fast-wifi', label: 'Hızlı WiFi (100+ Mbps)', icon: Zap },
  { id: 'ergonomic', label: 'Ergonomik Sandalye', icon: Armchair },
  { id: 'monitor', label: 'Harici Monitör', icon: Monitor },
  { id: 'quiet-zone', label: 'Sessiz Alan', icon: Volume2 },
  { id: 'meeting-room', label: 'Toplantı Odası', icon: Users },
  { id: 'coffee', label: 'Kahve Dahil', icon: Coffee },
  { id: '24-7', label: '24/7 Erişim', icon: Clock },
  { id: 'locker', label: 'Kilitli Dolap', icon: Shield },
];

const quietLevelOptions = [
  { value: 'any', label: 'Tümü' },
  { value: 'quiet', label: 'Sessiz' },
  { value: 'moderate', label: 'Orta' },
  { value: 'lively', label: 'Canlı' },
];

const wifiSpeedMarks = [
  { value: 0, label: 'Tümü' },
  { value: 25, label: '25+' },
  { value: 50, label: '50+' },
  { value: 100, label: '100+' },
  { value: 200, label: '200+' },
];

export function WorkCentricFilters({ 
  maxPrice = 500, 
  onFilterChange, 
  resultsCount, 
  totalCount,
  filterType = 'coworking'
}: WorkCentricFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<WorkCentricFilterOptions>({
    minWifiSpeed: 0,
    hasErgonomicDesk: null,
    quietLevel: 'any',
    hasPowerOutlets: null,
    has24HourAccess: null,
    hasPrivateRooms: null,
    priceRange: [0, maxPrice],
    amenities: [],
  });

  useEffect(() => {
    if (maxPrice > 0 && filters.priceRange[1] !== maxPrice) {
      setFilters(prev => ({ ...prev, priceRange: [0, maxPrice] }));
    }
  }, [maxPrice]);

  const handleFilterChange = (newFilters: Partial<WorkCentricFilterOptions>) => {
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
    const defaultFilters: WorkCentricFilterOptions = {
      minWifiSpeed: 0,
      hasErgonomicDesk: null,
      quietLevel: 'any',
      hasPowerOutlets: null,
      has24HourAccess: null,
      hasPrivateRooms: null,
      priceRange: [0, maxPrice],
      amenities: [],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = 
    filters.minWifiSpeed > 0 ||
    filters.hasErgonomicDesk !== null ||
    filters.quietLevel !== 'any' ||
    filters.hasPowerOutlets !== null ||
    filters.has24HourAccess !== null ||
    filters.hasPrivateRooms !== null ||
    filters.amenities.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice;

  const activeFilterCount = [
    filters.minWifiSpeed > 0,
    filters.hasErgonomicDesk !== null,
    filters.quietLevel !== 'any',
    filters.hasPowerOutlets !== null,
    filters.has24HourAccess !== null,
    filters.hasPrivateRooms !== null,
    filters.amenities.length > 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice,
  ].filter(Boolean).length;

  const getWifiSpeedLabel = (speed: number) => {
    if (speed === 0) return 'Tümü';
    return `${speed}+ Mbps`;
  };

  return (
    <div className="card-modern p-4 mb-6 border-l-4 border-l-violet-500">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
        >
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-violet-500" />
            <span>Çalışma Filtreleri</span>
          </div>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-[10px] bg-violet-100 text-violet-700">
              {activeFilterCount} Aktif
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
            {resultsCount} / {totalCount} {filterType === 'coworking' ? 'alan' : filterType === 'hotel' ? 'otel' : 'kafe'}
          </span>
        </div>
      </div>

      {/* Quick Filter Chips (always visible) */}
      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={() => handleFilterChange({ minWifiSpeed: filters.minWifiSpeed === 100 ? 0 : 100 })}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border transition-all",
            filters.minWifiSpeed >= 100
              ? "border-violet-500 bg-violet-500/10 text-violet-700"
              : "border-border hover:border-violet-500/50"
          )}
        >
          <Zap className="h-3 w-3" />
          100+ Mbps
        </button>
        <button
          onClick={() => handleFilterChange({ hasErgonomicDesk: filters.hasErgonomicDesk === true ? null : true })}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border transition-all",
            filters.hasErgonomicDesk === true
              ? "border-violet-500 bg-violet-500/10 text-violet-700"
              : "border-border hover:border-violet-500/50"
          )}
        >
          <Armchair className="h-3 w-3" />
          Ergonomik Masa
        </button>
        <button
          onClick={() => handleFilterChange({ quietLevel: filters.quietLevel === 'quiet' ? 'any' : 'quiet' })}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border transition-all",
            filters.quietLevel === 'quiet'
              ? "border-violet-500 bg-violet-500/10 text-violet-700"
              : "border-border hover:border-violet-500/50"
          )}
        >
          <Volume2 className="h-3 w-3" />
          Sessiz Ortam
        </button>
        <button
          onClick={() => handleFilterChange({ has24HourAccess: filters.has24HourAccess === true ? null : true })}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border transition-all",
            filters.has24HourAccess === true
              ? "border-violet-500 bg-violet-500/10 text-violet-700"
              : "border-border hover:border-violet-500/50"
          )}
        >
          <Clock className="h-3 w-3" />
          24/7 Erişim
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border space-y-6 animate-fade-in">
          {/* WiFi Speed Slider */}
          <div>
            <label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Wifi className="h-4 w-4 text-violet-500" />
              Minimum WiFi Hızı: {getWifiSpeedLabel(filters.minWifiSpeed)}
            </label>
            <div className="px-2">
              <Slider
                value={[filters.minWifiSpeed]}
                onValueChange={(value) => handleFilterChange({ minWifiSpeed: value[0] })}
                min={0}
                max={200}
                step={25}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                {wifiSpeedMarks.map((mark) => (
                  <span key={mark.value}>{mark.label}</span>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Video call için 50+ Mbps, büyük dosya transferi için 100+ Mbps önerilir
            </p>
          </div>

          {/* Quiet Level */}
          <div>
            <label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-violet-500" />
              Sessizlik Seviyesi
            </label>
            <div className="flex gap-2">
              {quietLevelOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange({ quietLevel: option.value as WorkCentricFilterOptions['quietLevel'] })}
                  className={cn(
                    "px-3 py-2 rounded-lg border transition-all text-sm",
                    filters.quietLevel === option.value
                      ? "border-violet-500 bg-violet-500/10 text-violet-700"
                      : "border-border hover:border-violet-500/50"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          {maxPrice > 0 && (
            <div>
              <label className="text-sm font-medium mb-3 block">
                Fiyat Aralığı: €{filters.priceRange[0]} - €{filters.priceRange[1]}/ay
              </label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => handleFilterChange({ priceRange: value as [number, number] })}
                min={0}
                max={maxPrice}
                step={50}
                className="w-full"
              />
            </div>
          )}

          {/* Work Amenities */}
          <div>
            <label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Monitor className="h-4 w-4 text-violet-500" />
              Çalışma Olanakları
            </label>
            <div className="flex flex-wrap gap-2">
              {workAmenities.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = filters.amenities.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    onClick={() => handleAmenityToggle(amenity.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
                      isSelected
                        ? "border-violet-500 bg-violet-500/10 text-violet-700"
                        : "border-border hover:border-violet-500/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {amenity.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Boolean Filters */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={() => handleFilterChange({ hasPowerOutlets: filters.hasPowerOutlets === true ? null : true })}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
                filters.hasPowerOutlets === true
                  ? "border-violet-500 bg-violet-500/10 text-violet-700"
                  : "border-border hover:border-violet-500/50"
              )}
            >
              <Zap className="h-4 w-4" />
              Priz Erişimi
            </button>
            <button
              onClick={() => handleFilterChange({ hasPrivateRooms: filters.hasPrivateRooms === true ? null : true })}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
                filters.hasPrivateRooms === true
                  ? "border-violet-500 bg-violet-500/10 text-violet-700"
                  : "border-border hover:border-violet-500/50"
              )}
            >
              <Shield className="h-4 w-4" />
              Özel Oda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
