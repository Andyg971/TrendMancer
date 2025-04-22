import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Types pour notre contexte d'authentification de démo
type DemoUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url: string | null;
};

type DemoAuthContextType = {
  user: DemoUser | null;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Création du contexte
const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

// Hook pour utiliser le contexte
export function useDemoAuth() {
  const context = useContext(DemoAuthContext);
  if (context === undefined) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
}

// Fournisseur du contexte
export const DemoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si un utilisateur démo est stocké dans localStorage
    const storedUser = localStorage.getItem('trendmancer-demo-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsDemoMode(true);
    }
  }, []);

  // Fonction de connexion démo
  const login = async (email: string, password: string) => {
    if (email === 'demo@trendmancer.com' && password === 'demo123456') {
      const demoUser = {
        id: 'demo-user-id',
        email: 'demo@trendmancer.com',
        name: 'Utilisateur Démo',
        role: 'demo',
        avatar_url: null
      };
      
      localStorage.setItem('trendmancer-demo-user', JSON.stringify(demoUser));
      setUser(demoUser);
      setIsDemoMode(true);
    } else {
      throw new Error('Identifiants de démonstration invalides');
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('trendmancer-demo-user');
    setUser(null);
    setIsDemoMode(false);
    router.push('/login');
  };

  return (
    <DemoAuthContext.Provider value={{ user, isDemoMode, login, logout }}>
      {children}
    </DemoAuthContext.Provider>
  );
};

export default DemoAuthProvider;