# Overview

- This document provides information about NextJS Practice
- [Documentation details](https://docs.google.com/document/d/1Vh1J5Prn2xrmbOKlUifSzCJfCGten6iHVLhoUQ_ZoFI/edit?tab=t.0#heading=h.9tvjra20jq84)

## Main app features

- Authentication with user email
- Show the user's cards and transactions on the Dashboard screen
- Sending an amount to mocking accounts
- Add the Card with two types is Virtual Card and Physical Card (Only the Physical card has the shipping address)
- Show the list of cards
- Update the user profile
- Handle Block or Activate cards

## Targets

- Apply the knowledge learned about the Next.js concept
- Build a web application that meets the requirements
- Apply Tailwind CSS to build the UI
- Apply Shadcn/ui to build the UI
- Apply unit test and storybook

## Timeline

- Estimate time: 15 days of working
- Actual time: TBD

## 🚀 Tech Stack

- [NextJS](https://nextjs.org/): A React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations.
- [React](https://reactjs.org/): A powerful JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/): TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- [Effect](https://effect.website/docs/getting-started/introduction/): Effect is a powerful TypeScript library designed to help developers easily create complex, synchronous, and asynchronous programs.
- [TailwindCSS](https://tailwindcss.com/): Tailwind CSS makes it quicker to write and maintain the code of your application
- [Jest](https://jestjs.io/docs/getting-started): Jest is a delightful JavaScript Testing Framework with a focus on simplicity
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/): The testing library family of packages helps you test UI components in a user-centric way.
- [Clerk](https://clerk.com/): Clerk offers a variety of guides to help you build and work with Clerk. These guides cover a broad range of topics, from authentication flows and user management to security, billing, and deployment.
- [Strapi](https://strapi.io/): Design your data models, generate APIs instantly, and integrate with your favorite frameworks, while leveraging AI capabilities and keeping full control of your code and hosting.

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/                  # Sign-in / sign-up pages (Clerk)
│   ├── (home)/                  # Protected pages (dashboard, cards, transactions, setting, …)
│   └── api/webhooks/route.ts    # Clerk webhook handler
├── components/
│   ├── ui/                      # Shadcn UI primitives (button, input, dialog, …)
│   ├── auth/                    # Clerk sign-in / sign-up wrappers
│   ├── Icons/                   # Custom SVG icon components
│   ├── Sidebar/                 # Navigation sidebar
│   ├── DashboardHeader/         # Top header bar
│   ├── CreditCard/              # Credit card display
│   ├── CardListItem/            # Card row in list view
│   ├── CardSetting/             # Block / activate card controls
│   ├── AddCardModal/            # Add new card modal
│   ├── QuickTransfer/           # Quick transfer widget
│   ├── RecentTransactions/      # Recent transactions list
│   ├── WeeklyActivity/          # Weekly activity chart
│   ├── BalanceHistory/          # Balance history chart
│   ├── Pagination/              # Pagination control
│   ├── AvatarProfile/           # User avatar with upload
│   ├── SettingPageContent/      # Settings page layout
│   ├── CardsPageContent/        # Cards page layout
│   ├── CardDetailsContent/      # Card detail view
│   └── UnsavedChangesModal/     # Unsaved changes confirmation dialog
├── services/                    # API service layer (all server actions)
│   ├── api.ts                   # Base HTTP client (Effect-based fetch wrapper)
│   ├── api.effect.ts            # Unified Effect error normalizer (ApiRequestError)
│   ├── cards.ts                 # getCards, getCardDetails, addCard, updateCardDetails, updateCardBalance
│   ├── cards.effect.ts          # getCardsEffect — reusable Effect for fetching cards
│   ├── transactions.ts          # getRecentTransactions, createTransaction
│   ├── transactions.effect.ts   # getRecentTransactionsEffect — reusable Effect for fetching transactions
│   ├── members.ts               # getMemberByClerkId, updateMember, uploadAvatar
│   └── transfers.ts             # sendAmount (multi-card balance check + transaction creation)
├── lib/
│   ├── effect/                  # Effect-TS runtime, HTTP helpers, retry policies
│   ├── errors/                  # Raw API error parser
│   └── utils.ts
├── hooks/                       # Custom React hooks
├── types/                       # Shared TypeScript types (card, transaction, member, …)
├── constants/                   # App-wide constants (routes, error messages, regex)
└── utils/                       # General utility helpers
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
pnpm install
```

## 📜 Available Scripts

```bash
# Development
pnpm run dev              # Start Next.js dev server (http://localhost:3000)

# Production
pnpm run build           # Build for production
pnpm start              # Start production server

# Testing
pnpm test               # Run Jest tests
pnpm run test:watch     # Run tests in watch mode
pnpm run test:coverage  # Generate coverage report

# Storybook
pnpm run storybook           # Start Storybook (http://localhost:6006)
pnpm run build-storybook     # Build Storybook for deployment

# Linting
pnpm run lint           # Run ESLint
```

## 📝 License

This project is set up as a learning purpose.

---
