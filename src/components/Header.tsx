import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, User, Settings, Building2, Plane, Hotel, BookOpen, Smartphone, Laptop, Compass } from 'lucide-react';
import { Logo } from './Logo';
import { SiteSearch } from './SiteSearch';
import { SettingsDropdown } from './SettingsDropdown';
import { NotificationBell } from './NotificationBell';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useLocalizedRoutes } from '@/hooks/useLocalizedLink';

const primaryNav = [
  { labelKey: 'nav.cities', routeKey: 'cities' as const, icon: <Building2 className="h-4 w-4" /> },
  { labelKey: 'nav.flights', routeKey: 'flights' as const, icon: <Plane className="h-4 w-4" /> },
  { labelKey: 'nav.hotels', routeKey: 'hotels' as const, icon: <Hotel className="h-4 w-4" /> },
  { labelKey: 'nav.nomadHub', routeKey: 'nomadHub' as const, icon: <Laptop className="h-4 w-4" /> },
  { labelKey: 'nav.blog', routeKey: 'blog' as const, icon: <BookOpen className="h-4 w-4" /> },
];

const secondaryNav = [
  { labelKey: 'nav.esim', routeKey: 'esim' as const, icon: <Smartphone className="h-4 w-4" />, desc: 'Seyahat eSIM paketleri' },
  { label: 'Solo Seyahat', routeKey: 'soloTravel' as const, icon: <Compass className="h-4 w-4" />, desc: 'Yalnız gezgin rehberi' },
  { label: 'Aile Seyahati', routeKey: 'familyTravel' as const, icon: <Compass className="h-4 w-4" />, desc: 'Çocuklu aile rotaları' },
];

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { getRoute } = useLocalizedRoutes();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

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
          : "bg-white dark:bg-sand-950 border-sand-200/40 py-3"
      )}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to={getRoute('home')} className="flex items-center shrink-0 relative z-50 transition-transform hover:scale-[1.02] active:scale-[0.98]" aria-label="WooNomad Anasayfa">
          <Logo size="sm" showText={true} className="hidden sm:flex" />
          <Logo size="sm" showText={false} className="sm:hidden" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Ana navigasyon">
          {primaryNav.map((item) => {
            const active = isActive(item.routeKey);
            return (
              <Link key={item.routeKey} to={getRoute(item.routeKey)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150",
                  active ? "text-ocean-600 bg-ocean-50 dark:text-ocean-400 dark:bg-ocean-900/30" : "text-sand-600 hover:text-sand-900 hover:bg-sand-100 dark:text-sand-400 dark:hover:text-sand-200 dark:hover:bg-sand-800"
                )}>
                {item.icon}
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}

          {/* Daha Fazla dropdown */}
          <div className="relative" onMouseEnter={() => setIsMoreOpen(true)} onMouseLeave={() => setIsMoreOpen(false)}>
            <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-sand-600 hover:text-sand-900 hover:bg-sand-100 transition-all" aria-expanded={isMoreOpen}>
              {t('common.more', 'Daha Fazla')}
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isMoreOpen && "rotate-180")} />
            </button>
            {isMoreOpen && (
              <div className="absolute top-full right-0 pt-2 min-w-[240px] animate-fade-in">
                <div className="bg-white dark:bg-sand-900 rounded-xl shadow-lg border border-sand-200 dark:border-sand-700 p-1.5">
                  {secondaryNav.map((item) => (
                    <Link key={item.routeKey} to={getRoute(item.routeKey)} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-sand-50 dark:hover:bg-sand-800 transition-colors">
                      <span className="text-ocean-500 mt-0.5">{item.icon}</span>
                      <div>
                        <span className="text-sm font-medium text-sand-900 dark:text-sand-100 block">{'labelKey' in item ? t(item.labelKey) : item.label}</span>
                        <span className="text-xs text-sand-500">{item.desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          <SiteSearch />
          <NotificationBell />
          {user && (
            <Button variant="ghost" size="icon" asChild className="hidden lg:flex rounded-full text-sand-600 hover:text-sand-900 hover:bg-sand-100">
              <Link to={getRoute('account')} aria-label={t('nav.account')}><User className="h-5 w-5" /></Link>
            </Button>
          )}
          {isAdmin && (
            <Button variant="ghost" size="icon" asChild className="hidden lg:flex rounded-full text-coral-500 hover:text-coral-600 hover:bg-coral-50">
              <Link to={getRoute('blogAdmin')} aria-label="Admin"><Settings className="h-5 w-5" /></Link>
            </Button>
          )}
          <SettingsDropdown />
          <button className="lg:hidden p-2 rounded-full hover:bg-sand-100 transition-colors relative z-50 text-sand-700" onClick={() => setIsMobileOpen(!isMobileOpen)} aria-label={isMobileOpen ? 'Kapat' : 'Menü'} aria-expanded={isMobileOpen}>
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fade-in" onClick={() => setIsMobileOpen(false)} />
          <div className="lg:hidden fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white dark:bg-sand-950 z-50 shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="pt-20 pb-8 px-5 space-y-1">
              {primaryNav.map((item) => (
                <Link key={item.routeKey} to={getRoute(item.routeKey)}
                  className={cn("flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-colors",
                    isActive(item.routeKey) ? "text-ocean-600 bg-ocean-50" : "text-sand-700 hover:bg-sand-100"
                  )} onClick={() => setIsMobileOpen(false)}>
                  {item.icon}{t(item.labelKey)}
                </Link>
              ))}
              <div className="border-t border-sand-200 my-3" />
              {secondaryNav.map((item) => (
                <Link key={item.routeKey} to={getRoute(item.routeKey)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base text-sand-600 hover:bg-sand-100 transition-colors"
                  onClick={() => setIsMobileOpen(false)}>
                  {item.icon}{'labelKey' in item ? t(item.labelKey) : item.label}
                </Link>
              ))}
              {user && (<><div className="border-t border-sand-200 my-3" /><Link to={getRoute('account')} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base text-sand-700 hover:bg-sand-100" onClick={() => setIsMobileOpen(false)}><User className="h-4 w-4" />{t('nav.account')}</Link></>)}
              {isAdmin && (<Link to={getRoute('blogAdmin')} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base text-coral-600 hover:bg-coral-50" onClick={() => setIsMobileOpen(false)}><Settings className="h-4 w-4" />Admin Panel</Link>)}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
