// Digital Nomad data and coworking spaces

export interface NomadMetrics {
  internetSpeed: string; // e.g., "50 Mbps"
  costOfLiving: string; // e.g., "€1500/ay"
  coworkingCount: number;
  nomadScore: number; // 1-10
  cafesWithWifi: number;
  timezone: string;
  visaInfo: string;
  safetyScore: number; // 1-10
  weatherScore: number; // 1-10
  communityScore: number; // 1-10
}

export interface CoworkingSpace {
  slug: string;
  name: string;
  citySlug: string;
  summary: string;
  amenities: string[];
  pricing?: {
    daily?: number;
    weekly?: number;
    monthly?: number;
    currency: string;
  };
  address?: string;
  neighborhood?: string;
  hours?: string;
  images?: string[];
  website?: string;
  rating?: number;
  reviewCount?: number;
  highlights?: string[];
  workspaceFriendly?: boolean;
}

export interface WorkCafe {
  slug: string;
  name: string;
  citySlug: string;
  address?: string;
  neighborhood?: string;
  wifiSpeed?: string;
  powerOutlets: boolean;
  quietLevel: 'quiet' | 'moderate' | 'lively';
  foodQuality: number; // 1-5
  coffeeQuality: number; // 1-5
  seating: 'limited' | 'moderate' | 'plenty';
  hours?: string;
}

