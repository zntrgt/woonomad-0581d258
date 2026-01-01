import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

  try {
    const TRAVELPAYOUTS_PARTNER_ID = Deno.env.get("TRAVELPAYOUTS_PARTNER_ID") || "261144";

    const params: HotelSearchParams = await req.json();
    const { location, checkIn, checkOut, adults = 2 } = params;

    console.log("Hotel search params:", params);

    // Find city info
    const normalizedLocation = location?.toLowerCase().trim() || '';
    const cityInfo = cityNames[normalizedLocation];
    
    if (!cityInfo) {
      console.log("City not found:", normalizedLocation);
      // Return generic Trip.com link
      const searchQuery = encodeURIComponent(location || '');
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
        affiliateLink: affiliateLinks.tripcom, // Primary affiliate link
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
