import Image from "next/image";
import { PageBanner } from "@/components/page-banner";

import styles from "@/app/subpage.module.css";

const champions = [
  {
    name: "Anamika",
    id: "AP25322130115",
    imageSrc: "/about/anamika.png",
    achievement:
      "Won Gold Medal in Heptathlon at the All-India Inter-University Athletics Competition, Mangalore.",
  },
  {
    name: "Sarthak",
    id: "AP25211400007",
    imageSrc: "/about/sarthak.png",
    achievement:
      "National athletics throws competition silver medalist (2025) in Shot Put.",
  },
  {
    name: "Aditya",
    id: "AP25211400014",
    imageSrc: "/about/aditya.png",
    achievement:
      "Won Gold Medal in Javelin Throw at the All-India Inter-University Athletics Competition, Mangalore.",
  },
  {
    name: "Mubhasena",
    id: "AP24322130070",
    imageSrc: "/about/mubhasena.png",
    achievement:
      "Gold Medal in Long Jump at the All-India Inter-University Athletics Competition.",
  },
  {
    name: "Himanshu",
    id: "AP25211400011",
    imageSrc: "/about/himanshu.png",
    achievement:
      "Junior National Gold with a Junior National Record (October 2025), and Junior Asia medalist in Javelin Throw.",
  },
  {
    name: "MUBASINA MUHAMMED",
    imageSrc: "/about/aisan.png",
    achievement:
      "Bronze - Junior World Championship, and representation at the Asian Games.",
  },
  {
    name: "Raunak Chauhan",
    imageSrc: "/about/karnataka.png",
    achievement:
      "Junior World Championship milestone with Karnataka International and Orissa International appearances.",
  },
  {
    name: "Vishwa Tej and Bhargav Ram",
    imageSrc: "/about/yuganda.png",
    achievement:
      "Junior World Championship milestone and Yuganda International Gold Medal.",
  },
  {
    name: "Numir Shaik",
    imageSrc: "/about/bangladesh.png",
    achievement:
      "Bangladesh International Championship achievement.",
  },
];

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
              UDGAM, derived from the Sanskrit word meaning "to rise" or "origin",
              is the flagship annual sports fest of SRM University-AP.
            </p>
            <p className={styles.text}>
              It is a dynamic celebration of athletic excellence, where students from
              across India come together to compete, collaborate, and showcase their
              passion for sports. UDGAM reflects the university's commitment to
              holistic development - nurturing discipline, teamwork, resilience, and
              leadership through sports.
            </p>
            <p className={styles.text}>
              Since its inception, UDGAM has grown into a national-level sports fest,
              attracting participation over 4000+ athletes across 70+ institutions.
            </p>
          </article>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionCopy}>
            <p className={styles.sectionEyebrow}>Student Achievements</p>
            <h2 className={styles.sectionTitle}>OUR CHAMPIONS</h2>
          </div>
        </div>

        <div className={styles.gridThree}>
          {champions.map((champion) => (
            <article className={styles.card} key={champion.imageSrc}>
              <Image
                alt={`${champion.name} profile`}
                className={styles.sportCardImage}
                height={720}
                src={champion.imageSrc}
                width={1280}
              />
              {champion.id ? <p className={styles.eyebrow}>{champion.id}</p> : null}
              {champion.hideName ? null : <h3 className={styles.title}>{champion.name}</h3>}
              <p className={styles.text}>{champion.achievement}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
