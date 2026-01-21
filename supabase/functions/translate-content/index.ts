import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TranslateRequest {
  texts: Record<string, string>;
  targetLanguage: string;
  sourceLanguage?: string;
}

const LANGUAGE_NAMES: Record<string, string> = {
  'tr': 'Turkish',
  'en': 'English', 
  'de': 'German',
  'fr': 'French',
  'es': 'Spanish',
  'ar': 'Arabic',
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const targetLangName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;
    const sourceLangName = LANGUAGE_NAMES[sourceLanguage] || sourceLanguage;

    // Create a list of texts to translate
    const textEntries = Object.entries(texts);
    const textList = textEntries.map(([key, value], idx) => `[${idx}] ${value}`).join('\n');

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

    console.log(`Translating ${textEntries.length} texts from ${sourceLanguage} to ${targetLanguage}`);

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

    console.log(`Translation successful: ${Object.keys(result.translations || {}).length} texts`);
    
    return new Response(
      JSON.stringify(result),
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
