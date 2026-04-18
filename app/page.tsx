import Link from "next/link";
import { Zen_Tokyo_Zoo } from "next/font/google";
import type { CSSProperties } from "react";

import { HeroBackgroundCarousel } from "@/components/public/hero-background-carousel";
import { LiveGalleryRail } from "@/components/live/live-gallery-rail";
import { LiveScoreBoard } from "@/components/live/live-score-board";
import { SectionHeading } from "@/components/section-heading";
import { ParallaxScene } from "@/components/public/parallax-scene";
import { SportHighlightTile } from "@/components/public/sport-highlight-tile";
import siteStyles from "@/components/site.module.css";
import {
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
  ScheduleEntry,
  SportSummary,
} from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

import styles from "@/app/page.module.css";

export const dynamic = "force-dynamic";

const tilePatterns = ["grid", "rings", "ticks", "diagonal"] as const;
const registrationUrl = "https://payment.collexo.com/pay-fee/srm-ap-events";

const landingDisplayFont = Zen_Tokyo_Zoo({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-landing-display",
});

export default async function HomePage() {
  const [sports, events, featuredMatches, featuredImages, schedule]: [
    SportSummary[],
    EventSummary[],
    LiveMatch[],
    GalleryItem[],
    ScheduleEntry[],
  ] = await Promise.all([
    getSports(),
    getEvents(),
    getMatches({ featuredOnly: true }),
    getGalleryImages({ featuredOnly: true }),
    getScheduleEntries(),
  ]);

  const featureMatch = featuredMatches[0];
  const headlineEvent = events[0];
  const headlineGallery = featuredImages[0];
  const preLiveSports = sports.slice(0, 4);
  const nextScheduleEntry = schedule[0];
  const activeLiveCount = featuredMatches.filter((match) => match.status !== "SCHEDULED").length;
  const spotlightSports = sports.slice(0, 3);
  const imageReadySportCount = sports.filter((sport) => Boolean(sport.imageUrl)).length;
  const esportsCount = sports.filter((sport) =>
    /bgmi|free fire|valorant|chess/i.test(sport.name),
  ).length;
  const arenaSportsCount = Math.max(sports.length - esportsCount, 0);

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

      <section className={styles.preLiveSection}>
        <div className={styles.preLiveShell}>
          <article className={styles.preLiveLead}>
            <span className={styles.preLiveLeadBadge}>Pre-live arena</span>
            <h2 className={styles.preLiveLeadTitle}>Countdown to first whistle.</h2>
            <p className={styles.preLiveLeadText}>
              Scan the next sports wave, lock your route, and jump into live fixtures as soon as
              match windows open.
            </p>

            <div className={styles.preLiveLeadMeta}>
              <span>{nextScheduleEntry ? nextScheduleEntry.title : "Main stage fixtures"}</span>
              <span>
                {nextScheduleEntry
                  ? formatDateTime(nextScheduleEntry.time)
                  : headlineEvent
                    ? formatDateTime(headlineEvent.start)
                    : "Today"}
              </span>
            </div>

            <div className={styles.preLiveMetricGrid}>
              <div className={styles.preLiveMetric}>
                <span className={styles.preLiveMetricLabel}>Sports in queue</span>
                <span className={styles.preLiveMetricValue}>{sports.length}</span>
              </div>
              <div className={styles.preLiveMetric}>
                <span className={styles.preLiveMetricLabel}>Active matches</span>
                <span className={styles.preLiveMetricValue}>{activeLiveCount}</span>
              </div>
            </div>
          </article>

          <div className={styles.preLiveRail}>
            {preLiveSports.map((sport, index) => (
              <article
                className={styles.preLiveCard}
                key={`prelive-${sport.id}`}
                style={{ "--prelive-accent": sport.accent } as CSSProperties}
              >
                {sport.imageUrl ? (
                  <div
                    aria-hidden="true"
                    className={styles.preLiveImage}
                    style={{ backgroundImage: `url(${sport.imageUrl})` } as CSSProperties}
                  />
                ) : null}
                <div className={styles.preLiveShade} aria-hidden="true" />
                <span className={styles.preLiveIndex}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className={styles.preLiveTitle}>{sport.name}</h3>
                <p className={styles.preLiveText}>{sport.tagline}</p>
                <span className={styles.preLiveTag}>Arena lane {index + 1}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.liveSection}>
        <div className={styles.liveSectionTop}>
          <div className={styles.liveHeadingShell}>
            <SectionHeading
              eyebrow="Live sports"
              text="Follow ongoing fixtures, scorelines, and key match moments across venues."
              title="Matchday highlights."
            />
          </div>

          <div className={styles.routeGrid}>
            {schedule.slice(0, 2).map((entry) => (
              <article className={styles.routeCard} key={entry.id}>
                <div className={styles.routeCardTop}>
                  <span className={styles.routeType}>{entry.type}</span>
                  <span className={styles.routeMeta}>{formatDateTime(entry.time)}</span>
                </div>
                <span className={styles.routeTitle}>{entry.title}</span>
                <span className={styles.routeDetail}>{entry.detail}</span>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.liveSplit}>
          <div className={styles.livePanel}>
            <LiveScoreBoard compact initialMatches={featuredMatches} />
          </div>

          <div className={styles.livePanel}>
            <div className={styles.galleryLead}>
              <span className={styles.galleryLeadEyebrow}>Live gallery</span>
              <h3 className={styles.galleryLeadTitle}>Ground cuts.</h3>
              <p className={styles.galleryLeadText}>Warmups, moments, final whistles.</p>
            </div>

            <LiveGalleryRail compact initialImages={featuredImages} />
          </div>
        </div>
      </section>

      <section className={styles.sportsSection}>
        <SectionHeading
          eyebrow="Sports"
          text="Indoor sports, outdoor contests, and e-sports all come together under one festival." 
          title="Compete across every arena."
        />

        <div className={styles.sportRail}>
          {sports.map((sport, index) => (
            <SportHighlightTile
              accent={sport.accent}
              className=""
              imageUrl={sport.imageUrl}
              key={sport.id}
              label="UDGAM sport"
              pattern={tilePatterns[index % tilePatterns.length]}
              text={sport.tagline}
              title={sport.name}
            />
          ))}
        </div>
      </section>

      <section className={styles.sportSpotlightSection}>
        <SectionHeading
          eyebrow="Spotlight"
          text="Big disciplines, loud matchups, and crowd-favorite arenas shaping this season."
          title="Featured sports right now."
        />

        <div className={styles.spotlightGrid}>
          {spotlightSports.map((sport) => (
            <article
              className={styles.spotlightCard}
              key={`spot-${sport.id}`}
              style={{ "--spot-accent": sport.accent } as CSSProperties}
            >
              {sport.imageUrl ? (
                <div
                  aria-hidden="true"
                  className={styles.spotlightImage}
                  style={{ backgroundImage: `url(${sport.imageUrl})` } as CSSProperties}
                />
              ) : null}
              <div className={styles.spotlightShade} aria-hidden="true" />
              <span className={styles.spotlightKicker}>UDGAM spotlight</span>
              <h3 className={styles.spotlightTitle}>{sport.name}</h3>
              <p className={styles.spotlightText}>{sport.tagline}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.sportStatsSection}>
        <SectionHeading
          eyebrow="Sports Pulse"
          text="A quick pulse check of the competition roster currently live in your data feed."
          title="Festival sports at a glance."
        />

        <div className={styles.sportStatsGrid}>
          <article className={styles.sportStatCard}>
            <span className={styles.sportStatLabel}>Total sports</span>
            <span className={styles.sportStatValue}>{sports.length}</span>
          </article>
          <article className={styles.sportStatCard}>
            <span className={styles.sportStatLabel}>With gallery image</span>
            <span className={styles.sportStatValue}>{imageReadySportCount}</span>
          </article>
          <article className={styles.sportStatCard}>
            <span className={styles.sportStatLabel}>Arena sports</span>
            <span className={styles.sportStatValue}>{arenaSportsCount}</span>
          </article>
          <article className={styles.sportStatCard}>
            <span className={styles.sportStatLabel}>E-sports + mind games</span>
            <span className={styles.sportStatValue}>{esportsCount}</span>
          </article>
        </div>

        <div className={styles.sportNameRail}>
          {sports.map((sport) => (
            <span className={styles.sportNamePill} key={`pill-${sport.id}`}>
              {sport.name}
            </span>
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
