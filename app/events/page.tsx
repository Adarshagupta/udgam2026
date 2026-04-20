import { PageBanner } from "@/components/page-banner";
import { getCompetitionCatalog, getEvents, getSports } from "@/lib/data";
import type { CompetitionSummary } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

import styles from "@/app/subpage.module.css";

export const dynamic = "force-dynamic";
const registrationUrl = "https://payment.collexo.com/pay-fee/srm-ap-events";
const rulebookBySportName = new Map([
  ["badminton", "/rulebooks/BADMINTON.pdf"],
  ["basketball", "/rulebooks/BASKETBALL.pdf"],
  ["bgmi", "/rulebooks/BGMI.pdf"],
  ["chess", "/rulebooks/CHESS.pdf"],
  ["football", "/rulebooks/FOOTBALL.pdf"],
  ["free fire", "/rulebooks/FREE%20FIRE.pdf"],
  ["kabaddi", "/rulebooks/KABADDI.pdf"],
  ["real cricket", "/rulebooks/REAL%20CRICKET.pdf"],
  ["table tennis", "/rulebooks/TABLE%20TENNIS.pdf"],
  ["valorant", "/rulebooks/VALORANT.pdf"],
  ["volleyball", "/rulebooks/VOLLEYBALL.pdf"],
]);

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

function matchesSportQuery(value: string, query: string) {
  return value.toLowerCase().includes(query);
}

function normalizeSportName(value: string) {
  return value.trim().toLowerCase();
}

function isEsportSport(value: string) {
  return /\bbgmi\b|\bvalorant\b|\breal cricket\b|\bfree fire\b|\bpubg\b|\bcod\b/i.test(
    value,
  );
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = resolvedSearchParams.q?.trim() ?? "";
  const normalizedQuery = query.toLowerCase();
  const [events, sports, competitions] = await Promise.all([
    getEvents(),
    getSports(),
    getCompetitionCatalog(),
  ]);
  const filteredSports = normalizedQuery
    ? sports.filter(
        (sport) =>
          matchesSportQuery(sport.name, normalizedQuery) ||
          matchesSportQuery(sport.tagline, normalizedQuery),
      )
    : sports;
  const orderedSports = [...filteredSports].sort((left, right) => {
    const leftIsEsport = isEsportSport(left.name);
    const rightIsEsport = isEsportSport(right.name);

    if (leftIsEsport !== rightIsEsport) {
      return leftIsEsport ? 1 : -1;
    }

    return left.name.localeCompare(right.name);
  });
  const filteredCompetitions = normalizedQuery
    ? competitions.filter(
        (entry) =>
          matchesSportQuery(entry.title, normalizedQuery) ||
          matchesSportQuery(entry.sportName, normalizedQuery) ||
          matchesSportQuery(entry.formatLabel ?? "", normalizedQuery) ||
          matchesSportQuery(formatCompetitionMeta(entry), normalizedQuery),
      )
    : competitions;
  const sportImageByName = new Map(
    sports.map((sport) => [normalizeSportName(sport.name), sport.imageUrl]),
  );
  const competitionGroups = groupCompetitions(filteredCompetitions);

  return (
    <div className={styles.page}>
      <PageBanner
        chips={["Fixtures", "University teams", "Finals"]}
        compact
        description="Every sport, one structured event deck."
        eyebrow="UDGAM events"
        title="Events & Fixtures"
      />

      <section className={styles.searchSection}>
        <div className={styles.searchCopy}>
          <p className={styles.sectionEyebrow}>Search sports</p>
          <h2 className={styles.sectionTitle}>Find a sport fast.</h2>
          <p className={styles.sectionText}>
            Search by sport name, format, or competition type.
          </p>
        </div>

        <form action="/events" className={styles.searchForm}>
          <input
            aria-label="Search sports"
            className={styles.searchInput}
            defaultValue={query}
            name="q"
            placeholder="Search basketball, chess, doubles..."
            type="search"
          />
          <button className={styles.searchButton} type="submit">
            Search
          </button>
        </form>

        {query ? (
          <p className={styles.searchResult}>
            Showing results for <strong>{query}</strong>.
          </p>
        ) : null}
      </section>

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
        {orderedSports.map((sport) => {
          const rulebookUrl = rulebookBySportName.get(normalizeSportName(sport.name)) ?? null;

          return (
            <article className={[styles.card, styles.sportCard].join(" ")} key={sport.id}>
              {sport.imageUrl ? (
                <a
                  aria-label={`Register for ${sport.name}`}
                  href={registrationUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img alt={sport.name} className={styles.sportCardImage} src={sport.imageUrl} />
                </a>
              ) : null}
              <div className={styles.sportCardBody}>
                <p className={styles.eyebrow}>Competition lane</p>
                <h2 className={styles.title}>{sport.name}</h2>
                <p className={styles.text}>{sport.tagline}</p>
                {rulebookUrl ? (
                  <a
                    className={styles.rulebookButton}
                    href={rulebookUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    View Rulebook
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {!filteredSports.length && !competitionGroups.length ? (
        <article className={styles.card}>
          <p className={styles.eyebrow}>No results</p>
          <h2 className={styles.title}>No matching sport found.</h2>
          <p className={styles.text}>Try a shorter name like volleyball, bgmi, or chess.</p>
        </article>
      ) : null}

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
                {sportImageByName.get(normalizeSportName(entry.sportName)) ? (
                  <a
                    aria-label={`Register for ${entry.sportName}`}
                    href={registrationUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <img
                      alt={entry.sportName}
                      className={styles.competitionImage}
                      src={sportImageByName.get(normalizeSportName(entry.sportName)) ?? ""}
                    />
                  </a>
                ) : null}
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




