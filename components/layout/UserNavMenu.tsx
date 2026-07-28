'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, Bell, Shield, Store, ChevronDown } from 'lucide-react';

export const UserNavMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    setIsOpen(false);
    toast({
      type: 'success',
      title: 'Signed Out',
      description: 'You have been logged out of your session.'
    });
    logout();
  };

  // Resolve account route based on user role
  const getAccountRoute = () => {
    switch (user.role) {
      case 'superadmin':
        return '/superadmin/account';
      case 'owner':
      case 'manager':
        return '/manager/account';
      case 'captain':
        return '/captain/account';
      case 'customer':
      default:
        return '/customer/account';
    }
  };

  const getRoleBadgeStyle = () => {
    switch (user.role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'owner':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'captain':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'customer':
      default:
        return 'bg-primary-soft text-primary border-primary/20';
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 rounded-full hover:bg-bg-alt transition-all border border-line bg-bg cursor-pointer group"
        aria-label="User menu"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
            {user.avatar || user.name?.slice(0, 2).toUpperCase() || 'U'}
          </div>
          {/* Active Status Indicator */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-bg-card rounded-full" />
        </div>

        <div className="hidden md:flex flex-col text-left pr-1">
          <span className="text-xs font-semibold text-ink leading-tight group-hover:text-primary transition-colors">
            {user.name}
          </span>
          <span className="text-[10px] font-medium text-ink-soft capitalize">
            {user.role}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-ink-soft transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-bg-card border border-line rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {/* User Header Details */}
            <div className="p-3.5 border-b border-line bg-bg-alt/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-primary/20">
                  {user.avatar || user.name?.slice(0, 2).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{user.name}</p>
                  <p className="text-xs text-ink-soft truncate">@{user.username}</p>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${getRoleBadgeStyle()}`}>
                  {user.role}
                </span>
                <span className="text-[10px] text-ink-soft font-medium flex items-center gap-1">
                  <Store className="w-3 h-3" />
                  Spice Route
                </span>
              </div>
            </div>

            {/* Menu Links */}
            <div className="p-1.5 space-y-0.5 text-xs font-medium text-ink">
              <Link
                href={getAccountRoute()}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-bg-alt transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-ink-soft" />
                <span>My Profile & Account</span>
              </Link>

              {user.role === 'customer' && (
                <Link
                  href="/customer/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-bg-alt transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-ink-soft" />
                  <span>Dietary Preferences</span>
                </Link>
              )}

              {user.role === 'superadmin' && (
                <Link
                  href="/superadmin/config"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-bg-alt transition-colors cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-ink-soft" />
                  <span>SaaS System Config</span>
                </Link>
              )}

              <Link
                href="/customer/notifications"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-bg-alt transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4 text-ink-soft" />
                <span>Notifications & Alerts</span>
              </Link>
            </div>

            {/* Logout Action */}
            <div className="p-1.5 border-t border-line bg-bg/50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-danger hover:bg-danger-bg/40 transition-colors cursor-pointer font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Session</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
