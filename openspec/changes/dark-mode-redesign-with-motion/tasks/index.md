# Tasks Index: dark-mode-redesign-with-motion

## Cross-PR Dependency Graph

```
develop
  └── PR #1: feat/dark-mode-redesign/pr-1-design-system-foundation
        └── PR #2: feat/dark-mode-redesign/pr-2-ui-components-redesign
              └── PR #3: feat/dark-mode-redesign/pr-3-layout-and-auth
                    └── PR #4: feat/dark-mode-redesign/pr-4-home-profile-habits
                          ├── PR #5a: feat/dark-mode-redesign/pr-5a-habit-detail-celebrations
                          └── PR #5b: feat/dark-mode-redesign/pr-5b-couple-partner-ripple
```

Chain strategy: `feature-branch-chain` — each PR targets the previous PR's branch. Only the tracker branch (`develop`) merges to main at the end.

---

## Per-PR Summary

| # | Branch | ~Lines | Files | Tasks |
|---|--------|--------|-------|-------|
| #1 | `feat/dark-mode-redesign/pr-1-design-system-foundation` | 220 | theme.css, motion/gsap.ts, motion/useReducedMotion.ts, main.tsx | 7 |
| #2 | `feat/dark-mode-redesign/pr-2-ui-components-redesign` | 280 | Button, TextInput, Toast, EmptyState, LoadingSpinner, LoadingScreen | 9 |
| #3 | `feat/dark-mode-redesign/pr-3-layout-and-auth` | 380 | TabLayout, LoginPage, SignUpPage, ResetPasswordPage, InvitePage | 13 |
| #4 | `feat/dark-mode-redesign/pr-4-home-profile-habits` | 380 | HomePage, ProfilePage, HabitsPage | 16 |
| #5a | `feat/dark-mode-redesign/pr-5a-habit-detail-celebrations` | 220 | HabitDetailPage, AddHabitPage | 8 |
| #5b | `feat/dark-mode-redesign/pr-5b-couple-partner-ripple` | 180 | CreateCouplePage, InvitePartnerPage, PartnerRipple, InvitePage | 9 |
| **Total** | | **1,660** | **27 files** | **62** |

---

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 1,660 |
| Chained PRs recommended | Yes (6 chained) |
| 400-line budget risk | Low (all PRs ≤380 lines, max is PR #3 + #4 at 380 each) |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |
| Decision needed before apply | No — chain strategy and PR split confirmed in design |

Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: Low
Decision needed before apply: No

---

## Worktree / Branch Naming Convention

```
develop
  feat/dark-mode-redesign/pr-1-design-system-foundation       ← PR #1
  feat/dark-mode-redesign/pr-2-ui-components-redesign        ← PR #2 (base: PR#1)
  feat/dark-mode-redesign/pr-3-layout-and-auth               ← PR #3 (base: PR#2)
  feat/dark-mode-redesign/pr-4-home-profile-habits           ← PR #4 (base: PR#3)
  feat/dark-mode-redesign/pr-5a-habit-detail-celebrations     ← PR #5a (base: PR#4)
  feat/dark-mode-redesign/pr-5b-couple-partner-ripple         ← PR #5b (base: PR#4, parallel with #5a)
```

Branch naming: `feat/dark-mode-redesign/pr-{N}-{slug}` — N is sequential in chain, slug is kebab-case PR name.

---

## Commit Strategy Per PR

| PR | Commits | Reason |
|----|---------|--------|
| #1 | 1 (atomic) | Reversible via `git revert`; isolated foundation |
| #2 | 1 (atomic) | UI components API surface should be single commit |
| #3 | 2 (`TabLayout` then `auth pages`) | Layout chrome logically distinct from auth pages |
| #4 | 3 (Home, Profile, Habits each separate) | Three pages, three separate concerns, parallelizable |
| #5a | 1 (atomic) | Tightly coupled via ParticleBurst + cascade |
| #5b | 1 (atomic) | PartnerRipple primitive + couple pages together |

No PR requires more than 3 commits. PRs #1, #2, #5a, #5b are single-commit.

---

## Spec Coverage Per PR

| PR | Specs Consumed |
|----|----------------|
| #1 | design-system-tokens, motion-system (foundation) |
| #2 | ui-components |
| #3 | layout-chrome, auth-flow |
| #4 | home-dashboard, user-profile, habits-listing |
| #5a | habit-detail, habit-creation, habit-celebrations |
| #5b | couple-flow, habit-detail (PartnerRipple), auth-flow (InvitePage) |

---

## Implementation Order

PR #1 MUST complete before any other PR (all PRs consume theme.css + motion primitives).
PRs #5a and #5b can be reviewed in parallel (both base on PR #4, independent scopes).
PR #4 (HomePage + ProfilePage + HabitsPage) is the integration milestone — all previous PRs feed into it.

---

## Next Step

Ready for `sdd-apply`. The orchestrator should begin with PR #1 (isolated, reversible, 220 lines).
PRs #5a and #5b can be prepared in parallel once PR #4 is merged.