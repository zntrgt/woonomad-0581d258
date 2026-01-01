import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Plane, ArrowRight, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCityBySlug } from '@/lib/cities';
import { generateFlightRoutes, FLIGHT_DURATIONS, getAirlinesForRoute, getEstimatedPriceRange } from '@/lib/flightRoutes';
import { getCountryFlag } from '@/lib/destinations';

const CityFlights = () => {
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

  // Get all routes related to this city
  const cityRoutes = allFlightRoutes.filter(route => 
    city.airportCodes.includes(route.originCode) || 
    city.airportCodes.includes(route.destinationCode)
  );

  // Separate incoming and outgoing routes
  const incomingRoutes = cityRoutes.filter(route => 
    city.airportCodes.includes(route.destinationCode)
  );
  const outgoingRoutes = cityRoutes.filter(route => 
    city.airportCodes.includes(route.originCode)
  );

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Şehirler', href: '/sehirler' },
    { label: city.name, href: `/sehir/${city.slug}` },
    { label: 'Uçuşlar' }
  ];

  const currentYear = new Date().getFullYear();
  const flag = getCountryFlag(city.countryCode);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${city.name} Uçuşları`,
    "description": `${city.name} uçuş rotaları ve bilet fiyatları`,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": item.href ? `https://woonomad.com${item.href}` : undefined
      }))
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${city.name} Uçuşları ${currentYear} | Tüm Uçuş Rotaları ve Fiyatlar`}</title>
        <meta 
          name="description" 
          content={`${city.name} uçuş rotaları, havayolu şirketleri ve bilet fiyatları. ${city.name}'e ve ${city.name}'den tüm uçuş seçenekleri.`}
        />
        <link rel="canonical" href={`https://woonomad.com/sehir/${city.slug}/ucuslar`} />
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
                {city.name} Uçuşları
              </h1>
              <p className="text-white/80">
                {cityRoutes.length} uçuş rotası mevcut
              </p>
            </div>
          </div>
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

      {/* Incoming Routes */}
      {incomingRoutes.length > 0 && (
        <section className="py-12">
          <div className="container">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
              <Plane className="w-6 h-6 text-primary" />
              {city.name}'e Uçuşlar
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {incomingRoutes.map((route) => {
                const duration = FLIGHT_DURATIONS[route.originCode]?.[route.destinationCode];
                const airlines = getAirlinesForRoute(route.originCode, route.destinationCode);
                const priceRange = getEstimatedPriceRange(route.originCode, route.destinationCode);
                
                return (
                  <Link key={route.slug} to={`/ucus/${route.slug}`}>
                    <Card variant="elevated" className="h-full group cursor-pointer">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{route.originCode}</span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            <span className="font-bold text-lg text-primary">{route.destinationCode}</span>
                          </div>
                          {duration && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {Math.floor(duration / 60)}s {duration % 60}dk
                            </Badge>
                          )}
                        </div>
                        {airlines.length > 0 && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {airlines.slice(0, 2).join(', ')}
                            {airlines.length > 2 && ` +${airlines.length - 2}`}
                          </p>
                        )}
                        {priceRange && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Başlangıç</span>
                            <span className="font-bold text-primary">{priceRange.min}₺</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Outgoing Routes */}
      {outgoingRoutes.length > 0 && (
        <section className="py-12 section-routes">
          <div className="container">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
              <Plane className="w-6 h-6 text-primary rotate-45" />
              {city.name}'den Uçuşlar
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {outgoingRoutes.map((route) => {
                const duration = FLIGHT_DURATIONS[route.originCode]?.[route.destinationCode];
                const airlines = getAirlinesForRoute(route.originCode, route.destinationCode);
                const priceRange = getEstimatedPriceRange(route.originCode, route.destinationCode);
                
                return (
                  <Link key={route.slug} to={`/ucus/${route.slug}`}>
                    <Card variant="elevated" className="h-full group cursor-pointer">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-primary">{route.originCode}</span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            <span className="font-bold text-lg">{route.destinationCode}</span>
                          </div>
                          {duration && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {Math.floor(duration / 60)}s {duration % 60}dk
                            </Badge>
                          )}
                        </div>
                        {airlines.length > 0 && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {airlines.slice(0, 2).join(', ')}
                            {airlines.length > 2 && ` +${airlines.length - 2}`}
                          </p>
                        )}
                        {priceRange && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Başlangıç</span>
                            <span className="font-bold text-primary">{priceRange.min}₺</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SEO Content */}
      <section className="py-12">
        <div className="container">
          <Card variant="elevated">
            <CardContent className="p-8">
              <h2 className="text-2xl font-display font-bold mb-4">
                {city.name} Uçuş Rehberi
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  {city.name}, {city.country}'nın en önemli havacılık merkezlerinden biridir. 
                  {city.airportCodes.length > 1 
                    ? `${city.airportCodes.join(' ve ')} havalimanları`
                    : `${city.airportCodes[0]} havalimanı`
                  } üzerinden dünyanın birçok noktasına direkt uçuşlar mevcuttur.
                </p>
                <p>
                  Türkiye'den {city.name}'e direkt uçuşlar İstanbul, Ankara ve İzmir'den 
                  yapılmaktadır. Turkish Airlines, Pegasus ve diğer havayolu şirketleri 
                  bu rotada düzenli seferler düzenlemektedir.
                </p>
                <p>
                  En uygun {city.name} uçak biletlerini bulmak için esnek tarih arama 
                  yapmanızı ve erken rezervasyon yapmanızı öneririz. Detaylı bilet 
                  karşılaştırması için <Link to={`/sehir/${city.slug}/ucak-bileti`} className="text-primary hover:underline">
                  {city.name} uçak bileti</Link> sayfasını ziyaret edebilirsiniz.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mb-20 md:mb-0 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} WooNomad. Tüm hakları saklıdır.
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
};

export default CityFlights;
