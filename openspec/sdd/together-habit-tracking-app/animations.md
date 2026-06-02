# Together Habit Tracking — Animaciones SDD

## Visión

La app se sentirá fluida, moderna y premium. Cada interacción tendrá feedback visual con animaciones suaves que siguen las Apple Human Interface Guidelines. El movimiento es intencional, no decorativo.

## Principios de Animación

### Apple HIG Motion
- **Fluid, purposeful motion** — cada animación comunica algo
- **Continuity-focused** — mantener contexto entre pantallas
- **Parallax depth** — capas con diferentes velocidades de scroll
- **Spring physics** — Natural, no lineal
- **60 FPS mínimo** — Sin jank

### Timing
- Micro-interactions: 150-300ms
- Page transitions: 300-500ms
- Modal presentations: 350-450ms
- Celebration animations: 500-1000ms

---

## Tipo de Animaciones por Componente

### 1. Pantallas de Auth (Login, Sign Up)

#### Login Screen
```typescript
// Secuencia de entrada:
// 1. Logo aparece con scale (0.8 → 1) + opacity (0 → 1) [400ms, spring]
// 2. Título aparece [200ms delay]
// 3. Campos aparecen staggered (100ms entre cada) [slide up + opacity]
// 4. Botón aparece último [200ms delay]

// Micro-interactions:
// - Focus en input: border color + label floating animation
// - Error shake: translateX (-10 → 10 → -5 → 0) [300ms]
// - Success: checkmark scale in + confetti burst
```

#### Sign Up Screen
```typescript
// Campos staggered:
// - displayName (delay 0)
// - email (delay 100ms)
// - password (delay 200ms)
// - confirmPassword (delay 300ms)
// - submit button (delay 400ms)

// Validation animations:
// - Valid: green checkmark appears with bounce
// - Invalid: red X + shake + error message slide down
```

### 2. Couple Management

#### Create Couple Screen
```typescript
// Entrada:
// - Icono de corazones late (scale pulse 1 → 1.1 → 1) [loop]
// - Título con typewriter effect "Let's build together"
// - Input aparece con bounce

// Exito:
// -两个人的在一起的 emoji animation
// - Confetti burst
// - Transición a invite screen
```

#### Invite Partner
```typescript
// Copiar link:
// - Botón ripple effect al presionar
// - Copiado: checkmark animation + "Copied!" toast slide up
// - Toast auto-dismiss con slide down

// Aceptar invitación:
// - Partículas doradas entrando
// - "Welcome!" con scale bounce
// - Partner badge aparece con glow effect
```

### 3. Home Screen (Habit List)

#### Habit Cards
```typescript
// Lista entrance:
// - Cards aparecen staggered desde abajo (translateY 50 → 0)
// - Cada card con opacity 0 → 1
// - 50ms delay entre cards

// Card interactions:
// - Press: scale (1 → 0.98) + shadow reduce
// - Release: spring back
// - Completion: 
//   * Si ambos completaron: diagonal split fill + sparkle + haptic
//   * Si solo uno: fill animation (0 → 100%) + partner icon pulse

// Swipe to delete/archive:
// - Swipe reveals red delete zone
// - Release past threshold: card flies out + items shift up
```

#### Completion Toggle
```typescript
// Tap animation:
// 1. Circle ripple emanates from tap point
// 2. Fill animation (stroke-dashoffset)
// 3. Checkmark draws in (SVG path animation)
// 4. Haptic feedback (success)
// 5. Partner icon pulse if shared

// Partner completed notification:
// - Subtle glow pulse on card border
// - Partner avatar bounces
```

### 4. Activity Grid

#### Grid Cell Animation
```typescript
// Both completed (diagonal split):
// 1. Top-left triangle fills green (#34C759) [200ms]
// 2. Bottom-right triangle fills purple (#AF52DE) [200ms, 50ms delay]
// 3. Diagonal line sparkle travels across [300ms]
// 4. Micro particle burst at center

// Only mine completed:
// 1. Cell fills solid green from center [250ms]
// 2. Ripple effect at edges

// Only partner completed:
// 1. Cell fills solid purple from edges [250ms]
// 2. "Partner" icon fades in

// Celebration (streak achieved):
// - All cells in row do wave animation
// - Confetti falls from top
// - "🎉" emoji scales in + bounces
```

#### Grid Scroll
```typescript
// Parallax effect:
// - Day labels: fixed position
// - Grid cells: scroll with momentum
// - Month labels: fade in/out at edges
// - Background: subtle parallax

// Month change:
// - Crossfade between months
// - Month label slides out + new slides in
```

### 5. Habit Form

#### Day Selector
```typescript
// Day toggle:
// - Circle fills with color [150ms, spring]
// - Checkmark draws in
// - Row wobble if affecting count

// Target count update:
// - Number morphs (scale + color change)
// - Count indicator pulses
```

#### Color Picker
```typescript
// Selection:
// - Selected color scales up (1 → 1.2)
// - Ring around color
// - Other colors dim slightly
// - Preview card updates with color

// Presets:
// - Green (#34C759)
// - Purple (#AF52DE)
// - Blue (#007AFF)
// - Orange (#FF9500)
// - Pink (#FF2D55)
// - Teal (#5AC8FA)
```

### 6. Navigation Transitions

