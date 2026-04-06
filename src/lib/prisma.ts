import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// In Prisma 7, the adapter handles database initialization via options object.
const adapter = new PrismaBetterSqlite3({
  url: "/Users/softcolon-harsh/Documents/learning/nextjs/trend-dashboard/dev.db",
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
