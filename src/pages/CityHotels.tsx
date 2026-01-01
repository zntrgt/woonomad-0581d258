import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Hotel, Star, MapPin, Wifi, Coffee, Car, Dumbbell, Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getCityBySlug } from '@/lib/cities';
import { getCountryFlag } from '@/lib/destinations';

// Sample hotel data for demonstration
const getSampleHotels = (cityName: string) => [
  {
    id: 1,
    name: `${cityName} Grand Hotel`,
    rating: 4.8,
    stars: 5,
    priceFrom: 2500,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    amenities: ['wifi', 'breakfast', 'parking', 'gym'],
    badge: 'popular',
    location: 'Şehir Merkezi'
  },
  {
    id: 2,
    name: `${cityName} Boutique Stay`,
    rating: 4.6,
    stars: 4,
    priceFrom: 1800,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
    amenities: ['wifi', 'breakfast'],
    badge: 'deal',
    location: 'Tarihi Merkez'
  },
  {
    id: 3,
    name: `${cityName} Business Hotel`,
    rating: 4.5,
    stars: 4,
    priceFrom: 1500,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
    amenities: ['wifi', 'parking', 'gym'],
    location: 'İş Merkezi'
  },
  {
    id: 4,
    name: `${cityName} Budget Inn`,
    rating: 4.2,
    stars: 3,
    priceFrom: 800,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
    amenities: ['wifi'],
    badge: 'deal',
    location: 'Havalimanı Yakını'
  },
];

const amenityIcons: Record<string, typeof Wifi> = {
  wifi: Wifi,
  breakfast: Coffee,
  parking: Car,
  gym: Dumbbell,
};

const CityHotels = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : null;
  
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

  const hotels = getSampleHotels(city.name);

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Şehirler', href: '/sehirler' },
    { label: city.name, href: `/sehir/${city.slug}` },
    { label: 'Oteller' }
  ];

  const currentYear = new Date().getFullYear();
  const flag = getCountryFlag(city.countryCode);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${city.name} Otelleri`,
    "description": `${city.name} otel fiyatları ve rezervasyon`,
    "numberOfItems": hotels.length,
    "itemListElement": hotels.map((hotel, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Hotel",
        "name": hotel.name,
        "starRating": {
          "@type": "Rating",
          "ratingValue": hotel.stars
        },
        "priceRange": `${hotel.priceFrom}₺+`
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${city.name} Otelleri ${currentYear} | En İyi Fiyat Garantisi`}</title>
        <meta 
          name="description" 
          content={`${city.name} otel rezervasyonu. ${city.country} ${city.name} en iyi oteller, fiyatlar ve kullanıcı yorumları. Online otel rezervasyonu.`}
        />
        <link rel="canonical" href={`https://woonomad.com/sehir/${city.slug}/oteller`} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="py-10 gradient-hero text-white">
        <div className="container">
          <Breadcrumb items={breadcrumbItems} className="text-white/70 mb-4" />
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{flag}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                {city.name} Otelleri
              </h1>
              <p className="text-white/80">
                {hotels.length}+ otel seçeneği
              </p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-6 bg-card/10 backdrop-blur-md rounded-2xl p-4 max-w-2xl">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder={`${city.name}'de otel ara...`}
                  className="pl-10 h-12 bg-background"
                />
              </div>
              <Button size="lg" className="h-12">
                Ara
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Button asChild variant="secondary">
              <Link to={`/sehir/${city.slug}`}>
                {city.name} Rehberi
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Link to={`/sehir/${city.slug}/ucuslar`}>
                {city.name} Uçuşları
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Hotel Listings */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">
              Öne Çıkan Oteller
            </h2>
            <Badge variant="secondary">
              {hotels.length} sonuç
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {hotels.map((hotel) => (
              <Card key={hotel.id} variant="elevated" className="overflow-hidden group cursor-pointer">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/3 card-image-hover">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      className="w-full h-48 sm:h-full object-cover"
                    />
                    {hotel.badge && (
                      <Badge 
                        variant={hotel.badge === 'popular' ? 'popular' : 'deal'} 
                        className="absolute top-3 left-3"
                      >
                        {hotel.badge === 'popular' ? 'Popüler' : 'Fırsat'}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: hotel.stars }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-warning fill-current" />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-primary fill-current" />
                        <span className="font-bold text-primary">{hotel.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      {hotel.location}
                    </div>

                    <div className="flex gap-2 mb-4">
                      {hotel.amenities.map((amenity) => {
                        const Icon = amenityIcons[amenity];
                        return Icon ? (
                          <div key={amenity} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        ) : null;
                      })}
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Gecelik başlangıç</p>
                        <p className="text-2xl font-bold text-primary">{hotel.priceFrom}₺</p>
                      </div>
                      <Button size="sm">
                        Rezervasyon
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Travelpayouts Integration Info */}
      <section className="py-12 section-routes">
        <div className="container">
          <Card variant="elevated">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Hotel className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold mb-4">
                    {city.name} Otel Rehberi
                  </h2>
                  <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p>
                      {city.name}, {city.country}'nın en çok ziyaret edilen şehirlerinden biri olarak 
                      geniş bir konaklama yelpazesi sunmaktadır. Lüks 5 yıldızlı otellerden butik 
                      otellere, ekonomik seçeneklerden apart otellere kadar her bütçeye uygun 
                      konaklama imkanları mevcuttur.
                    </p>
                    <p>
                      {city.name}'de konaklama için en popüler bölgeler şehir merkezi ve turistik 
                      alanlara yakın konumlardır. Erken rezervasyon yaparak önemli indirimler 
                      elde edebilirsiniz.
                    </p>
                    <p>
                      <strong>Travelpayouts Hotellook API</strong> entegrasyonu ile gerçek zamanlı 
                      otel fiyatları ve müsaitlik bilgilerine erişim sağlayabilirsiniz. 
                      API dökümantasyonu için: {' '}
                      <a 
                        href="https://support.travelpayouts.com/hc/en-us/articles/115000343268-Hotels-data-API" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Hotels Data API
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default CityHotels;
