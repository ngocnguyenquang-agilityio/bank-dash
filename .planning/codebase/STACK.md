# Technology Stack

**Analysis Date:** 2026-03-20

## Languages

**Primary:**
- TypeScript 5.x - All source code (strict mode enabled)
- JavaScript/JSX - React components with TSX syntax

**Secondary:**
- CSS - Tailwind utility classes
- JSON - Configuration and data files

## Runtime

**Environment:**
- Node.js 20.x - 24.x (backend requirement)
- Browser (modern, ES2017+) for frontend

**Package Manager:**
- npm 6.0.0+ (workspace root and per-package scripts)
- Lockfile: `package-lock.json` (standard npm)

## Frameworks

**Core:**
- Next.js 16.1.4 (App Router, TypeScript strict mode) - `bank-dash-app/`
- Strapi 5.33.4 (headless CMS backend) - `bank-dash-server/`
- React 19.2.3 - Frontend UI (with React 18.0.0 in backend for Strapi admin)

**Effect-TS:**
- effect 3.19.14 - Typed async error handling runtime
- @effect/platform 0.94.1 - Cross-platform abstractions
- @effect/platform-node 0.104.1 - Node.js specific platform features
- @effect/experimental 0.58.0 - DevTools and experimental APIs

**Authentication:**
- @clerk/nextjs 6.36.10 - User authentication and authorization

**UI Components & Styling:**
- Radix UI (various packages @radix-ui/*) - Unstyled component primitives
- tailwindcss 4.x - Utility-first CSS framework
- class-variance-authority 0.7.1 - Component variant builder
- lucide-react 0.562.0 - Icon library
- shadcn/ui patterns (via Radix + Tailwind)

**Forms:**
- react-hook-form 7.71.1 - Lightweight form state management
- @hookform/resolvers 5.2.2 - Schema validation integration (Zod support)

**Charts & Data Visualization:**
- recharts 2.15.4 - React chart library for dashboard graphs

**Utilities:**
- date-fns 4.1.0 - Date manipulation and formatting
- clsx 2.1.1 - Conditional className builder
- tailwind-merge 3.4.0 - Merge Tailwind classes with override resolution
- sonner 2.0.7 - Toast notifications
- embla-carousel-react 8.6.0 - Carousel/slider component
- react-day-picker 9.13.0 - Date picker component
- next-themes 0.4.6 - Dark mode theme switching

**Testing:**
- Jest 30.2.0 - Test runner and framework
- @testing-library/react 16.3.2 - React component testing utilities
- @testing-library/jest-dom 6.9.1 - Jest matchers for DOM assertions
- @testing-library/user-event 14.6.1 - User interaction simulation

**Build & Dev Tools:**
- Turbopack (Next.js 16 default) - Fast bundler/dev server
- Tailwind CSS PostCSS 4 - CSS processing via PostCSS
- babel-plugin-react-compiler 1.0.0 - React 19 compiler optimization
- Storybook 10.2.0 (@storybook/nextjs) - Component documentation and preview

**Linting & Formatting:**
- ESLint 9.x - Code linting (uses eslint-config-next and eslint-plugin-storybook)
- Prettier 3.8.1 - Code formatter
- ESLint config: Prettier (eslint-config-prettier 10.1.8) - Disable conflicting rules

**Git Hooks & Commits:**
- Husky 9.1.7 - Git hooks automation
- lint-staged 16.2.7 - Pre-commit linting
- @commitlint/cli 20.3.1 - Conventional commit validation
- @commitlint/config-conventional 20.3.1 - Conventional commit rules

**Strapi Specific:**
- better-sqlite3 12.4.1 - SQLite driver (default database)
- @strapi/plugin-users-permissions 5.33.4 - User roles and permissions
- @strapi/plugin-cloud 5.33.4 - Strapi Cloud integration
- strapi-health-plugin 1.2.2 - Health check endpoints
- styled-components 6.0.0 - CSS-in-JS for Strapi admin UI

## Configuration

**Environment:**
- `.env.local` (frontend) - Contains NEXT_PUBLIC_* and secret keys
  - `NEXT_PUBLIC_API_URL` - Strapi API endpoint
  - `NEXT_PUBLIC_CLERK_*` - Clerk authentication config
  - `CLERK_SECRET_KEY` - Backend Clerk secret
  - `CLERK_WEBHOOK_SIGNING_SECRET` - Webhook verification
- `.env` (backend) - Strapi configuration
  - `HOST`, `PORT` - Server binding
  - `APP_KEYS` - CSRF token generation
  - `ADMIN_JWT_SECRET` - Admin panel JWT
  - `TRANSFER_TOKEN_SALT` - Transfer feature tokens
  - `ENCRYPTION_KEY` - Data encryption
  - `DATABASE_CLIENT` - Driver selection (sqlite|postgres|mysql)
  - `DATABASE_*` - Connection credentials

**Build:**
- `tsconfig.json` - TypeScript compiler options (strict mode enabled, path aliases)
- `next.config.ts` - Next.js configuration (Turbopack, image remotePatterns, redirects)
- `jest.config.ts` - Jest test configuration
- `.prettierrc` - Prettier formatting rules
- `package.json` - npm scripts and dependencies (monorepo via workspaces)

**Strapi Config:**
- `config/server.ts` - Host/port and app keys
- `config/database.ts` - Database connections (sqlite default, supports postgres/mysql)
- `config/api.ts` - API settings
- `config/admin.ts` - Admin panel configuration
- `config/middlewares.ts` - Express middleware setup
- `config/plugins.ts` - Plugin configuration

## Platform Requirements

**Development:**
- Node.js 20.x - 24.x
- npm 6.0.0+
- Unix-like shell (bash) - Uses bash syntax in some npm scripts
- Windows support with EPERM error handling for file cleanup

**Production:**
- Deployment target: Docker containers or Node.js hosting (Railway, Vercel, etc.)
- Frontend: Vercel Next.js deployment or Docker
- Backend: Any Node.js 20+ host (includes self-hosted)
- Database: SQLite (dev), PostgreSQL or MySQL (production)

---

*Stack analysis: 2026-03-20*
