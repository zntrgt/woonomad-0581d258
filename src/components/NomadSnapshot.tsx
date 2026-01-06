import { Link } from 'react-router-dom';
import { Wifi, DollarSign, Laptop, Shield, Sun, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getNomadMetrics, NomadMetrics } from '@/lib/nomad';

interface NomadSnapshotProps {
  citySlug: string;
  cityName: string;
}

function ScoreBar({ score, max = 10 }: { score: number; max?: number }) {
  const percentage = (score / max) * 100;
  return (
    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
      <div 
        className="h-full bg-primary rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 8) return 'bg-success text-success-foreground';
    if (score >= 6) return 'bg-warning text-warning-foreground';
    return 'bg-muted text-muted-foreground';
  };
  
  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getColor()}`}>
      {score}
    </span>
  );
}

export function NomadSnapshot({ citySlug, cityName }: NomadSnapshotProps) {
  const metrics = getNomadMetrics(citySlug);
  
  if (!metrics) {
    return null;
  }

  return (
    <Card variant="elevated">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-display font-bold flex items-center gap-2">
            <Laptop className="w-5 h-5 text-primary" />
            Dijital Nomad Özeti
          </h3>
          <ScoreBadge score={metrics.nomadScore} />
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-muted-foreground" />
            <div className="text-xs">
              <span className="text-muted-foreground">İnternet: </span>
              <span className="font-medium">{metrics.internetSpeed}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div className="text-xs">
              <span className="text-muted-foreground">Yaşam: </span>
              <span className="font-medium">{metrics.costOfLiving}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-muted-foreground" />
            <div className="text-xs">
              <span className="text-muted-foreground">Coworking: </span>
              <span className="font-medium">{metrics.coworkingCount}+</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div className="text-xs">
              <span className="text-muted-foreground">Topluluk: </span>
              <span className="font-medium">{metrics.communityScore}/10</span>
            </div>
          </div>
        </div>
        
        {/* Score bars */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground w-16">Güvenlik</span>
            <div className="flex-1">
              <ScoreBar score={metrics.safetyScore} />
            </div>
            <span className="text-xs font-medium w-6">{metrics.safetyScore}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground w-16">Hava</span>
            <div className="flex-1">
              <ScoreBar score={metrics.weatherScore} />
            </div>
            <span className="text-xs font-medium w-6">{metrics.weatherScore}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="flex-1 text-xs">
            <Link to={`/sehir/${citySlug}/nomad`}>
              Nomad Rehberi
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="flex-1 text-xs">
            <Link to={`/sehir/${citySlug}/coworking`}>
              Coworking
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for entry point on city page
export function NomadEntryCard({ citySlug, cityName }: NomadSnapshotProps) {
  const metrics = getNomadMetrics(citySlug);
  
  if (!metrics) {
    return null;
  }

  return (
    <Link to={`/sehir/${citySlug}/nomad`}>
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40 transition-all group cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Laptop className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm">
                  Dijital Nomad Rehberi
                </h3>
                <p className="text-xs text-muted-foreground">
                  {metrics.coworkingCount}+ coworking • {metrics.internetSpeed}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Skor: {metrics.nomadScore}/10
              </Badge>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
