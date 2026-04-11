import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Smartphone, Signal, Globe, Zap, CreditCard, ExternalLink, Wifi, MapPin, Shield } from 'lucide-react';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

// Travelpayouts Airalo Affiliate ID
const AIRALO_AFFILIATE_ID = "referral_woonomad";

// Popular eSIM destinations
const popularDestinations = [
  { code: 'TR', name: 'Türkiye', slug: 'turkey', flag: '🇹🇷', priceFrom: '$4.50' },
  { code: 'DE', name: 'Almanya', slug: 'germany', flag: '🇩🇪', priceFrom: '$5.00' },
  { code: 'FR', name: 'Fransa', slug: 'france', flag: '🇫🇷', priceFrom: '$5.00' },
  { code: 'IT', name: 'İtalya', slug: 'italy', flag: '🇮🇹', priceFrom: '$4.50' },
  { code: 'ES', name: 'İspanya', slug: 'spain', flag: '🇪🇸', priceFrom: '$5.00' },
  { code: 'GB', name: 'İngiltere', slug: 'united-kingdom', flag: '🇬🇧', priceFrom: '$5.50' },
  { code: 'NL', name: 'Hollanda', slug: 'netherlands', flag: '🇳🇱', priceFrom: '$5.00' },
  { code: 'GR', name: 'Yunanistan', slug: 'greece', flag: '🇬🇷', priceFrom: '$4.50' },
  { code: 'AE', name: 'BAE', slug: 'united-arab-emirates', flag: '🇦🇪', priceFrom: '$5.00' },
  { code: 'JP', name: 'Japonya', slug: 'japan', flag: '🇯🇵', priceFrom: '$6.00' },
  { code: 'TH', name: 'Tayland', slug: 'thailand', flag: '🇹🇭', priceFrom: '$4.00' },
  { code: 'SG', name: 'Singapur', slug: 'singapore', flag: '🇸🇬', priceFrom: '$5.00' },
  { code: 'ID', name: 'Endonezya', slug: 'indonesia', flag: '🇮🇩', priceFrom: '$4.50' },
  { code: 'US', name: 'ABD', slug: 'united-states', flag: '🇺🇸', priceFrom: '$5.00' },
  { code: 'GE', name: 'Gürcistan', slug: 'georgia', flag: '🇬🇪', priceFrom: '$4.00' },
  { code: 'PT', name: 'Portekiz', slug: 'portugal', flag: '🇵🇹', priceFrom: '$5.00' },
];

// Regional packages
const regionalPackages = [
  { name: 'Avrupa', slug: 'europe', icon: '🇪🇺', countries: '39 Ülke', priceFrom: '$5.00' },
  { name: 'Asya', slug: 'asia', icon: '🌏', countries: '14 Ülke', priceFrom: '$5.00' },
  { name: 'Global', slug: 'global', icon: '🌍', countries: '130+ Ülke', priceFrom: '$9.00' },
  { name: 'Kuzey Amerika', slug: 'north-america', icon: '🌎', countries: '3 Ülke', priceFrom: '$5.00' },
];

const getAiraloUrl = (slug: string) => {
  return `https://www.airalo.com/${slug}-esim?${AIRALO_AFFILIATE_ID}`;
};

