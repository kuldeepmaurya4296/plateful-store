'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { RoleGuard } from '@/components/shared/RoleGuard';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role === 'manager') {
      const ownerOnlyRoutes = [
        '/manager/users', 
        '/manager/expenses', 
        '/manager/account',
        '/manager/staff'
      ];
      // Note: '/manager' home dashboard (analytical KPIs) is hidden from managers, redirect to tables
      if (pathname === '/manager' || ownerOnlyRoutes.some(route => pathname.startsWith(route))) {
        router.replace('/manager/tables');
      }
    }
  }, [user, pathname, router]);

  // Restrict child rendering for manager on owner-only routes
  const isOwnerOnlyRoute = () => {
    if (!user) return false;
    if (user.role !== 'manager') return false;
    const ownerOnlyRoutes = [
      '/manager/users', 
      '/manager/expenses', 
      '/manager/account',
      '/manager/staff'
    ];
    return pathname === '/manager' || ownerOnlyRoutes.some(route => pathname.startsWith(route));
  };

  return (
    <RoleGuard allowedRoles={['owner', 'manager']}>
      {isOwnerOnlyRoute() ? (
        <div className="flex h-screen w-screen items-center justify-center bg-bg">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-medium text-ink-soft">Redirecting to manager dashboard...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </RoleGuard>
  );
}
