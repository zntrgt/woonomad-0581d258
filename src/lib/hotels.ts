// Hotel data for individual hotel pages

export interface HotelData {
  slug: string;
  name: string;
  citySlug: string;
  summary: string;
  stars: number;
  amenities: string[];
  images: string[];
  address?: string;
  neighborhood?: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
  highlights: string[];
  suitableFor: string[];
  reasonsToChoose: string[];
  bookingLink?: string;
}

// Hotel data - Expanded for all major cities
export const hotelData: HotelData[] = [
  // ========== TÜRKIYE - İSTANBUL ==========
  {
    slug: 'four-seasons-sultanahmet-istanbul',
    name: 'Four Seasons Hotel Istanbul at Sultanahmet',
    citySlug: 'istanbul',
    summary: 'Eski bir Osmanlı hapishanesinden dönüştürülmüş, Ayasofya\'ya yürüme mesafesinde eşsiz bir lüks otel. Tarihi doku ve modern konfor mükemmel bir uyum içinde.',
    stars: 5,
    amenities: ['Spa', 'Fitness', 'Restoran', 'Bar', 'Oda Servisi', '24/7 Concierge', 'Teras', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: 'Tevkifhane Sokak No:1, Sultanahmet',
    neighborhood: 'Sultanahmet',
    rating: 4.9,
    reviewCount: 1850,
    priceRange: { min: 15000, max: 45000, currency: 'TRY' },
    highlights: ['Ayasofya manzarası', 'Tarihi atmosfer', 'Michelin seviyesi mutfak'],
    suitableFor: ['Lüks sevenler', 'Balayı çiftleri', 'Tarih meraklıları', 'Özel günler'],
    reasonsToChoose: [
      'Sultanahmet\'in kalbinde eşsiz lokasyon',
      'Osmanlı mirasını yaşatan benzersiz bina',
      'Four Seasons mükemmelliği ve Türk misafirperverliği'
    ],
  },
  {
    slug: 'ciragan-palace-kempinski-istanbul',
    name: 'Çırağan Palace Kempinski Istanbul',
    citySlug: 'istanbul',
    summary: 'Boğaz kıyısında, Osmanlı saray mimarisinin en görkemli örneklerinden biri. Infinity havuzu ve muhteşem Boğaz manzarası ile İstanbul\'un en prestijli adresi.',
    stars: 5,
    amenities: ['Havuz', 'Spa', 'Fitness', 'Restoran', 'Bar', 'Özel Plaj', 'Teras', 'Marina'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    address: 'Çırağan Caddesi No:32, Beşiktaş',
    neighborhood: 'Beşiktaş',
    rating: 4.8,
    reviewCount: 2100,
    priceRange: { min: 20000, max: 80000, currency: 'TRY' },
    highlights: ['Boğaz manzarası', 'Osmanlı sarayı', 'Infinity havuz'],
    suitableFor: ['Ultra lüks arayanlar', 'Kutlama yapacaklar', 'İş toplantıları', 'Ünlü konuklar'],
    reasonsToChoose: [
      'Otantik Osmanlı sarayında konaklama deneyimi',
      'Boğaz\'ın en güzel noktasında özel plaj',
      'Dünya standartlarında Türk hamamı'
    ],
  },
  {
    slug: 'soho-house-istanbul',
    name: 'Soho House Istanbul',
    citySlug: 'istanbul',
    summary: 'Beyoğlu\'nun kalbinde, tarihi Amerikan Hanı\'nda bulunan butik otel. Çatı havuzu, kreatif topluluk ve İstanbul\'un en dinamik atmosferi.',
    stars: 4,
    amenities: ['Havuz', 'Spa', 'Gym', 'Restoran', 'Bar', 'Coworking', 'Teras', 'Sinema'],
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
    address: 'Evliya Çelebi Mah., Meşrutiyet Cad. No:56',
    neighborhood: 'Beyoğlu',
    rating: 4.6,
    reviewCount: 780,
    priceRange: { min: 8000, max: 18000, currency: 'TRY' },
    highlights: ['Çatı havuzu', 'Üye kulübü', 'Tarihi bina'],
    suitableFor: ['Dijital nomadlar', 'Kreatif profesyoneller', 'Sosyal gezginler'],
    reasonsToChoose: [
      'İstanbul\'un yaratıcı sahnesinin merkezi',
      'Üye kulübü ile networking fırsatı',
      'İstiklal Caddesi\'ne yürüme mesafesinde'
    ],
  },
  {
    slug: 'the-marmara-taksim-istanbul',
    name: 'The Marmara Taksim',
    citySlug: 'istanbul',
    summary: 'Taksim Meydanı\'na bakan ikonik otel. 360 derece İstanbul manzarası, rooftop bar ve şehrin nabzını hissettiren lokasyon.',
    stars: 5,
    amenities: ['Havuz', 'Spa', 'Fitness', 'Restoran', 'Rooftop Bar', 'Oda Servisi', 'Toplantı'],
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    address: 'Taksim Meydanı',
    neighborhood: 'Taksim',
    rating: 4.5,
    reviewCount: 3200,
    priceRange: { min: 5000, max: 15000, currency: 'TRY' },
    highlights: ['Taksim merkez', '360° manzara', 'İstiklal yakın'],
    suitableFor: ['İş seyahati', 'Şehir gezisi', 'Kısa konaklama'],
    reasonsToChoose: [
      'Taksim\'in tam ortasında benzersiz lokasyon',
      'Efsanevi rooftop bar deneyimi',
      'İstiklal Caddesi kapıda'
    ],
  },

  // ========== TÜRKIYE - ANTALYA ==========
  {
    slug: 'regnum-carya-antalya',
    name: 'Regnum Carya Golf & Spa Resort',
    citySlug: 'antalya',
    summary: 'Belek\'te golf sahası içinde ultra lüks resort. G20 zirvesine ev sahipliği yapmış, dünya standartlarında tesisler ve özel plaj.',
    stars: 5,
    amenities: ['Golf', 'Havuz', 'Spa', 'Fitness', 'Restoran', 'Özel Plaj', 'Aquapark', 'Kids Club'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: 'Kadriye Mahallesi, Belek',
    neighborhood: 'Belek',
    rating: 4.9,
    reviewCount: 1650,
    priceRange: { min: 25000, max: 75000, currency: 'TRY' },
    highlights: ['Şampiyonluk golf sahası', 'G20 oteli', 'Ultra her şey dahil'],
    suitableFor: ['Golf tutkunları', 'Aileler', 'Lüks tatilciler', 'İş toplantıları'],
    reasonsToChoose: [
      'Türkiye\'nin en iyi golf sahaları arasında',
      'G20 zirvesi kalitesinde hizmet',
      'Belek\'in en kapsamlı tesisleri'
    ],
  },
  {
    slug: 'titanic-mardan-palace-antalya',
    name: 'Titanic Mardan Palace',
    citySlug: 'antalya',
    summary: 'Akdeniz\'in en görkemli resort\'larından biri. 560 metre özel plaj, yapay su kanalları ve Osmanlı-Avrupa mimarisi fusion\'ı.',
    stars: 5,
    amenities: ['Havuz', 'Spa', 'Fitness', 'Restoran', 'Bar', 'Özel Plaj', 'Aquapark', 'Tenis'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    address: 'Kundu',
    neighborhood: 'Kundu',
    rating: 4.7,
    reviewCount: 2800,
    priceRange: { min: 12000, max: 35000, currency: 'TRY' },
    highlights: ['Devasa havuzlar', 'Su kanalları', '560m plaj'],
    suitableFor: ['Aileler', 'Çiftler', 'Tatil severler'],
    reasonsToChoose: [
      'Akdeniz\'in en büyük açık alan havuzu',
      'Venedik tarzı su kanalları ile gondol turu',
      'Her şey dahil mükemmelliği'
    ],
  },
  {
    slug: 'akra-hotel-antalya',
    name: 'Akra Hotel',
    citySlug: 'antalya',
    summary: 'Antalya şehir merkezinde, falezlerin üzerinde konumlanmış butik lüks otel. Akdeniz\'in turkuaz suları manzarası ve şık tasarım.',
    stars: 5,
    amenities: ['Havuz', 'Spa', 'Fitness', 'Restoran', 'Bar', 'Teras', 'Plaj Erişimi'],
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
    address: 'Şirinyalı Mahallesi, Lara',
    neighborhood: 'Lara',
    rating: 4.6,
    reviewCount: 920,
    priceRange: { min: 6000, max: 15000, currency: 'TRY' },
    highlights: ['Falez manzarası', 'Şehir merkezi', 'Modern tasarım'],
    suitableFor: ['Şehir gezisi', 'İş seyahati', 'Romantik kaçamak'],
    reasonsToChoose: [
      'Hem tatil hem şehir merkezine yakınlık',
      'Falez manzaralı infinity havuz',
      'Kaleiçi ve Konyaaltı\'na kolay ulaşım'
    ],
  },

  // ========== TÜRKIYE - İZMİR ==========
  {
    slug: 'swissotel-buyuk-efes-izmir',
    name: 'Swissôtel Büyük Efes, İzmir',
    citySlug: 'izmir',
    summary: 'Kordon\'da deniz manzaralı, İzmir\'in landmark oteli. Türkiye\'nin en büyük şehir spa\'larından biri ve efsanevi kahvaltı büfesi.',
    stars: 5,
    amenities: ['Spa', 'Havuz', 'Fitness', 'Restoran', 'Bar', 'Toplantı', 'Teras'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: 'Cumhuriyet Bulvarı No:1, Alsancak',
    neighborhood: 'Alsancak',
    rating: 4.7,
    reviewCount: 2100,
    priceRange: { min: 5000, max: 18000, currency: 'TRY' },
    highlights: ['Kordon manzarası', 'Büyük spa', 'Merkezi konum'],
    suitableFor: ['İş seyahati', 'Şehir gezisi', 'Kongre katılımcıları'],
    reasonsToChoose: [
      'İzmir\'in simgesi, 50 yıllık miras',
      'Kordon\'a direkt erişim',
      'Ege mutfağının en iyi adresi'
    ],
  },
  {
    slug: 'alacati-la-vela-izmir',
    name: 'Alaçatı La Vela',
    citySlug: 'izmir',
    summary: 'Alaçatı\'nın taş evleri arasında butik bir kaçış noktası. Rüzgar sörfü, leziz brunch\'lar ve Ege lifestyle\'ının özü.',
    stars: 4,
    amenities: ['Havuz', 'Restoran', 'Bar', 'WiFi', 'Bahçe', 'Bisiklet'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    address: 'Alaçatı Merkez',
    neighborhood: 'Alaçatı',
    rating: 4.8,
    reviewCount: 560,
    priceRange: { min: 4000, max: 12000, currency: 'TRY' },
    highlights: ['Taş ev', 'Alaçatı merkez', 'Butik atmosfer'],
    suitableFor: ['Çiftler', 'Butik otel arayanlar', 'Sörf tutkunları'],
    reasonsToChoose: [
      'Alaçatı\'nın en şık adreslerinden biri',
      'Instagramlık taş ev mimarisi',
      'Rüzgar sörfü ve beach club\'lara yakın'
    ],
  },

  // ========== TÜRKIYE - BODRUM ==========
  {
    slug: 'mandarin-oriental-bodrum',
    name: 'Mandarin Oriental, Bodrum',
    citySlug: 'bodrum',
    summary: 'Cennet Koyu\'nda ultra lüks beach resort. Özel plajı, dünyaca ünlü spa\'sı ve muhteşem Ege manzarasıyla Türkiye\'nin en prestijli adresi.',
    stars: 5,
    amenities: ['Havuz', 'Spa', 'Fitness', 'Restoran', 'Özel Plaj', 'Marina', 'Kids Club', 'Yoga'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: 'Cennet Koyu',
    neighborhood: 'Cennet Koyu',
    rating: 4.9,
    reviewCount: 890,
    priceRange: { min: 35000, max: 120000, currency: 'TRY' },
    highlights: ['Özel koy', 'Ödüllü spa', 'Michelin şef'],
    suitableFor: ['Ultra lüks arayanlar', 'Balayı', 'Ünlüler', 'Özel tatil'],
    reasonsToChoose: [
      'Türkiye\'nin en lüks beach resort\'u',
      'Özel koyla tam gizlilik',
      'Asya-Akdeniz fusion mutfağı'
    ],
  },
  {
    slug: 'the-bodrum-edition',
    name: 'The Bodrum EDITION',
    citySlug: 'bodrum',
    summary: 'Ian Schrager\'ın imzasını taşıyan minimalist lüks. Yalıkavak Marina yakınında, modern tasarım ve Bodrum gecelerinin buluşma noktası.',
    stars: 5,
    amenities: ['Havuz', 'Spa', 'Fitness', 'Restoran', 'Club', 'Özel Plaj', 'Marina'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    address: 'Yalıkavak',
    neighborhood: 'Yalıkavak',
    rating: 4.7,
    reviewCount: 1200,
    priceRange: { min: 18000, max: 55000, currency: 'TRY' },
    highlights: ['Minimalist tasarım', 'Basement club', 'Marina yakın'],
    suitableFor: ['Tasarım tutkunları', 'Gece hayatı arayanlar', 'Trendy çiftler'],
    reasonsToChoose: [
      'Bodrum\'un en trend oteli',
      'Basement gece kulübü deneyimi',
      'Yalıkavak Marina\'ya 5 dakika'
    ],
  },
  {
    slug: 'kempinski-barbaros-bay-bodrum',
    name: 'Kempinski Hotel Barbaros Bay Bodrum',
    citySlug: 'bodrum',
    summary: 'Türkbükü yakınlarında, özel yarımadada konumlanmış zarif resort. Six Senses Spa ve Akdeniz manzaralı infinity havuzu.',
    stars: 5,
    amenities: ['Havuz', 'Six Senses Spa', 'Fitness', 'Restoran', 'Özel Plaj', 'Tenis', 'Su Sporları'],
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
    address: 'Kızılağaç Köyü, Gerenkuyu Mevkii',
    neighborhood: 'Gerenkuyu',
    rating: 4.8,
    reviewCount: 1450,
    priceRange: { min: 15000, max: 45000, currency: 'TRY' },
    highlights: ['Six Senses Spa', 'Özel yarımada', 'Türkbükü yakın'],
    suitableFor: ['Wellness arayanlar', 'Aileler', 'Romantik tatil'],
    reasonsToChoose: [
      'Türkiye\'deki tek Six Senses Spa',
      'Özel yarımadada tam mahremiyet',
      'Bodrum\'un en güzel plajlarına yakın'
    ],
  },

  // ========== BERLIN HOTELS ==========
  {
    slug: 'hotel-adlon-kempinski-berlin',
    name: 'Hotel Adlon Kempinski Berlin',
    citySlug: 'berlin',
    summary: 'Brandenburg Kapısı\'nın hemen yanında bulunan, Berlin\'in en ikonik lüks oteli. Tarih, zarafet ve birinci sınıf hizmeti bir arada sunar.',
    stars: 5,
    amenities: ['Spa', 'Havuz', 'Fitness', 'Restoran', 'Bar', 'Oda Servisi', '24/7 Concierge', 'Vale Parking'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: 'Unter den Linden 77, 10117 Berlin',
    neighborhood: 'Mitte',
    rating: 4.8,
    reviewCount: 2450,
    priceRange: { min: 3500, max: 12000, currency: 'TRY' },
    highlights: ['Brandenburg Kapısı manzarası', 'Michelin yıldızlı restoran', 'Tarihi atmosfer'],
    suitableFor: ['Lüks sevenler', 'İş seyahati', 'Balayı çiftleri', 'Özel günler'],
    reasonsToChoose: [
      'Eşsiz lokasyon: Brandenburg Kapısı\'na yürüme mesafesinde',
      'Dünya standartlarında spa ve wellness merkezi',
      'Michelin yıldızlı Lorenz Adlon Esszimmer restoranı'
    ],
  },
  {
    slug: 'soho-house-berlin',
    name: 'Soho House Berlin',
    citySlug: 'berlin',
    summary: 'Kreuzberg\'de tarihi bir binanın içinde bulunan, kreatif profesyonellerin buluşma noktası. Tasarım odaklı odalar ve özel üye kulübü.',
    stars: 4,
    amenities: ['Havuz', 'Spa', 'Gym', 'Restoran', 'Bar', 'Coworking', 'Sinema', 'Teras'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    address: 'Torstraße 1, 10119 Berlin',
    neighborhood: 'Mitte',
    rating: 4.6,
    reviewCount: 890,
    priceRange: { min: 2200, max: 5500, currency: 'TRY' },
    highlights: ['Çatı havuzu', 'Kreatif topluluk', 'Vintage tasarım'],
    suitableFor: ['Dijital nomadlar', 'Kreatif profesyoneller', 'Genç çiftler'],
    reasonsToChoose: [
      'Çatı katında şehir manzaralı havuz',
      'Üye kulübüne erişim ile networking fırsatı',
      'Berlin\'in kreatif sahnesinin kalbinde konum'
    ],
  },
  {
    slug: 'the-circus-hotel-berlin',
    name: 'The Circus Hotel',
    citySlug: 'berlin',
    summary: 'Butik tarzda, karakterli bir otel. Yerel sanatçıların eserleriyle süslenmiş odalar ve canlı bir atmosfer.',
    stars: 3,
    amenities: ['WiFi', 'Restoran', 'Bar', 'Bisiklet Kiralama', 'Tur Hizmetleri'],
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
    address: 'Rosenthaler Str. 1, 10119 Berlin',
    neighborhood: 'Mitte',
    rating: 4.4,
    reviewCount: 1250,
    priceRange: { min: 800, max: 1800, currency: 'TRY' },
    highlights: ['Merkezi konum', 'Yerel sanat', 'Samimi atmosfer'],
    suitableFor: ['Bütçe bilincli gezginler', 'Solo seyahat', 'Genç turistler'],
    reasonsToChoose: [
      'Hackescher Markt\'a yürüyerek 2 dakika',
      'Oranına göre harika değer/fiyat',
      'Otelin kendi microbrewery\'si ve restoranı'
    ],
  },
  {
    slug: 'hotel-zoo-berlin',
    name: 'Hotel Zoo Berlin',
    citySlug: 'berlin',
    summary: 'Kudamm üzerinde bulunan, Grace Kelly\'nin de konakladığı tarihi bir otel. Modern lüks ve Berlin tarihi.',
    stars: 5,
    amenities: ['Spa', 'Fitness', 'Restoran', 'Bar', '24/7 Concierge', 'Valet Parking'],
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    address: 'Kurfürstendamm 25, 10719 Berlin',
    neighborhood: 'Charlottenburg',
    rating: 4.5,
    reviewCount: 680,
    priceRange: { min: 2800, max: 7500, currency: 'TRY' },
    highlights: ['Tarihi karakter', 'Kudamm üzerinde', 'Ünlü konuklar mirası'],
    suitableFor: ['Tarih meraklıları', 'Lüks sevenler', 'Kültür turları'],
    reasonsToChoose: [
      'Efsanevi Grace Kelly Suite mevcut',
      'Berlin\'in en ünlü alışveriş caddesinde',
      'Hayvanat bahçesine yürüyerek 5 dakika'
    ],
  },
  {
    slug: 'the-ritz-carlton-berlin',
    name: 'The Ritz-Carlton Berlin',
    citySlug: 'berlin',
    summary: 'Potsdamer Platz\'da bulunan ultra lüks otel. Klasik Ritz-Carlton zarafeti ile modern Berlin\'in buluşması.',
    stars: 5,
    amenities: ['Spa', 'Havuz', 'Fitness', 'Michelin Restoran', 'Bar', 'Concierge', 'Otopark'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    address: 'Potsdamer Platz 3, 10785 Berlin',
    neighborhood: 'Tiergarten',
    rating: 4.7,
    reviewCount: 1890,
    priceRange: { min: 4000, max: 15000, currency: 'TRY' },
    highlights: ['Potsdamer Platz merkez', 'Dünya standartları', 'Panoramik manzara'],
    suitableFor: ['Lüks sevenler', 'İş toplantıları', 'VIP konuklar'],
    reasonsToChoose: [
      'Potsdamer Platz\'ın kalbinde merkezi konum',
      'Birinci sınıf Ritz-Carlton standartları',
      'Şehir manzaralı rooftop bar'
    ],
  },
  {
    slug: 'michelberger-hotel-berlin',
    name: 'Michelberger Hotel',
    citySlug: 'berlin',
    summary: 'Friedrichshain\'de sanat ve müzik odaklı alternatif butik otel. Berlin\'in bağımsız ruhunu yansıtır.',
    stars: 3,
    amenities: ['WiFi', 'Restoran', 'Bar', 'Bahçe', 'Etkinlik Alanı'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    address: 'Warschauer Str. 39-40, 10243 Berlin',
    neighborhood: 'Friedrichshain',
    rating: 4.3,
    reviewCount: 1560,
    priceRange: { min: 700, max: 1600, currency: 'TRY' },
    highlights: ['Alternatif atmosfer', 'Canlı müzik', 'Yaratıcı tasarım'],
    suitableFor: ['Genç gezginler', 'Müzik severler', 'Alternatif turistler'],
    reasonsToChoose: [
      'Berlin\'in alternatif sahnesinin kalbi',
      'Canlı konser ve etkinlikler',
      'Warschauer Strasse metro istasyonuna yakın'
    ],
  },

  // ========== LISBON HOTELS ==========
  {
    slug: 'santiago-de-alfama-lisbon',
    name: 'Santiago de Alfama',
    citySlug: 'lizbon',
    summary: 'Alfama\'nın tarihi sokaklarında gizli bir mücevher. 15. yüzyıl sarayı restorasyonu, modern konfor ile tarihi atmosfer.',
    stars: 5,
    amenities: ['Spa', 'Havuz', 'Restoran', 'Bar', 'Concierge', 'Teras'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: 'Rua de Santiago 10-14, 1100-494 Lisboa',
    neighborhood: 'Alfama',
    rating: 4.9,
    reviewCount: 520,
    priceRange: { min: 2500, max: 6000, currency: 'TRY' },
    highlights: ['Tarihi saray', 'Tejo manzarası', 'Butik deneyim'],
    suitableFor: ['Romantik tatil', 'Balayı', 'Tarih meraklıları'],
    reasonsToChoose: [
      '15. yüzyıldan restore edilmiş otantik saray',
      'Çatı terasından Tejo Nehri manzarası',
      'Alfama\'nın fado müziği atmosferinin kalbinde'
    ],
  },
  {
    slug: 'martinhal-lisbon-chiado',
    name: 'Martinhal Lisbon Chiado',
    citySlug: 'lizbon',
    summary: 'Aileler için tasarlanmış lüks apartman oteli. Chiado\'nun merkezinde, çocuk dostu hizmetler ve geniş daireler.',
    stars: 5,
    amenities: ['Kids Club', 'Fitness', 'Mutfaklı Daireler', 'Concierge', 'Bebek Bakımı'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    address: 'Rua das Flores 44, 1200-195 Lisboa',
    neighborhood: 'Chiado',
    rating: 4.7,
    reviewCount: 890,
    priceRange: { min: 2200, max: 5000, currency: 'TRY' },
    highlights: ['Aile dostu', 'Merkezi konum', 'Mutfaklı daireler'],
    suitableFor: ['Aileler', 'Çocuklu seyahat', 'Uzun konaklama'],
    reasonsToChoose: [
      'Çocuklar için özel tasarlanmış etkinlikler ve oyun alanı',
      'Mutfaklı geniş daireler ile ev konforu',
      'Chiado\'nun kalbinde, tramvay hattına yakın'
    ],
  },
  {
    slug: 'lx-boutique-hotel-lisbon',
    name: 'LX Boutique Hotel',
    citySlug: 'lizbon',
    summary: 'Fado müziği temalı butik otel. Her kat farklı bir Portekiz şarkıcısına adanmış, Tejo manzaralı odalar.',
    stars: 4,
    amenities: ['WiFi', 'Bar', 'Restoran', 'Concierge', 'Teras'],
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
    address: 'Rua do Alecrim 12, 1200-017 Lisboa',
    neighborhood: 'Cais do Sodré',
    rating: 4.5,
    reviewCount: 1120,
    priceRange: { min: 1200, max: 2800, currency: 'TRY' },
    highlights: ['Fado teması', 'Tejo manzarası', 'Butik karakter'],
    suitableFor: ['Müzik severler', 'Kültür meraklıları', 'Çiftler'],
    reasonsToChoose: [
      'Benzersiz fado temalı oda tasarımları',
      'Çatı barından muhteşem nehir manzarası',
      'Canlı Cais do Sodré gece hayatına yürüme mesafesi'
    ],
  },
  {
    slug: 'pestana-palace-lisbon',
    name: 'Pestana Palace Lisboa',
    citySlug: 'lizbon',
    summary: '19. yüzyıl sarayında bulunan ultra lüks otel. UNESCO Dünya Mirası listesindeki tarihi yapı.',
    stars: 5,
    amenities: ['Spa', 'Havuz', 'Restoran', 'Bar', 'Bahçe', 'Concierge', 'Vale Parking'],
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    address: 'Rua Jau 54, 1300-314 Lisboa',
    neighborhood: 'Alcântara',
    rating: 4.8,
    reviewCount: 1340,
    priceRange: { min: 3500, max: 10000, currency: 'TRY' },
    highlights: ['UNESCO mirası', 'Tarihi saray', 'Tropik bahçe'],
    suitableFor: ['Lüks sevenler', 'Tarih meraklıları', 'Romantik kaçamak'],
    reasonsToChoose: [
      'UNESCO Dünya Mirası listesinde korunan yapı',
      '4.5 hektarlık tropik bahçe',
      'Portekiz kraliyet geçmişi atmosferi'
    ],
  },
  {
    slug: 'memmo-alfama-lisbon',
    name: 'Memmo Alfama',
    citySlug: 'lizbon',
    summary: 'Alfama\'nın çatısında gizli cennet. Minimalist tasarım, havuz ve muhteşem Tejo manzarası.',
    stars: 4,
    amenities: ['Havuz', 'Bar', 'Teras', 'WiFi', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    address: 'Travessa das Merceeiras 27, 1100-348 Lisboa',
    neighborhood: 'Alfama',
    rating: 4.6,
    reviewCount: 780,
    priceRange: { min: 1800, max: 4500, currency: 'TRY' },
    highlights: ['Çatı havuzu', 'Minimalist tasarım', 'Alfama manzarası'],
    suitableFor: ['Çiftler', 'Tasarım tutkunları', 'Romantik kaçamak'],
    reasonsToChoose: [
      'Alfama\'nın en güzel teras manzarası',
      'Şehir manzaralı infinity havuz',
      'Modern minimalist tasarım'
    ],
  },

  // ========== BARCELONA HOTELS ==========
  {
    slug: 'hotel-arts-barcelona',
    name: 'Hotel Arts Barcelona',
    citySlug: 'barcelona',
    summary: 'Barceloneta sahilinde 44 katlı gökdelen otel. Akdeniz\'e sıfır, panoramik manzaralar ve Ritz-Carlton hizmeti.',
    stars: 5,
    amenities: ['Spa', 'Havuz', 'Plaj Erişimi', 'Michelin Restoran', 'Fitness', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: 'Carrer de la Marina 19-21, 08005 Barcelona',
    neighborhood: 'Port Olímpic',
    rating: 4.7,
    reviewCount: 3200,
    priceRange: { min: 3000, max: 10000, currency: 'TRY' },
    highlights: ['Denize sıfır', 'Panoramik manzara', 'Michelin yıldızlı restoran'],
    suitableFor: ['Lüks sevenler', 'Plaj tatili', 'Özel günler'],
    reasonsToChoose: [
      'İki Michelin yıldızlı Enoteca Paco Pérez restoranı',
      'Özel plaj kulübü ve doğrudan sahil erişimi',
      'Frank Gehry tasarımı ünlü balık heykeline komşu'
    ],
  },
  {
    slug: 'hotel-casa-camper-barcelona',
    name: 'Casa Camper Barcelona',
    citySlug: 'barcelona',
    summary: 'El Raval\'de sürdürülebilir tasarımlı butik otel. Camper ayakkabı markasının otelcilik macerası.',
    stars: 4,
    amenities: ['24 Saat Snack Bar', 'Fitness', 'Teras', 'Bisiklet', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    address: 'Carrer d\'Elisabets 11, 08001 Barcelona',
    neighborhood: 'El Raval',
    rating: 4.6,
    reviewCount: 980,
    priceRange: { min: 1800, max: 3500, currency: 'TRY' },
    highlights: ['Sürdürülebilir tasarım', '24 saat ücretsiz snacklar', 'Merkezi konum'],
    suitableFor: ['Tasarım tutkunları', 'Sürdürülebilir seyahat', 'Genç profesyoneller'],
    reasonsToChoose: [
      'Tamamen ücretsiz 24 saat açık snack bar',
      'MACBA modern sanat müzesine komşu',
      'Çevre dostu ve sürdürülebilir işletme'
    ],
  },
  {
    slug: 'w-hotel-barcelona',
    name: 'W Barcelona',
    citySlug: 'barcelona',
    summary: 'Yelken şeklindeki ikonik yapısıyla Barceloneta\'nın simgesi. Plaj, gece hayatı ve lüksün buluşma noktası.',
    stars: 5,
    amenities: ['Spa', 'Havuz', 'Plaj', 'Rooftop Bar', 'Gece Kulübü', 'Fitness'],
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    address: 'Plaça Rosa dels Vents 1, 08039 Barcelona',
    neighborhood: 'Barceloneta',
    rating: 4.5,
    reviewCount: 4560,
    priceRange: { min: 2800, max: 9000, currency: 'TRY' },
    highlights: ['İkonik mimari', 'Denize sıfır', 'Canlı atmosfer'],
    suitableFor: ['Genç çiftler', 'Gece hayatı severler', 'Trend takipçileri'],
    reasonsToChoose: [
      'Barcelona\'nın en ikonik otel binası',
      'Eclipse rooftop bar ile muhteşem gün batımı',
      'Özel plaj kulübü ve havuz partileri'
    ],
  },
  {
    slug: 'hotel-1898-barcelona',
    name: 'Hotel 1898',
    citySlug: 'barcelona',
    summary: 'La Rambla\'nın kalbinde tarihi bina. Eski Filipin Tütün Şirketi merkez binasından dönüştürülmüş.',
    stars: 4,
    amenities: ['Havuz', 'Spa', 'Restoran', 'Bar', 'Teras', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
    address: 'La Rambla 109, 08002 Barcelona',
    neighborhood: 'Barri Gòtic',
    rating: 4.4,
    reviewCount: 1890,
    priceRange: { min: 1500, max: 3800, currency: 'TRY' },
    highlights: ['La Rambla üzeri', 'Tarihi yapı', 'Çatı havuzu'],
    suitableFor: ['Kültür turistleri', 'Merkez arayanlar', 'Tarih meraklıları'],
    reasonsToChoose: [
      'La Rambla\'nın tam ortasında eşsiz konum',
      'Çatı terasından şehir manzarası',
      'Kolonyal dönem mimarisi'
    ],
  },
  {
    slug: 'generator-barcelona',
    name: 'Generator Barcelona',
    citySlug: 'barcelona',
    summary: 'Gracia\'da bulunan trendy hostel/otel hibrit. Bütçe dostu ama stil sahibi konaklama.',
    stars: 2,
    amenities: ['WiFi', 'Bar', 'Teras', 'Ortak Mutfak', 'Çamaşırhane'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    address: 'Carrer de Còrsega 373, 08037 Barcelona',
    neighborhood: 'Gràcia',
    rating: 4.2,
    reviewCount: 5670,
    priceRange: { min: 400, max: 1200, currency: 'TRY' },
    highlights: ['Bütçe dostu', 'Sosyal atmosfer', 'Gracia bölgesi'],
    suitableFor: ['Genç gezginler', 'Solo seyahat', 'Bütçe bilincli'],
    reasonsToChoose: [
      'Gracia\'nın yerel atmosferinde konaklama',
      'Harika fiyat/performans oranı',
      'Sosyal ortam ve yeni insanlarla tanışma'
    ],
  },

  // ========== AMSTERDAM HOTELS ==========
  {
    slug: 'the-hoxton-amsterdam',
    name: 'The Hoxton Amsterdam',
    citySlug: 'amsterdam',
    summary: 'Herengracht kanalı üzerinde 17. yüzyıl evlerinde butik otel deneyimi. Şık tasarım, canlı lobi ve merkezi konum.',
    stars: 4,
    amenities: ['Restoran', 'Bar', 'Lobi Çalışma Alanı', 'WiFi', 'Bisiklet Kiralama'],
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
    address: 'Herengracht 255, 1016 BJ Amsterdam',
    neighborhood: 'Negen Straatjes',
    rating: 4.5,
    reviewCount: 1850,
    priceRange: { min: 1500, max: 4000, currency: 'TRY' },
    highlights: ['Kanal manzarası', 'Tarihi binalar', 'Canlı lobi'],
    suitableFor: ['Dijital nomadlar', 'Çiftler', 'Solo gezginler'],
    reasonsToChoose: [
      'Dokuz Sokak (Negen Straatjes) alışveriş bölgesinde',
      'Lobide çalışmak için ideal ortam',
      'Anne Frank Evi\'ne yürüyerek 5 dakika'
    ],
  },
  {
    slug: 'pulitzer-amsterdam',
    name: 'Pulitzer Amsterdam',
    citySlug: 'amsterdam',
    summary: '25 tarihi kanal evinin birleşiminden oluşan benzersiz otel. Her oda farklı, iç bahçe cennet gibi.',
    stars: 5,
    amenities: ['Restoran', 'Bar', 'Bahçe', 'Kanal Teknesi', 'Concierge', 'Bisiklet'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    address: 'Prinsengracht 323, 1016 GZ Amsterdam',
    neighborhood: 'Jordaan',
    rating: 4.7,
    reviewCount: 1230,
    priceRange: { min: 3000, max: 8000, currency: 'TRY' },
    highlights: ['25 tarihi ev', 'Gizli bahçe', 'Kanal teknesi'],
    suitableFor: ['Romantik kaçamak', 'Tarih meraklıları', 'Lüks sevenler'],
    reasonsToChoose: [
      '25 farklı 17. yüzyıl evinde benzersiz odalar',
      'Gizli iç bahçede sakin kahvaltı',
      'Otelin özel kanal teknesi ile tur'
    ],
  },
  {
    slug: 'citizen-m-amsterdam-south',
    name: 'citizenM Amsterdam South',
    citySlug: 'amsterdam',
    summary: 'Zuidas iş bölgesinde akıllı teknoloji odaklı modern otel. Uygun fiyata şık tasarım.',
    stars: 4,
    amenities: ['WiFi', 'Bar', '24/7 Kantin', 'Çalışma Alanı', 'Akıllı Oda Kontrolü'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    address: 'Prinses Irenestraat 30, 1077 WX Amsterdam',
    neighborhood: 'Zuidas',
    rating: 4.4,
    reviewCount: 2340,
    priceRange: { min: 900, max: 2200, currency: 'TRY' },
    highlights: ['Akıllı teknoloji', 'Modern tasarım', 'Uygun fiyat'],
    suitableFor: ['İş seyahati', 'Teknoloji meraklıları', 'Bütçe bilincli'],
    reasonsToChoose: [
      'iPad kontrollü akıllı oda sistemi',
      'RAI fuar alanına yürüme mesafesi',
      'Fiyat/kalite oranında mükemmel'
    ],
  },
  {
    slug: 'hotel-v-nesplein-amsterdam',
    name: 'Hotel V Nesplein',
    citySlug: 'amsterdam',
    summary: 'Nes sokağında bulunan butik otel. Tiyatro bölgesinin kalbinde, şık ve samimi.',
    stars: 4,
    amenities: ['Restoran', 'Bar', 'WiFi', 'Bisiklet', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    address: 'Nes 49, 1012 KD Amsterdam',
    neighborhood: 'Dam Meydanı',
    rating: 4.5,
    reviewCount: 890,
    priceRange: { min: 1400, max: 3200, currency: 'TRY' },
    highlights: ['Merkezi konum', 'Butik atmosfer', 'Tiyatro bölgesi'],
    suitableFor: ['Kültür severler', 'Çiftler', 'İş seyahati'],
    reasonsToChoose: [
      'Dam Meydanı\'na 2 dakika yürüme mesafesi',
      'Tiyatro ve sanat merkezlerine yakın',
      'Şık ve samimi butik atmosfer'
    ],
  },

  // ========== PARIS HOTELS ==========
  {
    slug: 'hotel-le-marais-paris',
    name: 'Hôtel du Petit Moulin',
    citySlug: 'paris',
    summary: 'Christian Lacroix tasarımı butik otel. 17. yüzyıl fırınından dönüştürülmüş, Le Marais\'nin kalbinde.',
    stars: 4,
    amenities: ['WiFi', 'Concierge', 'Bar', 'Oda Servisi'],
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    address: '29/31 Rue de Poitou, 75003 Paris',
    neighborhood: 'Le Marais',
    rating: 4.6,
    reviewCount: 720,
    priceRange: { min: 2000, max: 4500, currency: 'TRY' },
    highlights: ['Christian Lacroix tasarımı', 'Tarihi bina', 'Benzersiz odalar'],
    suitableFor: ['Moda tutkunları', 'Sanat severler', 'Romantik kaçamak'],
    reasonsToChoose: [
      'Her oda Christian Lacroix tarafından benzersiz tasarlanmış',
      'Paris\'in en trendy semti Le Marais\'de',
      'Picasso Müzesi\'ne yürüyerek 3 dakika'
    ],
  },
  {
    slug: 'hotel-plaza-athenee-paris',
    name: 'Hôtel Plaza Athénée',
    citySlug: 'paris',
    summary: 'Avenue Montaigne\'deki efsanevi saray otel. Haute couture, Michelin yıldızları ve Paris\'in en prestijli adresi.',
    stars: 5,
    amenities: ['Spa', 'Havuz', 'Michelin Restoran', 'Bar', 'Fitness', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: '25 Avenue Montaigne, 75008 Paris',
    neighborhood: 'Champs-Élysées',
    rating: 4.9,
    reviewCount: 1890,
    priceRange: { min: 8000, max: 50000, currency: 'TRY' },
    highlights: ['Palace otel', 'Alain Ducasse restoranı', 'Eiffel manzarası'],
    suitableFor: ['Ultra lüks', 'Özel günler', 'Moda tutkunları'],
    reasonsToChoose: [
      'Dior, Chanel gibi haute couture evlerine komşu',
      'Alain Ducasse imzalı Michelin yıldızlı restoran',
      'Paris\'in en ikonik balkonlarından Eiffel manzarası'
    ],
  },
  {
    slug: 'hotel-le-cinq-codet-paris',
    name: 'Le Cinq Codet',
    citySlug: 'paris',
    summary: 'Art Deco yapıda modern butik otel. Eiffel Kulesi\'ne yakın, sanat galerisi atmosferinde.',
    stars: 5,
    amenities: ['Spa', 'Fitness', 'Bar', 'Restoran', 'Bahçe', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    address: '5 Rue Louis Codet, 75007 Paris',
    neighborhood: '7. Bölge',
    rating: 4.7,
    reviewCount: 560,
    priceRange: { min: 3500, max: 8000, currency: 'TRY' },
    highlights: ['Art Deco mimari', 'Sanat koleksiyonu', 'Eiffel yakını'],
    suitableFor: ['Sanat severler', 'Tasarım tutkunları', 'Romantik tatil'],
    reasonsToChoose: [
      'Eski telekomunikasyon binasından dönüşüm',
      'Çağdaş sanat koleksiyonu sergileniyor',
      'Eiffel Kulesi\'ne yürüyerek 10 dakika'
    ],
  },
  {
    slug: 'generator-paris',
    name: 'Generator Paris',
    citySlug: 'paris',
    summary: 'Gare du Nord yakınında trendy hostel/otel. Bütçe dostu, sosyal ve merkezi konaklama.',
    stars: 2,
    amenities: ['WiFi', 'Bar', 'Teras', 'Kantin', 'Çamaşırhane'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    address: '9-11 Place du Colonel Fabien, 75010 Paris',
    neighborhood: '10. Bölge',
    rating: 4.1,
    reviewCount: 6780,
    priceRange: { min: 350, max: 1000, currency: 'TRY' },
    highlights: ['Bütçe dostu', 'Sosyal atmosfer', 'Merkezi konum'],
    suitableFor: ['Genç gezginler', 'Solo seyahat', 'Bütçe bilincli'],
    reasonsToChoose: [
      'Gare du Nord\'a yakın ulaşım kolaylığı',
      'Çatı terasından Paris manzarası',
      'Yeni insanlarla tanışma fırsatı'
    ],
  },

  // ========== PRAGUE HOTELS ==========
  {
    slug: 'aria-hotel-prague',
    name: 'Aria Hotel Prague',
    citySlug: 'prag',
    summary: 'Müzik temalı butik otel. Her kat farklı müzik türüne adanmış, Malá Strana\'nın kalbinde.',
    stars: 5,
    amenities: ['Spa', 'Restoran', 'Bar', 'Teras', 'Müzik Kütüphanesi', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: 'Tržiště 9, 118 00 Praha 1',
    neighborhood: 'Malá Strana',
    rating: 4.8,
    reviewCount: 1340,
    priceRange: { min: 2500, max: 6500, currency: 'TRY' },
    highlights: ['Müzik teması', 'Çatı bahçesi', 'Malá Strana'],
    suitableFor: ['Müzik severler', 'Romantik kaçamak', 'Kültür turistleri'],
    reasonsToChoose: [
      'Her kat farklı müzik türüne adanmış',
      'Çatı terasından Prague Kalesi manzarası',
      'Karel Köprüsü\'ne yürüyerek 5 dakika'
    ],
  },
  {
    slug: 'hotel-josef-prague',
    name: 'Hotel Josef',
    citySlug: 'prag',
    summary: 'Eva Jiřičná tasarımı minimalist butik otel. Yahudi Mahallesi\'nde modern mimari.',
    stars: 4,
    amenities: ['Fitness', 'Bar', 'WiFi', 'Bisiklet', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    address: 'Rybná 20, 110 00 Praha 1',
    neighborhood: 'Josefov',
    rating: 4.5,
    reviewCount: 890,
    priceRange: { min: 1400, max: 3200, currency: 'TRY' },
    highlights: ['Minimalist tasarım', 'Merkezi konum', 'Yahudi Mahallesi'],
    suitableFor: ['Tasarım tutkunları', 'İş seyahati', 'Kültür turistleri'],
    reasonsToChoose: [
      'Ödüllü mimar Eva Jiřičná tasarımı',
      'Eski Şehir Meydanı\'na 3 dakika',
      'Prag\'ın en merkezi lokasyonu'
    ],
  },

  // ========== VIENNA HOTELS ==========
  {
    slug: 'hotel-sacher-wien',
    name: 'Hotel Sacher Wien',
    citySlug: 'viyana',
    summary: 'Viyana\'nın efsanevi oteli ve Sachertorte\'nin doğduğu yer. Opera Binası\'nın karşısında aristokrat lüks.',
    stars: 5,
    amenities: ['Spa', 'Restoran', 'Bar', 'Concierge', 'Cafe Sacher'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: 'Philharmoniker Str. 4, 1010 Wien',
    neighborhood: 'İç Şehir',
    rating: 4.9,
    reviewCount: 2100,
    priceRange: { min: 4500, max: 15000, currency: 'TRY' },
    highlights: ['Sachertorte', 'Opera karşısı', 'Tarihi miras'],
    suitableFor: ['Lüks sevenler', 'Kültür turistleri', 'Romantik tatil'],
    reasonsToChoose: [
      'Orijinal Sachertorte\'nin icad edildiği yer',
      'Viyana Devlet Operası\'nın hemen karşısı',
      '140 yıllık aristokrat gelenek'
    ],
  },
  {
    slug: '25hours-hotel-vienna',
    name: '25hours Hotel Vienna',
    citySlug: 'viyana',
    summary: 'MuseumsQuartier\'de sirk temalı trendy otel. Renkli, eğlenceli ve merkezi.',
    stars: 4,
    amenities: ['Restoran', 'Bar', 'Teras', 'Bisiklet', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    address: 'Lerchenfelder Str. 1/3, 1070 Wien',
    neighborhood: 'MuseumsQuartier',
    rating: 4.4,
    reviewCount: 1560,
    priceRange: { min: 1100, max: 2600, currency: 'TRY' },
    highlights: ['Sirk teması', 'Trendy atmosfer', 'Müze bölgesi'],
    suitableFor: ['Genç gezginler', 'Sanat severler', 'Yaratıcı ruhlar'],
    reasonsToChoose: [
      'MuseumsQuartier\'e komşu sanat merkezi',
      'Eğlenceli sirk temalı tasarım',
      'Çatı barından şehir manzarası'
    ],
  },

  // ========== BUDAPEST HOTELS ==========
  {
    slug: 'four-seasons-gresham-palace-budapest',
    name: 'Four Seasons Gresham Palace',
    citySlug: 'budapeşte',
    summary: 'Art Nouveau mimarisinin şaheseri. Zincir Köprüsü manzaralı, Budapeşte\'nin en prestijli oteli.',
    stars: 5,
    amenities: ['Spa', 'Havuz', 'Restoran', 'Bar', 'Fitness', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: 'Széchenyi István tér 5-6, 1051 Budapest',
    neighborhood: 'Pest',
    rating: 4.9,
    reviewCount: 1780,
    priceRange: { min: 5000, max: 20000, currency: 'TRY' },
    highlights: ['Art Nouveau saray', 'Zincir Köprüsü manzarası', 'Tuna kıyısı'],
    suitableFor: ['Ultra lüks', 'Mimari meraklıları', 'Özel günler'],
    reasonsToChoose: [
      'Budapeşte\'nin en güzel Art Nouveau yapısı',
      'Tuna Nehri ve Buda Kalesi panoramik manzarası',
      'Four Seasons\'ın dünya standartları'
    ],
  },
  {
    slug: 'brody-house-budapest',
    name: 'Brody House',
    citySlug: 'budapeşte',
    summary: 'Sanat odaklı butik otel. Her oda farklı sanatçı tarafından tasarlanmış, yaratıcı topluluk merkezi.',
    stars: 4,
    amenities: ['Bar', 'Bahçe', 'Sanat Galerisi', 'Etkinlik Alanı', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    address: 'Bródy Sándor u. 10, 1088 Budapest',
    neighborhood: 'Palace District',
    rating: 4.5,
    reviewCount: 670,
    priceRange: { min: 1200, max: 2800, currency: 'TRY' },
    highlights: ['Sanat odaklı', 'Yaratıcı topluluk', 'Benzersiz odalar'],
    suitableFor: ['Sanatçılar', 'Yaratıcı profesyoneller', 'Alternatif turistler'],
    reasonsToChoose: [
      'Her oda farklı sanatçı tarafından tasarlanmış',
      'Yaratıcı topluluk etkinlikleri',
      'Ulusal Müze\'ye yürüyerek 2 dakika'
    ],
  },

  // ========== ROME HOTELS ==========
  {
    slug: 'hotel-de-russie-rome',
    name: 'Hotel de Russie',
    citySlug: 'roma',
    summary: 'Piazza del Popolo\'da bulunan lüks otel. Gizli bahçesi ve Vaupel spa\'sı ile ünlü.',
    stars: 5,
    amenities: ['Spa', 'Bahçe', 'Restoran', 'Bar', 'Fitness', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: 'Via del Babuino 9, 00187 Roma',
    neighborhood: 'Tridente',
    rating: 4.8,
    reviewCount: 1560,
    priceRange: { min: 4000, max: 12000, currency: 'TRY' },
    highlights: ['Gizli bahçe', 'Piazza del Popolo', 'Tarihi lüks'],
    suitableFor: ['Lüks sevenler', 'Romantik kaçamak', 'Sanat severler'],
    reasonsToChoose: [
      'Roma\'nın en güzel otel bahçesi',
      'İspanyol Merdivenleri\'ne yürüyerek 5 dakika',
      'Stravinskij bar\'ın efsanevi kokteylleri'
    ],
  },
  {
    slug: 'the-hoxton-rome',
    name: 'The Hoxton Rome',
    citySlug: 'roma',
    summary: '17. yüzyıl sarayında butik otel deneyimi. Campo de\' Fiori\'ye komşu, şık ve samimi.',
    stars: 4,
    amenities: ['Restoran', 'Bar', 'Teras', 'Lobi Çalışma Alanı', 'WiFi'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    address: 'Largo Benedetto Cairoli 68, 00186 Roma',
    neighborhood: 'Centro Storico',
    rating: 4.6,
    reviewCount: 890,
    priceRange: { min: 1600, max: 3800, currency: 'TRY' },
    highlights: ['Tarihi saray', 'Campo de\' Fiori', 'Hoxton tarzı'],
    suitableFor: ['Dijital nomadlar', 'Çiftler', 'Tasarım tutkunları'],
    reasonsToChoose: [
      '17. yüzyıldan restore edilmiş saray',
      'Campo de\' Fiori pazarına 2 dakika',
      'Çatı terasından Roma manzarası'
    ],
  },

  // ========== MILAN HOTELS ==========
  {
    slug: 'armani-hotel-milano',
    name: 'Armani Hotel Milano',
    citySlug: 'milano',
    summary: 'Giorgio Armani\'nin imzasını taşıyan ultra lüks otel. Moda başkentinin en prestijli adresi.',
    stars: 5,
    amenities: ['Spa', 'Fitness', 'Restoran', 'Bar', 'Concierge', 'Butik'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: 'Via Manzoni 31, 20121 Milano',
    neighborhood: 'Quadrilatero della Moda',
    rating: 4.8,
    reviewCount: 1120,
    priceRange: { min: 5500, max: 20000, currency: 'TRY' },
    highlights: ['Armani imzası', 'Moda bölgesi', 'Minimalist lüks'],
    suitableFor: ['Moda tutkunları', 'Ultra lüks', 'İş seyahati'],
    reasonsToChoose: [
      'Via Montenapoleone\'ye yürüyerek 2 dakika',
      'Giorgio Armani\'nin kişisel tasarımları',
      'Milano\'nun en prestijli adresi'
    ],
  },

  // ========== DUBAI HOTELS ==========
  {
    slug: 'burj-al-arab-dubai',
    name: 'Burj Al Arab',
    citySlug: 'dubai',
    summary: 'Dünyanın en lüks oteli olarak bilinen yelken şeklindeki ikon. 7 yıldızlı deneyim.',
    stars: 5,
    amenities: ['Spa', 'Havuz', 'Plaj', 'Helikopter Pisti', 'Restoran', 'Butler Servisi'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: 'Jumeirah Beach Road, Dubai',
    neighborhood: 'Jumeirah',
    rating: 4.9,
    reviewCount: 3450,
    priceRange: { min: 25000, max: 200000, currency: 'TRY' },
    highlights: ['İkonik mimari', 'Ultra lüks', 'Özel plaj'],
    suitableFor: ['Ultra lüks arayanlar', 'Özel günler', 'Once-in-a-lifetime'],
    reasonsToChoose: [
      'Dünyanın en tanınmış otel silueti',
      'Her odada özel butler hizmeti',
      'Rolls Royce transfer dahil'
    ],
  },

  // ========== TOKYO HOTELS ==========
  {
    slug: 'park-hyatt-tokyo',
    name: 'Park Hyatt Tokyo',
    citySlug: 'tokyo',
    summary: 'Lost in Translation filminin mekanı. Shinjuku\'nun üzerinde, Tokyo\'nun en ikonik oteli.',
    stars: 5,
    amenities: ['Spa', 'Havuz', 'Fitness', 'Restoran', 'Bar', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: '3-7-1-2 Nishi Shinjuku, Shinjuku-ku, Tokyo',
    neighborhood: 'Shinjuku',
    rating: 4.8,
    reviewCount: 2340,
    priceRange: { min: 6000, max: 25000, currency: 'TRY' },
    highlights: ['Film mekanı', 'Skyline manzarası', 'New York Bar'],
    suitableFor: ['Film tutkunları', 'Lüks sevenler', 'Romantik kaçamak'],
    reasonsToChoose: [
      'Lost in Translation\'ın efsanevi mekanı',
      'New York Bar\'dan Tokyo skyline manzarası',
      'Japonya\'nın en iyi spa deneyimi'
    ],
  },

  // ========== BALI HOTELS ==========
  {
    slug: 'four-seasons-bali-sayan',
    name: 'Four Seasons Bali at Sayan',
    citySlug: 'bali',
    summary: 'Ubud\'un yağmur ormanlarında cennet. Pirinç terasları manzaralı villalar ve dünya standartlarında spa.',
    stars: 5,
    amenities: ['Spa', 'Havuz', 'Restoran', 'Yoga', 'Wellness', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    address: 'Sayan, Ubud, Bali 80571, Indonesia',
    neighborhood: 'Ubud',
    rating: 4.9,
    reviewCount: 1890,
    priceRange: { min: 8000, max: 35000, currency: 'TRY' },
    highlights: ['Yağmur ormanı', 'Pirinç terasları', 'Wellness'],
    suitableFor: ['Wellness arayanlar', 'Balayı', 'Doğa severler'],
    reasonsToChoose: [
      'Ayung Nehri vadisinde eşsiz konum',
      'Dünya standartlarında wellness programları',
      'Pirinç terasları manzaralı infinity havuz'
    ],
  },
];

// Helper functions
export function getHotelBySlug(slug: string): HotelData | null {
  return hotelData.find(hotel => hotel.slug === slug) || null;
}

export function getHotelsByCity(citySlug: string): HotelData[] {
  return hotelData.filter(hotel => hotel.citySlug === citySlug);
}

export function getAllHotels(): HotelData[] {
  return hotelData;
}

export function getRelatedHotels(hotelSlug: string, citySlug: string, limit: number = 3): HotelData[] {
  return hotelData
    .filter(hotel => hotel.citySlug === citySlug && hotel.slug !== hotelSlug)
    .slice(0, limit);
}

export function getHotelCities(): string[] {
  const cities = new Set(hotelData.map(hotel => hotel.citySlug));
  return Array.from(cities);
}
