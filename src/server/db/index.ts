import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

function connect() {
  // Pooled Neon URL (-pooler host) for app traffic.
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  // Lets Vercel Fluid compute close idle clients before a function suspends. No-op elsewhere.
  attachDatabasePool(pool);
  return pool;
}

export function getDb() {
  const pool = globalForDb.pool ?? connect();
  globalForDb.pool = pool;
  return drizzle(pool, { schema });
}
