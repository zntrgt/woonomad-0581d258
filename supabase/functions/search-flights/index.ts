import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FlightSearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  tripClass?: string;
  visaFilter?: 'all' | 'visa-free' | 'visa-required';
}

// Visa-free countries for Turkish passport holders (IATA codes)
const VISA_FREE_DESTINATIONS: Record<string, string[]> = {
  // Completely visa-free or visa on arrival
  'visa-free': [
    // Europe
    'TIR', 'PRN', 'SKP', 'SJJ', 'TGD', 'BEG', // Albania, Kosovo, North Macedonia, Bosnia, Montenegro, Serbia
    // Asia
    'ICN', 'GMP', 'NRT', 'HND', 'KIX', // South Korea, Japan
    'SIN', 'KUL', 'BKK', 'DMK', 'CGK', 'DPS', // Singapore, Malaysia, Thailand, Indonesia
    'MNL', 'HKG', 'TPE', // Philippines, Hong Kong, Taiwan
    'KTM', // Nepal
    // Middle East
    'DOH', 'DXB', 'AUH', 'BAH', 'MCT', 'KWI', // Qatar, UAE, Bahrain, Oman, Kuwait
    'AMM', 'BEY', // Jordan, Lebanon
    // Africa
    'TUN', 'CMN', 'RAK', // Tunisia, Morocco
    'CPT', 'JNB', // South Africa
    'NBO', 'DAR', 'ZNZ', // Kenya, Tanzania
    // Americas
    'GRU', 'GIG', 'BSB', // Brazil
    'EZE', 'SCL', 'BOG', 'LIM', 'UIO', // Argentina, Chile, Colombia, Peru, Ecuador
    'PTY', 'SJO', // Panama, Costa Rica
    // Caribbean
    'NAS', 'MBJ', 'SDQ', 'HAV', // Bahamas, Jamaica, Dominican Republic, Cuba
    // Central Asia
    'ALA', 'NQZ', 'TAS', 'FRU', 'GYD', 'TBS', // Kazakhstan, Uzbekistan, Kyrgyzstan, Azerbaijan, Georgia
    // Other
    'ECN', // Northern Cyprus
  ],
  // Schengen + visa required countries
  'visa-required': [
    // Schengen / EU
    'CDG', 'ORY', 'LHR', 'LGW', 'STN', 'FRA', 'MUC', 'BER', 'TXL', // France, UK, Germany
    'AMS', 'BRU', 'VIE', 'ZRH', 'GVA', // Netherlands, Belgium, Austria, Switzerland
    'FCO', 'MXP', 'VCE', 'NAP', // Italy
    'MAD', 'BCN', 'PMI', 'AGP', // Spain
    'LIS', 'OPO', 'ATH', 'SKG', // Portugal, Greece
    'PRG', 'WAW', 'BUD', 'OTP', 'SOF', // Czech, Poland, Hungary, Romania, Bulgaria
    'CPH', 'ARN', 'OSL', 'HEL', // Denmark, Sweden, Norway, Finland
    'DUB', 'RIX', 'VNO', 'TLL', // Ireland, Latvia, Lithuania, Estonia
    // North America
    'JFK', 'LAX', 'ORD', 'MIA', 'SFO', 'EWR', // USA
    'YYZ', 'YVR', 'YUL', // Canada
    // Australia/Oceania
    'SYD', 'MEL', 'AKL', // Australia, New Zealand
    // Other
    'PEK', 'PVG', 'HGH', 'CAN', // China
    'DEL', 'BOM', 'BLR', // India
    'SVO', 'LED', // Russia
  ]
};

// Map destination airport codes to visa status
function getVisaStatus(destinationCode: string): 'visa-free' | 'visa-required' | 'unknown' {
  if (VISA_FREE_DESTINATIONS['visa-free'].includes(destinationCode)) {
    return 'visa-free';
  }
  if (VISA_FREE_DESTINATIONS['visa-required'].includes(destinationCode)) {
    return 'visa-required';
  }
  return 'unknown';
}

