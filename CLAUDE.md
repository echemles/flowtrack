# FlowTrack — agent notes

- pnpm workspaces. Always run pnpm from repo root unless filtering with `--filter`.
- Web is `@flowtrack/web` on port **5174** (strict). API is `@flowtrack/api` on port **8788**.
- Postgres is a native brew `postgresql@16` instance on **localhost:5432** (db `flowtrack`, user `flowtrack`). Docker plan was abandoned — local network blocks Cloudflare R2.
- ESM only. TypeScript target ES2022.
- Money is always `amount_minor` (int) + `currency` (text).
- Frontend imports types from `@flowtrack/shared`; never duplicates schemas.
- All DB access goes through `@flowtrack/db` schema; the API mounts a postgres-js singleton in `apps/api/src/db.ts`.
- Tailwind tokens live in `apps/web/tailwind.config.ts`. Use semantic names (`surface.canvas`, `border.subtle`, `mode.air`) not raw hex.
