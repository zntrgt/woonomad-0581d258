import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Smartphone, Signal, Globe, Zap, CreditCard, ExternalLink, 
  Wifi, Shield, ChevronRight, Check, X, Info, Monitor, 
  HelpCircle, ArrowRight, Star, AlertTriangle
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from '@/components/ui/accordion';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';

// ─── Affiliate Configuration (Travelpayouts) ──────────────────
// Ana affiliate link — Travelpayouts üzerinden Airalo
const AIRALO_AFFILIATE_LINK = "https://airalo.tpk.ro/8CU9yKIf";

// Ülke bazlı deep link'ler:
// Travelpayouts Tools > Links bölümünden her ülke için deep link üretebilirsiniz.
// Destination page alanına "https://www.airalo.com/turkey-esim" gibi URL yapıştırıp
// Generate butonuna basarak ülke bazlı tracking linkler oluşturabilirsiniz.
// Aşağıda ülkelerin Airalo URL slug'ları tanımlı — deep link'lerinizi aldığınızda
// countryDeepLinks objesine ekleyin.
const countryDeepLinks: Record<string, string> = {
  // Travelpayouts'tan ülke bazlı deep link ürettiğinizde buraya ekleyin:
  // 'turkey': 'https://airalo.tpk.ro/XXXXX',
  // 'germany': 'https://airalo.tpk.ro/YYYYY',
};

// ─── Data ──────────────────────────────────────────────────────

const popularDestinations = [
  { code: 'TR', name: 'Türkiye', slug: 'turkey', flag: '🇹🇷', network: 'Turkcell', speed: '4G/5G' },
  { code: 'DE', name: 'Almanya', slug: 'germany', flag: '🇩🇪', network: 'T-Mobile', speed: '5G' },
  { code: 'FR', name: 'Fransa', slug: 'france', flag: '🇫🇷', network: 'Orange', speed: '4G/5G' },
  { code: 'IT', name: 'İtalya', slug: 'italy', flag: '🇮🇹', network: 'TIM', speed: '4G' },
  { code: 'ES', name: 'İspanya', slug: 'spain', flag: '🇪🇸', network: 'Movistar', speed: '4G/5G' },
  { code: 'GB', name: 'İngiltere', slug: 'united-kingdom', flag: '🇬🇧', network: 'EE', speed: '5G' },
  { code: 'NL', name: 'Hollanda', slug: 'netherlands', flag: '🇳🇱', network: 'KPN', speed: '4G/5G' },
  { code: 'GR', name: 'Yunanistan', slug: 'greece', flag: '🇬🇷', network: 'Cosmote', speed: '4G' },
  { code: 'AE', name: 'BAE', slug: 'united-arab-emirates', flag: '🇦🇪', network: 'du', speed: '5G' },
  { code: 'JP', name: 'Japonya', slug: 'japan', flag: '🇯🇵', network: 'SoftBank', speed: '5G' },
  { code: 'TH', name: 'Tayland', slug: 'thailand', flag: '🇹🇭', network: 'AIS', speed: '4G/5G' },
  { code: 'US', name: 'ABD', slug: 'united-states', flag: '🇺🇸', network: 'T-Mobile', speed: '5G' },
  { code: 'PT', name: 'Portekiz', slug: 'portugal', flag: '🇵🇹', network: 'MEO', speed: '4G/5G' },
  { code: 'GE', name: 'Gürcistan', slug: 'georgia', flag: '🇬🇪', network: 'Magti', speed: '4G' },
  { code: 'ID', name: 'Endonezya', slug: 'indonesia', flag: '🇮🇩', network: 'Telkomsel', speed: '4G' },
  { code: 'SG', name: 'Singapur', slug: 'singapore', flag: '🇸🇬', network: 'Singtel', speed: '5G' },
];

const regionalPackages = [
  { name: 'Avrupa', slug: 'europe', icon: '🇪🇺', countries: '39 ülke', desc: 'AB + İngiltere + İsviçre dahil' },
  { name: 'Asya', slug: 'asia', icon: '🌏', countries: '14 ülke', desc: 'Japonya, Tayland, Güney Kore dahil' },
  { name: 'Global', slug: 'global', icon: '🌍', countries: '130+ ülke', desc: 'Tek paket, dünya geneli kapsam' },
  { name: 'Kuzey Amerika', slug: 'north-america', icon: '🌎', countries: '3 ülke', desc: 'ABD, Kanada, Meksika' },
];

