import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { 
  Laptop, 
  Wifi, 
  DollarSign, 
  Shield, 
  Sun, 
  Users, 
  MapPin, 
  Clock, 
  Globe, 
  Coffee, 
  ArrowRight, 
  Hotel, 
  Plane,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Train,
  Calendar,
  ThermometerSun,
  Umbrella,
  MessageCircle,
  ListChecks,
  ChevronRight,
  Info,
  Banknote,
  Home,
  Utensils,
  Zap
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCityBySlug, getAllCities, CityInfo } from '@/lib/cities';
import { getNomadMetrics, getCoworkingSpacesByCity, NomadMetrics } from '@/lib/nomad';
import { getCountryFlag } from '@/lib/destinations';

// Table of Contents sections
const tocSections = [
  { id: 'kimler-icin', label: 'Kimler için uygun?' },
  { id: 'aylik-butce', label: 'Aylık bütçe senaryoları' },
  { id: 'internet-sim', label: 'İnternet & SIM/eSIM' },
  { id: 'en-iyi-bolgeler', label: 'En iyi bölgeler' },
  { id: 'coworking-cafe', label: 'Coworking & cafe kültürü' },
  { id: 'ulasim', label: 'Şehir içi ulaşım' },
  { id: 'guvenlik', label: 'Güvenlik & riskler' },
  { id: 'mevsimler', label: 'Mevsimler & hava' },
  { id: 'topluluk', label: 'Topluluk & etkinlikler' },
  { id: 'checklist', label: '7 günlük kurulum checklist' },
  { id: 'sss', label: 'Sıkça Sorulan Sorular' },
];

// Get similar cities for internal linking
const getSimilarNomadCities = (currentSlug: string, allCities: CityInfo[]): CityInfo[] => {
  const nomadFriendlyCities = ['berlin', 'lizbon', 'barcelona', 'amsterdam', 'bali', 'bangkok', 'tokyo', 'singapur', 'prag', 'budapes', 'tiflis', 'meksikocity'];
  return allCities
    .filter(c => c.slug !== currentSlug && nomadFriendlyCities.includes(c.slug))
    .slice(0, 4);
};

// Budget data generator
const generateBudgetData = (metrics: NomadMetrics | null, cityName: string): { level: string; monthly: string; breakdown: { item: string; cost: string }[] }[] => {
  if (!metrics) {
    return [
      { level: 'Ekonomik', monthly: '~€800-1000/ay', breakdown: [
        { item: 'Konaklama (paylaşımlı)', cost: '€300-400' },
        { item: 'Yemek (ev yapımı)', cost: '€200-250' },
        { item: 'Ulaşım', cost: '€50-100' },
        { item: 'Coworking/Kafe', cost: '€50-100' },
        { item: 'Diğer', cost: '€100-150' },
      ]},
      { level: 'Orta', monthly: '~€1200-1600/ay', breakdown: [
        { item: 'Konaklama (stüdyo)', cost: '€600-800' },
        { item: 'Yemek (karma)', cost: '€300-400' },
        { item: 'Ulaşım', cost: '€80-120' },
        { item: 'Coworking', cost: '€150-200' },
        { item: 'Eğlence & diğer', cost: '€150-200' },
      ]},
      { level: 'Rahat', monthly: '~€2000-2500/ay', breakdown: [
        { item: 'Konaklama (1+1)', cost: '€1000-1200' },
        { item: 'Yemek (dışarıda)', cost: '€400-500' },
        { item: 'Ulaşım', cost: '€100-150' },
        { item: 'Premium coworking', cost: '€250-350' },
        { item: 'Aktiviteler', cost: '€200-300' },
      ]},
    ];
  }

  // Parse cost from metrics (e.g., "€1800/ay" -> 1800)
  const baseCost = parseInt(metrics.costOfLiving.replace(/[^0-9]/g, '')) || 1500;
  const economicMultiplier = 0.6;
  const comfortMultiplier = 1.4;

  return [
    { level: 'Ekonomik', monthly: `~€${Math.round(baseCost * economicMultiplier)}/ay`, breakdown: [
      { item: 'Konaklama (paylaşımlı/hostel)', cost: `€${Math.round(baseCost * economicMultiplier * 0.4)}` },
      { item: 'Yemek (ev yapımı + yerel)', cost: `€${Math.round(baseCost * economicMultiplier * 0.25)}` },
      { item: 'Ulaşım (toplu taşıma)', cost: `€${Math.round(baseCost * economicMultiplier * 0.1)}` },
      { item: 'Kafeler & coworking günlük', cost: `€${Math.round(baseCost * economicMultiplier * 0.1)}` },
      { item: 'SIM/İnternet & diğer', cost: `€${Math.round(baseCost * economicMultiplier * 0.15)}` },
    ]},
    { level: 'Orta', monthly: `~€${baseCost}/ay`, breakdown: [
      { item: 'Konaklama (stüdyo Airbnb)', cost: `€${Math.round(baseCost * 0.45)}` },
      { item: 'Yemek (karma - ev + dışarı)', cost: `€${Math.round(baseCost * 0.2)}` },
      { item: 'Ulaşım (karma)', cost: `€${Math.round(baseCost * 0.08)}` },
      { item: 'Coworking aylık üyelik', cost: `€${Math.round(baseCost * 0.12)}` },
      { item: 'Eğlence, aktivite, diğer', cost: `€${Math.round(baseCost * 0.15)}` },
    ]},
    { level: 'Rahat', monthly: `~€${Math.round(baseCost * comfortMultiplier)}/ay`, breakdown: [
      { item: 'Konaklama (1+1 daire)', cost: `€${Math.round(baseCost * comfortMultiplier * 0.45)}` },
      { item: 'Yemek (restoran ağırlıklı)', cost: `€${Math.round(baseCost * comfortMultiplier * 0.2)}` },
      { item: 'Ulaşım (taksi + kısa kiralama)', cost: `€${Math.round(baseCost * comfortMultiplier * 0.08)}` },
      { item: 'Premium coworking + ekstra', cost: `€${Math.round(baseCost * comfortMultiplier * 0.12)}` },
      { item: 'Aktiviteler, seyahat, wellness', cost: `€${Math.round(baseCost * comfortMultiplier * 0.15)}` },
    ]},
  ];
};

