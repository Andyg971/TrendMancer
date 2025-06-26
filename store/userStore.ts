import { create } from 'zustand';
import { logger } from '../utils/logger';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
}

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  setUser: (user) => {
    logger.info('Mise à jour du profil utilisateur', { userId: user?.id });
    set({ user, error: null });
  },
  
  setLoading: (isLoading) => {
    set({ isLoading });
  },
  
  setError: (error) => {
    if (error) {
      logger.error('Erreur utilisateur:', new Error(error));
    }
    set({ error });
  },
  
  logout: () => {
    logger.info('Déconnexion utilisateur');
    set({ user: null, error: null });
  },
})); 