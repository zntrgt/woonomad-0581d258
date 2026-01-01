import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { 
  Plane, 
  Hotel, 
  MapPin, 
  Clock, 
  Globe, 
  Users, 
  Banknote, 
  Languages, 
  Calendar,
  Star,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCityBySlug } from '@/lib/cities';
import { generateFlightRoutes } from '@/lib/flightRoutes';
import { getCountryFlag } from '@/lib/destinations';

const City = () => {
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

  // Get related flight routes
  const relatedRoutes = allFlightRoutes.filter(route => 
    city.airportCodes.includes(route.originCode) || 
    city.airportCodes.includes(route.destinationCode)
  ).slice(0, 6);

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Şehirler', href: '/sehirler' },
    { label: city.name }
  ];

  const currentYear = new Date().getFullYear();
  const flag = getCountryFlag(city.countryCode);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "City",
    "name": city.name,
    "alternateName": city.nameEn,
    "containedInPlace": {
      "@type": "Country",
      "name": city.country
    },
    "description": city.description,
    "image": city.image,
    "touristType": ["Family", "Couples", "Solo travelers", "Business travelers"]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${city.name} Seyahat Rehberi ${currentYear} | Uçuşlar, Oteller ve Gezi Bilgileri`}</title>
        <meta 
          name="description" 
          content={`${city.name} seyahat rehberi. ${city.country} ${city.name} uçak bileti fiyatları, otel rezervasyonu, gezilecek yerler ve turistik bilgiler. ${city.name}'e nasıl gidilir?`}
        />
        <meta name="keywords" content={`${city.name}, ${city.name} uçak bileti, ${city.name} otel, ${city.name} gezi rehberi, ${city.country} seyahat`} />
        <link rel="canonical" href={`https://woonomad.com/sehir/${city.slug}`} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img 
          src={city.image} 
          alt={`${city.name} şehir manzarası`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container">
            <Breadcrumb items={breadcrumbItems} />
            <div className="mt-4 flex items-center gap-3">
              <span className="text-5xl">{flag}</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  {city.name}
                </h1>
                <p className="text-lg text-muted-foreground mt-1">
                  {city.country} • {city.population} nüfus
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 border-b border-border">
        <div className="container">
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to={`/sehir/${city.slug}/ucuslar`}>
                <Plane className="w-5 h-5" />
                {city.name} Uçuşları
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to={`/sehir/${city.slug}/oteller`}>
                <Hotel className="w-5 h-5" />
                {city.name} Otelleri
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to={`/sehir/${city.slug}/ucak-bileti`}>
                <MapPin className="w-5 h-5" />
                Uçak Bileti
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-display font-bold mb-4">
                    {city.name} Hakkında
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {city.description}
                  </p>
                </CardContent>
              </Card>

              {/* Highlights */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-display font-bold mb-4">
                    Öne Çıkan Yerler
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {city.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="px-4 py-2 text-sm">
                        <Star className="w-4 h-4 mr-2 text-warning" />
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Flight Routes */}
              {relatedRoutes.length > 0 && (
                <Card variant="elevated">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-display font-bold">
                        Popüler {city.name} Uçuş Rotaları
                      </h2>
                      <Link 
                        to={`/sehir/${city.slug}/ucuslar`} 
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Tümünü Gör <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {relatedRoutes.map((route) => (
                        <Link
                          key={route.slug}
                          to={`/ucus/${route.slug}`}
                          className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                        >
                          <span className="font-medium">
                            {route.originCode} → {route.destinationCode}
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Quick Info */}
            <div className="space-y-6">
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h3 className="text-lg font-display font-bold mb-4">
                    Hızlı Bilgiler
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">En İyi Zaman</p>
                        <p className="font-medium">{city.bestTimeToVisit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Saat Dilimi</p>
                        <p className="font-medium">{city.timezone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Banknote className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Para Birimi</p>
                        <p className="font-medium">{city.currency}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Languages className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dil</p>
                        <p className="font-medium">{city.language}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nüfus</p>
                        <p className="font-medium">{city.population}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Havalimanları</p>
                        <p className="font-medium">{city.airportCodes.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Card */}
              <Card className="gradient-hero text-white border-0">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-display font-bold mb-2">
                    {city.name}'e Uçun
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    En uygun {city.name} uçak biletlerini karşılaştırın
                  </p>
                  <Button asChild variant="secondary" className="w-full">
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

      {/* LLM Summary */}
      <section className="py-12 section-routes">
        <div className="container">
          <Card variant="elevated">
            <CardContent className="p-8">
              <h2 className="text-2xl font-display font-bold mb-4">
                {city.name} Seyahat Özeti
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                  {city.name}, {city.country}'nın önde gelen turistik destinasyonlarından biridir. 
                  {city.population} nüfusa sahip şehir, {city.highlights.slice(0, 3).join(', ')} gibi 
                  önemli turistik noktalarıyla bilinir.
                </p>
                <p>
                  {city.name}'i ziyaret etmek için en ideal dönem {city.bestTimeToVisit} aylarıdır. 
                  Şehirde {city.currency} kullanılmakta ve resmi dil {city.language}'dir. 
                  {city.airportCodes.length > 1 
                    ? `${city.name}'e ${city.airportCodes.join(' ve ')} havalimanları üzerinden ulaşabilirsiniz.`
                    : `${city.name}'e ${city.airportCodes[0]} havalimanı üzerinden ulaşabilirsiniz.`
                  }
                </p>
                <p>
                  Detaylı uçuş bilgileri için <Link to={`/sehir/${city.slug}/ucuslar`} className="text-primary hover:underline">{city.name} uçuşları</Link> sayfasını, 
                  konaklama seçenekleri için <Link to={`/sehir/${city.slug}/oteller`} className="text-primary hover:underline">{city.name} otelleri</Link> sayfasını ziyaret edebilirsiniz.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default City;
