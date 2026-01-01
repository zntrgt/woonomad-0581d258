import { useState } from 'react';
import { Loader2, MapPin, Users, Calendar, Heart, Sparkles, Baby, User, Users2, Briefcase, TreePine, History, ShoppingBag, Utensils, Camera, Music, Mountain, Waves, Wallet, BookmarkPlus, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useGeneralFavorites } from '@/hooks/useGeneralFavorites';

interface TripPlannerProps {
  cityName: string;
  cityNameEn?: string;
  country: string;
  citySlug?: string;
}

interface Activity {
  time: string;
  place: string;
  description: string;
  duration: string;
  estimatedCost?: number;
  coordinates?: { lat: number; lng: number };
}

interface ItineraryDay {
  day: number;
  theme: string;
  activities: Activity[];
  dailyBudget?: number;
}

interface GeneratedItinerary {
  title: string;
  summary: string;
  days: ItineraryDay[];
  tips: string[];
  totalBudget?: number;
  currency?: string;
}

const INTERESTS = [
  { id: 'history', label: 'Tarih', icon: History },
  { id: 'nature', label: 'Doğa', icon: TreePine },
  { id: 'food', label: 'Yemek', icon: Utensils },
  { id: 'shopping', label: 'Alışveriş', icon: ShoppingBag },
  { id: 'photography', label: 'Fotoğraf', icon: Camera },
  { id: 'nightlife', label: 'Gece Hayatı', icon: Music },
  { id: 'adventure', label: 'Macera', icon: Mountain },
  { id: 'beach', label: 'Deniz', icon: Waves },
];

const TRAVELER_TYPES = [
  { id: 'solo', label: 'Yalnız Gezgin', icon: User },
  { id: 'couple', label: 'Çift', icon: Heart },
  { id: 'family', label: 'Aile (Çocuklu)', icon: Baby },
  { id: 'friends', label: 'Arkadaş Grubu', icon: Users2 },
  { id: 'business', label: 'İş Seyahati', icon: Briefcase },
];

const DAY_OPTIONS = [1, 2, 3, 4, 5, 7];

