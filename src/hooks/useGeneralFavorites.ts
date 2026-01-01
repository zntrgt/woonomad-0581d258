import { useState, useCallback, useEffect } from 'react';

const GENERAL_FAVORITES_KEY = 'woonomad-favorites';

export interface FavoriteItem {
  id: string;
  type: 'city' | 'hotel' | 'itinerary' | 'flight';
  title: string;
  subtitle?: string;
  image?: string;
  link?: string;
  data?: Record<string, unknown>;
  createdAt: string;
}

export function useGeneralFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(GENERAL_FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const saveFavorites = useCallback((newFavorites: FavoriteItem[]) => {
    localStorage.setItem(GENERAL_FAVORITES_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  }, []);

  const addFavorite = useCallback((item: FavoriteItem) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === item.id);
      if (exists) return prev;
      const newFavorites = [...prev, item];
      localStorage.setItem(GENERAL_FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(f => f.id !== id);
      localStorage.setItem(GENERAL_FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((idPrefix: string) => {
    return favorites.some(f => f.id.startsWith(idPrefix));
  }, [favorites]);

  const getFavoritesByType = useCallback((type: FavoriteItem['type']) => {
    return favorites.filter(f => f.type === type);
  }, [favorites]);

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    const exists = favorites.some(f => f.id === item.id);
    if (exists) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  }, [favorites, addFavorite, removeFavorite]);

  return { 
    favorites, 
    addFavorite, 
    removeFavorite, 
    isFavorite, 
    toggleFavorite,
    getFavoritesByType,
    saveFavorites
  };
}
