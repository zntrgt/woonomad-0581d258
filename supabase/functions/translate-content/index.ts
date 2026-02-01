import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface TranslateRequest {
  texts: Record<string, string>;
  targetLanguage: string;
  sourceLanguage?: string;
}

// DeepL language code mapping
const DEEPL_LANGUAGE_CODES: Record<string, string> = {
  'tr': 'TR',
  'en': 'EN',
  'de': 'DE',
  'fr': 'FR',
  'es': 'ES',
  'ar': 'AR', // Note: DeepL may not support Arabic, will fallback to Lovable AI
};

// Rate limiting configuration (per user)
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute per user
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitInfo(userId: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(userId);
  
  if (!record || now > record.resetTime) {
    const resetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitStore.set(userId, { count: 1, resetTime });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetTime };
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  
  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count, resetTime: record.resetTime };
}

async function translateWithDeepL(
  texts: string[],
  targetLang: string,
  sourceLang: string,
  apiKey: string
): Promise<string[] | null> {
  try {
    // DeepL API endpoint (free or pro based on key)
    const apiUrl = apiKey.endsWith(':fx') 
      ? 'https://api-free.deepl.com/v2/translate'
      : 'https://api.deepl.com/v2/translate';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: texts,
        target_lang: DEEPL_LANGUAGE_CODES[targetLang] || targetLang.toUpperCase(),
        source_lang: DEEPL_LANGUAGE_CODES[sourceLang] || sourceLang.toUpperCase(),
      }),
    });

    if (!response.ok) {
      console.error('DeepL API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data.translations?.map((t: { text: string }) => t.text) || null;
  } catch (error) {
    console.error('DeepL translation error:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.log('Invalid token:', claimsError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub as string;
    console.log(`Authenticated user: ${userId}`);

    // Rate limiting check (per user)
    const rateLimitInfo = getRateLimitInfo(userId);
    
    if (!rateLimitInfo.allowed) {
      console.log(`Rate limit exceeded for user: ${userId}`);
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimitInfo.resetTime)
          } 
        }
      );
    }

    const body: TranslateRequest = await req.json();
    const { texts, targetLanguage, sourceLanguage = 'tr' } = body;

    if (!texts || Object.keys(texts).length === 0 || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: "texts and targetLanguage are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If source and target are the same, return original texts
    if (sourceLanguage === targetLanguage) {
      return new Response(
        JSON.stringify({ translations: texts, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const textEntries = Object.entries(texts);
    const textValues = textEntries.map(([, value]) => value);
    const textKeys = textEntries.map(([key]) => key);

    // Try DeepL first
    const DEEPL_API_KEY = Deno.env.get("DEEPL_API_KEY");
    
    if (DEEPL_API_KEY) {
      console.log(`Translating ${textEntries.length} texts with DeepL from ${sourceLanguage} to ${targetLanguage}`);
      
      const deeplResults = await translateWithDeepL(
        textValues,
        targetLanguage,
        sourceLanguage,
        DEEPL_API_KEY
      );

      if (deeplResults && deeplResults.length === textValues.length) {
        const translations: Record<string, string> = {};
        textKeys.forEach((key, idx) => {
          translations[key] = deeplResults[idx];
        });

        console.log(`DeepL translation successful: ${Object.keys(translations).length} texts`);
        
        return new Response(
          JSON.stringify({ translations, provider: 'deepl' }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log('DeepL translation failed, falling back to Lovable AI');
    }

    // Fallback to Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("Neither DEEPL_API_KEY nor LOVABLE_API_KEY is configured");
      return new Response(
        JSON.stringify({ error: "Translation service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LANGUAGE_NAMES: Record<string, string> = {
      'tr': 'Turkish',
      'en': 'English', 
      'de': 'German',
      'fr': 'French',
      'es': 'Spanish',
      'ar': 'Arabic',
    };

    const targetLangName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;
    const sourceLangName = LANGUAGE_NAMES[sourceLanguage] || sourceLanguage;

    const systemPrompt = `You are a professional translator. Translate the following texts from ${sourceLangName} to ${targetLangName}.
Keep the same meaning and tone. Preserve any placeholders like {{name}} or {count}.
Return ONLY a valid JSON object with the translations.

RULES:
1. Do not add explanations
2. Preserve formatting and line breaks
3. Keep brand names unchanged
4. For RTL languages (Arabic), ensure proper formatting
5. Output format: {"translations": {"key1": "translated1", "key2": "translated2"}}`;

    const userPrompt = `Translate these texts to ${targetLangName}. Return JSON with "translations" key:

${textEntries.map(([key, value]) => `"${key}": "${value}"`).join('\n')}

Return: {"translations": {"key1": "...", ...}}`;

    console.log(`Translating ${textEntries.length} texts with Lovable AI from ${sourceLanguage} to ${targetLanguage}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "No response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON from AI response
    let result: { translations: Record<string, string> };
    try {
      let jsonStr = aiContent;
      const jsonMatch = aiContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
      }
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.log("Raw AI content:", aiContent);
      return new Response(
        JSON.stringify({ error: "Failed to parse translation response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Lovable AI translation successful: ${Object.keys(result.translations || {}).length} texts`);
    
    return new Response(
      JSON.stringify({ ...result, provider: 'lovable-ai' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Translate error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
