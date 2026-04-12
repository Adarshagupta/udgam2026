import { randomUUID } from "node:crypto";

import { MatchStatus, PostType } from "@prisma/client";

import { getAdminHint } from "@/lib/auth";
import { getDemoStore } from "@/lib/demo-data";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import type {
  CompetitionSummary,
  CommitteeRegistrationSummary,
  ContentPostSummary,
  CreateCommitteeRegistrationInput,
  CreateContentPostInput,
  CreateSportInput,
  CreateGalleryImageInput,
  CreateMatchInput,
  CreateTeamInput,
  DashboardSnapshot,
  EventSummary,
  GalleryItem,
  LiveMatch,
  ScheduleEntry,
  SportSummary,
  TeamSummary,
  UpdateCommitteeRegistrationInput,
  UpdateMatchInput,
  UpdateSportInput,
} from "@/lib/types";
import { slugify } from "@/lib/utils";

async function withReadFallback<T>(
  operation: () => Promise<T>,
  fallback: () => T | Promise<T>,
) {
  try {
    return await operation();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const errorCode =
      typeof error === "object" &&
      error &&
      "code" in error &&
      typeof error.code === "string"
        ? error.code
        : "";
    const isTransientConnectionIssue =
      errorCode === "P1017" ||
      message.includes("Server has closed the connection") ||
      message.includes("Connection terminated unexpectedly") ||
      message.includes("Can't reach database server") ||
      message.includes("ConnectionClosed");

    if (isTransientConnectionIssue) {
      await resetPrismaClient();

      try {
        return await operation();
      } catch (retryError) {
        if (env.demoMode) {
          return fallback();
        }

        throw retryError;
      }
    }

    if (env.demoMode) {
      return fallback();
    }

    throw error;
  }
}

function shouldUseDemoData() {
  return env.demoMode || !prisma;
}

function getDataErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isTransientWriteIssue(error: unknown) {
  const message = getDataErrorMessage(error);
  return (
    message.includes("Server has closed the connection") ||
    message.includes("Connection terminated unexpectedly") ||
    message.includes("Can't reach database server") ||
    message.includes("ConnectionClosed")
  );
}

function isSportImageSchemaDrift(error: unknown) {
  const message = getDataErrorMessage(error);
  return (
    message.includes("Unknown argument `imageUrl`") ||
    message.includes("Unknown field `imageUrl`") ||
    message.includes("Sport.imageUrl") ||
    message.includes("column") && message.includes("imageUrl")
  );
}

function toSportImageSchemaError() {
  return new Error(
    "Sport image support is out of sync locally. Restart the dev server, then run `npm run prisma:generate` and `npm run db:push`.",
  );
}

async function withWriteRecovery<T>(operation: () => Promise<T>) {
  try {
    return await operation();
  } catch (error) {
    if (isSportImageSchemaDrift(error)) {
      throw toSportImageSchemaError();
    }

    if (isTransientWriteIssue(error)) {
      throw new Error("Database connection dropped during save. Please retry once.");
    }

    throw error;
  }
}

