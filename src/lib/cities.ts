// City data for hub pages
export interface CityInfo {
  slug: string;
  name: string;
  nameEn: string;
  country: string;
  countryCode: string;
  airportCodes: string[];
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  timezone: string;
  currency: string;
  language: string;
  population: string;
  image: string;
}

export const cityData: Record<string, CityInfo> = {
  'berlin': {
    slug: 'berlin',
    name: 'Berlin',
    nameEn: 'Berlin',
    country: 'Almanya',
    countryCode: 'DE',
    airportCodes: ['BER', 'TXL'],
    description: 'Berlin, Almanya\'nın başkenti ve en büyük şehri. Zengin tarihi, canlı sanat sahnesi ve kozmopolit atmosferiyle ünlüdür. Brandenburg Kapısı, Berlin Duvarı kalıntıları ve dünya standartlarındaki müzeleriyle turistleri cezbeder.',
    highlights: ['Brandenburg Kapısı', 'Berlin Duvarı', 'Museum Island', 'Reichstag', 'Checkpoint Charlie'],
    bestTimeToVisit: 'Mayıs - Eylül',
    timezone: 'UTC+1',
    currency: 'Euro (EUR)',
    language: 'Almanca',
    population: '3.7 milyon',
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&h=600&fit=crop',
  },
  'paris': {
    slug: 'paris',
    name: 'Paris',
    nameEn: 'Paris',
    country: 'Fransa',
    countryCode: 'FR',
    airportCodes: ['CDG', 'ORY'],
    description: 'Paris, "Işıklar Şehri" olarak bilinen Fransa\'nın başkenti. Eyfel Kulesi, Louvre Müzesi, Notre-Dame Katedrali ve romantik atmosferiyle dünyanın en çok ziyaret edilen şehirlerinden biridir.',
    highlights: ['Eyfel Kulesi', 'Louvre Müzesi', 'Notre-Dame', 'Champs-Élysées', 'Montmartre'],
    bestTimeToVisit: 'Nisan - Haziran, Eylül - Ekim',
    timezone: 'UTC+1',
    currency: 'Euro (EUR)',
    language: 'Fransızca',
    population: '2.1 milyon',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=600&fit=crop',
  },
  'londra': {
    slug: 'londra',
    name: 'Londra',
    nameEn: 'London',
    country: 'İngiltere',
    countryCode: 'GB',
    airportCodes: ['LHR', 'LGW', 'STN'],
    description: 'Londra, İngiltere\'nin başkenti ve Avrupa\'nın en büyük metropollerinden biri. Big Ben, Buckingham Sarayı, Tower Bridge ve British Museum ile tarihi dokuyu modernlikle harmanlayan benzersiz bir şehir.',
    highlights: ['Big Ben', 'Tower of London', 'British Museum', 'Buckingham Palace', 'London Eye'],
    bestTimeToVisit: 'Mayıs - Eylül',
    timezone: 'UTC+0',
    currency: 'Pound Sterling (GBP)',
    language: 'İngilizce',
    population: '9 milyon',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=600&fit=crop',
  },
  'amsterdam': {
    slug: 'amsterdam',
    name: 'Amsterdam',
    nameEn: 'Amsterdam',
    country: 'Hollanda',
    countryCode: 'NL',
    airportCodes: ['AMS'],
    description: 'Amsterdam, Hollanda\'nın başkenti. Pitoresk kanalları, tarihi evleri, dünyaca ünlü müzeleri ve bisiklet dostu altyapısıyla tanınır. Van Gogh Müzesi ve Anne Frank Evi en popüler turistik noktalarıdır.',
    highlights: ['Van Gogh Museum', 'Anne Frank House', 'Rijksmuseum', 'Kanallar', 'Vondelpark'],
    bestTimeToVisit: 'Nisan - Mayıs, Eylül - Ekim',
    timezone: 'UTC+1',
    currency: 'Euro (EUR)',
    language: 'Hollandaca',
    population: '870 bin',
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&h=600&fit=crop',
  },
  'barcelona': {
    slug: 'barcelona',
    name: 'Barselona',
    nameEn: 'Barcelona',
    country: 'İspanya',
    countryCode: 'ES',
    airportCodes: ['BCN'],
    description: 'Barselona, İspanya\'nın Katalonya bölgesinin başkenti. Gaudi\'nin mimari şaheserleri, Akdeniz sahilleri ve canlı gece hayatıyla ünlüdür. La Sagrada Familia dünyanın en etkileyici yapılarından biridir.',
    highlights: ['La Sagrada Familia', 'Park Güell', 'La Rambla', 'Camp Nou', 'Gotik Mahalle'],
    bestTimeToVisit: 'Mayıs - Haziran, Eylül - Ekim',
    timezone: 'UTC+1',
    currency: 'Euro (EUR)',
    language: 'İspanyolca, Katalanca',
    population: '1.6 milyon',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&h=600&fit=crop',
  },
  'roma': {
    slug: 'roma',
    name: 'Roma',
    nameEn: 'Rome',
    country: 'İtalya',
    countryCode: 'IT',
    airportCodes: ['FCO'],
    description: 'Roma, "Ebedi Şehir" olarak bilinen İtalya\'nın başkenti. Antik Roma İmparatorluğu\'nun kalıntıları, Vatikan ve dünya mutfağının öncüsü İtalyan mutfağıyla tarih ve lezzetin buluştuğu eşsiz bir destinasyon.',
    highlights: ['Kolezyum', 'Vatikan', 'Trevi Çeşmesi', 'Pantheon', 'Roma Forumu'],
    bestTimeToVisit: 'Nisan - Haziran, Eylül - Ekim',
    timezone: 'UTC+1',
    currency: 'Euro (EUR)',
    language: 'İtalyanca',
    population: '2.8 milyon',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&h=600&fit=crop',
  },
  'dubai': {
    slug: 'dubai',
    name: 'Dubai',
    nameEn: 'Dubai',
    country: 'BAE',
    countryCode: 'AE',
    airportCodes: ['DXB'],
    description: 'Dubai, Birleşik Arap Emirlikleri\'nin en büyük şehri. Burj Khalifa, lüks alışveriş merkezleri ve çöl safarilarıyla modern mimarinin ve geleneksel Arap kültürünün harmanlandığı benzersiz bir destinasyon.',
    highlights: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Burj Al Arab', 'Desert Safari'],
    bestTimeToVisit: 'Kasım - Mart',
    timezone: 'UTC+4',
    currency: 'Dirham (AED)',
    language: 'Arapça, İngilizce',
    population: '3.4 milyon',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=600&fit=crop',
  },
  'tokyo': {
    slug: 'tokyo',
    name: 'Tokyo',
    nameEn: 'Tokyo',
    country: 'Japonya',
    countryCode: 'JP',
    airportCodes: ['NRT', 'HND'],
    description: 'Tokyo, Japonya\'nın başkenti ve dünyanın en büyük metropollerinden biri. Geleneksel tapınaklar, fütüristik teknoloji, anime kültürü ve eşsiz mutfağıyla Doğu ile Batı\'nın buluştuğu benzersiz bir şehir.',
    highlights: ['Sensoji Temple', 'Shibuya Crossing', 'Tokyo Tower', 'Akihabara', 'Meiji Shrine'],
    bestTimeToVisit: 'Mart - Mayıs, Eylül - Kasım',
    timezone: 'UTC+9',
    currency: 'Yen (JPY)',
    language: 'Japonca',
    population: '14 milyon',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=600&fit=crop',
  },
  'prag': {
    slug: 'prag',
    name: 'Prag',
    nameEn: 'Prague',
    country: 'Çekya',
    countryCode: 'CZ',
    airportCodes: ['PRG'],
    description: 'Prag, "Yüz Kuleli Şehir" olarak bilinen Çekya\'nın başkenti. Ortaçağ mimarisi, gotik katedraller ve romantik atmosferiyle Avrupa\'nın en güzel şehirlerinden biri.',
    highlights: ['Charles Bridge', 'Prague Castle', 'Old Town Square', 'Astronomical Clock', 'St. Vitus Cathedral'],
    bestTimeToVisit: 'Nisan - Mayıs, Eylül - Ekim',
    timezone: 'UTC+1',
    currency: 'Koruna (CZK)',
    language: 'Çekçe',
    population: '1.3 milyon',
    image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=1200&h=600&fit=crop',
  },
  'viyana': {
    slug: 'viyana',
    name: 'Viyana',
    nameEn: 'Vienna',
    country: 'Avusturya',
    countryCode: 'AT',
    airportCodes: ['VIE'],
    description: 'Viyana, Avusturya\'nın başkenti ve kültür başkenti. Mozart, Beethoven gibi büyük bestecilerin yaşadığı şehir, operaları, sarayları ve kahve kültürüyle tanınır.',
    highlights: ['Schönbrunn Palace', 'St. Stephen\'s Cathedral', 'Belvedere Palace', 'Vienna State Opera', 'Naschmarkt'],
    bestTimeToVisit: 'Nisan - Ekim',
    timezone: 'UTC+1',
    currency: 'Euro (EUR)',
    language: 'Almanca',
    population: '1.9 milyon',
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200&h=600&fit=crop',
  },
  'bangkok': {
    slug: 'bangkok',
    name: 'Bangkok',
    nameEn: 'Bangkok',
    country: 'Tayland',
    countryCode: 'TH',
    airportCodes: ['BKK', 'DMK'],
    description: 'Bangkok, Tayland\'ın başkenti. Altın tapınaklar, canlı sokak yemek kültürü, yüzen pazarlar ve eğlence hayatıyla Güneydoğu Asya\'nın en popüler destinasyonlarından biri.',
    highlights: ['Grand Palace', 'Wat Pho', 'Chatuchak Market', 'Khao San Road', 'Floating Markets'],
    bestTimeToVisit: 'Kasım - Şubat',
    timezone: 'UTC+7',
    currency: 'Baht (THB)',
    language: 'Tayca',
    population: '10 milyon',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579c4e?w=1200&h=600&fit=crop',
  },
  'singapur': {
    slug: 'singapur',
    name: 'Singapur',
    nameEn: 'Singapore',
    country: 'Singapur',
    countryCode: 'SG',
    airportCodes: ['SIN'],
    description: 'Singapur, Güneydoğu Asya\'nın modern şehir devleti. Marina Bay Sands, Gardens by the Bay ve dünya standartlarındaki altyapısıyla geleceğin şehri olarak anılır.',
    highlights: ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa Island', 'Orchard Road', 'Chinatown'],
    bestTimeToVisit: 'Şubat - Nisan',
    timezone: 'UTC+8',
    currency: 'Singapur Doları (SGD)',
    language: 'İngilizce, Mandarin, Malayca, Tamil',
    population: '5.7 milyon',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=600&fit=crop',
  },
};

// Get all cities
export function getAllCities(): CityInfo[] {
  return Object.values(cityData);
}

// Get city by slug
export function getCityBySlug(slug: string): CityInfo | null {
  return cityData[slug] || null;
}

// Generate city routes from flight routes
export function getCityFlightRoutes(citySlug: string, flightRoutes: { origin: string; destination: string; slug: string }[]): typeof flightRoutes {
  const city = cityData[citySlug];
  if (!city) return [];
  
  return flightRoutes.filter(route => 
    city.airportCodes.includes(route.origin) || 
    city.airportCodes.includes(route.destination)
  );
}
