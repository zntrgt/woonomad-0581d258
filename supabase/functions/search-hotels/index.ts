import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HotelSearchParams {
  cityId?: string;
  location?: string;
  iata?: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  limit?: number;
  currency?: string;
}

// City to IATA code mapping
const cityToIata: Record<string, string> = {
  'berlin': 'BER',
  'paris': 'PAR',
  'london': 'LON',
  'rome': 'ROM',
  'amsterdam': 'AMS',
  'barcelona': 'BCN',
  'istanbul': 'IST',
  'athens': 'ATH',
  'prague': 'PRG',
  'vienna': 'VIE',
  'dubai': 'DXB',
  'tokyo': 'TYO',
  'new york': 'NYC',
  'los angeles': 'LAX',
  'miami': 'MIA',
  'antalya': 'AYT',
  'izmir': 'ADB',
  'bodrum': 'BJV',
  'tbilisi': 'TBS',
  'skopje': 'SKP',
  'frankfurt': 'FRA',
  'munich': 'MUC',
  'madrid': 'MAD',
  'lisbon': 'LIS',
  'milan': 'MIL',
  'florence': 'FLR',
  'venice': 'VCE',
  'budapest': 'BUD',
  'warsaw': 'WAW',
  'stockholm': 'STO',
  'oslo': 'OSL',
  'copenhagen': 'CPH',
  'helsinki': 'HEL',
  'brussels': 'BRU',
  'zurich': 'ZRH',
  'geneva': 'GVA',
  'dublin': 'DUB',
  'edinburgh': 'EDI',
  'singapore': 'SIN',
  'bangkok': 'BKK',
  'hong kong': 'HKG',
  'seoul': 'SEL',
  'taipei': 'TPE',
  'sydney': 'SYD',
  'melbourne': 'MEL',
  'toronto': 'YTO',
  'vancouver': 'YVR',
  'cairo': 'CAI',
  'marrakech': 'RAK',
  'cape town': 'CPT',
};

