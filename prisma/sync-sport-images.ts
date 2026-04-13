import 'dotenv/config';

import { copyFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

import { sportSeedEntries } from '../lib/competition-catalog';
import { getSportImageEntry } from '../lib/sport-image-catalog';
import { slugify } from '../lib/utils';

const databaseUrl = process.env.DATABASE_URL?.trim() ?? '';

if (databaseUrl === '') {
  throw new Error('DATABASE_URL is required to sync sport images.');
}

const projectRoot = path.resolve(__dirname, '..');
const publicSportsDirectory = path.join(projectRoot, 'public', 'sports');

const pool = new Pool({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function ensureFileExists(filePath: string) {
  await stat(filePath);
}

async function main() {
  await mkdir(publicSportsDirectory, { recursive: true });

  let copiedCount = 0;
  let updatedCount = 0;
  const missingMappings: string[] = [];

  for (const sport of sportSeedEntries) {
    const imageEntry = getSportImageEntry(sport.name);

    if (imageEntry === null) {
      missingMappings.push(sport.name);
      continue;
    }

    const sourcePath = path.join(projectRoot, imageEntry.sourceRelativePath);
    const publicPath = imageEntry.publicUrl.startsWith('/') ? imageEntry.publicUrl.slice(1) : imageEntry.publicUrl;
    const targetPath = path.join(projectRoot, 'public', publicPath);

    await ensureFileExists(sourcePath);
    await mkdir(path.dirname(targetPath), { recursive: true });
    await copyFile(sourcePath, targetPath);
    copiedCount += 1;

    const slug = slugify(sport.name);

    await prisma.sport.upsert({
      where: { slug },
      update: {
        name: sport.name,
        accentColor: sport.accent,
        tagline: sport.tagline,
        imageUrl: imageEntry.publicUrl,
      },
      create: {
        name: sport.name,
        slug,
        accentColor: sport.accent,
        tagline: sport.tagline,
        imageUrl: imageEntry.publicUrl,
      },
    });

    updatedCount += 1;
  }

  if (missingMappings.length > 0) {
    console.warn('Missing image mappings for: ' + missingMappings.join(', '));
  }

  console.log('Copied ' + copiedCount + ' sport images into public/sports and updated ' + updatedCount + ' sports.');
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
