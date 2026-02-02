import { useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
  disabled?: boolean;
}

const PULL_THRESHOLD = 80;
const RESISTANCE = 2.5;

export function PullToRefresh({ 
  children, 
  onRefresh, 
  className,
  disabled = false 
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const canPull = useCallback(() => {
    if (disabled || isRefreshing) return false;
    // Only allow pull when scrolled to top
    return window.scrollY <= 0;
  }, [disabled, isRefreshing]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!canPull()) return;
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  }, [canPull]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || !canPull()) return;
    
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;
    
    if (diff > 0) {
      // Apply resistance to make it feel more natural
      const distance = Math.min(diff / RESISTANCE, 120);
      setPullDistance(distance);
      
      // Prevent scroll when pulling
      if (distance > 10) {
        e.preventDefault();
      }
    }
  }, [isPulling, canPull]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;
    setIsPulling(false);
    
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(50); // Keep some distance during refresh
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, isRefreshing, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use passive: false to allow preventDefault on touchmove
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const shouldTrigger = pullDistance >= PULL_THRESHOLD;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Pull indicator */}
      <div 
        className={cn(
          "fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-center transition-all duration-200 md:hidden",
          pullDistance > 0 || isRefreshing ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ 
          top: Math.max(pullDistance - 40, 8),
        }}
      >
        <div className={cn(
          "w-10 h-10 rounded-full bg-card shadow-lg border border-border flex items-center justify-center transition-all duration-200",
          shouldTrigger && !isRefreshing && "bg-primary text-primary-foreground border-primary",
          isRefreshing && "bg-primary text-primary-foreground border-primary"
        )}>
          <RefreshCw 
            className={cn(
              "w-5 h-5 transition-transform duration-200",
              isRefreshing && "animate-spin"
            )}
            style={{ 
              transform: isRefreshing 
                ? undefined 
                : `rotate(${progress * 360}deg)`,
            }}
          />
        </div>
      </div>
      
      {/* Content with pull offset */}
      <div 
        style={{ 
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}