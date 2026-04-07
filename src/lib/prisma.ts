import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

async function getPrismaClient(): Promise<PrismaClient> {
  // On Vercel (production) — use PostgreSQL via Supabase
  if (process.env.NODE_ENV === "production" || !process.env.USE_SQLITE) {
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const { Pool } = await import("pg");

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 20000,
    });

    pool.on("error", (err) => {
      console.error("Unexpected error on idle pg client", err);
    });

    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }

  // Local dev — use SQLite (better-sqlite3)
  const { PrismaBetterSqlite3 } = await import("@prisma/adapter-better-sqlite3");
  const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
  return new PrismaClient({ adapter } as any);
}

function createPrismaClient(): PrismaClient {
  // Synchronous shim — actual adapter is set up async-free by using a Proxy
  // We store a Promise and resolve lazily on first query
  let _client: PrismaClient | null = null;

  // For Next.js edge/server, we need a sync-compatible singleton
  // Use the direct approach: create client sync, swap adapter runtime
  if (process.env.NODE_ENV === "production" || !process.env.USE_SQLITE) {
    // Production: PostgreSQL
    const { Pool } = require("pg");
    const { PrismaPg } = require("@prisma/adapter-pg");

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 20000,
    });

    pool.on("error", (err: Error) => {
      console.error("Unexpected error on idle pg client", err);
    });

    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } else {
    // Local dev: SQLite
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
    return new PrismaClient({ adapter } as any);
  }
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
