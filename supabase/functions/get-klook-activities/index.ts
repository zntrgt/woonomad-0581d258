import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Klook city mappings with activity categories
const cityKlookData: Record<string, { klookCityId: string; klookCityName: string; popularCategories: string[] }> = {
  'istanbul': { klookCityId: 'istanbul', klookCityName: 'Istanbul', popularCategories: ['tours', 'attractions', 'food-experiences', 'day-trips'] },
  'antalya': { klookCityId: 'antalya', klookCityName: 'Antalya', popularCategories: ['tours', 'outdoor-activities', 'water-sports', 'day-trips'] },
  'izmir': { klookCityId: 'izmir', klookCityName: 'Izmir', popularCategories: ['tours', 'day-trips', 'food-experiences', 'attractions'] },
  'bodrum': { klookCityId: 'bodrum', klookCityName: 'Bodrum', popularCategories: ['water-sports', 'boat-tours', 'day-trips', 'nightlife'] },
  'paris': { klookCityId: 'paris', klookCityName: 'Paris', popularCategories: ['attractions', 'tours', 'museums', 'food-experiences'] },
  'london': { klookCityId: 'london', klookCityName: 'London', popularCategories: ['attractions', 'tours', 'museums', 'theater'] },
  'barcelona': { klookCityId: 'barcelona', klookCityName: 'Barcelona', popularCategories: ['attractions', 'tours', 'food-experiences', 'day-trips'] },
  'rome': { klookCityId: 'rome', klookCityName: 'Rome', popularCategories: ['attractions', 'tours', 'museums', 'food-experiences'] },
  'athens': { klookCityId: 'athens', klookCityName: 'Athens', popularCategories: ['attractions', 'tours', 'day-trips', 'museums'] },
  'dubai': { klookCityId: 'dubai', klookCityName: 'Dubai', popularCategories: ['attractions', 'tours', 'desert-safari', 'water-parks'] },
  'tokyo': { klookCityId: 'tokyo', klookCityName: 'Tokyo', popularCategories: ['attractions', 'tours', 'food-experiences', 'theme-parks'] },
  'bangkok': { klookCityId: 'bangkok', klookCityName: 'Bangkok', popularCategories: ['tours', 'temples', 'food-experiences', 'markets'] },
  'bali': { klookCityId: 'bali', klookCityName: 'Bali', popularCategories: ['tours', 'outdoor-activities', 'water-sports', 'temples'] },
  'lisbon': { klookCityId: 'lisbon', klookCityName: 'Lisbon', popularCategories: ['tours', 'day-trips', 'food-experiences', 'attractions'] },
  'prague': { klookCityId: 'prague', klookCityName: 'Prague', popularCategories: ['tours', 'attractions', 'day-trips', 'beer-tours'] },
  'amsterdam': { klookCityId: 'amsterdam', klookCityName: 'Amsterdam', popularCategories: ['tours', 'museums', 'canal-cruises', 'bike-tours'] },
  'berlin': { klookCityId: 'berlin', klookCityName: 'Berlin', popularCategories: ['tours', 'museums', 'history', 'nightlife'] },
  'vienna': { klookCityId: 'vienna', klookCityName: 'Vienna', popularCategories: ['concerts', 'museums', 'tours', 'palaces'] },
  'budapest': { klookCityId: 'budapest', klookCityName: 'Budapest', popularCategories: ['tours', 'thermal-baths', 'river-cruises', 'food-experiences'] },
  'tbilisi': { klookCityId: 'tbilisi', klookCityName: 'Tbilisi', popularCategories: ['tours', 'wine-tasting', 'day-trips', 'food-experiences'] },
  'skopje': { klookCityId: 'skopje', klookCityName: 'Skopje', popularCategories: ['tours', 'day-trips', 'history', 'outdoor-activities'] },
};

