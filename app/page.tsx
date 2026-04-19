import Link from "next/link";
import { Zen_Tokyo_Zoo } from "next/font/google";
import type { CSSProperties } from "react";

import { HeroBackgroundCarousel } from "@/components/public/hero-background-carousel";
import { SectionHeading } from "@/components/section-heading";
import { ParallaxScene } from "@/components/public/parallax-scene";
import { SportHighlightTile } from "@/components/public/sport-highlight-tile";
import siteStyles from "@/components/site.module.css";
import {
  getCompetitionCatalog,
  getEvents,
  getGalleryImages,
  getMatches,
  getScheduleEntries,
  getSports,
} from "@/lib/data";
import type {
  EventSummary,
  GalleryItem,
  LiveMatch,
  CompetitionSummary,
  ScheduleEntry,
  SportSummary,
} from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

import styles from "@/app/page.module.css";

export const dynamic = "force-dynamic";

const tilePatterns = ["grid", "rings", "ticks", "diagonal"] as const;
const registrationUrl = "https://payment.collexo.com/pay-fee/srm-ap-events";

const esportsFallbackNames = new Set([
  "bgmi",
  "free fire",
  "real cricket",
  "valorant",
]);

function normalizeSportName(value: string) {
  return value.trim().toLowerCase();
}

const landingDisplayFont = Zen_Tokyo_Zoo({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-landing-display",
});

