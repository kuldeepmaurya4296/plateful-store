'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { UserRole } from '@/lib/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallbackPath?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  allowedRoles, 
  children, 
  fallbackPath 
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login');
      } else if (!allowedRoles.includes(user.role)) {
        if (fallbackPath) {
          router.replace(fallbackPath);
        } else {
          // Direct to default role base paths
          if (user.role === 'customer') router.replace('/customer');
          else if (user.role === 'owner' || user.role === 'manager') router.replace('/manager');
          else if (user.role === 'captain') router.replace('/captain');
          else if (user.role === 'superadmin') router.replace('/superadmin');
          else router.replace('/login');
        }
      }
    }
  }, [user, isLoading, allowedRoles, router, fallbackPath]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-medium text-ink-soft">Verifying Plateful credentials...</p>
        </div>
      </div>
    );
  }

  // Prevent FOUC: only render children if authenticated and role is allowed
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-medium text-ink-soft">Redirecting to authorized panel...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
