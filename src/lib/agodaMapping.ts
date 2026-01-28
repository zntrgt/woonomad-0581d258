// Centralized Agoda City Mapping for affiliate links
// This ensures all hotel links redirect to correct destination search results

export const AGODA_CID = "1844104";

export interface AgodaCityInfo {
  cityId: string;
  lat: number;
  lng: number;
  nameEn: string;
}

// Comprehensive city mapping for Agoda deep linking
// cityId is Agoda's internal city identifier for accurate search results
export const cityAgodaMapping: Record<string, AgodaCityInfo> = {
  // === TÜRKİYE ===
  'istanbul': { cityId: '18482', lat: 41.0082, lng: 28.9784, nameEn: 'Istanbul' },
  'antalya': { cityId: '17067', lat: 36.8969, lng: 30.7133, nameEn: 'Antalya' },
  'izmir': { cityId: '6140', lat: 38.4192, lng: 27.1287, nameEn: 'Izmir' },
  'bodrum': { cityId: '14605', lat: 37.0343, lng: 27.4305, nameEn: 'Bodrum' },
  'kapadokya': { cityId: '17873', lat: 38.6431, lng: 34.8289, nameEn: 'Cappadocia' },
  'fethiye': { cityId: '504757', lat: 36.6514, lng: 29.1257, nameEn: 'Fethiye' },
  'marmaris': { cityId: '6136', lat: 36.8550, lng: 28.2741, nameEn: 'Marmaris' },
  'kusadasi': { cityId: '17881', lat: 37.8579, lng: 27.2610, nameEn: 'Kusadasi' },
  'alanya': { cityId: '17068', lat: 36.5449, lng: 31.9992, nameEn: 'Alanya' },
  'ankara': { cityId: '17069', lat: 39.9334, lng: 32.8597, nameEn: 'Ankara' },
  'bursa': { cityId: '17877', lat: 40.1826, lng: 29.0665, nameEn: 'Bursa' },
  'trabzon': { cityId: '17076', lat: 41.0027, lng: 39.7168, nameEn: 'Trabzon' },
  
  // === AVRUPA ===
  'paris': { cityId: '7606', lat: 48.8566, lng: 2.3522, nameEn: 'Paris' },
  'london': { cityId: '3356', lat: 51.5074, lng: -0.1278, nameEn: 'London' },
  'londra': { cityId: '3356', lat: 51.5074, lng: -0.1278, nameEn: 'London' },
  'roma': { cityId: '6831', lat: 41.9028, lng: 12.4964, nameEn: 'Rome' },
  'barcelona': { cityId: '2268', lat: 41.3851, lng: 2.1734, nameEn: 'Barcelona' },
  'amsterdam': { cityId: '10259', lat: 52.3676, lng: 4.9041, nameEn: 'Amsterdam' },
  'berlin': { cityId: '5765', lat: 52.5200, lng: 13.4050, nameEn: 'Berlin' },
  'prag': { cityId: '8074', lat: 50.0755, lng: 14.4378, nameEn: 'Prague' },
  'viyana': { cityId: '10411', lat: 48.2082, lng: 16.3738, nameEn: 'Vienna' },
  'budapeşte': { cityId: '3379', lat: 47.4979, lng: 19.0402, nameEn: 'Budapest' },
  'budapeste': { cityId: '3379', lat: 47.4979, lng: 19.0402, nameEn: 'Budapest' },
  'lizbon': { cityId: '7815', lat: 38.7223, lng: -9.1393, nameEn: 'Lisbon' },
  'milano': { cityId: '6523', lat: 45.4642, lng: 9.1900, nameEn: 'Milan' },
  'venedik': { cityId: '10197', lat: 45.4408, lng: 12.3155, nameEn: 'Venice' },
  'floransa': { cityId: '2957', lat: 43.7696, lng: 11.2558, nameEn: 'Florence' },
  'atina': { cityId: '2194', lat: 37.9838, lng: 23.7275, nameEn: 'Athens' },
  'brüksel': { cityId: '2525', lat: 50.8503, lng: 4.3517, nameEn: 'Brussels' },
  'münih': { cityId: '6552', lat: 48.1351, lng: 11.5820, nameEn: 'Munich' },
  'dublin': { cityId: '2797', lat: 53.3498, lng: -6.2603, nameEn: 'Dublin' },
  'edinburgh': { cityId: '2844', lat: 55.9533, lng: -3.1883, nameEn: 'Edinburgh' },
  'kopenhag': { cityId: '2636', lat: 55.6761, lng: 12.5683, nameEn: 'Copenhagen' },
  'stockholm': { cityId: '9476', lat: 59.3293, lng: 18.0686, nameEn: 'Stockholm' },
  'oslo': { cityId: '7430', lat: 59.9139, lng: 10.7522, nameEn: 'Oslo' },
  'helsinki': { cityId: '3252', lat: 60.1699, lng: 24.9384, nameEn: 'Helsinki' },
  'varşova': { cityId: '10313', lat: 52.2297, lng: 21.0122, nameEn: 'Warsaw' },
  'varsova': { cityId: '10313', lat: 52.2297, lng: 21.0122, nameEn: 'Warsaw' },
  'madrid': { cityId: '6353', lat: 40.4168, lng: -3.7038, nameEn: 'Madrid' },
  'nice': { cityId: '7019', lat: 43.7102, lng: 7.2620, nameEn: 'Nice' },
  'monaco': { cityId: '6543', lat: 43.7384, lng: 7.4246, nameEn: 'Monaco' },
  'belgrad': { cityId: '2305', lat: 44.7866, lng: 20.4489, nameEn: 'Belgrade' },
  'uskup': { cityId: '9274', lat: 41.9973, lng: 21.4280, nameEn: 'Skopje' },
  'üsküp': { cityId: '9274', lat: 41.9973, lng: 21.4280, nameEn: 'Skopje' },
  'tiran': { cityId: '9889', lat: 41.3275, lng: 19.8187, nameEn: 'Tirana' },
  'saraybosna': { cityId: '9098', lat: 43.8563, lng: 18.4131, nameEn: 'Sarajevo' },
  'podgorica': { cityId: '8009', lat: 42.4304, lng: 19.2594, nameEn: 'Podgorica' },
  'pristine': { cityId: '8079', lat: 42.6629, lng: 21.1655, nameEn: 'Pristina' },
  
  // === ASYA ===
  'tokyo': { cityId: '6046', lat: 35.6762, lng: 139.6503, nameEn: 'Tokyo' },
  'osaka': { cityId: '7564', lat: 34.6937, lng: 135.5023, nameEn: 'Osaka' },
  'kyoto': { cityId: '5350', lat: 35.0116, lng: 135.7681, nameEn: 'Kyoto' },
  'bangkok': { cityId: '2669', lat: 13.7563, lng: 100.5018, nameEn: 'Bangkok' },
  'phuket': { cityId: '8109', lat: 7.8804, lng: 98.3923, nameEn: 'Phuket' },
  'chiang-mai': { cityId: '2588', lat: 18.7883, lng: 98.9853, nameEn: 'Chiang Mai' },
  'singapore': { cityId: '4064', lat: 1.3521, lng: 103.8198, nameEn: 'Singapore' },
  'singapur': { cityId: '4064', lat: 1.3521, lng: 103.8198, nameEn: 'Singapore' },
  'kuala-lumpur': { cityId: '5379', lat: 3.1390, lng: 101.6869, nameEn: 'Kuala Lumpur' },
  'bali': { cityId: '17193', lat: -8.4095, lng: 115.1889, nameEn: 'Bali' },
  'jakarta': { cityId: '4805', lat: -6.2088, lng: 106.8456, nameEn: 'Jakarta' },
  'hong-kong': { cityId: '3310', lat: 22.3193, lng: 114.1694, nameEn: 'Hong Kong' },
  'seul': { cityId: '9035', lat: 37.5665, lng: 126.9780, nameEn: 'Seoul' },
  'seoul': { cityId: '9035', lat: 37.5665, lng: 126.9780, nameEn: 'Seoul' },
  'taipei': { cityId: '9615', lat: 25.0330, lng: 121.5654, nameEn: 'Taipei' },
  'shanghai': { cityId: '9196', lat: 31.2304, lng: 121.4737, nameEn: 'Shanghai' },
  'pekin': { cityId: '2298', lat: 39.9042, lng: 116.4074, nameEn: 'Beijing' },
  'delhi': { cityId: '17194', lat: 28.6139, lng: 77.2090, nameEn: 'Delhi' },
  'mumbai': { cityId: '6564', lat: 19.0760, lng: 72.8777, nameEn: 'Mumbai' },
  'goa': { cityId: '3069', lat: 15.2993, lng: 74.1240, nameEn: 'Goa' },
  'hanoi': { cityId: '3197', lat: 21.0285, lng: 105.8542, nameEn: 'Hanoi' },
  'ho-chi-minh': { cityId: '3304', lat: 10.8231, lng: 106.6297, nameEn: 'Ho Chi Minh City' },
  'siem-reap': { cityId: '9244', lat: 13.3633, lng: 103.8564, nameEn: 'Siem Reap' },
  'manila': { cityId: '6405', lat: 14.5995, lng: 120.9842, nameEn: 'Manila' },
  'boracay': { cityId: '2445', lat: 11.9674, lng: 121.9248, nameEn: 'Boracay' },
  'cebu': { cityId: '2581', lat: 10.3157, lng: 123.8854, nameEn: 'Cebu' },
  'katmandu': { cityId: '5298', lat: 27.7172, lng: 85.3240, nameEn: 'Kathmandu' },
  'colombo': { cityId: '2629', lat: 6.9271, lng: 79.8612, nameEn: 'Colombo' },
  'maldivler': { cityId: '6380', lat: 3.2028, lng: 73.2207, nameEn: 'Maldives' },
  
  // === ORTA DOĞU ===
  'dubai': { cityId: '6621', lat: 25.2048, lng: 55.2708, nameEn: 'Dubai' },
  'abu-dabi': { cityId: '1775', lat: 24.4539, lng: 54.3773, nameEn: 'Abu Dhabi' },
  'doha': { cityId: '2768', lat: 25.2854, lng: 51.5310, nameEn: 'Doha' },
  'tel-aviv': { cityId: '9785', lat: 32.0853, lng: 34.7818, nameEn: 'Tel Aviv' },
  'kudus': { cityId: '4984', lat: 31.7683, lng: 35.2137, nameEn: 'Jerusalem' },
  'amman': { cityId: '1963', lat: 31.9454, lng: 35.9284, nameEn: 'Amman' },
  'muskat': { cityId: '6604', lat: 23.5880, lng: 58.3829, nameEn: 'Muscat' },
  
  // === AFRİKA ===
  'marakes': { cityId: '6416', lat: 31.6295, lng: -7.9811, nameEn: 'Marrakech' },
  'marrakech': { cityId: '6416', lat: 31.6295, lng: -7.9811, nameEn: 'Marrakech' },
  'kazablanka': { cityId: '2571', lat: 33.5731, lng: -7.5898, nameEn: 'Casablanca' },
  'kahire': { cityId: '2555', lat: 30.0444, lng: 31.2357, nameEn: 'Cairo' },
  'cape-town': { cityId: '2564', lat: -33.9249, lng: 18.4241, nameEn: 'Cape Town' },
  'johannesburg': { cityId: '4881', lat: -26.2041, lng: 28.0473, nameEn: 'Johannesburg' },
  'zanzibar': { cityId: '10466', lat: -6.1659, lng: 39.2026, nameEn: 'Zanzibar' },
  'nairobi': { cityId: '6646', lat: -1.2921, lng: 36.8219, nameEn: 'Nairobi' },
  
  // === KAFKASLAR & ORTA ASYA ===
  'tiflis': { cityId: '9708', lat: 41.7151, lng: 44.8271, nameEn: 'Tbilisi' },
  'baku': { cityId: '2247', lat: 40.4093, lng: 49.8671, nameEn: 'Baku' },
  'erivan': { cityId: '10470', lat: 40.1792, lng: 44.4991, nameEn: 'Yerevan' },
  'almati': { cityId: '1930', lat: 43.2220, lng: 76.8512, nameEn: 'Almaty' },
  'taskent': { cityId: '9675', lat: 41.2995, lng: 69.2401, nameEn: 'Tashkent' },
  'biskek': { cityId: '2380', lat: 42.8746, lng: 74.5698, nameEn: 'Bishkek' },
  'semerkand': { cityId: '9076', lat: 39.6270, lng: 66.9750, nameEn: 'Samarkand' },
  
  // === AMERİKA ===
  'new-york': { cityId: '6898', lat: 40.7128, lng: -74.0060, nameEn: 'New York' },
  'newyork': { cityId: '6898', lat: 40.7128, lng: -74.0060, nameEn: 'New York' },
  'los-angeles': { cityId: '6003', lat: 34.0522, lng: -118.2437, nameEn: 'Los Angeles' },
  'miami': { cityId: '6485', lat: 25.7617, lng: -80.1918, nameEn: 'Miami' },
  'las-vegas': { cityId: '5583', lat: 36.1699, lng: -115.1398, nameEn: 'Las Vegas' },
  'san-francisco': { cityId: '9101', lat: 37.7749, lng: -122.4194, nameEn: 'San Francisco' },
  'chicago': { cityId: '2593', lat: 41.8781, lng: -87.6298, nameEn: 'Chicago' },
  'toronto': { cityId: '9935', lat: 43.6532, lng: -79.3832, nameEn: 'Toronto' },
  'vancouver': { cityId: '10169', lat: 49.2827, lng: -123.1207, nameEn: 'Vancouver' },
  'cancun': { cityId: '2561', lat: 21.1619, lng: -86.8515, nameEn: 'Cancun' },
  'rio-de-janeiro': { cityId: '8431', lat: -22.9068, lng: -43.1729, nameEn: 'Rio de Janeiro' },
  'rio': { cityId: '8431', lat: -22.9068, lng: -43.1729, nameEn: 'Rio de Janeiro' },
  'buenos-aires': { cityId: '2531', lat: -34.6037, lng: -58.3816, nameEn: 'Buenos Aires' },
  
  // === OKYANUSYA ===
  'sydney': { cityId: '9559', lat: -33.8688, lng: 151.2093, nameEn: 'Sydney' },
  'melbourne': { cityId: '6474', lat: -37.8136, lng: 144.9631, nameEn: 'Melbourne' },
  'auckland': { cityId: '2205', lat: -36.8509, lng: 174.7645, nameEn: 'Auckland' },
  'fiji': { cityId: '2933', lat: -17.7134, lng: 177.9999, nameEn: 'Fiji' },
};