// Nomad metrics for cities
export const nomadMetrics: Record<string, NomadMetrics> = {
  'berlin': {
    internetSpeed: '75 Mbps',
    costOfLiving: '€1800/ay',
    coworkingCount: 150,
    nomadScore: 9,
    cafesWithWifi: 500,
    timezone: 'UTC+1',
    visaInfo: 'Freelancer vizesi mevcut',
    safetyScore: 8,
    weatherScore: 6,
    communityScore: 9,
  },
  'lizbon': {
    internetSpeed: '100 Mbps',
    costOfLiving: '€1400/ay',
    coworkingCount: 80,
    nomadScore: 9,
    cafesWithWifi: 300,
    timezone: 'UTC+0',
    visaInfo: 'Digital Nomad Vizesi (D7)',
    safetyScore: 9,
    weatherScore: 9,
    communityScore: 10,
  },
  'barcelona': {
    internetSpeed: '80 Mbps',
    costOfLiving: '€1600/ay',
    coworkingCount: 120,
    nomadScore: 8,
    cafesWithWifi: 400,
    timezone: 'UTC+1',
    visaInfo: 'Non-lucrative vize seçeneği',
    safetyScore: 7,
    weatherScore: 9,
    communityScore: 8,
  },
  'amsterdam': {
    internetSpeed: '100 Mbps',
    costOfLiving: '€2200/ay',
    coworkingCount: 100,
    nomadScore: 8,
    cafesWithWifi: 350,
    timezone: 'UTC+1',
    visaInfo: 'Serbest çalışma izni gerekli',
    safetyScore: 9,
    weatherScore: 5,
    communityScore: 8,
  },
  'paris': {
    internetSpeed: '90 Mbps',
    costOfLiving: '€2500/ay',
    coworkingCount: 200,
    nomadScore: 7,
    cafesWithWifi: 600,
    timezone: 'UTC+1',
    visaInfo: 'Talent Passport vizesi',
    safetyScore: 7,
    weatherScore: 6,
    communityScore: 7,
  },
  'londra': {
    internetSpeed: '85 Mbps',
    costOfLiving: '€2800/ay',
    coworkingCount: 300,
    nomadScore: 8,
    cafesWithWifi: 800,
    timezone: 'UTC+0',
    visaInfo: 'Startup/İnovasyon vizesi',
    safetyScore: 7,
    weatherScore: 4,
    communityScore: 9,
  },
  'roma': {
    internetSpeed: '50 Mbps',
    costOfLiving: '€1500/ay',
    coworkingCount: 60,
    nomadScore: 6,
    cafesWithWifi: 250,
    timezone: 'UTC+1',
    visaInfo: 'Elective residence vizesi',
    safetyScore: 7,
    weatherScore: 8,
    communityScore: 6,
  },
  'milano': {
    internetSpeed: '70 Mbps',
    costOfLiving: '€1800/ay',
    coworkingCount: 90,
    nomadScore: 7,
    cafesWithWifi: 300,
    timezone: 'UTC+1',
    visaInfo: 'İş vizesi gerekli',
    safetyScore: 8,
    weatherScore: 7,
    communityScore: 7,
  },
  'prag': {
    internetSpeed: '60 Mbps',
    costOfLiving: '€1200/ay',
    coworkingCount: 70,
    nomadScore: 8,
    cafesWithWifi: 200,
    timezone: 'UTC+1',
    visaInfo: 'Zivnostensky lisansı',
    safetyScore: 9,
    weatherScore: 6,
    communityScore: 8,
  },
  'budapeste': {
    internetSpeed: '55 Mbps',
    costOfLiving: '€1000/ay',
    coworkingCount: 50,
    nomadScore: 8,
    cafesWithWifi: 180,
    timezone: 'UTC+1',
    visaInfo: 'White Card programı (değerlendirme altında)',
    safetyScore: 8,
    weatherScore: 7,
    communityScore: 8,
  },
  // NEW CITIES - Asia & Middle East
  'tokyo': {
    internetSpeed: '200 Mbps',
    costOfLiving: '€2000/ay',
    coworkingCount: 400,
    nomadScore: 8,
    cafesWithWifi: 1200,
    timezone: 'UTC+9',
    visaInfo: 'Digital Nomad Vizesi (6 ay)',
    safetyScore: 10,
    weatherScore: 7,
    communityScore: 7,
  },
  'singapur': {
    internetSpeed: '250 Mbps',
    costOfLiving: '€2500/ay',
    coworkingCount: 250,
    nomadScore: 9,
    cafesWithWifi: 600,
    timezone: 'UTC+8',
    visaInfo: 'Tech.Pass / ONE Pass',
    safetyScore: 10,
    weatherScore: 6,
    communityScore: 9,
  },
  'dubai': {
    internetSpeed: '150 Mbps',
    costOfLiving: '€2200/ay',
    coworkingCount: 180,
    nomadScore: 8,
    cafesWithWifi: 400,
    timezone: 'UTC+4',
    visaInfo: 'Remote Work Visa (1 yıl)',
    safetyScore: 9,
    weatherScore: 5,
    communityScore: 8,
  },
  'bali': {
    internetSpeed: '50 Mbps',
    costOfLiving: '€1000/ay',
    coworkingCount: 120,
    nomadScore: 9,
    cafesWithWifi: 350,
    timezone: 'UTC+8',
    visaInfo: 'B211A Visa / Digital Nomad Visa',
    safetyScore: 7,
    weatherScore: 8,
    communityScore: 10,
  },
  'bangkok': {
    internetSpeed: '80 Mbps',
    costOfLiving: '€900/ay',
    coworkingCount: 200,
    nomadScore: 9,
    cafesWithWifi: 800,
    timezone: 'UTC+7',
    visaInfo: 'LTR Visa (10 yıl)',
    safetyScore: 7,
    weatherScore: 6,
    communityScore: 9,
  },
  'seul': {
    internetSpeed: '300 Mbps',
    costOfLiving: '€1400/ay',
    coworkingCount: 300,
    nomadScore: 8,
    cafesWithWifi: 1500,
    timezone: 'UTC+9',
    visaInfo: 'Digital Nomad Visa (K-1)',
    safetyScore: 9,
    weatherScore: 6,
    communityScore: 7,
  },
  'taipei': {
    internetSpeed: '150 Mbps',
    costOfLiving: '€1100/ay',
    coworkingCount: 150,
    nomadScore: 8,
    cafesWithWifi: 600,
    timezone: 'UTC+8',
    visaInfo: 'Gold Card (3 yıl)',
    safetyScore: 9,
    weatherScore: 7,
    communityScore: 8,
  },
  'chiangmai': {
    internetSpeed: '60 Mbps',
    costOfLiving: '€700/ay',
    coworkingCount: 80,
    nomadScore: 9,
    cafesWithWifi: 400,
    timezone: 'UTC+7',
    visaInfo: 'LTR Visa (10 yıl)',
    safetyScore: 8,
    weatherScore: 7,
    communityScore: 10,
  },
  'hochiminh': {
    internetSpeed: '70 Mbps',
    costOfLiving: '€800/ay',
    coworkingCount: 100,
    nomadScore: 8,
    cafesWithWifi: 500,
    timezone: 'UTC+7',
    visaInfo: 'E-Visa (90 gün)',
    safetyScore: 7,
    weatherScore: 6,
    communityScore: 8,
  },
  'kualalumpur': {
    internetSpeed: '100 Mbps',
    costOfLiving: '€900/ay',
    coworkingCount: 120,
    nomadScore: 8,
    cafesWithWifi: 400,
    timezone: 'UTC+8',
    visaInfo: 'DE Rantau Pass (1 yıl)',
    safetyScore: 7,
    weatherScore: 6,
    communityScore: 7,
  },
  // Additional popular nomad cities
  'meksikocity': {
    internetSpeed: '60 Mbps',
    costOfLiving: '€1000/ay',
    coworkingCount: 150,
    nomadScore: 9,
    cafesWithWifi: 500,
    timezone: 'UTC-6',
    visaInfo: 'Turist vizesi ile 180 gün',
    safetyScore: 6,
    weatherScore: 8,
    communityScore: 9,
  },
  'buenosaires': {
    internetSpeed: '50 Mbps',
    costOfLiving: '€800/ay',
    coworkingCount: 100,
    nomadScore: 8,
    cafesWithWifi: 400,
    timezone: 'UTC-3',
    visaInfo: 'Digital Nomad Visa (6 ay)',
    safetyScore: 6,
    weatherScore: 7,
    communityScore: 8,
  },
  'medellin': {
    internetSpeed: '70 Mbps',
    costOfLiving: '€900/ay',
    coworkingCount: 80,
    nomadScore: 8,
    cafesWithWifi: 300,
    timezone: 'UTC-5',
    visaInfo: 'V Tipi Dijital Göçebe Vizesi',
    safetyScore: 6,
    weatherScore: 9,
    communityScore: 9,
  },
  'tiflis': {
    internetSpeed: '45 Mbps',
    costOfLiving: '€700/ay',
    coworkingCount: 40,
    nomadScore: 8,
    cafesWithWifi: 150,
    timezone: 'UTC+4',
    visaInfo: 'Vize muafiyeti (1 yıl)',
    safetyScore: 8,
    weatherScore: 7,
    communityScore: 8,
  },
};

