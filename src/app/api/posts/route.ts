import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import dayjs from "dayjs";

/**
 * PRODUCTION-GRADE PAGINATED ARTICLES API
 * Supports infinite scrolling, multi-source filtering, and dynamic sorting.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Pagination
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");
  
  // Filters
  const search = searchParams.get("search");
  const sourcesParam = searchParams.get("sources"); // e.g. "reddit,hn"
  const timeframe = searchParams.get("timeframe") || "24h"; // 24h, 7d, 30d, all
  const sortParam = searchParams.get("sort") || "trending"; // trending, latest, popular
  
  const where: any = {};

  // Search filter
  if (search) {
    where.title = {
      contains: search,
    };
  }
  
  // Multi-source filter
  if (sourcesParam && sourcesParam !== "all") {
    const sourceList = sourcesParam.split(",");
    where.source = {
      name: { in: sourceList }
    };
  }

  // Timeframe filter
  if (timeframe !== "all") {
    const hours = timeframe === "24h" ? 24 : timeframe === "7d" ? 168 : timeframe === "30d" ? 720 : null;
    if (hours) {
      where.publishedAt = {
        gte: dayjs().subtract(hours, "hour").toDate(),
      };
    }
  }

  // Sorting Logic
  let orderBy: any = { trendingScore: "desc" };
  if (sortParam === "latest") orderBy = { publishedAt: "desc" };
  if (sortParam === "popular") orderBy = { rawScore: "desc" };

  try {
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          source: true,
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.article.count({ where })
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error: any) {
    console.error("Paginated Articles API Error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ 
      error: "Internal failure", 
      details: error?.message || "Unknown error" 
    }, { status: 500 });
  }
}
