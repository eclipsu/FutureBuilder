/** Stable TypeORM entity targets — use table names so Next.js minification cannot break lookups. */
export const EntityTable = {
  User: 'users',
  Student: 'students',
  Point: 'points',
  Group: 'groups',
} as const
