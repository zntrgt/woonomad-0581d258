import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Laptop, Wifi, DollarSign, Shield, Sun, Users, MapPin, Clock, Globe, Coffee, ArrowRight, Hotel, Plane } from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCityBySlug } from '@/lib/cities';
import { getNomadMetrics, getCoworkingSpacesByCity } from '@/lib/nomad';
import { getCountryFlag } from '@/lib/destinations';

const CityNomad = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : null;
  const metrics = slug ? getNomadMetrics(slug) : null;
  const coworkingSpaces = slug ? getCoworkingSpacesByCity(slug) : [];

  if (!city) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Şehir Bulunamadı</h1>
          <Link to="/sehirler" className="text-primary hover:underline">Tüm Şehirlere Gözat</Link>
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
    { label: 'Dijital Nomad Rehberi' }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${city.name} Dijital Nomad Rehberi ${currentYear}`,
    "description": `${city.name} dijital nomad rehberi. Coworking alanları, internet hızı, yaşam maliyeti ve nomad topluluğu bilgileri.`,
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${city.name} Dijital Nomad Rehberi ${currentYear} | Coworking, Yaşam Maliyeti`}</title>
        <meta name="description" content={`${city.name} dijital nomad rehberi. ${metrics ? `${metrics.coworkingCount}+ coworking, ${metrics.internetSpeed} internet, ${metrics.costOfLiving} yaşam maliyeti.` : ''} Remote çalışma için ${city.name} rehberi.`} />
        <link rel="canonical" href={`https://woonomad.co/sehir/${city.slug}/nomad`} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />

      {/* Hero */}
      <section className="py-8 gradient-hero text-white">
        <div className="container">
          <Breadcrumb items={breadcrumbItems} className="text-white/70 mb-4" />
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{flag}</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                {city.name} Dijital Nomad Rehberi
              </h1>
              <p className="text-white/80">Remote çalışma için {city.name}</p>
            </div>
          </div>
          {metrics && (
            <Badge variant="secondary" className="mt-2">Nomad Skoru: {metrics.nomadScore}/10</Badge>
          )}
        </div>
      </section>

      <main className="container py-8">
        {metrics ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Metrics */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h2 className="text-xl font-display font-bold mb-4">Temel Metrikler</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                      <Wifi className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">İnternet Hızı</p>
                        <p className="text-lg font-bold">{metrics.internetSpeed}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                      <DollarSign className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Yaşam Maliyeti</p>
                        <p className="text-lg font-bold">{metrics.costOfLiving}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                      <Laptop className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Coworking Sayısı</p>
                        <p className="text-lg font-bold">{metrics.coworkingCount}+</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                      <Coffee className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">WiFi'lı Kafeler</p>
                        <p className="text-lg font-bold">{metrics.cafesWithWifi}+</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coworking Spaces */}
              {coworkingSpaces.length > 0 && (
                <Card variant="elevated">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-display font-bold">Coworking Alanları</h2>
                      <Link to={`/sehir/${city.slug}/coworking`} className="text-primary text-sm hover:underline">
                        Tümünü Gör →
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {coworkingSpaces.slice(0, 3).map(space => (
                        <Link key={space.slug} to={`/coworking/${space.slug}`} className="block">
                          <Card className="hover:border-primary/30 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{space.name}</h3>
                                  <p className="text-sm text-muted-foreground">{space.neighborhood}</p>
                                </div>
                                {space.pricing?.monthly && (
                                  <Badge variant="secondary">{space.pricing.monthly}€/ay</Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Visa Info */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h2 className="text-xl font-display font-bold mb-3">Vize Bilgisi</h2>
                  <p className="text-muted-foreground">{metrics.visaInfo}</p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card variant="elevated">
                <CardContent className="p-4">
                  <h3 className="font-bold mb-3">Skorlar</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Güvenlik', score: metrics.safetyScore, icon: Shield },
                      { label: 'Hava Durumu', score: metrics.weatherScore, icon: Sun },
                      { label: 'Topluluk', score: metrics.communityScore, icon: Users },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm flex-1">{item.label}</span>
                        <Badge variant={item.score >= 8 ? 'default' : 'secondary'}>{item.score}/10</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-hero text-white border-0">
                <CardContent className="p-4 text-center">
                  <h3 className="font-bold mb-2">{city.name}'e Uçun</h3>
                  <p className="text-white/80 text-sm mb-3">Remote çalışmaya başlayın</p>
                  <Button asChild variant="secondary" className="w-full">
                    <Link to={`/sehir/${city.slug}/ucak-bileti`}>Uçuş Ara</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card variant="elevated">
            <CardContent className="p-8 text-center">
              <Laptop className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Nomad verisi henüz mevcut değil</h2>
              <p className="text-muted-foreground mb-4">{city.name} için dijital nomad bilgileri yakında eklenecek.</p>
              <Button asChild><Link to={`/sehir/${city.slug}`}>Şehir Sayfasına Dön</Link></Button>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="border-t border-border py-8 mb-20 md:mb-0 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          © {currentYear} WooNomad. Tüm hakları saklıdır.
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
};

export default CityNomad;
