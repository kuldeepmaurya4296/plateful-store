'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { signIn, signOut, useSession, SessionProvider } from 'next-auth/react';

interface AuthContextType {
  user: User | null;
  login: (username: string, role: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateSession: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProviderContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const isLoading = status === 'loading';

  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;
      setUser({
        id: u.id || 'u1',
        name: u.name || 'User',
        email: u.email,
        role: u.role || 'customer',
        avatar: u.image || u.name?.slice(0, 2).toUpperCase() || 'U',
        username: u.username || u.name?.toLowerCase().replace(/\s+/g, '') || 'user',
        restaurantId: u.restaurantId,
        counterId: u.counterId
      });
    } else {
      const savedUser = typeof window !== 'undefined' ? localStorage.getItem('plateful_user') : null;
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, [session]);

  const login = async (username: string, role: string, password?: string): Promise<boolean> => {
    try {
      const res = await signIn('credentials', {
        redirect: false,
        username: username.trim(),
        password: password || 'Kuldeep@123',
        role
      });

      if (res?.ok) {
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    }
  };

  const updateSession = async (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      await update(data);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('plateful_user');
    }
    signOut({ redirect: true, callbackUrl: '/login' });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateSession, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <AuthProviderContent>{children}</AuthProviderContent>
    </SessionProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