// Coworking spaces data
export const coworkingSpaces: CoworkingSpace[] = [
  // Berlin
  {
    slug: 'factory-berlin-gorlitzer-park',
    name: 'Factory Berlin Görlitzer Park',
    citySlug: 'berlin',
    summary: 'Berlin\'in en büyük startup kampüslerinden biri. Google, Uber ve Soundcloud gibi şirketlerin de bulunduğu, canlı bir girişimcilik ekosistemi.',
    amenities: ['Hızlı WiFi', 'Toplantı Odaları', 'Etkinlik Alanı', 'Kafeterya', '24/7 Erişim', 'Telefon Kabinleri', 'Bahçe'],
    pricing: { daily: 35, weekly: 150, monthly: 400, currency: 'EUR' },
    address: 'Lohmühlenstraße 65, 12435 Berlin',
    neighborhood: 'Kreuzberg',
    hours: '24/7',
    rating: 4.6,
    reviewCount: 320,
    highlights: ['Startup Ekosistemi', 'Networking Etkinlikleri', 'Mentor Programı'],
  },
  {
    slug: 'betahaus-berlin',
    name: 'Betahaus Berlin',
    citySlug: 'berlin',
    summary: 'Kreuzberg\'in kalbinde, kreatif profesyoneller için tasarlanmış ikonik coworking alanı. Düzenli workshoplar ve topluluk etkinlikleri.',
    amenities: ['Hızlı WiFi', 'Kahve Bar', 'Toplantı Odaları', 'Etkinlik Alanı', 'Atölye', 'Teras'],
    pricing: { daily: 25, weekly: 100, monthly: 250, currency: 'EUR' },
    address: 'Rudi-Dutschke-Straße 23, 10969 Berlin',
    neighborhood: 'Kreuzberg',
    hours: '08:00 - 22:00',
    rating: 4.5,
    reviewCount: 450,
    highlights: ['Kreatif Topluluk', 'Workshop Programı', 'Merkezi Konum'],
  },
  {
    slug: 'mindspace-berlin',
    name: 'Mindspace Berlin',
    citySlug: 'berlin',
    summary: 'Premium coworking deneyimi sunan, şık tasarımlı çalışma alanları. Startup\'lardan kurumsal ekiplere kadar geniş bir kesime hitap ediyor.',
    amenities: ['Ultra Hızlı WiFi', 'Özel Ofisler', 'Toplantı Odaları', 'Lounge', 'Mutfak', 'Baskı Hizmetleri'],
    pricing: { daily: 45, monthly: 450, currency: 'EUR' },
    address: 'Friedrichstraße 68, 10117 Berlin',
    neighborhood: 'Mitte',
    hours: '24/7',
    rating: 4.7,
    reviewCount: 280,
    highlights: ['Premium Tasarım', 'Kurumsal Müşteriler', 'Merkez Lokasyon'],
  },
  {
    slug: 'weserland-berlin',
    name: 'Weserland',
    citySlug: 'berlin',
    summary: 'Neukölln\'ün alternatif atmosferinde, bağımsız çalışanlar için uygun fiyatlı ve samimi bir coworking alanı.',
    amenities: ['WiFi', 'Mutfak', 'Toplantı Odası', 'Bahçe', 'Bisiklet Parkı'],
    pricing: { daily: 15, monthly: 180, currency: 'EUR' },
    address: 'Weserstraße 175, 12045 Berlin',
    neighborhood: 'Neukölln',
    hours: '09:00 - 20:00',
    rating: 4.3,
    reviewCount: 95,
    highlights: ['Uygun Fiyat', 'Samimi Ortam', 'Yerel Topluluk'],
  },
  // Lisbon
  {
    slug: 'heden-lisbon',
    name: 'Heden',
    citySlug: 'lizbon',
    summary: 'Lizbon\'un en popüler nomad buluşma noktası. Topluluk odaklı etkinlikler ve mükemmel kahve.',
    amenities: ['Hızlı WiFi', 'Kahve Dahil', 'Toplantı Odaları', 'Etkinlik Alanı', 'Teras'],
    pricing: { daily: 25, weekly: 100, monthly: 200, currency: 'EUR' },
    address: 'Travessa de São Pedro 17, 1100-001 Lisboa',
    neighborhood: 'Alfama',
    hours: '09:00 - 21:00',
    rating: 4.8,
    reviewCount: 520,
    highlights: ['Nomad Topluluğu', 'Harika Kahve', 'Merkezi Konum'],
  },
  {
    slug: 'second-home-lisbon',
    name: 'Second Home Lisboa',
    citySlug: 'lizbon',
    summary: 'Mercado da Ribeira\'da bulunan, bitki dolu ikonik tasarımıyla bilinen premium coworking alanı.',
    amenities: ['Ultra Hızlı WiFi', 'Özel Ofisler', 'Toplantı Odaları', 'Restoran', 'Bahçe'],
    pricing: { monthly: 350, currency: 'EUR' },
    address: 'Mercado da Ribeira, Av. 24 de Julho 49, 1200-479 Lisboa',
    neighborhood: 'Cais do Sodré',
    hours: '24/7',
    rating: 4.6,
    reviewCount: 340,
    highlights: ['İkonik Tasarım', 'Premium Hizmet', 'Pazar Yeri İçinde'],
  },
  // Barcelona
  {
    slug: 'mob-barcelona',
    name: 'MOB Barcelona',
    citySlug: 'barcelona',
    summary: 'Sürdürülebilirlik odaklı, sosyal etki yaratan projeler için tasarlanmış topluluk alanı.',
    amenities: ['WiFi', 'Toplantı Odaları', 'Etkinlik Alanı', 'Kafeterya', 'Teras'],
    pricing: { daily: 22, monthly: 220, currency: 'EUR' },
    address: 'Bailén 11, 08010 Barcelona',
    neighborhood: 'Sant Pere',
    hours: '09:00 - 21:00',
    rating: 4.5,
    reviewCount: 280,
    highlights: ['Sosyal Girişimcilik', 'Sürdürülebilirlik', 'Aktif Topluluk'],
  },
  {
    slug: 'aticco-barcelona',
    name: 'Aticco Verdaguer',
    citySlug: 'barcelona',
    summary: 'Modern ve şık tasarımıyla öne çıkan, startup dostu coworking zinciri.',
    amenities: ['Hızlı WiFi', 'Özel Ofisler', 'Toplantı Odaları', 'Gym', 'Etkinlik Alanı'],
    pricing: { daily: 30, monthly: 280, currency: 'EUR' },
    address: 'Passeig de Sant Joan 17, 08010 Barcelona',
    neighborhood: 'Eixample',
    hours: '24/7',
    rating: 4.4,
    reviewCount: 210,
    highlights: ['Modern Tasarım', 'Spor Salonu', 'Flexibel Planlar'],
  },
  // Amsterdam
  {
    slug: 'spaces-amsterdam',
    name: 'Spaces Herengracht',
    citySlug: 'amsterdam',
    summary: 'Tarihi kanal evinde bulunan, karakteristik Amsterdam atmosferi sunan premium coworking.',
    amenities: ['Hızlı WiFi', 'Özel Ofisler', 'Toplantı Odaları', 'Lounge', 'Bisiklet Parkı'],
    pricing: { daily: 40, monthly: 400, currency: 'EUR' },
    address: 'Herengracht 124-128, 1015 BT Amsterdam',
    neighborhood: 'Centrum',
    hours: '24/7',
    rating: 4.5,
    reviewCount: 185,
    highlights: ['Tarihi Bina', 'Kanal Manzarası', 'Premium Hizmet'],
  },
  // Paris
  {
    slug: 'station-f-paris',
    name: 'Station F',
    citySlug: 'paris',
    summary: 'Dünyanın en büyük startup kampüsü. 1000+ startup, 30+ program ve sayısız networking fırsatı.',
    amenities: ['Ultra Hızlı WiFi', 'Toplantı Odaları', 'Etkinlik Alanı', 'Restoranlar', '24/7 Erişim'],
    pricing: { monthly: 195, currency: 'EUR' },
    address: '5 Parvis Alan Turing, 75013 Paris',
    neighborhood: '13th arrondissement',
    hours: '24/7',
    rating: 4.7,
    reviewCount: 890,
    highlights: ['Dünyanın En Büyük Kampüsü', 'Startup Ekosistemi', 'Mentor Ağı'],
  },
  // Prague
  {
    slug: 'node5-prague',
    name: 'Node5',
    citySlug: 'prag',
    summary: 'Prag\'ın en aktif startup topluluğuna ev sahipliği yapan, girişimci dostu coworking alanı.',
    amenities: ['Hızlı WiFi', 'Toplantı Odaları', 'Etkinlik Alanı', 'Kafeterya', 'Teras'],
    pricing: { daily: 18, monthly: 180, currency: 'EUR' },
    address: 'Radlická 180/50, 150 00 Praha 5',
    neighborhood: 'Smíchov',
    hours: '08:00 - 22:00',
    rating: 4.6,
    reviewCount: 240,
    highlights: ['Startup Hub', 'Aktif Topluluk', 'Uygun Fiyat'],
  },
  // Budapest
  {
    slug: 'kaptar-budapest',
    name: 'Kaptár',
    citySlug: 'budapeste',
    summary: 'Budapeşte\'nin ilk ve en büyük coworking alanı. Sıcak topluluk atmosferi ve merkezi konum.',
    amenities: ['WiFi', 'Toplantı Odaları', 'Mutfak', 'Etkinlik Alanı', 'Teras'],
    pricing: { daily: 12, monthly: 120, currency: 'EUR' },
    address: 'Paulay Ede u. 52, 1061 Budapest',
    neighborhood: 'VI. kerület',
    hours: '08:00 - 22:00',
    rating: 4.7,
    reviewCount: 310,
    highlights: ['Şehrin İlk Coworking\'i', 'Sıcak Atmosfer', 'Çok Uygun Fiyat'],
  },
  // Tokyo
  {
    slug: 'wework-shibuya',
    name: 'WeWork Shibuya Scramble Square',
    citySlug: 'tokyo',
    summary: 'Shibuya\'nın ikonik meydanına bakan, Japonya\'nın en prestijli coworking alanı. 45. kattaki muhteşem manzara.',
    amenities: ['Ultra Hızlı WiFi', 'Özel Ofisler', 'Toplantı Odaları', 'Kafeterya', '24/7 Erişim', 'Panoramik Manzara'],
    pricing: { daily: 50, monthly: 600, currency: 'USD' },
    address: 'Shibuya Scramble Square 45F, Shibuya',
    neighborhood: 'Shibuya',
    hours: '24/7',
    rating: 4.8,
    reviewCount: 420,
    highlights: ['Tokyo Manzarası', 'Premium Lokasyon', 'Uluslararası Topluluk'],
  },
  {
    slug: 'andwork-tokyo',
    name: 'andwork Tokyo',
    citySlug: 'tokyo',
    summary: 'Shinjuku\'nun kalbinde, dijital göçebeler için tasarlanmış modern coworking alanı. Japon tasarımı ve verimlilik.',
    amenities: ['Hızlı WiFi', 'Sessiz Çalışma Alanı', 'Toplantı Odaları', 'Kahve Bar', 'Duş'],
    pricing: { daily: 25, monthly: 300, currency: 'USD' },
    address: '1-12-6 Kabukicho, Shinjuku',
    neighborhood: 'Shinjuku',
    hours: '08:00 - 22:00',
    rating: 4.6,
    reviewCount: 280,
    highlights: ['Merkezi Konum', 'Sessiz Ortam', 'Uygun Fiyat'],
  },
  // Singapore
  {
    slug: 'wework-beach-road',
    name: 'WeWork Beach Road',
    citySlug: 'singapur',
    summary: 'Singapur\'un finans merkezine yakın, uluslararası startup ekosisteminin kalbi.',
    amenities: ['Ultra Hızlı WiFi', 'Özel Ofisler', 'Toplantı Odaları', 'Etkinlik Alanı', 'Gym', 'Rooftop'],
    pricing: { daily: 60, monthly: 700, currency: 'USD' },
    address: '180 Cecil Street, Singapore',
    neighborhood: 'CBD',
    hours: '24/7',
    rating: 4.7,
    reviewCount: 380,
    highlights: ['Finans Merkezi', 'Networking', 'Premium Hizmet'],
  },
  {
    slug: 'the-working-capitol',
    name: 'The Working Capitol',
    citySlug: 'singapur',
    summary: 'Heritage binada modern coworking deneyimi. Singapur\'un en karakteristik çalışma alanlarından.',
    amenities: ['Hızlı WiFi', 'Toplantı Odaları', 'Kafeterya', 'Etkinlik Alanı', 'Bahçe'],
    pricing: { daily: 40, monthly: 450, currency: 'USD' },
    address: '1 Keong Saik Road, Singapore',
    neighborhood: 'Keong Saik',
    hours: '08:00 - 22:00',
    rating: 4.6,
    reviewCount: 260,
    highlights: ['Heritage Bina', 'Yaratıcı Topluluk', 'Merkezi Konum'],
  },
  // Bali
  {
    slug: 'dojo-bali',
    name: 'Dojo Bali',
    citySlug: 'bali',
    summary: 'Canggu\'nun efsanevi coworking alanı. Sörf, topluluk ve üretkenlik bir arada.',
    amenities: ['Hızlı WiFi', 'Havuz', 'Yoga Alanı', 'Kafeterya', 'Toplantı Odaları', 'Sörf Tahtası Deposu'],
    pricing: { daily: 15, weekly: 80, monthly: 200, currency: 'USD' },
    address: 'Jl. Batu Mejan, Canggu',
    neighborhood: 'Canggu',
    hours: '07:00 - 22:00',
    rating: 4.9,
    reviewCount: 850,
    highlights: ['Sörf Paradise', 'Güçlü Topluluk', 'Tropik Atmosfer'],
  },
  {
    slug: 'outpost-ubud',
    name: 'Outpost Ubud',
    citySlug: 'bali',
    summary: 'Ubud\'un yemyeşil ormanlarında, doğayla iç içe çalışma deneyimi. Yoga ve wellness odaklı.',
    amenities: ['Hızlı WiFi', 'Yoga Stüdyosu', 'Meditasyon Alanı', 'Kafeterya', 'Havuz', 'Toplantı Odaları'],
    pricing: { daily: 20, monthly: 250, currency: 'USD' },
    address: 'Jl. Raya Pengosekan, Ubud',
    neighborhood: 'Ubud',
    hours: '07:00 - 21:00',
    rating: 4.8,
    reviewCount: 620,
    highlights: ['Doğa İçinde', 'Wellness Odaklı', 'Sakin Ortam'],
  },
  // Bangkok
  {
    slug: 'hubba-thailand',
    name: 'HUBBA Thailand',
    citySlug: 'bangkok',
    summary: 'Tayland\'ın ilk ve en büyük coworking zinciri. Startup ekosisteminin kalbi.',
    amenities: ['Hızlı WiFi', 'Toplantı Odaları', 'Etkinlik Alanı', 'Kafeterya', '24/7 Erişim'],
    pricing: { daily: 12, monthly: 150, currency: 'USD' },
    address: 'Soi Ekkamai 4, Bangkok',
    neighborhood: 'Ekkamai',
    hours: '24/7',
    rating: 4.5,
    reviewCount: 450,
    highlights: ['Startup Hub', 'Networking', 'Uygun Fiyat'],
  },
  {
    slug: 'the-hive-thonglor',
    name: 'The Hive Thonglor',
    citySlug: 'bangkok',
    summary: 'Bangkok\'un en trendy semtinde premium coworking deneyimi. Uluslararası profesyonellerin buluşma noktası.',
    amenities: ['Ultra Hızlı WiFi', 'Özel Ofisler', 'Toplantı Odaları', 'Rooftop Bar', 'Gym'],
    pricing: { daily: 20, monthly: 250, currency: 'USD' },
    address: '46/7 Sukhumvit 49, Bangkok',
    neighborhood: 'Thonglor',
    hours: '08:00 - 22:00',
    rating: 4.7,
    reviewCount: 320,
    highlights: ['Trendy Lokasyon', 'Premium Hizmet', 'Rooftop Bar'],
  },
];

