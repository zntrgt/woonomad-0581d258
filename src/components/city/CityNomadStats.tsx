import { Link } from 'react-router-dom';
import { Wifi, Banknote, Shield, Users, Laptop, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NomadMetrics {
  nomadScore: number;
  internetSpeed: string;
  costOfLiving: string;
  safetyScore: number;
  communityScore: number;
  coworkingCount: number;
  cafesWithWifi: number;
  visaInfo: string;
}

interface CityNomadStatsProps {
  citySlug: string;
  cityName: string;
  nomadData: NomadMetrics | undefined;
}

export const CityNomadStats = ({ citySlug, cityName, nomadData }: CityNomadStatsProps) => {
  if (!nomadData) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground mb-4">
          {cityName} için dijital göçebe verileri yakında eklenecek.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/nomad-hub">Nomad Şehirlerini Keşfet</Link>
        </Button>
      </div>
    );
  }

  const stats = [
    { icon: Wifi, label: 'İnternet', value: nomadData.internetSpeed },
    { icon: Banknote, label: 'Aylık Maliyet', value: nomadData.costOfLiving },
    { icon: Shield, label: 'Güvenlik', value: `${nomadData.safetyScore}/10` },
    { icon: Users, label: 'Topluluk', value: `${nomadData.communityScore}/10` },
  ];

  const scoreLabel = nomadData.nomadScore >= 8 ? 'Mükemmel' : nomadData.nomadScore >= 6 ? 'İyi' : 'Gelişmekte';
  const scoreColor = nomadData.nomadScore >= 8 ? 'text-green-500' : nomadData.nomadScore >= 6 ? 'text-yellow-500' : 'text-orange-500';

  return (
    <div className="space-y-4">
      {/* Score Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className={`text-xl font-bold ${scoreColor}`}>{nomadData.nomadScore}</span>
          </div>
          <div>
            <p className="font-medium">{scoreLabel}</p>
            <p className="text-xs text-muted-foreground">Nomad Skoru</p>
          </div>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <p>{nomadData.coworkingCount}+ Coworking</p>
          <p>{nomadData.cafesWithWifi}+ WiFi Kafe</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div 
            key={stat.label}
            className="flex items-center gap-2 p-3 rounded-xl bg-muted/50"
          >
            <stat.icon className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-sm font-medium truncate">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button asChild variant="outline" size="sm" className="w-full gap-2">
        <Link to={`/sehir/${citySlug}/nomad`}>
          <Laptop className="w-4 h-4" />
          Detaylı Nomad Rehberi
          <ChevronRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
};
