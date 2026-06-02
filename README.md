# Fit Together

A web app for tracking habits together with your partner. Built with Vite, React, Tailwind CSS, and GSAP.

## Setup

```bash
# Install dependencies
pnpm install

# Configure Supabase (copy .env.example and fill in values)
cp .env.example .env

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Tech Stack

- **Vite** - Build tool
- **React 18** + **TypeScript** - UI
- **Tailwind CSS v4** - Styling
- **React Router v6** - Navigation
- **Supabase** - Auth + Database
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **GSAP** - Animations
- **PWA** - Installable web app

## Features

- 🔐 Authentication (sign up, login, password reset)
- 💑 Couple management (create, invite partner)
- ✓ Habit tracking with activity grid
- 📱 PWA installable (Add to Home Screen)
- 🎨 GSAP animations
