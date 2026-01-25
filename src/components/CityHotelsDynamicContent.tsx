import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, Sun, CloudRain, Snowflake, Wind, Thermometer, Droplets,
  TrendingUp, DollarSign, Umbrella, Shirt, Calendar, Clock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  humidity: number;
  wind: number;
  feelsLike: number;
  high: number;
  low: number;
}

interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  symbol: string;
}

interface CityHotelsDynamicContentProps {
  cityName: string;
  cityNameEn: string;
  currency: string;
  countryCode: string;
  bestTimeToVisit: string;
}

// Simulated weather based on city and current date
const getWeatherForCity = (cityName: string): WeatherData => {
  const month = new Date().getMonth();
  const isWinter = month >= 11 || month <= 2;
  const isSummer = month >= 5 && month <= 8;
  
  // Temperature profiles by region
  const tropicalCities = ['bali', 'bangkok', 'singapur', 'phuket', 'dubai', 'zanzibar'];
  const coldCities = ['stockholm', 'kopenhag', 'helsinki', 'oslo', 'reykjavik'];
  const mediterraneanCities = ['antalya', 'bodrum', 'izmir', 'barcelona', 'roma', 'atina'];
  
  const cityLower = cityName.toLowerCase();
  let baseTemp = 15;
  
  if (tropicalCities.some(c => cityLower.includes(c))) {
    baseTemp = isSummer ? 32 : 28;
  } else if (coldCities.some(c => cityLower.includes(c))) {
    baseTemp = isSummer ? 20 : 0;
  } else if (mediterraneanCities.some(c => cityLower.includes(c))) {
    baseTemp = isSummer ? 30 : isWinter ? 12 : 20;
  } else {
    baseTemp = isSummer ? 25 : isWinter ? 5 : 15;
  }
  
  const temp = baseTemp + Math.floor(Math.random() * 4) - 2;
  
  let condition: WeatherData['condition'] = 'sunny';
  if (temp < 3) condition = 'snowy';
  else if (temp < 12) condition = Math.random() > 0.5 ? 'cloudy' : 'rainy';
  else if (temp > 28) condition = 'sunny';
  else condition = Math.random() > 0.6 ? 'sunny' : 'cloudy';
  
  return {
    temp,
    condition,
    humidity: Math.floor(Math.random() * 30) + 50,
    wind: Math.floor(Math.random() * 15) + 5,
    feelsLike: temp + Math.floor(Math.random() * 3) - 1,
    high: temp + Math.floor(Math.random() * 4) + 2,
    low: temp - Math.floor(Math.random() * 4) - 2
  };
};

// Currency rates vs TRY (simulated real-time)
const getCurrencyRates = (localCurrency: string): CurrencyRate[] => {
  const baseRates: Record<string, { rate: number; symbol: string; name: string }> = {
    'EUR': { rate: 35.5, symbol: '€', name: 'Euro' },
    'USD': { rate: 32.8, symbol: '$', name: 'ABD Doları' },
    'GBP': { rate: 41.2, symbol: '£', name: 'İngiliz Sterlini' },
    'JPY': { rate: 0.22, symbol: '¥', name: 'Japon Yeni' },
    'THB': { rate: 0.95, symbol: '฿', name: 'Tayland Bahtı' },
    'IDR': { rate: 0.0021, symbol: 'Rp', name: 'Endonezya Rupisi' },
    'AED': { rate: 8.9, symbol: 'د.إ', name: 'BAE Dirhemi' },
    'SGD': { rate: 24.5, symbol: 'S$', name: 'Singapur Doları' },
    'CZK': { rate: 1.42, symbol: 'Kč', name: 'Çek Korunası' },
    'HUF': { rate: 0.089, symbol: 'Ft', name: 'Macar Forinti' },
    'TRY': { rate: 1, symbol: '₺', name: 'Türk Lirası' },
  };
  
  // Add small random variance for "real-time" feel
  const variance = (Math.random() * 0.02) - 0.01;
  
  // Detect currency code from string
  let currencyCode = 'EUR';
  if (localCurrency.includes('Dollar') || localCurrency.includes('Dolar')) currencyCode = 'USD';
  else if (localCurrency.includes('Pound') || localCurrency.includes('Sterlin')) currencyCode = 'GBP';
  else if (localCurrency.includes('Yen')) currencyCode = 'JPY';
  else if (localCurrency.includes('Baht')) currencyCode = 'THB';
  else if (localCurrency.includes('Rupi')) currencyCode = 'IDR';
  else if (localCurrency.includes('Dirham') || localCurrency.includes('AED')) currencyCode = 'AED';
  else if (localCurrency.includes('Singapur')) currencyCode = 'SGD';
  else if (localCurrency.includes('Koruna') || localCurrency.includes('CZK')) currencyCode = 'CZK';
  else if (localCurrency.includes('Forint') || localCurrency.includes('HUF')) currencyCode = 'HUF';
  else if (localCurrency.includes('TRY') || localCurrency.includes('Lira')) currencyCode = 'TRY';
  
  const localRate = baseRates[currencyCode] || baseRates['EUR'];
  
  return [
    {
      code: currencyCode,
      name: localRate.name,
      rate: localRate.rate * (1 + variance),
      symbol: localRate.symbol
    },
    {
      code: 'TRY',
      name: 'Türk Lirası',
      rate: 1,
      symbol: '₺'
    }
  ];
};