export function TripPlanner({ cityName, cityNameEn, country, citySlug }: TripPlannerProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [travelerType, setTravelerType] = useState<string>('');
  const [days, setDays] = useState<number>(3);
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const { toast } = useToast();
  const { addFavorite, isFavorite } = useGeneralFavorites();

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const generateItinerary = async () => {
    if (selectedInterests.length === 0) {
      toast({
        title: 'İlgi alanı seçin',
        description: 'En az bir ilgi alanı seçmeniz gerekiyor.',
        variant: 'destructive',
      });
      return;
    }

    if (!travelerType) {
      toast({
        title: 'Gezgin tipi seçin',
        description: 'Gezgin tipinizi seçmeniz gerekiyor.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setItinerary(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-itinerary', {
        body: {
          city: cityName,
          cityEn: cityNameEn || cityName,
          country,
          interests: selectedInterests,
          travelerType,
          days,
        }
      });

      if (error) throw error;

      if (data?.itinerary) {
        setItinerary(data.itinerary);
      } else {
        throw new Error('Gezi planı oluşturulamadı');
      }
    } catch (err) {
      console.error('Itinerary generation error:', err);
      toast({
        title: 'Hata',
        description: 'Gezi planı oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInterestLabel = (id: string) => INTERESTS.find(i => i.id === id)?.label || id;
  const getTravelerLabel = (id: string) => TRAVELER_TYPES.find(t => t.id === id)?.label || id;

  const saveToFavorites = () => {
    if (!itinerary) return;
    
    const favoriteId = `itinerary-${citySlug || cityName}-${Date.now()}`;
    addFavorite({
      id: favoriteId,
      type: 'itinerary',
      title: itinerary.title,
      subtitle: `${days} gün • ${getTravelerLabel(travelerType)}`,
      data: {
        cityName,
        citySlug,
        country,
        interests: selectedInterests,
        travelerType,
        days,
        itinerary,
      },
      createdAt: new Date().toISOString(),
    });
    
    toast({
      title: 'Favorilere eklendi',
      description: 'Gezi planınız favorilerinize kaydedildi.',
    });
  };

  const openInMaps = (activity: Activity) => {
    const query = encodeURIComponent(`${activity.place}, ${cityName}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const isSaved = itinerary ? isFavorite(`itinerary-${citySlug || cityName}`) : false;

  return (
    <Card variant="elevated">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold">
              Kişiselleştirilmiş Gezi Planı
            </h2>
            <p className="text-muted-foreground text-sm">
              İlgi alanlarınıza göre {cityName} için özel rota oluşturun
            </p>
          </div>
        </div>

        {!itinerary ? (
          <div className="space-y-6">
            {/* Interests */}
            <div>
              <label className="text-sm font-medium mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                İlgi Alanlarınız (en fazla 4)
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(interest => {
                  const Icon = interest.icon;
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <Button
                      key={interest.id}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleInterest(interest.id)}
                      className="gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {interest.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Traveler Type */}
            <div>
              <label className="text-sm font-medium mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Gezgin Tipi
              </label>
              <div className="flex flex-wrap gap-2">
                {TRAVELER_TYPES.map(type => {
                  const Icon = type.icon;
                  const isSelected = travelerType === type.id;
                  return (
                    <Button
                      key={type.id}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTravelerType(type.id)}
                      className="gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {type.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Days */}
            <div>
              <label className="text-sm font-medium mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Kaç Gün?
              </label>
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
              onClick={generateItinerary} 
              disabled={isLoading}
              className="w-full gap-2"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gezi Planı Oluşturuluyor...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gezi Planı Oluştur
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header with Budget */}
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-display font-bold mb-2">{itinerary.title}</h3>
                  <p className="text-muted-foreground text-sm">{itinerary.summary}</p>
                </div>
                {itinerary.totalBudget && (
                  <div className="flex-shrink-0 bg-primary/10 rounded-xl px-4 py-2 text-center">
                    <div className="flex items-center gap-1 text-primary">
                      <Wallet className="w-4 h-4" />
                      <span className="text-xs font-medium">Tahmini Bütçe</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      {itinerary.totalBudget.toLocaleString('tr-TR')} {itinerary.currency || '€'}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedInterests.map(id => (
                  <Badge key={id} variant="secondary" className="text-xs">
                    {getInterestLabel(id)}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-xs">
                  {getTravelerLabel(travelerType)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {days} Gün
                </Badge>
              </div>
            </div>

            {/* Days */}
            <div className="space-y-4">
              {itinerary.days.map((day) => (
                <div key={day.day} className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-primary/10 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {day.day}
                      </div>
                      <div>
                        <span className="font-medium">Gün {day.day}</span>
                        <span className="text-muted-foreground text-sm ml-2">• {day.theme}</span>
                      </div>
                    </div>
                    {day.dailyBudget && (
                      <Badge variant="secondary" className="gap-1">
                        <Wallet className="w-3 h-3" />
                        ~{day.dailyBudget} {itinerary.currency || '€'}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    {day.activities.map((activity, idx) => (
                      <div key={idx} className="flex gap-3 group">
                        <div className="flex-shrink-0 w-16 text-sm text-muted-foreground font-medium">
                          {activity.time}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{activity.place}</p>
                                <button
                                  onClick={() => openInMaps(activity)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                                  title="Google Maps'te aç"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground/70">
                                <span>Süre: {activity.duration}</span>
                                {activity.estimatedCost !== undefined && (
                                  <span className="flex items-center gap-1">
                                    <Wallet className="w-3 h-3" />
                                    ~{activity.estimatedCost} {itinerary.currency || '€'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            {itinerary.tips && itinerary.tips.length > 0 && (
              <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-warning" />
                  İpuçları
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {itinerary.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-warning">•</span>
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
                onClick={() => setItinerary(null)}
                className="flex-1"
              >
                Yeni Plan Oluştur
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
