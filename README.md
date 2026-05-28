# 🌌 Project VIJ (Virtual Intelligent Junction)

Welcome to **Project VIJ**, a next-generation professional networking, career mapping, and recruiting ecosystem. Built with a modern **Liquid Glass** design system, Project VIJ merges physics-based interactions with data-driven career planning.

The project has been migrated from a Vite/React SPA to **Next.js 15 (App Router)** for enhanced performance, pre-rendering, and layout control.

---

## 🚀 Core Features & Modules

### 1. 🎨 Theme Customization & Personalization System
* **Gmail-Style Personalization**: A dynamic theme and layout system allowing custom wallpaper uploads, animated backgrounds, and custom color presets.
* **Instant Propagation**: Real-time styling synchronization across all pages through a global context architecture, saving parameters securely and SSR-safely in `localStorage`.

### 2. 🗺️ Glassdoor-Inspired Career Roadmaps (`/roadmaps`)
* **Color Palette**: Highly engaging light interface styled in **Deep Teal (`#0A6E6E`)** for trust and growth, and **Coral (`#FF6B6B`)** for call-to-actions.
* **Smiley Satisfaction Gauge**: A slider representing job satisfaction indices matched to real-time text descriptions and animated smiley characters.
* **Skill Rating Cloud**: Self-assess baseline capabilities on a 1-to-5 star scale with bubble highlight feedback.
* **Pivot Explorer**: Radial node tree map utilizing SVG vector paths to connect the current role in the center with target pivots, complete with transition metrics, remote filter toggles, and a "Surprise Me" selection button.
* **Pacing Timeline**: Toggle between *Steady* and *Aggressive* pacing schedules, check off tasks, and add custom milestone items.
* **Empathy Help Panels**: Contextual expandable sections sharing quotes from community practitioners who faced similar skill blocks.
* **Mentor Voice Waveforms**: Simulates audio advice players with play/pause triggers and animated sound waveforms.
* **PDF Export**: Built-in print styling that exports a clean timeline checklist.

### 3. 🌐 Global Connections Map (`/network`)
* **Interactive Leaflet Globe**: Implements minimalist Leaflet maps styling online talent, recruiters, and open-to-work professionals with colored marker pulses. Loaded dynamically (`ssr: false`) to support SSR execution.
* **Network Strength SVG**: Dynamic circular SVG progress meter showing connection volumes and growth rates.
* **Mobile-Responsive Nav**: Fluid layout options (Grid vs. List) and bottom action bars optimized for mobile viewports.

### 4. 🚪 3-Pane Interview Room (`/interview`)
* **Real-time Console Layout**: Features a code editor console side-by-side with an interviewer video widget and chat feeds.
* **Technical Checklists**: Toggling items adjusts checklist completion gauges in real time.

### 5. 🪙 Web3 Wallet Marketplace (`/wallet`)
* **Marketplace Hub**: Simulated transaction histories, digital currency tokens transfer interfaces, and product purchase modals.

---

## 📂 Codebase Folder Structure

The project code is structured under `src/` to separate views, global states, components, and routes:

```
src/
├── app/                 # Next.js App Router (Layouts, routes, metadata)
│   ├── (main)/          # Routes wrapped in MainLayout & Footer
│   ├── (isolated)/      # Bare layout shell routes (Login, Register, Interview)
│   └── globals.css      # CSS entry imports
│
├── views/               # Page viewports (the page content rendering blocks)
├── components/          # Reusable UI/UX widgets (Buttons, Cards, Modals)
├── context/             # Global React state context engines (SSR safe)
├── data/                # Local mock database JSON records
├── custom.d.ts          # TypeScript declarations (CSS side-effects etc.)
│
├── ui/                  # [Reference] Basic UI styling templates
├── ux/                  # [Reference] Micro-animations & Canvas Physics
├── frontend/            # [Reference] Legacy SPA router page templates
└── backend/             # [Reference] Legacy SPA context states and models
```

---

## ⚙️ SSR (Server-Side Rendering) Guidelines

When building features, always keep these Next.js compatibility guidelines in mind:
1. **`localStorage` Access**: `localStorage` is not defined during server-side prerendering. Initialize state variables with default static values and load data from `localStorage` inside a client-side `React.useEffect` hook.
2. **Browser-Only Globals (Leaflet, Canvas)**: Dependencies that access `window` or `document` at import-time must be dynamically imported with `ssr: false` (e.g. using `next/dynamic`).
3. **Route Params**: Access route parameters via Next.js `useParams()`. Since param values can be `string | string[] | undefined`, always safe-cast or narrow them down to a string (e.g., `(Array.isArray(params.id) ? params.id[0] : params.id) || ''`).

---

## 🛠️ Technology Stack

* **Framework**: Next.js 15.5 + TypeScript + React 19
* **Compiler**: Turbopack (`--turbopack`)
* **Design System**: Liquid Glassmorphism (Frosted backgrounds, glowing borders, custom shadows)
* **Animation Engine**: Framer Motion
* **Interactions**: Leaflet Maps, HTML5 Canvas API

---

## 💻 Running the Project Locally

### 1. Installation
Install npm packages:
```bash
npm install --legacy-peer-deps
```

### 2. Start Dev Server
Spin up the local development server (bound to `0.0.0.0` to enable Wi-Fi networking preview on other devices):
```bash
npm run dev
```
- **Local Access**: Open [http://localhost:3000](http://localhost:3000)
- **Wi-Fi Network Access**: Open `http://<your-pc-ip>:3000`

### 3. Build & Optimization
Compile the production static build (validates types, optimizes images/scripts, compiles pages):
```bash
npm run build
```
The output compiles cleanly into static and server-rendered endpoints under `.next/`.
