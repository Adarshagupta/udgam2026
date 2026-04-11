import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { AdminDashboardShell } from '@/components/admin/dashboard-shell';
import { getAuthSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

export default async function AdminDashboardLayout({
  children,
}: AdminDashboardLayoutProps) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/admin');
  }

  return (
    <AdminDashboardShell userName={session.user.name ?? 'Organizer'}>
      {children}
    </AdminDashboardShell>
  );
}
