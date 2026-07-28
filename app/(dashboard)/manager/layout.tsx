import React from 'react';
import { ManagerLayoutClient } from '@/components/layout/ManagerLayoutClient';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <ManagerLayoutClient>{children}</ManagerLayoutClient>;
}
