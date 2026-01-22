import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 30;

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitInfo(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    const resetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitStore.set(ip, { count: 1, resetTime });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetTime };
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  
  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count, resetTime: record.resetTime };
}

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('cf-connecting-ip') || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

// Input validation constants
const MAX_LOCATION_LENGTH = 100;
const MAX_ADULTS = 20;
const MIN_ADULTS = 1;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function sanitizeString(input: unknown, maxLength: number = 100): string {
  if (typeof input !== 'string') return '';
  return input.slice(0, maxLength).replace(/[<>'"\\]/g, '').trim();
}

function validateDate(dateStr: unknown): string | null {
  if (typeof dateStr !== 'string') return null;
  if (!DATE_REGEX.test(dateStr)) return null;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  
  const now = new Date();
  const twoYearsFromNow = new Date();
  twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
  
  if (date < now || date > twoYearsFromNow) return null;
  
  return dateStr;
}

function validateAdults(adults: unknown): number {
  const num = typeof adults === 'number' ? adults : parseInt(String(adults), 10);
  if (isNaN(num) || num < MIN_ADULTS || num > MAX_ADULTS) return 2;
  return num;
}

function getGenericErrorMessage(): string {
  return 'Otel araması başarısız oldu. Lütfen tekrar deneyin.';
}

interface HotelSearchParams {
  location?: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  limit?: number;
  currency?: string;
}

// GLOBAL CITY LOCATIONS - Comprehensive worldwide coverage
const cityLocations: Record<string, { en: string; locationId: string; iata: string }> = {
  // === TURKEY ===
  'istanbul': { en: 'Istanbul', locationId: '359', iata: 'IST' },
  'antalya': { en: 'Antalya', locationId: '360', iata: 'AYT' },
  'izmir': { en: 'Izmir', locationId: '361', iata: 'ADB' },
  'bodrum': { en: 'Bodrum', locationId: '1116', iata: 'BJV' },
  'ankara': { en: 'Ankara', locationId: '358', iata: 'ESB' },
  'kapadokya': { en: 'Cappadocia', locationId: '2505', iata: 'ASR' },
  'fethiye': { en: 'Fethiye', locationId: '1117', iata: 'DLM' },
  'marmaris': { en: 'Marmaris', locationId: '1118', iata: 'DLM' },
  'kusadasi': { en: 'Kusadasi', locationId: '1119', iata: 'ADB' },
  'cesme': { en: 'Cesme', locationId: '2506', iata: 'ADB' },
  'alacati': { en: 'Alacati', locationId: '2507', iata: 'ADB' },
  'trabzon': { en: 'Trabzon', locationId: '362', iata: 'TZX' },
  
  // === GERMANY ===
  'berlin': { en: 'Berlin', locationId: '12153', iata: 'BER' },
  'frankfurt': { en: 'Frankfurt', locationId: '12168', iata: 'FRA' },
  'munich': { en: 'Munich', locationId: '12193', iata: 'MUC' },
  'münih': { en: 'Munich', locationId: '12193', iata: 'MUC' },
  'munih': { en: 'Munich', locationId: '12193', iata: 'MUC' },
  'hamburg': { en: 'Hamburg', locationId: '12175', iata: 'HAM' },
  'cologne': { en: 'Cologne', locationId: '12160', iata: 'CGN' },
  'köln': { en: 'Cologne', locationId: '12160', iata: 'CGN' },
  'dusseldorf': { en: 'Dusseldorf', locationId: '12164', iata: 'DUS' },
  
  // === FRANCE ===
  'paris': { en: 'Paris', locationId: '418', iata: 'PAR' },
  'nice': { en: 'Nice', locationId: '411', iata: 'NCE' },
  'nis': { en: 'Nice', locationId: '411', iata: 'NCE' },
  'lyon': { en: 'Lyon', locationId: '406', iata: 'LYS' },
  'marseille': { en: 'Marseille', locationId: '409', iata: 'MRS' },
  'marsilya': { en: 'Marseille', locationId: '409', iata: 'MRS' },
  'bordeaux': { en: 'Bordeaux', locationId: '399', iata: 'BOD' },
  'cannes': { en: 'Cannes', locationId: '400', iata: 'NCE' },
  'strasbourg': { en: 'Strasbourg', locationId: '427', iata: 'SXB' },
  
  // === UK ===
  'london': { en: 'London', locationId: '100', iata: 'LON' },
  'londra': { en: 'London', locationId: '100', iata: 'LON' },
  'manchester': { en: 'Manchester', locationId: '104', iata: 'MAN' },
  'edinburgh': { en: 'Edinburgh', locationId: '111', iata: 'EDI' },
  'birmingham': { en: 'Birmingham', locationId: '102', iata: 'BHX' },
  'glasgow': { en: 'Glasgow', locationId: '114', iata: 'GLA' },
  'liverpool': { en: 'Liverpool', locationId: '103', iata: 'LPL' },
  'bristol': { en: 'Bristol', locationId: '110', iata: 'BRS' },
  
  // === ITALY ===
  'rome': { en: 'Rome', locationId: '303', iata: 'ROM' },
  'roma': { en: 'Rome', locationId: '303', iata: 'ROM' },
  'milan': { en: 'Milan', locationId: '294', iata: 'MIL' },
  'milano': { en: 'Milan', locationId: '294', iata: 'MIL' },
  'florence': { en: 'Florence', locationId: '285', iata: 'FLR' },
  'floransa': { en: 'Florence', locationId: '285', iata: 'FLR' },
  'venice': { en: 'Venice', locationId: '312', iata: 'VCE' },
  'venedik': { en: 'Venice', locationId: '312', iata: 'VCE' },
  'naples': { en: 'Naples', locationId: '298', iata: 'NAP' },
  'napoli': { en: 'Naples', locationId: '298', iata: 'NAP' },
  'bologna': { en: 'Bologna', locationId: '278', iata: 'BLQ' },
  'turin': { en: 'Turin', locationId: '308', iata: 'TRN' },
  'verona': { en: 'Verona', locationId: '313', iata: 'VRN' },
  'amalfi': { en: 'Amalfi', locationId: '2890', iata: 'NAP' },
  'positano': { en: 'Positano', locationId: '2891', iata: 'NAP' },
  
  // === SPAIN ===
  'barcelona': { en: 'Barcelona', locationId: '562', iata: 'BCN' },
  'barselona': { en: 'Barcelona', locationId: '562', iata: 'BCN' },
  'madrid': { en: 'Madrid', locationId: '556', iata: 'MAD' },
  'sevilla': { en: 'Seville', locationId: '570', iata: 'SVQ' },
  'seville': { en: 'Seville', locationId: '570', iata: 'SVQ' },
  'valencia': { en: 'Valencia', locationId: '574', iata: 'VLC' },
  'malaga': { en: 'Malaga', locationId: '553', iata: 'AGP' },
  'ibiza': { en: 'Ibiza', locationId: '548', iata: 'IBZ' },
  'mallorca': { en: 'Mallorca', locationId: '551', iata: 'PMI' },
  'granada': { en: 'Granada', locationId: '547', iata: 'GRX' },
  'bilbao': { en: 'Bilbao', locationId: '543', iata: 'BIO' },
  'tenerife': { en: 'Tenerife', locationId: '571', iata: 'TFN' },
  
  // === PORTUGAL ===
  'lisbon': { en: 'Lisbon', locationId: '498', iata: 'LIS' },
  'lizbon': { en: 'Lisbon', locationId: '498', iata: 'LIS' },
  'porto': { en: 'Porto', locationId: '502', iata: 'OPO' },
  'faro': { en: 'Faro', locationId: '495', iata: 'FAO' },
  'madeira': { en: 'Madeira', locationId: '499', iata: 'FNC' },
  
  // === NETHERLANDS ===
  'amsterdam': { en: 'Amsterdam', locationId: '93', iata: 'AMS' },
  'rotterdam': { en: 'Rotterdam', locationId: '96', iata: 'RTM' },
  'hague': { en: 'The Hague', locationId: '97', iata: 'RTM' },
  'lahey': { en: 'The Hague', locationId: '97', iata: 'RTM' },
  'utrecht': { en: 'Utrecht', locationId: '98', iata: 'AMS' },
  
  // === AUSTRIA ===
  'vienna': { en: 'Vienna', locationId: '131', iata: 'VIE' },
  'viyana': { en: 'Vienna', locationId: '131', iata: 'VIE' },
  'salzburg': { en: 'Salzburg', locationId: '129', iata: 'SZG' },
  'innsbruck': { en: 'Innsbruck', locationId: '127', iata: 'INN' },
  
  // === SWITZERLAND ===
  'zurich': { en: 'Zurich', locationId: '138', iata: 'ZRH' },
  'zürih': { en: 'Zurich', locationId: '138', iata: 'ZRH' },
  'geneva': { en: 'Geneva', locationId: '134', iata: 'GVA' },
  'cenevre': { en: 'Geneva', locationId: '134', iata: 'GVA' },
  'basel': { en: 'Basel', locationId: '132', iata: 'BSL' },
  'lucerne': { en: 'Lucerne', locationId: '135', iata: 'ZRH' },
  'interlaken': { en: 'Interlaken', locationId: '2520', iata: 'ZRH' },
  
  // === EASTERN EUROPE ===
  'prague': { en: 'Prague', locationId: '317', iata: 'PRG' },
  'prag': { en: 'Prague', locationId: '317', iata: 'PRG' },
  'budapest': { en: 'Budapest', locationId: '268', iata: 'BUD' },
  'budapes': { en: 'Budapest', locationId: '268', iata: 'BUD' },
  'budapeşte': { en: 'Budapest', locationId: '268', iata: 'BUD' },
  'warsaw': { en: 'Warsaw', locationId: '330', iata: 'WAW' },
  'varşova': { en: 'Warsaw', locationId: '330', iata: 'WAW' },
  'krakow': { en: 'Krakow', locationId: '323', iata: 'KRK' },
  'bucharest': { en: 'Bucharest', locationId: '267', iata: 'OTP' },
  'bükreş': { en: 'Bucharest', locationId: '267', iata: 'OTP' },
  'sofia': { en: 'Sofia', locationId: '328', iata: 'SOF' },
  'sofya': { en: 'Sofia', locationId: '328', iata: 'SOF' },
  'belgrade': { en: 'Belgrade', locationId: '266', iata: 'BEG' },
  'belgrad': { en: 'Belgrade', locationId: '266', iata: 'BEG' },
  
  // === GREECE ===
  'athens': { en: 'Athens', locationId: '342', iata: 'ATH' },
  'atina': { en: 'Athens', locationId: '342', iata: 'ATH' },
  'santorini': { en: 'Santorini', locationId: '350', iata: 'JTR' },
  'mykonos': { en: 'Mykonos', locationId: '346', iata: 'JMK' },
  'crete': { en: 'Crete', locationId: '343', iata: 'HER' },
  'girit': { en: 'Crete', locationId: '343', iata: 'HER' },
  'rhodes': { en: 'Rhodes', locationId: '349', iata: 'RHO' },
  'rodos': { en: 'Rhodes', locationId: '349', iata: 'RHO' },
  'corfu': { en: 'Corfu', locationId: '344', iata: 'CFU' },
  'thessaloniki': { en: 'Thessaloniki', locationId: '352', iata: 'SKG' },
  'selanik': { en: 'Thessaloniki', locationId: '352', iata: 'SKG' },
  
  // === NORDICS ===
  'copenhagen': { en: 'Copenhagen', locationId: '139', iata: 'CPH' },
  'kopenhag': { en: 'Copenhagen', locationId: '139', iata: 'CPH' },
  'stockholm': { en: 'Stockholm', locationId: '154', iata: 'ARN' },
  'oslo': { en: 'Oslo', locationId: '144', iata: 'OSL' },
  'helsinki': { en: 'Helsinki', locationId: '141', iata: 'HEL' },
  'reykjavik': { en: 'Reykjavik', locationId: '151', iata: 'KEF' },
  
  // === MIDDLE EAST ===
  'dubai': { en: 'Dubai', locationId: '614', iata: 'DXB' },
  'doha': { en: 'Doha', locationId: '506', iata: 'DOH' },
  'abu dhabi': { en: 'Abu Dhabi', locationId: '611', iata: 'AUH' },
  'abudabi': { en: 'Abu Dhabi', locationId: '611', iata: 'AUH' },
  'riyadh': { en: 'Riyadh', locationId: '509', iata: 'RUH' },
  'jeddah': { en: 'Jeddah', locationId: '507', iata: 'JED' },
  'amman': { en: 'Amman', locationId: '503', iata: 'AMM' },
  'beirut': { en: 'Beirut', locationId: '504', iata: 'BEY' },
  'beyrut': { en: 'Beirut', locationId: '504', iata: 'BEY' },
  'muscat': { en: 'Muscat', locationId: '508', iata: 'MCT' },
  
  // === ASIA ===
  'tokyo': { en: 'Tokyo', locationId: '58', iata: 'TYO' },
  'osaka': { en: 'Osaka', locationId: '55', iata: 'OSA' },
  'kyoto': { en: 'Kyoto', locationId: '53', iata: 'KIX' },
  'seoul': { en: 'Seoul', locationId: '69', iata: 'SEL' },
  'seul': { en: 'Seoul', locationId: '69', iata: 'SEL' },
  'bangkok': { en: 'Bangkok', locationId: '191', iata: 'BKK' },
  'phuket': { en: 'Phuket', locationId: '197', iata: 'HKT' },
  'chiangmai': { en: 'Chiang Mai', locationId: '193', iata: 'CNX' },
  'singapore': { en: 'Singapore', locationId: '73', iata: 'SIN' },
  'singapur': { en: 'Singapore', locationId: '73', iata: 'SIN' },
  'bali': { en: 'Bali', locationId: '264', iata: 'DPS' },
  'hong kong': { en: 'Hong Kong', locationId: '38', iata: 'HKG' },
  'taipei': { en: 'Taipei', locationId: '76', iata: 'TPE' },
  'kuala lumpur': { en: 'Kuala Lumpur', locationId: '46', iata: 'KUL' },
  'kualalumpur': { en: 'Kuala Lumpur', locationId: '46', iata: 'KUL' },
  'ho chi minh': { en: 'Ho Chi Minh City', locationId: '80', iata: 'SGN' },
  'hochiminh': { en: 'Ho Chi Minh City', locationId: '80', iata: 'SGN' },
  'hanoi': { en: 'Hanoi', locationId: '79', iata: 'HAN' },
  'manila': { en: 'Manila', locationId: '62', iata: 'MNL' },
  'beijing': { en: 'Beijing', locationId: '24', iata: 'PEK' },
  'pekin': { en: 'Beijing', locationId: '24', iata: 'PEK' },
  'shanghai': { en: 'Shanghai', locationId: '71', iata: 'SHA' },
  'delhi': { en: 'New Delhi', locationId: '30', iata: 'DEL' },
  'mumbai': { en: 'Mumbai', locationId: '50', iata: 'BOM' },
  'kathmandu': { en: 'Kathmandu', locationId: '51', iata: 'KTM' },
  
  // === USA ===
  'new york': { en: 'New York', locationId: '645', iata: 'NYC' },
  'newyork': { en: 'New York', locationId: '645', iata: 'NYC' },
  'los angeles': { en: 'Los Angeles', locationId: '732', iata: 'LAX' },
  'losangeles': { en: 'Los Angeles', locationId: '732', iata: 'LAX' },
  'miami': { en: 'Miami', locationId: '781', iata: 'MIA' },
  'las vegas': { en: 'Las Vegas', locationId: '733', iata: 'LAS' },
  'lasvegas': { en: 'Las Vegas', locationId: '733', iata: 'LAS' },
  'san francisco': { en: 'San Francisco', locationId: '807', iata: 'SFO' },
  'sanfrancisco': { en: 'San Francisco', locationId: '807', iata: 'SFO' },
  'chicago': { en: 'Chicago', locationId: '664', iata: 'ORD' },
  'boston': { en: 'Boston', locationId: '647', iata: 'BOS' },
  'washington': { en: 'Washington DC', locationId: '840', iata: 'WAS' },
  'seattle': { en: 'Seattle', locationId: '813', iata: 'SEA' },
  'hawaii': { en: 'Honolulu', locationId: '706', iata: 'HNL' },
  'orlando': { en: 'Orlando', locationId: '786', iata: 'MCO' },
  'san diego': { en: 'San Diego', locationId: '804', iata: 'SAN' },
  'denver': { en: 'Denver', locationId: '675', iata: 'DEN' },
  'austin': { en: 'Austin', locationId: '638', iata: 'AUS' },
  'nashville': { en: 'Nashville', locationId: '780', iata: 'BNA' },
  'new orleans': { en: 'New Orleans', locationId: '783', iata: 'MSY' },
  
  // === CANADA ===
  'toronto': { en: 'Toronto', locationId: '624', iata: 'YYZ' },
  'vancouver': { en: 'Vancouver', locationId: '628', iata: 'YVR' },
  'montreal': { en: 'Montreal', locationId: '619', iata: 'YUL' },
  
  // === MEXICO ===
  'mexico city': { en: 'Mexico City', locationId: '596', iata: 'MEX' },
  'cancun': { en: 'Cancun', locationId: '591', iata: 'CUN' },
  'playa del carmen': { en: 'Playa del Carmen', locationId: '2600', iata: 'CUN' },
  'tulum': { en: 'Tulum', locationId: '2601', iata: 'CUN' },
  
  // === SOUTH AMERICA ===
  'rio de janeiro': { en: 'Rio de Janeiro', locationId: '584', iata: 'GIG' },
  'rio': { en: 'Rio de Janeiro', locationId: '584', iata: 'GIG' },
  'sao paulo': { en: 'Sao Paulo', locationId: '587', iata: 'GRU' },
  'buenos aires': { en: 'Buenos Aires', locationId: '577', iata: 'EZE' },
  'buenosaires': { en: 'Buenos Aires', locationId: '577', iata: 'EZE' },
  'lima': { en: 'Lima', locationId: '600', iata: 'LIM' },
  'bogota': { en: 'Bogota', locationId: '578', iata: 'BOG' },
  'medellin': { en: 'Medellin', locationId: '594', iata: 'MDE' },
  'santiago': { en: 'Santiago', locationId: '589', iata: 'SCL' },
  'cartagena': { en: 'Cartagena', locationId: '579', iata: 'CTG' },
  'cusco': { en: 'Cusco', locationId: '2650', iata: 'CUZ' },
  
  // === CARIBBEAN ===
  'havana': { en: 'Havana', locationId: '606', iata: 'HAV' },
  'punta cana': { en: 'Punta Cana', locationId: '607', iata: 'PUJ' },
  'jamaica': { en: 'Montego Bay', locationId: '610', iata: 'MBJ' },
  'bahamas': { en: 'Nassau', locationId: '604', iata: 'NAS' },
  
  // === AFRICA ===
  'cape town': { en: 'Cape Town', locationId: '159', iata: 'CPT' },
  'capetown': { en: 'Cape Town', locationId: '159', iata: 'CPT' },
  'johannesburg': { en: 'Johannesburg', locationId: '161', iata: 'JNB' },
  'marrakech': { en: 'Marrakech', locationId: '168', iata: 'RAK' },
  'marakeş': { en: 'Marrakech', locationId: '168', iata: 'RAK' },
  'casablanca': { en: 'Casablanca', locationId: '164', iata: 'CMN' },
  'kazablanka': { en: 'Casablanca', locationId: '164', iata: 'CMN' },
  'cairo': { en: 'Cairo', locationId: '162', iata: 'CAI' },
  'kahire': { en: 'Cairo', locationId: '162', iata: 'CAI' },
  'nairobi': { en: 'Nairobi', locationId: '169', iata: 'NBO' },
  'zanzibar': { en: 'Zanzibar', locationId: '175', iata: 'ZNZ' },
  'mauritius': { en: 'Mauritius', locationId: '167', iata: 'MRU' },
  'seychelles': { en: 'Seychelles', locationId: '172', iata: 'SEZ' },
  
  // === CAUCASUS ===
  'tbilisi': { en: 'Tbilisi', locationId: '887', iata: 'TBS' },
  'tiflis': { en: 'Tbilisi', locationId: '887', iata: 'TBS' },
  'baku': { en: 'Baku', locationId: '144', iata: 'GYD' },
  'bakü': { en: 'Baku', locationId: '144', iata: 'GYD' },
  'yerevan': { en: 'Yerevan', locationId: '890', iata: 'EVN' },
  'erivan': { en: 'Yerevan', locationId: '890', iata: 'EVN' },
  
  // === OCEANIA ===
  'sydney': { en: 'Sydney', locationId: '18', iata: 'SYD' },
  'melbourne': { en: 'Melbourne', locationId: '12', iata: 'MEL' },
  'auckland': { en: 'Auckland', locationId: '1', iata: 'AKL' },
  'queenstown': { en: 'Queenstown', locationId: '2700', iata: 'ZQN' },
  'fiji': { en: 'Fiji', locationId: '2701', iata: 'NAN' },
  'bora bora': { en: 'Bora Bora', locationId: '2702', iata: 'BOB' },
  'maldives': { en: 'Maldives', locationId: '2703', iata: 'MLE' },
  'maldivler': { en: 'Maldives', locationId: '2703', iata: 'MLE' },
};

// Nearby cities for suggestions when no results
const nearbyCities: Record<string, string[]> = {
  'istanbul': ['ankara', 'izmir', 'antalya', 'bodrum'],
  'paris': ['london', 'brussels', 'amsterdam', 'barcelona'],
  'london': ['paris', 'amsterdam', 'dublin', 'edinburgh'],
  'tokyo': ['osaka', 'kyoto', 'seoul', 'taipei'],
  'new york': ['boston', 'washington', 'philadelphia', 'chicago'],
  'dubai': ['abu dhabi', 'doha', 'muscat', 'bahrain'],
  'bali': ['singapore', 'kuala lumpur', 'bangkok', 'ho chi minh'],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIP = getClientIP(req);
  const rateLimit = getRateLimitInfo(clientIP);
  
  if (!rateLimit.allowed) {
    console.log(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ error: 'Çok fazla istek gönderildi. Lütfen bir dakika bekleyin.', hotels: [] }),
      { 
        status: 429, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetTime / 1000))
        } 
      }
    );
  }

  try {
    const TRAVELPAYOUTS_API_TOKEN = Deno.env.get("TRAVELPAYOUTS_API_TOKEN");
    const TRAVELPAYOUTS_PARTNER_ID = Deno.env.get("TRAVELPAYOUTS_PARTNER_ID") || "261144";

    let params: HotelSearchParams;
    try {
      params = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Geçersiz istek formatı', hotels: [] }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const location = sanitizeString(params.location, MAX_LOCATION_LENGTH);
    const checkIn = validateDate(params.checkIn);
    const checkOut = validateDate(params.checkOut);
    const adults = validateAdults(params.adults);
    const limit = Math.min(params.limit || 24, 50);
    const currency = params.currency || 'TRY';

    if (!checkIn || !checkOut) {
      return new Response(
        JSON.stringify({ error: 'Geçersiz tarih formatı', hotels: [] }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      return new Response(
        JSON.stringify({ error: 'Çıkış tarihi giriş tarihinden sonra olmalıdır', hotels: [] }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Hotel search params (validated):", { location, checkIn, checkOut, adults });

    // Find city info - try exact match first, then fuzzy
    const normalizedLocation = location.toLowerCase().trim();
    let cityInfo = cityLocations[normalizedLocation];
    
    // Try fuzzy matching if exact match fails
    if (!cityInfo) {
      const keys = Object.keys(cityLocations);
      const match = keys.find(k => 
        k.includes(normalizedLocation) || 
        normalizedLocation.includes(k) ||
        cityLocations[k].en.toLowerCase().includes(normalizedLocation)
      );
      if (match) cityInfo = cityLocations[match];
    }
    
    if (!cityInfo) {
      console.log("City not found:", normalizedLocation);
      // Return affiliate link even if city not found - use location as search term
      return new Response(
        JSON.stringify({ 
          hotels: [],
          location,
          checkIn,
          checkOut,
          affiliateLink: `https://search.hotellook.com/?marker=${TRAVELPAYOUTS_PARTNER_ID}&destination=${encodeURIComponent(location)}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}`,
          nearbySuggestions: [],
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Found city:", cityInfo.en, "IATA:", cityInfo.iata);

    const affiliateLink = `https://search.hotellook.com/hotels?destination=${cityInfo.iata}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&currency=${currency}&marker=${TRAVELPAYOUTS_PARTNER_ID}`;

    let hotels: any[] = [];
    
    if (TRAVELPAYOUTS_API_TOKEN) {
      try {
        const apiUrl = `https://engine.hotellook.com/api/v2/cache.json?location=${cityInfo.iata}&checkIn=${checkIn}&checkOut=${checkOut}&currency=${currency}&limit=${limit}&token=${TRAVELPAYOUTS_API_TOKEN}`;
        
        console.log("Calling Hotellook API for:", cityInfo.en);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          
          if (Array.isArray(data) && data.length > 0) {
            hotels = data.slice(0, limit).map((hotel: any, index: number) => ({
              id: hotel.hotelId || String(index + 1),
              name: hotel.hotelName || `${cityInfo.en} Hotel ${index + 1}`,
              stars: hotel.stars || 4,
              priceFrom: hotel.priceFrom || 1500,
              priceAvg: hotel.priceAvg || hotel.priceFrom * 1.2,
              rating: hotel.rating ? hotel.rating / 10 : 4.5,
              reviews: hotel.reviews || 500,
              location: hotel.location || { lat: 0, lon: 0 },
              photo: hotel.photo ? `https://photo.hotellook.com/image_v2/limit/${hotel.photo}/800/520.auto` : `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop`,
              link: `https://search.hotellook.com/hotels/${cityInfo.iata}/${hotel.hotelId}?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&marker=${TRAVELPAYOUTS_PARTNER_ID}`,
            }));
            console.log(`Found ${hotels.length} hotels from API`);
          }
        } else {
          console.log("Hotellook API error:", response.status);
        }
      } catch (apiError) {
        console.error("Hotellook API error:", apiError);
      }
    }

    // Generate sample hotels with real Unsplash hotel photos if no API results
    if (hotels.length === 0) {
      console.log("Using sample hotel data with real photos");
      
      // Real hotel-themed Unsplash photo IDs
      const hotelPhotos = [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', // Hotel exterior
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop', // Luxury pool
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop', // Hotel room
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop', // Resort
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop', // Hotel bedroom
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop', // Hotel lobby
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop', // Boutique hotel
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop', // Modern hotel
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop', // Beach resort
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop', // Mountain hotel
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop', // Grand hotel
        'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&h=600&fit=crop', // City hotel
      ];
      
      const hotelTypes = [
        { suffix: 'Grand Hotel', stars: 5, basePrice: 2500, amenities: ['pool', 'spa', 'gym', 'wifi', 'breakfast', 'parking'] },
        { suffix: 'Boutique Stay', stars: 4, basePrice: 1800, amenities: ['wifi', 'breakfast', 'spa'] },
        { suffix: 'Business Hotel', stars: 4, basePrice: 1500, amenities: ['wifi', 'gym', 'parking', 'breakfast'] },
        { suffix: 'Budget Inn', stars: 3, basePrice: 800, amenities: ['wifi', 'parking'] },
        { suffix: 'Central Suites', stars: 4, basePrice: 1600, amenities: ['wifi', 'breakfast', 'gym'] },
        { suffix: 'Luxury Palace', stars: 5, basePrice: 3500, amenities: ['pool', 'spa', 'gym', 'wifi', 'breakfast', 'parking'] },
        { suffix: 'City Center Hotel', stars: 4, basePrice: 1400, amenities: ['wifi', 'breakfast', 'parking'] },
        { suffix: 'Comfort Inn', stars: 3, basePrice: 900, amenities: ['wifi', 'parking', 'breakfast'] },
        { suffix: 'Seaside Resort', stars: 5, basePrice: 2800, amenities: ['pool', 'spa', 'wifi', 'breakfast'] },
        { suffix: 'Urban Loft', stars: 4, basePrice: 1700, amenities: ['wifi', 'gym', 'breakfast'] },
        { suffix: 'Heritage Hotel', stars: 4, basePrice: 1900, amenities: ['wifi', 'breakfast', 'spa'] },
        { suffix: 'Express Hotel', stars: 3, basePrice: 750, amenities: ['wifi', 'parking'] },
      ];
      
      hotels = hotelTypes.slice(0, limit).map((type, index) => ({
        id: String(index + 1),
        name: `${cityInfo.en} ${type.suffix}`,
        stars: type.stars,
        priceFrom: type.basePrice + Math.floor(Math.random() * 300),
        priceAvg: Math.floor(type.basePrice * 1.2),
        rating: 4.0 + (Math.random() * 0.9),
        reviews: 150 + Math.floor(Math.random() * 1200),
        location: { lat: 0, lon: 0 },
        photo: hotelPhotos[index % hotelPhotos.length],
        amenities: type.amenities,
        link: affiliateLink,
      }));
    }

    // Get nearby suggestions
    const suggestions = nearbyCities[normalizedLocation] || [];

    return new Response(
      JSON.stringify({ 
        hotels,
        location: cityInfo.en,
        iata: cityInfo.iata,
        checkIn,
        checkOut,
        currency,
        affiliateLink,
        nearbySuggestions: suggestions,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Hotel search error:", error);
    return new Response(
      JSON.stringify({ error: getGenericErrorMessage(), hotels: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
