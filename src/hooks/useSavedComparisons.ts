import { useState, useEffect, useCallback } from 'react';

export interface SavedComparison {
  id: string;
  name: string;
  cities: string[];
  createdAt: string;
}

const STORAGE_KEY = 'woonomad_saved_comparisons';
const MAX_COMPARISONS = 10;

export function useSavedComparisons() {
  const [comparisons, setComparisons] = useState<SavedComparison[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setComparisons(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading saved comparisons:', error);
    }
  }, []);

  // Save to localStorage
  const saveToStorage = useCallback((newComparisons: SavedComparison[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newComparisons));
      setComparisons(newComparisons);
    } catch (error) {
      console.error('Error saving comparisons:', error);
    }
  }, []);

  // Add new comparison
  const saveComparison = useCallback((cities: string[], name?: string) => {
    const newComparison: SavedComparison = {
      id: `comp_${Date.now()}`,
      name: name || `Karşılaştırma ${comparisons.length + 1}`,
      cities,
      createdAt: new Date().toISOString(),
    };

    const updated = [newComparison, ...comparisons].slice(0, MAX_COMPARISONS);
    saveToStorage(updated);
    return newComparison;
  }, [comparisons, saveToStorage]);

  // Delete comparison
  const deleteComparison = useCallback((id: string) => {
    const updated = comparisons.filter(c => c.id !== id);
    saveToStorage(updated);
  }, [comparisons, saveToStorage]);

  // Rename comparison
  const renameComparison = useCallback((id: string, newName: string) => {
    const updated = comparisons.map(c => 
      c.id === id ? { ...c, name: newName } : c
    );
    saveToStorage(updated);
  }, [comparisons, saveToStorage]);

  // Generate share link
  const generateShareLink = useCallback((cities: string[]): string => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://woonomad.co';
    const citiesParam = cities.join(',');
    return `${baseUrl}/nomad-hub?compare=${encodeURIComponent(citiesParam)}`;
  }, []);

  // Copy to clipboard
  const copyShareLink = useCallback(async (cities: string[]): Promise<boolean> => {
    try {
      const link = generateShareLink(cities);
      await navigator.clipboard.writeText(link);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }, [generateShareLink]);

  return {
    comparisons,
    saveComparison,
    deleteComparison,
    renameComparison,
    generateShareLink,
    copyShareLink,
  };
}
