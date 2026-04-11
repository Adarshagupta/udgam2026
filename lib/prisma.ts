import path from "node:path";
import { createRequire } from "node:module";

import { PrismaPg } from "@prisma/adapter-pg";
import type { PrismaClient as PrismaClientType } from "@prisma/client";
import { Pool } from "pg";

import { env } from "@/lib/env";

declare global {
  var __udgamPrisma: PrismaClientType | undefined;
  var __udgamPgPool: Pool | undefined;
}

const runtimeRequire = createRequire(process.cwd() + "/package.json");

function clearPrismaModuleCache() {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const cacheMarkers = [
    `${path.sep}node_modules${path.sep}@prisma${path.sep}client${path.sep}`,
    `${path.sep}node_modules${path.sep}.prisma${path.sep}client${path.sep}`,
  ];

  for (const modulePath of Object.keys(runtimeRequire.cache)) {
    if (cacheMarkers.some((marker) => modulePath.includes(marker))) {
      delete runtimeRequire.cache[modulePath];
    }
  }
}

function getPrismaClientConstructor() {
  clearPrismaModuleCache();

  return (runtimeRequire("@prisma/client") as typeof import("@prisma/client"))
    .PrismaClient;
}

function hasRequiredDelegates(client: PrismaClientType | undefined) {
  return Boolean(client && "committeeRegistration" in client);
}

function createPgPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

function storePgPool(pool: Pool) {
  if (process.env.NODE_ENV !== "production") {
    globalThis.__udgamPgPool = pool;
  }

  return pool;
}

let pgPool = env.hasDatabase
  ? globalThis.__udgamPgPool ?? storePgPool(createPgPool())
  : null;

function createPrismaClient(pool: Pool) {
  const RuntimePrismaClient = getPrismaClientConstructor();

  return new RuntimePrismaClient({
    adapter: new PrismaPg(pool),
  });
}

export let prisma =
  env.hasDatabase && pgPool
    ? hasRequiredDelegates(globalThis.__udgamPrisma)
      ? globalThis.__udgamPrisma
      : createPrismaClient(pgPool)
    : null;

if (env.hasDatabase && process.env.NODE_ENV !== "production") {
  globalThis.__udgamPrisma = prisma ?? undefined;
}

export async function resetPrismaClient() {
  if (!env.hasDatabase) {
    prisma = null;
    return prisma;
  }

  const previousClient = prisma;
  const previousPool = pgPool;

  if (process.env.NODE_ENV !== "production") {
    globalThis.__udgamPrisma = undefined;
    globalThis.__udgamPgPool = undefined;
  }

  if (previousClient) {
    try {
      await previousClient.$disconnect();
    } catch {
      // Ignore disconnect failures while replacing a broken client.
    }
  }

  if (previousPool) {
    try {
      await previousPool.end();
    } catch {
      // Ignore pool teardown failures while replacing a broken connection.
    }
  }

  pgPool = storePgPool(createPgPool());
  prisma = createPrismaClient(pgPool);

  if (process.env.NODE_ENV !== "production") {
    globalThis.__udgamPrisma = prisma;
  }

  return prisma;
}
