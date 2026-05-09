import { z } from 'zod';

const Schema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL required'),
  PORT: z.coerce.number().int().positive().default(8788),
});

export type Env = z.infer<typeof Schema>;

export function loadEnv(): Env {
  const parsed = Schema.safeParse({
    DATABASE_URL:
      process.env.DATABASE_URL ??
      'postgres://flowtrack:flowtrack@localhost:5432/flowtrack',
    PORT: process.env.PORT,
  });
  if (!parsed.success) {
    console.error('env validation failed', parsed.error.format());
    process.exit(1);
  }
  return parsed.data;
}
