import Image from "next/image";
import { PageBanner } from "@/components/page-banner";

import styles from "@/app/subpage.module.css";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <PageBanner
        chips={["SRM University-AP", "Directorate of Sports", "UDGAM 2026"]}
        description="Meet the leadership behind sports development at SRM University-AP."
        eyebrow="About UDGAM"
        title="Director - Sports"
      />

      <section className={styles.catalogSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionCopy}>
            <p className={styles.sectionEyebrow}>Leadership Profile</p>
            <h2 className={styles.sectionTitle}>Dr Vir Ji Koul</h2>
            <p className={styles.sectionText}>
              Director - Sports, SRM University-AP
            </p>
          </div>
        </div>

        <div className={styles.gridTwo}>
          <article className={styles.darkCard}>
            <p className={styles.darkEyebrow}>Director - Sports</p>
            <h3 className={styles.title}>Dr Vir Ji Koul</h3>
            <Image
              alt="Dr Vir Ji Koul, Director - Sports"
              className={styles.sportCardImage}
              height={720}
              src="/about/directorsports.jpg"
              width={1280}
            />
          </article>
          <article className={styles.card}>
            <p className={styles.eyebrow}>Contact Details</p>
            <h3 className={styles.title}>director.sports@srmap.edu.in</h3>
            <p className={styles.text}>
              Dr V Koul is a seasoned professional with 23 years of experience in sports
              education and development, specialising in driving athlete performance,
              program success, and organisational efficiency.
            </p>
            <p className={styles.text}>
              His ability and vision to organise and administrate, while at the same
              time encourage sportspersons to develop their skills, knowledge and
              confidence, marks him as visionary leader committed to institutional
              excellence.
            </p>
            <p className={styles.text}>
              His educational qualification encompasses Master's in Physical Education,
              MBA in Sports Management and a Ph.D. in Health and Fitness from Nagpur
              University.
            </p>
            <p className={styles.text}>
              With his extensive knowledge of competitive sports and training
              methodology, Dr Koul introduces expert instruction and administration
              skills in to ensure smooth operations and maximum productivity.
            </p>
          </article>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionCopy}>
            <p className={styles.sectionEyebrow}>College Sports Festival</p>
            <h2 className={styles.sectionTitle}>ABOUT UDGAM</h2>
          </div>
        </div>

        <div className={styles.gridTwo}>
          <article className={styles.darkCard}>
            <p className={styles.darkEyebrow}>UDGAM Identity</p>
            <h3 className={styles.title}>Annual Sports Festival</h3>
            <Image
              alt="UDGAM logo"
              className={styles.sportCardImage}
              height={720}
              src="/about/UDGAM%20TEXT.png"
              width={1280}
            />
          </article>
          <article className={styles.card}>
            <p className={styles.eyebrow}>About UDGAM</p>
            <p className={styles.text}>
              Udgam is the annual sports festival of our college, designed to bring
              together students from different disciplines to celebrate athleticism,
              teamwork, and competitive spirit. It serves as a vibrant platform
              where participants showcase their skills across a variety of indoor
              and outdoor sports, ranging from traditional games like cricket,
              football, and athletics to more contemporary events.
            </p>
            <p className={styles.text}>
              Beyond competition, Udgam fosters unity and enthusiasm on campus,
              encouraging students to step out of their academic routines and
              engage in physical activity and collaboration. The festival is marked
              by high energy, cheering crowds, and a strong sense of camaraderie,
              making it one of the most anticipated and memorable events in the
              college calendar.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
