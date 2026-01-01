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
  },
  'SAW': {
    'CDG': 210, 'LHR': 240, 'FCO': 135, 'BCN': 195, 'AMS': 195, 'BER': 150, 'ATH': 80,
  },
  'ESB': {
    'IST': 60, 'CDG': 240, 'FRA': 195, 'MUC': 170, 'VIE': 150, 'ATH': 100,
  },
  'ADB': {
    'IST': 60, 'CDG': 225, 'ATH': 60, 'FCO': 120, 'AMS': 210,
  },
  'AYT': {
    'IST': 75, 'BER': 180, 'MUC': 165, 'FRA': 195, 'AMS': 225, 'LHR': 270,
  },
  // Major European hubs
  'CDG': {
    'LHR': 75, 'FCO': 120, 'BCN': 105, 'AMS': 75, 'BER': 105, 'MAD': 120, 'LIS': 150,
    'VIE': 120, 'PRG': 90, 'ATH': 195, 'MXP': 90, 'ZRH': 75, 'GVA': 60, 'BRU': 50,
    'JFK': 480, 'LAX': 660, 'DXB': 420, 'SIN': 780, 'BKK': 720, 'NRT': 720,
  },
  'LHR': {
    'CDG': 75, 'FCO': 150, 'BCN': 120, 'AMS': 60, 'BER': 105, 'MAD': 150, 'LIS': 165,
    'DXB': 450, 'JFK': 450, 'LAX': 660, 'SIN': 780, 'HKG': 720, 'NRT': 720,
  },
  'FRA': {
    'CDG': 75, 'LHR': 90, 'FCO': 105, 'BCN': 120, 'AMS': 60, 'VIE': 90, 'PRG': 60,
    'MAD': 150, 'ATH': 165, 'JFK': 510, 'DXB': 390, 'SIN': 720,
  },
  'AMS': {
    'CDG': 75, 'LHR': 60, 'FCO': 135, 'BCN': 120, 'BER': 75, 'VIE': 105, 'PRG': 90,
    'JFK': 480, 'ATH': 195,
  },
  'MAD': {
    'CDG': 120, 'LHR': 150, 'FCO': 135, 'BCN': 75, 'LIS': 60, 'AMS': 150, 'FRA': 150,
  },
  'BCN': {
    'CDG': 105, 'LHR': 120, 'FCO': 90, 'AMS': 120, 'MAD': 75, 'LIS': 120,
  },
  'FCO': {
    'CDG': 120, 'LHR': 150, 'BCN': 90, 'AMS': 135, 'ATH': 120, 'MAD': 135,
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
  // Istanbul hub routes
  ['IST', 'CDG'], ['IST', 'LHR'], ['IST', 'FCO'], ['IST', 'BCN'], ['IST', 'AMS'],
  ['IST', 'BER'], ['IST', 'MUC'], ['IST', 'FRA'], ['IST', 'VIE'], ['IST', 'PRG'],
  ['IST', 'BUD'], ['IST', 'ATH'], ['IST', 'MAD'], ['IST', 'LIS'], ['IST', 'DXB'],
  ['IST', 'TBS'], ['IST', 'GYD'], ['IST', 'BEG'], ['IST', 'MXP'], ['IST', 'ZRH'],
  ['IST', 'CPH'], ['IST', 'ARN'], ['IST', 'JFK'], ['IST', 'SIN'], ['IST', 'BKK'],
  
  // Other Turkish cities
  ['AYT', 'BER'], ['AYT', 'MUC'], ['AYT', 'FRA'], ['AYT', 'AMS'], ['AYT', 'LHR'],
  ['ADB', 'ATH'], ['ADB', 'CDG'], ['ADB', 'AMS'],
  ['ESB', 'FRA'], ['ESB', 'MUC'], ['ESB', 'VIE'],
  
  // European cross-routes
  ['CDG', 'LHR'], ['CDG', 'FCO'], ['CDG', 'BCN'], ['CDG', 'AMS'], ['CDG', 'BER'],
  ['LHR', 'FCO'], ['LHR', 'BCN'], ['LHR', 'AMS'], ['LHR', 'MAD'],
  ['FRA', 'LHR'], ['FRA', 'CDG'], ['FRA', 'FCO'], ['FRA', 'BCN'],
  ['AMS', 'FCO'], ['AMS', 'BCN'], ['AMS', 'MAD'],
  ['BCN', 'FCO'], ['BCN', 'LIS'], ['MAD', 'LIS'], ['MAD', 'FCO'],
  
  // Long haul from European hubs
  ['CDG', 'JFK'], ['CDG', 'DXB'], ['CDG', 'SIN'], ['CDG', 'BKK'],
  ['LHR', 'JFK'], ['LHR', 'DXB'], ['LHR', 'SIN'], ['LHR', 'HKG'],
  ['FRA', 'JFK'], ['FRA', 'DXB'], ['FRA', 'SIN'],
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
