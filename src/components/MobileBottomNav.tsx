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
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const href = getRoute(item.routeKey);
          const active = isActive(item.routeKey);
          return (
            <Link
              key={item.routeKey}
              to={href}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-200 touch-target tap-highlight",
                active
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground active:scale-95"
              )}
            >
              {/* Active indicator dot */}
              {active && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-scale-in" />
              )}
              <div className={cn(
                "p-2 rounded-xl transition-all duration-200",
                active 
                  ? "bg-primary/10 shadow-sm" 
                  : "group-active:bg-muted"
              )}>
                {item.icon}
              </div>
              <span className={cn(
                "text-[10px] font-semibold leading-none transition-colors",
                active && "text-primary"
              )}>
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}