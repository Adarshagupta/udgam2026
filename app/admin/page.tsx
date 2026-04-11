import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAuthSession } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/data";
import { redirect } from "next/navigation";

import styles from "@/components/admin/admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/admin/overview");
  }

  const snapshot = await getDashboardSnapshot();

  return (
    <div className={styles.pageShell}>
      <AdminLoginForm demoHint={snapshot.adminHint} />
    </div>
  );
}
