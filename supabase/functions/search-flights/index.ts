import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests per minute per IP (stricter for external API)

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
const AIRPORT_CODE_REGEX = /^[A-Z]{3}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MAX_PASSENGERS = 9;
const MIN_PASSENGERS = 0;
const VALID_TRIP_CLASSES = ['Y', 'C', 'F'];
const VALID_VISA_FILTERS = ['all', 'visa-free', 'visa-required'];
const VALID_CONTINENTS = ['EU', 'AS', 'AM', 'AF'];

// Input validation helpers
function validateAirportCode(code: unknown): string | null {
  if (typeof code !== 'string') return null;
  const upper = code.toUpperCase().trim();
  if (upper === '' || AIRPORT_CODE_REGEX.test(upper)) return upper;
  // Allow continent codes
  if (VALID_CONTINENTS.includes(upper)) return upper;
  return null;
}

function validateDate(dateStr: unknown): string | null {
  if (typeof dateStr !== 'string') return null;
  if (!DATE_REGEX.test(dateStr)) return null;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  
  // Check date is not too far in future (2 years)
  const twoYearsFromNow = new Date();
  twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
  
  if (date > twoYearsFromNow) return null;
  
  return dateStr;
}

function validatePassengerCount(count: unknown, defaultVal: number = 1): number {
  const num = typeof count === 'number' ? count : parseInt(String(count), 10);
  if (isNaN(num) || num < MIN_PASSENGERS || num > MAX_PASSENGERS) return defaultVal;
  return num;
}

function validateTripClass(tripClass: unknown): string {
  if (typeof tripClass !== 'string') return 'Y';
  const upper = tripClass.toUpperCase();
  return VALID_TRIP_CLASSES.includes(upper) ? upper : 'Y';
}

function validateVisaFilter(filter: unknown): 'all' | 'visa-free' | 'visa-required' {
  if (typeof filter !== 'string') return 'all';
  return VALID_VISA_FILTERS.includes(filter) ? filter as 'all' | 'visa-free' | 'visa-required' : 'all';
}

// Generic error message - don't expose internal details
function getGenericErrorMessage(): string {
  return 'Uçuş araması başarısız oldu. Lütfen tekrar deneyin.';
}

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
  'visa-free': [
    'TIR', 'PRN', 'SKP', 'SJJ', 'TGD', 'BEG',
    'ICN', 'GMP', 'NRT', 'HND', 'KIX',
    'SIN', 'KUL', 'BKK', 'DMK', 'CGK', 'DPS',
    'MNL', 'HKG', 'TPE',
    'KTM',
    'DOH', 'DXB', 'AUH', 'BAH', 'MCT', 'KWI',
    'AMM', 'BEY',
    'TUN', 'CMN', 'RAK',
    'CPT', 'JNB',
    'NBO', 'DAR', 'ZNZ',
    'GRU', 'GIG', 'BSB',
    'EZE', 'SCL', 'BOG', 'LIM', 'UIO',
    'PTY', 'SJO',
    'NAS', 'MBJ', 'SDQ', 'HAV',
    'ALA', 'NQZ', 'TAS', 'FRU', 'GYD', 'TBS',
    'ECN',
  ],
  'visa-required': [
    'CDG', 'ORY', 'LHR', 'LGW', 'STN', 'FRA', 'MUC', 'BER', 'TXL',
    'AMS', 'BRU', 'VIE', 'ZRH', 'GVA',
    'FCO', 'MXP', 'VCE', 'NAP',
    'MAD', 'BCN', 'PMI', 'AGP',
    'LIS', 'OPO', 'ATH', 'SKG',
    'PRG', 'WAW', 'BUD', 'OTP', 'SOF',
    'CPH', 'ARN', 'OSL', 'HEL',
    'DUB', 'RIX', 'VNO', 'TLL',
    'JFK', 'LAX', 'ORD', 'MIA', 'SFO', 'EWR',
    'YYZ', 'YVR', 'YUL',
    'SYD', 'MEL', 'AKL',
    'PEK', 'PVG', 'HGH', 'CAN',
    'DEL', 'BOM', 'BLR',
    'SVO', 'LED',
  ]
};

