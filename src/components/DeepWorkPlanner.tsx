import { useState } from 'react';
import { 
  Loader2, Clock, Globe, Wifi, Coffee, MapPin, Laptop, 
  Sun, Moon, Sparkles, BookmarkPlus, Check, ExternalLink,
  Briefcase, Timer, Target, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useGeneralFavorites } from '@/hooks/useGeneralFavorites';
import { getNomadMetrics, getCoworkingSpacesByCity } from '@/lib/nomad';

interface DeepWorkPlannerProps {
  cityName: string;
  citySlug: string;
  country: string;
  timezone?: string;
}

interface WorkBlock {
  time: string;
  duration: string;
  type: 'deep-work' | 'shallow-work' | 'break' | 'explore';
  location: string;
  locationDetails?: string;
  wifiSpeed?: string;
  task?: string;
  tips?: string;
}

interface DayPlan {
  day: number;
  date?: string;
  theme: string;
  workHours: number;
  exploreHours: number;
  blocks: WorkBlock[];
}

interface DeepWorkRota {
  title: string;
  summary: string;
  userTimezone: string;
  destinationTimezone: string;
  timeDiff: string;
  days: DayPlan[];
  productivityTips: string[];
  bestWorkLocations: { name: string; wifiSpeed: string; quietLevel: string }[];
}

const TIMEZONES = [
  { value: 'America/New_York', label: 'EST (New York) UTC-5' },
  { value: 'America/Los_Angeles', label: 'PST (Los Angeles) UTC-8' },
  { value: 'America/Chicago', label: 'CST (Chicago) UTC-6' },
  { value: 'Europe/London', label: 'GMT (London) UTC+0' },
  { value: 'Europe/Paris', label: 'CET (Paris) UTC+1' },
  { value: 'Europe/Istanbul', label: 'TRT (İstanbul) UTC+3' },
  { value: 'Asia/Dubai', label: 'GST (Dubai) UTC+4' },
  { value: 'Asia/Singapore', label: 'SGT (Singapur) UTC+8' },
  { value: 'Asia/Tokyo', label: 'JST (Tokyo) UTC+9' },
  { value: 'Australia/Sydney', label: 'AEDT (Sydney) UTC+11' },
];

const WORK_STYLES = [
  { id: 'morning', label: 'Sabah Kuşu', icon: Sun, description: '5-6 saat sabah deep work' },
  { id: 'split', label: 'Bölünmüş', icon: Target, description: 'Sabah + akşam blokları' },
  { id: 'afternoon', label: 'Gece Baykuşu', icon: Moon, description: 'Öğleden sonra/akşam çalışma' },
  { id: 'flexible', label: 'Esnek', icon: Timer, description: 'Kafe hoplamı tarzı' },
];

const DAY_OPTIONS = [3, 5, 7];

