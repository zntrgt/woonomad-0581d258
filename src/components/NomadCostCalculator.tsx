import { useState, useMemo } from 'react';
import { Calculator, Home, Coffee, Wifi, Bus, Utensils, HeartPulse, Sparkles, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { nomadMetrics, getCitiesWithNomadData } from '@/lib/nomad';
import { cityData } from '@/lib/cities';
import { cn } from '@/lib/utils';

interface CostBreakdown {
  accommodation: number;
  coworking: number;
  food: number;
  transport: number;
  entertainment: number;
  health: number;
  other: number;
  total: number;
}

type LifestyleType = 'budget' | 'moderate' | 'comfort';
type AccommodationType = 'hostel' | 'shared' | 'studio' | 'apartment';

const lifestyleMultipliers: Record<LifestyleType, number> = {
  budget: 0.7,
  moderate: 1,
  comfort: 1.5,
};

const accommodationMultipliers: Record<AccommodationType, number> = {
  hostel: 0.3,
  shared: 0.5,
  studio: 0.8,
  apartment: 1.2,
};

// Base costs by city (approximate monthly in EUR)
const cityBaseCosts: Record<string, CostBreakdown> = {
  berlin: { accommodation: 900, coworking: 250, food: 400, transport: 80, entertainment: 200, health: 100, other: 100, total: 0 },
  lizbon: { accommodation: 800, coworking: 200, food: 350, transport: 50, entertainment: 150, health: 80, other: 80, total: 0 },
  barcelona: { accommodation: 850, coworking: 220, food: 380, transport: 60, entertainment: 180, health: 90, other: 90, total: 0 },
  amsterdam: { accommodation: 1200, coworking: 280, food: 450, transport: 100, entertainment: 200, health: 120, other: 120, total: 0 },
  paris: { accommodation: 1400, coworking: 300, food: 500, transport: 80, entertainment: 250, health: 120, other: 150, total: 0 },
  londra: { accommodation: 1500, coworking: 350, food: 550, transport: 150, entertainment: 300, health: 130, other: 150, total: 0 },
  roma: { accommodation: 800, coworking: 180, food: 380, transport: 50, entertainment: 150, health: 80, other: 80, total: 0 },
  milano: { accommodation: 950, coworking: 220, food: 400, transport: 60, entertainment: 180, health: 100, other: 100, total: 0 },
  prag: { accommodation: 650, coworking: 150, food: 280, transport: 30, entertainment: 120, health: 60, other: 60, total: 0 },
  budapes: { accommodation: 550, coworking: 120, food: 250, transport: 25, entertainment: 100, health: 50, other: 50, total: 0 },
  tokyo: { accommodation: 1100, coworking: 300, food: 450, transport: 100, entertainment: 200, health: 80, other: 120, total: 0 },
  singapur: { accommodation: 1400, coworking: 350, food: 400, transport: 80, entertainment: 200, health: 100, other: 150, total: 0 },
  dubai: { accommodation: 1200, coworking: 280, food: 400, transport: 100, entertainment: 250, health: 100, other: 150, total: 0 },
  bali: { accommodation: 500, coworking: 150, food: 200, transport: 50, entertainment: 100, health: 50, other: 50, total: 0 },
  bangkok: { accommodation: 450, coworking: 120, food: 180, transport: 30, entertainment: 100, health: 40, other: 50, total: 0 },
  seul: { accommodation: 800, coworking: 200, food: 350, transport: 60, entertainment: 150, health: 60, other: 80, total: 0 },
  taipei: { accommodation: 600, coworking: 150, food: 250, transport: 40, entertainment: 120, health: 50, other: 60, total: 0 },
  chiangmai: { accommodation: 350, coworking: 100, food: 150, transport: 30, entertainment: 80, health: 30, other: 40, total: 0 },
  hochiminh: { accommodation: 400, coworking: 100, food: 180, transport: 30, entertainment: 100, health: 40, other: 50, total: 0 },
  kualalumpur: { accommodation: 500, coworking: 130, food: 200, transport: 40, entertainment: 100, health: 50, other: 60, total: 0 },
  meksikocity: { accommodation: 550, coworking: 150, food: 220, transport: 30, entertainment: 120, health: 50, other: 60, total: 0 },
  buenosaires: { accommodation: 400, coworking: 100, food: 180, transport: 20, entertainment: 100, health: 40, other: 50, total: 0 },
  medellin: { accommodation: 450, coworking: 120, food: 200, transport: 25, entertainment: 100, health: 50, other: 55, total: 0 },
  tiflis: { accommodation: 350, coworking: 80, food: 150, transport: 20, entertainment: 80, health: 30, other: 40, total: 0 },
};

const categoryIcons = {
  accommodation: Home,
  coworking: Wifi,
  food: Utensils,
  transport: Bus,
  entertainment: Sparkles,
  health: HeartPulse,
  other: DollarSign,
};

const categoryLabels = {
  accommodation: 'Konaklama',
  coworking: 'Coworking',
  food: 'Yemek',
  transport: 'Ulaşım',
  entertainment: 'Eğlence',
  health: 'Sağlık',
  other: 'Diğer',
};

export function NomadCostCalculator() {
  const [selectedCity, setSelectedCity] = useState<string>('lizbon');
  const [lifestyle, setLifestyle] = useState<LifestyleType>('moderate');
  const [accommodation, setAccommodation] = useState<AccommodationType>('studio');
  const [coworkingDays, setCoworkingDays] = useState([20]);
  const [eatingOut, setEatingOut] = useState([50]); // percentage

  const availableCities = useMemo(() => {
    return getCitiesWithNomadData()
      .map(slug => {
        const city = cityData[slug];
        if (!city) return null;
        return { slug, name: city.name, country: city.country };
      })
      .filter(Boolean);
  }, []);

  const calculatedCosts = useMemo((): CostBreakdown => {
    const baseCosts = cityBaseCosts[selectedCity] || cityBaseCosts.lizbon;
    const lifestyleMult = lifestyleMultipliers[lifestyle];
    const accommMult = accommodationMultipliers[accommodation];
    const coworkingMult = coworkingDays[0] / 20; // relative to 20 days/month
    const eatingOutMult = 0.5 + (eatingOut[0] / 100); // 50% base + eating out percentage

    const costs: CostBreakdown = {
      accommodation: Math.round(baseCosts.accommodation * accommMult * lifestyleMult),
      coworking: Math.round(baseCosts.coworking * coworkingMult),
      food: Math.round(baseCosts.food * eatingOutMult * lifestyleMult),
      transport: Math.round(baseCosts.transport * lifestyleMult),
      entertainment: Math.round(baseCosts.entertainment * lifestyleMult),
      health: Math.round(baseCosts.health),
      other: Math.round(baseCosts.other * lifestyleMult),
      total: 0,
    };

    costs.total = Object.entries(costs)
      .filter(([key]) => key !== 'total')
      .reduce((sum, [, value]) => sum + value, 0);

    return costs;
  }, [selectedCity, lifestyle, accommodation, coworkingDays, eatingOut]);

  const cityMetrics = nomadMetrics[selectedCity];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Aylık Maliyet Hesaplayıcı
        </CardTitle>
        <CardDescription>
          Yaşam tarzınıza göre dijital göçebe bütçenizi hesaplayın
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* City Selection */}
        <div className="space-y-2">
          <Label>Şehir Seçin</Label>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger>
              <SelectValue placeholder="Şehir seçin" />
            </SelectTrigger>
            <SelectContent>
              {availableCities.map((city) => city && (
                <SelectItem key={city.slug} value={city.slug}>
                  {city.name}, {city.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lifestyle */}
        <div className="space-y-2">
          <Label>Yaşam Tarzı</Label>
          <div className="grid grid-cols-3 gap-2">
            {(['budget', 'moderate', 'comfort'] as LifestyleType[]).map((l) => (
              <Button
                key={l}
                variant={lifestyle === l ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLifestyle(l)}
                className="w-full"
              >
                {l === 'budget' && '💰 Bütçe'}
                {l === 'moderate' && '⚖️ Orta'}
                {l === 'comfort' && '✨ Konfor'}
              </Button>
            ))}
          </div>
        </div>

        {/* Accommodation Type */}
        <div className="space-y-2">
          <Label>Konaklama Tipi</Label>
          <div className="grid grid-cols-2 gap-2">
            {(['hostel', 'shared', 'studio', 'apartment'] as AccommodationType[]).map((a) => (
              <Button
                key={a}
                variant={accommodation === a ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAccommodation(a)}
                className="w-full text-xs"
              >
                {a === 'hostel' && '🛏️ Hostel'}
                {a === 'shared' && '👥 Paylaşımlı'}
                {a === 'studio' && '🏠 Stüdyo'}
                {a === 'apartment' && '🏢 Daire'}
              </Button>
            ))}
          </div>
        </div>

        {/* Coworking Days */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Aylık Coworking Günü</Label>
            <span className="text-sm text-muted-foreground">{coworkingDays[0]} gün</span>
          </div>
          <Slider
            value={coworkingDays}
            onValueChange={setCoworkingDays}
            min={0}
            max={30}
            step={1}
          />
        </div>

        {/* Eating Out */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Dışarıda Yeme Oranı</Label>
            <span className="text-sm text-muted-foreground">%{eatingOut[0]}</span>
          </div>
          <Slider
            value={eatingOut}
            onValueChange={setEatingOut}
            min={0}
            max={100}
            step={10}
          />
        </div>

        {/* Cost Breakdown */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-3">Tahmini Aylık Maliyet</h4>
          <div className="space-y-2">
            {Object.entries(calculatedCosts)
              .filter(([key]) => key !== 'total')
              .map(([key, value]) => {
                const Icon = categoryIcons[key as keyof typeof categoryIcons];
                const label = categoryLabels[key as keyof typeof categoryLabels];
                const percentage = Math.round((value / calculatedCosts.total) * 100);
                return (
                  <div key={key} className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm flex-1">{label}</span>
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">€{value}</span>
                  </div>
                );
              })}
          </div>
          
          {/* Total */}
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <div>
              <span className="text-lg font-bold">Toplam</span>
              {cityMetrics && (
                <p className="text-xs text-muted-foreground">
                  Yerel ortalama: {cityMetrics.costOfLiving}
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">€{calculatedCosts.total}</span>
              <span className="text-sm text-muted-foreground">/ay</span>
            </div>
          </div>

          {/* Comparison Badge */}
          {cityMetrics && (
            <div className="mt-3">
              {calculatedCosts.total < 1200 && (
                <Badge className="bg-green-100 text-green-700">💰 Bütçe Dostu</Badge>
              )}
              {calculatedCosts.total >= 1200 && calculatedCosts.total < 2000 && (
                <Badge className="bg-yellow-100 text-yellow-700">⚖️ Orta Bütçe</Badge>
              )}
              {calculatedCosts.total >= 2000 && (
                <Badge className="bg-purple-100 text-purple-700">✨ Premium Yaşam</Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
