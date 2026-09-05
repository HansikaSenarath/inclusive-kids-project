# InclusiveKids Hub — Frontend

React + TypeScript + Tailwind CSS app, built with Vite.

## Setup

```bash
cp .env.example .env   # VITE_API_URL should point to the backend, e.g. http://localhost:4000/api
npm install
npm run dev
```

## Structure

```
src/
├── components/   Shared UI components (NavBar, ...)
├── context/      AbilityContext — active profile, accessibility preferences, view routing
├── hooks/        Custom hooks (speech recognition, ...)
├── lib/
│   └── api.ts    Thin REST client for the backend API (replaces the old Supabase client)
├── screens/      One component per app screen (Onboarding, Home, Learn, Communicate, Progress, Dashboard)
├── types/        Shared TypeScript interfaces, mirrored by the backend's types
├── App.tsx       Top-level view switch
└── main.tsx      Vite/React entrypoint
```

## Talking to the backend

All data access goes through `src/lib/api.ts`, which wraps `fetch` calls to
`VITE_API_URL` (see `../backend` for the API this points to). There is no
direct database access from the frontend anymore.

## Scripts

| Script             | Purpose                          |
|--------------------|-----------------------------------|
| `npm run dev`       | Start the Vite dev server         |
| `npm run build`     | Production build to `dist/`       |
| `npm run preview`   | Preview the production build      |
| `npm run lint`      | Run ESLint                        |
| `npm run typecheck` | Type-check without emitting files |
