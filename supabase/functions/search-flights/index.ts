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
  flexibleDates?: boolean;
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

    const { origin, destination, departDate, returnDate, adults = 1, children = 0, infants = 0, tripClass = 'Y', visaFilter = 'all', flexibleDates = false } = params;

    // Flexible dates: when enabled, we search the selected date plus +/- 1 day.
    // Important: for round-trip searches we shift BOTH depart and return by the same amount.
    const shifts = flexibleDates ? [-1, 0, 1] : [0];

    const addDaysToYmd = (ymd: string, days: number): string => {
      // Use UTC midnight to avoid timezone drift
      const d = new Date(`${ymd}T00:00:00Z`);
      d.setUTCDate(d.getUTCDate() + days);
      return d.toISOString().slice(0, 10);
    };

    const searchPairs = shifts.map((shift) => ({
      depart: addDaysToYmd(departDate, shift),
      return: returnDate ? addDaysToYmd(returnDate, shift) : undefined,
    }));

    const allowedDepartDates = new Set(searchPairs.map((p) => p.depart));
    const allowedPairs = new Set(searchPairs.map((p) => `${p.depart}|${p.return ?? ''}`));

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

      // Search for flights to multiple destinations (and dates) in parallel
      const destinations = destinationsToSearch.slice(0, 10);
      const searchPromises = destinations.flatMap((dest) =>
        searchPairs.map(async (pair) => {
          try {
            const searchParams = new URLSearchParams({
              token: apiToken,
              origin,
              destination: dest,
              depart_date: pair.depart,
              ...(pair.return ? { return_date: pair.return } : {}),
              currency: 'TRY',
              sorting: 'price',
              limit: '5',
            });

            const apiUrl = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${searchParams.toString()}`;
            const response = await fetch(apiUrl, {
              method: 'GET',
              headers: { 'Accept': 'application/json' },
            });

            if (!response.ok) return [];
            const data = await response.json();
            return data.data || [];
          } catch (e) {
            console.error(`Error searching for ${dest} (${pair.depart}):`, e);
            return [];
          }
        })
      );

      const results = await Promise.all(searchPromises);
      allFlights = results.flat();
      
      // Sort by price
      allFlights.sort((a, b) => a.price - b.price);
      
      // Limit results
      allFlights = allFlights.slice(0, 30);
      
    } else {
      // Single destination search
      const searchPromises = searchPairs.map(async (pair) => {
        const searchParams = new URLSearchParams({
          token: apiToken,
          origin,
          destination,
          depart_date: pair.depart,
          ...(pair.return ? { return_date: pair.return } : {}),
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
          return [];
        }

        const data = await response.json();
        return data.data || [];
      });

      const results = await Promise.all(searchPromises);
      allFlights = results.flat();
    }

    console.log('API response success, data count:', allFlights.length);

    // 1) Strictly filter results by the selected date(s).
    // The upstream API may return nearby dates even when you send a single date.
    const dateOnly = (iso?: string): string | null => {
      if (!iso || typeof iso !== 'string') return null;
      const parts = iso.split('T');
      return parts[0] || null;
    };

    const dateFilteredFlights = allFlights.filter((flight: any) => {
      const dep = dateOnly(flight.departure_at);
      if (!dep || !allowedDepartDates.has(dep)) return false;

      // Round-trip: require matching (depart, return) pair.
      if (returnDate) {
        const ret = dateOnly(flight.return_at);
        if (!ret) return false;
        return allowedPairs.has(`${dep}|${ret}`);
      }

      return true;
    });

    // De-duplicate flights (the same flight can appear multiple times when we query multiple dates)
    const uniq = new Map<string, any>();
    for (const f of dateFilteredFlights) {
      const key = `${f.flight_number ?? ''}|${f.departure_at ?? ''}|${f.return_at ?? ''}|${f.destination ?? ''}`;
      if (!uniq.has(key)) uniq.set(key, f);
    }

    const dedupedFlights = Array.from(uniq.values());
    console.log('After date filter + dedupe:', dedupedFlights.length);

    // 2) Apply visa filter to results
    let filteredFlights = dedupedFlights;
    if (visaFilter !== 'all') {
      filteredFlights = dedupedFlights.filter((flight: any) => {
        const status = getVisaStatus(flight.destination);
        if (visaFilter === 'visa-free') return status === 'visa-free';
        if (visaFilter === 'visa-required') return status === 'visa-required';
        return true;
      });
    }

    // Transform the response to include affiliate links and visa info
    const flights = filteredFlights.map((flight: any) => {
      const depYmd = (flight.departure_at ? String(flight.departure_at).split('T')[0] : departDate) || departDate;
      const retYmd = flight.return_at ? String(flight.return_at).split('T')[0] : undefined;

      return {
        ...flight,
        visaStatus: getVisaStatus(flight.destination),
        affiliateLink: partnerId
          ? `https://www.aviasales.com/search/${origin}${depYmd.replace(/-/g, '')}${flight.destination}${retYmd ? retYmd.replace(/-/g, '') : ''}1?marker=${partnerId}`
          : null,
      };
    });

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