const compatibleDevices = {
  apple: [
    'iPhone XS / XS Max / XR ve sonrası',
    'iPad Pro (3. nesil ve sonrası)',
    'iPad Air (3. nesil ve sonrası)',
    'iPad (7. nesil ve sonrası)',
    'Apple Watch Series 3 ve sonrası',
  ],
  android: [
    'Samsung Galaxy S20 ve sonrası',
    'Samsung Galaxy Z Fold / Flip serisi',
    'Google Pixel 3 ve sonrası',
    'Huawei P40 ve sonrası',
    'OnePlus, Xiaomi, Oppo (2022+ modeller)',
  ],
};

// Provider comparison data
const providerComparison = [
  { 
    name: 'Airalo', 
    countries: '200+', 
    minPrice: '~$4.50', 
    appRating: '4.6',
    hotspot: true, 
    support: '7/24 chat',
    blockedInTR: true,
    highlight: true,
  },
  { 
    name: 'Holafly', 
    countries: '170+', 
    minPrice: '~$6.00', 
    appRating: '4.4',
    hotspot: false, 
    support: '7/24 chat',
    blockedInTR: true,
    highlight: false,
  },
  { 
    name: 'Nomad', 
    countries: '200+', 
    minPrice: '~$5.00', 
    appRating: '4.5',
    hotspot: true, 
    support: 'E-posta',
    blockedInTR: true,
    highlight: false,
  },
  { 
    name: 'Saily (NordVPN)', 
    countries: '150+', 
    minPrice: '~$4.00', 
    appRating: '4.3',
    hotspot: true, 
    support: '7/24 chat',
    blockedInTR: true,
    highlight: false,
  },
];

const faqItems = [
  {
    q: 'eSIM nedir ve nasıl çalışır?',
    a: 'eSIM (embedded SIM), telefonunuzun içine gömülü dijital bir SIM kartıdır. Fiziksel kart takmak yerine QR kod tarayarak veya uygulama üzerinden profil yüklersiniz. Telefonunuzun mevcut SIM kartını çıkarmadan, ikinci hat olarak kullanabilirsiniz.',
  },
  {
    q: 'Türkiye\'den Airalo ve diğer eSIM sitelerine neden giremiyorum?',
    a: 'Temmuz 2025\'ten itibaren BTK (Bilgi Teknolojileri ve İletişim Kurumu), Airalo, Holafly, Saily, Nomad ve 30\'dan fazla uluslararası eSIM sağlayıcısının site ve uygulamalarına Türkiye\'den erişimi engelledi. Engel sağlayıcı platformlarını hedefliyor, eSIM teknolojisini değil. Çözüm: eSIM\'inizi yurtdışına çıkmadan önce VPN ile veya Wi-Fi üzerinden satın alıp yükleyin. Önceden yüklenen eSIM profilleri yurtdışında sorunsuz çalışır.',
  },
  {
    q: 'Telefonum eSIM destekliyor mu?',
    a: 'iPhone XS (2018) ve sonrası tüm iPhone modelleri eSIM destekler. Android tarafında Samsung Galaxy S20+, Google Pixel 3+ ve 2022 sonrası çoğu üst segment telefon eSIM uyumludur. Telefonunuzun Ayarlar > Hücresel/Mobil Veri bölümünde "eSIM Ekle" seçeneği varsa destekliyordur.',
  },
  {
    q: 'eSIM ile hotspot/tethering yapabilir miyim?',
    a: 'Çoğu eSIM sağlayıcısı hotspot desteği sunar. Airalo ve Nomad planlarında hotspot dahildir. Holafly planlarında genellikle hotspot desteklenmez. Satın almadan önce plan detaylarını kontrol edin.',
  },
  {
    q: 'eSIM ile numaram değişir mi?',
    a: 'Mevcut SIM kartınız ve numaranız aynen kalır. eSIM sadece mobil data için ikinci hat olarak çalışır. Aramalarınız ve SMS\'leriniz ana hattınızdan gelmeye devam eder.',
  },
  {
    q: 'Veri paketi biterse ne olur?',
    a: 'Paketiniz bittiğinde internet bağlantınız kesilir ama telefonunuz çalışmaya devam eder. Çoğu sağlayıcı uygulama üzerinden ek paket (top-up) satın alma imkânı sunar. Airalo\'da aynı eSIM\'e ek data yükleyebilirsiniz.',
  },
  {
    q: 'eSIM\'i ne zaman yüklemeliyim?',
    a: 'eSIM profilini seyahatten önce, Wi-Fi bağlantınız varken yükleyin. Profil yüklendikten sonra eSIM\'i pasif bırakın. Hedefe vardığınızda aktif edin — veri planınız o anda başlar.',
  },
  {
    q: 'Fiziksel SIM kart mı yoksa eSIM mi daha avantajlı?',
    a: 'Kısa seyahatler için eSIM çok daha pratik: havalimanında SIM kart aramak, kart değiştirmek, pasaport göstermek yok. Uzun süreli kalışlarda (3+ ay) yerel fiziksel SIM daha ekonomik olabilir çünkü yerel operatör planlarına erişim sağlar.',
  },
  {
    q: 'Birden fazla eSIM profili olabilir mi?',
    a: 'Evet. Çoğu telefon 5-8 eSIM profili saklayabilir ama aynı anda yalnızca bir tanesi aktif olabilir. Sık seyahat edenler için farklı ülkelere ait profilleri saklayıp gerektiğinde aktif etmek mümkün.',
  },
];

