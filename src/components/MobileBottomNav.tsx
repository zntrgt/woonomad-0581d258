import { Link, useLocation } from 'react-router-dom';
import { Home, Plane, Building2, MapPin, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Ana Sayfa', href: '/', icon: <Home className="h-5 w-5" /> },
  { label: 'Şehirler', href: '/sehirler', icon: <Building2 className="h-5 w-5" /> },
  { label: 'Uçuşlar', href: '/ucuslar', icon: <Plane className="h-5 w-5" /> },
  { label: 'Blog', href: '/blog', icon: <BookOpen className="h-5 w-5" /> },
  { label: 'Keşfet', href: '/destinasyonlar', icon: <MapPin className="h-5 w-5" /> },
];

export function MobileBottomNav() {
  const location = useLocation();
  
  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav 
      className="mobile-nav-sticky md:hidden pb-safe"
      aria-label="Mobil navigasyon"
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[4rem]",
              isActive(item.href)
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all",
              isActive(item.href) && "bg-primary/10"
            )}>
              {item.icon}
            </div>
            <span className="text-[10px] font-medium leading-none">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
