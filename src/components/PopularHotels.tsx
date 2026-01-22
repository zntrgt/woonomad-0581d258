import { Link } from 'react-router-dom';
import { Hotel, Star, MapPin, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Popular hotel destinations with curated images
const popularHotelDestinations = [
  {
    name: 'İstanbul',
    slug: 'istanbul',
    country: 'Türkiye',
    flag: '🇹🇷',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&fit=crop',
    hotelCount: 2500,
    priceFrom: 800,
    highlight: 'Tarihi Yarımada',
  },
  {
    name: 'Antalya',
    slug: 'antalya',
    country: 'Türkiye',
    flag: '🇹🇷',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=400&fit=crop',
    hotelCount: 1800,
    priceFrom: 600,
    highlight: 'All-Inclusive',
  },
  {
    name: 'Paris',
    slug: 'paris',
    country: 'Fransa',
    flag: '🇫🇷',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
    hotelCount: 3200,
    priceFrom: 1500,
    highlight: 'Romantik',
  },
  {
    name: 'Barcelona',
    slug: 'barcelona',
    country: 'İspanya',
    flag: '🇪🇸',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop',
    hotelCount: 2100,
    priceFrom: 1200,
    highlight: 'Plaj & Şehir',
  },
  {
    name: 'Roma',
    slug: 'roma',
    country: 'İtalya',
    flag: '🇮🇹',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop',
    hotelCount: 2800,
    priceFrom: 1100,
    highlight: 'Tarihi',
  },
  {
    name: 'Dubai',
    slug: 'dubai',
    country: 'BAE',
    flag: '🇦🇪',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop',
    hotelCount: 1500,
    priceFrom: 2000,
    highlight: 'Lüks',
  },
  {
    name: 'Amsterdam',
    slug: 'amsterdam',
    country: 'Hollanda',
    flag: '🇳🇱',
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&h=400&fit=crop',
    hotelCount: 1200,
    priceFrom: 1400,
    highlight: 'Kanallar',
  },
  {
    name: 'Tokyo',
    slug: 'tokyo',
    country: 'Japonya',
    flag: '🇯🇵',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
    hotelCount: 3500,
    priceFrom: 1800,
    highlight: 'Modern & Geleneksel',
  },
];

interface PopularHotelsProps {
  className?: string;
  limit?: number;
}

export function PopularHotels({ className, limit = 8 }: PopularHotelsProps) {
  const destinations = popularHotelDestinations.slice(0, limit);

  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-3">
              <Hotel className="h-4 w-4" />
              <span>Popüler Destinasyonlar</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              En Çok Tercih Edilen <span className="text-gradient">Otel Şehirleri</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Binlerce otel arasından en uygun fiyatları karşılaştırın ve hemen rezervasyon yapın
            </p>
          </div>
          
          <Link to="/oteller" className="hidden md:flex items-center gap-2 text-primary hover:underline">
            <span>Tümünü Gör</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Destinations Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {destinations.map((dest, index) => (
            <Link
              key={dest.slug}
              to={`/sehir/${dest.slug}/oteller`}
              className="group card-modern overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={dest.image}
                  alt={`${dest.name} otelleri`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Badge */}
                <Badge 
                  variant="secondary" 
                  className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm text-xs"
                >
                  {dest.highlight}
                </Badge>
                
                {/* Price */}
                <div className="absolute bottom-3 right-3 bg-card/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-right">
                  <div className="text-[10px] text-muted-foreground">gecelik</div>
                  <div className="text-lg font-display font-bold text-primary">
                    ₺{dest.priceFrom.toLocaleString('tr-TR')}+
                  </div>
                </div>
                
                {/* City Info */}
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-lg">{dest.flag}</span>
                    <h3 className="font-display font-bold text-lg">{dest.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-white/80 text-xs">
                    <MapPin className="h-3 w-3" />
                    <span>{dest.country}</span>
                  </div>
                </div>
              </div>
              
              {/* Bottom Info */}
              <div className="p-3 flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Hotel className="h-4 w-4" />
                  <span>{dest.hotelCount.toLocaleString('tr-TR')}+ otel</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-3 w-3 fill-travel-gold text-travel-gold" />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile See All */}
        <div className="mt-6 text-center md:hidden">
          <Link to="/oteller">
            <Button variant="outline" className="gap-2">
              Tüm Şehirleri Gör
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}