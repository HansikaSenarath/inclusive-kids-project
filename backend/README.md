# InclusiveKids Hub — Backend

Node.js + Express + TypeScript API backed by PostgreSQL.

## Structure

```
src/
├── config/         Environment loading and the PostgreSQL connection pool
├── controllers/    Request handlers (parse input, call models, shape response)
├── db/
│   ├── migrations/ Plain SQL migration files, applied in order
│   ├── seeds/       Optional demo data
│   ├── migrate.ts   Migration runner (npm run db:migrate)
│   └── seed.ts       Seed runner (npm run db:seed)
├── middleware/     Error handling
├── models/         SQL queries (the only layer that talks to PostgreSQL)
├── routes/         Express routers, one per resource
├── schemas/        Zod input validation schemas
├── types/          Shared TypeScript interfaces
├── utils/          Small helpers (HttpError, asyncHandler)
├── app.ts          Express app wiring (middleware + routes)
└── server.ts       Process entrypoint, starts the HTTP server
```

## Setup

```bash
cp .env.example .env   # point it at your PostgreSQL instance
npm install
npm run db:migrate
npm run db:seed         # optional demo content
npm run dev
```

The API starts on `http://localhost:4000` by default. All routes are
mounted under `/api`.

## Deploy to Vercel

Create the Vercel project from this repository and set its **Root Directory**
to `backend`. Vercel will use `api/index.ts` as the serverless function entry
point; do not use `src/server.ts` as the Vercel entrypoint because that file
starts a long-running HTTP listener for local development.

Add these environment variables in the Vercel project settings for the
Production environment:

```dotenv
DATABASE_URL=your-hosted-postgresql-connection-string
CORS_ORIGIN=https://your-frontend-domain.example
NODE_ENV=production
```

After deployment, verify `https://your-backend-domain.example/api/health`.
Set the frontend's `VITE_API_URL` to
`https://your-backend-domain.example/api` and redeploy the frontend.

Run database migrations from a trusted environment against the same hosted
database before using the deployed API:

```bash
npm run db:migrate
npm run db:seed
```

## Scripts

| Script               | Purpose                             |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start the API with hot reload (tsx) |
| `npm run build`      | Compile TypeScript to `dist/`       |
| `npm start`          | Run the compiled build              |
| `npm run typecheck`  | Type-check without emitting files   |
| `npm run db:migrate` | Apply any pending SQL migrations    |
| `npm run db:seed`    | Insert demo content items           |

## API reference

All responses are JSON. Errors follow `{ "message": string }` (validation
errors also include an `errors` field from Zod).

### Health

- `GET /api/health` → `{ status: "ok" }`

### Child profiles

- `GET /api/profiles` — list all profiles
- `POST /api/profiles` — create a profile
  - body: `{ name, age, avatar?, vision_impairment?, hearing_impairment?, speech_impairment?, preferences? }`
- `GET /api/profiles/:id` — get one profile
- `PATCH /api/profiles/:id` — update fields (partial)
- `DELETE /api/profiles/:id` — delete a profile

### Learning content

- `GET /api/content` — list content items; optional query params `type`
  (`story` | `quiz` | `game`), `category`, `age`
- `GET /api/content/:id` — get one content item

### Progress logs

- `GET /api/progress` — list progress logs; optional `child_id` query param
- `POST /api/progress` — record a completion
  - body: `{ child_id, content_id, completed?, score?, stars? }`

### AAC boards

- `GET /api/aac-boards` — list boards; optional `child_id` query param
- `POST /api/aac-boards` — create a board
  - body: `{ child_id?, name?, symbols? }`
- `PATCH /api/aac-boards/:id` — update a board's name/symbols

## Database schema

See `src/db/migrations/001_init.sql` for the full schema: `child_profiles`,
`content_items`, `progress_logs`, and `aac_boards`, with foreign keys from
`progress_logs` and `aac_boards` back to `child_profiles`.