// Neighborhood data by city
const getNeighborhoodData = (citySlug: string): { name: string; workScore: number; lifeScore: number; description: string; pros: string[] }[] => {
  const data: Record<string, { name: string; workScore: number; lifeScore: number; description: string; pros: string[] }[]> = {
    'berlin': [
      { name: 'Kreuzberg', workScore: 9, lifeScore: 9, description: 'Alternatif kültürün kalbi, kafeler ve coworking cennetı', pros: ['Bol coworking', 'Gece hayatı', 'Çok kültürlü'] },
      { name: 'Mitte', workScore: 10, lifeScore: 7, description: 'Şehir merkezi, iş dünyası ve müzeler', pros: ['Merkezi konum', 'Profesyonel ortam', 'Ulaşım kolaylığı'] },
      { name: 'Prenzlauer Berg', workScore: 8, lifeScore: 9, description: 'Aile dostu, parklar ve butik kafeler', pros: ['Sakin atmosfer', 'Yeşil alanlar', 'Kaliteli kafeler'] },
      { name: 'Neukölln', workScore: 8, lifeScore: 8, description: 'Uygun fiyatlı, genç ve dinamik', pros: ['Uygun kiralar', 'Çeşitli mutfak', 'Sanat sahnes'] },
      { name: 'Friedrichshain', workScore: 8, lifeScore: 8, description: 'Sanat, müzik ve startup kültürü', pros: ['Startup hub', 'Gece hayatı', 'Enerji dolu'] },
    ],
    'lizbon': [
      { name: 'Alfama', workScore: 7, lifeScore: 9, description: 'Tarihi mahalle, dar sokaklar ve fado', pros: ['Otantik atmosfer', 'Manzara', 'Turistik'] },
      { name: 'Bairro Alto', workScore: 7, lifeScore: 8, description: 'Gece hayatı ve sanat galerileri', pros: ['Sosyal hayat', 'Merkezî', 'Canlı'] },
      { name: 'Santos/Cais do Sodré', workScore: 9, lifeScore: 8, description: 'Time Out Market, nehir kenarı coworking', pros: ['Nomad hub', 'Modern kafeler', 'Nehir manzarası'] },
      { name: 'Príncipe Real', workScore: 9, lifeScore: 9, description: 'Şık mahalle, premium kafeler', pros: ['Kaliteli mekanlar', 'LGBTQ+ dostu', 'Butikler'] },
      { name: 'Mouraria', workScore: 8, lifeScore: 7, description: 'Çok kültürlü, uygun fiyatlı', pros: ['Ekonomik', 'Otantik', 'Merkezi'] },
    ],
    'barcelona': [
      { name: 'El Born', workScore: 9, lifeScore: 9, description: 'Butik kafeler, tarihi sokaklar', pros: ['Atmosfer', 'Yürüme mesafesi', 'Gastronomı'] },
      { name: 'Gràcia', workScore: 9, lifeScore: 10, description: 'Köy havası, meydanlar ve bağımsız dükkanlar', pros: ['Yerel yaşam', 'Topluluk', 'Uygun fiyat'] },
      { name: 'Eixample', workScore: 10, lifeScore: 8, description: 'Geniş bulvarlar, Gaudi mimarisi', pros: ['Coworking bolluğu', 'Metro erişimi', 'Modernist yapılar'] },
      { name: 'Poblenou', workScore: 10, lifeScore: 8, description: 'Tech hub, deniz kenarı, startup\'lar', pros: ['22@ bölgesi', 'Plaj yakını', 'Modern'] },
      { name: 'Raval', workScore: 8, lifeScore: 7, description: 'Çok kültürlü, sanat ve alternatif', pros: ['Ucuz yemek', 'Sanat', 'MACBA yakını'] },
    ],
    'bali': [
      { name: 'Canggu', workScore: 10, lifeScore: 9, description: 'Nomad başkenti, sörf ve coworking', pros: ['Dojo/Outpost', 'Sörf', 'Vegan kafeler'] },
      { name: 'Ubud', workScore: 9, lifeScore: 9, description: 'Doğa, yoga ve sanat', pros: ['Pirinç terasları', 'Wellness', 'Sakin'] },
      { name: 'Seminyak', workScore: 7, lifeScore: 8, description: 'Lüks oteller ve plaj kulüpleri', pros: ['Restoran çeşitliliği', 'Gece hayatı', 'Alışveriş'] },
      { name: 'Sanur', workScore: 7, lifeScore: 8, description: 'Sakin plajlar, aile dostu', pros: ['Sessiz', 'Uygun fiyat', 'Bisiklet dostu'] },
      { name: 'Uluwatu', workScore: 6, lifeScore: 8, description: 'Uçurum manzaraları, sörf noktaları', pros: ['Muhteşem manzara', 'Sörf', 'Sunset'] },
    ],
    'bangkok': [
      { name: 'Sukhumvit (Thonglor/Ekkamai)', workScore: 10, lifeScore: 9, description: 'Expat merkezi, trendy kafeler', pros: ['BTS erişimi', 'Uluslararası', 'Gece hayatı'] },
      { name: 'Silom/Sathorn', workScore: 9, lifeScore: 7, description: 'İş merkezi, gökdelenler', pros: ['Profesyonel', 'Metro', 'Finans'] },
      { name: 'Ari', workScore: 9, lifeScore: 9, description: 'Hipster mahalle, yerel kafeler', pros: ['Lokal hissi', 'Kahve kültürü', 'Sakin'] },
      { name: 'On Nut', workScore: 8, lifeScore: 8, description: 'Uygun fiyatlı, expat dostu', pros: ['Ekonomik', 'BTS üzerinde', 'Market'] },
      { name: 'Khao San', workScore: 6, lifeScore: 7, description: 'Backpacker cenneti, canlı sokaklar', pros: ['Sosyal', 'Ucuz', 'Merkezi'] },
    ],
    'tokyo': [
      { name: 'Shibuya', workScore: 9, lifeScore: 8, description: 'Gençlik kültürü, startup hub', pros: ['Tech scene', 'Ulaşım', 'Alışveriş'] },
      { name: 'Nakameguro', workScore: 9, lifeScore: 9, description: 'Kanal kenarı, trendy kafeler', pros: ['Estetik', 'Butikler', 'Sakin'] },
      { name: 'Shinjuku', workScore: 8, lifeScore: 7, description: 'Dev istasyon, iş merkezi', pros: ['Merkezi', 'Her şey var', 'Gece hayatı'] },
      { name: 'Shimokitazawa', workScore: 8, lifeScore: 9, description: 'Bohem, vintage ve indie kültür', pros: ['Alternatif', 'Kafeler', 'Canlı müzik'] },
      { name: 'Daikanyama', workScore: 8, lifeScore: 8, description: 'Şık, tasarım ve T-Site', pros: ['Premium', 'Kitapçı kafe', 'Moda'] },
    ],
  };

  return data[citySlug] || [
    { name: 'Şehir Merkezi', workScore: 8, lifeScore: 7, description: 'Ana iş ve turizm bölgesi', pros: ['Merkezi konum', 'Ulaşım kolaylığı', 'Seçenek bolluğu'] },
    { name: 'Tarihi Bölge', workScore: 7, lifeScore: 8, description: 'Kültürel atmosfer ve yerel yaşam', pros: ['Otantik', 'Karakterli', 'Kafeler'] },
    { name: 'Modern Bölge', workScore: 9, lifeScore: 7, description: 'Yeni gelişen, iş odaklı alan', pros: ['Coworking', 'Modern', 'Ulaşım'] },
  ];
};

