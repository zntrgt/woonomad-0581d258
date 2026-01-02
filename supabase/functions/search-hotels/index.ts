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

// City name to Trip.com city keyword mapping
const cityNames: Record<string, { en: string; tripcomUrl: string }> = {
  'berlin': { en: 'Berlin', tripcomUrl: 'berlin-182' },
  'paris': { en: 'Paris', tripcomUrl: 'paris-418' },
  'london': { en: 'London', tripcomUrl: 'london-100' },
  'londra': { en: 'London', tripcomUrl: 'london-100' },
  'rome': { en: 'Rome', tripcomUrl: 'rome-303' },
  'roma': { en: 'Rome', tripcomUrl: 'rome-303' },
  'amsterdam': { en: 'Amsterdam', tripcomUrl: 'amsterdam-93' },
  'barcelona': { en: 'Barcelona', tripcomUrl: 'barcelona-562' },
  'barselona': { en: 'Barcelona', tripcomUrl: 'barcelona-562' },
  'istanbul': { en: 'Istanbul', tripcomUrl: 'istanbul-359' },
  'athens': { en: 'Athens', tripcomUrl: 'athens-342' },
  'atina': { en: 'Athens', tripcomUrl: 'athens-342' },
  'prague': { en: 'Prague', tripcomUrl: 'prague-317' },
  'prag': { en: 'Prague', tripcomUrl: 'prague-317' },
  'vienna': { en: 'Vienna', tripcomUrl: 'vienna-131' },
  'viyana': { en: 'Vienna', tripcomUrl: 'vienna-131' },
  'dubai': { en: 'Dubai', tripcomUrl: 'dubai-614' },
  'tokyo': { en: 'Tokyo', tripcomUrl: 'tokyo-58' },
  'new york': { en: 'New York', tripcomUrl: 'new-york-645' },
  'los angeles': { en: 'Los Angeles', tripcomUrl: 'los-angeles-732' },
  'miami': { en: 'Miami', tripcomUrl: 'miami-781' },
  'antalya': { en: 'Antalya', tripcomUrl: 'antalya-360' },
  'izmir': { en: 'Izmir', tripcomUrl: 'izmir-361' },
  'bodrum': { en: 'Bodrum', tripcomUrl: 'bodrum-1116' },
  'tbilisi': { en: 'Tbilisi', tripcomUrl: 'tbilisi-887' },
  'tiflis': { en: 'Tbilisi', tripcomUrl: 'tbilisi-887' },
  'frankfurt': { en: 'Frankfurt', tripcomUrl: 'frankfurt-189' },
  'munich': { en: 'Munich', tripcomUrl: 'munich-196' },
  'münih': { en: 'Munich', tripcomUrl: 'munich-196' },
  'madrid': { en: 'Madrid', tripcomUrl: 'madrid-556' },
  'lisbon': { en: 'Lisbon', tripcomUrl: 'lisbon-498' },
  'lizbon': { en: 'Lisbon', tripcomUrl: 'lisbon-498' },
  'milan': { en: 'Milan', tripcomUrl: 'milan-294' },
  'milano': { en: 'Milan', tripcomUrl: 'milan-294' },
  'florence': { en: 'Florence', tripcomUrl: 'florence-285' },
  'floransa': { en: 'Florence', tripcomUrl: 'florence-285' },
  'venice': { en: 'Venice', tripcomUrl: 'venice-312' },
  'venedik': { en: 'Venice', tripcomUrl: 'venice-312' },
  'budapest': { en: 'Budapest', tripcomUrl: 'budapest-268' },
  'budapeşte': { en: 'Budapest', tripcomUrl: 'budapest-268' },
  'warsaw': { en: 'Warsaw', tripcomUrl: 'warsaw-330' },
  'varşova': { en: 'Warsaw', tripcomUrl: 'warsaw-330' },
  'stockholm': { en: 'Stockholm', tripcomUrl: 'stockholm-123' },
  'oslo': { en: 'Oslo', tripcomUrl: 'oslo-475' },
  'copenhagen': { en: 'Copenhagen', tripcomUrl: 'copenhagen-169' },
  'kopenhag': { en: 'Copenhagen', tripcomUrl: 'copenhagen-169' },
  'helsinki': { en: 'Helsinki', tripcomUrl: 'helsinki-240' },
  'brussels': { en: 'Brussels', tripcomUrl: 'brussels-148' },
  'brüksel': { en: 'Brussels', tripcomUrl: 'brussels-148' },
  'zurich': { en: 'Zurich', tripcomUrl: 'zurich-138' },
  'zürih': { en: 'Zurich', tripcomUrl: 'zurich-138' },
  'geneva': { en: 'Geneva', tripcomUrl: 'geneva-134' },
  'cenevre': { en: 'Geneva', tripcomUrl: 'geneva-134' },
  'dublin': { en: 'Dublin', tripcomUrl: 'dublin-254' },
  'edinburgh': { en: 'Edinburgh', tripcomUrl: 'edinburgh-111' },
  'singapore': { en: 'Singapore', tripcomUrl: 'singapore-73' },
  'singapur': { en: 'Singapore', tripcomUrl: 'singapore-73' },
  'bangkok': { en: 'Bangkok', tripcomUrl: 'bangkok-191' },
  'hong kong': { en: 'Hong Kong', tripcomUrl: 'hong-kong-38' },
  'seoul': { en: 'Seoul', tripcomUrl: 'seoul-234' },
  'seul': { en: 'Seoul', tripcomUrl: 'seoul-234' },
  'taipei': { en: 'Taipei', tripcomUrl: 'taipei-359' },
  'sydney': { en: 'Sydney', tripcomUrl: 'sydney-361' },
  'melbourne': { en: 'Melbourne', tripcomUrl: 'melbourne-355' },
  'toronto': { en: 'Toronto', tripcomUrl: 'toronto-792' },
  'vancouver': { en: 'Vancouver', tripcomUrl: 'vancouver-803' },
  'cairo': { en: 'Cairo', tripcomUrl: 'cairo-605' },
  'kahire': { en: 'Cairo', tripcomUrl: 'cairo-605' },
  'marrakech': { en: 'Marrakech', tripcomUrl: 'marrakech-660' },
  'marakeş': { en: 'Marrakech', tripcomUrl: 'marrakech-660' },
  'cape town': { en: 'Cape Town', tripcomUrl: 'cape-town-674' },
  'skopje': { en: 'Skopje', tripcomUrl: 'skopje-2374' },
  'üsküp': { en: 'Skopje', tripcomUrl: 'skopje-2374' },
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
