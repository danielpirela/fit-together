# Together Habit Tracking

A minimalist iOS habit tracking app for couples, built with React Native + Expo and powered by Supabase.

## Project Overview

**Goal:** Help couples build better habits together through shared accountability and beautiful, native-feeling iOS UI.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native + Expo |
| **Language** | TypeScript |
| **Backend** | Supabase (Auth, Database, Realtime) |
| **Styling** | Tailwind CSS v4 via NativeWind |
| **Architecture** | Clean Architecture |
| **Design** | Apple Human Interface Guidelines |

## Architecture

```
src/
├── core/          # Domain logic, entities, use cases
├── features/      # Feature modules (auth, habits, sync)
└── shared/        # UI components, utilities, types
```

### Clean Architecture Layers

- **Core:** Pure TypeScript, no framework dependencies. Entities, repositories interfaces, use cases.
- **Features:** Feature-specific implementation. UI screens, hooks, state management.
- **Shared:** Reusable UI components, design tokens, utility functions.

## Design System

- **Typography:** SF Pro (system default on iOS)
- **Primary Colors:** Green (partner/completion), Purple (user/accent)
- **Completion Indicator:** Red for individual habit completion
- **Style:** iOS minimalist, Apple HIG compliance

## Backend Schema (Supabase)

- `users` — profile data
- `couples` — partnership linking
- `habits` — habit definitions with schedule
- `completions` — daily completion records
- `invitations` — couple invite flow

## Development Commands

```bash
npx create-expo-app@latest          # Initialize project
npm run ios                         # Run on iOS simulator
npm run android                     # Run on Android emulator
eas build                           # Build for production
```

## Getting Started

1. Clone repository
2. Run `npx create-expo-app@latest` to scaffold (already done)
3. Configure Supabase environment variables
4. Run development server

## Conventions

- Branch naming: `feat/<ticket>/<description>`
- Commit messages: `feat|fix|chore: <description>`
- Component naming: PascalCase
- Utility functions: camelCase
- Test files: `*.test.ts` co-located with source

See `docs/STACK.md` for detailed architecture documentation.