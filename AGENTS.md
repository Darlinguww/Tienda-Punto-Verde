# Punto Verde — Developer Notes

## Stack
- Vite + React 19 + TypeScript + Express backend
- Tailwind CSS v4 (uses `@import "tailwindcss"` + CSS `@theme` blocks, not JS config)
- Google Gemini AI (`@google/genai`)
- `tsx` for running server-side code

## Commands
```sh
npm run dev      # Start Express + Vite dev server on port 3000
npm run build   # Vite production build → dist/
npm run lint    # tsc --noEmit (type check only, no ESLint)
npm run preview # Preview production build
npm run clean   # rm -rf dist
```

## Architecture
- Entry: `server.ts` runs Express, integrates Vite in dev mode, serves `dist/` in production
- Frontend: `src/app.tsx` + components under `src/components/`
- `@/` alias maps to project root
- Path alias `@/*` maps to `./` (root), not `src/`

## HMR
- Vite HMR is disabled when `DISABLE_HMR=true` to prevent flickering during agent edits
- Do not re-enable unconditionally

## API
- `POST /api/analytics/click` — logs WhatsApp click events

## Env
- Copy `.env.example` → `.env` for local config
- `GEMINI_API_KEY` injected via `process.env.GEMINI_API_KEY` in Vite build
- `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` para Supabase (cliente público, solo lectura)

## Database (Supabase)
- Schema SQL en `supabase/schema.sql`
- Ejecutar en Supabase Dashboard → SQL Editor
- Tablas: `categories`, `products`, `customers`, `orders`, `contacts`, `analytics_events`, `store_settings`
- Cliente: `src/lib/supabase.ts`
- Hooks: `src/hooks/useProducts.ts`, `src/hooks/useAnalytics.ts`