#### Tab Switch
```typescript
// Icon animation:
// - Active: scale (1 → 1.15) + color change
// - Inactive: scale (1.15 → 1) + dim

// Content transition:
// - Fade out current (opacity 1 → 0) [100ms]
// - Fade in new (opacity 0 → 1) [200ms]
```

#### Stack Push/Pop
```typescript
// Push:
// - New screen slides from right (translateX 100% → 0) [350ms, spring]
// - Previous screen scales down slightly (0.95) + dims
// - Back button appears with scale

// Pop:
// - Reverse of push
// - Slight overshoot at end (spring)
```

#### Modal Present
```typescript
// Present:
// - Backdrop fades in (opacity 0 → 0.5) [200ms]
// - Modal slides up from bottom (translateY 100% → 0) [350ms, spring]
// - Content inside animates stagger

// Dismiss:
// - Swipe down or tap backdrop
// - Modal slides down + fades
// - Haptic feedback (light)
```

### 7. Loading States

#### Skeleton Loading
```typescript
// Shimmer effect:
// - Gradient moves left to right [1500ms loop]
// - Subtle, not distracting

// Spinner:
// - Circular progress with gradient stroke
// - Rotation speed varies (slow → fast → slow)
```

#### Pull to Refresh
```typescript
// Pull gesture:
// - Custom spinner replaces default
// - Spinner rotates faster as pull increases
// - Release: spinner transforms to checkmark or rotates away
```

### 8. Empty States

#### No Habits
```typescript
// Ilustración flotante:
// - Gentle bob animation (translateY -5 → 5) [3s loop]
// - Parallax on scroll

// CTA button:
// - Pulse animation when visible
// - Scale 1 → 1.05 → 1 [2s loop]
```

### 9. Celebration Animations

#### Streak Achievement
```typescript
// Triggers:
// - 7 day streak
// - 30 day streak
// - First "both completed" week

// Animation sequence:
// 1. Screen dims slightly
// 2. Confetti burst from top corners
// 3. Achievement badge scales in with bounce
// 4. Particle effects around badge
// 5. "🎉" emojis bounce around edges
// 6. Haptic success pattern
// 7. Badge settles with subtle glow
```

#### Partner Joined
```typescript
// Partner badge reveal:
// 1. Badge flies in from partner's side
// 2. Photo/avatar scales in with bounce
// 3. Glow effect behind avatar
// 4. Partner name types in
// 5. "Together now!" message appears
```

### 10. Haptic Feedback Map

```typescript
// Light haptics (micro-feedback):
// - Button press
// - Toggle switch
// - Tab switch

// Medium haptics (notification):
// - Completion registered
// - Form submitted
// - Navigation action

// Heavy haptics (impact):
// - Achievement unlocked
// - Streak achieved
// - Delete confirmed

// Success pattern:
// - Light → Medium → Light (300ms)

// Error pattern:
// - Medium → Heavy (200ms)

// Selection changed:
// - Single light tap
```

---

## Animations Hooks

### use-spring-animation.ts
```typescript
// Presets for common animations
export const springPresets = {
  gentle: { damping: 15, stiffness: 100 },
  bouncy: { damping: 10, stiffness: 150 },
  smooth: { damping: 20, stiffness: 90 },
  snappy: { damping: 12, stiffness: 180 },
};

// Example: withSpring(value, springPresets.bouncy)
```

### use-entry-animation.ts
```typescript
// Staggered list entrance
// useAnimatedScrollHandler with offset calculation
// Parallax layers
```

### use-press-animation.ts
```typescript
// Scale + opacity for press states
// Ripple effect on touch
```

### use-shake.ts
```typescript
// Error shake animation
// Configurable intensity
```

### use-celebration.ts
```typescript
// Confetti burst
// Particle system
// Scale bounce sequence
```

---

## Performance Rules

1. **Always use Reanimated worklets** — no JS thread blocking
2. **Use `useAnimatedStyle` over `Animated.View`** — better performance
3. **Avoid `Animated.event` with JS callbacks** — use `useAnimatedGestureHandler`
4. **Keep animation values in `useSharedValue`** — not useState
5. **Use `expo-haptics`** for tactile feedback
6. **Test on physical device** — simulator doesn't reflect real perf

---

## Files to Create

```
src/shared/animations/
├── hooks/
│   ├── use-spring-animation.ts
│   ├── use-entry-animation.ts
│   ├── use-press-animation.ts
│   ├── use-shake.ts
│   ├── use-celebration.ts
│   └── use-parallax.ts
├── components/
│   ├── animated-button.tsx
│   ├── animated-card.tsx
│   ├── animated-input.tsx
│   ├── animated-list.tsx
│   ├── confetti-burst.tsx
│   ├── shimmer-loader.tsx
│   └── pulse-effect.tsx
└── utils/
    ├── spring-presets.ts
    └── easing.ts
```

---

## Timeline de Implementación

1. **Core hooks** (use-spring, use-entry, use-press) — 2 tasks
2. **Animated components base** (animated-button, animated-card) — 2 tasks
3. **Auth screen animations** — 1 task
4. **Home & list animations** — 2 tasks
5. **Grid cell animations** — 2 tasks
6. **Celebration animations** — 1 task
7. **Haptic integration** — 1 task

**Total: ~9 tareas de animación**