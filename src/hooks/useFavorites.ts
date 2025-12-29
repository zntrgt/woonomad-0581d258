import { useState, useCallback, useEffect } from 'react';
import { Flight } from '@/lib/types';

const FAVORITES_KEY = 'weekend-flights-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Flight[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const saveFavorites = useCallback((newFavorites: Flight[]) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  }, []);

  const addFavorite = useCallback((flight: Flight) => {
    setFavorites(prev => {
      const exists = prev.some(
        f => f.flight_number === flight.flight_number && f.departure_at === flight.departure_at
      );
      if (exists) return prev;
      const newFavorites = [...prev, flight];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const removeFavorite = useCallback((flight: Flight) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(
        f => !(f.flight_number === flight.flight_number && f.departure_at === flight.departure_at)
      );
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((flight: Flight) => {
    return favorites.some(
      f => f.flight_number === flight.flight_number && f.departure_at === flight.departure_at
    );
  }, [favorites]);

  const toggleFavorite = useCallback((flight: Flight) => {
    if (isFavorite(flight)) {
      removeFavorite(flight);
    } else {
      addFavorite(flight);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}
