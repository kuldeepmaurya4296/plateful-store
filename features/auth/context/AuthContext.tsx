'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import usersData from '@/data/users.json';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'customer' | 'owner' | 'manager' | 'captain' | 'superadmin';
  avatar: string;
  username: string;
  restaurantId?: string;
  counterId?: string;
  assignedTables?: string[];
  preferences?: {
    dietFilter: 'veg' | 'non-veg' | 'both';
    city: string;
  };
}

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

    // Fallback: create dynamic user for testing if username is not in mock data
    const fallbackUser: User = {
      id: `u_dyn_${Date.now()}`,
      name: username.split('.')[0].replace(/^\w/, c => c.toUpperCase()) || 'Test User',
      username: username,
      role: role as any,
      avatar: username.substring(0, 2).toUpperCase() || 'TU',
      restaurantId: 'r1', // Default to Spice Route
      counterId: role === 'captain' ? 'c1' : undefined,
      assignedTables: role === 'captain' ? ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'] : undefined
    };

    setUser(fallbackUser);
    localStorage.setItem('plateful_user', JSON.stringify(fallbackUser));
    return true;
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
