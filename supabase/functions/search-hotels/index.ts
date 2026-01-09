import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute per IP

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

// Input validation helpers
function sanitizeString(input: unknown, maxLength: number = 100): string {
  if (typeof input !== 'string') return '';
  return input.slice(0, maxLength).replace(/[<>'"\\]/g, '').trim();
}

function validateDate(dateStr: unknown): string | null {
  if (typeof dateStr !== 'string') return null;
  if (!DATE_REGEX.test(dateStr)) return null;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  
  // Check date is not too far in past or future (2 years)
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

// Generic error message - don't expose internal details
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

// City name to Trip.com city keyword mapping - Expanded with all major cities
const cityNames: Record<string, { en: string; tripcomUrl: string }> = {
  // === GERMANY ===
  'berlin': { en: 'Berlin', tripcomUrl: 'berlin-182' },
  'frankfurt': { en: 'Frankfurt', tripcomUrl: 'frankfurt-189' },
  'munich': { en: 'Munich', tripcomUrl: 'munich-196' },
  'münih': { en: 'Munich', tripcomUrl: 'munich-196' },
  'hamburg': { en: 'Hamburg', tripcomUrl: 'hamburg-187' },
  'cologne': { en: 'Cologne', tripcomUrl: 'cologne-184' },
  'köln': { en: 'Cologne', tripcomUrl: 'cologne-184' },
  'dusseldorf': { en: 'Dusseldorf', tripcomUrl: 'dusseldorf-186' },
  'düsseldorf': { en: 'Dusseldorf', tripcomUrl: 'dusseldorf-186' },
  
  // === FRANCE ===
  'paris': { en: 'Paris', tripcomUrl: 'paris-418' },
  'nice': { en: 'Nice', tripcomUrl: 'nice-411' },
  'nis': { en: 'Nice', tripcomUrl: 'nice-411' },
  'lyon': { en: 'Lyon', tripcomUrl: 'lyon-406' },
  'marseille': { en: 'Marseille', tripcomUrl: 'marseille-409' },
  'marsilya': { en: 'Marseille', tripcomUrl: 'marseille-409' },
  'bordeaux': { en: 'Bordeaux', tripcomUrl: 'bordeaux-395' },
  'bordo': { en: 'Bordeaux', tripcomUrl: 'bordeaux-395' },
  
  // === UK ===
  'london': { en: 'London', tripcomUrl: 'london-100' },
  'londra': { en: 'London', tripcomUrl: 'london-100' },
  'manchester': { en: 'Manchester', tripcomUrl: 'manchester-104' },
  'edinburgh': { en: 'Edinburgh', tripcomUrl: 'edinburgh-111' },
  'glasgow': { en: 'Glasgow', tripcomUrl: 'glasgow-112' },
  'birmingham': { en: 'Birmingham', tripcomUrl: 'birmingham-99' },
  'liverpool': { en: 'Liverpool', tripcomUrl: 'liverpool-103' },
  
  // === ITALY ===
  'rome': { en: 'Rome', tripcomUrl: 'rome-303' },
  'roma': { en: 'Rome', tripcomUrl: 'rome-303' },
  'milan': { en: 'Milan', tripcomUrl: 'milan-294' },
  'milano': { en: 'Milan', tripcomUrl: 'milan-294' },
  'florence': { en: 'Florence', tripcomUrl: 'florence-285' },
  'floransa': { en: 'Florence', tripcomUrl: 'florence-285' },
  'venice': { en: 'Venice', tripcomUrl: 'venice-312' },
  'venedik': { en: 'Venice', tripcomUrl: 'venice-312' },
  'naples': { en: 'Naples', tripcomUrl: 'naples-297' },
  'napoli': { en: 'Naples', tripcomUrl: 'naples-297' },
  
  // === SPAIN ===
  'barcelona': { en: 'Barcelona', tripcomUrl: 'barcelona-562' },
  'barselona': { en: 'Barcelona', tripcomUrl: 'barcelona-562' },
  'madrid': { en: 'Madrid', tripcomUrl: 'madrid-556' },
  'sevilla': { en: 'Seville', tripcomUrl: 'seville-570' },
  'seville': { en: 'Seville', tripcomUrl: 'seville-570' },
  'valencia': { en: 'Valencia', tripcomUrl: 'valencia-573' },
  'malaga': { en: 'Malaga', tripcomUrl: 'malaga-557' },
  'bilbao': { en: 'Bilbao', tripcomUrl: 'bilbao-563' },
  'palma': { en: 'Palma de Mallorca', tripcomUrl: 'palma-de-mallorca-559' },
  'ibiza': { en: 'Ibiza', tripcomUrl: 'ibiza-554' },
  
  // === PORTUGAL ===
  'lisbon': { en: 'Lisbon', tripcomUrl: 'lisbon-498' },
  'lizbon': { en: 'Lisbon', tripcomUrl: 'lisbon-498' },
  'porto': { en: 'Porto', tripcomUrl: 'porto-502' },
  'faro': { en: 'Faro', tripcomUrl: 'faro-497' },
  
  // === NETHERLANDS ===
  'amsterdam': { en: 'Amsterdam', tripcomUrl: 'amsterdam-93' },
  'rotterdam': { en: 'Rotterdam', tripcomUrl: 'rotterdam-96' },
  'hague': { en: 'The Hague', tripcomUrl: 'the-hague-97' },
  'lahey': { en: 'The Hague', tripcomUrl: 'the-hague-97' },
  
  // === BELGIUM ===
  'brussels': { en: 'Brussels', tripcomUrl: 'brussels-148' },
  'brüksel': { en: 'Brussels', tripcomUrl: 'brussels-148' },
  'bruges': { en: 'Bruges', tripcomUrl: 'bruges-149' },
  'brugge': { en: 'Bruges', tripcomUrl: 'bruges-149' },
  'antwerp': { en: 'Antwerp', tripcomUrl: 'antwerp-147' },
  
  // === AUSTRIA ===
  'vienna': { en: 'Vienna', tripcomUrl: 'vienna-131' },
  'viyana': { en: 'Vienna', tripcomUrl: 'vienna-131' },
  'salzburg': { en: 'Salzburg', tripcomUrl: 'salzburg-129' },
  'innsbruck': { en: 'Innsbruck', tripcomUrl: 'innsbruck-127' },
  
  // === SWITZERLAND ===
  'zurich': { en: 'Zurich', tripcomUrl: 'zurich-138' },
  'zürih': { en: 'Zurich', tripcomUrl: 'zurich-138' },
  'geneva': { en: 'Geneva', tripcomUrl: 'geneva-134' },
  'cenevre': { en: 'Geneva', tripcomUrl: 'geneva-134' },
  'basel': { en: 'Basel', tripcomUrl: 'basel-132' },
  'bern': { en: 'Bern', tripcomUrl: 'bern-133' },
  
  // === SCANDINAVIA ===
  'stockholm': { en: 'Stockholm', tripcomUrl: 'stockholm-123' },
  'oslo': { en: 'Oslo', tripcomUrl: 'oslo-475' },
  'copenhagen': { en: 'Copenhagen', tripcomUrl: 'copenhagen-169' },
  'kopenhag': { en: 'Copenhagen', tripcomUrl: 'copenhagen-169' },
  'helsinki': { en: 'Helsinki', tripcomUrl: 'helsinki-240' },
  'reykjavik': { en: 'Reykjavik', tripcomUrl: 'reykjavik-274' },
  
  // === EASTERN EUROPE ===
  'prague': { en: 'Prague', tripcomUrl: 'prague-317' },
  'prag': { en: 'Prague', tripcomUrl: 'prague-317' },
  'budapest': { en: 'Budapest', tripcomUrl: 'budapest-268' },
  'budapeşte': { en: 'Budapest', tripcomUrl: 'budapest-268' },
  'warsaw': { en: 'Warsaw', tripcomUrl: 'warsaw-330' },
  'varşova': { en: 'Warsaw', tripcomUrl: 'warsaw-330' },
  'krakow': { en: 'Krakow', tripcomUrl: 'krakow-325' },
  'bucharest': { en: 'Bucharest', tripcomUrl: 'bucharest-515' },
  'bükreş': { en: 'Bucharest', tripcomUrl: 'bucharest-515' },
  'sofia': { en: 'Sofia', tripcomUrl: 'sofia-157' },
  'sofya': { en: 'Sofia', tripcomUrl: 'sofia-157' },
  
  // === GREECE ===
  'athens': { en: 'Athens', tripcomUrl: 'athens-342' },
  'atina': { en: 'Athens', tripcomUrl: 'athens-342' },
  'santorini': { en: 'Santorini', tripcomUrl: 'santorini-350' },
  'mykonos': { en: 'Mykonos', tripcomUrl: 'mykonos-348' },
  'crete': { en: 'Crete', tripcomUrl: 'crete-344' },
  'girit': { en: 'Crete', tripcomUrl: 'crete-344' },
  'rhodes': { en: 'Rhodes', tripcomUrl: 'rhodes-349' },
  'rodos': { en: 'Rhodes', tripcomUrl: 'rhodes-349' },
  
  // === BALKANS ===
  'skopje': { en: 'Skopje', tripcomUrl: 'skopje-2374' },
  'üsküp': { en: 'Skopje', tripcomUrl: 'skopje-2374' },
  'belgrade': { en: 'Belgrade', tripcomUrl: 'belgrade-529' },
  'belgrad': { en: 'Belgrade', tripcomUrl: 'belgrade-529' },
  'zagreb': { en: 'Zagreb', tripcomUrl: 'zagreb-162' },
  'split': { en: 'Split', tripcomUrl: 'split-161' },
  'dubrovnik': { en: 'Dubrovnik', tripcomUrl: 'dubrovnik-159' },
  'ljubljana': { en: 'Ljubljana', tripcomUrl: 'ljubljana-539' },
  'sarajevo': { en: 'Sarajevo', tripcomUrl: 'sarajevo-143' },
  'saraybosna': { en: 'Sarajevo', tripcomUrl: 'sarajevo-143' },
  'tirana': { en: 'Tirana', tripcomUrl: 'tirana-140' },
  'podgorica': { en: 'Podgorica', tripcomUrl: 'podgorica-460' },
  
  // === TURKEY ===
  'istanbul': { en: 'Istanbul', tripcomUrl: 'istanbul-359' },
  'antalya': { en: 'Antalya', tripcomUrl: 'antalya-360' },
  'izmir': { en: 'Izmir', tripcomUrl: 'izmir-361' },
  'bodrum': { en: 'Bodrum', tripcomUrl: 'bodrum-1116' },
  'ankara': { en: 'Ankara', tripcomUrl: 'ankara-362' },
  'cappadocia': { en: 'Cappadocia', tripcomUrl: 'cappadocia-363' },
  'kapadokya': { en: 'Cappadocia', tripcomUrl: 'cappadocia-363' },
  'fethiye': { en: 'Fethiye', tripcomUrl: 'fethiye-1115' },
  'marmaris': { en: 'Marmaris', tripcomUrl: 'marmaris-1117' },
  'kusadasi': { en: 'Kusadasi', tripcomUrl: 'kusadasi-1118' },
  'kuşadası': { en: 'Kusadasi', tripcomUrl: 'kusadasi-1118' },
  'trabzon': { en: 'Trabzon', tripcomUrl: 'trabzon-364' },
  'pamukkale': { en: 'Pamukkale', tripcomUrl: 'pamukkale-365' },
  
  // === CAUCASUS ===
  'tbilisi': { en: 'Tbilisi', tripcomUrl: 'tbilisi-887' },
  'tiflis': { en: 'Tbilisi', tripcomUrl: 'tbilisi-887' },
  'batumi': { en: 'Batumi', tripcomUrl: 'batumi-888' },
  'baku': { en: 'Baku', tripcomUrl: 'baku-144' },
  'bakü': { en: 'Baku', tripcomUrl: 'baku-144' },
  'yerevan': { en: 'Yerevan', tripcomUrl: 'yerevan-141' },
  'erivan': { en: 'Yerevan', tripcomUrl: 'yerevan-141' },
  
  // === MIDDLE EAST ===
  'dubai': { en: 'Dubai', tripcomUrl: 'dubai-614' },
  'abu dhabi': { en: 'Abu Dhabi', tripcomUrl: 'abu-dhabi-613' },
  'doha': { en: 'Doha', tripcomUrl: 'doha-506' },
  'muscat': { en: 'Muscat', tripcomUrl: 'muscat-481' },
  'amman': { en: 'Amman', tripcomUrl: 'amman-368' },
  'beirut': { en: 'Beirut', tripcomUrl: 'beirut-380' },
  'beyrut': { en: 'Beirut', tripcomUrl: 'beirut-380' },
  'tel aviv': { en: 'Tel Aviv', tripcomUrl: 'tel-aviv-365' },
  'jerusalem': { en: 'Jerusalem', tripcomUrl: 'jerusalem-364' },
  'kudüs': { en: 'Jerusalem', tripcomUrl: 'jerusalem-364' },
  
  // === ASIA ===
  'tokyo': { en: 'Tokyo', tripcomUrl: 'tokyo-58' },
  'osaka': { en: 'Osaka', tripcomUrl: 'osaka-55' },
  'kyoto': { en: 'Kyoto', tripcomUrl: 'kyoto-54' },
  'seoul': { en: 'Seoul', tripcomUrl: 'seoul-234' },
  'seul': { en: 'Seoul', tripcomUrl: 'seoul-234' },
  'busan': { en: 'Busan', tripcomUrl: 'busan-232' },
  'singapore': { en: 'Singapore', tripcomUrl: 'singapore-73' },
  'singapur': { en: 'Singapore', tripcomUrl: 'singapore-73' },
  'hong kong': { en: 'Hong Kong', tripcomUrl: 'hong-kong-38' },
  'taipei': { en: 'Taipei', tripcomUrl: 'taipei-359' },
  'bangkok': { en: 'Bangkok', tripcomUrl: 'bangkok-191' },
  'phuket': { en: 'Phuket', tripcomUrl: 'phuket-193' },
  'chiang mai': { en: 'Chiang Mai', tripcomUrl: 'chiang-mai-192' },
  'bali': { en: 'Bali', tripcomUrl: 'bali-264' },
  'jakarta': { en: 'Jakarta', tripcomUrl: 'jakarta-267' },
  'kuala lumpur': { en: 'Kuala Lumpur', tripcomUrl: 'kuala-lumpur-70' },
  'hanoi': { en: 'Hanoi', tripcomUrl: 'hanoi-88' },
  'ho chi minh': { en: 'Ho Chi Minh City', tripcomUrl: 'ho-chi-minh-city-89' },
  'manila': { en: 'Manila', tripcomUrl: 'manila-203' },
  'delhi': { en: 'Delhi', tripcomUrl: 'delhi-25' },
  'mumbai': { en: 'Mumbai', tripcomUrl: 'mumbai-28' },
  'goa': { en: 'Goa', tripcomUrl: 'goa-26' },
  'kathmandu': { en: 'Kathmandu', tripcomUrl: 'kathmandu-464' },
  'colombo': { en: 'Colombo', tripcomUrl: 'colombo-541' },
  'maldives': { en: 'Maldives', tripcomUrl: 'maldives-451' },
  'maldivler': { en: 'Maldives', tripcomUrl: 'maldives-451' },
  
  // === CHINA ===
  'beijing': { en: 'Beijing', tripcomUrl: 'beijing-1' },
  'pekin': { en: 'Beijing', tripcomUrl: 'beijing-1' },
  'shanghai': { en: 'Shanghai', tripcomUrl: 'shanghai-2' },
  'guangzhou': { en: 'Guangzhou', tripcomUrl: 'guangzhou-6' },
  'shenzhen': { en: 'Shenzhen', tripcomUrl: 'shenzhen-5' },
  'xian': { en: "Xi'an", tripcomUrl: 'xian-7' },
  
  // === CENTRAL ASIA ===
  'almaty': { en: 'Almaty', tripcomUrl: 'almaty-373' },
  'astana': { en: 'Astana', tripcomUrl: 'astana-374' },
  'tashkent': { en: 'Tashkent', tripcomUrl: 'tashkent-616' },
  'taşkent': { en: 'Tashkent', tripcomUrl: 'tashkent-616' },
  'bishkek': { en: 'Bishkek', tripcomUrl: 'bishkek-379' },
  'bişkek': { en: 'Bishkek', tripcomUrl: 'bishkek-379' },
  'samarkand': { en: 'Samarkand', tripcomUrl: 'samarkand-617' },
  'semerkant': { en: 'Samarkand', tripcomUrl: 'samarkand-617' },
  
  // === AUSTRALIA & OCEANIA ===
  'sydney': { en: 'Sydney', tripcomUrl: 'sydney-361' },
  'melbourne': { en: 'Melbourne', tripcomUrl: 'melbourne-355' },
  'brisbane': { en: 'Brisbane', tripcomUrl: 'brisbane-352' },
  'perth': { en: 'Perth', tripcomUrl: 'perth-358' },
  'auckland': { en: 'Auckland', tripcomUrl: 'auckland-472' },
  'queenstown': { en: 'Queenstown', tripcomUrl: 'queenstown-476' },
  'fiji': { en: 'Fiji', tripcomUrl: 'fiji-241' },
  
  // === NORTH AMERICA ===
  'new york': { en: 'New York', tripcomUrl: 'new-york-645' },
  'los angeles': { en: 'Los Angeles', tripcomUrl: 'los-angeles-732' },
  'miami': { en: 'Miami', tripcomUrl: 'miami-781' },
  'las vegas': { en: 'Las Vegas', tripcomUrl: 'las-vegas-733' },
  'san francisco': { en: 'San Francisco', tripcomUrl: 'san-francisco-736' },
  'chicago': { en: 'Chicago', tripcomUrl: 'chicago-718' },
  'boston': { en: 'Boston', tripcomUrl: 'boston-712' },
  'seattle': { en: 'Seattle', tripcomUrl: 'seattle-737' },
  'washington': { en: 'Washington D.C.', tripcomUrl: 'washington-740' },
  'hawaii': { en: 'Hawaii', tripcomUrl: 'hawaii-724' },
  'toronto': { en: 'Toronto', tripcomUrl: 'toronto-792' },
  'vancouver': { en: 'Vancouver', tripcomUrl: 'vancouver-803' },
  'montreal': { en: 'Montreal', tripcomUrl: 'montreal-797' },
  'mexico city': { en: 'Mexico City', tripcomUrl: 'mexico-city-441' },
  'cancun': { en: 'Cancun', tripcomUrl: 'cancun-439' },
  'playa del carmen': { en: 'Playa del Carmen', tripcomUrl: 'playa-del-carmen-443' },
  
  // === SOUTH AMERICA ===
  'buenos aires': { en: 'Buenos Aires', tripcomUrl: 'buenos-aires-142' },
  'rio de janeiro': { en: 'Rio de Janeiro', tripcomUrl: 'rio-de-janeiro-152' },
  'sao paulo': { en: 'Sao Paulo', tripcomUrl: 'sao-paulo-153' },
  'lima': { en: 'Lima', tripcomUrl: 'lima-491' },
  'bogota': { en: 'Bogota', tripcomUrl: 'bogota-174' },
  'medellin': { en: 'Medellin', tripcomUrl: 'medellin-175' },
  'cartagena': { en: 'Cartagena', tripcomUrl: 'cartagena-176' },
  'santiago': { en: 'Santiago', tripcomUrl: 'santiago-165' },
  'cusco': { en: 'Cusco', tripcomUrl: 'cusco-492' },
  'quito': { en: 'Quito', tripcomUrl: 'quito-210' },
  
  // === AFRICA ===
  'cairo': { en: 'Cairo', tripcomUrl: 'cairo-605' },
  'kahire': { en: 'Cairo', tripcomUrl: 'cairo-605' },
  'marrakech': { en: 'Marrakech', tripcomUrl: 'marrakech-660' },
  'marakeş': { en: 'Marrakech', tripcomUrl: 'marrakech-660' },
  'casablanca': { en: 'Casablanca', tripcomUrl: 'casablanca-658' },
  'cape town': { en: 'Cape Town', tripcomUrl: 'cape-town-674' },
  'johannesburg': { en: 'Johannesburg', tripcomUrl: 'johannesburg-675' },
  'nairobi': { en: 'Nairobi', tripcomUrl: 'nairobi-375' },
  'zanzibar': { en: 'Zanzibar', tripcomUrl: 'zanzibar-587' },
  'tunis': { en: 'Tunis', tripcomUrl: 'tunis-591' },
  'addis ababa': { en: 'Addis Ababa', tripcomUrl: 'addis-ababa-227' },
  'lagos': { en: 'Lagos', tripcomUrl: 'lagos-473' },
  'accra': { en: 'Accra', tripcomUrl: 'accra-249' },
  'mauritius': { en: 'Mauritius', tripcomUrl: 'mauritius-452' },
  'seychelles': { en: 'Seychelles', tripcomUrl: 'seychelles-533' },
  'seyşeller': { en: 'Seychelles', tripcomUrl: 'seychelles-533' },
  
  // === CARIBBEAN ===
  'havana': { en: 'Havana', tripcomUrl: 'havana-181' },
  'punta cana': { en: 'Punta Cana', tripcomUrl: 'punta-cana-206' },
  'jamaica': { en: 'Jamaica', tripcomUrl: 'jamaica-367' },
  'bahamas': { en: 'Bahamas', tripcomUrl: 'bahamas-145' },
  'aruba': { en: 'Aruba', tripcomUrl: 'aruba-143' },
  
  // === IRELAND ===
  'dublin': { en: 'Dublin', tripcomUrl: 'dublin-254' },
  'galway': { en: 'Galway', tripcomUrl: 'galway-255' },
  'cork': { en: 'Cork', tripcomUrl: 'cork-253' },
  
  // === RUSSIA ===
  'moscow': { en: 'Moscow', tripcomUrl: 'moscow-518' },
  'moskova': { en: 'Moscow', tripcomUrl: 'moscow-518' },
  'saint petersburg': { en: 'Saint Petersburg', tripcomUrl: 'saint-petersburg-519' },
  'st petersburg': { en: 'Saint Petersburg', tripcomUrl: 'saint-petersburg-519' },
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
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

    // Validate and sanitize inputs
    const location = sanitizeString(params.location, MAX_LOCATION_LENGTH);
    const checkIn = validateDate(params.checkIn);
    const checkOut = validateDate(params.checkOut);
    const adults = validateAdults(params.adults);

    // Validate required fields
    if (!checkIn || !checkOut) {
      return new Response(
        JSON.stringify({ error: 'Geçersiz tarih formatı', hotels: [] }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate checkOut is after checkIn
    if (new Date(checkOut) <= new Date(checkIn)) {
      return new Response(
        JSON.stringify({ error: 'Çıkış tarihi giriş tarihinden sonra olmalıdır', hotels: [] }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Hotel search params (validated):", { location, checkIn, checkOut, adults });

    // Find city info
    const normalizedLocation = location.toLowerCase().trim();
    const cityInfo = cityNames[normalizedLocation];
    
    if (!cityInfo) {
      console.log("City not found:", normalizedLocation);
      return new Response(
        JSON.stringify({ 
          hotels: [],
          location,
          checkIn,
          checkOut,
          affiliateLinks: {
            tripcom: `https://www.trip.com/hotels/?locale=tr_TR&curr=TRY`,
            hotellook: `https://search.hotellook.com/?marker=${TRAVELPAYOUTS_PARTNER_ID}`,
          }
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Found city:", cityInfo.en, "Trip.com URL:", cityInfo.tripcomUrl);

    // Generate affiliate links for multiple platforms
    const affiliateLinks = {
      tripcom: `https://www.trip.com/hotels/list?city=${cityInfo.tripcomUrl}&checkin=${checkIn}&checkout=${checkOut}&adult=${adults}&curr=TRY&locale=tr_TR`,
      hotellook: `https://search.hotellook.com/hotels?destination=${cityInfo.en}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&marker=${TRAVELPAYOUTS_PARTNER_ID}`,
    };

    // Generate sample hotel data for display
    const sampleHotels = [
      {
        id: '1',
        name: `${cityInfo.en} Grand Hotel`,
        stars: 5,
        priceFrom: 2500,
        priceAvg: 3200,
        rating: 4.8,
        reviews: 1250,
        location: { lat: 0, lon: 0 },
        photo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
        link: affiliateLinks.tripcom,
      },
      {
        id: '2',
        name: `${cityInfo.en} Boutique Stay`,
        stars: 4,
        priceFrom: 1800,
        priceAvg: 2100,
        rating: 4.6,
        reviews: 890,
        location: { lat: 0, lon: 0 },
        photo: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
        link: affiliateLinks.tripcom,
      },
      {
        id: '3',
        name: `${cityInfo.en} Business Hotel`,
        stars: 4,
        priceFrom: 1500,
        priceAvg: 1800,
        rating: 4.5,
        reviews: 650,
        location: { lat: 0, lon: 0 },
        photo: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
        link: affiliateLinks.tripcom,
      },
      {
        id: '4',
        name: `${cityInfo.en} Budget Inn`,
        stars: 3,
        priceFrom: 800,
        priceAvg: 950,
        rating: 4.2,
        reviews: 420,
        location: { lat: 0, lon: 0 },
        photo: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
        link: affiliateLinks.tripcom,
      },
    ];

    return new Response(
      JSON.stringify({ 
        hotels: sampleHotels,
        location: cityInfo.en,
        checkIn,
        checkOut,
        affiliateLinks,
        affiliateLink: affiliateLinks.tripcom,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    // Log full error for debugging, return generic message to client
    console.error("Hotel search error:", error);
    return new Response(
      JSON.stringify({ error: getGenericErrorMessage(), hotels: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