// Helper to create MD5 hash
async function md5(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("MD5", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TRAVELPAYOUTS_API_TOKEN = Deno.env.get("TRAVELPAYOUTS_API_TOKEN");
    const TRAVELPAYOUTS_PARTNER_ID = Deno.env.get("TRAVELPAYOUTS_PARTNER_ID");

    if (!TRAVELPAYOUTS_API_TOKEN || !TRAVELPAYOUTS_PARTNER_ID) {
      console.error("Missing Travelpayouts credentials");
      return new Response(
        JSON.stringify({ error: "Hotel API credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const params: HotelSearchParams = await req.json();
    const { cityId, location, iata, checkIn, checkOut, adults = 2, limit = 10, currency = "USD" } = params;

    console.log("Hotel search params:", params);

    // Get IATA code
    let targetIata = iata;
    if (!targetIata && location) {
      const normalizedLocation = location.toLowerCase().trim();
      targetIata = cityToIata[normalizedLocation];
    }

    if (!targetIata) {
      console.log("City not found in IATA mapping:", location);
      // Return affiliate link only
      return new Response(
        JSON.stringify({ 
          error: `City "${location}" not found`,
          hotels: [],
          affiliateLink: `https://search.hotellook.com/?marker=${TRAVELPAYOUTS_PARTNER_ID}`
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Using IATA code:", targetIata, "for location:", location);

    // Create signature for V2 API
    // Signature format: token:marker:adultsCount:checkIn:checkOut:childAge1:childrenCount:currency:customerIP:iata:lang:waitForResult
    const lang = "en";
    const waitForResult = "0";
    const childrenCount = "0";
    const childAge1 = "";
    const customerIP = "127.0.0.1";
    
    // Build signature string (only include non-empty values in order)
    const signatureString = `${TRAVELPAYOUTS_API_TOKEN}:${TRAVELPAYOUTS_PARTNER_ID}:${adults}:${checkIn}:${checkOut}:${childAge1}:${childrenCount}:${currency}:${customerIP}:${targetIata}:${lang}:${waitForResult}`;
    const signature = await md5(signatureString);
    
    console.log("Signature string (masked):", signatureString.replace(TRAVELPAYOUTS_API_TOKEN, '***'));

    // Start the search
    const searchStartUrl = `http://engine.hotellook.com/api/v2/search/start.json?iata=${targetIata}&checkIn=${checkIn}&checkOut=${checkOut}&adultsCount=${adults}&childrenCount=${childrenCount}&currency=${currency}&lang=${lang}&customerIP=${customerIP}&waitForResult=${waitForResult}&marker=${TRAVELPAYOUTS_PARTNER_ID}&signature=${signature}`;
    
    console.log("Search start URL:", searchStartUrl.replace(signature, '***'));
    
    const startResponse = await fetch(searchStartUrl);
    const startText = await startResponse.text();
    
    console.log("Start response status:", startResponse.status);
    console.log("Start response:", startText.slice(0, 500));

    let searchId = "";
    try {
      const startData = JSON.parse(startText);
      searchId = startData.searchId;
    } catch (e) {
      console.error("Failed to parse start response");
    }

    if (!searchId) {
      // Return affiliate link as fallback
      return new Response(
        JSON.stringify({ 
          hotels: [],
          iata: targetIata,
          checkIn,
          checkOut,
          currency,
          affiliateLink: `https://search.hotellook.com/hotels?destination=${targetIata}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&marker=${TRAVELPAYOUTS_PARTNER_ID}`
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Wait a bit for results
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get results
    const resultSignatureString = `${TRAVELPAYOUTS_API_TOKEN}:${TRAVELPAYOUTS_PARTNER_ID}:${limit}:${searchId}:sortAsc:sortBy`;
    const resultSignature = await md5(resultSignatureString);
    
    const getResultUrl = `http://engine.hotellook.com/api/v2/search/getResult.json?searchId=${searchId}&limit=${limit}&marker=${TRAVELPAYOUTS_PARTNER_ID}&signature=${resultSignature}`;
    
    console.log("Get result URL:", getResultUrl.replace(resultSignature, '***'));
    
    const resultResponse = await fetch(getResultUrl);
    const resultText = await resultResponse.text();
    
    console.log("Result response status:", resultResponse.status);
    console.log("Result response:", resultText.slice(0, 500));

    let hotels: any[] = [];
    try {
      const resultData = JSON.parse(resultText);
      if (resultData.result && Array.isArray(resultData.result)) {
        hotels = resultData.result.map((hotel: any) => ({
          id: String(hotel.id || hotel.hotelId),
          name: hotel.hotelName || hotel.name || "Hotel",
          stars: hotel.stars || 0,
          priceFrom: hotel.minPriceTotal || hotel.priceFrom || 0,
          priceAvg: hotel.priceAvg || hotel.minPriceTotal || 0,
          rating: hotel.rating || 0,
          reviews: hotel.reviews || 0,
          location: {
            lat: hotel.location?.lat || hotel.geo?.lat || 0,
            lon: hotel.location?.lon || hotel.geo?.lon || 0,
          },
          photo: hotel.photoId ? `https://photo.hotellook.com/image_v2/limit/${hotel.photoId}/800/520.auto` : null,
          link: `https://search.hotellook.com/hotels?destination=${targetIata}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&marker=${TRAVELPAYOUTS_PARTNER_ID}${hotel.id ? `&hotelId=${hotel.id}` : ''}`,
        }));
      }
    } catch (e) {
      console.error("Failed to parse result response:", e);
    }

    return new Response(
      JSON.stringify({ 
        hotels,
        iata: targetIata,
        searchId,
        checkIn,
        checkOut,
        currency,
        affiliateLink: `https://search.hotellook.com/hotels?destination=${targetIata}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&marker=${TRAVELPAYOUTS_PARTNER_ID}`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Hotel search failed";
    console.error("Hotel search error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, hotels: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
