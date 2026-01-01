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
      // Use Hotellook location lookup
      const lookupUrl = `https://engine.hotellook.com/api/v2/lookup.json?query=${encodeURIComponent(location)}&lang=tr&lookFor=city&limit=1&token=${TRAVELPAYOUTS_API_TOKEN}`;
      
      const lookupResponse = await fetch(lookupUrl);
      const lookupData = await lookupResponse.json();
      
      console.log("City lookup result:", lookupData);
      
      if (lookupData.results?.locations?.[0]?.id) {
        targetCityId = lookupData.results.locations[0].id;
      } else {
        return new Response(
          JSON.stringify({ error: "City not found", hotels: [] }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (!targetCityId) {
      return new Response(
        JSON.stringify({ error: "City ID or location required", hotels: [] }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Search for hotels using Hotellook cache API
    const searchUrl = `https://engine.hotellook.com/api/v2/cache.json?location=${targetCityId}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&limit=${limit}&currency=${currency}&token=${TRAVELPAYOUTS_API_TOKEN}`;

    console.log("Hotel search URL:", searchUrl);

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

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
