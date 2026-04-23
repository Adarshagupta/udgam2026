import Image from "next/image";

import { PageBanner } from "@/components/page-banner";
import { getCommitteeRegistrations } from "@/lib/data";

import styles from "@/app/subpage.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Committees",
  description: "View all committee and executive entries submitted to UDGAM 2026.",
};

const committeeSlots = [
  "Website Committee",
  "Design",
  "Post Production",
  "Informal Events",
  "Registration",
  "Refreshments",
  "Medical and safe guard",
  "Publicity",
  "Media Productions",
  "Accommodation",
  "Logistics & Hospitality",
  "Transportation",
  "Cultural Committee",
  "Traditional Committee",
];

const executiveHeads = [
  {
    committeeName: "Head of Udgam",
    executiveName: "Peketi Jaswanth Reddy",
    imageSrc: "/committe/Jaswanth%20Reddy.JPG",
    imagePosition: "center 8%",
  },
  {
    committeeName: "Head of Hospitality",
    executiveName: "Tarun Jallepalli",
    imageSrc: "/committe/tarun.JPG",
    imagePosition: "center 28%",
  },
  {
    committeeName: "Head of Design & Media Productions",
    executiveName: "Shaik Muneer Irfan",
    imageSrc: "/committe/SHAIK%20MUNEER%20IRFAN.JPG",
  },
  {
    committeeName: "Head of admistration",
    executiveName: "Ravi Shankar",
    imageSrc: "/committe/Ravi.JPG",
  },
  {
    committeeName: "Head of Traditional and informal",
    executiveName: "A.Teja manoj kumar",
    imageSrc: "/committe/Teja%20manoj%20kumar.JPG",
  },
  {
    committeeName: "Head Of Publicity",
    executiveName: "Devalla Jyothi Swaroop raj",
    imageSrc: "/committe/Swaroop.jpg",
  },
  {
    committeeName: "Head of Medical & safeguard, Refereshments and Public Relations",
    executiveName: "Pradnish Chintada",
    imageSrc: "/committe/Pradnish.JPG",
  },
];

const committeeLeadsBySlot = new Map([
  ["Design", { headName: "Pabbathi Thrishanth Reddy", coHeadName: "Shilpi jha" }],
  [
    "Post Production",
    { headName: "K. Manikanta Srinu, G. Satvik", coHeadName: "Karthikeya" },
  ],
  ["Informal Events", { headName: "Pravallika Gorle", coHeadName: "Praneeth Kumar" }],
  ["Registration", { headName: "Sanjeev Reddy", coHeadName: "jaswanth sai tangudu" }],
  ["Refreshments", { headName: "Varnash", coHeadName: "vamsi, Ankith" }],
  ["Medical and safe guard", { headName: "Jayanth", coHeadName: "keerthi" }],
  ["Publicity", { headName: "Likitha", coHeadName: "Dhanush" }],
  [
    "Media Productions",
    { headName: "Sabbani Sathwik", coHeadName: "Krishna Prajeeth" },
  ],
  [
    "Accommodation",
    { headName: "N .Sai Ganesh Reddy", coHeadName: "Ch.Yaswitha Reddy" },
  ],
  ["Logistics & Hospitality", { headName: "Sashank", coHeadName: "S.Vedhaaabhiram Reddy" }],
  ["Transportation", { headName: "Sandeep.Madala", coHeadName: "Jai Sai Raj" }],
  [
    "Cultural Committee",
    { headName: "Revanth Vadisetty", coHeadName: "Bhargav Ram Deekshith Puvvada" },
  ],
  [
    "Traditional Committee",
    { headName: "Muthya Prasadh Kommuru", coHeadName: "J Gokul Krishna" },
  ],
]);

const committeeImageFiles = [
  "ACCOMMODATION .JPG",
  "Cultural.png",
  "Design.JPG",
  "informal.png",
  "Logistics & Hospitality .JPG",
  "Media Productions.JPG",
  "Medical and safeguarding .JPG",
  "Postproduction.jpeg",
  "Publicrelation.png",
  "Refreshments.JPG",
  "Registration committee .JPG",
  "TRADITIONAL COMMITTEE .JPG",
  "Transportation.JPG",
  "Website.JPG",
];

