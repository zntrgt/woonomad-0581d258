import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callAI, corsHeaders as sharedCorsHeaders, MODELS } from "../_shared/openrouter.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const INTEREST_LABELS: Record<string, string> = {
  history: "tarih ve kültür",
  nature: "doğa ve parklar",
  food: "yerel mutfak ve restoranlar",
  shopping: "alışveriş",
  photography: "fotoğraf çekimi ve manzara",
  nightlife: "gece hayatı ve eğlence",
  adventure: "macera ve outdoor aktiviteler",
  beach: "deniz ve plaj",
};

const TRAVELER_LABELS: Record<string, string> = {
  solo: "yalnız gezgin",
  couple: "romantik çift seyahati",
  family: "çocuklu aile (çocuk dostu mekanlar önemli)",
  friends: "arkadaş grubu",
  business: "iş seyahati (verimli ve merkezi rotalar)",
};

const COUNTRY_CURRENCIES: Record<string, string> = {
  Türkiye: "TRY",
  ABD: "USD",
  Amerika: "USD",
  İngiltere: "GBP",
  Japonya: "JPY",
  İsviçre: "CHF",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Please log in to generate itineraries" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: authError } = await supabase.auth.getClaims(token);

    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Please log in to generate itineraries" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;

    const { city, cityEn, country, interests, travelerType, days } = await req.json();

    if (!city || typeof city !== "string" || city.length > 100) {
      return new Response(
        JSON.stringify({ error: "Geçersiz şehir adı" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!Array.isArray(interests) || interests.length === 0 || interests.length > 4) {
      return new Response(
        JSON.stringify({ error: "Geçersiz ilgi alanları" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!travelerType || typeof travelerType !== "string") {
      return new Response(
        JSON.stringify({ error: "Geçersiz gezgin tipi" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!days || typeof days !== "number" || days < 1 || days > 7) {
      return new Response(
        JSON.stringify({ error: "Geçersiz gün sayısı" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI servisi yapılandırılmamış" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const interestText = interests.map((i: string) => INTEREST_LABELS[i] || i).join(", ");
    const travelerText = TRAVELER_LABELS[travelerType] || travelerType;
    const currency = COUNTRY_CURRENCIES[country] || "EUR";

    console.log(`User ${userId} generating itinerary for ${city}`);

    const systemPrompt = `Sen deneyimli bir seyahat planlayıcısısın. Kullanıcının tercihlerine göre detaylı ve gerçekçi gezi rotaları oluşturuyorsun. Her öneride gerçek mekanlar, pratik bilgiler ve MUTLAKA tahmini maliyetler veriyorsun.

Yanıtını SADECE JSON formatında ver, başka hiçbir şey yazma. JSON şu yapıda olmalı:
{
  "title": "Rota başlığı",
  "summary": "Kısa özet (2-3 cümle)",
  "totalBudget": 500,
  "currency": "${currency}",
  "days": [
    {
      "day": 1,
      "theme": "Günün teması",
      "dailyBudget": 120,
      "activities": [
        {
          "time": "09:00",
          "place": "Mekan adı",
          "description": "Kısa açıklama",
          "duration": "2 saat",
          "estimatedCost": 15
        }
      ]
    }
  ],
  "tips": ["İpucu 1", "İpucu 2", "İpucu 3"]
}

ÖNEMLİ:
- estimatedCost her aktivite için tahmini maliyeti ${currency} cinsinden gösterir
- dailyBudget o günün toplam tahmini bütçesidir
- totalBudget tüm günlerin toplam tahmini bütçesidir
- Ücretsiz aktiviteler için estimatedCost: 0 yaz
- Maliyetler gerçekçi ve güncel olmalı`;

    const userPrompt = `${city} (${country}) için ${days} günlük bir gezi planı oluştur.

Gezgin profili: ${travelerText}
İlgi alanları: ${interestText}
Para birimi: ${currency}

Önemli kurallar:
- Her gün için 4-6 aktivite planla
- Sabah, öğle ve akşam aktiviteleri dengeli olsun
- ${travelerType === "family" ? "Çocuk dostu mekanları öncelikle öner, bütçeyi buna göre ayarla" : ""}
- ${travelerType === "couple" ? "Romantik mekanları ve deneyimleri dahil et" : ""}
- ${travelerType === "solo" ? "Yalnız gezginler için güvenli ve sosyal mekanlar öner, bütçe daha ekonomik olsun" : ""}
- ${travelerType === "business" ? "Merkezi ve verimli rotalar oluştur" : ""}
- Her aktivite için gerçekçi maliyet tahmini ver (giriş ücreti, yemek, ulaşım dahil)
- Gerçek ve popüler mekanları öner
- Yerel ipuçları ekle (bütçe tasarrufu ipuçları da olabilir)
- Ulaşım süreleri gerçekçi olsun`;

    const aiResult = await callAI({ prompt: userPrompt, systemPrompt: systemPrompt, model: MODELS.GEMINI_FLASH, maxTokens: 8192, temperature: 0.7, timeoutMs: 60_000 });
    if (!aiResult.ok) throw new Error(aiResult.error || "AI generation failed");
    const content = aiResult.text;

    let itinerary;
    try {
      let jsonStr = content.trim();
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
      itinerary = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      return new Response(
        JSON.stringify({ error: "Gezi planı işlenemedi" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ itinerary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Generate itinerary error:", err);

    if (err instanceof Error && err.message === "RATE_LIMIT") {
      return new Response(
        JSON.stringify({ error: "Çok fazla istek. Lütfen birkaç dakika bekleyin." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Beklenmeyen bir hata oluştu" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
