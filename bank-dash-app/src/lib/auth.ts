import { cache } from 'react';
import { auth } from '@clerk/nextjs/server';

// Deduplicate auth() calls within a single server render pass.
// Layout, page, and components share the same auth result per request.
export const getAuth = cache(() => auth());
