import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { X, Plus, ArrowRight, Wifi, DollarSign, Shield, Sun, Users, Building2, Coffee, Globe, Star, ChevronDown, Save, Share2, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { nomadMetrics, getCitiesWithNomadData, type NomadMetrics } from '@/lib/nomad';
import { cityData, type CityInfo } from '@/lib/cities';
import { useSavedComparisons } from '@/hooks/useSavedComparisons';
import { cn } from '@/lib/utils';

interface CityWithMetrics extends CityInfo {
  slug: string;
  metrics: NomadMetrics;
}

const MAX_CITIES = 4;

const metricLabels = {
  nomadScore: { label: 'Nomad Skoru', icon: Star, max: 10 },
  safetyScore: { label: 'Güvenlik', icon: Shield, max: 10 },
  weatherScore: { label: 'Hava Durumu', icon: Sun, max: 10 },
  communityScore: { label: 'Topluluk', icon: Users, max: 10 },
};

export function CityComparison() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [savedDialogOpen, setSavedDialogOpen] = useState(false);
  const [comparisonName, setComparisonName] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  
  const { comparisons, saveComparison, deleteComparison, copyShareLink } = useSavedComparisons();

  // Load cities from URL on mount
  useEffect(() => {
    const compareParam = searchParams.get('compare');
    if (compareParam) {
      const cities = compareParam.split(',').slice(0, MAX_CITIES);
      setSelectedCities(cities);
    }
  }, [searchParams]);

  // Get all cities with nomad data
  const availableCities = useMemo(() => {
    const citySlugs = getCitiesWithNomadData();
    return citySlugs
      .map(slug => {
        const city = cityData[slug];
        const metrics = nomadMetrics[slug];
        if (!city || !metrics) return null;
        return { ...city, slug, metrics };
      })
      .filter((city): city is CityWithMetrics => city !== null);
  }, []);

  // Get selected city data
  const selectedCityData = useMemo(() => {
    return selectedCities
      .map(slug => availableCities.find(c => c.slug === slug))
      .filter((city): city is CityWithMetrics => city !== null);
  }, [selectedCities, availableCities]);

  // Cities not yet selected
  const unselectedCities = useMemo(() => {
    return availableCities.filter(city => !selectedCities.includes(city.slug));
  }, [availableCities, selectedCities]);

  const addCity = (slug: string) => {
    if (selectedCities.length < MAX_CITIES && !selectedCities.includes(slug)) {
      setSelectedCities([...selectedCities, slug]);
    }
    setIsOpen(false);
  };

  const removeCity = (slug: string) => {
    setSelectedCities(selectedCities.filter(s => s !== slug));
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getBestCity = (metric: keyof NomadMetrics) => {
    if (selectedCityData.length === 0) return null;
    return selectedCityData.reduce((best, city) => {
      const currentValue = city.metrics[metric];
      const bestValue = best.metrics[metric];
      if (typeof currentValue === 'number' && typeof bestValue === 'number') {
        return currentValue > bestValue ? city : best;
      }
      return best;
    });
  };

  return (
    <div className="space-y-6">
      {/* City Selection */}
      <div className="flex flex-wrap items-center gap-3">
        {selectedCityData.map((city) => (
          <Badge
            key={city.slug}
            variant="secondary"
            className="pl-3 pr-2 py-2 text-sm flex items-center gap-2"
          >
            <img
              src={city.image}
              alt={city.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            {city.name}
            <button
              onClick={() => removeCity(city.slug)}
              className="ml-1 hover:bg-muted rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {selectedCities.length < MAX_CITIES && (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Plus className="h-4 w-4 mr-2" />
                Şehir Ekle
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <Command>
                <CommandInput placeholder="Şehir ara..." />
                <CommandList>
                  <CommandEmpty>Şehir bulunamadı.</CommandEmpty>
                  <CommandGroup>
                    {unselectedCities.map((city) => (
                      <CommandItem
                        key={city.slug}
                        value={city.name}
                        onSelect={() => addCity(city.slug)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <img
                          src={city.image}
                          alt={city.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{city.name}</span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {city.metrics.nomadScore}/10
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        {selectedCities.length > 0 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCities([])}
              className="text-muted-foreground"
            >
              Temizle
            </Button>
            
            {/* Save Button */}
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Kaydet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Karşılaştırmayı Kaydet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">İsim</Label>
                    <Input
                      id="name"
                      value={comparisonName}
                      onChange={(e) => setComparisonName(e.target.value)}
                      placeholder={`${selectedCityData.map(c => c.name).join(' vs ')}`}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Şehirler: {selectedCityData.map(c => c.name).join(', ')}
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => {
                    saveComparison(selectedCities, comparisonName || undefined);
                    setSaveDialogOpen(false);
                    setComparisonName('');
                    toast.success('Karşılaştırma kaydedildi');
                  }}>
                    Kaydet
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Share Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const success = await copyShareLink(selectedCities);
                if (success) {
                  setLinkCopied(true);
                  toast.success('Link panoya kopyalandı!');
                  setTimeout(() => setLinkCopied(false), 2000);
                }
              }}
            >
              {linkCopied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
              {linkCopied ? 'Kopyalandı!' : 'Paylaş'}
            </Button>
          </>
        )}
        
        {/* Saved Comparisons Button */}
        {comparisons.length > 0 && (
          <Dialog open={savedDialogOpen} onOpenChange={setSavedDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                Kayıtlı ({comparisons.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Kayıtlı Karşılaştırmalar</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {comparisons.map((comp) => (
                  <div 
                    key={comp.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      setSelectedCities(comp.cities);
                      setSavedDialogOpen(false);
                    }}
                  >
                    <div>
                      <div className="font-medium text-sm">{comp.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {comp.cities.length} şehir • {new Date(comp.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteComparison(comp.id);
                        toast.success('Silindi');
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Comparison Table */}
      {selectedCityData.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* City Headers */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedCityData.length}, 1fr)` }}>
              <div className="p-4" />
              {selectedCityData.map((city) => (
                <Card key={city.slug} className="overflow-hidden">
                  <div className="relative h-24">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3">
                      <h3 className="font-bold text-white">{city.name}</h3>
                      <p className="text-white/80 text-xs">{city.country}</p>
                    </div>
                    <button
                      onClick={() => removeCity(city.slug)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/30 hover:bg-black/50 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Metrics Rows */}
            <div className="mt-4 space-y-1">
              {/* Internet Speed */}
              <div className="grid gap-4 py-3 border-b" style={{ gridTemplateColumns: `200px repeat(${selectedCityData.length}, 1fr)` }}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Wifi className="h-4 w-4 text-primary" />
                  İnternet Hızı
                </div>
                {selectedCityData.map((city) => (
                  <div key={city.slug} className="text-sm font-semibold">
                    {city.metrics.internetSpeed}
                  </div>
                ))}
              </div>

              {/* Cost of Living */}
              <div className="grid gap-4 py-3 border-b" style={{ gridTemplateColumns: `200px repeat(${selectedCityData.length}, 1fr)` }}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Yaşam Maliyeti
                </div>
                {selectedCityData.map((city) => (
                  <div key={city.slug} className="text-sm font-semibold">
                    {city.metrics.costOfLiving}
                  </div>
                ))}
              </div>

              {/* Coworking Count */}
              <div className="grid gap-4 py-3 border-b" style={{ gridTemplateColumns: `200px repeat(${selectedCityData.length}, 1fr)` }}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Building2 className="h-4 w-4 text-primary" />
                  Coworking Alanı
                </div>
                {selectedCityData.map((city) => (
                  <div key={city.slug} className="text-sm font-semibold">
                    {city.metrics.coworkingCount}+
                  </div>
                ))}
              </div>

              {/* Cafes with WiFi */}
              <div className="grid gap-4 py-3 border-b" style={{ gridTemplateColumns: `200px repeat(${selectedCityData.length}, 1fr)` }}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Coffee className="h-4 w-4 text-primary" />
                  WiFi'lı Kafe
                </div>
                {selectedCityData.map((city) => (
                  <div key={city.slug} className="text-sm font-semibold">
                    {city.metrics.cafesWithWifi}+
                  </div>
                ))}
              </div>

              {/* Timezone */}
              <div className="grid gap-4 py-3 border-b" style={{ gridTemplateColumns: `200px repeat(${selectedCityData.length}, 1fr)` }}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="h-4 w-4 text-primary" />
                  Saat Dilimi
                </div>
                {selectedCityData.map((city) => (
                  <div key={city.slug} className="text-sm font-semibold">
                    {city.metrics.timezone}
                  </div>
                ))}
              </div>

              {/* Score Metrics */}
              {Object.entries(metricLabels).map(([key, { label, icon: Icon, max }]) => {
                const bestCity = getBestCity(key as keyof NomadMetrics);
                return (
                  <div key={key} className="grid gap-4 py-3 border-b" style={{ gridTemplateColumns: `200px repeat(${selectedCityData.length}, 1fr)` }}>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Icon className="h-4 w-4 text-primary" />
                      {label}
                    </div>
                    {selectedCityData.map((city) => {
                      const value = city.metrics[key as keyof NomadMetrics];
                      const isBest = bestCity?.slug === city.slug && selectedCityData.length > 1;
                      return (
                        <div key={city.slug} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={cn("text-sm font-bold", getScoreColor(value as number))}>
                              {value}/{max}
                            </span>
                            {isBest && (
                              <Badge className="text-xs bg-green-100 text-green-700">
                                En İyi
                              </Badge>
                            )}
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all", getProgressColor(value as number, max))}
                              style={{ width: `${((value as number) / max) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* Visa Info */}
              <div className="grid gap-4 py-3" style={{ gridTemplateColumns: `200px repeat(${selectedCityData.length}, 1fr)` }}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="h-4 w-4 text-primary" />
                  Vize Bilgisi
                </div>
                {selectedCityData.map((city) => (
                  <div key={city.slug} className="text-sm text-muted-foreground">
                    {city.metrics.visaInfo}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-4 mt-6" style={{ gridTemplateColumns: `200px repeat(${selectedCityData.length}, 1fr)` }}>
              <div />
              {selectedCityData.map((city) => (
                <Link key={city.slug} to={`/sehir/${city.slug}/nomad`}>
                  <Button className="w-full" size="sm">
                    Detayları Gör
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-semibold text-lg mb-2">Şehirleri Karşılaştırın</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Dijital göçebe metrikleri yan yana görmek için en fazla {MAX_CITIES} şehir seçebilirsiniz.
            </p>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  İlk Şehri Ekle
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="center">
                <Command>
                  <CommandInput placeholder="Şehir ara..." />
                  <CommandList>
                    <CommandEmpty>Şehir bulunamadı.</CommandEmpty>
                    <CommandGroup>
                      {availableCities.map((city) => (
                        <CommandItem
                          key={city.slug}
                          value={city.name}
                          onSelect={() => addCity(city.slug)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <img
                            src={city.image}
                            alt={city.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span>{city.name}</span>
                          <Badge variant="outline" className="ml-auto text-xs">
                            {city.metrics.nomadScore}/10
                          </Badge>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
