import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    // Start fade out
    setIsVisible(false);
    
    // After fade out, update location and fade in
    const timeout = setTimeout(() => {
      setDisplayLocation(location);
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timeout);
  }, [location]);

  // Initial mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={cn(
        "transition-all duration-200 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-2",
        className
      )}
    >
      {children}
    </div>
  );
}

// Simpler version that just animates on mount
export function PageEnter({ children, className }: PageTransitionProps) {
  return (
    <div className={cn("animate-fade-in", className)}>
      {children}
    </div>
  );
}