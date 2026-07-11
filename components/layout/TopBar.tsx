'use client';

import React from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { usePathname } from 'next/navigation';
import { Bell, Menu, Sparkles, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface TopBarProps {
  onMenuClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { user, login, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  // Resolve section name from route
  const getSectionName = () => {
    if (pathname.includes('/manager/tables')) return 'Table Management';
    if (pathname.includes('/manager/orders')) return 'Online Orders';
    if (pathname.includes('/manager/billing')) return 'Billing History';
    if (pathname.includes('/manager/users')) return 'User & Captain Management';
    if (pathname.includes('/manager/expenses')) return 'Expenses & Forecast';
    if (pathname.includes('/manager/menu')) return 'Menu Management';
    if (pathname.includes('/manager/social')) return 'Manage Social Page';
    if (pathname.includes('/manager/account')) return 'Owner Account';
    if (pathname.includes('/captain/order')) return 'Take Table Order';
    if (pathname.includes('/captain/settlement')) return 'Close Out Table';
    if (pathname.includes('/captain/account')) return 'Captain Account';
    if (pathname.includes('/captain')) return 'Captain Table Grid';
    if (pathname.includes('/customer/account')) return 'My Account';
    if (pathname.includes('/customer/orders')) return 'My Orders';
    if (pathname.includes('/customer/bookings')) return 'Dine-in Bookings';
    if (pathname.includes('/customer')) return 'Spice Route Discovery';
    return 'Spice Route';
  };

  const handleRoleToggle = () => {
    if (user.role === 'owner') {
      login('priya.manager', 'manager');
    } else if (user.role === 'manager') {
      login('vikram.owner', 'owner');
    }
  };

  const showRoleToggle = user.role === 'owner' || user.role === 'manager';

  return (
    <header className="bg-bg-card border-b border-line h-16 sticky top-0 z-30 px-6 flex items-center justify-between w-full">
      {/* Title & Mobile menu button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-md border border-line bg-bg hover:bg-bg-alt text-ink cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-base font-serif font-semibold text-ink leading-none sm:text-lg">
          {getSectionName()}
        </h2>
      </div>

      {/* Action panel (Role toggle + Notification + Profile) */}
      <div className="flex items-center gap-4">
        {/* Dynamic Owner/Manager Switcher for demonstration */}
        {showRoleToggle && (
          <div className="flex bg-bg-alt p-0.5 rounded-md border border-line hidden sm:flex">
            <button
              onClick={() => user.role === 'manager' && handleRoleToggle()}
              className={`px-2.5 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                user.role === 'owner'
                  ? 'bg-bg-card shadow-sm text-primary'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              Owner View
            </button>
            <button
              onClick={() => user.role === 'owner' && handleRoleToggle()}
              className={`px-2.5 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                user.role === 'manager'
                  ? 'bg-bg-card shadow-sm text-primary'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              Manager View
            </button>
          </div>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="!p-2 rounded-full border border-line relative bg-bg hover:bg-bg-alt">
          <Bell className="w-4.5 h-4.5 text-ink-soft" />
          {/* Simulated indicator badge */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </Button>

        {/* Mobile View Logout shortcut */}
        <button
          onClick={logout}
          className="lg:hidden p-2 text-ink-soft hover:text-danger rounded-full border border-line bg-bg hover:bg-danger-bg/25 hover:border-danger/30 transition-all cursor-pointer"
          title="Log off"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>

        {/* User Details */}
        <div className="flex items-center gap-2 border-l border-line pl-4">
          <div className="w-8 h-8 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center border border-primary/10">
            {user.avatar}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-ink leading-tight">{user.name}</p>
            <p className="text-[10px] font-medium text-ink-soft capitalize">{user.role} view</p>
          </div>
        </div>
      </div>
    </header>
  );
};