export default async function HomePage() {
  const [sports, competitions, events, featuredMatches, featuredImages, schedule]: [
    SportSummary[],
    CompetitionSummary[],
    EventSummary[],
    LiveMatch[],
    GalleryItem[],
    ScheduleEntry[],
  ] = await Promise.all([
    getSports(),
    getCompetitionCatalog(),
    getEvents(),
    getMatches({ featuredOnly: true }),
    getGalleryImages({ featuredOnly: true }),
    getScheduleEntries(),
  ]);

  const featureMatch = featuredMatches[0];
  const headlineEvent = events[0];
  const headlineGallery = featuredImages[0];

  const esportsNames = new Set(
    competitions
      .filter((competition) => competition.kind === "ESPORT")
      .map((competition) => normalizeSportName(competition.sportName)),
  );

  const esportsSports = sports.filter((sport) => {
    const normalizedName = normalizeSportName(sport.name);
    return esportsNames.has(normalizedName) || esportsFallbackNames.has(normalizedName);
  });
  const arenaSports = sports.filter(
    (sport) => !esportsSports.some((esport) => esport.id === sport.id),
  );

  const categorySpotlights = [
    ...arenaSports.slice(0, 2).map((sport) => ({
      ...sport,
      label: "Sports arena",
    })),
    ...esportsSports.slice(0, 2).map((sport) => ({
      ...sport,
      label: "Esports arena",
    })),
  ];

  return (
    <div className={`${styles.page} ${landingDisplayFont.variable}`}>
      <ParallaxScene className={styles.heroScene} strength={18}>
        <HeroBackgroundCarousel className={styles.layerSlow} />
        <div className={styles.heroFrame} aria-hidden="true">
          <svg
            className={styles.heroFrameSvg}
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <polygon
              className={styles.heroFrameOuter}
              points="0,11 74,0 100,6 100,88 93,100 0,94"
            />
            <polygon
              className={styles.heroFrameInner}
              points="1.4,12.6 73,1.8 98.4,7.4 98.4,86.7 91.7,98.3 1.4,92.4"
            />
          </svg>
        </div>
        <div className={`${styles.heroBackdropEdge} ${styles.layerMid}`} />
        <div className={`${styles.heroArc} ${styles.layerMid}`} />
        <div className={`${styles.heroGlow} ${styles.layerSlow}`} />

        <section className={styles.heroShell}>
          <div className={styles.heroCopy}>
            <div>
              <span className={styles.heroBadge}>UDGAM 2026 / 22-25 April</span>
              <div className={styles.heroRallyLine}>
                <span>Registrations open</span>
                <span>Campus finals week</span>
              </div>
              <h1 className={styles.heroTitle}>
                <span>UDGAM</span>
                <span>SPORTS FEST</span>
              </h1>
              <p className={styles.heroText}>
                UDGAM 2026 by SRM University-AP, Andhra Pradesh, brings together
                college athletes for four days of competition, pride, and campus spirit.
              </p>
            </div>

            <div className={styles.heroActions}>
              <Link
                className={siteStyles.primaryButton}
                href={registrationUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Register now
              </Link>
              <Link className={siteStyles.secondaryButton} href="/schedule">
                View schedule
              </Link>
            </div>
          </div>
        </section>

        <div className={styles.heroHighlights}>
          <article className={`${styles.heroHighlight} ${styles.heroHighlightAccent}`}>
            <p className={styles.heroHighlightEyebrow}>Headline fixture</p>
            <h2 className={styles.heroHighlightTitle}>
              {featureMatch
                ? `${featureMatch.homeTeam} vs ${featureMatch.awayTeam}`
                : headlineEvent?.title ?? "Center court fixture"}
            </h2>
            <p className={styles.heroHighlightText}>
              {featureMatch
                ? `${featureMatch.sport} / ${featureMatch.venue}`
                : headlineEvent?.summary ?? "University teams on the main stage."}
            </p>
            <div className={styles.heroHighlightMeta}>
              <span>
                {featureMatch
                  ? formatDateTime(featureMatch.startsAt)
                  : headlineEvent
                    ? formatDateTime(headlineEvent.start)
                    : "Today"}
              </span>
              <span>{featureMatch?.status ?? "Fixture"}</span>
            </div>
          </article>

          <article className={`${styles.heroHighlight} ${styles.heroHighlightCool}`}>
            <p className={styles.heroHighlightEyebrow}>Opening ceremony</p>
            <h2 className={styles.heroHighlightTitle}>
              {headlineEvent ? headlineEvent.title : "Opening Rally"}
            </h2>
            <p className={styles.heroHighlightText}>
              {headlineEvent
                ? `${headlineEvent.sport} / ${headlineEvent.venue}`
                : "March past, flag walk-ins, and the first crowd swell on the main court."}
            </p>
            <div className={styles.heroHighlightTags}>
              <span className={styles.heroHighlightTag}>
                {headlineEvent ? formatDateTime(headlineEvent.start) : "10 Apr"}
              </span>
              <span className={styles.heroHighlightTag}>
                {headlineGallery?.title ?? "Flare cam live"}
              </span>
            </div>
          </article>
        </div>
      </ParallaxScene>

      <section className={styles.sportsSection}>
        <SectionHeading
          eyebrow="Categories"
          text="Browse competitions by category and jump straight into your preferred arena." 
          title="Choose your battleground."
        />

        <div className={styles.categoryGrid}>
          <article className={styles.categoryPanel}>
            <div className={styles.categoryPanelHead}>
              <span className={styles.categoryBadge}>Sports</span>
              <h3 className={styles.categoryTitle}>Classic Sports</h3>
              <p className={styles.categoryText}>
                Court, field, and strategy-heavy games across indoor and outdoor arenas.
              </p>
            </div>

            <div className={styles.sportRail}>
              {arenaSports.map((sport, index) => (
                <Link
                  className={styles.gameLinkReset}
                  href={registrationUrl}
                  key={`sport-${sport.id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <SportHighlightTile
                    accent={sport.accent}
                    className=""
                    imageUrl={sport.imageUrl}
                    label="UDGAM sport"
                    meta="Sports"
                    pattern={tilePatterns[index % tilePatterns.length]}
                    text={sport.tagline}
                    title={sport.name}
                  />
                </Link>
              ))}
            </div>
          </article>

          <article className={styles.categoryPanel}>
            <div className={styles.categoryPanelHead}>
              <span className={`${styles.categoryBadge} ${styles.categoryBadgeEsports}`}>
                Esports
              </span>
              <h3 className={styles.categoryTitle}>Digital Arenas</h3>
              <p className={styles.categoryText}>
                Tactical shooters and battle royale titles built for quick comms and precision plays.
              </p>
            </div>

            <div className={styles.sportRail}>
              {esportsSports.map((sport, index) => (
                <Link
                  className={styles.gameLinkReset}
                  href={registrationUrl}
                  key={`esport-${sport.id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <SportHighlightTile
                    accent={sport.accent}
                    className=""
                    imageUrl={sport.imageUrl}
                    label="UDGAM esports"
                    meta="Esports"
                    pattern={tilePatterns[index % tilePatterns.length]}
                    text={sport.tagline}
                    title={sport.name}
                  />
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className={styles.sportSpotlightSection}>
        <SectionHeading
          eyebrow="Spotlight"
          text="Top picks from both categories so every visitor quickly finds their format."
          title="Featured across Sports and Esports."
        />

        <div className={styles.spotlightGrid}>
          {categorySpotlights.map((sport) => (
            <Link
              className={styles.spotlightCard}
              href={registrationUrl}
              key={`spot-${sport.id}`}
              rel="noopener noreferrer"
              style={{ "--spot-accent": sport.accent } as CSSProperties}
              target="_blank"
            >
              {sport.imageUrl ? (
                <div
                  aria-hidden="true"
                  className={styles.spotlightImage}
                  style={{ backgroundImage: `url(${sport.imageUrl})` } as CSSProperties}
                />
              ) : null}
              <div className={styles.spotlightShade} aria-hidden="true" />
              <span className={styles.spotlightKicker}>{sport.label}</span>
              <h3 className={styles.spotlightTitle}>{sport.name}</h3>
              <p className={styles.spotlightText}>{sport.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.scheduleSection}>
        <SectionHeading
          action={
            <Link className={siteStyles.secondaryLight} href="/schedule">
              Full schedule
            </Link>
          }
          eyebrow="Schedule"
          text="Track match timings, venue slots, and event flow for each day of UDGAM 2026."
          title="Plan your sports day."
        />

        <div className={styles.scheduleFlow}>
          {schedule.slice(0, 4).map((entry, index) => (
            <article className={styles.scheduleRow} key={entry.id}>
              <span className={styles.scheduleIndex}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className={styles.scheduleContent}>
                <span className={styles.scheduleType}>{entry.type}</span>
                <p className={styles.scheduleTitle}>{entry.title}</p>
                <p className={styles.scheduleDetail}>{entry.detail}</p>
              </div>
              <span className={styles.scheduleTime}>{formatDateTime(entry.time)}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.finalSection}>
        <div className={`${styles.finalGlow} ${styles.layerSlow}`} />

        <div className={styles.finalCopy}>
          <span className={styles.finalBadge}>UDGAM 2026 live</span>
          <h2 className={styles.finalTitle}>Everything set for game day.</h2>
          <p className={styles.finalText}>
            Join SRM University-AP's flagship sports fest, register your committee,
            and stay tuned for fixtures, results, and matchday announcements.
          </p>
        </div>

        <div className={styles.finalActions}>
          <Link
            className={siteStyles.primaryButton}
            href={registrationUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Register now
          </Link>
          <Link className={siteStyles.secondaryLight} href="/updates">
            Latest updates
          </Link>
        </div>
      </section>
    </div>
  );
}
