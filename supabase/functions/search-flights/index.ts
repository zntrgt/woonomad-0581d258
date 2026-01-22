import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 30;

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
const VALID_CONTINENTS = ['EU', 'AS', 'AM', 'AF', 'OC'];

function validateAirportCode(code: unknown): string | null {
  if (typeof code !== 'string') return null;
  const upper = code.toUpperCase().trim();
  if (upper === '' || AIRPORT_CODE_REGEX.test(upper)) return upper;
  if (VALID_CONTINENTS.includes(upper)) return upper;
  return null;
}

function validateDate(dateStr: unknown): string | null {
  if (typeof dateStr !== 'string') return null;
  if (!DATE_REGEX.test(dateStr)) return null;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  
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

function getGenericErrorMessage(): string {
  return 'Uçuş araması başarısız oldu. Lütfen tekrar deneyin.';
}

interface FlightLeg {
  origin: string;
  destination: string;
  departDate: string;
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
  currency?: string;
  // Multi-city support
  tripType?: 'roundtrip' | 'oneway' | 'multicity';
  legs?: FlightLeg[];
}

// GLOBAL VISA DATA - Comprehensive list for Turkish passport holders
const VISA_FREE_COUNTRIES: Set<string> = new Set([
  // Turkish Domestic
  'IST', 'SAW', 'ESB', 'ADB', 'AYT', 'BJV', 'DLM', 'TZX', 'GZT', 'DIY', 'VAN',
  'ADA', 'ASR', 'ERZ', 'SZF', 'GNY', 'MLX', 'HTY', 'EZS', 'KYA', 'DNZ', 'TEQ', 'CKZ', 'NAV',
  // Balkans
  'TIR', 'PRN', 'SKP', 'SJJ', 'TGD', 'BEG', 'ZAG', 'SPU', 'DBV', 'LJU',
  // Asia Pacific - visa-free or visa on arrival
  'ICN', 'GMP', 'NRT', 'HND', 'KIX', 'NGO', 'FUK', 'CTS', 'OKA', 'HIJ',
  'SIN', 'KUL', 'PEN', 'LGK', 'BKI', 'BKK', 'DMK', 'HKT', 'CNX', 'USM', 'KBV',
  'CGK', 'DPS', 'SUB', 'JOG', 'LOP',
  'MNL', 'CEB', 'DVO', 'CRK',
  'HKG', 'TPE', 'KHH', 'TSA',
  'KTM', 'PBH',
  'SGN', 'HAN', 'DAD', 'CXR', 'PQC',
  'PNH', 'REP', 'VTE', 'LPQ', 'RGN',
  // Middle East
  'DOH', 'DXB', 'AUH', 'SHJ', 'BAH', 'MCT', 'KWI', 'AMM', 'AQJ', 'BEY',
  // Africa
  'TUN', 'CMN', 'RAK', 'FEZ', 'TNG', 'AGA',
  'CPT', 'JNB', 'DUR',
  'NBO', 'MBA', 'DAR', 'ZNZ', 'JRO', 'EBB', 'KGL',
  'MRU', 'SEZ', 'TNR', 'RUN',
  // Americas (visa-free or visa on arrival)
  'GRU', 'GIG', 'BSB', 'CGH', 'SDU', 'CNF', 'FOR', 'REC', 'SSA', 'POA', 'CWB', 'FLN',
  'EZE', 'AEP', 'COR', 'MDZ', 'BRC', 'IGR', 'USH',
  'SCL', 'IPC', 'PUQ',
  'BOG', 'MDE', 'CTG',
  'LIM', 'CUZ', 'UIO', 'GYE', 'GPS',
  'CCS', 'VVI', 'LPB', 'ASU', 'MVD', 'GEO', 'PBM',
  'PTY', 'SJO', 'LIR', 'GUA', 'SAL', 'BZE', 'MGA', 'TGU',
  'NAS', 'MBJ', 'KIN', 'SDQ', 'PUJ', 'HAV', 'VRA', 'SJU', 'AUA', 'CUR', 'BGI', 'POS', 'SXM',
  'CUN', 'MEX', 'GDL', 'SJD', 'PVR', 'MTY', 'TIJ',
  // Central Asia & Caucasus
  'ALA', 'NQZ', 'TSE', 'TAS', 'SKD', 'BHK', 'FRU', 'OSS', 'DYU', 'ASB', 'GYD', 'TBS', 'KUT', 'BUS', 'EVN',
  // Cyprus
  'ECN', 'LCA', 'PFO',
  // Pacific
  'NAN', 'APW', 'TBU', 'VLI',
]);

const VISA_REQUIRED_COUNTRIES: Set<string> = new Set([
  // Europe (Schengen)
  'CDG', 'ORY', 'LHR', 'LGW', 'STN', 'LTN', 'MAN', 'BHX', 'EDI', 'GLA', 'DUB', 'SNN',
  'FRA', 'MUC', 'BER', 'DUS', 'HAM', 'CGN', 'STR', 'HAJ', 'NUE', 'LEJ',
  'AMS', 'RTM', 'EIN', 'BRU', 'CRL', 'LUX',
  'VIE', 'SZG', 'INN', 'ZRH', 'GVA', 'BSL',
  'FCO', 'MXP', 'VCE', 'NAP', 'BLQ', 'FLR', 'PSA', 'CTA', 'PMO',
  'MAD', 'BCN', 'PMI', 'AGP', 'ALC', 'VLC', 'SVQ', 'IBZ', 'TFS', 'LPA', 'BIO',
  'LIS', 'OPO', 'FAO', 'FNC', 'PDL',
  'ATH', 'SKG', 'HER', 'CFU', 'RHO', 'JMK', 'JTR', 'KGS', 'ZTH', 'CHQ',
  'MLA',
  'PRG', 'WAW', 'KRK', 'GDN', 'WRO', 'POZ', 'BUD', 'OTP', 'CLJ', 'IAS', 'TSR', 'SOF', 'VAR', 'BOJ',
  'CPH', 'ARN', 'GOT', 'OSL', 'BGO', 'TRD', 'HEL', 'KEF',
  'RIX', 'VNO', 'KUN', 'TLL',
  // Russia
  'SVO', 'DME', 'VKO', 'LED', 'AER', 'KZN',
  // North America
  'JFK', 'LAX', 'ORD', 'MIA', 'SFO', 'EWR', 'LGA', 'ATL', 'DFW', 'DEN', 'SEA', 'BOS', 'LAS',
  'IAD', 'DCA', 'PHL', 'CLT', 'MCO', 'FLL', 'TPA', 'MDW', 'IAH', 'HOU', 'MSP', 'DTW', 'MSY',
  'SAN', 'PHX', 'PDX', 'SJC', 'OAK', 'HNL', 'OGG', 'ANC',
  'YYZ', 'YVR', 'YUL', 'YYC', 'YOW', 'YEG', 'YHZ', 'YWG',
  // Oceania
  'SYD', 'MEL', 'BNE', 'PER', 'ADL', 'CNS', 'OOL', 'DRW', 'HBA',
  'AKL', 'WLG', 'CHC', 'ZQN',
  'PPT', 'NOU', 'POM',
  // China
  'PEK', 'PKX', 'PVG', 'SHA', 'CAN', 'SZX', 'CTU', 'CKG', 'XIY', 'HGH', 'NKG', 'WUH', 'KMG', 'XMN', 'TAO', 'SYX', 'HAK',
  'MFM',
  // India & Pakistan
  'DEL', 'BOM', 'BLR', 'MAA', 'CCU', 'HYD', 'COK', 'GOI', 'AMD', 'JAI',
  'ISB', 'KHI', 'LHE',
  // Bangladesh & Sri Lanka & Maldives
  'DAC', 'CMB', 'MLE',
  // Middle East requiring visa
  'RUH', 'JED', 'MED', 'DMM', 'TLV', 'DAM', 'BGW', 'EBL', 'NJF', 'IKA', 'THR', 'MHD', 'SYZ', 'IFN',
  // Ukraine & Moldova
  'KBP', 'LWO', 'ODS', 'KIV',
  // Mongolia
  'UBN',
  // North Africa requiring visa
  'CAI', 'HRG', 'SSH', 'LXR', 'ASW', 'ALG', 'TIP',
  // West Africa
  'LOS', 'ABV', 'ACC', 'DKR', 'ABJ', 'ADD',
]);

function getVisaStatus(destinationCode: string): 'visa-free' | 'visa-required' | 'unknown' {
  if (VISA_FREE_COUNTRIES.has(destinationCode)) return 'visa-free';
  if (VISA_REQUIRED_COUNTRIES.has(destinationCode)) return 'visa-required';
  return 'unknown';
}

const VALID_CURRENCIES = ['TRY', 'USD', 'EUR', 'GBP', 'AED', 'JPY', 'SGD', 'THB', 'KRW', 'MXN', 'BRL', 'IDR', 'MYR', 'PHP', 'VND', 'INR', 'AUD', 'NZD', 'CAD', 'CHF'];

function validateCurrency(currency: unknown): string {
  if (typeof currency !== 'string') return 'TRY';
  const upper = currency.toUpperCase();
  return VALID_CURRENCIES.includes(upper) ? upper : 'TRY';
}

// GLOBAL POPULAR DESTINATIONS - Expanded worldwide
const GLOBAL_POPULAR_DESTINATIONS = [
  // Europe
  'TIR', 'PRN', 'SKP', 'SJJ', 'TGD', 'BEG', 'ZAG', 'DBV',
  'CDG', 'LHR', 'FRA', 'MUC', 'BER', 'AMS', 'BRU', 'VIE', 'ZRH',
  'FCO', 'MXP', 'VCE', 'MAD', 'BCN', 'LIS', 'ATH', 'PRG', 'WAW', 'BUD',
  'CPH', 'ARN', 'OSL', 'HEL', 'DUB', 'KEF',
  // Asia
  'ICN', 'NRT', 'HND', 'KIX', 'SIN', 'KUL', 'BKK', 'HKT', 'CGK', 'DPS',
  'MNL', 'HKG', 'TPE', 'KTM', 'CNX', 'SGN', 'HAN', 'PNH', 'REP',
  // Middle East
  'DOH', 'DXB', 'AUH', 'BAH', 'MCT', 'KWI', 'AMM', 'BEY',
  // Africa
  'TUN', 'CMN', 'RAK', 'CPT', 'JNB', 'NBO', 'DAR', 'ZNZ', 'MRU', 'SEZ', 'CAI',
  // Americas
  'JFK', 'LAX', 'MIA', 'SFO', 'YYZ', 'MEX', 'CUN',
  'GRU', 'GIG', 'EZE', 'SCL', 'BOG', 'LIM', 'PTY', 'SJO', 'MBJ', 'PUJ', 'HAV',
  // Central Asia & Caucasus
  'ALA', 'TAS', 'FRU', 'GYD', 'TBS',
  // Oceania
  'SYD', 'MEL', 'AKL', 'NAN',
];

const CONTINENT_DESTINATIONS: Record<string, string[]> = {
  'EU': [
    'TIR', 'PRN', 'SKP', 'SJJ', 'TGD', 'BEG', 'ZAG', 'SPU', 'DBV', 'LJU',
    'CDG', 'ORY', 'LHR', 'LGW', 'STN', 'MAN', 'EDI', 'DUB',
    'FRA', 'MUC', 'BER', 'DUS', 'HAM', 'CGN', 'STR',
    'AMS', 'BRU', 'VIE', 'SZG', 'ZRH', 'GVA',
    'FCO', 'MXP', 'VCE', 'NAP', 'FLR', 'BLQ',
    'MAD', 'BCN', 'PMI', 'AGP', 'IBZ', 'TFS', 'LPA',
    'LIS', 'OPO', 'FAO', 'ATH', 'SKG', 'HER', 'JMK', 'JTR', 'RHO',
    'PRG', 'WAW', 'KRK', 'BUD', 'OTP', 'SOF',
    'CPH', 'ARN', 'OSL', 'HEL', 'KEF', 'RIX', 'VNO', 'TLL',
    'MLA', 'LCA',
  ],
  'AS': [
    'ICN', 'GMP', 'NRT', 'HND', 'KIX', 'NGO', 'FUK', 'CTS',
    'SIN', 'KUL', 'BKK', 'DMK', 'HKT', 'CNX', 'CGK', 'DPS', 'SUB', 'JOG',
    'MNL', 'CEB', 'HKG', 'TPE', 'KTM',
    'SGN', 'HAN', 'DAD', 'PNH', 'REP', 'VTE', 'RGN',
    'DOH', 'DXB', 'AUH', 'BAH', 'MCT', 'KWI', 'AMM', 'BEY', 'JED', 'RUH',
    'ALA', 'NQZ', 'TAS', 'FRU', 'GYD', 'TBS', 'KUT', 'BUS',
    'PEK', 'PVG', 'CAN', 'HGH', 'DEL', 'BOM', 'BLR', 'MLE',
  ],
  'AM': [
    'JFK', 'LAX', 'ORD', 'MIA', 'SFO', 'EWR', 'ATL', 'DFW', 'DEN', 'SEA', 'BOS', 'LAS',
    'MCO', 'FLL', 'IAD', 'SAN', 'PHX', 'HNL',
    'YYZ', 'YVR', 'YUL', 'YYC',
    'MEX', 'CUN', 'GDL', 'SJD', 'PVR',
    'GRU', 'GIG', 'BSB', 'EZE', 'SCL', 'BOG', 'MDE', 'LIM', 'CUZ', 'UIO',
    'PTY', 'SJO', 'NAS', 'MBJ', 'SDQ', 'PUJ', 'HAV', 'SJU', 'AUA',
  ],
  'AF': [
    'TUN', 'CMN', 'RAK', 'FEZ', 'AGA', 'CAI', 'HRG', 'SSH', 'LXR',
    'CPT', 'JNB', 'DUR', 'NBO', 'MBA', 'DAR', 'ZNZ', 'JRO', 'ADD', 'EBB', 'KGL',
    'MRU', 'SEZ', 'TNR', 'LOS', 'ACC', 'DKR',
  ],
  'OC': [
    'SYD', 'MEL', 'BNE', 'PER', 'ADL', 'CNS', 'OOL',
    'AKL', 'WLG', 'CHC', 'ZQN',
    'NAN', 'PPT', 'NOU', 'POM',
  ],
};

const NEARBY_ALTERNATIVES: Record<string, string[]> = {
  'IST': ['SAW', 'ESB', 'AYT', 'ADB'],
  'LHR': ['LGW', 'STN', 'LTN', 'CDG', 'AMS'],
  'CDG': ['ORY', 'LHR', 'AMS', 'BRU'],
  'FRA': ['MUC', 'DUS', 'BER', 'ZRH'],
  'JFK': ['EWR', 'LGA', 'BOS', 'PHL'],
  'LAX': ['SFO', 'SAN', 'LAS', 'PHX'],
  'DXB': ['AUH', 'SHJ', 'DOH', 'BAH'],
  'SIN': ['KUL', 'BKK', 'CGK', 'HKG'],
  'NRT': ['HND', 'KIX', 'NGO', 'ICN'],
  'SYD': ['MEL', 'BNE', 'AKL', 'PER'],
  'DPS': ['CGK', 'SUB', 'SIN', 'KUL'],
  'BKK': ['DMK', 'HKT', 'SIN', 'KUL'],
};

// Helper function for single leg search
async function searchSingleLeg(
  apiToken: string,
  partnerId: string | undefined,
  origin: string,
  destination: string,
  departDate: string,
  currency: string,
  tripClass: string,
): Promise<any[]> {
  const searchParams = new URLSearchParams({
    token: apiToken,
    origin,
    destination,
    departure_at: departDate,
    one_way: 'true',
    currency,
    sorting: 'price',
    limit: '20',
  });

  const apiUrl = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${searchParams.toString()}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      console.error(`API error for ${origin}->${destination}:`, response.status);
      return [];
    }

    const data = await response.json();
    return data?.data || [];
  } catch (e) {
    console.error(`Error searching ${origin}->${destination}:`, e);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

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

    const currency = validateCurrency(params.currency);
    const tripClass = validateTripClass(params.tripClass);
    const visaFilter = validateVisaFilter(params.visaFilter);

    // ============================================
    // MULTI-CITY SEARCH HANDLING
    // ============================================
    if (params.tripType === 'multicity' && params.legs && params.legs.length >= 2) {
      console.log('Multi-city search with', params.legs.length, 'legs');
      
      // Validate all legs
      const validatedLegs: FlightLeg[] = [];
      for (const leg of params.legs) {
        const origin = validateAirportCode(leg.origin);
        const destination = validateAirportCode(leg.destination);
        const departDate = validateDate(leg.departDate);
        
        if (!origin || !destination || !departDate) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: `Geçersiz bacak verisi: ${leg.origin} -> ${leg.destination}`
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        validatedLegs.push({ origin, destination, departDate });
      }
      
      // Search all legs in parallel
      const legSearchPromises = validatedLegs.map(leg => 
        searchSingleLeg(apiToken, partnerId, leg.origin, leg.destination, leg.departDate, currency, tripClass)
      );
      
      const legResults = await Promise.all(legSearchPromises);
      
      // Build combined results
      const multiCityResults: any[] = [];
      
      // Find best flight for each leg
      const bestFlightsPerLeg = legResults.map((flights, index) => {
        if (flights.length === 0) return null;
        // Sort by price and get cheapest
        const sorted = [...flights].sort((a, b) => (a.price || 0) - (b.price || 0));
        return {
          ...sorted[0],
          legIndex: index,
          legOrigin: validatedLegs[index].origin,
          legDestination: validatedLegs[index].destination,
          legDate: validatedLegs[index].departDate,
        };
      });
      
      // Check if all legs have results
      const allLegsHaveResults = bestFlightsPerLeg.every(f => f !== null);
      
      if (allLegsHaveResults) {
        // Calculate total price
        const totalPrice = bestFlightsPerLeg.reduce((sum, f) => sum + (f?.price || 0), 0);
        
        // Create combined result
        const combinedResult = {
          type: 'multicity',
          totalPrice,
          legs: bestFlightsPerLeg,
          currency,
        };
        
        // Also return individual options for each leg
        const allOptions = legResults.map((flights, index) => ({
          legIndex: index,
          origin: validatedLegs[index].origin,
          destination: validatedLegs[index].destination,
          date: validatedLegs[index].departDate,
          flights: flights.slice(0, 10).map((f: any) => ({
            ...f,
            visaStatus: getVisaStatus(f.destination),
            affiliateLink: partnerId
              ? `https://www.aviasales.com/search/${validatedLegs[index].origin}${validatedLegs[index].departDate.replace(/-/g, '')}${validatedLegs[index].destination}1?marker=${partnerId}`
              : null,
          })),
        }));
        
        return new Response(JSON.stringify({ 
          success: true, 
          data: {
            combined: combinedResult,
            legs: allOptions,
          },
          currency,
          isMultiCity: true,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        // Some legs don't have results
        const missingLegs = validatedLegs
          .filter((_, i) => !bestFlightsPerLeg[i])
          .map(l => `${l.origin} → ${l.destination}`);
        
        return new Response(JSON.stringify({ 
          success: true,
          data: {
            combined: null,
            legs: legResults.map((flights, index) => ({
              legIndex: index,
              origin: validatedLegs[index].origin,
              destination: validatedLegs[index].destination,
              date: validatedLegs[index].departDate,
              flights: flights.slice(0, 10).map((f: any) => ({
                ...f,
                visaStatus: getVisaStatus(f.destination),
              })),
              noResults: flights.length === 0,
            })),
          },
          currency,
          isMultiCity: true,
          warning: `Şu rotalar için uçuş bulunamadı: ${missingLegs.join(', ')}`,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // ============================================
    // STANDARD SEARCH (roundtrip/oneway)
    // ============================================
    const origin = validateAirportCode(params.origin);
    const destination = validateAirportCode(params.destination) || '';
    const departDate = validateDate(params.departDate);
    const returnDate = params.returnDate ? validateDate(params.returnDate) : undefined;
    const adults = validatePassengerCount(params.adults, 1);
    const children = validatePassengerCount(params.children, 0);
    const infants = validatePassengerCount(params.infants, 0);
    const flexibleDates = params.flexibleDates === true;

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

    if (returnDate && new Date(returnDate) <= new Date(departDate)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Dönüş tarihi gidiş tarihinden sonra olmalıdır'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Search params (validated):', { origin, destination, departDate, returnDate, adults, children, infants, tripClass, visaFilter, flexibleDates, currency });

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
    let nearbyAlternatives: string[] = [];

    if (isAnywhereSearch || isContinentSearch) {
      console.log('Performing', isContinentSearch ? `continent (${destination})` : 'anywhere', 'search with visa filter:', visaFilter);
      
      let baseDestinations = isContinentSearch 
        ? CONTINENT_DESTINATIONS[destination] || GLOBAL_POPULAR_DESTINATIONS
        : GLOBAL_POPULAR_DESTINATIONS;
      
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
            currency,
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
      // Specific destination search - GLOBAL SUPPORT
      let nearbyDateFlights: any[] = [];
      
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
            currency,
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
        if (exact.length > 0) return { exact, monthData: [] };

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

        return { exact: filtered, monthData };
      });

      const results = await Promise.all(searchPromises);
      allFlights = results.flatMap(r => r.exact);
      
      const allMonthData = results.flatMap(r => r.monthData);

      if (allFlights.length === 0 && allMonthData.length > 0) {
        const sorted = allMonthData
          .filter((f: any) => f.departure_at)
          .sort((a: any, b: any) => {
            const dateA = new Date(a.departure_at).getTime();
            const dateB = new Date(b.departure_at).getTime();
            const target = new Date(departDate).getTime();
            return Math.abs(dateA - target) - Math.abs(dateB - target);
          });
        
        nearbyDateFlights = sorted.slice(0, 5);
        console.log('No exact date results, returning nearby dates:', nearbyDateFlights.length);
      }

      if (allFlights.length === 0 && nearbyDateFlights.length === 0) {
        nearbyAlternatives = NEARBY_ALTERNATIVES[destination] || NEARBY_ALTERNATIVES[origin] || [];
        console.log('No results, suggesting alternatives:', nearbyAlternatives);
      }
      
      if (allFlights.length === 0 && nearbyDateFlights.length > 0) {
        allFlights = nearbyDateFlights;
      }
    }

    const skipStrictDateFilter = !isAnywhereSearch && !isContinentSearch && allFlights.length > 0;
    
    let dateFilteredFlights: any[];
    if (skipStrictDateFilter) {
      dateFilteredFlights = allFlights;
    } else {
      dateFilteredFlights = allFlights.filter((flight: any) => {
        const dep = dateOnly(flight.departure_at);
        if (!dep || !allowedDepartDates.has(dep)) return false;

        if (returnDate) {
          const ret = dateOnly(flight.return_at);
          if (!ret) return false;
          return allowedPairs.has(`${dep}|${ret}`);
        }

        return true;
      });
    }

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

    const finalFlights = (isAnywhereSearch || isContinentSearch) ? sortedFlights.slice(0, 50) : sortedFlights;

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
      currency,
      isAnywhereSearch: isAnywhereSearch || isContinentSearch,
      nearbyAlternatives: flights.length === 0 ? nearbyAlternatives : [],
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
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
