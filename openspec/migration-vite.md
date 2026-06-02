# Migration SDD: Expo → Vite + React + GSAP

## Context

Fit-Together es una app de tracking de hábitos para parejas. Stack actual:
- Expo + React Native + expo-router
- Zustand + TanStack Query
- Supabase (auth + database)
- react-native-reanimated (animaciones)

El objetivo es migrar a una PWA instalable con:
- Vite + React 18 + TypeScript
- Tailwind CSS v4
- GSAP para animaciones
- react-router-dom para navegación
- PWA con vite-plugin-pwa

---

## Migration Map

### Dependencies to REPLACE

| Expo/RN Package | Web Alternative |
|-----------------|-----------------|
| `expo-router` | `react-router-dom` v6 |
| `expo-linking` | `react-router-dom` Link component |
| `react-native-screens` | Native browser navigation |
| `react-native-safe-area-context` | CSS (`env(safe-area-inset-*)`) |
| `react-native-reanimated` | GSAP 3 |
| `@react-native-async-storage/async-storage` | `localStorage` (wrap with zustand-persist) |
| `react-native-css` / `nativewind` | Tailwind CSS vanilla |
| `expo-status-bar` | Remove (browser handles) |
| `expo-font` | Google Fonts + `@fontsource` |
| `expo-splash-screen` | PWA splash config |
| `expo-clipboard` | Clipboard API |
| `expo-web-browser` | Native browser |

### Dependencies to KEEP

- `@supabase/supabase-js`
- `@tanstack/react-query`
- `zustand` (con `zustand/middleware` para persistencia)
- `clsx`, `tailwind-merge`
- TypeScript types

### Dependencies to ADD

- `vite` + `@vitejs/plugin-react`
- `react-router-dom`
- `gsap`
- `tailwindcss` + `postcss` + `autoprefixer`
- `vite-plugin-pwa`
- `@fontsource/*` (fonts que uses)

---

## Component Migration Pattern

### Before (React Native)
```tsx
import { Pressable, Text, View, StyleSheet } from 'react-native'
import { router } from 'expo-router'

export function HabitCard({ habit }) {
  return (
    <Pressable onPress={() => router.push(`/habit/${habit.id}`)}>
      <View style={styles.container}>
        <Text>{habit.name}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' }
})
```

### After (React Web)
```tsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion' // or GSAP

export function HabitCard({ habit }) {
  return (
    <Link to={`/habit/${habit.id}`} className="block p-4 bg-white rounded-lg">
      <span>{habit.name}</span>
    </Link>
  )
}
```

---

## File Structure Transformation

```
expo structure → vite structure
─────────────────────────────────
app/               → src/pages/
  _layout.tsx      → src/App.tsx (Router)
  (tabs)/          → src/pages/(tabs)/
  auth/            → src/pages/auth/
  couple/          → src/pages/couple/
  habit/[id].tsx   → src/pages/habit/[id].tsx
  modal/           → src/pages/modal/

src/features/      → se mantiene (hooks, components)
src/stores/        → se mantiene (zustand)
src/shared/        → se mantiene (utils)
```

---

## Phases

### Phase 1: Project Scaffold
- [ ] Create new Vite project: `npm create vite@latest fit-together-web -- --template react-ts`
- [ ] Install dependencies: tailwind, gsap, react-router-dom, vite-plugin-pwa, zustand-persist
- [ ] Configure Tailwind CSS v4
- [ ] Configure Vite (aliases, PWA)
- [ ] Remove Expo/RN deps from old project (no delete, just ignore in new)

### Phase 2: Core Infrastructure
- [ ] Create src/lib/supabase-web.ts (replace AsyncStorage with localStorage)
- [ ] Create src/App.tsx with React Router
- [ ] Create src/pages/_layout.tsx (app shell with tabs)
- [ ] Create src/pages/_app.tsx (TanStack Query + auth provider)
- [ ] Copy/migrate zustand stores (add persist middleware with localStorage)

### Phase 3: Feature Pages
- [ ] Auth pages (login, sign-up, reset-password)
- [ ] Main tabs (index, habits, profile)
- [ ] Couple pages (create, invite, invitation flow)
- [ ] Habit detail page
- [ ] Modal pages (add-habit, edit-habit) → as route pages or modal overlay

### Phase 4: Components
- [ ] Migrate Button, TextInput, FormField
- [ ] Migrate HabitCard, HabitList, HabitForm
- [ ] Migrate ActivityGrid, CompletionToggle
- [ ] Migrate Toast system
- [ ] Migrate EmptyState, LoadingSpinner

### Phase 5: Animations & Polish
- [ ] Replace react-native-reanimated with GSAP
- [ ] Replace animated tab bar with GSAP/Framer Motion
- [ ] Add page transitions
- [ ] PWA manifest and icons
- [ ] Responsive design polish

### Phase 6: Testing & Deploy
- [ ] Test auth flow (sign up, login, logout)
- [ ] Test habits CRUD
- [ ] Test couple invitation flow
- [ ] Deploy to Vercel/Netlify
- [ ] Add to browser start menu (PWA install)

---

## Decision Points

1. **GSAP vs Framer Motion**: GSAP was requested. Use GSAP for page transitions and complex animations. Framer Motion is easier for simple `motion.div` animations but adds another dep.

2. **PWA vs SPA**: PWA gives "Add to Home Screen" which was the goal. Use `vite-plugin-pwa` with auto-update disabled (manual updates).

3. **Tailwind v3 vs v4**: User mentioned v4 in request. Use v4 for better performance, but check if @tailwindcss/vite plugin is stable.

4. **Routing**: Use React Router v6 nested routes matching the expo-router structure.

---

## Non-Goals

- Mobile app (stays in `mobile-down` branch)
- Native features (camera, notifications, etc.)
- Expo updates / EAS builds

---

## Success Criteria

1. [ ] App loads in browser at localhost:5173
2. [ ] Auth flow works (sign up, login, logout)
3. [ ] Habits can be created, viewed, edited
4. [ ] Couple invitation flow works
5. [ ] PWA installable from Chrome/Edge
6. [ ] App appears in system start menu after PWA install
7. [ ] Animations are smooth (60fps)
8. [ ] Lighthouse PWA score > 90
