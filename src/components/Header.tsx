import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Plane, Menu, Building2, BookOpen, Hotel, Settings, Laptop, User, Smartphone } from 'lucide-react';
import { Logo } from './Logo';
import { SettingsDropdown } from './SettingsDropdown';
import { SiteSearch } from './SiteSearch';
import { NotificationBell } from './NotificationBell';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useLocalizedRoutes } from '@/hooks/useLocalizedLink';

interface NavItem {
  labelKey: string;
  routeKey: 'home' | 'cities' | 'nomadHub' | 'flights' | 'hotels' | 'blog' | 'esim';
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { labelKey: 'nav.home', routeKey: 'home', icon: <Home className="h-4 w-4" /> },
  { labelKey: 'nav.cities', routeKey: 'cities', icon: <Building2 className="h-4 w-4" /> },
  { labelKey: 'nav.nomadHub', routeKey: 'nomadHub', icon: <Laptop className="h-4 w-4" /> },
  { labelKey: 'nav.flights', routeKey: 'flights', icon: <Plane className="h-4 w-4" /> },
  { labelKey: 'nav.hotels', routeKey: 'hotels', icon: <Hotel className="h-4 w-4" /> },
  { labelKey: 'nav.esim', routeKey: 'esim', icon: <Smartphone className="h-4 w-4" /> },
  { labelKey: 'nav.blog', routeKey: 'blog', icon: <BookOpen className="h-4 w-4" /> },
];

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { getRoute } = useLocalizedRoutes();
  
  const isActive = (href: string) => {
    if (href === '/' || href.match(/^\/[a-z]{2}\/$/)) return location.pathname === '/' || location.pathname.match(/^\/[a-z]{2}\/?$/);
    return location.pathname.includes(href.replace(/^\/[a-z]{2}/, ''));
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <Link to={getRoute('home')} className="flex items-center transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <Logo size="sm" showText={true} className="hidden sm:flex" />
          <Logo size="sm" showText={false} className="sm:hidden" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-0.5" aria-label={t('nav.home')}>
          {navItems.map((item) => {
            const href = getRoute(item.routeKey);
            const active = isActive(href);
            return (
              <Link
                key={item.routeKey}
                to={href}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {item.icon}
                {t(item.labelKey)}
                {/* Active underline indicator */}
                {active && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary animate-scale-in" />
                )}
              </Link>
            );
          })}
          {/* Admin Link */}
          {isAdmin && (
            <Link
              to={getRoute('blogAdmin')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                isActive('/admin/blog')
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                  : "text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950"
              )}
            >
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Site Search */}
          <SiteSearch />
          
          {/* Notification Bell */}
          <NotificationBell />
          {/* Account Link */}
          {user && (
            <Button variant="ghost" size="icon" asChild className="hidden md:flex">
              <Link to={getRoute('account')} aria-label={t('nav.account')}>
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}
          
          {/* Mobile Navigation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {navItems.map((item) => {
                const href = getRoute(item.routeKey);
                return (
                  <DropdownMenuItem key={item.routeKey} asChild>
                    <Link to={href} className="flex items-center gap-2">
                      {item.icon}
                      {t(item.labelKey)}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
              {user && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getRoute('account')} className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('nav.account')}
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getRoute('blogAdmin')} className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                      <Settings className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <SettingsDropdown />
        </div>
      </div>
    </header>
  );
}
