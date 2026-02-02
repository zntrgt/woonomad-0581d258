import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Star, ChevronRight, AlertTriangle, Building2, Coffee, Globe, Users, Sun } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TripPlanner } from '@/components/TripPlanner';
import { EventCountdownList } from '@/components/EventCountdown';
import { WeatherWidget, TravelTips } from '@/components/WeatherWidget';
import { CityHotelsWidget } from '@/components/CityHotelsWidget';
import { KlookActivitiesWidget } from '@/components/KlookActivitiesWidget';
import { EsimWidget } from '@/components/EsimWidget';
import { ExchangeRateWidget } from '@/components/ExchangeRateWidget';
import { getCityBySlug, getAllCities, CityInfo } from '@/lib/cities';
import { getCountryFlag } from '@/lib/destinations';
import { nomadMetrics, coworkingSpaces } from '@/lib/nomad';
import { useCityDisplay } from '@/hooks/useCityDisplay';
import {
  CityHeroSection,
  CityQuickStats,
  CityNomadStats,
  CityNeighborhoods,
  CitySimilar,
  CityPopularSearches,
} from '@/components/city';

// Helper to check if city has sufficient data
const hasSufficientData = (city: CityInfo): boolean => {
  const hasBasicInfo = Boolean(city.description && city.description.length > 50);
  const hasHighlights = Boolean(city.highlights && city.highlights.length >= 3);
  const hasVisitInfo = Boolean(city.bestTimeToVisit && city.currency && city.language);
  return hasBasicInfo && hasHighlights && hasVisitInfo;
};

// Get similar cities based on country or region
const getSimilarCities = (currentCity: CityInfo, allCities: CityInfo[]): CityInfo[] => {
  const sameCountry = allCities.filter(c => 
    c.slug !== currentCity.slug && c.country === currentCity.country
  );
  
  const europeCountries = ['Almanya', 'Fransa', 'İtalya', 'İspanya', 'Hollanda', 'Portekiz', 'İngiltere', 'Avusturya', 'Belçika', 'Çekya', 'Macaristan', 'Polonya', 'İsviçre'];
  const asiaCountries = ['Japonya', 'Singapur', 'Tayland', 'Endonezya', 'Güney Kore', 'Tayvan', 'Vietnam', 'Malezya'];
  
  let regionCities: CityInfo[] = [];
  if (europeCountries.includes(currentCity.country)) {
    regionCities = allCities.filter(c => 
      c.slug !== currentCity.slug && 
      europeCountries.includes(c.country) && 
      c.country !== currentCity.country
    );
  } else if (asiaCountries.includes(currentCity.country)) {
    regionCities = allCities.filter(c => 
      c.slug !== currentCity.slug && 
      asiaCountries.includes(c.country) && 
      c.country !== currentCity.country
    );
  }
  
  return [...sameCountry, ...regionCities].slice(0, 6);
};

// Generate neighborhoods based on city
const getNeighborhoods = (citySlug: string): { name: string; description: string }[] => {
  const neighborhoodData: Record<string, { name: string; description: string }[]> = {
    'berlin': [
      { name: 'Kreuzberg', description: 'Alternatif kültür, gece hayatı ve çok kültürlü mutfak' },
      { name: 'Mitte', description: 'Müzeler, tarihi yerler ve lüks alışveriş' },
      { name: 'Prenzlauer Berg', description: 'Butik kafeler, parklar ve aile dostu atmosfer' },
      { name: 'Friedrichshain', description: 'Sanat galerileri, kulüpler ve genç enerji' },
      { name: 'Charlottenburg', description: 'Klasik mimari, saray ve sofistike ortam' },
    ],
    'paris': [
      { name: 'Le Marais', description: 'Tarihi sokaklar, galeriler ve trendy butikler' },
      { name: 'Saint-Germain-des-Prés', description: 'Entelektüel atmosfer, kafeler ve kitapçılar' },
      { name: 'Montmartre', description: 'Sanatçı mahallesi, panoramik manzara ve boemvari hava' },
      { name: 'Latin Quarter', description: 'Üniversiteler, canli sokaklar ve tarihi mekanlar' },
      { name: 'Belleville', description: 'Kozmopolit mahalle, sanat ve uygun fiyatlı mekanlar' },
    ],
    'londra': [
      { name: 'Shoreditch', description: 'Street art, teknoloji startup\'ları ve hipster kültürü' },
      { name: 'Soho', description: 'Tiyatrolar, barlar ve canlı gece hayatı' },
      { name: 'Camden', description: 'Alternatif pazar, canlı müzik ve eklektik atmosfer' },
      { name: 'Notting Hill', description: 'Renkli evler, antika pazarı ve şık kafeler' },
      { name: 'South Bank', description: 'Kültür merkezi, Thames manzarası ve modern sanat' },
    ],
    'barcelona': [
      { name: 'El Born', description: 'Ortaçağ sokakları, butikler ve trendy restoranlar' },
      { name: 'Gràcia', description: 'Bohem atmosfer, meydanlar ve yerel yaşam' },
      { name: 'Eixample', description: 'Modernist mimari, alışveriş ve geniş bulvarlar' },
      { name: 'Barceloneta', description: 'Plaj yaşamı, deniz ürünleri ve yaz enerjisi' },
      { name: 'Raval', description: 'Çok kültürlü, sanat merkezleri ve alternatif mekanlar' },
    ],
    'tiflis': [
      { name: 'Old Tbilisi', description: 'Tarihi merkez, dar sokaklar ve geleneksel mimari' },
      { name: 'Vake', description: 'Lüks mahalle, parklar ve modern kafeler' },
      { name: 'Saburtalo', description: 'Yerel yaşam, uygun fiyatlar ve metro erişimi' },
      { name: 'Marjanishvili', description: 'Sanat galerileri, restoranlar ve gece hayatı' },
      { name: 'Vera', description: 'Bohem atmosfer, vintage dükkanlar ve kültürel mekanlar' },
    ],
  };
  
  return neighborhoodData[citySlug] || [
    { name: 'Şehir Merkezi', description: 'Ana turistik noktalar ve kolay ulaşım' },
    { name: 'Tarihi Bölge', description: 'Kültürel miras ve yerel atmosfer' },
    { name: 'Modern Bölge', description: 'Alışveriş merkezleri ve iş alanları' },
  ];
};

