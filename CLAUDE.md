# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev      # Start Express + Vite dev server on port 3000
npm run build    # Vite production build → dist/
npm run lint     # tsc --noEmit (type check only — no ESLint configured)
npm run preview  # Preview production build locally
npm run clean    # Remove dist/
```

There is no test runner configured. Type checking (`npm run lint`) is the main correctness gate.

## Architecture

The project is a single-repository full-stack app: one Express server (`server.ts`) serves both the API and the Vite-built React SPA.

**Server entry (`server.ts`):** Express app on port 3000. In dev, Vite middleware handles the frontend with HMR. In production, it serves `dist/` statically. All API routes are mounted at `/api/`.

**Frontend entry (`src/main.tsx`):** React 19 with React Router. Provider hierarchy (outermost → innermost): `BrowserRouter` → `ProductProvider` → `AuthProvider` → `CartProvider`. All state is context-based — no Redux or Zustand.

**Path alias:** `@/` maps to project root (not `src/`), so `@/api/index.ts` resolves to `/api/index.ts`.

**Routing (`src/app.tsx`):**
- `/` — Home/dashboard
- `/catalogo` — Product catalog
- `/garantia` — Guarantee page
- `/producto/:slug` — Product detail
- `/admin` — Admin panel (client-side guard via `useAuth().user?.isAdmin`)

**API layer (`api/`)** follows Clean Architecture:
- `api/core/entities/` — Domain entities
- `api/core/repositories/` — Repository interfaces
- `api/use-cases/` — Business logic
- `api/infrastructure/http/controllers/` — Express controllers
- `api/infrastructure/http/routes/` — Route definitions
- `api/infrastructure/repositories/` — Concrete implementations

Current API endpoint: `POST /api/analytics/click` (logs WhatsApp click events).

## Styling

Tailwind CSS v4 — configured via CSS `@theme` blocks inside CSS files, **not** via `tailwind.config.js` (no JS config exists). Import pattern: `@import "tailwindcss"` at the top of CSS files.

## Database (Supabase)

- Schema: `supabase/schema.sql` — run in Supabase Dashboard → SQL Editor
- Client: `src/lib/supabase.ts` (uses anonymous key, public read access)
- Key tables: `categories`, `products`, `customers`, `orders`, `contacts`, `analytics_events`, `store_settings`
- Key views: `v_products_full` (active products + category), `v_orders_pending`
- RLS enabled: products/categories are publicly readable; analytics/contacts allow public insert only
- Hooks: `src/hooks/useProducts.ts`, `src/hooks/useAnalytics.ts`

## Authentication

Currently client-side only (`src/context/AuthContext.tsx`) with hardcoded demo credentials:
- Admin: `admin@puntoverde.com` / `admin123`
- Regular users: any email + password

Not integrated with Supabase Auth yet. `isAdmin` is derived from the hardcoded email check.

## Environment Variables

Copy `.env.example` → `.env` for local development.

| Variable | Used by | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Frontend | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Supabase public anon key |
| `GEMINI_API_KEY` | Build + Backend | Google Generative AI key (injected via Vite `define`) |
| `DISABLE_HMR` | Dev server | Set `true` to disable Vite HMR (prevents flickering during automated edits — do not re-enable unconditionally) |

Frontend env vars must be prefixed with `VITE_` to be exposed to the client bundle.

## Deployment

- **Vercel:** `vercel.json` rewrites `/api/(.*)` to `api/index.ts` (serverless function) and `(.*)` to `index.html` (SPA fallback). Build output: `dist/`.
- **Docker:** Multi-stage Dockerfile (Node 22 Alpine). `docker-compose.yml` runs the production image on port 3000.

## Product Data

`src/constants.ts` contains a hardcoded `PRODUCTS` array that serves as fallback data when Supabase is unavailable. The live catalog is fetched via the `v_products_full` view.
