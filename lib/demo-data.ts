import { hashSync } from "bcryptjs";

import type {
  CommitteeRegistrationSummary,
  ContentPostSummary,
  EventSummary,
  GalleryItem,
  LiveMatch,
  SportSummary,
  TeamSummary,
} from "@/lib/types";
import { asDataUri } from "@/lib/utils";

const DEMO_ADMIN_EMAIL = "organizer@udgam.live";
const DEMO_ADMIN_PASSWORD = "udgam-admin";
const DEMO_STORE_VERSION = "slayer-inspired-v3";

interface DemoAdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  passwordHash: string;
}

interface DemoStore {
  sports: SportSummary[];
  teams: TeamSummary[];
  events: EventSummary[];
  matches: LiveMatch[];
  gallery: GalleryItem[];
  posts: ContentPostSummary[];
  committeeRegistrations: CommitteeRegistrationSummary[];
  admins: DemoAdminUser[];
}

declare global {
  var __udgamDemoStore: DemoStore | undefined;
  var __udgamDemoStoreVersion: string | undefined;
}

function makePoster(label: string, accent: string, sublabel: string) {
  return asDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 720">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#0d1218" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
        <linearGradient id="sunLine" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stop-color="#f4eee6" />
          <stop offset="100%" stop-color="#ebb04a" />
        </linearGradient>
        <pattern id="check" width="96" height="96" patternUnits="userSpaceOnUse">
          <rect width="96" height="96" fill="transparent" />
          <rect width="48" height="48" fill="rgba(244,238,230,0.05)" />
          <rect x="48" y="48" width="48" height="48" fill="rgba(244,238,230,0.05)" />
        </pattern>
        <pattern id="water" width="160" height="120" patternUnits="userSpaceOnUse">
          <path d="M0 80 C30 40 70 40 100 80 S170 120 200 80" fill="none" stroke="rgba(28,167,154,0.16)" stroke-width="8" />
          <path d="M-20 110 C20 70 70 70 110 110 S190 150 230 110" fill="none" stroke="rgba(244,238,230,0.08)" stroke-width="6" />
        </pattern>
        <pattern id="slash" width="42" height="42" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
          <rect width="40" height="40" fill="transparent" />
          <rect width="8" height="40" fill="rgba(244,238,230,0.04)" />
        </pattern>
      </defs>
      <rect width="960" height="720" rx="42" fill="url(#bg)" />
      <rect width="960" height="720" rx="42" fill="url(#water)" />
      <rect width="960" height="720" rx="42" fill="url(#check)" />
      <rect width="960" height="720" rx="42" fill="url(#slash)" />
      <rect width="960" height="720" rx="42" fill="none" stroke="rgba(215,240,238,0.14)" stroke-width="4" />
      <circle cx="784" cy="158" r="148" fill="rgba(235,176,74,0.14)" />
      <circle cx="774" cy="486" r="184" fill="rgba(28,167,154,0.12)" />
      <path d="M728 42 L928 42 L928 142" fill="none" stroke="rgba(244,238,230,0.24)" stroke-width="4" />
      <path d="M0 582 L960 582" stroke="rgba(244,238,230,0.08)" stroke-width="2" opacity="0.6" />
      <path d="M0 128 L960 128" stroke="url(#sunLine)" stroke-width="4" opacity="0.75" />
      <rect x="70" y="92" width="220" height="42" rx="21" fill="#f4eee6" opacity="0.96" />
      <text x="96" y="120" fill="#131821" font-family="Arial Black, Arial" font-size="22">UDGAM LIVE</text>
      <text x="70" y="282" fill="#f4eee6" font-family="Arial Black, Arial" font-size="88" letter-spacing="2">${label}</text>
      <text x="74" y="338" fill="#f4eee6" font-family="Arial" font-size="30" opacity="0.9">${sublabel}</text>
      <text x="72" y="398" fill="#ebb04a" font-family="Arial Black, Arial" font-size="24" letter-spacing="9">SPORTS ARC</text>
      <rect x="72" y="444" width="260" height="186" rx="28" fill="rgba(244,238,230,0.08)" stroke="rgba(215,240,238,0.18)" />
      <path d="M110 532 C146 468 238 456 312 468" fill="none" stroke="#f4eee6" stroke-width="10" stroke-linecap="round" />
      <path d="M98 578 C172 498 230 470 324 486" fill="none" stroke="#1ca79a" stroke-width="6" stroke-linecap="round" opacity="0.9" />
      <circle cx="206" cy="556" r="68" fill="rgba(244,238,230,0.1)" stroke="#f4eee6" stroke-width="6" />
      <path d="M470 240 L878 240" stroke="rgba(244,238,230,0.12)" stroke-width="2" />
      <path d="M510 280 L918 280" stroke="rgba(244,238,230,0.1)" stroke-width="2" />
      <path d="M548 320 L932 320" stroke="rgba(244,238,230,0.1)" stroke-width="2" />
    </svg>
  `);
}

function buildDemoStore(): DemoStore {
  return {
    sports: [
      {
        id: "sport-basketball",
        name: "Basketball",
        slug: "basketball",
        accent: "#1ca79a",
        tagline: "Sharp drives, bright cuts, and full-court rhythm.",
      },
      {
        id: "sport-football",
        name: "Football",
        slug: "football",
        accent: "#df4f3e",
        tagline: "Flare-fast counters and one loud final whistle.",
      },
      {
        id: "sport-badminton",
        name: "Badminton",
        slug: "badminton",
        accent: "#ebb04a",
        tagline: "Quick hands, light feet, zero hesitation.",
      },
      {
        id: "sport-volleyball",
        name: "Volleyball",
        slug: "volleyball",
        accent: "#7c6cf2",
        tagline: "High arcs, hard blocks, and clean last-point drama.",
      },
    ],
    teams: [
      {
        id: "team-falcon-house",
        name: "Falcon House",
        slug: "falcon-house",
        shortName: "FAL",
        institution: "UDGAM University",
        sportId: "sport-basketball",
        sportName: "Basketball",
      },
      {
        id: "team-blaze-unit",
        name: "Blaze Unit",
        slug: "blaze-unit",
        shortName: "BLZ",
        institution: "UDGAM University",
        sportId: "sport-basketball",
        sportName: "Basketball",
      },
      {
        id: "team-river-strikers",
        name: "River Strikers",
        slug: "river-strikers",
        shortName: "RIV",
        institution: "UDGAM University",
        sportId: "sport-football",
        sportName: "Football",
      },
      {
        id: "team-nova-eleven",
        name: "Nova Eleven",
        slug: "nova-eleven",
        shortName: "NOV",
        institution: "UDGAM University",
        sportId: "sport-football",
        sportName: "Football",
      },
      {
        id: "team-feather-force",
        name: "Feather Force",
        slug: "feather-force",
        shortName: "FFT",
        institution: "UDGAM University",
        sportId: "sport-badminton",
        sportName: "Badminton",
      },
      {
        id: "team-rapid-flick",
        name: "Rapid Flick",
        slug: "rapid-flick",
        shortName: "RFL",
        institution: "UDGAM University",
        sportId: "sport-badminton",
        sportName: "Badminton",
      },
    ],
    events: [
      {
        id: "event-opening",
        title: "Opening Pulse",
        sport: "Campus Parade",
        start: "2026-04-10T09:00:00.000Z",
        venue: "Main Court",
        summary: "Flag walk-ins, anthem energy, and the first fixture call on the main court.",
      },
      {
        id: "event-3x3",
        title: "3x3 Clash",
        sport: "Basketball",
        start: "2026-04-10T13:30:00.000Z",
        venue: "Arena A",
        summary: "Compact games, quick rotations, and highlight-worthy final possessions.",
      },
      {
        id: "event-night",
        title: "Night Finals",
        sport: "Football",
        start: "2026-04-11T14:00:00.000Z",
        venue: "Floodlight Turf",
        summary: "A floodlit showdown for the loudest crowd of the weekend.",
      },
      {
        id: "event-ceremony",
        title: "Final Glow",
        sport: "Award Deck",
        start: "2026-04-12T16:00:00.000Z",
        venue: "UDGAM Stage",
        summary: "Final medals, closing lights, and one last crowd swell before lights out.",
      },
    ],
    matches: [
      {
        id: "match-001",
        sport: "Basketball",
        eventTitle: "3x3 Clash",
        homeTeam: "Falcon House",
        awayTeam: "Blaze Unit",
        homeScore: 56,
        awayScore: 52,
        status: "LIVE",
        startsAt: "2026-04-10T13:30:00.000Z",
        venue: "Arena A",
        featured: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "match-002",
        sport: "Football",
        eventTitle: "Night Finals",
        homeTeam: "River Strikers",
        awayTeam: "Nova Eleven",
        homeScore: 2,
        awayScore: 1,
        status: "HALFTIME",
        startsAt: "2026-04-11T14:00:00.000Z",
        venue: "Floodlight Turf",
        featured: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "match-003",
        sport: "Badminton",
        eventTitle: "Precision Set",
        homeTeam: "Feather Force",
        awayTeam: "Rapid Flick",
        homeScore: 17,
        awayScore: 20,
        status: "LIVE",
        startsAt: "2026-04-10T10:15:00.000Z",
        venue: "Hall B",
        featured: false,
        updatedAt: new Date().toISOString(),
      },
    ],
    gallery: [
      {
        id: "gallery-001",
        title: "Court Tide",
        caption: "Players take the court before the crowd settles in.",
        url: makePoster("TIDE", "#1ca79a", "Warmup sequence"),
        featured: true,
        createdAt: "2026-04-09T18:20:00.000Z",
      },
      {
        id: "gallery-002",
        title: "Flame Rush",
        caption: "Floodlights, red kits, and one fast counter under pressure.",
        url: makePoster("RUSH", "#df4f3e", "Night final frame"),
        featured: true,
        createdAt: "2026-04-10T20:10:00.000Z",
      },
      {
        id: "gallery-003",
        title: "Sun Arc",
        caption: "High-speed exchanges with bright pace and clean timing.",
        url: makePoster("ARC", "#ebb04a", "Indoor court energy"),
        featured: false,
        createdAt: "2026-04-10T11:05:00.000Z",
      },
    ],
    committeeRegistrations: [
      {
        id: "committee-reg-001",
        category: "COMMITTEE",
        title: "Cultural Committee",
        headName: "Aanya Mehta",
        coHeadName: "Rohan Suri",
        imageUrl: makePoster("CULTURAL", "#df4f3e", "Committee desk registration"),
        createdAt: new Date().toISOString(),
      },
      {
        id: "committee-reg-002",
        category: "EXECUTIVE",
        title: "Executive Operations",
        headName: "Diya Shah",
        coHeadName: "Kabir Nair",
        imageUrl: makePoster("EXECUTIVE", "#1ca79a", "Executive lead registration"),
        createdAt: new Date().toISOString(),
      },
    ],
    posts: [
      {
        id: "post-001",
        title: "Opening Ceremony Guide",
        slug: "opening-ceremony-guide",
        summary: "What teams, spectators, and volunteers should know before the first whistle.",
        body: "The opening ceremony begins with the campus parade, a short address from the organizing desk, and the first fixture callouts for each arena. Teams should report 30 minutes early to their assigned assembly zones.",
        type: "NEWS",
        published: true,
        publishedAt: "2026-04-09T16:00:00.000Z",
        createdAt: "2026-04-09T16:00:00.000Z",
        sportName: null,
        authorName: "UDGAM Control Desk",
      },
      {
        id: "post-002",
        title: "Behind the Basketball Desk",
        slug: "behind-the-basketball-desk",
        summary: "A quick look at how the live score team keeps the 3x3 court updated.",
        body: "The basketball desk runs with one spotter, one clock keeper, and one publishing operator. The team updates possessions, score swings, and final possessions directly from the admin desk so the public site stays current.",
        type: "BLOG",
        published: true,
        publishedAt: "2026-04-10T07:45:00.000Z",
        createdAt: "2026-04-10T07:45:00.000Z",
        sportName: "Basketball",
        authorName: "UDGAM Control Desk",
      },
      {
        id: "post-003",
        title: "Night Finals Traffic Plan",
        slug: "night-finals-traffic-plan",
        summary: "Entry gates, spectator lanes, and floodlight turf access for the evening block.",
        body: "The north and east gates open one hour before kickoff. Volunteers will route player squads directly to the warm-up zone, while spectators enter through the marked concourse and seating lanes.",
        type: "NEWS",
        published: false,
        publishedAt: null,
        createdAt: "2026-04-10T09:30:00.000Z",
        sportName: "Football",
        authorName: "UDGAM Control Desk",
      },
    ],
    admins: [
      {
        id: "admin-demo",
        email: DEMO_ADMIN_EMAIL,
        name: "UDGAM Control Desk",
        role: "ORGANIZER",
        passwordHash: hashSync(DEMO_ADMIN_PASSWORD, 10),
      },
    ],
  };
}

export function getDemoStore() {
  if (
    !globalThis.__udgamDemoStore ||
    globalThis.__udgamDemoStoreVersion !== DEMO_STORE_VERSION
  ) {
    globalThis.__udgamDemoStore = buildDemoStore();
    globalThis.__udgamDemoStoreVersion = DEMO_STORE_VERSION;
  }

  return globalThis.__udgamDemoStore;
}

export function getDemoAdminCredentials() {
  return {
    email: DEMO_ADMIN_EMAIL,
    password: DEMO_ADMIN_PASSWORD,
  };
}
