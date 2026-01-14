import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, Wifi, Clock, Coffee, Monitor, Users, Phone, 
  Globe, CreditCard, Calendar, Star, ChevronRight, Plane, Hotel,
  Image, MessageSquare, ExternalLink, Share2, Printer, Check
} from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FavoriteButton } from '@/components/FavoriteButton';
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

// Mock reviews data for demo
const mockReviews = [
  {
    id: '1',
    author: 'Ahmet K.',
    rating: 5,
    date: '2024-01-15',
    content: 'Harika bir çalışma ortamı! WiFi hızı çok iyi ve topluluk etkinlikleri sayesinde birçok ilginç insanla tanıştım. Kesinlikle tavsiye ederim.',
  },
  {
    id: '2',
    author: 'Sarah M.',
    rating: 4,
    date: '2024-01-10',
    content: 'Great atmosphere for remote work. The coffee is excellent and staff is very helpful. Only downside is it can get a bit crowded during peak hours.',
  },
  {
    id: '3',
    author: 'Mehmet T.',
    rating: 5,
    date: '2024-01-05',
    content: 'Digital nomad olarak 3 aydır burada çalışıyorum. Fiyat/performans oranı mükemmel. Networking imkanları da çok iyi.',
  },
];

// Mock gallery images
const mockGalleryImages = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop',
];

