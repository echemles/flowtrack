# FlowTrack

Logistics command-center prototype. Monorepo:

- `apps/web` — Vite + React + TS SPA shell (port 5174)
- `apps/api` — Hono + Drizzle API on Postgres (port 8788)
- `packages/db` — Drizzle schema + migrations + seed
- `packages/shared` — zod schemas + inferred types

## Postgres

FlowTrack uses **native Postgres 16** on `localhost:5432`. The previous Docker plan was abandoned because the local network blocks Cloudflare R2 (Docker Hub blob CDN), causing `docker pull postgres:16-alpine` to time out. If you need docker isolation later, swap in a `docker-compose.yml` and update `DATABASE_URL`.

The default DSN (used in `.env.example`) is:

```
postgres://flowtrack:flowtrack@localhost:5432/flowtrack
```

## Prereqs

- Node 22, pnpm 10
- `postgresql@16` running locally with database `flowtrack` and user `flowtrack` (password `flowtrack`).

## Quickstart

```sh
pnpm install
cp .env.example .env
pnpm db:up          # pg_isready check (no-op if Postgres already up)
pnpm db:migrate     # apply drizzle migrations
pnpm db:seed        # load demo data
pnpm dev            # web :5174 + api :8788
```

`pnpm db:reset` drops the `flowtrack` database, recreates it, and re-runs migrate + seed.

## Layout

```
apps/{web,api}
packages/{shared,db}
```
