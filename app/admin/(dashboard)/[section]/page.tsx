import { notFound } from 'next/navigation';

import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { isAdminView } from '@/components/admin/config';
import { getDashboardSnapshot } from '@/lib/data';

export const dynamic = 'force-dynamic';

interface AdminSectionPageProps {
  params: Promise<{
    section: string;
  }>;
}

export default async function AdminSectionPage({
  params,
}: AdminSectionPageProps) {
  const { section } = await params;

  if (!isAdminView(section)) {
    notFound();
  }

  const snapshot = await getDashboardSnapshot();

  return <AdminDashboard snapshot={snapshot} view={section} />;
}
