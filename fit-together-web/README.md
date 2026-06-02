# Fit Together Web

A web app for tracking habits together with your partner. Built with Vite, React, and Tailwind CSS.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Supabase:**
   
   Create a `.env` file with your Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

## Build for Production

```bash
npm run build
npm run preview
```

## Features

- 🔐 Authentication (sign up, login, password reset)
- 💑 Couple management (create, invite partner)
- ✓ Habit tracking with activity grid
- 📱 PWA installable (Add to Home Screen)
- 🎨 GSAP animations

## Tech Stack

- Vite + React 18 + TypeScript
- Tailwind CSS v4
- React Router v6
- Supabase (auth + database)
- TanStack Query
- Zustand (state management)
- GSAP (animations)
- PWA with vite-plugin-pwa