function getVisaStatus(destinationCode: string): 'visa-free' | 'visa-required' | 'unknown' {
  if (VISA_FREE_DESTINATIONS['visa-free'].includes(destinationCode)) {
    return 'visa-free';
  }
  if (VISA_FREE_DESTINATIONS['visa-required'].includes(destinationCode)) {
    return 'visa-required';
  }
  return 'unknown';
}

const POPULAR_DESTINATIONS = [
  'TIR', 'PRN', 'SKP', 'SJJ', 'TGD', 'BEG',
  'ICN', 'GMP', 'NRT', 'HND', 'KIX',
  'SIN', 'KUL', 'BKK', 'DMK', 'CGK', 'DPS',
  'MNL', 'HKG', 'TPE', 'KTM',
  'DOH', 'DXB', 'AUH', 'BAH', 'MCT', 'KWI',
  'AMM', 'BEY',
  'TUN', 'CMN', 'RAK', 'CPT', 'JNB',
  'NBO', 'DAR', 'ZNZ',
  'GRU', 'GIG', 'BSB',
  'EZE', 'SCL', 'BOG', 'LIM', 'UIO',
  'PTY', 'SJO',
  'NAS', 'MBJ', 'SDQ', 'HAV',
  'ALA', 'NQZ', 'TAS', 'FRU', 'GYD', 'TBS',
  'ECN',
  'CDG', 'ORY', 'LHR', 'LGW', 'STN', 'FRA', 'MUC', 'BER', 'TXL',
  'AMS', 'BRU', 'VIE', 'ZRH', 'GVA',
  'FCO', 'MXP', 'VCE', 'NAP',
  'MAD', 'BCN', 'PMI', 'AGP',
  'LIS', 'OPO', 'ATH', 'SKG',
  'PRG', 'WAW', 'BUD', 'OTP', 'SOF',
  'CPH', 'ARN', 'OSL', 'HEL',
  'DUB', 'RIX', 'VNO', 'TLL',
  'JFK', 'LAX', 'ORD', 'MIA', 'SFO', 'EWR',
  'YYZ', 'YVR', 'YUL',
  'SYD', 'MEL', 'AKL',
  'PEK', 'PVG', 'HGH', 'CAN',
  'DEL', 'BOM', 'BLR',
  'SVO', 'LED',
];