const Esim = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const breadcrumbItems = [
    { label: t('nav.home', 'Ana Sayfa'), href: '/' },
    { label: 'eSIM' }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": t('esim.pageTitle', 'eSIM Paketleri'),
    "description": t('esim.pageDescription', 'Dünya genelinde eSIM paketleri'),
    "numberOfItems": popularDestinations.length,
    "itemListElement": popularDestinations.map((dest, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": `${dest.name} eSIM`,
        "offers": {
          "@type": "Offer",
          "priceSpecification": {
            "@type": "PriceSpecification",
            "price": dest.priceFrom.replace('$', ''),
            "priceCurrency": "USD"
          }
        }
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>{`eSIM Paketleri ${currentYear} | Yurtdışı Mobil İnternet | WooNomad`}</title>
        <meta 
          name="description" 
          content="Seyahatinizde SIM kart aramadan bağlı kalın. Avrupa, Asya ve dünya genelinde eSIM paketleri. Anında aktivasyon, uygun fiyatlar."
        />
        <meta name="keywords" content="esim, yurtdışı internet, mobil data, seyahat sim, airalo, prepaid sim" />
        <link rel="canonical" href="https://woonomad.co/esim" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="py-8 md:py-10 gradient-hero text-white">
          <div className="container">
            <Breadcrumb items={breadcrumbItems} className="text-white/70 mb-4" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Smartphone className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
                  {t('esim.heroTitle', 'eSIM Paketleri')}
                </h1>
                <p className="text-lg text-white/80 mt-2">
                  {t('esim.heroSubtitle', 'SIM kart aramadan, anında bağlı kal')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-6 md:py-8">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="text-center p-4">
                <Zap className="h-8 w-8 mx-auto text-primary mb-2" />
                <div className="text-sm font-bold">{t('esim.instantActivation', 'Anında Aktivasyon')}</div>
                <div className="text-xs text-muted-foreground">{t('esim.noWaiting', 'Bekleme yok')}</div>
              </Card>
              <Card className="text-center p-4">
                <Wifi className="h-8 w-8 mx-auto text-primary mb-2" />
                <div className="text-sm font-bold">4G/5G</div>
                <div className="text-xs text-muted-foreground">{t('esim.highSpeed', 'Yüksek Hız')}</div>
              </Card>
              <Card className="text-center p-4">
                <CreditCard className="h-8 w-8 mx-auto text-primary mb-2" />
                <div className="text-sm font-bold">{t('esim.affordable', 'Uygun Fiyat')}</div>
                <div className="text-xs text-muted-foreground">{t('esim.noRoaming', 'Roaming yok')}</div>
              </Card>
              <Card className="text-center p-4">
                <Shield className="h-8 w-8 mx-auto text-primary mb-2" />
                <div className="text-sm font-bold">{t('esim.reliable', 'Güvenilir')}</div>
                <div className="text-xs text-muted-foreground">{t('esim.localNetworks', 'Yerel ağlar')}</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Regional Packages */}
        <section className="py-6 md:py-8 bg-muted/30">
          <div className="container">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-6">
              {t('esim.regionalPackages', 'Bölgesel Paketler')}
            </h2>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {regionalPackages.map((pkg) => (
                <a
                  key={pkg.slug}
                  href={getAiraloUrl(pkg.slug)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="group"
                >
                  <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{pkg.icon}</div>
                      <h3 className="font-display font-bold text-lg mb-1">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{pkg.countries}</p>
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant="secondary">{pkg.priceFrom}'dan</Badge>
                        <ExternalLink className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Countries */}
        <section className="py-6 md:py-8">
          <div className="container">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-6">
              {t('esim.popularCountries', 'Popüler Ülkeler')}
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularDestinations.map((dest) => (
                <a
                  key={dest.code}
                  href={getAiraloUrl(dest.slug)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="group"
                >
                  <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{dest.flag}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{dest.name}</h3>
                          <div className="flex items-center gap-2">
                            <Signal className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">4G/5G</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-primary">{dest.priceFrom}</div>
                          <div className="text-xs text-muted-foreground">'dan</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
            
            {/* View All Button */}
            <div className="text-center mt-8">
              <a
                href={`https://www.airalo.com/?${AIRALO_AFFILIATE_ID}`}
                target="_blank"
                rel="noopener noreferrer sponsored"
              >
                <Button size="lg" className="gradient-primary gap-2">
                  <Globe className="h-5 w-5" />
                  {t('esim.viewAllCountries', 'Tüm Ülkeleri Gör')}
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-6 md:py-8 bg-muted/30">
          <div className="container">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-6">
              {t('esim.howItWorks', 'Nasıl Çalışır?')}
            </h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-1">{t('esim.step1Title', 'Paket Seç')}</h3>
                <p className="text-sm text-muted-foreground">{t('esim.step1Desc', 'Ülke veya bölge seçin')}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-1">{t('esim.step2Title', 'Satın Al')}</h3>
                <p className="text-sm text-muted-foreground">{t('esim.step2Desc', 'Güvenli ödeme yapın')}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-1">{t('esim.step3Title', 'QR Tara')}</h3>
                <p className="text-sm text-muted-foreground">{t('esim.step3Desc', 'Telefonuna yükle')}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-primary">4</span>
                </div>
                <h3 className="font-semibold mb-1">{t('esim.step4Title', 'Bağlan')}</h3>
                <p className="text-sm text-muted-foreground">{t('esim.step4Desc', 'Anında internete çık')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-6 md:py-8">
          <div className="container">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl md:text-2xl font-display font-bold mb-3">
                  {t('esim.seoTitle', 'eSIM Nedir?')}
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p>
                    {t('esim.seoContent1', 'eSIM (embedded SIM), fiziksel bir SIM kart gerektirmeden telefonunuza doğrudan yüklenebilen dijital bir SIM kartıdır. Seyahat ederken pahalı roaming ücretlerinden kaçınmanızı ve yerel internet erişimine hızlıca kavuşmanızı sağlar.')}
                  </p>
                  <h3 className="text-xl font-display font-semibold text-foreground mt-6 mb-3">
                    {t('esim.seoSubtitle', 'eSIM Avantajları')}
                  </h3>
                  <ul className="space-y-2">
                    <li>• {t('esim.advantage1', 'Fiziksel SIM kart taşımaya gerek yok')}</li>
                    <li>• {t('esim.advantage2', 'Dakikalar içinde aktif')}</li>
                    <li>• {t('esim.advantage3', 'Roaming ücretlerinden tasarruf')}</li>
                    <li>• {t('esim.advantage4', 'Birden fazla eSIM profili saklayabilirsiniz')}</li>
                    <li>• {t('esim.advantage5', 'Çevrimiçi olarak kolayca yönetin')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 mb-20 md:mb-0 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
            © {currentYear} WooNomad. {t('common.allRightsReserved', 'Tüm hakları saklıdır')}.
          </div>
        </footer>

        <MobileBottomNav />
      </div>
    </>
  );
};

export default Esim;
