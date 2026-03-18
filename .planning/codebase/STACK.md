# Technology Stack

**Analysis Date:** 2026-03-18

## Languages

**Primary:**
- TypeScript 5 - Both frontend and backend
- JavaScript (React 19 JSX) - Frontend React components

**Secondary:**
- CSS - Tailwind CSS 4, PostCSS

## Runtime & Environment

**Frontend:**
- Node.js 20+ (per package.json engines)
- npm 6.0.0+ (package manager)
- Lockfile: package-lock.json (npm)

**Backend:**
- Node.js 20+ (per package.json engines: ">=20.0.0 <=24.x.x")
- npm 6.0.0+ (package manager)

## Frameworks

**Frontend Core:**
- Next.js 16.1.4 - Full-stack React framework with SSR, API routes, server actions
- React 19.2.3 - UI library with React Server Components support

**Backend:**
- Strapi 5.33.4 - Headless CMS with API generation, content management
- better-sqlite3 12.4.1 - SQLite database driver (default)

**Frontend Testing:**
- Jest 30.2.0 - Unit testing framework
- @testing-library/react 16.3.2 - React component testing utilities
- @testing-library/jest-dom 6.9.1 - Jest matchers for DOM assertions

**Frontend Build & Dev:**
- Storybook 10.2.0 - Component explorer and documentation
- Turbopack - Next.js bundler (experimental, enabled in next.config.ts)
- React Compiler 1.0.0 - Babel plugin for automatic React memo optimization

**Styling:**
- Tailwind CSS 4 - Utility-first CSS framework
- PostCSS 4 - CSS preprocessing
- class-variance-authority 0.7.1 - Type-safe className composition

## Key Dependencies

**Critical - Effect/Functional Programming:**
- effect 3.19.14 - Functional error handling, schema validation, Effect monad composition
- @effect/platform 0.94.1 - Platform-agnostic Effect utilities
- @effect/platform-node 0.104.1 - Node.js platform bindings for Effect
- @effect/experimental 0.58.0 - Experimental Effect features

**Critical - Authentication:**
- @clerk/nextjs 6.36.10 - Clerk auth provider for Next.js (JWT, webhooks, SSR)

**Critical - UI Components:**
- @radix-ui/react-avatar 1.1.11 - Avatar component primitive
- @radix-ui/react-dialog 1.1.15 - Dialog/modal component primitive
- @radix-ui/react-label 2.1.8 - Label component primitive
- @radix-ui/react-popover 1.1.15 - Popover component primitive
- @radix-ui/react-select 2.2.6 - Select dropdown component primitive
- @radix-ui/react-slot 1.2.4 - Slot component for component composition
- lucide-react 0.562.0 - Icon library (556+ SVG icons)

**Forms & Validation:**
- react-hook-form 7.71.1 - Lightweight form state management
- @hookform/resolvers 5.2.2 - Integration with validation libraries for react-hook-form
- zod - Runtime schema validation for forms (via @hookform/resolvers)

**Charts & Visualization:**
- recharts 2.15.4 - React charting library (line, bar, area charts)
- embla-carousel-react 8.6.0 - Carousel/slider component library

**Notifications & UX:**
- sonner 2.0.7 - Toast notification library
- next-themes 0.4.6 - Dark/light mode theme management

**Utilities:**
- date-fns 4.1.0 - Date manipulation and formatting
- react-day-picker 9.13.0 - Date picker component
- clsx 2.1.1 - Conditional className utility
- tailwind-merge 3.4.0 - Merges Tailwind classes with conflict resolution
- tw-animate-css 1.4.0 - Tailwind CSS animation utilities

**Strapi Backend:**
- @strapi/strapi 5.33.4 - Core Strapi CMS
- @strapi/plugin-users-permissions 5.33.4 - User authentication plugin
- @strapi/plugin-cloud 5.33.4 - Strapi Cloud deployment plugin
- react 18.0.0 - For Strapi admin panel
- react-dom 18.0.0 - For Strapi admin panel
- react-router-dom 6.0.0 - Routing for Strapi admin
- styled-components 6.0.0 - CSS-in-JS for Strapi admin
- strapi-health-plugin 1.2.2 - Health check monitoring plugin

## Dev Dependencies

**Linting & Code Quality:**
- eslint 9 - JavaScript linter (flat config)
- eslint-config-next 16.1.4 - Next.js ESLint config
- eslint-config-prettier 10.1.8 - Disables ESLint rules conflicting with Prettier
- eslint-plugin-storybook 10.2.0 - ESLint rules for Storybook

**Formatting:**
- prettier 3.8.1 - Code formatter (configured: semi: true, singleQuote: true, tabWidth: 2, trailingComma: all, printWidth: 100)

**Type Checking:**
- typescript 5 - TypeScript compiler
- @types/node 20 - Node.js type definitions
- @types/react 19 - React 19 type definitions
- @types/react-dom 19 - React DOM type definitions
- @types/jest 30.0.0 - Jest type definitions

