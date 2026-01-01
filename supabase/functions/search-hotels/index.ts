import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HotelSearchParams {
  cityId?: string;
  location?: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  limit?: number;
  currency?: string;
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
    const { cityId, location, checkIn, checkOut, adults = 2, limit = 10, currency = "TRY" } = params;

    console.log("Hotel search params:", params);

    // First, get city ID if location is provided instead of cityId
    let targetCityId = cityId;
    
    if (!targetCityId && location) {
      // City name to ID mapping for common cities
      const cityMapping: Record<string, string> = {
        'berlin': '12153',
        'paris': '2734',
        'london': '2114',
        'rome': '3181',
        'amsterdam': '523',
        'barcelona': '2871',
        'istanbul': '10636',
        'athens': '1368',
        'prague': '4318',
        'vienna': '5765',
        'dubai': '1943',
        'tokyo': '4973',
        'new york': '3558',
        'los angeles': '2592',
        'miami': '3093',
        'antalya': '10637',
        'izmir': '10638',
        'bodrum': '10639',
        'tbilisi': '2765',
        'skopje': '3445',
        'frankfurt': '12192',
        'munich': '12456',
        'madrid': '3006',
        'lisbon': '2537',
        'milan': '3054',
        'florence': '2023',
        'venice': '5674',
        'budapest': '1640',
        'warsaw': '5902',
        'stockholm': '4680',
        'oslo': '3575',
        'copenhagen': '1809',
        'helsinki': '2174',
        'brussels': '1598',
        'zurich': '6023',
        'geneva': '2100',
        'dublin': '1944',
        'edinburgh': '1977',
        'singapore': '4251',
        'bangkok': '1339',
        'hong kong': '2251',
        'seoul': '4177',
        'taipei': '4835',
        'sydney': '4816',
        'melbourne': '3036',
        'toronto': '5068',
        'vancouver': '5604',
        'cairo': '1673',
        'marrakech': '3004',
        'cape town': '1687',
      };
      
      const normalizedLocation = location.toLowerCase().trim();
      targetCityId = cityMapping[normalizedLocation];
      
      if (!targetCityId) {
        console.log("City not found in mapping, searching:", normalizedLocation);
        // Return empty with fallback message
        return new Response(
          JSON.stringify({ error: `City "${location}" not found`, hotels: [] }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log("Found city ID:", targetCityId, "for location:", location);
    }

    if (!targetCityId) {
      return new Response(
        JSON.stringify({ error: "City ID or location required", hotels: [] }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Search for hotels using Hotellook cache API with token
    const searchUrl = `http://engine.hotellook.com/api/v2/cache.json?location=${targetCityId}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&limit=${limit}&currency=${currency}&token=${TRAVELPAYOUTS_API_TOKEN}`;

    console.log("Hotel search URL:", searchUrl.replace(TRAVELPAYOUTS_API_TOKEN, '***'));

    const searchResponse = await fetch(searchUrl);
    const responseText = await searchResponse.text();
    
    console.log("Response status:", searchResponse.status);
    console.log("Response preview:", responseText.slice(0, 300));
    
    // If no hotels found or API returns error, return with affiliate link only
    let searchData: any[] = [];
    try {
      searchData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON");
    }
    
    if (!Array.isArray(searchData) || searchData.length === 0) {
      // Return fallback affiliate link
      return new Response(
        JSON.stringify({ 
          hotels: [],
          cityId: targetCityId,
          checkIn,
          checkOut,
          currency,
          affiliateLink: `https://search.hotellook.com/hotels?destination=${targetCityId}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&marker=${TRAVELPAYOUTS_PARTNER_ID}`
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    

    console.log("Hotel search response:", JSON.stringify(searchData).slice(0, 500));

    // Transform the results
    const hotels = Array.isArray(searchData) ? searchData.map((hotel: any) => ({
      id: hotel.hotelId || hotel.hotel_id,
      name: hotel.hotelName || hotel.hotel_name || "Unknown Hotel",
      stars: hotel.stars || 0,
      priceFrom: hotel.priceFrom || hotel.price_from || 0,
      priceAvg: hotel.priceAvg || hotel.price_avg || 0,
      rating: hotel.rating || 0,
      reviews: hotel.reviews || 0,
      location: {
        lat: hotel.location?.lat || hotel.lat,
        lon: hotel.location?.lon || hotel.lon,
      },
      photo: hotel.photoId ? `https://photo.hotellook.com/image_v2/limit/${hotel.photoId}/800/520.auto` : null,
      link: `https://search.hotellook.com/hotels?destination=${targetCityId}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&marker=${TRAVELPAYOUTS_PARTNER_ID}&hotelId=${hotel.hotelId || hotel.hotel_id}`,
    })) : [];

    return new Response(
      JSON.stringify({ 
        hotels,
        cityId: targetCityId,
        checkIn,
        checkOut,
        currency
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
