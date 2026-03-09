import type { Core } from '@strapi/strapi';

/**
 * Middleware to handle Windows EPERM errors on the upload endpoint.
 *
 * Strapi's upload handler saves the file successfully, then tries to
 * delete the temp file. On Windows the OS may still hold a lock,
 * causing an EPERM error that propagates as a 500 response even though
 * the upload itself succeeded.
 *
 * This middleware catches that specific error and recovers the uploaded
 * file(s) from the database so the client receives a normal 200 response.
 */
export default (_config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    if (ctx.request.method !== 'POST' || !ctx.request.path.startsWith('/api/upload')) {
      return next();
    }

    try {
      await next();
    } catch (error: any) {
      if (error.code === 'EPERM' && error.syscall === 'unlink') {
        strapi.log.warn(
          '[Upload] EPERM on temp file cleanup (Windows lock). Upload succeeded, recovering response.',
        );

        const recentFiles = await strapi.db
          .query('plugin::upload.file')
          .findMany({ orderBy: { createdAt: 'desc' }, limit: 1 });

        if (recentFiles.length > 0) {
          ctx.status = 200;
          ctx.body = recentFiles;
          return;
        }
      }

      throw error;
    }
  };
};
