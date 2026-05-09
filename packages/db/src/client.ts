import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

let _sql: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getSql(url?: string) {
  if (_sql) return _sql;
  const u =
    url ??
    process.env.DATABASE_URL ??
    'postgres://flowtrack:flowtrack@localhost:5432/flowtrack';
  _sql = postgres(u, { max: 10 });
  return _sql;
}

export function getDb(url?: string) {
  if (_db) return _db;
  _db = drizzle(getSql(url), { schema });
  return _db;
}