function normalizeCommitteeName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\binformal events?\b/g, "informal events")
    .replace(/\binformal\b/g, "informal events")
    .replace(/\bpostproduction\b/g, "post production")
    .replace(/\bpublicrelation\b/g, "publicity")
    .replace(/\bpublic relations?\b/g, "publicity")
    .replace(/\bsafe\s*guard\b/g, "safeguarding")
    .replace(/\bcommittee\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getCommitteeImageSrc(title: string) {
  const normalizedTitle = normalizeCommitteeName(title);

  if (normalizedTitle.includes("informal events")) {
    return "/committe/informal.png";
  }

  for (const imageFile of committeeImageFiles) {
    const baseName = imageFile.replace(/\.[^.]+$/, "").trim();

    if (normalizeCommitteeName(baseName) === normalizedTitle) {
      return `/committe/${encodeURIComponent(imageFile)}`;
    }
  }

  return null;
}

export default async function RegistrationsPage() {
  const registrations = await getCommitteeRegistrations();
  const seenTitles = new Set<string>();
  const committeeRegistrations = registrations.filter((entry) => entry.category === "COMMITTEE");
  const uniqueRegistrations = committeeRegistrations.filter((entry) => {
    const normalizedTitle = normalizeCommitteeName(entry.title);

    if (seenTitles.has(normalizedTitle)) {
      return false;
    }

    seenTitles.add(normalizedTitle);
    return true;
  });
  const registrationByTitle = new Map(
    uniqueRegistrations.map((entry) => [normalizeCommitteeName(entry.title), entry]),
  );
  const usedRegistrationIds = new Set<string>();
  const slottedRegistrations = committeeSlots.map((slot) => {
    const match = registrationByTitle.get(normalizeCommitteeName(slot)) ?? null;

    if (match) {
      usedRegistrationIds.add(match.id);
    }

    return {
      slot,
      entry: match,
    };
  });
  const additionalRegistrations = uniqueRegistrations.filter(
    (entry) => !usedRegistrationIds.has(entry.id),
  );

  return (
    <div className={styles.page}>
      <PageBanner
        chips={["Committee", "Executive", "UDGAM 2026"]}
        compact
        description="All committee and executive entries in one public list."
        eyebrow="Committee board"
        title="Committees"
      />

      <section className={styles.memberSection}>
        <p className={styles.memberSectionLabel}>Executive members</p>
        <div className={styles.horizontalScrollFrame}>
          <div className={styles.horizontalScroll}>
            <div className={styles.horizontalScrollTrack}>
              {executiveHeads.map((entry) => (
                <article
                  className={`${styles.darkCard} ${styles.horizontalScrollItem}`}
                  key={`exec-${entry.committeeName}`}
                >
                  <p className={styles.darkEyebrow}>Executive</p>
                  <h2 className={styles.title}>{entry.committeeName}</h2>
                  <p className={styles.darkText}>Executive Name: {entry.executiveName}</p>
                  {entry.imageSrc ? (
                    <Image
                      alt={`${entry.executiveName} profile`}
                      className={`${styles.sportCardImage} ${styles.executiveImageAdjust}`}
                      height={320}
                      src={entry.imageSrc}
                      style={entry.imagePosition ? { objectPosition: entry.imagePosition } : undefined}
                      width={320}
                    />
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.memberSection}>
        <p className={styles.memberSectionLabel}>Committee members</p>
        <div className={styles.gridTwo}>
          {slottedRegistrations.map(({ slot, entry }) => {
          if (!entry) {
            const slotImageSrc = getCommitteeImageSrc(slot);
            const slotLeads = committeeLeadsBySlot.get(slot) ?? {
              headName: "Awaiting submission",
              coHeadName: "Awaiting submission",
            };

            return (
              <article className={styles.darkCard} key={`slot-${slot}`}>
                <p className={styles.darkEyebrow}>Committee</p>
                <h2 className={styles.title}>{slot}</h2>
                <div className={styles.metaRow}>
                  <span>Head: {slotLeads.headName}</span>
                  <span>Co-head: {slotLeads.coHeadName}</span>
                </div>
                {slotImageSrc ? (
                  <Image
                    alt={`${slot} visual`}
                    className={styles.sportCardImage}
                    height={320}
                    src={slotImageSrc}
                    width={320}
                  />
                ) : null}
              </article>
            );
          }

          const headImageSrc = entry.imageUrl.trimStart();
          const coHeadImageSrc = (entry.coHeadImageUrl ?? entry.imageUrl).trimStart();
          const committeeImageSrc = getCommitteeImageSrc(entry.title);
          const normalizedEntryTitle = normalizeCommitteeName(entry.title);
          const displayTitle = normalizedEntryTitle === "publicity" ? "Publicity" : entry.title;
          const displayHeadName = normalizedEntryTitle === "publicity" ? "Likitha" : entry.headName;
          const displayCoHeadName = normalizedEntryTitle === "publicity" ? "Dhanush" : entry.coHeadName;

          return (
            <article className={styles.darkCard} key={entry.id}>
              <p className={styles.darkEyebrow}>{entry.category}</p>
              <h2 className={styles.title}>{displayTitle}</h2>
              <div className={styles.metaRow}>
                <span>Head: {displayHeadName}</span>
                <span>Co-head: {displayCoHeadName}</span>
              </div>
              {committeeImageSrc ? (
                <Image
                  alt={`${entry.title} visual`}
                  className={styles.sportCardImage}
                  height={320}
                  src={committeeImageSrc}
                  width={320}
                />
              ) : (
                <div className={styles.gridTwo}>
                  <div>
                    <Image
                      alt={`${entry.headName} profile`}
                      className={styles.sportCardImage}
                      height={320}
                      src={headImageSrc}
                      width={320}
                    />
                  </div>
                  <div>
                    <Image
                      alt={`${entry.coHeadName} profile`}
                      className={styles.sportCardImage}
                      height={320}
                      src={coHeadImageSrc}
                      width={320}
                    />
                  </div>
                </div>
              )}
            </article>
          );
        })}

          {additionalRegistrations.map((entry) => {
            const headImageSrc = entry.imageUrl.trimStart();
            const coHeadImageSrc = (entry.coHeadImageUrl ?? entry.imageUrl).trimStart();
            const committeeImageSrc = getCommitteeImageSrc(entry.title);
            const normalizedEntryTitle = normalizeCommitteeName(entry.title);
            const displayTitle = normalizedEntryTitle === "publicity" ? "Publicity" : entry.title;
            const displayHeadName = normalizedEntryTitle === "publicity" ? "Likitha" : entry.headName;
            const displayCoHeadName = normalizedEntryTitle === "publicity" ? "Dhanush" : entry.coHeadName;

            return (
              <article className={styles.darkCard} key={entry.id}>
                <p className={styles.darkEyebrow}>{entry.category}</p>
                <h2 className={styles.title}>{displayTitle}</h2>
                <div className={styles.metaRow}>
                  <span>Head: {displayHeadName}</span>
                  <span>Co-head: {displayCoHeadName}</span>
                </div>
                {committeeImageSrc ? (
                  <Image
                    alt={`${entry.title} visual`}
                    className={styles.sportCardImage}
                    height={320}
                    src={committeeImageSrc}
                    width={320}
                  />
                ) : (
                  <div className={styles.gridTwo}>
                    <div>
                      <Image
                        alt={`${entry.headName} profile`}
                        className={styles.sportCardImage}
                        height={320}
                        src={headImageSrc}
                        width={320}
                      />
                    </div>
                    <div>
                      <Image
                        alt={`${entry.coHeadName} profile`}
                        className={styles.sportCardImage}
                        height={320}
                        src={coHeadImageSrc}
                        width={320}
                      />
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {!uniqueRegistrations.length ? (
        <article className={styles.card}>
          <p className={styles.eyebrow}>Slots are visible</p>
          <h2 className={styles.title}>Committee slots are ready.</h2>
          <p className={styles.text}>Entries will populate each slot once teams submit details.</p>
        </article>
      ) : null}
    </div>
  );
}
