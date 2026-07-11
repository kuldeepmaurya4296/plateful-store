'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Home, Search, User, Grid, LogOut } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  // Bottom navigation is only for Customer and Captain views
  if (user.role !== 'customer' && user.role !== 'captain') {
    return null; 
  }

  const isCustomer = user.role === 'customer';

  const customerItems = [
    { name: 'Feed', href: '/customer', icon: Home },
    { name: 'Search', href: '/customer/wishlist', icon: Search }, // Or Search page
    { name: 'Account', href: '/customer/account', icon: User }
  ];

  const captainItems = [
    { name: 'Tables', href: '/captain', icon: Grid },
    { name: 'Account', href: '/captain/account', icon: User }
  ];

  const items = isCustomer ? customerItems : captainItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg-card border-t border-line lg:hidden flex justify-around items-center h-16 safe-bottom">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

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
