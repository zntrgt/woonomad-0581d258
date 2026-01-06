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

// Hotel data
export const hotelData: HotelData[] = [
  // Berlin Hotels
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
  // Lisbon Hotels
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
  // Barcelona Hotels
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
  // Amsterdam Hotels
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
  // Paris Hotels
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
