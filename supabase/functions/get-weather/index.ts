import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// City coordinates mapping
const cityCoordinates: Record<string, { lat: number; lon: number }> = {
  'istanbul': { lat: 41.0082, lon: 28.9784 },
  'ankara': { lat: 39.9334, lon: 32.8597 },
  'antalya': { lat: 36.8969, lon: 30.7133 },
  'izmir': { lat: 38.4192, lon: 27.1287 },
  'bodrum': { lat: 37.0344, lon: 27.4305 },
  'paris': { lat: 48.8566, lon: 2.3522 },
  'londra': { lat: 51.5074, lon: -0.1278 },
  'berlin': { lat: 52.5200, lon: 13.4050 },
  'roma': { lat: 41.9028, lon: 12.4964 },
  'barcelona': { lat: 41.3851, lon: 2.1734 },
  'amsterdam': { lat: 52.3676, lon: 4.9041 },
  'tokyo': { lat: 35.6762, lon: 139.6503 },
  'dubai': { lat: 25.2048, lon: 55.2708 },
  'bangkok': { lat: 13.7563, lon: 100.5018 },
  'singapur': { lat: 1.3521, lon: 103.8198 },
  'bali': { lat: -8.3405, lon: 115.0920 },
  'tiflis': { lat: 41.7151, lon: 44.8271 },
  'atina': { lat: 37.9838, lon: 23.7275 },
  'lizbon': { lat: 38.7223, lon: -9.1393 },
  'viyana': { lat: 48.2082, lon: 16.3738 },
  'prag': { lat: 50.0755, lon: 14.4378 },
  'budapes': { lat: 47.4979, lon: 19.0402 },
  'varsova': { lat: 52.2297, lon: 21.0122 },
  'moskova': { lat: 55.7558, lon: 37.6173 },
  'new-york': { lat: 40.7128, lon: -74.0060 },
  'los-angeles': { lat: 34.0522, lon: -118.2437 },
  'miami': { lat: 25.7617, lon: -80.1918 },
};

// Weather code to condition mapping (Open-Meteo WMO codes)
const getConditionFromCode = (code: number): string => {
  if (code === 0) return 'sunny';
  if (code >= 1 && code <= 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'foggy';
  if (code >= 51 && code <= 67) return 'rainy';
  if (code >= 71 && code <= 77) return 'snowy';
  if (code >= 80 && code <= 82) return 'rainy';
  if (code >= 85 && code <= 86) return 'snowy';
  if (code >= 95 && code <= 99) return 'stormy';
  return 'cloudy';
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cityName, citySlug } = await req.json();
    
    // Get coordinates
    const slug = citySlug?.toLowerCase() || cityName?.toLowerCase().replace(/\s+/g, '-');
    const coords = cityCoordinates[slug];
    
    if (!coords) {
      // Return fallback weather for unknown cities
      return new Response(
        JSON.stringify({
          temp: 18,
          condition: 'cloudy',
          humidity: 60,
          wind: 10,
          feelsLike: 17,
          source: 'fallback'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch from Open-Meteo API (free, no API key needed)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;

    const weather = {
      temp: Math.round(current.temperature_2m),
      condition: getConditionFromCode(current.weather_code),
      humidity: Math.round(current.relative_humidity_2m),
      wind: Math.round(current.wind_speed_10m),
      feelsLike: Math.round(current.apparent_temperature),
      source: 'open-meteo'
    };

    return new Response(JSON.stringify(weather), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Weather API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Return fallback on error
    return new Response(
      JSON.stringify({
        temp: 20,
        condition: 'cloudy',
        humidity: 55,
        wind: 8,
        feelsLike: 19,
        source: 'fallback',
        error: errorMessage
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 // Return 200 with fallback data
      }
    );
  }
});
