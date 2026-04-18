import { slugify } from '@/lib/utils';

export interface SportImageEntry {
  name: string;
  sourceRelativePath: string;
  publicUrl: string;
}

const sportImageEntries: SportImageEntry[] = [
  { name: 'Volleyball', sourceRelativePath: 'img/sports/vollyball.png', publicUrl: '/sports/vollyball.png' },
  { name: 'Basketball', sourceRelativePath: 'img/sports/basketball.png', publicUrl: '/sports/basketball.png' },
  { name: 'Kabaddi', sourceRelativePath: 'img/sports/kahaddi.png', publicUrl: '/sports/kahaddi.png' },
  { name: 'Football', sourceRelativePath: 'img/sports/football.png', publicUrl: '/sports/football.png' },
  { name: 'Badminton', sourceRelativePath: 'img/sports/badminton.png', publicUrl: '/sports/badminton.png' },
  { name: 'Table Tennis', sourceRelativePath: 'img/sports/tabletennis.png', publicUrl: '/sports/tabletennis.png' },
  { name: 'Chess', sourceRelativePath: 'img/sports/ches.png', publicUrl: '/sports/ches.png' },
  { name: 'BGMI', sourceRelativePath: 'img/sports/pubg.png', publicUrl: '/sports/pubg.png' },
  { name: 'Free Fire', sourceRelativePath: 'img/sports/cod.png', publicUrl: '/sports/cod.png' },
  { name: 'Real Cricket', sourceRelativePath: 'img/sports/cricket.png', publicUrl: '/sports/cricket.png' },
  { name: 'Valorant', sourceRelativePath: 'img/sports/v.png', publicUrl: '/sports/v.png' },
];

export const sportImageBySlug = new Map(
  sportImageEntries.map((entry) => [slugify(entry.name), entry]),
);

export function getSportImageEntry(name: string) {
  return sportImageBySlug.get(slugify(name)) ?? null;
}
