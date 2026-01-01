import { destinationData, getCountryFlag } from './destinations';

export interface FlightRoute {
  slug: string;
  originCode: string;
  destinationCode: string;
  originCity: string;
  destinationCity: string;
  originCountry: string;
  destinationCountry: string;
  originFlag: string;
  destinationFlag: string;
  estimatedDuration: string;
  distance: string;
  description: string;
  tips: string[];
}

// Create URL-friendly slug
function createRouteSlug(originCity: string, destinationCity: string): string {
  const cleanOrigin = originCity
    .toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const cleanDest = destinationCity
    .toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `${cleanOrigin}-${cleanDest}`;
}

// Estimated flight durations between major cities (in minutes)
const FLIGHT_DURATIONS: Record<string, Record<string, number>> = {
  'IST': {
    'CDG': 210, 'LHR': 240, 'FCO': 135, 'BCN': 195, 'AMS': 195, 'BER': 150, 'MUC': 140,
    'FRA': 165, 'VIE': 120, 'PRG': 130, 'BUD': 100, 'ATH': 80, 'MAD': 255, 'LIS': 270,
    'DXB': 240, 'DOH': 210, 'TBS': 105, 'GYD': 150, 'BEG': 90, 'SKP': 75, 'TIR': 90,
    'SJJ': 100, 'TGD': 95, 'PRN': 80, 'MXP': 155, 'VCE': 130, 'NAP': 120, 'ZRH': 165,
    'GVA': 180, 'BRU': 195, 'CPH': 180, 'ARN': 195, 'OSL': 210, 'HEL': 180, 'DUB': 270,
    'WAW': 135, 'OTP': 75, 'SOF': 60, 'RIX': 165, 'VNO': 150, 'TLL': 180,
    'JFK': 600, 'LAX': 780, 'ORD': 660, 'MIA': 690, 'SFO': 750, 'YYZ': 600, 'YVR': 720,
    'SIN': 630, 'BKK': 540, 'KUL': 600, 'HKG': 600, 'NRT': 720, 'ICN': 600,
    'DEL': 360, 'BOM': 390, 'PEK': 540, 'PVG': 600, 'SYD': 1080, 'MEL': 1020,
    // Middle East
    'AMM': 105, 'BEY': 90, 'AUH': 270, 'BAH': 210, 'MCT': 270, 'KWI': 180,
    // Africa
    'TUN': 165, 'CMN': 300, 'RAK': 285, 'CPT': 660, 'JNB': 600, 'NBO': 360, 'DAR': 420, 'ZNZ': 420,
    // Americas visa-free
    'GRU': 720, 'GIG': 720, 'EZE': 780, 'SCL': 840, 'BOG': 780, 'LIM': 840,
    // Central Asia
    'ALA': 270, 'NQZ': 240, 'TAS': 240, 'FRU': 270,
    // Other
    'ECN': 75, 'PMI': 210, 'AGP': 240, 'OPO': 255, 'SKG': 55,
    // Asia destinations
    'CGK': 660, 'DPS': 690, 'MNL': 660, 'TPE': 600, 'KTM': 420,
  },
  'SAW': {
    'CDG': 210, 'LHR': 240, 'FCO': 135, 'BCN': 195, 'AMS': 195, 'BER': 150, 'ATH': 80,
    'AMM': 105, 'DXB': 240, 'TBS': 105, 'GYD': 150,
  },
  'ESB': {
    'IST': 60, 'CDG': 240, 'FRA': 195, 'MUC': 170, 'VIE': 150, 'ATH': 100,
    'AMM': 120, 'DXB': 270, 'TBS': 90,
  },
  'ADB': {
    'IST': 60, 'CDG': 225, 'ATH': 60, 'FCO': 120, 'AMS': 210,
    'AMM': 120, 'DXB': 270,
  },
  'AYT': {
    'IST': 75, 'BER': 180, 'MUC': 165, 'FRA': 195, 'AMS': 225, 'LHR': 270,
    'AMM': 90, 'DXB': 240,
  },
  // Major European hubs
  'CDG': {
    'LHR': 75, 'FCO': 120, 'BCN': 105, 'AMS': 75, 'BER': 105, 'MAD': 120, 'LIS': 150,
    'VIE': 120, 'PRG': 90, 'ATH': 195, 'MXP': 90, 'ZRH': 75, 'GVA': 60, 'BRU': 50,
    'JFK': 480, 'LAX': 660, 'DXB': 420, 'SIN': 780, 'BKK': 720, 'NRT': 720,
    'AMM': 270, 'TBS': 300,
  },
  'LHR': {
    'CDG': 75, 'FCO': 150, 'BCN': 120, 'AMS': 60, 'BER': 105, 'MAD': 150, 'LIS': 165,
    'DXB': 450, 'JFK': 450, 'LAX': 660, 'SIN': 780, 'HKG': 720, 'NRT': 720,
    'AMM': 300,
  },
  'FRA': {
    'CDG': 75, 'LHR': 90, 'FCO': 105, 'BCN': 120, 'AMS': 60, 'VIE': 90, 'PRG': 60,
    'MAD': 150, 'ATH': 165, 'JFK': 510, 'DXB': 390, 'SIN': 720,
    'AMM': 240,
  },
  'AMS': {
    'CDG': 75, 'LHR': 60, 'FCO': 135, 'BCN': 120, 'BER': 75, 'VIE': 105, 'PRG': 90,
    'JFK': 480, 'ATH': 195,
    'AMM': 270,
  },
  'MAD': {
    'CDG': 120, 'LHR': 150, 'FCO': 135, 'BCN': 75, 'LIS': 60, 'AMS': 150, 'FRA': 150,
  },
  'BCN': {
    'CDG': 105, 'LHR': 120, 'FCO': 90, 'AMS': 120, 'MAD': 75, 'LIS': 120,
  },
  'FCO': {
    'CDG': 120, 'LHR': 150, 'BCN': 90, 'AMS': 135, 'ATH': 120, 'MAD': 135,
    'AMM': 180,
  },
  // Middle East hubs
  'AMM': {
    'DXB': 180, 'DOH': 180, 'BEY': 45, 'CAI': 60, 'TBS': 150,
  },
  'DXB': {
    'DOH': 60, 'AMM': 180, 'BEY': 210, 'SIN': 420, 'BKK': 360, 'DEL': 180, 'BOM': 150,
  },
};

