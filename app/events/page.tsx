import { PageBanner } from "@/components/page-banner";
import { getCompetitionCatalog, getEvents, getSports } from "@/lib/data";
import type { CompetitionSummary } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

import styles from "@/app/subpage.module.css";

export const dynamic = "force-dynamic";

const divisionLabels: Record<CompetitionSummary["division"], string> = {
  MEN: "Men",
  WOMEN: "Women",
  OPEN: "Open",
  MIXED: "Men and Women",
};

function formatMoney(value: number | null) {
  if (value === null) {
    return null;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function groupCompetitions(entries: CompetitionSummary[]) {
  return [
    {
      key: "sports-men",
      title: "Sports - Men",
      items: entries.filter((entry) => entry.kind === "SPORT" && entry.division === "MEN"),
    },
    {
      key: "sports-women",
      title: "Sports - Women",
      items: entries.filter((entry) => entry.kind === "SPORT" && entry.division === "WOMEN"),
    },
    {
      key: "sports-mixed",
      title: "Sports - Men and Women",
      items: entries.filter((entry) => entry.kind === "SPORT" && entry.division === "MIXED"),
    },
    {
      key: "esports-open",
      title: "E-Sports",
      items: entries.filter((entry) => entry.kind === "ESPORT"),
    },
  ].filter((group) => group.items.length > 0);
}

function formatCompetitionMeta(entry: CompetitionSummary) {
  const parts = [entry.kind === "ESPORT" ? "E-Sport" : "Sport"];

  if (entry.formatLabel) {
    parts.push(entry.formatLabel);
  }

  parts.push(entry.kind === "ESPORT" ? "Online lane" : "On-ground lane");

  return parts.join(" • ");
}

export default async function EventsPage() {
  const [events, sports, competitions] = await Promise.all([
    getEvents(),
    getSports(),
    getCompetitionCatalog(),
  ]);
  const competitionGroups = groupCompetitions(competitions);

  return (
    <div className={styles.page}>
      <PageBanner
        chips={["Fixtures", "University teams", "Finals"]}
        compact
        description="Every sport, one structured event deck."
        eyebrow="UDGAM events"
        title="Events & Fixtures"
      />

      <div className={styles.gridThree}>
        {events.map((event) => (
          <article className={styles.darkCard} key={event.id}>
            <p className={styles.darkEyebrow}>{event.sport}</p>
            <h2 className={styles.title}>{event.title}</h2>
            <p className={styles.darkText}>{event.summary}</p>
            <div className={styles.metaRow}>
              <span>{event.venue}</span>
              <span>{formatDateTime(event.start)}</span>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.gridTwo}>
        {sports.map((sport) => (
          <article className={styles.card} key={sport.id}>
            <p className={styles.eyebrow}>Competition lane</p>
            <h2 className={styles.title}>{sport.name}</h2>
            <p className={styles.text}>{sport.tagline}</p>
          </article>
        ))}
      </div>

      {competitionGroups.map((group) => (
        <section className={styles.catalogSection} key={group.key}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionCopy}>
              <p className={styles.sectionEyebrow}>Competition catalogue</p>
              <h2 className={styles.sectionTitle}>{group.title}</h2>
              <p className={styles.sectionText}>
                Registration fee and prize slabs seeded from the official UDGAM 2026 posters.
              </p>
            </div>
            <div className={styles.sectionChips}>
              <span className={styles.sectionChip}>Registration fees</span>
              <span className={styles.sectionChip}>Prize money</span>
              <span className={styles.sectionChip}>Poster seed</span>
            </div>
          </div>

          <div className={styles.gridThree}>
            {group.items.map((entry) => (
              <article className={`${styles.darkCard} ${styles.competitionCard}`} key={entry.id}>
                <p className={`${styles.darkEyebrow} ${styles.competitionEyebrow}`}>
                  {entry.sportName} • {divisionLabels[entry.division]}
                </p>
                <h2 className={`${styles.title} ${styles.competitionTitle}`}>{entry.title}</h2>
                <p className={`${styles.darkText} ${styles.competitionFee}`}>
                  Registration fee: {formatMoney(entry.registrationFee)}
                </p>
                <div className={styles.prizeGrid}>
                  <div className={styles.prizeCell}>
                    <span className={styles.prizeLabel}>Winner</span>
                    <strong className={styles.prizeValue}>
                      {formatMoney(entry.winnerPrize) ?? "TBA"}
                    </strong>
                  </div>
                  <div className={styles.prizeCell}>
                    <span className={styles.prizeLabel}>Runner</span>
                    <strong className={styles.prizeValue}>
                      {formatMoney(entry.runnerUpPrize) ?? "TBA"}
                    </strong>
                  </div>
                  {entry.secondRunnerUpPrize !== null ? (
                    <div className={styles.prizeCell}>
                      <span className={styles.prizeLabel}>Second runner</span>
                      <strong className={styles.prizeValue}>
                        {formatMoney(entry.secondRunnerUpPrize)}
                      </strong>
                    </div>
                  ) : null}
                </div>
                <p className={styles.competitionMeta}>{formatCompetitionMeta(entry)}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
