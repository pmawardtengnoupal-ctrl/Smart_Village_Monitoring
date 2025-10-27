// Shared route typing used by app router pages and router components

export type Section = 'public' | 'dashboard' | 'auth';

export type RouteParams = {
  /** Next.js catch-all like [[...all]] becomes e.g. { all: ['villages'] } */
  all?: string[]; // we map this to slug below
};

/** What Router expects (normalized) */
export type NormalizedParams = {
  section: Section;
  slug: string[];
};

/** Simple component match result */
export type RouteMatch = { Comp: React.ComponentType<any>; props?: Record<string, any> } | null;