// Get estimated flight duration
function getFlightDuration(originCode: string, destCode: string): string {
  const duration = FLIGHT_DURATIONS[originCode]?.[destCode] || 
                   FLIGHT_DURATIONS[destCode]?.[originCode];
  
  if (duration) {
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    return mins > 0 ? `${hours} saat ${mins} dk` : `${hours} saat`;
  }
  
  return '2-4 saat'; // Default
}

// Get estimated distance
function getFlightDistance(originCode: string, destCode: string): string {
  const duration = FLIGHT_DURATIONS[originCode]?.[destCode] || 
                   FLIGHT_DURATIONS[destCode]?.[originCode];
  
  if (duration) {
    // Rough estimate: average speed 800 km/h
    const distance = Math.round((duration / 60) * 800);
    return `~${distance.toLocaleString('tr-TR')} km`;
  }
  
  return '1000-3000 km';
}

// Generate route description
function generateRouteDescription(originCity: string, destCity: string, duration: string): string {
  return `${originCity} - ${destCity} uçuşu için en ucuz bilet fiyatlarını karşılaştırın. ` +
         `Ortalama uçuş süresi ${duration}. Tüm havayollarının fiyatlarını tek seferde görün.`;
}

// Generate route tips
function generateRouteTips(originCity: string, destCity: string): string[] {
  return [
    `${originCity} - ${destCity} arası en ucuz uçuşlar genellikle hafta içi günlerindedir.`,
    `Erken rezervasyon ile %20-40 tasarruf sağlayabilirsiniz.`,
    `Esnek tarih araması yaparak farklı günlerdeki fiyatları karşılaştırın.`,
    `Aktarmalı uçuşlar genellikle direkt uçuşlardan daha uygun fiyatlıdır.`,
  ];
}

