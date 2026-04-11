// Centralized Agoda City Mapping for affiliate links
// This ensures all hotel links redirect to correct destination search results

export const AGODA_CID = "1844104";

export interface AgodaCityInfo {
  cityId: string;
  lat: number;
  lng: number;
  nameEn: string;
  /** Agoda city page slug e.g. "antalya-tr", "paris-fr" — used in agoda.com/city/SLUG.html */
  agodaSlug?: string;
}

// Comprehensive city mapping for Agoda deep linking
// cityId is Agoda's internal city identifier for accurate search results
export const cityAgodaMapping: Record<string, AgodaCityInfo> = {
  // === TÜRKİYE ===
  'istanbul': { cityId: '18482', agodaSlug: 'istanbul-tr', lat: 41.0082, lng: 28.9784, nameEn: 'Istanbul' },
  'antalya': { cityId: '17067', agodaSlug: 'antalya-tr', lat: 36.8969, lng: 30.7133, nameEn: 'Antalya' },
  'izmir': { cityId: '6140', agodaSlug: 'izmir-tr', lat: 38.4192, lng: 27.1287, nameEn: 'Izmir' },
  'bodrum': { cityId: '14605', agodaSlug: 'bodrum-tr', lat: 37.0343, lng: 27.4305, nameEn: 'Bodrum' },
  'kapadokya': { cityId: '17873', agodaSlug: 'cappadocia-tr', lat: 38.6431, lng: 34.8289, nameEn: 'Cappadocia' },
  'fethiye': { cityId: '504757', lat: 36.6514, lng: 29.1257, nameEn: 'Fethiye' },
  'marmaris': { cityId: '6136', lat: 36.8550, lng: 28.2741, nameEn: 'Marmaris' },
  'kusadasi': { cityId: '17881', lat: 37.8579, lng: 27.2610, nameEn: 'Kusadasi' },
  'alanya': { cityId: '17068', lat: 36.5449, lng: 31.9992, nameEn: 'Alanya' },
  'ankara': { cityId: '17069', lat: 39.9334, lng: 32.8597, nameEn: 'Ankara' },
  'bursa': { cityId: '17877', lat: 40.1826, lng: 29.0665, nameEn: 'Bursa' },
  'trabzon': { cityId: '17076', lat: 41.0027, lng: 39.7168, nameEn: 'Trabzon' },
  
  // === AVRUPA ===
  'paris': { cityId: '7606', agodaSlug: 'paris-fr', lat: 48.8566, lng: 2.3522, nameEn: 'Paris' },
  'london': { cityId: '3356', lat: 51.5074, lng: -0.1278, nameEn: 'London' },
  'londra': { cityId: '3356', agodaSlug: 'london-gb', lat: 51.5074, lng: -0.1278, nameEn: 'London' },
  'roma': { cityId: '6831', agodaSlug: 'rome-it', lat: 41.9028, lng: 12.4964, nameEn: 'Rome' },
  'barcelona': { cityId: '2268', agodaSlug: 'barcelona-es', lat: 41.3851, lng: 2.1734, nameEn: 'Barcelona' },
  'amsterdam': { cityId: '10259', agodaSlug: 'amsterdam-nl', lat: 52.3676, lng: 4.9041, nameEn: 'Amsterdam' },
  'berlin': { cityId: '5765', agodaSlug: 'berlin-de', lat: 52.5200, lng: 13.4050, nameEn: 'Berlin' },
  'prag': { cityId: '8074', agodaSlug: 'prague-cz', lat: 50.0755, lng: 14.4378, nameEn: 'Prague' },
  'viyana': { cityId: '10411', agodaSlug: 'vienna-at', lat: 48.2082, lng: 16.3738, nameEn: 'Vienna' },
  'budapeşte': { cityId: '3379', lat: 47.4979, lng: 19.0402, nameEn: 'Budapest' },
  'budapeste': { cityId: '3379', lat: 47.4979, lng: 19.0402, nameEn: 'Budapest' },
  'lizbon': { cityId: '7815', agodaSlug: 'lisbon-pt', lat: 38.7223, lng: -9.1393, nameEn: 'Lisbon' },
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
  'madrid': { cityId: '6353', agodaSlug: 'madrid-es', lat: 40.4168, lng: -3.7038, nameEn: 'Madrid' },
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
  'tokyo': { cityId: '6046', agodaSlug: 'tokyo-jp', lat: 35.6762, lng: 139.6503, nameEn: 'Tokyo' },
  'osaka': { cityId: '7564', lat: 34.6937, lng: 135.5023, nameEn: 'Osaka' },
  'kyoto': { cityId: '5350', lat: 35.0116, lng: 135.7681, nameEn: 'Kyoto' },
  'bangkok': { cityId: '2669', agodaSlug: 'bangkok-th', lat: 13.7563, lng: 100.5018, nameEn: 'Bangkok' },
  'phuket': { cityId: '8109', lat: 7.8804, lng: 98.3923, nameEn: 'Phuket' },
  'chiang-mai': { cityId: '2588', lat: 18.7883, lng: 98.9853, nameEn: 'Chiang Mai' },
  'singapore': { cityId: '4064', lat: 1.3521, lng: 103.8198, nameEn: 'Singapore' },
  'singapur': { cityId: '4064', agodaSlug: 'singapore-sg', lat: 1.3521, lng: 103.8198, nameEn: 'Singapore' },
  'kuala-lumpur': { cityId: '5379', lat: 3.1390, lng: 101.6869, nameEn: 'Kuala Lumpur' },
  'bali': { cityId: '17193', agodaSlug: 'bali-id', lat: -8.4095, lng: 115.1889, nameEn: 'Bali' },
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
  'dubai': { cityId: '6621', agodaSlug: 'dubai-ae', lat: 25.2048, lng: 55.2708, nameEn: 'Dubai' },
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
  
  // === EK TÜRKİYE ===
  'dalaman': { cityId: '504856', lat: 36.7110, lng: 28.7925, nameEn: 'Dalaman' },
  'gaziantep': { cityId: '17880', lat: 37.0662, lng: 37.3833, nameEn: 'Gaziantep' },
  'konya': { cityId: '17879', lat: 37.8714, lng: 32.4847, nameEn: 'Konya' },
  'adana': { cityId: '17071', lat: 36.9914, lng: 35.3308, nameEn: 'Adana' },
  'kayseri': { cityId: '5286', lat: 38.7312, lng: 35.4787, nameEn: 'Kayseri' },
  'nevsehir': { cityId: '17873', lat: 38.6431, lng: 34.7129, nameEn: 'Nevsehir' },
  'mugla': { cityId: '6551', lat: 37.2153, lng: 28.3636, nameEn: 'Mugla' },
  'cesme': { cityId: '2585', lat: 38.3235, lng: 26.3035, nameEn: 'Cesme' },
  'alacati': { cityId: '15652', lat: 38.2763, lng: 26.3772, nameEn: 'Alacati' },
  'pamukkale': { cityId: '7604', lat: 37.9137, lng: 29.1187, nameEn: 'Pamukkale' },
  'urgup': { cityId: '10138', lat: 38.6310, lng: 34.9115, nameEn: 'Urgup' },
  'goreme': { cityId: '3077', lat: 38.6431, lng: 34.8289, nameEn: 'Goreme' },
  
  // === EK AVRUPA ===
  'malaga': { cityId: '6386', lat: 36.7213, lng: -4.4216, nameEn: 'Malaga' },
  'valencia': { cityId: '10165', lat: 39.4699, lng: -0.3763, nameEn: 'Valencia' },
  'sevilla': { cityId: '9152', lat: 37.3891, lng: -5.9845, nameEn: 'Seville' },
  'napoli': { cityId: '6664', lat: 40.8518, lng: 14.2681, nameEn: 'Naples' },
  'lyon': { cityId: '5990', lat: 45.7640, lng: 4.8357, nameEn: 'Lyon' },
  'bruksel': { cityId: '2525', lat: 50.8503, lng: 4.3517, nameEn: 'Brussels' },
  'zurich': { cityId: '10497', lat: 47.3769, lng: 8.5417, nameEn: 'Zurich' },
  'cenevre': { cityId: '3036', lat: 46.2044, lng: 6.1432, nameEn: 'Geneva' },
  'krakow': { cityId: '5346', lat: 50.0647, lng: 19.9450, nameEn: 'Krakow' },
  'selanik': { cityId: '9836', lat: 40.6401, lng: 22.9444, nameEn: 'Thessaloniki' },
  'sofya': { cityId: '9324', lat: 42.6977, lng: 23.3219, nameEn: 'Sofia' },
  'bukres': { cityId: '2521', lat: 44.4268, lng: 26.1025, nameEn: 'Bucharest' },
  'riga': { cityId: '8423', lat: 56.9496, lng: 24.1052, nameEn: 'Riga' },
  'tallinn': { cityId: '9655', lat: 59.4370, lng: 24.7536, nameEn: 'Tallinn' },
  'vilnius': { cityId: '10262', lat: 54.6872, lng: 25.2797, nameEn: 'Vilnius' },
  // NEW: Additional Europe
  'porto': { cityId: '7969', lat: 41.1579, lng: -8.6291, nameEn: 'Porto' },
  'bologna': { cityId: '2428', lat: 44.4949, lng: 11.3426, nameEn: 'Bologna' },
  'pisa': { cityId: '7941', lat: 43.7228, lng: 10.4017, nameEn: 'Pisa' },
  'verona': { cityId: '10207', lat: 45.4384, lng: 10.9916, nameEn: 'Verona' },
  'genova': { cityId: '3038', lat: 44.4056, lng: 8.9463, nameEn: 'Genoa' },
  'hamburg': { cityId: '3189', lat: 53.5511, lng: 9.9937, nameEn: 'Hamburg' },
  'dusseldorf': { cityId: '2832', lat: 51.2277, lng: 6.7735, nameEn: 'Dusseldorf' },
  'koln': { cityId: '2615', lat: 50.9375, lng: 6.9603, nameEn: 'Cologne' },
  'frankfurt': { cityId: '2973', lat: 50.1109, lng: 8.6821, nameEn: 'Frankfurt' },
  'stuttgart': { cityId: '9519', lat: 48.7758, lng: 9.1829, nameEn: 'Stuttgart' },
  'salzburg': { cityId: '9035', lat: 47.8095, lng: 13.0550, nameEn: 'Salzburg' },
  'innsbruck': { cityId: '4562', lat: 47.2692, lng: 11.4041, nameEn: 'Innsbruck' },
  'basel': { cityId: '2280', lat: 47.5596, lng: 7.5886, nameEn: 'Basel' },
  'manchester': { cityId: '6404', lat: 53.4808, lng: -2.2426, nameEn: 'Manchester' },
  'liverpool': { cityId: '5931', lat: 53.4084, lng: -2.9916, nameEn: 'Liverpool' },
  'glasgow': { cityId: '3061', lat: 55.8642, lng: -4.2518, nameEn: 'Glasgow' },
  'bilbao': { cityId: '2363', lat: 43.2630, lng: -2.9350, nameEn: 'Bilbao' },
  'san-sebastian': { cityId: '9103', lat: 43.3183, lng: -1.9812, nameEn: 'San Sebastian' },
  'split': { cityId: '9405', lat: 43.5081, lng: 16.4402, nameEn: 'Split' },
  'dubrovnik': { cityId: '2787', lat: 42.6507, lng: 18.0944, nameEn: 'Dubrovnik' },
  'zagreb': { cityId: '10487', lat: 45.8150, lng: 15.9819, nameEn: 'Zagreb' },
  'ljubljana': { cityId: '5961', lat: 46.0569, lng: 14.5058, nameEn: 'Ljubljana' },
  'bratislava': { cityId: '2478', lat: 48.1486, lng: 17.1077, nameEn: 'Bratislava' },
  'gdansk': { cityId: '3025', lat: 54.3520, lng: 18.6466, nameEn: 'Gdansk' },
  'wroclaw': { cityId: '10425', lat: 51.1079, lng: 17.0385, nameEn: 'Wroclaw' },
  'poznan': { cityId: '8015', lat: 52.4064, lng: 16.9252, nameEn: 'Poznan' },
  'cluj-napoca': { cityId: '2606', lat: 46.7712, lng: 23.6236, nameEn: 'Cluj-Napoca' },
  'timisoara': { cityId: '9897', lat: 45.7489, lng: 21.2087, nameEn: 'Timisoara' },
  'varna': { cityId: '10195', lat: 43.2141, lng: 27.9147, nameEn: 'Varna' },
  'constanta': { cityId: '2641', lat: 44.1598, lng: 28.6348, nameEn: 'Constanta' },
  'plovdiv': { cityId: '7969', lat: 42.1354, lng: 24.7453, nameEn: 'Plovdiv' },
  'kiev': { cityId: '5324', lat: 50.4501, lng: 30.5234, nameEn: 'Kyiv' },
  'lviv': { cityId: '6039', lat: 49.8397, lng: 24.0297, nameEn: 'Lviv' },
  'odessa': { cityId: '7247', lat: 46.4825, lng: 30.7233, nameEn: 'Odessa' },
  'reykjavik': { cityId: '8349', lat: 64.1466, lng: -21.9426, nameEn: 'Reykjavik' },
  
  // === EK ASYA ===
  'chiangmai': { cityId: '2588', lat: 18.7883, lng: 98.9853, nameEn: 'Chiang Mai' },
  'kualalumpur': { cityId: '5379', lat: 3.1390, lng: 101.6869, nameEn: 'Kuala Lumpur' },
  'hongkong': { cityId: '3310', lat: 22.3193, lng: 114.1694, nameEn: 'Hong Kong' },
  'hochiminh': { cityId: '3304', lat: 10.8231, lng: 106.6297, nameEn: 'Ho Chi Minh City' },
  // NEW: Additional Asia
  'da-nang': { cityId: '2658', lat: 16.0544, lng: 108.2022, nameEn: 'Da Nang' },
  'danang': { cityId: '2658', lat: 16.0544, lng: 108.2022, nameEn: 'Da Nang' },
  'hoi-an': { cityId: '3310', lat: 15.8801, lng: 108.3380, nameEn: 'Hoi An' },
  'nha-trang': { cityId: '6903', lat: 12.2388, lng: 109.1967, nameEn: 'Nha Trang' },
  'phu-quoc': { cityId: '8093', lat: 10.2290, lng: 103.9650, nameEn: 'Phu Quoc' },
  'phnom-penh': { cityId: '7924', lat: 11.5449, lng: 104.8922, nameEn: 'Phnom Penh' },
  'langkawi': { cityId: '5545', lat: 6.3500, lng: 99.8000, nameEn: 'Langkawi' },
  'penang': { cityId: '7877', lat: 5.4164, lng: 100.3327, nameEn: 'Penang' },
  'krabi': { cityId: '5344', lat: 8.0863, lng: 98.9063, nameEn: 'Krabi' },
  'koh-samui': { cityId: '5335', lat: 9.5120, lng: 100.0136, nameEn: 'Koh Samui' },
  'kohsamui': { cityId: '5335', lat: 9.5120, lng: 100.0136, nameEn: 'Koh Samui' },
  'pattaya': { cityId: '7860', lat: 12.9236, lng: 100.8825, nameEn: 'Pattaya' },
  'busan': { cityId: '2545', lat: 35.1796, lng: 129.0756, nameEn: 'Busan' },
  'jeju': { cityId: '4911', lat: 33.4996, lng: 126.5312, nameEn: 'Jeju' },
  'nagoya': { cityId: '6637', lat: 35.1815, lng: 136.9066, nameEn: 'Nagoya' },
  'fukuoka': { cityId: '3001', lat: 33.5904, lng: 130.4017, nameEn: 'Fukuoka' },
  'sapporo': { cityId: '9091', lat: 43.0618, lng: 141.3545, nameEn: 'Sapporo' },
  'okinawa': { cityId: '7249', lat: 26.5013, lng: 127.9454, nameEn: 'Okinawa' },
  'nara': { cityId: '6667', lat: 34.6851, lng: 135.8048, nameEn: 'Nara' },
  'hiroshima': { cityId: '3282', lat: 34.3853, lng: 132.4553, nameEn: 'Hiroshima' },
  'bangalore': { cityId: '2269', lat: 12.9716, lng: 77.5946, nameEn: 'Bangalore' },
  'jaipur': { cityId: '4801', lat: 26.9124, lng: 75.7873, nameEn: 'Jaipur' },
  'agra': { cityId: '1808', lat: 27.1767, lng: 78.0081, nameEn: 'Agra' },
  'varanasi': { cityId: '10180', lat: 25.3176, lng: 82.9739, nameEn: 'Varanasi' },
  'udaipur': { cityId: '10031', lat: 24.5854, lng: 73.7125, nameEn: 'Udaipur' },
  'makao': { cityId: '6308', lat: 22.1987, lng: 113.5439, nameEn: 'Macau' },
  'macau': { cityId: '6308', lat: 22.1987, lng: 113.5439, nameEn: 'Macau' },
  
  // === EK ORTA DOĞU ===
  'abudabi': { cityId: '1775', lat: 24.4539, lng: 54.3773, nameEn: 'Abu Dhabi' },
  'riyad': { cityId: '8458', lat: 24.7136, lng: 46.6753, nameEn: 'Riyadh' },
  'cidde': { cityId: '4892', lat: 21.4858, lng: 39.1925, nameEn: 'Jeddah' },
  'beyrut': { cityId: '2302', lat: 33.8938, lng: 35.5018, nameEn: 'Beirut' },
  'sarm-el-seyh': { cityId: '9210', lat: 27.9158, lng: 34.3300, nameEn: 'Sharm El Sheikh' },
  'hurghada': { cityId: '3389', lat: 27.2579, lng: 33.8116, nameEn: 'Hurghada' },
  'luxor': { cityId: '6044', lat: 25.6872, lng: 32.6396, nameEn: 'Luxor' },
  'aswan': { cityId: '2160', lat: 24.0889, lng: 32.8998, nameEn: 'Aswan' },
  
  // === EK AFRİKA ===
  'capetown': { cityId: '2564', lat: -33.9249, lng: 18.4241, nameEn: 'Cape Town' },
  'mauritius': { cityId: '6460', lat: -20.3484, lng: 57.5522, nameEn: 'Mauritius' },
  'seyseller': { cityId: '9141', lat: -4.6796, lng: 55.4920, nameEn: 'Seychelles' },
  'mahe': { cityId: '9141', lat: -4.6796, lng: 55.4920, nameEn: 'Mahe' },
  'addis-ababa': { cityId: '1796', lat: 9.0320, lng: 38.7469, nameEn: 'Addis Ababa' },
  'dakar': { cityId: '2652', lat: 14.7167, lng: -17.4677, nameEn: 'Dakar' },
  'lagos': { cityId: '5505', lat: 6.5244, lng: 3.3792, nameEn: 'Lagos' },
  'accra': { cityId: '1765', lat: 5.6037, lng: -0.1870, nameEn: 'Accra' },
  'tunus': { cityId: '9998', lat: 36.8065, lng: 10.1815, nameEn: 'Tunis' },
  'djerba': { cityId: '2731', lat: 33.8750, lng: 10.8575, nameEn: 'Djerba' },
  'fes': { cityId: '2927', lat: 34.0181, lng: -5.0078, nameEn: 'Fes' },
  'tangier': { cityId: '9662', lat: 35.7595, lng: -5.8340, nameEn: 'Tangier' },
  'agadir': { cityId: '1803', lat: 30.4278, lng: -9.5981, nameEn: 'Agadir' },
  'essaouira': { cityId: '2890', lat: 31.5085, lng: -9.7595, nameEn: 'Essaouira' },
  
  // === EK AMERİKA ===
  'losangeles': { cityId: '6003', lat: 34.0522, lng: -118.2437, nameEn: 'Los Angeles' },
  'lasvegas': { cityId: '5583', lat: 36.1699, lng: -115.1398, nameEn: 'Las Vegas' },
  'sanfrancisco': { cityId: '9101', lat: 37.7749, lng: -122.4194, nameEn: 'San Francisco' },
  'buenosaires': { cityId: '2531', lat: -34.6037, lng: -58.3816, nameEn: 'Buenos Aires' },
  // NEW: Additional Americas
  'boston': { cityId: '2454', lat: 42.3601, lng: -71.0589, nameEn: 'Boston' },
  'washington-dc': { cityId: '10360', lat: 38.9072, lng: -77.0369, nameEn: 'Washington DC' },
  'washington': { cityId: '10360', lat: 38.9072, lng: -77.0369, nameEn: 'Washington DC' },
  'seattle': { cityId: '9135', lat: 47.6062, lng: -122.3321, nameEn: 'Seattle' },
  'denver': { cityId: '2709', lat: 39.7392, lng: -104.9903, nameEn: 'Denver' },
  'san-diego': { cityId: '9097', lat: 32.7157, lng: -117.1611, nameEn: 'San Diego' },
  'sandiego': { cityId: '9097', lat: 32.7157, lng: -117.1611, nameEn: 'San Diego' },
  'atlanta': { cityId: '2172', lat: 33.7490, lng: -84.3880, nameEn: 'Atlanta' },
  'dallas': { cityId: '2661', lat: 32.7767, lng: -96.7970, nameEn: 'Dallas' },
  'houston': { cityId: '3369', lat: 29.7604, lng: -95.3698, nameEn: 'Houston' },
  'phoenix': { cityId: '7917', lat: 33.4484, lng: -112.0740, nameEn: 'Phoenix' },
  'new-orleans': { cityId: '6807', lat: 29.9511, lng: -90.0715, nameEn: 'New Orleans' },
  'neworleans': { cityId: '6807', lat: 29.9511, lng: -90.0715, nameEn: 'New Orleans' },
  'orlando': { cityId: '7415', lat: 28.5383, lng: -81.3792, nameEn: 'Orlando' },
  'montreal': { cityId: '6550', lat: 45.5017, lng: -73.5673, nameEn: 'Montreal' },
  'quebec-city': { cityId: '8236', lat: 46.8139, lng: -71.2080, nameEn: 'Quebec City' },
  'mexico-city': { cityId: '6476', lat: 19.4326, lng: -99.1332, nameEn: 'Mexico City' },
  'playa-del-carmen': { cityId: '7958', lat: 20.6296, lng: -87.0739, nameEn: 'Playa del Carmen' },
  'sao-paulo': { cityId: '9128', lat: -23.5505, lng: -46.6333, nameEn: 'Sao Paulo' },
  'saopaulo': { cityId: '9128', lat: -23.5505, lng: -46.6333, nameEn: 'Sao Paulo' },
  'lima': { cityId: '5880', lat: -12.0464, lng: -77.0428, nameEn: 'Lima' },
  'bogota': { cityId: '2418', lat: 4.7110, lng: -74.0721, nameEn: 'Bogota' },
  'cartagena': { cityId: '2571', lat: 10.3910, lng: -75.4794, nameEn: 'Cartagena' },
  'medellin': { cityId: '6459', lat: 6.2476, lng: -75.5658, nameEn: 'Medellin' },
  'cusco': { cityId: '2651', lat: -13.5320, lng: -71.9675, nameEn: 'Cusco' },
  'santiago': { cityId: '9121', lat: -33.4489, lng: -70.6693, nameEn: 'Santiago' },
  'montevideo': { cityId: '6557', lat: -34.9011, lng: -56.1645, nameEn: 'Montevideo' },
  'havana': { cityId: '3221', lat: 23.1136, lng: -82.3666, nameEn: 'Havana' },
  'punta-cana': { cityId: '8232', lat: 18.5601, lng: -68.3725, nameEn: 'Punta Cana' },
  
  // === OKYANUSYA ===
  'brisbane': { cityId: '2491', lat: -27.4698, lng: 153.0251, nameEn: 'Brisbane' },
  'perth': { cityId: '7911', lat: -31.9505, lng: 115.8605, nameEn: 'Perth' },
  'gold-coast': { cityId: '3072', lat: -28.0167, lng: 153.4000, nameEn: 'Gold Coast' },
  'queenstown': { cityId: '8250', lat: -45.0312, lng: 168.6626, nameEn: 'Queenstown' },
  'wellington': { cityId: '10395', lat: -41.2866, lng: 174.7756, nameEn: 'Wellington' },
  'tahiti': { cityId: '9614', lat: -17.6509, lng: -149.4260, nameEn: 'Tahiti' },
  'bora-bora': { cityId: '2447', lat: -16.5004, lng: -151.7415, nameEn: 'Bora Bora' },
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
  const mapping = cityAgodaMapping[citySlug.toLowerCase()];
  
  const params = new URLSearchParams({
    cid: AGODA_CID,
  });
  
  // Add dates
  if (checkIn && checkOut) {
    params.set('checkIn', checkIn);
    params.set('checkOut', checkOut);
  } else if (checkIn) {
    params.set('checkIn', checkIn);
  }
  
  // Add rooms and guests
  params.set('rooms', (options?.rooms || 1).toString());
  params.set('adults', (options?.adults || 2).toString());
  
  // Star rating filter
  if (options?.stars && options.stars >= 2 && options.stars <= 5) {
    params.set('star', options.stars.toString());
  }
  
  // Price sort
  if (options?.priceSort === 'asc') {
    params.set('sort', 'priceLowToHigh');
  }
  
  // Priority 1: Use Agoda city page URL (most reliable)
  if (mapping?.agodaSlug) {
    return `https://www.agoda.com/city/${mapping.agodaSlug}.html?${params.toString()}`;
  }
  
  // Priority 2: Use textToSearch with city name (works for all cities)
  params.set('textToSearch', mapping?.nameEn || cityName);
  return `https://www.agoda.com/search?${params.toString()}`;
}

// Open Agoda URL — simple window.open, no hacks
export function openAgodaUrl(
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
): void {
  const url = getAgodaUrl(citySlug, cityName, checkIn, checkOut, options);
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Get English name for a city
export function getCityEnglishName(citySlug: string): string | null {
  const mapping = cityAgodaMapping[citySlug.toLowerCase()];
  return mapping?.nameEn || null;
}
