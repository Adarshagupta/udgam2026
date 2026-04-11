'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import {
  adminNavItems,
  getAdminViewMeta,
  isAdminView,
} from '@/components/admin/config';

import styles from '@/components/admin/admin.module.css';

interface AdminDashboardShellProps {
  children: ReactNode;
  userName: string;
}

function formatDashboardTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function AdminDashboardShell({
  children,
  userName,
}: AdminDashboardShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [timeLabel, setTimeLabel] = useState('Syncing');
  const currentSection = pathname?.split('/')[2] ?? 'overview';
  const currentView = isAdminView(currentSection)
    ? getAdminViewMeta(currentSection)
    : getAdminViewMeta('overview');

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const updateTime = () => {
      setTimeLabel(formatDashboardTime(new Date()));
    };

    updateTime();

    const intervalId = window.setInterval(updateTime, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

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
          <p className={styles.sidebarText}>Scores, fixtures, media, registrations.</p>
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
          <div>
            <p className={styles.sidebarMetaLabel}>Signed in</p>
            <strong className={styles.sidebarMetaValue}>{userName}</strong>
          </div>
          <div>
            <p className={styles.sidebarMetaLabel}>Current desk</p>
            <strong className={styles.sidebarMetaValue}>{currentView.label}</strong>
          </div>
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

      <section className={styles.workspace}>
        <header className={styles.workspaceHeader}>
          <div className={styles.workspaceHeaderMain}>
            <div className={styles.workspaceHeaderTop}>
              <button
                aria-controls='admin-sidebar'
                aria-expanded={menuOpen}
                className={styles.mobileMenuButton}
                onClick={() => setMenuOpen((currentValue) => !currentValue)}
                type='button'
              >
                {menuOpen ? 'Close menu' : 'Open menu'}
              </button>
              <p className={styles.workspaceEyebrow}>Operations workspace</p>
            </div>

            <div>
              <h2 className={styles.workspaceTitle}>{currentView.label}</h2>
              <p className={styles.workspaceText}>{currentView.description}</p>
            </div>
          </div>

          <div className={styles.workspaceStatusStrip}>
            <article className={styles.shellStatusCard}>
              <span className={styles.shellStatusLabel}>Session owner</span>
              <strong className={styles.shellStatusValue}>{userName}</strong>
            </article>
            <article className={styles.shellStatusCard}>
              <span className={styles.shellStatusLabel}>Active desk</span>
              <strong className={styles.shellStatusValue}>{currentView.label}</strong>
            </article>
            <article className={styles.shellStatusCard}>
              <span className={styles.shellStatusLabel}>Local time</span>
              <strong className={styles.shellStatusValue}>{timeLabel}</strong>
            </article>
          </div>
        </header>

        <div className={styles.workspaceBody}>{children}</div>
      </section>
    </div>
  );
}
