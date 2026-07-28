'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useApp } from '@/lib/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { X, Sparkles, LogOut } from 'lucide-react';
import Link from 'next/link';
import { navigationConfig } from '@/lib/navigation';

export const DashboardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { setCreatePostOpen } = useApp();

  if (!user) return <>{children}</>;

  const isOwner = user.role === 'owner';
  const menuItems = navigationConfig[user.role] || [];

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar for Desktop Console (All Roles) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Header */}
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Dashboard Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>

        {/* Bottom Nav for Mobile */}
        <BottomNav />
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            />

            {/* Drawer Body */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-xs bg-bg-card border-r border-line h-full flex flex-col justify-between shadow-2xl z-10"
            >
              {/* Header */}
              <div className="p-5 border-b border-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary p-1.5 rounded-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="font-serif font-bold text-lg text-ink">Plateful</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)} className="!p-1.5 rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                  if (item.ownerOnly && !isOwner) return null;

                  if ('isModal' in item && item.isModal) {
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setCreatePostOpen(true);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-md text-sm font-semibold text-primary hover:bg-primary-soft/40 cursor-pointer"
                      >
                        {item.name}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-md text-sm font-medium text-ink-soft hover:text-ink hover:bg-bg-alt"
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-line bg-bg/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8.5 h-8.5 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center border border-primary/10">
                    {user.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-ink truncate leading-tight">{user.name}</p>
                    <p className="text-[10px] font-medium text-ink-soft truncate capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 border border-line rounded-md text-xs font-semibold text-ink-soft hover:text-danger hover:border-danger/30 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log off shift</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
