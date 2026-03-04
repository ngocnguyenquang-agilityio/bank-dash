import type { Core } from '@strapi/strapi';

const CACHE_DURATIONS: Record<string, number> = {
  '/api/cards': 300, // 5 minutes
  '/api/transactions': 60, // 1 minute
  '/api/members': 600, // 10 minutes
};

const getCacheDuration = (path: string): number | null => {
  for (const [prefix, duration] of Object.entries(CACHE_DURATIONS)) {
    if (path.startsWith(prefix)) return duration;
  }
  return null;
};

export default (_config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    await next();

    // Only cache successful GET requests
    if (ctx.request.method !== 'GET' || ctx.status !== 200) return;

    const duration = getCacheDuration(ctx.request.path);
    if (duration) {
      ctx.set(
        'Cache-Control',
        `public, max-age=${duration}, s-maxage=${duration}, stale-while-revalidate=${duration * 2}`,
      );
    }
  };
};
