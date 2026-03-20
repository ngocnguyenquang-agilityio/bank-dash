import { cache } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

// Constants
import { ROUTES } from '@/constants/route';

// Deduplicate auth() calls within a single server render pass.
// Layout, page, and components share the same auth result per request.
export const getAuth = cache(() => auth());

// For protected routes where middleware guarantees authentication.
// Returns a typed non-null userId. The redirect is a safety net
// for misuse on public routes — middleware prevents this path
// from being reached on (home) routes.
export const requireAuth = cache(async (): Promise<string> => {
  const { userId } = await auth();

  if (!userId) {
    redirect(ROUTES.SIGN_IN);
  }

  return userId;
});