const City = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : null;
  const { displayName, displayCountry } = useCityDisplay(city);
  const allCities = getAllCities();
  const currentYear = new Date().getFullYear();
  
  if (!city) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Şehir Bulunamadı</h1>
          <p className="text-muted-foreground mb-4">Aradığınız şehir mevcut değil.</p>
          <Button asChild>
            <Link to="/sehirler">Tüm Şehirlere Gözat</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const similarCities = getSimilarCities(city, allCities);
  const neighborhoods = getNeighborhoods(city.slug);
  const cityNomadData = nomadMetrics[city.slug];
  const cityCoworkings = coworkingSpaces.filter(c => c.citySlug === city.slug);
  const hasSufficient = hasSufficientData(city);
  const flag = getCountryFlag(city.countryCode);

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Şehirler', href: '/sehirler' },
    { label: displayName }
  ];

  const seoTitle = `${displayName} Seyahat Rehberi ${currentYear} | Uçuş, Otel, Nomad`;
  
  const metaDescParts = [`${displayName} seyahat rehberi.`];
  if (cityNomadData) {
    metaDescParts.push(`İnternet: ${cityNomadData.internetSpeed}, Aylık maliyet: ${cityNomadData.costOfLiving}.`);
  }
  metaDescParts.push(`${displayCountry}'da gezilecek yerler, otel ve uçuş fırsatları.`);
  const metaDescription = metaDescParts.join(' ').slice(0, 160);

  const canonicalUrl = `https://woonomad.co/sehir/${city.slug}`;

  const combinedSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "url": canonicalUrl,
      "name": seoTitle,
      "description": metaDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "City",
      "name": city.name,
      "alternateName": city.nameEn,
      "description": city.description,
      "image": city.image,
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {!hasSufficient && <meta name="robots" content="noindex, follow" />}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={city.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(combinedSchema)}</script>
      </Helmet>

      <Header />

      {/* Hero & Quick Actions */}
      <CityHeroSection
        city={city}
        displayName={displayName}
        displayCountry={displayCountry}
        flag={flag}
        currentYear={currentYear}
        breadcrumbItems={breadcrumbItems}
      />

      {/* Thin Content Warning */}
      {!hasSufficient && (
        <section className="py-3 bg-warning/10 border-b border-warning/20">
          <div className="container">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">
                <strong>{city.name}</strong> için detaylı bilgiler yakında eklenecek.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Main Content - Single Column Mobile, 2-Column Desktop */}
      <section className="py-4 md:py-6">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              
              {/* Quick Stats - Mobile Only */}
              <Card variant="elevated" className="lg:hidden">
                <CardContent className="p-4">
                  <CityQuickStats city={city} />
                </CardContent>
              </Card>

              {/* About City */}
              <Card variant="elevated">
                <CardContent className="p-4 md:p-5">
                  <h2 className="text-xl font-display font-bold mb-3">
                    {city.name} Hakkında
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {city.description}
                  </p>
                  
                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {city.highlights.slice(0, 5).map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs py-1">
                        <Star className="w-3 h-3 mr-1 text-warning" />
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Digital Nomad Stats */}
              <Card variant="elevated">
                <CardContent className="p-4 md:p-5">
                  <h2 className="text-xl font-display font-bold mb-3">
                    Dijital Göçebeler İçin
                  </h2>
                  <CityNomadStats
                    citySlug={city.slug}
                    cityName={city.name}
                    nomadData={cityNomadData}
                  />
                </CardContent>
              </Card>

              {/* Neighborhoods */}
              <Card variant="elevated">
                <CardContent className="p-4 md:p-5">
                  <h2 className="text-xl font-display font-bold mb-3">
                    En İyi Bölgeler
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {city.name}'de konaklama için popüler mahalleler:
                  </p>
                  <CityNeighborhoods
                    citySlug={city.slug}
                    cityName={city.name}
                    cityNameEn={city.nameEn}
                    neighborhoods={neighborhoods}
                  />
                </CardContent>
              </Card>

              {/* Coworking Summary */}
              <Card variant="elevated">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-display font-bold">
                      Coworking Alanları
                    </h2>
                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link to={`/sehir/${city.slug}/coworking`}>
                        Tümü <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                  
                  {cityCoworkings.length > 0 ? (
                    <div className="space-y-2">
                      {cityCoworkings.slice(0, 3).map((space) => (
                        <Link
                          key={space.slug}
                          to={`/coworking/${space.slug}`}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                              {space.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {space.neighborhood} • {space.pricing?.monthly ? `${space.pricing.monthly}${space.pricing.currency}/ay` : 'Fiyat için iletişime geçin'}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {city.name} için coworking alanları yakında eklenecek.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Nomad Guide Summary */}
              <Card variant="elevated">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-display font-bold">
                      Nomad Rehberi
                    </h2>
                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link to={`/sehir/${city.slug}/nomad`}>
                        Rehber <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    {city.name}'de uzaktan çalışmak için kapsamlı rehber.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: Coffee, label: 'WiFi\'lı kafeler' },
                      { icon: Globe, label: 'Vize bilgileri' },
                      { icon: Users, label: 'Nomad etkinlikleri' },
                      { icon: Sun, label: 'İklim rehberi' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <item.icon className="w-4 h-4 text-primary" />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Events */}
              {city.events && city.events.length > 0 && (
                <Card variant="elevated">
                  <CardContent className="p-4 md:p-5">
                    <h2 className="text-xl font-display font-bold mb-3">
                      Yaklaşan Etkinlikler
                    </h2>
                    <EventCountdownList 
                      events={city.events}
                      citySlug={city.slug}
                      cityName={city.name}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Trip Planner */}
              <TripPlanner 
                cityName={city.name} 
                cityNameEn={city.nameEn}
                country={city.country} 
              />
            </div>

            {/* Sidebar - Desktop Only */}
            <div className="hidden lg:block space-y-4">
              {/* Quick Info */}
              <Card variant="elevated" className="sticky top-20">
                <CardContent className="p-4">
                  <h3 className="text-lg font-display font-bold mb-3">
                    Hızlı Bilgiler
                  </h3>
                  <CityQuickStats city={city} layout="list" />
                </CardContent>
              </Card>

              {/* Weather */}
              <WeatherWidget cityName={city.name} citySlug={city.slug} />

              {/* Exchange Rate */}
              <ExchangeRateWidget 
                countryCode={city.countryCode} 
                currencyName={city.currency} 
              />

              {/* Klook Activities */}
              <KlookActivitiesWidget 
                citySlug={city.slug}
                cityName={city.name}
              />

              {/* Hotels Widget */}
              <CityHotelsWidget 
                citySlug={city.slug}
                cityName={city.name}
                cityNameEn={city.nameEn}
              />

              {/* eSIM */}
              <EsimWidget 
                countryCode={city.countryCode}
                countryName={city.country}
                cityName={city.name}
              />

              {/* Travel Tips */}
              <TravelTips 
                cityName={city.name}
                bestTimeToVisit={city.bestTimeToVisit}
                currency={city.currency}
                language={city.language}
              />

              {/* CTA */}
              <Card className="gradient-hero text-white border-0">
                <CardContent className="p-4 text-center">
                  <h3 className="text-lg font-display font-bold mb-2">
                    {city.name}'e Uçun
                  </h3>
                  <p className="text-white/80 text-sm mb-3">
                    En uygun biletleri karşılaştırın
                  </p>
                  <Button asChild variant="secondary" size="sm" className="w-full">
                    <Link to={`/sehir/${city.slug}/ucak-bileti`}>
                      Bilet Ara
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Searches */}
      <section className="py-4 md:py-6 bg-muted/30">
        <div className="container">
          <h2 className="text-xl font-display font-bold mb-4">
            Popüler Aramalar
          </h2>
          <CityPopularSearches citySlug={city.slug} cityName={city.name} />
        </div>
      </section>

      {/* Similar Cities */}
      {similarCities.length > 0 && (
        <section className="py-4 md:py-6">
          <div className="container">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold">
                Benzer Şehirler
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/sehirler">Tümü</Link>
              </Button>
            </div>
            <CitySimilar similarCities={similarCities} />
          </div>
        </section>
      )}

      {/* Mobile Sidebar Widgets */}
      <section className="lg:hidden py-4 space-y-4">
        <div className="container space-y-4">
          <WeatherWidget cityName={city.name} citySlug={city.slug} />
          <ExchangeRateWidget countryCode={city.countryCode} currencyName={city.currency} />
          <KlookActivitiesWidget citySlug={city.slug} cityName={city.name} />
          <CityHotelsWidget citySlug={city.slug} cityName={city.name} cityNameEn={city.nameEn} />
          <EsimWidget countryCode={city.countryCode} countryName={city.country} cityName={city.name} />
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default City;