// Popular routes to generate
const POPULAR_ROUTE_PAIRS: [string, string][] = [
  // Istanbul hub routes - Europe
  ['IST', 'CDG'], ['IST', 'LHR'], ['IST', 'FCO'], ['IST', 'BCN'], ['IST', 'AMS'],
  ['IST', 'BER'], ['IST', 'MUC'], ['IST', 'FRA'], ['IST', 'VIE'], ['IST', 'PRG'],
  ['IST', 'BUD'], ['IST', 'ATH'], ['IST', 'MAD'], ['IST', 'LIS'], ['IST', 'MXP'],
  ['IST', 'ZRH'], ['IST', 'CPH'], ['IST', 'ARN'], ['IST', 'BRU'], ['IST', 'GVA'],
  ['IST', 'WAW'], ['IST', 'OTP'], ['IST', 'SOF'], ['IST', 'PMI'], ['IST', 'AGP'],
  ['IST', 'OPO'], ['IST', 'SKG'], ['IST', 'VCE'], ['IST', 'NAP'], ['IST', 'HEL'],
  ['IST', 'OSL'], ['IST', 'DUB'], ['IST', 'RIX'], ['IST', 'VNO'], ['IST', 'TLL'],
  
  // Istanbul hub routes - Balkans (visa-free)
  ['IST', 'TBS'], ['IST', 'GYD'], ['IST', 'BEG'], ['IST', 'SKP'], ['IST', 'TIR'],
  ['IST', 'SJJ'], ['IST', 'TGD'], ['IST', 'PRN'],
  
  // Istanbul hub routes - Middle East
  ['IST', 'DXB'], ['IST', 'DOH'], ['IST', 'AMM'], ['IST', 'BEY'], ['IST', 'AUH'],
  ['IST', 'BAH'], ['IST', 'MCT'], ['IST', 'KWI'],
  
  // Istanbul hub routes - Asia
  ['IST', 'SIN'], ['IST', 'BKK'], ['IST', 'KUL'], ['IST', 'HKG'], ['IST', 'NRT'],
  ['IST', 'ICN'], ['IST', 'DEL'], ['IST', 'BOM'], ['IST', 'PEK'], ['IST', 'PVG'],
  ['IST', 'CGK'], ['IST', 'DPS'], ['IST', 'MNL'], ['IST', 'TPE'], ['IST', 'KTM'],
  
  // Istanbul hub routes - Africa
  ['IST', 'TUN'], ['IST', 'CMN'], ['IST', 'RAK'], ['IST', 'CPT'], ['IST', 'JNB'],
  ['IST', 'NBO'], ['IST', 'DAR'], ['IST', 'ZNZ'],
  
  // Istanbul hub routes - Americas
  ['IST', 'JFK'], ['IST', 'LAX'], ['IST', 'ORD'], ['IST', 'MIA'], ['IST', 'SFO'],
  ['IST', 'YYZ'], ['IST', 'YVR'], ['IST', 'GRU'], ['IST', 'GIG'], ['IST', 'EZE'],
  ['IST', 'SCL'], ['IST', 'BOG'], ['IST', 'LIM'],
  
  // Istanbul hub routes - Central Asia
  ['IST', 'ALA'], ['IST', 'NQZ'], ['IST', 'TAS'], ['IST', 'FRU'],
  
  // Istanbul hub routes - Other
  ['IST', 'ECN'], ['IST', 'SYD'], ['IST', 'MEL'],
  
  // Other Turkish cities
  ['AYT', 'BER'], ['AYT', 'MUC'], ['AYT', 'FRA'], ['AYT', 'AMS'], ['AYT', 'LHR'],
  ['AYT', 'AMM'], ['AYT', 'DXB'],
  ['ADB', 'ATH'], ['ADB', 'CDG'], ['ADB', 'AMS'], ['ADB', 'AMM'], ['ADB', 'DXB'],
  ['ESB', 'FRA'], ['ESB', 'MUC'], ['ESB', 'VIE'], ['ESB', 'AMM'], ['ESB', 'DXB'], ['ESB', 'TBS'],
  ['SAW', 'AMM'], ['SAW', 'DXB'], ['SAW', 'TBS'], ['SAW', 'GYD'],
  
  // European cross-routes
  ['CDG', 'LHR'], ['CDG', 'FCO'], ['CDG', 'BCN'], ['CDG', 'AMS'], ['CDG', 'BER'],
  ['CDG', 'AMM'], ['CDG', 'TBS'],
  ['LHR', 'FCO'], ['LHR', 'BCN'], ['LHR', 'AMS'], ['LHR', 'MAD'], ['LHR', 'AMM'],
  ['FRA', 'LHR'], ['FRA', 'CDG'], ['FRA', 'FCO'], ['FRA', 'BCN'], ['FRA', 'AMM'],
  ['AMS', 'FCO'], ['AMS', 'BCN'], ['AMS', 'MAD'], ['AMS', 'AMM'],
  ['BCN', 'FCO'], ['BCN', 'LIS'], ['MAD', 'LIS'], ['MAD', 'FCO'],
  ['FCO', 'AMM'],
  
  // Middle East cross-routes
  ['AMM', 'DXB'], ['AMM', 'DOH'], ['AMM', 'BEY'], ['DXB', 'DOH'], ['DXB', 'BEY'],
  
  // Long haul from European hubs
  ['CDG', 'JFK'], ['CDG', 'DXB'], ['CDG', 'SIN'], ['CDG', 'BKK'],
  ['LHR', 'JFK'], ['LHR', 'DXB'], ['LHR', 'SIN'], ['LHR', 'HKG'],
  ['FRA', 'JFK'], ['FRA', 'DXB'], ['FRA', 'SIN'],
  
  // Middle East to Asia
  ['DXB', 'SIN'], ['DXB', 'BKK'], ['DXB', 'DEL'], ['DXB', 'BOM'],
];

