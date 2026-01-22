import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MonthlyPricesParams {
  origin: string;
  destination: string;
  month: string; // YYYY-MM format
  currency?: string;
}

interface DayPrice {
  date: string;
  price: number;
  airline?: string;
  hasDirectFlight?: boolean;
}

const AIRPORT_CODE_REGEX = /^[A-Z]{3}$/;
const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;
const VALID_CURRENCIES = ['TRY', 'USD', 'EUR', 'GBP', 'AED', 'JPY', 'SGD', 'THB'];

function validateAirportCode(code: unknown): string | null {
  if (typeof code !== 'string') return null;
  const upper = code.toUpperCase().trim();
  if (AIRPORT_CODE_REGEX.test(upper)) return upper;
  return null;
}

function validateMonth(month: unknown): string | null {
  if (typeof month !== 'string') return null;
  if (MONTH_REGEX.test(month)) return month;
  return null;
}

function validateCurrency(currency: unknown): string {
  if (typeof currency !== 'string') return 'TRY';
  const upper = currency.toUpperCase();
  return VALID_CURRENCIES.includes(upper) ? upper : 'TRY';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: MonthlyPricesParams = await req.json();
    
    // Validate inputs
    const origin = validateAirportCode(params.origin);
    const destination = validateAirportCode(params.destination);
    const month = validateMonth(params.month);
    const currency = validateCurrency(params.currency);
    
    if (!origin) {
      return new Response(
        JSON.stringify({ error: 'Geçersiz kalkış havalimanı kodu' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!destination) {
      return new Response(
        JSON.stringify({ error: 'Geçersiz varış havalimanı kodu' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!month) {
      return new Response(
        JSON.stringify({ error: 'Geçersiz ay formatı (YYYY-MM olmalı)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const apiToken = Deno.env.get('TRAVELPAYOUTS_API_TOKEN');
    
    if (!apiToken) {
      console.error('TRAVELPAYOUTS_API_TOKEN is not set');
      return new Response(
        JSON.stringify({ error: 'API yapılandırma hatası' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Travelpayouts calendar endpoint - gets prices for entire month
    const apiUrl = new URL('https://api.travelpayouts.com/aviasales/v3/prices_for_dates');
    apiUrl.searchParams.set('origin', origin);
    apiUrl.searchParams.set('destination', destination);
    apiUrl.searchParams.set('departure_at', month); // YYYY-MM gets all dates in month
    apiUrl.searchParams.set('currency', currency);
    apiUrl.searchParams.set('one_way', 'true'); // Get one-way prices for calendar
    apiUrl.searchParams.set('sorting', 'price');
    apiUrl.searchParams.set('limit', '60'); // Get all days
    apiUrl.searchParams.set('unique', 'false');
    apiUrl.searchParams.set('token', apiToken);
    
    console.log(`Fetching monthly prices: ${origin} -> ${destination} for ${month}`);
    
    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status}`);
      return new Response(
        JSON.stringify({ error: 'Fiyat bilgisi alınamadı', prices: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const data = await response.json();
    
    // Parse the response and group by date
    const dayPrices: Record<string, DayPrice> = {};
    
    if (data?.data && Array.isArray(data.data)) {
      for (const flight of data.data) {
        const date = flight.departure_at?.split('T')[0];
        if (!date) continue;
        
        // Only keep the cheapest flight per day
        if (!dayPrices[date] || flight.price < dayPrices[date].price) {
          dayPrices[date] = {
            date,
            price: flight.price,
            airline: flight.airline,
            hasDirectFlight: flight.transfers === 0,
          };
        }
      }
    }
    
    // Convert to array and sort by date
    const prices = Object.values(dayPrices).sort((a, b) => 
      a.date.localeCompare(b.date)
    );
    
    // Find min/max prices for highlighting
    const allPrices = prices.map(p => p.price);
    const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : null;
    const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : null;
    
    return new Response(
      JSON.stringify({
        success: true,
        origin,
        destination,
        month,
        currency,
        prices,
        minPrice,
        maxPrice,
        totalDaysWithPrices: prices.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error fetching monthly prices:', error);
    return new Response(
      JSON.stringify({ error: 'Beklenmeyen bir hata oluştu', prices: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
