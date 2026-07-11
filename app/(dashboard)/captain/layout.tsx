import { RoleGuard } from '@/components/shared/RoleGuard';

export default function CaptainLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['captain']}>
      {children}
    </RoleGuard>
  );
}
