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
}

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

    const { origin, destination, departDate, returnDate, adults = 1, children = 0, infants = 0, tripClass = 'Y' } = params;

    if (!origin || !destination || !departDate) {
      throw new Error('Missing required parameters: origin, destination, departDate');
    }

    // Travelpayouts Prices API - Latest prices
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
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Travelpayouts API error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response success, data count:', data.data?.length || 0);

    // Transform the response to include affiliate links
    const flights = data.data?.map((flight: any) => ({
      ...flight,
      affiliateLink: partnerId 
        ? `https://www.aviasales.com/search/${origin}${departDate.replace(/-/g, '')}${destination}${returnDate ? returnDate.replace(/-/g, '') : ''}1?marker=${partnerId}`
        : null,
    })) || [];

    return new Response(JSON.stringify({ 
      success: true, 
      data: flights,
      currency: data.currency || 'TRY',
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
