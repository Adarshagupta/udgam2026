import Link from "next/link";
import { Zen_Tokyo_Zoo } from "next/font/google";

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
  const sportCount = sports.length;
  const eventCount = events.length;
  const featuredMatchCount = featuredMatches.length;

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
                The university sports festival with live scores, packed venues, and
                nonstop campus energy.
              </p>
            </div>

            <div className={styles.heroActions}>
              <Link className={siteStyles.primaryButton} href="/register/committee">
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

      <section className={styles.pulseStrip} aria-label="UDGAM quick info">
        <article className={styles.pulseCard}>
          <span className={styles.pulseLabel}>Dates</span>
          <h2 className={styles.pulseValue}>22-25 April 2026</h2>
          <p className={styles.pulseText}>Three days of league play, knockouts, and finals.</p>
        </article>

        <article className={styles.pulseCard}>
          <span className={styles.pulseLabel}>Scale</span>
          <h2 className={styles.pulseValue}>
            {sportCount > 0 ? `${sportCount} sports` : "Multi-sport campus festival"}
          </h2>
          <p className={styles.pulseText}>
            {eventCount > 0
              ? `${eventCount} programmed events with live updates throughout the day.`
              : "Events, showdowns, and crowd-ready matchday blocks."}
          </p>
        </article>

        <article className={styles.pulseCard}>
          <span className={styles.pulseLabel}>Action</span>
          <h2 className={styles.pulseValue}>
            {featuredMatchCount > 0 ? `${featuredMatchCount} featured live` : "Live desk active"}
          </h2>
          <p className={styles.pulseText}>
            Registrations, scores, and announcements are now live for UDGAM 2026.
          </p>
        </article>
      </section>

      <section className={styles.liveSection}>
        <div className={styles.liveSectionTop}>
          <div className={styles.liveHeadingShell}>
            <SectionHeading
              eyebrow="Live control"
              text="Scores, updates, and next calls from every active venue."
              title="Matchday command center."
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
          text="From quick-court battles to long-form finals, each format has its own rhythm."
          title="Choose your battleground."
        />

        <div className={styles.sportGrid}>
          {sports.map((sport, index) => (
            <SportHighlightTile
              accent={sport.accent}
              className=""
              key={sport.id}
              label="UDGAM sport"
              pattern={tilePatterns[index % tilePatterns.length]}
              text={sport.tagline}
              title={sport.name}
            />
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
          text="Track what starts next and where to be before kickoff."
          title="Plan your UDGAM run."
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
            Register your team, follow fixtures in real time, and stay locked in for
            announcements, media drops, and final results.
          </p>
        </div>

        <div className={styles.finalActions}>
          <Link className={siteStyles.primaryButton} href="/register/committee">
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
