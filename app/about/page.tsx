import { PageBanner } from "@/components/page-banner";

import styles from "@/app/subpage.module.css";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <PageBanner
        chips={["SRM University-AP", "Sports", "Campus spirit"]}
        description="UDGAM 2026 is SRM University-AP's annual sports festival celebrating talent, teamwork, and competition."
        eyebrow="About UDGAM"
        title="About UDGAM"
      />

      <div className={styles.gridThree}>
        <article className={styles.card}>
          <p className={styles.eyebrow}>Festival identity</p>
          <h2 className={styles.title}>SRM University-AP's sports celebration.</h2>
          <p className={styles.text}>
            UDGAM brings students, athletes, and supporters together through
            high-energy fixtures, crowd support, and university pride.
          </p>
        </article>
        <article className={styles.card}>
          <p className={styles.eyebrow}>Sports focus</p>
          <h2 className={styles.title}>Indoor, outdoor, and e-sports.</h2>
          <p className={styles.text}>
            From court-based championships to field events and digital arenas,
            UDGAM 2026 covers multiple formats for every kind of competitor.
          </p>
        </article>
        <article className={styles.darkCard}>
          <p className={styles.darkEyebrow}>Event mission</p>
          <h2 className={styles.title}>Compete hard. Represent your campus.</h2>
          <p className={styles.darkText}>
            Every match at UDGAM 2026 is built around discipline, teamwork,
            and the spirit of university-level sports.
          </p>
        </article>
      </div>
    </div>
  );
}
