import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  variant?: 'city' | 'hotel' | 'blog' | 'route';
  style?: React.CSSProperties;
}

export function SkeletonCard({ className, variant = 'city', style }: SkeletonCardProps) {
  if (variant === 'city' || variant === 'hotel') {
    return (
      <div 
        className={cn(
          "bg-card rounded-2xl border border-border/50 overflow-hidden shadow-card",
          className
        )}
        style={style}
      >
        {/* Image skeleton */}
        <div className="aspect-[4/3] bg-muted skeleton-shimmer" />
        
        {/* Content skeleton */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            {/* Flag/icon */}
            <div className="w-8 h-8 rounded-full bg-muted skeleton-shimmer" />
            <div className="space-y-1.5 flex-1">
              {/* Title */}
              <div className="h-5 w-24 bg-muted rounded skeleton-shimmer" />
              {/* Subtitle */}
              <div className="h-3 w-16 bg-muted rounded skeleton-shimmer" />
            </div>
          </div>
          
          {/* Badges or buttons */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-1">
              <div className="h-5 w-10 bg-muted rounded-full skeleton-shimmer" />
              <div className="h-5 w-10 bg-muted rounded-full skeleton-shimmer" />
            </div>
            <div className="w-4 h-4 bg-muted rounded skeleton-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'blog') {
    return (
      <div 
        className={cn(
          "bg-card rounded-2xl border border-border/50 overflow-hidden shadow-card",
          className
        )}
        style={style}
      >
        {/* Image skeleton */}
        <div className="aspect-video bg-muted skeleton-shimmer" />
        
        {/* Content skeleton */}
        <div className="p-5 space-y-3">
          {/* Category badge */}
          <div className="h-5 w-20 bg-muted rounded-full skeleton-shimmer" />
          {/* Title */}
          <div className="space-y-2">
            <div className="h-5 w-full bg-muted rounded skeleton-shimmer" />
            <div className="h-5 w-3/4 bg-muted rounded skeleton-shimmer" />
          </div>
          {/* Excerpt */}
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-muted rounded skeleton-shimmer" />
            <div className="h-3 w-5/6 bg-muted rounded skeleton-shimmer" />
          </div>
          {/* Meta */}
          <div className="flex items-center gap-2 pt-2">
            <div className="h-3 w-16 bg-muted rounded skeleton-shimmer" />
            <div className="h-3 w-3 bg-muted rounded-full skeleton-shimmer" />
            <div className="h-3 w-12 bg-muted rounded skeleton-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'route') {
    return (
      <div 
        className={cn(
          "bg-card rounded-2xl border border-border/50 overflow-hidden shadow-card p-4",
          className
        )}
        style={style}
      >
        <div className="flex items-center gap-4">
          {/* Route icons */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-muted skeleton-shimmer" />
            <div className="w-8 h-0.5 bg-muted skeleton-shimmer" />
            <div className="w-10 h-10 rounded-full bg-muted skeleton-shimmer" />
          </div>
          
          {/* Route info */}
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-32 bg-muted rounded skeleton-shimmer" />
            <div className="h-3 w-20 bg-muted rounded skeleton-shimmer" />
          </div>
          
          {/* Price */}
          <div className="text-right space-y-1">
            <div className="h-5 w-16 bg-muted rounded skeleton-shimmer ml-auto" />
            <div className="h-3 w-12 bg-muted rounded skeleton-shimmer ml-auto" />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

interface SkeletonGridProps {
  count?: number;
  variant?: 'city' | 'hotel' | 'blog' | 'route';
  className?: string;
}

export function SkeletonGrid({ count = 8, variant = 'city', className }: SkeletonGridProps) {
  const gridClass = variant === 'route' 
    ? 'grid gap-4' 
    : 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    
  return (
    <div className={cn(gridClass, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard 
          key={i} 
          variant={variant}
          className="animate-fade-in"
          style={{ animationDelay: `${i * 50}ms` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// Simple inline skeleton for text
export function SkeletonText({ 
  width = "w-full", 
  height = "h-4",
  className 
}: { 
  width?: string; 
  height?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      "bg-muted rounded skeleton-shimmer",
      width,
      height,
      className
    )} />
  );
}

// Skeleton for list items
export function SkeletonListItem({ className }: { className?: string }) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-xl",
      className
    )}>
      <div className="w-10 h-10 rounded-lg bg-muted skeleton-shimmer" />
      <div className="flex-1 space-y-1.5">
        <div className="h-4 w-32 bg-muted rounded skeleton-shimmer" />
        <div className="h-3 w-20 bg-muted rounded skeleton-shimmer" />
      </div>
    </div>
  );
}