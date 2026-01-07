import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { 
  MapPin, Wifi, Clock, Coffee, Monitor, Users, Phone, 
  Globe, CreditCard, Calendar, Star, ChevronRight, Plane, Hotel
} from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCoworkingSpaceBySlug, getCoworkingSpacesByCity, getCityNomadData } from '@/lib/nomad';
import { getCityBySlug } from '@/lib/cities';

const amenityIcons: Record<string, typeof Wifi> = {
  'wifi': Wifi,
  '24saat': Clock,
  'toplantı': Users,
  'kahve': Coffee,
  'monitör': Monitor,
  'telefon': Phone,
};

const CoworkingDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const space = slug ? getCoworkingSpaceBySlug(slug) : null;
  const city = space ? getCityBySlug(space.citySlug) : null;
  const nomadData = space ? getCityNomadData(space.citySlug) : null;
  
  const currentYear = new Date().getFullYear();
  
  if (!space) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Çalışma Alanı Bulunamadı</h1>
          <p className="text-muted-foreground mb-6">Aradığınız coworking alanı mevcut değil.</p>
          <Button asChild>
            <Link to="/sehirler">Şehirlere Gözat</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get related spaces in same city
  const relatedSpaces = getCoworkingSpacesByCity(space.citySlug)
    .filter(s => s.slug !== space.slug)
    .slice(0, 3);

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Şehirler', href: '/sehirler' },
    { label: city?.name || space.citySlug, href: `/sehir/${space.citySlug}` },
    { label: 'Coworking', href: `/sehir/${space.citySlug}/coworking` },
    { label: space.name }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": space.name,
    "description": space.summary,
    "@id": `https://woonomad.co/coworking/${space.slug}`,
    "url": `https://woonomad.co/coworking/${space.slug}`,
    "address": space.address ? {
      "@type": "PostalAddress",
      "streetAddress": space.address,
      "addressLocality": city?.name || space.citySlug,
      "addressCountry": city?.country || ""
    } : undefined,
    "openingHours": space.hours,
    "priceRange": space.pricing ? `€${space.pricing.daily}/gün` : undefined,
    "amenityFeature": space.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${space.name} | ${city?.name || space.citySlug} Coworking - WooNomad`}</title>
        <meta 
          name="description" 
          content={`${space.name} - ${city?.name || space.citySlug} coworking alanı. ${space.summary}. Digital nomad'lar için ideal çalışma ortamı.`}
        />
        <link rel="canonical" href={`https://woonomad.co/coworking/${space.slug}`} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="py-8 gradient-hero text-white">
        <div className="container">
          <Breadcrumb items={breadcrumbItems} className="text-white/70 mb-4" />
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Monitor className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
                {space.name}
              </h1>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4" />
                <span>{city?.name || space.citySlug}</span>
                {space.neighborhood && (
                  <>
                    <span>•</span>
                    <span>{space.neighborhood}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <Card variant="elevated">
              <CardContent className="p-6">
                <h2 className="text-xl font-display font-bold mb-4">Hakkında</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {space.summary}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card variant="elevated">
              <CardContent className="p-6">
                <h2 className="text-xl font-display font-bold mb-4">Olanaklar</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {space.amenities.map((amenity, index) => {
                    const IconComponent = Object.entries(amenityIcons).find(
                      ([key]) => amenity.toLowerCase().includes(key)
                    )?.[1] || Star;
                    
                    return (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                        <IconComponent className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            {space.pricing && (
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Fiyatlandırma
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {space.pricing.daily && (
                      <div className="text-center p-4 bg-muted/50 rounded-xl">
                        <div className="text-2xl font-bold text-primary">€{space.pricing.daily}</div>
                        <div className="text-sm text-muted-foreground">Günlük</div>
                      </div>
                    )}
                    {space.pricing.weekly && (
                      <div className="text-center p-4 bg-muted/50 rounded-xl">
                        <div className="text-2xl font-bold text-primary">€{space.pricing.weekly}</div>
                        <div className="text-sm text-muted-foreground">Haftalık</div>
                      </div>
                    )}
                    {space.pricing.monthly && (
                      <div className="text-center p-4 bg-muted/50 rounded-xl">
                        <div className="text-2xl font-bold text-primary">€{space.pricing.monthly}</div>
                        <div className="text-sm text-muted-foreground">Aylık</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Why Choose This Space */}
            <Card variant="elevated">
              <CardContent className="p-6">
                <h2 className="text-xl font-display font-bold mb-4">
                  Bu Alanı Seçmek İçin 3 Neden
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Merkezi Konum</h3>
                      <p className="text-sm text-muted-foreground">
                        {city?.name || space.citySlug}'in en erişilebilir noktalarından birinde
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Profesyonel Ortam</h3>
                      <p className="text-sm text-muted-foreground">
                        Hızlı WiFi, ergonomik mobilya ve sessiz çalışma alanları
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Topluluk</h3>
                      <p className="text-sm text-muted-foreground">
                        Networking etkinlikleri ve diğer remote çalışanlarla tanışma fırsatı
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4">
            {/* Quick Info */}
            <Card variant="elevated">
              <CardContent className="p-6">
                <h3 className="text-lg font-display font-bold mb-4">Hızlı Bilgiler</h3>
                <div className="space-y-3">
                  {space.hours && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Çalışma Saatleri</div>
                        <div className="font-medium">{space.hours}</div>
                      </div>
                    </div>
                  )}
                  {space.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Adres</div>
                        <div className="font-medium text-sm">{space.address}</div>
                      </div>
                    </div>
                  )}
                  {space.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Website</div>
                        <a 
                          href={space.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          Ziyaret Et
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* City Nomad Stats */}
            {nomadData && (
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h3 className="text-lg font-display font-bold mb-4">
                    {city?.name || space.citySlug} Nomad Skoru
                  </h3>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-primary">{nomadData.nomadScore}/10</div>
                    <div className="text-sm text-muted-foreground">Genel Puan</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-muted/50 rounded-lg text-center">
                      <div className="font-semibold">{nomadData.internetSpeed} Mbps</div>
                      <div className="text-xs text-muted-foreground">İnternet</div>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg text-center">
                      <div className="font-semibold">{nomadData.costOfLiving}/10</div>
                      <div className="text-xs text-muted-foreground">Yaşam Maliyeti</div>
                    </div>
                  </div>
                  <Link 
                    to={`/sehir/${space.citySlug}/nomad`}
                    className="flex items-center justify-center gap-1 mt-4 text-primary hover:underline text-sm"
                  >
                    Detaylı Nomad Rehberi <ChevronRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* CTA Cards */}
            <Card className="gradient-hero text-white border-0">
              <CardContent className="p-6 text-center">
                <Plane className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-display font-bold mb-2">
                  {city?.name || space.citySlug}'e Uçun
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  En uygun uçak biletlerini karşılaştırın
                </p>
                <Button asChild variant="secondary" className="w-full">
                  <Link to={`/sehir/${space.citySlug}/ucak-bileti`}>
                    Bilet Ara
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardContent className="p-6 text-center">
                <Hotel className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-display font-bold mb-2">
                  Konaklama
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Uzun süreli kalışlar için en iyi fiyatlar
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/sehir/${space.citySlug}/oteller`}>
                    Otelleri Gör
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Spaces */}
        {relatedSpaces.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-display font-bold mb-6">
              {city?.name || space.citySlug}'deki Diğer Coworking Alanları
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedSpaces.map((relatedSpace) => (
                <Link
                  key={relatedSpace.slug}
                  to={`/coworking/${relatedSpace.slug}`}
                  className="group"
                >
                  <Card variant="elevated" className="h-full hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <h3 className="font-display font-bold mb-2 group-hover:text-primary transition-colors">
                        {relatedSpace.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {relatedSpace.summary}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {relatedSpace.amenities.slice(0, 3).map((amenity, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

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

export default CoworkingDetail;
