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
  "Public Relations",
  "Media Productions",
  "Accommodation",
  "Logistics & Hospitality",
  "Transportation",
  "Cultural Committee",
  "Traditional Committee",
];

const committeeImageFiles = [
  "ACCOMMODATION .JPG",
  "Design.JPG",
  "Logistics & Hospitality .JPG",
  "Media Productions.JPG",
  "Medical and safeguarding .JPG",
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
    .replace(/\bsafe\s*guard\b/g, "safeguarding")
    .replace(/\bcommittee\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getCommitteeImageSrc(title: string) {
  const normalizedTitle = normalizeCommitteeName(title);

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
  const uniqueRegistrations = registrations.filter((entry) => {
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

      <div className={styles.gridTwo}>
        {slottedRegistrations.map(({ slot, entry }) => {
          if (!entry) {
            const slotImageSrc = getCommitteeImageSrc(slot);

            return (
              <article className={styles.darkCard} key={`slot-${slot}`}>
                <p className={styles.darkEyebrow}>Committee</p>
                <h2 className={styles.title}>{slot}</h2>
                <p className={styles.darkText}>Slot reserved. Submission pending.</p>
                {slotImageSrc ? (
                  <Image
                    alt={`${slot} visual`}
                    className={styles.sportCardImage}
                    height={320}
                    src={slotImageSrc}
                    width={320}
                  />
                ) : null}
                <div className={styles.metaRow}>
                  <span>Head: Awaiting submission</span>
                  <span>Co-head: Awaiting submission</span>
                </div>
              </article>
            );
          }

          const headImageSrc = entry.imageUrl.trimStart();
          const coHeadImageSrc = (entry.coHeadImageUrl ?? entry.imageUrl).trimStart();
          const committeeImageSrc = getCommitteeImageSrc(entry.title);

          return (
            <article className={styles.darkCard} key={entry.id}>
              <p className={styles.darkEyebrow}>{entry.category}</p>
              <h2 className={styles.title}>{entry.title}</h2>
              <div className={styles.metaRow}>
                <span>Head: {entry.headName}</span>
                <span>Co-head: {entry.coHeadName}</span>
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

          return (
            <article className={styles.darkCard} key={entry.id}>
              <p className={styles.darkEyebrow}>{entry.category}</p>
              <h2 className={styles.title}>{entry.title}</h2>
              <div className={styles.metaRow}>
                <span>Head: {entry.headName}</span>
                <span>Co-head: {entry.coHeadName}</span>
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
