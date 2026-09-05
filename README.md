# InclusiveKids Hub

An accessible learning app for kids, split into two independent projects:

```
inclusive-kids-hub/
├── frontend/   React + TypeScript + Tailwind CSS (Vite)
└── backend/    Node.js + Express + PostgreSQL (TypeScript)
```

The frontend no longer talks to Supabase directly — it calls the backend's
REST API (`frontend/src/lib/api.ts`), and the backend owns all database
access via PostgreSQL (`backend/src/models`).

## Quick start

### 1. Database

Create a PostgreSQL database (locally or hosted), e.g.:

```bash
createdb inclusive_kids_hub
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # edit DATABASE_URL / PG* vars to match your database
npm install
npm run db:migrate     # creates tables
npm run db:seed        # adds a few demo stories/quizzes (optional but recommended)
npm run dev            # starts the API on http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # defaults to http://localhost:4000/api
npm install
npm run dev             # starts the app on http://localhost:5173
```

Open http://localhost:5173 — the app will call the backend for profiles,
learning content, and progress tracking.

See `frontend/README.md` and `backend/README.md` for details specific to
each half of the project.
