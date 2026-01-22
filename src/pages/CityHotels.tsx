import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Hotel, Star, Wifi, Coffee, Car, Dumbbell, Calendar, Users, ExternalLink, Loader2, ChevronRight, Waves, Heart } from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCityBySlug } from '@/lib/cities';
import { getCountryFlag } from '@/lib/destinations';
import { useHotelSearch, Hotel as HotelType } from '@/hooks/useHotelSearch';
import { HotelData, getHotelsByCity } from '@/lib/hotels';
import { HotelFilters, HotelFilterOptions, SortSelector, SortOption } from '@/components/HotelFilters';
import { format, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';

// Travelpayouts Partner ID - Hotellook affiliate
const HOTELLOOK_PARTNER_ID = "261144";

const amenityIcons: Record<string, typeof Wifi> = {
  wifi: Wifi,
  breakfast: Coffee,
  parking: Car,
  gym: Dumbbell,
  pool: Waves,
  spa: Heart,
};

// Fallback sample data with real photos
const getSampleHotels = (cityName: string): HotelType[] => {
  const hotelPhotos = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
  ];

  const hotelTypes = [
    { suffix: 'Grand Hotel', stars: 5, basePrice: 2500, amenities: ['pool', 'spa', 'gym', 'wifi', 'breakfast'] },
    { suffix: 'Boutique Stay', stars: 4, basePrice: 1800, amenities: ['wifi', 'breakfast', 'spa'] },
    { suffix: 'Business Hotel', stars: 4, basePrice: 1500, amenities: ['wifi', 'gym', 'parking', 'breakfast'] },
    { suffix: 'Budget Inn', stars: 3, basePrice: 800, amenities: ['wifi', 'parking'] },
    { suffix: 'Central Suites', stars: 4, basePrice: 1600, amenities: ['wifi', 'breakfast', 'gym'] },
    { suffix: 'Luxury Palace', stars: 5, basePrice: 3500, amenities: ['pool', 'spa', 'gym', 'wifi', 'breakfast', 'parking'] },
  ];

  return hotelTypes.map((type, index) => ({
    id: String(index + 1),
    name: `${cityName} ${type.suffix}`,
    stars: type.stars,
    priceFrom: type.basePrice + Math.floor(Math.random() * 300),
    priceAvg: Math.floor(type.basePrice * 1.2),
    rating: 4.0 + (Math.random() * 0.9),
    reviews: 150 + Math.floor(Math.random() * 1200),
    location: { lat: 0, lon: 0 },
    photo: hotelPhotos[index % hotelPhotos.length],
    amenities: type.amenities,
    link: '#',
  }));
};

// Static hotel card for hotels with detail pages
function StaticHotelCard({ hotel, citySlug }: { hotel: HotelData; citySlug: string }) {
  return (
    <Link to={`/sehir/${citySlug}/otel/${hotel.slug}`} className="block">
      <Card className="card-modern overflow-hidden group h-full">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-travel-gold text-travel-gold" />
            ))}
          </div>
          
          {hotel.priceRange && (
            <div className="absolute bottom-3 right-3">
              <div className="bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 text-right">
                <div className="text-xs text-muted-foreground">Gecelik</div>
                <div className="text-xl font-display font-bold text-primary">
                  ₺{hotel.priceRange.min.toLocaleString('tr-TR')}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {hotel.name}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            {hotel.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-travel-gold text-travel-gold" />
                <span className="font-semibold text-foreground">{hotel.rating.toFixed(1)}</span>
              </div>
            )}
            {hotel.neighborhood && <span>{hotel.neighborhood}</span>}
          </div>
          
          <div className="flex items-center text-sm text-primary font-medium">
            <span>Detayları Gör</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function HotelCard({ hotel, index }: { hotel: HotelType; index: number }) {
  const isPopular = index === 0;
  const isDeal = hotel.priceFrom < 1000;
  
  return (
    <Card className="card-modern overflow-hidden group">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={hotel.photo || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-3 left-3 flex gap-2">
          {isPopular && <Badge variant="popular">Popüler</Badge>}
          {isDeal && <Badge variant="deal">Fırsat</Badge>}
        </div>
        
        <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
          {Array.from({ length: hotel.stars }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-travel-gold text-travel-gold" />
          ))}
        </div>
        
        <div className="absolute bottom-3 right-3">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 text-right">
            <div className="text-xs text-muted-foreground">Gecelik</div>
            <div className="text-xl font-display font-bold text-primary">
              ₺{hotel.priceFrom.toLocaleString('tr-TR')}
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {hotel.name}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-travel-gold text-travel-gold" />
            <span className="font-semibold text-foreground">{hotel.rating.toFixed(1)}</span>
            <span>({hotel.reviews} yorum)</span>
          </div>
        </div>
        
        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hotel.amenities.slice(0, 4).map((amenity) => {
              const Icon = amenityIcons[amenity] || Wifi;
              return (
                <Badge key={amenity} variant="outline" className="text-[10px] px-2 py-0.5 gap-1">
                  <Icon className="h-3 w-3" />
                  <span className="hidden sm:inline capitalize">{amenity}</span>
                </Badge>
              );
            })}
            {hotel.amenities.length > 4 && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                +{hotel.amenities.length - 4}
              </Badge>
            )}
          </div>
        )}
        
        <a href={hotel.link} target="_blank" rel="noopener noreferrer sponsored">
          <Button className="w-full gradient-primary hover:opacity-90">
            <span>Rezervasyon Yap</span>
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}

