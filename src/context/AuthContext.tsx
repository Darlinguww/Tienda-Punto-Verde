import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { trackEvent } from '../lib/analytics';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  country: string;
  department: string;
  city: string;
  address: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (data: RegisterData) => Promise<string | null>;
  logout: () => Promise<void>;
  updateLocation: (fields: { department: string; city: string; address: string }) => Promise<string | null>;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (isOpen: boolean) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  whatsapp: string;
  country: string;
  department: string;
  city: string;
  address: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': 'Correo o contraseña incorrectos.',
  'User already registered': 'Este correo ya está registrado.',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
  'Email not confirmed': 'Confirma tu correo antes de iniciar sesión.',
  'email rate limit exceeded': 'Demasiados intentos. Espera unos minutos e intenta de nuevo.',
  'For security purposes, you can only request this after': 'Demasiados intentos. Espera unos minutos e intenta de nuevo.',
};

function translateError(msg: string): string {
  const exact = ERROR_MAP[msg];
  if (exact) return exact;
  const partial = Object.entries(ERROR_MAP).find(([key]) => msg.toLowerCase().includes(key.toLowerCase()));
  return partial ? partial[1] : msg;
}

function createFallbackProfile(authUser: { id: string; email?: string }): UserProfile {
  return {
    id: authUser.id,
    name: authUser.email?.split('@')[0] ?? 'Usuario',
    email: authUser.email ?? '',
    whatsapp: '',
    country: '',
    department: '',
    city: '',
    address: '',
    isAdmin: false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const profileFetchedRef = { current: false };

    const fetchCustomerProfile = async (userId: string) => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('customers')
          .select('id, name, email, whatsapp, country, department, city, address')
          .eq('id', userId)
          .single();

        if (!isMounted) return;

        if (profileData && !profileError) {
          setUser(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              name: profileData.name ?? prev.name,
              email: profileData.email ?? prev.email,
              whatsapp: profileData.whatsapp ?? '',
              country: (profileData as Record<string, unknown>).country as string ?? '',
              department: (profileData as Record<string, unknown>).department as string ?? '',
              city: (profileData as Record<string, unknown>).city as string ?? '',
              address: profileData.address ?? '',
            };
          });
        }
      } catch {
        // ignore profile fetch errors
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        const isAdmin = session.user.user_metadata?.is_admin === true;
        const basicProfile: UserProfile = isAdmin
          ? { id: session.user.id, name: 'Administrador', email: session.user.email ?? '', whatsapp: '', country: '', department: '', city: '', address: '', isAdmin: true as const }
          : createFallbackProfile(session.user);

        setUser(basicProfile);
        setLoading(false);

        if (!isAdmin && !profileFetchedRef.current) {
          profileFetchedRef.current = true;
          fetchCustomerProfile(session.user.id);
        } else if (!isAdmin && profileFetchedRef.current && !user?.city) {
          fetchCustomerProfile(session.user.id);
        }
      } else {
        profileFetchedRef.current = false;
        if (isMounted) setUser(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return translateError(error.message);
    setIsLoginModalOpen(false);
    return null;
  };

  const register = async (d: RegisterData): Promise<string | null> => {
    const { data, error } = await supabase.auth.signUp({ email: d.email, password: d.password });
    if (error) return translateError(error.message);
    if (!data.user) return 'No se pudo crear la cuenta.';

    const { error: profileError } = await supabase.from('customers').insert({
      id: data.user.id,
      name: d.name,
      email: d.email,
      whatsapp: d.whatsapp,
      country: d.country,
      department: d.department,
      city: d.city,
      address: d.address,
    });
    if (profileError) return profileError.message;

    trackEvent('registration');
    return null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateLocation = async (fields: { department: string; city: string; address: string }): Promise<string | null> => {
    if (!user) return 'No hay sesión activa.';
    const { error } = await supabase.from('customers').update(fields).eq('id', user.id);
    if (error) return error.message;
    setUser({ ...user, ...fields });
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateLocation, isLoginModalOpen, setIsLoginModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
}
