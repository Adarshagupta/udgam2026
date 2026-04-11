import Link from "next/link";

import { PageBanner } from "@/components/page-banner";

import styles from "@/app/subpage.module.css";

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <PageBanner
        chips={["Festival desk", "Live ops", "Organizers"]}
        description="Reach the right team without hunting through details."
        eyebrow="Contact"
        title="Contact & Desks"
      />

      <div className={styles.contactGrid}>
        <article className={styles.card}>
          <p className={styles.eyebrow}>General</p>
          <h2 className={styles.title}>Festival Desk</h2>
          <p className={styles.text}>hello@udgam.live</p>
        </article>
        <article className={styles.card}>
          <p className={styles.eyebrow}>Live ops</p>
          <h2 className={styles.title}>Score Control</h2>
          <p className={styles.text}>scores@udgam.live</p>
        </article>
        <article className={styles.card}>
          <p className={styles.eyebrow}>Registrations</p>
          <h2 className={styles.title}>Committee Desk</h2>
          <p className={styles.text}>Separate committee and executive registration flow.</p>
          <Link href="/register/committee">Open registration</Link>
        </article>
        <article className={styles.darkCard}>
          <p className={styles.darkEyebrow}>Organizer access</p>
          <h2 className={styles.title}>Admin Desk</h2>
          <p className={styles.darkText}>Publish live match and gallery updates.</p>
          <Link href="/admin">Open organizer desk</Link>
        </article>
      </div>
    </div>
  );
}
