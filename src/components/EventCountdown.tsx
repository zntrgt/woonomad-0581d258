import { useState, useEffect } from 'react';
import { Calendar, Clock, Plane, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EventCountdownProps {
  eventName: string;
  eventDate: string; // Format: "27 Nisan" or "Ağustos 7-13"
  citySlug: string;
  cityName: string;
  compact?: boolean;
}

// Turkish month map for parsing
const turkishMonths: Record<string, number> = {
  'Ocak': 0, 'Şubat': 1, 'Mart': 2, 'Nisan': 3, 'Mayıs': 4, 'Haziran': 5,
  'Temmuz': 6, 'Ağustos': 7, 'Eylül': 8, 'Ekim': 9, 'Kasım': 10, 'Aralık': 11,
};

function parseTurkishDate(dateStr: string): Date | null {
  const currentYear = new Date().getFullYear();
  
  // Try "27 Nisan" format
  const singleDateMatch = dateStr.match(/^(\d{1,2})\s+(\w+)$/);
  if (singleDateMatch) {
    const day = parseInt(singleDateMatch[1]);
    const month = turkishMonths[singleDateMatch[2]];
    if (month !== undefined) {
      const date = new Date(currentYear, month, day);
      // If the date has passed, use next year
      if (date < new Date()) {
        date.setFullYear(currentYear + 1);
      }
      return date;
    }
  }
  
  // Try "Şubat 13-23" format
  const rangeMatch = dateStr.match(/^(\w+)\s+(\d{1,2})-(\d{1,2})$/);
  if (rangeMatch) {
    const month = turkishMonths[rangeMatch[1]];
    const startDay = parseInt(rangeMatch[2]);
    if (month !== undefined) {
      const date = new Date(currentYear, month, startDay);
      if (date < new Date()) {
        date.setFullYear(currentYear + 1);
      }
      return date;
    }
  }
  
  // Try "Eylül 20 - Ekim 5" format
  const monthRangeMatch = dateStr.match(/^(\w+)\s+(\d{1,2})\s*-\s*(\w+)?\s*(\d{1,2})$/);
  if (monthRangeMatch) {
    const startMonth = turkishMonths[monthRangeMatch[1]];
    const startDay = parseInt(monthRangeMatch[2]);
    if (startMonth !== undefined) {
      const date = new Date(currentYear, startMonth, startDay);
      if (date < new Date()) {
        date.setFullYear(currentYear + 1);
      }
      return date;
    }
  }
  
  return null;
}

function getCountdown(targetDate: Date): { days: number; hours: number; minutes: number } {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
}

export function EventCountdown({ eventName, eventDate, citySlug, cityName, compact = false }: EventCountdownProps) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  
  useEffect(() => {
    const parsed = parseTurkishDate(eventDate);
    setTargetDate(parsed);
    
    if (parsed) {
      setCountdown(getCountdown(parsed));
      
      const interval = setInterval(() => {
        setCountdown(getCountdown(parsed));
      }, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [eventDate]);
  
  if (!targetDate) return null;
  
  const isUpcoming = countdown.days <= 30 && countdown.days > 0;
  const isHappeningNow = countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0;
  
  if (compact) {
    return (
      <div className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
        isUpcoming ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      )}>
        <Clock className="h-3 w-3" />
        <span>{countdown.days} gün kaldı</span>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "rounded-xl border p-4 transition-all",
      isUpcoming ? "border-primary/30 bg-primary/5" : "border-border bg-card"
    )}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="font-semibold text-sm">{eventName}</h4>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Calendar className="h-3 w-3" />
            {eventDate}
          </p>
        </div>
        {isUpcoming && (
          <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full animate-pulse">
            Yaklaşıyor!
          </span>
        )}
      </div>
      
      {!isHappeningNow && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-background rounded-lg">
            <div className="text-lg font-bold text-primary">{countdown.days}</div>
            <div className="text-xs text-muted-foreground">Gün</div>
          </div>
          <div className="text-center p-2 bg-background rounded-lg">
            <div className="text-lg font-bold text-primary">{countdown.hours}</div>
            <div className="text-xs text-muted-foreground">Saat</div>
          </div>
          <div className="text-center p-2 bg-background rounded-lg">
            <div className="text-lg font-bold text-primary">{countdown.minutes}</div>
            <div className="text-xs text-muted-foreground">Dakika</div>
          </div>
        </div>
      )}
      
      <Button variant="outline" size="sm" className="w-full text-xs" asChild>
        <Link to={`/sehir/${citySlug}/ucuslar`}>
          <Plane className="h-3 w-3 mr-1" />
          {cityName} uçuş ara
        </Link>
      </Button>
    </div>
  );
}

export function EventCountdownList({ events, citySlug, cityName }: { 
  events: Array<{ name: string; date: string; description: string }>;
  citySlug: string;
  cityName: string;
}) {
  // Sort events by upcoming date
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = parseTurkishDate(a.date);
    const dateB = parseTurkishDate(b.date);
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateA.getTime() - dateB.getTime();
  });
  
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {sortedEvents.slice(0, 4).map((event, index) => (
        <EventCountdown
          key={index}
          eventName={event.name}
          eventDate={event.date}
          citySlug={citySlug}
          cityName={cityName}
        />
      ))}
    </div>
  );
}