const CONTINENT_DESTINATIONS: Record<string, string[]> = {
  'EU': [
    'TIR', 'PRN', 'SKP', 'SJJ', 'TGD', 'BEG',
    'CDG', 'ORY', 'LHR', 'LGW', 'STN', 'FRA', 'MUC', 'BER', 'TXL',
    'AMS', 'BRU', 'VIE', 'ZRH', 'GVA', 
    'FCO', 'MXP', 'VCE', 'NAP', 
    'MAD', 'BCN', 'PMI', 'AGP', 
    'LIS', 'OPO', 'ATH', 'SKG', 
    'PRG', 'WAW', 'BUD', 'OTP', 'SOF', 
    'CPH', 'ARN', 'OSL', 'HEL', 
    'DUB', 'RIX', 'VNO', 'TLL',
  ],
  'AS': [
    'ICN', 'GMP', 'NRT', 'HND', 'KIX',
    'SIN', 'KUL', 'BKK', 'DMK', 'CGK', 'DPS',
    'MNL', 'HKG', 'TPE', 'KTM', 
    'DOH', 'DXB', 'AUH', 'BAH', 'MCT', 'KWI',
    'AMM', 'BEY', 'TLV',
    'ALA', 'NQZ', 'TAS', 'FRU', 'GYD', 'TBS',
    'PEK', 'PVG', 'HGH', 'CAN',
    'DEL', 'BOM', 'BLR',
  ],
  'AM': [
    'JFK', 'LAX', 'ORD', 'MIA', 'SFO', 'EWR',
    'YYZ', 'YVR', 'YUL',
    'GRU', 'GIG', 'BSB',
    'EZE', 'SCL', 'BOG', 'LIM', 'UIO',
    'PTY', 'SJO',
    'NAS', 'MBJ', 'SDQ', 'HAV',
  ],
  'AF': [
    'TUN', 'CMN', 'RAK', 'CAI',
    'CPT', 'JNB',
    'NBO', 'DAR', 'ZNZ',
  ],
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const clientIP = getClientIP(req);
  const rateLimit = getRateLimitInfo(clientIP);
  
  if (!rateLimit.allowed) {
    console.log(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Çok fazla istek gönderildi. Lütfen bir dakika bekleyin.' 
    }), {
      status: 429,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetTime / 1000))
      },
    });
  }

  try {
    const apiToken = Deno.env.get('TRAVELPAYOUTS_API_TOKEN');
    const partnerId = Deno.env.get('TRAVELPAYOUTS_PARTNER_ID');

    if (!apiToken) {
      console.error('TRAVELPAYOUTS_API_TOKEN is not set');
      return new Response(JSON.stringify({ 
        success: false, 
        error: getGenericErrorMessage()
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let params: FlightSearchParams;
    try {
      params = await req.json();
    } catch {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Geçersiz istek formatı'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate inputs
    const origin = validateAirportCode(params.origin);
    const destination = validateAirportCode(params.destination) || '';
    const departDate = validateDate(params.departDate);
    const returnDate = params.returnDate ? validateDate(params.returnDate) : undefined;
    const adults = validatePassengerCount(params.adults, 1);
    const children = validatePassengerCount(params.children, 0);
    const infants = validatePassengerCount(params.infants, 0);
    const tripClass = validateTripClass(params.tripClass);
    const visaFilter = validateVisaFilter(params.visaFilter);
    const flexibleDates = params.flexibleDates === true;

    // Validate required fields
    if (!origin) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Geçersiz kalkış havalimanı kodu'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!departDate) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Geçersiz tarih formatı'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate returnDate is after departDate if provided
    if (returnDate && new Date(returnDate) <= new Date(departDate)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Dönüş tarihi gidiş tarihinden sonra olmalıdır'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Search params (validated):', { origin, destination, departDate, returnDate, adults, children, infants, tripClass, visaFilter, flexibleDates });

    const shifts = flexibleDates ? [-1, 0, 1] : [0];

    const addDaysToYmd = (ymd: string, days: number): string => {
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

    const dateOnly = (iso?: string): string | null => {
      if (!iso || typeof iso !== 'string') return null;
      const parts = iso.split('T');
      return parts[0] || null;
    };

    const isAnywhereSearch = !destination || destination === '';
    const isContinentSearch = VALID_CONTINENTS.includes(destination);
    let allFlights: any[] = [];

    if (isAnywhereSearch || isContinentSearch) {
      console.log('Performing', isContinentSearch ? `continent (${destination})` : 'anywhere', 'search with visa filter:', visaFilter);
      
      let baseDestinations = isContinentSearch 
        ? CONTINENT_DESTINATIONS[destination] || POPULAR_DESTINATIONS
        : POPULAR_DESTINATIONS;
      
      let destinationsToSearch = baseDestinations;
      if (visaFilter === 'visa-free') {
        destinationsToSearch = baseDestinations.filter(d => getVisaStatus(d) === 'visa-free');
      } else if (visaFilter === 'visa-required') {
        destinationsToSearch = baseDestinations.filter(d => getVisaStatus(d) === 'visa-required');
      }

      console.log('Searching destinations:', destinationsToSearch.length);

      const callApiWithFallback = async (dest: string, pair: { depart: string; return?: string }) => {
        const oneWay = !pair.return;

        const callApi = async (departure_at: string, return_at?: string) => {
          const searchParams = new URLSearchParams({
            token: apiToken,
            origin,
            destination: dest,
            departure_at,
            ...(return_at ? { return_at } : {}),
            one_way: oneWay ? 'true' : 'false',
            currency: 'TRY',
            sorting: 'price',
            limit: '10',
          });

          const apiUrl = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${searchParams.toString()}`;
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          });

          if (!response.ok) return [];
          const data = await response.json();
          return data?.data || [];
        };

        try {
          const exact = await callApi(pair.depart, pair.return);
          if (exact.length > 0) return exact;

          const monthDepart = pair.depart.slice(0, 7);
          const monthReturn = pair.return ? pair.return.slice(0, 7) : undefined;

          const monthData = await callApi(monthDepart, monthReturn);

          const filtered = monthData.filter((f: any) => {
            const dep = dateOnly(f.departure_at);
            if (dep !== pair.depart) return false;

            if (pair.return) {
              const ret = dateOnly(f.return_at);
              return ret === pair.return;
            }

            return true;
          });

          return filtered;
        } catch (e) {
          console.error(`Error searching for ${dest} (${pair.depart}):`, e);
          return [];
        }
      };

      const searchPromises = destinationsToSearch.flatMap((dest) =>
        searchPairs.map((pair) => callApiWithFallback(dest, pair))
      );

      const results = await Promise.all(searchPromises);
      allFlights = results.flat();
      
      console.log('Anywhere search raw results:', allFlights.length);

    } else {
      const searchPromises = searchPairs.map(async (pair) => {
        const oneWay = !pair.return;

        const callApi = async (departure_at: string, return_at?: string) => {
          const searchParams = new URLSearchParams({
            token: apiToken,
            origin,
            destination,
            departure_at,
            ...(return_at ? { return_at } : {}),
            one_way: oneWay ? 'true' : 'false',
            currency: 'TRY',
            sorting: 'price',
            limit: '30',
          });

          const apiUrl = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${searchParams.toString()}`;
          console.log('Calling API for:', { origin, destination, departure_at });

          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          });

          if (!response.ok) {
            console.error('API error:', response.status);
            return [];
          }

          const data = await response.json();
          return data?.data || [];
        };

        const exact = await callApi(pair.depart, pair.return);
        if (exact.length > 0) return exact;

        const monthDepart = pair.depart.slice(0, 7);
        const monthReturn = pair.return ? pair.return.slice(0, 7) : undefined;
        console.log('Exact date empty, trying month cache:', { monthDepart, monthReturn });

        const monthData = await callApi(monthDepart, monthReturn);

        const filtered = monthData.filter((f: any) => {
          const dep = dateOnly(f.departure_at);
          if (dep !== pair.depart) return false;

          if (pair.return) {
            const ret = dateOnly(f.return_at);
            return ret === pair.return;
          }

          return true;
        });

        return filtered;
      });

      const results = await Promise.all(searchPromises);
      allFlights = results.flat();
    }

    console.log('API response success, data count:', allFlights.length);

    const dateFilteredFlights = allFlights.filter((flight: any) => {
      const dep = dateOnly(flight.departure_at);
      if (!dep || !allowedDepartDates.has(dep)) return false;

      if (returnDate) {
        const ret = dateOnly(flight.return_at);
        if (!ret) return false;
        return allowedPairs.has(`${dep}|${ret}`);
      }

      return true;
    });

    console.log('After date filter:', dateFilteredFlights.length);

    const uniq = new Map<string, any>();
    for (const f of dateFilteredFlights) {
      const key = `${f.flight_number ?? ''}|${f.departure_at ?? ''}|${f.return_at ?? ''}|${f.destination ?? ''}`;
      if (!uniq.has(key)) uniq.set(key, f);
    }

    const dedupedFlights = Array.from(uniq.values());
    console.log('After date filter + dedupe:', dedupedFlights.length);

    let filteredFlights = dedupedFlights;
    if (visaFilter !== 'all') {
      filteredFlights = dedupedFlights.filter((flight: any) => {
        const status = getVisaStatus(flight.destination);
        if (visaFilter === 'visa-free') return status === 'visa-free';
        if (visaFilter === 'visa-required') return status === 'visa-required';
        return true;
      });
    }

    const sortedFlights = [...filteredFlights].sort(
      (a, b) => (a?.price ?? Number.POSITIVE_INFINITY) - (b?.price ?? Number.POSITIVE_INFINITY)
    );

    const finalFlights = (isAnywhereSearch || isContinentSearch) ? sortedFlights.slice(0, 30) : sortedFlights;

    const flights = finalFlights.map((flight: any) => {
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
      isAnywhereSearch: isAnywhereSearch || isContinentSearch,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    // Log full error for debugging, return generic message to client
    console.error('Error in search-flights function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: getGenericErrorMessage()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
