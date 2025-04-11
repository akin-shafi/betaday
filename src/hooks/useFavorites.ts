import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useModal } from '@/contexts/modal-context';

interface UseFavoritesProps {
  onSaveToFavorite?: (businessId: string) => Promise<void>;
}

export const useFavorites = ({ onSaveToFavorite }: UseFavoritesProps = {}) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { isAuthenticated } = useAuth();
  const { openModal } = useModal();

  const handleHeartClick = async (e: React.MouseEvent, businessId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      openModal('login');
      return;
    }

    try {
      if (onSaveToFavorite) {
        await onSaveToFavorite(businessId);
      }

      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(businessId)) {
          newFavorites.delete(businessId);
        } else {
          newFavorites.add(businessId);
        }
        return newFavorites;
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // You might want to show a toast notification here
    }
  };

  return {
    favorites,
    handleHeartClick,
  };
}; 