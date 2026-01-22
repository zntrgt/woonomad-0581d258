import { useState, useEffect } from 'react';
import { Wifi, ThumbsUp, ThumbsDown, Clock, MapPin, Activity, User, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface SpeedTest {
  id: string;
  location_type: string;
  location_name: string;
  download_speed: number;
  upload_speed: number | null;
  ping_ms: number | null;
  is_stable: boolean | null;
  notes: string | null;
  upvotes: number;
  downvotes: number;
  tested_at: string;
  user_id: string;
}

interface CommunitySpeedTestsProps {
  citySlug: string;
  locationType?: string;
  limit?: number;
}

const locationTypeLabels: Record<string, string> = {
  coworking: 'Coworking',
  cafe: 'Kafe',
  hotel: 'Otel',
  library: 'Kütüphane',
  other: 'Diğer',
};

const getSpeedColor = (speed: number): string => {
  if (speed >= 100) return 'text-green-600';
  if (speed >= 50) return 'text-primary';
  if (speed >= 25) return 'text-amber-600';
  return 'text-red-600';
};

const getSpeedBadge = (speed: number): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } => {
  if (speed >= 100) return { label: 'Mükemmel', variant: 'default' };
  if (speed >= 50) return { label: 'İyi', variant: 'secondary' };
  if (speed >= 25) return { label: 'Orta', variant: 'outline' };
  return { label: 'Yavaş', variant: 'destructive' };
};

function SpeedTestCard({ test, onVote }: { test: SpeedTest; onVote: (id: string, type: 'up' | 'down') => void }) {
  const speedBadge = getSpeedBadge(test.download_speed);
  const [showNotes, setShowNotes] = useState(false);

  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {locationTypeLabels[test.location_type] || test.location_type}
              </Badge>
              <Badge variant={speedBadge.variant} className="text-xs">
                {speedBadge.label}
              </Badge>
              {test.is_stable && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                  <Activity className="h-3 w-3 mr-1" />
                  Stabil
                </Badge>
              )}
            </div>
            
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              {test.location_name}
            </h4>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Wifi className={`h-4 w-4 ${getSpeedColor(test.download_speed)}`} />
                <span className={`font-semibold ${getSpeedColor(test.download_speed)}`}>
                  {test.download_speed} Mbps
                </span>
              </div>
              {test.upload_speed && (
                <span className="text-xs">↑ {test.upload_speed} Mbps</span>
              )}
              {test.ping_ms && (
                <span className="text-xs">
                  <Clock className="h-3 w-3 inline mr-0.5" />
                  {test.ping_ms}ms
                </span>
              )}
            </div>

            {test.notes && (
              <div className="mt-2">
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="text-xs text-primary flex items-center gap-1 hover:underline"
                >
                  {showNotes ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {showNotes ? 'Notları gizle' : 'Notları göster'}
                </button>
                {showNotes && (
                  <p className="text-xs text-muted-foreground mt-1 bg-muted/50 p-2 rounded">
                    {test.notes}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onVote(test.id, 'up')}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium">
              {test.upvotes - test.downvotes}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onVote(test.id, 'down')}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            Topluluk üyesi
          </span>
          <span>
            {format(new Date(test.tested_at), 'd MMMM yyyy', { locale: tr })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function CommunitySpeedTests({ citySlug, locationType, limit = 10 }: CommunitySpeedTestsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tests, setTests] = useState<SpeedTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);

  const fetchTests = async () => {
    setIsLoading(true);
    try {
      // Use public view to avoid exposing user_id
      let query = supabase
        .from('wifi_speed_tests_public')
        .select('*')
        .eq('city_slug', citySlug)
        .order('tested_at', { ascending: false })
        .limit(limit);

      if (locationType) {
        query = query.eq('location_type', locationType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error('Error fetching speed tests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [citySlug, locationType, limit]);

  const handleVote = async (testId: string, voteType: 'up' | 'down') => {
    if (!user) {
      toast({
        title: 'Giriş Gerekli',
        description: 'Oy vermek için giriş yapmalısınız.',
        variant: 'destructive',
      });
      return;
    }

    setVotingId(testId);

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('speed_test_votes')
        .select('id, vote_type')
        .eq('speed_test_id', testId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote
          await supabase.from('speed_test_votes').delete().eq('id', existingVote.id);
          
          // Update counts
          const test = tests.find(t => t.id === testId);
          if (test) {
            await supabase
              .from('wifi_speed_tests')
              .update({
                upvotes: voteType === 'up' ? test.upvotes - 1 : test.upvotes,
                downvotes: voteType === 'down' ? test.downvotes - 1 : test.downvotes,
              })
              .eq('id', testId);
          }
        } else {
          // Change vote
          await supabase
            .from('speed_test_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
          
          // Update counts
          const test = tests.find(t => t.id === testId);
          if (test) {
            await supabase
              .from('wifi_speed_tests')
              .update({
                upvotes: voteType === 'up' ? test.upvotes + 1 : test.upvotes - 1,
                downvotes: voteType === 'down' ? test.downvotes + 1 : test.downvotes - 1,
              })
              .eq('id', testId);
          }
        }
      } else {
        // New vote
        await supabase.from('speed_test_votes').insert({
          speed_test_id: testId,
          user_id: user.id,
          vote_type: voteType,
        });
        
        // Update counts
        const test = tests.find(t => t.id === testId);
        if (test) {
          await supabase
            .from('wifi_speed_tests')
            .update({
              upvotes: voteType === 'up' ? test.upvotes + 1 : test.upvotes,
              downvotes: voteType === 'down' ? test.downvotes + 1 : test.downvotes,
            })
            .eq('id', testId);
        }
      }

      // Refresh tests
      fetchTests();
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: 'Hata',
        description: 'Oy kaydedilirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setVotingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <Wifi className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Henüz bu şehir için WiFi hız testi paylaşılmamış.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            İlk test sonucunu sen paylaş!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate average speed
  const avgSpeed = Math.round(tests.reduce((acc, t) => acc + t.download_speed, 0) / tests.length);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            <Wifi className="h-3.5 w-3.5 mr-1" />
            Ortalama: {avgSpeed} Mbps
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {tests.length} test
          </Badge>
        </div>
      </div>

      <div className="grid gap-3">
        {tests.map((test) => (
          <SpeedTestCard 
            key={test.id} 
            test={test} 
            onVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
}
