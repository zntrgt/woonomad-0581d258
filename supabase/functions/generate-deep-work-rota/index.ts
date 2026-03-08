import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_MODEL = "gemini-2.0-flash";

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: 8192 },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 429) throw new Error("RATE_LIMIT");
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!text) throw new Error("Empty response from Gemini");
  return text;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Giriş yapmanız gerekiyor" }),
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
        JSON.stringify({ error: "Giriş yapmanız gerekiyor" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;

    const {
      city,
      citySlug,
      country,
      userTimezone,
      destinationTimezone,
      workHoursStart,
      workHoursEnd,
      workStyle,
      days,
      nomadMetrics,
      coworkingSpaces,
    } = await req.json();

    if (!city || typeof city !== "string" || city.length > 100) {
      return new Response(
        JSON.stringify({ error: "Geçersiz şehir adı" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!userTimezone || !destinationTimezone) {
      return new Response(
        JSON.stringify({ error: "Saat dilimi bilgisi eksik" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!days || typeof days !== "number" || days < 1 || days > 14) {
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

    console.log(`User ${userId} generating deep work rota for ${city}`);

    const workStyleDescriptions: Record<string, string> = {
      morning: "Sabah erken saatlerde 5-6 saat yoğun çalışma bloğu, öğleden sonra keşif ve sosyal aktiviteler",
      split: "Sabah 3-4 saat deep work, öğlen mola ve keşif, akşam 2-3 saat toplantı/hafif çalışma",
      afternoon: "Sabah geç uyanma ve keşif, öğleden sonra ve akşam saatlerinde yoğun çalışma",
      flexible: 'Farklı kafelerde ve coworking alanlarda "kafe hoplamı" tarzı esnek çalışma',
    };

    const coworkingInfo =
      coworkingSpaces?.length > 0
        ? `Şehirdeki coworking alanları: ${coworkingSpaces
            .map((c: { name: string; neighborhood?: string }) => `${c.name} (${c.neighborhood || "merkez"})`)
            .join(", ")}`
        : "";

    const nomadInfo = nomadMetrics
      ? `Şehir bilgileri: İnternet hızı ${nomadMetrics.internetSpeed}, ${nomadMetrics.coworkingCount} coworking mekan, ${nomadMetrics.cafesWithWifi} wifi kafe`
      : "";

    const systemPrompt = `Sen dijital nomadlar için uzmanlaşmış bir Deep Work ve verimlilik danışmanısın. Kullanıcının saat dilimine ve çalışma tarzına göre detaylı günlük rutinler oluşturuyorsun.

Kullanıcı ${userTimezone} saat diliminde müşterilerle çalışıyor ve ${destinationTimezone} saat dilimindeki ${city}'da bulunuyor.
Çalışma saatleri (müşteri saat diliminde): ${workHoursStart} - ${workHoursEnd}
Tercih edilen çalışma tarzı: ${workStyleDescriptions[workStyle] || "Esnek"}

${nomadInfo}
${coworkingInfo}

Yanıtını SADECE JSON formatında ver, başka hiçbir şey yazma. JSON şu yapıda olmalı:
{
  "title": "Deep Work rotası başlığı (örn: '${city} 7 Günlük Nomad Rutini')",
  "summary": "Kısa özet (2-3 cümle, saat dilimi farkı ve çalışma stratejisinden bahset)",
  "userTimezone": "${userTimezone}",
  "destinationTimezone": "${destinationTimezone}",
  "timeDiff": "Saat farkı açıklaması (örn: '+6 saat fark')",
  "days": [
    {
      "day": 1,
      "theme": "Günün teması (örn: 'Adaptasyon ve Setup')",
      "workHours": 6,
      "exploreHours": 3,
      "blocks": [
        {
          "time": "07:00",
          "duration": "3 saat",
          "type": "deep-work",
          "location": "Coworking/kafe adı",
          "locationDetails": "Neden bu mekan (wifi hızı, sessizlik vb)",
          "wifiSpeed": "100 Mbps",
          "task": "Önerilen görev tipi (örn: 'Karmaşık kod yazımı')",
          "tips": "Verimlilik ipucu"
        }
      ]
    }
  ],
  "productivityTips": [
    "Saat dilimi farkına uyum için ipucu"
  ],
  "bestWorkLocations": [
    { "name": "Mekan adı", "wifiSpeed": "100 Mbps", "quietLevel": "Sessiz" }
  ]
}

KURALLAR:
1. Her gün için "deep-work", "shallow-work", "break", "explore" tiplerinden bloklar oluştur
2. Deep work blokları en az 2-3 saat olmalı (kesintisiz odaklanma)
3. Saat dilimi farkını hesaba kat - toplantı saatlerini yerel saate çevir
4. ${city}'daki GERÇEK coworking alanları ve kafeleri öner (biliyorsan)
5. Her güne farklı tema ve mekanlar ekle (monotonluğu kır)
6. Keşif bloklarında gerçek turistik/kültürel mekanlar öner
7. Wifi hızı ve sessizlik seviyesi bilgilerini ekle
8. Verimlilik ipuçları pratik ve uygulanabilir olsun`;

    const userPrompt = `${city} (${country}) için ${days} günlük Deep Work rotası oluştur.

Önemli detaylar:
- Müşteri saat dilimi: ${userTimezone}
- Çalışma saatleri: ${workHoursStart} - ${workHoursEnd} (müşteri saati)
- Destinasyon: ${city} (${destinationTimezone})
- Çalışma tarzı: ${workStyle}

Lütfen:
1. Her gün için dengeli deep work ve keşif blokları planla
2. Saat dilimi farkını hesaba kat (örn: EST 09:00 = İstanbul 17:00)
3. Gerçek coworking ve kafe önerileri ver
4. Jet lag ve adaptasyon için ipuçları ekle
5. Her gün farklı mahalle/bölge keşfet
6. Hafta sonu için daha az çalışma, daha çok keşif planla`;

    const content = await callGemini(GEMINI_API_KEY, systemPrompt, userPrompt);

    let rota;
    try {
      let jsonStr = content.trim();
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
      rota = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      return new Response(
        JSON.stringify({ error: "Çalışma rotası işlenemedi" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ rota }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Generate deep work rota error:", err);

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
