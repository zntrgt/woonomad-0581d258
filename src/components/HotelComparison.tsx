import { useState } from 'react';
import { Hotel as HotelType } from '@/lib/hotelTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { X, Plus, Star, Wifi, Coffee, Car, Dumbbell, Waves, Heart, Check, ExternalLink, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

const amenityIcons: Record<string, { icon: typeof Wifi; label: string }> = {
  wifi: { icon: Wifi, label: 'Wi-Fi' },
  breakfast: { icon: Coffee, label: 'Kahvaltı' },
  parking: { icon: Car, label: 'Otopark' },
  gym: { icon: Dumbbell, label: 'Fitness' },
  pool: { icon: Waves, label: 'Havuz' },
  spa: { icon: Heart, label: 'Spa' },
};

interface HotelComparisonProps {
  hotels: HotelType[];
  selectedHotels: string[];
  onToggleHotel: (hotelId: string) => void;
  onClearSelection: () => void;
}

export function HotelComparison({ hotels, selectedHotels, onToggleHotel, onClearSelection }: HotelComparisonProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const comparedHotels = hotels.filter(h => selectedHotels.includes(h.id));
  
  if (selectedHotels.length === 0) {
    return null;
  }
  
  // Find best values for highlighting
  const lowestPrice = Math.min(...comparedHotels.map(h => h.priceFrom));
  const highestRating = Math.max(...comparedHotels.map(h => h.rating));
  const mostStars = Math.max(...comparedHotels.map(h => h.stars));
  
  return (
    <>
      {/* Floating comparison bar */}
      <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
        <Card className="shadow-2xl border-primary/20 bg-card/95 backdrop-blur-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <span className="font-medium text-sm">
                {selectedHotels.length} otel seçildi
              </span>
            </div>
            
            <div className="flex -space-x-2">
              {comparedHotels.slice(0, 3).map((hotel) => (
                <div
                  key={hotel.id}
                  className="w-8 h-8 rounded-full border-2 border-background overflow-hidden"
                >
                  <img
                    src={hotel.photo || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=50'}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gradient-primary" disabled={selectedHotels.length < 2}>
                  Karşılaştır
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    Otel Karşılaştırma
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {comparedHotels.map((hotel) => (
                    <ComparisonCard
                      key={hotel.id}
                      hotel={hotel}
                      isBestPrice={hotel.priceFrom === lowestPrice}
                      isBestRating={hotel.rating === highestRating}
                      isBestStars={hotel.stars === mostStars}
                      onRemove={() => onToggleHotel(hotel.id)}
                    />
                  ))}
                </div>
                
                {/* Comparison Table */}
                <div className="mt-6 overflow-x-auto">
                  <ComparisonTable
                    hotels={comparedHotels}
                    lowestPrice={lowestPrice}
                    highestRating={highestRating}
                    mostStars={mostStars}
                  />
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

interface ComparisonCardProps {
  hotel: HotelType;
  isBestPrice: boolean;
  isBestRating: boolean;
  isBestStars: boolean;
  onRemove: () => void;
}

function ComparisonCard({ hotel, isBestPrice, isBestRating, isBestStars, onRemove }: ComparisonCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 h-6 w-6 bg-background/80 hover:bg-destructive/20"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
      
      <div className="relative aspect-video">
        <img
          src={hotel.photo || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {isBestPrice && <Badge className="bg-emerald-500 text-white text-2xs">En Uygun</Badge>}
          {isBestRating && <Badge className="bg-amber-500 text-white text-2xs">En Yüksek Puan</Badge>}
          {isBestStars && <Badge className="bg-purple-500 text-white text-2xs">En Çok Yıldız</Badge>}
        </div>
        
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="font-semibold text-white text-sm line-clamp-1">{hotel.name}</h3>
        </div>
      </div>
      
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-travel-gold text-travel-gold" />
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-3 w-3 fill-travel-gold text-travel-gold" />
            <span className="font-semibold">{hotel.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className={cn(
          "text-lg font-bold",
          isBestPrice && "text-emerald-600"
        )}>
          ₺{hotel.priceFrom.toLocaleString('tr-TR')}/gece
        </div>
        
        {hotel.link && (
          <a href={hotel.link} target="_blank" rel="noopener noreferrer sponsored">
            <Button size="sm" className="w-full gradient-primary text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              Rezervasyon
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );
}

interface ComparisonTableProps {
  hotels: HotelType[];
  lowestPrice: number;
  highestRating: number;
  mostStars: number;
}

function ComparisonTable({ hotels, lowestPrice, highestRating, mostStars }: ComparisonTableProps) {
  // Collect all unique amenities
  const allAmenities = Array.from(
    new Set(hotels.flatMap(h => h.amenities || []))
  );
  
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="text-left py-2 px-3 font-medium text-muted-foreground">Özellik</th>
          {hotels.map(hotel => (
            <th key={hotel.id} className="text-center py-2 px-3 font-medium">
              {hotel.name.length > 20 ? hotel.name.slice(0, 18) + '...' : hotel.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Price Row */}
        <tr className="border-b">
          <td className="py-2 px-3 text-muted-foreground">Fiyat</td>
          {hotels.map(hotel => (
            <td 
              key={hotel.id} 
              className={cn(
                "text-center py-2 px-3 font-semibold",
                hotel.priceFrom === lowestPrice && "text-emerald-600"
              )}
            >
              ₺{hotel.priceFrom.toLocaleString('tr-TR')}
            </td>
          ))}
        </tr>
        
        {/* Stars Row */}
        <tr className="border-b">
          <td className="py-2 px-3 text-muted-foreground">Yıldız</td>
          {hotels.map(hotel => (
            <td 
              key={hotel.id} 
              className={cn(
                "text-center py-2 px-3",
                hotel.stars === mostStars && "text-purple-600"
              )}
            >
              <div className="flex items-center justify-center gap-0.5">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-travel-gold text-travel-gold" />
                ))}
              </div>
            </td>
          ))}
        </tr>
        
        {/* Rating Row */}
        <tr className="border-b">
          <td className="py-2 px-3 text-muted-foreground">Puan</td>
          {hotels.map(hotel => (
            <td 
              key={hotel.id} 
              className={cn(
                "text-center py-2 px-3 font-semibold",
                hotel.rating === highestRating && "text-amber-600"
              )}
            >
              {hotel.rating.toFixed(1)} ({hotel.reviews})
            </td>
          ))}
        </tr>
        
        {/* Amenities Rows */}
        {allAmenities.map(amenity => {
          const amenityData = amenityIcons[amenity];
          const Icon = amenityData?.icon || Wifi;
          const label = amenityData?.label || amenity;
          
          return (
            <tr key={amenity} className="border-b">
              <td className="py-2 px-3 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
              </td>
              {hotels.map(hotel => (
                <td key={hotel.id} className="text-center py-2 px-3">
                  {hotel.amenities?.includes(amenity) ? (
                    <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground/50 mx-auto" />
                  )}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// Selection button for hotel cards
interface HotelSelectButtonProps {
  hotelId: string;
  isSelected: boolean;
  onToggle: (hotelId: string) => void;
  disabled?: boolean;
}

export function HotelSelectButton({ hotelId, isSelected, onToggle, disabled }: HotelSelectButtonProps) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(hotelId);
      }}
      disabled={disabled && !isSelected}
      className={cn(
        "h-7 text-xs",
        isSelected && "bg-primary"
      )}
    >
      {isSelected ? (
        <>
          <Check className="h-3 w-3 mr-1" />
          Seçildi
        </>
      ) : (
        <>
          <Plus className="h-3 w-3 mr-1" />
          Karşılaştır
        </>
      )}
    </Button>
  );
}
