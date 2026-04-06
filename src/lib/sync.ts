import { prisma } from "@/lib/prisma";
import { fetchRedditPosts } from "@/lib/scrapers/reddit";
import { fetchHNPosts } from "@/lib/scrapers/hackernews";
import { fetchDevToArticles } from "@/lib/scrapers/devto";
import { fetchHashnodeArticles } from "@/lib/scrapers/hashnode";
import { fetchDailyPosts } from "@/lib/scrapers/dailydev";
import { calculateTrendingScore } from "@/lib/scoring";
import { NormalizedArticle, SourceType } from "@/types";

export async function syncTrends() {
  console.log("🚀 Starting PRODUCTION trend sync...");

  // 1. Ensure sources exist in DB
  const sources: Array<{ name: SourceType; type: string; baseUrl: string }> = [
    { name: "reddit", type: "api", baseUrl: "https://reddit.com" },
    { name: "hn", type: "api", baseUrl: "https://news.ycombinator.com" },
    { name: "devto", type: "api", baseUrl: "https://dev.to" },
    { name: "hashnode", type: "api", baseUrl: "https://hashnode.com" },
    { name: "dailydev", type: "api", baseUrl: "https://daily.dev" },
  ];

  const sourceMap: Record<string, number> = {};
  for (const s of sources) {
    const record = await prisma.source.upsert({
      where: { name: s.name },
      update: {},
      create: {
        name: s.name,
        type: s.type,
        baseUrl: s.baseUrl,
      },
    });
    sourceMap[s.name] = record.id;
  }

  // 2. Fetch from all sources in parallel
  console.log("📡 Fetching from all sources...");
  const [reddit, hn, devto, hashnode, dailydev] = await Promise.all([
    fetchRedditPosts(),
    fetchHNPosts(),
    fetchDevToArticles(),
    fetchHashnodeArticles(),
    fetchDailyPosts(),
  ]);

  const allArticles: NormalizedArticle[] = [
    ...reddit,
    ...hn,
    ...devto,
    ...hashnode,
    ...dailydev,
  ];
  console.log(`📦 Fetched ${allArticles.length} articles total.`);

  // 3. Process and upsert articles
  const syncPromises = allArticles.map(async (art) => {
    try {
      const trendingScore = calculateTrendingScore(
        art.rawScore,
        art.commentsCount,
        art.publishedAt,
      );
      const sourceId = sourceMap[art.source];

      if (!sourceId) {
        console.warn(
          `Source ${art.source} not found in map, skipping article ${art.id}`,
        );
        return null;
      }

      return await prisma.article.upsert({
        where: { url: art.url },
        update: {
          score: Math.round(art.score),
          rawScore: art.rawScore,
          commentsCount: art.commentsCount,
          likesCount: art.likesCount,
          trendingScore: trendingScore,
          isTrending: trendingScore > 50,
          tags: art.tags?.join(",") || "",
        },
        create: {
          id: art.id,
          sourceId: sourceId,
          title: art.title,
          url: art.url,
          slug: art.slug,
          authorName: art.authorName,
          authorUrl: art.authorUrl,
          sourceName: art.sourceName,
          description: art.description,
          coverImage: art.coverImage,
          tags: art.tags?.join(",") || "",
          publishedAt: art.publishedAt,
          score: Math.round(art.score),
          rawScore: art.rawScore,
          commentsCount: art.commentsCount,
          likesCount: art.likesCount,
          trendingScore: trendingScore,
          isTrending: trendingScore > 50,
        },
      });
    } catch (err) {
      console.error(
        `❌ Failed to sync article ${art.url}:`,
        err instanceof Error ? err.message : err,
      );
      return null;
    }
  });

  const results = await Promise.all(syncPromises);
  const successCount = results.filter(
    (res: any): res is NonNullable<typeof res> => !!res,
  ).length;

  console.log(`✅ Successfully synced ${successCount} articles.`);

  // 4. Record top trends
  if (successCount > 0) {
    const topArticles = await prisma.article.findMany({
      orderBy: { trendingScore: "desc" },
      take: 20,
    });

    await Promise.all(
      topArticles.map((art: { id: string; trendingScore: number }, idx: number) =>
        prisma.trend.create({
          data: {
            articleId: art.id,
            rank: idx + 1,
            score: art.trendingScore,
          },
        }),
      ),
    );
  }

  return { success: true, count: successCount };
}