// Work-friendly cafes data
export const workCafes: WorkCafe[] = [
  {
    slug: 'st-oberholz-berlin',
    name: 'St. Oberholz',
    citySlug: 'berlin',
    neighborhood: 'Mitte',
    wifiSpeed: '50 Mbps',
    powerOutlets: true,
    quietLevel: 'moderate',
    foodQuality: 4,
    coffeeQuality: 5,
    seating: 'plenty',
    hours: '08:00 - 00:00',
  },
  {
    slug: 'bonanza-coffee-berlin',
    name: 'Bonanza Coffee',
    citySlug: 'berlin',
    neighborhood: 'Kreuzberg',
    wifiSpeed: '30 Mbps',
    powerOutlets: true,
    quietLevel: 'moderate',
    foodQuality: 3,
    coffeeQuality: 5,
    seating: 'moderate',
    hours: '08:30 - 18:00',
  },
  {
    slug: 'fabrica-coffee-lisbon',
    name: 'Fábrica Coffee Roasters',
    citySlug: 'lizbon',
    neighborhood: 'Baixa',
    wifiSpeed: '40 Mbps',
    powerOutlets: true,
    quietLevel: 'lively',
    foodQuality: 4,
    coffeeQuality: 5,
    seating: 'moderate',
    hours: '09:00 - 19:00',
  },
  {
    slug: 'nomad-coffee-barcelona',
    name: 'Nomad Coffee Lab',
    citySlug: 'barcelona',
    neighborhood: 'Born',
    wifiSpeed: '35 Mbps',
    powerOutlets: true,
    quietLevel: 'moderate',
    foodQuality: 3,
    coffeeQuality: 5,
    seating: 'limited',
    hours: '09:00 - 19:00',
  },
];