const getAiraloUrl = (slug: string) => {
  // Ülke bazlı deep link varsa onu kullan, yoksa ana affiliate linke yönlendir
  return countryDeepLinks[slug] || AIRALO_AFFILIATE_LINK;
};

const getAiraloHomeUrl = () => {
  return AIRALO_AFFILIATE_LINK;
};

// ─── Component ─────────────────────────────────────────────────

const Esim = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const breadcrumbItems = [
    { label: t('nav.home', 'Ana Sayfa'), href: '/' },
    { label: 'eSIM Rehberi' }
  ];

  // FAQPage structured data
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a,
      }
    }))
  };

  // HowTo structured data
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Seyahatte eSIM Nasıl Kullanılır",
    "description": "Yurtdışı seyahatinizde eSIM satın alma ve aktifleştirme adımları.",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Ülke veya bölge seçin",
        "text": "Gideceğiniz ülke veya bölge için eSIM data planı seçin. Birden fazla ülke gezecekseniz bölgesel veya global paket tercih edin."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "eSIM planını satın alın",
        "text": "Seçtiğiniz planı güvenli ödeme ile satın alın. E-posta adresinize QR kod veya aktivasyon bağlantısı gelecektir."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "eSIM profilini yükleyin",
        "text": "iPhone: Ayarlar > Hücresel > eSIM Ekle > QR Kod Tara. Android: Ayarlar > Ağ ve İnternet > SIM > eSIM Ekle. QR kodu tarayarak profili yükleyin."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Hedefe varınca aktif edin",
        "text": "Varış noktasına ulaştığınızda eSIM profilini aktif edin. Telefonunuz yerel ağa bağlanacak ve data planınız başlayacaktır."
      }
    ]
  };

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": "https://woonomad.co/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "eSIM Rehberi",
        "item": "https://woonomad.co/esim"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{`Seyahatte eSIM Rehberi ${currentYear} — Kurulum, Karşılaştırma, Fiyatlar | WooNomad`}</title>
        <meta 
          name="description" 
          content={`Yurtdışı seyahatte eSIM nasıl kullanılır? Airalo, Holafly, Nomad karşılaştırması, uyumlu cihazlar ve ${currentYear} güncel fiyatlar. Adım adım kurulum rehberi.`}
        />
        <link rel="canonical" href="https://woonomad.co/esim" />
        <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(howToStructuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbStructuredData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* ─── Hero ─── */}
        <section className="py-8 md:py-12 gradient-hero text-white">
          <div className="container">
            <Breadcrumb items={breadcrumbItems} className="text-white/70 mb-4" />
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {currentYear} Güncel
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mt-4">
                Yurtdışında İnternet Derdi Bitsin
              </h1>
              <p className="text-lg md:text-xl text-white/85 mt-3 max-w-2xl">
                SIM kart arama, roaming ücreti ödeme. eSIM ile varış noktana inmeden bağlan — 
                dakikalar içinde, telefonundan.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <a href="#ulkeler" className="inline-block">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Globe className="h-5 w-5" />
                    Ülke Seç
                  </Button>
                </a>
                <a href="#nasil-calisir" className="inline-block">
                  <Button size="lg" variant="ghost" className="text-white border-white/30 border gap-2 hover:bg-white/10">
                    <HelpCircle className="h-5 w-5" />
                    Nasıl Çalışır?
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── BTK Uyarısı ─── */}
        <section className="py-4 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800">
          <div className="container">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Türkiye'den Erişim Kısıtlaması
                </p>
                <p className="text-amber-800 dark:text-amber-300 mt-1">
                  Temmuz 2025'ten itibaren BTK, Airalo, Holafly, Saily ve Nomad dahil 30'dan fazla 
                  uluslararası eSIM sağlayıcısının sitesine Türkiye'den erişimi engelledi. 
                  <strong> eSIM'inizi yurtdışına çıkmadan önce satın alın ve yükleyin</strong> — 
                  önceden yüklenen eSIM'ler sorunsuz çalışıyor. Türkiye'deyken satın almak veya 
                  top-up yapmak için VPN gerekebilir.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Quick Stats (replaces generic benefit cards) ─── */}
        <section className="py-6 md:py-8 border-b">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground mt-1">Desteklenen ülke</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-primary">~5 dk</div>
                <div className="text-sm text-muted-foreground mt-1">Kurulum süresi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-primary">4G/5G</div>
                <div className="text-sm text-muted-foreground mt-1">Yerel operatör ağları</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-primary">%70+</div>
                <div className="text-sm text-muted-foreground mt-1">Roaming'e göre tasarruf</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── eSIM Nedir? (editorial intro) ─── */}
        <section className="py-8 md:py-12">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              eSIM Nedir?
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                eSIM (embedded SIM), telefonunuzun içine yerleştirilmiş dijital SIM kartıdır. 
                Fiziksel bir kart takmak yerine QR kod tarayarak ya da uygulama üzerinden profil 
                yüklersiniz. Mevcut SIM kartınızı çıkarmanıza gerek yok — eSIM ikinci hat olarak çalışır.
              </p>
              <p>
                Yurtdışına çıktığınızda havalimanında SIM kart kuyruğuna girmenize, 
                pasaport göstermenize ya da cebinizden kart çıkarmanıza gerek kalmaz. 
                Uçakta Wi-Fi varsa, daha inmeden eSIM profilinizi aktif edebilirsiniz.
              </p>

              {/* eSIM vs Physical SIM comparison */}
              <div className="not-prose mt-6">
                <h3 className="text-lg font-display font-semibold text-foreground mb-3">
                  eSIM mi, Fiziksel SIM mi?
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-sm">eSIM</span>
                        <Badge variant="secondary" className="text-xs">Önerilen</Badge>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          Anında kurulum, fiziksel kart yok
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          Ana numaranız aktif kalır
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          Birden fazla profil saklayabilirsiniz
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                          Tüm telefonlar desteklemiyor
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold text-sm">Fiziksel SIM</span>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          Her telefonda çalışır
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          Uzun kalışlarda daha ekonomik
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                          SIM kart değiştirmek gerekir
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                          Satış noktası bulmak gerekir
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Provider Comparison Table ─── */}
        <section className="py-8 md:py-12 bg-muted/30">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
              eSIM Sağlayıcı Karşılaştırması
            </h2>
            <p className="text-muted-foreground mb-6">
              Seyahat eSIM pazarındaki büyük oyuncuları karşılaştırdık. 
              WooNomad olarak Airalo'yu öneriyoruz — ülke kapsamı, fiyat-performans dengesi 
              ve hotspot desteği bir arada sunan en geniş seçenek.
            </p>
            
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[140px]">Sağlayıcı</TableHead>
                        <TableHead>Ülke</TableHead>
                        <TableHead>Fiyat</TableHead>
                        <TableHead>Puan</TableHead>
                        <TableHead>Hotspot</TableHead>
                        <TableHead>TR Erişim</TableHead>
                        <TableHead>Destek</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {providerComparison.map((provider) => (
                        <TableRow key={provider.name} className={provider.highlight ? 'bg-primary/5' : ''}>
                          <TableCell className="font-semibold">
                            {provider.name}
                            {provider.highlight && (
                              <Badge variant="secondary" className="ml-2 text-xs">Önerilen</Badge>
                            )}
                          </TableCell>
                          <TableCell>{provider.countries}</TableCell>
                          <TableCell>{provider.minPrice}</TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              {provider.appRating}
                            </span>
                          </TableCell>
                          <TableCell>
                            {provider.hotspot ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell>
                            {provider.blockedInTR ? (
                              <span className="flex items-center gap-1 text-xs text-amber-600">
                                <AlertTriangle className="h-3 w-3" />
                                Engelli
                              </span>
                            ) : (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
                          </TableCell>
                          <TableCell className="text-sm">{provider.support}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground mt-3">
              * Fiyatlar ve özellikler değişkenlik gösterebilir. 
              "TR Erişim: Engelli" olan sağlayıcıların siteleri Temmuz 2025'ten itibaren 
              Türkiye'den BTK kararıyla erişime kapatılmıştır. eSIM'inizi yurtdışına çıkmadan 
              önce satın alıp yüklerseniz sorunsuz çalışır.
              Son güncelleme: Ocak {currentYear}.
            </p>
          </div>
        </section>

        {/* ─── Regional Packages ─── */}
        <section className="py-8 md:py-12">
          <div className="container">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-2">
              Bölgesel Paketler
            </h2>
            <p className="text-muted-foreground mb-6">
              Birden fazla ülke gezecekseniz bölgesel paket daha ekonomik. 
              Tek eSIM ile tüm bölgeyi kapsarsınız.
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              {regionalPackages.map((pkg) => (
                <a
                  key={pkg.slug}
                  href={getAiraloUrl(pkg.slug)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="group"
                >
                  <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] h-full">
                    <CardContent className="p-5">
                      <div className="text-3xl mb-2">{pkg.icon}</div>
                      <h3 className="font-display font-bold text-lg">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{pkg.countries}</p>
                      <p className="text-xs text-muted-foreground mt-1">{pkg.desc}</p>
                      <div className="flex items-center gap-1 mt-3 text-sm text-primary font-medium">
                        Paketleri İncele
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Popular Countries ─── */}
        <section id="ulkeler" className="py-8 md:py-12 bg-muted/30 scroll-mt-20">
          <div className="container">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-2">
              Popüler Ülkeler
            </h2>
            <p className="text-muted-foreground mb-6">
              Türk gezginlerin en çok eSIM aldığı destinasyonlar. Her kart sizi 
              doğrudan Airalo'daki ilgili ülke sayfasına yönlendirir.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                        <span className="text-2xl">{dest.flag}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate text-sm">{dest.name}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Signal className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {dest.network} · {dest.speed}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <a
                href={getAiraloHomeUrl()}
                target="_blank"
                rel="noopener noreferrer sponsored"
              >
                <Button size="lg" className="gradient-primary gap-2">
                  <Globe className="h-5 w-5" />
                  Tüm Ülkeleri Gör
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* ─── How It Works (expanded with device tabs) ─── */}
        <section id="nasil-calisir" className="py-8 md:py-12 scroll-mt-20">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">
              eSIM Nasıl Kurulur?
            </h2>

            {/* Steps overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-10">
              {[
                { num: 1, title: 'Paket Seç', desc: 'Ülke veya bölge için data planı seçin. Birden fazla ülke gezecekseniz bölgesel paket tercih edin.' },
                { num: 2, title: 'Satın Al', desc: 'Kredi kartı veya Apple/Google Pay ile ödeme yapın. QR kod e-postanıza gelir.' },
                { num: 3, title: 'Profili Yükle', desc: 'Wi-Fi bağlantısı varken QR kodu tarayıp eSIM profilini telefonunuza yükleyin.' },
                { num: 4, title: 'Aktif Et', desc: 'Hedefe varınca eSIM\'i aktif edin. Yerel ağa bağlanıp data planınız başlar.' },
              ].map((step) => (
                <div key={step.num} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-sm font-bold text-primary">{step.num}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Device-specific installation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-primary" />
                  Cihaz Bazlı Kurulum Adımları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="iphone" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="iphone">iPhone / iPad</TabsTrigger>
                    <TabsTrigger value="android">Android</TabsTrigger>
                  </TabsList>
                  <TabsContent value="iphone" className="space-y-3 text-sm text-muted-foreground">
                    <p><strong className="text-foreground">1.</strong> Ayarlar → Hücresel (veya Mobil Veri) yolunu izleyin.</p>
                    <p><strong className="text-foreground">2.</strong> "eSIM Ekle" veya "Hücresel Plan Ekle" seçeneğine dokunun.</p>
                    <p><strong className="text-foreground">3.</strong> "QR Kod Kullan" seçeneğiyle e-postanızdaki QR kodu tarayın.</p>
                    <p><strong className="text-foreground">4.</strong> "Hücresel Planlar" bölümünde yeni eSIM profilini göreceksiniz.</p>
                    <p><strong className="text-foreground">5.</strong> Yurtdışına varınca: Ayarlar → Hücresel → yeni profili aktif edin ve "Hücresel Veri" olarak seçin.</p>
                    <p className="text-xs text-muted-foreground/70 mt-2">iOS 17.4 ve sonrasında "eSIM Aktarım" özelliği ile profilleri cihazlar arası taşıyabilirsiniz.</p>
                  </TabsContent>
                  <TabsContent value="android" className="space-y-3 text-sm text-muted-foreground">
                    <p><strong className="text-foreground">1.</strong> Ayarlar → Ağ ve İnternet → SIM kartlar yolunu izleyin.</p>
                    <p><strong className="text-foreground">2.</strong> "eSIM Ekle" veya "SIM İndir" seçeneğine dokunun.</p>
                    <p><strong className="text-foreground">3.</strong> "QR Kod Tara" ile e-postanızdaki QR kodu okutun.</p>
                    <p><strong className="text-foreground">4.</strong> Profil indirildikten sonra SIM yönetimi bölümünde görünecektir.</p>
                    <p><strong className="text-foreground">5.</strong> Yurtdışına varınca: SIM yönetiminden eSIM profilini aktif edin ve "Mobil Veri" için seçin.</p>
                    <p className="text-xs text-muted-foreground/70 mt-2">Samsung cihazlarda yol: Ayarlar → Bağlantılar → SIM Yöneticisi → eSIM Ekle.</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ─── Device Compatibility ─── */}
        <section className="py-8 md:py-12 bg-muted/30">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Uyumlu Cihazlar
            </h2>
            <p className="text-muted-foreground mb-6">
              Telefonunuzda Ayarlar → Hücresel/Mobil Veri bölümünde "eSIM Ekle" seçeneği 
              varsa cihazınız eSIM destekliyordur. Operatör kilidi açık olmalıdır.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-lg">🍎</span> Apple
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {compatibleDevices.apple.map((device, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        {device}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-lg">🤖</span> Android
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {compatibleDevices.android.map((device, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        {device}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-8 md:py-12">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">
              Sık Sorulan Sorular
            </h2>
            <Card>
              <CardContent className="p-4 md:p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left text-sm md:text-base">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ─── CTA + Internal Links ─── */}
        <section className="py-8 md:py-12 bg-muted/30">
          <div className="container max-w-4xl">
            {/* Final CTA */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 mb-8">
              <CardContent className="p-6 md:p-8 text-center">
                <Smartphone className="h-10 w-10 mx-auto text-primary mb-3" />
                <h2 className="text-xl md:text-2xl font-display font-bold mb-2">
                  eSIM Paketine Göz At
                </h2>
                <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
                  200'den fazla ülkede yerel ağlara bağlan. Airalo üzerinden paket seç, 
                  QR kodu tara, yola çık.
                </p>
                <a
                  href={getAiraloHomeUrl()}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                >
                  <Button size="lg" className="gradient-primary gap-2">
                    <Globe className="h-5 w-5" />
                    Airalo'da Paketleri Gör
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
                <p className="text-xs text-muted-foreground mt-3">
                  Türkiye'den erişim engelli — VPN gerekebilir veya yurtdışına çıkmadan önce satın alın.
                </p>
              </CardContent>
            </Card>

            {/* Internal Links */}
            <h3 className="text-lg font-display font-semibold mb-4">İlgili Rehberler</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              <Link to="/blog" className="group">
                <Card className="hover:border-primary/30 transition-colors h-full">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      Seyahat Rehberleri
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Şehir rehberleri, rota önerileri ve bütçe planları
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/" className="group">
                <Card className="hover:border-primary/30 transition-colors h-full">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      Ucuz Uçak Bileti
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      En uygun fiyatlı uçuşları karşılaştır
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/solo-seyahat" className="group">
                <Card className="hover:border-primary/30 transition-colors h-full">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      Solo Seyahat Rehberi
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Yalnız gezginler için ipuçları ve destinasyonlar
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Affiliate Disclosure ─── */}
        <section className="py-4 border-t">
          <div className="container max-w-4xl">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                <strong>Affiliate açıklama:</strong> Bu sayfadaki Airalo bağlantıları affiliate linklerdir. 
                Bu linkler üzerinden yapılan satın alımlardan WooNomad komisyon alabilir — 
                sizin ödediğiniz fiyat değişmez. Bu gelir, sitenin ücretsiz kalmasını ve 
                içerik üretmeye devam etmemizi sağlar. 
                Önerilerimiz editoryal değerlendirmemize dayanır; yalnızca kullandığımız 
                ve güvendiğimiz hizmetleri öneriyoruz.
              </p>
            </div>
          </div>
        </section>

        <Footer />
        <MobileBottomNav />
      </div>
    </>
  );
};

export default Esim;
