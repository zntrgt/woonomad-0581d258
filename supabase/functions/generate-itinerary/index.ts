import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const INTEREST_LABELS: Record<string, string> = {
  history: 'tarih ve kültür',
  nature: 'doğa ve parklar',
  food: 'yerel mutfak ve restoranlar',
  shopping: 'alışveriş',
  photography: 'fotoğraf çekimi ve manzara',
  nightlife: 'gece hayatı ve eğlence',
  adventure: 'macera ve outdoor aktiviteler',
  beach: 'deniz ve plaj',
};

const TRAVELER_LABELS: Record<string, string> = {
  solo: 'yalnız gezgin',
  couple: 'romantik çift seyahati',
  family: 'çocuklu aile (çocuk dostu mekanlar önemli)',
  friends: 'arkadaş grubu',
  business: 'iş seyahati (verimli ve merkezi rotalar)',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, cityEn, country, interests, travelerType, days } = await req.json();

    // Input validation
    if (!city || typeof city !== 'string' || city.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Geçersiz şehir adı' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!Array.isArray(interests) || interests.length === 0 || interests.length > 4) {
      return new Response(
        JSON.stringify({ error: 'Geçersiz ilgi alanları' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!travelerType || typeof travelerType !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Geçersiz gezgin tipi' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!days || typeof days !== 'number' || days < 1 || days > 7) {
      return new Response(
        JSON.stringify({ error: 'Geçersiz gün sayısı' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI servisi yapılandırılmamış' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const interestText = interests.map((i: string) => INTEREST_LABELS[i] || i).join(', ');
    const travelerText = TRAVELER_LABELS[travelerType] || travelerType;

    const systemPrompt = `Sen deneyimli bir seyahat planlayıcısısın. Kullanıcının tercihlerine göre detaylı ve gerçekçi gezi rotaları oluşturuyorsun. Her öneride gerçek mekanlar ve pratik bilgiler veriyorsun.

Yanıtını SADECE JSON formatında ver, başka hiçbir şey yazma. JSON şu yapıda olmalı:
{
  "title": "Rota başlığı",
  "summary": "Kısa özet (2-3 cümle)",
  "days": [
    {
      "day": 1,
      "theme": "Günün teması",
      "activities": [
        {
          "time": "09:00",
          "place": "Mekan adı",
          "description": "Kısa açıklama",
          "duration": "2 saat"
        }
      ]
    }
  ],
  "tips": ["İpucu 1", "İpucu 2", "İpucu 3"]
}`;

    const userPrompt = `${city} (${country}) için ${days} günlük bir gezi planı oluştur.

Gezgin profili: ${travelerText}
İlgi alanları: ${interestText}

Önemli kurallar:
- Her gün için 4-6 aktivite planla
- Sabah, öğle ve akşam aktiviteleri dengeli olsun
- ${travelerType === 'family' ? 'Çocuk dostu mekanları öncelikle öner' : ''}
- ${travelerType === 'couple' ? 'Romantik mekanları ve deneyimleri dahil et' : ''}
- ${travelerType === 'solo' ? 'Yalnız gezginler için güvenli ve sosyal mekanlar öner' : ''}
- Gerçek ve popüler mekanları öner
- Yerel ipuçları ekle
- Ulaşım süreleri gerçekçi olsun`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Çok fazla istek. Lütfen birkaç dakika bekleyin.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI servisi limiti aşıldı.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI servisi hatası' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in AI response');
      return new Response(
        JSON.stringify({ error: 'AI yanıtı alınamadı' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse JSON from response (handle markdown code blocks)
    let itinerary;
    try {
      let jsonStr = content.trim();
      // Remove markdown code blocks if present
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      itinerary = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content);
      return new Response(
        JSON.stringify({ error: 'Gezi planı işlenemedi' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ itinerary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Generate itinerary error:', err);
    return new Response(
      JSON.stringify({ error: 'Beklenmeyen bir hata oluştu' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