const getWeatherIcon = (condition: WeatherData['condition']) => {
  switch (condition) {
    case 'sunny': return <Sun className="w-6 h-6 text-amber-500" />;
    case 'cloudy': return <Cloud className="w-6 h-6 text-muted-foreground" />;
    case 'rainy': return <CloudRain className="w-6 h-6 text-blue-500" />;
    case 'snowy': return <Snowflake className="w-6 h-6 text-cyan-400" />;
    case 'windy': return <Wind className="w-6 h-6 text-muted-foreground" />;
  }
};

const getConditionText = (condition: WeatherData['condition'], t: (key: string, fallback: string) => string) => {
  switch (condition) {
    case 'sunny': return t('weather.sunny', 'Güneşli');
    case 'cloudy': return t('weather.cloudy', 'Bulutlu');
    case 'rainy': return t('weather.rainy', 'Yağmurlu');
    case 'snowy': return t('weather.snowy', 'Karlı');
    case 'windy': return t('weather.windy', 'Rüzgarlı');
  }
};

const getWeatherRecommendations = (weather: WeatherData, t: (key: string, fallback: string) => string): string[] => {
  const recommendations: string[] = [];
  
  if (weather.temp > 28) {
    recommendations.push(t('weather.tips.pool', '🏊 Havuzlu otel tercih edin'));
    recommendations.push(t('weather.tips.ac', '❄️ Kliması güçlü odalar seçin'));
  } else if (weather.temp < 10) {
    recommendations.push(t('weather.tips.heating', '🔥 Merkezi ısıtmalı otel seçin'));
    recommendations.push(t('weather.tips.warmClothes', '🧥 Sıcak giysiler yanınızda olsun'));
  }
  
  if (weather.condition === 'rainy') {
    recommendations.push(t('weather.tips.umbrella', '☔ Şemsiye bulundurun'));
    recommendations.push(t('weather.tips.indoorActivities', '🏛️ Kapalı alan aktiviteleri planlayın'));
  }
  
  if (weather.humidity > 70) {
    recommendations.push(t('weather.tips.humidity', '💨 Nem oranı yüksek, ferah giysiler giyin'));
  }
  
  // Default recommendation
  if (recommendations.length === 0) {
    recommendations.push(t('weather.tips.ideal', '✨ Konaklama için ideal hava koşulları'));
  }
  
  return recommendations.slice(0, 3);
};

