import { Link } from 'react-router-dom';
import { Plane, Hotel, Building2, Laptop } from 'lucide-react';

interface CityPopularSearchesProps {
  citySlug: string;
  cityName: string;
}

export const CityPopularSearches = ({ citySlug, cityName }: CityPopularSearchesProps) => {
  const searches = [
    { 
      icon: Plane, 
      label: `${cityName} uçak bileti`, 
      subtitle: 'En ucuz uçuşlar',
      href: `/sehir/${citySlug}/ucuslar` 
    },
    { 
      icon: Hotel, 
      label: `${cityName} otelleri`, 
      subtitle: 'Konaklama',
      href: `/sehir/${citySlug}/oteller` 
    },
    { 
      icon: Building2, 
      label: `${cityName} coworking`, 
      subtitle: 'Çalışma alanları',
      href: `/sehir/${citySlug}/coworking` 
    },
    { 
      icon: Laptop, 
      label: `${cityName} nomad`, 
      subtitle: 'Dijital göçebe',
      href: `/sehir/${citySlug}/nomad` 
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {searches.map((search) => (
        <Link
          key={search.href}
          to={search.href}
          className="p-3 rounded-xl bg-muted/50 hover:bg-primary/10 transition-colors group"
        >
          <search.icon className="w-5 h-5 text-primary mb-2" />
          <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
            {search.label}
          </p>
          <p className="text-xs text-muted-foreground">{search.subtitle}</p>
        </Link>
      ))}
    </div>
  );
};
