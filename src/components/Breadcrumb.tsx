import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-muted-foreground overflow-x-auto">
      <Link 
        to="/" 
        className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
        aria-label="Ana Sayfa"
      >
        <Home className="h-4 w-4" aria-hidden="true" />
      </Link>
      
      {items.map((item, index) => (
        <span key={index} className="flex items-center shrink-0">
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" aria-hidden="true" />
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