const CityHotels = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : null;
  const { hotels, isLoading, error, affiliateLink, searchHotels } = useHotelSearch();
  const [hasSearched, setHasSearched] = useState(false);
  
  // Filter and sort state
  const [filters, setFilters] = useState<HotelFilterOptions>({
    priceRange: [0, 10000],
    minStars: 0,
    minRating: 0,
    amenities: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  
  // Default dates
  const checkIn = format(addDays(new Date(), 7), 'yyyy-MM-dd');
  const checkOut = format(addDays(new Date(), 9), 'yyyy-MM-dd');
  
  useEffect(() => {
    if (city && !hasSearched) {
      setHasSearched(true);
      searchHotels({
        location: city.nameEn || city.name,
        checkIn,
        checkOut,
        adults: 2,
        limit: 24,
      });
    }
  }, [city, hasSearched]);
  
  // Use API hotels if available, otherwise use sample data
  const displayHotels = hotels.length > 0 ? hotels : getSampleHotels(city?.name || 'City');
  
  // Calculate max price for filter
  const maxPrice = useMemo(() => {
    return Math.max(...displayHotels.map(h => h.priceFrom), 5000);
  }, [displayHotels]);
  
  // Apply filters and sorting
  const filteredAndSortedHotels = useMemo(() => {
    let result = displayHotels.filter(hotel => {
      // Price filter
      if (hotel.priceFrom < filters.priceRange[0] || hotel.priceFrom > filters.priceRange[1]) {
        return false;
      }
      // Stars filter
      if (filters.minStars > 0 && hotel.stars < filters.minStars) {
        return false;
      }
      // Rating filter
      if (filters.minRating > 0 && hotel.rating < filters.minRating) {
        return false;
      }
      // Amenities filter
      if (filters.amenities.length > 0 && hotel.amenities) {
        const hasAllAmenities = filters.amenities.every(a => hotel.amenities?.includes(a));
        if (!hasAllAmenities) return false;
      }
      return true;
    });
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.priceFrom - b.priceFrom;
        case 'price-desc':
          return b.priceFrom - a.priceFrom;
        case 'rating':
          return b.rating - a.rating;
        case 'stars':
          return b.stars - a.stars;
        case 'popular':
        default:
          return b.reviews - a.reviews;
      }
    });
    
    return result;
  }, [displayHotels, filters, sortBy]);
  
  if (!city) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Şehir Bulunamadı</h1>
          <Link to="/sehirler" className="text-primary hover:underline">
            Tüm Şehirlere Gözat
          </Link>
        </div>
      </div>
    );
  }

  const flag = getCountryFlag(city.countryCode);
  const currentYear = new Date().getFullYear();

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Şehirler', href: '/sehirler' },
    { label: city.name, href: `/sehir/${city.slug}` },
    { label: 'Oteller' }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${city.name} Otelleri`,
    "description": `${city.name} otel fiyatları ve rezervasyon`,
    "numberOfItems": filteredAndSortedHotels.length,
    "itemListElement": filteredAndSortedHotels.slice(0, 10).map((hotel, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Hotel",
        "name": hotel.name,
        "starRating": {
          "@type": "Rating",
          "ratingValue": hotel.stars
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": hotel.rating.toFixed(1),
          "reviewCount": hotel.reviews
        }
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>{`${city.name} Otelleri - En İyi Fiyatlarla Otel Rezervasyonu ${currentYear} | WooNomad`}</title>
        <meta 
          name="description" 
          content={`${city.name} otel fiyatları ve online rezervasyon. ${city.country}'da en iyi otelleri karşılaştırın, uygun fiyatlarla rezervasyon yapın.`}
        />
        <link rel="canonical" href={`https://woonomad.co/sehir/${city.slug}/oteller`} />
        <meta property="og:title" content={`${city.name} Otelleri | WooNomad`} />
        <meta property="og:description" content={`${city.name} otel fiyatları ve rezervasyon`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Hero Section */}
          <section className="text-center mb-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-3">
              <Hotel className="h-4 w-4" />
              <span>Otel Karşılaştırma</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              {flag} {city.name} <span className="text-gradient">Otelleri</span>
            </h1>
            
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {city.name} için en uygun otel fiyatlarını karşılaştırın
            </p>
          </section>
          
          {/* Search Info */}
          <div className="card-modern p-3 mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(checkIn), 'd MMM', { locale: tr })} - {format(new Date(checkOut), 'd MMM', { locale: tr })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>2 Yetişkin</span>
              </div>
            </div>
            
            <SortSelector value={sortBy} onChange={setSortBy} />
          </div>
          
          {/* Filters */}
          {!isLoading && (
            <HotelFilters
              maxPrice={maxPrice}
              onFilterChange={setFilters}
              resultsCount={filteredAndSortedHotels.length}
              totalCount={displayHotels.length}
            />
          )}
          
          {/* Hotellook Affiliate CTA */}
          {affiliateLink && (
            <div className="card-modern p-4 mb-6 text-center bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                <Hotel className="h-4 w-4" />
                <span>Hotellook Partner</span>
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">
                {city.name} Otellerinde En İyi Fiyatlar
              </h3>
              <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
                Hotellook üzerinden güncel otel fiyatlarını karşılaştırın ve en uygun rezervasyonu yapın
              </p>
              <a href={affiliateLink} target="_blank" rel="noopener noreferrer sponsored">
                <Button size="lg" className="gradient-primary hover:opacity-90">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Hotellook'ta Otelleri Gör
                </Button>
              </a>
            </div>
          )}
          
          {/* Hotel Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Oteller aranıyor...</p>
            </div>
          ) : filteredAndSortedHotels.length === 0 ? (
            <div className="text-center py-12 card-modern">
              <Hotel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">Otel Bulunamadı</h3>
              <p className="text-muted-foreground mb-4">
                Filtre kriterlerinize uygun otel bulunamadı. Filtreleri değiştirmeyi deneyin.
              </p>
              <Button variant="outline" onClick={() => setFilters({
                priceRange: [0, maxPrice],
                minStars: 0,
                minRating: 0,
                amenities: [],
              })}>
                Filtreleri Temizle
              </Button>
            </div>
          ) : (
            <section className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {filteredAndSortedHotels.map((hotel, index) => (
                <div 
                  key={hotel.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}
                >
                  <HotelCard hotel={hotel} index={index} />
                </div>
              ))}
            </section>
          )}
          
          {/* SEO Content */}
          <section className="card-modern p-6 mb-6">
            <h2 className="text-xl font-display font-bold mb-4">{city.name} Otel Rehberi</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                {city.name}, {city.country}'nın en popüler destinasyonlarından biri olarak her yıl milyonlarca turisti ağırlamaktadır. 
                Şehirde her bütçeye uygun konaklama seçenekleri bulunmaktadır.
              </p>
              
              <h3 className="text-xl font-display font-semibold text-foreground mt-6 mb-3">
                Konaklama İpuçları
              </h3>
              <ul className="space-y-2">
                <li>• Şehir merkezinde konaklamak ulaşım masraflarını azaltır</li>
                <li>• Erken rezervasyon ile %20-30 tasarruf sağlayabilirsiniz</li>
                <li>• Kahvaltı dahil seçenekleri değerlendirin</li>
                <li>• Hafta içi konaklamalar genellikle daha uygun</li>
              </ul>
            </div>
          </section>
          
          {/* Related Links */}
          <section className="grid md:grid-cols-2 gap-4">
            <Link to={`/sehir/${city.slug}/ucak-bileti`} className="card-modern p-6 group hover:border-primary/30">
              <h3 className="font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                ✈️ {city.name} Uçak Bileti
              </h3>
              <p className="text-sm text-muted-foreground">En uygun uçuş fiyatlarını karşılaştırın</p>
            </Link>
            <Link to={`/sehir/${city.slug}`} className="card-modern p-6 group hover:border-primary/30">
              <h3 className="font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                🏙️ {city.name} Şehir Rehberi
              </h3>
              <p className="text-sm text-muted-foreground">Gezilecek yerler ve pratik bilgiler</p>
            </Link>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border py-8 mb-20 md:mb-0 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
            © {currentYear} WooNomad. Tüm hakları saklıdır.
          </div>
        </footer>

        <MobileBottomNav />
      </div>
    </>
  );
};

export default CityHotels;