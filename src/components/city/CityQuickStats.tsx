import { Clock, Banknote, Languages, Users, Plane, Calendar } from 'lucide-react';
import { CityInfo } from '@/lib/cities';

interface CityQuickStatsProps {
  city: CityInfo;
}

export const CityQuickStats = ({ city }: CityQuickStatsProps) => {
  const stats = [
    { icon: Calendar, label: 'En İyi Zaman', value: city.bestTimeToVisit },
    { icon: Clock, label: 'Saat Dilimi', value: city.timezone },
    { icon: Banknote, label: 'Para Birimi', value: city.currency },
    { icon: Languages, label: 'Dil', value: city.language },
    { icon: Users, label: 'Nüfus', value: city.population },
    { icon: Plane, label: 'Havalimanı', value: city.airportCodes.join(', ') },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <stat.icon className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
            <p className="text-sm font-medium truncate">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
