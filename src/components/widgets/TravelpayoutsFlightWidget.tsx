import { useEffect, useRef } from 'react';

interface TravelpayoutsFlightWidgetProps {
  origin?: string; // IATA code (e.g., 'IST') - preserved for API compatibility
  destination?: string; // IATA code (e.g., 'BCN') - preserved for API compatibility
  subId?: string; // Tracking sub ID - preserved for API compatibility
  className?: string;
}

export function TravelpayoutsFlightWidget({
  className,
}: TravelpayoutsFlightWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = '';

    // Create script element with real Travelpayouts widget code
    const script = document.createElement('script');
    script.src = 'https://tpemd.com/content?currency=try&trs=485218&shmarker=261144&show_hotels=true&powered_by=true&locale=tr&searchUrl=woonomad.co%2Fflights&primary_override=%2332a8dd&color_button=%2332a8dd&color_icons=%2332a8dd&dark=%23262626&light=%23FFFFFF&secondary=%23FFFFFF&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&plain=false&promo_id=7879&campaign_id=100';
    script.async = true;
    script.charset = 'utf-8';

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`w-full min-h-[200px] ${className || ''}`}
    />
  );
}
