# Xavier Boudreault — Portfolio

Full-stack software engineering meets editorial art direction. Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS.

## ✨ Features

- **🌐 English / French Translation Widget (`[ EN | FR ]`)**: Instant bilingual toggle across all sections, project details, telemetry, and subpages, with persistent user preference.
- **📺 Interactive 1989 Sony Trinitron CRT TV**:
  - **Animated Channels**:
    - **CH-01**: Terminal & live telemetry stream (latency, fps, Montreal edge node).
    - **CH-02**: Real-time canvas audio oscillogram waveform synthesis.
    - **CH-03**: [rocky-pouliot.vercel.app](https://rocky-pouliot.vercel.app) civil engineering laser-radar scanning Petite-Nation coordinates.
    - **CH-04**: Real-time 60fps rotating 3D vector wireframe polygon on canvas.
  - **Tactile Physical Controls**: Clickable rotary knobs to switch channels & tweak tuning, power switch with authentic CRT shutdown collapse effect, and animated raster scanlines.
- **📄 Complete Pages**:
  - `/` — Homepage with Hero, Animated TV, Projects Switcher, Capabilities Matrix, Experiments Lab, and Contact CTA.
  - `/talk` (and `/contact`) — Dedicated "Let's Talk" page with project inquiry form, 30-minute intro call slot picker, one-click email copy, and direct studio details.
  - `/work` — Curated archive of projects with category filters (Production, Creative WebGL, Design Systems).
  - `/capabilities` — Deep dive into Engineering Architecture, Product Design, and Creative Shaders, plus downloadable CV.
  - `/experiments` — Interactive research lab featuring real-time CRT shader controls, a fluid clamp() type scale calculator, a zero-bundle event bus benchmark, and an editorial essay.

## 🚀 Live Projects Featured

- **Aménagement R.P.** — [rocky-pouliot.vercel.app](https://rocky-pouliot.vercel.app): Heavy civil engineering and industrial excavation web platform in Outaouais / Petite-Nation, QC.
- **The Human Element** — Interactive media platform with custom video streaming and telemetry dispatches.
- **Ledger & Vector** — Real-time liquidity dashboard and treasury engine.
- **Atelier Kinetic UI** — Editorial Swiss typographic component primitives and design tokens.
- **Cartography Zero** — 3D elevation map pairing archival field recordings with GLSL displacement shaders.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Typography**: Newsreader, Instrument Serif, DM Mono, Silkscreen
- **State & i18n**: React 19 `useSyncExternalStore` for bilingual synchronization
- **Deployment**: Vercel

## 💻 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build & lint
npm run lint
npm run build
```
