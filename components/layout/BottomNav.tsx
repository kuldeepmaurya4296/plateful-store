'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useApp } from '@/lib/AppContext';
import { navigationConfig } from '@/lib/navigation';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { setCreatePostOpen } = useApp();

  if (!user) return null;

  const items = navigationConfig[user.role] || [];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg-card/95 backdrop-blur-md border-t border-line lg:hidden flex justify-around items-center h-16 px-2 safe-bottom shadow-lg">
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && item.href !== '#create');
        const Icon = item.icon;

        if ('isModal' in item && item.isModal) {
          return (
            <button
              key={item.name}
              onClick={() => setCreatePostOpen(true)}
              className="flex flex-col items-center justify-center flex-1 h-full transition-all text-ink-soft hover:text-primary cursor-pointer group"
            >
              <div className="p-1.5 rounded-full bg-primary/10 group-hover:bg-primary/20 text-primary transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 font-bold text-primary">{item.name}</span>
            </button>
          );
        }

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
              isActive ? 'text-primary font-bold' : 'text-ink-soft hover:text-ink font-medium'
            }`}
          >
            <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-primary-soft/50' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 truncate max-w-[64px] text-center">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
