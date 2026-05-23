# 🌌 Project VIJ (Virtual Intelligent Junction)

Welcome to **Project VIJ**, a next-generation professional networking, career mapping, and recruiting ecosystem. Built with a modern **Liquid Glass** design system, Project VIJ merges physics-based interactions with data-driven career planning.

---

## 🚀 Core Features & Modules

### 1. 🎨 Theme Customization & Personalization System
* **Gmail-Style Personalization**: A dynamic theme and layout system allowing custom wallpaper uploads, animated backgrounds, and custom color presets.
* **Instant Propagation**: Real-time styling synchronization across all pages through a global context architecture, saving parameters securely in `localStorage`.

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
* **Interactive Leaflet Globe**: Implements minimalist Leaflet maps styling online talent, recruiters, and open-to-work professionals with colored marker pulses.
* **Network Strength SVG**: Dynamic circular SVG progress meter showing connection volumes and growth rates.
* **Mobile-Responsive Nav**: Fluid layout options (Grid vs. List) and bottom action bars optimized for mobile viewports.

### 4. 🚪 3-Pane Interview Room (`/interview`)
* **Real-time Console Layout**: Features a code editor console side-by-side with an interviewer video widget and chat feeds.
* **Technical Checklists**: Toggling items adjusts checklist completion gauges in real time.

### 5. 🪙 Web3 Wallet Marketplace (`/wallet`)
* **Marketplace Hub**: Simulated transaction histories, digital currency tokens transfer interfaces, and product purchase modals.

---

## 📂 Codebase Folder Classification

To make navigation easy, project files are organized into reference folders under `src/`:

```
src/
├── components/          # Active UI/UX widgets used in live assembly
├── pages/               # Active page viewport components
├── layouts/             # Grid structures (headers, sidebars, footers)
├── context/             # Global React state context engines
├── data/                # Local mock database JSON records
├── services/            # Simulated backend API endpoints
│
├── ui/                  # [Reference] Basic UI styling (Buttons, Cards, Inputs)
├── ux/                  # [Reference] Micro-animations & Canvas Physics backgrounds
├── frontend/            # [Reference] Router page templates and Layouts
└── backend/             # [Reference] Context states, mock DBs, and API models
```

---

## 🛠️ Technology Stack

* **Framework**: React 18 + TypeScript + Vite
* **Design System**: Liquid Glassmorphism (Frosted backgrounds, glowing borders, custom shadows)
* **Animation Engine**: Framer Motion
* **Interactions**: Leaflet Maps, HTML5 Canvas API

---

## 💻 Running the Project Locally

### 1. Installation
Clone the repository and install npm packages:
```bash
npm install
```

### 2. Start Dev Server
Spin up the hot-reloading development server:
```bash
npm run dev
```

### 3. Build & Minification
Compile typescript and bundle static build assets:
```bash
npm run build
```
This command compiles modules, validates types, and outputs a minified production bundle under `dist/` with **zero errors**.
