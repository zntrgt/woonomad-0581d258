import { useState, useCallback, useMemo } from 'react';
import { addDays, startOfWeek, format, isBefore, startOfToday } from 'date-fns';
import { tr } from 'date-fns/locale';
import { WeekendDate } from '@/lib/types';

export function useWeekendDates() {
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekendDates = useCallback((offset: number): WeekendDate => {
    const today = startOfToday();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const targetWeekStart = addDays(currentWeekStart, offset * 7);
    
    const saturday = addDays(targetWeekStart, 5);
    const sunday = addDays(targetWeekStart, 6);

    let label = '';
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

    return { saturday, sunday, label, weekOffset: offset };
  }, []);

  const currentWeekend = useMemo(() => getWeekendDates(weekOffset), [weekOffset, getWeekendDates]);

  const goToNextWeek = useCallback(() => {
    setWeekOffset(prev => Math.min(prev + 1, 12)); // Max 12 weeks ahead
  }, []);

  const goToPrevWeek = useCallback(() => {
    const prevWeekend = getWeekendDates(weekOffset - 1);
    const today = startOfToday();
    // Allow going back only if the weekend hasn't fully passed
    if (!isBefore(prevWeekend.sunday, today)) {
      setWeekOffset(prev => prev - 1);
    }
  }, [weekOffset, getWeekendDates]);

  const canGoPrev = useMemo(() => {
    const prevWeekend = getWeekendDates(weekOffset - 1);
    const today = startOfToday();
    return !isBefore(prevWeekend.sunday, today);
  }, [weekOffset, getWeekendDates]);

  const canGoNext = weekOffset < 12;

  const formatDate = useCallback((date: Date) => {
    return format(date, 'd MMMM', { locale: tr });
  }, []);

  const formatDateForApi = useCallback((date: Date) => {
    return format(date, 'yyyy-MM-dd');
  }, []);

  return {
    currentWeekend,
    goToNextWeek,
    goToPrevWeek,
    canGoPrev,
    canGoNext,
    formatDate,
    formatDateForApi,
  };
}
