import Link from "next/link";

import styles from "@/components/site.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerCard}>
        <span aria-hidden className={styles.footerSeal} />

        <div className={styles.footerBrand}>
          <p className={styles.sectionEyebrow}>UDGAM / CAMPUS SPORTS</p>
          <h2 className={styles.footerBrandTitle}>Campus sport, shaped with precision.</h2>
          <p className={styles.footerText}>
            UDGAM brings fixtures, live scores, venue information, and campus moments
            into one clean public site.
          </p>
        </div>

        <div className={styles.footerLinksPanel}>
          <p className={styles.sectionEyebrow}>Explore</p>
          <ul className={styles.footerList}>
            <li>
              <Link href="/live">Live board</Link>
            </li>
            <li>
              <Link href="/events">Event deck</Link>
            </li>
            <li>
              <Link href="/gallery">Image wall</Link>
            </li>
            <li>
              <Link href="/admin">Organizer desk</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerMeta}>
          <div>
            <p className={styles.sectionEyebrow}>Built on</p>
            <p className={styles.footerText}>
              Next.js, Prisma, Auth.js, Socket.IO, and Cloudflare R2.
            </p>
          </div>

          <div className={styles.footerBottomRow}>
            <p className={styles.footerText}>Built for UDGAM 2026.</p>
            <p className={styles.footerMini}>SRM IST • Sports Fest Platform</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
