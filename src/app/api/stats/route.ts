import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * PRODUCTION STATS API
 * Returns trending tags and source distribution.
 */
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      select: { tags: true, source: { select: { name: true } } },
    });

    const tagCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};

    articles.forEach((art: { tags: string | null; source: { name: string } }) => {
      const tagList = art.tags ? art.tags.split(",") : [];
      tagList.forEach((t: string) => {
        if (t.trim()) {
          tagCounts[t.trim()] = (tagCounts[t.trim()] || 0) + 1;
        }
      });
      const sourceName = art.source.name;
      sourceCounts[sourceName] = (sourceCounts[sourceName] || 0) + 1;
    });

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return NextResponse.json({
      topTags,
      sourceCounts,
    });
  } catch (error: any) {
    console.error(
      "Stats API error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
