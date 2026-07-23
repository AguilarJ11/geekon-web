# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ This is NOT the Next.js you know

This project runs **Next.js 16.2.11**, which has breaking changes from what your training data assumes. Before writing Next.js code, check `node_modules/next/dist/docs/` for the relevant guide. Key differences that matter in this repo:

- **`middleware` is renamed to `proxy`.** The file convention is `proxy.ts` with an exported `proxy()` function, not `middleware.ts` / `middleware()`. See `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
- **⚠️ Both `src/middleware.ts` and `src/proxy.ts` currently exist side-by-side** with divergent, inconsistent route-protection logic (`middleware.ts` enforces the admin-role check on `/admin`; `proxy.ts` does not, and its private-route list differs slightly). This looks like an incomplete migration, not an intentional pattern. Before touching auth/route-protection, reconcile these into a single `proxy.ts` per the v16 convention — don't add a third copy or edit only one.
- Route protection at the proxy/middleware layer is not sufficient on its own — per the docs, verify auth/role inside each Server Action/Route Handler too (this codebase already does this via the `requireAdmin()` pattern in admin API routes — follow it for new admin endpoints).
- Turbopack is the default bundler for both `next dev` and `next build` now (no `--turbopack` flag needed).
- `params` / `searchParams` are async everywhere (`await params`) — already followed throughout `src/app`.
- `next lint` was removed; linting goes through the ESLint CLI directly (already reflected in `package.json`).

## Commands

```bash
npm run dev      # start dev server (Turbopack, http://localhost:3000)
npm run build    # prisma generate && next build
npm run start    # prisma db push && next start  — NOTE: pushes schema directly, no migrate deploy
npm run lint     # eslint
```

No test runner is currently configured in this repo.

### Database (Prisma + PostgreSQL)

```bash
npx prisma studio             # inspect/edit local data
npx prisma migrate dev        # create + apply a migration in dev
npx prisma generate           # regenerate the Prisma client after schema changes
```

`DATABASE_URL` (dev) points at a Railway Postgres TCP proxy — see `.env` (gitignored, not committed). `prisma/dev.db` is a stray SQLite leftover and not the active datasource (`schema.prisma` uses `provider = "postgresql"`).

Prisma-specific skills are available under `.claude/skills/` (symlinked from `.agents/skills/`) — e.g. `prisma-cli`, `prisma-client-api`, `prisma-postgres`, `prisma-database-setup` — use these for Prisma-related tasks rather than guessing CLI flags.

## Architecture

Next.js App Router (`src/app`) + Prisma/PostgreSQL + NextAuth (credentials provider, JWT sessions). Spanish-language UI (GeekOn!, a Uruguayan geek-community site).

### Auth

- `src/lib/auth.ts` — NextAuth config: `CredentialsProvider` checks email/bcrypt-hashed password against `User`, JWT session strategy, `role` and `id` are threaded through the `jwt`/`session` callbacks so they're available on `session.user`.
- Route protection happens at two layers — the proxy/middleware file (see warning above) redirects unauthenticated users to `/login`, and individual admin API routes additionally call a local `requireAdmin()` helper (`getServerSession` + role check) before doing anything. New privileged API routes should follow the `requireAdmin()` pattern rather than relying on the proxy alone.
- Registration (`src/app/api/auth/register/route.ts`) hashes passwords with `bcrypt.hash(password, 12)` and manually checks for an existing email before creating a `User`.

### Data model (`prisma/schema.prisma`)

- `User` — `role` is a plain string (`"USER"` / `"ADMIN"`), not an enum.
- `Form` → `FormField` (ordered, typed via `FieldType` enum) → `FormSubmission`. A submission stores freeform answers in a `Json` column (`FormSubmission.data`), keyed by `FormField.id`.
- `@@unique([formId, userId])` on `FormSubmission` enforces **one submission per user per form** — this is relied on directly in `src/app/api/forms/[slug]/submit/route.ts` (checks for an existing row and 409s) rather than a DB-level catch.
- `Badge` / `UserBadge` — join table for awarding badges to users, not yet wired into much UI logic.

### Forms feature (the core custom feature of this app)

- Admin CRUD lives under `src/app/api/admin/forms/**` (`route.ts` for list/create, `[id]/route.ts`, `[id]/fields/**`, `[id]/submissions/route.ts`) and the corresponding admin pages under `src/app/admin/formularios/**`. All require `requireAdmin()`.
- Public-facing form access is under `src/app/api/forms/[slug]/**` and `src/app/formularios/[slug]/page.tsx` — only published forms (`isPublished: true`) are queryable by slug, and submission requires an authenticated session.
- Slugs are auto-generated from the title (`slug()` helper in `admin/forms/route.ts`) with numeric-suffix de-duplication — replicate this helper rather than reinventing slug logic if it needs to move.

### Path aliases

`@/*` maps to `src/*` (see `tsconfig.json`).

## Secrets note

`.mcp.json` (gitignored) currently contains a live-looking GitHub PAT in plaintext for the `github` MCP server. It is not tracked by git, but treat it as sensitive — don't echo its contents into logs, commits, or generated files, and consider rotating it if it's ever been shared outside this machine.
