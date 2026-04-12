export const adminNavItems = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Metrics, recent activity, and shortcuts.',
  },
  {
    id: 'sports',
    label: 'Sports',
    description: 'Manage competition categories and sport metadata.',
  },
  {
    id: 'teams',
    label: 'Teams',
    description: 'Build the roster and assign teams to sports.',
  },
  {
    id: 'updates',
    label: 'Blog & News',
    description: 'Publish public updates, notices, and stories.',
  },
  {
    id: 'fixtures',
    label: 'Fixtures',
    description: 'Create and review scheduled matches.',
  },
  {
    id: 'scores',
    label: 'Scores',
    description: 'Update active match scores in real time.',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    description: 'Upload and review event media.',
  },
] as const;

export type AdminView = (typeof adminNavItems)[number]['id'];

export function isAdminView(value: string): value is AdminView {
  return adminNavItems.some((item) => item.id === value);
}

export function getAdminViewMeta(view: AdminView) {
  return adminNavItems.find((item) => item.id === view) ?? adminNavItems[0];
}
