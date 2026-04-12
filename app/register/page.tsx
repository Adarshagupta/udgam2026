import Image from "next/image";

import { PageBanner } from "@/components/page-banner";
import { getCommitteeRegistrations } from "@/lib/data";

import styles from "@/app/subpage.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Committees",
  description: "View all committee and executive entries submitted to UDGAM 2026.",
};

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" height="14" viewBox="0 0 24 24" width="14">
      <path
        d="M20.447 20.452h-3.554V14.87c0-1.332-.026-3.045-1.857-3.045-1.86 0-2.145 1.451-2.145 2.948v5.679H9.337V9h3.414v1.561h.049c.476-.9 1.637-1.849 3.369-1.849 3.602 0 4.267 2.371 4.267 5.456v6.284zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452z"
        fill="currentColor"
      />
    </svg>
  );
}

function toExternalUrl(value: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  return `https://${normalized}`;
}

export default async function RegistrationsPage() {
  const registrations = await getCommitteeRegistrations();

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
        {registrations.map((entry) => {
          const headImageSrc = entry.imageUrl.trimStart();
          const coHeadImageSrc = (entry.coHeadImageUrl ?? entry.imageUrl).trimStart();
          const headEmail = entry.headEmail?.trim() || null;
          const coHeadEmail = entry.coHeadEmail?.trim() || null;
          const headLinkedinUrl = toExternalUrl(entry.headLinkedin);
          const coHeadLinkedinUrl = toExternalUrl(entry.coHeadLinkedin);

          return (
            <article className={styles.darkCard} key={entry.id}>
              <p className={styles.darkEyebrow}>{entry.category}</p>
              <h2 className={styles.title}>{entry.title}</h2>
              <div className={styles.metaRow}>
                <span>Head: {entry.headName}</span>
                <span>Co-head: {entry.coHeadName}</span>
              </div>
              <div className={styles.contactGridCompact}>
                <div className={styles.contactMiniCard}>
                  <p className={styles.contactMiniTitle}>Head Contact</p>
                  {headEmail ? (
                    <a className={styles.socialLink} href={`mailto:${headEmail}`}>
                      <span>Email</span>
                      <span>{headEmail}</span>
                    </a>
                  ) : (
                    <p className={styles.contactMiniLine}>Email: Not submitted</p>
                  )}
                  {headLinkedinUrl ? (
                    <a
                      className={styles.socialLink}
                      href={headLinkedinUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <LinkedInIcon />
                      <span>LinkedIn</span>
                    </a>
                  ) : (
                    <p className={styles.contactMiniLine}>No social link</p>
                  )}
                </div>

                <div className={styles.contactMiniCard}>
                  <p className={styles.contactMiniTitle}>Co-head Contact</p>
                  {coHeadEmail ? (
                    <a className={styles.socialLink} href={`mailto:${coHeadEmail}`}>
                      <span>Email</span>
                      <span>{coHeadEmail}</span>
                    </a>
                  ) : (
                    <p className={styles.contactMiniLine}>Email: Not submitted</p>
                  )}
                  {coHeadLinkedinUrl ? (
                    <a
                      className={styles.socialLink}
                      href={coHeadLinkedinUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <LinkedInIcon />
                      <span>LinkedIn</span>
                    </a>
                  ) : (
                    <p className={styles.contactMiniLine}>No social link</p>
                  )}
                </div>
              </div>
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
            </article>
          );
        })}
      </div>

      {!registrations.length ? (
        <article className={styles.card}>
          <p className={styles.eyebrow}>No submissions yet</p>
          <h2 className={styles.title}>Committee board is empty.</h2>
          <p className={styles.text}>Check back after teams submit committee or executive entries.</p>
        </article>
      ) : null}
    </div>
  );
}
