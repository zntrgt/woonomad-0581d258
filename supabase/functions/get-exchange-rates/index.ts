import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Currency code mapping for common destinations
const countryCurrencies: Record<string, string> = {
  'TR': 'TRY',
  'US': 'USD',
  'GB': 'GBP',
  'EU': 'EUR',
  'DE': 'EUR',
  'FR': 'EUR',
  'IT': 'EUR',
  'ES': 'EUR',
  'NL': 'EUR',
  'PT': 'EUR',
  'AT': 'EUR',
  'BE': 'EUR',
  'GR': 'EUR',
  'JP': 'JPY',
  'AE': 'AED',
  'TH': 'THB',
  'SG': 'SGD',
  'ID': 'IDR',
  'GE': 'GEL',
  'CZ': 'CZK',
  'HU': 'HUF',
  'PL': 'PLN',
  'RU': 'RUB',
  'CH': 'CHF',
  'SE': 'SEK',
  'NO': 'NOK',
  'DK': 'DKK',
  'AU': 'AUD',
  'NZ': 'NZD',
  'CA': 'CAD',
  'IN': 'INR',
  'CN': 'CNY',
  'KR': 'KRW',
  'MY': 'MYR',
  'VN': 'VND',
  'PH': 'PHP',
  'MX': 'MXN',
  'BR': 'BRL',
  'ZA': 'ZAR',
  'EG': 'EGP',
  'MA': 'MAD',
};

// Supported currencies by Frankfurter API (ECB rates)
const frankfurterSupported = ['EUR', 'USD', 'GBP', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'ISK', 'AUD', 'CAD', 'NZD', 'CNY', 'HKD', 'SGD', 'KRW', 'MXN', 'BRL', 'ZAR', 'INR', 'IDR', 'MYR', 'PHP', 'THB'];

// Fallback rates for currencies not in Frankfurter (approximate, updated periodically)
const fallbackRatesToTRY: Record<string, number> = {
  'GEL': 13.5,  // 1 GEL ≈ 13.5 TRY
  'AED': 9.8,   // 1 AED ≈ 9.8 TRY
  'VND': 0.0014, // 1 VND ≈ 0.0014 TRY
  'EGP': 0.73,  // 1 EGP ≈ 0.73 TRY
  'MAD': 3.6,   // 1 MAD ≈ 3.6 TRY
  'RUB': 0.38,  // 1 RUB ≈ 0.38 TRY
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { countryCode, baseCurrency = 'TRY' } = await req.json();
    
    const targetCurrency = countryCurrencies[countryCode] || 'USD';
    
    // Skip if same currency
    if (targetCurrency === baseCurrency) {
      return new Response(
        JSON.stringify({
          base: baseCurrency,
          target: targetCurrency,
          rate: 1,
          source: 'same-currency'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if currency is supported by Frankfurter
    if (frankfurterSupported.includes(targetCurrency)) {
      try {
        // Fetch from Frankfurter API (free, no API key needed)
        const url = `https://api.frankfurter.app/latest?from=${targetCurrency}&to=${baseCurrency}`;
        
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          const rate = data.rates[baseCurrency];

          if (rate) {
            return new Response(
              JSON.stringify({
                base: baseCurrency,
                target: targetCurrency,
                rate: rate,
                date: data.date,
                source: 'frankfurter',
                displayRate: `1 ${targetCurrency} = ${rate.toFixed(2)} ${baseCurrency}`
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }
      } catch (err) {
        console.error('Frankfurter API error, trying fallback:', err);
      }
    }

    // Use fallback rates for unsupported currencies
    const fallbackRate = fallbackRatesToTRY[targetCurrency];
    
    if (fallbackRate) {
      return new Response(
        JSON.stringify({
          base: baseCurrency,
          target: targetCurrency,
          rate: fallbackRate,
          source: 'estimate',
          displayRate: `1 ${targetCurrency} ≈ ${fallbackRate.toFixed(2)} ${baseCurrency}`
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If all else fails, return no rate
    return new Response(
      JSON.stringify({
        base: baseCurrency,
        target: targetCurrency,
        source: 'unavailable',
        error: `Exchange rate for ${targetCurrency} is not available`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Exchange rate API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
        source: 'error'
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
