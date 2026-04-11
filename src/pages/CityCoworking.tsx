import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import {
  Monitor, MapPin, Wifi, Clock, CreditCard, Star, ChevronRight,
  Plane, Hotel, Laptop, Info
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCityBySlug } from '@/lib/cities';
import { getCoworkingSpacesByCity, getCityNomadData } from '@/lib/nomad';
import { getCountryFlag } from '@/lib/destinations';
import { useCityDisplay } from '@/hooks/useCityDisplay';

const CityCoworking = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : null;
  const { displayName } = useCityDisplay(city);
  const spaces = slug ? getCoworkingSpacesByCity(slug) : [];
  const nomadData = slug ? getCityNomadData(slug) : null;
  const currentYear = new Date().getFullYear();

  if (!city) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Şehir Bulunamadı</h1>
          <Button asChild><Link to="/sehirler">Şehirlere Gözat</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const flag = getCountryFlag(city.countryCode);
  const cityName = displayName;
  const canonicalUrl = `https://woonomad.co/sehir/${city.slug}/coworking`;

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Şehirler', href: '/sehirler' },
    { label: cityName, href: `/sehir/${city.slug}` },
    { label: 'Coworking Alanları' }
  ];

  const seoTitle = `${cityName} Coworking Alanları ${currentYear} — Fiyat, Konum, Olanaklar | WooNomad`;
  const metaDesc = `${cityName} coworking alanları: ${spaces.length > 0 ? spaces.slice(0, 3).map(s => s.name).join(', ') + '.' : ''} Fiyatlar, olanaklar, konumlar ve dijital göçebe bilgileri.`.slice(0, 160);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `${cityName} Coworking Alanları`,
      "description": metaDesc,
      "numberOfItems": spaces.length,
      "itemListElement": spaces.map((s, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": s.name,
        "url": `https://woonomad.co/coworking/${s.slug}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://woonomad.co/" },
        { "@type": "ListItem", "position": 2, "name": cityName, "item": `https://woonomad.co/sehir/${city.slug}` },
        { "@type": "ListItem", "position": 3, "name": "Coworking", "item": canonicalUrl },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />

      {/* Hero */}
      <section className="py-6 md:py-8 gradient-hero text-white">
        <div className="container">
          <Breadcrumb items={breadcrumbItems} className="text-white/70 mb-3" />
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{flag}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                {cityName} Coworking Alanları
              </h1>
              <p className="text-white/80 text-sm">
                {spaces.length} coworking alanı listelendi
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button asChild variant="secondary" size="sm">
              <Link to={`/sehir/${city.slug}`}>{city.name} Rehberi</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Link to={`/sehir/${city.slug}/nomad`}>{city.name} Nomad Rehberi</Link>
            </Button>
          </div>
        </div>
      </section>

      <main className="container py-6">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">

            {/* TL;DR */}
            {nomadData && (
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-start gap-2 mb-2">
                    <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-semibold text-sm">Kısa Özet</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {cityName} genelinde {nomadData.coworkingCount}+ coworking alanı bulunuyor. 
                    Ortalama internet hızı {nomadData.internetSpeed}, aylık yaşam maliyeti {nomadData.costOfLiving}. 
                    Nomad skoru: {nomadData.nomadScore}/10.
                    {spaces.length > 0 && ` Aşağıda WooNomad tarafından incelenmiş ${spaces.length} coworking alanı listeleniyor.`}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Spaces List */}
            {spaces.length > 0 ? (
              <div className="space-y-4">
                {spaces.map((space) => {
                  const currencySymbol = space.pricing?.currency === 'EUR' ? '€' : (space.pricing?.currency || '€');
                  return (
                    <Link key={space.slug} to={`/coworking/${space.slug}`} className="block group">
                      <Card variant="elevated" className="hover:border-primary/30 transition-colors">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl md:text-2xl font-display font-bold">
                                  {space.name}
                                </h2>
                                {space.rating && (
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-semibold">{space.rating}</span>
                                  </div>
                                )}
                              </div>
                              {space.neighborhood && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                  <MapPin className="w-3 h-3" />
                                  <span>{space.neighborhood}</span>
                                </div>
                              )}
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {space.summary}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {space.amenities.slice(0, 4).map((amenity, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">{amenity}</Badge>
                                ))}
                                {space.amenities.length > 4 && (
                                  <Badge variant="outline" className="text-xs">+{space.amenities.length - 4}</Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              {space.pricing?.monthly && (
                                <div className="text-right">
                                  <div className="text-xl font-bold text-primary">{currencySymbol}{space.pricing.monthly}</div>
                                  <div className="text-xs text-muted-foreground">/ ay</div>
                                </div>
                              )}
                              {space.pricing?.daily && (
                                <div className="text-xs text-muted-foreground">
                                  {currencySymbol}{space.pricing.daily}/gün
                                </div>
                              )}
                              {space.hours && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {space.hours}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <Card variant="elevated">
                <CardContent className="p-8 text-center">
                  <Monitor className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-xl md:text-2xl font-display font-bold mb-2">Henüz Coworking Alanı Eklenmedi</h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {cityName} için coworking alanları yakında eklenecek.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/sehir/${city.slug}/nomad`}>
                      <Laptop className="w-4 h-4 mr-2" />
                      Nomad Rehberine Göz At
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* SEO Content */}
            <Card variant="elevated">
              <CardContent className="p-4 md:p-5">
                <h2 className="text-xl md:text-2xl font-display font-bold mb-3">{cityName} Coworking Rehberi</h2>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    {cityName}, dijital göçebeler ve uzaktan çalışanlar için 
                    {nomadData ? ` ${nomadData.coworkingCount}+ coworking alanı ve ${nomadData.cafesWithWifi}+ WiFi dostu kafe` : ' çok sayıda coworking alanı'} sunuyor. 
                    Şehirdeki coworking alanları günlük geçici kullanımdan aylık üyeliklere kadar esnek seçenekler sağlıyor.
                  </p>
                  <p>
                    Coworking seçerken dikkat edilmesi gerekenler: internet hızı ve stabilite, çalışma saatleri (7/24 erişim önemli), 
                    toplantı odası ve telefon kabini mevcudiyeti, konum (toplu taşıma erişimi), topluluk etkinlikleri ve networking imkanları.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Nomad Stats */}
            {nomadData && (
              <Card variant="elevated" className="sticky top-20">
                <CardContent className="p-5">
                  <h3 className="text-lg font-display font-bold mb-4">{cityName} Nomad Skoru</h3>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-primary">{nomadData.nomadScore}/10</div>
                    <div className="text-sm text-muted-foreground">Genel Puan</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div className="p-2 bg-muted/50 rounded-lg text-center">
                      <div className="font-semibold">{nomadData.internetSpeed}</div>
                      <div className="text-xs text-muted-foreground">İnternet</div>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg text-center">
                      <div className="font-semibold">{nomadData.costOfLiving}</div>
                      <div className="text-xs text-muted-foreground">Yaşam M.</div>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg text-center">
                      <div className="font-semibold">{nomadData.coworkingCount}+</div>
                      <div className="text-xs text-muted-foreground">Coworking</div>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg text-center">
                      <div className="font-semibold">{nomadData.cafesWithWifi}+</div>
                      <div className="text-xs text-muted-foreground">WiFi Kafe</div>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full gap-2">
                    <Link to={`/sehir/${city.slug}/nomad`}>
                      <Laptop className="w-4 h-4" /> Nomad Rehberi <ChevronRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* CTA Cards */}
            <Card className="gradient-hero text-white border-0">
              <CardContent className="p-5 text-center">
                <Plane className="w-7 h-7 mx-auto mb-2" />
                <h3 className="font-display font-bold mb-1">{cityName}&#39;e Uçun</h3>
                <p className="text-white/80 text-sm mb-3">En uygun biletleri karşılaştırın</p>
                <Button asChild variant="secondary" size="sm" className="w-full">
                  <Link to={`/sehir/${city.slug}/ucuslar`}>Bilet Ara</Link>
                </Button>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardContent className="p-5 text-center">
                <Hotel className="w-7 h-7 mx-auto mb-2 text-primary" />
                <h3 className="font-display font-bold mb-1">Konaklama</h3>
                <p className="text-muted-foreground text-sm mb-3">Uzun süreli kalışlar için</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to={`/sehir/${city.slug}/oteller`}>Otelleri Gör</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default CityCoworking;
