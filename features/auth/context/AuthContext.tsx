'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import usersData from '@/data/users.json';

interface AuthContextType {
  user: User | null;
  login: (username: string, role: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('plateful_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, role: string): boolean => {
    // Find matching mock user
    const matchedUser = (usersData as User[]).find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.role === role
    );

    if (matchedUser) {
      setUser(matchedUser);
      localStorage.setItem('plateful_user', JSON.stringify(matchedUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('plateful_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