// Generate FAQ data for the city
const generateFAQData = (city: CityInfo, metrics: NomadMetrics | null): { question: string; answer: string }[] => {
  const faqs = [
    {
      question: `${city.name}'de dijital göçebe olarak aylık ne kadar harcama yapılır?`,
      answer: metrics 
        ? `${city.name}'de ortalama bir dijital göçebe aylık ${metrics.costOfLiving} civarında harcama yapar. Bu rakam; konaklama, yemek, ulaşım ve coworking masraflarını içerir. Ekonomik yaşamak isteyenler bu rakamı %30-40 düşürebilirken, rahat yaşam tercihi %40-50 artırabilir.`
        : `${city.name}'de yaşam maliyeti bölge ortalamasına göre değişkenlik gösterir. Detaylı bütçe bilgisi için yukarıdaki senaryoları inceleyebilirsiniz.`
    },
    {
      question: `${city.name}'de internet hızı uzaktan çalışma için yeterli mi?`,
      answer: metrics
        ? `Evet, ${city.name}'de ortalama internet hızı ${metrics.internetSpeed} civarındadır. Bu hız video konferans, dosya paylaşımı ve genel remote çalışma için oldukça yeterlidir. Coworking alanlarında genellikle daha yüksek ve stabil bağlantı bulabilirsiniz.`
        : `${city.name}'de internet altyapısı şehir merkezinde genellikle yeterlidir. Coworking alanları ve modern kafeler güvenilir WiFi sunar.`
    },
    {
      question: `${city.name}'de dijital göçebeler için vize gerekli mi?`,
      answer: metrics
        ? `${metrics.visaInfo}. Türk vatandaşları için vize gereksinimleri farklılık gösterebilir. Uzun süreli kalış için yerel göçmenlik ofisinden güncel bilgi almanızı öneririz.`
        : `${city.name}'de vize gereksinimleri ülkenize göre değişir. Türk vatandaşları için güncel vize bilgisini dışişleri bakanlığı sitesinden kontrol edin.`
    },
    {
      question: `${city.name}'de en iyi coworking alanları hangileri?`,
      answer: `${city.name}'de ${metrics ? metrics.coworkingCount + '+' : 'çok sayıda'} coworking alanı bulunmaktadır. Popüler seçenekler arasında şehir merkezindeki premium ofisler, mahalle bazlı butik alanlar ve cafe-coworking hibrit mekanlar yer alır. Detaylı liste için coworking sayfamızı ziyaret edin.`
    },
    {
      question: `${city.name}'de hangi mahallede kalmalıyım?`,
      answer: `${city.name}'de mahalle seçimi önceliklerinize bağlıdır. Çalışma odaklıysanız coworking yoğunluğu yüksek merkezi bölgeleri, yaşam kalitesi öncelikliyse sakin ve yeşil mahalleleri tercih edebilirsiniz. Yukarıdaki "En İyi Bölgeler" bölümünde detaylı karşılaştırma bulabilirsiniz.`
    },
    {
      question: `${city.name}'de güvenlik nasıl? Dikkat edilmesi gerekenler neler?`,
      answer: metrics
        ? `${city.name} güvenlik açısından ${metrics.safetyScore}/10 puan almaktadır. ${metrics.safetyScore >= 8 ? 'Genel olarak güvenli bir şehirdir.' : metrics.safetyScore >= 6 ? 'Normal tedbirlerle rahat yaşanabilir.' : 'Bazı bölgelerde dikkatli olmak gerekir.'} Turistik bölgelerde yankesicilik, taksi dolandırıcılığı gibi klasik risklere karşı dikkatli olun.`
        : `${city.name}'de standart şehir güvenlik önlemlerini almanız önerilir. Değerli eşyalarınızı koruyun ve gece geç saatlerde ıssız bölgelerden kaçının.`
    },
    {
      question: `${city.name}'e gitmek için en uygun zaman ne zaman?`,
      answer: `${city.name}'i ziyaret için en ideal dönem ${city.bestTimeToVisit} aylarıdır. Bu dönemde hava koşulları çalışmak ve şehri keşfetmek için idealdir. Yoğun turist sezonunu atlatmak istiyorsanız bu dönemin başlangıç veya bitiş aylarını tercih edebilirsiniz.`
    },
    {
      question: `${city.name}'de nomad topluluğu var mı?`,
      answer: metrics
        ? `Evet, ${city.name} dijital göçebe topluluğu açısından ${metrics.communityScore}/10 puan almaktadır. ${metrics.communityScore >= 8 ? 'Aktif bir nomad topluluğu var, düzenli etkinlikler ve buluşmalar düzenleniyor.' : metrics.communityScore >= 6 ? 'Orta düzeyde bir topluluk mevcut.' : 'Topluluk gelişmekte, ancak online gruplar aktif.'} Facebook grupları, Meetup etkinlikleri ve coworking alanlarındaki networking fırsatlarından yararlanabilirsiniz.`
        : `${city.name}'de dijital göçebe topluluğunu bulmak için Facebook gruplarını, Meetup.com'u ve coworking alanlarındaki etkinlikleri takip edebilirsiniz.`
    },
  ];

  return faqs;
};