const CoworkingDetail = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  
  const space = slug ? getCoworkingSpaceBySlug(slug) : null;
  const city = space ? getCityBySlug(space.citySlug) : null;
  const nomadData = space ? getCityNomadData(space.citySlug) : null;
  
  const currentYear = new Date().getFullYear();
  const galleryImages = space?.images?.length ? space.images : mockGalleryImages;
  
  if (!space) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">{t('coworking.notFound') || 'Çalışma Alanı Bulunamadı'}</h1>
          <p className="text-muted-foreground mb-6">Aradığınız coworking alanı mevcut değil.</p>
          <Button asChild>
            <Link to="/sehirler">{t('cities.title') || 'Şehirlere Gözat'}</Link>
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
    { label: t('nav.home') || 'Ana Sayfa', href: '/' },
    { label: t('cities.title') || 'Şehirler', href: '/sehirler' },
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": space.rating || 4.5,
      "reviewCount": space.reviewCount || mockReviews.length
    },
    "amenityFeature": space.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    }))
  };

  const averageRating = mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length;

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

      {/* Hero Section with Image Gallery */}
      <section className="py-6 gradient-hero text-white">
        <div className="container">
          <Breadcrumb items={breadcrumbItems} className="text-white/70 mb-4" />
          
          <div className="flex items-start justify-between gap-4">
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
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{space.rating || averageRating.toFixed(1)}</span>
                    <span className="text-white/70">({space.reviewCount || mockReviews.length} {t('coworking.reviews') || 'değerlendirme'})</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <FavoriteButton
                type="coworking"
                slug={space.slug}
                name={space.name}
                data={{ city: city?.name, neighborhood: space.neighborhood }}
                size="md"
              />
              <Button variant="secondary" size="icon" className="rounded-full" onClick={() => navigator.share?.({ url: window.location.href, title: space.name })}>
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="container py-4">
        <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2 aspect-[4/3]">
            <img 
              src={galleryImages[selectedImage]} 
              alt={space.name}
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(0)}
            />
          </div>
          {galleryImages.slice(0, 4).map((img, idx) => (
            idx > 0 && (
              <div key={idx} className="aspect-[4/3]">
                <img 
                  src={img} 
                  alt={`${space.name} - ${idx + 1}`}
                  className={`w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity ${selectedImage === idx ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                />
              </div>
            )
          ))}
        </div>
      </section>

      {/* Main Content with Tabs */}
      <main className="container py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start mb-6 bg-muted/50">
                <TabsTrigger value="about">{t('coworking.about') || 'Hakkında'}</TabsTrigger>
                <TabsTrigger value="amenities">{t('coworking.amenities') || 'Olanaklar'}</TabsTrigger>
                <TabsTrigger value="reviews">{t('coworking.reviews') || 'Değerlendirmeler'}</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                {/* About Section */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-xl font-display">{t('coworking.about') || 'Hakkında'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {space.summary}
                    </p>
                    
                    {/* Why Choose This Space */}
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold mb-4">{t('coworking.whyChoose') || 'Bu Alanı Seçmek İçin 3 Neden'}</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">Merkezi Konum</h4>
                            <p className="text-xs text-muted-foreground">{city?.name}'in en erişilebilir noktalarından biri</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">Profesyonel Ortam</h4>
                            <p className="text-xs text-muted-foreground">Hızlı WiFi, ergonomik mobilya</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">Topluluk</h4>
                            <p className="text-xs text-muted-foreground">Networking etkinlikleri</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing */}
                {space.pricing && (
                  <Card variant="elevated">
                    <CardHeader>
                      <CardTitle className="text-xl font-display flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        {t('coworking.pricing') || 'Fiyatlandırma'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        {space.pricing.daily && (
                          <div className="text-center p-4 bg-muted/50 rounded-xl">
                            <div className="text-2xl font-bold text-primary">€{space.pricing.daily}</div>
                            <div className="text-sm text-muted-foreground">{t('coworking.daily') || 'Günlük'}</div>
                          </div>
                        )}
                        {space.pricing.weekly && (
                          <div className="text-center p-4 bg-muted/50 rounded-xl">
                            <div className="text-2xl font-bold text-primary">€{space.pricing.weekly}</div>
                            <div className="text-sm text-muted-foreground">{t('coworking.weekly') || 'Haftalık'}</div>
                          </div>
                        )}
                        {space.pricing.monthly && (
                          <div className="text-center p-4 bg-primary/10 rounded-xl border-2 border-primary/20">
                            <div className="text-2xl font-bold text-primary">€{space.pricing.monthly}</div>
                            <div className="text-sm text-muted-foreground">{t('coworking.monthly') || 'Aylık'}</div>
                            <Badge variant="secondary" className="mt-1 text-xs">En Popüler</Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="amenities">
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-xl font-display">{t('coworking.amenities') || 'Olanaklar'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {space.amenities.map((amenity, index) => {
                        const IconComponent = Object.entries(amenityIcons).find(
                          ([key]) => amenity.toLowerCase().includes(key)
                        )?.[1] || Star;
                        
                        return (
                          <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                            <IconComponent className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-sm font-medium">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card variant="elevated">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-display flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        {t('coworking.reviews') || 'Değerlendirmeler'}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{averageRating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({mockReviews.length})</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockReviews.map((review) => (
                        <div key={review.id} className="p-4 bg-muted/30 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary text-sm">
                                {review.author.charAt(0)}
                              </div>
                              <span className="font-medium">{review.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">{new Date(review.date).toLocaleDateString('tr-TR')}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4">
            {/* Quick Info */}
            <Card variant="elevated">
              <CardContent className="p-6">
                <h3 className="text-lg font-display font-bold mb-4">{t('coworking.quickInfo') || 'Hızlı Bilgiler'}</h3>
                <div className="space-y-3">
                  {space.hours && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">{t('coworking.hours') || 'Çalışma Saatleri'}</div>
                        <div className="font-medium">{space.hours}</div>
                      </div>
                    </div>
                  )}
                  {space.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">{t('coworking.address') || 'Adres'}</div>
                        <div className="font-medium text-sm">{space.address}</div>
                      </div>
                    </div>
                  )}
                  {space.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">{t('coworking.website') || 'Website'}</div>
                        <a 
                          href={space.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          Ziyaret Et <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* CTA Buttons */}
                <div className="mt-6 space-y-2">
                  {space.website && (
                    <Button asChild className="w-full">
                      <a href={space.website} target="_blank" rel="noopener noreferrer">
                        {t('coworking.bookVisit') || 'Ziyaret Rezerve Et'}
                      </a>
                    </Button>
                  )}
                  <FavoriteButton
                    type="coworking"
                    slug={space.slug}
                    name={space.name}
                    data={{ city: city?.name }}
                    variant="button"
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* City Nomad Stats */}
            {nomadData && (
              <Card variant="elevated">
                <CardContent className="p-6">
                  <h3 className="text-lg font-display font-bold mb-4">
                    {city?.name || space.citySlug} {t('coworking.cityNomadScore') || 'Nomad Skoru'}
                  </h3>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-primary">{nomadData.nomadScore}/10</div>
                    <div className="text-sm text-muted-foreground">Genel Puan</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-muted/50 rounded-lg text-center">
                      <div className="font-semibold">{nomadData.internetSpeed}</div>
                      <div className="text-xs text-muted-foreground">İnternet</div>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg text-center">
                      <div className="font-semibold">{nomadData.costOfLiving}</div>
                      <div className="text-xs text-muted-foreground">Yaşam M.</div>
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