async function buildAvailableSlug(
  value: string,
  exists: (slug: string) => Promise<boolean> | boolean,
) {
  const base = slugify(value) || `entry-${randomUUID().slice(0, 8)}`;
  let slug = base;
  let suffix = 2;

  while (await exists(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function mapMatch(match: {
  id: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  startsAt: Date;
  venue: string | null;
  featured: boolean;
  updatedAt: Date;
  sport: { name: string } | null;
  event: { title: string } | null;
  homeTeam: { name: string };
  awayTeam: { name: string };
}): LiveMatch {
  return {
    id: match.id,
    sport: match.sport?.name ?? "Sport",
    eventTitle: match.event?.title ?? "UDGAM Match",
    homeTeam: match.homeTeam.name,
    awayTeam: match.awayTeam.name,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    status: match.status,
    startsAt: match.startsAt.toISOString(),
    venue: match.venue ?? "Main Arena",
    featured: match.featured,
    updatedAt: match.updatedAt.toISOString(),
  };
}

function mapGallery(item: {
  id: string;
  title: string;
  caption: string | null;
  url: string;
  featured: boolean;
  createdAt: Date;
}): GalleryItem {
  return {
    id: item.id,
    title: item.title,
    caption: item.caption ?? "",
    url: item.url,
    featured: item.featured,
    createdAt: item.createdAt.toISOString(),
  };
}

function mapCommitteeRegistration(item: {
  id: string;
  category: "COMMITTEE" | "EXECUTIVE";
  title: string;
  headName: string;
  coHeadName: string;
  headEmail: string | null;
  headLinkedin: string | null;
  coHeadEmail: string | null;
  coHeadLinkedin: string | null;
  imageUrl: string;
  coHeadImageUrl: string | null;
  createdAt: Date;
}): CommitteeRegistrationSummary {
  return {
    id: item.id,
    category: item.category,
    title: item.title,
    headName: item.headName,
    coHeadName: item.coHeadName,
    headEmail: item.headEmail,
    headLinkedin: item.headLinkedin,
    coHeadEmail: item.coHeadEmail,
    coHeadLinkedin: item.coHeadLinkedin,
    imageUrl: item.imageUrl,
    coHeadImageUrl: item.coHeadImageUrl ?? item.imageUrl,
    createdAt: item.createdAt.toISOString(),
  };
}

function mapSport(sport: {
  id: string;
  name: string;
  slug: string;
  accentColor: string | null;
  imageUrl: string | null;
  tagline: string | null;
}): SportSummary {
  return {
    id: sport.id,
    name: sport.name,
    slug: sport.slug,
    accent: sport.accentColor ?? "#f35c38",
    tagline: sport.tagline ?? "Built for UDGAM pace.",
    imageUrl: sport.imageUrl ?? null,
  };
}

function mapCompetition(entry: {
  id: string;
  title: string;
  slug: string;
  kind: "SPORT" | "ESPORT";
  sportName: string;
  division: "MEN" | "WOMEN" | "OPEN" | "MIXED";
  formatLabel: string | null;
  registrationFee: number;
  winnerPrize: number | null;
  runnerUpPrize: number | null;
  secondRunnerUpPrize: number | null;
  displayOrder: number;
}): CompetitionSummary {
  return {
    id: entry.id,
    title: entry.title,
    slug: entry.slug,
    kind: entry.kind,
    sportName: entry.sportName,
    division: entry.division,
    formatLabel: entry.formatLabel,
    registrationFee: entry.registrationFee,
    winnerPrize: entry.winnerPrize,
    runnerUpPrize: entry.runnerUpPrize,
    secondRunnerUpPrize: entry.secondRunnerUpPrize,
    displayOrder: entry.displayOrder,
  };
}

function mapTeam(team: {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  institution: string | null;
  sportId: string | null;
  sport: { name: string } | null;
}): TeamSummary {
  return {
    id: team.id,
    name: team.name,
    slug: team.slug,
    shortName: team.shortName ?? team.name.slice(0, 3).toUpperCase(),
    institution: team.institution ?? "UDGAM",
    sportId: team.sportId,
    sportName: team.sport?.name ?? "Independent",
  };
}

function mapPost(post: {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  type: PostType;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  sport: { name: string } | null;
  author: { name: string } | null;
}): ContentPostSummary {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    body: post.body,
    type: post.type,
    published: post.published,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    createdAt: post.createdAt.toISOString(),
    sportName: post.sport?.name ?? null,
    authorName: post.author?.name ?? null,
  };
}

function sortMatches(matches: LiveMatch[]) {
  return [...matches].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

function getDemoMatches(featuredOnly = false) {
  const matches = sortMatches(getDemoStore().matches);
  return featuredOnly ? matches.filter((match) => match.featured) : matches;
}

function getDemoImages(featuredOnly = false) {
  const images = [...getDemoStore().gallery].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

  return featuredOnly ? images.filter((image) => image.featured) : images;
}

function getDemoCommitteeRegistrations() {
  return [...getDemoStore().committeeRegistrations].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function getDemoTeams() {
  return [...getDemoStore().teams].sort((left, right) => left.name.localeCompare(right.name));
}

function getDemoCompetitions() {
  return [...getDemoStore().competitions].sort(
    (left, right) => left.displayOrder - right.displayOrder,
  );
}

function getDemoPosts(options?: {
  type?: ContentPostSummary["type"];
  publishedOnly?: boolean;
}) {
  const type = options?.type;
  const publishedOnly = options?.publishedOnly ?? false;
  const posts = [...getDemoStore().posts].sort((left, right) => {
    const leftValue = left.publishedAt ?? left.createdAt;
    const rightValue = right.publishedAt ?? right.createdAt;
    return new Date(rightValue).getTime() - new Date(leftValue).getTime();
  });

  return posts.filter((post) => {
    if (type && post.type !== type) {
      return false;
    }

    if (publishedOnly && !post.published) {
      return false;
    }

    return true;
  });
}

function getDemoSportLabel(sportId?: string, fallback?: string) {
  if (sportId) {
    const sport = getDemoStore().sports.find((item) => item.id === sportId);
    if (sport) {
      return sport.name;
    }
  }

  return fallback ?? "Sport";
}

function getDemoTeamLabel(teamId?: string, fallback?: string) {
  if (teamId) {
    const team = getDemoStore().teams.find((item) => item.id === teamId);
    if (team) {
      return team.name;
    }
  }

  return fallback ?? "Team";
}

function createDemoSport(input: CreateSportInput) {
  const store = getDemoStore();
  const slug = slugify(input.name);

  if (store.sports.some((sport) => sport.slug === slug)) {
    throw new Error("Sport already exists.");
  }

  const sport: SportSummary = {
    id: `sport-${randomUUID()}`,
    name: input.name.trim(),
    slug,
    accent: input.accent?.trim() || "#f35c38",
    imageUrl: input.imageUrl?.trim() || null,
    tagline: input.tagline?.trim() || "Freshly added from the admin desk.",
  };

  store.sports.push(sport);
  store.sports.sort((left, right) => left.name.localeCompare(right.name));
  return sport;
}

function updateDemoSport(sportId: string, input: UpdateSportInput) {
  const store = getDemoStore();
  const index = store.sports.findIndex((sport) => sport.id === sportId);
  if (index === -1) {
    throw new Error("Sport was not found.");
  }

  const slug = slugify(input.name);
  const existing = store.sports.find((sport) => sport.slug === slug && sport.id !== sportId);
  if (existing) {
    throw new Error("Sport already exists.");
  }

  const updated: SportSummary = {
    ...store.sports[index],
    name: input.name.trim(),
    slug,
    accent: input.accent?.trim() || "#f35c38",
    imageUrl: input.imageUrl?.trim() || null,
    tagline: input.tagline?.trim() || "Freshly updated from the admin desk.",
  };

  store.sports[index] = updated;
  store.sports.sort((left, right) => left.name.localeCompare(right.name));
  return updated;
}

function createDemoTeam(input: CreateTeamInput) {
  const store = getDemoStore();
  const slug = slugify(input.name);

  if (store.teams.some((team) => team.slug === slug)) {
    throw new Error("Team already exists.");
  }

  const sport = input.sportId
    ? store.sports.find((item) => item.id === input.sportId) ?? null
    : null;

  const team: TeamSummary = {
    id: `team-${randomUUID()}`,
    name: input.name.trim(),
    slug,
    shortName: input.shortName?.trim() || input.name.trim().slice(0, 3).toUpperCase(),
    institution: input.institution?.trim() || "UDGAM",
    sportId: sport?.id ?? null,
    sportName: sport?.name ?? "Independent",
  };

  store.teams.push(team);
  store.teams.sort((left, right) => left.name.localeCompare(right.name));
  return team;
}

function createDemoMatch(input: CreateMatchInput) {
  const store = getDemoStore();
  const match: LiveMatch = {
    id: `match-${randomUUID()}`,
    sport: getDemoSportLabel(input.sportId, input.sport),
    eventTitle: input.eventTitle,
    homeTeam: getDemoTeamLabel(input.homeTeamId, input.homeTeam),
    awayTeam: getDemoTeamLabel(input.awayTeamId, input.awayTeam),
    homeScore: 0,
    awayScore: 0,
    status: input.status,
    startsAt: input.startsAt,
    venue: input.venue,
    featured: input.featured ?? false,
    updatedAt: new Date().toISOString(),
  };

  store.matches.unshift(match);
  return match;
}

function updateDemoMatch(matchId: string, input: UpdateMatchInput) {
  const store = getDemoStore();
  const target = store.matches.find((match) => match.id === matchId);

  if (!target) {
    throw new Error("Match not found.");
  }

  target.homeScore = input.homeScore;
  target.awayScore = input.awayScore;
  target.status = input.status;
  target.featured = input.featured;
  target.updatedAt = new Date().toISOString();
  return target;
}

function createDemoGalleryImage(input: CreateGalleryImageInput) {
  const image: GalleryItem = {
    id: `gallery-${randomUUID()}`,
    title: input.title,
    caption: input.caption ?? "",
    url: input.url,
    featured: input.featured ?? false,
    createdAt: new Date().toISOString(),
  };

  getDemoStore().gallery.unshift(image);
  return image;
}

function createDemoCommitteeRegistration(input: CreateCommitteeRegistrationInput) {
  const registration: CommitteeRegistrationSummary = {
    id: `committee-registration-${randomUUID()}`,
    category: input.category,
    title: input.title.trim(),
    headName: input.headName.trim(),
    coHeadName: input.coHeadName.trim(),
    headEmail: input.headEmail?.trim() || null,
    headLinkedin: input.headLinkedin?.trim() || null,
    coHeadEmail: input.coHeadEmail?.trim() || null,
    coHeadLinkedin: input.coHeadLinkedin?.trim() || null,
    imageUrl: input.imageUrl,
    coHeadImageUrl: input.coHeadImageUrl ?? input.imageUrl,
    createdAt: new Date().toISOString(),
  };

  getDemoStore().committeeRegistrations.unshift(registration);
  return registration;
}

function updateDemoCommitteeRegistration(
  registrationId: string,
  input: UpdateCommitteeRegistrationInput,
) {
  const target = getDemoStore().committeeRegistrations.find(
    (registration) => registration.id === registrationId,
  );

  if (!target) {
    throw new Error("Registration not found.");
  }

  target.category = input.category;
  target.title = input.title.trim();
  target.headName = input.headName.trim();
  target.coHeadName = input.coHeadName.trim();
  target.headEmail = input.headEmail?.trim() || null;
  target.headLinkedin = input.headLinkedin?.trim() || null;
  target.coHeadEmail = input.coHeadEmail?.trim() || null;
  target.coHeadLinkedin = input.coHeadLinkedin?.trim() || null;

  if (input.imageUrl) {
    target.imageUrl = input.imageUrl;
  }

  if (input.coHeadImageUrl) {
    target.coHeadImageUrl = input.coHeadImageUrl;
  }

  return target;
}

async function createDemoPost(input: CreateContentPostInput) {
  const store = getDemoStore();
  const slug = await buildAvailableSlug(input.title, (value) =>
    store.posts.some((post) => post.slug === value),
  );
  const sport = input.sportId
    ? store.sports.find((item) => item.id === input.sportId) ?? null
    : null;
  const now = new Date().toISOString();
  const published = input.published ?? true;
  const post: ContentPostSummary = {
    id: `post-${randomUUID()}`,
    title: input.title.trim(),
    slug,
    summary: input.summary.trim(),
    body: input.body.trim(),
    type: input.type,
    published,
    publishedAt: published ? now : null,
    createdAt: now,
    sportName: sport?.name ?? null,
    authorName: "UDGAM Admin",
  };

  store.posts.unshift(post);
  return post;
}

export async function getSports(): Promise<SportSummary[]> {
  if (shouldUseDemoData()) {
    return getDemoStore().sports;
  }

  return withReadFallback(
    async () => {
      const sports = await prisma!.sport.findMany({
        orderBy: { name: "asc" },
      });

      return sports.map(mapSport);
    },
    () => getDemoStore().sports,
  );
}

export async function getCompetitionCatalog(): Promise<CompetitionSummary[]> {
  if (shouldUseDemoData()) {
    return getDemoCompetitions();
  }

  return withReadFallback(
    async () => {
      if (!prisma || !("competition" in prisma)) {
        return getDemoCompetitions();
      }

      const competitions = await prisma!.competition.findMany({
        orderBy: [{ displayOrder: "asc" }, { title: "asc" }],
      });

      return competitions.map(mapCompetition);
    },
    () => getDemoCompetitions(),
  );
}

export async function getTeams(): Promise<TeamSummary[]> {
  if (shouldUseDemoData()) {
    return getDemoTeams();
  }

  return withReadFallback(
    async () => {
      const teams = await prisma!.team.findMany({
        include: { sport: true },
        orderBy: { name: "asc" },
      });

      return teams.map(mapTeam);
    },
    () => getDemoTeams(),
  );
}

export async function getEvents(): Promise<EventSummary[]> {
  if (shouldUseDemoData()) {
    return getDemoStore().events;
  }

  return withReadFallback(
    async () => {
      const events = await prisma!.event.findMany({
        include: { sport: true },
        orderBy: { startsAt: "asc" },
      });

      return events.map((event) => ({
        id: event.id,
        title: event.title,
        sport: event.sport?.name ?? "Campus Event",
        start: event.startsAt.toISOString(),
        venue: event.location ?? "UDGAM Arena",
        summary: event.summary,
      }));
    },
    () => getDemoStore().events,
  );
}

export async function getMatches(options?: { featuredOnly?: boolean }) {
  const featuredOnly = options?.featuredOnly ?? false;

  if (shouldUseDemoData()) {
    return getDemoMatches(featuredOnly);
  }

  return withReadFallback(
    async () => {
      const matches = await prisma!.match.findMany({
        where: featuredOnly ? { featured: true } : undefined,
        include: {
          sport: true,
          event: true,
          homeTeam: true,
          awayTeam: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      return matches.map(mapMatch);
    },
    () => getDemoMatches(featuredOnly),
  );
}

export async function getGalleryImages(options?: { featuredOnly?: boolean }) {
  const featuredOnly = options?.featuredOnly ?? false;

  if (shouldUseDemoData()) {
    return getDemoImages(featuredOnly);
  }

  return withReadFallback(
    async () => {
      const images = await prisma!.galleryImage.findMany({
        where: featuredOnly ? { featured: true } : undefined,
        orderBy: { createdAt: "desc" },
      });

      return images.map(mapGallery);
    },
    () => getDemoImages(featuredOnly),
  );
}

export async function getContentPosts(options?: {
  type?: ContentPostSummary["type"];
  publishedOnly?: boolean;
}): Promise<ContentPostSummary[]> {
  const type = options?.type;
  const publishedOnly = options?.publishedOnly ?? false;

  if (shouldUseDemoData()) {
    return getDemoPosts({ type, publishedOnly });
  }

  return withReadFallback(
    async () => {
      const posts = await prisma!.contentPost.findMany({
        where: {
          ...(type ? { type } : {}),
          ...(publishedOnly ? { published: true } : {}),
        },
        include: {
          sport: true,
          author: true,
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      });

      return posts.map(mapPost);
    },
    () => getDemoPosts({ type, publishedOnly }),
  );
}

export async function getCommitteeRegistrations(): Promise<CommitteeRegistrationSummary[]> {
  if (shouldUseDemoData()) {
    return getDemoCommitteeRegistrations();
  }

  return withReadFallback(
    async () => {
      const registrations = await prisma!.committeeRegistration.findMany({
        orderBy: { createdAt: "desc" },
      });

      return registrations.map(mapCommitteeRegistration);
    },
    () => getDemoCommitteeRegistrations(),
  );
}

export async function getScheduleEntries(): Promise<ScheduleEntry[]> {
  const [events, matches] = await Promise.all([getEvents(), getMatches()]);

  return [
    ...events.map((event) => ({
      id: event.id,
      title: event.title,
      detail: `${event.sport} - ${event.venue}`,
      time: event.start,
      type: "EVENT" as const,
    })),
    ...matches.map((match) => ({
      id: match.id,
      title: `${match.homeTeam} vs ${match.awayTeam}`,
      detail: `${match.sport} - ${match.venue}`,
      time: match.startsAt,
      type: "MATCH" as const,
    })),
  ].sort(
    (left, right) =>
      new Date(left.time).getTime() - new Date(right.time).getTime(),
  );
}

async function ensureSport(name: string) {
  const slug = slugify(name);
  const existing = await prisma!.sport.findUnique({ where: { slug } });
  if (existing) {
    return existing;
  }

  return prisma!.sport.create({
    data: {
      name,
      slug,
      accentColor: "#f35c38",
      tagline: "Freshly created from the UDGAM control desk.",
    },
  });
}

async function resolveSport(input: CreateMatchInput) {
  if (input.sportId) {
    const sport = await prisma!.sport.findUnique({
      where: { id: input.sportId },
    });

    if (!sport) {
      throw new Error("Selected sport was not found.");
    }

    return sport;
  }

  if (!input.sport?.trim()) {
    throw new Error("Sport is required.");
  }

  return ensureSport(input.sport);
}

async function ensureEvent(title: string, sportId?: string) {
  const slug = slugify(title);
  const existing = await prisma!.event.findUnique({ where: { slug } });
  if (existing) {
    return existing;
  }

  return prisma!.event.create({
    data: {
      title,
      slug,
      summary: "Live event entry created during UDGAM operations.",
      location: "UDGAM Arena",
      startsAt: new Date(),
      sportId,
    },
  });
}

async function ensureTeam(name: string, sportId?: string) {
  const slug = slugify(name);
  const existing = await prisma!.team.findUnique({
    where: { slug },
  });
  if (existing) {
    return existing;
  }

  return prisma!.team.create({
    data: {
      name,
      slug,
      shortName: name.slice(0, 3).toUpperCase(),
      institution: "UDGAM",
      sportId,
    },
  });
}

async function resolveTeam(teamId: string | undefined, fallbackName: string | undefined, sportId?: string) {
  if (teamId) {
    const team = await prisma!.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new Error("Selected team was not found.");
    }

    return team;
  }

  if (!fallbackName?.trim()) {
    throw new Error("Team name is required.");
  }

  return ensureTeam(fallbackName, sportId);
}

export async function createSport(input: CreateSportInput) {
  if (shouldUseDemoData()) {
    return createDemoSport(input);
  }

  return withWriteRecovery(async () => {
    const slug = slugify(input.name);
    const existing = await prisma!.sport.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new Error("Sport already exists.");
    }

    const sport = await prisma!.sport.create({
      data: {
        name: input.name.trim(),
        slug,
        accentColor: input.accent?.trim() || "#f35c38",
        imageUrl: input.imageUrl?.trim() || null,
        tagline: input.tagline?.trim() || "Freshly added from the admin desk.",
      },
    });

    return mapSport(sport);
  });
}

export async function updateSport(sportId: string, input: UpdateSportInput) {
  if (shouldUseDemoData()) {
    return updateDemoSport(sportId, input);
  }

  return withWriteRecovery(async () => {
    const trimmedName = input.name.trim();
    const trimmedAccent = input.accent?.trim() || "#f35c38";
    const trimmedImageUrl = input.imageUrl?.trim() || null;
    const trimmedTagline =
      input.tagline?.trim() || "Freshly updated from the admin desk.";
    const slug = slugify(input.name);
    const existingSport = await prisma!.sport.findUnique({
      where: { id: sportId },
    });
    const fallbackSport =
      existingSport ??
      (await prisma!.sport.findFirst({
        where: {
          OR: [{ slug }, { name: trimmedName }],
        },
      }));

    const slugConflict = await prisma!.sport.findUnique({ where: { slug } });

    const targetSport = slugConflict ?? fallbackSport ?? null;

    if (!targetSport) {
      const created = await prisma!.sport.create({
        data: {
          name: trimmedName,
          slug,
          accentColor: trimmedAccent,
          imageUrl: trimmedImageUrl,
          tagline: trimmedTagline,
        },
      });

      return mapSport(created);
    }

    const baseData = {
      name: trimmedName,
      slug,
      accentColor: trimmedAccent,
      imageUrl: trimmedImageUrl,
      tagline: trimmedTagline,
    };

    const updated = await prisma!.sport.update({
      where: { id: targetSport.id },
      data: baseData,
    });

    return mapSport(updated);
  });
}

export async function createTeam(input: CreateTeamInput) {
  if (shouldUseDemoData()) {
    return createDemoTeam(input);
  }

  const slug = slugify(input.name);
  const existing = await prisma!.team.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new Error("Team already exists.");
  }

  if (input.sportId) {
    const sport = await prisma!.sport.findUnique({
      where: { id: input.sportId },
    });

    if (!sport) {
      throw new Error("Selected sport was not found.");
    }
  }

  const team = await prisma!.team.create({
    data: {
      name: input.name.trim(),
      slug,
      shortName: input.shortName?.trim() || input.name.trim().slice(0, 3).toUpperCase(),
      institution: input.institution?.trim() || "UDGAM",
      sportId: input.sportId || null,
    },
    include: {
      sport: true,
    },
  });

  return mapTeam(team);
}

export async function createMatch(input: CreateMatchInput) {
  if (shouldUseDemoData()) {
    return createDemoMatch(input);
  }

  const sport = await resolveSport(input);
  const event = await ensureEvent(input.eventTitle, sport.id);
  const homeTeam = await resolveTeam(input.homeTeamId, input.homeTeam, sport.id);
  const awayTeam = await resolveTeam(input.awayTeamId, input.awayTeam, sport.id);

  if (homeTeam.id === awayTeam.id) {
    throw new Error("Home and away teams must be different.");
  }

  if (homeTeam.sportId && homeTeam.sportId !== sport.id) {
    throw new Error("The selected home team is linked to a different sport.");
  }

  if (awayTeam.sportId && awayTeam.sportId !== sport.id) {
    throw new Error("The selected away team is linked to a different sport.");
  }

  const match = await prisma!.match.create({
    data: {
      sportId: sport.id,
      eventId: event.id,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      venue: input.venue,
      startsAt: new Date(input.startsAt),
      status: input.status,
      featured: input.featured ?? false,
      scoreSnapshots: {
        create: {
          homeScore: 0,
          awayScore: 0,
          status: input.status,
          note: "Match created from admin desk.",
        },
      },
    },
    include: {
      sport: true,
      event: true,
      homeTeam: true,
      awayTeam: true,
    },
  });

  return mapMatch(match);
}

export async function updateMatch(matchId: string, input: UpdateMatchInput) {
  if (shouldUseDemoData()) {
    return updateDemoMatch(matchId, input);
  }

  const updated = await prisma!.match.update({
    where: { id: matchId },
    data: {
      homeScore: input.homeScore,
      awayScore: input.awayScore,
      status: input.status,
      featured: input.featured,
      scoreSnapshots: {
        create: {
          homeScore: input.homeScore,
          awayScore: input.awayScore,
          status: input.status,
        },
      },
    },
    include: {
      sport: true,
      event: true,
      homeTeam: true,
      awayTeam: true,
    },
  });

  return mapMatch(updated);
}

export async function createGalleryImage(input: CreateGalleryImageInput) {
  if (shouldUseDemoData()) {
    return createDemoGalleryImage(input);
  }

  const image = await prisma!.galleryImage.create({
    data: {
      title: input.title,
      caption: input.caption,
      url: input.url,
      featured: input.featured ?? false,
      uploadedById: input.uploadedById,
      r2Key: input.r2Key,
    },
  });

  return mapGallery(image);
}

export async function createContentPost(input: CreateContentPostInput) {
  if (shouldUseDemoData()) {
    return createDemoPost(input);
  }

  if (input.sportId) {
    const sport = await prisma!.sport.findUnique({
      where: { id: input.sportId },
    });

    if (!sport) {
      throw new Error("Selected sport was not found.");
    }
  }

  const slug = await buildAvailableSlug(input.title, async (value) => {
    const existing = await prisma!.contentPost.findUnique({
      where: { slug: value },
    });

    return Boolean(existing);
  });

  const published = input.published ?? true;
  const post = await prisma!.contentPost.create({
    data: {
      title: input.title.trim(),
      slug,
      summary: input.summary.trim(),
      body: input.body.trim(),
      type: input.type,
      published,
      publishedAt: published ? new Date() : null,
      sportId: input.sportId || null,
      authorId: input.authorId,
    },
    include: {
      sport: true,
      author: true,
    },
  });

  return mapPost(post);
}

export async function createCommitteeRegistration(input: CreateCommitteeRegistrationInput) {
  if (shouldUseDemoData()) {
    return createDemoCommitteeRegistration(input);
  }

  const registration = await prisma!.committeeRegistration.create({
    data: {
      category: input.category,
      title: input.title.trim(),
      headName: input.headName.trim(),
      coHeadName: input.coHeadName.trim(),
      headEmail: input.headEmail?.trim() || null,
      headLinkedin: input.headLinkedin?.trim() || null,
      coHeadEmail: input.coHeadEmail?.trim() || null,
      coHeadLinkedin: input.coHeadLinkedin?.trim() || null,
      imageUrl: input.imageUrl,
      imageR2Key: input.imageR2Key,
      coHeadImageUrl: input.coHeadImageUrl ?? input.imageUrl,
      coHeadImageR2Key: input.coHeadImageR2Key,
    },
  });

  return mapCommitteeRegistration(registration);
}

export async function updateCommitteeRegistration(
  registrationId: string,
  input: UpdateCommitteeRegistrationInput,
) {
  if (shouldUseDemoData()) {
    return updateDemoCommitteeRegistration(registrationId, input);
  }

  const registration = await prisma!.committeeRegistration.update({
    where: { id: registrationId },
    data: {
      category: input.category,
      title: input.title.trim(),
      headName: input.headName.trim(),
      coHeadName: input.coHeadName.trim(),
      headEmail: input.headEmail?.trim() || null,
      headLinkedin: input.headLinkedin?.trim() || null,
      coHeadEmail: input.coHeadEmail?.trim() || null,
      coHeadLinkedin: input.coHeadLinkedin?.trim() || null,
      ...(input.imageUrl
        ? {
            imageUrl: input.imageUrl,
            imageR2Key: input.imageR2Key,
          }
        : {}),
      ...(input.coHeadImageUrl
        ? {
            coHeadImageUrl: input.coHeadImageUrl,
            coHeadImageR2Key: input.coHeadImageR2Key,
          }
        : {}),
    },
  });

  return mapCommitteeRegistration(registration);
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const [matches, gallery, sports, teams, posts, committeeRegistrations] = await Promise.all([
    getMatches(),
    getGalleryImages(),
    getSports(),
    getTeams(),
    getContentPosts(),
    getCommitteeRegistrations(),
  ]);

  return {
    matches,
    gallery,
    sports,
    teams,
    posts,
    committeeRegistrations,
    r2Configured: env.r2.configured,
    r2MaxUploadSizeMb: env.r2.maxUploadSizeMb,
    demoMode: env.demoMode,
    adminHint: getAdminHint(),
  };
}














