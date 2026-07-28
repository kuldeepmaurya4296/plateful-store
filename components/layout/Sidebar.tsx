'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useApp } from '@/lib/AppContext';
import { LogOut, Sparkles } from 'lucide-react';
import { navigationConfig } from '@/lib/navigation';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { setCreatePostOpen } = useApp();

  if (!user) {
    return null;
  }

  const isOwner = user.role === 'owner';
  const menuItems = navigationConfig[user.role] || [];

  return (
    <aside className="w-64 bg-bg-card border-r border-line h-screen sticky top-0 flex flex-col justify-between hidden lg:flex flex-shrink-0 z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-line">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary p-1.5 rounded-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-xl tracking-wide text-ink">Plateful</span>
        </div>
        <p className="text-[10px] font-mono text-ink-soft uppercase tracking-widest mt-1.5 capitalize">
          {user.role} Portal · v0.2
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          if (item.ownerOnly && !isOwner) return null;
          
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && item.href !== '#create');
          const Icon = item.icon;

          if ('isModal' in item && item.isModal) {
            return (
              <button
                key={item.name}
                onClick={() => setCreatePostOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group text-ink-soft hover:text-primary hover:bg-primary-soft/40 cursor-pointer"
              >
                <Icon className="w-4 h-4 text-primary" />
                <span className="font-semibold text-primary">{item.name}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-primary-soft text-primary font-semibold'
                  : 'text-ink-soft hover:text-ink hover:bg-bg-alt'
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${
                isActive ? 'text-primary' : 'text-ink-soft group-hover:text-ink'
              }`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Handover / Log Off */}
      <div className="p-4 border-t border-line bg-bg/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center border border-primary/10">
            {user.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-ink truncate leading-tight">{user.name}</p>
            <p className="text-[10px] font-medium text-ink-soft truncate capitalize">{user.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 border border-line rounded-md text-xs font-semibold text-ink-soft hover:text-danger hover:border-danger/30 hover:bg-danger-bg/25 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log off shift</span>
        </button>
      </div>
    </aside>
  );
};
