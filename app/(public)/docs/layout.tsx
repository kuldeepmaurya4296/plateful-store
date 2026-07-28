import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plateful — Feature Documentation',
  description: 'Complete feature inventory for the Plateful restaurant management SaaS platform, organized by user role.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
