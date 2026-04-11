import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Plane, Calendar, Clock, Users, TrendingDown, MapPin, Info, CheckCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TravelpayoutsFlightWidget, TravelpayoutsCalendarWidget } from '@/components/widgets';
import { getCityBySlug } from '@/lib/cities';
import { generateFlightRoutes, FLIGHT_DURATIONS, getAirlinesForRoute, getEstimatedPriceRange } from '@/lib/flightRoutes';
import { getCountryFlag } from '@/lib/destinations';
import { useUserLocation } from '@/hooks/useUserLocation';

const CityTickets = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : null;
  const { originAirport, isLoading: isLocationLoading } = useUserLocation();
  const allFlightRoutes = generateFlightRoutes();
  
  if (!city) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Şehir Bulunamadı</h1>
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

  const faqItems = [
    {
      question: `${city.name} uçak bileti ne kadar?`,
      answer: priceRange 
        ? `${city.name} uçak bileti fiyatları ${priceRange.min}₺'den başlamaktadır. Fiyatlar sezona ve havayolu şirketine göre ${priceRange.max}₺'ye kadar çıkabilir.`
        : `${city.name} uçak bileti fiyatları sezona ve havayolu şirketine göre değişmektedir.`
    },
    {
      question: `${city.name}'e hangi havayolları uçuyor?`,
      answer: airlines.length > 0 
        ? `${city.name}'e ${airlines.join(', ')} gibi havayolu şirketleri seferler düzenlemektedir.`
        : `${city.name}'e Turkish Airlines, Pegasus ve diğer havayolu şirketleri seferler düzenlemektedir.`
    },
    {
      question: `${city.name} havalimanı kodu nedir?`,
      answer: `${city.name} havalimanının IATA kodu ${city.airportCodes.join(' ve ')}'dir.`
    },
    {
      question: `${city.name}'e en ucuz uçuş ne zaman?`,
      answer: `${city.name}'e en ucuz uçuşlar genellikle Ocak-Mart ve Kasım aylarındadır. Hafta içi günler daha uygun fiyatlar sunar.`
    },
    {
      question: `${city.name} uçuş süresi ne kadar?`,
      answer: `${city.name}'e uçuş süresi kalkış noktanıza göre değişmektedir. İstanbul'dan direkt uçuşlar ortalama 1-4 saat arasında sürmektedir.`
    }
  ];

  const structuredData = [
    {
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
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    }
  ];

  // Get destination IATA code for widget
  const destinationCode = city.airportCodes[0] || '';

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${city.name} Uçak Bileti ${currentYear} | En Ucuz Fiyatlar`}</title>
        <meta 
          name="description" 
          content={`${city.name} uçak bileti fiyatları ${priceRange ? `${priceRange.min}₺'den başlayan fiyatlarla` : ''}. ${city.country} ${city.name} ucuz uçak bileti karşılaştırma.`}
        />
        <link rel="canonical" href={`https://woonomad.co/sehir/${city.slug}/ucuslar`} />
        {structuredData.map((data, index) => (
          <script key={index} type="application/ld+json">{JSON.stringify(data)}</script>
        ))}
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="py-6 md:py-8 gradient-hero text-white">
        <div className="container">
          <Breadcrumb items={breadcrumbItems} className="text-white/70 mb-3" />
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{flag}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                {city.name} Uçak Bileti
              </h1>
              <p className="text-white/80 text-sm">
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

          <div className="flex flex-wrap gap-2 mt-4">
            <Button asChild variant="secondary" size="sm">
              <Link to={`/sehir/${city.slug}`}>
                {city.name} Rehberi
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Link to={`/sehir/${city.slug}/oteller`}>
                {city.name} Otelleri
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Flight Search Widget */}
      <section className="py-6 bg-muted/30">
        <div className="container">
          <Card className="border-border">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-display font-bold mb-3 flex items-center gap-2">
                <Plane className="w-5 h-5 text-primary" />
                {city.name} Uçuş Ara
              </h2>
              <TravelpayoutsFlightWidget 
                destination={destinationCode}
                subId={`city-tickets-${city.slug}`}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Price Calendar */}
      <section className="py-6">
        <div className="container">
          <Card className="border-border">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl md:text-2xl font-display font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Fiyat Takvimi
                </h2>
                {!isLocationLoading && (
                  <Badge variant="secondary" className="text-xs">
                    {originAirport} → {destinationCode}
                  </Badge>
                )}
              </div>
              <TravelpayoutsCalendarWidget 
                origin={originAirport}
                destination={destinationCode}
                subId={`calendar-${city.slug}`}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Airport & Flight Info */}
      <section className="py-6 md:py-8">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Airport Info */}
            <Card variant="elevated">
              <CardContent className="p-6">
                <h2 className="text-xl md:text-2xl font-display font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {city.name} Havalimanı Bilgileri
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Havalimanı Kodu</span>
                    <span className="font-bold text-primary">{city.airportCodes.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Ülke</span>
                    <span className="font-medium">{flag} {city.country}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Saat Dilimi</span>
                    <span className="font-medium">{city.timezone}</span>
                  </div>
                  {priceRange && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground">Ortalama Bilet Fiyatı</span>
                      <span className="font-bold text-success">{priceRange.min}₺ - {priceRange.max}₺</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Best Time to Fly */}
            <Card variant="elevated">
              <CardContent className="p-6">
                <h2 className="text-xl md:text-2xl font-display font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  En Uygun Uçuş Zamanları
                </h2>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-success/10 border border-success/20">
                    <p className="font-semibold text-success mb-1">En Ucuz Dönem</p>
                    <p className="text-sm text-muted-foreground">
                      Ocak - Mart arası ve Kasım ayları genellikle en uygun fiyatlı dönemlerdir.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-warning/10 border border-warning/20">
                    <p className="font-semibold text-warning mb-1">Orta Sezon</p>
                    <p className="text-sm text-muted-foreground">
                      Nisan, Mayıs ve Ekim ayları dengeli fiyatlar sunar.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                    <p className="font-semibold text-destructive mb-1">Yoğun Sezon</p>
                    <p className="text-sm text-muted-foreground">
                      Haziran - Eylül ve bayram dönemleri en pahalı zamanlardır.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Airlines */}
      {airlines.length > 0 && (
        <section className="py-6 md:py-8 bg-muted/30">
          <div className="container">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-4 flex items-center gap-2">
              <Plane className="w-5 h-5 text-primary" />
              {city.name}'e Uçan Havayolları
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {airlines.map((airline) => (
                <Card key={airline} variant="elevated">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Plane className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-medium">{airline}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Tips */}
      <section className="py-6 md:py-8 section-routes">
        <div className="container">
          <Card variant="elevated">
            <CardContent className="p-6">
              <h2 className="text-xl md:text-2xl font-display font-bold mb-4">
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
      <section className="py-6 md:py-8">
        <div className="container">
          <Card variant="elevated">
            <CardContent className="p-6">
              <h2 className="text-xl md:text-2xl font-display font-bold mb-4">
                {city.name} Uçak Bileti Rehberi {currentYear}
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  {city.name}, {city.country}'nın en popüler destinasyonlarından biridir. 
                  {city.airportCodes.length > 1 
                    ? `${city.airportCodes.join(' ve ')} havalimanları`
                    : `${city.airportCodes[0]} havalimanı`
                  } üzerinden yılda milyonlarca yolcuya hizmet vermektedir.
                </p>
                <p>
                  {city.name} uçak bileti fiyatları sezona, havayolu şirketine ve rezervasyon 
                  zamanına göre değişiklik göstermektedir. {priceRange && `Şu anda ${priceRange.min}₺'den 
                  başlayan fiyatlarla ${city.name}'e uçabilirsiniz.`}
                </p>
                <p>
                  {city.name}'e uçuş yapan başlıca havayolu şirketleri arasında 
                  {airlines.length > 0 ? ` ${airlines.join(', ')}` : ' Turkish Airlines, Pegasus'} 
                  bulunmaktadır. Direkt uçuşların yanı sıra aktarmalı seçenekler de mevcuttur.
                </p>
                <p>
                  En uygun {city.name} uçak biletini bulmak için yukarıdaki arama formunu kullanabilirsiniz. 
                  Kalkış noktanızı seçtikten sonra tüm havayolu şirketlerinin fiyatlarını karşılaştırabilirsiniz.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-6 md:py-8 bg-muted/30">
        <div className="container">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Sık Sorulan Sorular
          </h2>
          <div className="space-y-4">
            <Card variant="elevated">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2">{city.name} uçak bileti ne kadar?</h3>
                <p className="text-muted-foreground">
                  {priceRange 
                    ? `${city.name} uçak bileti fiyatları ${priceRange.min}₺'den başlamaktadır. Fiyatlar sezona ve havayolu şirketine göre ${priceRange.max}₺'ye kadar çıkabilir.`
                    : `${city.name} uçak bileti fiyatları sezona ve havayolu şirketine göre değişmektedir. En güncel fiyatlar için arama yapabilirsiniz.`
                  }
                </p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2">{city.name}'e hangi havayolları uçuyor?</h3>
                <p className="text-muted-foreground">
                  {airlines.length > 0 
                    ? `${city.name}'e ${airlines.join(', ')} gibi havayolu şirketleri direkt ve aktarmalı seferler düzenlemektedir.`
                    : `${city.name}'e Turkish Airlines, Pegasus ve diğer havayolu şirketleri seferler düzenlemektedir.`
                  }
                </p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2">{city.name} havalimanı kodu nedir?</h3>
                <p className="text-muted-foreground">
                  {city.name} havalimanının IATA kodu {city.airportCodes.join(' ve ')}'dir. 
                  Bu kod uçak bileti aramalarında ve bagaj etiketlerinde kullanılır.
                </p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2">{city.name}'e en ucuz uçuş ne zaman?</h3>
                <p className="text-muted-foreground">
                  {city.name}'e en ucuz uçuşlar genellikle düşük sezon olan Ocak-Mart ve Kasım aylarındadır. 
                  Ayrıca hafta içi, özellikle Salı ve Çarşamba günleri daha uygun fiyatlar bulabilirsiniz.
                </p>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2">{city.name} uçuş süresi ne kadar?</h3>
                <p className="text-muted-foreground">
                  {city.name}'e uçuş süresi kalkış noktanıza göre değişmektedir. 
                  İstanbul'dan direkt uçuşlar ortalama 1-4 saat arasında sürmektedir.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section className="py-6 md:py-8">
        <div className="container">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-4">İlgili Sayfalar</h2>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to={`/sehir/${city.slug}`}>
                <CheckCircle className="w-4 h-4 mr-1" />
                {city.name} Şehir Rehberi
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to={`/sehir/${city.slug}/oteller`}>
                {city.name} Otelleri
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to={`/sehir/${city.slug}/ucuslar`}>
                {city.name} Uçuş Rotaları
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to={`/sehir/${city.slug}/aktiviteler`}>
                {city.name} Aktiviteleri
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mb-20 md:mb-0 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {currentYear} WooNomad. Tüm hakları saklıdır.
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
};

export default CityTickets;