// Helper functions
export function getNomadMetrics(citySlug: string): NomadMetrics | null {
  return nomadMetrics[citySlug] || null;
}

export function getCityNomadData(citySlug: string): (NomadMetrics & { highlights: string[] }) | null {
  const metrics = nomadMetrics[citySlug];
  if (!metrics) return null;
  
  // Generate highlights based on metrics
  const highlights: string[] = [];
  if (metrics.nomadScore >= 8) highlights.push('Top Nomad Şehri');
  if (parseInt(metrics.internetSpeed) >= 80) highlights.push('Hızlı İnternet');
  if (metrics.communityScore >= 8) highlights.push('Güçlü Topluluk');
  if (metrics.safetyScore >= 8) highlights.push('Güvenli');
  if (metrics.weatherScore >= 8) highlights.push('İyi Hava');
  if (metrics.coworkingCount >= 100) highlights.push('Çok Coworking');
  
  return { ...metrics, highlights };
}

export function getCoworkingSpacesByCity(citySlug: string): CoworkingSpace[] {
  return coworkingSpaces.filter(space => space.citySlug === citySlug);
}

export function getCoworkingSpaceBySlug(slug: string): CoworkingSpace | null {
  return coworkingSpaces.find(space => space.slug === slug) || null;
}

export function getWorkCafesByCity(citySlug: string): WorkCafe[] {
  return workCafes.filter(cafe => cafe.citySlug === citySlug);
}

export function getAllCoworkingSpaces(): CoworkingSpace[] {
  return coworkingSpaces;
}

export function getCitiesWithNomadData(): string[] {
  return Object.keys(nomadMetrics);
}
