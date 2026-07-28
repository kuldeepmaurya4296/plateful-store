'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { CreatePostModal } from '@/features/feed/components/CreatePostModal';
import { DetailedPostModal } from '@/features/feed/components/DetailedPostModal';

export const DashboardLayoutClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    } else if (!isLoading && user) {
      if (user.role === 'customer' && !pathname.startsWith('/customer')) {
        router.replace('/customer');
      } else if ((user.role === 'owner' || user.role === 'manager') && !pathname.startsWith('/manager')) {
        router.replace('/manager');
      } else if (user.role === 'captain' && !pathname.startsWith('/captain')) {
        router.replace('/captain');
      } else if (user.role === 'superadmin' && !pathname.startsWith('/superadmin')) {
        router.replace('/superadmin');
      }

      if (user.role === 'manager') {
        const ownerOnlyRoutes = ['/manager/users', '/manager/expenses', '/manager/account'];
        if (pathname === '/manager' || ownerOnlyRoutes.some(route => pathname.startsWith(route))) {
          router.replace('/manager/tables');
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-medium text-ink-soft">Loading Plateful Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        <CreatePostModal key="create-post-modal" />
        <DetailedPostModal key="detailed-post-modal" />
      </AnimatePresence>
    </DashboardShell>
  );
};
