import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { 
  Hotel, Star, MapPin, Calendar, Users, Wifi, Coffee, Car, Dumbbell, 
  ExternalLink, ChevronRight, Clock, CreditCard, Shield, Check, 
  Building2, Loader2, ArrowRight
} from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getCityBySlug } from '@/lib/cities';
import { getHotelBySlug, getRelatedHotels, HotelData } from '@/lib/hotels';
import { getCountryFlag } from '@/lib/destinations';
import { useHotelSearch, Hotel as APIHotel } from '@/hooks/useHotelSearch';
import { format, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';

const amenityIcons: Record<string, typeof Wifi> = {
  'Spa': Dumbbell,
  'Havuz': Building2,
  'Fitness': Dumbbell,
  'Restoran': Coffee,
  'Bar': Coffee,
  'WiFi': Wifi,
  'Parking': Car,
  'Oda Servisi': Coffee,
  'Concierge': Users,
  'Teras': Building2,
  'Bisiklet Kiralama': Car,
};

function RelatedHotelCard({ hotel }: { hotel: HotelData }) {
  const city = getCityBySlug(hotel.citySlug);
  
  return (
    <Link 
      to={`/sehir/${hotel.citySlug}/otel/${hotel.slug}`}
      className="card-modern p-4 group hover:border-primary/30 transition-all"
    >
      <div className="flex gap-4">
        <img 
          src={hotel.images[0]} 
          alt={hotel.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
            {hotel.name}
          </h4>
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-travel-gold text-travel-gold" />
            ))}
          </div>
          {hotel.priceRange && (
            <p className="text-sm text-primary font-semibold mt-1">
              ₺{hotel.priceRange.min.toLocaleString('tr-TR')}+
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

const HotelDetailPage = () => {
  const { citySlug, hotelSlug } = useParams<{ citySlug: string; hotelSlug: string }>();
  const city = citySlug ? getCityBySlug(citySlug) : null;
  const hotel = hotelSlug ? getHotelBySlug(hotelSlug) : null;
  const relatedHotels = hotel ? getRelatedHotels(hotel.slug, hotel.citySlug, 4) : [];
  const { hotels: apiHotels, isLoading, searchHotels } = useHotelSearch();
  
  const currentYear = new Date().getFullYear();
  const today = new Date();
  const checkIn = format(addDays(today, 7), 'yyyy-MM-dd');
  const checkOut = format(addDays(today, 9), 'yyyy-MM-dd');
  const lastUpdated = format(today, 'd MMMM yyyy', { locale: tr });

  useEffect(() => {
    if (city && hotel) {
      searchHotels({
        location: city.nameEn || city.name,
        checkIn,
        checkOut,
        adults: 2,
        limit: 1,
      });
    }
  }, [city, hotel]);

  if (!city || !hotel) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Otel Bulunamadı</h1>
          <p className="text-muted-foreground mb-6">Aradığınız otel bulunamadı veya kaldırılmış olabilir.</p>
          <Link to="/oteller">
            <Button>Tüm Otelleri Görüntüle</Button>
          </Link>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  const flag = getCountryFlag(city.countryCode);
  
  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Şehirler', href: '/sehirler' },
    { label: city.name, href: `/sehir/${city.slug}` },
    { label: 'Oteller', href: `/sehir/${city.slug}/oteller` },
    { label: hotel.name }
  ];

  // FAQ data
  const faqs = [
    {
      q: `${hotel.name} oteli nerede konumlu?`,
      a: `${hotel.name}, ${city.name}'in ${hotel.neighborhood || 'merkezi'} bölgesinde yer almaktadır.${hotel.address ? ` Tam adres: ${hotel.address}` : ''}`
    },
    {
      q: `${hotel.name} otelinde hangi imkanlar var?`,
      a: `Otelde ${hotel.amenities.slice(0, 5).join(', ')} gibi imkanlar sunulmaktadır.`
    },
    {
      q: `${hotel.name} otelinin fiyat aralığı nedir?`,
      a: hotel.priceRange 
        ? `Gecelik fiyatlar ${hotel.priceRange.min.toLocaleString('tr-TR')} - ${hotel.priceRange.max.toLocaleString('tr-TR')} ${hotel.priceRange.currency} arasında değişmektedir. Fiyatlar sezona ve oda tipine göre farklılık gösterebilir.`
        : 'Güncel fiyat bilgisi için rezervasyon platformlarını kontrol etmenizi öneririz.'
    },
    {
      q: `${hotel.name} oteli kimler için uygun?`,
      a: `Bu otel özellikle ${hotel.suitableFor.join(', ')} için ideal bir seçenektir.`
    },
    {
      q: `${hotel.name} otelinin yıldız sayısı kaç?`,
      a: `${hotel.name}, ${hotel.stars} yıldızlı bir oteldir${hotel.rating ? ` ve misafir puanı ${hotel.rating}/5'tir` : ''}.`
    },
    {
      q: `${city.name}'de ${hotel.name} dışında başka oteller var mı?`,
      a: `Evet, ${city.name}'de farklı bütçe ve konfor seviyelerine uygun birçok otel bulunmaktadır. Detaylı liste için ${city.name} otelleri sayfamızı ziyaret edebilirsiniz.`
    },
  ];

  // Schema JSON-LD
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Hotel",
        "name": hotel.name,
        "description": hotel.summary,
        "image": hotel.images[0],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": hotel.address || '',
          "addressLocality": city.name,
          "addressCountry": city.countryCode
        },
        "starRating": {
          "@type": "Rating",
          "ratingValue": hotel.stars
        },
        ...(hotel.rating && {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": hotel.rating,
            "reviewCount": hotel.reviewCount || 100
          }
        }),
        ...(hotel.priceRange && {
          "priceRange": `${hotel.priceRange.currency} ${hotel.priceRange.min}-${hotel.priceRange.max}`
        }),
        "amenityFeature": hotel.amenities.map(amenity => ({
          "@type": "LocationFeatureSpecification",
          "name": amenity
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.label,
          ...(item.href && { "item": `https://woonomad.co${item.href}` })
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{`${hotel.name} ${city.name} | Konum, Olanaklar, Fiyat ${currentYear}`}</title>
        <meta 
          name="description" 
          content={`${hotel.name} - ${hotel.stars} yıldızlı otel. ${hotel.neighborhood || city.name} bölgesinde konaklama. ${hotel.amenities.slice(0, 3).join(', ')} ve daha fazlası.`}
        />
        <link rel="canonical" href={`https://woonomad.co/sehir/${city.slug}/otel/${hotel.slug}`} />
        <meta property="og:title" content={`${hotel.name} - ${city.name} Otelleri | WooNomad`} />
        <meta property="og:description" content={hotel.summary} />
        <meta property="og:image" content={hotel.images[0]} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} />

          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            {/* Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img 
                src={hotel.images[0]} 
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {hotel.rating && hotel.rating >= 4.5 && (
                  <Badge variant="popular">Popüler</Badge>
                )}
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-travel-gold text-travel-gold" />
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
                  {hotel.name} — {flag} {city.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{hotel.neighborhood || city.name}</span>
                  </div>
                  {hotel.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-travel-gold text-travel-gold" />
                      <span className="font-semibold text-foreground">{hotel.rating}</span>
                      {hotel.reviewCount && <span>({hotel.reviewCount} yorum)</span>}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Facts */}
              <Card>
                <CardContent className="p-4 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Konaklama Tipi</div>
                    <div className="font-medium">{hotel.stars} Yıldızlı Otel</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Bölge</div>
                    <div className="font-medium">{hotel.neighborhood || city.name}</div>
                  </div>
                  {hotel.priceRange && (
                    <>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Fiyat Aralığı</div>
                        <div className="font-medium text-primary">
                          ₺{hotel.priceRange.min.toLocaleString('tr-TR')} - ₺{hotel.priceRange.max.toLocaleString('tr-TR')}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Son Güncelleme</div>
                        <div className="font-medium">{lastUpdated}</div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2">
                {hotel.highlights.map((highlight, i) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1">
                    {highlight}
                  </Badge>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="gradient-primary flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Fiyatları Gör
                </Button>
                <Button size="lg" variant="outline" className="flex-1" asChild>
                  <Link to={`/sehir/${city.slug}/oteller`}>
                    <Hotel className="h-4 w-4 mr-2" />
                    Tüm {city.name} Otelleri
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                <Shield className="h-3 w-3 inline mr-1" />
                Bilgiler sağlayıcıdan gelir, değişebilir.
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Otel Hakkında</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <p>{hotel.summary}</p>
                </CardContent>
              </Card>

              {/* Suitable For */}
              <Card>
                <CardHeader>
                  <CardTitle>Kimler İçin Uygun?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {hotel.suitableFor.map((persona, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{persona}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reasons to Choose */}
              <Card>
                <CardHeader>
                  <CardTitle>Neden Bu Otel?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {hotel.reasonsToChoose.map((reason, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">{i + 1}</span>
                        </div>
                        <span className="text-sm">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Olanaklar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {hotel.amenities.map((amenity, i) => {
                      const IconComponent = amenityIcons[amenity] || Check;
                      return (
                        <div key={i} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <IconComponent className="h-4 w-4 text-primary" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle>Sıkça Sorulan Sorular</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqs.map((faq, i) => (
                    <div key={i} className="space-y-2">
                      <h3 className="font-semibold text-sm">{faq.q}</h3>
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                      {i < faqs.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              {hotel.priceRange && (
                <Card className="sticky top-4">
                  <CardContent className="p-6 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Gecelik fiyatlar</div>
                    <div className="text-3xl font-display font-bold text-primary mb-4">
                      ₺{hotel.priceRange.min.toLocaleString('tr-TR')}+
                    </div>
                    <Button className="w-full gradient-primary mb-3">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Rezervasyon Yap
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Fiyatlar sezona göre değişebilir
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Related Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{city.name} Rehberi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link 
                    to={`/sehir/${city.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">🏙️ Şehir Rehberi</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link 
                    to={`/sehir/${city.slug}/oteller`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">🏨 Tüm Oteller</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link 
                    to={`/sehir/${city.slug}/nomad`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">💻 Nomad Rehberi</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link 
                    to={`/sehir/${city.slug}/coworking`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">🏢 Coworking Alanları</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>

              {/* Related Hotels */}
              {relatedHotels.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Alternatif Oteller</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {relatedHotels.map((relatedHotel) => (
                      <RelatedHotelCard key={relatedHotel.slug} hotel={relatedHotel} />
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-8 mb-20 md:mb-0 bg-muted/30 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
            © {currentYear} WooNomad. Tüm hakları saklıdır.
          </div>
        </footer>

        <MobileBottomNav />
      </div>
    </>
  );
};

export default HotelDetailPage;
