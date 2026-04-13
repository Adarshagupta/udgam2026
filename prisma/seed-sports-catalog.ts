import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

import { competitionSeedEntries, sportSeedEntries } from '../lib/competition-catalog';
import { getSportImageEntry } from '../lib/sport-image-catalog';
import { slugify } from '../lib/utils';

const databaseUrl = process.env.DATABASE_URL?.trim() ?? '';

if (databaseUrl === '') {
  throw new Error('DATABASE_URL is required to seed the sports catalogue.');
}

const pool = new Pool({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {
  for (const sport of sportSeedEntries) {
    const slug = slugify(sport.name);
    const imageEntry = getSportImageEntry(sport.name);

    await prisma.sport.upsert({
      where: { slug },
      update: {
        name: sport.name,
        accentColor: sport.accent,
        imageUrl: imageEntry?.publicUrl ?? null,
        tagline: sport.tagline,
      },
      create: {
        name: sport.name,
        slug,
        accentColor: sport.accent,
        imageUrl: imageEntry?.publicUrl ?? null,
        tagline: sport.tagline,
      },
    });
  }

  for (const entry of competitionSeedEntries) {
    await prisma.competition.upsert({
      where: { slug: entry.slug },
      update: {
        title: entry.title,
        kind: entry.kind,
        sportName: entry.sportName,
        division: entry.division,
        formatLabel: entry.formatLabel ?? null,
        registrationFee: entry.registrationFee,
        winnerPrize: entry.winnerPrize ?? null,
        runnerUpPrize: entry.runnerUpPrize ?? null,
        secondRunnerUpPrize: entry.secondRunnerUpPrize ?? null,
        displayOrder: entry.displayOrder,
      },
      create: {
        title: entry.title,
        slug: entry.slug,
        kind: entry.kind,
        sportName: entry.sportName,
        division: entry.division,
        formatLabel: entry.formatLabel ?? null,
        registrationFee: entry.registrationFee,
        winnerPrize: entry.winnerPrize ?? null,
        runnerUpPrize: entry.runnerUpPrize ?? null,
        secondRunnerUpPrize: entry.secondRunnerUpPrize ?? null,
        displayOrder: entry.displayOrder,
      },
    });
  }

  console.log(
    'Seeded ' + sportSeedEntries.length + ' sports and ' + competitionSeedEntries.length + ' competition entries.',
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma['$disconnect']();
    await pool.end();
  });
