import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Compass, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalizedRoutes } from '@/hooks/useLocalizedLink';
import { useAuth } from '@/hooks/useAuth';

// 3 items only — focused mobile navigation
const navItems = [
  { label: 'Keşfet', routeKey: 'cities' as const, icon: <Compass className="h-5 w-5" /> },
  { labelKey: 'nav.blog', routeKey: 'blog' as const, icon: <BookOpen className="h-5 w-5" /> },
  { labelKey: 'nav.account', routeKey: 'account' as const, icon: <User className="h-5 w-5" /> },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { t } = useTranslation();
  const { getRoute } = useLocalizedRoutes();
  const { user } = useAuth();
  
  const isActive = (routeKey: string) => {
    const href = getRoute(routeKey as any);
    if (routeKey === 'cities') {
      return location.pathname.includes('/sehir') || location.pathname.includes('/cities');
    }
    return location.pathname.includes(href.replace(/^\/[a-z]{2}/, ''));
  };

  return (
    <nav 
      className="mobile-nav-sticky md:hidden"
      aria-label="Mobil navigasyon"
    >
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          // Skip account if not logged in
          if (item.routeKey === 'account' && !user) return null;
          
          const href = getRoute(item.routeKey);
          const active = isActive(item.routeKey);
          const label = 'labelKey' in item && item.labelKey ? t(item.labelKey) : item.label;
          
          return (
            <Link
              key={item.routeKey}
              to={href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-200",
                active
                  ? "text-ocean-600"
                  : "text-sand-500 active:text-sand-700 active:scale-95"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200",
                active ? "bg-ocean-50" : ""
              )}>
                {item.icon}
              </div>
              <span className="text-2xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
