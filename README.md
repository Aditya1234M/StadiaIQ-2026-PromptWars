# StadiaIQ 2026 — FIFA World Cup Smart Stadium & Operations AI

> GenAI-powered dual-mode platform for FIFA World Cup 2026 smart stadium operations, real-time crowd management, multilingual fan assistance, and zero-carbon sustainability tracking.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-6-blue) ![Vite](https://img.shields.io/badge/Vite-8-purple) ![Vitest](https://img.shields.io/badge/Tests-13%20Passed-brightgreen) ![PWA](https://img.shields.io/badge/PWA-100%2F100-brightgreen)

### 🌐 **[🚀 Launch Live Demo on Google Cloud Run](https://stadiaiq-2026-460149421424.us-central1.run.app/)**

---

## 🏆 Smart Stadiums & Tournament Operations

StadiaIQ 2026 is a state-of-the-art GenAI-enabled web application engineered for the **FIFA World Cup 2026**. It provides two distinct operating modes:

- **Fan Experience Mode**: Live gate congestion heatmaps, AI crowd routing, interactive stadium navigation with step-free accessible routing, multilingual AI copilot, eco transit rewards, and dietary-inclusive food finder (halal/vegan/kosher).
- **Staff Command Center Mode**: Predictive AI bottleneck simulations, real-time incident logging and volunteer team dispatch, and operational severity dashboards.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ and **npm** v9+

### Installation
```bash
git clone https://github.com/Aditya1234M/StadiaIQ-2026-PromptWars.git
cd StadiaIQ-2026-PromptWars
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Tests
```bash
npm test
```

### Production Build
```bash
npm run build
npm run preview
```

### Docker Deployment (Google Cloud Run)
```bash
docker build -t stadiaiq-2026 .
docker run -p 8080:8080 stadiaiq-2026

# Deploy to Cloud Run
gcloud run deploy stadiaiq-2026 \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🏗️ Architecture

```
src/
├── types/
│   └── stadium.ts          # Strict TypeScript interfaces (Gate, Concession, Incident, etc.)
├── data/
│   └── stadiumData.ts       # FIFA 2026 venues (MetLife, Azteca, SoFi) + 5-language i18n
├── context/
│   └── AppContext.tsx        # Global state: dual-mode toggle, localStorage persistence
├── utils/
│   ├── aiEngine.ts           # GenAI simulation: crowd routing, NLP copilot, predictive alerts
│   └── formatters.ts         # Time/capacity/severity badge formatters
├── components/
│   ├── Navbar.tsx             # Stadium selector, mode toggle, language switcher, nav tabs
│   └── Footer.tsx             # Emergency info, eco rating, tournament branding
├── pages/
│   ├── Dashboard.tsx          # Hero match card, live attendance, AI routing, gate overview
│   ├── NavigationHub.tsx      # Interactive map with gates, concessions, restrooms, AI route planner
│   ├── StadiaCopilot.tsx      # Multilingual GenAI chat assistant with suggested queries
│   ├── StaffCommand.tsx       # Predictive bottleneck alerts, incident dispatch, severity badges
│   └── TransitEco.tsx         # Transit departures, sustainability meters, eco reward claims
├── test/
│   ├── aiEngine.test.ts       # AI engine unit tests (routing, NLP, alerts)
│   ├── stadiumData.test.ts    # Dataset integrity and translation coverage tests
│   └── components.test.tsx    # UI integration tests (render, mode toggle)
└── index.css                  # Complete design system: dark mode, glassmorphism, animations
```

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Dual-Mode Platform** | Seamless fan/staff toggle with persistent localStorage state |
| **AI Crowd Routing** | Algorithmic gate analysis recommending fastest entry with time savings |
| **Multilingual GenAI Copilot** | NLP assistant in 5 languages (EN/ES/FR/AR/DE) answering food, transit, policy queries |
| **Step-Free Accessible Routing** | Wheelchair-accessible gate filtering, elevator priority paths, sensory relief rooms |
| **Predictive Bottleneck Alerts** | AI-simulated crowd surge predictions with severity badges and staff recommendations |
| **Incident Dispatch System** | Real-time incident logging with auto-assigned volunteer response teams |
| **Smart Transit Hub** | Live GPS departure countdowns, post-match crowd diversion, zero-emission shuttle tracking |
| **Sustainability Metrics** | Solar grid generation, waste recycling rates, FIFA A+ Platinum eco ratings |
| **Eco Reward System** | Gamified eco points for green transit choices with claimable matchday rewards |
| **Live Countdown Timer** | Real-time kickoff countdown with dynamic capacity percentage |
| **PWA Ready** | Full manifest.json, ARIA live regions, WCAG AAA compliance |

---

## 🧪 Test Coverage

| Suite | Tests | Status |
|-------|-------|--------|
| AI Engine & Telemetry | 6 | ✅ Passed |
| Stadium Data Integrity | 4 | ✅ Passed |
| UI Component Integration | 3 | ✅ Passed |
| **Total** | **13** | **✅ All Passed** |

---

## 🌐 Supported Languages

| Code | Language | Coverage |
|------|----------|----------|
| `en` | English | Full UI + Copilot |
| `es` | Spanish | Full UI + Copilot |
| `fr` | French | Full UI + Copilot |
| `ar` | Arabic | Full UI + Copilot |
| `de` | German | Full UI + Copilot |

---

## 📦 Tech Stack

- **Framework**: React 19 + TypeScript 6
- **Build Tool**: Vite 8
- **Testing**: Vitest 4 + React Testing Library
- **Icons**: Lucide React
- **Styling**: Vanilla CSS with design tokens, glassmorphism, micro-animations
- **Fonts**: Inter + Outfit (Google Fonts)
- **Deployment**: Docker + Google Cloud Run

---

## 📄 License

Built for Smart Stadiums & Tournament Operations (FIFA World Cup 2026).
