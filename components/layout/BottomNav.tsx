'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useApp } from '@/lib/AppContext';
import { Home, Search, User, Grid, LogOut, PlusSquare, Film } from 'lucide-react';

import { navigationConfig } from '@/lib/navigation';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { setCreatePostOpen } = useApp();

  if (!user) return null;

  // Bottom navigation is only for Customer and Captain views
  if (user.role !== 'customer' && user.role !== 'captain') {
    return null; 
  }

  const items = navigationConfig[user.role] || [];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg-card border-t border-line lg:hidden flex justify-around items-center h-16 safe-bottom">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        if ('isModal' in item && item.isModal) {
          return (
            <button
              key={item.name}
              onClick={() => setCreatePostOpen(true)}
              className="flex flex-col items-center justify-center w-full h-full transition-all text-ink-soft hover:text-primary cursor-pointer"
            >
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-[10px] mt-1 font-medium">{item.name}</span>
            </button>
          );
        }

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full transition-all ${
              isActive ? 'text-primary' : 'text-ink-soft hover:text-ink'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
