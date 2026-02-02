import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Thermometer, Droplets, CloudFog, CloudLightning } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'foggy' | 'stormy';
  humidity: number;
  wind: number;
  feelsLike: number;
  source?: string;
}

const getWeatherIcon = (condition: WeatherData['condition']) => {
  switch (condition) {
    case 'sunny': return <Sun className="w-8 h-8 text-warning" />;
    case 'cloudy': return <Cloud className="w-8 h-8 text-muted-foreground" />;
    case 'rainy': return <CloudRain className="w-8 h-8 text-blue-400" />;
    case 'snowy': return <Snowflake className="w-8 h-8 text-blue-300" />;
    case 'windy': return <Wind className="w-8 h-8 text-muted-foreground" />;
    case 'foggy': return <CloudFog className="w-8 h-8 text-muted-foreground" />;
    case 'stormy': return <CloudLightning className="w-8 h-8 text-yellow-400" />;
    default: return <Cloud className="w-8 h-8 text-muted-foreground" />;
  }
};

const getConditionText = (condition: WeatherData['condition']) => {
  switch (condition) {
    case 'sunny': return 'Güneşli';
    case 'cloudy': return 'Bulutlu';
    case 'rainy': return 'Yağmurlu';
    case 'snowy': return 'Karlı';
    case 'windy': return 'Rüzgarlı';
    case 'foggy': return 'Sisli';
    case 'stormy': return 'Fırtınalı';
    default: return 'Bulutlu';
  }
};

interface WeatherWidgetProps {
  cityName: string;
  citySlug?: string;
}

export function WeatherWidget({ cityName, citySlug }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: fnError } = await supabase.functions.invoke('get-weather', {
          body: { 
            cityName,
            citySlug: citySlug || cityName.toLowerCase().replace(/\s+/g, '-')
          }
        });

        if (fnError) {
          throw new Error(fnError.message);
        }

        setWeather(data);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Hava durumu alınamadı');
        // Set fallback weather
        setWeather({
          temp: 18,
          condition: 'cloudy',
          humidity: 60,
          wind: 10,
          feelsLike: 17,
          source: 'fallback'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [cityName, citySlug]);

  if (loading) {
    return (
      <Card variant="elevated">
        <CardContent className="p-4">
          <Skeleton className="h-5 w-40 mb-3" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card variant="elevated">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-display font-bold">
            {cityName} Hava Durumu
          </h3>
          {weather.source === 'open-meteo' && (
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              Anlık
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.condition)}
            <div>
              <p className="text-3xl font-bold">{weather.temp}°C</p>
              <p className="text-sm text-muted-foreground">{getConditionText(weather.condition)}</p>
            </div>
          </div>
          <div className="flex-1 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Hissedilen: {weather.feelsLike}°C</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Nem: %{weather.humidity}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Rüzgar: {weather.wind} km/s</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Travel Tips based on weather and city
interface TravelTipsProps {
  cityName: string;
  bestTimeToVisit: string;
  currency: string;
  language: string;
}

export function TravelTips({ cityName, bestTimeToVisit, currency, language }: TravelTipsProps) {
  const tips = [
    { icon: '🧳', title: 'Bavul Önerisi', text: 'Mevsime uygun kıyafetler ve rahat yürüyüş ayakkabısı' },
    { icon: '💱', title: 'Para Birimi', text: `${currency} kullanılıyor. Kartlar yaygın kabul görüyor` },
    { icon: '🗣️', title: 'Dil', text: `${language}. Turistik bölgelerde İngilizce yaygın` },
    { icon: '📅', title: 'En İyi Zaman', text: bestTimeToVisit },
  ];

  return (
    <Card variant="elevated">
      <CardContent className="p-4">
        <h3 className="text-lg font-display font-bold mb-3">
          {cityName} Seyahat İpuçları
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xl">{tip.icon}</span>
              <div>
                <p className="text-sm font-medium">{tip.title}</p>
                <p className="text-xs text-muted-foreground">{tip.text}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
