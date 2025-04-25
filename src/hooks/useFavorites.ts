
import { useState, useCallback, useEffect } from 'react';

export interface FavoriteSong {
  id: string;
  title: string;
  artist: string;
  albumArt?: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteSong[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((song: FavoriteSong) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === song.id)) return prev;
      return [...prev, song];
    });
  }, []);

  const removeFavorite = useCallback((songId: string) => {
    setFavorites(prev => prev.filter(f => f.id !== songId));
  }, []);

  const isFavorite = useCallback((songId: string) => {
    return favorites.some(f => f.id === songId);
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
}
