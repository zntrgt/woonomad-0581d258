import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Thermometer, Droplets } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  humidity: number;
  wind: number;
  feelsLike: number;
}

// Simulated weather data based on city and season
const getWeatherForCity = (cityName: string): WeatherData => {
  const month = new Date().getMonth();
  const isWinter = month >= 11 || month <= 2;
  const isSummer = month >= 5 && month <= 8;
  
  // Base temperatures by region
  const warmCities = ['dubai', 'bangkok', 'singapur', 'bali', 'phuket', 'marakeş'];
  const coldCities = ['stockholm', 'kopenhag', 'helsinki', 'oslo', 'reykjavik'];
  
  const cityLower = cityName.toLowerCase();
  let baseTemp = 15;
  
  if (warmCities.some(c => cityLower.includes(c))) {
    baseTemp = isSummer ? 35 : 25;
  } else if (coldCities.some(c => cityLower.includes(c))) {
    baseTemp = isSummer ? 18 : 2;
  } else {
    baseTemp = isSummer ? 25 : isWinter ? 5 : 15;
  }
  
  // Add some randomness
  const temp = baseTemp + Math.floor(Math.random() * 6) - 3;
  
  let condition: WeatherData['condition'] = 'sunny';
  if (temp < 5) condition = 'snowy';
  else if (temp < 15) condition = Math.random() > 0.5 ? 'cloudy' : 'rainy';
  else if (temp > 30) condition = 'sunny';
  else condition = Math.random() > 0.6 ? 'sunny' : 'cloudy';
  
  return {
    temp,
    condition,
    humidity: Math.floor(Math.random() * 40) + 40,
    wind: Math.floor(Math.random() * 20) + 5,
    feelsLike: temp + Math.floor(Math.random() * 4) - 2
  };
};

const getWeatherIcon = (condition: WeatherData['condition']) => {
  switch (condition) {
    case 'sunny': return <Sun className="w-8 h-8 text-warning" />;
    case 'cloudy': return <Cloud className="w-8 h-8 text-muted-foreground" />;
    case 'rainy': return <CloudRain className="w-8 h-8 text-info" />;
    case 'snowy': return <Snowflake className="w-8 h-8 text-info" />;
    case 'windy': return <Wind className="w-8 h-8 text-muted-foreground" />;
  }
};

const getConditionText = (condition: WeatherData['condition']) => {
  switch (condition) {
    case 'sunny': return 'Güneşli';
    case 'cloudy': return 'Bulutlu';
    case 'rainy': return 'Yağmurlu';
    case 'snowy': return 'Karlı';
    case 'windy': return 'Rüzgarlı';
  }
};

interface WeatherWidgetProps {
  cityName: string;
}

export function WeatherWidget({ cityName }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Simulate API call
    const data = getWeatherForCity(cityName);
    setWeather(data);
  }, [cityName]);

  if (!weather) return null;

  return (
    <Card variant="elevated">
      <CardContent className="p-4">
        <h3 className="text-lg font-display font-bold mb-3">
          {cityName} Hava Durumu
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {getWeatherIcon(weather.condition)}
            <div>
              <p className="text-2xl font-bold">{weather.temp}°C</p>
              <p className="text-xs text-muted-foreground">{getConditionText(weather.condition)}</p>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Hissedilen: {weather.feelsLike}°</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Nem: %{weather.humidity}</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-muted-foreground" />
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
