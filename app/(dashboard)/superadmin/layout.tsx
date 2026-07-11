import { RoleGuard } from '@/components/shared/RoleGuard';

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['superadmin']}>
      {children}
    </RoleGuard>
  );
}
