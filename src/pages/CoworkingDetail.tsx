import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { 
  MapPin, Wifi, Clock, Coffee, Monitor, Users, Phone, 
  Globe, CreditCard, Star, ChevronRight, Plane, Hotel,
  ExternalLink, Share2, Check, Info, Laptop
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/FavoriteButton';
import { getCoworkingSpaceBySlug, getCoworkingSpacesByCity, getCityNomadData } from '@/lib/nomad';
import { getCityBySlug } from '@/lib/cities';

const amenityIcons: Record<string, typeof Wifi> = {
  'wifi': Wifi, '24saat': Clock, '24/7': Clock,
  'toplantı': Users, 'kahve': Coffee, 'monitör': Monitor, 'telefon': Phone,
};

const getAmenityIcon = (amenity: string) => {
  const found = Object.entries(amenityIcons).find(([key]) => amenity.toLowerCase().includes(key));
  return found?.[1] || Star;
};

const CoworkingDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  
  const space = slug ? getCoworkingSpaceBySlug(slug) : null;
  const city = space ? getCityBySlug(space.citySlug) : null;
  const nomadData = space ? getCityNomadData(space.citySlug) : null;
  
  const currentYear = new Date().getFullYear();
  const defaultImages = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop',
  ];
  const galleryImages = space?.images?.length ? space.images : defaultImages;
  
  if (!space) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Çalışma Alanı Bulunamadı</h1>
          <p className="text-muted-foreground mb-6">Aradığınız coworking alanı mevcut değil.</p>
          <Button asChild><Link to="/sehirler">Şehirlere Gözat</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedSpaces = getCoworkingSpacesByCity(space.citySlug)
    .filter(s => s.slug !== space.slug).slice(0, 3);

  const cityName = city?.name || space.citySlug;
  const canonicalUrl = `https://woonomad.co/coworking/${space.slug}`;

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Şehirler', href: '/sehirler' },
    { label: cityName, href: `/sehir/${space.citySlug}` },
    { label: 'Coworking', href: `/sehir/${space.citySlug}/coworking` },
    { label: space.name }
  ];

  const priceParts: string[] = [];
  if (space.pricing?.daily) priceParts.push(`günlük €${space.pricing.daily}`);
  if (space.pricing?.monthly) priceParts.push(`aylık €${space.pricing.monthly}`);
  const priceText = priceParts.join(', ');

  const seoTitle = `${space.name} — ${cityName} Coworking ${currentYear} | Fiyat, Olanaklar | WooNomad`;
  const metaDesc = `${space.name}, ${cityName}${space.neighborhood ? ` ${space.neighborhood}` : ''} coworking alanı. ${priceText ? `${priceText}. ` : ''}${space.amenities.slice(0, 4).join(', ')}. Dijital göçebeler için.`.slice(0, 160);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": canonicalUrl,
      "name": space.name,
      "description": space.summary,
      "url": canonicalUrl,
      "address": space.address ? {
        "@type": "PostalAddress",
        "streetAddress": space.address,
        "addressLocality": cityName,
        "addressCountry": city?.countryCode || ""
      } : undefined,
      "openingHours": space.hours,
      "priceRange": space.pricing
        ? `€${space.pricing.daily || space.pricing.monthly || ''}`
        : undefined,
      "amenityFeature": space.amenities.map(a => ({
        "@type": "LocationFeatureSpecification",
        "name": a, "value": true
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://woonomad.co/" },
        { "@type": "ListItem", "position": 2, "name": cityName, "item": `https://woonomad.co/sehir/${space.citySlug}` },
        { "@type": "ListItem", "position": 3, "name": "Coworking", "item": `https://woonomad.co/sehir/${space.citySlug}/coworking` },
        { "@type": "ListItem", "position": 4, "name": space.name, "item": canonicalUrl },
      ],
    },
  ];

  const currencySymbol = space.pricing?.currency === 'EUR' ? '€' : (space.pricing?.currency || '€');

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="place" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={galleryImages[0]} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />

      {/* Hero */}
      <section className="py-6 gradient-hero text-white">
        <div className="container">
          <Breadcrumb items={breadcrumbItems} className="text-white/70 mb-4" />
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Monitor className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">{space.name}</h1>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{cityName}</span>
                  {space.neighborhood && (<><span>·</span><span>{space.neighborhood}</span></>)}
                </div>
                {space.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{space.rating}</span>
                    {space.reviewCount && <span className="text-white/60 text-sm">({space.reviewCount} değerlendirme)</span>}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton type="coworking" slug={space.slug} name={space.name} data={{ city: cityName, neighborhood: space.neighborhood }} size="md" />
              <Button variant="secondary" size="icon" className="rounded-full" onClick={() => navigator.share?.({ url: window.location.href, title: space.name })}>
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="container py-4">
        <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2 aspect-[4/3]">
            <img src={galleryImages[selectedImage]} alt={`${space.name} coworking — ${cityName}${space.neighborhood ? `, ${space.neighborhood}` : ''}`} className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedImage(0)} />
          </div>
          {galleryImages.slice(0, 4).map((img, idx) => (
            idx > 0 && (
              <div key={idx} className="aspect-[4/3]">
                <img src={img} alt={`${space.name} — çalışma ortamı ${idx + 1}`} className={`w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity ${selectedImage === idx ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedImage(idx)} />
              </div>
            )
          ))}
        </div>
      </section>

      {/* Main Content — no tabs, everything inline for SEO crawlability */}
      <main className="container py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">

            {/* TL;DR — GEO alıntılanabilir blok */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-start gap-2 mb-2">
                  <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="font-semibold text-sm">Kısa Özet</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {space.name}, {cityName}{space.neighborhood ? `'in ${space.neighborhood} bölgesinde` : `'de`} bulunan bir coworking alanı.
                  {priceText ? ` Fiyatlar ${priceText}.` : ''}
                  {space.hours ? ` Çalışma saatleri: ${space.hours}.` : ''}
                  {` Olanaklar: ${space.amenities.slice(0, 5).join(', ')}.`}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Dijital Göçebe</Badge>
                  <Badge variant="secondary" className="text-xs">Uzaktan Çalışma</Badge>
                  {space.hours === '24/7' && <Badge variant="secondary" className="text-xs">24/7 Açık</Badge>}
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card variant="elevated">
              <CardContent className="p-4 md:p-5">
                <h2 className="text-xl font-display font-bold mb-3">{space.name} Hakkında</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{space.summary}</p>
                {space.highlights && space.highlights.length > 0 && (
                  <div className="mt-5 pt-5 border-t">
                    <h3 className="font-semibold text-sm mb-3">Öne Çıkan Özellikler</h3>
                    <div className="grid md:grid-cols-3 gap-3">
                      {space.highlights.map((hl, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-muted/50 rounded-xl">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm font-medium">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            {space.pricing && (
              <Card variant="elevated">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-display font-bold">Fiyatlandırma</h2>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {space.pricing.daily && (
                      <div className="text-center p-4 bg-muted/50 rounded-xl">
                        <div className="text-2xl font-bold text-primary">{currencySymbol}{space.pricing.daily}</div>
                        <div className="text-sm text-muted-foreground">Günlük</div>
                      </div>
                    )}
                    {space.pricing.weekly && (
                      <div className="text-center p-4 bg-muted/50 rounded-xl">
                        <div className="text-2xl font-bold text-primary">{currencySymbol}{space.pricing.weekly}</div>
                        <div className="text-sm text-muted-foreground">Haftalık</div>
                      </div>
                    )}
                    {space.pricing.monthly && (
                      <div className="text-center p-4 bg-primary/10 rounded-xl border-2 border-primary/20">
                        <div className="text-2xl font-bold text-primary">{currencySymbol}{space.pricing.monthly}</div>
                        <div className="text-sm text-muted-foreground">Aylık</div>
                        <Badge variant="secondary" className="mt-1 text-xs">En Popüler</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            <Card variant="elevated">
              <CardContent className="p-4 md:p-5">
                <h2 className="text-xl font-display font-bold mb-4">Olanaklar</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {space.amenities.map((amenity, i) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div key={i} className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                        <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* City Nomad Context */}
            {nomadData && (
              <Card variant="elevated">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Laptop className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-display font-bold">{cityName} Nomad Bilgileri</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {[
                      { val: nomadData.internetSpeed, lbl: 'Ort. İnternet' },
                      { val: nomadData.costOfLiving, lbl: 'Yaşam Maliyeti' },
                      { val: `${nomadData.coworkingCount}+`, lbl: 'Coworking' },
                      { val: `${nomadData.nomadScore}/10`, lbl: 'Nomad Skoru' },
                    ].map((s, i) => (
                      <div key={i} className="p-3 bg-muted/50 rounded-xl text-center">
                        <div className="font-bold text-primary text-sm">{s.val}</div>
                        <div className="text-xs text-muted-foreground">{s.lbl}</div>
                      </div>
                    ))}
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full gap-2">
                    <Link to={`/sehir/${space.citySlug}/nomad`}>
                      <Laptop className="w-4 h-4" /> {cityName} Nomad Rehberi <ChevronRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card variant="elevated" className="sticky top-20">
              <CardContent className="p-5">
                <h3 className="text-lg font-display font-bold mb-4">Hızlı Bilgiler</h3>
                <div className="space-y-3">
                  {space.hours && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                      <div><div className="text-xs text-muted-foreground">Çalışma Saatleri</div><div className="font-medium text-sm">{space.hours}</div></div>
                    </div>
                  )}
                  {space.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div><div className="text-xs text-muted-foreground">Adres</div><div className="font-medium text-sm">{space.address}</div></div>
                    </div>
                  )}
                  {space.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                      <div><div className="text-xs text-muted-foreground">Website</div><a href={space.website} target="_blank" rel="noopener noreferrer" className="font-medium text-sm text-primary hover:underline flex items-center gap-1">Ziyaret Et <ExternalLink className="w-3 h-3" /></a></div>
                    </div>
                  )}
                  {space.pricing?.monthly && (
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-primary flex-shrink-0" />
                      <div><div className="text-xs text-muted-foreground">Aylık</div><div className="font-medium text-sm">{currencySymbol}{space.pricing.monthly}/ay</div></div>
                    </div>
                  )}
                </div>
                <div className="mt-5 space-y-2">
                  {space.website && (
                    <Button asChild className="w-full"><a href={space.website} target="_blank" rel="noopener noreferrer">Ziyaret Rezerve Et</a></Button>
                  )}
                  <FavoriteButton type="coworking" slug={space.slug} name={space.name} data={{ city: cityName }} variant="button" className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-hero text-white border-0">
              <CardContent className="p-5 text-center">
                <Plane className="w-7 h-7 mx-auto mb-2" />
                <h3 className="font-display font-bold mb-1">{cityName}&#39;e Uçun</h3>
                <p className="text-white/80 text-sm mb-3">En uygun biletleri karşılaştırın</p>
                <Button asChild variant="secondary" size="sm" className="w-full"><Link to={`/sehir/${space.citySlug}/ucak-bileti`}>Bilet Ara</Link></Button>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardContent className="p-5 text-center">
                <Hotel className="w-7 h-7 mx-auto mb-2 text-primary" />
                <h3 className="font-display font-bold mb-1">Konaklama</h3>
                <p className="text-muted-foreground text-sm mb-3">Uzun süreli kalışlar için</p>
                <Button asChild variant="outline" size="sm" className="w-full"><Link to={`/sehir/${space.citySlug}/oteller`}>Otelleri Gör</Link></Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related */}
        {relatedSpaces.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-display font-bold mb-4">{cityName}&#39;deki Diğer Coworking Alanları</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedSpaces.map((rs) => (
                <Link key={rs.slug} to={`/coworking/${rs.slug}`} className="group">
                  <Card variant="elevated" className="h-full hover:border-primary/30 transition-colors">
                    <CardContent className="p-5">
                      <h3 className="font-display font-bold mb-1 group-hover:text-primary transition-colors">{rs.name}</h3>
                      {rs.neighborhood && <p className="text-xs text-muted-foreground mb-2">{rs.neighborhood}</p>}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{rs.summary}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {rs.amenities.slice(0, 2).map((a, i) => (<Badge key={i} variant="secondary" className="text-xs">{a}</Badge>))}
                        </div>
                        {rs.pricing?.monthly && <span className="text-sm font-bold text-primary">{currencySymbol}{rs.pricing.monthly}/ay</span>}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default CoworkingDetail;
