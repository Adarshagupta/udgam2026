'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { adminNavItems } from '@/components/admin/config';

import styles from '@/components/admin/admin.module.css';

interface AdminDashboardShellProps {
  children: ReactNode;
  userName: string;
}

export function AdminDashboardShell({
  children,
  userName,
}: AdminDashboardShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.dashboardShell}>
      <button
        aria-hidden={menuOpen ? false : true}
        aria-label='Close navigation'
        className={[
          styles.sidebarBackdrop,
          menuOpen ? styles.sidebarBackdropVisible : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => setMenuOpen(false)}
        type='button'
      />

      <aside
        className={[styles.sidebar, menuOpen ? styles.sidebarOpen : '']
          .filter(Boolean)
          .join(' ')}
        id='admin-sidebar'
      >
        <div className={styles.sidebarBrand}>
          <p className={styles.sidebarLabel}>UDGAM Admin</p>
          <h1 className={styles.sidebarTitle}>Festival Desk</h1>
          <p className={styles.sidebarText}>
            A focused operations workspace separate from the public website.
          </p>
        </div>

        <nav aria-label='Admin navigation' className={styles.sidebarNav}>
          {adminNavItems.map((item) => {
            const isActive = pathname === '/admin/' + item.id;

            return (
              <Link
                className={[
                  styles.sidebarLink,
                  isActive ? styles.sidebarLinkActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                href={'/admin/' + item.id}
                key={item.id}
                onClick={() => setMenuOpen(false)}
              >
                <span className={styles.sidebarLinkLabel}>{item.label}</span>
                <span className={styles.sidebarLinkMeta}>{item.description}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarMeta}>
          <p className={styles.sidebarMetaLabel}>Signed in</p>
          <strong className={styles.sidebarMetaValue}>{userName}</strong>
        </div>

        <div className={styles.sidebarUtility}>
          <Link className={styles.utilityLink} href='/'>
            Public site
          </Link>
          <Link className={styles.utilityLink} href='/updates'>
            Updates feed
          </Link>
          <Link className={styles.utilityLink} href='/live'>
            Live board
          </Link>
        </div>

        <button
          className={styles.sidebarLogout}
          onClick={() => void signOut({ callbackUrl: '/admin' })}
          type='button'
        >
          Log out
        </button>
      </aside>

      <div className={styles.workspace}>
        <div className={styles.workspaceBody}>{children}</div>
      </div>
    </div>
  );
}
