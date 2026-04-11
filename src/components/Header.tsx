import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, User, Settings, Building2, Plane, Hotel, BookOpen, Smartphone, Laptop, Compass, Search } from 'lucide-react';
import { Logo } from './Logo';
import { SiteSearch } from './SiteSearch';
import { SettingsDropdown } from './SettingsDropdown';
import { NotificationBell } from './NotificationBell';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useLocalizedRoutes } from '@/hooks/useLocalizedLink';

// Only 3 primary nav items — focused, not cluttered
const primaryNav = [
  { labelKey: 'nav.cities', routeKey: 'cities' as const, label: 'Destinasyonlar' },
  { labelKey: 'nav.nomadHub', routeKey: 'nomadHub' as const, label: 'Nomad Rehber' },
  { labelKey: 'nav.blog', routeKey: 'blog' as const, label: 'Blog' },
];

// Everything else lives in mobile drawer only
const drawerNav = [
  { labelKey: 'nav.cities', routeKey: 'cities' as const, icon: <Building2 className="h-4 w-4" />, label: 'Destinasyonlar' },
  { labelKey: 'nav.nomadHub', routeKey: 'nomadHub' as const, icon: <Laptop className="h-4 w-4" />, label: 'Nomad Rehber' },
  { labelKey: 'nav.blog', routeKey: 'blog' as const, icon: <BookOpen className="h-4 w-4" />, label: 'Blog' },
  { labelKey: 'nav.flights', routeKey: 'flights' as const, icon: <Plane className="h-4 w-4" />, label: 'Uçuşlar' },
  { labelKey: 'nav.hotels', routeKey: 'hotels' as const, icon: <Hotel className="h-4 w-4" />, label: 'Oteller' },
  { labelKey: 'nav.esim', routeKey: 'esim' as const, icon: <Smartphone className="h-4 w-4" />, label: 'eSIM' },
  { label: 'Solo Seyahat', routeKey: 'soloTravel' as const, icon: <Compass className="h-4 w-4" /> },
  { label: 'Aile Seyahati', routeKey: 'familyTravel' as const, icon: <Compass className="h-4 w-4" /> },
];

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { getRoute } = useLocalizedRoutes();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  useEffect(() => { setIsMobileOpen(false); }, [location.pathname]);

  const isActive = (routeKey: string) => {
    const href = getRoute(routeKey as any);
    if (routeKey === 'home') return location.pathname === '/' || !!location.pathname.match(/^\/[a-z]{2}\/?$/);
    return location.pathname.includes(href.replace(/^\/[a-z]{2}/, ''));
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-200 border-b",
        isScrolled
          ? "bg-white/95 dark:bg-sand-950/95 backdrop-blur-lg shadow-card border-sand-200/60 py-2"
          : "bg-white dark:bg-sand-950 border-sand-200/40 py-3.5"
      )}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to={getRoute('home')} className="shrink-0 relative z-50 transition-transform hover:scale-[1.02] active:scale-[0.98]" aria-label="WooNomad Anasayfa">
          <Logo size="sm" showText={true} className="hidden sm:flex" />
          <Logo size="sm" showText={false} className="sm:hidden" />
        </Link>

        {/* Desktop Nav — only 3 items */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Ana navigasyon">
          {primaryNav.map((item) => {
            const active = isActive(item.routeKey);
            return (
              <Link key={item.routeKey} to={getRoute(item.routeKey)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-150",
                  active
                    ? "text-ocean-600 bg-ocean-50"
                    : "text-sand-600 hover:text-sand-900 hover:bg-sand-100"
                )}>
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Right — search + settings + CTA */}
        <div className="flex items-center gap-2">
          <SiteSearch />
          <NotificationBell />
          <SettingsDropdown />

          {user && (
            <Button variant="ghost" size="icon" asChild className="hidden lg:flex rounded-full text-sand-600 hover:text-sand-900 hover:bg-sand-100">
              <Link to={getRoute('account')} aria-label={t('nav.account')}><User className="h-5 w-5" /></Link>
            </Button>
          )}

          {isAdmin && (
            <Button variant="ghost" size="icon" asChild className="hidden lg:flex rounded-full text-coral-500 hover:bg-coral-50">
              <Link to={getRoute('blogAdmin')} aria-label="Admin"><Settings className="h-4 w-4" /></Link>
            </Button>
          )}

          {/* Desktop CTA */}
          <Link to={getRoute('cities')} className="hidden lg:inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-ocean-500 text-white text-sm font-semibold hover:bg-ocean-600 active:scale-[0.98] transition-all shadow-sm hover:shadow-md">
            Keşfet
          </Link>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2 rounded-full hover:bg-sand-100 relative z-50 text-sand-700" onClick={() => setIsMobileOpen(!isMobileOpen)} aria-label={isMobileOpen ? 'Kapat' : 'Menü'} aria-expanded={isMobileOpen}>
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fade-in" onClick={() => setIsMobileOpen(false)} />
          <div className="lg:hidden fixed inset-y-0 right-0 w-[80%] max-w-xs bg-white dark:bg-sand-950 z-50 shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="pt-20 pb-8 px-5">
              {/* Primary section */}
              <p className="text-xs font-semibold text-sand-400 uppercase tracking-wider px-4 mb-2">Keşfet</p>
              {drawerNav.slice(0, 3).map((item) => (
                <Link key={item.routeKey} to={getRoute(item.routeKey)}
                  className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                    isActive(item.routeKey) ? "text-ocean-600 bg-ocean-50" : "text-sand-700 hover:bg-sand-100"
                  )} onClick={() => setIsMobileOpen(false)}>
                  {item.icon}{'labelKey' in item ? t(item.labelKey) : item.label}
                </Link>
              ))}

              {/* Secondary section */}
              <p className="text-xs font-semibold text-sand-400 uppercase tracking-wider px-4 mb-2 mt-6">Araçlar</p>
              {drawerNav.slice(3).map((item) => (
                <Link key={item.routeKey} to={getRoute(item.routeKey)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base text-sand-600 hover:bg-sand-100 transition-colors"
                  onClick={() => setIsMobileOpen(false)}>
                  {item.icon}{'labelKey' in item ? t(item.labelKey) : item.label}
                </Link>
              ))}

              {/* User section */}
              {(user || isAdmin) && (
                <>
                  <div className="border-t border-sand-200 my-4" />
                  {user && <Link to={getRoute('account')} className="flex items-center gap-3 px-4 py-3 rounded-xl text-base text-sand-700 hover:bg-sand-100" onClick={() => setIsMobileOpen(false)}><User className="h-4 w-4" />{t('nav.account')}</Link>}
                  {isAdmin && <Link to={getRoute('blogAdmin')} className="flex items-center gap-3 px-4 py-3 rounded-xl text-base text-coral-600 hover:bg-coral-50" onClick={() => setIsMobileOpen(false)}><Settings className="h-4 w-4" />Admin</Link>}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
