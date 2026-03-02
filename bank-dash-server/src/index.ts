// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {
    // Prevent Windows EPERM crashes when Strapi tries to clean up temp upload files
    // The upload succeeds but Windows may still lock the temp file during cleanup
    process.on('uncaughtException', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EPERM' && error.syscall === 'unlink') {
        console.warn('[Upload] Could not remove temp file (Windows lock):', error.path);
        return;
      }
      // Re-throw non-EPERM errors so they still crash as expected
      throw error;
    });
  },
};
