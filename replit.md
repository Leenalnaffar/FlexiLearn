# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

- **flexilearn** (react-vite, `/`) — adaptive AI learning platform. Onboarding selects Learning Style + Neuro-Profile, then routes to a multi-agent chat. Theme provider toggles a Sensory-Safe (autism) palette and disables motion. ADHD adds focus timer + reward points; Dyslexia switches to a decoding-friendly font; Visual learners get Mermaid diagrams from the Visualizer agent. Chat persists to localStorage (`flexilearn:chat:state:v1`) keyed by current preferences and is rehydrated on mount; resetting prefs (Home button) wipes the persisted chat. Input bar offers Add Files (FilePlus) + Mic (Web Speech API STT). Each assistant bubble has Listen (humanized speechSynthesis voice picker that prefers Premium / Natural / Neural / Studio voices, rate 1.02 / pitch 1.05). Header has a Star "Session Health" button → modal with two 1–5 star rows (Understanding, Effectiveness); ratings are persisted, the latest is sent as `lastFeedback` on subsequent chat requests, and the AI pivots strategy server-side. Visual mode replies render YouTube search chips; auditory mode renders Spotify + Apple Podcasts chips below the bubble.
- **api-server** (`/api`) — Express. `/api/chat` and `/api/session-map` use OpenAI (gpt-5.4) via Replit AI Integrations. Stateless: history is sent with each request. `feedbackAddon()` injects a self-correction directive based on `lastFeedback` average (avg<3 → slow + simplify per-style, avg≥4 → maintain/advance, else add one example). `buildResources()` deterministically generates YouTube/Spotify/Apple Podcasts search URLs server-side from topic (or recent message) and returns them in `ChatResponse.resources`.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
