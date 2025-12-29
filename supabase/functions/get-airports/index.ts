import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Popular Turkish airports and major international destinations
const airports = [
  // Turkey
  { code: 'IST', name: 'İstanbul Havalimanı', city: 'İstanbul', country: 'Türkiye' },
  { code: 'SAW', name: 'Sabiha Gökçen', city: 'İstanbul', country: 'Türkiye' },
  { code: 'ESB', name: 'Esenboğa Havalimanı', city: 'Ankara', country: 'Türkiye' },
  { code: 'ADB', name: 'Adnan Menderes', city: 'İzmir', country: 'Türkiye' },
  { code: 'AYT', name: 'Antalya Havalimanı', city: 'Antalya', country: 'Türkiye' },
  { code: 'DLM', name: 'Dalaman Havalimanı', city: 'Muğla', country: 'Türkiye' },
  { code: 'BJV', name: 'Milas-Bodrum', city: 'Bodrum', country: 'Türkiye' },
  { code: 'TZX', name: 'Trabzon Havalimanı', city: 'Trabzon', country: 'Türkiye' },
  { code: 'GZT', name: 'Gaziantep Havalimanı', city: 'Gaziantep', country: 'Türkiye' },
  { code: 'VAN', name: 'Van Ferit Melen', city: 'Van', country: 'Türkiye' },
  { code: 'DIY', name: 'Diyarbakır Havalimanı', city: 'Diyarbakır', country: 'Türkiye' },
  { code: 'ECN', name: 'Ercan Havalimanı', city: 'Lefkoşa', country: 'Kuzey Kıbrıs' },
  
  // Europe
  { code: 'LHR', name: 'Heathrow', city: 'Londra', country: 'İngiltere' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'Fransa' },
  { code: 'FCO', name: 'Fiumicino', city: 'Roma', country: 'İtalya' },
  { code: 'BCN', name: 'El Prat', city: 'Barselona', country: 'İspanya' },
  { code: 'MAD', name: 'Barajas', city: 'Madrid', country: 'İspanya' },
  { code: 'AMS', name: 'Schiphol', city: 'Amsterdam', country: 'Hollanda' },
  { code: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'Almanya' },
  { code: 'MUC', name: 'Münih', city: 'Münih', country: 'Almanya' },
  { code: 'ZRH', name: 'Zürih', city: 'Zürih', country: 'İsviçre' },
  { code: 'VIE', name: 'Viyana', city: 'Viyana', country: 'Avusturya' },
  { code: 'PRG', name: 'Vaclav Havel', city: 'Prag', country: 'Çekya' },
  { code: 'ATH', name: 'Eleftherios Venizelos', city: 'Atina', country: 'Yunanistan' },
  
  // Middle East
  { code: 'DXB', name: 'Dubai', city: 'Dubai', country: 'BAE' },
  { code: 'DOH', name: 'Hamad', city: 'Doha', country: 'Katar' },
  { code: 'TLV', name: 'Ben Gurion', city: 'Tel Aviv', country: 'İsrail' },
  
  // Americas
  { code: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'ABD' },
  { code: 'LAX', name: 'Los Angeles', city: 'Los Angeles', country: 'ABD' },
  { code: 'MIA', name: 'Miami', city: 'Miami', country: 'ABD' },
  
  // Asia
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Tayland' },
  { code: 'SIN', name: 'Changi', city: 'Singapur', country: 'Singapur' },
  { code: 'HKG', name: 'Hong Kong', city: 'Hong Kong', country: 'Çin' },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query')?.toLowerCase() || '';

    console.log('Airport search query:', query);

    let filteredAirports = airports;
    
    if (query.length >= 2) {
      filteredAirports = airports.filter(airport => 
        airport.code.toLowerCase().includes(query) ||
        airport.name.toLowerCase().includes(query) ||
        airport.city.toLowerCase().includes(query) ||
        airport.country.toLowerCase().includes(query)
      );
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: filteredAirports.slice(0, 10) 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in get-airports function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
