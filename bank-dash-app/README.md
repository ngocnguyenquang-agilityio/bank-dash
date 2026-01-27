# Production-Ready Next.js Application

A modern, production-ready Next.js application built with the App Router, featuring a comprehensive tech stack including Effect-ts, Shadcn UI, React Hook Form, Jest, and Storybook.

## 🚀 Tech Stack

### Core

- **Next.js 15+** - App Router with RSC support
- **TypeScript** - Strict mode enabled for maximum type safety
- **React 18+** - Latest React features

### State Management & Domain Logic

- **Effect-ts** - Functional programming library for managing side effects
  - Type-safe error handling
  - Layer pattern for dependency injection
  - Effect, Context, and Schema APIs
  - No exceptions - all errors are typed

### UI & Styling

- **Shadcn UI** - Accessible, composable component system
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible primitives

### Forms & Validation

- **React Hook Form** - Performant form library
- **Effect Schema** - Runtime validation and type inference
- Clean integration with Effect where appropriate

### Testing

- **Jest** - Unit testing framework configured for Next.js
- **React Testing Library** - Component testing with best practices
- Comprehensive test coverage for:
  - UI components
  - Form behavior
  - Effect-based services

### Storybook

- **Storybook 10+** - Component development environment
- Configured for Next.js + TypeScript
- Stories for all reusable components
- Interaction testing support

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Demo page with full implementation
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── user-card.tsx    # Custom component
│   │   └── *.stories.tsx    # Storybook stories
│   └── forms/               # Form components
│       ├── UserForm.tsx     # React Hook Form example
│       └── *.stories.tsx    # Form stories
├── domain/                  # Domain models
│   └── user.ts             # User entity with Effect Schema
├── services/               # Business logic services
│   └── userService.ts      # Effect-based user service
├── effects/                # Effect-related utilities
│   └── userErrors.ts       # Typed error definitions
├── hooks/                  # Custom React hooks
│   └── useUserService.ts   # Hook bridging Effect and React
├── lib/                    # Utility functions
│   └── utils.ts           # Shadcn utilities
└── test/                   # Test utilities and helpers
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install
```

### Configuration Files

The project includes the following key configurations:

- **tsconfig.json** - TypeScript with strict mode and path aliases
- **jest.config.ts** - Jest configuration for Next.js
- **jest.setup.ts** - Test environment setup
- **.storybook/** - Storybook configuration
- **tailwind.config.ts** - Tailwind CSS customization
- **components.json** - Shadcn UI configuration

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start Next.js dev server (http://localhost:3000)

# Production
npm run build           # Build for production
npm start              # Start production server

# Testing
npm test               # Run Jest tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report

# Storybook
npm run storybook           # Start Storybook (http://localhost:6006)
npm run build-storybook     # Build Storybook for deployment

# Linting
npm run lint           # Run ESLint
```

## 📝 License

This project is set up as a learning template.

---
