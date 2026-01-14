import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Json } from '@/integrations/supabase/types';

export interface Favorite {
  id: string;
  user_id: string;
  favorite_type: 'city' | 'flight' | 'hotel' | 'coworking' | 'search';
  item_slug: string;
  item_name: string;
  item_data: Record<string, unknown>;
  notes: string | null;
  created_at: string;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  search_type: 'flight' | 'hotel';
  search_params: Record<string, unknown>;
  search_name: string | null;
  last_result_count: number | null;
  last_min_price: number | null;
  created_at: string;
  last_searched_at: string | null;
}

export function useUserFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch favorites
  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites((data || []) as Favorite[]);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch saved searches
  const fetchSavedSearches = useCallback(async () => {
    if (!user) {
      setSavedSearches([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedSearches((data || []) as SavedSearch[]);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
    fetchSavedSearches();
  }, [fetchFavorites, fetchSavedSearches]);

  // Add to favorites
  const addFavorite = async (
    type: Favorite['favorite_type'],
    slug: string,
    name: string,
    data: Record<string, unknown> = {},
    notes?: string
  ) => {
    if (!user) {
      toast({
        title: 'Giriş yapın',
        description: 'Favorilere eklemek için giriş yapmanız gerekiyor.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { error } = await supabase.from('user_favorites').insert([{
        user_id: user.id,
        favorite_type: type,
        item_slug: slug,
        item_name: name,
        item_data: data as Json,
        notes: notes || null,
      }]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Zaten favorilerde',
            description: 'Bu öğe zaten favorilerinizde.',
          });
          return false;
        }
        throw error;
      }

      toast({
        title: 'Favorilere eklendi',
        description: `${name} favorilerinize eklendi.`,
      });

      await fetchFavorites();
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast({
        title: 'Hata',
        description: 'Favorilere eklenirken bir hata oluştu.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Remove from favorites
  const removeFavorite = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Favorilerden kaldırıldı',
        description: 'Öğe favorilerinizden kaldırıldı.',
      });

      setFavorites((prev) => prev.filter((f) => f.id !== id));
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: 'Hata',
        description: 'Favorilerden kaldırılırken bir hata oluştu.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Check if item is favorited
  const isFavorite = (type: Favorite['favorite_type'], slug: string) => {
    return favorites.some((f) => f.favorite_type === type && f.item_slug === slug);
  };

  // Get favorite by type and slug
  const getFavorite = (type: Favorite['favorite_type'], slug: string) => {
    return favorites.find((f) => f.favorite_type === type && f.item_slug === slug);
  };

  // Toggle favorite
  const toggleFavorite = async (
    type: Favorite['favorite_type'],
    slug: string,
    name: string,
    data: Record<string, unknown> = {}
  ) => {
    const existing = getFavorite(type, slug);
    if (existing) {
      return removeFavorite(existing.id);
    } else {
      return addFavorite(type, slug, name, data);
    }
  };

  // Save search
  const saveSearch = async (
    type: SavedSearch['search_type'],
    params: Record<string, unknown>,
    name?: string,
    resultCount?: number,
    minPrice?: number
  ) => {
    if (!user) {
      toast({
        title: 'Giriş yapın',
        description: 'Arama kaydetmek için giriş yapmanız gerekiyor.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { error } = await supabase.from('saved_searches').insert([{
        user_id: user.id,
        search_type: type,
        search_params: params as Json,
        search_name: name || null,
        last_result_count: resultCount || null,
        last_min_price: minPrice || null,
      }]);

      if (error) throw error;

      toast({
        title: 'Arama kaydedildi',
        description: 'Aramanız kaydedildi.',
      });

      await fetchSavedSearches();
      return true;
    } catch (error) {
      console.error('Error saving search:', error);
      toast({
        title: 'Hata',
        description: 'Arama kaydedilirken bir hata oluştu.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Delete saved search
  const deleteSavedSearch = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Arama silindi',
        description: 'Kayıtlı arama silindi.',
      });

      setSavedSearches((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting saved search:', error);
      toast({
        title: 'Hata',
        description: 'Arama silinirken bir hata oluştu.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Get favorites by type
  const getFavoritesByType = (type: Favorite['favorite_type']) => {
    return favorites.filter((f) => f.favorite_type === type);
  };

  return {
    favorites,
    savedSearches,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavorite,
    toggleFavorite,
    saveSearch,
    deleteSavedSearch,
    getFavoritesByType,
    refreshFavorites: fetchFavorites,
    refreshSavedSearches: fetchSavedSearches,
  };
}
