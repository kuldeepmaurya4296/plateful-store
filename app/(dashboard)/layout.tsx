'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { CreatePostModal } from '@/features/feed/components/CreatePostModal';
import { DetailedPostModal } from '@/features/feed/components/DetailedPostModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      // If not logged in, redirect to login page
      router.replace('/login');
    } else if (!isLoading && user) {
      // Redirect guards based on roles
      if (user.role === 'customer' && !pathname.startsWith('/customer')) {
        router.replace('/customer');
      } else if ((user.role === 'owner' || user.role === 'manager') && !pathname.startsWith('/manager')) {
        router.replace('/manager');
      } else if (user.role === 'captain' && !pathname.startsWith('/captain')) {
        router.replace('/captain');
      } else if (user.role === 'superadmin' && !pathname.startsWith('/superadmin')) {
        router.replace('/superadmin');
      }

      // Restrict Owner-only routes from Manager role
      if (user.role === 'manager') {
        const ownerOnlyRoutes = ['/manager/users', '/manager/expenses', '/manager/account'];
        // Note: '/manager' home dashboard is hidden from managers, redirect to tables instead
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
    return null; // Will redirect via useEffect
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

      {/* Global Modals for Social Features */}
      <AnimatePresence>
        <CreatePostModal />
        <DetailedPostModal />
      </AnimatePresence>
    </DashboardShell>
  );
}
