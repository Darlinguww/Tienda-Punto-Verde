import React, { createContext, useContext, useState, ReactNode } from 'react';
import { trackEvent } from '../lib/analytics';

export interface UserProfile {
  name: string;
  email: string;
  address: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string, address: string) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (isOpen: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const login = (email: string, password: string) => {
    // Simulación de login de administrador
    if (email === 'admin@puntoverde.com' && password === 'admin123') {
      setUser({
        name: 'Administrador',
        email,
        address: 'Punto Verde HQ',
        isAdmin: true
      });
      setIsLoginModalOpen(false);
      return;
    }

    // Simulación de login de cliente
    if (email && password) {
      setUser({
        name: email.split('@')[0], // Nombre temporal
        email,
        address: "Por definir",
        isAdmin: false
      });
      setIsLoginModalOpen(false);
    }
  };

  const register = (name: string, email: string, password: string, address: string) => {
    // Simulación de registro
    if (name && email && password && address) {
      setUser({
        name,
        email,
        address,
        isAdmin: false
      });
      trackEvent('registration');
      setIsLoginModalOpen(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoginModalOpen, setIsLoginModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