export function CityHotelsDynamicContent({ 
  cityName, 
  cityNameEn, 
  currency, 
  countryCode, 
  bestTimeToVisit 
}: CityHotelsDynamicContentProps) {
  const { t } = useTranslation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  
  useEffect(() => {
    setWeather(getWeatherForCity(cityNameEn || cityName));
    setRates(getCurrencyRates(currency));
    
    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    
    return () => clearInterval(timer);
  }, [cityName, cityNameEn, currency]);
  
  if (!weather) return null;
  
  const recommendations = getWeatherRecommendations(weather, t);
  const localCurrency = rates.find(r => r.code !== 'TRY');
  
  return (
    <div className="space-y-4">
      {/* Weather & Travel Tips Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Current Weather */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-sm flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-primary" />
                  {t('weather.currentWeather', 'Anlık Hava Durumu')}
                </h3>
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" /> {currentTime}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {getWeatherIcon(weather.condition)}
                  <div>
                    <p className="text-3xl font-bold">{weather.temp}°C</p>
                    <p className="text-sm text-muted-foreground">{getConditionText(weather.condition, t)}</p>
                  </div>
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Thermometer className="h-3 w-3" />
                    <span>{t('weather.feelsLike', 'Hissedilen')}: {weather.feelsLike}°</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Droplets className="h-3 w-3" />
                    <span>{t('weather.humidity', 'Nem')}: %{weather.humidity}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>{t('weather.highLow', 'Maks/Min')}: {weather.high}°/{weather.low}°</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Wind className="h-3 w-3" />
                    <span>{t('weather.wind', 'Rüzgar')}: {weather.wind} km/s</span>
                  </div>
                </div>
              </div>
              
              {/* Weather-based recommendations */}
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {t('weather.hotelTips', 'Otel Seçimi İpuçları')}:
                </p>
                <div className="space-y-1">
                  {recommendations.map((rec, idx) => (
                    <p key={idx} className="text-xs text-foreground">{rec}</p>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Currency & Best Time */}
            <div className="p-5">
              <h3 className="font-display font-semibold text-sm flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-primary" />
                {t('currency.exchangeRates', 'Güncel Döviz Kuru')}
              </h3>
              
              {localCurrency && localCurrency.code !== 'TRY' && (
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">1 {localCurrency.symbol} {localCurrency.code}</p>
                      <p className="text-xs text-muted-foreground">{localCurrency.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        ₺{localCurrency.rate.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">{t('currency.turkishLira', 'Türk Lirası')}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Travel Season */}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p className="text-xs font-medium">{t('travel.bestTimeToVisit', 'En İyi Ziyaret Zamanı')}</p>
                </div>
                <p className="text-sm text-foreground">{bestTimeToVisit}</p>
                
                {/* Current month indicator */}
                {(() => {
                  const currentMonth = new Date().toLocaleDateString('tr-TR', { month: 'long' });
                  const isGoodTime = bestTimeToVisit.toLowerCase().includes(currentMonth.toLowerCase().slice(0, 3));
                  return (
                    <Badge 
                      variant={isGoodTime ? 'default' : 'secondary'} 
                      className="mt-2 text-xs"
                    >
                      {isGoodTime 
                        ? `✨ ${t('travel.goodTimeNow', 'Şu an ideal dönem!')}` 
                        : `📅 ${t('travel.planAhead', 'Önceden planlayın')}`
                      }
                    </Badge>
                  );
                })()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Packing Tips based on weather */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-display font-semibold text-sm flex items-center gap-2 mb-3">
            <Shirt className="h-4 w-4 text-primary" />
            {t('packing.title', 'Bavul Önerileri')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {weather.temp > 25 && (
              <>
                <Badge variant="outline">👕 Hafif giysiler</Badge>
                <Badge variant="outline">🩱 Mayo</Badge>
                <Badge variant="outline">🧴 Güneş kremi</Badge>
                <Badge variant="outline">🕶️ Güneş gözlüğü</Badge>
              </>
            )}
            {weather.temp > 15 && weather.temp <= 25 && (
              <>
                <Badge variant="outline">👔 Katmanlı giysiler</Badge>
                <Badge variant="outline">🧥 Hafif ceket</Badge>
                <Badge variant="outline">👟 Rahat ayakkabı</Badge>
              </>
            )}
            {weather.temp <= 15 && (
              <>
                <Badge variant="outline">🧥 Kalın mont</Badge>
                <Badge variant="outline">🧣 Atkı/bere</Badge>
                <Badge variant="outline">🧤 Eldiven</Badge>
                <Badge variant="outline">👢 Bot</Badge>
              </>
            )}
            {weather.condition === 'rainy' && (
              <Badge variant="outline">☔ Yağmurluk</Badge>
            )}
            <Badge variant="outline">💳 Kredi kartı</Badge>
            <Badge variant="outline">🔌 Adaptör</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}