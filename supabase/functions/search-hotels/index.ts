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

// City name to Hotellook location ID mapping (Travelpayouts API)
const cityLocations: Record<string, { en: string; locationId: string; iata: string }> = {
  // === GERMANY ===
  'berlin': { en: 'Berlin', locationId: '12153', iata: 'BER' },
  'frankfurt': { en: 'Frankfurt', locationId: '12168', iata: 'FRA' },
  'munich': { en: 'Munich', locationId: '12193', iata: 'MUC' },
  'münih': { en: 'Munich', locationId: '12193', iata: 'MUC' },
  'hamburg': { en: 'Hamburg', locationId: '12175', iata: 'HAM' },
  'cologne': { en: 'Cologne', locationId: '12160', iata: 'CGN' },
  'köln': { en: 'Cologne', locationId: '12160', iata: 'CGN' },
  
  // === FRANCE ===
  'paris': { en: 'Paris', locationId: '418', iata: 'PAR' },
  'nice': { en: 'Nice', locationId: '411', iata: 'NCE' },
  'nis': { en: 'Nice', locationId: '411', iata: 'NCE' },
  'lyon': { en: 'Lyon', locationId: '406', iata: 'LYS' },
  'marseille': { en: 'Marseille', locationId: '409', iata: 'MRS' },
  'marsilya': { en: 'Marseille', locationId: '409', iata: 'MRS' },
  
  // === UK ===
  'london': { en: 'London', locationId: '100', iata: 'LON' },
  'londra': { en: 'London', locationId: '100', iata: 'LON' },
  'manchester': { en: 'Manchester', locationId: '104', iata: 'MAN' },
  'edinburgh': { en: 'Edinburgh', locationId: '111', iata: 'EDI' },
  
  // === ITALY ===
  'rome': { en: 'Rome', locationId: '303', iata: 'ROM' },
  'roma': { en: 'Rome', locationId: '303', iata: 'ROM' },
  'milan': { en: 'Milan', locationId: '294', iata: 'MIL' },
  'milano': { en: 'Milan', locationId: '294', iata: 'MIL' },
  'florence': { en: 'Florence', locationId: '285', iata: 'FLR' },
  'floransa': { en: 'Florence', locationId: '285', iata: 'FLR' },
  'venice': { en: 'Venice', locationId: '312', iata: 'VCE' },
  'venedik': { en: 'Venice', locationId: '312', iata: 'VCE' },
  
  // === SPAIN ===
  'barcelona': { en: 'Barcelona', locationId: '562', iata: 'BCN' },
  'barselona': { en: 'Barcelona', locationId: '562', iata: 'BCN' },
  'madrid': { en: 'Madrid', locationId: '556', iata: 'MAD' },
  'sevilla': { en: 'Seville', locationId: '570', iata: 'SVQ' },
  'seville': { en: 'Seville', locationId: '570', iata: 'SVQ' },
  
  // === PORTUGAL ===
  'lisbon': { en: 'Lisbon', locationId: '498', iata: 'LIS' },
  'lizbon': { en: 'Lisbon', locationId: '498', iata: 'LIS' },
  'porto': { en: 'Porto', locationId: '502', iata: 'OPO' },
  
  // === NETHERLANDS ===
  'amsterdam': { en: 'Amsterdam', locationId: '93', iata: 'AMS' },
  'rotterdam': { en: 'Rotterdam', locationId: '96', iata: 'RTM' },
  
  // === AUSTRIA ===
  'vienna': { en: 'Vienna', locationId: '131', iata: 'VIE' },
  'viyana': { en: 'Vienna', locationId: '131', iata: 'VIE' },
  'salzburg': { en: 'Salzburg', locationId: '129', iata: 'SZG' },
  
  // === SWITZERLAND ===
  'zurich': { en: 'Zurich', locationId: '138', iata: 'ZRH' },
  'zürih': { en: 'Zurich', locationId: '138', iata: 'ZRH' },
  'geneva': { en: 'Geneva', locationId: '134', iata: 'GVA' },
  'cenevre': { en: 'Geneva', locationId: '134', iata: 'GVA' },
  
  // === EASTERN EUROPE ===
  'prague': { en: 'Prague', locationId: '317', iata: 'PRG' },
  'prag': { en: 'Prague', locationId: '317', iata: 'PRG' },
  'budapest': { en: 'Budapest', locationId: '268', iata: 'BUD' },
  'budapeşte': { en: 'Budapest', locationId: '268', iata: 'BUD' },
  'warsaw': { en: 'Warsaw', locationId: '330', iata: 'WAW' },
  'varşova': { en: 'Warsaw', locationId: '330', iata: 'WAW' },
  
  // === GREECE ===
  'athens': { en: 'Athens', locationId: '342', iata: 'ATH' },
  'atina': { en: 'Athens', locationId: '342', iata: 'ATH' },
  'santorini': { en: 'Santorini', locationId: '350', iata: 'JTR' },
  
  // === TURKEY ===
  'istanbul': { en: 'Istanbul', locationId: '359', iata: 'IST' },
  'antalya': { en: 'Antalya', locationId: '360', iata: 'AYT' },
  'izmir': { en: 'Izmir', locationId: '361', iata: 'ADB' },
  'bodrum': { en: 'Bodrum', locationId: '1116', iata: 'BJV' },
  
  // === MIDDLE EAST ===
  'dubai': { en: 'Dubai', locationId: '614', iata: 'DXB' },
  'doha': { en: 'Doha', locationId: '506', iata: 'DOH' },
  
  // === ASIA ===
  'tokyo': { en: 'Tokyo', locationId: '58', iata: 'TYO' },
  'osaka': { en: 'Osaka', locationId: '55', iata: 'OSA' },
  'bangkok': { en: 'Bangkok', locationId: '191', iata: 'BKK' },
  'singapore': { en: 'Singapore', locationId: '73', iata: 'SIN' },
  'singapur': { en: 'Singapore', locationId: '73', iata: 'SIN' },
  'bali': { en: 'Bali', locationId: '264', iata: 'DPS' },
  'hong kong': { en: 'Hong Kong', locationId: '38', iata: 'HKG' },
  
  // === USA ===
  'new york': { en: 'New York', locationId: '645', iata: 'NYC' },
  'los angeles': { en: 'Los Angeles', locationId: '732', iata: 'LAX' },
  'miami': { en: 'Miami', locationId: '781', iata: 'MIA' },
  'las vegas': { en: 'Las Vegas', locationId: '733', iata: 'LAS' },
  
  // === CAUCASUS ===
  'tbilisi': { en: 'Tbilisi', locationId: '887', iata: 'TBS' },
  'tiflis': { en: 'Tbilisi', locationId: '887', iata: 'TBS' },
  'baku': { en: 'Baku', locationId: '144', iata: 'GYD' },
  'bakü': { en: 'Baku', locationId: '144', iata: 'GYD' },
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

    // Validate and sanitize inputs
    const location = sanitizeString(params.location, MAX_LOCATION_LENGTH);
    const checkIn = validateDate(params.checkIn);
    const checkOut = validateDate(params.checkOut);
    const adults = validateAdults(params.adults);
    const limit = params.limit || 12;
    const currency = params.currency || 'TRY';

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
    const cityInfo = cityLocations[normalizedLocation];
    
    if (!cityInfo) {
      console.log("City not found:", normalizedLocation);
      // Return affiliate link even if city not found
      return new Response(
        JSON.stringify({ 
          hotels: [],
          location,
          checkIn,
          checkOut,
          affiliateLink: `https://search.hotellook.com/?marker=${TRAVELPAYOUTS_PARTNER_ID}&destination=${encodeURIComponent(location)}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Found city:", cityInfo.en, "IATA:", cityInfo.iata);

    // Generate Hotellook affiliate link (Travelpayouts)
    const affiliateLink = `https://search.hotellook.com/hotels?destination=${cityInfo.iata}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&currency=${currency}&marker=${TRAVELPAYOUTS_PARTNER_ID}`;

    // Try to fetch real hotel data from Travelpayouts API
    let hotels: any[] = [];
    
    if (TRAVELPAYOUTS_API_TOKEN) {
      try {
        // Use Hotellook API for hotel search
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

    // If no API results, generate sample hotels
    if (hotels.length === 0) {
      console.log("Using sample hotel data");
      hotels = [
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
          link: affiliateLink,
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
          link: affiliateLink,
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
          link: affiliateLink,
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
          link: affiliateLink,
        },
        {
          id: '5',
          name: `${cityInfo.en} Central Suites`,
          stars: 4,
          priceFrom: 1600,
          priceAvg: 1900,
          rating: 4.4,
          reviews: 780,
          location: { lat: 0, lon: 0 },
          photo: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
          link: affiliateLink,
        },
        {
          id: '6',
          name: `${cityInfo.en} Luxury Palace`,
          stars: 5,
          priceFrom: 3500,
          priceAvg: 4200,
          rating: 4.9,
          reviews: 2100,
          location: { lat: 0, lon: 0 },
          photo: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop',
          link: affiliateLink,
        },
      ];
    }

    return new Response(
      JSON.stringify({ 
        hotels,
        location: cityInfo.en,
        iata: cityInfo.iata,
        checkIn,
        checkOut,
        currency,
        affiliateLink,
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
