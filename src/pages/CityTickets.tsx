import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Plane, Calendar, Clock, Users, ArrowRight, TrendingDown } from 'lucide-react';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCityBySlug } from '@/lib/cities';
import { generateFlightRoutes, FLIGHT_DURATIONS, getAirlinesForRoute, getEstimatedPriceRange } from '@/lib/flightRoutes';
import { getCountryFlag } from '@/lib/destinations';

const CityTickets = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : null;
  const allFlightRoutes = generateFlightRoutes();
  
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

  // Get routes to this city from Istanbul
  const istanbulRoutes = allFlightRoutes.filter(route => 
    (route.originCode === 'IST' || route.originCode === 'SAW') && 
    city.airportCodes.includes(route.destinationCode)
  );

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Şehirler', href: '/sehirler' },
    { label: city.name, href: `/sehir/${city.slug}` },
    { label: 'Uçak Bileti' }
  ];

  const currentYear = new Date().getFullYear();
  const flag = getCountryFlag(city.countryCode);

  // Get price info for main route
  const mainRoute = istanbulRoutes[0];
  const priceRange = mainRoute ? getEstimatedPriceRange(mainRoute.originCode, mainRoute.destinationCode) : null;
  const airlines = mainRoute ? getAirlinesForRoute(mainRoute.originCode, mainRoute.destinationCode) : [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${city.name} Uçak Bileti`,
    "description": `${city.name} uçak bileti fiyatları ve sefer bilgileri`,
    "offers": priceRange ? {
      "@type": "AggregateOffer",
      "lowPrice": priceRange.min,
      "highPrice": priceRange.max,
      "priceCurrency": "TRY"
    } : undefined
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${city.name} Uçak Bileti ${currentYear} | En Ucuz Fiyatlar`}</title>
        <meta 
          name="description" 
          content={`${city.name} uçak bileti fiyatları ${priceRange ? `${priceRange.min}₺'den başlayan fiyatlarla` : ''}. ${city.country} ${city.name} ucuz uçak bileti karşılaştırma.`}
        />
        <link rel="canonical" href={`https://woonomad.com/sehir/${city.slug}/ucak-bileti`} />
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
                {city.name} Uçak Bileti
              </h1>
              <p className="text-white/80">
                {priceRange ? `${priceRange.min}₺'den başlayan fiyatlarla` : 'En uygun fiyatlar'}
              </p>
            </div>
          </div>

          {/* Price Highlight */}
          {priceRange && (
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">En Düşük Fiyat</p>
                  <p className="text-2xl font-bold">{priceRange.min}₺</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Plane className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Havayolu</p>
                  <p className="text-lg font-semibold">{airlines.slice(0, 2).join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-6">
            <Button asChild variant="secondary">
              <Link to={`/sehir/${city.slug}`}>
                {city.name} Rehberi
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Link to={`/sehir/${city.slug}/oteller`}>
                {city.name} Otelleri
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Flight Options */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-display font-bold mb-6">
            Türkiye'den {city.name} Uçuşları
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {istanbulRoutes.length > 0 ? (
              istanbulRoutes.map((route) => {
                const duration = FLIGHT_DURATIONS[route.originCode]?.[route.destinationCode];
                const routeAirlines = getAirlinesForRoute(route.originCode, route.destinationCode);
                const routePrice = getEstimatedPriceRange(route.originCode, route.destinationCode);

                return (
                  <Link key={route.slug} to={`/ucus/${route.slug}`}>
                    <Card variant="elevated" className="h-full group cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Plane className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-lg">{route.originCode}</p>
                              <p className="text-sm text-muted-foreground">
                                {route.originCode === 'IST' ? 'İstanbul' : 'Sabiha Gökçen'}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground" />
                          <div className="text-right">
                            <p className="font-bold text-lg text-primary">{route.destinationCode}</p>
                            <p className="text-sm text-muted-foreground">{city.name}</p>
                          </div>
                        </div>

                        {duration && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <Clock className="w-4 h-4" />
                            Uçuş Süresi: {Math.floor(duration / 60)}s {duration % 60}dk
                          </div>
                        )}

                        {routeAirlines.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {routeAirlines.slice(0, 3).map((airline) => (
                              <Badge key={airline} variant="secondary" className="text-xs">
                                {airline}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {routePrice && (
                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <span className="text-sm text-muted-foreground">Başlangıç fiyatı</span>
                            <span className="text-2xl font-bold text-primary">{routePrice.min}₺</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <Card variant="elevated" className="md:col-span-2 lg:col-span-3">
                <CardContent className="p-8 text-center">
                  <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-display font-bold mb-2">
                    Direkt uçuş bilgisi bulunamadı
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {city.name}'e aktarmalı uçuş seçenekleri için arama yapabilirsiniz.
                  </p>
                  <Button asChild>
                    <Link to="/">Uçuş Ara</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Booking Tips */}
      <section className="py-12 section-routes">
        <div className="container">
          <Card variant="elevated">
            <CardContent className="p-8">
              <h2 className="text-2xl font-display font-bold mb-6">
                {city.name} Uçak Bileti Alma İpuçları
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Erken Rezervasyon</h3>
                    <p className="text-sm text-muted-foreground">
                      {city.name} uçuşları için en az 2-3 ay önceden rezervasyon yaparak 
                      %30'a varan indirimler elde edebilirsiniz.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Esnek Tarihler</h3>
                    <p className="text-sm text-muted-foreground">
                      Hafta içi uçuşlar genellikle hafta sonuna göre daha uygun fiyatlıdır. 
                      Salı ve Çarşamba günleri en ekonomik seçeneklerdir.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Grup İndirimleri</h3>
                    <p className="text-sm text-muted-foreground">
                      4+ kişilik gruplar için özel fiyatlandırma seçenekleri 
                      sunulmaktadır.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Plane className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Bagaj Kontrolü</h3>
                    <p className="text-sm text-muted-foreground">
                      Düşük fiyatlı biletlerde bagaj ücreti dahil olmayabilir. 
                      Toplam maliyeti karşılaştırırken buna dikkat edin.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-12">
        <div className="container">
          <Card variant="elevated">
            <CardContent className="p-8">
              <h2 className="text-2xl font-display font-bold mb-4">
                {city.name} Uçak Bileti Fiyatları Hakkında
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  {city.name} uçak bileti fiyatları sezona, havayolu şirketine ve rezervasyon 
                  zamanına göre değişiklik göstermektedir. {priceRange && `Şu anda ${priceRange.min}₺'den 
                  başlayan fiyatlarla ${city.name}'e uçabilirsiniz.`}
                </p>
                <p>
                  {city.name}'e uçuş yapan başlıca havayolu şirketleri arasında 
                  {airlines.length > 0 ? ` ${airlines.join(', ')}` : ' Turkish Airlines, Pegasus'} 
                  bulunmaktadır. Bu havayolları düzenli seferler düzenlemekte olup, 
                  farklı bütçelere uygun bilet seçenekleri sunmaktadır.
                </p>
                <p>
                  En uygun {city.name} uçak bileti fiyatlarını yakalamak için fiyat takibi 
                  özelliğimizi kullanabilir ve fiyat düşüşlerinde anında bildirim alabilirsiniz.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default CityTickets;