const CityNomad = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : null;
  const allCities = getAllCities();
  const metrics = slug ? getNomadMetrics(slug) : null;
  const coworkingSpaces = slug ? getCoworkingSpacesByCity(slug) : [];
  
  const currentYear = new Date().getFullYear();
  const lastUpdated = new Date().toISOString().split('T')[0]; // Today as last updated
  const hasFullData = Boolean(metrics && metrics.nomadScore > 0);

  if (!city) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Şehir Bulunamadı</h1>
          <Link to="/sehirler" className="text-primary hover:underline">Tüm Şehirlere Gözat</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const flag = getCountryFlag(city.countryCode);
  const similarCities = getSimilarNomadCities(city.slug, allCities);
  const budgetData = generateBudgetData(metrics, city.name);
  const neighborhoods = getNeighborhoodData(city.slug);
  const faqData = generateFAQData(city, metrics);

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Şehirler', href: '/sehirler' },
    { label: city.name, href: `/sehir/${city.slug}` },
    { label: 'Dijital Göçebe Rehberi' }
  ];

  // SEO
  const seoTitle = `${city.name} Dijital Göçebe Rehberi ${currentYear} | Bütçe, İnternet, Bölgeler, İpuçları`;
  const seoDescription = metrics
    ? `${city.name} nomad rehberi. ${metrics.costOfLiving} bütçe, ${metrics.internetSpeed} internet, ${metrics.coworkingCount}+ coworking, güvenlik ${metrics.safetyScore}/10, topluluk ${metrics.communityScore}/10.`
    : `${city.name} dijital göçebe rehberi. Bütçe, konaklama, coworking alanları ve uzaktan çalışma ipuçları. ${city.country} nomad yaşamı.`;
  const canonicalUrl = `https://woonomad.co/sehir/${city.slug}/nomad`;

  // Schema: Article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    "headline": `${city.name} Dijital Göçebe Rehberi (${currentYear})`,
    "description": seoDescription,
    "image": city.image,
    "datePublished": "2024-01-01",
    "dateModified": lastUpdated,
    "author": {
      "@type": "Organization",
      "name": "WooNomad",
      "url": "https://woonomad.co"
    },
    "publisher": {
      "@type": "Organization",
      "name": "WooNomad",
      "url": "https://woonomad.co",
      "logo": {
        "@type": "ImageObject",
        "url": "https://woonomad.co/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "about": {
      "@type": "City",
      "name": city.name
    }
  };

  // Schema: BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://woonomad.co" },
      { "@type": "ListItem", "position": 2, "name": "Şehirler", "item": "https://woonomad.co/sehirler" },
      { "@type": "ListItem", "position": 3, "name": city.name, "item": `https://woonomad.co/sehir/${city.slug}` },
      { "@type": "ListItem", "position": 4, "name": "Dijital Göçebe Rehberi", "item": canonicalUrl }
    ]
  };

  // Schema: FAQPage
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const combinedSchema = [articleSchema, breadcrumbSchema, faqSchema];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription.slice(0, 160)} />
        <meta name="keywords" content={`${city.name} dijital göçebe, ${city.name} nomad, ${city.name} coworking, ${city.name} yaşam maliyeti, ${city.name} remote work, ${city.country} nomad`} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Thin content: noindex if no data */}
        {!hasFullData && <meta name="robots" content="noindex, follow" />}
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription.slice(0, 160)} />
        <meta property="og:image" content={city.image} />
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:site_name" content="WooNomad" />
        <meta property="article:published_time" content="2024-01-01" />
        <meta property="article:modified_time" content={lastUpdated} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription.slice(0, 160)} />
        <meta name="twitter:image" content={city.image} />
        
        {/* Schema */}
        <script type="application/ld+json">{JSON.stringify(combinedSchema)}</script>
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={city.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10">
          <Breadcrumb items={breadcrumbItems} className="text-white/70 mb-6" />
          <div className="flex items-start gap-4 mb-4">
            <span className="text-5xl md:text-6xl">{flag}</span>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight">
                {city.name} Dijital Göçebe Rehberi ({currentYear})
              </h1>
              <p className="text-white/80 text-lg mt-2">
                {city.country}'da uzaktan çalışma için eksiksiz rehber
              </p>
            </div>
          </div>
          
          {/* Key Stats Bar */}
          {metrics && (
            <div className="flex flex-wrap gap-4 mt-6">
              <Badge variant="secondary" className="text-sm py-1.5 px-3">
                <Laptop className="w-4 h-4 mr-1.5" />
                Nomad Skoru: {metrics.nomadScore}/10
              </Badge>
              <Badge variant="outline" className="text-sm py-1.5 px-3 border-white/30 text-white">
                <Wifi className="w-4 h-4 mr-1.5" />
                {metrics.internetSpeed}
              </Badge>
              <Badge variant="outline" className="text-sm py-1.5 px-3 border-white/30 text-white">
                <DollarSign className="w-4 h-4 mr-1.5" />
                {metrics.costOfLiving}
              </Badge>
              <Badge variant="outline" className="text-sm py-1.5 px-3 border-white/30 text-white">
                <Building2 className="w-4 h-4 mr-1.5" />
                {metrics.coworkingCount}+ Coworking
              </Badge>
            </div>
          )}
          
          {/* Last Updated */}
          <p className="text-white/60 text-sm mt-4">
            <Calendar className="w-4 h-4 inline mr-1" />
            Son güncelleme: {new Date(lastUpdated).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </section>

      <main className="container py-8 md:py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents */}
          <aside className="lg:col-span-1">
            <Card variant="elevated" className="sticky top-20">
              <CardContent className="p-4">
                <h2 className="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-3">
                  İçindekiler
                </h2>
                <nav className="space-y-1">
                  {tocSections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm py-1.5 px-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {section.label}
                    </a>
                  ))}
                </nav>
                
                {/* Quick CTA */}
                <div className="mt-6 pt-4 border-t border-border">
                  <Button asChild size="sm" className="w-full">
                    <Link to={`/sehir/${city.slug}/ucak-bileti`}>
                      <Plane className="w-4 h-4 mr-2" />
                      {city.name}'e Uç
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-10">
            
            {/* Thin Content Warning */}
            {!hasFullData && (
              <Card className="border-warning/50 bg-warning/5">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-2">Bu sayfa geliştirme aşamasında</h3>
                      <p className="text-muted-foreground mb-4">
                        {city.name} için detaylı nomad verileri henüz tamamlanmadı. Aşağıda genel bilgiler ve tahmini veriler yer almaktadır. 
                        Daha kapsamlı rehberler için aşağıdaki popüler şehirleri ziyaret edebilirsiniz:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {similarCities.map(c => (
                          <Button key={c.slug} asChild variant="outline" size="sm">
                            <Link to={`/sehir/${c.slug}/nomad`}>
                              {getCountryFlag(c.countryCode)} {c.name}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Section: Kimler için uygun? */}
            <section id="kimler-icin">
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">
                    {city.name} Kimler İçin Uygun?
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {city.name}, farklı dijital göçebe profillerine hitap eden çeşitli özelliklere sahiptir. 
                    Aşağıda hangi tip çalışanlar için ideal olduğunu ve kimlerin farklı bir destinasyon düşünmesi gerektiğini bulabilirsiniz.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <h3 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        {city.name} Sana Göre Eğer...
                      </h3>
                      <ul className="space-y-2 text-sm">
                        {metrics && metrics.communityScore >= 8 && (
                          <li className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 text-green-600" />
                            <span>Aktif bir nomad topluluğu ve networking arıyorsan</span>
                          </li>
                        )}
                        {metrics && metrics.internetSpeed.includes('100') && (
                          <li className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 text-green-600" />
                            <span>Yüksek hızlı ve stabil internet kritik öneme sahipse</span>
                          </li>
                        )}
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-green-600" />
                          <span>{city.country} kültürünü ve mutfağını keşfetmek istiyorsan</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-green-600" />
                          <span>Çeşitli coworking seçenekleri arasından seçim yapmak istiyorsan</span>
                        </li>
                        {metrics && parseInt(metrics.costOfLiving.replace(/[^0-9]/g, '')) < 1500 && (
                          <li className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 text-green-600" />
                            <span>Uygun maliyetli bir yaşam arıyorsan</span>
                          </li>
                        )}
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-green-600" />
                          <span>İş-yaşam dengesini önemsiyorsan</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <h3 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Farklı Bir Yer Düşün Eğer...
                      </h3>
                      <ul className="space-y-2 text-sm">
                        {metrics && parseInt(metrics.costOfLiving.replace(/[^0-9]/g, '')) > 2000 && (
                          <li className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 text-red-600" />
                            <span>Çok düşük bütçeyle (€1000/ay altı) yaşamak istiyorsan</span>
                          </li>
                        )}
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-red-600" />
                          <span>Yerel dili hiç bilmiyorsan ve sadece İngilizce ile yetinmek zor geliyorsa</span>
                        </li>
                        {metrics && metrics.weatherScore <= 5 && (
                          <li className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-0.5 text-red-600" />
                            <span>Yıl boyunca güneşli ve sıcak hava arıyorsan</span>
                          </li>
                        )}
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-red-600" />
                          <span>Uzun vadeli vize esnekliği kritikse (bazı ülkelerde zor)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-red-600" />
                          <span>Tropik plaj yaşamı birincil önceliğinse</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section: Aylık Bütçe */}
            <section id="aylik-butce">
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                    {city.name} Aylık Bütçe Senaryoları
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {city.name}'de dijital göçebe olarak yaşam maliyetiniz, tercih ettiğiniz yaşam tarzına göre önemli ölçüde değişebilir. 
                    Aşağıda üç farklı senaryo için detaylı bütçe dağılımı bulabilirsiniz.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {budgetData.map((budget, index) => (
                      <Card key={budget.level} className={index === 1 ? 'border-primary ring-1 ring-primary' : ''}>
                        <CardContent className="p-4">
                          <div className="text-center mb-4">
                            <Badge variant={index === 1 ? 'default' : 'secondary'}>
                              {budget.level}
                            </Badge>
                            <p className="text-2xl font-bold mt-2">{budget.monthly}</p>
                          </div>
                          <div className="space-y-2">
                            {budget.breakdown.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{item.item}</span>
                                <span className="font-medium">{item.cost}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      Bu rakamlar {currentYear} yılı için tahmini değerlerdir ve kişisel tercihlere, mevsime ve konuma göre değişebilir. 
                      Konaklama maliyetleri özellikle turist sezonunda artış gösterebilir.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section: İnternet & SIM */}
            <section id="internet-sim">
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                    İnternet & SIM/eSIM
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {city.name}'de remote çalışma için internet altyapısı {metrics ? (metrics.internetSpeed.includes('100') || metrics.internetSpeed.includes('150') || metrics.internetSpeed.includes('200') ? 'mükemmel' : 'yeterli') : 'genel olarak iyi'} düzeydedir.
                    İşte bağlantı seçenekleriniz:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Wifi className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">WiFi Hızları</h3>
                          <p className="text-sm text-muted-foreground">
                            Şehir genelinde ortalama: {metrics?.internetSpeed || '50-100 Mbps'}. 
                            Coworking alanlarında genellikle 100+ Mbps bulunur. Kafeler değişkenlik gösterebilir.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Smartphone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Mobil Data (SIM/eSIM)</h3>
                          <p className="text-sm text-muted-foreground">
                            Yerel SIM kartlar havalimanı veya şehir merkezindeki mağazalardan alınabilir. 
                            eSIM destekli telefonlar için Airalo, Holafly gibi servisler kullanılabilir.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <h3 className="font-semibold mb-3">💡 İnternet İpuçları</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Önemli görüşmeler için coworking alanlarını tercih edin</li>
                        <li>• Mobil hotspot'u yedek olarak mutlaka hazır tutun</li>
                        <li>• Airbnb seçerken internet hızını önceden sorun</li>
                        <li>• VPN kullanmayı düşünün (bazı içerikler kısıtlı olabilir)</li>
                        <li>• Kafeden çalışacaksanız önce WiFi test edin</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section: En İyi Bölgeler */}
            <section id="en-iyi-bolgeler">
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                    {city.name}'de En İyi Bölgeler
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Hangi mahallede kalacağınız, günlük yaşamınızı doğrudan etkiler. 
                    Aşağıda {city.name}'in dijital göçebeler için en uygun bölgelerini çalışma ve yaşam puanlarıyla birlikte bulabilirsiniz.
                  </p>
                  
                  <div className="space-y-4">
                    {neighborhoods.map((hood, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-lg font-bold flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-primary" />
                              {hood.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{hood.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={hood.workScore >= 9 ? 'default' : 'secondary'}>
                              Çalışma: {hood.workScore}/10
                            </Badge>
                            <Badge variant={hood.lifeScore >= 9 ? 'default' : 'secondary'}>
                              Yaşam: {hood.lifeScore}/10
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {hood.pros.map((pro, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-muted rounded-full">
                              {pro}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section: Coworking & Cafe */}
            <section id="coworking-cafe">
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl md:text-3xl font-display font-bold">
                      Coworking & Cafe Çalışma Kültürü
                    </h2>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/sehir/${city.slug}/coworking`}>
                        Tüm Alanlar
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {city.name}'de {metrics ? metrics.coworkingCount + '+' : 'çok sayıda'} coworking alanı ve 
                    {metrics ? ' ' + metrics.cafesWithWifi + '+' : ' yüzlerce'} WiFi'lı kafe bulunmaktadır. 
                    Şehir, remote çalışanlar için gelişmiş bir ekosisteme sahiptir.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-bold mb-3 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        Coworking Alanları
                      </h3>
                      {coworkingSpaces.length > 0 ? (
                        <div className="space-y-3">
                          {coworkingSpaces.slice(0, 4).map(space => (
                            <Link 
                              key={space.slug} 
                              to={`/coworking/${space.slug}`}
                              className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{space.name}</p>
                                  <p className="text-xs text-muted-foreground">{space.neighborhood}</p>
                                </div>
                                {space.pricing?.monthly && (
                                  <Badge variant="secondary" className="text-xs">
                                    €{space.pricing.monthly}/ay
                                  </Badge>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {city.name} için coworking listesi yakında eklenecek.
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-bold mb-3 flex items-center gap-2">
                        <Coffee className="w-5 h-5 text-primary" />
                        Kafe Çalışma Kültürü
                      </h3>
                      <div className="space-y-3 text-sm">
                        <p className="text-muted-foreground">
                          {city.name}'de kafeden çalışmak oldukça yaygındır. Dikkat edilmesi gerekenler:
                        </p>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500" />
                            WiFi şifresini sormadan önce bir şeyler sipariş edin
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500" />
                            Yoğun saatlerde masayı uzun süre işgal etmeyin
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500" />
                            Sessiz köşeleri tercih edin
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500" />
                            Priz olan masaları önceden belirleyin
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section: Ulaşım */}
            <section id="ulasim">
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                    Şehir İçi Ulaşım
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {city.name}'de günlük ulaşım için çeşitli seçenekler mevcuttur. 
                    Hangi seçeneğin sizin için uygun olduğu, konaklamanızın yerine ve çalışma tarzınıza bağlıdır.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <Train className="w-8 h-8 text-primary mb-2" />
                      <h3 className="font-semibold mb-1">Toplu Taşıma</h3>
                      <p className="text-sm text-muted-foreground">
                        Metro, otobüs ve tramvay ağı. Aylık kart ekonomik seçenek.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <Zap className="w-8 h-8 text-primary mb-2" />
                      <h3 className="font-semibold mb-1">Scooter/Bisiklet</h3>
                      <p className="text-sm text-muted-foreground">
                        E-scooter ve bisiklet kiralama uygulamaları aktif.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <Globe className="w-8 h-8 text-primary mb-2" />
                      <h3 className="font-semibold mb-1">Yürüyüş</h3>
                      <p className="text-sm text-muted-foreground">
                        Merkezi bölgelerde çoğu yer yürüme mesafesinde.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section: Güvenlik */}
            <section id="guvenlik">
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                    Güvenlik & Dolandırıcılık Riskleri
                  </h2>
                  
                  {metrics && (
                    <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-xl">
                      <Shield className={`w-12 h-12 ${metrics.safetyScore >= 8 ? 'text-green-500' : metrics.safetyScore >= 6 ? 'text-yellow-500' : 'text-red-500'}`} />
                      <div>
                        <p className="font-bold text-lg">Güvenlik Skoru: {metrics.safetyScore}/10</p>
                        <p className="text-muted-foreground">
                          {metrics.safetyScore >= 8 
                            ? `${city.name} genel olarak güvenli bir şehirdir.` 
                            : metrics.safetyScore >= 6 
                              ? `${city.name}'de normal tedbirlerle rahat yaşanabilir.` 
                              : `${city.name}'de bazı bölgelerde dikkatli olmak gerekir.`
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold mb-3 text-red-600 dark:text-red-400">⚠️ Dikkat Edilmesi Gerekenler</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Turistik bölgelerde yankesicilik</li>
                        <li>• Taksilerde taksimetre kullanımını kontrol edin</li>
                        <li>• ATM'lerde skimming cihazlarına dikkat</li>
                        <li>• Sahte "yardım" tekliflerine karşı uyanık olun</li>
                        <li>• Geceleri ıssız bölgelerden kaçının</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold mb-3 text-green-600 dark:text-green-400">✓ Güvenlik İpuçları</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Değerli eşyaları görünür yerde taşımayın</li>
                        <li>• Uber/Bolt gibi uygulamaları tercih edin</li>
                        <li>• Konaklama yerinizin güvenliğini kontrol edin</li>
                        <li>• Önemli belgelerin kopyasını bulutta saklayın</li>
                        <li>• Yerel acil numaraları kaydedin</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section: Mevsimler */}
            <section id="mevsimler">
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                    Mevsimler, Hava & Giyim
                  </h2>
                  
                  {metrics && (
                    <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-xl">
                      <ThermometerSun className={`w-12 h-12 ${metrics.weatherScore >= 8 ? 'text-yellow-500' : metrics.weatherScore >= 6 ? 'text-blue-500' : 'text-gray-500'}`} />
                      <div>
                        <p className="font-bold text-lg">Hava Skoru: {metrics.weatherScore}/10</p>
                        <p className="text-muted-foreground">
                          En iyi ziyaret zamanı: {city.bestTimeToVisit}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-green-500/10 text-center">
                      <Sun className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="font-semibold">İlkbahar</p>
                      <p className="text-xs text-muted-foreground">Ideal, ılıman</p>
                    </div>
                    <div className="p-4 rounded-xl bg-yellow-500/10 text-center">
                      <ThermometerSun className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <p className="font-semibold">Yaz</p>
                      <p className="text-xs text-muted-foreground">Sıcak, yoğun</p>
                    </div>
                    <div className="p-4 rounded-xl bg-orange-500/10 text-center">
                      <Sun className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="font-semibold">Sonbahar</p>
                      <p className="text-xs text-muted-foreground">İdeal, sakin</p>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-500/10 text-center">
                      <Umbrella className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-semibold">Kış</p>
                      <p className="text-xs text-muted-foreground">Soğuk/yağışlı</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <h3 className="font-semibold mb-2">🧳 Paketleme Önerileri</h3>
                    <p className="text-sm text-muted-foreground">
                      {city.name} için {city.bestTimeToVisit} döneminde hafif katmanlar, yürüyüş ayakkabısı ve şemsiye/yağmurluk önerilir. 
                      Coworking alanları klimalı olduğundan yanınızda ince bir hırka bulundurun.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section: Topluluk */}
            <section id="topluluk">
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                    Topluluk & Etkinlik Bulma
                  </h2>
                  
                  {metrics && (
                    <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-xl">
                      <Users className={`w-12 h-12 ${metrics.communityScore >= 8 ? 'text-green-500' : metrics.communityScore >= 6 ? 'text-yellow-500' : 'text-gray-500'}`} />
                      <div>
                        <p className="font-bold text-lg">Topluluk Skoru: {metrics.communityScore}/10</p>
                        <p className="text-muted-foreground">
                          {metrics.communityScore >= 8 
                            ? 'Aktif ve canlı bir nomad topluluğu var.' 
                            : metrics.communityScore >= 6 
                              ? 'Orta düzeyde topluluk aktivitesi mevcut.' 
                              : 'Topluluk gelişmekte, online gruplar aktif.'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold mb-3 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        Topluluk Bulmak İçin
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• <strong>Facebook Grupları:</strong> "{city.nameEn} Digital Nomads" arayın</li>
                        <li>• <strong>Meetup.com:</strong> Tech, networking ve sosyal etkinlikler</li>
                        <li>• <strong>Coworking Etkinlikleri:</strong> Birçok alan haftalık sosyal düzenler</li>
                        <li>• <strong>Slack/Discord:</strong> Nomad topluluk kanalları</li>
                        <li>• <strong>Eventbrite:</strong> Yerel etkinlik ve workshoplar</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold mb-3">🎯 Networking İpuçları</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• İlk hafta en az 2-3 etkinliğe katılın</li>
                        <li>• Coworking alanının sosyal etkinliklerini takip edin</li>
                        <li>• Skill exchange veya language exchange gruplarına bakın</li>
                        <li>• Düzenli gittiğiniz bir kafe bulun (yüz tanıma)</li>
                        <li>• 1-on-1 kahve buluşmaları teklif edin</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section: 7-Day Checklist */}
            <section id="checklist">
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 flex items-center gap-3">
                    <ListChecks className="w-8 h-8 text-primary" />
                    7 Günlük "İniş ve Kurulum" Checklist
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {city.name}'e vardığınızda ilk hafta yapmanız gerekenlerin detaylı listesi:
                  </p>
                  
                  <div className="space-y-6">
                    {[
                      { day: 'Gün 1: Varış', tasks: ['Havalimanından konaklamaya transfer', 'SIM kart veya eSIM aktivasyonu', 'Yakın market/eczane keşfi', 'İnternet hızını test et', 'Jet lag\'i yönet - erken yat'] },
                      { day: 'Gün 2: Temel Kurulum', tasks: ['Mahalleyi yürüyerek keşfet', 'Kahvaltı ve market alışverişi', 'Çevredeki kafeleri not al', 'Para çekme (yerel ATM)', 'Google Maps\'te favorileri işaretle'] },
                      { day: 'Gün 3: Çalışma Alanı', tasks: ['En yakın coworking\'i ziyaret et', 'Günlük geçiş veya haftalık üyelik al', 'İnternet hızını test et (coworking)', 'İlk iş gününü tamamla', 'Akşam yürüyüşü, bölgeyi tanı'] },
                      { day: 'Gün 4: Ulaşım & Rutin', tasks: ['Toplu taşıma kartı al (varsa)', 'Alternatif coworking veya kafe dene', 'Rutin oluşturmaya başla', 'Spor salonu veya yoga stüdyosu keşfi', 'Yerel yemek dene'] },
                      { day: 'Gün 5: Sosyalleşme', tasks: ['Facebook/Meetup\'ta etkinlik bul', 'Coworking sosyal etkinliğine katıl', 'En az 2-3 kişiyle tanış', 'WhatsApp/Telegram gruplarına katıl', 'Hafta sonu planı yap'] },
                      { day: 'Gün 6: Keşif', tasks: ['Turistik bir yer ziyaret et', 'Farklı mahalleleri keşfet', 'Fotoğraf çek, paylaş', 'Yerel bir kültürel etkinliğe katıl', 'Uzun vadeli konaklama araştır (gerekirse)'] },
                      { day: 'Gün 7: Optimizasyon', tasks: ['Haftayı değerlendir: neyi sevdin?', 'Rutin ve çalışma alanını finalize et', 'Önümüzdeki hafta için hedef koy', 'Ailenle/arkadaşlarınla güncelleme paylaş', 'Kalan süre için mini hedefler belirle'] },
                    ].map((dayData, index) => (
                      <div key={index} className="p-4 rounded-xl border border-border">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          {dayData.day}
                        </h3>
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {dayData.tasks.map((task, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section: FAQ */}
            <section id="sss">
              <Card variant="elevated">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">
                    Sıkça Sorulan Sorular
                  </h2>
                  
                  <div className="space-y-4">
                    {faqData.map((faq, index) => (
                      <div key={index} className="p-4 rounded-xl bg-muted/50">
                        <h3 className="font-semibold mb-2">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Similar Cities */}
            {similarCities.length > 0 && (
              <section>
                <Card variant="elevated">
                  <CardContent className="p-6 md:p-8">
                    <h2 className="text-2xl font-display font-bold mb-4">
                      Benzer Nomad Şehirleri
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {city.name}'e benzer dijital göçebe destinasyonlarını keşfedin:
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {similarCities.map((c) => (
                        <Link
                          key={c.slug}
                          to={`/sehir/${c.slug}/nomad`}
                          className="group relative overflow-hidden rounded-xl aspect-[4/3]"
                        >
                          <img 
                            src={c.image} 
                            alt={c.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="font-bold text-white group-hover:text-primary transition-colors">
                              {getCountryFlag(c.countryCode)} {c.name}
                            </p>
                            <p className="text-xs text-white/80">Nomad Rehberi</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* CTA Section */}
            <section>
              <Card className="gradient-hero text-white border-0">
                <CardContent className="p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div>
                      <h2 className="text-2xl font-display font-bold mb-2">
                        {city.name}'e Hazır mısın?
                      </h2>
                      <p className="text-white/80">
                        Uçuş ve konaklama seçeneklerini şimdi karşılaştır.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button asChild variant="secondary">
                        <Link to={`/sehir/${city.slug}/ucak-bileti`}>
                          <Plane className="w-4 h-4 mr-2" />
                          Uçuş Ara
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                        <Link to={`/sehir/${city.slug}/oteller`}>
                          <Hotel className="w-4 h-4 mr-2" />
                          Otel Bul
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default CityNomad;
