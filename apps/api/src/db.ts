import { getDb, getSql, schema } from '@flowtrack/db';
import { loadEnv } from './env';

const env = loadEnv();
export const sql = getSql(env.DATABASE_URL);
export const db = getDb(env.DATABASE_URL);
export { schema };