// Popular destinations for "anywhere" search
const POPULAR_DESTINATIONS = [
  'BCN', 'ATH', 'FCO', 'CDG', 'AMS', 'LHR', 'DXB', 'DOH',
  'BKK', 'SIN', 'KUL', 'TBS', 'GYD', 'ALA', 'BEG', 'PRN',
  'SKP', 'SJJ', 'TGD', 'AMM', 'BEY', 'CMN', 'TUN'
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get('TRAVELPAYOUTS_API_TOKEN');
    const partnerId = Deno.env.get('TRAVELPAYOUTS_PARTNER_ID');

    if (!apiToken) {
      console.error('TRAVELPAYOUTS_API_TOKEN is not set');
      throw new Error('API configuration error');
    }

    const params: FlightSearchParams = await req.json();
    console.log('Search params:', params);

    const { origin, destination, departDate, returnDate, adults = 1, children = 0, infants = 0, tripClass = 'Y', visaFilter = 'all' } = params;

    if (!origin || !departDate) {
      throw new Error('Missing required parameters: origin, departDate');
    }

    // Handle "anywhere" search (empty destination)
    const isAnywhereSearch = !destination || destination === '';
    let allFlights: any[] = [];

    if (isAnywhereSearch) {
      console.log('Performing anywhere search with visa filter:', visaFilter);
      
      // Filter destinations based on visa preference
      let destinationsToSearch = POPULAR_DESTINATIONS;
      if (visaFilter === 'visa-free') {
        destinationsToSearch = POPULAR_DESTINATIONS.filter(d => getVisaStatus(d) === 'visa-free');
      } else if (visaFilter === 'visa-required') {
        destinationsToSearch = POPULAR_DESTINATIONS.filter(d => getVisaStatus(d) === 'visa-required');
      }

      console.log('Searching destinations:', destinationsToSearch.length);

      // Search for flights to multiple destinations in parallel
      const searchPromises = destinationsToSearch.slice(0, 10).map(async (dest) => {
        try {
          const searchParams = new URLSearchParams({
            token: apiToken,
            origin,
            destination: dest,
            depart_date: departDate,
            ...(returnDate && { return_date: returnDate }),
            currency: 'TRY',
            sorting: 'price',
            limit: '5',
          });

          const apiUrl = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${searchParams.toString()}`;
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          });

          if (response.ok) {
            const data = await response.json();
            return data.data || [];
          }
          return [];
        } catch (e) {
          console.error(`Error searching for ${dest}:`, e);
          return [];
        }
      });

      const results = await Promise.all(searchPromises);
      allFlights = results.flat();
      
      // Sort by price
      allFlights.sort((a, b) => a.price - b.price);
      
      // Limit results
      allFlights = allFlights.slice(0, 30);
      
    } else {
      // Single destination search
      const searchParams = new URLSearchParams({
        token: apiToken,
        origin,
        destination,
        depart_date: departDate,
        ...(returnDate && { return_date: returnDate }),
        currency: 'TRY',
        sorting: 'price',
        limit: '30',
      });

      const apiUrl = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${searchParams.toString()}`;
      console.log('Calling Travelpayouts API:', apiUrl.replace(apiToken, '***'));

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Travelpayouts API error:', response.status, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      allFlights = data.data || [];
    }

    console.log('API response success, data count:', allFlights.length);

    // Apply visa filter to results
    let filteredFlights = allFlights;
    if (visaFilter !== 'all') {
      filteredFlights = allFlights.filter((flight: any) => {
        const status = getVisaStatus(flight.destination);
        if (visaFilter === 'visa-free') {
          return status === 'visa-free';
        } else if (visaFilter === 'visa-required') {
          return status === 'visa-required';
        }
        return true;
      });
    }

    // Transform the response to include affiliate links and visa info
    const flights = filteredFlights.map((flight: any) => ({
      ...flight,
      visaStatus: getVisaStatus(flight.destination),
      affiliateLink: partnerId 
        ? `https://www.aviasales.com/search/${origin}${departDate.replace(/-/g, '')}${flight.destination}${returnDate ? returnDate.replace(/-/g, '') : ''}1?marker=${partnerId}`
        : null,
    }));

    return new Response(JSON.stringify({ 
      success: true, 
      data: flights,
      currency: 'TRY',
      isAnywhereSearch,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in search-flights function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
