import { AdminPanel } from "@/components/admin/admin-panel";
import type { AdminView } from "@/components/admin/config";
import type { DashboardSnapshot } from "@/lib/types";

interface AdminDashboardProps {
	snapshot: DashboardSnapshot;
	view: AdminView;
}

export function AdminDashboard({ snapshot, view }: AdminDashboardProps) {
	return <AdminPanel snapshot={snapshot} focusedSection={view} hideSidebar />;
}