// Generate all routes
export function generateFlightRoutes(): FlightRoute[] {
  const routes: FlightRoute[] = [];
  const seenSlugs = new Set<string>();

  for (const [originCode, destCode] of POPULAR_ROUTE_PAIRS) {
    const originInfo = destinationData[originCode];
    const destInfo = destinationData[destCode];

    if (!originInfo || !destInfo) continue;

    const originCity = originInfo.city.split('(')[0].trim();
    const destCity = destInfo.city.split('(')[0].trim();
    const slug = createRouteSlug(originCity, destCity);

    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const duration = getFlightDuration(originCode, destCode);

    routes.push({
      slug,
      originCode,
      destinationCode: destCode,
      originCity,
      destinationCity: destCity,
      originCountry: originInfo.country,
      destinationCountry: destInfo.country,
      originFlag: getCountryFlag(originInfo.countryCode),
      destinationFlag: getCountryFlag(destInfo.countryCode),
      estimatedDuration: duration,
      distance: getFlightDistance(originCode, destCode),
      description: generateRouteDescription(originCity, destCity, duration),
      tips: generateRouteTips(originCity, destCity),
    });
  }

  return routes;
}

// Get route by slug
export function getRouteBySlug(slug: string): FlightRoute | undefined {
  return generateFlightRoutes().find(r => r.slug === slug);
}

// Get all route slugs
export function getAllRouteSlugs(): string[] {
  return generateFlightRoutes().map(r => r.slug);
}

// Get popular routes for a specific city
export function getRoutesForCity(cityCode: string): FlightRoute[] {
  return generateFlightRoutes().filter(
    r => r.originCode === cityCode || r.destinationCode === cityCode
  );
}

// Get flight duration between two airports
export function getFlightDurationBetween(originCode: string, destCode: string): string {
  return getFlightDuration(originCode, destCode);
}

// Get flight distance between two airports
export function getFlightDistanceBetween(originCode: string, destCode: string): string {
  return getFlightDistance(originCode, destCode);
}
