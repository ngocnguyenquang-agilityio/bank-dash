// Browser-safe mock for @clerk/nextjs in Storybook
// Provides no-op implementations of Clerk hooks and components.

export const useClerk = () => ({
  signOut: async () => {},
  signIn: async () => {},
  user: null,
  session: null,
  loaded: true,
});

export const useUser = () => ({
  user: null,
  isLoaded: true,
  isSignedIn: false,
});

export const useAuth = () => ({
  isLoaded: true,
  isSignedIn: false,
  userId: null,
  sessionId: null,
  getToken: async () => null,
});

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => children;

export const SignInButton = ({ children }: { children: React.ReactNode }) => children;
export const SignOutButton = ({ children }: { children: React.ReactNode }) => children;
export const SignedIn = ({ children }: { children: React.ReactNode }) => children;
export const SignedOut = ({ children }: { children: React.ReactNode }) => children;
export const SignIn = () => null;
export const SignUp = () => null;

// Server-side exports (used by @clerk/nextjs/server)
export const auth = async () => ({ userId: null, sessionId: null });
export const clerkMiddleware = () => () => {};
export const createRouteMatcher = () => () => false;

export type WebhookEvent = unknown;