**Git Hooks & Commit Validation:**
- husky 9.1.7 - Git hooks manager
- lint-staged 16.2.7 - Run linters on staged files
- @commitlint/cli 20.3.1 - Enforce conventional commits
- @commitlint/config-conventional 20.3.1 - Conventional commits config

**Build & Compilation:**
- ts-node 10.9.2 - TypeScript execution for Node.js

**Testing Utilities:**
- jest-environment-jsdom 30.2.0 - jsdom test environment for Jest
- @testing-library/user-event 14.6.1 - User event simulation for testing
- resize-observer-polyfill 1.5.1 - ResizeObserver polyfill

**Storybook:**
- @storybook/nextjs 10.2.0 - Next.js integration for Storybook
- @storybook/addon-a11y 10.2.0 - Accessibility addon
- @storybook/addon-docs 10.2.0 - Documentation addon
- @chromatic-com/storybook 5.0.0 - Visual regression testing

## Configuration Files

**Frontend (bank-dash-app/):**
- `tsconfig.json` - TypeScript compiler config (target: ES2017, strict mode enabled, path aliases)
- `next.config.ts` - Next.js config (Turbopack, React Compiler, image remote patterns for Strapi)
- `jest.config.ts` - Jest config (jsdom environment, setupFilesAfterEnv, moduleNameMapper aliases)
- `eslint.config.mjs` - ESLint flat config (extends next/core-web-vitals, prettier)
- `.prettierrc` - Prettier format config (semi: true, singleQuote: true, tabWidth: 2, trailingComma: all, printWidth: 100)
- `.env.local` - Frontend environment variables (NEXT_PUBLIC_API_URL, Clerk keys)

**Backend (bank-dash-server/):**
- `tsconfig.json` - TypeScript config (target: ES2019, commonjs module, excludes src/admin)
- `config/database.ts` - Database configuration (supports sqlite, mysql, postgres; default: sqlite)
- `.env` - Backend environment variables (Strapi secrets, JWT, API tokens)

## Path Aliases

**Frontend (tsconfig.json):**
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/domain/*` → `./src/domain/*`
- `@/services/*` → `./src/services/*`
- `@/effects/*` → `./src/effects/*`
- `@/hooks/*` → `./src/hooks/*`
- `@/lib/*` → `./src/lib/*`
- `@/test/*` → `./src/test/*`

## Environment Configuration

**Frontend Required Variables:**
- `NEXT_PUBLIC_API_URL` - Strapi API base URL (e.g., http://localhost:1337/api)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key (public, inlined at build time)
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - Clerk sign-in page URL
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - Clerk sign-up page URL
- `CLERK_SECRET_KEY` - Clerk secret key (server-side only)
- `CLERK_WEBHOOK_SIGNING_SECRET` - Webhook signature verification secret

**Backend Required Variables:**
- `HOST` - Server bind address (default: 0.0.0.0)
- `PORT` - Server port (default: 1337)
- `APP_KEYS` - Application encryption keys (comma-separated)
- `API_TOKEN_SALT` - Salt for API token generation
- `ADMIN_JWT_SECRET` - JWT secret for admin authentication
- `TRANSFER_TOKEN_SALT` - Salt for transfer operation tokens
- `JWT_SECRET` - JWT signing secret
- `ENCRYPTION_KEY` - Encryption key for sensitive data

**Database Environment (optional, backend):**
- `DATABASE_CLIENT` - Database driver (sqlite, mysql, postgres; default: sqlite)
- `DATABASE_HOST` - Database host (mysql/postgres only)
- `DATABASE_PORT` - Database port (mysql: 3306, postgres: 5432)
- `DATABASE_NAME` - Database name
- `DATABASE_USERNAME` - Database user
- `DATABASE_PASSWORD` - Database password
- `DATABASE_SSL` - Enable SSL for database (boolean)
- `DATABASE_FILENAME` - SQLite database file path (default: .tmp/data.db)

## Platform Requirements

**Development:**
- Node.js 20.x - 24.x
- npm 6.0.0+
- Git (for Husky hooks)
- Windows, macOS, or Linux

**Production:**
- Node.js 20.x - 24.x
- npm 6.0.0+
- SQLite (default) OR MySQL 5.7+ OR PostgreSQL 10+

## Special Considerations

**Monorepo Structure:**
- Not using monorepo tools (yarn workspaces, pnpm, Lerna, Turbo)
- Two independent npm projects: `bank-dash-app/` and `bank-dash-server/`
- Requires running both servers in parallel during development

**Next.js Experimental Features:**
- Turbopack bundler enabled for faster builds
- React Compiler enabled for automatic memo optimization
- StaleTimes experimental config for cache behavior

**Strapi Customizations:**
- Custom middlewares in `bank-dash-server/config/middlewares.ts` (cache-control, upload-eperm-handler)
- Plugins in `bank-dash-server/config/plugins.ts`

---

*Stack analysis: 2026-03-18*