// Generate Agoda affiliate URL with proper destination targeting
export function getAgodaUrl(
  citySlug: string, 
  cityName: string, 
  checkIn?: string, 
  checkOut?: string, 
  options?: { 
    stars?: number; 
    priceSort?: 'asc' | 'desc';
    adults?: number;
    rooms?: number;
  }
): string {
  const baseUrl = 'https://www.agoda.com/search';
  const mapping = cityAgodaMapping[citySlug.toLowerCase()];
  
  const params = new URLSearchParams({
    rooms: (options?.rooms || 1).toString(),
    adults: (options?.adults || 2).toString(),
    cid: AGODA_CID,
    searchType: 'city',
    selectedproperty: '0',
  });
  
  // Always use cityId when available for accurate results
  if (mapping?.cityId) {
    params.set('city', mapping.cityId);
  } else {
    // Fallback to destination name search
    params.set('destination', cityName);
  }
  
  // Add dates if provided
  if (checkIn) params.set('checkIn', checkIn);
  if (checkOut) params.set('checkOut', checkOut);
  
  // Add coordinates for better matching
  if (mapping?.lat && mapping?.lng) {
    params.set('latitude', mapping.lat.toString());
    params.set('longitude', mapping.lng.toString());
  }
  
  // Add star filter (only for 3-5 stars)
  if (options?.stars && options.stars >= 3) {
    params.set('star', options.stars.toString());
  }
  
  // For budget hotels, sort by price ascending
  if (options?.priceSort === 'asc') {
    params.set('sort', 'price');
  }
  
  return `${baseUrl}?${params.toString()}`;
}

// Get English name for a city
export function getCityEnglishName(citySlug: string): string | null {
  const mapping = cityAgodaMapping[citySlug.toLowerCase()];
  return mapping?.nameEn || null;
}
