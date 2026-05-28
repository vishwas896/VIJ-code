# 🌌 Project VIJ – Frontend Architecture Blueprint & Development Workflow

This blueprint defines the architecture, component specifications, state management, theming engine, and development workflows for the Next.js 15 App Router migration of Project VIJ.

---

## 🧱 1. Project Directory Structure

The project follows a modular, route-decoupled directory layout. Core business logic is contained in `src/views/` (composed pages) and `src/components/` (reusable UI elements), while route mappings are declared in `src/app/`:

```
src/
├── app/                         # Next.js App Router (file-based routing)
│   ├── (main)/                  # Shared layout main pages (authenticated/standard)
│   │   ├── layout.tsx           # MainLayout: Header, Sidebar, Footer wrapper
│   │   ├── page.tsx             # Public Landing viewport route
│   │   ├── about/
│   │   ├── companies/
│   │   ├── company/
│   │   ├── contact/
│   │   ├── employees/
│   │   ├── jobs/
│   │   ├── learning-center/
│   │   ├── network/
│   │   ├── news/
│   │   ├── notifications/
│   │   ├── onboarding/
│   │   ├── policy/
│   │   ├── profile/
│   │   ├── recruiter/
│   │   ├── roadmaps/
│   │   ├── salary-insights/
│   │   ├── seeker/
│   │   ├── services/
│   │   ├── settings/
│   │   └── terms/
│   ├── (isolated)/              # Pages without the shared MainLayout
│   │   ├── login/
│   │   ├── register/
│   │   └── interview/
│   ├── layout.tsx                # Root layout: Providers, globals.css wrapper
│   ├── globals.css               # Imports main styling index
│   └── css.d.ts                  # Type declarations for CSS imports
│
├── views/                       # Composed page viewports (e.g., SeekerDashboard, Roadmaps)
├── components/                  # Reusable UI component modules
│   ├── services/                # Services page components (Bento cards, FAQ, pricing)
│   ├── footer/                  # Collapsible multi-device footer
│   ├── GlassButton.tsx          # Frosted glass action button
│   ├── GlassCard.tsx            # Frosted glass panel
│   ├── PageTransition.tsx       # Smooth framer-motion router transitions
│   └── ...                      # Logo, Matchers, and theme selector components
│
├── context/                     # Global React state context engines (SSR safe)
│   ├── ThemeContext.tsx         # Theme presets, custom wallpaper styling
│   ├── AuthContext.tsx          # Session authentication, wallet balance
│   ├── CurrencyContext.tsx      # Location-based dynamic pricing formatter
│   └── RoadmapContext.tsx       # Pivot timeline paths and checklists
│
├── data/                        # Local mock database JSON records
│   └── servicesData.json
│
├── custom.d.ts                  # Global TypeScript declaration overrides
│
├── ui/                          # [Reference] Legacy SPA styling presets
├── ux/                          # [Reference] Legacy SPA micro-animations
├── frontend/                    # [Reference] Legacy SPA routing pages
└── backend/                     # [Reference] Legacy SPA context states
```

---

## 🎨 2. Design System: Liquid Glass & Theming

Project VIJ implements a custom **Liquid Glass** aesthetic. Theming is controlled dynamically via React Context coupled with CSS custom variables declared in `src/index.css`.

### Theming Flow
```
[ThemeContext] (Manages dark mode, presets, and font scales)
      ↓ (Injects CSS variables into :root on mount/updates)
[index.css / globals.css] (Stores global styles, blur animations, variables)
      ↓ (Injected into styling classes)
[React Components] (Render glass panels using CSS var(--glass-bg), var(--glass-border))
```

### Key Custom Styling Properties (`src/index.css`):
```css
:root {
  --glass-bg: rgba(10, 110, 110, 0.05); /* Light Mode Frost */
  --glass-border: rgba(10, 110, 110, 0.15);
  --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.08);
  --accent-azure: #0ea5e9;
  --accent-teal: #0a6e6e;
  --accent-coral: #ff6b6b;
  --font-title: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Inter', sans-serif;
}

[data-theme="dark"] {
  --glass-bg: rgba(255, 255, 255, 0.02); /* Dark Mode Frost */
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

---

## 🧩 3. Reusable Component Specifications

### a. `GlassCard.tsx` (Frosted Container)
- **Design**: Frosted translucent backgrounds with blur filters (`backdrop-filter: blur(24px)`), light-enhancing outer borders, and custom shadows.
- **Interactions**: Soft hover scales and hover box-shadow glows. Uses Framer Motion for elegant entrance animations.
- **SSR Warning**: Avoid utilizing hardware-heavy CSS blurs inside full-page overlays on mobile viewports to prevent GPU processing freezes.

### b. `EcosystemDiagram.tsx` & `PivotExplorer.tsx`
- **Design**: Inline-rendered SVG vector networks mapping connections, job roles, and career pivots.
- **Micro-Interactions**: Dynamic color shifts along paths based on hover states and pulsing node endpoints.
- **SSR Warning**: Geolocation nodes and viewport calculations are checked inside client effects to prevent server mismatches.

### c. `ConnectionMap.tsx` (Leaflet Maps wrapper)
- **Design**: A leaflet-based map plotting remote networking nodes.
- **Micro-Interactions**: Pulse marker classes matching online status (Online = Blue, Recruiter = Purple, Open To Work = Green).
- **SSR Warning**: Leaflet depends heavily on browser window globals. It must be dynamically imported under Next.js:
  ```typescript
  const ConnectionMap = dynamic(() => import('./ConnectionMap'), { ssr: false });
  ```

---

## 🔁 4. Global State & Hydration Architecture

Global contexts are designed to support server pre-rendering. They initialize with stable, server-compatible mock details and rehydrate configurations inside client-side mounts.

| Context | Scope | Hydration Strategy |
| :--- | :--- | :--- |
| **`ThemeContext`** | User wallpaper presets, dark modes, and theme adjustments. | Sets standard default styles on server; loads custom browser settings in a `useEffect` interval loop. |
| **`AuthContext`** | User verification, session authentication, and Web3 wallet balances. | Default state initialized to guest/unlogged; updates to active session settings from `localStorage` once mounted on client. |
| **`CurrencyContext`** | Dynamic product pricing formatters. | Defaults statically to `'INR'`; detects user currency via IP geolocation API or browser timezone preferences on client side. |
| **`RoadmapContext`** | Navigation timelines and milestone checklists. | Default timeline arrays; loads checklist check states from `localStorage` on mounting. |

---

## 💻 5. Running the Project Locally

### 1. Installation
Install project dependencies:
```bash
npm install --legacy-peer-deps
```

### 2. Start Dev Server
Launch the Next.js development server (using standard Webpack to ensure Windows file sync stability):
```bash
npm run dev
```
- **Local host**: [http://localhost:3000](http://localhost:3000)
- **Local Network Access**: `http://<your-pc-ip>:3000` (accessible from multiple devices connected to the same Wi-Fi network).

### 3. Production Build Compilation
Compile the static build output:
```bash
npm run build
```
This runs TypeScript checking, compiles all pages, and builds static page chunks under `.next/` with **zero errors**.
