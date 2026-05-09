import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const url =
  process.env.DATABASE_URL ??
  'postgres://flowtrack:flowtrack@localhost:5432/flowtrack';

const sql = postgres(url, { max: 1 });
const db = drizzle(sql);

const here = dirname(fileURLToPath(import.meta.url));
const migrationsFolder = resolve(here, '..', 'migrations');

await migrate(db, { migrationsFolder });
console.log('migrations applied');
await sql.end();
