# VIJ Platform — Change Log & Technical Documentation

> **Project**: Virtual Intelligent Junction (VIJ)  
> **Version**: 2.0 — "Every Click a Breeze" UI/UX Overhaul  
> **Last Updated**: 2026-05-08  
> **Stack**: React 19 · TypeScript 6 · Vite 8 · Framer Motion 12 · Lucide Icons

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Architecture](#2-architecture)
3. [Design System](#3-design-system)
4. [Component Registry](#4-component-registry)
5. [Page Registry](#5-page-registry)
6. [Routing Map](#6-routing-map)
7. [Change Log](#7-change-log)
8. [Known Issues](#8-known-issues)

---

## 1. Platform Overview

VIJ is a skill-based hiring ecosystem that acts as a neutral mediator between job seekers and recruiters. Core principles:

- **100% Parameter Match** — No approximations; candidates must meet every requirement.
- **VIJ Mediation** — PII stays hidden until both parties agree and payment is made.
- **Liquid Glass Design** — Glassmorphism UI with `backdrop-filter`, spring physics, and micro-interactions.

### Key Features

| Module | Description |
|---|---|
| Public Landing | Scroll-driven storytelling with animated stats, trending carousel, tech marquee |
| Explore | LinkedIn-style job discovery with sidebar filters and live ticker |
| Interview Room | 3-pane layout: video, chat, and candidate profile |
| Social Hub (News) | Feed of industry posts, trending tags, and connection suggestions |
| Roadmaps | Deep-dive career journeys with timeline, routine, and struggle sections |
| Services | Marketplace for courses, skill assessments, and premium services |
| Wallet | VIJ coin balance, top-up, and transaction history |
| Global Network | Interactive map showing professional connections worldwide |
| Recruiter Suite | Dashboard, job creation, candidate pipeline management |

---

## 2. Architecture

```
src/
├── App.tsx                  # Root router — AnimatePresence + route config
├── index.css                # Global design tokens and reset
├── main.tsx                 # React DOM entry point
│
├── context/
│   ├── AuthContext.tsx       # Auth state: user, wallet, login/logout/register
│   └── CurrencyContext.tsx   # Multi-currency formatting (USD, EUR, GBP, INR, JPY)
│
├── layouts/
│   ├── MainLayout.tsx        # Global shell: header, nav, footer, LiquidBackground
│   └── MainLayout.css
│
├── components/              # 28 reusable UI components (see Section 4)
│   ├── GlassCard.tsx/.css
│   ├── GlassButton.tsx/.css
│   ├── MagneticElement.tsx
│   ├── ScrollReveal.tsx
│   ├── AnimatedCounter.tsx
│   ├── IntelligentGaze.tsx
│   ├── PageTransition.tsx
│   ├── LiquidBackground.tsx/.css
│   ├── GuestBanner.tsx/.css
│   ├── VijLogo.tsx/.css
│   └── ... (14 more)
│
└── pages/                   # 30+ page components (see Section 5)
    ├── PublicLanding.tsx/.css
    ├── Explore.tsx/.css
    ├── SocialHub.tsx/.css
    └── ...
```

### State Management

| Context | Scope | Key Values |
|---|---|---|
| `AuthContext` | Global | `user`, `walletBalance`, `isAuthenticated`, `login()`, `logout()`, `purchaseItem()` |
| `CurrencyContext` | Global | `currency`, `setCurrency()`, `formatCurrency()` |

### Routing Strategy

- **Isolated routes** (`/register`, `/login`, `/interview/:id`) render without `MainLayout`
- **All other routes** are nested under `MainLayout` which provides header, nav, footer, and `LiquidBackground`
- `AnimatePresence` with `mode="wait"` handles page transitions

---

## 3. Design System

### 3.1 Color Palette

| Token | Value | Usage |
|---|---|---|
| `--vij-bg` | `#FAFAFC` | Page background |
| `--vij-text-main` | `#18181b` | Primary text |
| `--vij-text-muted` | `#52525b` | Secondary text |
| `--accent-azure` | `#dc2626` | Primary accent (red — "Intelligent Vision") |
| `--accent-azure-glow` | `rgba(220,38,38,0.2)` | Glow effects |
| `--accent-gold` | `#f59e0b` | Premium/highlight accent |
| `--accent-emerald` | `#10b981` | Success/positive accent |
| `--glass-white` | `rgba(255,255,255,0.8)` | Glass panel background |
| `--glass-border` | `rgba(255,255,255,0.6)` | Glass panel border |

### 3.2 Mesh Gradient Orbs

| Token | Value | Orb Position |
|---|---|---|
| `--mesh-grad-1` | `#fee2e2` | Top-left, 50vw |
| `--mesh-grad-2` | `#fff7ed` | Bottom-right, 60vw |
| `--mesh-grad-3` | `#f8fafc` | Center, 40vw |
| `--mesh-grad-4` | `#fef3c7` | Top-right, 35vw (warm depth) |

### 3.3 Typography

- **Font Family**: `Outfit` (Google Fonts) — weights 300-900
- **Body Size**: `clamp(14px, 1.5vw, 16px)` — fluid scaling
- **Hero Title**: `clamp(44px, 8vw, 80px)` with `letter-spacing: -3.5px`

### 3.4 Spacing & Radius

| Token | Value |
|---|---|
| `--radius-sm` | `8px` |
| `--radius-md` | `16px` |
| `--radius-lg` | `24px` |
| `--radius-pill` | `9999px` |

### 3.5 Animation Tokens

| Token | Value | Usage |
|---|---|---|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Primary deceleration curve |
| `--ease-out-back` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Overshoot for playful elements |
| `--ease-spring` | `cubic-bezier(0.22, 1, 0.36, 1)` | General spring approximation |
| `--duration-instant` | `100ms` | Immediate feedback |
| `--duration-fast` | `200ms` | Hover states |
| `--duration-normal` | `350ms` | Standard transitions |
| `--duration-slow` | `500ms` | Page-level animations |
| `--duration-glacial` | `800ms` | Dramatic reveals |

### 3.6 Accessibility

- `::selection` styled with brand red at 15% opacity
- `:focus-visible` ring: 2px solid accent, 3px offset
- `@media (prefers-reduced-motion: reduce)` disables all animations
- Custom thin scrollbar (6px) with hover state

---

## 4. Component Registry

### 4.1 Animation Primitives (NEW)

#### `MagneticElement.tsx`
Wrapper that pulls children toward cursor on hover.

| Prop | Type | Default | Description |
|---|---|---|---|
| `strength` | `number` | `0.2` | Pull intensity (0.1 subtle → 0.5 strong) |
| `as` | `'div' \| 'span' \| 'button'` | `'div'` | Rendered HTML element |

**How it works**: Tracks mouse position relative to element center, calculates offset × strength, applies via `useSpring` for smooth deceleration.

---

#### `ScrollReveal.tsx`
Viewport-triggered entrance animation.

| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Slide direction |
| `delay` | `number` | `0` | Animation delay in seconds |
| `distance` | `number` | `40` | Slide distance in pixels |
| `duration` | `number` | `0.7` | Animation duration |
| `once` | `boolean` | `true` | Only animate on first view |

**How it works**: Uses `useInView` with `-60px` margin to trigger opacity+translate animation using expo-out easing.

---

#### `AnimatedCounter.tsx`
Spring-physics counter that counts to target value when entering viewport.

| Prop | Type | Default | Description |
|---|---|---|---|
| `target` | `number` | — | Target number to count to |
| `prefix` | `string` | `''` | Text before number (e.g. "$") |
| `suffix` | `string` | `''` | Text after number (e.g. "%") |
| `duration` | `number` | `2` | Spring duration in seconds |
| `decimals` | `number` | `0` | Decimal places |

**How it works**: Sets `useMotionValue` to target when in view; `useSpring` animates the value; a `change` listener updates `textContent` directly for performance (no React re-renders during counting).

---

### 4.2 Core UI Components (UPGRADED)

#### `GlassCard.tsx` + `GlassCard.css`
Glassmorphism card with 3D tilt and cursor-following spotlight.

| Prop | Type | Default | Description |
|---|---|---|---|
| `glowingEdge` | `'azure' \| 'gold' \| 'none'` | `'none'` | Animated border glow variant |
| `tilt` | `boolean` | `true` | Enable/disable 3D tilt on hover |

**Features added**:
- ±4° 3D tilt using `rotateX`/`rotateY` with spring physics (perspective: 800px)
- Cursor-following spotlight: `radial-gradient` positioned at mouse coordinates
- Shimmer border animation on glow variants (traveling highlight via `-webkit-mask-composite`)
- Pulsing gold glow keyframe for `glow-gold` variant
- `will-change: transform` for GPU acceleration

---

#### `GlassButton.tsx` + `GlassButton.css`
Interactive button with magnetic hover, click ripple, and loading state.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | Visual style |
| `icon` | `ReactNode` | — | Leading icon |
| `loading` | `boolean` | `false` | Show spinner, disable interaction |

**Features added**:
- Magnetic hover: button shifts 15% of cursor-to-center distance via springs
- Click ripple: DOM `<span>` injected at click coordinates, expands to 25× scale, fades out in 600ms
- Tactile tap: `scale(0.96)` + `rotate(-0.5deg)` for "press" feel
- Loading state: CSS spinner, `pointer-events: none`, reduced opacity

---

#### `IntelligentGaze.tsx`
Animated eye pair that tracks cursor, blinks, and idles.

**Features added**:
- **Pupil tracking**: Follows cursor angle with max 12px radius, spring-smoothed
- **Pupil constriction**: Shrinks 20% when cursor is within 500px
- **Periodic blinking**: Random 3-6s interval, 150ms eyelid animation
- **Idle mode**: After 3s of no movement, pupils drift with slow random floats
- **Red core glow**: Pulsing `#ef4444` circle with blur, opacity 0.6→0.9→0.6 over 2s

---

#### `PageTransition.tsx`
Route transition wrapper with directional support.

| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | `'up' \| 'left' \| 'right'` | `'up'` | Entry slide direction |

**Animation sequence**: `blur(6px)` → `scale(0.98)` → `opacity(0)` → target state, using spring physics (stiffness: 260, damping: 22).

---

#### `LiquidBackground.tsx` + `LiquidBackground.css`
Full-viewport animated mesh gradient background.

**Configuration**: 4 orbs with different sizes, positions, colors, and animation durations (20-28s). Each orb translates and scales independently. Fixed position, 100px blur, 35% opacity. Content layer at `z-index: 10`.

---

#### `GuestBanner.tsx` + `GuestBanner.css`
Auto-dismissing conversion banner for unauthenticated users.

**Features added**:
- Breathing glow border: gradient sweep + opacity pulse (3s cycle)
- Pulsing icon ring shadow (2s cycle)
- Sparkle icon rotation animation
- Spring-physics CTA hover
- 5-second countdown timer bar
- Auto-dismiss after 5 seconds

---

### 4.3 Other Components

| Component | Description |
|---|---|
| `VijLogo.tsx/.css` | Animated SVG logo with letter-by-letter brand text |
| `BackExploreBar.tsx/.css` | Contextual "back to explore" breadcrumb |
| `CurrencySelector.tsx/.css` | Dropdown for switching display currency |
| `FloatingMessenger.tsx` | Bottom-right chat widget |
| `NotificationDropdown.tsx` | Bell icon dropdown with notification list |
| `ExperienceForm.tsx/.css` | Onboarding experience entry form |
| `AutocompleteDropdown.tsx/.css` | Type-ahead search dropdown |
| `CompanyMatcher.tsx` | Company suggestion engine |
| `ProtectedRoute.tsx` | Auth guard for wallet routes |
| `Placeholder.tsx` | Loading skeleton component |

---

## 5. Page Registry

### Public Pages

| Page | Route | File | Description |
|---|---|---|---|
| Landing | `/` | `PublicLanding.tsx` | Hero + stats + Why VIJ + trending + marquee + CTA |
| Explore | `/explore` | `Explore.tsx` | Job discovery with sidebar, filters, live ticker |
| Tag Explorer | `/explore/tags/:tagId` | `TagExplorer.tsx` | Drill into specific skill/tag |
| News (Social Hub) | `/news` | `SocialHub.tsx` | Industry feed, trending tags, connections |
| Roadmaps | `/roadmaps` | `Roadmaps.tsx` | Career journey discovery + deep-dive |
| Services | `/services` | `Services.tsx` | Courses, assessments, premium services marketplace |
| Network | `/network` | `GlobalNetwork.tsx` | Interactive world map of connections |
| About | `/about` | `About.tsx` | Company info, founder profiles |
| Policy | `/policy` | `Policy.tsx` | Privacy policy and terms |
| Contact | `/contact` | `Contact.tsx` | Support contact form |

### Auth Pages (Isolated — no MainLayout)

| Page | Route | File |
|---|---|---|
| Login | `/login` | `Auth.tsx` |
| Register | `/register` | `Auth.tsx` |
| Interview | `/interview/:interviewId` | `InterviewRoom.tsx` |

### Protected Pages

| Page | Route | File |
|---|---|---|
| Wallet | `/wallet` | `Wallet.tsx` |
| Payment | `/wallet/checkout/:candidateId` | `PaymentGateway.tsx` |

### Seeker Pages

| Page | Route | File |
|---|---|---|
| Onboarding | `/onboarding/parameters` | `Onboarding.tsx` |
| Roadmap Builder | `/onboarding/roadmap-builder` | `RoadmapBuilder.tsx` |
| Dashboard | `/seeker/dashboard` | `SeekerDashboard.tsx` |
| Profile | `/profile/:username` | `PublicProfile.tsx` |

### Recruiter Pages

| Page | Route | File |
|---|---|---|
| Onboarding | `/recruiter/onboarding` | `recruiter/RecruiterOnboarding.tsx` |
| Dashboard | `/recruiter/dashboard` | `recruiter/RecruiterDashboard.tsx` |
| Post Job | `/recruiter/jobs/create` | `recruiter/RecruiterJobsCreate.tsx` |
| Pipeline | `/recruiter/jobs/:jobId` | `recruiter/RecruiterJobPipeline.tsx` |
| Profile | `/recruiter/profile` | `recruiter/RecruiterProfile.tsx` |

---

## 6. Routing Map

```
/                           → PublicLanding (redirects to /news if authenticated)
├── /explore                → Explore
│   └── /explore/tags/:id   → TagExplorer
├── /news                   → SocialHub
├── /roadmaps               → Roadmaps
├── /network                → GlobalNetwork
│   ├── /network/connections → NetworkChat
│   └── /network/messages    → NetworkChat
├── /services               → Services
├── /wallet          [AUTH]  → Wallet
│   └── /wallet/checkout/:id → PaymentGateway
├── /profile/:username       → PublicProfile
├── /onboarding/parameters   → Onboarding
├── /onboarding/roadmap-builder → RoadmapBuilder
├── /seeker/dashboard        → SeekerDashboard
├── /recruiter/*             → Recruiter Suite
├── /about                   → About
├── /policy                  → Policy
├── /contact                 → Contact
├── /login           [ISOLATED] → Auth
├── /register        [ISOLATED] → Auth
└── /interview/:id   [ISOLATED] → InterviewRoom
```

---

## 7. Change Log

### v2.0 — "Every Click a Breeze" (2026-05-06 → 2026-05-08)

#### NEW Files Created
| File | Purpose |
|---|---|
| `src/components/MagneticElement.tsx` | Cursor-pull animation wrapper |
| `src/components/ScrollReveal.tsx` | Viewport-triggered entrance animations |
| `src/components/AnimatedCounter.tsx` | Spring-physics counting animation |

#### MODIFIED Files — Component Upgrades
| File | Changes |
|---|---|
| `src/components/GlassCard.tsx` | Added 3D tilt, spotlight gradient, shimmer border |
| `src/components/GlassCard.css` | Spotlight overlay, glow variants, shimmer keyframes |
| `src/components/GlassButton.tsx` | Added magnetic hover, click ripple, loading state |
| `src/components/GlassButton.css` | Ripple keyframes, spinner, danger variant |
| `src/components/IntelligentGaze.tsx` | Added blinking, pupil constriction, idle float, red core |
| `src/components/PageTransition.tsx` | Added directional slide, blur→scale→opacity layered reveal |
| `src/components/LiquidBackground.tsx` | Added 4th orb, scale pulsing |
| `src/components/LiquidBackground.css` | New orb-4 styles |
| `src/components/GuestBanner.tsx` | Added breathing glow, sparkle rotation, spring CTA |
| `src/components/GuestBanner.css` | Breathing glow keyframes, improved transitions |

#### MODIFIED Files — Page Redesigns
| File | Changes |
|---|---|
| `src/pages/PublicLanding.tsx` | Full redesign: hero, stats bar, Why VIJ, trending carousel, tech marquee, final CTA |
| `src/pages/PublicLanding.css` | Complete new stylesheet for all landing sections |
| `src/layouts/MainLayout.tsx` | Scroll-aware header, sliding nav indicator (`layoutId`), wallet pulse animation |
| `src/layouts/MainLayout.css` | `.header-scrolled` state, `.nav-indicator`, `.wallet-pulse` keyframes |

#### MODIFIED Files — Bug Fixes
| File | Fix |
|---|---|
| `src/pages/RoadmapBuilder.tsx` | Removed unused `AnimatePresence`; fixed `type: 'spring' as const` |
| `src/pages/Roadmaps.tsx` | Removed unused `useEffect`, `Clock` imports |
| `src/pages/SeekerDashboard.tsx` | Removed unused `MapPin`, `FileText` imports |
| `src/pages/Services.tsx` | Removed 7 unused imports; changed `variant="outline"` → `"secondary"` |
| `src/pages/SocialHub.tsx` | Prefixed unused `topDiscussions` with underscore |
| `src/pages/RecruiterPostJob.tsx` | Fixed `type: 'spring' as const` variant type error |
| `src/pages/InterviewRoom.tsx` | Removed unused `Phone` import |

#### MODIFIED Files — Design System
| File | Changes |
|---|---|
| `src/index.css` | Added animation tokens, fluid typography, reduced-motion support, custom scrollbar, selection styling, focus-visible ring |

### v1.0 — Initial Platform Build (2026-04-18 → 2026-05-02)

- Full SPA architecture with React Router
- Liquid Glass design system
- 30+ pages implemented
- AuthContext and CurrencyContext
- Framer Motion page transitions
- Interactive global network map
- 3-pane interview room
- Wallet and payment system

---

## 8. Known Issues

| Issue | File | Severity | Notes |
|---|---|---|---|
| Missing `GlassCard` reference | `Onboarding.tsx:227,232` | Build Error | Import missing; pre-existing |
| Unused `Marketplace` import | `App.tsx:19` | Warning | Pre-existing |
| `Variants` type errors | `VijLogo.tsx`, `PublicProfile.tsx` | Build Error | Framer Motion type strictness; pre-existing |
| `ReactNode` type import | `AuthContext.tsx`, `CurrencyContext.tsx` | Warning | Needs `type` import for `verbatimModuleSyntax` |
| Unused imports | `FloatingMessenger.tsx`, `NotificationDropdown.tsx`, `Auth.tsx`, `Explore.tsx` | Warning | Pre-existing; cosmetic |

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.4 | UI framework |
| `react-dom` | ^19.2.4 | DOM rendering |
| `react-router-dom` | ^7.14.1 | Client-side routing |
| `framer-motion` | ^12.38.0 | Animation engine (springs, gestures, layout) |
| `lucide-react` | ^1.8.0 | Icon library |
| `leaflet` | ^1.9.4 | Interactive maps (Global Network) |
| `d3-geo` | ^3.1.1 | Geographic projections |
| `canvas-confetti` | ^1.9.4 | Celebration effects |
| `rss-parser` | ^3.13.0 | News feed parsing |
| `lodash` | ^4.18.1 | Utility functions |
| `vite` | ^8.0.4 | Build tool / dev server |
| `typescript` | ~6.0.2 | Type checking |

---

*Document generated for Virtual Intelligent Junction (VIJ) — Founded by Vishwas Shandilya & Ranveer Pandey*
