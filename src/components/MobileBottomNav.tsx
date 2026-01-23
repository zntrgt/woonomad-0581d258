import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Plane, Building2, Hotel, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalizedRoutes } from '@/hooks/useLocalizedLink';

interface NavItem {
  labelKey: string;
  routeKey: 'home' | 'cities' | 'flights' | 'hotels' | 'esim';
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { labelKey: 'nav.home', routeKey: 'home', icon: <Home className="h-5 w-5" /> },
  { labelKey: 'nav.cities', routeKey: 'cities', icon: <Building2 className="h-5 w-5" /> },
  { labelKey: 'nav.flights', routeKey: 'flights', icon: <Plane className="h-5 w-5" /> },
  { labelKey: 'nav.hotels', routeKey: 'hotels', icon: <Hotel className="h-5 w-5" /> },
  { labelKey: 'nav.esim', routeKey: 'esim', icon: <Smartphone className="h-5 w-5" /> },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { t } = useTranslation();
  const { getRoute } = useLocalizedRoutes();
  
  const isActive = (routeKey: string) => {
    const href = getRoute(routeKey as any);
    if (routeKey === 'home') return location.pathname === '/' || location.pathname.match(/^\/[a-z]{2}\/?$/);
    return location.pathname.includes(href.replace(/^\/[a-z]{2}/, ''));
  };

  return (
    <nav 
      className="mobile-nav-sticky md:hidden"
      aria-label={t('nav.home')}
    >
      <div className="flex items-center justify-around py-1.5 px-1">
        {navItems.map((item) => {
          const href = getRoute(item.routeKey);
          return (
            <Link
              key={item.routeKey}
              to={href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-2 rounded-xl transition-all touch-target",
                isActive(item.routeKey)
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all",
                isActive(item.routeKey) && "bg-primary/10"
              )}>
                {item.icon}
              </div>
              <span className="text-[9px] font-semibold leading-none">
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}