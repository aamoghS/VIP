import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  conn: ReturnType<typeof postgres> | undefined;
};

export function getDb() {
  const url = env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  const conn = globalForDb.conn ?? postgres(url, { prepare: false });
  if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;
  return drizzle(conn, { schema });
}
