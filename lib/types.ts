export type MatchStatus =
  | "SCHEDULED"
  | "LIVE"
  | "PAUSED"
  | "HALFTIME"
  | "FINAL";

export type ContentPostType = "BLOG" | "NEWS";
export type RegistrationCategory = "COMMITTEE" | "EXECUTIVE";
export type CompetitionKind = "SPORT" | "ESPORT";
export type CompetitionDivision = "MEN" | "WOMEN" | "OPEN" | "MIXED";

export interface SportSummary {
  id: string;
  name: string;
  slug: string;
  accent: string;
  imageUrl: string | null;
  tagline: string;
}

export interface CompetitionSummary {
  id: string;
  title: string;
  slug: string;
  kind: CompetitionKind;
  sportName: string;
  division: CompetitionDivision;
  formatLabel: string | null;
  registrationFee: number;
  winnerPrize: number | null;
  runnerUpPrize: number | null;
  secondRunnerUpPrize: number | null;
  displayOrder: number;
}

export interface TeamSummary {
  id: string;
  name: string;
  slug: string;
  shortName: string;
  institution: string;
  sportId: string | null;
  sportName: string;
}

export interface ContentPostSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  type: ContentPostType;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  sportName: string | null;
  authorName: string | null;
}

export interface EventSummary {
  id: string;
  title: string;
  sport: string;
  start: string;
  venue: string;
  summary: string;
}

export interface LiveMatch {
  id: string;
  sport: string;
  eventTitle: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  startsAt: string;
  venue: string;
  featured: boolean;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  url: string;
  featured: boolean;
  createdAt: string;
}

export interface ScheduleEntry {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: "EVENT" | "MATCH";
}

export interface CommitteeRegistrationSummary {
  id: string;
  category: RegistrationCategory;
  title: string;
  headName: string;
  coHeadName: string;
  headEmail: string | null;
  headLinkedin: string | null;
  coHeadEmail: string | null;
  coHeadLinkedin: string | null;
  imageUrl: string;
  coHeadImageUrl: string | null;
  createdAt: string;
}

export interface DashboardSnapshot {
  matches: LiveMatch[];
  gallery: GalleryItem[];
  sports: SportSummary[];
  teams: TeamSummary[];
  posts: ContentPostSummary[];
  committeeRegistrations: CommitteeRegistrationSummary[];
  r2Configured: boolean;
  r2MaxUploadSizeMb: number;
  demoMode: boolean;
  adminHint: {
    email: string;
    password: string;
  } | null;
}

export interface CreateMatchInput {
  sportId?: string;
  sport?: string;
  eventTitle: string;
  homeTeamId?: string;
  awayTeamId?: string;
  homeTeam?: string;
  awayTeam?: string;
  venue: string;
  startsAt: string;
  status: MatchStatus;
  featured?: boolean;
}

export interface UpdateMatchInput {
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  featured: boolean;
}

export interface CreateGalleryImageInput {
  title: string;
  caption?: string;
  url: string;
  featured?: boolean;
  uploadedById?: string;
  r2Key?: string;
}

export interface CreateSportInput {
  name: string;
  accent?: string;
  imageUrl?: string;
  tagline?: string;
}

export interface UpdateSportInput {
  name: string;
  accent?: string;
  imageUrl?: string;
  tagline?: string;
}

export interface CreateTeamInput {
  name: string;
  shortName?: string;
  institution?: string;
  sportId?: string;
}

export interface CreateContentPostInput {
  type: ContentPostType;
  title: string;
  summary: string;
  body: string;
  sportId?: string;
  published?: boolean;
  authorId?: string;
}

export interface CreateCommitteeRegistrationInput {
  category: RegistrationCategory;
  title: string;
  headName: string;
  coHeadName: string;
  headEmail?: string;
  headLinkedin?: string;
  coHeadEmail?: string;
  coHeadLinkedin?: string;
  imageUrl: string;
  imageR2Key?: string;
  coHeadImageUrl?: string;
  coHeadImageR2Key?: string;
}

export interface UpdateCommitteeRegistrationInput {
  category: RegistrationCategory;
  title: string;
  headName: string;
  coHeadName: string;
  headEmail?: string;
  headLinkedin?: string;
  coHeadEmail?: string;
  coHeadLinkedin?: string;
  imageUrl?: string;
  imageR2Key?: string;
  coHeadImageUrl?: string;
  coHeadImageR2Key?: string;
}


