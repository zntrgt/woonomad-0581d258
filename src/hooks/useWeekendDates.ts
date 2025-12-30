import { useState, useCallback, useMemo } from 'react';
import { addDays, startOfWeek, format, isBefore, startOfToday } from 'date-fns';
import { tr } from 'date-fns/locale';
import { WeekendDate, TripDuration } from '@/lib/types';

export function useWeekendDates() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [tripDuration, setTripDuration] = useState<TripDuration>('2-2');

  const getDurationDays = useCallback((duration: TripDuration): number => {
    switch (duration) {
      case '1-1': return 0; // Same day
      case '2-2': return 1; // 2 days (Sat-Sun)
      case '3-3': return 2; // 3 days (Fri-Sun)
      default: return 1;
    }
  }, []);

  const getWeekendDates = useCallback((offset: number, duration: TripDuration): WeekendDate => {
    const today = startOfToday();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const targetWeekStart = addDays(currentWeekStart, offset * 7);
    
    let startDay: Date;
    let endDay: Date;
    let label = '';

    if (duration === '1-1') {
      // Same day trip on Saturday
      startDay = addDays(targetWeekStart, 5); // Saturday
      endDay = startDay;
    } else if (duration === '3-3') {
      // Friday to Sunday
      startDay = addDays(targetWeekStart, 4); // Friday
      endDay = addDays(targetWeekStart, 6); // Sunday
    } else {
      // Saturday to Sunday (default)
      startDay = addDays(targetWeekStart, 5); // Saturday
      endDay = addDays(targetWeekStart, 6); // Sunday
    }

    if (offset === 0) {
      label = 'Bu Hafta Sonu';
    } else if (offset === 1) {
      label = 'Gelecek Hafta Sonu';
    } else if (offset === -1) {
      label = 'Geçen Hafta Sonu';
    } else if (offset > 0) {
      label = `${offset} Hafta Sonra`;
    } else {
      label = `${Math.abs(offset)} Hafta Önce`;
    }

    return { saturday: startDay, sunday: endDay, label, weekOffset: offset };
  }, []);

  const currentWeekend = useMemo(() => getWeekendDates(weekOffset, tripDuration), [weekOffset, tripDuration, getWeekendDates]);

  const goToNextWeek = useCallback(() => {
    setWeekOffset(prev => Math.min(prev + 1, 12)); // Max 12 weeks ahead
  }, []);

  const goToPrevWeek = useCallback(() => {
    const prevWeekend = getWeekendDates(weekOffset - 1, tripDuration);
    const today = startOfToday();
    // Allow going back only if the weekend hasn't fully passed
    if (!isBefore(prevWeekend.sunday, today)) {
      setWeekOffset(prev => prev - 1);
    }
  }, [weekOffset, tripDuration, getWeekendDates]);

  const canGoPrev = useMemo(() => {
    const prevWeekend = getWeekendDates(weekOffset - 1, tripDuration);
    const today = startOfToday();
    return !isBefore(prevWeekend.sunday, today);
  }, [weekOffset, tripDuration, getWeekendDates]);

  const canGoNext = weekOffset < 12;

  const formatDate = useCallback((date: Date) => {
    return format(date, 'd MMMM', { locale: tr });
  }, []);

  const formatDateForApi = useCallback((date: Date) => {
    return format(date, 'yyyy-MM-dd');
  }, []);

  return {
    currentWeekend,
    tripDuration,
    setTripDuration,
    goToNextWeek,
    goToPrevWeek,
    canGoPrev,
    canGoNext,
    formatDate,
    formatDateForApi,
  };
}
