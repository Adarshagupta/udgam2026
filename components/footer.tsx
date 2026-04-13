import Link from "next/link";

import styles from "@/components/site.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerCard}>
        <span aria-hidden className={styles.footerSeal} />

        <div className={styles.footerBrand}>
          <p className={styles.sectionEyebrow}>UDGAM / SRM UNIVERSITY-AP</p>
          <h2 className={styles.footerBrandTitle}>National-level sports fest and partnership platform.</h2>
          <p className={styles.footerText}>
            SRM University - AP, Mangalagiri Mandal, Neerukonda, Amaravathi,
            Andhra Pradesh - 522502.
          </p>
        </div>

        <div className={styles.footerLinksPanel}>
          <p className={styles.sectionEyebrow}>Quick links</p>
          <ul className={styles.footerList}>
            <li>
              <Link href="/about">About UDGAM</Link>
            </li>
            <li>
              <Link href="/events">Brand partnership offers</Link>
            </li>
            <li>
              <Link href="/gallery">Our champions</Link>
            </li>
            <li>
              <Link href="/contact">Contact us</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerMeta}>
          <div>
            <p className={styles.sectionEyebrow}>Reach us</p>
            <p className={styles.footerText}>
              Email: sports.council@srmap.edu.in
            </p>
            <p className={styles.footerText}>Instagram: @udgam.srmuap</p>
          </div>

          <div className={styles.footerBottomRow}>
            <p className={styles.footerText}>Sponsorship Head: Chinmaya Baki - 8096299900</p>
            <p className={styles.footerMini}>UDGAM 2026 • Amaravati Campus</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
