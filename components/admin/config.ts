export const adminNavItems = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Metrics and shortcuts.',
  },
  {
    id: 'sports',
    label: 'Sports',
    description: 'Categories and tags.',
  },
  {
    id: 'teams',
    label: 'Teams',
    description: 'Roster and sport links.',
  },
  {
    id: 'updates',
    label: 'Blog & News',
    description: 'Posts and notices.',
  },
  {
    id: 'fixtures',
    label: 'Fixtures',
    description: 'Match schedule.',
  },
  {
    id: 'scores',
    label: 'Scores',
    description: 'Live scoring.',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    description: 'Media uploads.',
  },
  {
    id: 'registrations',
    label: 'Registrations',
    description: 'Team entries.',
  },
] as const;

export type AdminView = (typeof adminNavItems)[number]['id'];

export function isAdminView(value: string): value is AdminView {
  return adminNavItems.some((item) => item.id === value);
}

export function getAdminViewMeta(view: AdminView) {
  return adminNavItems.find((item) => item.id === view) ?? adminNavItems[0];
}
