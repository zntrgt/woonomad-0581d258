import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Plane, MapPin, Clock, Calendar, CheckCircle, XCircle, 
  ChevronRight, ArrowLeft, Star, Globe 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SettingsDropdown } from '@/components/SettingsDropdown';
import { SearchForm, SearchFormRef } from '@/components/SearchForm';
import { FlightCard } from '@/components/FlightCard';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { useFavorites } from '@/hooks/useFavorites';
import { getDestinationBySlug, getPopularDestinations, SEODestination } from '@/lib/seoDestinations';
import { SearchParams, Airport } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function Destination() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const searchFormRef = useRef<SearchFormRef>(null);
  const destination = slug ? getDestinationBySlug(slug) : undefined;
  const { flights, isLoading, searchFlights } = useFlightSearch();
  const { isFavorite, toggleFavorite } = useFavorites();
  const popularDestinations = getPopularDestinations(6);

  // Auto-search on page load
  useEffect(() => {
    if (destination && searchFormRef.current) {
      const destAirport: Airport = {
        code: destination.airportCode,
        name: destination.city,
        city: destination.city,
        country: destination.country,
      };
      
      // Set destination in search form
      searchFormRef.current.setAirports(
        { code: 'IST', name: 'İstanbul Havalimanı', city: 'İstanbul', country: 'Türkiye' },
        destAirport
      );
    }
  }, [destination]);

  const handleSearch = (params: SearchParams) => {
    searchFlights(params);
  };

  if (!destination) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Helmet>
          <title>Sayfa Bulunamadı | Hafta Sonu Kaçamağı</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <h1 className="text-2xl font-bold mb-4">Destinasyon Bulunamadı</h1>
        <p className="text-muted-foreground mb-6">Aradığınız destinasyon sayfası mevcut değil.</p>
        <Button asChild>
          <Link to="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    );
  }

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.city,
    description: destination.description,
    image: destination.imageUrl,
    address: {
      '@type': 'PostalAddress',
      addressCountry: destination.countryCode,
    },
    touristType: 'Weekend travelers',
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://haftasonukacamagi.com' },
      { '@type': 'ListItem', position: 2, name: 'Destinasyonlar', item: 'https://haftasonukacamagi.com/destinasyonlar' },
      { '@type': 'ListItem', position: 3, name: destination.city, item: `https://haftasonukacamagi.com/ucak-bileti/${destination.slug}` },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{destination.city} Uçak Bileti | {destination.city} Ucuz Bilet Fiyatları | Hafta Sonu Kaçamağı</title>
        <meta 
          name="description" 
          content={`${destination.city} uçak bileti fiyatları ve en ucuz ${destination.city} biletleri. İstanbul'dan ${destination.city} hafta sonu kaçamağı için bilet ara. ${destination.description}`} 
        />
        <meta name="keywords" content={destination.keywords.join(', ')} />
        <link rel="canonical" href={`https://haftasonukacamagi.com/ucak-bileti/${destination.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${destination.city} Uçak Bileti | En Ucuz ${destination.city} Biletleri`} />
        <meta property="og:description" content={`${destination.city} uçak bileti fiyatları. İstanbul'dan ${destination.city} için hafta sonu kaçamağı fırsatları.`} />
        <meta property="og:image" content={destination.imageUrl} />
        <meta property="og:url" content={`https://haftasonukacamagi.com/ucak-bileti/${destination.slug}`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${destination.city} Uçak Bileti`} />
        <meta name="twitter:description" content={`${destination.city} için en ucuz uçak biletleri`} />
        <meta name="twitter:image" content={destination.imageUrl} />
        
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Link to="/" className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm text-foreground hidden sm:inline">Hafta Sonu Kaçamağı</span>
              </Link>
            </div>
            <SettingsDropdown />
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src={destination.imageUrl} 
            alt={`${destination.city} manzarası`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{destination.flag}</span>
                <Badge variant={destination.visaRequired ? 'destructive' : 'default'} className="gap-1">
                  {destination.visaRequired ? (
                    <><XCircle className="h-3 w-3" /> Vize Gerekli</>
                  ) : (
                    <><CheckCircle className="h-3 w-3" /> Vizesiz</>
                  )}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
                {destination.city} Uçak Bileti
              </h1>
              <p className="text-lg text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {destination.country}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Uçuş Süresi</div>
                  <div className="font-semibold">{destination.averageFlightDuration}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">En İyi Zaman</div>
                  <div className="font-semibold text-sm">{destination.bestTimeToVisit}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Globe className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Havalimanı</div>
                  <div className="font-semibold">{destination.airportCode}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Star className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Kıta</div>
                  <div className="font-semibold capitalize">{destination.continent === 'europe' ? 'Avrupa' : destination.continent === 'asia' ? 'Asya' : destination.continent}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{destination.city} Hakkında</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {destination.description}
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Görülecek Yerler</h3>
            <div className="flex flex-wrap gap-2">
              {destination.highlights.map((highlight, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {highlight}
                </Badge>
              ))}
            </div>
          </section>

          {/* Search Form */}
          <section className="mb-8 bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              {destination.city} Uçuşu Ara
            </h2>
            <SearchForm
              ref={searchFormRef}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </section>

          {/* Flight Results */}
          {flights.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">
                {destination.city} Uçuşları ({flights.length} sonuç)
              </h2>
              <div className="space-y-3">
                {flights.slice(0, 5).map((flight, index) => (
                  <FlightCard
                    key={`${flight.flight_number}-${flight.departure_at}`}
                    flight={flight}
                    isFavorite={isFavorite(flight)}
                    onToggleFavorite={() => toggleFavorite(flight)}
                    rank={index === 0 ? 'cheapest' : null}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Popular Destinations */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Diğer Popüler Destinasyonlar</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularDestinations
                .filter(d => d.slug !== destination.slug)
                .slice(0, 6)
                .map((dest) => (
                  <Link
                    key={dest.slug}
                    to={`/ucak-bileti/${dest.slug}`}
                    className="group relative rounded-xl overflow-hidden aspect-square"
                  >
                    <img 
                      src={dest.imageUrl} 
                      alt={dest.city}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <div className="text-lg font-semibold">{dest.flag} {dest.city}</div>
                      <div className="text-xs opacity-80">{dest.country}</div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>

          {/* SEO Content */}
          <section className="mt-12 prose prose-lg max-w-none">
            <h2>{destination.city} Uçak Bileti Fiyatları</h2>
            <p>
              İstanbul'dan {destination.city} uçak bileti arayanlar için en uygun fiyatlı seçenekleri sunuyoruz. 
              {destination.city} {destination.country} için hafta sonu kaçamağı planlayanlar, 
              sitemiz üzerinden güncel uçuş fiyatlarını karşılaştırabilir ve en ucuz {destination.city} biletini bulabilir.
            </p>
            
            <h3>İstanbul - {destination.city} Uçuş Bilgileri</h3>
            <ul>
              <li>Ortalama uçuş süresi: {destination.averageFlightDuration}</li>
              <li>Varış havalimanı: {destination.airportCode}</li>
              <li>Vize durumu: {destination.visaRequired ? 'Vize gerekli' : 'Vizesiz giriş'}</li>
              <li>En uygun seyahat zamanı: {destination.bestTimeToVisit}</li>
            </ul>
            
            <h3>{destination.city} Ucuz Uçak Bileti İpuçları</h3>
            <p>
              {destination.city} için en ucuz uçak biletlerini bulmak istiyorsanız, 
              hafta içi günleri tercih etmenizi ve biletinizi en az 2-3 hafta önceden almanızı öneririz.
              Esnek tarih arama özelliğimizi kullanarak farklı günlerdeki fiyatları karşılaştırabilirsiniz.
            </p>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-muted border-t border-border py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© 2024 Hafta Sonu Kaçamağı. Tüm hakları saklıdır.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
