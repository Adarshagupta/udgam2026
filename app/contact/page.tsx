import Link from "next/link";

import { PageBanner } from "@/components/page-banner";

import styles from "@/app/subpage.module.css";

const registrationUrl = "https://payment.collexo.com/pay-fee/srm-ap-events";

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <PageBanner
        chips={["SRM University-AP", "UDGAM 2026", "Sports festival"]}
        description="Reach the UDGAM 2026 teams for support, scores, and registration help."
        eyebrow="Contact"
        title="Contact"
      />

      <div className={styles.contactGrid}>
        <article className={styles.card}>
          <p className={styles.eyebrow}>General</p>
          <h2 className={styles.title}>UDGAM Help</h2>
          <p className={styles.text}>hello@udgam.live</p>
        </article>
        <article className={styles.card}>
          <p className={styles.eyebrow}>Match updates</p>
          <h2 className={styles.title}>Live Scores</h2>
          <p className={styles.text}>scores@udgam.live</p>
        </article>
        <article className={styles.card}>
          <p className={styles.eyebrow}>Registrations</p>
          <h2 className={styles.title}>Committee Registration</h2>
          <p className={styles.text}>Submit committee and executive entries for UDGAM 2026.</p>
          <Link href={registrationUrl} rel="noopener noreferrer" target="_blank">
            Open registration
          </Link>
        </article>
        <article className={styles.darkCard}>
          <p className={styles.darkEyebrow}>Campus sports office</p>
          <h2 className={styles.title}>SRM Sports Council</h2>
          <p className={styles.darkText}>Support for coordination, participation, and matchday updates.</p>
          <Link href="/admin">Open admin access</Link>
        </article>
      </div>
    </div>
  );
}
