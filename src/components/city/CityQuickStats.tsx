import { Clock, Banknote, Languages, Users, Plane, Calendar } from 'lucide-react';
import { CityInfo } from '@/lib/cities';

interface CityQuickStatsProps {
  city: CityInfo;
  layout?: 'grid' | 'list';
}

export const CityQuickStats = ({ city, layout = 'grid' }: CityQuickStatsProps) => {
  const stats = [
    { icon: Calendar, label: 'En İyi Zaman', value: city.bestTimeToVisit },
    { icon: Clock, label: 'Saat Dilimi', value: city.timezone },
    { icon: Banknote, label: 'Para Birimi', value: city.currency },
    { icon: Languages, label: 'Dil', value: city.language },
    { icon: Users, label: 'Nüfus', value: city.population },
    { icon: Plane, label: 'Havalimanı', value: city.airportCodes.join(', ') },
  ];

  if (layout === 'list') {
    return (
      <div className="space-y-3">
        {stats.map((stat) => (
          <div 
            key={stat.label}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="font-medium">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className="flex items-center gap-2 p-3 rounded-xl bg-muted/50"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <stat.icon className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-2xs text-muted-foreground truncate">{stat.label}</p>
            <p className="text-xs font-medium truncate">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
