import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Plane, Menu, Building2, BookOpen, Hotel, Settings, Laptop, User } from 'lucide-react';
import { Logo } from './Logo';
import { SettingsDropdown } from './SettingsDropdown';
import { SiteSearch } from './SiteSearch';
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

interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { labelKey: 'nav.home', href: '/', icon: <Home className="h-4 w-4" /> },
  { labelKey: 'nav.cities', href: '/sehirler', icon: <Building2 className="h-4 w-4" /> },
  { labelKey: 'nav.nomadHub', href: '/nomad-hub', icon: <Laptop className="h-4 w-4" /> },
  { labelKey: 'nav.flights', href: '/ucuslar', icon: <Plane className="h-4 w-4" /> },
  { labelKey: 'nav.hotels', href: '/oteller', icon: <Hotel className="h-4 w-4" /> },
  { labelKey: 'nav.blog', href: '/blog', icon: <BookOpen className="h-4 w-4" /> },
];

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  
  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Logo size="sm" showText={true} className="hidden sm:flex" />
          <Logo size="sm" showText={false} className="sm:hidden" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label={t('nav.home')}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.icon}
              {t(item.labelKey)}
            </Link>
          ))}
          {/* Admin Link */}
          {isAdmin && (
            <Link
              to="/admin/blog"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                isActive('/admin/blog')
                  ? "bg-primary/10 text-primary"
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
          
          {/* Account Link */}
          {user && (
            <Button variant="ghost" size="icon" asChild className="hidden md:flex">
              <Link to="/hesabim" aria-label={t('nav.account')}>
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
              {navItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link to={item.href} className="flex items-center gap-2">
                    {item.icon}
                    {t(item.labelKey)}
                  </Link>
                </DropdownMenuItem>
              ))}
              {user && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/hesabim" className="flex items-center gap-2">
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
                    <Link to="/admin/blog" className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
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
