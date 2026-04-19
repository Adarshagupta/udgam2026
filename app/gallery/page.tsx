import Image from "next/image";
import { LiveGalleryRail } from "@/components/live/live-gallery-rail";
import { PageBanner } from "@/components/page-banner";
import { getGalleryImages } from "@/lib/data";

import styles from "@/app/subpage.module.css";

export const dynamic = "force-dynamic";

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
    name: "KARNATAKA",
    hideName: true,
    imageSrc: "/about/karnataka.png",
    achievement:
      "Junior World Championship milestone with Karnataka International and Orissa International appearances.",
  },
  {
    name: "YUGANDA",
    hideName: true,
    imageSrc: "/about/yuganda.png",
    achievement:
      "Junior World Championship milestone and Yuganda International Gold Medal.",
  },
  {
    name: "BANGLADESH",
    hideName: true,
    imageSrc: "/about/bangladesh.png",
    achievement:
      "Bangladesh International Championship achievement.",
  },
];

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className={styles.page}>
      <PageBanner
        chips={["Campus moments", "Live uploads", "Media wall"]}
        description="Fresh frames from matches, ceremonies, and the crowd."
        eyebrow="UDGAM gallery"
        title="Campus Gallery"
      />
      <LiveGalleryRail initialImages={images} />

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