export function DeepWorkPlanner({ cityName, citySlug, country, timezone: cityTimezone }: DeepWorkPlannerProps) {
  const [userTimezone, setUserTimezone] = useState<string>('Europe/Istanbul');
  const [workHoursStart, setWorkHoursStart] = useState<string>('09:00');
  const [workHoursEnd, setWorkHoursEnd] = useState<string>('17:00');
  const [workStyle, setWorkStyle] = useState<string>('morning');
  const [days, setDays] = useState<number>(7);
  const [isLoading, setIsLoading] = useState(false);
  const [rota, setRota] = useState<DeepWorkRota | null>(null);
  const { toast } = useToast();
  const { addFavorite, isFavorite } = useGeneralFavorites();

  const nomadMetrics = getNomadMetrics(citySlug);
  const coworkingSpaces = getCoworkingSpacesByCity(citySlug);

  const generateRota = async () => {
    if (!userTimezone) {
      toast({
        title: 'Saat dilimi seçin',
        description: 'Çalıştığınız saat dilimini seçmeniz gerekiyor.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setRota(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-deep-work-rota', {
        body: {
          city: cityName,
          citySlug,
          country,
          userTimezone,
          destinationTimezone: cityTimezone || 'Europe/Istanbul',
          workHoursStart,
          workHoursEnd,
          workStyle,
          days,
          nomadMetrics: nomadMetrics ? {
            internetSpeed: nomadMetrics.internetSpeed,
            coworkingCount: nomadMetrics.coworkingCount,
            cafesWithWifi: nomadMetrics.cafesWithWifi,
          } : null,
          coworkingSpaces: coworkingSpaces.slice(0, 5).map(c => ({
            name: c.name,
            neighborhood: c.neighborhood,
            amenities: c.amenities,
          })),
        }
      });

      if (error) throw error;

      if (data?.rota) {
        setRota(data.rota);
      } else {
        throw new Error('Çalışma rotası oluşturulamadı');
      }
    } catch (err) {
      console.error('Deep work rota generation error:', err);
      toast({
        title: 'Hata',
        description: 'Çalışma rotası oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getBlockIcon = (type: WorkBlock['type']) => {
    switch (type) {
      case 'deep-work': return <Laptop className="w-4 h-4 text-primary" />;
      case 'shallow-work': return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'break': return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'explore': return <MapPin className="w-4 h-4 text-green-500" />;
    }
  };

  const getBlockLabel = (type: WorkBlock['type']) => {
    switch (type) {
      case 'deep-work': return 'Deep Work';
      case 'shallow-work': return 'Hafif Çalışma';
      case 'break': return 'Mola';
      case 'explore': return 'Keşif';
    }
  };

  const saveToFavorites = () => {
    if (!rota) return;
    
    const favoriteId = `deepwork-${citySlug}-${Date.now()}`;
    addFavorite({
      id: favoriteId,
      type: 'deep-work-rota',
      title: rota.title,
      subtitle: `${days} gün • ${WORK_STYLES.find(w => w.id === workStyle)?.label}`,
      data: {
        cityName,
        citySlug,
        country,
        userTimezone,
        workStyle,
        days,
        rota,
      },
      createdAt: new Date().toISOString(),
    });
    
    toast({
      title: 'Favorilere eklendi',
      description: 'Çalışma rotanız favorilerinize kaydedildi.',
    });
  };

  const openInMaps = (location: string) => {
    const query = encodeURIComponent(`${location}, ${cityName}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const isSaved = rota ? isFavorite(`deepwork-${citySlug}`) : false;

  return (
    <Card variant="elevated">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Laptop className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold">
              AI Deep Work Planner
            </h2>
            <p className="text-muted-foreground text-sm">
              Saat diliminize göre {cityName}'da çalışma + keşif rotası oluşturun
            </p>
          </div>
        </div>

        {/* Nomad Stats Preview */}
        {nomadMetrics && (
          <div className="flex flex-wrap gap-2 mb-6 p-3 bg-muted/50 rounded-lg">
            <Badge variant="secondary" className="gap-1">
              <Wifi className="w-3 h-3" />
              {nomadMetrics.internetSpeed}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Laptop className="w-3 h-3" />
              {nomadMetrics.coworkingCount} coworking
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Coffee className="w-3 h-3" />
              {nomadMetrics.cafesWithWifi} wifi kafe
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Globe className="w-3 h-3" />
              {nomadMetrics.timezone}
            </Badge>
          </div>
        )}

        {!rota ? (
          <div className="space-y-6">
            {/* Timezone Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Müşterilerinizin Saat Dilimi
                </Label>
                <Select value={userTimezone} onValueChange={setUserTimezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Saat dilimi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map(tz => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Çalışma Saatleri (Müşteri TZ)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={workHoursStart}
                      onChange={(e) => setWorkHoursStart(e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="time"
                      value={workHoursEnd}
                      onChange={(e) => setWorkHoursEnd(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Work Style */}
            <div>
              <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Çalışma Tarzı
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {WORK_STYLES.map(style => {
                  const Icon = style.icon;
                  const isSelected = workStyle === style.id;
                  return (
                    <Button
                      key={style.id}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      className="h-auto py-3 flex-col gap-1"
                      onClick={() => setWorkStyle(style.id)}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{style.label}</span>
                      <span className="text-xs opacity-70">{style.description}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Days */}
            <div>
              <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Kaç Gün?
              </Label>
              <div className="flex flex-wrap gap-2">
                {DAY_OPTIONS.map(d => (
                  <Button
                    key={d}
                    type="button"
                    variant={days === d ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDays(d)}
                    className="min-w-[60px]"
                  >
                    {d} Gün
                  </Button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button 
              onClick={generateRota} 
              disabled={isLoading}
              className="w-full gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Deep Work Rotası Oluşturuluyor...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Deep Work Rotası Oluştur
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl p-4">
              <h3 className="text-xl font-display font-bold mb-2">{rota.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{rota.summary}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Globe className="w-3 h-3" />
                  {rota.userTimezone} → {rota.destinationTimezone}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {rota.timeDiff}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {days} Gün
                </Badge>
              </div>
            </div>

            {/* Best Work Locations */}
            {rota.bestWorkLocations && rota.bestWorkLocations.length > 0 && (
              <div className="bg-muted/50 rounded-xl p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-primary" />
                  En İyi Çalışma Mekanları
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {rota.bestWorkLocations.map((loc, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-2 bg-background rounded-lg cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => openInMaps(loc.name)}
                    >
                      <div>
                        <p className="font-medium text-sm">{loc.name}</p>
                        <p className="text-xs text-muted-foreground">{loc.wifiSpeed}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {loc.quietLevel}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Days */}
            <div className="space-y-4">
              {rota.days.map((day) => (
                <div key={day.day} className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm">
                        {day.day}
                      </div>
                      <div>
                        <span className="font-medium">Gün {day.day}</span>
                        <span className="text-muted-foreground text-sm ml-2">• {day.theme}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Laptop className="w-3 h-3" />
                        {day.workHours}s çalışma
                      </Badge>
                      <Badge variant="outline" className="gap-1 text-xs">
                        <MapPin className="w-3 h-3" />
                        {day.exploreHours}s keşif
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {day.blocks.map((block, idx) => (
                      <div key={idx} className="flex gap-3 group">
                        <div className="flex-shrink-0 w-16 text-sm text-muted-foreground font-medium">
                          {block.time}
                        </div>
                        <div className="flex-shrink-0">
                          {getBlockIcon(block.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={block.type === 'deep-work' ? 'default' : 'secondary'} 
                              className="text-xs"
                            >
                              {getBlockLabel(block.type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{block.duration}</span>
                            {block.wifiSpeed && (
                              <Badge variant="outline" className="text-xs gap-1">
                                <Wifi className="w-2.5 h-2.5" />
                                {block.wifiSpeed}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="font-medium text-sm">{block.location}</p>
                            <button
                              onClick={() => openInMaps(block.location)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                              title="Google Maps'te aç"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                          {block.locationDetails && (
                            <p className="text-xs text-muted-foreground">{block.locationDetails}</p>
                          )}
                          {block.task && (
                            <p className="text-sm text-muted-foreground mt-1">
                              <span className="font-medium">Görev:</span> {block.task}
                            </p>
                          )}
                          {block.tips && (
                            <p className="text-xs text-violet-500 mt-1 italic">{block.tips}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Productivity Tips */}
            {rota.productivityTips && rota.productivityTips.length > 0 && (
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  Verimlilik İpuçları
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {rota.productivityTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-violet-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={saveToFavorites}
                className="flex-1 gap-2"
                disabled={isSaved}
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Kaydedildi
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4" />
                    Favorilere Kaydet
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setRota(null)}
                className="flex-1"
              >
                Yeni Rota Oluştur
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
