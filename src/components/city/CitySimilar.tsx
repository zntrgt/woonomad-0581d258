import { Link } from 'react-router-dom';
import { CityInfo } from '@/lib/cities';
import { getCountryFlag } from '@/lib/destinations';

interface CitySimilarProps {
  similarCities: CityInfo[];
}

export const CitySimilar = ({ similarCities }: CitySimilarProps) => {
  if (similarCities.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {similarCities.slice(0, 6).map((city) => (
        <Link
          key={city.slug}
          to={`/sehir/${city.slug}`}
          className="group relative overflow-hidden rounded-xl aspect-[4/3]"
        >
          <img
            src={city.image}
            alt={`${city.name} şehri`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCountryFlag(city.countryCode)}</span>
              <div className="min-w-0">
                <p className="font-semibold text-white text-sm group-hover:text-primary transition-colors truncate">
                  {city.name}
                </p>
                <p className="text-xs text-white/70 truncate">{city.country}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
