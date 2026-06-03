# Fit Together

A dark-mode web app for tracking habits together with your partner. Built with Vite, React 19, Tailwind CSS v4, and GSAP. Motion-first: every interaction is choreographed to make you want to come back and log a habit.

## What's inside

- **Dark by default** — Obsidian Pulse palette applied pre-paint, no FOUC, theme tokens in `src/presentation/styles/theme.css`.
- **Motion system** — GSAP-driven entrances, page transitions, particle bursts, streak fire, partner ripple, weekly completion rings. All gated by `prefers-reduced-motion`.
- **PWA** — Installable on mobile, offline-capable shell.
- **Supabase** — Auth + Postgres + Realtime. Migrations in `supabase/migrations/`.

## Setup

```bash
# Install dependencies
pnpm install

# Configure environment (create .env.local with your Supabase project)
cat > .env.local <<EOF
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
EOF

# Apply database migrations (in Supabase SQL editor or via CLI)
# Then run:
pnpm dev
```

Visit `http://localhost:5173`. Click **Sign In** with any credentials — auth is currently bypassed for local dev (see `src/presentation/contexts/AuthContext.tsx`). You'll land in the redesigned app.

## Tech Stack

- **Vite 8** — Build tool
- **React 19** + **TypeScript 6** — UI
- **Tailwind CSS v4** — Styling (`@theme` block, no `tailwind.config.js`)
- **React Router v7** — Navigation
- **Supabase** — Auth + Database (Postgres, RLS, Realtime)
- **TanStack Query** — Data fetching
- **Zustand** — State management
- **GSAP** — Animations (including ScrollTrigger)
- **PWA** — `vite-plugin-pwa`, installable

## Architecture

```
src/
├── presentation/             # UI layer (Clean Architecture)
│   ├── components/
│   │   ├── layout/          # TabLayout (tab indicator + page transitions)
│   │   └── ui/              # Button, TextInput, Toast, EmptyState, LoadingSpinner
│   ├── pages/               # Route components
│   │   ├── auth/            # LoginPage, SignUpPage, ResetPasswordPage
│   │   ├── couple/          # CreateCouplePage, InvitePartnerPage
│   │   └── habits/          # HabitsPage, HabitDetailPage, AddHabitPage
│   ├── motion/              # GSAP setup, useReducedMotion, MotionProvider, PartnerRipple
│   ├── styles/
│   │   └── theme.css        # Obsidian Pulse tokens (17 CSS custom properties)
│   └── contexts/            # AuthContext, CoupleContext, HabitsContext
├── application/use-cases/   # Use cases (SignUp, SignIn, etc.)
├── domain/                  # Entities + repository interfaces (no framework deps)
├── infrastructure/          # Supabase client + repository implementations
└── main.tsx                 # Entry — pre-paint theme + MotionProvider
```

## Design System

| Token Group | Examples |
|---|---|
| **Surface** | `--color-bg-base`, `--color-bg-elevated`, `--color-bg-overlay` |
| **Text** | `--color-text-primary`, `--color-text-secondary`, `--color-text-muted` |
| **Accent** | `--color-accent-primary` (Obsidian Pulse), `--color-accent-secondary` |
| **Semantic** | `--color-success`, `--color-warning`, `--color-danger` |
| **Motion** | `--motion-duration-fast` (80ms), `--motion-duration-base` (200ms), `--motion-duration-slow` (400ms) |
| **Easing** | `--motion-ease-out-quart`, `--motion-ease-in-out-cubic` |

All defined in `src/presentation/styles/theme.css`. Tailwind v4 `@theme` block maps them to utility classes.

## Motion Patterns

| Pattern | When | Implementation |
|---|---|---|
| Stagger entrance | Page mount, list reveal | `gsap.from(targets, { y: 16, opacity: 0, stagger: 0.06 })` |
| Tab indicator slide | Tab switch in TabLayout | GSAP timeline on a sliding pill |
| Page transition | Route change | `useNavigationType` + slide + fade, 250ms |
| Particle burst | Habit check-in, form submit | Inline `ParticleBurst` (8 particles, 400ms) |
| Streak fire | Streak display | Inline `StreakFire` (3 tiers, flame intensity scales with streak) |
| Partner ripple | Partner action received | `<PartnerRipple />` — 3 expanding purple rings, 1200ms |
| Weekly ring | Habit detail | SVG `circle` with GSAP `attr` tween, 600ms ease-out |
| Stats counter | Home, Profile | Number count-up 0 → N, 600ms |

All gated by `useReducedMotion()` — animations shorten to 0ms or static equivalents.

## Development

```bash
pnpm dev          # Start Vite dev server
pnpm build        # TypeScript + Vite production build
pnpm preview      # Preview production build
pnpm lint         # Biome lint
pnpm lint:fix     # Biome lint with --write
```

### Auth Bypass (Temporary)

`src/presentation/contexts/AuthContext.tsx` currently sets a mock user in `initialize()` and ignores credentials in `signIn()` / `signUp()`. This is intentional during the redesign phase. To restore real Supabase auth:

1. Remove the `BYPASS:` blocks in `AuthContext.tsx`
2. Apply the trigger migration to auto-create `public.users` on `auth.users` insert
3. Disable email confirmation in Supabase dashboard, OR implement the trigger pattern

## Database

Migrations live in `supabase/migrations/`. Apply via Supabase SQL editor or `supabase db push` (requires Supabase CLI).

Current schema:
- `users` — profile mirror of `auth.users` with `couple_id` and `role`
- `couples` — pair linkage, `partner_a_id` + nullable `partner_b_id`
- `habits` — couple-scoped habits with `frequency` enum and `target_days` array
- `completions` — daily check-ins, `unique(habit_id, user_id, date)`
- `invitations` — partner invites with UUID token, 7-day expiry

All tables have RLS enabled. `is_couple_member()` helper gates couple-scoped reads/writes.