// Activity category display info
const categoryInfo: Record<string, { icon: string; label: { en: string; tr: string } }> = {
  'tours': { icon: '🚶', label: { en: 'City Tours', tr: 'Şehir Turları' } },
  'attractions': { icon: '🎡', label: { en: 'Attractions', tr: 'Turistik Yerler' } },
  'food-experiences': { icon: '🍽️', label: { en: 'Food & Dining', tr: 'Yeme & İçme' } },
  'day-trips': { icon: '🚗', label: { en: 'Day Trips', tr: 'Günübirlik Turlar' } },
  'museums': { icon: '🏛️', label: { en: 'Museums', tr: 'Müzeler' } },
  'outdoor-activities': { icon: '🏔️', label: { en: 'Outdoor Activities', tr: 'Açık Hava Aktiviteleri' } },
  'water-sports': { icon: '🏄', label: { en: 'Water Sports', tr: 'Su Sporları' } },
  'boat-tours': { icon: '⛵', label: { en: 'Boat Tours', tr: 'Tekne Turları' } },
  'nightlife': { icon: '🌙', label: { en: 'Nightlife', tr: 'Gece Hayatı' } },
  'theater': { icon: '🎭', label: { en: 'Shows & Theater', tr: 'Gösteriler' } },
  'desert-safari': { icon: '🐪', label: { en: 'Desert Safari', tr: 'Çöl Safarisi' } },
  'water-parks': { icon: '🎢', label: { en: 'Water Parks', tr: 'Su Parkları' } },
  'theme-parks': { icon: '🎠', label: { en: 'Theme Parks', tr: 'Eğlence Parkları' } },
  'temples': { icon: '🛕', label: { en: 'Temples', tr: 'Tapınaklar' } },
  'markets': { icon: '🛒', label: { en: 'Markets', tr: 'Pazarlar' } },
  'beer-tours': { icon: '🍺', label: { en: 'Beer Tours', tr: 'Bira Turları' } },
  'canal-cruises': { icon: '🚢', label: { en: 'Canal Cruises', tr: 'Kanal Turları' } },
  'bike-tours': { icon: '🚴', label: { en: 'Bike Tours', tr: 'Bisiklet Turları' } },
  'history': { icon: '📜', label: { en: 'History Tours', tr: 'Tarihi Turlar' } },
  'concerts': { icon: '🎵', label: { en: 'Concerts', tr: 'Konserler' } },
  'palaces': { icon: '🏰', label: { en: 'Palaces', tr: 'Saraylar' } },
  'thermal-baths': { icon: '♨️', label: { en: 'Thermal Baths', tr: 'Kaplıcalar' } },
  'river-cruises': { icon: '🛳️', label: { en: 'River Cruises', tr: 'Nehir Turları' } },
  'wine-tasting': { icon: '🍷', label: { en: 'Wine Tasting', tr: 'Şarap Tadımı' } },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { citySlug, language = 'tr' } = await req.json();
    
    const affiliateId = Deno.env.get('KLOOK_AFFILIATE_ID');
    
    if (!affiliateId) {
      return new Response(
        JSON.stringify({ error: 'Klook affiliate ID not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedSlug = citySlug?.toLowerCase().replace(/[^a-z]/g, '') || '';
    const cityData = cityKlookData[normalizedSlug];

    if (!cityData) {
      // Return generic Klook link for unsupported cities
      return new Response(
        JSON.stringify({
          supported: false,
          affiliateLink: `https://www.klook.com/?aid=${affiliateId}`,
          message: 'City not in Klook database'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build activity categories with affiliate links
    const activities = cityData.popularCategories.map(category => {
      const info = categoryInfo[category] || { icon: '📍', label: { en: category, tr: category } };
      return {
        id: category,
        icon: info.icon,
        label: language === 'tr' ? info.label.tr : info.label.en,
        link: `https://www.klook.com/search/result/?keyword=${encodeURIComponent(cityData.klookCityName)}%20${encodeURIComponent(category.replace(/-/g, ' '))}&aid=${affiliateId}`
      };
    });

    // Main city search link
    const cityLink = `https://www.klook.com/search/result/?keyword=${encodeURIComponent(cityData.klookCityName)}&aid=${affiliateId}`;

    return new Response(
      JSON.stringify({
        supported: true,
        cityName: cityData.klookCityName,
        cityLink,
        activities,
        affiliateId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Klook activities error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to get Klook activities' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
