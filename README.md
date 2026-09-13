# Local Tailor Connect

Multi-user tailoring marketplace built with React, Better Auth, Vercel Functions, Drizzle, and Neon PostgreSQL.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL=http://localhost:3000`.
3. Apply the schema with `npm run db:migrate`.
4. Start the full frontend and API runtime with `npm run dev`.

`npm run dev:ui` starts only Vite and is useful for visual work, but authentication and data APIs require the full Vercel runtime.

## Commands

- `npm test` — unit and database integration tests
- `npm run typecheck` — TypeScript validation
- `npm run build` — production frontend build
- `npm run db:generate` — generate a migration after schema changes
- `npm run db:migrate` — apply committed migrations
- `npm run db:seed` — optional development seed; requires explicit seed passwords

## Security model

The browser never supplies trusted customer, tailor, sender, or role IDs. Server handlers derive identity from the Better Auth HTTP-only session and check ownership on every domain operation. Public discovery returns only verified tailor profiles; a tailor can access only their own workshop and assigned orders.

Do not expose `DATABASE_URL`, `BETTER_AUTH_SECRET`, or `GEMINI_API_KEY` using a `VITE_` prefix. Configure the same server-only variables in Vercel before deployment.

