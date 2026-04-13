import { PageBanner } from "@/components/page-banner";

import styles from "@/app/subpage.module.css";

const champions = [
  {
    name: "Deepthi Jeevanji",
    role: "Para Olympian",
    highlight: "Gold medal in the women's 400m T20 event.",
  },
  {
    name: "Kunja Ranjitha",
    role: "Olympian",
    highlight: "Silver medal in women's triple jump with a mark of 13.17m.",
  },
  {
    name: "Mugada Sireesha",
    role: "Sprinter",
    highlight: "Represented India in women's 4x400m relay at Paris Olympics.",
  },
  {
    name: "Numair Shaik",
    role: "Badminton",
    highlight: "Ranked 7th nationally among top Indian junior players.",
  },
  {
    name: "Mallala Anusha Rushendra Tirupati",
    role: "Badminton",
    highlight: "Global ranking 765 among women badminton athletes.",
  },
  {
    name: "Jyothika Sri Dandi",
    role: "Athlete",
    highlight: "Gold in girls 400m at Khelo India Youth Games 2022 (56.07s).",
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <PageBanner
        chips={["SRM University-AP", "UDGAM 2026", "Sponsorship"]}
        description="UDGAM is a prestigious national-level sports fest by SRM University-AP, designed to unite athletes, campuses, and brand partners through competition and celebration."
        eyebrow="About UDGAM"
        title="UDGAM 2026 Partnership Profile"
      />

      <div className={styles.gridThree}>
        <article className={styles.card}>
          <p className={styles.eyebrow}>Festival identity</p>
          <h2 className={styles.title}>SRM University-AP's sports celebration.</h2>
          <p className={styles.text}>
            UDGAM brings students, athletes, and supporters together through
            high-energy fixtures, crowd support, and university pride.
          </p>
        </article>
        <article className={styles.card}>
          <p className={styles.eyebrow}>Campus address</p>
          <h2 className={styles.title}>SRM University-AP, Amaravati Campus.</h2>
          <p className={styles.text}>
            Mangalagiri Mandal, Neerukonda, Amaravathi, Andhra Pradesh - 522502.
          </p>
        </article>
        <article className={styles.card}>
          <p className={styles.eyebrow}>Table of contents</p>
          <h2 className={styles.title}>What this page covers.</h2>
          <p className={styles.text}>
            About UDGAM, partnership value, team profile, audience insights,
            sponsorship deliveries, brand offers, champions, and contact details.
          </p>
        </article>
      </div>

      <section className={styles.catalogSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionCopy}>
            <p className={styles.sectionEyebrow}>About UDGAM</p>
            <h2 className={styles.sectionTitle}>A national sports stage for student athletes.</h2>
            <p className={styles.sectionText}>
              UDGAM is organized by SRM University-AP and has inspired athletes and sports
              enthusiasts for the past 3 years. Scheduled for April 8, 9, and 10, the fest
              hosts team sports, individual competitions, interactive sessions, and cultural
              festivities in one high-energy campus experience.
            </p>
          </div>
        </div>

        <div className={styles.gridThree}>
          <article className={styles.darkCard}>
            <p className={styles.darkEyebrow}>Sports council</p>
            <h3 className={styles.title}>Dynamic student body since 2021.</h3>
            <p className={styles.darkText}>
              Established under the Directorate of Sports, the Sports Council drives sporting
              culture and physical fitness while creating an inclusive environment for all.
            </p>
          </article>
          <article className={styles.card}>
            <p className={styles.eyebrow}>Event scale</p>
            <h3 className={styles.title}>30+ sports events and 25+ stalls.</h3>
            <p className={styles.text}>
              UDGAM blends competition, teamwork, and campus celebration with broad participation.
            </p>
          </article>
          <article className={styles.card}>
            <p className={styles.eyebrow}>Audience energy</p>
            <h3 className={styles.title}>Sport, culture, and pro night buzz.</h3>
            <p className={styles.text}>
              The event atmosphere is built around intense matches, spectator engagement,
              and youth-led community momentum.
            </p>
          </article>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionCopy}>
            <p className={styles.sectionEyebrow}>Why Partner With Us</p>
            <h2 className={styles.sectionTitle}>Meaningful visibility with youth impact.</h2>
          </div>
        </div>

        <div className={styles.gridTwo}>
          <article className={styles.card}>
            <p className={styles.eyebrow}>Partnership advantages</p>
            <h3 className={styles.title}>Four practical benefits.</h3>
            <p className={styles.text}>1. Strong brand visibility across banners, posters, brochures, and promotions.</p>
            <p className={styles.text}>2. Direct access to students, athletes, and a high-energy campus audience.</p>
            <p className={styles.text}>3. Positive brand image through association with health, teamwork, and youth development.</p>
            <p className={styles.text}>4. On-ground presence via standees, promotional assets, and activity zones.</p>
          </article>
          <article className={styles.darkCard}>
            <p className={styles.darkEyebrow}>Audience profile</p>
            <h3 className={styles.title}>From 7000+ to expected 9000+ attendees.</h3>
            <p className={styles.darkText}>Age group: 17-24 | Gender ratio: 46% female, 54% male.</p>
            <p className={styles.darkText}>Audience mix: 77% SRM and 23% non-SRM across South India.</p>
            <p className={styles.darkText}>Digitally connected youth with strong interest in sports, fitness, and campus events.</p>
          </article>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionCopy}>
            <p className={styles.sectionEyebrow}>Sponsorship Deliveries</p>
            <h2 className={styles.sectionTitle}>Cross-channel deliverables for sponsor tiers.</h2>
            <p className={styles.sectionText}>
              Stage scrolling, LCD screens, standees, on-campus digitals, social media promos,
              social exclusives, after movie credits, website presence, event branding, and VIP access.
            </p>
          </div>
        </div>

        <div className={styles.gridThree}>
          <article className={styles.card}>
            <p className={styles.eyebrow}>Title sponsor</p>
            <h3 className={styles.title}>Maximum visibility and stage-time.</h3>
            <p className={styles.text}>
              Includes dedicated stall, 1-minute title pitch, and premium exposure across major touchpoints.
            </p>
          </article>
          <article className={styles.card}>
            <p className={styles.eyebrow}>Co-sponsor</p>
            <h3 className={styles.title}>High impact, broad reach.</h3>
            <p className={styles.text}>
              Strong digital + on-ground integration with event-level brand placements and teasers.
            </p>
          </article>
          <article className={styles.darkCard}>
            <p className={styles.darkEyebrow}>Brand partnership offers</p>
            <h3 className={styles.title}>Flexible sponsorship options.</h3>
            <p className={styles.darkText}>Title Sponsor: 3.5L | Executive Prime Co-Sponsor: 2L | Associate Sponsor: 1.5L</p>
            <p className={styles.darkText}>Service partnerships at 1L each: accommodation, travel, equipment, refreshments, photography, banking, medical, and others.</p>
          </article>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionCopy}>
            <p className={styles.sectionEyebrow}>Our Champions</p>
            <h2 className={styles.sectionTitle}>Athletes who represent UDGAM excellence.</h2>
          </div>
        </div>

        <div className={styles.gridThree}>
          {champions.map((champion) => (
            <article className={styles.card} key={champion.name}>
              <p className={styles.eyebrow}>{champion.role}</p>
              <h3 className={styles.title}>{champion.name}</h3>
              <p className={styles.text}>{champion.highlight}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionCopy}>
            <p className={styles.sectionEyebrow}>Contact Us</p>
            <h2 className={styles.sectionTitle}>Let's build a meaningful collaboration.</h2>
            <p className={styles.sectionText}>
              Thank you for reviewing our proposal. We value your interest and look forward to a
              mutually beneficial partnership with UDGAM 2026.
            </p>
          </div>
        </div>

        <div className={styles.gridTwo}>
          <article className={styles.darkCard}>
            <p className={styles.darkEyebrow}>Sponsorship contacts</p>
            <h3 className={styles.title}>Core coordinators</h3>
            <p className={styles.darkText}>Sponsorship Head: Chinmaya Baki - 8096299900</p>
            <p className={styles.darkText}>Sponsorship Co-Head: Varun - 9618522029</p>
            <p className={styles.darkText}>Secretary: Jaswanth Reddy - 9133988793</p>
            <p className={styles.darkText}>Executive: Pradnish - 8688754749</p>
          </article>
          <article className={styles.card}>
            <p className={styles.eyebrow}>Official channels</p>
            <h3 className={styles.title}>Connect with UDGAM</h3>
            <p className={styles.text}>Email: sports.council@srmap.edu.in</p>
            <p className={styles.text}>Instagram: @udgam.srmuap</p>
            <p className={styles.text}>Venue: SRM University-AP, Amaravati Campus</p>
          </article>
        </div>
      </section>
    </div>
  );
}
